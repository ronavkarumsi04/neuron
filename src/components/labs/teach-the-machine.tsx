"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { forward, GRID, hiddenWeights, makeNet, rasterize, sampleShape, shift, trainEpoch, type Net, type Pt, type ShapeKind } from "@/lib/mlp";
import { useProgress } from "@/lib/progress";
import { btn, Done, Panel } from "./ui";

const CANVAS = 240;
const EPOCHS = 60;
const MIN = 4;
const KINDS: ShapeKind[] = ["circle", "triangle", "zigzag"];
const TONES = ["var(--cobalt)", "var(--green)", "var(--plum)"];

interface Klass { name: string; samples: Float32Array[] }

function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#16150f";
}

function Pixels({ data, size = 48, diverging, label }: { data: Float32Array; size?: number; diverging?: boolean; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, GRID, GRID);
    let max = 1e-6;
    if (diverging) for (const v of data) max = Math.max(max, Math.abs(v));
    const ink = cssVar("--ink");
    const pos = cssVar("--cobalt");
    const neg = cssVar("--plum");
    for (let i = 0; i < data.length; i++) {
      const v = diverging ? data[i] / max : data[i];
      if (Math.abs(v) < 0.02) continue;
      ctx.globalAlpha = Math.min(1, Math.abs(v));
      ctx.fillStyle = diverging ? (v > 0 ? pos : neg) : ink;
      ctx.fillRect(i % GRID, Math.floor(i / GRID), 1, 1);
    }
    ctx.globalAlpha = 1;
  }, [data, diverging]);
  return <canvas ref={ref} width={GRID} height={GRID} role="img" aria-label={label} style={{ width: size, height: size, imageRendering: "pixelated" }} className="rounded-[2px] border border-rule bg-paper" />;
}

