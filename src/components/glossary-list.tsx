"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { RichText } from "./rich-text";

export interface Entry { term: string; def: string; lesson: string; href: string; module: string; tone: string }

const TONE: Record<string, string> = { cobalt: "var(--cobalt)", green: "var(--green)", plum: "var(--plum)", gold: "var(--gold)" };
const plain = (s: string) => s.replace(/[*_`]/g, "").toLowerCase();

export function GlossaryList({ entries }: { entries: Entry[] }) {
  const [q, setQ] = useState("");
  const query = useDeferredValue(q.trim().toLowerCase());
  const shown = query ? entries.filter((e) => e.term.toLowerCase().includes(query) || plain(e.def).includes(query)) : entries;
  const letters = [...new Set(shown.map((e) => e.term[0].toUpperCase()))];

  return (
    <>
      <div className="sticky top-0 z-10 -mx-5 mt-8 border-b border-rule bg-paper/95 px-5 py-3 backdrop-blur-sm">
        <label className="block">
          <span className="sr-only">Search the glossary</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms and definitions"
            className="min-h-11 w-full rounded-sm border border-rule-strong bg-paper-raised px-3 text-base placeholder:text-ink-3 focus:outline-2 focus:outline-signal"
          />
        </label>
        <p className="mt-2 font-mono text-xs text-ink-3" aria-live="polite">
          {shown.length} of {entries.length} terms
        </p>
      </div>
      {letters.map((L) => (
        <section key={L} aria-labelledby={`g-${L}`} className="mt-8">
          <h2 id={`g-${L}`} className="border-b border-ink pb-1 font-display text-3xl">{L}</h2>
          <dl>
            {shown.filter((e) => e.term[0].toUpperCase() === L).map((e) => (
              <div key={e.term} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
                <dt className="font-medium text-ink">{e.term}</dt>
                <dd className="text-ink-2">
                  <RichText text={e.def} />
                  <Link href={e.href} className="mt-1.5 block text-xs text-ink-3 hover:text-ink">
                    <span className="font-mono" style={{ color: TONE[e.tone] }}>{e.module}</span> {e.lesson} →
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      {!shown.length && <p className="mt-10 text-ink-2">No terms match “{q}”.</p>}
    </>
  );
}
