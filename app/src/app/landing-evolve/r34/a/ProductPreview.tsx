'use client';

import Reveal from './Reveal';
import ProductCard from './ProductCard';
import { COLORS, type Product } from './data';
import type { ChipId, Ranked } from './reorder-math';

interface ProductPreviewProps {
  ranked: Ranked<Product>[];
  leadChipId: ChipId;
}

/**
 * The expanded view of the same live data shown compactly in Hero — full
 * card with the AI-match-reasoning line, condition grade, verification
 * badge and before/after discount. Same `ranked` prop, same sort order;
 * this section never holds its own copy of the catalog.
 */
export default function ProductPreview({ ranked, leadChipId }: ProductPreviewProps) {
  return (
    <section id="catalog" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-8 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-mono)', color: COLORS.fg }}
          >
            The full case for each listing, not just its rank.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            Scroll back up and reorder a priority — every card here, including the
            reasoning line, updates with it.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map(({ product, match, rank }, i) => (
          <Reveal key={product.id} delay={i * 0.08}>
            <ProductCard product={product} match={match} rank={rank} leadChipId={leadChipId} variant="expanded" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
