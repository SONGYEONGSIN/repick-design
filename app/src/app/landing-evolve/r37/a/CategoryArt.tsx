import type { ReactElement } from 'react';
import type { CategoryId } from './data';
import { COLORS } from './data';

interface CategoryArtProps {
  category: CategoryId;
  /** Smaller stroke/size for the compact hero cards. */
  compact?: boolean;
}

/**
 * Generated vector illustration, one simple silhouette per category, built
 * from plain <svg> shapes — deliberately not a photograph. A broken or
 * slow-loading real photo's fallback alt text free-flows and collides with
 * badge rows; a generated mark has no load state to fail at all. Rendered
 * inside a fixed aspect-ratio container with a reserved background color,
 * so layout never shifts on "load".
 */
function Sneaker({ stroke }: { stroke: string }) {
  return (
    <path
      d="M10 40c4-2 8-7 10-13 1.5-4 3-6 6-6 2 0 3 1.5 3 4 0 3-1 5 1 7 2 2 6 2 10 2 5 0 9 2 11 5 1.5 2 1 4-1 5-3 1.5-9 2-17 2H14c-3 0-5-1-5-3 0-2 0.5-3 1-3z"
      fill="none"
      stroke={stroke}
      strokeWidth={2.2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

function Jacket({ stroke }: { stroke: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M22 16l8-4 2 4 2-4 8 4 6 6-4 6-4-3v21H24V25l-4 3-4-6z" />
      <line x1="32" y1="18" x2="32" y2="44" />
    </g>
  );
}

function Bag({ stroke }: { stroke: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M16 24h32l-3 22H19z" />
      <path d="M24 24v-5a8 8 0 0116 0v5" />
      <line x1="16" y1="33" x2="48" y2="33" />
    </g>
  );
}

function Watch({ stroke }: { stroke: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
      <rect x="27" y="10" width="10" height="7" rx="1.5" />
      <rect x="27" y="47" width="10" height="7" rx="1.5" />
      <circle cx="32" cy="32" r="14" />
      <line x1="32" y1="32" x2="32" y2="24" />
      <line x1="32" y1="32" x2="38" y2="34" />
    </g>
  );
}

function Hoodie({ stroke }: { stroke: string }) {
  return (
    <g fill="none" stroke={stroke} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M24 18a8 8 0 0116 0l6 4-3 6-3-2v20H24V26l-3 2-3-6z" />
      <path d="M29 18q3 4 6 0" />
      <circle cx="32" cy="38" r="1.6" fill={stroke} stroke="none" />
    </g>
  );
}

const ART: Record<CategoryId, (p: { stroke: string }) => ReactElement> = {
  sneakers: Sneaker,
  denim: Jacket,
  bags: Bag,
  watches: Watch,
  streetwear: Hoodie,
};

/**
 * One illustrated mark per category, inside the reserved-background square
 * every item thumbnail shares. `role="img"` + `aria-label` give it the same
 * accessible contract a real `<img alt>` would.
 */
export default function CategoryArt({ category, compact = false }: CategoryArtProps) {
  const Art = ART[category];
  return (
    <div
      role="img"
      aria-label={`Generated illustration for the ${category} category`}
      className={
        compact
          ? 'flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-xl'
          : 'flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl'
      }
      style={{ backgroundColor: COLORS.surfaceLine }}
    >
      <svg
        viewBox="0 0 64 64"
        className={compact ? 'h-9 w-9' : 'h-16 w-16'}
        aria-hidden="true"
      >
        <Art stroke={COLORS.accentTint} />
      </svg>
    </div>
  );
}
