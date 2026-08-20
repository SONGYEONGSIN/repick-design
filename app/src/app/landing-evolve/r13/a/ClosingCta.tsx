import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { cx, EYEBROW, FOCUS, STAT, NUM } from "./data";

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

/**
 * Closing CTA — deliberately NOT a centered band. An asymmetric bordered panel: the headline and
 * single action sit left, a compact "your starting profile" readout sits right, so the page ends on
 * the same left-aligned, evidence-forward footing it opened on rather than a generic pitch card.
 */
export default function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="bg-[#0B0B0F] py-24 md:py-28">
      <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 items-center gap-10 rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className={cx(EYEBROW, "text-[#fbbf24]")}>Your rack is waiting</p>
              <h2
                id="closing-title"
                style={GROTESK}
                className="mt-4 max-w-[560px] text-[clamp(1.8rem,4.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.015em] text-white"
              >
                Set the axes that matter. Let the overlap do the picking.
              </h2>
              <p className="mt-4 max-w-[440px] text-base font-normal leading-[1.6] text-[#A1A1AA]">
                No star ratings, no guesswork — one polygon you control and a
                ranking that redraws the moment you change your mind.
              </p>
              <a
                href="#hero"
                className={cx(
                  "mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#b45309] px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#96450a]",
                  FOCUS,
                )}
              >
                Browse matches
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </div>

            <div className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-8">
              <p className={cx(STAT, "text-[#A1A1AA]")}>Your starting profile</p>
              <dl className="mt-4 flex flex-col gap-3">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-[#A1A1AA]">Axes weighed</dt>
                  <dd className="text-sm font-semibold text-white">Price · Condition · Authenticity</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-sm font-normal text-[#A1A1AA]">Demand level</dt>
                  <dd className="text-sm font-semibold text-white">Balanced</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-sm font-normal text-[#A1A1AA]">Top match now</dt>
                  <dd className={cx(NUM, "text-lg font-extrabold text-[#fbbf24]")}>96%</dd>
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
