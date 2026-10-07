"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { coreModules, getModule, moduleComplete, moduleUnlocked, modules, lessonKey, type ModuleId } from "@/content/curriculum";
import { BADGES, levelFor, XP, type Badge } from "./gamification";
import { INTERVALS, today, type Memory } from "./memory";

export const coreComplete = (completed: string[]) => coreModules.every((m) => moduleComplete(m, completed));

export function useModuleLocked(moduleId: ModuleId) {
  return useProgress((s) => {
    const m = getModule(moduleId);
    return !!m && !moduleUnlocked(m, s.completed);
  });
}

export { BADGES, LEVELS, levelFor, XP, type Badge } from "./gamification";

export interface Award {
  id: number;
  xp: number;
  badge?: Badge;
  levelUp?: string;
  rank?: { name: string; up: boolean };
}

export interface QuizResult {
  best: number;
  total: number;
  attempts: number;
  passed: boolean;
}

export interface Attempt {
  score: number;
  total: number;
  /** Difficulty-weighted points: beginner questions are worth 1, expert questions 4. */
  points: number;
  max: number;
  byTopic: Record<string, [number, number]>;
  byLevel: Record<string, [number, number]>;
  at: string;
}

export interface ProgressState {
  completed: string[];
  xp: number;
  badges: string[];
  streak: { count: number; lastDay: string | null; best?: number };
  awards: Award[];
  quizzes: Record<string, QuizResult>;
  labs: string[];
  assessment: { pre?: Attempt; post?: Attempt };
  memory: Record<string, Memory>;
  reviewsCorrect: number;
  reviewLesson: (key: string, correct: boolean) => void;
  recordAssessment: (kind: "pre" | "post", attempt: Attempt) => void;
  completeLab: (labId: string) => void;
  recordQuiz: (moduleId: ModuleId, lessonSlug: string, correct: number, total: number, passed: boolean) => void;
  completeLesson: (moduleId: ModuleId, lessonSlug: string) => void;
  dismissAward: (id: number) => void;
  grantBadge: (id: string) => void;
  pushAward: (award: Omit<Award, "id">) => void;
  reset: () => void;
}

const dayDiff = (a: string, b: string) =>
  Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);

