import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";

export const metadata: Metadata = { title: "About, privacy & credits" };

const SOURCES = [
  "Buolamwini, Joy, and Timnit Gebru. “Gender Shades: Intersectional Accuracy Disparities in Commercial Gender Classification.” Proceedings of the 1st Conference on Fairness, Accountability and Transparency, PMLR 81, 2018, pp. 77–91.",
  "Cepeda, Nicholas J., et al. “Distributed Practice in Verbal Recall Tasks: A Review and Quantitative Synthesis.” Psychological Bulletin, vol. 132, no. 3, 2006, pp. 354–380.",
  "Dastin, Jeffrey. “Amazon Scraps Secret AI Recruiting Tool That Showed Bias against Women.” Reuters, 10 Oct. 2018.",
  "Ebbinghaus, Hermann. Über das Gedächtnis [Memory: A Contribution to Experimental Psychology]. Duncker & Humblot, 1885.",
  "McAdoo, Timothy. “How to Cite ChatGPT.” APA Style Blog, American Psychological Association, 7 Apr. 2023.",
  "“How Do I Cite Generative AI in MLA Style?” MLA Style Center, Modern Language Association, 17 Mar. 2023.",
];

const CREDITS = [
  ["Instrument Serif, Geist, Geist Mono, Atkinson Hyperlegible", "Typefaces, SIL Open Font License 1.1"],
  ["Next.js, React", "Framework, MIT License"],
  ["Tailwind CSS", "Styling, MIT License"],
  ["Zustand", "Local progress storage, MIT License"],
  ["Framer Motion", "Animation, MIT License"],
  ["Lucide", "Icons, ISC License"],
];

export default function AboutPage() {
  return (
    <ProsePage eyebrow="About" title="About Neuron" intro="Neuron teaches high school students how AI works, how to use it well, and how to use it honestly, mostly by letting them build and break small AI systems themselves.">
      <h2>Why it works this way</h2>
      <p>Most students already use AI, but few know what it&apos;s doing. We built Neuron around three ideas:</p>
      <ul>
        <li><strong>Do, don&apos;t just read.</strong> Every lesson ends with a check, and the labs run real models: a neural network trains on your drawings and a biased admissions model learns from biased history.</li>
        <li><strong>Progress you can see.</strong> The brain map is the dashboard. Neurons light up when you learn and fade when you forget, so it shows what you know now.</li>
        <li><strong>Ethics everywhere.</strong> Module 03 covers bias, integrity, citation, and privacy, but the same questions come up in the tools and labs too.</li>
      </ul>

      <h2 id="privacy">Privacy</h2>
      <p>Neuron has no accounts, no analytics, no ads, and no tracking. Your progress, quiz answers, skill-check results, and certificate name are saved in your browser&apos;s local storage and never leave your device. Every AI model on the site runs in your browser; nothing you type or draw is sent to a server.</p>
      <p>To erase everything, use <strong>Reset progress</strong> on the <Link href="/profile">Progress</Link> page or clear this site&apos;s data in your browser.</p>

      <h2 id="accessibility">Accessibility</h2>
      <p>We aim to meet WCAG 2.2 Level AA. The accessibility panel (the figure icon in the header) lets you choose:</p>
      <ul>
        <li>Light, dark, or automatic theme</li>
        <li>Text size up to 125%</li>
        <li>High contrast for stronger text and borders</li>
        <li>A readable font (Atkinson Hyperlegible, designed by the Braille Institute for low-vision readers)</li>
        <li>Reduced motion, which also turns on automatically if your device asks for it</li>
      </ul>
      <p>Everything works with a keyboard, including the brain map, quizzes, and labs. Visualizations have text descriptions, and the drawing lab offers buttons as an alternative to drawing. Works offline after your first visit, and can be installed like an app.</p>

      <h2 id="sources">Works cited</h2>
      <p>All lesson text, quiz questions, lab scenarios, and illustrations are original to this project. Lab datasets are synthetic and made up for teaching. Facts and studies mentioned in lessons come from:</p>
      <ol className="text-[0.95rem]">
        {SOURCES.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h2 id="credits">Credits & licenses</h2>
      <p>Neuron uses no stock photos or third-party images. Open-source software and fonts:</p>
      <dl className="not-prose mt-4 border-t border-rule text-sm">
        {CREDITS.map(([a, b]) => (
          <div key={a} className="grid gap-1 border-b border-rule py-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
            <dt className="text-ink">{a}</dt>
            <dd className="text-ink-2">{b}</dd>
          </div>
        ))}
      </dl>
    </ProsePage>
  );
}
