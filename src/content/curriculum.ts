export type ModuleId = "foundations" | "toolkit" | "ethics" | "future" | "deep-learning" | "transformers" | "model-building" | "agents";

export type Tier = "beginner" | "intermediate" | "advanced" | "expert";

export const TIERS: Record<Tier, { label: string; n: number }> = {
  beginner: { label: "Beginner", n: 1 },
  intermediate: { label: "Intermediate", n: 2 },
  advanced: { label: "Advanced", n: 3 },
  expert: { label: "Expert", n: 4 },
};

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
  tone: Tone;
  tier: Tier;
  lessons: Lesson[];
  bonus?: boolean;
  /** Modules that must be fully complete before this one opens. */
  requires?: ModuleId[];
}

export type Tone = "cobalt" | "green" | "plum" | "gold" | "teal" | "rust" | "olive" | "slate";

export const modules: Module[] = [
  {
    id: "foundations",
    number: "01",
    title: "How AI Works",
    kicker: "Fundamentals",
    summary:
      "What separates AI, machine learning, and deep learning, how a model learns from data, and why a chatbot is really predicting the next word.",
    tone: "cobalt",
    tier: "beginner",
    lessons: [
      { slug: "what-is-ai", title: "What counts as AI?", minutes: 8 },
      { slug: "learning-from-data", title: "Learning from data", minutes: 10 },
      { slug: "neural-networks", title: "Inside a neural network", minutes: 12 },
      { slug: "how-llms-work", title: "How LLMs predict words", minutes: 12 },
      { slug: "limits-of-ai", title: "What AI can’t do", minutes: 8 },
    ],
  },
  {
    id: "toolkit",
    number: "02",
    title: "AI Tools & Techniques",
    kicker: "Practical use",
    summary:
      "Pick the right tool, write prompts that work, and use AI to study smarter without letting it do the thinking for you.",
    tone: "green",
    tier: "beginner",
    lessons: [
      { slug: "the-ai-toolbox", title: "The AI toolbox", minutes: 8 },
      { slug: "prompting-101", title: "Prompting 101", minutes: 12 },
      { slug: "studying-with-ai", title: "Studying with AI", minutes: 10 },
      { slug: "verifying-outputs", title: "Checking AI’s work", minutes: 10 },
      { slug: "ai-for-projects", title: "AI for school projects", minutes: 10 },
    ],
  },
  {
    id: "ethics",
    number: "03",
    title: "Ethical AI",
    kicker: "Responsible use",
    summary:
      "Where bias comes from, why models make things up, what counts as cheating, and how to cite AI honestly.",
    tone: "plum",
    tier: "beginner",
    lessons: [
      { slug: "bias-in-ai", title: "Where bias comes from", minutes: 10 },
      { slug: "hallucinations", title: "Hallucinations & deepfakes", minutes: 10 },
      { slug: "academic-integrity", title: "Academic integrity", minutes: 10 },
      { slug: "citing-ai", title: "Citing AI in MLA & APA", minutes: 8 },
      { slug: "privacy", title: "Privacy & your data", minutes: 8 },
    ],
  },
  {
    id: "future",
    number: "04",
    title: "AI & Your Future",
    kicker: "Bonus",
    summary: "How AI is changing medicine, art, sports, and climate science, and where you fit in.",
    tone: "gold",
    tier: "beginner",
    bonus: true,
    requires: ["foundations", "toolkit", "ethics"],
    lessons: [
      { slug: "ai-across-fields", title: "AI across fields", minutes: 10 },
      { slug: "careers", title: "Careers in AI", minutes: 8 },
      { slug: "keep-learning", title: "Keep learning", minutes: 6 },
    ],
  },
  {
    id: "deep-learning",
    number: "05",
    title: "Inside Deep Learning",
    kicker: "Advanced track",
    summary:
      "The math under the hood, without the fear: tensors, loss functions, gradients, backpropagation by hand, optimizers, and how engineers keep a model from memorizing.",
    tone: "teal",
    tier: "intermediate",
    requires: ["foundations", "toolkit", "ethics"],
    lessons: [
      { slug: "tensors", title: "Vectors, matrices & tensors", minutes: 12 },
      { slug: "loss-and-gradients", title: "Loss functions & gradients", minutes: 14 },
      { slug: "backprop-by-hand", title: "Backpropagation by hand", minutes: 16 },
      { slug: "optimizers", title: "Optimizers, batches & learning rates", minutes: 14 },
      { slug: "generalization", title: "Regularization & evaluation", minutes: 12 },
    ],
  },
  {
    id: "transformers",
    number: "06",
    title: "Transformers & LLMs",
    kicker: "Advanced track",
    summary:
      "How a modern language model actually reads and writes: tokenizers, embeddings, self-attention, the transformer block, decoding strategies, and why scale changed everything.",
    tone: "rust",
    tier: "advanced",
    requires: ["deep-learning"],
    lessons: [
      { slug: "embeddings", title: "Tokenizers & embeddings", minutes: 14 },
      { slug: "attention", title: "Self-attention, step by step", minutes: 18 },
      { slug: "transformer-block", title: "Anatomy of a transformer", minutes: 16 },
      { slug: "decoding", title: "Decoding: temperature, top-k, top-p", minutes: 12 },
      { slug: "scaling", title: "Scaling laws & context windows", minutes: 14 },
    ],
  },
  {
    id: "model-building",
    number: "07",
    title: "How Models Are Made",
    kicker: "Expert track",
    summary:
      "Where parameters come from and what they look like on disk: counting weights, tensor layouts, pretraining compute, fine-tuning and RLHF, LoRA, and quantization.",
    tone: "olive",
    tier: "expert",
    requires: ["transformers"],
    lessons: [
      { slug: "parameters", title: "What a parameter really is", minutes: 14 },
      { slug: "weights-on-disk", title: "How model weights are structured", minutes: 16 },
      { slug: "pretraining", title: "Pretraining at scale", minutes: 16 },
      { slug: "post-training", title: "Fine-tuning, RLHF & LoRA", minutes: 16 },
      { slug: "quantization", title: "Quantization & running models locally", minutes: 14 },
    ],
  },
  {
    id: "agents",
    number: "08",
    title: "AI Agents",
    kicker: "Expert track",
    summary:
      "From chatbot to agent: the observe-think-act loop, tool calling with JSON schemas, memory and retrieval, writing an agent from scratch, and keeping it safe.",
    tone: "slate",
    tier: "expert",
    requires: ["model-building"],
    lessons: [
      { slug: "what-is-an-agent", title: "From chatbot to agent", minutes: 12 },
      { slug: "tool-calling", title: "Tool calling & function schemas", minutes: 16 },
      { slug: "memory-and-rag", title: "Memory & retrieval (RAG)", minutes: 16 },
      { slug: "building-an-agent", title: "Build an agent from scratch", minutes: 18 },
      { slug: "agent-safety", title: "Evals, guardrails & prompt injection", minutes: 14 },
    ],
  },
];

export const lessonKey = (moduleId: ModuleId, lessonSlug: string) => `${moduleId}/${lessonSlug}`;

export const getModule = (id: string) => modules.find((m) => m.id === id);

export const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);

export const moduleComplete = (m: Module, completed: string[]) => m.lessons.every((l) => completed.includes(lessonKey(m.id, l.slug)));

export const moduleUnlocked = (m: Module, completed: string[]) =>
  (m.requires ?? []).every((id) => moduleComplete(getModule(id)!, completed));

export function lockReason(m: Module) {
  if (!m.requires?.length) return null;
  const nums = m.requires.map((id) => getModule(id)!.number);
  return nums.length > 1 ? `Finish modules ${nums[0]}–${nums[nums.length - 1]} to unlock this module.` : `Finish module ${nums[0]} to unlock this module.`;
}

export const coreModules = modules.filter((m) => !m.bonus && m.tier === "beginner");
