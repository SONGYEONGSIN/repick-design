import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { PRODUCTS } from "./product-data";
import { CAPTION, DISPLAY, MUTED_TEXT, PROSE_WIDTH_16, ACCENT_TEXT } from "./tokens";

export function ProductPreview() {
  return (
    <section id="catalog" className="border-b border-zinc-200 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="catalog-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-3">
          <p className={`${CAPTION} ${ACCENT_TEXT}`}>The full catalog</p>
          <h2 id="catalog-heading" className={`${DISPLAY} text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-zinc-900`}>
            Four more listings, four more deck runs.
          </h2>
          <p className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
            Every card below already carries a match score, a condition grade, a seller
            verification and the discount from its original price. Open the reasoning on any
            card to see exactly what the AI checked.
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
