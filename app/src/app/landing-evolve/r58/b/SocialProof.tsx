import { Star } from "lucide-react";
import { BORDER, FG, MUTED, PROSE_WIDTH_QUOTE } from "./tokens";

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I added Shield and Resale Lock expecting a discount code. Instead I got a named tier that explained exactly what I was and wasn't covered for.",
    name: "D. Okafor",
    context: "Bought a camera kit, Resale-Ready Shield tier",
  },
  {
    quote:
      "Loss Watch plus Resale Lock turned into a completely different tier than Shield plus Loss Watch. That specificity is why I trusted the number.",
    name: "M. Lindqvist",
    context: "Bought a camera body, Recovery Fast-Track tier",
  },
  {
    quote:
      "The breakdown lists each add-on on its own line. I could see exactly what I was paying for before checkout, not after.",
    name: "R. Tan",
    context: "Bought a lens bundle, Full Coverage tier",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.8 / 5", label: "Average buyer rating" },
  { value: "12,400+", label: "Devices sold with an active add-on tier" },
  { value: "48 hrs", label: "Median time to resolve a Loss Watch claim" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live device state, so nothing here risks citing a number the coverage selector could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Buyers who named their own tier
        </h2>

        <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dt className="text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                {stat.label}
              </dt>
              <dd className="mt-1 text-[26px] font-extrabold tabular-nums tracking-[-0.02em]" style={{ color: FG }}>
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.name}
              className="min-w-0 rounded-2xl p-5"
              style={{ border: `1px solid ${BORDER}` }}
            >
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5" fill="#0369A1" style={{ color: "#0369A1" }} />
                ))}
              </div>
              <span className="sr-only">Rated 5 out of 5 stars</span>
              <blockquote className={`mt-3 text-[14px] font-normal leading-[1.6] ${PROSE_WIDTH_QUOTE}`} style={{ color: FG }}>
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[12.5px] font-normal" style={{ color: MUTED }}>
                <span className="font-semibold" style={{ color: FG }}>
                  {item.name}
                </span>{" "}
                — {item.context}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
