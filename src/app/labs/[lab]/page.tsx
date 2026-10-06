import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LabRunner, LabStatus } from "@/components/labs/lab-runner";
import { getModule } from "@/content/curriculum";
import { getLab, labs } from "@/content/labs";

type Params = Promise<{ lab: string }>;

export function generateStaticParams() {
  return labs.map((l) => ({ lab: l.id }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lab = getLab((await params).lab);
  return { title: lab ? `${lab.title} · Lab` : "Lab", description: lab?.blurb };
}

const TONE_TEXT: Record<string, string> = { cobalt: "text-cobalt", green: "text-green", plum: "text-plum", gold: "text-gold" };

export default async function LabPage({ params }: { params: Params }) {
  const lab = getLab((await params).lab);
  if (!lab) notFound();
  const m = getModule(lab.module)!;

  return (
    <article className="mx-auto max-w-4xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="label">
        <Link href="/labs" className="hover:text-ink">Labs</Link>
        <span aria-hidden className="mx-2">/</span>
        <Link href={`/modules/${m.id}`} className="hover:text-ink">Module {m.number}</Link>
      </nav>
      <header className="mt-4 grid gap-6 border-b border-ink pb-8 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className={`font-mono text-sm ${TONE_TEXT[m.tone]}`}>Lab {lab.number} · {lab.minutes} min</p>
          <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">{lab.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">{lab.mission}</p>
        </div>
        <div className="self-end">
          <h2 className="label">Objective</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
            {lab.objectives.map((o) => (
              <li key={o} className="flex gap-2"><span aria-hidden className="text-ink-3">□</span>{o}</li>
            ))}
          </ul>
          <div className="mt-3"><LabStatus id={lab.id} /></div>
        </div>
      </header>

      <div className="mt-8"><LabRunner id={lab.id} moduleId={lab.module} /></div>

      <details className="group mt-12 border-t border-rule pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-sm">
          <span className="font-display text-2xl">Under the hood</span>
          <span aria-hidden className="font-mono text-sm text-ink-3 transition-transform duration-150 group-open:rotate-45">+</span>
        </summary>
        <ul className="mt-4 space-y-3 text-ink-2">
          {lab.underTheHood.map((t, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)]">
              <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
