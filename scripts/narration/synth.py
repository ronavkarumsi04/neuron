"""Pre-records every lesson with Kokoro-82M and writes word-level timings.

  node_modules/.bin/jiti scripts/narration/export.ts      # lesson text -> script.json
  python scripts/narration/synth.py [--only module/slug] [--jobs 4] [--force]

Outputs public/audio/<module>/<slug>.<hash>.{mp3,json} and src/content/narration.json.
Lessons whose text, voice, and lexicon are unchanged are skipped.
"""
import argparse, hashlib, json, os, re, subprocess, sys, tempfile
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts/narration/script.json"
OUT = ROOT / "public/audio"
MANIFEST = ROOT / "src/content/narration.json"
VOICE, SPEED, SR = "af_heart", 1.0, 24000
LEXICON_VERSION = 4
ENV_STEP = 0.25  # seconds per waveform value

# Whole-word respellings (punctuation around the word is kept).
WORDS = {
    "JSON": "Jason", "GELU": "jee-loo", "ReLU": "ray-loo", "SwiGLU": "swig-loo", "RoPE": "rope",
    "BERT": "Bert", "JAX": "jacks", "ZeRO/FSDP": "zero, or F S D P", "COPPA": "coppa", "FERPA": "ferpa",
    "RMSNorm": "R M S norm", "résumés": "resumes", "résumé": "resume", "word2vec": "word-to-vec",
    "Mikolov": "Meekolov", "GB": "gigabytes", "7B": "7 billion", "7B.": "7 billion", "int4": "int 4",
    "int8": "int 8", "fp16": "F P 16", "fp32": "F P 32", "bfloat16": "B float 16", "llama.cpp": "llama dot C P P",
    "Q4_K_M": "Q 4 K M", "out[:2000]": "out, sliced to 2,000 characters,", "max_steps": "max steps",
    "max_steps,": "max steps,", "down_proj": "down proj", "[out_features,": "out features,", "in_features].": "in features.",
    "p_correct": "p correct", "−log(p_correct),": "minus the log of p correct,", "mean((ŷ": "the mean of y hat",
    "y)²).": "y, all squared.", "relu′(z)": "ray-loo prime of z", "f(x).": "f of x.", "silu(gate(x))": "silu of gate of x,",
    "up(x).": "up of x.", "down(silu(gate(x))": "down of, silu of gate of x,", "*": "times", "(3,).": "3.",
    "(0.95²⁰).": "(0.95 to the 20th power).", "Q·K,": "Q dot K,", "−∞": "minus infinity", "T−1": "T minus 1",
    "η∇L.": "eta times grad L.", "∇L.": "grad L.", "Wx": "W x", "4-D": "4 D", "n²": "n squared", "n²,": "n squared,",
    "12d²": "12 d squared", "4096²": "4,096 squared", "C2PA": "C 2 P A", "AI-writing": "AI writing",
    "∂L/∂a": "dee L by dee A", "∂L/∂b": "dee L by dee B", "∂b/∂a.": "dee B by dee A.", "∂L/∂ŷ": "dee L by dee y hat",
    "4d": "4 d", "70B": "70 billion", "280B": "280 billion", "float32's": "float 32's", "GGUF": "G G U F",
    "model-00001-of-00002.safetensors,": "model, part 1 of 2, dot safe-tensors,", "(L2):": "(L 2):", "T5):": "T 5):",
    "KV": "K V", "LoRA": "Laura", "QLoRA": "Q Laura", "UX": "U X", "ML": "M L", "LM": "L M", "AWQ": "A W Q",
}
# Character-level rules for the remaining math and symbols.
CHARS = [
    (r"^&$", "and"), (r"^\+$", "plus"), (r"^=$", "equals"), (r"^×$", "times"), (r"^⊃$", "contains"),
    (r"^→$", "to"), (r"^←$", "becomes"), (r"^≈$", "is about"), (r"^≠$", "is not"), (r"^÷$", "divided by"),
    (r"^−$", "minus"), (r"^·$", ","), (r"(\d)–(\d)", r"\1 to \2"), (r"(\d)×", r"\1 times"), (r"^−(\d)", r"minus \1"),
    (r"√", "root "), (r"∂", "d "), (r"(?<=\w)/(?=d )", " "), (r"ŷ", "y hat"), (r"₁", " 1"), (r"₂", " 2"),
    (r"²", " squared"), (r"^#(\d)", r"number \1"), (r"η", "eta "), (r"∇", "grad "),
]


