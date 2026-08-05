// app/src/app/blog-evolve/r2/b/avatar.tsx
//
// Deterministic monogram avatar rendered as inline SVG — no remote host to fail or drift off-topic
// (page-brief-core §4). The fill hue is derived from the author's integer seed with plain arithmetic,
// kept inside a narrow green band so every avatar reads as part of the same emerald-accented system
// rather than introducing unrelated hues.
function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function Avatar({
  name,
  seed,
  size = 36,
  className = "",
}: {
  name: string;
  seed: number;
  size?: number;
  className?: string;
}) {
  const hue = 150 + (seed % 24); // 150..173, a narrow emerald/teal band
  const lightness = 20 + (seed % 3) * 4; // 20 / 24 / 28
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className={`shrink-0 rounded-full ${className}`}
    >
      <rect width="40" height="40" rx="20" fill={`hsl(${hue} 38% ${lightness}%)`} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="600"
        fill="#fafafa"
      >
        {initialsOf(name)}
      </text>
    </svg>
  );
}
