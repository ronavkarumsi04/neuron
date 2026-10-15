// Writes every lesson's read-aloud script to scripts/narration/script.json for synth.py.
import { writeFileSync } from "node:fs";
import { modules } from "../../src/content/curriculum";
import { getLessonContent } from "../../src/content/lessons";
import { lessonSegments, plainText, splitWords } from "../../src/lib/narration";

const lessons = modules.flatMap((m) =>
  m.lessons.map((l) => {
    const content = getLessonContent(m.id, l.slug);
    if (!content) throw new Error(`missing content ${m.id}/${l.slug}`);
    return {
      key: `${m.id}/${l.slug}`,
      segments: lessonSegments(l.title, content).map((s) => ({ id: s.id, kind: s.kind, words: splitWords(plainText(s.text)) })),
    };
  }),
);
writeFileSync(new URL("./script.json", import.meta.url), JSON.stringify({ lessons }, null, 1));
console.log(`${lessons.length} lessons, ${lessons.reduce((n, l) => n + l.segments.reduce((k, s) => k + s.words.length, 0), 0)} words`);
