import type { LessonContent } from "../lesson-types";

export const foundations: Record<string, LessonContent> = {
  "what-is-ai": {
    hook: "Your phone unlocked with your face this morning. Your playlist guessed what you wanted next. Was any of that actually *intelligent*?",
    blocks: [
      { t: "p", text: "**Artificial intelligence (AI)** is any computer system that does a task we'd normally say takes human intelligence: recognizing a face, understanding a sentence, predicting what happens next, or making a decision. The bar is the *task*, not whether the computer is \"thinking\" the way you do." },
      { t: "h", text: "Rules vs. learning" },
      { t: "p", text: "Most software follows rules a person wrote: *if the password matches, let them in.* That's not AI. It's a recipe. AI systems today mostly use **machine learning**: instead of writing the rules, people show the computer thousands of examples and it figures out the patterns itself." },
      { t: "compare", left: { title: "Traditional program", items: ["A person writes every rule", "Does exactly the same thing every time", "Breaks on situations nobody planned for", "Example: a calculator"] }, right: { title: "Machine learning", items: ["Learns rules from examples", "Gets better with more and better data", "Can handle cases it hasn't seen exactly", "Example: a spam filter"] } },
      { t: "h", text: "The nesting dolls" },
      { t: "p", text: "You'll hear four terms used like they mean the same thing. They don't. Each one fits inside the one before it." },
      { t: "terms", items: [
        { term: "AI", def: "The whole field: any machine doing tasks that seem intelligent." },
        { term: "Machine learning", def: "AI that learns patterns from data instead of following hand-written rules." },
        { term: "Deep learning", def: "Machine learning using **neural networks** with many layers. It powers face unlock, voice assistants, and translation." },
        { term: "Generative AI", def: "Deep learning models that *create* new text, images, audio, or code. ChatGPT, Gemini, Claude, and image generators live here." },
      ] },
      { t: "widget", id: "sort", sort: {
        prompt: "AI or not AI?",
        buckets: ["Not AI", "Machine learning", "Generative AI"],
        items: [
          { label: "A calculator app", bucket: 0, why: "It follows fixed math rules. It never learns anything." },
          { label: "Your email's spam filter", bucket: 1, why: "It learned what spam looks like from millions of emails people marked as junk." },
          { label: "A chatbot writing a poem", bucket: 2, why: "It generates brand-new text by predicting one word after another." },
          { label: "A crosswalk light on a timer", bucket: 0, why: "It switches every 45 seconds no matter what. That's a rule, not learning." },
          { label: "Face unlock on a phone", bucket: 1, why: "A deep neural network learned to match your face from training images. It recognizes, it doesn't create." },
          { label: "An app that turns a sketch into a painting", bucket: 2, why: "It generates a new image that didn't exist before." },
        ],
      } },
      { t: "h", text: "Narrow AI vs. general AI" },
      { t: "p", text: "Every AI that exists today is **narrow**: very good at specific kinds of tasks and lost outside them. A chess engine can beat any human but can't tell you what a chair is. **Artificial general intelligence (AGI)**, a system as flexible as a person across almost any task, does not exist yet. Researchers seriously disagree about when, or whether, it will." },
      { t: "note", kind: "key", title: "AI is a tool built by people", text: "Every AI system reflects choices people made: what data to collect, what to optimize, and what to ignore. Understanding those choices is what this whole portal is about." },
    ],
    takeaways: [
      "AI means machines doing tasks that usually need human intelligence.",
      "Machine learning learns patterns from examples instead of following hand-written rules.",
      "AI ⊃ machine learning ⊃ deep learning ⊃ generative AI.",
      "Today's AI is narrow. General AI doesn't exist yet.",
    ],
    quiz: [
      { q: "What makes a spam filter machine learning instead of a regular program?", options: ["It runs on the internet", "It learned patterns from examples of spam instead of following only hand-written rules", "It is very fast", "It was made by a big company"], answer: 1, why: "The defining feature of machine learning is learning patterns from data." },
      { q: "Which list goes from broadest to most specific?", options: ["Generative AI → deep learning → machine learning → AI", "Machine learning → AI → deep learning → generative AI", "AI → machine learning → deep learning → generative AI", "Deep learning → AI → generative AI → machine learning"], answer: 2, why: "Each term fits inside the one before it, like nesting dolls." },
      { q: "A chess program beats every human but can't recognize a cat. This is an example of…", options: ["Narrow AI", "General AI", "Not AI at all", "A broken AI"], answer: 0, why: "It's excellent at one domain and useless outside it. That's narrow AI." },
    ],
  },

  "learning-from-data": {
    hook: "Nobody told your music app that you like sad songs on rainy Sundays. It noticed. How does a machine *notice* anything?",
    blocks: [
      { t: "p", text: "Machine learning comes down to one loop: **guess, measure how wrong you were, adjust, repeat.** Do that enough times on enough examples and the guesses get good." },
      { t: "terms", items: [
        { term: "Training data", def: "The examples the model learns from. For a model that spots dogs, that's thousands of photos labeled \"dog\" or \"not dog\"." },
        { term: "Features", def: "The inputs the model looks at, like hours studied, pixel colors, or the words in an email." },
        { term: "Label", def: "The right answer for a training example: the actual test score, or \"spam\"." },
        { term: "Model", def: "The set of numbers (parameters) that turns features into a prediction." },
        { term: "Loss", def: "A score for how wrong the model is. Training is the hunt for lower loss." },
      ] },
      { t: "p", text: "Below, a model is trying to predict test scores from hours studied. It only has two numbers to tune: a **slope** (how much each hour helps) and a **starting point**. Drag them yourself, then press *Auto-train* and watch the computer do the same job using a method called **gradient descent**: nudge each number in whichever direction shrinks the error." },
      { t: "widget", id: "line-fit" },
      { t: "p", text: "A large language model does the same loop, but instead of 2 numbers it tunes **billions**, and instead of 16 students it learns from a huge slice of the internet." },
      { t: "h", text: "Three ways machines learn" },
      { t: "list", items: [
        "**Supervised learning:** examples come with right answers. *Here are 10,000 X-rays labeled \"fracture\" or \"no fracture.\"*",
        "**Unsupervised learning:** no labels. The model finds structure on its own, like grouping shoppers with similar habits.",
        "**Reinforcement learning:** the model tries actions and gets rewards or penalties, like a game AI learning which moves win.",
      ] },
      { t: "h", text: "Testing on data it has never seen" },
      { t: "p", text: "A model that memorizes its training data is like a student who memorized the practice test but can't solve a new problem. This is called **overfitting**. That's why engineers always hold back some data the model never trains on, then test on it. The test score on *unseen* data is the one that matters." },
      { t: "note", kind: "warn", title: "Garbage in, garbage out", text: "A model can only learn what's in its data. If the data is incomplete, outdated, or skewed, the model will be too, and it will be confident about it. You'll see this up close in the Bias Lab." },
    ],
    takeaways: [
      "Training is a loop: guess, measure the error, adjust, repeat.",
      "Features go in, predictions come out, and labels are the right answers.",
      "Supervised, unsupervised, and reinforcement learning differ in what feedback the model gets.",
      "Always judge a model on data it has never seen.",
    ],
    quiz: [
      { q: "During training, what is the model trying to make smaller?", options: ["The number of features", "The loss (how wrong its predictions are)", "The size of the dataset", "The number of layers"], answer: 1, why: "Training adjusts parameters to reduce loss, the measure of how wrong the model is." },
      { q: "A model scores 99% on its training data but 60% on new data. What most likely happened?", options: ["It overfit: it memorized instead of learning general patterns", "It needs a faster computer", "The new data was mislabeled on purpose", "It's working perfectly"], answer: 0, why: "A big gap between training and test performance is the classic sign of overfitting." },
      { q: "A game AI improves by getting points for winning moves. That's…", options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Not machine learning"], answer: 2, why: "Learning from rewards and penalties for actions is reinforcement learning." },
    ],
  },

  "neural-networks": {
    hook: "\"Neural network\" sounds like a robot brain. It's actually something much simpler: lots of tiny calculators that each do multiply, add, and decide.",
    blocks: [
      { t: "p", text: "A neural network is built from **artificial neurons**. Each one takes some numbers in, multiplies each by a **weight** (how much that input matters), adds them up with a **bias**, and squashes the result into an output. That's it. One neuron is barely smart. Millions of them in layers can recognize your face." },
      { t: "example", label: "One neuron, written out", text: "output = squash( input₁ × weight₁ + input₂ × weight₂ + input₃ × weight₃ + bias )" },
      { t: "p", text: "Try it yourself. This neuron decides whether you go to the game tonight. Flip the inputs and drag the weights. Thicker lines mean bigger weights. Blue pushes toward *go*, orange pushes against it." },
      { t: "widget", id: "perceptron" },
      { t: "h", text: "Layers make it deep" },
      { t: "p", text: "Real networks stack neurons in **layers**. The first layer sees raw input, like pixels. Middle (\"hidden\") layers combine simple patterns into complex ones: edges become shapes, shapes become eyes, eyes become a face. The last layer gives the answer. *Deep* learning just means many hidden layers." },
      { t: "h", text: "How a network learns: backpropagation" },
      { t: "p", text: "Nobody sets millions of weights by hand like you just did. Instead, the network makes a guess, measures the error, and then works **backward** through the layers, figuring out how much each weight contributed to the mistake and nudging it. That process is **backpropagation**, and it's the same guess-measure-adjust loop from the last lesson at a massive scale." },
      { t: "note", kind: "key", title: "No one programmed the answer", text: "After training, the knowledge lives in the weights: millions of numbers no person chose directly. That's powerful, and it's also why it can be hard to explain *why* a network made a specific decision." },
      { t: "note", kind: "try", title: "Go deeper in the lab", text: "In **Teach the Machine** you'll train a real neural network in your browser using your own examples." },
    ],
    takeaways: [
      "A neuron multiplies inputs by weights, adds a bias, and squashes the result.",
      "Stacking layers lets networks build complex patterns from simple ones.",
      "Backpropagation adjusts every weight based on its share of the error.",
      "The learned knowledge is stored in the weights, which makes networks hard to explain.",
    ],
    quiz: [
      { q: "In an artificial neuron, what does a weight control?", options: ["How fast the computer runs", "How much a specific input influences the output", "The number of layers", "Which data is used for testing"], answer: 1, why: "Weights scale each input, so a larger weight means that input matters more." },
      { q: "What makes a network \"deep\"?", options: ["It uses a lot of electricity", "It has many hidden layers", "It understands emotions", "It was trained for a long time"], answer: 1, why: "Deep learning refers to networks with many layers between input and output." },
      { q: "What does backpropagation do?", options: ["Deletes bad training data", "Works backward from the error to adjust each weight", "Adds new neurons automatically", "Copies another network's answers"], answer: 1, why: "Backprop assigns each weight its share of the error and nudges it to reduce the loss." },
    ],
  },

  "how-llms-work": {
    hook: "ChatGPT can write an essay about the Civil War in five seconds. But under the hood it's playing one simple game over and over: *guess the next word.*",
    blocks: [
      { t: "p", text: "A **large language model (LLM)** is a giant neural network trained on enormous amounts of text with one goal: given everything so far, predict what comes next. Ask it a question and it doesn't look up an answer. It writes one, a piece at a time, choosing each piece based on probability." },
      { t: "h", text: "Tokens, not words" },
      { t: "p", text: "LLMs actually work with **tokens**, which are chunks of text. A common word like \"the\" is one token. A longer word like \"photosynthesis\" might be split into a few pieces. This is part of why models sometimes stumble on spelling or counting letters: they never really see individual letters." },
      { t: "h", text: "Play the game yourself" },
      { t: "p", text: "Here's a tiny language model trained on just 18 sentences. It counts which word tends to follow which, and turns those counts into probabilities. Build a sentence by picking words or sampling, and move the **temperature** slider to see how randomness changes things." },
      { t: "widget", id: "next-word" },
      { t: "p", text: "Real LLMs work on the same principle, with two huge upgrades. They are trained on trillions of tokens instead of a few hundred words, and they use a design called a **transformer**, whose *attention* mechanism lets every word look back at all the earlier words to decide what matters. That's how they keep track of a whole conversation instead of just the last word." },
      { t: "h", text: "From autocomplete to assistant" },
      { t: "list", ordered: true, items: [
        "**Pretraining:** the model reads a vast amount of text and learns to predict the next token. It picks up grammar, facts, and reasoning patterns along the way.",
        "**Fine-tuning:** it's trained further on examples of helpful conversations.",
        "**Human feedback:** people rate its answers, and the model is adjusted toward the ones people preferred. This is often called RLHF.",
      ] },
      { t: "terms", items: [
        { term: "Context window", def: "How much text the model can consider at once. Anything outside it is forgotten." },
        { term: "Temperature", def: "A setting that controls randomness. Low means predictable, high means creative and more error-prone." },
        { term: "Knowledge cutoff", def: "The date its training data ends. Without a search tool, it doesn't know what happened after." },
      ] },
      { t: "note", kind: "warn", title: "Fluent is not the same as true", text: "An LLM is optimized to produce text that *sounds* likely, not text that's been fact-checked. When it doesn't know, it can still produce a confident, perfectly worded wrong answer. That's called a **hallucination**, and Module 03 is all about catching them." },
    ],
    takeaways: [
      "LLMs generate text one token at a time by predicting what's most likely next.",
      "Transformers use attention to weigh all earlier text, not just the last word.",
      "Pretraining, fine-tuning, and human feedback turn a predictor into an assistant.",
      "Sounding confident is not evidence of being correct.",
    ],
    quiz: [
      { q: "At its core, what is an LLM doing when it answers you?", options: ["Searching a database of correct answers", "Repeatedly predicting the most likely next token", "Copying a web page", "Asking a human expert"], answer: 1, why: "LLMs generate text by predicting one token at a time." },
      { q: "You raise the temperature setting. What should you expect?", options: ["More predictable, repetitive answers", "More varied, surprising answers that are more likely to contain mistakes", "Faster answers", "Answers with sources"], answer: 1, why: "Higher temperature flattens the probabilities, so less-likely words get picked more often." },
      { q: "Why can an LLM confidently state something false?", options: ["It's lying on purpose", "It's optimized to produce likely-sounding text, not verified facts", "Its batteries are low", "Someone hacked it"], answer: 1, why: "Plausibility and truth are different targets. That gap causes hallucinations." },
    ],
  },

  "limits-of-ai": {
    hook: "AI can pass bar exams and still mess up how many r's are in \"strawberry.\" Knowing where it breaks is what makes you a smart user.",
    blocks: [
      { t: "p", text: "Today's AI is impressive and genuinely useful. It also fails in predictable ways. Once you know the failure patterns, you'll know when to trust it, when to double-check, and when to do the work yourself." },
      { t: "h", text: "Where AI commonly fails" },
      { t: "list", items: [
        "**Making things up.** LLMs can invent facts, quotes, statistics, and sources that look real.",
        "**Outdated knowledge.** A model only knows its training data unless it's connected to search.",
        "**Letters and exact counting.** Because models see tokens, tasks like counting letters or precise arithmetic can trip them up unless they use a calculator tool.",
        "**Bias.** Models absorb the patterns and stereotypes in their training data.",
        "**Brittleness.** Small, unexpected changes, like a sticker on a stop sign or an oddly worded question, can throw a model off.",
        "**No real-world grounding.** It has never tasted food, felt tired, or sat in your classroom. It knows *descriptions* of experiences.",
        "**Agreeing too easily.** Models often go along with the premise of your question, even when the premise is wrong.",
      ] },
      { t: "compare", left: { title: "AI is strong at", items: ["Drafting, summarizing, and rephrasing", "Spotting patterns in huge amounts of data", "Explaining a concept five different ways", "Generating lots of options fast"] }, right: { title: "You are stronger at", items: ["Knowing what's true about your own life and class", "Judging what matters and what's fair", "Being accountable for a decision", "Noticing when something feels off"] } },
      { t: "h", text: "Does AI understand?" },
      { t: "p", text: "This is a real debate, not a settled fact. Some researchers argue LLMs build genuine internal models of the world. Others argue they're very sophisticated pattern-matchers. What everyone agrees on: AI doesn't have your goals, your context, or your responsibility for the result. **You** do." },
      { t: "note", kind: "key", title: "The human-in-the-loop rule", text: "Use AI to go faster, and stay in charge of anything that matters: facts you'll cite, decisions about people, and work with your name on it." },
    ],
    takeaways: [
      "AI fails in predictable ways: made-up facts, outdated info, counting, bias, and brittleness.",
      "Whether AI truly understands is still debated.",
      "Humans stay responsible for facts, decisions, and their own work.",
    ],
    quiz: [
      { q: "You ask a chatbot (without web search) about last week's news. What's the main risk?", options: ["It will refuse to answer", "Its knowledge cutoff means it may not know, and it might make something up", "It will charge you money", "It will answer too slowly"], answer: 1, why: "Without search, the model only knows its training data, and it may fill the gap with plausible fiction." },
      { q: "Why might an AI miscount the letters in a word?", options: ["It processes text as tokens, not individual letters", "It can't read English", "It's trying to trick you", "Letters are copyrighted"], answer: 0, why: "Tokenization means the model often doesn't directly see each letter." },
      { q: "Which task should a human most clearly stay in charge of?", options: ["Generating 20 title ideas", "Rephrasing a sentence", "Deciding whether a classmate broke a school rule", "Summarizing a long article for a first read"], answer: 2, why: "Decisions that affect people need human judgment and accountability." },
    ],
  },
};
