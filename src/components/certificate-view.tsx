"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrainMap } from "@/components/brain-map";
import { modules, totalLessons } from "@/content/curriculum";
import { BADGES, coreComplete, levelFor, useProgress } from "@/lib/progress";

const NAME_KEY = "neuron-cert-name";

export function CertificateView() {
  const s = useProgress();
  const [name, setName] = useState("");
  useEffect(() => setName(localStorage.getItem(NAME_KEY) ?? ""), []);
  const save = (v: string) => {
    setName(v);
    localStorage.setItem(NAME_KEY, v);
  };

  const ready = coreComplete(s.completed);
  const core = modules.filter((m) => !m.bonus);
  const coreDone = core.flatMap((m) => m.lessons).length;
  const done = s.completed.filter((k) => core.some((m) => k.startsWith(`${m.id}/`))).length;
  const { level, name: levelName } = levelFor(s.xp);
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const gain = s.assessment.pre && s.assessment.post ? Math.round(((s.assessment.post.score - s.assessment.pre.score) / s.assessment.post.total) * 100) : null;

  if (!ready)
    return (
      <div className="mx-auto max-w-3xl px-5 pt-10">
        <p className="label">Certificate</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">Not yet earned</h1>
        <p className="mt-4 text-lg text-ink-2">
          Finish Modules 01–03 to earn your certificate. You&apos;ve lit <span className="font-medium text-ink">{done}</span> of {coreDone} core neurons.
        </p>
        <Link href="/map" className="mt-6 inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">Back to the brain map</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-5 pt-10">
      <div className="print:hidden">
        <p className="label">Certificate</p>
        <h1 className="mt-2 font-display text-5xl tracking-tight">You earned it</h1>
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <label className="block grow sm:max-w-sm">
            <span className="text-sm text-ink-2">Name on certificate (stays on this device)</span>
            <input value={name} onChange={(e) => save(e.target.value.slice(0, 60))} placeholder="Your name" className="mt-1 min-h-11 w-full rounded-sm border border-rule-strong bg-paper-raised px-3 focus:outline-2 focus:outline-signal" />
          </label>
          <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 items-center rounded-sm bg-ink px-5 font-medium text-paper">Print or save as PDF</button>
        </div>
      </div>

      <article aria-label="Certificate of completion" className="certificate relative mt-8 overflow-hidden rounded-md border border-ink bg-paper-raised p-8 sm:p-12 print:mt-0 print:rounded-none">
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-sm border border-rule-strong" />
        <div className="relative grid gap-8 md:grid-cols-[minmax(0,1fr)_16rem] md:items-center">
          <div>
            <p className="label">Neuron · AI learning portal · Certificate of completion</p>
            <p className="mt-8 text-ink-2">This certifies that</p>
            <p className="mt-2 border-b border-ink pb-2 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-none">{name || "Your name"}</p>
            <p className="mt-4 max-w-lg leading-relaxed text-ink-2">
              completed the core curriculum: how AI works, how to use AI tools well, and how to use AI ethically in school. That&apos;s {s.completed.length} of {totalLessons} lessons and {s.labs.length} hands-on labs.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-rule pt-4 sm:max-w-md">
              <div><dt className="label">Level</dt><dd className="mt-1 font-display text-2xl">{level} <span className="text-base text-ink-2">{levelName}</span></dd></div>
              <div><dt className="label">Badges</dt><dd className="mt-1 font-display text-2xl tabular">{s.badges.length}/{BADGES.length}</dd></div>
              <div><dt className="label">{gain === null ? "XP" : "Skill gain"}</dt><dd className="mt-1 font-display text-2xl tabular">{gain === null ? s.xp : `${gain > 0 ? "+" : ""}${gain} pts`}</dd></div>
            </dl>
            <p className="mt-8 font-mono text-xs text-ink-3">Issued {date}</p>
          </div>
          <BrainMap className="w-full" showLabels={false} />
        </div>
      </article>
    </div>
  );
}
