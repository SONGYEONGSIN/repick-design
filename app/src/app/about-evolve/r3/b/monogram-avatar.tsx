type Props = { initials: string; color: string; className?: string };

/**
 * Deterministic inline-SVG monogram avatar — fixed color + initials per person (see data.ts),
 * never a remote/random image host. No JS, safe to render on the server.
 */
export default function MonogramAvatar({ initials, color, className = "" }: Props) {
  return (
    <svg viewBox="0 0 40 40" role="img" aria-label={`${initials} monogram`} className={className}>
      <circle cx="20" cy="20" r="20" fill={color} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="15"
        fontWeight="600"
      >
        {initials}
      </text>
    </svg>
  );
}
