export type ModuleId = "foundations" | "toolkit" | "ethics" | "future";

export interface Lesson {
  slug: string;
  title: string;
  minutes: number;
}

export interface Module {
  id: ModuleId;
  number: string;
  title: string;
  kicker: string;
  summary: string;
  tone: "cobalt" | "green" | "plum" | "gold";
  lessons: Lesson[];
  lab: { slug: string; title: string; blurb: string };
  bonus?: boolean;
}

export const modules: Module[] = [
  {
    id: "foundations",
    number: "01",
    title: "How AI Works",
    kicker: "Fundamentals",
    summary:
      "What separates AI, machine learning, and deep learning, how a model learns from data, and why a chatbot is really predicting the next word.",
    tone: "cobalt",
    lessons: [
      { slug: "what-is-ai", title: "What counts as AI?", minutes: 8 },
      { slug: "learning-from-data", title: "Learning from data", minutes: 10 },
      { slug: "neural-networks", title: "Inside a neural network", minutes: 12 },
      { slug: "how-llms-work", title: "How LLMs predict words", minutes: 12 },
      { slug: "limits-of-ai", title: "What AI can’t do", minutes: 8 },
    ],
    lab: {
      slug: "teach-the-machine",
      title: "Teach the Machine",
      blurb: "Train a real image classifier in your browser and watch it learn.",
    },
  },
  {
    id: "toolkit",
    number: "02",
    title: "AI Tools & Techniques",
    kicker: "Practical use",
    summary:
      "Pick the right tool, write prompts that work, and use AI to study smarter without letting it do the thinking for you.",
    tone: "green",
    lessons: [
      { slug: "the-ai-toolbox", title: "The AI toolbox", minutes: 8 },
      { slug: "prompting-101", title: "Prompting 101", minutes: 12 },
      { slug: "studying-with-ai", title: "Studying with AI", minutes: 10 },
      { slug: "verifying-outputs", title: "Checking AI’s work", minutes: 10 },
      { slug: "ai-for-projects", title: "AI for school projects", minutes: 10 },
    ],
    lab: {
      slug: "prompt-lab",
      title: "Prompt Lab",
      blurb: "Build prompts from blocks and get scored on clarity, context, and constraints.",
    },
  },
  {
    id: "ethics",
    number: "03",
    title: "Ethical AI",
    kicker: "Responsible use",
    summary:
      "Where bias comes from, why models make things up, what counts as cheating, and how to cite AI honestly.",
    tone: "plum",
    lessons: [
      { slug: "bias-in-ai", title: "Where bias comes from", minutes: 10 },
      { slug: "hallucinations", title: "Hallucinations & deepfakes", minutes: 10 },
      { slug: "academic-integrity", title: "Academic integrity", minutes: 10 },
      { slug: "citing-ai", title: "Citing AI in MLA & APA", minutes: 8 },
      { slug: "privacy", title: "Privacy & your data", minutes: 8 },
    ],
    lab: {
      slug: "bias-lab",
      title: "Bias Lab",
      blurb: "Train a model on skewed data, see it go wrong, then fix it.",
    },
  },
  {
    id: "future",
    number: "04",
    title: "AI & Your Future",
    kicker: "Bonus",
    summary: "How AI is changing medicine, art, sports, and climate science, and where you fit in.",
    tone: "gold",
    bonus: true,
    lessons: [
      { slug: "ai-across-fields", title: "AI across fields", minutes: 10 },
      { slug: "careers", title: "Careers in AI", minutes: 8 },
      { slug: "keep-learning", title: "Keep learning", minutes: 6 },
    ],
    lab: {
      slug: "capstone",
      title: "Capstone",
      blurb: "One final challenge across everything you learned.",
    },
  },
];

export const lessonKey = (moduleId: ModuleId, lessonSlug: string) => `${moduleId}/${lessonSlug}`;

export const getModule = (id: string) => modules.find((m) => m.id === id);

export const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
