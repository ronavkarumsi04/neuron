import type { Metadata } from "next";
import Link from "next/link";
import { LabStatus } from "@/components/labs/lab-runner";
import { getModule } from "@/content/curriculum";
import { labs } from "@/content/labs";

export const metadata: Metadata = { title: "Labs" };

const TONE_TEXT: Record<string, string> = { cobalt: "text-cobalt", green: "text-green", plum: "text-plum", gold: "text-gold" };

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-10">
      <p className="label">Hands-on</p>
      <h1 className="mt-2 font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none tracking-tight">Labs</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-2">
        Reading about AI only gets you so far. In the labs you train a network, write prompts, catch hallucinations, fix a biased model, and make hard calls. Every lab runs on your device.
      </p>
      <ol className="mt-10 border-t border-ink">
        {labs.map((lab) => {
          const m = getModule(lab.module)!;
          return (
            <li key={lab.id} className="border-b border-rule">
              <Link href={`/labs/${lab.id}`} className="group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-1 py-6 transition-colors duration-150 hover:bg-paper-sunk/60 sm:grid-cols-[4rem_minmax(0,1fr)_9rem] sm:px-2">
                <span className={`font-mono text-sm ${TONE_TEXT[m.tone]}`}>{lab.number}</span>
                <span>
                  <span className="label">Module {m.number} · {m.kicker} · {lab.minutes} min</span>
                  <span className="mt-1 block font-display text-2xl leading-tight sm:text-[1.75rem]">
                    {lab.title}
                    <span aria-hidden className="ml-2 inline-block text-ink-3 transition-transform duration-150 group-hover:translate-x-1">→</span>
                  </span>
                  <span className="mt-2 block max-w-2xl text-ink-2">{lab.blurb}</span>
                </span>
                <span className="col-start-2 mt-2 sm:col-start-3 sm:mt-1 sm:text-right"><LabStatus id={lab.id} /></span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
