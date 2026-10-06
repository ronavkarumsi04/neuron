import type { Metadata } from "next";
import { AssessmentView } from "@/components/assessment-view";

export const metadata: Metadata = { title: "Skill check" };

export default function AssessmentPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-10">
      <p className="label">Before &amp; after</p>
      <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">Skill check</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        One short check before you start and the same one after Module 03. It isn&apos;t graded. It shows you, and us, what Neuron actually teaches.
      </p>
      <AssessmentView />
    </div>
  );
}
