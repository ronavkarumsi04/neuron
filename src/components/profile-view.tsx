"use client";

import { modules, lessonKey, TIERS, totalLessons } from "@/content/curriculum";
import Link from "next/link";
import { BADGES, coreComplete, LEVELS, levelFor, useProgress } from "@/lib/progress";
import { toneVar } from "@/lib/tone";
import { RankCard } from "./rank-card";


export function ProfileView() {
  const { xp, completed, badges, streak, reset } = useProgress();
  const { level, name, next, progress } = levelFor(xp);

  return (
    <div className="mx-auto max-w-5xl px-5 pt-10">
      <p className="label">Progress</p>
      <div className="mt-3 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section aria-labelledby="level">
          <h1 id="level" className="font-display text-5xl tracking-tight">
            Level {level} <span className="text-ink-3">·</span> <em>{name}</em>
          </h1>
          <div className="mt-6">
            <div className="h-2 overflow-hidden rounded-full bg-paper-sunk ring-1 ring-rule" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Progress to next level">
              <div className="h-full rounded-full bg-signal transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
            </div>
            <p className="mt-2 font-mono text-sm text-ink-2 tabular">
              {xp} XP{next ? ` · ${next.xp - xp} to ${next.name}` : " · max level"}
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-rule pt-5">
            {[
              [`${completed.length}/${totalLessons}`, "lessons"],
              [`${badges.length}/${BADGES.length}`, "badges"],
              [`${streak.count}`, `day streak${streak.best ? ` · best ${Math.max(streak.best, streak.count)}` : ""}`],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-4xl leading-none tabular">{n}</dd>
                <dd className="mt-1 text-sm text-ink-3">{l}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="modules-progress">
          <h2 id="modules-progress" className="label border-b border-ink pb-2">By module</h2>
          <ul>
            {modules.map((m) => {
              const n = m.lessons.filter((l) => completed.includes(lessonKey(m.id, l.slug))).length;
              return (
                <li key={m.id} className="flex items-center gap-4 border-b border-rule py-3">
                  <span className="w-6 font-mono text-xs" style={{ color: toneVar(m.tone) }}>{m.number}</span>
                  <span className="flex-1">{m.title} <span className="label ml-1">{TIERS[m.tier].label}</span></span>
                  <span className="flex gap-1" role="img" aria-label={`${n} of ${m.lessons.length} complete`}>
                    {m.lessons.map((l, i) => (
                      <span key={l.slug} className="size-2.5 rounded-full border" style={{ borderColor: toneVar(m.tone), background: i < n ? toneVar(m.tone) : "transparent" }} />
                    ))}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <RankCard />

      <section aria-labelledby="badges" className="mt-14">
        <h2 id="badges" className="label border-b border-ink pb-2">Badge cabinet</h2>
        <ul className="grid grid-cols-2 gap-px bg-rule sm:grid-cols-3 lg:grid-cols-5">
          {BADGES.map((b) => {
            const earned = badges.includes(b.id);
            return (
              <li key={b.id} className="bg-paper p-4">
                <svg aria-hidden viewBox="0 0 24 24" className={`size-7 ${earned ? "text-signal" : "text-rule-strong"}`}>
                  <path d="M12 2l2.6 6.3 6.8.5-5.2 4.4 1.6 6.6L12 16.3 6.2 19.8l1.6-6.6L2.6 8.8l6.8-.5z" fill={earned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <p className={`mt-3 font-medium ${earned ? "" : "text-ink-3"}`}>{b.name}</p>
                <p className="text-xs text-ink-3">{earned ? "Earned" : b.hint}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="levels" className="mt-14">
        <h2 id="levels" className="label border-b border-ink pb-2">Levels</h2>
        <ol className="grid grid-cols-2 gap-x-6 sm:grid-cols-5">
          {LEVELS.map((lv, i) => (
            <li key={lv.name} className={`border-b border-rule py-2 text-sm ${i + 1 <= level ? "text-ink" : "text-ink-3"}`}>
              <span className="font-mono text-xs tabular">{String(i + 1).padStart(2, "0")}</span> {lv.name}
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule pt-5 text-sm">
        <Link href="/certificate" className="text-ink underline underline-offset-4">
          {coreComplete(completed) ? "Get your certificate" : "Certificate: finish Modules 01–03"}
        </Link>
        <Link href="/review" className="text-ink underline underline-offset-4">Spaced review</Link>
        <Link href="/assessment" className="text-ink underline underline-offset-4">Skill check</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-5 text-sm text-ink-3">
        <p>Progress is stored only in this browser. Nothing is sent to a server.</p>
        <button
          type="button"
          onClick={() => { if (confirm("Reset all progress on this device?")) reset(); }}
          className="rounded-sm px-3 py-2 text-ink-2 underline underline-offset-4 hover:text-signal-ink"
        >
          Reset progress
        </button>
      </div>
    </div>
  );
}
