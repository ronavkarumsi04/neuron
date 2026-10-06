"use client";

import { useId, useState } from "react";
import { Figure } from ".";

const MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];

export function CitationBuilder() {
  const id = useId();
  const [f, setF] = useState({
    prompt: "Explain the causes of the French Revolution in three bullet points",
    tool: "ChatGPT",
    version: "GPT-4o",
    company: "OpenAI",
    date: new Date().toISOString().slice(0, 10),
    url: "https://chatgpt.com",
  });
  const [copied, setCopied] = useState<string | null>(null);
  const d = new Date(`${f.date}T12:00:00`);
  const valid = !Number.isNaN(d.getTime());
  const mlaDate = valid ? `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}` : "date";
  const year = valid ? d.getFullYear() : "n.d.";
  const bareUrl = f.url.replace(/^https?:\/\//, "");

  const mla = `“${f.prompt}” prompt. ${f.tool}, ${f.version} version, ${f.company}, ${mlaDate}, ${bareUrl}.`;
  const apa = `${f.company}. (${year}). ${f.tool} (${f.version}) [Large language model]. ${f.url}`;
  const apaText = `(${f.company}, ${year})`;

  const copy = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  const field = (key: keyof typeof f, label: string, type = "text") => (
    <label className="block text-sm">
      <span className="text-ink-2">{label}</span>
      <input id={`${id}-${key}`} type={type} value={f[key]} onChange={(e) => setF((p) => ({ ...p, [key]: e.target.value }))}
        className="mt-1 h-10 w-full rounded-sm border border-rule-strong bg-paper px-3 text-ink" />
    </label>
  );

  return (
    <Figure title="Citation builder" label="MLA 9 · APA 7">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">{field("prompt", "Your prompt (shortened is fine)")}</div>
        {field("tool", "Tool")}
        {field("version", "Version or model")}
        {field("company", "Company")}
        {field("date", "Date you used it", "date")}
        <div className="sm:col-span-2">{field("url", "Web address")}</div>
      </div>
      <div className="mt-5 space-y-3">
        {[
          ["MLA", mla],
          ["APA reference", apa],
          ["APA in-text", apaText],
        ].map(([label, text]) => (
          <div key={label} className="rounded-sm border border-rule bg-paper px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="label">{label}</p>
              <button type="button" onClick={() => copy(label, text)} className="min-h-8 text-sm text-ink-2 underline underline-offset-4 hover:text-ink">
                {copied === label ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-1 text-[0.95rem] leading-relaxed text-ink">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-3">Based on the MLA Style Center and APA Style blog guidance for generative AI. Your teacher&apos;s rules win if they differ.</p>
    </Figure>
  );
}
