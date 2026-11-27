import { Star } from "lucide-react";
import { ACCENT, BORDER, FG, MUTED, PROSE_WIDTH_QUOTE } from "./tokens";

const displayFace = { fontFamily: "var(--font-display-wide)" };

interface Testimonial {
  quote: string;
  name: string;
  context: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I picked 'laptop' expecting one price. Instead I got a question about the screen, and the two numbers that came out of it were honest about why they were different.",
    name: "A. Besson",
    context: "Traded in a laptop with minor marks",
  },
  {
    quote:
      "Switching to 'can wait' showed me the marketplace number was worth the extra few days. I wouldn't have known that without seeing both side by side.",
    name: "T. Ngo",
    context: "Traded in a phone, battery weak",
  },
  {
    quote:
      "Dead headphones still got me a real number instead of a shrug. The tree made it obvious why it was that low.",
    name: "S. Okoye",
    context: "Recycled a pair of dead headphones",
  },
];

const STATS: { value: string; label: string }[] = [
  { value: "4.8 / 5", label: "Average trade-in rating" },
  { value: "11,400+", label: "Triage paths completed" },
  { value: "38%", label: "Sellers who switch to 'can wait'" },
];

/**
 * Static proof — stats and testimonials are fixed sample content, deliberately not wired to the
 * live Triage Tree state, so nothing here risks citing a number the device could change.
 */
export function SocialProof() {
  return (
    <section id="proof" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ ...displayFace, color: FG }}>
          Sellers who walked the tree
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
