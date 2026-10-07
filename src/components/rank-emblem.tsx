import { RANK_COLOR, type Rank } from "@/lib/rank";

/** Shield emblem: chevrons count the sub-rank (I–III); the top rank gets a star. */
export function RankEmblem({ rank, className }: { rank: Rank; className?: string }) {
  const c = RANK_COLOR[rank.tier];
  const tierIndex = ["bronze", "silver", "gold", "platinum", "diamond", "champion", "grand-champion", "ssl"].indexOf(rank.tier);
  return (
    <svg viewBox="0 0 48 56" aria-hidden className={className}>
      <path d="M24 2 44 9v18c0 13-9 22-20 27C13 49 4 40 4 27V9z" fill="var(--paper-raised)" stroke={c} strokeWidth="2.5" />
      {tierIndex >= 4 && <path d="M24 7 39 12.5v14.5c0 10-6.5 17-15 21-8.5-4-15-11-15-21V12.5z" fill="none" stroke={c} strokeWidth="1" strokeOpacity="0.55" />}
      {rank.sub === 0 ? (
        <path d="M24 15l3.4 7.6 8.1.7-6.1 5.4 1.8 8L24 32.6l-7.2 4.1 1.8-8-6.1-5.4 8.1-.7z" fill={c} />
      ) : (
        Array.from({ length: rank.sub }, (_, i) => (
          <path key={i} d={`M14 ${37 - i * 8} 24 ${29 - i * 8} 34 ${37 - i * 8}`} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        ))
      )}
    </svg>
  );
}
