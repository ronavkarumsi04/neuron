"use client";

import { RANK_COLOR, RANKS } from "@/lib/rank";
import { useRank } from "@/lib/use-rank";
import { RankEmblem } from "./rank-emblem";

export function RankCard() {
  const { rank, next, division, progress, rating, parts, index } = useRank();
  const color = RANK_COLOR[rank.tier];
  const tiers = RANKS.filter((r) => r.sub <= 1);

  return (
    <section aria-labelledby="rank-h" className="mt-14 rounded-md border border-rule-strong bg-paper-raised">
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-5 py-3">
        <h2 id="rank-h" className="label">Competitive rank</h2>
        <span className="font-mono text-xs text-ink-3 tabular">Rating {rating}</span>
      </header>
      <div className="grid gap-8 p-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div>
          <div className="flex items-center gap-4">
            <RankEmblem rank={rank} className="h-20 w-[4.25rem] shrink-0" />
            <div>
              <p className="font-display text-4xl leading-none" style={{ color }}>{rank.name}</p>
              {division && <p className="mt-1 font-mono text-sm text-ink-2">Division {division}</p>}
            </div>
          </div>
          <div className="mt-5">
            <div className="h-2 overflow-hidden rounded-full bg-paper-sunk ring-1 ring-rule" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label={next ? `Progress to ${next.name}` : "Top rank reached"}>
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${progress * 100}%`, background: color }} />
            </div>
            <p className="mt-2 font-mono text-xs text-ink-3 tabular">{next ? `${next.min - rating} to ${next.name}` : "Top of the ladder"}</p>
          </div>
          <ol aria-label="Rank ladder" className="mt-6 flex flex-wrap gap-1.5">
            {tiers.map((r) => {
              const reached = RANKS.findIndex((x) => x === r) <= index;
              return (
                <li key={r.tier} title={`${r.tierName} from ${r.min}`} className="flex flex-col items-center gap-1">
                  <RankEmblem rank={r} className={`h-7 w-6 ${reached ? "" : "opacity-30 grayscale"}`} />
                  <span className="sr-only">{r.tierName}, from rating {r.min}{reached ? ", reached" : ""}</span>
                </li>
              );
            })}
          </ol>
        </div>
        <div>
          <p className="text-sm text-ink-2">Your rank isn&apos;t just XP. It weighs what you actually know: harder lessons count more, first-try quiz accuracy counts, and fading neurons pull your rating down until you review them.</p>
          <table className="mt-4 w-full text-sm">
            <caption className="sr-only">What makes up your rating</caption>
            <thead className="sr-only"><tr><th scope="col">Source</th><th scope="col">Points</th></tr></thead>
            <tbody>
              {parts.map((p) => (
                <tr key={p.id} className="border-t border-rule">
                  <th scope="row" className="w-36 py-2.5 pr-3 text-left align-top font-normal text-ink">{p.label}</th>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper-sunk"><span className="block h-full rounded-full bg-ink-2" style={{ width: `${(p.value / p.max) * 100}%` }} /></span>
                      <span className="w-16 text-right font-mono text-xs text-ink-2 tabular">{p.value}/{p.max}</span>
                    </div>
                    <p className="mt-1 text-xs text-ink-3">{p.tip}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
