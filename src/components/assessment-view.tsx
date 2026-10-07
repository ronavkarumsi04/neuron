"use client";

import Link from "next/link";
import { useState } from "react";
import { ASSESSMENT, TOPICS } from "@/content/assessment";
import { coreComplete, useProgress, XP, type Attempt } from "@/lib/progress";

const LETTERS = "ABCD";
const pct = (a?: [number, number]) => (a && a[1] ? Math.round((a[0] / a[1]) * 100) : 0);

function Quiz({ kind, onDone }: { kind: "pre" | "post"; onDone: () => void }) {
  const record = useProgress((s) => s.recordAssessment);
  const [picks, setPicks] = useState<(number | null)[]>(() => ASSESSMENT.map(() => null));
  const ready = picks.every((p) => p !== null);

  const submit = () => {
    const byTopic: Record<string, [number, number]> = {};
    let score = 0;
    ASSESSMENT.forEach((q, i) => {
      const t = (byTopic[q.topic] ??= [0, 0]);
      t[1]++;
      if (picks[i] === q.answer) {
        t[0]++;
        score++;
      }
    });
    const attempt: Attempt = { score, total: ASSESSMENT.length, byTopic, at: new Date().toISOString().slice(0, 10) };
    record(kind, attempt);
    onDone();
    window.scrollTo({ top: 0 });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (ready) submit(); }} className="mt-10">
      <ol className="space-y-8">
        {ASSESSMENT.map((q, qi) => (
          <li key={qi}>
            <fieldset>
              <legend className="font-medium text-ink">
                <span className="mr-2 font-mono text-sm text-ink-3">{qi + 1}.</span>
                {q.q}
              </legend>
              <div className="mt-3 grid gap-2">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border px-3 py-2.5 text-[0.95rem] transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${picks[qi] === oi ? "border-ink bg-paper-sunk" : "border-rule hover:bg-paper-sunk/70"}`}>
                    <input type="radio" name={`a-${kind}-${qi}`} className="sr-only" checked={picks[qi] === oi} onChange={() => setPicks((p) => p.map((v, i) => (i === qi ? oi : v)))} />
                    <span aria-hidden className="mt-px font-mono text-xs text-ink-3">{LETTERS[oi]}</span>
                    <span className="flex-1 text-ink-2">{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-ink pt-5">
        <button type="submit" disabled={!ready} className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper disabled:cursor-not-allowed disabled:opacity-40">
          Submit {kind === "pre" ? "baseline" : "final check"}
        </button>
        <p className="text-sm text-ink-3">{picks.filter((p) => p !== null).length}/{ASSESSMENT.length} answered · +{XP.assessment} XP</p>
      </div>
    </form>
  );
}

function Compare({ pre, post }: { pre: Attempt; post?: Attempt }) {
  const [copied, setCopied] = useState(false);
  const line = [
    `Neuron skill check`,
    `before ${pre.score}/${pre.total}`,
    post ? `after ${post.score}/${post.total}` : null,
    ...TOPICS.map((t) => `${t.label} ${pct(pre.byTopic[t.id])}%${post ? `→${pct(post.byTopic[t.id])}%` : ""}`),
  ].filter(Boolean).join(" · ");

  return (
    <section aria-labelledby="results" className="mt-10 rounded-md border border-rule-strong bg-paper-raised">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3">
        <h2 id="results" className="font-medium">Your results</h2>
        <span className="label">{post ? "Before → after" : "Baseline"}</span>
      </header>
      <div className="grid gap-6 p-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-1">
          <div>
            <dt className="label">Before</dt>
            <dd className="font-display text-5xl tabular">{Math.round((pre.score / pre.total) * 100)}%</dd>
          </div>
          <div>
            <dt className="label">After</dt>
            <dd className={`font-display text-5xl tabular ${post ? "text-green" : "text-ink-3"}`}>{post ? `${Math.round((post.score / post.total) * 100)}%` : "—"}</dd>
          </div>
        </dl>
        <table className="w-full text-sm">
          <caption className="sr-only">Score by topic, before and after</caption>
          <thead>
            <tr className="label text-left">
              <th scope="col" className="pb-2 font-normal">Topic</th>
              <th scope="col" className="pb-2 font-normal">Score</th>
            </tr>
          </thead>
          <tbody>
            {TOPICS.map((t) => {
              const a = pct(pre.byTopic[t.id]);
              const b = post ? pct(post.byTopic[t.id]) : null;
              return (
                <tr key={t.id} className="border-t border-rule">
                  <th scope="row" className="w-36 py-3 pr-3 text-left font-normal text-ink-2">{t.label}</th>
                  <td className="py-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-sunk"><span className="block h-full rounded-full bg-ink-3" style={{ width: `${a}%` }} /></span>
                        <span className="w-10 text-right font-mono text-xs tabular text-ink-3">{a}%</span>
                      </div>
                      {b !== null && (
                        <div className="flex items-center gap-2">
                          <span className="h-2 flex-1 overflow-hidden rounded-full bg-paper-sunk"><span className="block h-full rounded-full bg-green" style={{ width: `${b}%` }} /></span>
                          <span className="w-10 text-right font-mono text-xs tabular text-ink">{b}%</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-rule px-5 py-3 text-sm">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(line);
              setCopied(true);
            } catch {}
          }}
          className="inline-flex min-h-9 items-center rounded-sm border border-rule-strong px-3 text-ink-2 hover:bg-paper-sunk hover:text-ink"
        >
          {copied ? "Copied" : "Copy anonymous result"}
        </button>
        <span className="text-ink-3" aria-live="polite">Just scores, no name. Paste it into your teacher&apos;s class survey.</span>
      </footer>
    </section>
  );
}

export function AssessmentView() {
  const { pre, post } = useProgress((s) => s.assessment);
  const unlocked = useProgress((s) => coreComplete(s.completed));
  const [taking, setTaking] = useState<"pre" | "post" | null>(null);

  if (taking) {
    return (
      <>
        <p className="mt-6 border-l-2 border-signal pl-4 text-ink-2">
          {taking === "pre"
            ? "Answer honestly. Guessing is fine, and you won't see the answers yet, so the after-check stays fair."
            : "Same questions as your baseline. This time you'll see explanations at the end."}
        </p>
        <Quiz kind={taking} onDone={() => setTaking(null)} />
      </>
    );
  }

  if (!pre) {
    return (
      <div className="mt-10 rounded-md border border-rule-strong bg-paper-raised p-6">
        <h2 className="font-display text-3xl">Start with a baseline</h2>
        <p className="mt-3 max-w-xl text-ink-2">Twelve questions, about five minutes. Take it before Module 01, then again after Module 03, and see how much you learned in each area.</p>
        <button type="button" onClick={() => setTaking("pre")} className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">Take the baseline</button>
      </div>
    );
  }

  return (
    <>
      <Compare pre={pre} post={post} />
      {!post && !unlocked && (
        <p className="mt-6 text-ink-2">
          The after-check unlocks when you finish Modules 01–03.{" "}
          <Link href="/map" className="underline underline-offset-4 hover:text-ink">Back to the brain map</Link>
        </p>
      )}
      {unlocked && (
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button type="button" onClick={() => setTaking("post")} className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">
            {post ? "Retake the after-check" : "Take the after-check"}
          </button>
        </div>
      )}
      {post && (
        <section aria-labelledby="answers" className="mt-12">
          <h2 id="answers" className="border-b border-ink pb-3 font-display text-3xl">Answers explained</h2>
          <ol className="mt-4 space-y-5">
            {ASSESSMENT.map((q, i) => (
              <li key={i} className="border-b border-rule pb-4">
                <p className="font-medium text-ink"><span className="mr-2 font-mono text-sm text-ink-3">{i + 1}.</span>{q.q}</p>
                <p className="mt-1 text-sm text-green">{q.options[q.answer]}</p>
                <p className="mt-1 text-sm text-ink-2">{q.why}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
