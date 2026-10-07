import type { Tone } from "@/content/curriculum";

export const toneVar = (tone: Tone | string) => `var(--${tone})`;

export const TONE_TEXT: Record<Tone, string> = {
  cobalt: "text-cobalt",
  green: "text-green",
  plum: "text-plum",
  gold: "text-gold",
  teal: "text-teal",
  rust: "text-rust",
  olive: "text-olive",
  slate: "text-slate-ink",
};
