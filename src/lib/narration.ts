import type { LessonContent } from "../content/lesson-types";

export type InlinePart = { kind: "text" | "code" | "strong" | "em"; text: string };

export function inlineParts(text: string): InlinePart[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter((p) => p !== "")
    .map((part) =>
      part.startsWith("`") && part.endsWith("`") && part.length > 2
        ? { kind: "code", text: part.slice(1, -1) }
        : part.startsWith("**") && part.endsWith("**")
          ? { kind: "strong", text: part.slice(2, -2) }
          : part.startsWith("*") && part.endsWith("*") && part.length > 2
            ? { kind: "em", text: part.slice(1, -1) }
            : { kind: "text", text: part },
    );
}

export const plainText = (text: string) => inlineParts(text).map((p) => p.text).join("");
export const splitWords = (plain: string) => plain.split(/\s+/).filter(Boolean);

export const NOTE_LABEL = { key: "Key idea", try: "Try it", warn: "Watch out" } as const;

export type SegmentKind = "title" | "hook" | "h" | "p" | "item" | "label" | "term" | "def";
export interface Segment { id: string; kind: SegmentKind; text: string }

/** Everything read aloud on a lesson page, in reading order. Ids match the `seg` props rendered in the page. */
export function lessonSegments(title: string, c: LessonContent): Segment[] {
  const out: Segment[] = [];
  const push = (id: string, kind: SegmentKind, text: string) => out.push({ id, kind, text });
  push("title", "title", title);
  push("hook", "hook", c.hook);
  c.blocks.forEach((b, i) => {
    const id = `b${i}`;
    switch (b.t) {
      case "p": return push(id, "p", b.text);
      case "h": return push(id, "h", b.text);
      case "list": return b.items.forEach((it, j) => push(`${id}.${j}`, "item", it));
      case "note":
        push(`${id}.k`, "label", NOTE_LABEL[b.kind]);
        push(`${id}.t`, "p", b.title);
        return push(`${id}.x`, "p", b.text);
      case "compare":
        return [b.left, b.right].forEach((side, j) => {
          push(`${id}.${j}`, "label", side.title);
          side.items.forEach((it, k) => push(`${id}.${j}.${k}`, "item", it));
        });
      case "terms":
        return b.items.forEach((it, j) => {
          push(`${id}.${j}.t`, "term", it.term);
          push(`${id}.${j}.d`, "def", it.def);
        });
    }
  });
  push("kh", "h", "Takeaways");
  c.takeaways.forEach((t, j) => push(`k${j}`, "item", t));
  return out;
}
