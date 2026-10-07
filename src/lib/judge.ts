"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { lessonKey, modules, totalLessons } from "@/content/curriculum";
import { LEVELS } from "./gamification";
import { shiftDay, type Memory } from "./memory";
import { useProgress, XP, type ProgressState, type QuizResult } from "./progress";

export interface Stop {
  href: string;
  title: string;
  text: string;
  meets: string;
}

export const TOUR: Stop[] = [
  { href: "/", title: "One idea: every lesson is a neuron", text: "Neuron teaches AI by letting students build and break it. Finishing a lesson lights a neuron on their brain map, so progress is the network itself.", meets: "Theme" },
  { href: "/map", title: "The brain map is the progress dashboard", text: "This sample student finished Modules 01–03, so 15 neurons are lit and the bonus module has unlocked. Pale neurons with dashed rings are fading: the student hasn't reviewed them in a while.", meets: "Progress tracking" },
  { href: "/review", title: "Neurons fade unless you review", text: "Finished lessons dim over days, like real memories. One correct answer relights a neuron and pushes its next review further out (3, 7, 14, 30, 60 days). It's spaced repetition, built into the map.", meets: "Engagement" },
  { href: "/modules/foundations/neural-networks", title: "Every lesson: read, try, prove it", text: `Each of the ${totalLessons} lessons has a hook, a short explanation, a hands-on widget, takeaways, and a checkpoint quiz. The neuron only lights after you pass it. Try the perceptron below.`, meets: "Fundamental concepts" },
  { href: "/modules/deep-learning/backprop-by-hand", title: "From beginner to expert", text: "Finishing the core unlocks a four-module advanced track, each module gated on the last: backprop by hand, attention, how weights are stored on disk, quantization, and how to build and secure an AI agent. Step the network below and watch every gradient.", meets: "Depth" },
  { href: "/labs/teach-the-machine", title: "Train a real neural network", text: "Press “Add 8 sample drawings each,” then “Train network.” That's a real 256→32→3 network learning on this device. Then draw a shape and see if it guesses right.", meets: "Fundamental concepts" },
  { href: "/labs/prompt-lab", title: "Practical prompting, scored", text: "Students write prompts for real school tasks and get a CRAFT score with specific fixes. The checker is honest that it's a pattern checker, not an AI.", meets: "Tools & techniques" },
  { href: "/labs/bias-lab", title: "Find the bias, then fix it", text: "Toggle “Remove ZIP code,” then “Fix the labels.” The model retrains each time. Removing a column or adding data isn't enough; the bias is in the labels.", meets: "Ethical use" },
  { href: "/profile", title: "Ranks, XP, badges, streaks", text: `XP climbs ${LEVELS.length} levels named after AI concepts. Separately, a competitive rank from Bronze I to Supersonic Legend weighs harder lessons, first-try accuracy, streaks, reviews, and the skill check, and drops if neurons fade.`, meets: "Gamification" },
  { href: "/assessment", title: "Proof that it teaches", text: "30 questions in four levels, beginner to expert, weighted by difficulty. The same check before and after shows what each student learned by topic and how far up the difficulty ladder they can go.", meets: "Learning outcomes" },
  { href: "/judge", title: "Every requirement, mapped", text: "This page links each requirement to where it's met. Ending the tour puts back whatever progress was on this device before.", meets: "Summary" },
];

interface JudgeState {
  active: boolean;
  step: number;
  minimized: boolean;
  backup: string | null;
  start: () => void;
  go: (step: number) => void;
  setMinimized: (v: boolean) => void;
  exit: () => void;
}

const DEMO_LABS = ["teach-the-machine", "prompt-lab", "spot-the-hallucination"];

function demoProgress(): Partial<ProgressState> {
  const core = modules.filter((m) => m.tier === "beginner" && !m.bonus);
  const completed = core.flatMap((m) => m.lessons.map((l) => lessonKey(m.id, l.slug)));
  const quizzes: Record<string, QuizResult> = {};
  completed.forEach((key, i) => (quizzes[key] = { best: i % 3 === 2 ? 2 : 3, total: 3, attempts: i % 5 === 4 ? 2 : 1, passed: true }));
  const day = new Date().toISOString().slice(0, 10);
  const memory: Record<string, Memory> = {};
  completed.forEach((key, i) => {
    memory[key] = i < 3 ? { last: shiftDay(day, -8), step: 0 } : i < 6 ? { last: shiftDay(day, -4), step: 0 } : { last: shiftDay(day, -2), step: 1 };
  });
  const xp = completed.length * XP.lesson + 5 * XP.perfectQuiz + DEMO_LABS.length * XP.lab + 2 * XP.assessment;
  return {
    completed,
    quizzes,
    xp,
    labs: DEMO_LABS,
    badges: ["first-spark", "foundations-master", "toolkit-master", "ethics-master", "sharp-mind", ...DEMO_LABS],
    streak: { count: 6, lastDay: day, best: 9 },
    awards: [],
    memory,
    reviewsCorrect: 4,
    assessment: {
      pre: { score: 11, total: 30, points: 18, max: 73, byTopic: { foundations: [3, 5], toolkit: [2, 3], ethics: [3, 3], deep: [2, 6], llm: [1, 6], systems: [0, 7] }, byLevel: { 1: [6, 8], 2: [3, 8], 3: [2, 7], 4: [0, 7] }, at: day },
      post: { score: 22, total: 30, points: 48, max: 73, byTopic: { foundations: [5, 5], toolkit: [3, 3], ethics: [3, 3], deep: [5, 6], llm: [4, 6], systems: [2, 7] }, byLevel: { 1: [8, 8], 2: [7, 8], 3: [5, 7], 4: [2, 7] }, at: day },
    },
  };
}

const EMPTY: Partial<ProgressState> = { completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [], quizzes: {}, labs: [], assessment: {}, memory: {}, reviewsCorrect: 0 };

export const useJudge = create<JudgeState>()(
  persist(
    (set, get) => ({
      active: false,
      step: 0,
      minimized: false,
      backup: null,
      start: () => {
        const backup = get().active ? get().backup : localStorage.getItem("neuron-progress");
        useProgress.setState(demoProgress());
        set({ active: true, step: 0, minimized: false, backup });
      },
      go: (step) => set({ step: Math.max(0, Math.min(TOUR.length - 1, step)), minimized: false }),
      setMinimized: (minimized) => set({ minimized }),
      exit: () => {
        const { backup } = get();
        let restored = EMPTY;
        try {
          if (backup) restored = { ...EMPTY, ...JSON.parse(backup).state, awards: [] };
        } catch {}
        useProgress.setState(restored);
        set({ active: false, step: 0, backup: null });
      },
    }),
    { name: "neuron-judge", storage: createJSONStorage(() => sessionStorage), skipHydration: true },
  ),
);
