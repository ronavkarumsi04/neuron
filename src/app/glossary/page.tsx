import type { Metadata } from "next";
import { GlossaryList, type Entry } from "@/components/glossary-list";
import { getModule } from "@/content/curriculum";
import { GLOSSARY } from "@/content/glossary";

export const metadata: Metadata = { title: "Glossary" };

export default function GlossaryPage() {
  const list: Entry[] = GLOSSARY.map(({ term, def, lesson: [mid, slug] }) => {
    const m = getModule(mid)!;
    const l = m.lessons.find((x) => x.slug === slug)!;
    return { term, def, lesson: l.title, href: `/modules/${mid}/${slug}`, module: m.number, tone: m.tone };
  }).sort((a, b) => a.term.localeCompare(b.term, "en", { sensitivity: "base" }));

  return (
    <div className="mx-auto max-w-3xl px-5 pt-10">
      <p className="label">Reference</p>
      <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">Glossary</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        {list.length} AI terms in plain language. Each one links to the lesson where it&apos;s explained.
      </p>
      <GlossaryList entries={list} />
    </div>
  );
}
