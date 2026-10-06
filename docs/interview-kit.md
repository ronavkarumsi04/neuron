# Interview kit

## 30-second pitch

Most students already use AI, but few understand what it's doing. Neuron teaches high schoolers how AI works by having them build small AI systems and then break them. They train a neural network on their own drawings, watch a next-word model guess, and watch an admissions model pick up bias from biased history. The progress dashboard is a brain: every lesson is a neuron that lights up when you pass it and fades if you stop reviewing it. Everything runs in the browser, so there are no accounts and no student data collected, and it works offline.

## Three-minute demo path (Judge Mode, `/judge`)

1. **Brain map**: 15 of 18 neurons are lit and six are fading. Click one.
2. **How LLMs predict words**: change the temperature, then switch "looks back" from 1 word to 2.
3. **Teach the Machine**: draw three shapes, train, and watch the accuracy climb.
4. **Bias Lab**: dropping the column doesn't fix the bias. Fixing the labels does.
5. **Review**: answer a question and the neuron relights.
6. **Progress / certificate**: badges, levels, and the before/after skill check.

## Likely questions

**Why no accounts?** Our users are minors. COPPA and FERPA make collecting student data a real responsibility, and logging in costs class time. Saving progress on the device covers what a student needs, and the anonymous skill-check export covers what a teacher needs.

**Is the AI real?** Yes. Teach the Machine trains a small neural network with backpropagation in the browser. The next-word widget is a real n-gram language model built from the site's own text. The bias lab trains a logistic model on synthetic applicant data. None of these are scripted animations.

**Why not use ChatGPT's API?** It would need an API key, send student text to a third party, cost money, and stop working offline. Small models that students can inspect teach the same ideas more clearly.

**How do you know it works?** The pre/post skill check. *(Fill in: n = __ classmates, average __% → __%. Biggest gain in __.)*

**Why do neurons fade?** Spaced repetition is one of the best-supported findings in learning science (Ebbinghaus; Cepeda et al., 2006). Review intervals grow from 3 to 7, 14, 30, then 60 days. The fading shows students what they've stopped practicing.

**Accessibility?** axe-core finds 0 violations across 25 routes in both themes, and Lighthouse accessibility scores 100. The site also has an in-site panel for contrast, a readable font, text size, and reduced motion. See `docs/audit.md`.

**Hardest bug?** *(Pick one you understand well. For example: the review queue had to be built from saved progress after hydration, or the service worker had to cache each page's JavaScript chunks so pages hydrate offline.)*

**How did you use AI to build this?** *(Answer honestly, following the TSA rules for your event.)*

**What would you add next?** A class dashboard that merges students' exported results, a Spanish translation, and more labs, such as one on recommendation algorithms.
