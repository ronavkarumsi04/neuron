import { Fragment, type ReactNode } from "react";
import { inlineParts, type InlinePart } from "@/lib/narration";

const CODE = "rounded-sm bg-paper-sunk px-1 py-0.5 font-mono text-[0.85em] text-ink [overflow-wrap:anywhere]";

function wrap(part: InlinePart, key: number, children: ReactNode) {
  switch (part.kind) {
    case "code": return <code key={key} className={CODE}>{children}</code>;
    case "strong": return <strong key={key} className="font-semibold text-ink">{children}</strong>;
    case "em": return <em key={key}>{children}</em>;
    default: return <Fragment key={key}>{children}</Fragment>;
  }
}

/**
 * Renders inline `code`, **bold** and *italic*. With `seg`, every word is also wrapped in a
 * `data-w` span (numbered like splitWords(plainText(text))) so read-aloud can follow along.
 */
export function RichText({ text, seg }: { text: string; seg?: string }) {
  const parts = inlineParts(text);
  if (!seg) return <>{parts.map((p, i) => wrap(p, i, p.text))}</>;
  let w = -1;
  let gap = true;
  return (
    <span data-seg={seg}>
      {parts.map((p, i) =>
        wrap(
          p,
          i,
          p.text.split(/(\s+)/).map((tok, j) => {
            if (tok === "") return null;
            if (/^\s+$/.test(tok)) {
              gap = true;
              return tok;
            }
            if (gap) w++;
            gap = false;
            return <span key={j} data-w={w}>{tok}</span>;
          }),
        ),
      )}
    </span>
  );
}
