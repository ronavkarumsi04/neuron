"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccessibilityPanel } from "@/components/accessibility-panel";
import { NeuronMark } from "@/components/neuron-mark";
import { XpMeter } from "@/components/xp-meter";

const NAV = [
  { href: "/map", label: "Brain map" },
  { href: "/modules/foundations", label: "Modules", match: "/modules" },
  { href: "/labs", label: "Labs" },
  { href: "/profile", label: "Progress" },
];

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:gap-6 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 rounded-sm" aria-label="Neuron home">
          <NeuronMark className="size-6" />
          <span className="font-display text-[1.45rem] leading-none tracking-tight">Neuron</span>
        </Link>
        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.match ?? item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="rounded-sm px-3 py-2 text-sm text-ink-2 transition-colors duration-150 hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-signal aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <XpMeter />
          <AccessibilityPanel />
        </div>
      </div>
      <nav aria-label="Primary mobile" className="border-t border-rule md:hidden">
        <ul className="mx-auto flex max-w-6xl justify-around px-2">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.match ?? item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="block px-3 py-2.5 text-sm text-ink-2 aria-[current=page]:text-ink aria-[current=page]:font-medium"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
