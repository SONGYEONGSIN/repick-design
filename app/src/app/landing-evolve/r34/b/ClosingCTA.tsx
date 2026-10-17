import { ArrowRight } from "lucide-react";
import { COLOR, FEATURED_PRODUCT } from "./data";
import { RETAIL_PRICE, describeActiveToggles, type ToggleState, type WaterfallResult } from "./savings-math";
import Reveal from "./Reveal";

interface ClosingCTAProps {
  toggles: ToggleState;
  waterfall: WaterfallResult;
}

/**
 * Cites the CURRENT live final price and discount total — never a static number — so the
 * page's closing move reflects what the visitor actually configured above, not dead markup.
 */
export default function ClosingCTA({ toggles, waterfall }: ClosingCTAProps) {
  const { finalPrice, totalSavings, retailDiscountPct, enabledCount } = waterfall;
  const activeDescription = describeActiveToggles(toggles);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <div
            className="rounded-3xl border border-zinc-200 p-8 sm:p-12"
            style={{ backgroundColor: COLOR.bg }}
          >
          <div className="max-w-[31rem]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: COLOR.accentDark }}
            >
              Check out at this price
            </p>
            <h2
              className="mt-4 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-wide)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
                fontSize: "clamp(1.75rem, 1.4rem + 1.6vw, 2.75rem)",
              }}
            >
              {enabledCount > 0
                ? `Lock in $${finalPrice} — you've earned it.`
                : `This listing starts at $${finalPrice}.`}
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLOR.muted }}>
              With {activeDescription} switched on, the {FEATURED_PRODUCT.name}{" "}
              now rings up at{" "}
              <span className="font-semibold tabular-nums text-zinc-900">{`$${finalPrice}`}</span>
              {enabledCount > 0 && (
                <>
                  {" "}
                  &mdash;{" "}
                  <span className="font-semibold tabular-nums" style={{ color: COLOR.accentDark }}>
                    {`$${totalSavings} off`}
                  </span>{" "}
                  the listing price
                </>
              )}
              , or{" "}
              <span className="font-semibold tabular-nums" style={{ color: COLOR.accentDark }}>
                {`${retailDiscountPct}%`}
              </span>{" "}
              under its <span className="tabular-nums">{`$${RETAIL_PRICE}`}</span> retail price.
            </p>
            <a
              href="#conditions"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ backgroundColor: COLOR.accentDark, outlineColor: COLOR.accentDark }}
            >
              {`Buy it now for $${finalPrice}`}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
