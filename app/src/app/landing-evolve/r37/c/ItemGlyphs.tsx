/**
 * Small flat/geometric icon-style illustrations for the product-preview
 * cards — same restrained, non-photorealistic language as the hero's
 * sneaker, just simpler since these are thumbnail-scale. Each is a
 * self-contained `<svg>`, no photo, no remote asset.
 */
import type { ReactNode } from "react";

function GlyphFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" className="h-12 w-12" aria-hidden="true">
      {children}
    </svg>
  );
}

export function JacketGlyph() {
  return (
    <GlyphFrame>
      <path
        d="M30,20 L42,14 L50,22 L58,14 L70,20 L78,34 L68,40 L68,82 L32,82 L32,40 L22,34 Z"
        fill="#3F3F46"
        stroke="#52525B"
        strokeWidth="2"
      />
      <path d="M50,22 L46,82" stroke="#27272A" strokeWidth="2" />
      <circle cx="48" cy="40" r="2.6" fill="#34D399" />
      <circle cx="48" cy="54" r="2.6" fill="#34D399" />
      <circle cx="48" cy="68" r="2.6" fill="#34D399" />
    </GlyphFrame>
  );
}

export function BagGlyph() {
  return (
    <GlyphFrame>
      <path d="M38,34 C38,22 62,22 62,34" fill="none" stroke="#52525B" strokeWidth="4" strokeLinecap="round" />
      <rect x="26" y="34" width="48" height="46" rx="6" fill="#3F3F46" stroke="#52525B" strokeWidth="2" />
      <path d="M26,50 L74,50" stroke="#27272A" strokeWidth="2" />
      <rect x="44" y="44" width="12" height="9" rx="2" fill="#34D399" />
    </GlyphFrame>
  );
}

export function WatchGlyph() {
  return (
    <GlyphFrame>
      <path d="M40,18 L60,18 L58,34 L42,34 Z" fill="#3F3F46" stroke="#52525B" strokeWidth="2" />
      <path d="M40,82 L60,82 L58,66 L42,66 Z" fill="#3F3F46" stroke="#52525B" strokeWidth="2" />
      <circle cx="50" cy="50" r="19" fill="#27272A" stroke="#52525B" strokeWidth="2.5" />
      <line x1="50" y1="50" x2="50" y2="38" stroke="#D4D4D8" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="59" y2="54" stroke="#D4D4D8" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="50" cy="50" r="2.2" fill="#34D399" />
    </GlyphFrame>
  );
}

export function SneakerGlyph() {
  return (
    <GlyphFrame>
      <path
        d="M16,66 C16,60 22,57 30,57 L68,57 C76,57 83,61 84,67 C85,73 79,76 70,76 L20,76 C16,76 16,70 16,66 Z"
        fill="#27272A"
        stroke="#3F3F46"
        strokeWidth="2"
      />
      <path
        d="M24,58 C22,42 26,30 36,24 C44,20 54,22 58,28 C66,30 76,38 80,50 C82,54 82,58 78,58 Z"
        fill="#3F3F46"
        stroke="#52525B"
        strokeWidth="2"
      />
      <path d="M48,46 C56,40 64,38 72,42" fill="none" stroke="#34D399" strokeWidth="3.4" strokeLinecap="round" />
    </GlyphFrame>
  );
}
