"use client";

import { lessonKey, type ModuleId } from "@/content/curriculum";
import { useModuleLocked, useProgress, XP } from "@/lib/progress";

export function CompleteLesson({ moduleId, slug }: { moduleId: ModuleId; slug: string }) {
  const done = useProgress((s) => s.completed.includes(lessonKey(moduleId, slug)));
  const complete = useProgress((s) => s.completeLesson);
  const locked = useModuleLocked(moduleId);

  if (done) {
    return (
      <p className="flex items-center gap-2 font-medium text-green">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Lesson complete
      </p>
    );
  }
  if (locked) {
    return (
      <p className="flex items-center gap-2 text-ink-2">
        <svg aria-hidden viewBox="0 0 16 16" className="size-4"><rect x="3" y="7" width="10" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        Locked. Finish modules 01–03 to unlock this bonus module.
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
