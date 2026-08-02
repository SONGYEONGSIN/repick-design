"use client";

import { useState } from "react";
import {
  AudioLines,
  Check,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import {
  BRAND,
  BUNDLES,
  FINISHES,
  FOCUS,
  PRODUCT_NAME,
  RATING_SUMMARY,
  SKU_LINE,
  cx,
  usd,
  type BundleId,
  type FinishId,
} from "./data";
import Gallery from "./gallery";
import SpecAccordion from "./spec-accordion";
import CompareTable from "./compare-table";
import ReviewsPanel from "./reviews-panel";
import SectionNav from "./section-nav";

const DISPLAY_FONT = { fontFamily: "var(--font-display-grotesk)" };

const TRUST_ROW = [
  { icon: Truck, text: "Free shipping over $200" },
  { icon: ShieldCheck, text: "2-year limited warranty" },
  { icon: PackageCheck, text: "30-day return window" },
];

export default function ProductClient() {
  const [finishId, setFinishId] = useState<FinishId>("graphite");
  const [bundleId, setBundleId] = useState<BundleId>("solo");
  const [added, setAdded] = useState(false);

  const finish = FINISHES.find((f) => f.id === finishId) ?? FINISHES[0];
  const bundle = BUNDLES.find((b) => b.id === bundleId) ?? BUNDLES[0];

  function handleAddToCart() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#overview"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-orange-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to product overview
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#overview" className={cx("flex flex-none items-center gap-2", FOCUS)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
              <AudioLines className="h-4.5 w-4.5 text-orange-700" aria-hidden="true" />
            </span>
            <span style={DISPLAY_FONT} className="text-base font-semibold tracking-tight text-zinc-900">
              {BRAND}
            </span>
          </a>

          <nav aria-label="Product sections" className="hidden flex-1 items-center gap-6 pl-6 lg:flex">
            <a href="#specs" className={cx("text-sm font-normal text-zinc-600 hover:text-zinc-900", FOCUS)}>
              Specifications
            </a>
            <a href="#compare" className={cx("text-sm font-normal text-zinc-600 hover:text-zinc-900", FOCUS)}>
              Compare tiers
            </a>
            <a href="#reviews" className={cx("text-sm font-normal text-zinc-600 hover:text-zinc-900", FOCUS)}>
              Reviews
            </a>
          </nav>

          <div className="ml-auto flex flex-none items-center gap-3">
            <span className="hidden text-sm font-semibold text-zinc-900 tabular-nums sm:inline">{usd(bundle.price)}</span>
            <button
              type="button"
              onClick={handleAddToCart}
              className={cx(
                "inline-flex items-center gap-2 rounded-lg bg-orange-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-800",
                FOCUS,
              )}
            >
              {added ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4 flex-none" aria-hidden="true" />}
              <span className="hidden sm:inline">{added ? "Added" : "Add to cart"}</span>
            </button>
          </div>
        </div>
      </header>

      <div aria-live="polite" className="sr-only">
        {added ? `Added ${PRODUCT_NAME} — ${bundle.label}, ${finish.label} finish — to cart.` : ""}
      </div>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-16 px-4 py-10 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:py-14">
        <div className="min-w-0 flex-1">
          {/* ---------------------------------------------------------------- Overview */}
          <section id="overview" aria-label="Overview" className="scroll-mt-24">
            <p className="text-sm font-normal text-orange-700">{SKU_LINE}</p>
            <h1 style={DISPLAY_FONT} className="mt-1.5 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              {PRODUCT_NAME}
            </h1>
            <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-zinc-600">
              A bus-powered USB-C interface built around Class-A discrete preamps and a milled
              aluminum chassis — quiet enough for vocal tracking, small enough to live in a bag.
            </p>

            <a href="#reviews" className={cx("mt-4 inline-flex items-center gap-2 rounded", FOCUS)}>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cx(
                      "h-4 w-4",
                      n <= Math.round(RATING_SUMMARY.average) ? "fill-orange-600 text-orange-600" : "fill-zinc-200 text-zinc-200",
                    )}
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-zinc-900 tabular-nums">{RATING_SUMMARY.average.toFixed(1)}</span>
              <span className="text-sm font-normal text-zinc-600 tabular-nums">({RATING_SUMMARY.count} reviews)</span>
            </a>

            <div className="mt-8 flex items-end justify-between gap-4 border-t border-zinc-200 pt-6">
              <div>
                <p className="text-xs font-normal text-zinc-600">Price</p>
                <p className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">{usd(bundle.price)}</p>
              </div>
              <p className="text-sm font-normal text-zinc-600">{finish.shipsIn}</p>
            </div>

            {/* Finish */}
            <fieldset className="mt-6 border-0 p-0">
              <legend className="text-sm font-medium text-zinc-900">Finish — {finish.label}</legend>
              <div className="mt-2.5 flex gap-2.5">
                {FINISHES.map((f) => (
                  <label
                    key={f.id}
                    className={cx(
                      "flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-600 has-[:focus-visible]:ring-offset-2",
                      finishId === f.id ? "border-orange-700 bg-orange-50" : "border-zinc-200 bg-white hover:border-zinc-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="finish"
                      value={f.id}
                      checked={finishId === f.id}
                      onChange={() => setFinishId(f.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className="h-4 w-4 flex-none rounded-full border border-black/10"
                      style={{ backgroundColor: f.swatch }}
                    />
                    <span className={cx(finishId === f.id ? "font-medium text-orange-700" : "font-normal text-zinc-700")}>
                      {f.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Bundle */}
            <fieldset className="mt-5 border-0 p-0">
              <legend className="text-sm font-medium text-zinc-900">Bundle — {bundle.blurb}</legend>
              <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {BUNDLES.map((b) => (
                  <label
                    key={b.id}
                    className={cx(
                      "cursor-pointer rounded-xl border p-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-orange-600 has-[:focus-visible]:ring-offset-2",
                      bundleId === b.id ? "border-orange-700 bg-orange-50" : "border-zinc-200 bg-white hover:border-zinc-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="bundle"
                      value={b.id}
                      checked={bundleId === b.id}
                      onChange={() => setBundleId(b.id)}
                      className="sr-only"
                    />
                    <span className={cx("block", bundleId === b.id ? "font-medium text-orange-700" : "font-medium text-zinc-900")}>
                      {b.label}
                    </span>
                    <span className="mt-0.5 block font-normal text-zinc-600 tabular-nums">{usd(b.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <details className="mt-3">
              <summary className={cx("inline-flex cursor-pointer items-center rounded text-sm font-normal text-zinc-600 hover:text-zinc-900", FOCUS)}>
                What&apos;s included in {bundle.label}
              </summary>
              <ul role="list" className="mt-2 flex flex-col gap-1 pl-1">
                {bundle.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-normal text-zinc-600">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-orange-700" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </details>

            <button
              type="button"
              onClick={handleAddToCart}
              className={cx(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-orange-800 sm:w-auto sm:px-8",
                FOCUS,
              )}
            >
              {added ? <Check className="h-4.5 w-4.5 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4.5 w-4.5 flex-none" aria-hidden="true" />}
              {added ? "Added to cart" : `Add to cart — ${usd(bundle.price)}`}
            </button>

            <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_ROW.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                  <Icon className="h-3.5 w-3.5 flex-none text-zinc-600" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          </section>

          {/* ---------------------------------------------------------------- Gallery */}
          <section id="gallery" aria-labelledby="gallery-heading" className="mt-16 scroll-mt-24">
            <h2 id="gallery-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Gallery
            </h2>
            <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-600">
              Four reference views, redrawn live in your selected finish — use the arrows, the tab
              strip, or the left/right arrow keys.
            </p>
            <div className="mt-5">
              <Gallery finish={finish} />
            </div>
          </section>

          {/* ---------------------------------------------------------------- Specifications */}
          <section id="specs" aria-labelledby="specs-heading" className="mt-16 scroll-mt-24">
            <h2 id="specs-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Specifications
            </h2>
            <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-600">
              Full build sheet, grouped by system. Preamps &amp; conversion opens by default —
              expand the rest as needed.
            </p>
            <div className="mt-5">
              <SpecAccordion />
            </div>
          </section>

          {/* ---------------------------------------------------------------- Compare tiers */}
          <section id="compare" aria-labelledby="compare-heading" className="mt-16 scroll-mt-24">
            <h2 id="compare-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Compare tiers
            </h2>
            <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-600">
              Aria II sits at the entry tier. Pro adds four-channel I/O and MIDI; Studio adds ADAT
              expansion and an onboard DSP mixer.
            </p>
            <div className="mt-5">
              <CompareTable />
            </div>
          </section>

          {/* ---------------------------------------------------------------- Reviews */}
          <section id="reviews" aria-labelledby="reviews-heading" className="mt-16 scroll-mt-24">
            <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-zinc-900">
              Reviews
            </h2>
            <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-600">
              Sort by helpfulness or recency, or filter down to a single star rating.
            </p>
            <div className="mt-5">
              <ReviewsPanel />
            </div>
          </section>
        </div>

        <SectionNav price={bundle.price} />
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-[1200px] px-4 py-8 text-xs font-normal text-zinc-600 sm:px-6">
          {BRAND} — specifications are illustrative and subject to change between production runs.
        </div>
      </footer>
    </div>
  );
}