def spoken(word: str) -> str:
    if word in WORDS:
        return WORDS[word]
    m = re.match(r"^([\"“(\[]*)(.*?)([\"”).,;:!?\]]*)$", word)
    pre, core, post = m.groups()
    if core in WORDS:
        return pre + WORDS[core] + post
    s = word
    for pat, rep in CHARS:
        s = re.sub(pat, rep, s)
    return s.strip()


PAUSE = {"title": 0.7, "hook": 0.6, "h": 0.45, "label": 0.25, "term": 0.15, "def": 0.35, "p": 0.35, "item": 0.3}
PAUSE_BEFORE = {"h": 0.35}


def lesson_hash(segments):
    """`h` covers the text and how it is spoken, so a lexicon edit re-records only the lessons it touches."""
    src = hashlib.sha1(json.dumps(segments, ensure_ascii=False, separators=(",", ":")).encode()).hexdigest()
    said = " ".join(spoken(w) for seg in segments for w in seg["words"])
    h = hashlib.sha1(f"{src}|{said}|{VOICE}|{SPEED}|{LEXICON_VERSION}".encode()).hexdigest()[:10]
    return src, h


_pipe = None


def pipe():
    global _pipe
    if _pipe is None:
        import torch
        torch.set_num_threads(int(os.environ.get("NARRATION_THREADS", "2")))
        from kokoro import KPipeline
        _pipe = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    return _pipe


def synth_segment(words, joins=None):
    """Returns (audio float32, [(start, end) per display word])."""
    import numpy as np
    spans, parts, pos = [], [], 0
    for i, w in enumerate(words):
        s = spoken(w) + (joins or {}).get(i, "")
        spans.append((pos, pos + len(s)))
        parts.append(s)
        pos += len(s) + 1
    text = " ".join(parts)
    audio, times, offset, cursor = [], [[None, None] for _ in words], 0.0, 0
    for r in pipe()(text, voice=VOICE, speed=SPEED, split_pattern=None):
        a = r.audio.numpy()
        for tk in r.tokens or []:
            if tk.start_ts is None or not tk.text.strip():
                continue
            at = text.find(tk.text, cursor)
            if at < 0 or at - cursor > 40:
                continue
            cursor = at + len(tk.text)
            for i, (a0, a1) in enumerate(spans):
                if a0 < cursor and at < a1:
                    st, en = offset + tk.start_ts, offset + tk.end_ts
                    times[i][0] = st if times[i][0] is None else min(times[i][0], st)
                    times[i][1] = en if times[i][1] is None else max(times[i][1], en)
        audio.append(a)
        offset += len(a) / SR
    audio = np.concatenate(audio) if audio else np.zeros(0, dtype="float32")
    # Words the aligner missed inherit their neighbours' boundaries.
    for i, t in enumerate(times):
        if t[0] is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j][1] is not None), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j][0] is not None), offset)
            t[0], t[1] = prev, max(prev, nxt)
    return audio, times


