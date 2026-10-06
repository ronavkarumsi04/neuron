"use client";

import { useState } from "react";
import type { SortConfig } from "@/content/lesson-types";
import { Figure } from ".";

export function Sorter({ config }: { config: SortConfig }) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const answered = Object.keys(picks).length;
  const right = Object.entries(picks).filter(([i, b]) => config.items[+i].bucket === b).length;

  return (
    <Figure title={config.prompt} label={`Interactive · ${right}/${config.items.length} correct`}>
      <ul className="divide-y divide-rule">
        {config.items.map((item, i) => {
          const pick = picks[i];
          const done = pick !== undefined;
          const ok = pick === item.bucket;
          return (
            <li key={item.label} className="py-3 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-ink">{item.label}</span>
                <div role="group" aria-label={`Sort: ${item.label}`} className="flex flex-wrap gap-1.5">
                  {config.buckets.map((bucket, b) => (
                    <button
                      key={bucket}
                      type="button"
                      aria-pressed={pick === b}
                      disabled={done}
                      onClick={() => setPicks((p) => ({ ...p, [i]: b }))}
                      className={`min-h-10 rounded-sm border px-3 text-sm transition-colors duration-150 ${
                        done && b === item.bucket
                          ? "border-green bg-green/10 text-ink"
                          : done && pick === b
                            ? "border-signal bg-signal/10 text-ink"
                            : done
                              ? "border-rule text-ink-3"
                              : "border-rule-strong text-ink-2 hover:bg-paper-sunk"
                      }`}
                    >
                      {bucket}
                    </button>
                  ))}
                </div>
              </div>
              {done && (
                <p className="mt-2 text-sm leading-relaxed text-ink-2" aria-live="polite">
                  <span className={`font-mono text-xs uppercase ${ok ? "text-green" : "text-signal-ink"}`}>{ok ? "Right" : `It's “${config.buckets[item.bucket]}”`}</span>{" "}
                  {item.why}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {answered === config.items.length && (
        <div className="mt-4 flex items-center justify-between border-t border-rule pt-3">
          <p className="text-sm text-ink-2">{right === config.items.length ? "Clean sweep." : `${right} of ${config.items.length}. Read the reasons on the ones you missed.`}</p>
          <button type="button" onClick={() => setPicks({})} className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">Reset</button>
        </div>
      )}
    </Figure>
  );
}
