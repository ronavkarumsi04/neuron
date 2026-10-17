"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useReducedMotion } from "framer-motion";
import { useJudge } from "@/lib/judge";
import { useSettings } from "@/lib/settings";

/** Timing file written by scripts/narration/synth.py. `s` rows: [segment id, start, end, flat word [start, end] pairs]. */
interface Timing {
  d: number;
  step: number;
  env: number[];
  marks: [number, string][];
  s: [string, number, number, number[]][];
}

const RATES = [0.75, 1, 1.25, 1.5] as const;
const RATE_KEY = "neuron-narration-rate";
const BARS = 72;

const clock = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
const spokenClock = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  const m = Math.floor(t / 60);
  return `${m ? `${m} minute${m === 1 ? "" : "s"} ` : ""}${t % 60} second${t % 60 === 1 ? "" : "s"}`;
};

/** Last index i with arr[i] <= t (arr ascending), or -1. */
function floorIndex(n: number, at: (i: number) => number, t: number) {
  let lo = 0, hi = n - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (at(mid) <= t) { ans = mid; lo = mid + 1; } else hi = mid - 1;
  }
  return ans;
}

const headerOffset = () => (window.matchMedia("(min-width: 1024px)").matches ? 56 : 100);
const typing = (el: EventTarget | null) =>
  el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

type Status = "idle" | "loading" | "playing" | "paused" | "ended" | "error";

