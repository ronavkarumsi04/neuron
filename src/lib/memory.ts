export const INTERVALS = [3, 7, 14, 30, 60] as const;

export interface Memory {
  last: string;
  step: number;
}

export type Strength = "fresh" | "fading" | "faded";

export const today = () => new Date().toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000);
export const shiftDay = (day: string, n: number) => new Date(Date.parse(day) + n * 86_400_000).toISOString().slice(0, 10);

export function strengthOf(m: Memory | undefined, now = today()): Strength {
  if (!m) return "fresh";
  const interval = INTERVALS[Math.min(m.step, INTERVALS.length - 1)];
  const age = daysBetween(m.last, now);
  if (age < interval) return "fresh";
  return age < interval * 2 ? "fading" : "faded";
}

export const dueOn = (m: Memory) => shiftDay(m.last, INTERVALS[Math.min(m.step, INTERVALS.length - 1)]);

export function retention(m: Memory | undefined, now = today()) {
  if (!m) return 1;
  const interval = INTERVALS[Math.min(m.step, INTERVALS.length - 1)];
  return Math.max(0.15, Math.exp((-0.7 * daysBetween(m.last, now)) / interval));
}
