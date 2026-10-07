import Link from "next/link";
import { BrainMap } from "@/components/brain-map";
import { MapCaption } from "@/components/map-caption";
import { TIERS, modules, totalLessons } from "@/content/curriculum";
import { labs, labsFor } from "@/content/labs";
import { TONE_TEXT } from "@/lib/tone";
import { Story } from "@/components/story/story";


export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-14 md:pt-24">
        <p className="label">An AI learning portal · Grades 9–12</p>
        <h1 className="mt-6 max-w-5xl font-display text-[clamp(3rem,8.5vw,7.25rem)] leading-[0.9] tracking-tight">
          From one neuron <br className="hidden sm:block" />
          <em className="text-signal-ink">to an AI agent.</em>
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-end">
          <div>
            <p className="max-w-xl text-lg leading-relaxed text-ink-2">
              Train a real model in your browser, write prompts that work, learn where the ethical lines are,
              then go all the way down to attention, model weights, and agents. Every lesson you finish lights up a neuron.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/modules/foundations/what-is-ai"
                className="inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
              >
                Start Module 01
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/map"
                className="inline-flex h-11 items-center rounded-sm border border-rule-strong px-5 font-medium transition-colors duration-150 hover:bg-paper-sunk"
              >
                Open the brain map
              </Link>
            </div>
            <p className="mt-5 text-sm text-ink-3">
              New here?{" "}
              <Link href="/assessment" className="text-ink-2 underline underline-offset-4 hover:text-ink">Take the baseline skill check</Link>
              {" "}· Judging?{" "}
              <Link href="/judge" className="text-ink-2 underline underline-offset-4 hover:text-ink">Start the guided tour</Link>
            </p>
          </div>
          <dl className="grid grid-cols-3 border-t border-rule pt-5">
            {[
              [String(totalLessons), "lessons"],
              [String(labs.length), "hands-on labs"],
              ["0", "accounts needed"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="sr-only">{l}</dt>
                <dd className="font-display text-5xl leading-none tabular">{n}</dd>
                <dd className="mt-1 text-sm text-ink-3">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="label mt-14 flex items-center gap-3">
          <span aria-hidden className="inline-block h-8 w-px bg-signal" />
          Scroll · watch the course go from beginner to expert
        </p>
      </section>

      <section aria-labelledby="story-heading">
        <h2 id="story-heading" className="sr-only">What you&apos;ll learn, from beginner to expert</h2>
        <Story />
      </section>

      <section aria-labelledby="modules-heading" className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between border-b border-ink pb-3">
          <h2 id="modules-heading" className="font-display text-3xl">
            The curriculum
          </h2>
          <span className="label">{modules.length} modules</span>
        </div>
        <ol>
          {modules.map((m) => (
            <li key={m.id} className="border-b border-rule">
              <Link
                href={`/modules/${m.id}`}
                className="group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-6 transition-colors duration-150 hover:bg-paper-sunk/60 sm:grid-cols-[4.5rem_minmax(0,1fr)_14rem] sm:px-2"
              >
                <span className={`font-mono text-sm ${TONE_TEXT[m.tone]}`}>{m.number}</span>
                <span>
                  <span className="label">{m.kicker}</span>
                  <span className="mt-1 block font-display text-2xl leading-tight sm:text-[1.75rem]">
                    {m.title}
                    <span aria-hidden className="ml-2 inline-block text-ink-3 transition-transform duration-150 group-hover:translate-x-1">→</span>
                  </span>
                  <span className="mt-2 block max-w-2xl text-ink-2">{m.summary}</span>
                </span>
                <span className="col-start-2 mt-2 text-sm text-ink-3 sm:col-start-3 sm:mt-0 sm:text-right">
                  {m.lessons.length} lessons · {labsFor(m.id).length ? `${labsFor(m.id).length > 1 ? "Labs" : "Lab"}: ${labsFor(m.id).map((l) => l.title).join(", ")}` : `${TIERS[m.tier].label} · interactive demos`}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="map-heading" className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center">
        <div>
          <p className="label">Live · saved on this device</p>
          <h2 id="map-heading" className="mt-4 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95] tracking-tight">
            This one is <em className="text-signal-ink">yours.</em>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-2">
            Your real progress, right now. Finished lessons glow, lessons you haven&apos;t reviewed in a while fade, and locked modules stay dashed until you&apos;ve earned them.
          </p>
          <Link
            href="/modules/foundations/what-is-ai"
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-sm bg-ink px-5 font-medium text-paper transition-transform duration-150 active:scale-[0.97]"
          >
            Light your first neuron <span aria-hidden>→</span>
          </Link>
        </div>
        <figure className="relative rounded-md border border-rule bg-paper-raised/70 p-3 sm:p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="label">Fig. 8 — Your brain map</span>
            <span className="label">Live</span>
          </div>
          <BrainMap className="w-full" />
          <MapCaption />
        </figure>
      </section>
    </>
  );
}
