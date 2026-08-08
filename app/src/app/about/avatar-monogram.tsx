/**
 * Deterministic inline-SVG monogram — no photo file, no remote image host, no Math.random. Each
 * person's accent hex is a fixed literal from data.ts, so the mark never changes between renders.
 * Marked aria-hidden because the person's full name is always rendered as adjacent visible text.
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
      <rect width="40" height="40" rx="8" fill="#0a0a0c" stroke={accent} strokeWidth="1.5" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="13"
        fill={accent}
        style={{ fontFamily: "var(--font-display-wide)", fontWeight: 600 }}
      >
        {initials}
      </text>
    </svg>
  );
}
