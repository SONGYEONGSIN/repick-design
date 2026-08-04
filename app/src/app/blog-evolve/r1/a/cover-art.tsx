// app/src/app/blog-evolve/r1/a/cover-art.tsx
//
// Generated cover art in place of stock photography. `page-brief-core` §4 requires every image
// container to reserve a fixed aspect-ratio and background colour so a failed/slow remote load
// never collapses layout — the simplest way to guarantee that is to have nothing to fetch at all.
// This codebase has hit the alternative twice already (see `catalog/brand-tile.tsx`'s note on
// `picsum.photos` serving unrelated stock photos, and `profile-evolve/r1/a/listing-art.tsx`): a
// deterministic per-post SVG is immune to both the network dependency and the "random photo on a
// serious page" problem, and it renders identically on server and client with zero hydration risk.
//
// The motif is a small ascending line-and-dot chart, which reads as "analytics company" without
// literally depicting a dashboard. Point coordinates are plain arithmetic (no trig), still rounded
// to 2 decimals per the SVG-coordinate rule.
import type { LucideIcon } from "lucide-react";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Six deterministic points per seed, gently ascending left to right with seed-driven jitter. */
function sparkPoints(seed: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const x = round2((i / 5) * 100);
    const jitter = ((seed * (i + 3)) % 17) - 8; // -8..8
    const base = 78 - i * 11; // ascends toward the top-right
    const y = round2(Math.min(88, Math.max(8, base + jitter)));
    pts.push({ x, y });
  }
  return pts;
}

export default function CoverArt({
  seed,
  hue,
  icon: Icon,
  title,
  className = "",
}: {
  seed: number;
  hue: number;
  icon: LucideIcon;
  title: string;
  className?: string;
}) {
  const hue2 = (hue + 26) % 360;
  const gradId = `cover-grad-${seed}`;
  const points = sparkPoints(seed);
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${className}`}
      style={{ backgroundColor: `hsl(${hue} 42% 22%)` }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 52% 30%)`} />
            <stop offset="100%" stopColor={`hsl(${hue2} 46% 16%)`} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gradId})`} />
        <path d={linePath} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.8" fill="rgba(255,255,255,0.85)" />
        ))}
      </svg>
      <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4">
        <Icon aria-hidden="true" strokeWidth={1.5} className="h-7 w-7 text-white/35 sm:h-9 sm:w-9" />
      </div>
      <span className="sr-only">{title} — cover illustration</span>
    </div>
  );
}
