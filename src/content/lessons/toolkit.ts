import type { LessonContent } from "../lesson-types";

export const toolkit: Record<string, LessonContent> = {
  "the-ai-toolbox": {
    hook: "There isn't one \"AI.\" There are dozens of tools, each good at different jobs. Using the wrong one is like writing an essay in a calculator app.",
    blocks: [
      { t: "p", text: "AI tools fall into a few families. Knowing the family tells you what the tool is good at, what it's bad at, and how much to trust it." },
      { t: "terms", items: [
        { term: "Chat assistants", def: "General-purpose LLMs like ChatGPT, Claude, Gemini, and Microsoft Copilot. Great for explaining, brainstorming, and drafting. They can hallucinate." },
        { term: "Search + AI", def: "Tools that search the web and then summarize with links, like Perplexity or AI search modes. Better for current facts. *Always click the sources.*" },
        { term: "Study tools", def: "AI built for learning, like Khanmigo or NotebookLM, which answers only from documents you upload. Often designed to tutor rather than give answers." },
        { term: "Writing aids", def: "Grammar and clarity tools like Grammarly or built-in editor suggestions. Helpful for polish. Check your class policy on rewriting features." },
        { term: "Image & media", def: "Generators for images, music, and video. Useful for mockups and creative exploration. Watch copyright and disclosure rules." },
        { term: "Accessibility", def: "Speech-to-text, text-to-speech, live captions, and image description. Some of the most life-changing uses of AI." },
      ] },
      { t: "widget", id: "sort", sort: {
        prompt: "Pick the best tool family for the job",
        buckets: ["Chat assistant", "Search + AI", "Study tool"],
        items: [
          { label: "Find out what the city council decided yesterday", bucket: 1, why: "It's recent news. You need live search with links you can check." },
          { label: "Brainstorm 15 angles for a persuasive essay", bucket: 0, why: "Open-ended idea generation is a chat assistant's sweet spot." },
          { label: "Quiz yourself only on the chapter your teacher assigned", bucket: 2, why: "A tool that answers from your uploaded notes keeps it on your material." },
          { label: "Explain derivatives with a skateboarding analogy", bucket: 0, why: "Re-explaining a concept in a new way is what chat assistants do best." },
          { label: "Get the current population of Brazil with a source", bucket: 1, why: "Specific, checkable facts call for search with citations." },
        ],
      } },
      { t: "h", text: "Before you use any tool" },
      { t: "list", items: [
        "**Check the age rules.** Many AI services require users to be at least 13, and some require parent permission for anyone under 18. Read the terms.",
        "**Check your school's policy** and your teacher's rules for each assignment.",
        "**Check the data settings.** Some tools let you turn off saving chats or using them for training.",
        "**Prefer school-approved tools** when your district provides them. They often have stronger privacy protections.",
      ] },
      { t: "note", kind: "key", title: "Match the tool to the task", text: "Need a fact? Use search and check sources. Need ideas or explanations? Use a chat assistant. Need to learn your class material? Use a study tool built on your notes." },
    ],
    takeaways: [
      "AI tools come in families: chat, search, study, writing, media, and accessibility.",
      "Use search-based tools with sources for current or checkable facts.",
      "Check age rules, school policy, and data settings first.",
    ],
    quiz: [
      { q: "You need a statistic for a research paper. Which approach is best?", options: ["Ask a chat assistant and paste the number", "Use a search-based AI tool, then open and verify the original source", "Use an image generator", "Guess"], answer: 1, why: "Facts you cite need a real, verified source. Search tools give you links to check." },
      { q: "What's a key advantage of a tool like NotebookLM for studying?", options: ["It's always correct", "It answers based on the documents you give it", "It writes your essay", "It has no rules"], answer: 1, why: "Grounding answers in your own course materials keeps it on topic and easier to check." },
      { q: "Before signing up for a new AI tool, you should check…", options: ["Only the logo", "Age requirements, school policy, and data settings", "How many ads it has", "Nothing, they're all the same"], answer: 1, why: "Terms, policy, and privacy settings decide whether and how you should use a tool." },
    ],
  },

  "prompting-101": {
    hook: "\"Help me with bio\" gets you a generic wall of text. Four extra sentences can turn the same AI into a personal tutor.",
    blocks: [
      { t: "p", text: "A **prompt** is the instruction you give an AI. The model can't read your mind, see your syllabus, or know your grade level. Everything you leave out, it has to guess, and guesses produce generic answers." },
      { t: "h", text: "The CRAFT check" },
      { t: "p", text: "Before you hit enter, run through five letters. You won't always need all five, but checking takes ten seconds." },
      { t: "terms", items: [
        { term: "C · Context", def: "Who you are, what you already know, and what this is for." },
        { term: "R · Role", def: "Who the AI should act as: a tutor, a skeptical reviewer, a debate opponent." },
        { term: "A · Ask", def: "The specific task. Use a clear verb: *quiz me, explain, compare, critique.*" },
        { term: "F · Format", def: "What the answer should look like: length, bullets, table, reading level." },
        { term: "T · Tweak", def: "How to adjust or follow up: *ask me one question at a time; if I'm wrong, hint first.*" },
      ] },
      { t: "widget", id: "prompt-builder" },
      { t: "h", text: "Techniques that work" },
      { t: "list", items: [
        "**Give an example.** Show one sample of what you want. This is called *few-shot prompting*.",
        "**Ask it to ask you.** *\"Before you answer, ask me 3 questions about what I need.\"*",
        "**Break big tasks into steps.** Outline first, then each section, instead of everything at once.",
        "**Ask it to show its reasoning** on math and logic problems, then check each step yourself.",
        "**Iterate.** The first answer is a draft. Reply with what to change: *shorter, simpler, more examples, cut the jargon.*",
      ] },
      { t: "compare", left: { title: "Weak prompt", items: ["\"explain photosynthesis\""] }, right: { title: "CRAFT prompt", items: ["\"I'm in 9th grade biology and confused about where the oxygen in photosynthesis comes from (context). Act as a tutor (role). Explain it using a kitchen analogy (ask) in under 150 words (format), then ask me one question to check I got it (tweak).\""] } },
      { t: "note", kind: "try", title: "Practice in the Prompt Lab", text: "The Prompt Lab scores your prompts on clarity, context, and constraints and shows exactly what's missing." },
    ],
    takeaways: [
      "Anything you leave out of a prompt, the AI has to guess.",
      "CRAFT: Context, Role, Ask, Format, Tweak.",
      "Examples, step-by-step requests, and iteration make answers much better.",
    ],
    quiz: [
      { q: "Which part of CRAFT is \"I'm a 10th grader who already understands glycolysis\"?", options: ["Role", "Context", "Format", "Tweak"], answer: 1, why: "Telling the AI who you are and what you know is context." },
      { q: "\"Answer in a table with three columns\" is an example of…", options: ["Format", "Role", "Context", "Ask"], answer: 0, why: "It describes the shape of the output." },
      { q: "The AI's first answer is too long and too technical. Best next step?", options: ["Give up on AI", "Reply with specific changes, like 'shorter, simpler, 8th-grade reading level'", "Copy it anyway", "Ask the same question again word for word"], answer: 1, why: "Iterating with specific feedback is how you steer the model." },
    ],
  },

  "studying-with-ai": {
    hook: "AI can make you learn faster, or it can make you learn nothing at all. The difference is who does the thinking.",
    blocks: [
      { t: "p", text: "Learning science has a simple rule: **you remember what you work to produce.** Struggling to recall an answer, explain an idea, or solve a problem is what builds memory. If AI does that work, *it* gets the practice, and you get a nice-looking page you'll forget by Friday." },
      { t: "compare", left: { title: "Ghostwriter mode (you learn less)", items: ["\"Write my lab conclusion\"", "\"Solve problems 1–10\"", "\"Summarize the chapter so I don't have to read it\""] }, right: { title: "Tutor mode (you learn more)", items: ["\"Ask me questions until I can write my own conclusion\"", "\"Give me a hint on #4, but not the answer\"", "\"I read the chapter. Quiz me on it and tell me what I missed\""] } },
      { t: "h", text: "Six study moves" },
      { t: "list", ordered: true, items: [
        "**Quiz me.** Ask for practice questions one at a time, and answer before seeing feedback.",
        "**Explain it differently.** Ask for an analogy, a simpler version, or a worked example.",
        "**Teach it back.** Explain the concept to the AI and ask it to find gaps in your explanation.",
        "**Feedback, not rewrites.** Paste your draft and ask for comments using your teacher's rubric, then make the edits yourself.",
        "**Plan it out.** Ask for a study schedule that spaces review over several days before a test.",
        "**Make flashcards** from *your* notes, then test yourself with them.",
      ] },
      { t: "example", label: "Copy this tutor prompt", text: "I'm studying [topic] for [class]. Act as a tutor. Don't give me answers directly. Ask me one question at a time, wait for my reply, and if I'm wrong, give a hint before explaining. After 5 questions, summarize what I should review." },
      { t: "note", kind: "warn", title: "Check the facts it teaches you", text: "A tutor that's confidently wrong is worse than no tutor. Cross-check key facts against your textbook or class notes." },
    ],
    takeaways: [
      "Whoever does the thinking does the learning.",
      "Use AI to quiz, explain, give feedback, and plan, not to produce your work.",
      "Answer first, then check. Verify facts against class materials.",
    ],
    quiz: [
      { q: "Which request helps you learn the most?", options: ["\"Write my essay on Hamlet\"", "\"Quiz me on Hamlet's themes, one question at a time, and wait for my answers\"", "\"Give me the answers to the worksheet\"", "\"Summarize Hamlet so I can skip reading it\""], answer: 1, why: "Retrieval practice, where you produce the answers, builds memory." },
      { q: "You want help improving your essay draft. Best approach?", options: ["Ask AI to rewrite it", "Ask for feedback against the rubric, then revise it yourself", "Ask AI to write a new one", "Don't ask for any feedback"], answer: 1, why: "Feedback keeps the work and the learning yours." },
      { q: "Why is 'teach it back' effective?", options: ["It's faster than reading", "Explaining a concept reveals gaps in your own understanding", "AI likes being taught", "It avoids homework"], answer: 1, why: "Explaining forces you to organize what you know and exposes what you don't." },
    ],
  },

  "verifying-outputs": {
    hook: "An AI once confidently cited a court case that never existed, and a lawyer submitted it to a real judge. Here's how not to be that lawyer.",
    blocks: [
      { t: "p", text: "Treat every AI answer like a tip from a smart friend who sometimes makes things up: **useful, but unverified**. The more an answer matters, like a fact you'll cite, a health question, or anything with your name on it, the more you check." },
      { t: "h", text: "Use SIFT" },
      { t: "p", text: "SIFT is a fact-checking method created by digital literacy researcher Mike Caulfield. It works for AI answers too." },
      { t: "terms", items: [
        { term: "S · Stop", def: "Pause before you believe or share it. Does this claim matter? Does it seem too neat?" },
        { term: "I · Investigate", def: "Who is the source? For AI, that means asking where this information actually comes from." },
        { term: "F · Find better coverage", def: "Search for the claim in trusted sources: textbooks, .gov and .edu sites, established news, encyclopedias." },
        { term: "T · Trace", def: "Follow quotes, numbers, and studies back to the original. Does the original actually say that?" },
      ] },
      { t: "h", text: "Red flags in AI answers" },
      { t: "list", items: [
        "**Citations you can't find.** Search the exact title. Fake sources are common.",
        "**Very specific numbers** with no source attached.",
        "**Quotes** attributed to real people. Check that they actually said it.",
        "**Recent events**, especially from a model without web search.",
        "**Answers that change** when you ask the same question again.",
      ] },
      { t: "compare", left: { title: "Don't", items: ["Ask the AI \"are you sure?\" and trust the reply", "Assume a link proves the claim", "Copy numbers straight into your paper"] }, right: { title: "Do", items: ["Check claims in an independent source", "Open the link and find the exact sentence", "Read laterally: open new tabs and see what others say"] } },
      { t: "note", kind: "try", title: "Play Spot the Hallucination", text: "In the lab you'll get AI answers with planted errors. Find them before the timer runs out." },
    ],
    takeaways: [
      "AI answers are unverified tips. The higher the stakes, the more you check.",
      "SIFT: Stop, Investigate the source, Find better coverage, Trace to the original.",
      "Fake citations, unsourced numbers, and quotes are the biggest red flags.",
    ],
    quiz: [
      { q: "An AI gives you a quote from a famous scientist. What should you do before using it?", options: ["Use it, AI is usually right", "Ask the AI if it's sure", "Find the quote in a reliable original source", "Change a few words"], answer: 2, why: "Tracing claims to the original source is the only reliable check." },
      { q: "What does the T in SIFT stand for?", options: ["Trust", "Trace claims to the original", "Type faster", "Test the AI"], answer: 1, why: "Trace quotes, numbers, and studies back to where they came from." },
      { q: "Which is the biggest red flag?", options: ["A short answer", "A citation that doesn't show up when you search its exact title", "An answer in bullet points", "An answer that uses simple words"], answer: 1, why: "Unfindable citations are a classic sign of hallucination." },
    ],
  },

  "ai-for-projects": {
    hook: "AI can be a great teammate on a big project. The trick is keeping it a teammate and not letting it become the author.",
    blocks: [
      { t: "p", text: "Big projects, like research papers, science fairs, coding projects, and presentations, have stages. AI helps differently at each one, and your teacher may allow it at some stages and not others." },
      { t: "h", text: "Where AI can help" },
      { t: "list", items: [
        "**Exploring:** brainstorm topics, find angles, and generate research questions.",
        "**Planning:** break the project into steps and a timeline.",
        "**Researching:** find search terms and leads. Then go read real sources yourself.",
        "**Getting feedback:** ask for critique of your outline, argument, or code.",
        "**Debugging:** ask why your code throws an error, and make sure you understand the fix.",
        "**Practicing:** rehearse a presentation and ask it to play a tough questioner.",
      ] },
      { t: "h", text: "Levels of AI use" },
      { t: "p", text: "Many schools use a scale like this to say how much AI is allowed on an assignment. If you're not sure which level applies, **ask your teacher before you start.**" },
      { t: "terms", items: [
        { term: "Level 0", def: "No AI. Everything is your own work." },
        { term: "Level 1", def: "AI for brainstorming and planning only. The writing and work are yours." },
        { term: "Level 2", def: "AI for feedback and editing suggestions, with your use disclosed." },
        { term: "Level 3", def: "AI as a collaborator on parts of the work, clearly disclosed and cited." },
        { term: "Level 4", def: "AI use is the point of the assignment, like studying AI itself." },
      ] },
      { t: "h", text: "Keep a process log" },
      { t: "p", text: "Write down when you used AI, what you asked, and what you did with the result. It takes a minute, it makes disclosure easy, and it's proof of your own thinking if anyone ever asks." },
      { t: "example", label: "Process log entry", text: "Oct 3 · ChatGPT · Asked for 10 research questions on microplastics in rivers. Picked #4, rewrote it to focus on our local creek. Didn't use any AI text in the paper." },
      { t: "note", kind: "key", title: "You own the result", text: "If AI introduces an error, plagiarism, or a fake source into your project, it's still your name on it. Review everything." },
    ],
    takeaways: [
      "AI can help explore, plan, research, give feedback, and debug.",
      "Assignments have different allowed levels of AI use. Ask when unsure.",
      "A process log makes disclosure easy and shows your thinking.",
    ],
    quiz: [
      { q: "Your teacher says an assignment is \"Level 1: brainstorming only.\" Which use is allowed?", options: ["AI writes the introduction", "AI suggests possible topics, and you write everything", "AI edits your final draft", "AI writes the conclusion"], answer: 1, why: "Level 1 limits AI to brainstorming and planning." },
      { q: "Why keep a process log of your AI use?", options: ["It's required by law", "It makes disclosure easy and documents your own thinking", "AI tools require it", "To make the project longer"], answer: 1, why: "A log shows how you used AI and what was your own work." },
      { q: "AI suggests a fix for your code. What should you do?", options: ["Paste it in without reading", "Make sure you understand why it works before using it", "Delete your code", "Ask a different AI to paste it"], answer: 1, why: "If you can't explain the fix, you can't own or debug it later." },
    ],
  },
};
