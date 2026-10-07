"use client";

import { useId, useState } from "react";
import { useProgress } from "@/lib/progress";
import { btn, Done, Panel } from "./ui";

interface Brief { id: string; title: string; situation: string; topic: RegExp; example: string }

const BRIEFS: Brief[] = [
  {
    id: "chem",
    title: "Chemistry test",
    situation: "Your chemistry test on balancing equations is Friday and you keep getting them wrong. Get the AI to help you actually learn it, not just hand you answers.",
    topic: /equation|balanc|chem|reaction|coefficient/i,
    example: "I'm a 10th grader with a chemistry test Friday, and I keep messing up balancing equations, especially when there are polyatomic ions. Act as a patient tutor. Give me one unbalanced equation at a time, starting easy, and wait for my answer. If I'm wrong, give me a hint before showing the solution. Keep each explanation under 80 words. After 5 problems, tell me which mistake I make most.",
  },
  {
    id: "essay",
    title: "Essay feedback",
    situation: "You finished a draft of your history essay on the causes of World War I. Get useful feedback without the AI rewriting it for you.",
    topic: /essay|draft|world war|wwi|ww1|history|thesis/i,
    example: "I'm a junior and wrote a 900-word history essay arguing that alliances were the main cause of World War I (pasted below). Act as a tough but fair history teacher. Give feedback on my thesis, evidence, and counterarguments as 3 bullet points each, with no rewritten sentences. Don't rewrite my essay. Then ask me one question that would push my argument further.",
  },
  {
    id: "council",
    title: "Student council",
    situation: "You're running for student council and the debate is next week. Use AI to practice answering tough questions.",
    topic: /student council|council|debate|campaign|election|candidate|speech/i,
    example: "I'm running for student council treasurer at my high school, and my platform is longer lunch periods and a transparent club budget. Act as a skeptical student journalist at the candidate debate. Ask me one tough question at a time and wait for my answer. After each answer, give me 2 sentences of feedback on clarity and confidence, then ask the next question. Stop after 5 questions and summarize my weakest area.",
  },
  {
    id: "plan",
    title: "Finals plan",
    situation: "Finals are in two weeks: biology, algebra 2, and Spanish. Get a study plan you'll actually follow.",
    topic: /study|plan|final|schedule|exam|biology|algebra|spanish/i,
    example: "I'm a sophomore with finals in 2 weeks for biology, algebra 2, and Spanish. Algebra is my weakest subject, and I have soccer practice weekdays until 5 p.m. Act as a study coach. Make a 14-day schedule as a table with day, subject, task, and minutes, using spaced review and practice testing instead of rereading. Keep weekday sessions under 90 minutes total. Before you make it, ask me 2 questions about my schedule.",
  },
];

