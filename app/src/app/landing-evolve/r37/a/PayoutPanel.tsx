import { CATEGORY_LABELS, COLORS, type Item } from './data';
import { itemLabel, type Estimate } from './estimate-math';

interface PayoutPanelProps {
  item: Item;
  estimate: Estimate;
}

/**
 * The live-computed result of the search device: not a static example, a
 * number recomputed from `item` (whichever result the visitor's search
 * currently has selected) on every render. Sits inside Hero's own markup,
 * directly beside the three comparable cards it was derived from.
 */
export default function PayoutPanel({ item, estimate }: PayoutPanelProps) {
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-2xl p-4"
      style={{ backgroundColor: COLORS.surface, border: `2px solid ${COLORS.accent}` }}
    >
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em]" style={{ color: COLORS.accentTint }}>
        Estimated payout
      </p>

      <p className="tabular-nums text-[30px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
        ${estimate.low}&ndash;${estimate.high}
      </p>

      <p className="text-[13px] font-semibold leading-[1.3]" style={{ color: COLORS.fg }}>
        {itemLabel(item)}
      </p>
      <p className="text-[12px] font-normal" style={{ color: COLORS.muted }}>
        Grade {item.grade} &middot; {CATEGORY_LABELS[item.category]}
      </p>

      <p className="tabular-nums mt-auto text-[12.5px] font-normal leading-[1.5]" style={{ color: COLORS.muted }}>
        From its last comp sale (${item.sold}), adjusted for grade and category demand, minus a{' '}
        <span className="font-semibold" style={{ color: COLORS.fg }}>
          ${estimate.fee}
        </span>{' '}
        platform fee.
      </p>
    </div>
  );
}
