"use client";

import Link from "next/link";
import { getModule, lockReason, type ModuleId } from "@/content/curriculum";
import { useModuleLocked } from "@/lib/progress";

export function LessonListLink({ moduleId, slug, title }: { moduleId: ModuleId; slug: string; title: string }) {
  const locked = useModuleLocked(moduleId);
  if (locked) return <span className="text-ink-3" title={lockReason(getModule(moduleId)!) ?? undefined}>{title}</span>;
  return (
    <Link className="text-ink-2 underline-offset-4 hover:text-ink hover:underline" href={`/modules/${moduleId}/${slug}`}>
      {title}
    </Link>
  );
}
