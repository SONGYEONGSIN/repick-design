import type { LucideIcon } from "lucide-react";
import { hashString } from "./visual-hash";

/**
 * Generated listing art — a per-slug gradient tile with the category icon centred over it, in place
 * of a stock photograph. Keeps every image container's aspect-ratio and background fully reserved
 * with zero network dependency (see page-brief-core §4): nothing to fail to load, nothing to be a
 * random unrelated photo (the catalog's `brand-tile.tsx` documents that exact failure mode with
 * picsum.photos on this same codebase).
 */
export default function ListingArt({ slug, title, icon: Icon }: { slug: string; title: string; icon: LucideIcon }) {
  const h = hashString(slug);
  const hue = h % 360;
  const hue2 = (hue + 44) % 360;
  const gradId = `listing-art-${slug}`;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-800">
      <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 46% 24%)`} />
            <stop offset="100%" stopColor={`hsl(${hue2} 40% 12%)`} />
          </linearGradient>
        </defs>
        <rect width="100" height="75" fill={`url(#${gradId})`} />
        <g opacity="0.14" stroke="#ffffff" strokeWidth="1">
          <line x1="0" y1="25" x2="100" y2="25" />
          <line x1="0" y1="50" x2="100" y2="50" />
          <line x1="25" y1="0" x2="25" y2="75" />
          <line x1="50" y1="0" x2="50" y2="75" />
          <line x1="75" y1="0" x2="75" y2="75" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon aria-hidden="true" strokeWidth={1.4} className="h-9 w-9 text-white/80 sm:h-10 sm:w-10" />
      </div>
      <span className="sr-only">{title} — product photo placeholder</span>
    </div>
  );
}
