// app/src/app/blog-evolve/r2/c/avatar.tsx
//
// Hash-seeded monogram avatar — same rationale as cover-art.tsx: nothing fetched, so nothing to fail
// or mismatch. Hue is derived from the author's name, not chosen per person, so it stays stable if
// an author is renamed in copy without needing a lookup table kept in sync.
import { hashString, initialsOf } from "./utils";

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const seed = hashString(name);
  const hue = seed % 360;
  const initials = initialsOf(name);

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      role="img"
      aria-label={name}
      className="shrink-0 rounded-full"
    >
      <rect width="40" height="40" rx="20" fill={`hsl(${hue} 42% 34%)`} />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="14"
        fontWeight="700"
        fill="#ffffff"
      >
        {initials}
      </text>
    </svg>
  );
}
