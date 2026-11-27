import { Quote, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { ACCENT_TEXT, CAPTION, GHOST_TEXT, INK_CLASS, MUTED_TEXT, PROSE_WIDTH_16 } from "./tokens";

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
      "I ran the simulator before I listed anything. Holding for 7 days instead of taking the first offer was worth more than I expected, and the tree made the trade-off obvious.",
    name: "Priya N.",
    context: "Sold a Sony A7 III",
    initials: "PN",
  },
  {
    id: "t2",
    quote:
      "I almost took the instant cash offer. Clicking into the trade-credit branch and watching the number jump past the cash path changed my mind in about ten seconds.",
    name: "Marcus D.",
    context: "Traded in a lens kit",
    initials: "MD",
  },
  {
    id: "t3",
    quote:
      "Every other resale site makes you commit before it tells you what you'll get. This one shows every branch first, dimmed but visible, so I knew exactly what I was giving up.",
    name: "Elena R.",
    context: "Bought a verified camera body",
    initials: "ER",
  },
];

const STATS = [
  { value: "3", label: "fixed exit paths simulated on every listing before you commit" },
  { value: "6", label: "exact outcomes a two-step path can resolve to" },
  { value: "48k+", label: "trade paths run across repick to date" },
];

export function SocialProof() {
  return (
    <section className="relative border-b border-white/10 px-4 py-20 sm:px-6 lg:px-10" aria-labelledby="proof-heading">
      <Quote aria-hidden="true" className={`pointer-events-none absolute right-6 top-6 h-20 w-20 ${GHOST_TEXT}`} strokeWidth={1} />
      <div className="relative mx-auto max-w-[1440px]">
        <p className={`${CAPTION} ${ACCENT_TEXT}`}>Trusted by sellers and buyers</p>
        <h2
          id="proof-heading"
          className={`mt-2 text-[clamp(1.6rem,6vw,1.9rem)] lg:text-[clamp(1.9rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.01em] ${INK_CLASS}`}
        >
          People who ran their own path first.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06} className="min-w-0">
              <figure className="flex min-w-0 flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center gap-1">
                  <span aria-hidden="true" className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
                    ))}
                  </span>
                  <span className="sr-only">Rated 5 out of 5 stars</span>
                </div>
                <blockquote className={`${PROSE_WIDTH_16} text-sm font-normal leading-[1.6] ${INK_CLASS}`}>
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600/20 text-xs font-semibold text-white">
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className={`block truncate text-sm font-semibold ${INK_CLASS}`}>{t.name}</span>
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
              <p className={`text-3xl font-extrabold tabular-nums ${INK_CLASS}`}>{s.value}</p>
              <p className={`mt-1 text-sm font-normal ${MUTED_TEXT}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
