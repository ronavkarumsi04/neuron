"use client";

import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNodeStates } from "@/components/brain-map";
import { totalLessons } from "@/content/curriculum";
import { useSettings } from "@/lib/settings";

interface Group {
  label: string;
  n: number;
  color: string;
}

interface View {
  tab: string;
  unit: string;
  title: string;
  body: string;
  groups: Group[];
  rest: string;
  source: string;
}

const COBALT = "var(--cobalt)";
const PLUM = "var(--plum)";
const GOLD = "var(--gold)";
const CS = "Common Sense Media, “The Dawn of the AI Era,” 2024. U.S. teens 13–18.";

const VIEWS: View[] = [
  {
    tab: "Use AI",
    unit: "Each square is 1 in 100 U.S. teens",
    title: "7 in 10 teens have already used AI.",
    body: "Chatbots, AI search answers, image and video generators. Most teens have tried at least one, usually before anyone explained how they work.",
    groups: [{ label: "Have used generative AI", n: 70, color: COBALT }],
    rest: "Haven’t yet",
    source: CS,
  },
  {
    tab: "For school",
    unit: "Each square is 1 in 100 U.S. teens",
    title: "4 in 10 use it for schoolwork. More do it without permission than with.",
    body: "Of the teens who used AI on their latest assignment, more did it without their teacher’s permission than with it, and some couldn’t say either way.",
    groups: [
      { label: "With the teacher’s permission", n: 16, color: COBALT },
      { label: "Without permission", n: 18, color: PLUM },
      { label: "Not sure", n: 5, color: GOLD },
    ],
    rest: "Haven’t used it for school",
    source: `${CS} Shares of the 40% who used it for school, rounded.`,
  },
  {
    tab: "School rules",
    unit: "Each square is 1 in 100 U.S. teens",
    title: "Most don’t know their school’s AI rules.",
    body: "About 6 in 10 teens say their school has no rules for AI, or that they don’t know if it does. Hard to follow rules nobody has explained.",
    groups: [
      { label: "Not sure if there are rules", n: 37, color: GOLD },
      { label: "School has no rules", n: 27, color: PLUM },
      { label: "School has rules", n: 35, color: COBALT },
    ],
    rest: "Rounding",
    source: CS,
  },
  {
    tab: "Parents",
    unit: "Each square is 1 in 100 teens who have used AI",
    title: "Only 37% of their parents know.",
    body: "Among teens who have used generative AI, most parents either think their teen hasn’t, or aren’t sure. Students are figuring this out on their own.",
    groups: [
      { label: "Parent knew", n: 37, color: COBALT },
      { label: "Parent thought they hadn’t", n: 23, color: PLUM },
      { label: "Parent wasn’t sure", n: 39, color: GOLD },
    ],
    rest: "Rounding",
    source: CS,
  },
  {
    tab: "The world",
    unit: "Each square is about 82 million people",
    title: "1 in 10 people on Earth uses ChatGPT every week.",
    body: "That’s about 800 million people, on just one chatbot. Knowing how to use these tools well, and when not to, is now a basic skill.",
    groups: [{ label: "Weekly ChatGPT users", n: 10, color: COBALT }],
    rest: "Everyone else",
    source: "OpenAI, company-reported via TechCrunch, Oct. 2025 (800M weekly users); UN World Population Prospects 2024 (≈8.2B people).",
  },
];

const YOU_SQUARE = 55;

function useStill() {
  const os = useReducedMotion();
  const pref = useSettings((s) => s.reduceMotion);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return !mounted || !!os || pref;
}

