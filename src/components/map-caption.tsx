"use client";

import { totalLessons } from "@/content/curriculum";
import { useNodeStates } from "@/components/brain-map";

export function MapCaption() {
  const { doneCount } = useNodeStates();
  return (
    <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3 text-sm text-ink-2">
      <span className="tabular">
        <span className="font-medium text-ink">{doneCount}</span> of {totalLessons} neurons active
      </span>
      <span className="flex items-center gap-4 text-xs text-ink-3">
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="var(--ink-2)" /></svg>Done</span>
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="none" stroke="var(--signal)" strokeWidth="2" /></svg>Up next</span>
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="none" stroke="var(--ink-3)" strokeDasharray="2 2" /></svg>Locked</span>
      </span>
    </figcaption>
  );
}
