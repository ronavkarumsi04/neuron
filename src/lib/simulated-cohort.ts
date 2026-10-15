import { modules, lessonKey } from "@/content/curriculum";
import { labs } from "@/content/labs";
import { ASSESSMENT } from "@/content/assessment";

/**
 * Synthetic, seeded demonstration data. NEVER connect this to production
 * analytics or represent simulated learners as actual Neuron users.
 * No localStorage, network requests, student identities, or persistence.
 */
export type DemoEvent = {
  day: number;
  type: "baseline" | "lesson" | "retry" | "lab" | "review" | "final";
  description: string;
};

export type DemoScore = { correct: number; total: number; weighted: number; maximum: number };

export type DemoLearner = {
  id: string;
  grade: number;
  style: "Explorer" | "Occasional" | "Steady" | "Committed" | "Deep diver";
  lessons: string[];
  labs: string[];
  quizAttempts: number;
  retries: number;
  reviewCount: number;
  activeDays: number;
  lastDay: number;
  pre: DemoScore | null;
  post: DemoScore | null;
  events: DemoEvent[];
};

const STYLES = ["Explorer", "Occasional", "Steady", "Committed", "Deep diver"] as const;
const MAXIMUM = ASSESSMENT.reduce((n, question) => n + question.level, 0);
const TOTAL = ASSESSMENT.length;

function randomSeed(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rand: () => number, low: number, high: number) =>
  low + Math.floor(rand() * (high - low + 1));
const clamp = (v: number, low: number, high: number) => Math.max(low, Math.min(high, v));

function styleFor(r: number): DemoLearner["style"] {
  if (r < 0.17) return "Explorer";
  if (r < 0.44) return "Occasional";
  if (r < 0.77) return "Steady";
  if (r < 0.95) return "Committed";
  return "Deep diver";
}

function targetLessons(rand: () => number, style: DemoLearner["style"]) {
  switch (style) {
    case "Explorer": return between(rand, 0, 2);
    case "Occasional": return between(rand, 2, 8);
    case "Steady": return between(rand, 8, 15);
    case "Committed": return between(rand, 15, 28);
    case "Deep diver": return between(rand, 29, 38);
  }
}

function chooseLessons(rand: () => number, count: number) {
  const beginning = modules.filter((m) => m.tier === "beginner" && !m.bonus);
  const optional = modules.find((m) => m.id === "future");
  const advanced = modules.filter((m) => m.tier !== "beginner");
  // All prerequisite-dependent modules are unlocked in actual curriculum order.
  const ordered = [
    ...beginning,
    ...(count > 15 && optional && rand() < 0.6 ? [optional] : []),
    ...advanced,
  ];
  return ordered.flatMap((module) =>
    module.lessons.map((lesson) => ({
      key: lessonKey(module.id, lesson.slug),
      title: lesson.title,
      moduleId: module.id,
    })),
  ).slice(0, count);
}

function scoreFromDraws(draws: number[], base: number, added: number): DemoScore {
  let correct = 0;
  let weighted = 0;
  for (let i = 0; i < ASSESSMENT.length; i++) {
    const question = ASSESSMENT[i];
    const threshold = clamp(base + added - (question.level - 1) * 0.145, 0.09, 0.92);
    if (draws[i] < threshold) {
      correct++;
      weighted += question.level;
    }
  }
  return { correct, total: TOTAL, weighted, maximum: MAXIMUM };
}

