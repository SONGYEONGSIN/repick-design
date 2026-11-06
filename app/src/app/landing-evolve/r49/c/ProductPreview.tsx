import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { PRODUCT_ITEMS, type CoverageResult } from "./data";
import { CAPTION, EYEBROW, HEADLINE_FONT, MUTED_TEXT } from "./tokens";

export function ProductPreview({ coverage }: { coverage: CoverageResult }) {
  return (
    <section id="preview" className="border-t border-[#E7E3E3] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <p className={`${EYEBROW} text-[#BE123C]`}>What&rsquo;s moving right now</p>
          <h2 style={HEADLINE_FONT} className="mt-3 max-w-[560px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#171717] sm:text-4xl">
            Every listing already knows which points will take it.
          </h2>
          <p className={`mt-3 max-w-[492px] text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
            The match tag, the grade, the seller badge, and the discount are fixed per item. The
            &ldquo;accepted near you&rdquo; line underneath is not &mdash; it reads the same point you picked above.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PRODUCT_ITEMS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.08} className="h-full min-w-0">
              <ProductCard item={item} coverage={coverage} />
            </Reveal>
          ))}
        </div>

        <p className={`mt-4 ${CAPTION} ${MUTED_TEXT}`}>Fig. 01 — coverage recalculates per selected point, not per item</p>
      </div>
    </section>
  );
}
