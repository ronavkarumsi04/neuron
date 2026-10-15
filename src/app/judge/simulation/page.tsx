import type { Metadata } from "next";
import Link from "next/link";
import {
  DEMO_STYLES,
  generateDemoCohort,
  summarizeDemoCohort,
} from "@/lib/simulated-cohort";

export const metadata: Metadata = {
  title: "Synthetic learner simulation",
  robots: { index: false, follow: false },
  description: "A clearly labeled simulation of student journeys in Neuron, not real user data.",
};

const students = generateDemoCohort();
const summary = summarizeDemoCohort(students);
const percent = (number: number) => Math.round((number / summary.cohort) * 100);
const metric = (n: number) => n.toLocaleString("en-US");
const formatScore = (score: { correct: number; total: number } | null) =>
  score ? score.correct + "/" + score.total : "Not taken";

export default function SimulationPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/judge" className="text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
          ← Back to judge tour
        </Link>
        <span className="rounded-sm border border-rule-strong px-2 py-1 font-mono text-xs font-semibold uppercase tracking-wider">
          Synthetic demo · not actual impact
        </span>
      </div>

      <header className="mt-8 max-w-4xl">
        <p className="label">Student journeys / simulation</p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4.25rem)] leading-none tracking-tight">
          What a learning cohort could look like.
        </h1>
        <p className="mt-5 max-w-3xl text-lg text-ink-2">
          A reproducible model of {students.length} fictional high school learners trying Neuron.
          Some explore briefly; others retry checkpoints, return for reviews, complete labs,
          and take a second assessment. Their journeys follow the real course structure.
        </p>
      </header>

      <section aria-label="Data authenticity" className="mt-8 border-l-4 border-ink bg-paper-sunk p-5">
        <p className="font-semibold">Illustrative simulation only — these students do not exist.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">
          Every number below is generated, not measured. It is not evidence of actual visits,
          enrolled students, learning gains, retention, or educational impact. Neuron has no
          student accounts or analytics, and this page makes no network calls or changes to
          anyone&apos;s saved progress. For real impact, collect voluntary, anonymous
          before-and-after results from genuine classroom pilots.
        </p>
      </section>

      <section aria-labelledby="cohort-metrics" className="mt-14">
        <h2 id="cohort-metrics" className="border-b border-ink pb-3 font-display text-3xl">
          Simulated cohort at a glance
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-x-7 gap-y-8 md:grid-cols-4">
          {[
            [metric(summary.cohort), "Fictional learners"],
            [metric(summary.studied), "Passed at least one lesson"],
            [metric(summary.checkpoints), "Lesson checkpoints passed"],
            [metric(summary.labCompletions), "Lab completions"],
            [metric(summary.repeatDays), "Active on 2+ simulated days"],
            [metric(summary.retries), "Checkpoint retries"],
            [metric(summary.coreComplete), "Completed the core track"],
            [metric(summary.paired), "Paired skill checks"],
          ].map(([value, label]) => (
            <div key={label} className="border-t border-rule pt-3">
              <p className="font-display text-4xl tabular">{value}</p>
              <p className="mt-2 text-sm text-ink-3">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="paths-title">
          <h2 id="paths-title" className="border-b border-ink pb-3 font-display text-2xl">
            Different learning paths
          </h2>
          <p className="mt-3 text-sm text-ink-2">
            Not everyone finishes. The mix intentionally includes early exits and intermittent study.
          </p>
          <div className="mt-6 space-y-5">
            {DEMO_STYLES.map((style) => {
              const count = students.filter((s) => s.style === style).length;
              return (
                <div key={style}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span>{style}</span>
                    <span className="font-mono text-ink-2">{count} · {percent(count)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-sm bg-paper-sunk" role="meter"
                    aria-label={style + " share"} aria-valuemin={0} aria-valuemax={summary.cohort} aria-valuenow={count}>
                    <div className="h-full bg-ink" style={{ width: percent(count) + "%" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section aria-labelledby="outcomes-title">
          <h2 id="outcomes-title" className="border-b border-ink pb-3 font-display text-2xl">
            Illustrative assessment outcomes
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            The simulated 30-question test uses Neuron&apos;s actual question difficulty
            weights. Only learners with both a baseline and follow-up are included
            in the paired calculation.
          </p>
          <p className="mt-7 font-display text-5xl tabular">
            {summary.pairedGain === null ? "—" : (summary.pairedGain >= 0 ? "+" : "") + summary.pairedGain.toFixed(1)}
            <span className="ml-2 text-xl text-ink-3">weighted points</span>
          </p>
          <p className="mt-2 text-sm text-ink-2">
            Modelled mean difference across {summary.paired} fictional paired assessments,
            not a measured improvement.
          </p>
          <p className="mt-6 border-t border-rule pt-4 text-sm text-ink-3">
            Checkpoint counts represent passed lessons, not actual clicks or server events.
            Grades and learner IDs are invented.
          </p>
        </section>
      </div>

      <section aria-labelledby="journeys-title" className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink pb-3">
          <h2 id="journeys-title" className="font-display text-3xl">Explore all {students.length} sample journeys</h2>
          <span className="font-mono text-xs text-ink-3">SEED 20261015 · NO PERSONAL DATA</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm text-ink-2">
          Open a learner to inspect the sequence of checkpoints, retries, labs, reviews,
          and assessments. &quot;Day&quot; is simulated course time, not a real visit date.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {students.map((student) => (
            <details key={student.id} className="group border border-rule bg-paper">
              <summary className="cursor-pointer p-4 marker:text-ink-3 hover:bg-paper-sunk">
                <div className="ml-1 inline-block align-top">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-semibold">{student.id}</span>
                    <span className="text-xs text-ink-3">Grade {student.grade} · {student.style}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-2">
                    {student.lessons.length} lessons · {student.labs.length} labs · {student.activeDays} active days
                    {student.retries ? " · " + student.retries + " retries" : ""}
                  </p>
                  <p className="mt-1 text-xs text-ink-3">
                    Before: {formatScore(student.pre)} · After: {formatScore(student.post)}
                  </p>
                </div>
              </summary>
              <div className="border-t border-rule px-5 py-4">
                {student.events.length === 0 ? (
                  <p className="text-sm text-ink-2">Opened the simulated portal but did not finish any activity.</p>
                ) : (
                  <ol className="space-y-3">
                    {student.events.map((event, index) => (
                      <li key={index} className="grid grid-cols-[4rem_1fr] gap-2 text-xs leading-relaxed">
                        <span className="font-mono text-ink-3">Day {event.day}</span>
                        <span>{event.description}</span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <footer className="mt-16 border-t border-rule pt-6 text-sm text-ink-3">
        This simulation is deterministic and runs entirely at build time, with no database,
        authentication, analytics, persistence, or modifications to user progress.
        All outcomes are fictional. See <Link href="/educators" className="underline underline-offset-4">
        the educator guide</Link> for a voluntary, privacy-preserving approach to real evaluation.
      </footer>
    </main>
  );
}
