import { LISTINGS } from "./data";
import { computeItemState } from "./model";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { EYEBROW } from "./tokens";

const PREVIEW_ITEMS = LISTINGS.slice(3);

type ProductPreviewSectionProps = {
  scrubDay: number;
};

/**
 * Section 2 -- richer cards for the rest of the catalogue. Still driven by the one shared
 * `scrubDay` state lifted in the client root, so scrolling back up and dragging the Hero's
 * scrubber updates these cards too, not just the Hero's own three.
 */
export function ProductPreviewSection({ scrubDay }: ProductPreviewSectionProps) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="preview-heading">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className={`${EYEBROW} text-[#A1A1AA]`}>product preview</p>
          <h2
            id="preview-heading"
            className="mt-3 max-w-[640px] text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
          >
            More of today&apos;s catalogue, same live clock.
          </h2>
          <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            These listings read off the same Day {scrubDay} you set above -- scroll up and drag
            the timeline to watch every card below move with it.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PREVIEW_ITEMS.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.06} className="min-w-0">
              <ProductCard item={item} state={computeItemState(item, scrubDay)} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
