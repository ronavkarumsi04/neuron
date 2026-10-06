"use client";

import { useMemo, useState } from "react";
import { Figure } from ".";

const CORPUS = `the model reads the prompt and predicts the next word .
the model learns patterns from text .
the student reads the chapter and writes a summary .
the student asks the model a question .
the model answers the question with a guess .
a good prompt gives the model context .
a good student checks the answer .
the answer sounds right but the answer can be wrong .
the teacher reads the summary and gives feedback .
the student writes the essay and the teacher reads the essay .
the model predicts words one at a time .
the model does not know facts it predicts patterns .
a model can sound confident and still be wrong .
the student checks sources before trusting the answer .
the prompt asks for a summary of the chapter .
the teacher asks the student a question .
the model writes a summary of the essay .
a student learns more by writing the answer first .`;

function buildModel() {
  const words = CORPUS.replace(/\n/g, " ").split(/\s+/).filter(Boolean);
  const table = new Map<string, Map<string, number>>();
  for (let i = 0; i < words.length - 1; i++) {
    const row = table.get(words[i]) ?? new Map<string, number>();
    row.set(words[i + 1], (row.get(words[i + 1]) ?? 0) + 1);
    table.set(words[i], row);
  }
  return { table, size: words.length };
}

function distribution(row: Map<string, number> | undefined, temp: number) {
  if (!row) return [];
  const entries = [...row.entries()];
  const logits = entries.map(([, c]) => Math.log(c) / temp);
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return entries.map(([word], i) => ({ word, p: exps[i] / sum })).sort((a, b) => b.p - a.p);
}

export function NextWord() {
  const { table, size } = useMemo(buildModel, []);
  const [text, setText] = useState(["the", "student"]);
  const [temp, setTemp] = useState(1);
  const last = text[text.length - 1];
  const dist = distribution(table.get(last), temp);
  const ended = last === "." || dist.length === 0;

  const sample = () => {
    let r = Math.random();
    for (const d of dist) {
      r -= d.p;
      if (r <= 0) return setText((t) => [...t, d.word]);
    }
    if (dist.length) setText((t) => [...t, dist[dist.length - 1].word]);
  };

  return (
    <Figure title="A tiny language model, trained on 18 sentences" label={`${size} training words`}>
      <p aria-live="polite" className="min-h-14 rounded-sm border border-rule bg-paper px-4 py-3 font-display text-2xl leading-snug">
        {text.join(" ").replace(" .", ".")}
        {!ended && <span aria-hidden className="ml-1 inline-block h-6 w-px translate-y-1 bg-signal" />}
      </p>

      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <p className="label">After “{last}”, the model thinks the next word is…</p>
          {ended ? (
            <p className="mt-3 text-sm text-ink-2">Sentence finished. Start over to try again.</p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {dist.slice(0, 6).map((d) => (
                <li key={d.word}>
                  <button type="button" onClick={() => setText((t) => [...t, d.word])} className="group grid w-full grid-cols-[6rem_minmax(0,1fr)_3rem] items-center gap-3 rounded-sm px-1 py-1 text-left text-sm hover:bg-paper-sunk">
                    <span className="font-mono text-ink">{d.word}</span>
                    <span className="h-2.5 rounded-[1px] bg-paper-sunk"><span className="block h-full rounded-[1px] bg-cobalt transition-[width] duration-200" style={{ width: `${d.p * 100}%` }} /></span>
                    <span className="text-right font-mono text-xs tabular text-ink-3">{(d.p * 100).toFixed(0)}%</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-4 text-sm">
          <label className="block">
            <span className="flex justify-between text-ink-2"><span>Temperature</span><span className="font-mono tabular text-ink">{temp.toFixed(1)}</span></span>
            <input type="range" min={0.2} max={3} step={0.1} value={temp} onChange={(e) => setTemp(+e.target.value)} className="mt-1 w-full accent-[var(--signal)]" />
            <span className="mt-1 block text-xs text-ink-3">Low = safe, predictable. High = surprising, more mistakes.</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={ended} onClick={sample} className="min-h-10 rounded-sm bg-ink px-3 font-medium text-paper disabled:opacity-40">Sample next word</button>
            <button type="button" onClick={() => setText(["the"])} className="min-h-10 rounded-sm border border-rule-strong px-3 hover:bg-paper-sunk">Start over</button>
          </div>
          <p className="leading-relaxed text-ink-2">Click a word to pick it yourself, or let the model roll the dice. It only counts which word followed which. Real LLMs look at thousands of previous words, not just one.</p>
        </div>
      </div>
    </Figure>
  );
}
