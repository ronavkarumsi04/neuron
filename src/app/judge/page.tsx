import type { Metadata } from "next";
import Link from "next/link";
import { StartTour } from "@/components/judge/tour-bar";
import { totalLessons } from "@/content/curriculum";
import { labs } from "@/content/labs";
import { BADGES, LEVELS } from "@/lib/gamification";

export const metadata: Metadata = { title: "For judges" };

const ROWS: { req: string; where: { label: string; href: string }[]; how: string }[] = [
  { req: "At least three distinct learning modules", how: `Three core modules, a bonus careers module, and a four-module advanced track (deep learning, transformers, how models are made, AI agents). ${totalLessons} lessons in total, each with a checkpoint quiz.`, where: [{ label: "Module 01", href: "/modules/foundations" }, { label: "Module 02", href: "/modules/toolkit" }, { label: "Module 03", href: "/modules/ethics" }] },
  { req: "Fundamental AI concepts", how: "AI vs. ML, training data, neural networks, how LLMs predict words, limits. Students fit a line, tune a perceptron, and train a real network.", where: [{ label: "How AI Works", href: "/modules/foundations" }, { label: "Teach the Machine", href: "/labs/teach-the-machine" }] },
  { req: "Practical AI tools & techniques", how: "Choosing tools, the CRAFT prompting method, studying with AI, checking outputs, project workflows.", where: [{ label: "AI Tools & Techniques", href: "/modules/toolkit" }, { label: "Prompt Lab", href: "/labs/prompt-lab" }, { label: "Spot the Hallucination", href: "/labs/spot-the-hallucination" }] },
  { req: "Ethical AI usage in school", how: "Bias, hallucinations and deepfakes, academic integrity, MLA/APA AI citations, privacy.", where: [{ label: "Ethical AI", href: "/modules/ethics" }, { label: "Bias Lab", href: "/labs/bias-lab" }, { label: "Integrity Simulator", href: "/labs/integrity-sim" }] },
  { req: "Gamified interface", how: `XP for lessons, perfect quizzes, labs, and skill checks. ${LEVELS.length} levels named after AI concepts, ${BADGES.length} badges, daily streaks, unlockable modules, and a 22-rank competitive ladder from Bronze I to Supersonic Legend.`, where: [{ label: "Progress", href: "/profile" }] },
  { req: "Visual progress tracking", how: "The brain map is the dashboard: each finished lesson lights a neuron and connects it to the rest. Neurons fade over days until reviewed, so the map shows what the student still remembers, not just what they clicked through.", where: [{ label: "Brain map", href: "/map" }, { label: "Spaced review", href: "/review" }] },
  { req: "Evidence of learning", how: "The same 30-question check before and after, rising from beginner to expert and weighted by difficulty, broken down by level and topic.", where: [{ label: "Skill check", href: "/assessment" }] },
];

export default function JudgePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10">
      <p className="label">For judges</p>
      <h1 className="mt-2 max-w-3xl font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">See all of Neuron in three minutes.</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        The tour loads a sample student who has finished Modules 01–03, then walks you through eleven stops. Ending the tour puts back whatever progress was on this device before.
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <StartTour className="inline-flex min-h-11 items-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97]" />
        <Link href="/modules/foundations/what-is-ai" className="inline-flex min-h-11 items-center rounded-sm border border-rule-strong px-5 font-medium hover:bg-paper-sunk">Explore as a new student</Link>
      </div>

      <section aria-labelledby="map-h" className="mt-16">
        <div className="flex items-end justify-between border-b border-ink pb-3">
          <h2 id="map-h" className="font-display text-3xl">Requirements, mapped</h2>
          <span className="label">{ROWS.length} items</span>
        </div>
        <table className="w-full text-left">
          <caption className="sr-only">Each competition requirement and where Neuron meets it</caption>
          <thead className="sr-only">
            <tr><th scope="col">Requirement</th><th scope="col">How</th><th scope="col">Where</th></tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.req} className="grid gap-2 border-b border-rule py-5 md:table-row">
                <th scope="row" className="align-top font-display text-xl font-normal leading-tight md:w-64 md:py-5 md:pr-6">{r.req}</th>
                <td className="align-top text-ink-2 md:py-5 md:pr-6">{r.how}</td>
                <td className="align-top md:w-48 md:py-5">
                  <ul className="space-y-1 text-sm">
                    {r.where.map((w) => (
                      <li key={w.href}><Link href={w.href} className="underline underline-offset-4 hover:text-signal-ink">{w.label}</Link></li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="facts-h" className="mt-16">
        <h2 id="facts-h" className="border-b border-ink pb-3 font-display text-3xl">By the numbers</h2>
        <dl className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-4">
          {[
            [String(totalLessons), "lessons with checkpoint quizzes"],
            [String(labs.length), "hands-on labs"],
            ["12", "interactive lesson widgets"],
            ["0", "accounts, trackers, or AI APIs"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="sr-only">{l}</dt>
              <dd className="font-display text-5xl leading-none tabular">{n}</dd>
              <dd className="mt-2 text-sm text-ink-3">{l}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-2xl text-ink-2">
          Every model on the site, including the neural network, the next-word predictor, and the bias simulator, runs in the browser. Student progress never leaves the device, which matters for a site built for minors.
        </p>
      </section>
    </div>
  );
}
