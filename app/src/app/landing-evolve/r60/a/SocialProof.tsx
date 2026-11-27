import { Star } from "lucide-react";
import { ACCENT, BORDER, FG, MUTED, PROSE_WIDTH_QUOTE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-grotesk)" };

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I dragged the dial out to day 90 just to see the number drop. That's when I actually believed the day-45 peak was real and not just a sales pitch.",
    name: "R. Okafor",
    context: "Sold a flagship phone at day 41",
  },
  {
    quote:
      "Turning the certificate on moved the whole curve, not just my payout. Seeing the shape change is what made the premium feel earned.",
    name: "M. Lindqvist",
    context: "Sold with the verified condition certificate",
  },
  {
    quote:
      "Most trade-in estimators give you one number today. This one showed me I was two weeks early, and told me by how much.",
    name: "D. Fennimore",
    context: "Waited 18 more days after checking",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.8 / 5", label: "Average seller rating" },
  { value: "9,600+", label: "Dial sessions before listing" },
  { value: "31%", label: "Sellers who wait for the peak window" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live Timing Dial state, so nothing here risks citing a number the device could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ ...displayFace, color: FG }}>
          Sellers who checked the curve
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
            <figure key={item.name} className="min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5" fill={ACCENT} style={{ color: ACCENT }} />
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