export function ReadAloud({ src, duration, title, moduleTitle }: { src: string; duration: number; title: string; moduleTitle: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [timing, setTiming] = useState<Timing | null>(null);
  const [rate, setRate] = useState<number>(1);
  const [section, setSection] = useState(-1);
  const [detached, setDetached] = useState<null | "up" | "down">(null);
  const [lift, setLift] = useState(0);

  const osReduce = useReducedMotion();
  const prefReduce = useSettings((s) => s.reduceMotion);
  const reduce = !!osReduce || prefReduce;
  const judge = useJudge((s) => (s.active && !s.minimized ? "open" : s.active ? "min" : "off"));

  const trigger = useRef<HTMLButtonElement>(null);
  const dock = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const marker = useRef<HTMLDivElement | null>(null);
  const article = useRef<HTMLElement | null>(null);
  const words = useRef(new Map<string, HTMLElement[][]>());
  const segEls = useRef(new Map<string, HTMLElement>());
  const cur = useRef({ seg: -1, word: -1 });
  const follow = useRef(true);
  const autoUntil = useRef(0);
  const reduceRef = useRef(reduce);
  reduceRef.current = reduce;
  const fill = useRef<SVGRectElement>(null);
  const head = useRef<HTMLSpanElement>(null);
  const elapsed = useRef<HTMLSpanElement>(null);
  const range = useRef<HTMLInputElement>(null);

  const total = timing?.d ?? duration;

  useEffect(() => {
    const saved = Number(localStorage.getItem(RATE_KEY));
    if (RATES.includes(saved as (typeof RATES)[number])) setRate(saved);
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = rate;
  }, [rate]);

  const bars = useMemo(() => {
    if (!timing) return [];
    const per = timing.env.length / BARS;
    return Array.from({ length: BARS }, (_, i) => {
      const slice = timing.env.slice(Math.floor(i * per), Math.max(Math.floor(i * per) + 1, Math.floor((i + 1) * per)));
      return Math.max(8, Math.max(...slice));
    });
  }, [timing]);

  /** Index every [data-seg]/[data-w] span on the page so highlighting never re-renders React. */
  const indexPage = useCallback(() => {
    const root = trigger.current?.closest("article") as HTMLElement | null;
    article.current = root;
    words.current.clear();
    segEls.current.clear();
    root?.querySelectorAll<HTMLElement>("[data-seg]").forEach((el) => {
      const id = el.dataset.seg!;
      segEls.current.set(id, el);
      const list: HTMLElement[][] = [];
      el.querySelectorAll<HTMLElement>("[data-w]").forEach((w) => {
        const n = Number(w.dataset.w);
        (list[n] ??= []).push(w);
      });
      words.current.set(id, list);
    });
  }, []);

  const placeMarker = useCallback((smooth: boolean) => {
    const m = marker.current, root = article.current, t = timing;
    const { seg, word } = cur.current;
    if (!m || !root || !t || seg < 0 || word < 0) return;
    const els = words.current.get(t.s[seg][0])?.[word];
    if (!els?.length) return;
    const a = root.getBoundingClientRect();
    const first = els[0].getBoundingClientRect();
    const last = els[els.length - 1].getBoundingClientRect();
    const x = first.left - a.left - 3, y = first.top - a.top, w = (first.top === last.top ? last.right : first.right) - first.left + 6;
    const jump = !smooth || reduceRef.current || Math.abs(Number(m.dataset.y ?? y) - y) > 2;
    m.style.transition = jump ? "none" : "";
    m.style.transform = `translate(${x}px, ${y}px)`;
    m.style.width = `${w}px`;
    m.style.height = `${first.height}px`;
    m.dataset.y = String(y);
    m.dataset.on = "true";
  }, [timing]);

  const keepInView = useCallback((force = false) => {
    const t = timing;
    const { seg, word } = cur.current;
    if (!t || seg < 0 || (!follow.current && !force)) return;
    const el = words.current.get(t.s[seg][0])?.[Math.max(0, word)]?.[0] ?? segEls.current.get(t.s[seg][0]);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = headerOffset();
    const bottom = (dock.current?.getBoundingClientRect().top ?? window.innerHeight) - 24;
    const band = bottom - top;
    if (!force && r.top >= top + band * 0.15 && r.bottom <= top + band * 0.7) return;
    autoUntil.current = performance.now() + (reduceRef.current ? 150 : 1000);
    window.scrollTo({ top: window.scrollY + r.top - (top + band * 0.35), behavior: reduceRef.current ? "auto" : "smooth" });
    follow.current = true;
    setDetached(null);
  }, [timing]);

  /** Moves highlight state to time `now`. Cheap enough to run every frame: only touches changed nodes. */
  const sync = useCallback((now: number, jumped = false) => {
    const t = timing;
    if (!t) return;
    const segIdx = floorIndex(t.s.length, (i) => t.s[i][1], now + 0.02);
    const row = segIdx >= 0 ? t.s[segIdx] : null;
    let wordIdx = -1;
    if (row) {
      const flat = row[3];
      wordIdx = floorIndex(flat.length / 2, (i) => flat[i * 2], now + 0.02);
    }
    const prev = cur.current;
    if (jumped || segIdx !== prev.seg) {
      t.s.forEach(([id], i) => {
        const el = segEls.current.get(id);
        if (!el) return;
        if (i < segIdx) el.dataset.state = "past";
        else if (i === segIdx) el.dataset.state = "now";
        else delete el.dataset.state;
        if (i !== segIdx) words.current.get(id)?.forEach((g) => g?.forEach((w) => delete w.dataset.read));
      });
      prev.word = -1;
    }
    if (row && wordIdx !== prev.word) {
      const list = words.current.get(row[0]) ?? [];
      list.forEach((g, i) => g?.forEach((w) => (i <= wordIdx ? (w.dataset.read = "") : delete w.dataset.read)));
    }
    const changed = segIdx !== prev.seg || wordIdx !== prev.word;
    cur.current = { seg: segIdx, word: wordIdx };
    const m = marker.current;
    const resting = !row || wordIdx < 0 || now > row[2] + 0.12;
    if (m) m.dataset.on = resting ? "false" : "true";
    if (changed && !resting) {
      placeMarker(!jumped);
      keepInView(jumped);
    }
    const sec = floorIndex(t.marks.length, (i) => t.marks[i][0], now + 0.05);
    setSection(sec);
  }, [timing, placeMarker, keepInView]);

  const paintClock = useCallback((now: number) => {
    const p = total ? Math.min(1, now / total) : 0;
    fill.current?.setAttribute("width", String(p * BARS));
    if (head.current) head.current.style.left = `${p * 100}%`;
    if (elapsed.current) elapsed.current.textContent = clock(now);
    const r = range.current;
    if (r && document.activeElement !== r) r.value = String(now);
    r?.setAttribute("aria-valuetext", `${spokenClock(now)} of ${spokenClock(total)}`);
  }, [total]);

  // Frame loop while playing.
  useEffect(() => {
    if (status !== "playing") return;
    let raf = 0;
    const tick = () => {
      const a = audio.current;
      if (a) { sync(a.currentTime); paintClock(a.currentTime); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, sync, paintClock]);

  const seek = useCallback((to: number, play = false) => {
    const a = audio.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(total - 0.05, to));
    follow.current = true;
    sync(a.currentTime, true);
    paintClock(a.currentTime);
    if (play && a.paused) void a.play().catch(() => setStatus("error"));
  }, [total, sync, paintClock]);

  const toggle = useCallback(() => {
    const a = audio.current;
    if (!a) return;
    if (a.paused || a.ended) {
      if (a.ended) seek(0);
      follow.current = true;
      keepInView(true);
      void a.play().catch(() => setStatus("error"));
    } else a.pause();
  }, [seek, keepInView]);

  const start = useCallback(async () => {
    if (open) return toggle();
    setOpen(true);
    setStatus("loading");
    indexPage();
    const a = new Audio(`${src}.mp3`);
    a.preload = "auto";
    a.playbackRate = rate;
    audio.current = a;
    a.addEventListener("play", () => setStatus("playing"));
    a.addEventListener("pause", () => setStatus((s) => (s === "ended" ? s : "paused")));
    a.addEventListener("ended", () => setStatus("ended"));
    a.addEventListener("error", () => setStatus("error"));
    a.addEventListener("seeked", () => paintClock(a.currentTime));
    void a.play().catch(() => setStatus((s) => (s === "loading" ? "paused" : s)));
    try {
      const res = await fetch(`${src}.json`);
      if (!res.ok) throw new Error(String(res.status));
      setTiming(await res.json());
    } catch {
      setStatus("error");
    }
  }, [open, toggle, indexPage, src, rate, paintClock]);

  const close = useCallback(() => {
    audio.current?.pause();
    audio.current?.removeAttribute("src");
    audio.current?.load();
    audio.current = null;
    setOpen(false);
    setStatus("idle");
    setDetached(null);
    cur.current = { seg: -1, word: -1 };
    trigger.current?.focus();
  }, []);

  // Page decoration lives only while the player is open.
  useEffect(() => {
    const root = article.current;
    if (!open || !root) return;
    root.dataset.reading = "";
    const m = document.createElement("div");
    m.className = "narration-marker";
    m.setAttribute("aria-hidden", "true");
    root.prepend(m);
    marker.current = m;
    return () => {
      delete root.dataset.reading;
      root.querySelectorAll<HTMLElement>("[data-state],[data-read]").forEach((el) => {
        delete el.dataset.state;
        delete el.dataset.read;
      });
      m.remove();
      marker.current = null;
    };
  }, [open]);

  // Re-measure when layout changes (text size, font, rotation).
  useEffect(() => {
    if (!open || !article.current) return;
    const ro = new ResizeObserver(() => placeMarker(false));
    ro.observe(article.current);
    return () => ro.disconnect();
  }, [open, placeMarker]);

  // Once timing arrives, paint the current position (audio may already be playing).
  useEffect(() => {
    if (timing && audio.current) {
      sync(audio.current.currentTime, true);
      paintClock(audio.current.currentTime);
    }
  }, [timing, sync, paintClock]);

  // Manual scrolling detaches the camera; scrolling back to the reading line re-attaches it.
  useEffect(() => {
    if (!open) return;
    const where = () => {
      const t = timing, { seg, word } = cur.current;
      if (!t || seg < 0) return null;
      const el = words.current.get(t.s[seg][0])?.[Math.max(0, word)]?.[0];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const dockTop = dock.current?.getBoundingClientRect().top ?? window.innerHeight;
      if (r.bottom < headerOffset()) return "up";
      if (r.top > dockTop - 16) return "down";
      return "in";
    };
    const userScroll = () => {
      if (performance.now() < autoUntil.current) return;
      const w = where();
      if (!w) return;
      if (w === "in") {
        if (!follow.current) { follow.current = true; setDetached(null); }
      } else {
        follow.current = false;
        setDetached(w);
      }
    };
    const intent = () => { autoUntil.current = 0; };
    window.addEventListener("scroll", userScroll, { passive: true });
    window.addEventListener("wheel", intent, { passive: true });
    window.addEventListener("touchmove", intent, { passive: true });
    return () => {
      window.removeEventListener("scroll", userScroll);
      window.removeEventListener("wheel", intent);
      window.removeEventListener("touchmove", intent);
    };
  }, [open, timing]);

  // Tap any narrated word to jump there.
  useEffect(() => {
    const root = article.current, t = timing;
    if (!open || !root || !t) return;
    const index = new Map(t.s.map((row, i) => [row[0], i]));
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a,button,input,label,select,textarea,summary,[role=button]")) return;
      if (window.getSelection()?.toString()) return;
      const segEl = target.closest<HTMLElement>("[data-seg]");
      const i = segEl ? index.get(segEl.dataset.seg!) : undefined;
      if (i === undefined) return;
      const w = Number(target.closest<HTMLElement>("[data-w]")?.dataset.w ?? 0);
      const row = t.s[i];
      seek((row[3][w * 2] ?? row[1]) - 0.04, true);
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [open, timing, seek]);

  // Keyboard: K play/pause, J/L ten seconds, [ / ] previous/next section.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
      const a = audio.current;
      if (!a) return;
      const k = e.key.toLowerCase();
      const marks = timing?.marks ?? [];
      const starts = [0, ...marks.map((mk) => mk[0])];
      if (k === "k") toggle();
      else if (k === "j") seek(a.currentTime - 10);
      else if (k === "l") seek(a.currentTime + 10);
      else if (e.key === "]") seek(starts.find((s) => s > a.currentTime + 0.5) ?? a.currentTime);
      else if (e.key === "[") seek([...starts].reverse().find((s) => s < a.currentTime - 2) ?? 0);
      else return;
      e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, timing, toggle, seek]);

  // Lock-screen / headset controls.
  useEffect(() => {
    if (!open || !("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    // iOS Now Playing / lock-screen artwork needs a large raster source.
    // The icon stays vector-native everywhere else; this 1024px PNG was
    // rasterized from the SVG at full output resolution, not upscaled.
    ms.metadata = new MediaMetadata({
      title,
      artist: "Neuron",
      album: moduleTitle,
      artwork: [{ src: "/neuron-media-artwork-1024.png", sizes: "1024x1024", type: "image/png" }],
    });
    const set = (a: MediaSessionAction, h: MediaSessionActionHandler | null) => { try { ms.setActionHandler(a, h); } catch {} };
    set("play", () => toggle());
    set("pause", () => toggle());
    set("seekbackward", () => seek((audio.current?.currentTime ?? 0) - 10));
    set("seekforward", () => seek((audio.current?.currentTime ?? 0) + 10));
    set("seekto", (d) => d.seekTime !== undefined && seek(d.seekTime));
    return () => {
      ms.metadata = null;
      (["play", "pause", "seekbackward", "seekforward", "seekto"] as const).forEach((a) => set(a, null));
    };
  }, [open, title, moduleTitle, toggle, seek]);

  // Sit above the Judge tour card where the two would overlap.
  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const tour = document.querySelector<HTMLElement>('[aria-label="Judge tour"], [data-judge-chip]');
      const d = dock.current;
      if (!tour || !d) return setLift(0);
      const a = tour.getBoundingClientRect(), b = d.getBoundingClientRect();
      setLift(a.right > b.left && a.left < b.right ? window.innerHeight - a.top + 8 : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    const id = window.setInterval(measure, 800);
    return () => { window.removeEventListener("resize", measure); window.clearInterval(id); };
  }, [open, judge]);

  useEffect(() => () => { audio.current?.pause(); }, []);

  const playing = status === "playing";
  const busy = status === "loading" && !timing;
  const marks = timing?.marks ?? [];
  const sectionName = section >= 0 ? marks[section]?.[1] : title;

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={start}
        className="group inline-flex min-h-9 items-center gap-2.5 rounded-full border border-rule-strong bg-paper-raised py-1 pl-1.5 pr-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:border-ink print:hidden"
      >
        <span className="grid size-6 place-items-center rounded-full bg-ink text-paper">
          {open && playing ? <PauseGlyph /> : <PlayGlyph />}
        </span>
        <span>{open ? (playing ? "Pause" : status === "ended" ? "Replay" : "Resume") : "Listen"}</span>
        <span className="text-ink-3" aria-hidden>{clock(total)}</span>
        <Equalizer live={open && playing && !reduce} />
        <span className="sr-only">{open ? "" : `, ${spokenClock(total)}. Words highlight as they are read.`}</span>
      </button>

      {open &&
        createPortal(
          <section
            ref={dock}
            aria-label="Read aloud player"
            style={{ bottom: `calc(${lift}px + max(0.75rem, env(safe-area-inset-bottom)))` }}
            className="narration-dock fixed inset-x-3 z-30 mx-auto max-w-[40rem] rounded-md border border-ink bg-paper-raised text-ink shadow-[0_18px_44px_-22px_rgb(0_0_0/0.5)] print:hidden"
          >
            {detached && (
              <button
                type="button"
                onClick={() => keepInView(true)}
                className="absolute -top-12 left-1/2 inline-flex min-h-10 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-ink bg-ink px-4 font-mono text-xs uppercase tracking-wider text-paper shadow-[0_10px_24px_-12px_rgb(0_0_0/0.5)]"
              >
                <span aria-hidden>{detached === "up" ? "↑" : "↓"}</span> Back to reading
              </button>
            )}
            <header className="flex items-center gap-3 border-b border-rule px-3.5 py-2 [@media(max-height:30rem)]:hidden">
              <span className={`size-2 shrink-0 rounded-full ${playing ? "bg-signal pulse" : "bg-ink-3"}`} aria-hidden />
              <p className="label line-clamp-1 min-w-0 flex-1 break-all !text-ink" aria-live="polite">
                {status === "error" ? "Audio didn’t load. Check your connection." : status === "ended" ? "Finished" : <>§ <span className="normal-case tracking-normal">{sectionName}</span></>}
              </p>
              <span className="label hidden shrink-0 sm:inline">Read aloud</span>
              <button type="button" onClick={close} aria-label="Close read aloud" className="-mr-1.5 grid size-8 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink">
                <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </header>

            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3.5 gap-y-1.5 px-3.5 pb-3 pt-3 [@media(max-height:30rem)]:py-2">
              <button
                type="button"
                onClick={toggle}
                disabled={busy && !audio.current}
                aria-label={playing ? "Pause" : status === "ended" ? "Replay" : "Play"}
                title={`${playing ? "Pause" : "Play"} (K)`}
                className="row-span-2 grid size-12 [@media(max-height:30rem)]:size-10 place-items-center rounded-full bg-ink text-paper transition-transform active:scale-95"
              >
                {busy ? <span className="size-4 animate-spin rounded-full border-2 border-paper/40 border-t-paper" aria-hidden /> : playing ? <PauseGlyph big /> : <PlayGlyph big />}
              </button>

              <div className="relative h-9 rounded-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal">
                <svg viewBox={`0 0 ${BARS} 100`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
                  <defs>
                    <clipPath id="narration-played"><rect ref={fill} x="0" y="0" width="0" height="100" /></clipPath>
                  </defs>
                  {bars.map((v, i) => <rect key={i} x={i + 0.18} y={50 - v / 2} width="0.64" height={v} rx="0.3" className="fill-rule-strong" />)}
                  <g clipPath="url(#narration-played)">
                    {bars.map((v, i) => <rect key={i} x={i + 0.18} y={50 - v / 2} width="0.64" height={v} rx="0.3" className="fill-ink" />)}
                  </g>
                </svg>
                {marks.map(([at, name]) => (
                  <span key={at} title={name} aria-hidden className="absolute -top-1 h-1.5 w-px bg-signal" style={{ left: `${(at / total) * 100}%` }} />
                ))}
                <span ref={head} aria-hidden className="absolute inset-y-0 w-0.5 -translate-x-1/2 rounded-full bg-signal" style={{ left: 0 }} />
                <input
                  ref={range}
                  type="range"
                  min={0}
                  max={total}
                  step={0.1}
                  defaultValue={0}
                  aria-label="Seek"
                  onChange={(e) => seek(Number(e.target.value))}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                <Ctl label="Back 10 seconds" hint="J" onClick={() => seek((audio.current?.currentTime ?? 0) - 10)}><SkipGlyph back /></Ctl>
                <Ctl label="Forward 10 seconds" hint="L" onClick={() => seek((audio.current?.currentTime ?? 0) + 10)}><SkipGlyph /></Ctl>
                <button
                  type="button"
                  onClick={() => {
                    const next = RATES[(RATES.indexOf(rate as (typeof RATES)[number]) + 1) % RATES.length];
                    setRate(next);
                    localStorage.setItem(RATE_KEY, String(next));
                  }}
                  aria-label={`Playback speed ${rate} times. Change speed`}
                  className="min-h-8 min-w-12 rounded-sm px-2 font-mono text-xs tabular-nums text-ink-2 hover:bg-paper-sunk hover:text-ink"
                >
                  {rate}×
                </button>
                <p className="ml-auto font-mono text-xs tabular-nums text-ink-3">
                  <span ref={elapsed} className="text-ink">0:00</span> / {clock(total)}
                </p>
                <button type="button" onClick={close} aria-label="Close read aloud" className={`hidden size-8 shrink-0 place-items-center rounded-sm text-ink-3 hover:bg-paper-sunk hover:text-ink [@media(max-height:30rem)]:grid`}>
                  <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden><path d="M3.5 3.5l9 9m0-9l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
            {status === "ended" && (
              <div className="flex items-center justify-between gap-3 border-t border-rule px-3.5 py-2.5">
                <p className="text-sm text-ink-2">That’s the lesson. Ready to check what stuck?</p>
                <button
                  type="button"
                  onClick={() => {
                    const q = document.querySelector<HTMLElement>('section[aria-labelledby$="-quiz"]');
                    if (!q) return;
                    const top = document.querySelector("body > header, header.sticky")?.getBoundingClientRect().bottom ?? 0;
                    window.scrollTo({ top: q.getBoundingClientRect().top + window.scrollY - Math.max(top, 0) - 20, behavior: reduce ? "auto" : "smooth" });
                    const h = q.querySelector<HTMLElement>("h2");
                    if (h && !h.hasAttribute("tabindex")) h.tabIndex = -1;
                    h?.focus({ preventScroll: true });
                  }}
                  className="shrink-0 font-mono text-xs uppercase tracking-wider text-signal-ink hover:underline"
                >
                  Checkpoint ↓
                </button>
              </div>
            )}
          </section>,
          document.body,
        )}
    </>
  );
}

function Ctl({ label, hint, onClick, children }: { label: string; hint: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={`${label} (${hint})`} className="grid size-8 place-items-center rounded-sm text-ink-2 hover:bg-paper-sunk hover:text-ink">
      {children}
    </button>
  );
}

function PlayGlyph({ big }: { big?: boolean }) {
  return <svg viewBox="0 0 16 16" className={big ? "ml-0.5 size-4" : "ml-px size-2.5"} aria-hidden><path d="M4 2.5v11l9.5-5.5z" fill="currentColor" /></svg>;
}
function PauseGlyph({ big }: { big?: boolean }) {
  return <svg viewBox="0 0 16 16" className={big ? "size-4" : "size-2.5"} aria-hidden><path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" fill="currentColor" /></svg>;
}
function SkipGlyph({ back }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="size-[1.15rem]" aria-hidden style={back ? undefined : { transform: "scaleX(-1)" }}>
      <path d="M8 4.5H5.5V2M5.7 4.6A7 7 0 1 1 3 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="10.6" y="13.4" textAnchor="middle" fontSize="6.4" fontFamily="var(--font-mono)" fill="currentColor" style={back ? undefined : { transform: "scaleX(-1)", transformOrigin: "10.6px 0" }}>10</text>
    </svg>
  );
}
function Equalizer({ live }: { live: boolean }) {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {[0.55, 1, 0.7, 0.85].map((h, i) => (
        <span key={i} className={`w-[2px] rounded-full bg-signal ${live ? "narration-eq" : ""}`} style={{ height: `${h * 100}%`, animationDelay: `${i * -0.23}s` }} />
      ))}
    </span>
  );
}