const CRAFT = [
  {
    key: "Context",
    test: /\b(i'?m|i am|i've|my|we're|our|grade|freshman|sophomore|junior|senior|class|course|already|confus|struggl|keep (getting|messing)|weak|strong|test (is|on)|due)\b/i,
    hit: "You told it who you are and what's going on.",
    miss: "It has to guess your level and situation. Add your grade, what you already know, or what's tripping you up.",
  },
  {
    key: "Role",
    test: /\b(act as|acting as|you are|you're an?|pretend|play the role|role of|be my|as an? (tutor|teacher|coach|editor|expert|reviewer|critic|interviewer|journalist|judge))\b/i,
    hit: "You gave it a role to play.",
    miss: "It'll default to a generic assistant voice. Try “Act as a patient tutor” or “Act as a skeptical reviewer.”",
  },
  {
    key: "Ask",
    test: /\b(explain|quiz|summari[sz]e|compare|critique|review|give|list|help me|create|make|suggest|outline|check|ask me|generate|point out|identify|practice|teach)\b/i,
    hit: "There's a clear task verb.",
    miss: "What exactly should it do? Start with a verb: explain, quiz, critique, compare, plan.",
  },
  {
    key: "Format",
    test: /(\b\d+\s*(-|\s)?(words?|sentences?|bullets?|bullet points?|points?|questions?|steps?|examples?|problems?|minutes?|days?)\b|\bbullets?\b|\btable\b|\bnumbered\b|\bparagraphs?\b|\bshort\b|\bbrief\b|\bunder \d+|\bstep[- ]by[- ]step\b|\breading level\b|\bone (question|problem) at a time\b)/i,
    hit: "You described what the answer should look like.",
    miss: "It'll pick its own length and shape, usually a wall of text. Ask for bullets, a table, a word limit, or a number of questions.",
  },
  {
    key: "Tweak",
    test: /\b(one (question|problem|at) ?(at a time)?|ask me|wait for|if i'?m wrong|if i am wrong|hint|don'?t (give|tell|just|rewrite|write)|no (rewrit|answers)|then|after (each|that|\d)|before you|follow[- ]up|stop after|instead of)\b/i,
    hit: "You set rules for how the conversation should go.",
    miss: "Add a rule that keeps you doing the thinking: “one question at a time,” “hint before the answer,” or “don't rewrite it.”",
  },
];

function score(text: string, brief: Brief) {
  const results = CRAFT.map((c) => ({ ...c, ok: c.test.test(text) }));
  return { results, total: results.filter((r) => r.ok).length, onTopic: brief.topic.test(text), words: text.trim().split(/\s+/).filter(Boolean).length };
}

export function PromptLab() {
  const finish = useProgress((s) => s.completeLab);
  const [active, setActive] = useState(0);
  const [drafts, setDrafts] = useState<string[]>(() => BRIEFS.map(() => ""));
  const [checked, setChecked] = useState<(ReturnType<typeof score> | null)[]>(() => BRIEFS.map(() => null));
  const [passed, setPassed] = useState<Set<string>>(new Set());
  const id = useId();
  const brief = BRIEFS[active];
  const result = checked[active];
  const complete = passed.size >= 3;

  const check = () => {
    const r = score(drafts[active], brief);
    setChecked((c) => c.map((v, i) => (i === active ? r : v)));
    if (r.total >= 4 && r.onTopic && r.words >= 12) {
      const next = new Set(passed).add(brief.id);
      setPassed(next);
      if (next.size >= 3 && passed.size < 3) finish("prompt-lab");
    }
  };

  return (
    <div className="space-y-6">
      <div role="tablist" aria-label="Briefs" className="flex gap-1 overflow-x-auto border-b border-rule pb-px">
        {BRIEFS.map((b, i) => (
          <button
            key={b.id}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel`}
            onClick={() => setActive(i)}
            className="flex items-center gap-2 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm text-ink-2 hover:text-ink aria-selected:border-ink aria-selected:text-ink"
          >
            {passed.has(b.id) && <span aria-label="passed" className="text-green">✓</span>}
            {b.title}
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="grid gap-6 md:grid-cols-[minmax(0,1fr)_17rem]">
        <div>
          <p className="label">Brief {active + 1} of {BRIEFS.length}</p>
          <p className="mt-2 font-display text-2xl leading-snug">{brief.situation}</p>
          <label htmlFor={`${id}-text`} className="mt-5 block text-sm font-medium text-ink">Your prompt</label>
          <textarea
            id={`${id}-text`}
            rows={7}
            value={drafts[active]}
            onChange={(e) => setDrafts((d) => d.map((v, i) => (i === active ? e.target.value : v)))}
            placeholder="Write it exactly as you'd type it into a chatbot…"
            className="mt-2 w-full resize-y rounded-sm border border-rule-strong bg-paper-raised p-3 leading-relaxed text-ink placeholder:text-ink-3"
          />
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button type="button" onClick={check} disabled={drafts[active].trim().length < 5} className={btn.primary}>Check prompt</button>
            <span className="font-mono text-xs text-ink-3 tabular">{drafts[active].trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
        </div>

        <Panel title="CRAFT check" label={result ? `${result.total}/5` : "Not checked"} className="self-start">
          {!result ? (
            <p className="text-sm text-ink-3">Write a prompt and check it. You need 4 of 5 on three different briefs.</p>
          ) : (
            <div aria-live="polite">
              <ul className="space-y-3">
                {result.results.map((r) => (
                  <li key={r.key} className="text-sm">
                    <span className={`font-mono text-xs uppercase ${r.ok ? "text-green" : "text-signal-ink"}`}>{r.ok ? "✓" : "—"} {r.key}</span>
                    <p className="mt-0.5 text-ink-2">{r.ok ? r.hit : r.miss}</p>
                  </li>
                ))}
              </ul>
              {!result.onTopic && <p className="mt-3 border-l-2 border-signal pl-3 text-sm text-ink-2">This doesn&apos;t mention what the brief is about, so the AI wouldn&apos;t know the subject.</p>}
              {result.onTopic && result.words < 12 && <p className="mt-3 border-l-2 border-signal pl-3 text-sm text-ink-2">Too short to carry the details the AI needs.</p>}
            </div>
          )}
        </Panel>
      </div>

      {result && (
        <details className="rounded-md border border-rule p-4">
          <summary className="cursor-pointer font-medium text-ink">See a strong example for this brief</summary>
          <p className="mt-3 font-mono text-sm leading-relaxed text-ink-2">{brief.example}</p>
          <p className="mt-2 text-sm text-ink-3">Don&apos;t copy it. Yours should include details only you know about your class and your situation.</p>
        </details>
      )}

      <p className="label">{passed.size}/3 briefs at 4+</p>
      {complete && <Done>Lab complete. You can steer an AI with context, a role, a clear ask, a format, and rules. Those habits matter more than any specific tool.</Done>}
    </div>
  );
}