/** Waffle chart: 100 squares, one view per finding, ending on the reader's own square. */
export function LiteracyChart() {
  const still = useStill();
  const { doneCount } = useNodeStates();
  const [v, setV] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
  const last = VIEWS.length;
  const isYou = v === last;
  const view = VIEWS[Math.min(v, last - 1)];

  const fills: { color: string; g: number }[] = [];
  if (isYou) for (let i = 0; i < 100; i++) fills.push({ color: "", g: -1 });
  else {
    view.groups.forEach((g, gi) => {
      for (let i = 0; i < g.n; i++) fills.push({ color: g.color, g: gi });
    });
    while (fills.length < 100) fills.push({ color: "", g: -1 });
  }

  const tabs = [...VIEWS.map((x) => x.tab), "You"];
  const summary = isYou
    ? `You are one square in this picture. You have lit ${doneCount} of ${totalLessons} neurons.`
    : `${view.unit}. ${view.groups.map((g) => `${g.n}: ${g.label}`).join(". ")}. ${100 - view.groups.reduce((a, g) => a + g.n, 0)}: ${view.rest}.`;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-start">
      <div>
        <div role="group" aria-label="Choose a finding" className="flex flex-wrap gap-1.5">
          {tabs.map((t, i) => (
            <button
              key={t}
              type="button"
              aria-pressed={v === i}
              onClick={() => { setV(i); setFocus(null); }}
              className={`h-9 rounded-sm border px-3 text-sm transition-colors duration-150 ${v === i ? "border-ink bg-ink text-paper" : "border-rule-strong text-ink-2 hover:bg-paper-sunk"}`}
            >
              <span className="font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span> {t}
            </button>
          ))}
        </div>

        <div aria-live="polite" className="mt-8 min-h-[15rem]">
          <p className="label text-signal-ink">{isYou ? "And then there’s you" : view.unit}</p>
          <h3 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.02] tracking-tight">
            {isYou ? "You’re one of these squares." : view.title}
          </h3>
          <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-2">
            {isYou
              ? doneCount > 0
                ? `You’ve already lit ${doneCount} of ${totalLessons} neurons. Keep going and you’ll understand AI better than almost everyone in this chart.`
                : `Every lesson you finish moves you out of the gray. ${totalLessons} lessons take you from “what is AI?” to building and securing an agent.`
              : view.body}
          </p>
          {isYou ? (
            <Link
              href={doneCount > 0 ? "/map" : "/modules/foundations/what-is-ai"}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
            >
              {doneCount > 0 ? "Open your brain map" : "Start Module 01"} <span aria-hidden>→</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => { setV(v + 1); setFocus(null); }}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline decoration-rule-strong underline-offset-4 hover:decoration-ink"
            >
              Next finding <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>

      <figure className="rounded-md border border-rule bg-paper-raised/80 p-3 sm:p-5">
        <figcaption className="flex items-center justify-between pb-3">
          <span className="label">Fig. 0 — Using AI vs. knowing the rules</span>
          <span className="label tabular">{String(v + 1).padStart(2, "0")}/{String(tabs.length).padStart(2, "0")}</span>
        </figcaption>
        <svg viewBox="0 0 100 100" className="mx-auto block w-full max-w-[26rem]" role="img" aria-label={summary}>
          {fills.map((f, i) => {
            const x = (i % 10) * 10;
            const y = Math.floor(i / 10) * 10;
            const me = isYou && i === YOU_SQUARE;
            const dim = focus !== null && f.g !== focus;
            return (
              <rect
                key={i}
                x={x + 0.9}
                y={y + 0.9}
                width={8.2}
                height={8.2}
                rx={0.8}
                fill={me ? "var(--signal)" : f.color || "var(--paper-sunk)"}
                stroke={f.color || me ? "none" : "var(--rule-strong)"}
                strokeWidth={0.3}
                opacity={dim ? 0.18 : 1}
                className={me && !still ? "literacy-you" : undefined}
                style={still ? undefined : { transition: "fill 420ms var(--ease-out), opacity 200ms", transitionDelay: `${(Math.floor(i / 10) + (i % 10)) * 14}ms` }}
              />
            );
          })}
        </svg>
        <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-1 border-t border-rule pt-3 text-sm sm:grid-cols-2">
          {isYou ? (
            <li className="flex items-center gap-2 text-ink-2">
              <span aria-hidden className="size-3 shrink-0 rounded-[2px] bg-signal" /> You · {doneCount} of {totalLessons} neurons lit
            </li>
          ) : (
            <>
              {view.groups.map((g, gi) => (
                <li key={g.label}>
                  <button
                    type="button"
                    onMouseEnter={() => setFocus(gi)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(gi)}
                    onBlur={() => setFocus(null)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-sm px-1 py-1 text-left text-ink-2 hover:bg-paper-sunk"
                  >
                    <span aria-hidden className="size-3 shrink-0 rounded-[2px]" style={{ background: g.color }} />
                    <span className="min-w-0 flex-1">{g.label}</span>
                    <span className="font-mono tabular text-ink">{g.n}</span>
                  </button>
                </li>
              ))}
              <li className="flex items-center gap-2 px-1 py-1 text-ink-3">
                <span aria-hidden className="size-3 shrink-0 rounded-[2px] border border-rule-strong bg-paper-sunk" />
                <span className="min-w-0 flex-1">{view.rest}</span>
                <span className="font-mono tabular">{100 - view.groups.reduce((a, g) => a + g.n, 0)}</span>
              </li>
            </>
          )}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-ink-3">
          {isYou ? "Your progress is saved only on this device." : <>Source: {view.source} <Link href="/about#sources" className="underline underline-offset-2 hover:text-ink-2">Works cited</Link></>}
        </p>
      </figure>
    </div>
  );
}
