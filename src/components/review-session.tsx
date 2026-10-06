"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Question } from "@/content/lesson-types";
import { dueOn, retention, strengthOf, today, type Strength } from "@/lib/memory";
import { useProgress, XP } from "@/lib/progress";

export type Bank = Record<string, { title: string; module: string; tone: string; href: string; quiz: Question[] }>;

const LETTERS = "ABCD";
const TONE: Record<string, string> = { cobalt: "var(--cobalt)", green: "var(--green)", plum: "var(--plum)", gold: "var(--gold)" };
const LABEL: Record<Strength, string> = { fresh: "Fresh", fading: "Fading", faded: "Faded" };
const ROUND = 5;

function pickQuestion(key: string, quiz: Question[], salt: number) {
  let h = salt;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return quiz[h % quiz.length];
}

export function ReviewSession({ bank }: { bank: Bank }) {
  const completed = useProgress((s) => s.completed);
  const memory = useProgress((s) => s.memory);
  const review = useProgress((s) => s.reviewLesson);
  const [queue, setQueue] = useState<string[] | null>(null);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [salt] = useState(() => Date.now() % 997);

  const rows = useMemo(
    () =>
      completed
        .filter((k) => bank[k]?.quiz.length)
        .map((k) => ({ key: k, strength: strengthOf(memory[k]), keep: retention(memory[k]), due: memory[k] ? dueOn(memory[k]) : today() }))
        .sort((a, b) => a.keep - b.keep),
    [completed, memory, bank],
  );
  const due = rows.filter((r) => r.strength !== "fresh");

  const begin = (keys: string[]) => {
    setQueue(keys.slice(0, ROUND));
    setI(0);
    setPick(null);
    setResults([]);
  };

  if (queue) {
    const done = i >= queue.length;
    if (done) {
      const right = results.filter(Boolean).length;
      return (
        <section className="mt-10 rounded-md border border-rule-strong bg-paper-raised p-6" aria-live="polite">
          <p className="label">Round complete</p>
          <p className="mt-2 font-display text-4xl">{right}/{results.length} relit</p>
          <p className="mt-2 text-ink-2">
            {right === results.length ? "Every neuron is back to full strength, and each one will wait longer before fading again." : "Missed ones reset to a 3-day review. Reread the lesson takeaways, then try again."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => setQueue(null)} className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">Back to memory map</button>
            <Link href="/map" className="inline-flex min-h-11 items-center rounded-sm border border-rule-strong px-5 hover:bg-paper-sunk">See the brain map</Link>
          </div>
        </section>
      );
    }
    const key = queue[i];
    const entry = bank[key];
    const q = pickQuestion(key, entry.quiz, salt);
    const answered = pick !== null;
    const right = pick === q.answer;
    return (
      <section className="mt-10 rounded-md border border-rule-strong bg-paper-raised" aria-labelledby="rq">
        <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3">
          <p className="text-sm">
            <span className="font-mono text-xs" style={{ color: TONE[entry.tone] }}>{entry.module}</span>{" "}
            <span className="text-ink">{entry.title}</span>
          </p>
          <span className="label">{i + 1} of {queue.length}</span>
        </header>
        <fieldset className="p-5" disabled={answered}>
          <legend id="rq" className="float-left mb-4 w-full font-medium text-ink">{q.q}</legend>
          <div className="clear-left grid gap-2">
            {q.options.map((opt, oi) => {
              const state = answered ? (oi === q.answer ? "right" : oi === pick ? "wrong" : "idle") : "idle";
              return (
                <label key={oi} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border px-3 py-2.5 text-[0.95rem] transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${state === "right" ? "border-green bg-green/10" : state === "wrong" ? "border-signal bg-signal/10" : "border-rule hover:bg-paper-sunk/70"} ${answered ? "cursor-default" : ""}`}>
                  <input
                    type="radio"
                    name={`rq-${i}`}
                    className="sr-only"
                    checked={pick === oi}
                    onChange={() => {
                      setPick(oi);
                      const ok = oi === q.answer;
                      setResults((r) => [...r, ok]);
                      review(key, ok);
                    }}
                  />
                  <span aria-hidden className="mt-px font-mono text-xs text-ink-3">{LETTERS[oi]}</span>
                  <span className="flex-1 text-ink-2">{opt}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        <div className="flex flex-wrap items-center gap-4 border-t border-rule px-5 py-3" aria-live="polite">
          {answered ? (
            <>
              <p className={`text-sm ${right ? "text-green" : "text-signal-ink"}`}>
                {right ? `Relit · +${XP.review} XP. ` : "Not quite. "}
                <span className="text-ink-2">{q.why}</span>
              </p>
              <button type="button" onClick={() => { setI(i + 1); setPick(null); }} className="ml-auto inline-flex min-h-10 items-center rounded-sm bg-ink px-4 text-sm font-medium text-paper">
                {i + 1 < queue.length ? "Next" : "Finish"}
              </button>
            </>
          ) : (
            <p className="text-sm text-ink-3">Pick an answer. One try.</p>
          )}
        </div>
      </section>
    );
  }

  if (!rows.length)
    return (
      <div className="mt-10 rounded-md border border-rule-strong bg-paper-raised p-6">
        <p className="font-display text-3xl">Nothing to review yet</p>
        <p className="mt-2 text-ink-2">Finish a lesson and its neuron will show up here.</p>
        <Link href="/modules/foundations/what-is-ai" className="mt-5 inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">Start Module 01</Link>
      </div>
    );

  return (
    <>
      <div className="mt-10 flex flex-wrap items-center gap-4 rounded-md border border-rule-strong bg-paper-raised p-5">
        <div className="mr-auto">
          <p className="font-display text-3xl">{due.length ? `${due.length} neuron${due.length > 1 ? "s" : ""} fading` : "All neurons fresh"}</p>
          <p className="mt-1 text-sm text-ink-2">
            {due.length ? `A round is up to ${ROUND} questions, weakest first.` : `Next review due ${rows.map((r) => r.due).sort()[0]}. You can still practice early.`}
          </p>
        </div>
        <button type="button" onClick={() => begin((due.length ? due : rows).map((r) => r.key))} className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">
          {due.length ? "Start review" : "Practice anyway"}
        </button>
      </div>

      <section aria-labelledby="mm" className="mt-10">
        <h2 id="mm" className="flex items-end justify-between border-b border-ink pb-3">
          <span className="font-display text-3xl">Memory map</span>
          <span className="label">Estimated recall</span>
        </h2>
        <ul>
          {rows.map((r) => {
            const e = bank[r.key];
            return (
              <li key={r.key} className="grid grid-cols-[minmax(0,1fr)_6rem_4.5rem] items-center gap-3 border-b border-rule py-3 text-sm sm:grid-cols-[minmax(0,1fr)_10rem_5rem]">
                <Link href={e.href} className="truncate hover:underline">
                  <span className="mr-2 font-mono text-xs" style={{ color: TONE[e.tone] }}>{e.module}</span>
                  {e.title}
                </Link>
                <span className="h-1.5 overflow-hidden rounded-full bg-paper-sunk" role="img" aria-label={`About ${Math.round(r.keep * 100)}% recall`}>
                  <span className="block h-full rounded-full" style={{ width: `${r.keep * 100}%`, background: TONE[e.tone], opacity: r.strength === "fresh" ? 1 : r.strength === "fading" ? 0.6 : 0.35 }} />
                </span>
                <span className={`text-right font-mono text-xs uppercase ${r.strength === "fresh" ? "text-ink-3" : "text-signal-ink"}`}>{LABEL[r.strength]}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
