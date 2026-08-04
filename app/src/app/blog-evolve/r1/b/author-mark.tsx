// Deterministic monogram avatar. FNV-1a over the author id drives a stable hue pair so the same
// author always renders the same mark and nothing is fetched from a third-party image host —
// this route stays text-forward by design, so avatars are generated, not photographed.

function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export default function AuthorMark({
  seed,
  initials,
  name,
  className = "h-10 w-10",
}: {
  seed: string;
  initials: string;
  name: string;
  className?: string;
}) {
  const h = hashString(seed);
  const hueA = h % 360;
  const hueB = (hueA + 34) % 360;
  const gradId = `author-mark-${h.toString(36)}`;

  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label={`${name} avatar`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hueA} 62% 34%)`} />
          <stop offset="100%" stopColor={`hsl(${hueB} 58% 22%)`} />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="20" fill={`url(#${gradId})`} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#f4f4f5"
        fontSize="14"
        fontWeight="600"
        fontFamily="var(--font-sans)"
      >
        {initials}
      </text>
    </svg>
  );
}
