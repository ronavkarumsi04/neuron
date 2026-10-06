import type { ModuleId } from "./curriculum";

export interface Term {
  term: string;
  def: string;
  lesson: [ModuleId, string];
}

export const GLOSSARY: Term[] = [
  { term: "Artificial intelligence (AI)", def: "The whole field: machines doing tasks that usually take human intelligence, like recognizing speech or making predictions.", lesson: ["foundations", "what-is-ai"] },
  { term: "Machine learning", def: "AI that learns patterns from examples instead of following rules a person wrote by hand.", lesson: ["foundations", "what-is-ai"] },
  { term: "Deep learning", def: "Machine learning with **neural networks** that have many layers. It powers face unlock, translation, and chatbots.", lesson: ["foundations", "what-is-ai"] },
  { term: "Generative AI", def: "Models that *create* new text, images, audio, or code instead of just labeling things.", lesson: ["foundations", "what-is-ai"] },
  { term: "Algorithm", def: "A precise set of steps for solving a problem. Training a model is an algorithm; so is the model's prediction.", lesson: ["foundations", "what-is-ai"] },
  { term: "Training data", def: "The examples a model learns from. A model can only be as good, and as fair, as its training data.", lesson: ["foundations", "learning-from-data"] },
  { term: "Feature", def: "One measurable input the model looks at, like the number of words in an email or the pixels of an image.", lesson: ["foundations", "learning-from-data"] },
  { term: "Label", def: "The right answer attached to a training example, such as *spam* or *not spam*.", lesson: ["foundations", "learning-from-data"] },
  { term: "Model", def: "What training produces: a function that turns inputs into predictions.", lesson: ["foundations", "learning-from-data"] },
  { term: "Loss", def: "A number measuring how wrong the model's predictions are. Training tries to make it smaller.", lesson: ["foundations", "learning-from-data"] },
  { term: "Overfitting", def: "Memorizing the training examples instead of learning the pattern, so the model does well in practice and badly on new data.", lesson: ["foundations", "learning-from-data"] },
  { term: "Test set", def: "Examples held back from training and used to check whether a model works on data it hasn't seen.", lesson: ["foundations", "learning-from-data"] },
  { term: "Neural network", def: "Layers of simple connected units (artificial neurons). Each one weighs its inputs, adds them up, and passes on a signal.", lesson: ["foundations", "neural-networks"] },
  { term: "Weight", def: "How much one input matters to a neuron. Training is mostly the process of adjusting weights.", lesson: ["foundations", "neural-networks"] },
  { term: "Bias (in a neuron)", def: "A number added to a neuron's total that shifts when it fires. Not the same thing as unfair bias.", lesson: ["foundations", "neural-networks"] },
  { term: "Gradient descent", def: "Training by taking small steps that reduce the loss, like walking downhill in fog.", lesson: ["foundations", "learning-from-data"] },
  { term: "Epoch", def: "One full pass through all of the training data.", lesson: ["foundations", "learning-from-data"] },
  { term: "Large language model (LLM)", def: "A huge neural network trained on text to predict what comes next. ChatGPT, Gemini, and Claude are built on LLMs.", lesson: ["foundations", "how-llms-work"] },
  { term: "Token", def: "A chunk of text, often a word or part of a word, that a language model reads and predicts one at a time.", lesson: ["foundations", "how-llms-work"] },
  { term: "Context window", def: "How much text a model can look at at once. Anything outside it is forgotten.", lesson: ["foundations", "how-llms-work"] },
  { term: "Temperature", def: "A setting that controls randomness. Low gives safe, predictable words; high gives surprising ones and more mistakes.", lesson: ["foundations", "how-llms-work"] },
  { term: "Knowledge cutoff", def: "The date a model's training data ends. It doesn't know about anything after that unless it can search.", lesson: ["foundations", "how-llms-work"] },
  { term: "Prompt", def: "The instructions and context you give an AI tool.", lesson: ["toolkit", "the-ai-toolbox"] },
  { term: "Prompt engineering", def: "Writing prompts on purpose: giving context, a role, a clear ask, and a format, then revising based on the output.", lesson: ["toolkit", "the-ai-toolbox"] },
  { term: "CRAFT", def: "Neuron's prompt checklist: **C**ontext, **R**ole, **A**sk, **F**ormat, **T**weak.", lesson: ["toolkit", "the-ai-toolbox"] },
  { term: "Retrieval / grounding", def: "Having an AI answer from specific sources you give it (like your notes) instead of only from memory. Lowers, but doesn't remove, made-up answers.", lesson: ["toolkit", "studying-with-ai"] },
  { term: "Retrieval practice", def: "Studying by testing yourself instead of rereading. AI can generate the quiz, but you have to do the remembering.", lesson: ["toolkit", "studying-with-ai"] },
  { term: "SIFT", def: "A fact-checking routine: **S**top, **I**nvestigate the source, **F**ind better coverage, **T**race claims to the original.", lesson: ["toolkit", "verifying-outputs"] },
  { term: "Algorithmic bias", def: "When an AI system's results are systematically unfair to some group, usually because of its data or how it's used.", lesson: ["ethics", "bias-in-ai"] },
  { term: "Proxy", def: "A feature that stands in for one you removed. A ZIP code or school name can reveal race or income even if those columns are deleted.", lesson: ["ethics", "bias-in-ai"] },
  { term: "Representation", def: "Whether every group the model will be used on appears enough in its training data.", lesson: ["ethics", "bias-in-ai"] },
  { term: "Hallucination", def: "When an AI states something false with confidence, like a made-up quote, statistic, or citation.", lesson: ["ethics", "hallucinations"] },
  { term: "Deepfake", def: "AI-generated or AI-altered media that makes a real person appear to say or do something they didn't.", lesson: ["ethics", "hallucinations"] },
  { term: "Provenance", def: "Where a piece of media came from and how it was changed along the way.", lesson: ["ethics", "hallucinations"] },
  { term: "Academic integrity", def: "Doing your own work honestly and giving credit for help, including help from AI.", lesson: ["ethics", "academic-integrity"] },
  { term: "AI use policy", def: "Your teacher's or school's rules for which kinds of AI help are allowed on an assignment. When unsure, ask.", lesson: ["ethics", "academic-integrity"] },
  { term: "Disclosure statement", def: "A short note explaining which AI tool you used, for what, and how you checked or changed its output.", lesson: ["ethics", "citing-ai"] },
  { term: "Citation (AI)", def: "Credit for AI output in MLA or APA style. MLA uses your prompt as the title; APA credits the company as author.", lesson: ["ethics", "citing-ai"] },
  { term: "Personal information", def: "Anything that identifies you or someone else, such as names, addresses, student IDs, photos, and health details. Keep it out of prompts.", lesson: ["ethics", "privacy"] },
  { term: "Computer vision", def: "AI that interprets images and video, used in medical scans, crop monitoring, and self-driving cars.", lesson: ["future", "ai-across-fields"] },
];
