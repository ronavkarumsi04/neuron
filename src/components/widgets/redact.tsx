"use client";

import { useState } from "react";
import { Figure } from ".";

type Piece = string | { text: string; why: string };

const PROMPT: Piece[] = [
  "Hi, I'm ",
  { text: "Maya Chen", why: "Your full name ties everything else to you." },
  ", a junior at ",
  { text: "Lincoln High in Portland", why: "School plus city narrows you down to one building." },
  ". My student ID is ",
  { text: "40912877", why: "IDs unlock school systems. Never paste them." },
  ". Can you rewrite this email to my counselor? My ",
  { text: "ADHD diagnosis", why: "Health information is some of the most sensitive data there is." },
  " is making it hard to finish the ",
  { text: "chem lab", why: "Fine to share. This is just context, not identifying." },
  " on time. You can reach me at ",
  { text: "maya.c@gmail.com", why: "Contact info lets anyone reach you directly." },
  ". My friend ",
  { text: "Jordan", why: "Other people didn't agree to be in your prompt." },
  " is in the same spot.",
];

const SENSITIVE = new Set(["Maya Chen", "Lincoln High in Portland", "40912877", "ADHD diagnosis", "maya.c@gmail.com", "Jordan"]);

export function Redact() {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [last, setLast] = useState<{ text: string; why: string } | null>(null);
  const [checked, setChecked] = useState(false);
  const found = [...hidden].filter((t) => SENSITIVE.has(t)).length;
  const extra = [...hidden].filter((t) => !SENSITIVE.has(t)).length;

  return (
    <Figure title="Redact before you paste" label={`${found}/${SENSITIVE.size} found`}>
      <p className="text-sm text-ink-2">Click anything you would remove before sending this to a chatbot.</p>
      <p className="mt-3 rounded-sm border border-rule bg-paper px-4 py-3 text-[1.05rem] leading-loose">
        {PROMPT.map((p, i) =>
          typeof p === "string" ? (
            <span key={i}>{p}</span>
          ) : (
            <button key={i} type="button" aria-pressed={hidden.has(p.text)}
              onClick={() => {
                setHidden((h) => { const n = new Set(h); if (n.has(p.text)) n.delete(p.text); else n.add(p.text); return n; });
                setLast(p);
              }}
              className={`rounded-[2px] px-0.5 underline decoration-dotted underline-offset-4 ${hidden.has(p.text) ? "bg-ink text-ink decoration-transparent" : "hover:bg-paper-sunk"}`}>
              <span className={hidden.has(p.text) ? "sr-only" : ""}>{p.text}</span>
              {hidden.has(p.text) && <span aria-hidden>{"█".repeat(Math.min(10, p.text.length))}</span>}
            </button>
          ),
        )}
      </p>
      {last && <p className="mt-3 text-sm text-ink-2" aria-live="polite"><span className="font-mono text-xs uppercase text-ink-3">{last.text}:</span> {last.why}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-rule pt-3">
        <button type="button" onClick={() => setChecked(true)} className="min-h-10 rounded-sm border border-ink px-3 text-sm font-medium hover:bg-ink hover:text-paper">Check my redactions</button>
        {checked && (
          <p className="text-sm text-ink-2" aria-live="polite">
            {found === SENSITIVE.size && extra === 0
              ? "Perfect. The request still works, and nothing identifies you or anyone else."
              : `${found} of ${SENSITIVE.size} sensitive items hidden${extra ? `, plus ${extra} you could have kept` : ""}.`}
          </p>
        )}
      </div>
    </Figure>
  );
}
