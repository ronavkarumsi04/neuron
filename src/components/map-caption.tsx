"use client";

import Link from "next/link";
import { totalLessons } from "@/content/curriculum";
import { useNodeStates } from "@/components/brain-map";

export function MapCaption() {
  const { doneCount, due } = useNodeStates();
  return (
    <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-3 text-sm text-ink-2">
      <span className="tabular">
        <span className="font-medium text-ink">{doneCount}</span> of {totalLessons} neurons active
        {due > 0 && (
          <>
            <span className="mx-2 text-ink-3">·</span>
            <Link href="/review" className="text-signal-ink underline underline-offset-4">
              {due} fading, review now
            </Link>
          </>
        )}
      </span>
      <span className="flex items-center gap-4 text-xs text-ink-3">
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="var(--ink-2)" /></svg>Done</span>
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="var(--ink-2)" fillOpacity="0.3" /></svg>Fading</span>
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="none" stroke="var(--signal)" strokeWidth="2" /></svg>Up next</span>
        <span className="flex items-center gap-1.5"><svg aria-hidden className="size-2.5"><circle cx="5" cy="5" r="4" fill="none" stroke="var(--ink-3)" strokeDasharray="2 2" /></svg>Locked</span>
      </span>
    </figcaption>
  );
}
