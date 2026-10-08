"use client";

import { useMemo, useState } from "react";
import { FEATURES, run, type Fixes } from "@/lib/bias-sim";
import { useProgress } from "@/lib/progress";
import { Done, Panel } from "./ui";

const GAP = 0.05;
const ACC = 0.88;

const FIXES: { key: keyof Fixes; title: string; text: string }[] = [
  { key: "rebalance", title: "Rebalance the data", text: "Train on 200 applicants from each neighborhood instead of 340 Northside and 60 Southside." },
  { key: "dropZip", title: "Remove ZIP code", text: "Stop the model from seeing which neighborhood an applicant lives in." },
  { key: "dropInternship", title: "Remove prior internship", text: "Northside students have much easier access to internships." },
  { key: "relabel", title: "Fix the labels", text: "Replace past reviewers' decisions with a re-review that scores everyone on the same rubric." },
];

function diagnose(f: Fixes, gap: number, acc: number) {
  if (gap < GAP && acc >= ACC) return "Fair and accurate. The labels it learns from no longer carry the old bias, so the model no longer reproduces it.";
  if (!f.relabel && f.dropZip && f.dropInternship) return "The gap closed, but accuracy dropped. The labels are still biased, so the model can't separate qualified from unqualified applicants well for anyone. It's equally unfair to everyone.";
  if (!f.relabel && f.dropZip) return "Removing ZIP code helped, but internship is acting as a proxy for neighborhood, so the model still finds the pattern.";
  if (f.rebalance && !f.relabel) return "More Southside examples didn't fix it. Those examples carry the same biased decisions, so the model just learns the bias more confidently.";
  if (!f.relabel) return "The model learned exactly what past reviewers did, including rejecting qualified Southside students. Look at the weight on ZIP code.";
  return "Close. Check whether a remaining feature is still pushing one group around.";
}

