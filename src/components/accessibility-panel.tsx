"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { useSettings, type TextScale, type Theme } from "@/lib/settings";

function Segmented<T extends string>({
  legend,
  value,
  options,
  onChange,
}: {
  legend: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset>
      <legend className="label mb-2">{legend}</legend>
      <div className="grid grid-flow-col auto-cols-fr rounded-sm border border-rule p-0.5">
        {options.map((o) => (
          <label
            key={o.value}
            className="relative cursor-pointer rounded-[3px] px-2 py-1.5 text-center text-sm text-ink-2 has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-ink-3">{hint}</span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="mt-0.5 flex h-6 w-10 shrink-0 items-center rounded-full border border-rule-strong bg-paper-sunk p-0.5 transition-colors duration-150 aria-checked:border-ink aria-checked:bg-ink"
      >
        <span
          aria-hidden
          className={`size-[1.125rem] rounded-full shadow-sm transition-transform duration-200 ease-[var(--ease-out)] ${checked ? "translate-x-[calc(100%-2px)] bg-paper" : "translate-x-0 bg-ink-3"}`}
        />
      </button>
    </div>
  );
}

function tabbables(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>("button, input, [tabindex]:not([tabindex='-1'])"),
  ).filter((el) => {
    if (!(el instanceof HTMLInputElement) || el.type !== "radio") return true;
    const group = Array.from(
      root.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${el.name}"]`),
    );
    const checked = group.find((r) => r.checked);
    return checked ? el === checked : el === group[0];
  });
}

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const settings = useSettings();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    if (panelRef.current) tabbables(panelRef.current)[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      } else if (e.key === "Tab" && panelRef.current) {
        const items = tabbables(panelRef.current);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !buttonRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Display and accessibility settings"
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-sm text-ink-2 transition-colors duration-150 hover:bg-paper-sunk hover:text-ink aria-expanded:bg-paper-sunk aria-expanded:text-ink"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
          <path d="M5 8.5c2.3.7 4.6 1 7 1s4.7-.3 7-1M12 9.5V14m0 0-3 6.5M12 14l3 6.5" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
            style={{ transformOrigin: "top right" }}
            className="fixed inset-x-4 top-[3.75rem] z-50 max-h-[calc(100svh-4.5rem)] space-y-5 overflow-y-auto overscroll-contain sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-80 rounded-md border border-rule-strong bg-paper-raised p-5 shadow-[var(--shadow-lift)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={titleId} className="font-display text-2xl leading-none">
                Display
              </h2>
              <span className="label">Saved on this device</span>
            </div>
            <Segmented<Theme>
              legend="Theme"
              value={settings.theme}
              onChange={(theme) => settings.set({ theme })}
              options={[
                { value: "system", label: "Auto" },
                { value: "light", label: "Paper" },
                { value: "dark", label: "Night" },
              ]}
            />
            <Segmented<TextScale>
              legend="Text size"
              value={settings.textScale}
              onChange={(textScale) => settings.set({ textScale })}
              options={[
                { value: "100", label: "A" },
                { value: "112", label: "A+" },
                { value: "125", label: "A++" },
              ]}
            />
            <div className="space-y-4 border-t border-rule pt-4">
              <Toggle
                label="High contrast"
                hint="Stronger text and borders"
                checked={settings.contrast}
                onChange={(contrast) => settings.set({ contrast })}
              />
              <Toggle
                label="Readable font"
                hint="Atkinson Hyperlegible, built for low vision"
                checked={settings.readableFont}
                onChange={(readableFont) => settings.set({ readableFont })}
              />
              <Toggle
                label="Reduce motion"
                hint="Turn off pulses and transitions"
                checked={settings.reduceMotion}
                onChange={(reduceMotion) => settings.set({ reduceMotion })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
