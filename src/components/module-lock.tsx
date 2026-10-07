"use client";

import Link from "next/link";
import { getModule, lockReason, moduleComplete, type ModuleId } from "@/content/curriculum";
import { useModuleLocked, useProgress } from "@/lib/progress";

export function ModuleLock({ moduleId }: { moduleId: ModuleId }) {
  const locked = useModuleLocked(moduleId);
  const completed = useProgress((s) => s.completed);
  const m = getModule(moduleId)!;
  if (!locked) return null;
  const missing = (m.requires ?? []).map((id) => getModule(id)!).filter((r) => !moduleComplete(r, completed));
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-sm border border-dashed border-rule-strong px-4 py-3 text-sm text-ink-2">
      <svg aria-hidden viewBox="0 0 16 16" className="size-4 shrink-0"><rect x="3" y="7" width="10" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
      <span>{lockReason(m)} You can read ahead, but neurons here won&apos;t light up yet.</span>
      {missing[0] && <Link href={`/modules/${missing[0].id}`} className="font-medium text-ink underline underline-offset-4">Go to {missing[0].number} {missing[0].title}</Link>}
    </div>
  );
}
