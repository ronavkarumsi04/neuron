"use client";

import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { btn, Done, Panel } from "./ui";

type Tone = "strong" | "mixed" | "risky";
interface Ending { tone: Tone; title: string; text: string }
interface Step { text: string; choices: { label: string; to: Step | Ending }[] }
interface Scenario { id: string; title: string; setup: string; start: Step }

const isEnding = (x: Step | Ending): x is Ending => "tone" in x;

const SCENARIOS: Scenario[] = [
  {
    id: "essay",
    title: "The 11 p.m. essay",
    setup: "Your English essay on The Great Gatsby is due at 8 a.m. You haven't started. The syllabus says AI is allowed for brainstorming only.",
    start: {
      text: "You open a chatbot. What do you type?",
      choices: [
        {
          label: "Paste the essay prompt and ask it to write 800 words",
          to: { tone: "risky", title: "You turned in someone else's work", text: "The syllabus allowed brainstorming only, so this breaks the rules even if nobody notices. You also skipped the writing practice the assignment exists for. If your teacher asks you to explain your argument in person, you won't be able to." },
        },
        {
          label: "Ask it to brainstorm possible thesis ideas about the green light",
          to: {
            text: "It gives you five ideas. One is phrased perfectly: “The green light represents a future that recedes the more Gatsby reaches for it.” You love it.",
            choices: [
              { label: "Paste that sentence in as your thesis", to: { tone: "mixed", title: "Brainstorming became writing", text: "You used AI the way the syllabus allowed, but copying its wording turns the AI's writing into yours. Make the idea your own in your own words, or quote and disclose it." } },
              { label: "Rewrite the idea in your own words and note that AI helped you brainstorm", to: { tone: "strong", title: "Within the rules, and still your work", text: "You used AI exactly as allowed, the thesis is yours, and a one-line disclosure keeps you honest. This is what responsible use looks like." } },
            ],
          },
        },
        {
          label: "Close the chatbot and email your teacher to ask for an extension",
          to: { tone: "strong", title: "Honest, even if it's uncomfortable", text: "Many teachers respond better to an honest request before the deadline than to a rushed or questionable essay. Even if the answer is no, you kept your integrity and can still write a shorter draft yourself." },
        },
      ],
    },
  },
  {
    id: "groupchat",
    title: "Group chat answers",
    setup: "A take-home quiz says “no outside help.” Someone in your group chat posts all the answers. They say they got them from an AI.",
    start: {
      text: "The answers are right there. What do you do?",
      choices: [
        { label: "Copy them. Everyone else is.", to: { tone: "risky", title: "Same answers, same problem", text: "Identical answers are easy for teachers to spot, and the rules were clear. “Everyone was doing it” doesn't change who is responsible for your work. And AI answers are often wrong anyway." } },
        {
          label: "Mute the chat and do the quiz yourself",
          to: {
            text: "You finish on your own. The next day a friend asks why you didn't just use the answers.",
            choices: [
              { label: "Tell them you wanted to actually know it for the test", to: { tone: "strong", title: "Integrity without the lecture", text: "You protected your own learning and gave your friend a reason, not a judgment. The real test is closed-book, and you're the one who'll be ready for it." } },
              { label: "Say nothing and change the subject", to: { tone: "mixed", title: "Your work was honest", text: "You did the right thing for yourself. Talking about why can help friends make better choices too, but whether to speak up is your call." } },
            ],
          },
        },
        { label: "Check your answers against theirs after you finish", to: { tone: "mixed", title: "Still outside help", text: "Checking someone else's answers is still outside help, which the quiz rules didn't allow. When you're unsure where the line is, the rule as written is the line." } },
      ],
    },
  },
  {
    id: "flagged",
    title: "Falsely flagged",
    setup: "You wrote your history paper yourself. Your teacher says an AI detector rated it 87% likely AI-generated.",
    start: {
      text: "Your teacher asks to talk after class. How do you respond?",
      choices: [
        { label: "Get angry and say detectors are garbage", to: { tone: "mixed", title: "Right point, wrong approach", text: "Detectors are unreliable, but anger makes the conversation harder. Your teacher is trying to be fair to everyone. Evidence works better than frustration." } },
        { label: "Show your drafts, version history, and notes, then offer to explain your argument", to: { tone: "strong", title: "Your process is your proof", text: "Version history shows the paper being written over time, and explaining your argument out loud shows it's yours. This is why keeping drafts and a process log matters." } },
        { label: "Admit to using AI so it'll go away", to: { tone: "risky", title: "Confessing to something you didn't do", text: "A false confession goes on your record and doesn't make the problem go away. You have the right to show your work and explain your process." } },
      ],
    },
  },
  {
    id: "deepfake",
    title: "The edited photo",
    setup: "A classmate used an AI app to make an embarrassing fake photo of another student and sends it to you. “Lol, share it.”",
    start: {
      text: "What do you do?",
      choices: [
        { label: "Share it in the class chat. It's just a joke.", to: { tone: "risky", title: "It isn't a joke to them", text: "Sharing a fake, humiliating image of a real person can be bullying, can break school rules, and in many places is illegal. Once it's shared, you can't take it back." } },
        { label: "Don't share it, and tell the sender to delete it", to: { tone: "strong", title: "You stopped it spreading", text: "Not passing it on breaks the chain, and saying something makes it less likely to keep happening. If it has already spread, telling a trusted adult or using your school's reporting system protects the student targeted." } },
        { label: "Don't share it, but don't say anything either", to: { tone: "mixed", title: "Better than sharing", text: "You didn't make it worse. But the student in the photo may not know it exists, and quietly reporting it to a trusted adult can protect them." } },
      ],
    },
  },
];