export function TeachTheMachine() {
  const finish = useProgress((s) => s.completeLab);
  const [classes, setClasses] = useState<Klass[]>([
    { name: "Circle", samples: [] },
    { name: "Triangle", samples: [] },
    { name: "Zigzag", samples: [] },
  ]);
  const [strokes, setStrokes] = useState<Pt[][]>([]);
  const [net, setNet] = useState<{ net: Net; map: number[]; stale: boolean } | null>(null);
  const [curve, setCurve] = useState<{ loss: number; acc: number }[]>([]);
  const [training, setTraining] = useState(false);
  const [tests, setTests] = useState(0);
  const [done, setDone] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const input = rasterize(strokes);
  const prediction = net && input ? forward(net.net, input).p : null;
  const ready = classes.filter((c) => c.samples.length >= MIN * 3).length >= 2;

  const paint = useCallback(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS, CANVAS);
    ctx.lineCap = ctx.lineJoin = "round";
    ctx.lineWidth = 9;
    ctx.strokeStyle = cssVar("--ink");
    for (const s of strokes) {
      if (!s.length) continue;
      ctx.beginPath();
      ctx.moveTo(...s[0]);
      for (const p of s.slice(1)) ctx.lineTo(...p);
      if (s.length === 1) ctx.lineTo(s[0][0] + 0.1, s[0][1]);
      ctx.stroke();
    }
  }, [strokes]);
  useEffect(paint, [paint]);

  const point = (e: React.PointerEvent): Pt => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * CANVAS, ((e.clientY - r.top) / r.height) * CANVAS];
  };

  const countTest = (hasNet: boolean) => {
    if (!hasNet) return;
    setTests((t) => {
      const n = t + 1;
      if (n >= 3 && !done) {
        setDone(true);
        finish("teach-the-machine");
      }
      return n;
    });
  };

  const add = (ci: number, x: Float32Array | null = input) => {
    if (!x) return;
    const copies = [x, shift(x, Math.random() < 0.5 ? 1 : -1, 0), shift(x, 0, Math.random() < 0.5 ? 1 : -1)];
    setClasses((cs) => cs.map((c, i) => (i === ci ? { ...c, samples: [...c.samples, ...copies] } : c)));
    setNet((n) => (n ? { ...n, stale: true } : n));
    setStrokes([]);
  };

  const fillSamples = () => {
    setClasses((cs) =>
      cs.map((c, i) => {
        const extra: Float32Array[] = [];
        for (let k = 0; k < 8; k++) {
          const x = rasterize(sampleShape(KINDS[i]));
          if (x) extra.push(x, shift(x, 1, 0), shift(x, 0, -1));
        }
        return { ...c, samples: [...c.samples, ...extra] };
      }),
    );
    setNet((n) => (n ? { ...n, stale: true } : n));
  };

  const train = () => {
    const map = classes.map((c, i) => (c.samples.length >= MIN * 3 ? i : -1)).filter((i) => i >= 0);
    const xs: Float32Array[] = [];
    const ys: number[] = [];
    map.forEach((ci, k) => classes[ci].samples.forEach((s) => (xs.push(s), ys.push(k))));
    const fresh = makeNet(map.length, Date.now() % 1000);
    setCurve([]);
    setTraining(true);
    let epoch = 0;
    const tick = () => {
      const pts: { loss: number; acc: number }[] = [];
      for (let k = 0; k < 2 && epoch < EPOCHS; k++, epoch++) pts.push(trainEpoch(fresh, xs, ys, 0.04, epoch));
      setCurve((c) => [...c, ...pts]);
      setNet({ net: fresh, map, stale: false });
      if (epoch < EPOCHS) requestAnimationFrame(tick);
      else setTraining(false);
    };
    requestAnimationFrame(tick);
  };

  const randomTest = () => {
    if (!net) return;
    const ci = net.map[Math.floor(Math.random() * net.map.length)];
    const s = sampleShape(KINDS[ci]);
    setStrokes(s);
    countTest(true);
  };

  const last = curve.at(-1);
  const maxLoss = Math.max(1.2, ...curve.map((c) => c.loss));
  const top = prediction ? prediction.indexOf(Math.max(...prediction)) : -1;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
        <Panel title="Drawing pad" label={net ? "Draw to test" : "Draw to collect"}>
          <canvas
            ref={canvas}
            width={CANVAS}
            height={CANVAS}
            aria-label="Drawing pad. Draw a shape with a mouse, finger, or stylus. Keyboard users can use the sample drawing buttons."
            role="img"
            className="aspect-square w-full max-w-[240px] touch-none rounded-sm border border-rule-strong bg-paper [background-image:radial-gradient(var(--rule)_1px,transparent_1px)] [background-size:20px_20px]"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              drawing.current = true;
              setStrokes((s) => [...s, [point(e)]]);
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              const p = point(e);
              setStrokes((s) => [...s.slice(0, -1), [...s[s.length - 1], p]]);
            }}
            onPointerUp={() => {
              if (!drawing.current) return;
              drawing.current = false;
              if (net && !net.stale) countTest(true);
            }}
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {classes.map((c, i) => (
              <button key={i} type="button" disabled={!input} onClick={() => add(i)} className={btn.secondary}>
                <span aria-hidden className="size-2 rounded-full" style={{ background: TONES[i] }} />
                Add as {c.name || `shape ${i + 1}`}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setStrokes([])} disabled={!strokes.length} className={`${btn.quiet} mt-3`}>Clear pad</button>
        </Panel>

        <Panel title="Training data" label={`${classes.reduce((n, c) => n + c.samples.length, 0)} examples`}>
          <ul className="space-y-4">
            {classes.map((c, i) => (
              <li key={i}>
                <div className="flex items-center gap-3">
                  <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: TONES[i] }} />
                  <label className="sr-only" htmlFor={`class-${i}`}>Name of shape {i + 1}</label>
                  <input
                    id={`class-${i}`}
                    value={c.name}
                    maxLength={14}
                    onChange={(e) => setClasses((cs) => cs.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))}
                    className="min-h-10 w-36 rounded-sm border border-rule bg-paper px-2 font-medium text-ink"
                  />
                  <span className={`font-mono text-xs tabular ${c.samples.length >= MIN * 3 ? "text-green" : "text-ink-3"}`}>
                    {Math.round(c.samples.length / 3)} drawn
                  </span>
                </div>
                <div className="mt-2 flex min-h-8 flex-wrap gap-1">
                  {c.samples.filter((_, k) => k % 3 === 0).slice(-10).map((s, k) => (
                    <Pixels key={k} data={s} size={30} label={`${c.name} example`} />
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
            <button type="button" onClick={fillSamples} className={btn.secondary}>Add 8 sample drawings each</button>
            <span className="text-sm text-ink-3">Shapes 1–3 get computer-drawn circles, triangles, and zigzags.</span>
          </div>
        </Panel>
      </div>

      <Panel title="Train" label={last ? `Epoch ${curve.length}/${EPOCHS} · loss ${last.loss.toFixed(3)} · accuracy ${(last.acc * 100).toFixed(0)}%` : "Not trained"}>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_14rem] md:items-center">
          <svg viewBox="0 0 300 90" className="w-full" role="img" aria-label={last ? `Loss curve. Loss fell to ${last.loss.toFixed(2)} after ${curve.length} epochs.` : "Empty loss curve"}>
            <line x1="0" y1="85" x2="300" y2="85" stroke="var(--rule-strong)" />
            <text x="0" y="10" className="fill-ink-3 font-mono text-[8px]">LOSS</text>
            {curve.length > 1 && (
              <polyline
                fill="none"
                stroke="var(--signal)"
                strokeWidth="1.75"
                points={curve.map((c, i) => `${(i / (EPOCHS - 1)) * 300},${85 - (c.loss / maxLoss) * 72}`).join(" ")}
              />
            )}
          </svg>
          <div className="space-y-2">
            <button type="button" onClick={train} disabled={!ready || training} className={`${btn.primary} w-full`}>
              {training ? "Training…" : net ? "Retrain" : "Train network"}
            </button>
            <p className="text-sm text-ink-3" aria-live="polite">
              {!ready ? `Needs ${MIN}+ examples in at least two shapes.` : net?.stale ? "You added data. Retrain to use it." : training ? "Adjusting about 8,300 weights…" : net ? "Trained. Now test it." : "Ready."}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Test" label={net ? `${tests} tested` : "Train first"}>
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto]">
          <div aria-live="polite">
            {!net ? (
              <p className="text-ink-3">After training, draw a new shape on the pad. The network will tell you what it thinks it is.</p>
            ) : !prediction ? (
              <p className="text-ink-2">Draw a new shape on the pad, or let the computer draw one.</p>
            ) : (
              <>
                <p className="font-display text-3xl">
                  {(prediction[top] * 100).toFixed(0)}% sure it&apos;s a {classes[net.map[top]].name.toLowerCase()}
                </p>
                <ul className="mt-4 space-y-2">
                  {net.map.map((ci, k) => (
                    <li key={ci} className="grid grid-cols-[6rem_minmax(0,1fr)_3rem] items-center gap-3 text-sm">
                      <span className="truncate text-ink-2">{classes[ci].name}</span>
                      <span className="h-2 rounded-full bg-paper-sunk">
                        <span className="block h-full rounded-full transition-[width] duration-300" style={{ width: `${prediction[k] * 100}%`, background: k === top ? "var(--signal)" : "var(--ink-3)" }} />
                      </span>
                      <span className="text-right font-mono tabular text-ink">{(prediction[k] * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-ink-3">Try to break it: a tiny shape, a messy one, or something that&apos;s none of these. It has to pick one of the shapes it knows, so it will always guess. That&apos;s a real limit of classifiers.</p>
              </>
            )}
            <button type="button" onClick={randomTest} disabled={!net || training} className={`${btn.secondary} mt-4`}>Test with a computer-drawn shape</button>
          </div>
          {input && (
            <div>
              <p className="label">What the network sees</p>
              <div className="mt-2"><Pixels data={input} size={112} label="Your drawing as a 16 by 16 grid" /></div>
            </div>
          )}
        </div>
        {done && <div className="mt-5"><Done>Lab complete. You collected data, trained a neural network, and tested it. That&apos;s the full machine learning loop.</Done></div>}
      </Panel>

      {net && !training && (
        <Panel title="Inside the hidden layer" label="8 of 32 neurons">
          <p className="text-sm text-ink-2">Each square shows what one hidden neuron responds to. Blue pixels push it to fire, plum pixels hold it back. Nobody programmed these patterns. The network found them during training.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {Array.from({ length: 8 }, (_, j) => (
              <Pixels key={j} data={hiddenWeights(net.net, j)} size={56} diverging label={`Hidden neuron ${j + 1} weight pattern`} />
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
}
