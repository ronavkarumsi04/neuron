"use client";

import { useMemo } from "react";
import { useProgress } from "./progress";
import { rankFor, ratingBreakdown } from "./rank";

export function useRank() {
  const s = useProgress();
  const { completed, xp, badges, streak, quizzes, labs, assessment, memory, reviewsCorrect } = s;
  return useMemo(() => {
    const b = ratingBreakdown({ completed, xp, badges, streak, quizzes, labs, assessment, memory, reviewsCorrect });
    return { ...b, ...rankFor(b.rating) };
  }, [completed, xp, badges, streak, quizzes, labs, assessment, memory, reviewsCorrect]);
}
