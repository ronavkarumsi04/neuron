"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { btn, Done, Panel } from "./ui";

interface Line { text: string; false?: string }
interface Round { q: string; lines: Line[]; check: string }

const ROUNDS: Round[] = [
  {
    q: "Who was the first woman to win a Nobel Prize?",
    check: "Look it up on the official site, nobelprize.org, which lists every laureate by year and category.",
    lines: [
      { text: "Marie Curie was the first woman to win a Nobel Prize, sharing the 1903 Nobel Prize in Physics." },
      { text: "She shared it with Pierre Curie and Henri Becquerel for their work on radioactivity." },
      { text: "In 1911 she won a second Nobel Prize, this time in Chemistry." },
      { text: "Her daughter, Irène Joliot-Curie, later won the 1935 Nobel Prize in Physics.", false: "Irène Joliot-Curie won the 1935 Nobel Prize in Chemistry, not Physics. Swapping one real detail for a similar one is a classic hallucination." },
    ],
  },
  {
    q: "Give me a source about screen time and teen sleep.",
    check: "Search the exact article title in Google Scholar or your library database. If it doesn't show up, it probably doesn't exist.",
    lines: [
      { text: "Research has linked heavy evening screen use to later bedtimes and less sleep in teenagers." },
      { text: "One study found that teens who used phones after 9 p.m. slept exactly 2.5 hours less per night.", false: "An oddly precise number with no source attached is a red flag. This statistic is invented." },
      { text: "A good source is Hendricks, L., & Moreau, P. (2019). “Blue Light and the Adolescent Brain.” Journal of Teen Sleep Science, 14(2), 88–102.", false: "This citation is made up: the authors, the article, and the journal. Fake citations look perfectly formatted, which is what makes them dangerous." },
      { text: "You can search for peer-reviewed studies on databases like Google Scholar or PubMed." },
    ],
  },
  {
    q: "What is 17 × 24?",
    check: "Redo it yourself or use a calculator. Never trust AI arithmetic on anything that matters.",
    lines: [
      { text: "17 × 24 = 418.", false: "17 × 24 = 408. Language models predict likely-looking digits and don't calculate unless they use a tool. Notice the next sentences are right but don't add up to 418." },
      { text: "You can check this by splitting it up: 17 × 20 = 340." },
      { text: "Then 17 × 4 = 68, and you add the two parts together." },
    ],
  },
  {
    q: "Tell me a few facts about the Great Wall of China.",
    check: "Myths spread because they get repeated. Check a reliable encyclopedia or a space agency source like NASA.",
    lines: [
      { text: "The Great Wall is a series of fortifications built over many centuries across northern China." },
      { text: "Much of the wall that visitors see today was built during the Ming dynasty." },
      { text: "It is easy to see with the naked eye from the Moon.", false: "This is a popular myth. The wall is long but narrow, and it can't be seen with the naked eye from the Moon. AI often repeats myths because they appear so often in its training text." },
      { text: "UNESCO added it to the World Heritage List in 1987." },
    ],
  },
  {
    q: "What is photosynthesis?",
    check: "Your biology textbook would confirm all of this.",
    lines: [
      { text: "Photosynthesis is how plants, algae, and some bacteria turn light energy into chemical energy." },
      { text: "It uses carbon dioxide and water, and it releases oxygen." },
      { text: "In plants, it mainly happens inside chloroplasts." },
    ],
  },
  {
    q: "What happened when lawyers used ChatGPT for a court filing?",
    check: "Find news coverage of the case by name (Mata v. Avianca) from established outlets, or the court's own order.",
    lines: [
      { text: "In Mata v. Avianca (2023), lawyers filed a brief citing court cases that ChatGPT had generated." },
      { text: "Several of the cited cases did not exist." },
      { text: "The judge praised the lawyers for their creative use of new technology.", false: "The opposite happened. The judge sanctioned the lawyers. An AI can flip the meaning of a real event while keeping every name right." },
      { text: "The lawyers and their firm were ordered to pay a $5,000 penalty." },
    ],
  },
  {
    q: "Why do cooking directions change at high altitude?",
    check: "Look for a science source that explains how air pressure affects boiling.",
    lines: [
      { text: "At sea level, pure water boils at 100 °C (212 °F)." },
      { text: "At high altitude, water boils at a higher temperature because the air pressure is lower.", false: "Lower air pressure makes water boil at a lower temperature, not higher. That's why food takes longer to cook in the mountains. The sentence gets the cause right and the effect backwards." },
      { text: "That's why some recipes give separate instructions for high-altitude kitchens." },
    ],
  },
  {
    q: "Who wrote To Kill a Mockingbird?",
    check: "A library catalog or the publisher's author page will list her books.",
    lines: [
      { text: "Harper Lee wrote To Kill a Mockingbird, published in 1960." },
      { text: "It won the Pulitzer Prize for Fiction in 1961." },
      { text: "Lee went on to publish more than a dozen novels.", false: "Harper Lee published two novels: To Kill a Mockingbird and, in 2015, Go Set a Watchman. Filling in a plausible-sounding career is a common AI mistake." },
      { text: "The story is narrated by a young girl named Scout Finch." },
    ],
  },
];

