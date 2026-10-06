"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getModule, lessonKey, modules, type ModuleId } from "@/content/curriculum";
import { BADGES, levelFor, XP, type Badge } from "./gamification";

export const coreComplete = (completed: string[]) =>
  modules.filter((m) => !m.bonus).every((m) => m.lessons.every((l) => completed.includes(lessonKey(m.id, l.slug))));

export function useModuleLocked(moduleId: ModuleId) {
  return useProgress((s) => !!getModule(moduleId)?.bonus && !coreComplete(s.completed));
}

export { BADGES, LEVELS, levelFor, XP, type Badge } from "./gamification";

export interface Award {
  id: number;
  xp: number;
  badge?: Badge;
  levelUp?: string;
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
  byTopic: Record<string, [number, number]>;
  at: string;
}

export interface ProgressState {
  completed: string[];
  xp: number;
  badges: string[];
  streak: { count: number; lastDay: string | null };
  awards: Award[];
  quizzes: Record<string, QuizResult>;
  labs: string[];
  assessment: { pre?: Attempt; post?: Attempt };
  recordAssessment: (kind: "pre" | "post", attempt: Attempt) => void;
  completeLab: (labId: string) => void;
  recordQuiz: (moduleId: ModuleId, lessonSlug: string, correct: number, total: number, passed: boolean) => void;
  completeLesson: (moduleId: ModuleId, lessonSlug: string) => void;
  dismissAward: (id: number) => void;
  reset: () => void;
}

const today = () => new Date().toISOString().slice(0, 10);
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
        if (getModule(moduleId)?.bonus && !coreComplete(state.completed)) return;

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
          if (m.lessons.every((l) => completed.includes(lessonKey(m.id, l.slug)))) grant(`${m.id}-master`);
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
          xp,
          badges: [...earned],
          streak: { count, lastDay: day },
          awards: [...state.awards, ...awards],
        });
      },
      dismissAward: (id) => set((s) => ({ awards: s.awards.filter((a) => a.id !== id) })),
      reset: () => set({ completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [], quizzes: {}, labs: [], assessment: {} }),
    }),
    {
      name: "neuron-progress",
      version: 4,
      skipHydration: true,
      migrate: (persisted) => {
        const s = persisted as Partial<ProgressState>;
        const quizzes: Record<string, QuizResult> = { ...(s.quizzes ?? {}) };
        for (const key of s.completed ?? []) quizzes[key] ??= { best: 0, total: 0, attempts: 0, passed: true };
        return { ...s, quizzes, labs: s.labs ?? [], assessment: s.assessment ?? {} } as ProgressState;
      },
      partialize: ({ completed, xp, badges, streak, quizzes, labs, assessment }) => ({ completed, xp, badges, streak, quizzes, labs, assessment }),
    },
  ),
);
