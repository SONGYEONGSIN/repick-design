// app/src/app/blog-evolve/r1/a/avatar.tsx
//
// Deterministic monogram avatar — same rationale as cover-art.tsx: no headshot to fetch, fail, or
// mismatch between server and client render.
export default function Avatar({
  initials,
  hue,
  name,
  size = 36,
}: {
  initials: string;
  hue: number;
  name: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className="shrink-0 rounded-full"
    >
      <rect width="40" height="40" rx="20" fill={`hsl(${hue} 46% 32%)`} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="700"
        fill="#FBF7F1"
      >
        {initials}
      </text>
    </svg>
  );
}
