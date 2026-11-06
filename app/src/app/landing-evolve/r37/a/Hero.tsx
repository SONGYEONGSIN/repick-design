import { ArrowUpRight } from 'lucide-react';
import SearchCombobox from './SearchCombobox';
import PayoutPanel from './PayoutPanel';
import ComparableCard from './ComparableCard';
import { COLORS, type Item } from './data';
import { itemLabel, type Estimate } from './estimate-math';

interface HeroProps {
  selected: Item;
  estimate: Estimate;
  comparables: Item[];
  onSelect: (item: Item) => void;
}

const COMP_CAPTIONS = [
  'Closest comp by price to your search.',
  'Second-closest comp, same category.',
  'Third comp, same category, for context.',
];

/**
 * Hero carries the headline, the single primary CTA, the search device, AND
 * the full live result block — all inside this one component's own return.
 * `selected`/`estimate`/`comparables` are never read from a static field:
 * they are recomputed in LandingPage from whichever item the visitor's
 * search currently has selected, so this grid is the mandatory proof, not a
 * fixed preview pinned to one example item.
 */
export default function Hero({ selected, estimate, comparables, onSelect }: HeroProps) {
  return (
    <section className="mx-auto max-w-[1280px] px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      <div className="flex max-w-[780px] flex-col gap-5">
        <span className="text-[13px] font-semibold uppercase tracking-[0.28em]" style={{ color: COLORS.accentTint }}>
          Instant payout estimate
        </span>

        <h1
          className="text-[clamp(2.25rem,9vw,3rem)] font-extrabold leading-[1.04] tracking-[-0.02em] lg:text-[clamp(3rem,5vw,4.75rem)]"
          style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
        >
          Your comp sets the price.
          <br />
          Your grade sets the range.
        </h1>

        <p className="max-w-[500px] text-[16px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
          Search any item below. Repick pulls its most recent comparable sale, applies its
          condition grade and category demand, and computes a live payout range &mdash; not a
          guess.
        </p>

        <div>
          <a
            href="#final-cta"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: COLORS.accentFill, outlineColor: COLORS.accentTint }}
          >
            List your item
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        className="mt-10 rounded-3xl p-5 sm:p-6"
        style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}
      >
        <SearchCombobox initialQuery={itemLabel(selected)} onSelect={onSelect} />

        <p className="sr-only" role="status" aria-live="polite">
          Estimated payout ${estimate.low} to ${estimate.high} for {itemLabel(selected)}, based on {comparables.length} comparable sales.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PayoutPanel item={selected} estimate={estimate} />
          {comparables.map((comp, index) => (
            <ComparableCard
              key={comp.id}
              item={comp}
              priceGap={Math.abs(comp.sold - selected.sold)}
              variant="compact"
              caption={COMP_CAPTIONS[index] ?? 'Comp, same category.'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
