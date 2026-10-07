"use client";

import { useState } from "react";
import { Figure } from ".";

interface W { w1: number; b1: number; w2: number; b2: number }
const START: W = { w1: 0.5, b1: 0, w2: 1, b2: 0 };
const RATES = [0.01, 0.05, 0.2, 0.5];

function pass(w: W, x: number, y: number) {
  const z = w.w1 * x + w.b1;
  const h = Math.max(0, z);
  const yhat = w.w2 * h + w.b2;
  const loss = (yhat - y) ** 2;
  const dy = 2 * (yhat - y);
  const dz = dy * w.w2 * (z > 0 ? 1 : 0);
  return { z, h, yhat, loss, g: { w1: dz * x, b1: dz, w2: dy * h, b2: dy }, dy, dh: dy * w.w2, dz };
}

const f = (n: number) => (Math.abs(n) < 0.0005 ? "0.000" : n.toFixed(3));

export function Backprop() {
  const [w, setW] = useState<W>(START);
  const [lr, setLr] = useState(0.05);
  const [x, setX] = useState(2);
  const [y, setY] = useState(3);
  const [history, setHistory] = useState<number[]>([pass(START, 2, 3).loss]);
  const r = pass(w, x, y);
  const diverged = !Number.isFinite(r.loss) || r.loss > 1e6;

  const step = () => {
    const next = { w1: w.w1 - lr * r.g.w1, b1: w.b1 - lr * r.g.b1, w2: w.w2 - lr * r.g.w2, b2: w.b2 - lr * r.g.b2 };
    setW(next);
    setHistory((h) => [...h, pass(next, x, y).loss].slice(-40));
  };
  const reset = (nx = x, ny = y) => {
    setW(START);
    setHistory([pass(START, nx, ny).loss]);
  };
  const max = Math.max(...history.filter(Number.isFinite), 0.01);

  const rows: [string, string, string][] = [
    ["w₁", f(w.w1), f(r.g.w1)],
    ["b₁", f(w.b1), f(r.g.b1)],
    ["w₂", f(w.w2), f(r.g.w2)],
    ["b₂", f(w.b2), f(r.g.b2)],
  ];

  return (
    <Figure title="Backprop, one step at a time" label="x → hidden ReLU → ŷ">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
            {[["z = w₁x + b₁", r.z], ["h = relu(z)", r.h], ["ŷ = w₂h + b₂", r.yhat], ["L = (ŷ − y)²", r.loss]].map(([k, v]) => (
              <div key={k as string} className="rounded-sm border border-rule bg-paper px-3 py-2">
                <span className="block text-[0.7rem] text-ink-3">{k}</span>
                <span className="tabular text-ink">{diverged ? "∞" : f(v as number)}</span>
              </div>
            ))}
          </div>
          <table className="w-full border-collapse text-left font-mono text-sm">
            <caption className="label pb-2 text-left">Weights and their gradients</caption>
            <thead><tr className="border-b border-rule-strong text-ink-3"><th className="py-1.5 font-normal">param</th><th className="py-1.5 font-normal">value</th><th className="py-1.5 font-normal">∂L/∂param</th><th className="py-1.5 font-normal">next step</th></tr></thead>
            <tbody>
              {rows.map(([n, v, g]) => (
                <tr key={n} className="border-b border-rule">
                  <th scope="row" className="py-1.5 font-normal text-ink">{n}</th>
                  <td className="py-1.5 tabular">{v}</td>
                  <td className={`py-1.5 tabular ${+g === 0 ? "text-ink-3" : "text-signal-ink"}`}>{g}</td>
                  <td className="py-1.5 tabular text-ink-2">{+g === 0 ? "stays" : +g > 0 ? "↓ decrease" : "↑ increase"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-mono text-xs leading-relaxed text-ink-3">
            chain: ∂L/∂ŷ = {f(r.dy)} → ∂L/∂h = {f(r.dh)} → ∂L/∂z = {f(r.dz)}{r.z <= 0 && " (ReLU is off, so nothing flows back to w₁ and b₁)"}
          </p>
          <div>
            <p className="label">Loss after each step</p>
            <svg viewBox="0 0 200 50" className="mt-2 h-16 w-full" role="img" aria-label={`Loss history over ${history.length} steps, now ${diverged ? "diverged" : f(r.loss)}`}>
              <line x1="0" y1="49" x2="200" y2="49" stroke="var(--rule-strong)" strokeWidth="0.5" />
              <polyline fill="none" stroke="var(--signal)" strokeWidth="1.5" points={history.map((l, i) => `${(i / Math.max(1, history.length - 1)) * 200},${49 - (Math.min(l, max) / max) * 46}`).join(" ")} />
            </svg>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-ink-2">Input x</span>
              <input type="number" step={0.5} value={x} onChange={(e) => { const v = +e.target.value; setX(v); reset(v, y); }} className="mt-1 h-10 w-full rounded-sm border border-rule-strong bg-paper px-2 font-mono" /></label>
            <label className="block"><span className="text-ink-2">Target y</span>
              <input type="number" step={0.5} value={y} onChange={(e) => { const v = +e.target.value; setY(v); reset(x, v); }} className="mt-1 h-10 w-full rounded-sm border border-rule-strong bg-paper px-2 font-mono" /></label>
          </div>
          <fieldset>
            <legend className="text-ink-2">Learning rate</legend>
            <div className="mt-1 grid grid-cols-4 gap-1 rounded-sm border border-rule p-1">
              {RATES.map((n) => (
                <label key={n} className={`flex min-h-9 cursor-pointer items-center justify-center rounded-[2px] font-mono text-xs has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${lr === n ? "bg-ink text-paper" : "hover:bg-paper-sunk"}`}>
                  <input type="radio" name="bp-lr" className="sr-only" checked={lr === n} onChange={() => setLr(n)} />{n}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={step} disabled={diverged} className="min-h-10 rounded-sm bg-ink px-3 font-medium text-paper disabled:opacity-40">Take one step</button>
            <button type="button" onClick={() => reset()} className="min-h-10 rounded-sm border border-rule-strong px-3 hover:bg-paper-sunk">Reset</button>
          </div>
          <p aria-live="polite" className="leading-relaxed text-ink-2">
            {diverged ? "The loss exploded. The learning rate was too big, so each step overshot. Reset and pick a smaller one." : history.length === 1 ? "The first step reproduces the lesson's worked example. Then try 0.5 and watch it overshoot." : `Step ${history.length - 1}: loss ${f(r.loss)}.`}
          </p>
        </div>
      </div>
    </Figure>
  );
}
