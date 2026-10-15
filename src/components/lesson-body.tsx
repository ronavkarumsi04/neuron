import type { Block } from "@/content/lesson-types";
import { NOTE_LABEL } from "@/lib/narration";
import { RichText } from "./rich-text";
import { Widget } from "./widgets";

const NOTE_BORDER = { key: "border-ink", try: "border-green", warn: "border-signal" } as const;

// Box-drawing art and column-aligned math must keep their spacing, so they scroll instead of wrapping.
const isDiagram = (text: string) => /[\u2190-\u21FF\u2500-\u257F\u25B2-\u25C4]|\S {2,}\S|^ {2,}\S/m.test(text);

export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="lesson-prose">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}><RichText text={b.text} seg={`b${i}`} /></p>;
          case "h":
            return <h2 key={i}><RichText text={b.text} seg={`b${i}`} /></h2>;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i}>
                {b.items.map((item, j) => <li key={j}><RichText text={item} seg={`b${i}.${j}`} /></li>)}
              </Tag>
            );
          }
          case "note":
            return (
              <div role="note" key={i} className={`not-prose my-8 border-l-2 ${NOTE_BORDER[b.kind]} bg-paper-raised py-4 pl-5 pr-4`}>
                <p className="label"><RichText text={NOTE_LABEL[b.kind]} seg={`b${i}.k`} /></p>
                <p className="mt-1 font-medium text-ink"><RichText text={b.title} seg={`b${i}.t`} /></p>
                <p className="mt-1 leading-relaxed text-ink-2"><RichText text={b.text} seg={`b${i}.x`} /></p>
              </div>
            );
          case "example":
            return (
              <figure key={i} className="not-prose my-6 rounded-sm border border-rule bg-paper-sunk/60">
                <figcaption className="label border-b border-rule px-4 py-2">{b.label}</figcaption>
                {isDiagram(b.text) ? (
                  <pre tabIndex={0} aria-label={b.label} className="overflow-x-auto px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-ink">{b.text}</pre>
                ) : (
                  <pre className="whitespace-pre-wrap px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-ink [overflow-wrap:anywhere]">{b.text}</pre>
                )}
              </figure>
            );
          case "code":
            return (
              <figure key={i} className="not-prose my-6 overflow-hidden rounded-sm border border-rule-strong bg-paper-sunk/70">
                <figcaption className="flex items-baseline justify-between gap-3 border-b border-rule px-4 py-2">
                  <span className="label">{b.label}</span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-3">{b.lang}</span>
                </figcaption>
                <pre tabIndex={0} aria-label={`${b.label} (${b.lang} code)`} className="overflow-x-auto px-4 py-3 font-mono text-[0.8rem] leading-relaxed text-ink"><code>{b.text}</code></pre>
              </figure>
            );
          case "compare":
            return (
              <div key={i} className="not-prose my-8 grid grid-cols-[minmax(0,1fr)] gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
                {[b.left, b.right].map((side, j) => (
                  <div key={j} className="bg-paper-raised p-4">
                    <p className={`label ${j === 0 ? "text-signal-ink" : "text-green"}`}><RichText text={side.title} seg={`b${i}.${j}`} /></p>
                    <ul className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-ink-2">
                      {side.items.map((item, k) => <li key={k}><RichText text={item} seg={`b${i}.${j}.${k}`} /></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            );
          case "terms":
            return (
              <dl key={i} className="not-prose my-8 divide-y divide-rule border-y border-rule">
                {b.items.map((it, j) => (
                  <div key={it.term} className="grid grid-cols-[minmax(0,1fr)] gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="font-mono text-sm text-ink"><RichText text={it.term} seg={`b${i}.${j}.t`} /></dt>
                    <dd className="text-[0.95rem] leading-relaxed text-ink-2"><RichText text={it.def} seg={`b${i}.${j}.d`} /></dd>
                  </div>
                ))}
              </dl>
            );
          case "widget":
            return <Widget key={i} id={b.id} sort={b.sort} />;
        }
      })}
    </div>
  );
}
