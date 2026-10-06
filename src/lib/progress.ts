"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lessonKey, modules, type ModuleId } from "@/content/curriculum";

export const XP = { lesson: 50 } as const;

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
];

export interface Award {
  id: number;
  xp: number;
  badge?: Badge;
  levelUp?: string;
}

interface ProgressState {
  completed: string[];
  xp: number;
  badges: string[];
  streak: { count: number; lastDay: string | null };
  awards: Award[];
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
      completeLesson: (moduleId, lessonSlug) => {
        const key = lessonKey(moduleId, lessonSlug);
        const state = get();
        if (state.completed.includes(key)) return;

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
      reset: () => set({ completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [] }),
    }),
    {
      name: "neuron-progress",
      version: 1,
      skipHydration: true,
      partialize: ({ completed, xp, badges, streak }) => ({ completed, xp, badges, streak }),
    },
  ),
);
