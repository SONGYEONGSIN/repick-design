import { Star } from "lucide-react";
import { ACCENT, BORDER, FG, MUTED, PROSE_WIDTH_QUOTE } from "./tokens";

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I turned off cosmetic grading to see how much it actually mattered. Four points. That specificity is what made the other 96 feel earned.",
    name: "P. Adeyemi",
    context: "Bought a runner, size 10, Grade A",
  },
  {
    quote:
      "Strict mode isn't just a stricter number — it's a different number for a different reason. Functional testing carrying more weight made sense for what I was buying.",
    name: "L. Marchetti",
    context: "Bought a deadstock pair, strict mode",
  },
  {
    quote:
      "Most trust scores are one number with no way to ask why. This one answers that question before you even have to ask it.",
    name: "C. Osei",
    context: "Bought a runner, size 10, Grade B",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.9 / 5", label: "Average buyer rating" },
  { value: "14,200+", label: "Breakdowns viewed before checkout" },
  { value: "22%", label: "Buyers who switch to Strict mode" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live breakdown state, so nothing here risks citing a number the toggle device could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Buyers who checked the math
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
