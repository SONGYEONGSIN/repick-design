"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { GALLERY, SIZES } from "./data";
import Gallery from "./gallery";
import SizeLedger from "./size-ledger";
import StickyBar from "./sticky-bar";
import TabsSection, { type TabId } from "./tabs-section";

const PRODUCT_TITLE = "Classic Low-Top Sneakers";
const PRODUCT_BRAND = "Fieldstone Co.";

const BREADCRUMB = [
  { label: "Marketplace", href: "#" },
  { label: "Footwear", href: "#" },
  { label: "Fieldstone Co.", href: "#" },
];

/**
 * Orchestrates the page's local state — active photo, selected size, open condition sections,
 * active detail tab, and whether the condensed purchase bar should show. The condensed bar's
 * visibility is driven by an IntersectionObserver watching the full-size ledger (imported below via
 * a ref), not a scroll-Y threshold guess, so it appears exactly when the real buy controls leave the
 * viewport regardless of font size, zoom, or viewport height.
 */
export default function ProductDetailClient() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSizeUs, setSelectedSizeUs] = useState("9");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [expandedConditionIds, setExpandedConditionIds] = useState<Set<string>>(
    () => new Set(["upper"]),
  );
  const [ledgerOutOfView, setLedgerOutOfView] = useState(false);

  const ledgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ledgerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setLedgerOutOfView(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  function toggleCondition(id: string) {
    setExpandedConditionIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedSize = SIZES.find((s) => s.us === selectedSizeUs) ?? SIZES[0];

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <StickyBar
        visible={ledgerOutOfView}
        image={GALLERY[activeImage]}
        title={PRODUCT_TITLE}
        size={selectedSize}
      />

      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 sm:px-8">
          <p className="text-base font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            Fernway
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs font-normal text-zinc-600">
            <ShieldCheck className="h-3.5 w-3.5 flex-none text-[#A16207]" aria-hidden="true" />
            Every listing authenticated before it ships
          </p>
        </div>
      </header>

      <nav aria-label="Breadcrumb" className="mx-auto max-w-[1400px] px-5 pt-5 sm:px-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs font-normal text-zinc-600">
          {BREADCRUMB.map((crumb, i) => (
            <li key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-3 w-3 flex-none text-zinc-400" aria-hidden="true" /> : null}
              {i === BREADCRUMB.length - 1 ? (
                <span aria-current="page" className="text-zinc-700">
                  {crumb.label}
                </span>
              ) : (
                <a href={crumb.href} className="rounded transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2">
                  {crumb.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-4 sm:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-zinc-600">{PRODUCT_BRAND}</p>
          <h1
            className="mt-1 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            {PRODUCT_TITLE}
          </h1>
        </div>

        {/* Media sits full-width above the ledger — the page's structural bet is a stacked,
            horizontal instrument panel rather than a media-left / buy-box-right split. */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:items-start">
          <Gallery images={GALLERY} active={activeImage} onChange={setActiveImage} />
          <div ref={ledgerRef}>
            <SizeLedger sizes={SIZES} selectedUs={selectedSizeUs} onSelect={setSelectedSizeUs} />
          </div>
        </div>

        <div className="mt-12">
          <TabsSection
            active={activeTab}
            onChange={setActiveTab}
            expandedConditionIds={expandedConditionIds}
            onToggleCondition={toggleCondition}
            selectedSizeUs={selectedSizeUs}
          />
        </div>
      </main>
    </div>
  );
}
