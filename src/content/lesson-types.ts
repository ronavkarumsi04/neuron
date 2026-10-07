export type Inline = string;

export type Block =
  | { t: "p"; text: Inline }
  | { t: "h"; text: string }
  | { t: "list"; items: Inline[]; ordered?: boolean }
  | { t: "note"; kind: "key" | "try" | "warn"; title: string; text: Inline }
  | { t: "example"; label: string; text: string }
  | { t: "compare"; left: { title: string; items: Inline[] }; right: { title: string; items: Inline[] } }
  | { t: "terms"; items: { term: string; def: Inline }[] }
  | { t: "code"; label: string; lang: string; text: string }
  | { t: "widget"; id: WidgetId; sort?: SortConfig };

export type WidgetId =
  | "sort"
  | "line-fit"
  | "perceptron"
  | "next-word"
  | "prompt-builder"
  | "citation-builder"
  | "redact"
  | "backprop"
  | "attention"
  | "sampling"
  | "model-builder"
  | "agent-loop";

export interface SortConfig {
  prompt: string;
  buckets: string[];
  items: { label: string; bucket: number; why: string }[];
}

export interface Question {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface LessonContent {
  hook: Inline;
  blocks: Block[];
  takeaways: Inline[];
  quiz: Question[];
}

export const passMark = (total: number) => Math.ceil((total * 2) / 3);
