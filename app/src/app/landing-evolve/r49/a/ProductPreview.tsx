import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { LISTINGS, PREVIEW_IDS } from "./data";
import { HEADLINE_FONT, MUTED_TEXT } from "./tokens";

const PREVIEW_LISTINGS = PREVIEW_IDS.map(
  (id) => LISTINGS.find((listing) => listing.id === id)!,
);

/**
 * Section 2: rich product preview cards — one per category, drawn from the same
 * fixed comp set the hero search device matches against, fully graded and verified
 * already. This section stays constant regardless of what's typed above (it's the
 * standalone proof-of-catalog section); Section 3 below is where the live search
 * state visibly changes the numbers.
 *
 * Intro paragraph width: 14px body text -> 0.44 * 14 = 6.16px/char ->
 * max-w-[430px] -> 430 / 6.16 ≈ 69.8 chars/line.
 */
export default function ProductPreview() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2
          className="max-w-[460px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-white sm:text-[30px]"
          style={HEADLINE_FONT}
        >
          Already graded, matched and verified
        </h2>
        <p className={`mt-2 max-w-[430px] text-[14px] font-normal leading-[1.5] ${MUTED_TEXT}`}>
          Every listing in our comp set carries the same four checks your search
          results show — this is three of the eight it&apos;s drawn from.
        </p>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PREVIEW_LISTINGS.map((listing, i) => (
          <Reveal key={listing.id} delay={i * 0.08} className="min-w-0">
            <ProductCard listing={listing} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
