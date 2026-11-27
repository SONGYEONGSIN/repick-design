import { Shirt, Keyboard, ShoppingBag } from 'lucide-react';
import { COLORS, type IconKey } from './data';

const ICONS: Record<IconKey, typeof Shirt> = {
  jacket: Shirt,
  keyboard: Keyboard,
  bag: ShoppingBag,
};

interface ProductThumbProps {
  iconKey: IconKey;
  title: string;
  category: string;
  /** Smaller icon + tighter padding for the compact hero card. */
  compact?: boolean;
}

/**
 * Generated CSS/SVG placeholder thumbnail — deliberately not a photograph.
 * A broken or slow-loading real photo's fallback alt text free-flows and
 * collides with badge rows; a flat generated mark has no load state to
 * fail. `role="img"` + `aria-label` give it the same accessible contract a
 * real `<img alt>` would, without needing `next/image` for a file that is
 * not actually a bitmap. Fixed aspect-ratio reserved via the aspect-* class
 * so layout never shifts.
 */
export default function ProductThumb({ iconKey, title, category, compact = false }: ProductThumbProps) {
  const Icon = ICONS[iconKey];
  return (
    <div
      role="img"
      aria-label={`${title}, ${category.toLowerCase()} — generated placeholder thumbnail`}
      className={
        compact
          ? 'relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-xl'
          : 'relative flex aspect-[4/3] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl'
      }
      style={{ backgroundColor: COLORS.surfaceLine }}
    >
      <Icon
        aria-hidden="true"
        className={compact ? 'h-6 w-6' : 'h-11 w-11'}
        style={{ color: COLORS.accentTint }}
        strokeWidth={1.5}
      />
    </div>
  );
}