function Strip({ people, label }: { people: { skill: number; accepted: boolean; qualified: boolean }[]; label: string }) {
  const sample = [...people].sort((a, b) => a.skill - b.skill).filter((_, i) => i % 3 === 0);
  return (
    <svg viewBox={`0 0 ${sample.length * 10} 14`} className="h-4 w-full" role="img" aria-label={label} preserveAspectRatio="none">
      {sample.map((p, i) => {
        const fill = p.accepted ? (p.qualified ? "var(--ink)" : "var(--gold)") : p.qualified ? "var(--signal)" : "none";
        return <circle key={i} cx={i * 10 + 5} cy="7" r="3.6" fill={fill} stroke={p.accepted || p.qualified ? fill : "var(--ink-3)"} strokeWidth="1" />;
      })}
    </svg>
  );
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function BiasLab() {
  const finish = useProgress((s) => s.completeLab);
  const [fixes, setFixes] = useState<Fixes>({ rebalance: false, dropZip: false, dropInternship: false, relabel: false });
  const [won, setWon] = useState(false);
  const r = useMemo(() => run(fixes), [fixes]);
  const fair = r.gap < GAP && r.accuracy >= ACC;

  const toggle = (key: keyof Fixes) => {
    const next = { ...fixes, [key]: !fixes[key] };
    setFixes(next);
    const res = run(next);
    if (!won && res.gap < GAP && res.accuracy >= ACC) {
      setWon(true);
      finish("bias-lab");
    }
  };

  const maxW = Math.max(1, ...r.weights.map(Math.abs));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)]">
        <Panel title="Interventions" label="Toggle any">
          <ul className="space-y-2">
            {FIXES.map((f) => (
              <li key={f.key}>
                <button
                  type="button"
                  aria-pressed={fixes[f.key]}
                  onClick={() => toggle(f.key)}
                  className={`w-full rounded-sm border p-3 text-left transition-colors duration-150 ${fixes[f.key] ? "border-ink bg-paper-sunk" : "border-rule hover:bg-paper-sunk/70"}`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-medium text-ink">{f.title}</span>
                    <span aria-hidden className={`flex h-5 w-9 shrink-0 items-center rounded-full border p-0.5 transition-colors ${fixes[f.key] ? "border-ink bg-ink" : "border-rule-strong"}`}>
                      <span className={`size-3.5 rounded-full transition-transform duration-150 ${fixes[f.key] ? "translate-x-[calc(1.125rem-2px)] bg-paper" : "translate-x-0 bg-ink-3"}`} />
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-ink-2">{f.text}</span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Test results: 300 new applicants" label={fair ? "Fair" : "Unfair"}>
          <div className="grid grid-cols-2 gap-4 border-b border-rule pb-4 sm:grid-cols-3">
            <div>
              <p className="label">Gap</p>
              <p className={`font-display text-2xl tabular sm:text-4xl ${r.gap < GAP ? "text-green" : "text-signal-ink"}`}>{Math.round(r.gap * 100)} pts</p>
              <p className="text-xs text-ink-3">goal: under 5</p>
            </div>
            <div>
              <p className="label">Accuracy</p>
              <p className={`font-display text-2xl tabular sm:text-4xl ${r.accuracy >= ACC ? "text-green" : "text-signal-ink"}`}>{pct(r.accuracy)}</p>
              <p className="text-xs text-ink-3">goal: 88%+</p>
            </div>
            <div>
              <p className="label">Trained on</p>
              <p className="font-display text-2xl tabular sm:text-4xl">{r.trainCounts.north}/{r.trainCounts.south}</p>
              <p className="text-xs text-ink-3">North / South</p>
            </div>
          </div>
          <table className="mt-4 w-full text-sm">
            <caption className="sr-only">Outcomes by neighborhood</caption>
            <thead>
              <tr className="label text-left">
                <th scope="col" className="pb-2 font-normal">Group</th>
                <th scope="col" className="pb-2 font-normal">Accepted</th>
                <th scope="col" className="pb-2 font-normal">Missed qualified</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {([["Northside", r.north], ["Southside", r.south]] as const).map(([name, g]) => (
                <tr key={name} className="border-t border-rule align-top">
                  <th scope="row" className="py-2 pr-3 text-left font-medium text-ink">{name}</th>
                  <td className="py-2 pr-3 font-mono">{pct(g.acceptRate)}</td>
                  <td className={`py-2 font-mono ${g.missed > 0.15 ? "text-signal-ink" : "text-ink"}`}>{pct(g.missed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-5 space-y-3">
            {([["Northside", r.north], ["Southside", r.south]] as const).map(([name, g]) => (
              <div key={name}>
                <p className="label">{name} · sorted by skill score →</p>
                <Strip people={g.people} label={`${name}: ${pct(g.missed)} of qualified applicants rejected`} />
              </div>
            ))}
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-3">
              <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-ink" />accepted, qualified</li>
              <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-signal" />qualified but rejected</li>
              <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-gold" />accepted, not qualified</li>
              <li className="flex items-center gap-1.5"><span className="size-2.5 rounded-full border border-ink-3" />correctly rejected</li>
            </ul>
          </div>
        </Panel>
      </div>

      <Panel title="What the model learned" label="Logistic regression weights">
        <ul className="space-y-2">
          {FEATURES.map((name, i) => {
            const w = r.weights[i];
            return (
              <li key={name} className="grid grid-cols-[minmax(0,10rem)_minmax(0,1fr)_3.5rem] items-center gap-3 text-sm">
                <span className="text-ink-2">{name}</span>
                <span className="relative h-2.5 rounded-full bg-paper-sunk">
                  <span aria-hidden className="absolute inset-y-0 left-1/2 w-px bg-rule-strong" />
                  <span
                    className="absolute inset-y-0 rounded-full transition-all duration-300"
                    style={{ left: w >= 0 ? "50%" : `${50 - (Math.abs(w) / maxW) * 50}%`, width: `${(Math.abs(w) / maxW) * 50}%`, background: w >= 0 ? "var(--cobalt)" : "var(--signal)" }}
                  />
                </span>
                <span className="text-right font-mono tabular text-ink">{w >= 0 ? "+" : ""}{w.toFixed(2)}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 border-l-2 border-cobalt pl-3 text-ink-2" aria-live="polite">{diagnose(fixes, r.gap, r.accuracy)}</p>
      </Panel>

      {won && <Done>Lab complete. The bias came from the labels, and the proxies kept it alive. Removing one column or adding more data didn&apos;t fix it. Fixing how the data was made did.</Done>}
    </div>
  );
}
