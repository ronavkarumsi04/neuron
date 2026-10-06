"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { lessonKey, modules } from "@/content/curriculum";
import { useProgress, XP, type ProgressState, type QuizResult } from "./progress";

export interface Stop {
  href: string;
  title: string;
  text: string;
  meets: string;
}

export const TOUR: Stop[] = [
  { href: "/", title: "One idea: every lesson is a neuron", text: "Neuron teaches AI by letting students build and break it. Finishing a lesson lights a neuron on their brain map, so progress is the network itself.", meets: "Theme" },
  { href: "/map", title: "The brain map is the progress dashboard", text: "This sample student finished Modules 01–03, so 15 neurons are lit and connected and the bonus module has unlocked. Hover or tab through any node.", meets: "Progress tracking" },
  { href: "/modules/foundations/neural-networks", title: "Every lesson: read, try, prove it", text: "Each of the 18 lessons has a hook, a short explanation, a hands-on widget, takeaways, and a checkpoint quiz. The neuron only lights after you pass it. Try the perceptron below.", meets: "Fundamental concepts" },
  { href: "/labs/teach-the-machine", title: "Train a real neural network", text: "Press “Add 8 sample drawings each,” then “Train network.” That's a real 256→32→3 network learning on this device. Then draw a shape and see if it guesses right.", meets: "Fundamental concepts" },
  { href: "/labs/prompt-lab", title: "Practical prompting, scored", text: "Students write prompts for real school tasks and get a CRAFT score with specific fixes. The checker is honest that it's a pattern checker, not an AI.", meets: "Tools & techniques" },
  { href: "/labs/bias-lab", title: "Find the bias, then fix it", text: "Toggle “Remove ZIP code,” then “Fix the labels.” The model retrains each time. Removing a column or adding data isn't enough; the bias is in the labels.", meets: "Ethical use" },
  { href: "/profile", title: "XP, levels, badges, streaks", text: "Lessons, perfect quizzes, labs, and assessments all earn XP toward 10 levels named after AI concepts. Twelve badges reward mastery and good habits, not just clicking.", meets: "Gamification" },
  { href: "/assessment", title: "Proof that it teaches", text: "A 12-question baseline before Module 01 and the same check after Module 03 show what each student learned, broken down by topic.", meets: "Learning outcomes" },
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
  const core = modules.filter((m) => !m.bonus);
  const completed = core.flatMap((m) => m.lessons.map((l) => lessonKey(m.id, l.slug)));
  const quizzes: Record<string, QuizResult> = {};
  for (const key of completed) quizzes[key] = { best: 0, total: 0, attempts: 1, passed: true };
  const day = new Date().toISOString().slice(0, 10);
  const xp = completed.length * XP.lesson + 5 * XP.perfectQuiz + DEMO_LABS.length * XP.lab + 2 * XP.assessment;
  return {
    completed,
    quizzes,
    xp,
    labs: DEMO_LABS,
    badges: ["first-spark", "foundations-master", "toolkit-master", "ethics-master", "sharp-mind", ...DEMO_LABS],
    streak: { count: 6, lastDay: day },
    awards: [],
    assessment: {
      pre: { score: 5, total: 12, byTopic: { foundations: [2, 4], toolkit: [2, 4], ethics: [1, 4] }, at: day },
      post: { score: 11, total: 12, byTopic: { foundations: [4, 4], toolkit: [3, 4], ethics: [4, 4] }, at: day },
    },
  };
}

const EMPTY: Partial<ProgressState> = { completed: [], xp: 0, badges: [], streak: { count: 0, lastDay: null }, awards: [], quizzes: {}, labs: [], assessment: {} };

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