def build(lesson):
    import numpy as np
    import soundfile as sf
    key, segments = lesson["key"], lesson["segments"]
    src, h = lesson_hash(segments)
    chunks, segs, marks, t = [], [], [], 0.0
    silence = lambda s: np.zeros(int(s * SR), dtype="float32")
    # Very short pieces (a glossary term, a note label) sound clipped when voiced alone,
    # so they are spoken in one breath with the segment that follows.
    segments = [x for x in segments if x["words"]]
    groups, i = [], 0
    while i < len(segments):
        g = [segments[i]]
        while g[-1]["kind"] in ("term", "label") and i + 1 < len(segments):
            i += 1
            g.append(segments[i])
        groups.append(g)
        i += 1
    for g in groups:
        before = PAUSE_BEFORE.get(g[0]["kind"], 0.0)
        if before and chunks:
            chunks.append(silence(before)); t += before
        words, joins = [], {}
        for k, seg in enumerate(g):
            if k < len(g) - 1 and not re.search(r"[.:;!?,]$", seg["words"][-1]):
                joins[len(words) + len(seg["words"]) - 1] = ":" if seg["kind"] == "term" else "."
            words += seg["words"]
        audio, times = synth_segment(words, joins)
        start, n = t, 0
        for seg in g:
            ws = times[n:n + len(seg["words"])]
            n += len(seg["words"])
            segs.append([seg["id"], round(start + ws[0][0], 3), round(start + ws[-1][1], 3),
                         [round(start + v, 3) for w in ws for v in w]])
            if seg["kind"] == "h" and seg["id"] != "kh":
                marks.append([round(start, 3), " ".join(seg["words"])])
        segs[-len(g)][1] = round(start, 3)
        segs[-1][2] = round(start + len(audio) / SR, 3)
        chunks.append(audio); t += len(audio) / SR
        p = PAUSE.get(g[-1]["kind"], 0.3)
        chunks.append(silence(p)); t += p
    audio = np.concatenate(chunks)
    peak = float(np.max(np.abs(audio))) or 1.0
    audio = audio * min(0.89 / peak, 4.0)
    env_n = int(len(audio) / SR / ENV_STEP) + 1
    step = int(ENV_STEP * SR)
    env = [float(np.sqrt(np.mean(audio[i * step:(i + 1) * step] ** 2))) if audio[i * step:(i + 1) * step].size else 0.0 for i in range(env_n)]
    top = max(env) or 1.0
    env = [min(99, round(99 * (e / top) ** 0.6)) for e in env]

    dest = OUT / key
    dest.parent.mkdir(parents=True, exist_ok=True)
    for old in dest.parent.glob(f"{dest.name}.*"):
        old.unlink()
    with tempfile.NamedTemporaryFile(suffix=".wav") as wav:
        sf.write(wav.name, audio, SR, subtype="PCM_16")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav.name, "-ac", "1", "-ar", str(SR), "-c:a", "libmp3lame",
                        "-b:a", "64k", "-id3v2_version", "0", f"{dest}.{h}.mp3"], check=True)
    duration = round(t, 3)
    Path(f"{dest}.{h}.json").write_text(json.dumps({"d": duration, "step": ENV_STEP, "env": env, "marks": marks, "s": segs}, separators=(",", ":")))
    return key, {"src": src, "h": h, "d": duration}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", action="append")
    ap.add_argument("--jobs", type=int, default=4)
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()
    lessons = json.loads(SCRIPT.read_text())["lessons"]
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {"voice": VOICE, "lessons": {}}
    manifest["voice"] = VOICE
    todo = []
    for l in lessons:
        if args.only and l["key"] not in args.only:
            continue
        src, h = lesson_hash(l["segments"])
        have = manifest["lessons"].get(l["key"])
        if not args.force and have and have["h"] == h and (OUT / f"{l['key']}.{h}.mp3").exists():
            continue
        todo.append(l)
    print(f"{len(todo)} lesson(s) to record", flush=True)
    with ProcessPoolExecutor(max_workers=max(1, args.jobs)) as ex:
        for key, entry in ex.map(build, todo):
            manifest["lessons"][key] = entry
            print(f"  {key}: {entry['d']:.0f}s", flush=True)
            MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")
    known = {l["key"] for l in lessons}
    manifest["lessons"] = {k: v for k, v in sorted(manifest["lessons"].items()) if k in known}
    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")


if __name__ == "__main__":
    sys.exit(main())
