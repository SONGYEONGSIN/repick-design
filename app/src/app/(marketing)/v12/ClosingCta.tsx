import { ArrowRight } from "lucide-react";
import { DISPLAY, FOCUS_RING, NUM, cx } from "./data";

/**
 * Closing CTA band. No separate stat-strip section — the one number this band needs is woven
 * straight into the supporting copy instead of getting its own dedicated row.
 */
export default function ClosingCta() {
  return (
    <section id="cta" aria-labelledby="cta-title" className="scroll-mt-24 border-t border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16 sm:px-6 md:px-8 md:py-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
              Start here
            </p>
            <h2
              id="cta-title"
              style={DISPLAY}
              className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.01em] text-white"
            >
              Toggle the layers. Then trust the verdict.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[48ch] text-base font-normal leading-[1.6] text-[#A1A1AA]">
              Every one of tonight&rsquo;s{" "}
              <span className={cx("font-semibold text-white", NUM)}>1,200+</span> inspected
              listings ships with the same three layers, on by default and switchable by you.
            </p>
            <a
              href="#picks"
              className={cx(
                "mt-6 inline-flex items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none",
                FOCUS_RING,
              )}
            >
              Browse inspected listings
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <p className="mt-3 text-xs font-normal uppercase tracking-[0.16em] text-[#A1A1AA]">
              Free to browse — no account needed
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
