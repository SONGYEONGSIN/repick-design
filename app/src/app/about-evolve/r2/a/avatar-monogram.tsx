/**
 * Deterministic inline-SVG monogram — no photo file, no remote image host, no Math.random. Each
 * person gets one fixed accent hex from data.ts, so the mark never changes between renders. Marked
 * aria-hidden because the person's full name is always rendered as adjacent visible text.
 */
export default function AvatarMonogram({
  initials,
  accent,
  className,
}: {
  initials: string;
  accent: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-hidden="true" className={className}>
      <rect width="40" height="40" rx="9" fill={accent} />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="14"
        fill="#ffffff"
        style={{ fontFamily: "var(--font-display-mono)", fontWeight: 700 }}
      >
        {initials}
      </text>
    </svg>
  );
}
