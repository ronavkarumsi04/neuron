export function NeuronMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M16 16 L5 7 M16 16 L27 9 M16 16 L8 27 M16 16 L26 25" />
      </g>
      <circle cx="5" cy="7" r="2.2" fill="currentColor" />
      <circle cx="27" cy="9" r="2.2" fill="currentColor" />
      <circle cx="8" cy="27" r="2.2" fill="currentColor" />
      <circle cx="26" cy="25" r="2.2" fill="currentColor" />
      <circle cx="16" cy="16" r="5" fill="var(--signal)" />
    </svg>
  );
}
