"use client";

import { lessonKey, type ModuleId } from "@/content/curriculum";
import { useProgress, XP } from "@/lib/progress";

export function CompleteLesson({ moduleId, slug }: { moduleId: ModuleId; slug: string }) {
  const done = useProgress((s) => s.completed.includes(lessonKey(moduleId, slug)));
  const complete = useProgress((s) => s.completeLesson);

  if (done) {
    return (
      <p className="flex items-center gap-2 font-medium text-green">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Lesson complete
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={() => complete(moduleId, slug)}
      className="inline-flex h-11 items-center gap-3 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
    >
      Mark complete
      <span className="font-mono text-xs text-signal tabular">+{XP.lesson} XP</span>
    </button>
  );
}
