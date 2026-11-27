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
      "I scrubbed straight to the battery-test frame and saw the exact deduction before I ever opened a dispute. Nothing to argue about — it was already on screen.",
    name: "A. Novak",
    context: "Bought a cellular smartwatch, dispute avoided",
  },
  {
    quote:
      "Turning on human review changed one number, not the whole price. That specificity is what made me trust the rest of the breakdown.",
    name: "S. Ibarra",
    context: "Bought an aluminum smartwatch, escalated check",
  },
  {
    quote:
      "Most sellers give you a final number and a shrug. This gave me five checkpoints and a reason for every dollar between them.",
    name: "K. Fujimoto",
    context: "Bought a cellular smartwatch, Grade B",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.8 / 5", label: "Average buyer rating" },
  { value: "6,700+", label: "Replays viewed before checkout" },
  { value: "31%", label: "Fewer post-sale disputes since launch" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live scrubber state, so nothing here risks citing a number the replay device could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
          Buyers who watched the whole inspection
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