const TOTAL_FALSE = ROUNDS.reduce((n, r) => n + r.lines.filter((l) => l.false).length, 0);

export function Hallucination() {
  const finish = useProgress((s) => s.completeLab);
  const [round, setRound] = useState(0);
  const [flags, setFlags] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState({ caught: 0, alarms: 0 });
  const [over, setOver] = useState(false);
  const r = ROUNDS[round];

  const reveal = () => {
    const caught = r.lines.filter((l, i) => l.false && flags.has(i)).length;
    const alarms = r.lines.filter((l, i) => !l.false && flags.has(i)).length;
    setTally((t) => ({ caught: t.caught + caught, alarms: t.alarms + alarms }));
    setRevealed(true);
  };

  const next = () => {
    if (round === ROUNDS.length - 1) {
      setOver(true);
      if (tally.caught / TOTAL_FALSE >= 0.7 && tally.alarms <= 2) finish("spot-the-hallucination");
      return;
    }
    setRound(round + 1);
    setFlags(new Set());
    setRevealed(false);
  };

  const restart = () => {
    setRound(0);
    setFlags(new Set());
    setRevealed(false);
    setTally({ caught: 0, alarms: 0 });
    setOver(false);
  };

  if (over) {
    const pct = Math.round((tally.caught / TOTAL_FALSE) * 100);
    const won = pct >= 70 && tally.alarms <= 2;
    return (
      <Panel title="Results" label="All rounds done">
        <dl className="grid grid-cols-2 gap-4 border-b border-rule pb-5 sm:max-w-md">
          <div><dt className="label">Caught</dt><dd className="font-display text-5xl tabular">{tally.caught}/{TOTAL_FALSE}</dd></div>
          <div><dt className="label">False alarms</dt><dd className="font-display text-5xl tabular">{tally.alarms}</dd></div>
        </dl>
        <div className="mt-5">
          {won ? (
            <Done>Lab complete. You caught {pct}% of the hallucinations. The habit to keep: check specific claims, citations, and numbers before you rely on them.</Done>
          ) : (
            <p className="text-ink-2">You caught {pct}% with {tally.alarms} false alarms. To pass you need 70% with no more than 2 false alarms. Look hardest at citations, precise numbers, and claims that sound like common knowledge.</p>
          )}
        </div>
        <button type="button" onClick={restart} className={`${btn.secondary} mt-5`}>Play again</button>
      </Panel>
    );
  }

  return (
    <Panel title={`Round ${round + 1} of ${ROUNDS.length}`} label={`Caught ${tally.caught} · false alarms ${tally.alarms}`}>
      <p className="label">Student asks</p>
      <p className="mt-1 font-display text-2xl">{r.q}</p>
      <p className="label mt-6">AI answers <span className="normal-case tracking-normal">· tap a sentence to flag it</span></p>
      <ul className="mt-2 space-y-2">
        {r.lines.map((l, i) => {
          const flagged = flags.has(i);
          const tone = !revealed
            ? flagged ? "border-signal bg-signal/10" : "border-rule hover:bg-paper-sunk/70"
            : l.false ? (flagged ? "border-green bg-green/10" : "border-signal bg-signal/10") : flagged ? "border-gold bg-gold/10" : "border-rule";
          return (
            <li key={i}>
              <button
                type="button"
                aria-pressed={flagged}
                disabled={revealed}
                onClick={() => setFlags((f) => { const n = new Set(f); if (n.has(i)) n.delete(i); else n.add(i); return n; })}
                className={`flex w-full items-start gap-3 rounded-sm border px-3 py-3 text-left transition-colors duration-150 ${tone}`}
              >
                <span aria-hidden className="mt-0.5 font-mono text-xs text-ink-3">{flagged ? "⚑" : String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1 text-ink">{l.text}</span>
              </button>
              {revealed && (l.false || flagged) && (
                <p className="mt-1.5 pl-9 text-sm leading-relaxed text-ink-2">
                  <span className={`font-mono text-xs uppercase ${l.false ? (flagged ? "text-green" : "text-signal-ink") : "text-gold"}`}>
                    {l.false ? (flagged ? "Caught" : "Missed") : "This one's true"}
                  </span>{" "}
                  {l.false ?? "Flagging true things wastes time, but checking is never wrong."}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {revealed && (
        <p className="mt-4 border-l-2 border-cobalt pl-3 text-sm text-ink-2" aria-live="polite">
          <span className="font-mono text-xs uppercase text-cobalt">How you&apos;d check</span> {r.check}
          {!r.lines.some((l) => l.false) && " Every sentence in this answer was true. Not every answer is wrong, but you only know after you check."}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-rule pt-4">
        {!revealed ? (
          <button type="button" onClick={reveal} className={btn.primary}>{flags.size ? `Check ${flags.size} flag${flags.size > 1 ? "s" : ""}` : "Looks all true"}</button>
        ) : (
          <button type="button" onClick={next} className={btn.primary}>{round === ROUNDS.length - 1 ? "See results" : "Next round"}</button>
        )}
      </div>
    </Panel>
  );
}
