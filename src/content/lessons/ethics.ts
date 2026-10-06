import type { LessonContent } from "../lesson-types";

export const ethics: Record<string, LessonContent> = {
  "bias-in-ai": {
    hook: "A computer has no opinions. So how did a hiring AI learn to downgrade résumés that mentioned \"women's\"?",
    blocks: [
      { t: "p", text: "**AI bias** is when a system's outputs are systematically unfair to certain groups. The model isn't prejudiced the way a person is. It learned patterns from data, and data reflects the world, including its unfairness." },
      { t: "h", text: "Where bias sneaks in" },
      { t: "terms", items: [
        { term: "Historical data", def: "If past decisions were unfair, a model trained on them learns to repeat them." },
        { term: "Who's missing", def: "If a group is underrepresented in the training data, the model works worse for them." },
        { term: "Labeling", def: "People label training data, and their assumptions get baked in." },
        { term: "Proxies", def: "Even if you remove race or gender, other features like ZIP code or school name can stand in for them." },
        { term: "How it's used", def: "A fair model used in the wrong context can still cause unfair outcomes." },
      ] },
      { t: "h", text: "Real cases" },
      { t: "list", items: [
        "**Hiring:** In 2018 Reuters reported that Amazon scrapped an experimental recruiting tool. Trained on a decade of résumés from a male-dominated industry, it learned to penalize résumés containing the word \"women's.\"",
        "**Face analysis:** The 2018 *Gender Shades* study by Joy Buolamwini and Timnit Gebru found commercial gender-classification systems had error rates under 1% for lighter-skinned men, but up to about 35% for darker-skinned women.",
        "**Image generation:** Ask some generators for \"a CEO\" or \"a nurse\" and you may see stereotypes repeated over and over, because the training images were skewed.",
      ] },
      { t: "h", text: "What fixing it looks like" },
      { t: "list", items: [
        "Collect more representative data, and check who's missing.",
        "Test performance separately for different groups, not just on average.",
        "Involve the communities affected in design and review.",
        "Keep humans in charge of high-stakes decisions, and give people a way to appeal.",
      ] },
      { t: "note", kind: "key", title: "As a user, you can spot it too", text: "When an AI tool describes, depicts, or judges people, ask: *who might this be unfair to?* If you see a stereotype, don't pass it along. Report it or regenerate." },
      { t: "note", kind: "try", title: "See it happen in the Bias Lab", text: "You'll train a model on skewed data, watch it make unfair calls, and then fix the data." },
    ],
    takeaways: [
      "AI bias comes from data, labels, proxies, and how systems are used.",
      "Real systems in hiring and face analysis have shown measurable bias.",
      "Fixes include better data, testing by group, and human oversight.",
    ],
    quiz: [
      { q: "Why did Amazon's experimental recruiting tool penalize some résumés?", options: ["A programmer wrote a rule against women", "It learned from years of past résumés that came mostly from men", "It was hacked", "It only read the first line"], answer: 1, why: "It learned the historical pattern in its training data." },
      { q: "A model never sees gender, but it uses ZIP code and school name. Can it still be biased?", options: ["No, gender was removed", "Yes, other features can act as proxies", "Only if it's a chatbot", "Only on weekends"], answer: 1, why: "Proxy features can carry the same information as the removed one." },
      { q: "What did the Gender Shades study show?", options: ["All face systems were perfect", "Error rates were far higher for darker-skinned women than lighter-skinned men", "Face systems can't see glasses", "Bias only exists in chatbots"], answer: 1, why: "The study found large accuracy gaps across skin type and gender groups." },
    ],
  },

  "hallucinations": {
    hook: "In 2023 two lawyers were fined after filing a brief full of court cases ChatGPT made up. The cases had names, quotes, and citations. None of them existed.",
    blocks: [
      { t: "p", text: "A **hallucination** is when an AI produces information that's false or made up but presents it as fact. Remember how LLMs work: they generate *likely-sounding* text. A fake citation in the right format sounds very likely." },
      { t: "h", text: "Why it happens" },
      { t: "list", items: [
        "The model is predicting patterns, not checking a database of facts.",
        "It's trained to be helpful, so it often answers instead of saying \"I don't know.\"",
        "Rare topics, recent events, and very specific details (dates, numbers, names) are where it fails most.",
      ] },
      { t: "p", text: "In that 2023 case, *Mata v. Avianca*, a federal judge sanctioned the lawyers. It's become the go-to warning for every profession: **AI drafts, humans verify.**" },
      { t: "h", text: "Deepfakes" },
      { t: "p", text: "Generative AI can also create realistic fake images, video, and audio of real people. These **deepfakes** have been used for scams, harassment, and spreading false news. Sharing a deepfake of a classmate isn't a joke. It can be bullying, and in many places it's illegal." },
      { t: "list", items: [
        "**Check the source.** Who posted it first? Is it reported by trusted outlets?",
        "**Look for content credentials.** Some images now carry provenance info (the C2PA standard) showing how they were made.",
        "**Be suspicious of urgent emotion.** Outrage and panic are what fakes are built to trigger.",
        "**Voice scams:** a cloned voice can sound like a family member. Agree on a family *safe word* for emergencies.",
      ] },
      { t: "note", kind: "warn", title: "Visual tells are fading", text: "Old advice like \"count the fingers\" doesn't work reliably anymore. Checking the source beats squinting at pixels." },
      { t: "note", kind: "try", title: "Spot the Hallucination", text: "The lab gives you AI answers with planted mistakes. How many can you catch?" },
    ],
    takeaways: [
      "Hallucinations are confident, made-up information.",
      "They happen because LLMs predict plausible text, not verified facts.",
      "For deepfakes, check the source and provenance, not just the pixels.",
    ],
    quiz: [
      { q: "What is an AI hallucination?", options: ["When AI crashes", "When AI presents false or made-up information as fact", "When AI refuses to answer", "A bug in the screen"], answer: 1, why: "Hallucinations are confident outputs that aren't true." },
      { q: "What happened in Mata v. Avianca (2023)?", options: ["AI won a court case", "Lawyers were sanctioned for submitting fake cases generated by ChatGPT", "A judge was replaced by AI", "ChatGPT was banned nationwide"], answer: 1, why: "The brief cited cases that didn't exist, and the lawyers were sanctioned." },
      { q: "A shocking video of a celebrity goes viral. What's the best first step?", options: ["Share it fast", "Zoom in to count fingers", "Check who posted it originally and whether trusted outlets report it", "Comment on it"], answer: 2, why: "Source checking is more reliable than visual tells." },
    ],
  },

  "academic-integrity": {
    hook: "Is using AI cheating? The honest answer: *it depends on the assignment*, and the rules are yours to find out.",
    blocks: [
      { t: "p", text: "**Academic integrity** means the work you turn in honestly represents what *you* did and learned. AI doesn't change that principle. It just makes the lines easier to cross without noticing." },
      { t: "h", text: "Three questions to ask every time" },
      { t: "list", ordered: true, items: [
        "**What does this assignment allow?** Check the syllabus or ask. Rules can differ between classes, and even between assignments.",
        "**Would I be comfortable showing my teacher exactly how I used AI?** If not, that's your answer.",
        "**Am I still doing the learning this assignment is for?** If AI did the part you were supposed to practice, you skipped the point.",
      ] },
      { t: "widget", id: "sort", sort: {
        prompt: "Where does each one usually land?",
        buckets: ["Usually OK", "Ask first", "Not OK"],
        items: [
          { label: "Asking AI to explain a concept you didn't understand in class", bucket: 0, why: "It's like using a tutor or a textbook. You're doing the learning." },
          { label: "Pasting the essay prompt and turning in what AI writes", bucket: 2, why: "That's submitting someone else's work as your own, which is plagiarism." },
          { label: "Using AI to check grammar on your final draft", bucket: 1, why: "Some teachers allow it, and some count heavy rewriting as AI-generated. Check the rules." },
          { label: "Having AI quiz you before a test", bucket: 0, why: "Practice testing is a great study method." },
          { label: "Using AI during a closed-book test", bucket: 2, why: "That breaks the rules of the assessment." },
          { label: "Using AI to brainstorm, then writing everything yourself", bucket: 1, why: "Often allowed, but some assignments are meant to test your own idea generation. Ask and disclose." },
        ],
      } },
      { t: "h", text: "About AI detectors" },
      { t: "p", text: "AI-writing detectors are **not reliable proof**. Research, including a 2023 Stanford study, found they frequently flagged writing by non-native English speakers as AI-generated. If you're ever accused, your best defense is your process: drafts, notes, version history, and a process log." },
      { t: "note", kind: "key", title: "When in doubt: ask, then disclose", text: "Asking first is never wrong. If you use AI, say how. Honesty about your process protects you." },
      { t: "note", kind: "try", title: "Integrity Simulator", text: "In the Ethics lab you'll make choices in realistic situations and see how they play out." },
    ],
    takeaways: [
      "Integrity means your work honestly represents what you did.",
      "Rules differ by class and assignment. Ask when unsure.",
      "AI detectors aren't reliable. Keep drafts and a process log.",
    ],
    quiz: [
      { q: "Your syllabus doesn't mention AI. What should you do?", options: ["Assume anything goes", "Ask your teacher before using it on graded work", "Assume it's banned forever", "Ask a friend what they did"], answer: 1, why: "When the rules aren't clear, asking first is always safest." },
      { q: "Which use is most clearly a violation?", options: ["Asking AI to explain photosynthesis", "Turning in an AI-written essay as your own", "Using AI flashcards to study", "Asking AI for a study schedule"], answer: 1, why: "Submitting AI work as your own misrepresents what you did." },
      { q: "Why aren't AI detectors proof of cheating?", options: ["They're always right", "They make mistakes and have flagged non-native English writers unfairly", "They only work on math", "They're illegal"], answer: 1, why: "Detectors produce false positives and shouldn't be the only evidence." },
    ],
  },

  "citing-ai": {
    hook: "If AI shaped your work, your reader deserves to know. Citing it takes thirty seconds.",
    blocks: [
      { t: "p", text: "You cite sources so readers can see where ideas came from. When AI contributes words, ideas, or images to your work, and your teacher allows it, you cite it too. Both MLA and APA have published guidance for this." },
      { t: "h", text: "MLA (9th edition)" },
      { t: "p", text: "MLA treats the **prompt** as the title, the **tool** as the container, and includes the version, the company, the date you used it, and the web address." },
      { t: "example", label: "MLA format", text: "“Prompt text” prompt. Tool name, version, Company, Day Month Year, URL." },
      { t: "h", text: "APA (7th edition)" },
      { t: "p", text: "APA treats the **company** as the author and the **model** as the work. In your text, cite it like (OpenAI, 2025). APA also recommends describing in your paper how you used the tool and including the prompt." },
      { t: "example", label: "APA format", text: "Company. (Year). Tool name (Version) [Large language model]. URL" },
      { t: "widget", id: "citation-builder" },
      { t: "h", text: "Beyond the citation" },
      { t: "list", items: [
        "**Disclose how you used it.** A short note like *\"I used ChatGPT to brainstorm counterarguments. All writing is my own.\"* is often what teachers want most.",
        "**Never cite AI as a source for facts.** Find the real source and cite that instead.",
        "**Save your chat** or a screenshot in case your teacher asks to see it.",
      ] },
      { t: "note", kind: "key", title: "Teacher rules come first", text: "Some teachers want a specific disclosure statement instead of, or in addition to, a formal citation. Follow theirs." },
    ],
    takeaways: [
      "Cite AI when it contributes words, ideas, or images, if it's allowed.",
      "MLA uses the prompt as the title. APA uses the company as the author.",
      "Disclose how you used AI, and cite real sources for facts.",
    ],
    quiz: [
      { q: "In an MLA citation for AI, what goes in the title position?", options: ["The company name", "A description of the prompt", "Your name", "The URL"], answer: 1, why: "MLA uses the prompt as the title of the source." },
      { q: "In APA, who is listed as the author of a ChatGPT citation?", options: ["You", "ChatGPT", "OpenAI, the company", "No author"], answer: 2, why: "APA lists the company that made the model as the author." },
      { q: "AI told you a statistic. How should you cite it?", options: ["Cite the AI as the source", "Find the original source of the statistic and cite that", "Don't cite it", "Cite Wikipedia"], answer: 1, why: "AI isn't a reliable source for facts. Find and cite the original." },
    ],
  },

  "privacy": {
    hook: "Everything you type into a chatbot goes to someone's servers. What happens to it next depends on settings most people never open.",
    blocks: [
      { t: "p", text: "When you chat with an AI tool, your messages are sent to the company that runs it. Depending on the tool and your settings, they may be **stored**, **reviewed by people** for safety or quality, or **used to train future models**. Assume anything you type could be seen by someone else." },
      { t: "h", text: "Never paste" },
      { t: "list", items: [
        "Full names, addresses, phone numbers, or emails, yours or anyone else's",
        "Passwords, student IDs, or account numbers",
        "Health, mental health, or other deeply personal information",
        "Private messages or photos of other people",
        "Unreleased tests, answer keys, or a classmate's work",
      ] },
      { t: "widget", id: "redact" },
      { t: "h", text: "Protect yourself" },
      { t: "list", items: [
        "**Open the settings.** Many tools let you turn off chat history or model training.",
        "**Use school-approved tools.** Districts often have agreements that protect student data.",
        "**Generalize.** \"A student at my school\" works just as well as a name.",
        "**Know the laws.** In the U.S., COPPA protects personal data of children under 13 online, and FERPA protects student education records.",
      ] },
      { t: "note", kind: "key", title: "How this site handles your data", text: "Neuron stores your progress only in your own browser. There's no account and nothing is sent to a server. You can reset it any time from your profile." },
    ],
    takeaways: [
      "Chats may be stored, reviewed, or used for training.",
      "Never paste personal, health, login, or other people's information.",
      "Check settings, use approved tools, and generalize details.",
    ],
    quiz: [
      { q: "Which is safest to include in a prompt?", options: ["Your student ID", "\"A 10th grader at a public school\"", "Your friend's phone number", "Your home address"], answer: 1, why: "General descriptions give context without identifying anyone." },
      { q: "What might happen to chats with some AI tools by default?", options: ["They vanish instantly", "They can be stored and possibly used to train future models", "They get printed and mailed", "Nothing at all, ever"], answer: 1, why: "Many tools store chats. Some use them for training unless you opt out." },
      { q: "Your friend shares a private problem with you. Should you paste their message into a chatbot for advice?", options: ["Yes, it's anonymous", "No. It's their private information, so generalize or ask them first", "Yes, if it's short", "Only at night"], answer: 1, why: "Other people's private information isn't yours to share." },
    ],
  },
};
