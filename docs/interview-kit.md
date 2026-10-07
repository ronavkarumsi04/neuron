# Interview kit

## 30-second pitch

Most students already use AI, but few understand what it's doing. Neuron takes high schoolers from "what is AI?" all the way to how model weights are stored and how AI agents are built, by having them build small AI systems and then break them. They train a neural network on their own drawings, watch a next-word model guess, and watch an admissions model pick up bias from biased history. The progress dashboard is a brain: every lesson is a neuron that lights up when you pass it and fades if you stop reviewing it. Everything runs in the browser, so there are no accounts and no student data collected, and it works offline.

## Three-minute demo path (Judge Mode, `/judge`)

1. **Home**: scroll the story from one neuron to an AI agent. It previews the whole course, beginner to expert.
2. **Brain map**: the sample student has 15 of 38 neurons lit, some of them fading. Click one.
3. **Review**: answer a question and the neuron relights.
4. **Backprop by hand** (Module 05): step the network and watch every gradient. This is the advanced track most teams won't have.
5. **Teach the Machine**: add sample drawings, train, and watch the accuracy climb.
6. **Bias Lab**: dropping the column doesn't fix the bias. Fixing the labels does.
7. **Progress**: rank (Bronze I → Supersonic Legend), XP, badges, and the before/after skill check.

## Likely questions

**Why no accounts?** Our users are minors. COPPA and FERPA make collecting student data a real responsibility, and logging in costs class time. Saving progress on the device covers what a student needs, and the anonymous skill-check export covers what a teacher needs.

**Is the AI real?** Yes. Teach the Machine trains a small neural network with backpropagation in the browser. The next-word widget is a real n-gram language model built from the site's own text. The bias lab trains a logistic model on synthetic applicant data. None of these are scripted animations.

**Why not use ChatGPT's API?** It would need an API key, send student text to a third party, cost money, and stop working offline. Small models that students can inspect teach the same ideas more clearly.

**How do you know it works?** The pre/post skill check. *(Fill in: n = __ classmates, average __% → __%. Biggest gain in __.)*

**Why do neurons fade?** Spaced repetition is one of the best-supported findings in learning science (Ebbinghaus; Cepeda et al., 2006). Review intervals grow from 3 to 7, 14, 30, then 60 days. The fading shows students what they've stopped practicing.

**Accessibility?** axe-core finds 0 violations across all 63 routes in both themes, and Lighthouse accessibility scores 100. The site also has an in-site panel for contrast, a readable font, text size, and reduced motion. See `docs/audit.md`.

**Hardest bug?** *(Pick one you understand well. For example: a page crashed only for visitors whose browser was set to German, because the server printed 50,257 and the browser printed 50.257, and React refused to hydrate the mismatch. Or: the review queue had to be built from saved progress after hydration.)*

**How did you use AI to build this?** *(Answer honestly, following the TSA rules for your event.)*

**How is the rank calculated?** Not from XP alone. It blends course mastery (harder modules count more), first-try quiz accuracy, labs, skill-check results, current and best streak, reviews, badges, and XP with diminishing returns. It can drop if neurons fade, so it rewards remembering, not just clicking.

**Why go this deep for high schoolers?** The core modules meet the requirements. The advanced track (Modules 05–08) is for students who want to know how ChatGPT actually works, down to parameter counts and quantization, and each module unlocks only after the one before it.

**What would you add next?** A class dashboard that merges students' exported results, a Spanish translation, and more labs, such as one on recommendation algorithms.
