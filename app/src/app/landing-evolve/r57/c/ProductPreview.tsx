import ListingCard from "./ListingCard";
import { LISTINGS } from "./data";
import { BODY_14, Eyebrow, Reveal, SectionFolio } from "./ui";

/**
 * Product preview section. Deliberately NOT wired to the persona control above -- these four
 * listings and their badges show buyer-facing proof of what sold, which doesn't change when a
 * visitor is exploring the seller-side timeline. Said explicitly in the caption below the heading.
 */
export default function ProductPreview() {
  return (
    <section id="preview" className="border-b border-zinc-800 px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px]">
        <Reveal>
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <Eyebrow>Recently sold</Eyebrow>
              <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] font-bold tracking-[-0.02em] text-zinc-50">
                What a graded listing actually proves.
              </h2>
              <p className={`mt-4 ${BODY_14}`}>
                Fixed snapshot, not persona-driven — these four badges (match, condition, verification,
                discount) sit the same way no matter which seller persona is selected above.
              </p>
            </div>
            <SectionFolio n="02" />
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((listing, i) => (
            <Reveal key={listing.id} delay={i * 0.06} className="min-w-0">
              <ListingCard listing={listing} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
