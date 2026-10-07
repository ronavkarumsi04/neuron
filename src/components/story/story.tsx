"use client";

import Link from "next/link";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/lib/settings";
import { AgentScene, AttentionScene, CheckScene, clamp, MapScene, NetworkScene, NeuronScene, WeightsScene } from "./scenes";

interface Chapter {
  fig: string;
  level: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  Scene: (p: { t: number }) => React.ReactNode;
}

const CHAPTERS: Chapter[] = [
  {
    fig: "A single neuron",
    level: "Beginner · Module 01",
    title: "It starts with one neuron.",
    body: "Multiply each input by a weight, add them up, and decide whether to fire. Every AI you’ve used is built out of this one move, repeated billions of times.",
    href: "/modules/foundations/neural-networks",
    cta: "Inside a neural network",
    Scene: NeuronScene,
  },
  {
    fig: "Checking the machine",
    level: "Beginner · Modules 02–03",
    title: "Learn to use it, and to doubt it.",
    body: "AI sounds confident when it’s wrong. You’ll fact-check answers claim by claim, write prompts that work, and cite AI honestly in MLA and APA.",
    href: "/labs/spot-the-hallucination",
    cta: "Spot the Hallucination lab",
    Scene: CheckScene,
  },
  {
    fig: "A network learns",
    level: "Intermediate · Module 05",
    title: "Wire thousands together and they learn.",
    body: "One number, the loss, says how wrong the network is. Backpropagation nudges every weight downhill. You’ll compute a gradient by hand.",
    href: "/modules/deep-learning/backprop-by-hand",
    cta: "Backprop by hand",
    Scene: NetworkScene,
  },
  {
    fig: "Attention",
    level: "Advanced · Module 06",
    title: "Then they learn to pay attention.",
    body: "Inside a transformer, every word looks back at every other word. That’s how a chatbot decides that “the cat sat on the…” ends in “mat.”",
    href: "/modules/transformers/attention",
    cta: "How attention works",
    Scene: AttentionScene,
  },
  {
    fig: "Weights on disk",
    level: "Expert · Module 07",
    title: "Underneath, it’s just numbers in a file.",
    body: "A model is a file of named tensors. Learn how they’re shaped, how to count them, and how they get squeezed from 16 bits down to 4 so they fit on a laptop.",
    href: "/modules/model-building/weights-on-disk",
    cta: "Open a model file",
    Scene: WeightsScene,
  },
  {
    fig: "An agent loop",
    level: "Expert · Module 08",
    title: "Give it tools and it becomes an agent.",
    body: "Observe, think, act, check, repeat. You’ll build one step by step, then try to break it with a prompt injection, and fix it.",
    href: "/modules/agents/building-an-agent",
    cta: "Build an agent",
    Scene: AgentScene,
  },
  {
    fig: "Your brain map",
    level: "Your progress",
    title: "Every lesson lights a neuron.",
    body: "38 lessons across 8 modules, and a rank that climbs from Bronze I to Supersonic Legend. It all saves on your device. No accounts.",
    href: "/map",
    cta: "Open your brain map",
    Scene: MapScene,
  },
];

function useStill() {
  const os = useReducedMotion();
  const pref = useSettings((s) => s.reduceMotion);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && (!!os || pref);
}

function Frame({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <figure className="flex h-full w-full flex-col rounded-md border border-rule bg-paper-raised/80 p-3 sm:p-4">
      <figcaption className="flex items-center justify-between pb-1">
        <span className="label">Fig. {i + 1} — {CHAPTERS[i].fig}</span>
        <span className="label tabular">{String(i + 1).padStart(2, "0")}/{String(CHAPTERS.length).padStart(2, "0")}</span>
      </figcaption>
      <div className="relative min-h-0 flex-1">{children}</div>
    </figure>
  );
}

function ChapterText({ c, i }: { c: Chapter; i: number }) {
  return (
    <>
      <p className="label text-signal-ink">{String(i + 1).padStart(2, "0")} · {c.level}</p>
      <h3 className="mt-3 font-display text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.02] tracking-tight">{c.title}</h3>
      <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-2">{c.body}</p>
      <Link href={c.href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium underline decoration-rule-strong underline-offset-4 hover:decoration-ink">
        {c.cta} <span aria-hidden>→</span>
      </Link>
    </>
  );
}

/** Scrollytelling: one pinned figure evolves from a neuron to an agent as the chapters scroll past. */
export function Story() {
  const still = useStill();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end end"] });
  const [pos, setPos] = useState(-0.5);
  const frame = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setPos(p * CHAPTERS.length - 0.5));
  });

  if (still) {
    return (
      <ol className="mx-auto max-w-6xl space-y-16 px-5 py-10">
        {CHAPTERS.map((c, i) => (
          <li key={c.fig} className="grid items-center gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div><ChapterText c={c} i={i} /></div>
            <div className="aspect-square max-h-[34rem] w-full"><Frame i={i}><c.Scene t={1} /></Frame></div>
          </li>
        ))}
      </ol>
    );
  }

  const active = clamp(Math.round(pos), 0, CHAPTERS.length - 1);
  const progress = clamp((pos + 0.5) / CHAPTERS.length);

  return (
    <div ref={ref} className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] px-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
      <div className="pointer-events-none col-start-1 row-start-1 md:col-start-2">
        <div className="sticky top-[6.25rem] flex h-[46svh] items-center py-3 md:top-14 md:h-[calc(100svh-3.5rem)] md:py-8">
          <div className="relative mx-auto h-full w-full md:aspect-square md:w-auto md:max-w-full">
            {CHAPTERS.map((c, i) =>
              Math.abs(i - active) > 1 ? null : (
                <div key={c.fig} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: i === active ? 1 : 0 }}>
                  <Frame i={i}><c.Scene t={clamp((pos - i + 0.5) / 0.85)} /></Frame>
                </div>
              ),
            )}
            <div className="absolute -bottom-1 left-3 right-3 h-px bg-rule" aria-hidden>
              <div className="h-px bg-signal" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
      <ol className="relative z-10 col-start-1 row-start-1">
        {CHAPTERS.map((c, i) => (
          <li key={c.fig} className="flex min-h-[100svh] items-end pb-[6svh] md:items-center md:pb-0">
            <div className={`w-full rounded-md border border-rule bg-paper/95 p-5 shadow-[var(--shadow-lift)] backdrop-blur-sm transition-opacity duration-500 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none ${i === active ? "opacity-100" : "md:opacity-35"}`}>
              <ChapterText c={c} i={i} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
