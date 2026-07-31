/**
 * Attune's mark — three tuning rails with their knobs at different settings.
 *
 * Deliberately *not* a version of the reference's mark: that one is a quartered disc, and copying
 * a logo is the one thing on this page that is not fair game to measure and match. What is matched
 * is the *slot* it occupies — a compact glyph sitting immediately left of the wordmark at roughly
 * the wordmark's cap height, which is the lockup convention the reference uses.
 *
 * The three rails are the same figure the scene opens on (`tuningGlyph` in `shapes.ts`), so the
 * brand and the field share one idea rather than each inventing their own.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M3 6h18M3 12h18M3 18h18" />
      {/* Knobs sit at different settings — the mark reads as something tuned, not a hamburger. */}
      <circle cx="8" cy="6" r="2.6" fill="#8052FF" stroke="none" />
      <circle cx="16" cy="12" r="2.6" fill="#8052FF" stroke="none" />
      <circle cx="6.5" cy="18" r="2.6" fill="#8052FF" stroke="none" />
    </svg>
  );
}
