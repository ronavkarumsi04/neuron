"use client";

import { useEffect, useRef, useState } from "react";
import { useJudge } from "@/lib/judge";
import { useProgress } from "@/lib/progress";
import { RANK_BADGES, RANKS } from "@/lib/rank";
import { useRank } from "@/lib/use-rank";

const KEY = "neuron-rank";

/** Announces promotions and demotions, and grants rank badges. Skips the first render and Judge Mode swaps. */
export function RankWatcher() {
  const { index, rank } = useRank();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (useProgress.persist.hasHydrated()) setHydrated(true);
    return useProgress.persist.onFinishHydration(() => setHydrated(true));
  }, []);
  const judging = useJudge((s) => s.active);
  const pushAward = useProgress((s) => s.pushAward);
  const grantBadge = useProgress((s) => s.grantBadge);
  const prev = useRef<number | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (judging) {
      prev.current = index;
      return;
    }
    const stored = Number(localStorage.getItem(KEY) ?? index);
    const before = prev.current ?? stored;
    prev.current = index;
    localStorage.setItem(KEY, String(index));
    if (index !== before) pushAward({ xp: 0, rank: { name: rank.name, up: index > before } });
    for (const rb of RANK_BADGES) {
      const at = RANKS.findIndex((r) => r.tier === rb.from);
      if (index >= at) grantBadge(rb.badge);
    }
  }, [index, rank.name, hydrated, judging, pushAward, grantBadge]);

  return null;
}
