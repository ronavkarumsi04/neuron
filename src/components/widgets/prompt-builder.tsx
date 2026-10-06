"use client";

import { useState } from "react";
import { Figure } from ".";

const PARTS = [
  { key: "C", name: "Context", text: "I'm a 10th grader with a biology test Friday on cellular respiration. I understand glycolysis but get lost in the Krebs cycle.", guess: "Your grade level and what you already know, so it may explain things you know or skip what you don't." },
  { key: "R", name: "Role", text: "Act as a patient tutor who checks my understanding instead of lecturing.", guess: "How to talk to you. It defaults to a generic encyclopedia voice." },
  { key: "A", name: "Ask", text: "Quiz me with 5 questions on the Krebs cycle, one at a time, and wait for my answer before giving feedback.", guess: "What you actually want. A vague request gets a vague essay." },
  { key: "F", name: "Format", text: "Keep each question under 30 words and end with a 3-line summary of what I got wrong.", guess: "Length and shape of the answer, so you'll often get a wall of text." },
  { key: "T", name: "Tweak", text: "If I get two wrong in a row, give me a simpler hint first.", guess: "How to adapt. Good prompts plan for the follow-up." },
];

export function PromptBuilder() {
  const [on, setOn] = useState([false, false, true, false, false]);
  const count = on.filter(Boolean).length;
  const prompt = on.every((v) => !v) ? "help me with bio" : PARTS.filter((_, i) => on[i]).map((p) => p.text).join(" ");

  return (
    <Figure title="Build a prompt with the CRAFT check" label={`${count}/5 parts`}>
      <div className="flex flex-wrap gap-2">
        {PARTS.map((p, i) => (
          <button key={p.key} type="button" aria-pressed={on[i]} onClick={() => setOn((o) => o.map((v, j) => (j === i ? !v : v)))}
            className={`inline-flex min-h-10 items-center gap-2 rounded-sm border px-3 text-sm ${on[i] ? "border-green bg-green/10 text-ink" : "border-rule-strong text-ink-2 hover:bg-paper-sunk"}`}>
            <span className="font-mono text-xs">{p.key}</span>{p.name}
          </button>
        ))}
      </div>
      <div className="mt-4 rounded-sm border border-rule bg-paper px-4 py-3">
        <p className="label">Your prompt</p>
        <p className="mt-1 font-mono text-[0.85rem] leading-relaxed text-ink" aria-live="polite">{prompt}</p>
      </div>
      <div className="mt-4" aria-hidden>
        <div className="flex h-2 gap-1">
          {PARTS.map((p, i) => <span key={p.key} className={`flex-1 rounded-[1px] ${i < count ? "bg-green" : "bg-paper-sunk"}`} />)}
        </div>
      </div>
      {count < 5 ? (
        <div className="mt-4">
          <p className="label">What the AI has to guess</p>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
            {PARTS.map((p, i) => !on[i] && <li key={p.key}><span className="font-mono text-xs text-signal-ink">{p.name}:</span> {p.guess}</li>)}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-sm font-medium text-green">Nothing left to guess. This prompt turns the AI into a study partner instead of an answer machine.</p>
      )}
    </Figure>
  );
}
