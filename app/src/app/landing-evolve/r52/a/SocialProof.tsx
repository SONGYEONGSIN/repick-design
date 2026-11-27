import { Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { EYEBROW, FIG_CAPTION, SURFACE_BORDER } from "./tokens";

// Fixed, generic trust signals -- deliberately NOT wired to the scrubber. Labelled plainly as a
// snapshot so this section never implies every number on the page is live (only the ones in the
// Hero / Value sections, which genuinely are, make that claim).
const TESTIMONIALS = [
  {
    quote:
      "I listed my camera gear and watched the match score creep up over two weeks exactly like the model said it would. Sold on day 11.",
    name: "Priya N.",
    role: "Seller, camera & lenses",
  },
  {
    quote:
      "The grade and verification badges meant I didn't have to ask the seller a single follow-up question before buying.",
    name: "Devon R.",
    role: "Buyer, outerwear",
  },
  {
    quote:
      "Repricing used to be a guess. Now I just check what day it is in the listing's life and trust the number.",
    name: "Marisol T.",
    role: "Seller, watches",
  },
];

const TRUST_MARKS = ["Ship Protect", "Verified Sellers Network", "BuyerGuard", "ConditionCheck"];

export function SocialProof() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="proof-heading">
      <div className="mx-auto max-w-[1320px]">
        <Reveal>
          <p className={`${EYEBROW} text-[#A1A1AA]`}>as of this snapshot</p>
          <h2
            id="proof-heading"
            className="mt-3 max-w-[640px] text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
          >
            People trust the number because the number has been right before.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.06} className="min-w-0">
              <figure
                className="flex h-full min-w-0 flex-col gap-4 rounded-2xl p-6"
                style={{ backgroundColor: "#13131A", border: `1px solid ${SURFACE_BORDER}` }}
              >
                <div className="flex gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-3.5 w-3.5" color="#F59E0B" fill="#F59E0B" />
                  ))}
                </div>
                <blockquote className="text-[15px] font-normal leading-[1.6] text-[#D4D4D8]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className={`${FIG_CAPTION} mt-auto text-[#A1A1AA]`}>
                  {item.name} · {item.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <p className={`${FIG_CAPTION} mb-4 text-[#A1A1AA]`}>Protections on every match</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {TRUST_MARKS.map((mark) => (
              <li key={mark} className="text-[14px] font-semibold tracking-[-0.01em] text-[#D4D4D8]">
                {mark}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
