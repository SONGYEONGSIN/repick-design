import { ShieldCheck, ShieldOff } from 'lucide-react';
import CategoryArt from './CategoryArt';
import { CATEGORY_LABELS, COLORS, type Item } from './data';
import { discountPercent } from './estimate-math';

interface ComparableCardProps {
  item: Item;
  /** Dollar gap between this comp's sold price and the selected item's sold price. */
  priceGap: number;
  /** 'compact' fits three cards inside the hero above the fold; 'expanded' is the fuller card used in Product Preview. */
  variant: 'compact' | 'expanded';
  caption: string;
}

/**
 * One comparable-sold-listing card. Badges (grade, authentication, price
 * gap) sit in a row BELOW the illustration, never as an absolute overlay on
 * top of it — so a failed image render can never collide with badge text.
 * The illustration container reserves a fixed aspect-ratio background, so
 * nothing shifts on "load".
 */
export default function ComparableCard({ item, priceGap, variant, caption }: ComparableCardProps) {
  const discount = discountPercent(item);
  const compact = variant === 'compact';

  return (
    <article
      className={compact ? 'flex h-full flex-col gap-2.5 rounded-2xl p-3' : 'flex h-full flex-col gap-3 rounded-2xl p-4'}
      style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
    >
      <CategoryArt category={item.category} compact={compact} />

      <div className="flex flex-col gap-0.5">
        <p className={compact ? 'text-[13px] font-semibold leading-[1.3]' : 'text-[15px] font-semibold leading-[1.3]'} style={{ color: COLORS.fg }}>
          {item.brand} {item.title}
        </p>
        <p className="text-[12px] font-normal" style={{ color: COLORS.muted }}>
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
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{
            color: item.verified ? COLORS.accentTint : COLORS.muted,
            border: `1px solid ${COLORS.surfaceLine}`,
          }}
        >
          {item.verified ? <ShieldCheck className="h-3 w-3" aria-hidden="true" /> : <ShieldOff className="h-3 w-3" aria-hidden="true" />}
          {item.verified ? 'AI-authenticated' : 'Unverified'}
        </span>
        <span
          className="tabular-nums rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: COLORS.accentFill }}
        >
          ${priceGap} price gap
        </span>
      </div>

      <p className="tabular-nums text-[12px] font-normal" style={{ color: COLORS.muted }}>
        <span className="line-through">${item.retail}</span>{' '}
        <span className="font-semibold" style={{ color: COLORS.fg }}>
          ${item.sold}
        </span>{' '}
        ({discount}% off retail)
      </p>

      {!compact && (
        <p className="mt-auto text-[12.5px] font-normal leading-[1.5]" style={{ color: COLORS.muted }}>
          {caption}
        </p>
      )}
    </article>
  );
}
