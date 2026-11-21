import { Quote, ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

const TESTIMONIALS = [
  {
    quote:
      "I put Speed first since I needed a body before a shoot. FOCAL explained exactly why it skipped the cheaper kit.",
    name: "M. Alvarez",
    detail: "6 trades · verified buyer",
  },
  {
    quote:
      "Ranking Trust above Price meant the pick cost more, but the reasoning line made that trade-off obvious upfront.",
    name: "J. Okonkwo",
    detail: "3 trades · verified buyer",
  },
  {
    quote:
      "The grade and discount badges matched the camera exactly when it arrived. No surprises at pickup.",
    name: "R. Lindqvist",
    detail: "11 trades · verified buyer",
  },
];

/**
 * Section 4. A fixed set of past-trade quotes — unlike every other section
 * on this route, this panel is a static snapshot and does not change when
 * the rank order above changes.
 */
export default function SocialProof() {
  return (
    <section id="social-proof" aria-labelledby="social-proof-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex items-baseline justify-between gap-3">
          <h2
            id="social-proof-heading"
            className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl"
          >
            Trusted by ranked buyers
          </h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            04
          </span>
        </div>
        <p className="mt-2 max-w-[480px] text-base leading-[1.6] text-zinc-400">
          A fixed set of past-trade quotes. Unlike the sections above, this
          panel does not change when you reorder your priorities.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.name} delay={index * 0.08} className="min-w-0">
              <figure className="h-full min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <Quote className="h-6 w-6 text-zinc-400" aria-hidden="true" />
                <blockquote className="mt-3 text-sm leading-[1.6] text-zinc-200">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" aria-hidden="true" />
                  <span className="font-semibold text-zinc-300">{t.name}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
