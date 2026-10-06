import type { LessonContent } from "../lesson-types";

export const future: Record<string, LessonContent> = {
  "ai-across-fields": {
    hook: "In 2024 the Nobel Prize in Chemistry went partly to two AI researchers. AI isn't just a tech-industry thing anymore.",
    blocks: [
      { t: "p", text: "AI is now a tool in almost every field. The pattern is usually the same: a field has a hard problem with lots of data, and AI finds patterns faster than people can." },
      { t: "terms", items: [
        { term: "Biology", def: "DeepMind's **AlphaFold** predicts the 3D shapes of proteins, a problem scientists worked on for 50 years. Demis Hassabis and John Jumper shared the 2024 Nobel Prize in Chemistry for it, with David Baker for protein design." },
        { term: "Medicine", def: "AI helps read medical scans, flag early signs of disease, and speed up drug discovery. Doctors make the final call." },
        { term: "Weather & climate", def: "AI weather models such as Google DeepMind's GraphCast can produce fast, accurate forecasts, helping communities prepare for storms." },
        { term: "Accessibility", def: "AI describes images for blind and low-vision users, captions speech live, and turns text into natural-sounding audio." },
        { term: "Sports", def: "Teams use computer vision to track player movement and analyze performance and injury risk." },
        { term: "Art & music", def: "Artists use AI for sketches, effects, and new kinds of interactive work, alongside serious debates about consent and credit for artists whose work was used in training." },
        { term: "Agriculture", def: "Computer vision spots crop disease and helps farmers use less water and pesticide." },
      ] },
      { t: "note", kind: "key", title: "Every field has both sides", text: "The same tools that speed up science also raise questions about jobs, consent, energy use, and who benefits. Being good at AI means thinking about both." },
    ],
    takeaways: [
      "AI is used in biology, medicine, weather, accessibility, sports, art, and farming.",
      "AlphaFold's protein predictions contributed to a 2024 Nobel Prize.",
      "Every application has benefits and tradeoffs to weigh.",
    ],
    quiz: [
      { q: "What problem did AlphaFold help solve?", options: ["Predicting stock prices", "Predicting the 3D structure of proteins", "Writing novels", "Translating languages"], answer: 1, why: "AlphaFold predicts protein structures, a decades-old challenge in biology." },
      { q: "In medicine, who should make the final decision when AI flags a possible disease?", options: ["The AI", "A qualified medical professional", "The patient's friends", "No one"], answer: 1, why: "AI assists, and accountable professionals decide." },
      { q: "Which is a real debate about AI in art?", options: ["Whether paint is real", "Consent and credit for artists whose work was used to train models", "Whether art exists", "Brush sizes"], answer: 1, why: "Training data consent and credit are active ethical and legal debates." },
    ],
  },

  "careers": {
    hook: "You don't have to be a coder to work with AI. But every career will involve it somehow.",
    blocks: [
      { t: "p", text: "There are two kinds of AI careers: jobs **building** AI, and jobs **using** AI in another field. The second group is much bigger, and it's growing." },
      { t: "terms", items: [
        { term: "ML engineer", def: "Builds and trains models and gets them working reliably in real products." },
        { term: "Data scientist", def: "Finds insights in data and builds models to answer questions." },
        { term: "AI researcher", def: "Invents new methods. Usually requires graduate study." },
        { term: "AI ethics & policy", def: "Shapes rules and practices for using AI fairly and safely, in companies, government, and nonprofits." },
        { term: "Product & UX design", def: "Designs how people interact with AI tools so they're useful and trustworthy." },
        { term: "AI + your field", def: "Doctors, lawyers, teachers, journalists, and artists who use AI well. This is most people." },
      ] },
      { t: "h", text: "Skills to start building now" },
      { t: "list", items: [
        "**Math:** statistics, algebra, and later linear algebra and calculus.",
        "**Programming:** Python is the most common language in AI.",
        "**Writing & communication:** explaining what a model does, and doesn't do, is a rare skill.",
        "**Ethics & critical thinking:** asking who a system helps and who it might harm.",
        "**A field you love:** AI is most powerful paired with deep knowledge of something else.",
      ] },
      { t: "note", kind: "try", title: "Start this week", text: "Pick one problem you care about at school or in your community and ask: what data would help, and what could go wrong if AI got it wrong?" },
    ],
    takeaways: [
      "AI careers include building AI and using AI in other fields.",
      "Math, Python, communication, and ethics are core skills.",
      "Deep knowledge of another field makes AI skills more valuable.",
    ],
    quiz: [
      { q: "Which is the larger group?", options: ["People who build AI models", "People who use AI within their own field", "They're exactly equal", "Neither exists"], answer: 1, why: "Far more people use AI in other professions than build it." },
      { q: "What's the most common programming language in AI?", options: ["HTML", "Python", "Scratch", "Excel"], answer: 1, why: "Python dominates machine learning tools and libraries." },
      { q: "Why does knowing another field matter for AI work?", options: ["It doesn't", "AI is most useful when paired with deep knowledge of a real problem", "It makes coding faster", "Employers require two degrees"], answer: 1, why: "Domain knowledge tells you which problems matter and when a model is wrong." },
    ],
  },

  "keep-learning": {
    hook: "You finished the core of Neuron. Here's where to go next, all of it free.",
    blocks: [
      { t: "h", text: "Free places to keep going" },
      { t: "terms", items: [
        { term: "Elements of AI", def: "A free online course from the University of Helsinki covering AI basics without heavy math." },
        { term: "Teachable Machine", def: "Google's free tool for training image, sound, and pose models in your browser, no code needed." },
        { term: "Code.org AI", def: "Free lessons and activities about how AI works, made for students." },
        { term: "Kaggle Learn", def: "Short, free hands-on courses in Python, machine learning, and data." },
        { term: "Google ML Crash Course", def: "A free, more technical intro to machine learning with exercises." },
      ] },
      { t: "h", text: "Project ideas" },
      { t: "list", items: [
        "Train a Teachable Machine model to sort recycling, then test where it fails.",
        "Survey classmates about how they use AI, and present what you find.",
        "Write your school's draft AI-use guidelines and share them with the student council.",
        "Compare three chatbots on the same 10 questions and fact-check every answer.",
      ] },
      { t: "note", kind: "key", title: "Stay curious and skeptical", text: "AI will keep changing fast. The habits you built here, like asking how it works, checking its claims, and using it honestly, will stay useful no matter which tools come next." },
    ],
    takeaways: [
      "Free courses and tools make it easy to keep learning.",
      "Small projects build real skills.",
      "Curiosity plus skepticism is the long-term skill.",
    ],
    quiz: [
      { q: "Which tool lets you train a model in your browser without code?", options: ["Teachable Machine", "A calculator", "A spreadsheet", "A word processor"], answer: 0, why: "Teachable Machine trains image, sound, and pose models with no coding." },
      { q: "What's the best habit to carry forward?", options: ["Trust whatever AI says", "Avoid AI completely", "Stay curious about how it works and check its claims", "Use only one tool forever"], answer: 2, why: "Curiosity and verification stay useful as tools change." },
      { q: "Comparing three chatbots on the same questions mainly teaches you…", options: ["Typing speed", "How answers differ and why fact-checking matters", "How to cheat", "Nothing"], answer: 1, why: "Side-by-side comparison exposes differences and errors." },
    ],
  },
};
