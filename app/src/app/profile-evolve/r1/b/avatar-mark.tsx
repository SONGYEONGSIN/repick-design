/**
 * Deterministic identity mark — stands in for a profile photo without fetching one.
 *
 * The catalog route's `brand-tile.tsx` made the same call for integration cards: a stock photo
 * from a third-party host reads as a placeholder nobody replaced, and it is a network dependency
 * on first paint besides. That reasoning applies just as hard to a solo maintainer's avatar — a
 * generic stock face would be a worse signal of "real person" than a crisp initials mark, and it
 * keeps this route at zero raster images: no `next/image` remote host needed, no CLS risk if a
 * request stalls. Hash the handle, not the display name, so the mark is stable even if a
 * maintainer's name string changes later.
 */

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/u).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AvatarMark({
  handle,
  name,
  className,
}: {
  handle: string;
  name: string;
  className?: string;
}) {
  const h = hash(handle);
  // Warm range only (18–42deg) so every mark reads as part of this route's amber family rather
  // than an arbitrary hue — variety comes from angle and the secondary stop, not the base hue.
  const hue = 18 + (h % 24);
  const angle = (h >> 6) % 360;
  const gradId = `avatar-${handle}`;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${name}'s avatar`}
      className={className}
    >
      <defs>
        <linearGradient id={gradId} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={`hsl(${hue} 70% 42%)`} />
          <stop offset="100%" stopColor={`hsl(${(hue + 20) % 360} 62% 22%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill={`url(#${gradId})`} />
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="20.5"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fontWeight="600"
        fill="rgba(255,255,255,0.96)"
      >
        {initials(name)}
      </text>
    </svg>
  );
}
