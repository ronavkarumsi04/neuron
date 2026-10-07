import type { Question } from "./lesson-types";

export type Topic = "foundations" | "toolkit" | "ethics" | "deep" | "llm" | "systems";
export type Level = 1 | 2 | 3 | 4;

export const TOPICS: { id: Topic; label: string }[] = [
  { id: "foundations", label: "How AI works" },
  { id: "toolkit", label: "Using AI tools" },
  { id: "ethics", label: "Ethical use" },
  { id: "deep", label: "Deep learning" },
  { id: "llm", label: "Transformers & LLMs" },
  { id: "systems", label: "Models & agents" },
];

export const LEVELS: { n: Level; label: string; points: number }[] = [
  { n: 1, label: "Beginner", points: 1 },
  { n: 2, label: "Intermediate", points: 2 },
  { n: 3, label: "Advanced", points: 3 },
  { n: 4, label: "Expert", points: 4 },
];

export type AssessmentQuestion = Question & { topic: Topic; level: Level };

/** Ordered easiest to hardest. Points per question equal its level, so the expert half is worth most of the score. */
export const ASSESSMENT: AssessmentQuestion[] = [
  // Level 1: beginner
  { level: 1, topic: "foundations", q: "A spam filter that improves by studying thousands of emails people marked as spam is an example of…", options: ["Hand-written rules", "Machine learning", "General AI", "A search engine"], answer: 1, why: "It learns patterns from labeled examples instead of following rules a programmer wrote." },
  { level: 1, topic: "foundations", q: "In a dataset of house photos labeled with sale prices, what are the prices?", options: ["Features", "Labels (targets)", "Parameters", "Prompts"], answer: 1, why: "Labels are the answers the model learns to predict. The photos supply the features." },
  { level: 1, topic: "foundations", q: "A model scores 99% on its training data and 62% on new data. What's the most likely issue?", options: ["Underfitting", "Overfitting", "The learning rate is zero", "Too much test data"], answer: 1, why: "A big gap between training and new-data performance means it memorized rather than generalized." },
  { level: 1, topic: "toolkit", q: "Which prompt will most likely produce useful study help?", options: ["“Explain photosynthesis.”", "“I'm a 10th grader with a quiz tomorrow. Quiz me on photosynthesis one question at a time and explain my mistakes.”", "“Photosynthesis???”", "“Write everything about plants.”"], answer: 1, why: "It gives context, a role, a format, and keeps you doing the thinking." },
  { level: 1, topic: "toolkit", q: "A chatbot gives you a statistic for your paper. What should you do before using it?", options: ["Use it; chatbots are trained on facts", "Find it in an original, credible source and cite that source", "Ask the chatbot if it's sure", "Round it to a whole number"], answer: 1, why: "LLMs can produce plausible but false numbers. Trace facts to a primary source." },
  { level: 1, topic: "ethics", q: "Your syllabus doesn't mention AI. You want to use it to help edit an essay. Best move?", options: ["Use it; anything not banned is allowed", "Ask your teacher first and disclose how you used it", "Use it but don't mention it", "Never use AI for anything"], answer: 1, why: "When rules are unclear, ask and be transparent." },
  { level: 1, topic: "ethics", q: "Which is the safest to paste into a public chatbot?", options: ["A friend's private texts", "Your student ID and birthday", "“A student feels nervous before presentations”", "Your home address"], answer: 2, why: "A general description provides context without exposing personal data." },
  { level: 1, topic: "foundations", q: "At its core, what does a large language model do when it generates text?", options: ["Looks up answers in a database of facts", "Repeatedly predicts a likely next token", "Copies a matching web page", "Runs a search engine query"], answer: 1, why: "LLMs generate one token at a time from a learned probability distribution." },

  // Level 2: intermediate
  { level: 2, topic: "deep", q: "A fully connected layer maps 256 inputs to 64 outputs, with biases. How many parameters does it have?", options: ["320", "16,384", "16,448", "16,640"], answer: 2, why: "256 × 64 = 16,384 weights, plus 64 biases = 16,448." },
  { level: 2, topic: "deep", q: "Gradient descent computes ∂L/∂w = +2.5 for a weight. What does the update do?", options: ["Increases w", "Decreases w", "Leaves w unchanged", "Sets w to 2.5"], answer: 1, why: "w ← w − η·2.5. A positive slope means the loss rises with w, so w goes down." },
  { level: 2, topic: "deep", q: "A model assigns probability 0.5 to the correct class. What's its cross-entropy loss for that example?", options: ["0.5", "≈ 0.69", "≈ 1.0", "≈ 2.0"], answer: 1, why: "−ln(0.5) ≈ 0.693." },
  { level: 2, topic: "deep", q: "Training loss keeps falling, but validation loss has been rising for several epochs. What's the best response?", options: ["Raise the learning rate", "Stop near the validation minimum and add regularization", "Train twice as long", "Use the test set to pick the epoch"], answer: 1, why: "That's overfitting. Early stopping and regularization help; tuning on the test set would leak it." },
  { level: 2, topic: "foundations", q: "A ReLU hidden unit receives z = −3 for an example. What gradient flows back through it to its input weights?", options: ["−3", "1", "0", "3"], answer: 2, why: "ReLU's derivative is 0 for negative inputs, so the gradient through it is zero." },
  { level: 2, topic: "toolkit", q: "Which approach most reduces hallucination when asking an AI about a specific article?", options: ["Set the temperature to 2", "Paste the article and tell it to answer only from the text, quoting the relevant lines", "Ask the same question five times", "Use a longer question"], answer: 1, why: "Grounding the model in a provided source and requiring quotes makes errors checkable." },
  { level: 2, topic: "ethics", q: "A hiring model never sees race but heavily uses ZIP code. Why can it still be biased?", options: ["It can't be biased without race", "ZIP code can act as a proxy for race", "ZIP codes are random", "Only programmers cause bias"], answer: 1, why: "Correlated features carry the removed attribute's signal." },
  { level: 2, topic: "deep", q: "Compared with plain SGD, what does Adam keep for every weight?", options: ["Nothing extra", "Running averages of the gradient and the squared gradient", "A copy of every training example", "A separate learning-rate schedule written by hand"], answer: 1, why: "Those two moments give each weight its own adaptive step size, at the cost of extra memory." },

  // Level 3: advanced
  { level: 3, topic: "llm", q: "In scaled dot-product attention, why divide the scores QKᵀ by √d?", options: ["To normalize the values to sum to 1", "Large dot products saturate the softmax and shrink gradients; scaling keeps them trainable", "To apply the causal mask", "To reduce memory use"], answer: 1, why: "Dot products grow with dimension. Scaling prevents near one-hot softmax outputs." },
  { level: 3, topic: "llm", q: "A decoder-only model's context grows from 2,048 to 8,192 tokens. Roughly how does the size of the attention score matrix change?", options: ["2×", "4×", "16×", "Unchanged"], answer: 2, why: "It's n × n. 4× the tokens gives 16× the entries." },
  { level: 3, topic: "llm", q: "With top-p = 0.9, the top token has probability 0.93. Which tokens can be sampled?", options: ["The top 90 tokens", "Only the top token", "Every token", "The top 10%"], answer: 1, why: "The nucleus is the smallest set whose mass reaches 0.9. One token already covers it." },
  { level: 3, topic: "llm", q: "What is the main job of a transformer block's MLP sublayer, as opposed to attention?", options: ["Moving information between token positions", "Transforming each token's vector independently", "Tokenizing the input text", "Applying the positional encoding"], answer: 1, why: "Only attention mixes across positions. The MLP is applied per token." },
  { level: 3, topic: "llm", q: "Why do deep transformers use residual connections (x + f(x))?", options: ["To reduce the vocabulary", "They give gradients a direct path and let each block learn an incremental update", "To prevent tokens from attending to the future", "To quantize weights"], answer: 1, why: "The identity path keeps signals and gradients flowing through dozens of layers." },
  { level: 3, topic: "systems", q: "Using C ≈ 6ND, roughly how much compute does training a 2B-parameter model on 40B tokens take?", options: ["4.8 × 10²⁰ FLOPs", "8 × 10¹⁹ FLOPs", "2.4 × 10¹⁸ FLOPs", "4.8 × 10²³ FLOPs"], answer: 0, why: "6 × 2×10⁹ × 4×10¹⁰ = 4.8 × 10²⁰." },
  { level: 3, topic: "llm", q: "Why must a transformer add position information to token embeddings?", options: ["Attention on its own is order-invariant, so it can't distinguish \"dog bites man\" from \"man bites dog\"", "To make the vocabulary larger", "To speed up the softmax", "Position information is optional decoration"], answer: 0, why: "Without positions, permuting the input permutes the output identically." },

  // Level 4: expert
  { level: 4, topic: "systems", q: "A tensor in a checkpoint is `model.layers.3.mlp.down_proj.weight` with shape [4096, 11008]. What does it do?", options: ["Projects 4,096 → 11,008 in layer 3's attention", "Projects the MLP's 11,008-d hidden activations back to 4,096 in the 4th layer", "Embeds 11,008 tokens", "Stores layer 3's attention scores"], answer: 1, why: "PyTorch stores Linear weights as [out, in], layers are zero-indexed, and down_proj closes the MLP." },
  { level: 4, topic: "systems", q: "Approximately how many parameters are in the transformer blocks of a GPT-style model with 24 layers and d = 2,048 (MLP 4× wide)?", options: ["≈ 100 million", "≈ 1.2 billion", "≈ 4.8 billion", "≈ 400 million"], answer: 1, why: "≈ 12d² per layer: 12 × 2048² × 24 ≈ 1.21 billion." },
  { level: 4, topic: "systems", q: "LoRA with rank r = 8 is applied to a 4096 × 4096 weight matrix. How many trainable parameters does it add?", options: ["8", "32,768", "65,536", "16,777,216"], answer: 2, why: "B is 4096 × 8 and A is 8 × 4096: 2 × 4096 × 8 = 65,536." },
  { level: 4, topic: "systems", q: "Why do 4-bit quantization schemes usually use a separate scale per group of 32–128 weights?", options: ["GPUs require groups of 64", "A single outlier would force a large scale and round most small weights in the tensor to zero", "To make the file format compatible with JSON", "Groups let each weight use a different number of bits"], answer: 1, why: "Per-group scales confine an outlier's effect to its own small group." },
  { level: 4, topic: "systems", q: "An agent that reads web pages also has a send_email tool. A page contains hidden text telling it to email the user's files. What's the most robust defense?", options: ["Add “ignore malicious instructions” to the system prompt", "Remove send_email from this agent or require human approval for outbound messages", "Lower the temperature", "Use a larger model"], answer: 1, why: "Prompt injection can't be reliably filtered by prompting alone. Least privilege and human confirmation remove the exit path." },
  { level: 4, topic: "systems", q: "In RLHF, what is the reward model trained on?", options: ["Next-token prediction on web text", "Human comparisons of which of two responses is better", "The test-set accuracy of the policy", "Hand-written scores for every possible prompt"], answer: 1, why: "It learns to predict human preferences, then scores responses during reinforcement learning." },
  { level: 4, topic: "systems", q: "A RAG chatbot answers a policy question wrongly even though the correct passage is in its index. Logs show the passage ranked 40th. What should you fix first?", options: ["Raise the model's temperature", "Retrieval: chunking, hybrid keyword + vector search, or a reranker", "Fine-tune the model on the whole handbook", "Shorten the system prompt"], answer: 1, why: "If the right passage never reaches the context window, generation can't use it." },
];

export const MAX_POINTS = ASSESSMENT.reduce((n, q) => n + q.level, 0);

/** Deterministic option order per question, so the correct answer isn't always in the same slot. */
export function optionOrder(qi: number, n: number) {
  const order = Array.from({ length: n }, (_, i) => i);
  let seed = (qi + 1) * 2654435761;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
