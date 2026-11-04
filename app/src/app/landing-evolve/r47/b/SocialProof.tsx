import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { CAPTION, DISPLAY, GHOST_TEXT, MUTED_TEXT, PROSE_WIDTH_16, ACCENT_TEXT } from "./tokens";

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
      "I flagged the damage check on my own camera before I even listed it — the price range dropped right in front of me. That's a more honest number than any appraisal I've gotten.",
    name: "Priya N.",
    context: "Sold a Sony a7 III",
    initials: "PN",
  },
  {
    id: "t2",
    quote:
      "Buyers kept asking me to prove the serial number was real. Now it's just a checkpoint on the listing page, already confirmed before anyone asks.",
    name: "Marcus D.",
    context: "Sells cameras and lenses",
    initials: "MD",
  },
  {
    id: "t3",
    quote:
      "Watching the grade move from B to A as the functional test came back was the first time a resale site actually showed its work.",
    name: "Elena R.",
    context: "Bought a verified lens",
    initials: "ER",
  },
];

const STATS = [
  { value: "4/4", label: "fixed checkpoints run on every listing, no exceptions" },
  { value: "94%", label: "of flagged checkpoints caught something a photo alone missed" },
  { value: "48k+", label: "verification runs completed across repick" },
];

export function SocialProof() {
  return (
    <section className="relative border-b border-zinc-200 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="proof-heading">
      <Quote aria-hidden="true" className={`pointer-events-none absolute right-6 top-6 h-20 w-20 ${GHOST_TEXT}`} strokeWidth={1} />
      <div className="relative mx-auto max-w-[1440px]">
        <p className={`${CAPTION} ${ACCENT_TEXT}`}>Trusted by sellers and buyers</p>
        <h2 id="proof-heading" className={`${DISPLAY} mt-2 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] text-zinc-900`}>
          People who already ran the deck.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="min-w-0">
              <figure className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-1">
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </span>
                  <span className="sr-only">Rated 5 out of 5 stars</span>
                </div>
                <blockquote className={`${PROSE_WIDTH_16} text-sm font-normal leading-[1.6] text-zinc-900`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-zinc-900">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-zinc-900">{t.name}</span>
                    <span className={`block truncate text-xs font-normal ${MUTED_TEXT}`}>{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 border-t border-zinc-200 pt-10 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="min-w-0">
              <p className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-zinc-900`}>{s.value}</p>
              <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
