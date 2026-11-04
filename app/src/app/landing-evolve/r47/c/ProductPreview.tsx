import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { PRODUCTS } from "./data";

/**
 * Section 2: rich product preview cards (electronics, sneakers, furniture — the
 * same categories the Allocation Flow batch above is drawn from).
 */
export default function ProductPreview() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="max-w-[460px] text-[26px] font-extrabold leading-[1.2] tracking-[-0.01em] text-[#171717] sm:text-[30px]">
          Already graded, matched and priced
        </h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {PRODUCTS.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.08} className="min-w-0">
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
