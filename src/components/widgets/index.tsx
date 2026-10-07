"use client";

import type { SortConfig, WidgetId } from "@/content/lesson-types";
import { AgentLoop } from "./agent-loop";
import { Attention } from "./attention";
import { Backprop } from "./backprop";
import { CitationBuilder } from "./citation-builder";
import { LineFit } from "./line-fit";
import { ModelBuilder } from "./model-builder";
import { NextWord } from "./next-word";
import { Perceptron } from "./perceptron";
import { PromptBuilder } from "./prompt-builder";
import { Redact } from "./redact";
import { Sampling } from "./sampling";
import { Sorter } from "./sorter";

export function Widget({ id, sort }: { id: WidgetId; sort?: SortConfig }) {
  switch (id) {
    case "sort":
      return sort ? <Sorter config={sort} /> : null;
    case "line-fit":
      return <LineFit />;
    case "perceptron":
      return <Perceptron />;
    case "next-word":
      return <NextWord />;
    case "prompt-builder":
      return <PromptBuilder />;
    case "citation-builder":
      return <CitationBuilder />;
    case "redact":
      return <Redact />;
    case "backprop":
      return <Backprop />;
    case "attention":
      return <Attention />;
    case "sampling":
      return <Sampling />;
    case "model-builder":
      return <ModelBuilder />;
    case "agent-loop":
      return <AgentLoop />;
  }
}

export function Figure({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
  return (
    <figure className="not-prose my-10 rounded-md border border-rule-strong bg-paper-raised">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-3 sm:px-5">
        <span className="font-medium text-ink">{title}</span>
        <span className="label">{label}</span>
      </figcaption>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}
