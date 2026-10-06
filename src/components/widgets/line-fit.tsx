"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Figure } from ".";

const DATA: [number, number][] = [
  [0.5, 38], [1, 47], [1.5, 41], [2, 55], [2.5, 52], [3, 61], [3.5, 58], [4, 66],
  [4.5, 63], [5, 72], [5.5, 70], [6, 77], [6.5, 74], [7, 83], [8, 85], [9, 93],
];
const W = 320;
const H = 220;
const PAD = 30;
const sx = (x: number) => PAD + (x / 10) * (W - PAD - 10);
const sy = (y: number) => H - PAD - (y / 100) * (H - PAD - 10);

const mse = (w: number, b: number) => DATA.reduce((s, [x, y]) => s + (y - (w * x + b)) ** 2, 0) / DATA.length;

function step(w: number, b: number) {
  const wn = 3 * w;
  const bn = b + 5 * w;
  let gw = 0;
  let gb = 0;
  for (const [x, y] of DATA) {
    const xn = (x - 5) / 3;
    const err = wn * xn + bn - y;
    gw += (2 * err * xn) / DATA.length;
    gb += (2 * err) / DATA.length;
  }
  const nw = wn - 0.15 * gw;
  const nb = bn - 0.15 * gb;
  return { w: nw / 3, b: nb - (5 * nw) / 3 };
}

export function LineFit() {
  const [{ w, b }, setParams] = useState({ w: -2, b: 70 });
  const setW = (v: number) => setParams((p) => ({ ...p, w: v }));
  const setB = (v: number) => setParams((p) => ({ ...p, b: v }));
  const [epochs, setEpochs] = useState(0);
  const [running, setRunning] = useState(false);
  const raf = useRef<number | null>(null);
  const clipId = useId();
  const loss = mse(w, b);

  useEffect(() => {
    if (!running) return;
    let last = 0;
    const tick = (t: number) => {
      if (t - last > 60) {
        last = t;
        setParams((p) => step(p.w, p.b));
        setEpochs((e) => e + 1);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running]);

  useEffect(() => {
    if (running && (loss < 12.5 || epochs > 120)) setRunning(false);
  }, [loss, epochs, running]);

  const trainOnce = () => {
    setParams(step(w, b));
    setEpochs((e) => e + 1);
  };

  const predict = Math.round(w * 7.5 + b);

  return (
    <Figure title="Fit a line: hours studied → test score" label={`Epoch ${epochs} · error ${loss.toFixed(1)}`}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`Scatter plot of 16 students. Current line: score equals ${w.toFixed(1)} times hours plus ${b.toFixed(0)}. Average squared error ${loss.toFixed(0)}.`}>
          {[0, 25, 50, 75, 100].map((y) => (
            <g key={y}>
              <line x1={PAD} x2={W - 10} y1={sy(y)} y2={sy(y)} stroke="var(--rule)" />
              <text x={PAD - 6} y={sy(y) + 3} textAnchor="end" className="fill-ink-3 font-mono text-[9px]">{y}</text>
            </g>
          ))}
          {[0, 2, 4, 6, 8, 10].map((x) => (
            <text key={x} x={sx(x)} y={H - PAD + 14} textAnchor="middle" className="fill-ink-3 font-mono text-[9px]">{x}h</text>
          ))}
          <defs>
            <clipPath id={clipId}><rect x={PAD} y={10} width={W - PAD - 10} height={H - PAD - 10} /></clipPath>
          </defs>
          {DATA.map(([x, y]) => (
            <line key={`e${x}`} x1={sx(x)} x2={sx(x)} y1={sy(y)} y2={sy(Math.max(0, Math.min(100, w * x + b)))} stroke="var(--signal)" strokeOpacity="0.35" />
          ))}
          <line x1={sx(0)} y1={sy(b)} x2={sx(10)} y2={sy(w * 10 + b)} stroke="var(--cobalt)" strokeWidth="2" clipPath={`url(#${clipId})`} />
          {DATA.map(([x, y]) => (
            <circle key={x} cx={sx(x)} cy={sy(y)} r="3.5" fill="var(--paper-raised)" stroke="var(--ink)" strokeWidth="1.5" />
          ))}
        </svg>

        <div className="space-y-4 text-sm">
          <label className="block">
            <span className="flex justify-between text-ink-2"><span>Slope (weight)</span><span className="font-mono tabular text-ink">{w.toFixed(1)}</span></span>
            <input type="range" min={-5} max={15} step={0.1} value={w} onChange={(e) => setW(+e.target.value)} className="mt-1 w-full accent-[var(--cobalt)]" />
          </label>
          <label className="block">
            <span className="flex justify-between text-ink-2"><span>Starting point (bias)</span><span className="font-mono tabular text-ink">{b.toFixed(0)}</span></span>
            <input type="range" min={0} max={100} step={1} value={b} onChange={(e) => setB(+e.target.value)} className="mt-1 w-full accent-[var(--cobalt)]" />
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={trainOnce} className="min-h-10 rounded-sm border border-rule-strong px-3 hover:bg-paper-sunk">Train 1 step</button>
            <button type="button" onClick={() => setRunning((r) => !r)} className="min-h-10 rounded-sm bg-ink px-3 font-medium text-paper">{running ? "Pause" : "Auto-train"}</button>
          </div>
          <p className="leading-relaxed text-ink-2">
            Orange lines are the model&apos;s mistakes. Training nudges both numbers to shrink them. For 7.5 hours it now predicts{" "}
            <strong className="font-mono text-ink tabular">{predict}</strong>.
          </p>
          <button type="button" onClick={() => { setRunning(false); setParams({ w: -2, b: 70 }); setEpochs(0); }} className="text-ink-3 underline underline-offset-4 hover:text-ink">Scramble</button>
        </div>
      </div>
    </Figure>
  );
}
