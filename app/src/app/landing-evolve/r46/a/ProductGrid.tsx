import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { PRODUCTS, formatUsd } from "./data";
import { CAPTION, DISPLAY, MUTED_TEXT, PROSE_WIDTH_16 } from "./tokens";

interface ProductGridProps {
  credit: number;
  conditionLabel: string;
}

export function ProductGrid({ credit, conditionLabel }: ProductGridProps) {
  const unlockedCount = PRODUCTS.filter((p) => p.price <= credit).length;

  return (
    <section id="catalog" className="border-b border-white/10 px-4 py-24 sm:px-6 lg:px-10" aria-labelledby="catalog-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col gap-3">
          <p className={`${CAPTION} text-sky-500`}>The full catalog</p>
          <h2 id="catalog-heading" className={`${DISPLAY} text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-[#F5F5F7]`}>
            Six real listings, the same credit you set above.
          </h2>
          <p className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
            Every card below carries the same four checks — match, grade, seller, and discount —
            and every lock state moves with the calculator in the hero, not a fixed example.
          </p>
          <p className="text-sm font-semibold tabular-nums text-[#F5F5F7]">
            {unlockedCount} of {PRODUCTS.length} items within your {formatUsd(credit)} {conditionLabel.toLowerCase()} credit right now.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 3) * 0.05} className="min-w-0">
              <ProductCard product={p} credit={credit} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
