import type { ModuleId } from "./curriculum";

export type LabId = "teach-the-machine" | "prompt-lab" | "spot-the-hallucination" | "bias-lab" | "integrity-sim" | "capstone";

export interface Lab {
  id: LabId;
  module: ModuleId;
  number: string;
  title: string;
  blurb: string;
  mission: string;
  objectives: string[];
  minutes: number;
  underTheHood: string[];
}

export const labs: Lab[] = [
  {
    id: "teach-the-machine",
    module: "foundations",
    number: "L1",
    title: "Teach the Machine",
    blurb: "Draw examples, train a real neural network in your browser, and watch it learn.",
    mission: "Teach a neural network to tell your drawings apart. You collect the training data, you press train, and you find out where it breaks.",
    objectives: ["Collect at least 4 drawings for two or more shapes", "Train the network", "Test it on 3 new drawings"],
    minutes: 10,
    underTheHood: [
      "Each drawing is cropped to its ink, centered, and shrunk to a 16 × 16 grid: 256 numbers between 0 and 1. That grid is all the network ever sees.",
      "The network has 256 inputs, one hidden layer of 32 neurons with ReLU activation, and one output per shape. A softmax turns the outputs into percentages.",
      "Training uses stochastic gradient descent on cross-entropy loss, the same recipe as the line-fitting demo, just with about 8,300 numbers to tune instead of 2.",
      "Each drawing you add also gets two slightly shifted copies (data augmentation), so the model learns the shape, not the exact position.",
      "Everything runs in plain TypeScript on your device. Nothing is uploaded.",
    ],
  },
  {
    id: "prompt-lab",
    module: "toolkit",
    number: "L2",
    title: "Prompt Lab",
    blurb: "Write prompts for real school situations and get line-by-line feedback using CRAFT.",
    mission: "Four real student situations. Write the prompt you'd actually send, then see which parts of CRAFT you covered and what the AI would have had to guess.",
    objectives: ["Score 4/5 or better on three different briefs"],
    minutes: 8,
    underTheHood: [
      "The checker isn't an AI. It looks for language patterns that signal each CRAFT part, like “I'm in 10th grade” for context or “in 5 bullet points” for format.",
      "That makes it fast, private, and predictable, but you can fool it. A real AI only does better when the extra words carry real information.",
      "It also checks that your prompt is on topic for the brief, because a well-structured prompt about the wrong thing still fails.",
    ],
  },
  {
    id: "spot-the-hallucination",
    module: "toolkit",
    number: "L3",
    title: "Spot the Hallucination",
    blurb: "Read AI answers with planted mistakes. Flag the false sentences before they fool you.",
    mission: "Each answer below sounds confident. Some sentences are true, some are invented, and one answer is completely fine. Flag what you'd check before trusting it.",
    objectives: ["Catch at least 70% of the false sentences", "Flag no more than 2 true sentences by mistake"],
    minutes: 8,
    underTheHood: [
      "These answers were written by hand to model real hallucination patterns: fake citations, made-up precise numbers, myths repeated as facts, and confident arithmetic errors.",
      "The mistakes sit next to true sentences on purpose. Real hallucinations rarely look wrong. They hide in otherwise good answers.",
      "Every false sentence comes with the method you'd use to check it, because the skill is verifying, not memorizing trivia.",
    ],
  },
  {
    id: "bias-lab",
    module: "ethics",
    number: "L4",
    title: "Bias Lab",
    blurb: "A model screens applicants unfairly. Find out why, then fix the data until it's fair.",
    mission: "A summer coding program trained an AI on past admissions decisions. Students from the Southside keep getting rejected even when they're qualified. Your job: find the cause and fix it.",
    objectives: ["Get the gap in missed qualified students between groups under 5 points", "Keep overall accuracy at 88% or higher"],
    minutes: 12,
    underTheHood: [
      "The applicants are synthetic and generated from a fixed seed. Both neighborhoods have the same distribution of skill scores, so any gap comes from the data and the model.",
      "Past reviewers accepted Southside applicants less often at the same skill level. Those biased decisions became the training labels.",
      "The model is logistic regression trained with gradient descent, retrained live in your browser every time you change a setting.",
      "Prior internships are more common in the Northside, so internship works as a proxy for neighborhood even after the ZIP code is removed.",
      "“Qualified” means a skill score of 60 or higher. The test set is scored against that ground truth, not against the biased past decisions.",
    ],
  },
  {
    id: "integrity-sim",
    module: "ethics",
    number: "L5",
    title: "Integrity Simulator",
    blurb: "Choose your path through realistic AI dilemmas at school, and see where each choice leads.",
    mission: "Four situations real students face. There's no timer and no trick: pick what you'd actually do, see what happens, then try another path.",
    objectives: ["Reach an ending in all four scenarios"],
    minutes: 8,
    underTheHood: [
      "Each scenario is a small decision tree. Outcomes are based on common school AI policies and the integrity principles in Module 03.",
      "Endings are rated as strong, mixed, or risky rather than right or wrong, because real situations involve tradeoffs.",
    ],
  },
  {
    id: "capstone",
    module: "future",
    number: "L6",
    title: "Capstone",
    blurb: "Twelve scenario questions across every module. Pass to become a Neural Architect.",
    mission: "One last challenge covering how AI works, how to use it well, and how to use it responsibly. Most questions are scenarios, not definitions.",
    objectives: ["Score 9 of 12 or better"],
    minutes: 10,
    underTheHood: ["Questions are drawn from all four modules and weighted toward applying ideas to new situations, which is the best test of real understanding."],
  },
];

export const getLab = (id: string) => labs.find((l) => l.id === id);
export const labsFor = (moduleId: ModuleId) => labs.filter((l) => l.module === moduleId);
