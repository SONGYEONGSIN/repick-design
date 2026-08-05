// app/src/app/blog-evolve/r2/a/cover-tile.tsx
//
// Deterministic generated cover art, in place of stock photography. Same rationale as the r1/a and
// r1/b candidates before it: `page-brief-core` §4 requires image containers to reserve a fixed
// aspect-ratio and background colour, and `no-random-image-host` bans picsum/loremflickr/unsplash-
// source style services outright after `auto-blog-r1/c`'s alt-text overflow. A hash-seeded inline SVG
// has no network dependency, so there is nothing that can fail to load or arrive off-topic — it
// renders identically on server and client with zero hydration risk.
//
// Coordinates are plain arithmetic, rounded to 2 decimals per the SVG-coordinate rule.
import type { LucideIcon } from "lucide-react";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Five deterministic points, seed-driven, tracing a gentle path — reads as "a route through
 *  something" without depicting a literal chart, which suits a series-of-parts motif better than
 *  the ascending-line-chart motif already used elsewhere in this catalogue. */
function routePoints(seed: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 5; i++) {
    const x = round2((i / 4) * 100);
    const wobble = ((seed * (i + 2)) % 23) - 11; // -11..11
    const y = round2(Math.min(86, Math.max(14, 50 + wobble)));
    pts.push({ x, y });
  }
  return pts;
}

export default function CoverTile({
  seed,
  hue,
  icon: Icon,
  size = 48,
  className = "",
}: {
  seed: number;
  hue: number;
  icon: LucideIcon;
  /** Purely decorative — the accessible name for what this tile illustrates belongs to the
   *  surrounding interactive element (tab, row) instead, so this component takes no label prop. */
  size?: number;
  className?: string;
}) {
  const hue2 = (hue + 22) % 360;
  const gradId = `tile-grad-${seed}`;
  const points = routePoints(seed);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl ${className}`}
      style={{ width: size, height: size, backgroundColor: `hsl(${hue} 45% 24%)` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 55% 32%)`} />
            <stop offset="100%" stopColor={`hsl(${hue2} 48% 18%)`} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gradId})`} />
        <path d={path} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 3.6 : 2.1} fill="rgba(255,255,255,0.8)" />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon aria-hidden="true" strokeWidth={1.75} className="h-1/2 w-1/2 text-white/85" />
      </div>
    </div>
  );
}
