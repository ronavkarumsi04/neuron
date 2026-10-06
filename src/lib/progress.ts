"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getModule, lessonKey, modules, type ModuleId } from "@/content/curriculum";

export const coreComplete = (completed: string[]) =>
  modules.filter((m) => !m.bonus).every((m) => m.lessons.every((l) => completed.includes(lessonKey(m.id, l.slug))));

export function useModuleLocked(moduleId: ModuleId) {
  return useProgress((s) => !!getModule(moduleId)?.bonus && !coreComplete(s.completed));
}

export const XP = { lesson: 50, perfectQuiz: 20, lab: 100 } as const;

export const LEVELS = [
  { name: "Novice Node", xp: 0 },
  { name: "Perceptron", xp: 100 },
  { name: "Hidden Layer", xp: 250 },
  { name: "Activation", xp: 450 },
  { name: "Backprop", xp: 700 },
  { name: "Deep Learner", xp: 1000 },
  { name: "Transformer", xp: 1350 },
  { name: "Attention Head", xp: 1750 },
  { name: "Foundation Model", xp: 2200 },
  { name: "Neural Architect", xp: 2700 },
] as const;

export function levelFor(xp: number) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) index = i;
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  const span = next ? next.xp - current.xp : 1;
  const into = next ? xp - current.xp : 1;
  return { level: index + 1, name: current.name, next, progress: Math.min(1, into / span) };
}

export interface Badge {
  id: string;
  name: string;
  hint: string;
}

export const BADGES: Badge[] = [
  { id: "first-spark", name: "First Spark", hint: "Finish your first lesson" },
  { id: "foundations-master", name: "Fundamentals Master", hint: "Finish every lesson in Module 01" },
  { id: "toolkit-master", name: "Tools Master", hint: "Finish every lesson in Module 02" },
  { id: "ethics-master", name: "Ethics Master", hint: "Finish every lesson in Module 03" },
  { id: "on-fire", name: "On Fire", hint: "Keep a 7-day streak" },
  { id: "sharp-mind", name: "Sharp Mind", hint: "Ace five checkpoint quizzes on the first try" },
  { id: "teach-the-machine", name: "Machine Teacher", hint: "Train and test your own classifier" },
  { id: "prompt-lab", name: "Prompt Smith", hint: "Score 4/5 or better on three Prompt Lab briefs" },
  { id: "spot-the-hallucination", name: "Fact Checker", hint: "Catch the hallucinations in Spot the Hallucination" },
  { id: "bias-lab", name: "Bias Buster", hint: "Close the fairness gap in the Bias Lab" },
  { id: "integrity-sim", name: "Straight Shooter", hint: "Finish every Integrity Simulator scenario" },
  { id: "capstone", name: "Neural Architect", hint: "Pass the Capstone challenge" },
];

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

interface ProgressState {
  completed: string[];
  xp: number;
  badges: string[];
  streak: { count: number; lastDay: string | null };
  awards: Award[];
  quizzes: Record<string, QuizResult>;
  labs: string[];
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
      reset: () => set({ completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [], quizzes: {}, labs: [] }),
    }),
    {
      name: "neuron-progress",
      version: 3,
      skipHydration: true,
      migrate: (persisted) => {
        const s = persisted as Partial<ProgressState>;
        const quizzes: Record<string, QuizResult> = { ...(s.quizzes ?? {}) };
        for (const key of s.completed ?? []) quizzes[key] ??= { best: 0, total: 0, attempts: 0, passed: true };
        return { ...s, quizzes, labs: s.labs ?? [] } as ProgressState;
      },
      partialize: ({ completed, xp, badges, streak, quizzes, labs }) => ({ completed, xp, badges, streak, quizzes, labs }),
    },
  ),
);
