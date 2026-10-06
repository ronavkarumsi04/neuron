"use client";

import type { Question } from "@/content/lesson-types";
import { useProgress } from "@/lib/progress";
import { CheckpointQuiz } from "../checkpoint-quiz";

const QUESTIONS: Question[] = [
  { q: "A music app recommends songs based on what millions of users skipped or replayed. Which describes it best?", options: ["A rule-based program", "Machine learning: it learned patterns from data", "General AI", "A search engine"], answer: 1, why: "It learned from examples of behavior instead of following hand-written rules." },
  { q: "A model gets 98% on the photos it trained on but 61% on new photos. What's the most likely problem?", options: ["Overfitting", "Too much test data", "The temperature is too low", "It's working as intended"], answer: 0, why: "It memorized its training data instead of learning patterns that generalize." },
  { q: "Why can a chatbot write a fluent paragraph that contains a false fact?", options: ["It's lying on purpose", "It predicts likely-sounding text rather than checking facts", "Someone hacked it", "The internet is down"], answer: 1, why: "LLMs generate plausible text. Plausible and true aren't the same thing." },
  { q: "You raise a chatbot's temperature setting. What changes?", options: ["It runs faster", "Its word choices become more random and varied", "It becomes more accurate", "It forgets the conversation"], answer: 1, why: "Higher temperature flattens the probability distribution over next tokens." },
  { q: "Which prompt is most likely to help you learn for a test?", options: ["“Give me the answers to the review sheet”", "“Quiz me on the review sheet one question at a time, and give a hint if I'm wrong”", "“Summarize the chapter”", "“Write my study guide”"], answer: 1, why: "Retrieval practice with hints keeps you doing the thinking." },
  { q: "You need a statistic about teen smartphone use for a paper. Best approach?", options: ["Use the first number a chatbot gives you", "Find the statistic in an original, credible source and cite that", "Make a reasonable guess", "Cite the chatbot"], answer: 1, why: "Trace numbers to their original source. AI isn't a citable source for facts." },
  { q: "An AI gives you a citation. What's the fastest first check?", options: ["Ask the AI if it's real", "Search the exact title in Google Scholar or a library database", "Check if it's formatted correctly", "Count the authors"], answer: 1, why: "Fake citations are often formatted perfectly. Only a search tells you if they exist." },
  { q: "A hiring model never sees gender but heavily weighs which clubs applicants joined. Why might it still be biased?", options: ["It can't be biased without gender", "Club membership can act as a proxy for gender", "Clubs are random", "Bias only comes from programmers"], answer: 1, why: "Removing a feature doesn't remove its signal if other features correlate with it." },
  { q: "Your teacher's syllabus says nothing about AI. You want to use it to edit your essay. What should you do?", options: ["Use it, since it isn't banned", "Ask your teacher first, and disclose if you use it", "Use it and keep quiet", "Use a different AI"], answer: 1, why: "When the rules aren't clear, ask first and be transparent." },
  { q: "In an MLA citation for AI-generated text, what goes in the title position?", options: ["The company name", "A description of your prompt", "Your name", "The date"], answer: 1, why: "MLA uses the prompt as the title of the source." },
  { q: "Which is safest to paste into a public chatbot?", options: ["Your friend's text messages about a private problem", "Your student ID number", "“A 10th grader is nervous about a presentation”", "Your home address"], answer: 2, why: "General descriptions give context without exposing anyone's personal information." },
  { q: "AI flags possible pneumonia on a chest X-ray. Who should make the diagnosis?", options: ["The AI, since it's faster", "A qualified doctor, using the AI as one input", "The patient", "Whoever is closest"], answer: 1, why: "High-stakes decisions need an accountable human in the loop." },
];

export function Capstone() {
  const finish = useProgress((s) => s.completeLab);
  const done = useProgress((s) => s.labs.includes("capstone"));
  return (
    <CheckpointQuiz
      moduleId="future"
      slug="capstone"
      questions={QUESTIONS}
      title="Capstone challenge"
      need={9}
      note={done ? "Passed. You're a Neural Architect. Retake it any time." : "Pass to earn the Neural Architect badge."}
      onResult={(score, passed) => passed && finish("capstone")}
    />
  );
}
