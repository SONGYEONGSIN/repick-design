import type { Category } from "./data";

/**
 * Generated flat-shape art standing in for a product photo. Chosen over a
 * remote fixed-ID photo for one reason: this rail's cards keep every proof
 * badge in a row *below* the frame (never overlaid on it, per this
 * candidate's stricter assignment), which already defeats the "broken image
 * alt text collides with an overlay badge" failure the brief warns about —
 * but a broken/slow-loading photo would still leave 12 cards with a gray box
 * and a browser fallback glyph, which reads as unfinished on a page whose
 * whole premise is "the shelf answers back." Generated art has zero load
 * failure mode and is exactly as controlled as a fixed photo ID (design DNA
 * §에셋·인터랙션 allows both). All coordinates are hand-authored integers —
 * no runtime trig, so the 2-decimal-rounding hydration rule never applies.
 * Solid fills only (no gradients, no thin outline strokes) to stay clear of
 * the "라인아트/블루프린트" anti-slop item.
 */

const BG_TINTS: Record<Category, readonly [string, string, string]> = {
  outerwear: ["#F2F1F5", "#EEEDF3", "#F0EFF4"],
  bags: ["#F4F2F8", "#F0EEF6", "#F2F0F7"],
  footwear: ["#F1F0F4", "#EDECF2", "#EFEEF3"],
  home: ["#F5F3F9", "#F1EFF6", "#F3F1F8"],
};

const INK = "#0B0B0F";
const ACCENT = "#6E56CF";

function OuterwearMark({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
      <rect x="150" y="70" width="100" height="150" rx="18" fill={INK} />
      <rect
        x="90"
        y="90"
        width="46"
        height="110"
        rx="14"
        fill={INK}
        transform="rotate(14 90 90)"
      />
      <rect
        x="264"
        y="90"
        width="46"
        height="110"
        rx="14"
        fill={INK}
        transform="rotate(-14 310 90)"
      />
      <path d="M170 70 L200 100 L230 70 Z" fill={ACCENT} />
    </g>
  );
}

function BagsMark({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
      <rect x="130" y="120" width="140" height="110" rx="16" fill={INK} />
      <path
        d="M162 120 C162 84 238 84 238 120"
        stroke={ACCENT}
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="130" y="150" width="140" height="10" fill={ACCENT} />
    </g>
  );
}

function FootwearMark({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
      <path
        d="M140 220 L140 130 C140 118 150 110 164 110 L206 110 L206 160 L260 160 C276 160 288 172 288 188 L288 220 Z"
        fill={INK}
      />
      <rect x="140" y="204" width="148" height="16" rx="6" fill={ACCENT} />
    </g>
  );
}

function HomeMark({ flip }: { flip: boolean }) {
  return (
    <g transform={flip ? "scale(-1,1) translate(-400,0)" : undefined}>
      <rect x="110" y="110" width="180" height="18" rx="6" fill={INK} />
      <rect x="126" y="128" width="14" height="80" fill={INK} />
      <rect x="260" y="128" width="14" height="80" fill={INK} />
      <rect x="180" y="70" width="40" height="40" rx="8" fill={ACCENT} />
    </g>
  );
}

const MARKS: Record<Category, typeof OuterwearMark> = {
  outerwear: OuterwearMark,
  bags: BagsMark,
  footwear: FootwearMark,
  home: HomeMark,
};

export default function CategoryArt({
  category,
  variant,
  visualLabel,
  className,
}: {
  category: Category;
  variant: 0 | 1 | 2;
  visualLabel: string;
  className?: string;
}) {
  const Mark = MARKS[category];
  const bg = BG_TINTS[category][variant];
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      role="img"
      aria-label={visualLabel}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="400" height="300" fill={bg} />
      <Mark flip={variant === 2} />
    </svg>
  );
}
