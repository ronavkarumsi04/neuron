import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-ink-2 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-display text-lg text-ink">Neuron</span>
          <span className="mx-2 text-ink-3">/</span>
          An AI learning portal for grades 9–12. Progress stays on your device.
        </p>
        <ul className="flex gap-5">
          <li><Link className="hover:text-ink" href="/map">Brain map</Link></li>
          <li><Link className="hover:text-ink" href="/profile">Progress</Link></li>
        </ul>
      </div>
    </footer>
  );
}
