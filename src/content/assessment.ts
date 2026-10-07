import type { Question } from "./lesson-types";

export type Topic = "foundations" | "toolkit" | "ethics";

export const TOPICS: { id: Topic; label: string }[] = [
  { id: "foundations", label: "How AI works" },
  { id: "toolkit", label: "Using AI tools" },
  { id: "ethics", label: "Ethical use" },
];

export const ASSESSMENT: (Question & { topic: Topic })[] = [
  { topic: "foundations", q: "What is the main difference between traditional software and machine learning?", options: ["Machine learning runs on faster computers", "In machine learning, the program learns rules from examples instead of being given them", "Traditional software can't use data", "There is no difference"], answer: 1, why: "ML systems find patterns in training data. Traditional programs follow rules a person wrote." },
  { topic: "foundations", q: "A spam filter was trained only on emails from 2015. Why might it struggle today?", options: ["Old data is always deleted", "Spam has changed, so the patterns it learned are out of date", "Filters can only run for a year", "It will work perfectly"], answer: 1, why: "A model only knows the patterns in its training data. When the world changes, accuracy drops." },
  { topic: "foundations", q: "What does a large language model actually do when it writes a sentence?", options: ["Looks up the answer in a database", "Repeatedly predicts a likely next piece of text", "Understands the topic like a person does", "Copies a sentence from the internet"], answer: 1, why: "LLMs generate text one token at a time, choosing likely continuations." },
  { topic: "foundations", q: "During training, a neural network improves by…", options: ["Adding more neurons each time it's wrong", "Adjusting its weights to reduce its error", "Asking a human for every answer", "Memorizing the test set"], answer: 1, why: "Training nudges weights in the direction that lowers the loss." },
  { topic: "toolkit", q: "Which prompt will most likely get a useful study aid?", options: ["“Biology help”", "“I'm in 9th grade biology studying cell organelles. Make 5 practice questions, one at a time, and tell me why if I'm wrong.”", "“Tell me everything about cells”", "“Do my biology homework”"], answer: 1, why: "Context, a clear task, and a format make outputs far more useful." },
  { topic: "toolkit", q: "An AI answer includes a surprising statistic. What should you do before using it?", options: ["Use it, since AI checked it", "Find the number in a credible original source", "Round it to make it safer", "Ask the AI to repeat it"], answer: 1, why: "AI can invent numbers. Verify claims against a real source." },
  { topic: "toolkit", q: "Which is the best way to use AI to get better at writing?", options: ["Have it write the essay, then read it", "Ask for feedback on your own draft and revise it yourself", "Have it rewrite every sentence", "Avoid AI entirely, it can't help"], answer: 1, why: "Feedback keeps you doing the writing, which is how you get better." },
  { topic: "toolkit", q: "You need a diagram for a presentation. Which tool type fits best?", options: ["A text chatbot", "An image generation tool, checked for accuracy", "A spam filter", "A translation app"], answer: 1, why: "Pick the tool built for the task, and still check its output." },
  { topic: "ethics", q: "Why can an AI trained on past decisions be unfair even if it never sees race or gender?", options: ["It can't be", "Other features can act as proxies, and past decisions may already be biased", "AI is always neutral", "Only bad programmers make biased AI"], answer: 1, why: "Proxy features and biased labels let bias in without the sensitive column." },
  { topic: "ethics", q: "Your teacher allows AI for brainstorming only. Which is allowed?", options: ["Having AI write your conclusion", "Asking AI for topic ideas, then writing everything yourself", "Pasting AI paragraphs and editing them", "Having AI paraphrase a source"], answer: 1, why: "Follow the specific rule. Brainstorming means ideas, not text." },
  { topic: "ethics", q: "What's the main privacy risk of pasting a friend's private message into a chatbot?", options: ["None", "The text may be stored or used by the company, and it isn't yours to share", "The chatbot will text your friend", "It uses too much data"], answer: 1, why: "Inputs can be kept and reviewed. Other people's private info isn't yours to share." },
  { topic: "ethics", q: "You used AI to help outline a paper, and AI use was allowed. What should you do?", options: ["Nothing, it was allowed", "Disclose how you used it, following your teacher's or MLA/APA guidance", "Delete the chat", "Cite the AI as a co-author"], answer: 1, why: "Allowed use should still be disclosed, so your teacher knows what's yours." },
];