let awardId = 0;

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      xp: 0,
      badges: [],
      streak: { count: 0, lastDay: null },
      awards: [],
      quizzes: {},
      labs: [],
      assessment: {},
      memory: {},
      reviewsCorrect: 0,
      reviewLesson: (key, correct) => {
        const state = get();
        const prev = state.memory[key];
        if (!prev) return;
        const memory = { ...state.memory, [key]: { last: today(), step: correct ? Math.min(prev.step + 1, INTERVALS.length - 1) : 0 } };
        if (!correct) return set({ memory });
        const xp = state.xp + XP.review;
        const reviewsCorrect = state.reviewsCorrect + 1;
        const before = levelFor(state.xp).level;
        const after = levelFor(xp);
        const awards: Award[] = [{ id: ++awardId, xp: XP.review, levelUp: after.level > before ? after.name : undefined }];
        const badges = [...state.badges];
        if (reviewsCorrect >= 10 && !badges.includes("memory-keeper")) {
          badges.push("memory-keeper");
          awards.push({ id: ++awardId, xp: 0, badge: BADGES.find((b) => b.id === "memory-keeper") });
        }
        set({ memory, xp, reviewsCorrect, badges, awards: [...state.awards, ...awards] });
      },
      recordAssessment: (kind, attempt) => {
        const state = get();
        const assessment = { ...state.assessment, [kind]: attempt };
        if (state.assessment[kind]) return set({ assessment });
        const xp = state.xp + XP.assessment;
        const before = levelFor(state.xp).level;
        const after = levelFor(xp);
        set({
          assessment,
          xp,
          awards: [...state.awards, { id: ++awardId, xp: XP.assessment, levelUp: after.level > before ? after.name : undefined }],
        });
      },
      completeLab: (labId) => {
        const state = get();
        if (state.labs.includes(labId)) return;
        const xp = state.xp + XP.lab;
        const before = levelFor(state.xp).level;
        const after = levelFor(xp);
        const badge = BADGES.find((b) => b.id === labId);
        const awards: Award[] = [{ id: ++awardId, xp: XP.lab, levelUp: after.level > before ? after.name : undefined }];
        if (badge) awards.push({ id: ++awardId, xp: 0, badge });
        set({
          labs: [...state.labs, labId],
          xp,
          badges: badge && !state.badges.includes(badge.id) ? [...state.badges, badge.id] : state.badges,
          awards: [...state.awards, ...awards],
        });
      },
      recordQuiz: (moduleId, lessonSlug, correct, total, passed) => {
        const key = lessonKey(moduleId, lessonSlug);
        const state = get();
        const mod = getModule(moduleId);
        if (!mod || !moduleUnlocked(mod, state.completed)) return;
        const prev = state.quizzes[key];
        const result: QuizResult = {
          best: Math.max(prev?.best ?? 0, correct),
          total,
          attempts: (prev?.attempts ?? 0) + 1,
          passed: !!prev?.passed || passed,
        };
        const quizzes = { ...state.quizzes, [key]: result };
        if (prev || correct < total) return set({ quizzes });

        const xp = state.xp + XP.perfectQuiz;
        const before = levelFor(state.xp).level;
        const after = levelFor(xp);
        const awards: Award[] = [{ id: ++awardId, xp: XP.perfectQuiz, levelUp: after.level > before ? after.name : undefined }];
        const badges = [...state.badges];
        const aced = Object.values(quizzes).filter((q) => q.attempts === 1 && q.best === q.total).length;
        if (aced >= 5 && !badges.includes("sharp-mind")) {
          badges.push("sharp-mind");
          awards.push({ id: ++awardId, xp: 0, badge: BADGES.find((b) => b.id === "sharp-mind") });
        }
        set({ quizzes, xp, badges, awards: [...state.awards, ...awards] });
      },
      completeLesson: (moduleId, lessonSlug) => {
        const key = lessonKey(moduleId, lessonSlug);
        const state = get();
        if (state.completed.includes(key)) return;
        if (!state.quizzes[key]?.passed) return;
        const mod = getModule(moduleId);
        if (!mod || !moduleUnlocked(mod, state.completed)) return;

        const completed = [...state.completed, key];
        const xp = state.xp + XP.lesson;
        const earned = new Set(state.badges);
        const fresh: Badge[] = [];
        const grant = (id: string) => {
          if (earned.has(id)) return;
          earned.add(id);
          const badge = BADGES.find((b) => b.id === id);
          if (badge) fresh.push(badge);
        };

        grant("first-spark");
        for (const m of modules) {
          if (m.bonus) continue;
          if (moduleComplete(m, completed)) grant(`${m.id}-master`);
        }

        const day = today();
        const last = state.streak.lastDay;
        const count = last === day ? state.streak.count : last && dayDiff(last, day) === 1 ? state.streak.count + 1 : 1;
        if (count >= 7) grant("on-fire");

        const before = levelFor(state.xp).level;
        const after = levelFor(xp);
        const awards: Award[] = [{ id: ++awardId, xp: XP.lesson, levelUp: after.level > before ? after.name : undefined }];
        for (const badge of fresh) awards.push({ id: ++awardId, xp: 0, badge });

        set({
          completed,
          memory: { ...state.memory, [key]: { last: day, step: 0 } },
          xp,
          badges: [...earned],
          streak: { count, lastDay: day, best: Math.max(count, state.streak.best ?? 0) },
          awards: [...state.awards, ...awards],
        });
      },
      grantBadge: (id) => {
        const state = get();
        const badge = BADGES.find((b) => b.id === id);
        if (!badge || state.badges.includes(id)) return;
        set({ badges: [...state.badges, id], awards: [...state.awards, { id: ++awardId, xp: 0, badge }] });
      },
      pushAward: (award) => set((s) => ({ awards: [...s.awards, { ...award, id: ++awardId }] })),
      dismissAward: (id) => set((s) => ({ awards: s.awards.filter((a) => a.id !== id) })),
      reset: () => set({ completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [], quizzes: {}, labs: [], assessment: {}, memory: {}, reviewsCorrect: 0 }),
    }),
    {
      name: "neuron-progress",
      version: 6,
      skipHydration: true,
      migrate: (persisted, version) => {
        const s = persisted as Partial<ProgressState>;
        // v6 replaced the 12-question skill check with a harder, difficulty-weighted one; old scores aren't comparable.
        if (version < 6) s.assessment = {};
        const quizzes: Record<string, QuizResult> = { ...(s.quizzes ?? {}) };
        for (const key of s.completed ?? []) quizzes[key] ??= { best: 0, total: 0, attempts: 0, passed: true };
        const memory: Record<string, Memory> = { ...(s.memory ?? {}) };
        for (const key of s.completed ?? []) memory[key] ??= { last: s.streak?.lastDay ?? today(), step: 0 };
        return { ...s, quizzes, memory, reviewsCorrect: s.reviewsCorrect ?? 0, labs: s.labs ?? [], assessment: s.assessment ?? {} } as ProgressState;
      },
      partialize: ({ completed, xp, badges, streak, quizzes, labs, assessment, memory, reviewsCorrect }) => ({
        completed, xp, badges, streak, quizzes, labs, assessment, memory, reviewsCorrect,
      }),
    },
  ),
);
