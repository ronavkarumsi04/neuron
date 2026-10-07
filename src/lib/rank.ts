import { lessonKey, modules, TIERS, type ModuleId } from "@/content/curriculum";
import { retention, today, type Memory } from "./memory";

/** The slice of progress the rating depends on. Kept separate so it stays pure and testable. */
export interface RatingInput {
  completed: string[];
  xp: number;
  badges: string[];
  streak: { count: number; lastDay: string | null; best?: number };
  quizzes: Record<string, { best: number; total: number; attempts: number; passed: boolean }>;
  labs: string[];
  assessment: { pre?: { points?: number; max?: number }; post?: { points?: number; max?: number } };
  memory: Record<string, Memory>;
  reviewsCorrect: number;
}

export interface Component {
  id: string;
  label: string;
  value: number;
  max: number;
  tip: string;
}

/** Points per lesson grow with difficulty, so expert lessons move the needle most. */
const LESSON_POINTS: Record<number, number> = { 1: 20, 2: 32, 3: 44, 4: 56 };

const moduleOf = (key: string) => modules.find((m) => m.id === (key.split("/")[0] as ModuleId));

export function ratingBreakdown(s: RatingInput, now = today()): { rating: number; parts: Component[] } {
  let mastery = 0;
  let masteryMax = 0;
  let decay = 0;
  for (const m of modules)
    for (const l of m.lessons) {
      const pts = LESSON_POINTS[TIERS[m.tier].n];
      masteryMax += pts;
      const key = lessonKey(m.id, l.slug);
      if (!s.completed.includes(key)) continue;
      // A lesson keeps 60% of its value forever; the other 40% depends on how fresh it is.
      const keep = 0.6 + 0.4 * retention(s.memory[key], now);
      mastery += pts * keep;
      decay += pts * (1 - keep);
    }

  const done = s.completed.filter((k) => moduleOf(k));
  const aced = done.filter((k) => {
    const q = s.quizzes[k];
    return q && q.attempts === 1 && q.total > 0 && q.best === q.total;
  }).length;
  const precision = done.length ? (aced / done.length) * Math.min(1, done.length / 10) : 0;

  const check = s.assessment.post ?? s.assessment.pre;
  const checkPct = check?.points && check.max ? check.points / check.max : 0;
  const checkWeight = s.assessment.post ? 220 : 120;

  const best = Math.max(s.streak.best ?? 0, s.streak.count);
  const alive = s.streak.lastDay && Math.round((Date.parse(now) - Date.parse(s.streak.lastDay)) / 86_400_000) <= 1 ? s.streak.count : 0;

  const parts: Component[] = [
    { id: "mastery", label: "Course mastery", value: mastery, max: masteryMax, tip: decay > 1 ? `Fading neurons are costing you ${Math.round(decay)} points. Review them to win them back.` : "Finish lessons. Higher tiers are worth more: 20 points for beginner up to 56 for expert." },
    { id: "precision", label: "Quiz precision", value: precision * 160, max: 160, tip: "Ace checkpoints on the first try. Counts fully once you've finished 10 lessons." },
    { id: "labs", label: "Labs", value: s.labs.length * 25, max: 150, tip: "Each completed lab is worth 25." },
    { id: "skill", label: "Skill check", value: checkPct * checkWeight, max: 220, tip: s.assessment.post ? "Your latest after-check score, weighted by question difficulty." : "Your baseline counts a little. The after-check counts almost twice as much." },
    { id: "streak", label: "Streaks", value: Math.min(best, 30) * 4 + Math.min(alive, 30) * 2, max: 180, tip: "Best streak (up to 30 days) plus your live streak. A broken streak loses the live half." },
    { id: "review", label: "Spaced review", value: Math.min(s.reviewsCorrect, 50) * 2, max: 100, tip: "Each correct review answer is worth 2, up to 50 answers." },
    { id: "xp", label: "Experience", value: Math.min(Math.sqrt(s.xp) * 2.4, 160), max: 160, tip: "Total XP, with diminishing returns so grinding one thing doesn't carry you." },
    { id: "badges", label: "Badges", value: s.badges.filter((b) => !b.startsWith("rank-")).length * 6, max: 132, tip: "6 per badge. Rank badges don't count toward your own rank." },
  ];
  for (const p of parts) p.value = Math.round(Math.max(0, Math.min(p.max, p.value)));
  return { rating: parts.reduce((n, p) => n + p.value, 0), parts };
}

export type RankTier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "champion" | "grand-champion" | "ssl";

export interface Rank {
  tier: RankTier;
  tierName: string;
  sub: number; // 1–3, or 0 for Supersonic Legend
  name: string;
  min: number;
}

const TIER_NAMES: [RankTier, string][] = [
  ["bronze", "Bronze"],
  ["silver", "Silver"],
  ["gold", "Gold"],
  ["platinum", "Platinum"],
  ["diamond", "Diamond"],
  ["champion", "Champion"],
  ["grand-champion", "Grand Champion"],
];

/** Gaps widen as you climb, the way competitive ladders get harder at the top. */
const THRESHOLDS = [0, 40, 85, 135, 190, 250, 315, 385, 460, 540, 625, 715, 810, 910, 1015, 1125, 1240, 1360, 1485, 1615, 1750, 1900];

export const RANKS: Rank[] = [
  ...TIER_NAMES.flatMap(([tier, tierName], t) =>
    [1, 2, 3].map((sub) => ({ tier, tierName, sub, name: `${tierName} ${"I".repeat(sub)}`, min: THRESHOLDS[t * 3 + sub - 1] })),
  ),
  { tier: "ssl", tierName: "Supersonic Legend", sub: 0, name: "Supersonic Legend", min: THRESHOLDS[21] },
];

export const DIVISIONS = ["I", "II", "III", "IV"] as const;

export function rankFor(rating: number) {
  let i = 0;
  for (let j = 0; j < RANKS.length; j++) if (rating >= RANKS[j].min) i = j;
  const rank = RANKS[i];
  const next = RANKS[i + 1];
  const span = next ? next.min - rank.min : 1;
  const into = next ? rating - rank.min : 1;
  const division = next ? Math.min(3, Math.floor((into / span) * 4)) : 0;
  return { index: i, rank, next, division: next ? DIVISIONS[division] : null, progress: Math.min(1, into / span) };
}

export const RANK_COLOR: Record<RankTier, string> = {
  bronze: "#a8642f",
  silver: "#8b929b",
  gold: "#c9971c",
  platinum: "#2f9aa6",
  diamond: "#3d6fe0",
  champion: "#9b4fd6",
  "grand-champion": "#d23a2c",
  ssl: "var(--ink)",
};

/** Ranks that hand out a badge the first time you reach them. */
export const RANK_BADGES: { from: RankTier; badge: string }[] = [
  { from: "platinum", badge: "rank-platinum" },
  { from: "champion", badge: "rank-champion" },
  { from: "ssl", badge: "rank-ssl" },
];
