import type { Metadata } from "next";
import { Activity, Mail } from "lucide-react";
import LockedPanel from "./locked-panel";
import PricingRail from "./pricing-rail";
import ComparisonSection from "./comparison-section";
import FaqAccordion from "./faq-accordion";
import TestimonialCarousel from "./testimonial-carousel";
import { BRAND, cx, FOCUS } from "./data";

export const metadata: Metadata = {
  title: "Ridgeline — Upgrade to keep monitoring",
  description:
    "Ridgeline's Free plan has paused event ingestion at this month's quota. Compare Pro and Team, toggle annual billing, and size a Team seat count to resume immediately.",
};

/**
 * Ridgeline — an in-product "you've hit your limit" paywall for an error/performance monitoring
 * SaaS. The macro-skeleton is a two-pane split rather than a row of pricing cards: a left "why
 * you're blocked" panel (usage proof) sits beside a right subscribe rail that stays visible at rest
 * on desktop and is pulled to the top of the source order on mobile, so price + CTA are on screen
 * without scrolling or touching a single control on any width. A secondary comparison table, FAQ,
 * and testimonial rail sit below the fold for anyone who wants more before committing.
 */
export default function Page() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#rail-heading"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-sky-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-950",
          FOCUS,
        )}
      >
        Skip to plans
      </a>

      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-sky-400" aria-hidden="true" />
            <span
              className="text-base font-semibold tracking-tight text-zinc-50"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              {BRAND}
            </span>
          </div>
          <a
            href="mailto:sales@ridgeline.io"
            aria-label="Talk to sales"
            className={cx(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100",
              FOCUS,
            )}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline" aria-hidden="true">Talk to sales</span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
          <div className="order-2 lg:order-1">
            <LockedPanel />
          </div>
          <div className="order-1 lg:order-2">
            <PricingRail />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-16 border-t border-zinc-800 pt-14 sm:mt-20 sm:gap-20 sm:pt-16">
          <ComparisonSection />
          <FaqAccordion />
          <TestimonialCarousel />
        </div>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-[1400px] px-6 py-8 text-xs font-normal text-zinc-400 sm:px-8 lg:px-10">
          &copy; 2026 {BRAND}, Inc. Prices in USD. Taxes calculated at checkout.
        </div>
      </footer>
    </div>
  );
}
