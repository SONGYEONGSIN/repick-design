// Generated identity mark — no photo, so no random-image-host risk and nothing to reserve a broken
// alt-text box for. Fixed integer coordinates only (no trig), so it is stable across server/client
// hydration without a rounding rule to worry about. Reads as an abstracted keel-and-waterline glyph,
// matching the "Keel & Ballast" practice name.
export default function MonogramMark({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Keel & Ballast Audits mark">
      <rect x="1" y="1" width="38" height="38" rx="10" className="fill-emerald-700" />
      <path d="M20 9 L20 27 L13 31 Z" className="fill-white" opacity="0.92" />
      <path d="M20 9 L20 27 L27 31 Z" className="fill-emerald-100" opacity="0.75" />
      <circle cx="20" cy="9" r="2.6" className="fill-white" />
      <rect x="9" y="33" width="22" height="2.4" rx="1.2" className="fill-emerald-100" opacity="0.85" />
    </svg>
  );
}
