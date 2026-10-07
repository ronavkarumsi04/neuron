import type { Metadata } from "next";
import { ReviewSession, type Bank } from "@/components/review-session";
import { lessonKey, modules } from "@/content/curriculum";
import { getLessonContent } from "@/content/lessons";

export const metadata: Metadata = { title: "Review" };

export default function ReviewPage() {
  const bank: Bank = {};
  for (const m of modules)
    for (const l of m.lessons) {
      const quiz = getLessonContent(m.id, l.slug)?.quiz ?? [];
      bank[lessonKey(m.id, l.slug)] = { title: l.title, module: m.number, tone: m.tone, href: `/modules/${m.id}/${l.slug}`, quiz };
    }

  return (
    <div className="mx-auto max-w-3xl px-5 pt-10">
      <p className="label">Spaced review</p>
      <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">Keep your neurons lit</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        Memories fade, and so do neurons. A finished lesson starts to dim after 3 days. Answer one question to relight it, and the next review comes later: 7 days, then 14, 30, and 60.
      </p>
      <ReviewSession bank={bank} />
      <details className="group mt-14 border-t border-rule pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-sm">
          <span className="font-display text-2xl">Why neurons fade</span>
          <span aria-hidden className="font-mono text-sm text-ink-3 transition-transform duration-150 group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4 space-y-3 text-ink-2">
          <p>In the 1880s, Hermann Ebbinghaus measured how quickly he forgot lists he had memorized. Recall dropped steeply in the first days, then leveled off. This is the forgetting curve.</p>
          <p>Each time you successfully recall something, the curve gets flatter and you forget more slowly. Spacing reviews out, instead of cramming them together, is one of the most reliable findings in learning science (Cepeda et al., 2006, <em>Psychological Bulletin</em>).</p>
          <p>Neuron estimates how fresh each lesson is from how long it&apos;s been since you last got it right. Correct answers double the wait before the next review. A miss resets it to 3 days.</p>
        </div>
      </details>
    </div>
  );
}
