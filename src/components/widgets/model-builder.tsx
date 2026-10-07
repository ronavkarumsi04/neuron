"use client";

import { useState } from "react";
import { Figure } from ".";

interface Cfg { layers: number; d: number; vocab: number; ctx: number }
const PRESETS: { name: string; cfg: Cfg }[] = [
  { name: "GPT-2 small", cfg: { layers: 12, d: 768, vocab: 50257, ctx: 1024 } },
  { name: "GPT-2 XL", cfg: { layers: 48, d: 1600, vocab: 50257, ctx: 1024 } },
  { name: "GPT-3", cfg: { layers: 96, d: 12288, vocab: 50257, ctx: 2048 } },
];
const DS = [256, 512, 768, 1024, 1600, 2048, 4096, 5120, 8192, 12288];

const human = (n: number) => (n >= 1e12 ? `${(n / 1e12).toFixed(2)}T` : n >= 1e9 ? `${(n / 1e9).toFixed(2)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : `${(n / 1e3).toFixed(0)}K`);
const gb = (bytes: number) => (bytes >= 1e12 ? `${(bytes / 1e12).toFixed(1)} TB` : bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${(bytes / 1e6).toFixed(0)} MB`);

export function ModelBuilder() {
  const [cfg, setCfg] = useState<Cfg>(PRESETS[0].cfg);
  const { layers: L, d, vocab: V, ctx } = cfg;
  const attn = L * (4 * d * d + 4 * d);
  const mlp = L * (8 * d * d + 5 * d);
  const norms = L * 4 * d + 2 * d;
  const emb = V * d + ctx * d;
  const total = attn + mlp + norms + emb;
  const parts = [
    { name: "MLP", n: mlp, color: "var(--olive)" },
    { name: "Attention", n: attn, color: "var(--cobalt)" },
    { name: "Embeddings", n: emb, color: "var(--gold)" },
    { name: "Norms", n: norms, color: "var(--ink-3)" },
  ];
  const tokens = total * 20;
  const flops = 6 * total * tokens;
  const set = (k: keyof Cfg, v: number) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <Figure title="Build a transformer, count its weights" label="GPT-style decoder">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.name} type="button" onClick={() => setCfg(p.cfg)} aria-pressed={JSON.stringify(p.cfg) === JSON.stringify(cfg)} className="min-h-9 rounded-sm border border-rule-strong px-3 text-sm hover:bg-paper-sunk aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper">{p.name}</button>
        ))}
      </div>
      <div className="mt-5 grid gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div className="space-y-4 text-sm">
          <label className="block"><span className="flex justify-between text-ink-2"><span>Layers (L)</span><span className="font-mono tabular text-ink">{L}</span></span>
            <input type="range" min={1} max={128} value={L} onChange={(e) => set("layers", +e.target.value)} className="mt-1 w-full accent-[var(--signal)]" /></label>
          <label className="block"><span className="flex justify-between text-ink-2"><span>Hidden size (d)</span><span className="font-mono tabular text-ink">{d}</span></span>
            <input type="range" min={0} max={DS.length - 1} value={Math.max(0, DS.indexOf(d))} onChange={(e) => set("d", DS[+e.target.value])} className="mt-1 w-full accent-[var(--signal)]" /></label>
          <label className="block"><span className="text-ink-2">Vocabulary size</span>
            <select value={V} onChange={(e) => set("vocab", +e.target.value)} className="mt-1 h-10 w-full rounded-sm border border-rule-strong bg-paper px-2 font-mono">
              {[8000, 32000, 50257, 128000, 200000].map((v) => <option key={v} value={v}>{v.toLocaleString("en-US")}</option>)}
            </select></label>
          <label className="block"><span className="text-ink-2">Context length</span>
            <select value={ctx} onChange={(e) => set("ctx", +e.target.value)} className="mt-1 h-10 w-full rounded-sm border border-rule-strong bg-paper px-2 font-mono">
              {[512, 1024, 2048, 4096, 8192].map((v) => <option key={v} value={v}>{v.toLocaleString("en-US")}</option>)}
            </select></label>
          <p className="text-xs leading-relaxed text-ink-3">Includes biases, LayerNorms, learned positions, and a tied LM head, the GPT-2 layout. MLP is 4× wide.</p>
        </div>
        <div>
          <p className="label">Parameters</p>
          <p aria-live="polite" className="font-display text-5xl tabular tracking-tight">{human(total)}</p>
          <p className="font-mono text-xs text-ink-3">{Math.round(total).toLocaleString("en-US")}</p>
          <div className="mt-4 flex h-3 overflow-hidden rounded-[2px]" aria-hidden>
            {parts.map((p) => <span key={p.name} style={{ width: `${(p.n / total) * 100}%`, background: p.color }} />)}
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {parts.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-[1px]" style={{ background: p.color }} />{p.name}</span>
                <span className="font-mono text-xs tabular text-ink-2">{human(p.n)} · {((p.n / total) * 100).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            {[
              ["fp32 weights", gb(total * 4)],
              ["fp16 / bf16", gb(total * 2)],
              ["4-bit", gb(total * 0.5)],
              ["Training memory (≈16 B/param)", gb(total * 16)],
              ["Chinchilla tokens (20×)", human(tokens)],
              ["Training compute (6ND)", `${flops.toExponential(1).replace("e+", " × 10^")} FLOPs`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-sm border border-rule bg-paper px-3 py-2">
                <dt className="text-[0.7rem] text-ink-3">{k}</dt>
                <dd className="font-mono tabular text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink-2">Pick GPT-2 small and check it against the lesson&apos;s 124M. Then drag the hidden size up and watch the MLP and attention slices grow with d² while embeddings shrink to a sliver.</p>
    </Figure>
  );
}
