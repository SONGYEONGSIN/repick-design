"use client";

import { ArrowRight } from "lucide-react";
import { LiveProductCard } from "./ProductCard";
import { COLOR, FEATURED_PRODUCT } from "./data";
import type { WaterfallResult } from "./savings-math";

interface HeroProps {
  waterfall: WaterfallResult;
}

/**
 * The live-priced proof card renders inside THIS component's own return statement — not in a
 * sibling section below it — so it is visible with zero scrolling and its price always reflects
 * the current toggle state passed down from LandingPage.
 */
export default function Hero({ waterfall }: HeroProps) {
  const { finalPrice, totalSavings, enabledCount } = waterfall;

  return (
    <section className="border-b border-zinc-200" style={{ backgroundColor: COLOR.bg }}>
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-14 sm:px-6 sm:pt-16 sm:pb-20 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div
            className="min-w-0 lg:col-span-7 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out both" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: COLOR.accentDark }}
            >
              Live pricing, not a banner
            </p>
            <h1
              className="mt-5 text-zinc-900"
              style={{
                fontFamily: "var(--font-display-wide)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.03,
                fontSize: "clamp(2.3rem, 1.85rem + 3vw, 4.5rem)",
              }}
            >
              Your price drops the moment you qualify.
            </h1>
            <p className="mt-6 max-w-[31rem] text-base leading-relaxed" style={{ color: COLOR.muted }}>
              Five conditions, five independent switches. Flip the ones that
              apply to you and a running total falls, step by step, down to
              the number this card actually charges — no separate
              &ldquo;sale&rdquo; banner required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#conditions"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: COLOR.accentDark, outlineColor: COLOR.accentDark }}
              >
                Try the switches
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <p className="text-sm" style={{ color: COLOR.muted }}>
                Right now:{" "}
                <span className="font-semibold tabular-nums text-zinc-900">
                  {`$${finalPrice}`}
                </span>{" "}
                {enabledCount > 0 ? (
                  <>
                    (
                    <span className="font-semibold tabular-nums" style={{ color: COLOR.accentDark }}>
                      {`−$${totalSavings}`}
                    </span>{" "}
                    from {enabledCount} condition{enabledCount === 1 ? "" : "s"})
                  </>
                ) : (
                  "(no conditions on yet)"
                )}
              </p>
            </div>
          </div>

          {/* Mandatory hero-embedded proof card: live match %, condition grade, verification
              badge, and a discount indicator whose price reads straight off the toggle state. */}
          <div
            className="min-w-0 lg:col-span-5 motion-reduce:animate-none"
            style={{ animation: "rise 0.6s ease-out 0.12s both" }}
          >
            <LiveProductCard product={FEATURED_PRODUCT} waterfall={waterfall} variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
