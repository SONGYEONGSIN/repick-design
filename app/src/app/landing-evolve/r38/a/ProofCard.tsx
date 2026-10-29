import { ShieldCheck, UserCheck } from 'lucide-react';
import CategoryArt from './CategoryArt';
import { CATEGORY_LABELS, COLORS, discountPercent, type PreviewItem } from './data';
import { TIERS } from './ladder-math';

interface ProofCardProps {
  item: PreviewItem;
  /** 'compact' fits three cards inside the hero above the fold; 'expanded' is the fuller card used in Product Preview. */
  variant: 'compact' | 'expanded';
}

/**
 * One example listing card. Badges (grade, AI match, certification,
 * discount) sit in a row BELOW the art box, never as an absolute overlay
 * on top of it, so nothing can ever collide illegibly on a slow or failed
 * render — the art container itself reserves a fixed aspect ratio and a
 * background color regardless.
 */
export default function ProofCard({ item, variant }: ProofCardProps) {
  const discount = discountPercent(item);
  const compact = variant === 'compact';
  const CertIcon = item.cert === 'human' ? UserCheck : ShieldCheck;
  const soldTier = TIERS[item.tierIndex];

  return (
    <article
      className={compact ? 'flex h-full flex-col gap-2 rounded-2xl p-3' : 'flex h-full flex-col gap-3 rounded-2xl p-4'}
      style={{ backgroundColor: '#FFFFFF', border: `1px solid ${COLORS.surfaceLine}` }}
    >
      <CategoryArt category={item.category} />

      <div className="flex flex-col gap-0.5">
        <p className={compact ? 'text-[13px] font-semibold leading-[1.3]' : 'text-[15px] font-semibold leading-[1.3]'} style={{ color: COLORS.fg }}>
          {item.brand} {item.title}
        </p>
        <p className="text-[12px] font-normal" style={{ color: COLORS.mutedOnBg }}>
          {CATEGORY_LABELS[item.category]}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ color: COLORS.fg, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          Grade {item.grade}
        </span>
        <span
          className="tabular-nums rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ color: COLORS.accentDeep, backgroundColor: COLORS.accentSoft }}
        >
          {item.matchPercent}% AI match
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ color: COLORS.mutedOnSurface, border: `1px solid ${COLORS.surfaceLine}` }}
        >
          <CertIcon className="h-3 w-3" aria-hidden="true" />
          {item.cert === 'human' ? 'Human-reviewed' : 'AI-authenticated'}
        </span>
      </div>

      <p className="tabular-nums text-[12px] font-normal" style={{ color: COLORS.mutedOnBg }}>
        <span className="line-through">${item.retail}</span>{' '}
        <span className="font-semibold" style={{ color: COLORS.fg }}>
          ${item.sold}
        </span>{' '}
        ({discount}% off retail)
      </p>

      {!compact && (
        <p className="tabular-nums mt-auto text-[12.5px] font-normal leading-[1.5]" style={{ color: COLORS.mutedOnBg }}>
          Sold at <span className="font-semibold" style={{ color: COLORS.fg }}>{soldTier.name}</span> — {soldTier.daysToSell} days to sell.
        </p>
      )}
    </article>
  );
}