const TONE: Record<Tone, { label: string; cls: string }> = {
  strong: { label: "Strong choice", cls: "border-green text-green" },
  mixed: { label: "Mixed", cls: "border-gold text-gold" },
  risky: { label: "Risky", cls: "border-signal text-signal-ink" },
};

export function IntegritySim() {
  const finish = useProgress((s) => s.completeLab);
  const [active, setActive] = useState(0);
  const [path, setPath] = useState<(Step | Ending)[]>([SCENARIOS[0].start]);
  const [reached, setReached] = useState<Record<string, Tone>>({});
  const s = SCENARIOS[active];
  const node = path[path.length - 1];

  const open = (i: number) => {
    setActive(i);
    setPath([SCENARIOS[i].start]);
  };

  const choose = (to: Step | Ending) => {
    setPath((p) => [...p, to]);
    if (isEnding(to)) {
      const next = { ...reached, [s.id]: to.tone };
      const before = Object.keys(reached).length;
      setReached(next);
      if (Object.keys(next).length === SCENARIOS.length && before < SCENARIOS.length) finish("integrity-sim");
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
      <nav aria-label="Scenarios">
        <ol className="border-t border-ink">
          {SCENARIOS.map((x, i) => (
            <li key={x.id} className="border-b border-rule">
              <button type="button" aria-current={i === active ? "step" : undefined} onClick={() => open(i)} className="flex w-full items-center gap-3 py-3 text-left text-ink-2 hover:text-ink aria-[current=step]:font-medium aria-[current=step]:text-ink">
                <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">{x.title}</span>
                {reached[x.id] && <span className={`size-2 rounded-full ${reached[x.id] === "strong" ? "bg-green" : reached[x.id] === "mixed" ? "bg-gold" : "bg-signal"}`} aria-label={TONE[reached[x.id]].label} />}
              </button>
            </li>
          ))}
        </ol>
        <p className="label mt-3">{Object.keys(reached).length}/{SCENARIOS.length} endings reached</p>
      </nav>

      <Panel title={s.title} label={`Scenario ${active + 1}`}>
        <p className="text-lg text-ink-2">{s.setup}</p>
        <div aria-live="polite">
          {isEnding(node) ? (
            <div className={`mt-6 border-l-2 pl-4 ${TONE[node.tone].cls}`}>
              <p className="font-mono text-xs uppercase">{TONE[node.tone].label}</p>
              <p className="mt-1 font-display text-2xl text-ink">{node.title}</p>
              <p className="mt-2 text-ink-2">{node.text}</p>
            </div>
          ) : (
            <>
              <p className="mt-6 font-medium text-ink">{node.text}</p>
              <ul className="mt-3 grid gap-2">
                {node.choices.map((c) => (
                  <li key={c.label}>
                    <button type="button" onClick={() => choose(c.to)} className="flex min-h-11 w-full items-center gap-3 rounded-sm border border-rule-strong px-3 py-2.5 text-left text-ink-2 transition-colors duration-150 hover:border-ink hover:bg-paper-sunk hover:text-ink">
                      <span aria-hidden className="text-ink-3">→</span>
                      {c.label}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {path.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-rule pt-4">
            <button type="button" onClick={() => setPath([s.start])} className={btn.secondary}>Try another path</button>
            {isEnding(node) && active < SCENARIOS.length - 1 && <button type="button" onClick={() => open(active + 1)} className={btn.primary}>Next scenario</button>}
          </div>
        )}
        {Object.keys(reached).length === SCENARIOS.length && isEnding(node) && (
          <div className="mt-5"><Done>Lab complete. Ask what&apos;s allowed, keep your process visible, and don&apos;t pass harm along. Those three habits cover most of the hard calls.</Done></div>
        )}
      </Panel>
    </div>
  );
}
