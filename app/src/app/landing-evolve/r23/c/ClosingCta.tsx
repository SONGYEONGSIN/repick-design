import { ArrowRight } from "lucide-react";
import { LAB_ITEM, type Verdict } from "./data";
import { ACCENT, cx, DISPLAY_FONT, FOCUS, NUM } from "./tokens";

interface ClosingCtaProps {
  price: number;
  probability: number;
  days: number;
  verdict: Verdict;
}

/** The typed price from Price Lab carries all the way here — nothing resets between sections.
 * Whatever a visitor last typed is exactly what this summary and its CTA describe. */
export function ClosingCta({ price, probability, days, verdict }: ClosingCtaProps) {
  return (
    <section className="bg-[#0B0B0F] px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-[820px] text-left">
        <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.28em" }}>
          Fig. 06 &mdash; Ready to list
        </p>
        <h2
          className="mt-5 text-white"
          style={{ ...DISPLAY_FONT, letterSpacing: "-0.02em", fontSize: "clamp(2rem, 2.6vw + 1.4rem, 3.25rem)", lineHeight: 1.05 }}
        >
          List it at the price you typed.
        </h2>

        <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
          At <span className={cx("font-semibold text-white", NUM)}>${price}</span> for {LAB_ITEM.shortLabel}, repick
          projects a <span className={cx("font-semibold text-white", NUM)}>{probability}%</span> chance of selling within{" "}
          <span className={cx("font-semibold text-white", NUM)}>{days}</span> days &mdash;{" "}
          <span className="font-semibold text-white">{verdict.label.toLowerCase()}</span> for this item. Change the number in
          Price Lab any time; this summary always reflects your latest figure.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#price-lab"
            className={cx(
              "inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              FOCUS,
            )}
            style={{ backgroundColor: ACCENT }}
          >
            <span className={NUM}>List at ${price}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <span className="text-[13px] font-normal text-zinc-400">Free to list. Buyers see your evidence, not just your ask.</span>
        </div>
      </div>
    </section>
  );
}
