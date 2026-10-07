"use client";

import { useState } from "react";
import { lessonKey, type ModuleId } from "@/content/curriculum";
import { passMark, type Question } from "@/content/lesson-types";
import { useModuleLocked, useProgress, XP } from "@/lib/progress";

const LETTERS = "ABCD";

interface Props {
  moduleId: ModuleId;
  slug: string;
  questions: Question[];
  title?: string;
  need?: number;
  note?: string;
  onResult?: (score: number, passed: boolean) => void;
}

export function CheckpointQuiz({ moduleId, slug, questions, title = "Checkpoint", need: needOverride, note, onResult }: Props) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const record = useProgress((s) => s.recordQuiz);
  const prior = useProgress((s) => s.quizzes[lessonKey(moduleId, slug)]);
  const locked = useModuleLocked(moduleId);
  const need = needOverride ?? passMark(questions.length);
  const score = picks.filter((p, i) => p === questions[i].answer).length;
  const passed = score >= need;
  const ready = picks.every((p) => p !== null);

  const check = () => {
    setChecked(true);
    if (onResult) onResult(score, passed);
    else record(moduleId, slug, score, questions.length, passed);
  };
  const retry = () => {
    setPicks(questions.map(() => null));
    setChecked(false);
  };

  return (
    <section aria-labelledby={`${slug}-quiz`} className="mt-14 rounded-md border border-rule-strong bg-paper-raised p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`${slug}-quiz`} className="font-display text-3xl">{title}</h2>
        <p className="label">
          {need} of {questions.length} to pass
          {!onResult && !locked && (
            <>
              {" "}· ace it first try <span className="text-signal-ink">+{XP.perfectQuiz} XP</span>
            </>
          )}
        </p>
      </div>
      {note && !checked && <p className="mt-2 text-sm text-ink-3">{note}</p>}
      {!onResult && locked && (
        <p className="mt-2 text-sm text-ink-3">Practice run: this module is locked, so the result won&apos;t be saved and earns no XP. Your first-try bonus waits until it unlocks.</p>
      )}
      {!onResult && prior?.passed && !checked && prior.total > 0 && (
        <p className="mt-2 text-sm text-ink-3">Already passed. Best score {prior.best}/{prior.total}. Retake it any time.</p>
      )}

      <ol className="mt-6 space-y-7">
        {questions.map((q, qi) => {
          const pick = picks[qi];
          const right = pick === q.answer;
          return (
            <li key={qi}>
              <fieldset disabled={checked}>
                <legend className="font-medium text-ink">
                  <span className="mr-2 font-mono text-sm text-ink-3">{qi + 1}.</span>
                  {q.q}
                </legend>
                <div className="mt-3 grid gap-2">
                  {q.options.map((opt, oi) => {
                    const chosen = pick === oi;
                    const state = checked ? (oi === q.answer ? "right" : chosen ? "wrong" : "idle") : chosen ? "chosen" : "idle";
                    return (
                      <label
                        key={oi}
                        className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-sm border px-3 py-2.5 text-[0.95rem] transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${
                          state === "right"
                            ? "border-green bg-green/10"
                            : state === "wrong"
                              ? "border-signal bg-signal/10"
                              : state === "chosen"
                                ? "border-ink bg-paper-sunk"
                                : "border-rule hover:bg-paper-sunk/70"
                        } ${checked ? "cursor-default" : ""}`}
                      >
                        <input
                          type="radio"
                          name={`${slug}-q${qi}`}
                          className="sr-only"
                          checked={chosen}
                          onChange={() => setPicks((p) => p.map((v, i) => (i === qi ? oi : v)))}
                        />
                        <span aria-hidden className="mt-px font-mono text-xs text-ink-3">{LETTERS[oi]}</span>
                        <span className="flex-1 text-ink-2">{opt}</span>
                        {state === "right" && <span className="font-mono text-xs uppercase text-green">Correct</span>}
                        {state === "wrong" && <span className="font-mono text-xs uppercase text-signal-ink">Your pick</span>}
                      </label>
                    );
                  })}
                </div>
                {checked && (
                  <p className={`mt-3 border-l-2 pl-3 text-sm leading-relaxed ${right ? "border-green" : "border-signal"} text-ink-2`}>
                    <span className="sr-only">{right ? "Correct. " : "Incorrect. "}</span>
                    {q.why}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-rule pt-5" aria-live="polite">
        {!checked ? (
          <button
            type="button"
            onClick={check}
            disabled={!ready}
            className="inline-flex h-11 items-center rounded-sm border border-ink px-5 font-medium transition-colors duration-150 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
          >
            Check answers
          </button>
        ) : (
          <>
            <p className={`font-medium ${passed ? "text-green" : "text-signal-ink"}`}>
              {score}/{questions.length} · {passed ? (score === questions.length ? "Perfect." : "Passed.") : `Need ${need} to pass.`}
            </p>
            <button type="button" onClick={retry} className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
              {passed ? "Retake" : "Try again"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}
