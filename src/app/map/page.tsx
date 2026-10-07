import type { Metadata } from "next";
import Link from "next/link";
import { BrainMap } from "@/components/brain-map";
import { LessonListLink } from "@/components/lesson-list-link";
import { MapCaption } from "@/components/map-caption";
import { modules } from "@/content/curriculum";

export const metadata: Metadata = { title: "Brain map" };

export default function MapPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10">
      <p className="label">Dashboard</p>
      <h1 className="mt-3 font-display text-5xl tracking-tight">Brain map</h1>
      <p className="mt-3 max-w-xl text-ink-2">Each circle is a lesson. Finish one and it lights up and connects to the rest of its module. Leave it alone for a few days and it starts to fade until you <Link href="/review" className="underline underline-offset-4">review it</Link>.</p>
      <figure className="mt-8 rounded-md border border-rule bg-paper-raised/70 p-4 sm:p-6">
        <BrainMap className="mx-auto w-full max-w-4xl" />
        <MapCaption />
      </figure>
      <section aria-label="Lesson list" className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {modules.map((m) => (
          <div key={m.id}>
            <h2 className="label">{m.number} {m.title}</h2>
            <ol className="mt-3 space-y-1.5 text-sm">
              {m.lessons.map((l) => (
                <li key={l.slug}>
                  <LessonListLink moduleId={m.id} slug={l.slug} title={l.title} />
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </div>
  );
}
