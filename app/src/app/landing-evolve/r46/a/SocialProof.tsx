import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, PROSE_WIDTH_16 } from "./tokens";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  context: string;
  initials: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I put in the price I paid two years ago and the Good-condition number was higher than I expected. Took thirty seconds.",
    name: "Priya N.",
    context: "Traded in a winter coat",
    initials: "PN",
  },
  {
    id: "t2",
    quote:
      "No back-and-forth with a buyer, no lowball offers in my inbox. The credit on screen was the credit in my account.",
    name: "Marcus D.",
    context: "Traded in two pairs of boots",
    initials: "MD",
  },
  {
    id: "t3",
    quote: "Seeing the condition tiers laid out made it obvious why Fair paid less than Good — not just a smaller number.",
    name: "Elena R.",
    context: "Traded in a camera",
    initials: "ER",
  },
];

const STATS = [
  { value: "92%", label: "of trade-ins priced in under a minute" },
  { value: "4.8/5", label: "average seller rating across repick" },
  { value: "140k+", label: "items re-sold through verified sellers" },
];

export function SocialProof() {
  return (
    <section className="relative border-b border-white/10 px-4 py-24 sm:px-6 lg:px-10" aria-labelledby="proof-heading">
      <Quote
        aria-hidden="true"
        className={`pointer-events-none absolute right-6 top-6 h-24 w-24 ${GHOST_TEXT}`}
        strokeWidth={1}
      />
      <div className="relative mx-auto max-w-[1440px]">
        <p className={`${CAPTION} text-sky-500`}>Trusted by sellers</p>
        <h2 id="proof-heading" className={`${DISPLAY} mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-[#F5F5F7]`}>
          People who already checked what theirs was worth.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="min-w-0">
              <figure className="flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-[#15151C] p-6">
                <div className="flex items-center gap-1">
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-sky-500 text-sky-500" />
                    ))}
                  </span>
                  <span className="sr-only">Rated 5 out of 5 stars</span>
                </div>
                <blockquote className={`${PROSE_WIDTH_16} text-base font-normal leading-[1.6] text-[#F5F5F7]`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-xs font-semibold text-sky-300">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[#F5F5F7]">{t.name}</span>
                    <span className={`block truncate text-xs font-normal ${MUTED_TEXT}`}>{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-[#F5F5F7]`}>{s.value}</p>
              <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
