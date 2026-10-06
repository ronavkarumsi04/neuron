"use client";

import { useState } from "react";
import { Figure } from ".";

const INPUTS = ["Homework done", "Friends going", "It's raining"];
const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));
const target = (x: number[]) => x[0] === 1 && x[1] === 1;
const COMBOS = Array.from({ length: 8 }, (_, i) => [(i >> 2) & 1, (i >> 1) & 1, i & 1]);

export function Perceptron() {
  const [x, setX] = useState([1, 0, 0]);
  const [w, setWeights] = useState([0.5, 0.5, -0.5]);
  const [bias, setBias] = useState(0);
  const out = (inp: number[]) => sigmoid(inp.reduce((s, v, i) => s + v * w[i], bias));
  const y = out(x);
  const matches = COMBOS.filter((c) => out(c) > 0.5 === target(c)).length;

  return (
    <Figure title="One artificial neuron: go to the game tonight?" label={`Challenge ${matches}/8`}>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div>
          <svg viewBox="0 0 300 180" className="w-full" role="img" aria-label={`Neuron output ${(y * 100).toFixed(0)} percent: ${y > 0.5 ? "go" : "stay home"}`}>
            {INPUTS.map((_, i) => {
              const cy = 35 + i * 55;
              return (
                <g key={i}>
                  <line x1="60" y1={cy} x2="210" y2="90" stroke={w[i] >= 0 ? "var(--cobalt)" : "var(--signal)"} strokeWidth={0.75 + Math.abs(w[i]) * 2.2} strokeOpacity={x[i] ? 1 : 0.25} />
                  <circle cx="45" cy={cy} r="15" fill={x[i] ? "var(--ink)" : "var(--paper-raised)"} stroke="var(--ink)" strokeWidth="1.5" />
                  <text x="45" y={cy + 4} textAnchor="middle" className={`font-mono text-[11px] ${x[i] ? "fill-paper" : "fill-ink"}`}>{x[i]}</text>
                  <text x="128" y={cy + (90 - cy) / 2 - 6} textAnchor="middle" className="fill-ink-3 font-mono text-[9px]">×{w[i].toFixed(1)}</text>
                </g>
              );
            })}
            <circle cx="225" cy="90" r="26" fill={y > 0.5 ? "var(--signal)" : "var(--paper-raised)"} stroke="var(--ink)" strokeWidth="1.5" />
            <text x="225" y="94" textAnchor="middle" className={`font-mono text-[11px] ${y > 0.5 ? "fill-paper" : "fill-ink"}`}>{(y * 100).toFixed(0)}%</text>
            <text x="225" y="135" textAnchor="middle" className="fill-ink font-mono text-[10px] uppercase">{y > 0.5 ? "Go" : "Stay home"}</text>
          </svg>
          <div className="mt-2 flex flex-wrap gap-2">
            {INPUTS.map((label, i) => (
              <button key={label} type="button" aria-pressed={x[i] === 1} onClick={() => setX((p) => p.map((v, j) => (j === i ? 1 - v : v)))}
                className={`min-h-10 rounded-sm border px-3 text-sm ${x[i] ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink-2 hover:bg-paper-sunk"}`}>
                {label}: {x[i] ? "yes" : "no"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3 text-sm">
          {INPUTS.map((label, i) => (
            <label key={label} className="block">
              <span className="flex justify-between text-ink-2"><span>Weight: {label.toLowerCase()}</span><span className="font-mono tabular text-ink">{w[i].toFixed(1)}</span></span>
              <input type="range" min={-4} max={4} step={0.1} value={w[i]} onChange={(e) => setWeights((p) => p.map((v, j) => (j === i ? +e.target.value : v)))} className="mt-1 w-full accent-[var(--cobalt)]" />
            </label>
          ))}
          <label className="block">
            <span className="flex justify-between text-ink-2"><span>Bias</span><span className="font-mono tabular text-ink">{bias.toFixed(1)}</span></span>
            <input type="range" min={-6} max={4} step={0.1} value={bias} onChange={(e) => setBias(+e.target.value)} className="mt-1 w-full accent-[var(--cobalt)]" />
          </label>
        </div>
      </div>
      <div className="mt-5 border-t border-rule pt-4">
        <p className="text-sm text-ink-2">
          <strong className="text-ink">Challenge:</strong> set the weights and bias so the neuron says <em>Go</em> only when homework is done <em>and</em> friends are going, rain or not. This is exactly what training does, except a computer tunes millions of these numbers for you.
        </p>
        <table className="mt-3 w-full text-left font-mono text-xs">
          <caption className="sr-only">All eight input combinations and whether the neuron matches the goal</caption>
          <thead className="text-ink-3"><tr><th className="py-1 font-normal">HW</th><th className="font-normal">Friends</th><th className="font-normal">Rain</th><th className="font-normal">Goal</th><th className="font-normal">Neuron</th></tr></thead>
          <tbody>
            {COMBOS.map((c) => {
              const ok = out(c) > 0.5 === target(c);
              return (
                <tr key={c.join("")} className="border-t border-rule">
                  <td className="py-1">{c[0]}</td><td>{c[1]}</td><td>{c[2]}</td>
                  <td>{target(c) ? "Go" : "Stay"}</td>
                  <td className={ok ? "text-green" : "text-signal-ink"}>{out(c) > 0.5 ? "Go" : "Stay"} {ok ? "✓" : "✗"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {matches === 8 && <p className="mt-3 font-medium text-green" aria-live="polite">All 8 match. You just trained a neuron by hand.</p>}
      </div>
    </Figure>
  );
}
