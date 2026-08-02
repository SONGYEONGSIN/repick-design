/**
 * Deterministic brand tile — an integration's stand-in mark.
 *
 * The round shipped these cards against `picsum.photos`, which put an unrelated stock photograph on
 * every app: moss on a CRM sync, wooden planks on double-entry bookkeeping, a foggy cliff on custom
 * dashboards. A marketplace card carries the app's *mark* — a photo there reads as a placeholder
 * nobody came back to replace. It was a network dependency too: 27 cards against a third-party host
 * left the grid sitting grey for seconds on first paint, one image in at a time.
 *
 * Everything here is derived from the slug — hue, the split angle, the glyph, the monogram — so the
 * same integration always gets the same tile and nothing is fetched. That also keeps it inside the
 * page's determinism rule: no clock, no randomness, identical across renders and hydration.
 */

/**
 * FNV-1a over the slug. Any stable string hash would do; this one is short, has no dependencies,
 * and spreads adjacent slugs ("bookwise"/"bookflow") into visibly different hues.
 */
function hash(slug: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Initials: two letters for hyphenated/compound slugs, one otherwise — the app-icon convention. */
function monogram(name: string): string {
  const words = name.trim().split(/[\s-]+/u).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 1).toUpperCase();
}

/**
 * Four background motifs, picked by hash — enough that a screenful of tiles doesn't read as one
 * repeated shape.
 *
 * Deliberately oversized and pushed off the top-left corner rather than centred: a stroked outline
 * sitting concentric behind the monogram reads as a *containing* shape, and the triangle version of
 * that is a hazard sign with a letter in it. Bleeding off an edge makes it texture instead.
 */
function glyph(kind: number): React.ReactElement {
  switch (kind) {
    case 0:
      return <circle cx="18" cy="20" r="46" fill="none" stroke="currentColor" strokeWidth="9" />;
    case 1:
      return <rect x="-24" y="-22" width="86" height="86" rx="18" fill="none" stroke="currentColor" strokeWidth="9" />;
    case 2:
      return <path d="M16 -22 L70 62 H-38 Z" fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />;
    default:
      return <path d="M20 -26 L68 22 L20 70 L-28 22 Z" fill="none" stroke="currentColor" strokeWidth="9" strokeLinejoin="round" />;
  }
}

export default function BrandTile({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const h = hash(slug);
  const hue = h % 360;
  // Second hue sits a fifth of the wheel away: related enough to read as one brand, far enough that
  // the split is visible at 80px.
  const hue2 = (hue + 72) % 360;
  const angle = 25 + ((h >> 9) % 4) * 30;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${name} logo`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bt-${slug}`} gradientTransform={`rotate(${angle} 0.5 0.5)`}>
          <stop offset="0%" stopColor={`hsl(${hue} 62% 46%)`} />
          <stop offset="100%" stopColor={`hsl(${hue2} 58% 30%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#bt-${slug})`} />
      <g color="rgba(255,255,255,0.22)">{glyph(h % 4)}</g>
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="38"
        fontWeight="700"
        fill="rgba(255,255,255,0.96)"
      >
        {monogram(name)}
      </text>
    </svg>
  );
}
