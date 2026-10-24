import { Footprints, Shirt, ShoppingBag } from 'lucide-react';
import { COLORS, type CategoryId } from './data';

const ICONS: Record<CategoryId, typeof Footprints> = {
  sneakers: Footprints,
  outerwear: Shirt,
  bags: ShoppingBag,
};

interface CategoryArtProps {
  category: CategoryId;
}

/**
 * Flat SVG/icon art, not a photo — deliberately so: no network image to
 * fail to load, and no gradient or blueprint/line-art decoration (both
 * banned). The aspect-ratio container is reserved regardless, since the
 * badge row below it must never reflow if this were ever swapped for a
 * real `next/image` photo later.
 */
export default function CategoryArt({ category }: CategoryArtProps) {
  const Icon = ICONS[category];
  return (
    <div
      className="flex aspect-[4/3] w-full items-center justify-center rounded-xl"
      style={{ backgroundColor: COLORS.surface }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: COLORS.accentSoft }}
      >
        <Icon className="h-8 w-8" style={{ color: COLORS.accentDeep }} aria-hidden="true" />
      </div>
    </div>
  );
}
