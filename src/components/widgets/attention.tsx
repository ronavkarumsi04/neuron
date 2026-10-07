"use client";

import { useState } from "react";
import { Figure } from ".";

const VARIANTS = {
  big: { word: "big", refers: 1 },
  small: { word: "small", refers: 6 },
} as const;
type Variant = keyof typeof VARIANTS;

const BASE = ["The", "trophy", "didn't", "fit", "in", "the", "suitcase", "because", "it", "was", "too"];

/** Hand-set query·key scores standing in for a trained head that resolves pronouns. */
function scores(tokens: string[], variant: Variant) {
  const n = tokens.length;
  const it = 8;
  const adj = n - 1;
  const ref = VARIANTS[variant].refers;
  return tokens.map((_, i) =>
    tokens.map((_, j) => {
      let s = 0.6 - 0.12 * Math.abs(i - j);
      if (i === j) s += 0.6;
      if ([1, 6].includes(j)) s += 0.5;
      if (i === it && j === ref) s += 2.6;
      if (i === adj && j === ref) s += 1.6;
      if (i === adj && j === it) s += 1.2;
      if (i === 3 && (j === 1 || j === 6)) s += 1;
      return s;
    }),
  );
}

function softmax(row: number[], temp: number) {
  const m = Math.max(...row.filter(Number.isFinite));
  const e = row.map((v) => (Number.isFinite(v) ? Math.exp((v - m) / temp) : 0));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

export function Attention() {
  const [variant, setVariant] = useState<Variant>("big");
  const [causal, setCausal] = useState(true);
  const [sharp, setSharp] = useState(1);
  const tokens = [...BASE, VARIANTS[variant].word];
  const [focus, setFocus] = useState(8);
  const raw = scores(tokens, variant);
  const weights = raw.map((row, i) => softmax(row.map((v, j) => (causal && j > i ? -Infinity : v)), 1 / sharp));
  const row = weights[focus];
  const top = row.map((p, j) => [p, j] as const).sort((a, b) => b[0] - a[0]).slice(0, 3);

  return (
    <Figure title="Where does each token look?" label="one attention head">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Last word</legend>
          <span className="text-ink-2">Last word:</span>
          {(Object.keys(VARIANTS) as Variant[]).map((v) => (
            <label key={v} className={`flex min-h-9 cursor-pointer items-center rounded-sm border px-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${variant === v ? "border-ink bg-ink text-paper" : "border-rule-strong hover:bg-paper-sunk"}`}>
              <input type="radio" name="attn-v" className="sr-only" checked={variant === v} onChange={() => setVariant(v)} />“{VARIANTS[v].word}”
            </label>
          ))}
        </fieldset>
        <label className="flex min-h-9 items-center gap-2"><input type="checkbox" checked={causal} onChange={(e) => setCausal(e.target.checked)} className="size-4 accent-[var(--signal)]" />Causal mask</label>
        <label className="flex items-center gap-2"><span className="text-ink-2">Sharpness</span>
          <input type="range" min={0.3} max={3} step={0.1} value={sharp} onChange={(e) => setSharp(+e.target.value)} className="w-28 accent-[var(--signal)]" /><span className="w-8 font-mono tabular">{sharp.toFixed(1)}</span></label>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="overflow-x-auto" tabIndex={0} aria-label="Attention heatmap. Rows are the token doing the looking; columns are the tokens it looks at.">
          <table className="border-collapse font-mono text-[0.68rem]">
            <thead>
              <tr><th className="sr-only">Query token</th>{tokens.map((t, j) => <th key={j} scope="col" className="h-16 w-7 align-bottom font-normal text-ink-3"><span className="inline-block origin-bottom-left translate-x-3 -rotate-60 whitespace-nowrap">{t}</span></th>)}</tr>
            </thead>
            <tbody>
              {tokens.map((t, i) => (
                <tr key={i}>
                  <th scope="row" className="pr-2 text-right font-normal">
                    <button type="button" onClick={() => setFocus(i)} aria-pressed={focus === i} className={`min-h-7 rounded-[2px] px-1 ${focus === i ? "bg-signal text-white" : "text-ink-2 hover:bg-paper-sunk"}`}>{t}</button>
                  </th>
                  {weights[i].map((p, j) => (
                    <td key={j} className="p-px">
                      <span title={`${t} → ${tokens[j]}: ${(p * 100).toFixed(0)}%`} className={`block size-6 rounded-[2px] ${causal && j > i ? "bg-paper-sunk/60" : ""}`} style={causal && j > i ? undefined : { background: `color-mix(in oklab, var(--cobalt) ${Math.round(Math.sqrt(p) * 100)}%, var(--paper))`, outline: focus === i ? "1px solid var(--signal)" : undefined }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 text-sm">
          <p className="label">“{tokens[focus]}” attends to</p>
          <ul aria-live="polite" className="space-y-1.5">
            {top.map(([p, j]) => (
              <li key={j} className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2">
                <span className="font-mono">{tokens[j]}</span>
                <span className="h-2.5 rounded-[1px] bg-paper-sunk"><span className="block h-full rounded-[1px] bg-cobalt" style={{ width: `${p * 100}%` }} /></span>
                <span className="text-right font-mono text-xs tabular text-ink-3">{(p * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed text-ink-2">Click <strong>it</strong>, then switch the last word between “big” and “small.” A pronoun-tracking head shifts from <em>trophy</em> to <em>suitcase</em>. Turn off the mask and the grey future cells fill in: that&apos;s what an encoder like BERT can see. Sharpness acts like dividing by a smaller √d.</p>
          <p className="text-xs text-ink-3">Scores here are hand-set to mimic a trained head. Real heads learn theirs from data.</p>
        </div>
      </div>
    </Figure>
  );
}
