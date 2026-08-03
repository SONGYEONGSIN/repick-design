"use client";

import { useMemo, useState } from "react";
import { Check, ShoppingCart, Star } from "lucide-react";
import {
  ADDONS,
  BRAND,
  GRADES,
  PRODUCT_NAME,
  RATING_SUMMARY,
  SKU_LINE,
  SWITCHES,
  TRUST_ROW_ITEMS,
  FOCUS,
  cx,
  usd,
  type AddonId,
  type GradeId,
  type SwitchId,
} from "./data";
import KeyboardArt from "./keyboard-art";
import StickyToolbar from "./sticky-toolbar";
import ConfigPanel from "./config-panel";
import FeelPanel from "./feel-panel";
import FulfillmentPanel from "./fulfillment-panel";
import SpecPanel from "./spec-panel";
import CompatibilityPanel from "./compatibility-panel";
import ReviewsPanel from "./reviews-panel";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" };

/** Console-style product page: a sticky app toolbar plus a hero carry price and the primary action
 * at rest, and everything beneath is a grid of simultaneously-visible panels rather than tabs or a
 * single long scroll. Two shared axes — condition grade and switch — drive every panel's numbers;
 * there is exactly one source of truth for each, held here and passed down as props. */
export default function ProductClient() {
  const [gradeId, setGradeId] = useState<GradeId>("grade-b");
  const [switchId, setSwitchId] = useState<SwitchId>("tactile");
  const [addonIds, setAddonIds] = useState<Set<AddonId>>(new Set());
  const [added, setAdded] = useState(false);

  const grade = GRADES.find((g) => g.id === gradeId) ?? GRADES[0];
  const sw = SWITCHES.find((s) => s.id === switchId) ?? SWITCHES[0];

  const unitPrice = grade.price + sw.delta;
  const addonsTotal = useMemo(
    () => ADDONS.filter((a) => addonIds.has(a.id)).reduce((sum, a) => sum + a.price, 0),
    [addonIds],
  );
  const total = unitPrice + addonsTotal;

  function toggleAddon(id: AddonId) {
    setAddonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddToCart() {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-900">
      <a
        href="#configure"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-sky-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to configuration
      </a>

      <StickyToolbar sw={sw} grade={grade} total={total} added={added} onAddToCart={handleAddToCart} />

      <div aria-live="polite" className="sr-only">
        {added ? `Added ${PRODUCT_NAME} — ${grade.short}, ${sw.label} — to cart.` : ""}
      </div>

      <main className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:py-14">
        {/* ---------------------------------------------------------------- Hero */}
        <section aria-label="Overview" className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="order-2 lg:order-1">
            <p className="text-sm font-normal text-sky-700">{SKU_LINE}</p>
            <h1 style={DISPLAY_FONT} className="mt-1.5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              {PRODUCT_NAME}
            </h1>
            <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-slate-600">
              A certified-refurbished 75% mechanical keyboard with a hot-swap PCB — every unit is
              bench-tested and graded before listing, and you choose the condition and switch feel
              that fit your build.
            </p>

            <a href="#reviews" className={cx("mt-4 inline-flex items-center gap-2 rounded", FOCUS)}>
              <span className="flex items-center gap-0.5" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cx("h-4 w-4", n <= Math.round(RATING_SUMMARY.average) ? "fill-sky-700 text-sky-700" : "fill-slate-200 text-slate-200")}
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-slate-900 tabular-nums">{RATING_SUMMARY.average.toFixed(1)}</span>
              <span className="text-sm font-normal text-slate-600 tabular-nums">({RATING_SUMMARY.count} reviews)</span>
            </a>

            <div className="mt-8 flex items-end justify-between gap-4 border-t border-slate-200 pt-6">
              <div>
                <p className="text-xs font-normal text-slate-600">Price, {grade.short} &middot; {sw.label}</p>
                <p className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">{usd(unitPrice)}</p>
              </div>
              <p className="text-sm font-normal text-slate-600">{grade.shipsIn}</p>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={cx(
                "mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-3.5 text-base font-medium text-white transition-colors hover:bg-sky-800 sm:w-auto sm:px-8",
                FOCUS,
              )}
            >
              {added ? <Check className="h-4.5 w-4.5 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4.5 w-4.5 flex-none" aria-hidden="true" />}
              {added ? "Added to cart" : `Add to cart — ${usd(total)}`}
            </button>

            <ul role="list" className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_ROW_ITEMS.map((item) => (
                <li key={item.key} className="flex items-center gap-1.5 text-xs font-normal text-slate-600">
                  <Check className="h-3.5 w-3.5 flex-none text-slate-600" aria-hidden="true" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2">
            <div className="aspect-[4/3] w-full rounded-2xl border border-slate-200 bg-slate-100 p-4">
              <KeyboardArt switchColor={sw.swatch} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {grade.short}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                <span aria-hidden="true" className="h-2.5 w-2.5 flex-none rounded-full" style={{ backgroundColor: sw.swatch }} />
                {sw.label}
              </span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Console */}
        <div className="mt-14">
          <h2 className="text-xs font-medium tracking-wide text-slate-600 uppercase">Configuration console</h2>
          <p className="mt-1 max-w-prose text-sm font-normal text-slate-600">
            Every panel below is live at rest — change the grade or switch in Configure your unit and
            watch feel, fulfillment, specifications and the order total update together.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ConfigPanel gradeId={gradeId} switchId={switchId} onGradeChange={setGradeId} onSwitchChange={setSwitchId} unitPrice={unitPrice} />
            </div>
            <div className="lg:col-span-4">
              <FeelPanel sw={sw} />
            </div>
            <div className="lg:col-span-3">
              <FulfillmentPanel grade={grade} />
            </div>

            <div className="lg:col-span-7">
              <SpecPanel sw={sw} grade={grade} />
            </div>
            <div className="lg:col-span-5">
              <CompatibilityPanel
                addonIds={addonIds}
                onToggleAddon={toggleAddon}
                unitPrice={unitPrice}
                addonsTotal={addonsTotal}
                total={total}
                added={added}
                onAddToCart={handleAddToCart}
              />
            </div>

            <div className="lg:col-span-12">
              <ReviewsPanel selectedGradeId={gradeId} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-[1280px] px-4 py-8 text-xs font-normal text-slate-600 sm:px-6">
          {BRAND} — grading, warranty terms and stock counts are illustrative and vary by listing.
        </div>
      </footer>
    </div>
  );
}
