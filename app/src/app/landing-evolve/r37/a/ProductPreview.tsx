'use client';

import Reveal from './Reveal';
import ComparableCard from './ComparableCard';
import { COLORS, type Item } from './data';

interface ProductPreviewProps {
  selected: Item;
  comparables: Item[];
}

const COMP_CAPTIONS = [
  'The nearest recent sale to your search by price.',
  'A second sale from the same category, slightly further off.',
  'A third sale, included for a wider sense of the range.',
];

/**
 * The expanded view of the same three comps shown compactly in Hero &mdash;
 * larger card, same live data, same sort order. This section never holds
 * its own copy of the catalog: it receives `comparables` as a prop and
 * renders whatever LandingPage currently computed for the visitor's
 * selection.
 */
export default function ProductPreview({ selected, comparables }: ProductPreviewProps) {
  return (
    <section id="comps" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-8 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Closest sales to your search, not an average.
          </h2>
          <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
            Search a different item above and this row swaps to its own closest comps, with the
            same grade and authentication detail on every card.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {comparables.map((comp, index) => (
          <Reveal key={comp.id} delay={index * 0.08}>
            <ComparableCard
              item={comp}
              priceGap={Math.abs(comp.sold - selected.sold)}
              variant="expanded"
              caption={COMP_CAPTIONS[index] ?? 'Comp, same category.'}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
