/**
 * Two brand marks, drawn here because the icon set cannot supply them.
 *
 * `lucide-react` v1 ships 5,975 exports and not one brand glyph — Instagram, Twitter, GitHub and
 * LinkedIn were all removed over trademark concerns, and the `X` it does export is the close icon,
 * not the wordmark. So these are inline.
 *
 * Drawn in lucide's own idiom rather than as the official filled logos: 24px box, 1.5 stroke, round
 * caps and joins, `currentColor`. The rest of this page's icons come from lucide (`MousePointer2`,
 * `ArrowDown`), and a pair of filled brand logos dropped among them reads as pasted-in clip art.
 * Monochrome geometric marks at 18px are legible as the brands and consistent with the page.
 */

const BOX = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function InstagramMark({ className }: { className?: string }) {
  return (
    <svg {...BOX} className={className} aria-hidden focusable="false">
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.25" cy="6.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XMark({ className }: { className?: string }) {
  return (
    <svg {...BOX} className={className} aria-hidden focusable="false">
      <path d="M4.5 4.5 19.5 19.5" />
      <path d="M19.5 4.5 4.5 19.5" />
    </svg>
  );
}
