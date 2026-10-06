export const XP = { lesson: 50, perfectQuiz: 20, lab: 100, assessment: 25 } as const;

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
