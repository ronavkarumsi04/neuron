# Neuron

An interactive AI learning portal for high school students (grades 9–12). It was built for the 2026–27 TSA Webmaster theme, *Artificial Intelligence (AI) learning portal*.

The brain map is the progress dashboard. Each of the 38 lessons is a neuron. A neuron lights up when you pass its checkpoint, connects to the rest of its module, and fades again if you don't review it.

## What's inside

| Requirement | Where |
| --- | --- |
| Fundamental AI concepts | Module 01 *How AI Works*: 5 lessons, plus a line-fitting trainer, a perceptron, and a next-word model |
| Practical tools & techniques | Module 02 *AI Tools & Techniques*: 5 lessons, plus the CRAFT prompt builder and Prompt Lab |
| Ethical AI usage | Module 03 *Ethical AI*: 5 lessons, plus Bias Lab, Spot the Hallucination, the Integrity Simulator, and the citation builder |
| Gamification & progress | XP, 13 levels, 20 badges, a Bronze → Supersonic Legend rank ladder, streaks, the brain map, spaced review, a progress page, and a certificate |

Also included:
- 6 labs, including a neural network that trains in the browser on your own drawings
- A bonus Module 04, *AI & Your Future*
- A 30-question pre/post skill check in four difficulty levels, weighted by difficulty
- A glossary
- An educator guide
- Judge Mode at `/judge`: a 10-stop guided tour with sample progress

## Principles

- **No accounts, no analytics, no data leaves the device.** Progress is stored in `localStorage`, and every model runs in the browser.
- **Works offline.** A service worker (`public/sw.js`) precaches every route after the first visit.
- **Accessible by default.** It targets WCAG 2.2 AA and includes a settings panel for theme, high contrast, readable font, text size, and reduced motion. See [docs/audit.md](docs/audit.md).

## Develop

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm lint && npx tsc --noEmit
pnpm build && pnpm start
```

Stack: Next.js 15 (App Router, static generation), React 19, TypeScript, Tailwind CSS 4, Zustand, and Framer Motion. It's deployed on Vercel with no environment variables.

## Layout

```
src/app/            routes (every page is statically generated)
src/content/        curriculum, lesson text, quizzes, labs, glossary, skill check
src/components/     brain map, lesson renderer, widgets/, labs/, judge/
src/lib/            progress store, gamification, spaced-review memory model, settings
public/sw.js        offline service worker
DESIGN.md           design system and rationale
docs/               audit results, interview kit, work log
```
