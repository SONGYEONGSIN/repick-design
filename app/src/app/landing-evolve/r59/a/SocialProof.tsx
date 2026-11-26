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
      "I dropped it to Grade B before buying and saw exactly what that meant — scratches, yes, but battery still above 80%. No surprises at the door.",
    name: "J. Reyes",
    context: "Bought an ultrabook, Grade B",
  },
  {
    quote:
      "The accessories toggle is the detail that sold me. It didn't just add a flat fee — it explained why the resale number moved the way it did.",
    name: "N. Park",
    context: "Bought a touchscreen ultrabook, Grade A+",
  },
  {
    quote:
      "Most sites show one grade and one price. Here I could see all four at once and pick the band I was actually comfortable with.",
    name: "T. Bergmann",
    context: "Bought an ultrabook, Grade A",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.9 / 5", label: "Average buyer rating" },
  { value: "9,100+", label: "Devices graded this way" },
  { value: "<2%", label: "Buyers disputing their grade on arrival" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live ladder state, so nothing here risks citing a number the grade selector could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Buyers who picked their own rung
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
