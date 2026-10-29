import { ACCENT_FILL } from "./theme";

/**
 * Flat, simple geometric illustrations (no raster images, no remote image
 * hosts) — trapezoid/arc/rect shapes in a two-tone gray with exactly one
 * accent stroke each, so a failed/slow load never leaves a broken-image
 * icon colliding with badge text. Every container that renders these
 * reserves a fixed `aspect-ratio` + background color ahead of paint.
 */
export default function ItemArt({ id, className }: { id: string; className?: string }) {
  if (id === "boots") {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration of a pair of leather boots">
        <rect x="18" y="40" width="70" height="90" rx="10" fill="#D4D4D8" />
        <path d="M18 112 L18 150 Q18 162 32 162 L98 162 Q106 162 104 150 L88 118 Z" fill="#A1A1AA" />
        <rect x="112" y="40" width="70" height="90" rx="10" fill="#D4D4D8" />
        <path d="M112 112 L112 150 Q112 162 126 162 L192 162 Q200 162 198 150 L182 118 Z" fill="#A1A1AA" />
        <path d="M30 55 L76 55 M30 70 L76 70 M30 85 L76 85" stroke={ACCENT_FILL} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (id === "watch") {
    return (
      <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration of a dive watch face">
        <rect x="75" y="10" width="50" height="34" rx="6" fill="#D4D4D8" />
        <rect x="75" y="156" width="50" height="34" rx="6" fill="#D4D4D8" />
        <circle cx="100" cy="100" r="66" fill="#E4E4E7" />
        <circle cx="100" cy="100" r="50" fill="#F4F4F5" stroke="#A1A1AA" strokeWidth="3" />
        <line x1="100" y1="100" x2="100" y2="64" stroke="#3F3F46" strokeWidth="4" strokeLinecap="round" />
        <line x1="100" y1="100" x2="128" y2="112" stroke={ACCENT_FILL} strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill="#3F3F46" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Illustration of a fleece jacket">
      <path
        d="M70 24 L130 24 L150 44 L182 60 L170 92 L148 82 L148 176 Q148 184 140 184 L60 184 Q52 184 52 176 L52 82 L30 92 L18 60 L50 44 Z"
        fill="#D4D4D8"
      />
      <path d="M100 24 L116 44 L100 58 L84 44 Z" fill="#A1A1AA" />
      <line x1="100" y1="58" x2="100" y2="178" stroke={ACCENT_FILL} strokeWidth="3" strokeDasharray="6 5" />
    </svg>
  );
}
