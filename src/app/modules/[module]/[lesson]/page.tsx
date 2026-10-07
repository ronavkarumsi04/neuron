import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckpointQuiz } from "@/components/checkpoint-quiz";
import { CompleteLesson } from "@/components/complete-lesson";
import { LessonBody } from "@/components/lesson-body";
import { ModuleLock } from "@/components/module-lock";
import { RichText } from "@/components/rich-text";
import { getLessonContent } from "@/content/lessons";
import { getModule, modules } from "@/content/curriculum";

type Params = Promise<{ module: string; lesson: string }>;

export function generateStaticParams() {
  return modules.flatMap((m) => m.lessons.map((l) => ({ module: m.id, lesson: l.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { module, lesson } = await params;
  return { title: getModule(module)?.lessons.find((l) => l.slug === lesson)?.title ?? "Lesson" };
}

export default async function LessonPage({ params }: { params: Params }) {
  const { module, lesson } = await params;
  const m = getModule(module);
  const index = m?.lessons.findIndex((l) => l.slug === lesson) ?? -1;
  if (!m || index < 0) notFound();
  const l = m.lessons[index];
  const next = m.lessons[index + 1];
  const content = getLessonContent(m.id, l.slug);
  if (!content) notFound();

  return (
    <article className="mx-auto max-w-2xl px-5 pt-10">
      <nav aria-label="Breadcrumb" className="label">
        <Link href={`/modules/${m.id}`} className="hover:text-ink">{m.number} {m.title}</Link>
        <span className="mx-2">/</span>
        <span>Lesson {index + 1} of {m.lessons.length}</span>
      </nav>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.02] tracking-tight">{l.title}</h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ink-3">{l.minutes} min read</p>
      <ModuleLock moduleId={m.id} />

      <p className="mt-8 border-l-2 border-signal pl-4 font-display text-[1.6rem] leading-snug text-ink"><RichText text={content.hook} /></p>

      <div className="mt-8"><LessonBody blocks={content.blocks} /></div>

      <section aria-labelledby="takeaways" className="mt-12 border-t border-ink pt-5">
        <h2 id="takeaways" className="label">Takeaways</h2>
        <ul className="mt-3 space-y-2">
          {content.takeaways.map((t, i) => (
            <li key={i} className="grid grid-cols-[1.75rem_minmax(0,1fr)] text-ink-2">
              <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, "0")}</span>
              <span><RichText text={t} /></span>
            </li>
          ))}
        </ul>
      </section>

      <CheckpointQuiz moduleId={m.id} slug={l.slug} questions={content.quiz} />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-rule pt-6">
        <CompleteLesson moduleId={m.id} slug={l.slug} />
        {next ? (
          <Link href={`/modules/${m.id}/${next.slug}`} className="text-sm text-ink-2 hover:text-ink">
            Next: {next.title} <span aria-hidden>→</span>
          </Link>
        ) : (
          <Link href="/map" className="text-sm text-ink-2 hover:text-ink">Back to the brain map <span aria-hidden>→</span></Link>
        )}
      </div>
    </article>
  );
}
