"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronRight,
  Cog,
  Gauge,
  Ruler,
  Scale,
  Truck,
  Zap,
} from "lucide-react";
import {
  DEFAULT_VARIANT_ID,
  MEDIA_ITEMS,
  REVIEW_COUNT,
  VARIANTS,
  formatInt,
  formatUsd,
  getVariant,
  type VariantId,
} from "./data";
import VariantRail from "./variant-rail";
import MediaGallery from "./media-gallery";
import SpecSheet from "./spec-sheet";
import CompatibilityTable from "./compatibility-table";
import DocumentationList from "./documentation-list";
import ReviewsPanel, { type ReviewSort, type StarFilter } from "./reviews-panel";
import StickyBar from "./sticky-bar";

type TabId = "specs" | "docs" | "compat" | "reviews";

const BREADCRUMB = ["Home", "Motion control", "Linear actuators"];

export default function ProductClient() {
  const [variantId, setVariantId] = useState<VariantId>(DEFAULT_VARIANT_ID);
  const [activeImageId, setActiveImageId] = useState<string>(MEDIA_ITEMS[0].id);
  const [activeTab, setActiveTab] = useState<TabId>("specs");
  const [compareOn, setCompareOn] = useState(false);
  const [compareVariantId, setCompareVariantId] = useState<VariantId>("300");
  const [quoteAdded, setQuoteAdded] = useState(false);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("helpful");
  const [starFilter, setStarFilter] = useState<StarFilter>(0);
  const [stickyVisible, setStickyVisible] = useState(false);

  const summaryRef = useRef<HTMLDivElement>(null);
  const quoteTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variant = getVariant(variantId);
  const compareVariant = getVariant(compareVariantId === variantId ? VARIANTS.find((v) => v.id !== variantId)!.id : compareVariantId);

  // Keep the compare pair from collapsing onto a single configuration when the rail selection
  // moves onto whatever was picked as the comparison target.
  useEffect(() => {
    if (compareVariantId === variantId) {
      const fallback = VARIANTS.find((v) => v.id !== variantId);
      if (fallback) setCompareVariantId(fallback.id);
    }
  }, [variantId, compareVariantId]);

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setStickyVisible(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (quoteTimeout.current) clearTimeout(quoteTimeout.current);
    };
  }, []);

  function handleAddToQuote() {
    setQuoteAdded(true);
    if (quoteTimeout.current) clearTimeout(quoteTimeout.current);
    quoteTimeout.current = setTimeout(() => setQuoteAdded(false), 2200);
  }

  const tabs: Array<{ id: TabId; label: string }> = [
    { id: "specs", label: "Specifications" },
    { id: "docs", label: "Documentation" },
    { id: "compat", label: "Compatibility" },
    { id: "reviews", label: `Reviews (${formatInt(REVIEW_COUNT)})` },
  ];

  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <a
        href="#product-main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-blue-600 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to product details
      </a>

      <StickyBar visible={stickyVisible} variant={variant} quoteAdded={quoteAdded} onAddToQuote={handleAddToQuote} />

      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
              <Cog className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span style={{ fontFamily: "var(--font-display-mono)" }} className="text-base font-semibold tracking-tight">
              Torvex
            </span>
          </div>
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex min-w-0 flex-wrap items-center gap-1 text-xs font-normal text-zinc-600 dark:text-zinc-400">
              {BREADCRUMB.map((crumb) => (
                <li key={crumb} className="flex items-center gap-1">
                  <span>{crumb}</span>
                  <ChevronRight className="h-3 w-3 flex-none text-zinc-400" aria-hidden="true" />
                </li>
              ))}
              <li aria-current="page" className="truncate font-medium text-zinc-900 dark:text-zinc-50">
                LA-640 series
              </li>
            </ol>
          </nav>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr] lg:items-start lg:px-8">
        <aside aria-label="Product configurations" className="min-w-0 lg:sticky lg:top-6">
          <p className="mb-2.5 text-xs font-medium tracking-wide text-zinc-600 uppercase dark:text-zinc-400">
            Configurations
          </p>
          <VariantRail variants={VARIANTS} selectedId={variantId} onSelect={setVariantId} />
        </aside>

        <main id="product-main" className="min-w-0">
          {/* Always-visible summary: what it is, price, and the primary CTA — no scroll or
              interaction required to reach any of it. */}
          <div ref={summaryRef} className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <MediaGallery items={MEDIA_ITEMS} activeId={activeImageId} onSelect={setActiveImageId} sku={variant.sku} />

            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-normal text-zinc-600 dark:text-zinc-400">{variant.sku}</p>
              <h1
                style={{ fontFamily: "var(--font-display-mono)" }}
                className="mt-1 text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
              >
                LA-640 Series Precision Linear Actuator
              </h1>
              <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-600 dark:text-zinc-400">
                A 24V brushless linear actuator built for repeatable pick-and-place and gantry motion.
                Five stroke lengths ship from stock, sharing one motor, connector and control interface
                across the family.
              </p>

              <div className="mt-4 flex flex-wrap items-baseline gap-3">
                <span className="text-3xl font-semibold tabular-nums">{formatUsd(variant.priceUsd)}</span>
                <span className="text-sm font-normal text-zinc-600 dark:text-zinc-400">per unit, list price</span>
              </div>

              <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-zinc-200 py-4 sm:grid-cols-4 dark:border-zinc-800">
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                    <Ruler className="h-4 w-4 flex-none text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    Stroke
                  </dt>
                  <dd className="pl-[22px] text-sm font-medium tabular-nums">{variant.strokeMm} mm</dd>
                </div>
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                    <Gauge className="h-4 w-4 flex-none text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    Max load
                  </dt>
                  <dd className="pl-[22px] text-sm font-medium tabular-nums">{formatInt(variant.maxLoadN)} N</dd>
                </div>
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                    <Zap className="h-4 w-4 flex-none text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    Max speed
                  </dt>
                  <dd className="pl-[22px] text-sm font-medium tabular-nums">{variant.maxSpeedMms} mm/s</dd>
                </div>
                <div className="min-w-0">
                  <dt className="flex items-center gap-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                    <Scale className="h-4 w-4 flex-none text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    Weight
                  </dt>
                  <dd className="pl-[22px] text-sm font-medium tabular-nums">{variant.weightKg.toFixed(1)} kg</dd>
                </div>
              </dl>

              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-normal text-zinc-600 dark:text-zinc-400">
                <Truck className="h-4 w-4 flex-none" aria-hidden="true" />
                Ships in <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-50">{variant.leadTimeDays}</span> business days
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleAddToQuote}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-offset-zinc-950"
                >
                  {quoteAdded ? (
                    <>
                      <Check className="h-4 w-4 flex-none" aria-hidden="true" />
                      Added to quote
                    </>
                  ) : (
                    `Add ${variant.sku} to quote`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("docs")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-700 dark:focus-visible:ring-offset-zinc-950"
                >
                  Talk to an engineer
                </button>
              </div>
            </div>
          </div>

          {/* Tabbed data sheet — Specifications is the default panel, so the deepest proof
              (the full spec table) is one render away, never behind extra interaction. */}
          <div className="mt-10">
            <div role="tablist" aria-label="Product information" className="flex gap-1 overflow-x-auto border-b border-zinc-200 dark:border-zinc-800">
              {tabs.map((tab) => {
                const selected = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-none rounded-t-md border-b-2 px-3.5 py-2.5 text-sm font-medium tabular-nums whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      selected
                        ? "border-blue-600 text-zinc-900 dark:border-blue-500 dark:text-zinc-50"
                        : "border-transparent text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div
              id="panel-specs"
              role="tabpanel"
              aria-labelledby="tab-specs"
              hidden={activeTab !== "specs"}
              className="pt-6"
            >
              <h2 className="sr-only">Specifications</h2>
              <SpecSheet
                variant={variant}
                compareVariant={compareVariant}
                compareOn={compareOn}
                onToggleCompare={() => setCompareOn((v) => !v)}
                compareOptions={VARIANTS.filter((v) => v.id !== variantId)}
                compareVariantId={compareVariant.id}
                onChangeCompareVariant={setCompareVariantId}
              />
            </div>

            <div
              id="panel-docs"
              role="tabpanel"
              aria-labelledby="tab-docs"
              hidden={activeTab !== "docs"}
              className="pt-6"
            >
              <h2 className="sr-only">Documentation and downloads</h2>
              <DocumentationList variant={variant} />
            </div>

            <div
              id="panel-compat"
              role="tabpanel"
              aria-labelledby="tab-compat"
              hidden={activeTab !== "compat"}
              className="pt-6"
            >
              <h2 className="sr-only">Compatibility and fit</h2>
              <CompatibilityTable />
            </div>

            <div
              id="panel-reviews"
              role="tabpanel"
              aria-labelledby="tab-reviews"
              hidden={activeTab !== "reviews"}
              className="pt-6"
            >
              <h2 className="sr-only">Reviews and ratings</h2>
              <ReviewsPanel sort={reviewSort} onSortChange={setReviewSort} starFilter={starFilter} onStarFilterChange={setStarFilter} />
            </div>
          </div>
        </main>
      </div>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 text-xs font-normal text-zinc-600 sm:px-6 lg:px-8 dark:text-zinc-400">
          Torvex Motion Components · specifications shown for reference and subject to change without
          notice · fictional catalog entry for design review.
        </div>
      </footer>
    </div>
  );
}
