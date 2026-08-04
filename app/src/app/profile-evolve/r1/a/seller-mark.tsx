import { hashString } from "./visual-hash";

/**
 * Generated seller avatar — a rose/zinc gradient monogram, not a stock or third-party photo.
 * A public seller-profile mock has no real photo to license honestly, and a fabricated "person"
 * photo reads as an impersonation risk; a generated mark sidesteps that while still giving the
 * header a strong identity anchor. Deterministic (hashString has no randomness), so it's stable
 * across server and client renders.
 */
export default function SellerMark({ seed, initials, className }: { seed: string; initials: string; className?: string }) {
  const h = hashString(seed);
  const hue = h % 360;
  const hue2 = (hue + 26) % 360;

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`${initials} seller mark`} className={className}>
      <defs>
        <linearGradient id="seller-mark-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue} 72% 42%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 60% 22%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#seller-mark-grad)" />
      <g opacity="0.16" stroke="#ffffff" strokeWidth="2">
        <line x1="0" y1="34" x2="100" y2="34" />
        <line x1="0" y1="66" x2="100" y2="66" />
        <line x1="34" y1="0" x2="34" y2="100" />
        <line x1="66" y1="0" x2="66" y2="100" />
      </g>
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fontWeight="600"
        fill="rgba(255,255,255,0.96)"
      >
        {initials}
      </text>
    </svg>
  );
}
