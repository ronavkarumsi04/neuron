import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonStatus } from "@/components/lesson-status";
import { LabStatus } from "@/components/labs/lab-runner";
import { getModule, modules } from "@/content/curriculum";
import { labsFor } from "@/content/labs";

export function generateStaticParams() {
  return modules.map((m) => ({ module: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const m = getModule((await params).module);
  return { title: m ? `${m.number} ${m.title}` : "Module" };
}

const TONE_TEXT: Record<string, string> = { cobalt: "text-cobalt", green: "text-green", plum: "text-plum", gold: "text-gold" };

export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const m = getModule((await params).module);
  if (!m) notFound();

  return (
    <div className="mx-auto max-w-4xl px-5 pt-10">
      <nav aria-label="Modules" className="flex gap-1 overflow-x-auto border-b border-rule pb-px">
        {modules.map((x) => (
          <Link
            key={x.id}
            href={`/modules/${x.id}`}
            aria-current={x.id === m.id ? "page" : undefined}
            className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink-3 hover:text-ink aria-[current=page]:border-ink aria-[current=page]:text-ink"
          >
            {x.number} {x.title}
          </Link>
        ))}
      </nav>

      <header className="pt-10">
        <p className={`font-mono text-sm ${TONE_TEXT[m.tone]}`}>Module {m.number} · {m.kicker}</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">{m.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-ink-2">{m.summary}</p>
      </header>

      <section aria-labelledby="lessons" className="mt-10">
        <h2 id="lessons" className="label border-b border-ink pb-2">Lessons</h2>
        <ol>
          {m.lessons.map((l, i) => (
            <li key={l.slug} className="border-b border-rule">
              <Link href={`/modules/${m.id}/${l.slug}`} className="group flex items-center gap-4 py-4 hover:bg-paper-sunk/60 sm:px-2">
                <span className="w-6 font-mono text-sm text-ink-3 tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-lg">{l.title}</span>
                <span className="hidden font-mono text-xs text-ink-3 sm:inline tabular">{l.minutes} min</span>
                <LessonStatus moduleId={m.id} slug={l.slug} />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="labs" className="mt-10">
        <h2 id="labs" className="label border-b border-ink pb-2">Hands-on {labsFor(m.id).length > 1 ? "labs" : "lab"}</h2>
        <ul>
          {labsFor(m.id).map((lab) => (
            <li key={lab.id} className="border-b border-rule">
              <Link href={`/labs/${lab.id}`} className="group grid gap-1 py-5 hover:bg-paper-sunk/60 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-2">
                <span>
                  <span className="block font-display text-2xl">{lab.title} <span aria-hidden className="inline-block text-ink-3 transition-transform duration-150 group-hover:translate-x-1">→</span></span>
                  <span className="mt-1 block text-ink-2">{lab.blurb}</span>
                </span>
                <LabStatus id={lab.id} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
