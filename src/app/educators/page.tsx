import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage } from "@/components/prose-page";
import { modules } from "@/content/curriculum";

export const metadata: Metadata = { title: "For educators" };

export default function EducatorsPage() {
  return (
    <ProsePage eyebrow="For educators" title="Teaching with Neuron" intro="Neuron is free, needs no accounts, and runs on any school Chromebook. It's designed to fit into class time: each lesson takes 8–12 minutes, and each lab about 15.">
      <h2>A three-week unit</h2>
      <table className="not-prose my-6 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-ink"><th className="py-2 pr-4 font-medium">Week</th><th className="py-2 pr-4 font-medium">Students do</th><th className="py-2 font-medium">Lab</th></tr>
        </thead>
        <tbody>
          {modules.filter((m) => !m.bonus).map((m, i) => (
            <tr key={m.id} className="border-b border-rule align-top">
              <td className="py-3 pr-4 font-mono text-ink-3">{i + 1}</td>
              <td className="py-3 pr-4"><Link className="underline underline-offset-4" href={`/modules/${m.id}`}>{m.number} {m.title}</Link><span className="block text-ink-2">{m.lessons.length} lessons{i === 0 ? ", plus the baseline skill check on day 1" : i === 2 ? ", then the after-check" : ""}</span></td>
              <td className="py-3 text-ink-2">{m.lab.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Module 04, <em>AI & Your Future</em>, unlocks after the first three and works well as an extension or a careers-day activity.</p>

      <h2>Measuring learning</h2>
      <p>The <Link href="/assessment">skill check</Link> is the same 12 questions before Module 01 and after Module 03, split across the three topics. Students can copy an anonymous result line (no names) and paste it into a class form, so you can see the before/after gain for the whole class.</p>

      <h2>Discussion prompts</h2>
      <ul>
        <li>After <strong>Teach the Machine</strong>: your model learned from about 20 drawings. What would it need to work for everyone&apos;s handwriting?</li>
        <li>After <strong>Bias Lab</strong>: why didn&apos;t deleting the ZIP code column fix the model? Where else could a proxy hide?</li>
        <li>After <strong>Integrity Simulator</strong>: draft a class AI-use policy together. Which uses are always fine, which need disclosure, and which are never okay?</li>
        <li>After <strong>Spot the Hallucination</strong>: what made the made-up facts convincing?</li>
      </ul>

      <h2>Privacy for minors</h2>
      <p>No sign-up, no email, no analytics, and no data sent anywhere: progress stays in each student&apos;s browser. Because of this, Neuron doesn&apos;t collect any student data, which makes it simple to approve for classroom use. Note that a shared computer shares progress, so students on shared devices should use their own browser profile. <Link href="/about#privacy">Full privacy details</Link>.</p>
    </ProsePage>
  );
}