export function generateDemoCohort(size = 120, seed = 20261015): DemoLearner[] {
  if (!Number.isInteger(size) || size < 1 || size > 500) throw new RangeError("Demo cohort size must be 1–500");
  return Array.from({ length: size }, (_, index): DemoLearner => {
    const random = randomSeed(seed + Math.imul(index + 1, 104729));
    const style = styleFor(random());
    const grade = between(random, 9, 12);
    const chosen = chooseLessons(random, targetLessons(random, style));
    const lessons: string[] = [];
    const completedLabs: string[] = [];
    const events: DemoEvent[] = [];
    const days = new Set<number>();
    let quizAttempts = 0;
    let retries = 0;
    let reviewCount = 0;
    const firstDay = between(random, 1, 6);
    days.add(firstDay); // A visit counts as a session even when no activity is finished.
    const preTaken = random() < 0.76;
    const ability = 0.47 + (grade - 9) * 0.035 + (random() - 0.5) * 0.2;
    // Reuse the same per-question draws before/after, modelling partial learning
    // without claiming these are measured human assessment outcomes.
    const draws = ASSESSMENT.map(() => random());
    const pre = preTaken ? scoreFromDraws(draws, ability, 0) : null;
    if (pre) {
      days.add(firstDay);
      events.push({ day: firstDay, type: "baseline", description: "Baseline skill check: " + pre.correct + "/30" });
    }
    let day = firstDay;
    chosen.forEach((lesson, position) => {
      if (position > 0 && (position % 2 === 0 || random() < 0.22)) {
        day += random() < 0.24 ? between(random, 2, 4) : 1;
      }
      day = Math.min(day, 28);
      days.add(day);
      const tries = 1 + (random() < (style === "Explorer" ? 0.52 : 0.27) ? between(random, 1, 2) : 0);
      retries += tries - 1;
      quizAttempts += tries;
      if (tries > 1) events.push({ day, type: "retry", description: "Retried checkpoint for " + lesson.title });
      lessons.push(lesson.key);
      events.push({ day, type: "lesson", description: "Passed checkpoint: " + lesson.title });
      const lab = labs.find((item) => item.module === lesson.moduleId);
      if (lab && !completedLabs.includes(lab.id) && random() < 0.17) {
        completedLabs.push(lab.id);
        events.push({ day, type: "lab", description: "Completed lab: " + lab.title });
      }
      if (position > 1 && random() < 0.13 && day >= firstDay + 3) {
        reviewCount++;
        events.push({ day, type: "review", description: "Revisited an earlier lesson for spaced review" });
      }
    });
    const lastLessonDay = Math.max(day, firstDay);
    const hasPost = !!pre && chosen.length >= 8 && random() < 0.72;
    let post: DemoScore | null = null;
    if (hasPost) {
      const improvement = chosen.length * (0.008 + random() * 0.007);
      // Modest variability can cause a lower result, as with real assessment retakes.
      const noise = (random() - 0.5) * 0.105;
      post = scoreFromDraws(draws, ability, improvement + noise);
      const postDay = Math.min(30, lastLessonDay + 1);
      days.add(postDay);
      events.push({ day: postDay, type: "final", description: "Follow-up skill check: " + post.correct + "/30" });
    }
    // A simulation-only chronological journey; no real visits are produced.
    events.sort((a, b) => a.day - b.day);
    return {
      id: "SIM-" + String(index + 1).padStart(3, "0"),
      grade, style,
      lessons, labs: completedLabs, quizAttempts, retries, reviewCount,
      activeDays: days.size,
      lastDay: Math.max(...days, firstDay),
      pre, post, events,
    };
  });
}

export function summarizeDemoCohort(students: DemoLearner[]) {
  const paired = students.filter((s) => s.pre && s.post);
  const studied = students.filter((s) => s.lessons.length > 0);
  const coreComplete = students.filter((s) =>
    modules.filter((m) => m.tier === "beginner" && !m.bonus).every((m) =>
      m.lessons.every((l) => s.lessons.includes(lessonKey(m.id, l.slug))),
    ),
  ).length;
  return {
    cohort: students.length,
    studied: studied.length,
    repeatDays: students.filter((s) => s.activeDays >= 2).length,
    checkpoints: students.reduce((n, s) => n + s.lessons.length, 0),
    labCompletions: students.reduce((n, s) => n + s.labs.length, 0),
    retries: students.reduce((n, s) => n + s.retries, 0),
    coreComplete,
    paired: paired.length,
    pairedGain: paired.length ? paired.reduce((n, s) => n + (s.post!.weighted - s.pre!.weighted), 0) / paired.length : null,
  };
}

export const DEMO_STYLES = STYLES;
