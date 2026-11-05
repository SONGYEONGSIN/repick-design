import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { PRODUCTS } from "./product-data";
import { ACCENT_TEXT, CAPTION, INK_CLASS, MUTED_TEXT, PROSE_WIDTH_16 } from "./tokens";

export function ProductPreview() {
  return (
    <section id="catalog" className="border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="catalog-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-3">
          <p className={`${CAPTION} ${ACCENT_TEXT}`}>More from your trade-in budget</p>
          <h2
            id="catalog-heading"
            className={`text-[clamp(1.6rem,6vw,1.9rem)] lg:text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] ${INK_CLASS}`}
          >
            Four listings your estimated payout could cover.
          </h2>
          <p className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
            Every card already carries a match score, a condition grade, a seller verification
            and the discount from its original price. Open the reasoning on any card to see
            exactly what the AI checked.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 3) * 0.05} className="min-w-0">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
