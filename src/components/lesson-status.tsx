"use client";

import { lessonKey, type ModuleId } from "@/content/curriculum";
import { useProgress } from "@/lib/progress";

export function LessonStatus({ moduleId, slug }: { moduleId: ModuleId; slug: string }) {
  const done = useProgress((s) => s.completed.includes(lessonKey(moduleId, slug)));
  return done ? (
    <span className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-green">
      <svg aria-hidden viewBox="0 0 16 16" className="size-3.5"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Done
    </span>
  ) : (
    <span className="font-mono text-xs uppercase tracking-wider text-ink-3">Start</span>
  );
}
