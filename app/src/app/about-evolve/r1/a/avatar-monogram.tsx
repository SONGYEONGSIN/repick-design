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
  name: string;
  initials: string;
  accent: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-hidden="true" className={className}>
      <rect width="64" height="64" rx="14" fill={accent} />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontSize="22"
        fill="#ffffff"
        style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 700 }}
      >
        {initials}
      </text>
    </svg>
  );
}
