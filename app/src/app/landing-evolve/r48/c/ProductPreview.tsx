import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { CATEGORY_LABEL, PRODUCT_ITEMS, type WindowStats, windowLabel } from "./data";
import { CAPTION, MUTED_TEXT } from "./tokens";

export function ProductPreview({ start, end, stats }: { start: number; end: number; stats: WindowStats }) {
  return (
    <section id="preview" className="border-t border-[#E4E4E7] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className={`${CAPTION} ${MUTED_TEXT}`}>Currently on repick · {CATEGORY_LABEL}</p>
            <h2 className="mt-3 max-w-[480px] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#09090B] sm:text-4xl">
              Three listings, priced for {windowLabel(start, end).toLowerCase()}.
            </h2>
          </div>
          <p className={`max-w-[320px] text-sm font-normal leading-[1.6] ${MUTED_TEXT}`}>
            Each card&rsquo;s &ldquo;typically sells in&rdquo; line reads the same {stats.avgDays}-day average
            as the chart above — scroll back up and move the window to change it here too.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_ITEMS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06} className="h-full min-w-0">
              <ProductCard item={item} avgDays={stats.avgDays} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
