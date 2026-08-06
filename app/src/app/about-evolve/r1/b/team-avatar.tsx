// Deterministic inline-SVG monogram avatar. No photo files, no remote image service, and no
// nondeterministic randomness — the fill tone and initials are derived purely from the person's
// name so the same person always renders identically on server and client.

const TONES = [
  { fill: "#27272a", label: "zinc-800" }, // zinc-800
  { fill: "#3f3f46", label: "zinc-700" }, // zinc-700
  { fill: "#18181b", label: "zinc-900" }, // zinc-900
] as const;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function MonogramAvatar({
  name,
  size = 56,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const hash = hashString(name);
  const tone = TONES[hash % TONES.length];
  const initials = initialsFor(name);

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={`${name} avatar`}
      className={`shrink-0 rounded-full ${className}`}
    >
      <circle cx="32" cy="32" r="32" fill={tone.fill} />
      <text
        x="32"
        y="33"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize="22"
        fontFamily="var(--font-sans)"
        fontWeight="500"
      >
        {initials}
      </text>
    </svg>
  );
}
