"use client";

import { useMemo, useState } from "react";
import { Figure } from ".";

const LOGITS: [string, number][] = [
  [" practice", 3.1], [" review", 2.7], [" sleep", 2.2], [" quiz", 2.0], [" start", 1.6], [" teach", 1.3],
  [" reread", 0.9], [" cram", 0.6], [" pray", -0.4], [" dance", -1.2], [" bananas", -2.6], [" ¿", -3.5],
];

export function Sampling() {
  const [temp, setTemp] = useState(1);
  const [k, setK] = useState(12);
  const [p, setP] = useState(1);
  const [draws, setDraws] = useState<string[]>([]);

  const dist = useMemo(() => {
    const scaled = LOGITS.map(([t, l]) => [t, l / Math.max(temp, 0.01)] as const);
    const m = Math.max(...scaled.map(([, l]) => l));
    const e = scaled.map(([t, l]) => ({ t, raw: Math.exp(l - m) }));
    const s = e.reduce((a, b) => a + b.raw, 0);
    const sorted = e.map((d) => ({ t: d.t, p: d.raw / s })).sort((a, b) => b.p - a.p);
    let cum = 0;
    const kept = sorted.map((d, i) => {
      const inP = cum < p - 1e-9;
      cum += d.p;
      return { ...d, kept: i < k && (i === 0 || inP) };
    });
    const z = kept.filter((d) => d.kept).reduce((a, b) => a + b.p, 0);
    return kept.map((d) => ({ ...d, q: d.kept ? d.p / z : 0 }));
  }, [temp, k, p]);

  const draw = (n: number) => {
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      let r = Math.random();
      const hit = dist.find((d) => (r -= d.q) <= 0) ?? dist[0];
      out.push(hit.t.trim());
    }
    setDraws(out);
  };
  const keptCount = dist.filter((d) => d.kept).length;

  return (
    <Figure title="Pick the next token" label="temperature · top-k · top-p">
      <p className="rounded-sm border border-rule bg-paper px-4 py-3 font-display text-xl">The best way to study for a test is to<span aria-hidden className="ml-1 inline-block h-5 w-px translate-y-0.5 bg-signal" /></p>
      <div className="mt-5 grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]">
        <ul aria-label="Next-token probabilities" className="space-y-1">
          {dist.map((d) => (
            <li key={d.t} className={`grid grid-cols-[6.5rem_minmax(0,1fr)_3rem_3rem] items-center gap-2 text-sm ${d.kept ? "" : "text-ink-3"}`}>
              <span className="font-mono">{d.t.trim()}{!d.kept && <span className="sr-only"> (filtered out)</span>}</span>
              <span className="relative h-2.5 rounded-[1px] bg-paper-sunk">
                <span className="absolute inset-y-0 left-0 rounded-[1px] bg-ink/15" style={{ width: `${d.p * 100}%` }} />
                <span className="absolute inset-y-0 left-0 rounded-[1px] bg-rust transition-[width] duration-200" style={{ width: `${d.q * 100}%` }} />
              </span>
              <span className="text-right font-mono text-xs tabular" title="after temperature">{(d.p * 100).toFixed(1)}%</span>
              <span className="text-right font-mono text-xs tabular" title="after filtering">{d.kept ? `${(d.q * 100).toFixed(1)}%` : "cut"}</span>
            </li>
          ))}
          <li className="pt-1 text-right font-mono text-[0.65rem] text-ink-3">after temp · after filter</li>
        </ul>
        <div className="space-y-4 text-sm">
          <label className="block"><span className="flex justify-between text-ink-2"><span>Temperature</span><span className="font-mono tabular text-ink">{temp.toFixed(2)}</span></span>
            <input type="range" min={0.05} max={2.5} step={0.05} value={temp} onChange={(e) => setTemp(+e.target.value)} className="mt-1 w-full accent-[var(--signal)]" /></label>
          <label className="block"><span className="flex justify-between text-ink-2"><span>Top-k</span><span className="font-mono tabular text-ink">{k}</span></span>
            <input type="range" min={1} max={12} step={1} value={k} onChange={(e) => setK(+e.target.value)} className="mt-1 w-full accent-[var(--signal)]" /></label>
          <label className="block"><span className="flex justify-between text-ink-2"><span>Top-p</span><span className="font-mono tabular text-ink">{p.toFixed(2)}</span></span>
            <input type="range" min={0.1} max={1} step={0.05} value={p} onChange={(e) => setP(+e.target.value)} className="mt-1 w-full accent-[var(--signal)]" /></label>
          <p className="text-ink-2"><span className="font-mono text-ink">{keptCount}</span> of {LOGITS.length} tokens can be picked.</p>
          <button type="button" onClick={() => draw(20)} className="min-h-10 rounded-sm bg-ink px-3 font-medium text-paper">Sample 20 times</button>
          {draws.length > 0 && <p aria-live="polite" className="font-mono text-xs leading-relaxed text-ink-2">{draws.join(" · ")}</p>}
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-2">Crank the temperature to 2.5 and “bananas” starts showing up. Then set top-p to 0.9: the junk gets cut no matter how hot it is. That&apos;s why most chat apps combine both.</p>
    </Figure>
  );
}
