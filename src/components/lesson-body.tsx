import type { Block } from "@/content/lesson-types";
import { RichText } from "./rich-text";
import { Widget } from "./widgets";

const NOTE: Record<string, { label: string; cls: string }> = {
  key: { label: "Key idea", cls: "border-ink" },
  try: { label: "Try it", cls: "border-green" },
  warn: { label: "Watch out", cls: "border-signal" },
};

export function LessonBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="lesson-prose">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}><RichText text={b.text} /></p>;
          case "h":
            return <h2 key={i}>{b.text}</h2>;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i}>
                {b.items.map((item, j) => <li key={j}><RichText text={item} /></li>)}
              </Tag>
            );
          }
          case "note":
            return (
              <div role="note" key={i} className={`not-prose my-8 border-l-2 ${NOTE[b.kind].cls} bg-paper-raised py-4 pl-5 pr-4`}>
                <p className="label">{NOTE[b.kind].label}</p>
                <p className="mt-1 font-medium text-ink">{b.title}</p>
                <p className="mt-1 leading-relaxed text-ink-2"><RichText text={b.text} /></p>
              </div>
            );
          case "example":
            return (
              <figure key={i} className="not-prose my-6 rounded-sm border border-rule bg-paper-sunk/60">
                <figcaption className="label border-b border-rule px-4 py-2">{b.label}</figcaption>
                <pre className="whitespace-pre-wrap px-4 py-3 font-mono text-[0.85rem] leading-relaxed text-ink">{b.text}</pre>
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
              <div key={i} className="not-prose my-8 grid gap-px overflow-hidden rounded-sm border border-rule bg-rule sm:grid-cols-2">
                {[b.left, b.right].map((side, j) => (
                  <div key={j} className="bg-paper-raised p-4">
                    <p className={`label ${j === 0 ? "text-signal-ink" : "text-green"}`}>{side.title}</p>
                    <ul className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-ink-2">
                      {side.items.map((item, k) => <li key={k}><RichText text={item} /></li>)}
                    </ul>
                  </div>
                ))}
              </div>
            );
          case "terms":
            return (
              <dl key={i} className="not-prose my-8 divide-y divide-rule border-y border-rule">
                {b.items.map((it) => (
                  <div key={it.term} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="font-mono text-sm text-ink">{it.term}</dt>
                    <dd className="text-[0.95rem] leading-relaxed text-ink-2"><RichText text={it.def} /></dd>
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
