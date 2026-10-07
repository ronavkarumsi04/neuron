"use client";

import Link from "next/link";
import { levelFor, useProgress } from "@/lib/progress";
import { useRank } from "@/lib/use-rank";
import { RankEmblem } from "./rank-emblem";

export function XpMeter() {
  const xp = useProgress((s) => s.xp);
  const streak = useProgress((s) => s.streak.count);
  const { level, name, next, progress } = levelFor(xp);
  const { rank, division, rating } = useRank();

  return (
    <Link
      href="/profile"
      className="group flex items-center gap-3 rounded-sm px-2 py-1.5 transition-colors duration-150 hover:bg-paper-sunk"
      aria-label={`Rank ${rank.name}${division ? `, division ${division}` : ""}, rating ${rating}. Level ${level}, ${name}. ${xp} experience points.${streak ? ` ${streak} day streak.` : ""} View progress.`}
    >
      <RankEmblem rank={rank} className="h-7 w-6 shrink-0" />
      <span className="hidden text-right sm:block">
        <span className="label block leading-none">Lv {level}</span>
        <span className="block text-xs leading-tight text-ink-2">{name}</span>
      </span>
      <span className="flex flex-col gap-1">
        <span className="relative block h-1.5 w-20 overflow-hidden rounded-full bg-paper-sunk ring-1 ring-rule">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-signal transition-[width] duration-500 ease-[var(--ease-out)]"
            style={{ width: `${Math.max(4, progress * 100)}%` }}
          />
        </span>
        <span className="font-mono text-[0.625rem] leading-none text-ink-3 tabular">
          {xp}
          {next ? ` / ${next.xp}` : ""} XP
        </span>
      </span>
      {streak > 0 && (
        <span className="font-mono text-xs text-signal-ink tabular" aria-hidden>
          {streak}d
        </span>
      )}
    </Link>
  );
}
