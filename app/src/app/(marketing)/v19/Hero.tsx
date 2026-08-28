import { ArrowRight } from "lucide-react";
import CategoryFilters from "./CategoryFilters";
import RedlineCard from "./RedlineCard";
import ListingCard from "./ListingCard";
import { DISPLAY_FONT, OTHER_LISTINGS, type Category } from "./data";

/**
 * Hero + first-fold product preview. Left column (5/12) carries the headline, subhead, the
 * category-filter control and the live trust-score readout; right column (7/12) carries the
 * redlined listing. All three other listing cards render directly below, so the "product + proof
 * visible without scrolling" beat holds without a separate below-the-fold section for it.
 */
export default function Hero({
  active,
  onToggle,
  trust,
  correctionsVisible,
  correctionsTotal,
}: {
  active: ReadonlySet<Category>;
  onToggle: (category: Category) => void;
  trust: number;
  correctionsVisible: number;
  correctionsTotal: number;
}) {
  return (
    <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <p className="text-[15px] font-bold tracking-[-0.02em] text-zinc-900">repick</p>
        <p className="hidden text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500 sm:block">
          AI-verified marketplace
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-x-10 gap-y-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#0369a1]">
            Every listing, tracked
          </p>
          {/* clamp(): extreme scale contrast against the 17px subhead and 15px body copy below. */}
          <h1
            style={{
              ...DISPLAY_FONT,
              fontSize: "clamp(2.5rem, 1.7rem + 3.6vw, 5.5rem)",
              lineHeight: 1.02,
            }}
            className="mt-3 font-bold tracking-[-0.02em] text-zinc-900"
          >
            We read the listing.
            <br />
            Then we correct it.
          </h1>
          <p className="mt-6 max-w-[480px] text-[17px] leading-[1.6] text-zinc-600">
            repick checks every seller claim against photos and comparable sales, then marks it up
            like a tracked-changes review — condition, authenticity and price, corrected before you
            ever message a seller.
          </p>

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
              Filter what repick checked
            </p>
            <div className="mt-3">
              <CategoryFilters active={active} onToggle={onToggle} />
            </div>
          </div>

          <div
            aria-live="polite"
            className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3"
          >
            <span className="tracking-[0.12em] tabular-nums text-[28px] font-bold text-zinc-900">
              {trust}
              <span className="text-[15px] font-medium text-zinc-500">/100</span>
            </span>
            <span className="text-[13px] text-zinc-600">
              trust score ·{" "}
              <span className="tabular-nums font-medium text-zinc-700">
                {correctionsVisible} of {correctionsTotal}
              </span>{" "}
              corrections shown
            </span>
          </div>

          <a
            href="#top"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0369a1] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#075985] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1] active:scale-[0.98]"
          >
            Browse verified listings
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="lg:col-span-7">
          {/* Placed here, not before the grid, so DOM order stays h1 → h2 → h3s (this h2 sits
              between the h1 in the left column and the redline card's h3 that follows it). */}
          <h2 className="sr-only">Verified listings</h2>
          <RedlineCard active={active} />
        </div>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {OTHER_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
