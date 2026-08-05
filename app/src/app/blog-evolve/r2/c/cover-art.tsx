// app/src/app/blog-evolve/r2/c/cover-art.tsx
//
// Generated cover tile — no remote image host of any kind (page-brief-core §4's `no-random-image-
// host` rule and its `auto-blog-r1/c` failure note: a picsum load failure let alt text overflow its
// fixed box into the headline next to it). Deterministic SVG has nothing to fetch, so it cannot fail
// to load, mismatch between server and client, or need a reserved-but-empty box.
//
// The motif is a riveted structural beam — a nod to "Keelson", the beam bolted the length of a
// ship's hull to reinforce the keel end to end, which is the brand's own metaphor for a release
// spine. A gradient plate carries a horizontal beam line with evenly spaced rivets (their count and
// spacing vary slightly by seed, not their position on an ascending curve), and the release type's
// icon sits bottom-right the same way across every tile.
import type { LucideIcon } from "lucide-react";
import { hashString, round2 } from "./utils";

function rivets(seed: number, count: number): number[] {
  const xs: number[] = [];
  for (let i = 0; i < count; i++) {
    const base = 10 + (i / (count - 1)) * 80;
    const jitter = ((seed * (i + 5)) % 7) - 3; // -3..3
    xs.push(round2(Math.min(94, Math.max(6, base + jitter))));
  }
  return xs;
}

export default function CoverArt({
  seedKey,
  hue,
  icon: Icon,
  title,
  className = "",
}: {
  seedKey: string;
  hue: number;
  icon: LucideIcon;
  title: string;
  className?: string;
}) {
  const seed = hashString(seedKey);
  const hue2 = (hue + 18) % 360;
  const gradId = `beam-grad-${seed}`;
  const count = 5 + (seed % 3); // 5..7 rivets
  const xs = rivets(seed, count);
  const beamY = round2(46 + ((seed % 9) - 4) * 0.6); // 43.6..48.4

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ backgroundColor: `hsl(${hue} 38% 23%)` }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 48% 30%)`} />
            <stop offset="100%" stopColor={`hsl(${hue2} 40% 17%)`} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${gradId})`} />
        <line x1="4" y1={beamY} x2="96" y2={beamY} stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={beamY} r="2.4" fill={`hsl(${hue} 20% 92%)`} stroke="rgba(0,0,0,0.18)" strokeWidth="0.6" />
        ))}
      </svg>
      <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4">
        <Icon aria-hidden="true" strokeWidth={1.6} className="h-6 w-6 text-white/40 sm:h-7 sm:w-7" />
      </div>
      <span className="sr-only">{title} — release cover illustration</span>
    </div>
  );
}
