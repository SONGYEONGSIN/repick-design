"use client";

import { useRef, type KeyboardEvent } from "react";
import { CheckCircle2, Clock, MapPin, PackageCheck, Star, Truck } from "lucide-react";
import {
  CONDITION_REPORT,
  OVERVIEW_FACTS,
  REVIEWS,
  SELLER,
  SHIPPING_STEPS,
  SIZES,
} from "./data";
import ConditionAccordion from "./condition-accordion";
import MeasurementsTable from "./measurements-table";
import ReviewsPanel from "./reviews-panel";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "condition", label: "Condition report" },
  { id: "measurements", label: "Measurements" },
  { id: "seller", label: "Seller & shipping" },
  { id: "reviews", label: `Reviews (${REVIEWS.length})` },
] as const;

type TabId = (typeof TABS)[number]["id"];

/**
 * Interaction 3 — tabs. A real tablist (roving tabindex, arrow-key navigation, `aria-controls` tying
 * each tab to its panel) rather than a styled radio group, so the behavior matches the ARIA Authoring
 * Practices pattern a screen reader user already knows. Only the active panel is mounted, which also
 * keeps the two accordion/table/list widgets nested inside from needing their own visibility logic.
 */
export default function TabsSection({
  active,
  onChange,
  expandedConditionIds,
  onToggleCondition,
  selectedSizeUs,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
  expandedConditionIds: Set<string>;
  onToggleCondition: (id: string) => void;
  selectedSizeUs: string;
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
    if (e.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = TABS.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      const nextId = TABS[nextIndex].id;
      onChange(nextId);
      tabRefs.current[nextId]?.focus();
    }
  }

  return (
    <div>
      <div role="tablist" aria-label="Listing details" className="flex gap-1 overflow-x-auto border-b border-zinc-200">
        {TABS.map((tab, i) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`flex-none whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 ${
                isActive
                  ? "border-zinc-900 text-zinc-900"
                  : "border-transparent text-zinc-600 hover:text-zinc-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        tabIndex={0}
        className="rounded-lg pt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2"
      >
        {active === "overview" ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Overview</h2>
            <p className="mt-3 max-w-[65ch] text-sm font-normal leading-relaxed text-zinc-700">
              Fieldstone Co.&apos;s Classic Low-Top has stayed close to its original 2019 pattern: a
              cotton-canvas upper, a five-eyelet lace-up closure, and a vulcanized rubber outsole built
              to be resoled rather than replaced. This listing is a single physical pair, condition-graded
              and authenticated by Fernway before it ships.
            </p>
            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {OVERVIEW_FACTS.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-4 border-b border-zinc-100 pb-2">
                  <dt className="text-sm font-normal text-zinc-600">{fact.label}</dt>
                  <dd className="text-sm font-medium text-zinc-900">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {active === "condition" ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Condition report</h2>
            <p className="mt-2 max-w-[65ch] text-sm font-normal leading-relaxed text-zinc-700">
              Every listing is inspected in four groups before it&apos;s authenticated. Open any section
              for the inspector&apos;s notes — the score shown next to each title is visible whether or
              not you expand it.
            </p>
            <div className="mt-5">
              <ConditionAccordion
                points={CONDITION_REPORT}
                expanded={expandedConditionIds}
                onToggle={onToggleCondition}
              />
            </div>
          </div>
        ) : null}

        {active === "measurements" ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Measurements</h2>
            <p className="mt-2 max-w-[65ch] text-sm font-normal leading-relaxed text-zinc-700">
              Sizes run true to Fieldstone Co.&apos;s standard last. The row for your currently selected
              size is marked below.
            </p>
            <div className="mt-5">
              <MeasurementsTable sizes={SIZES} selectedUs={selectedSizeUs} />
            </div>
          </div>
        ) : null}

        {active === "seller" ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Seller & shipping</h2>
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-zinc-900">Seller</h3>
                <div className="mt-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-none text-[#A16207]" aria-hidden="true" />
                  <p className="text-sm font-medium text-zinc-900">{SELLER.name}</p>
                  <span className="text-xs font-normal text-zinc-600">Verified</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 flex-none fill-[#A16207] text-[#A16207]" aria-hidden="true" />
                  <p className="text-sm font-normal tabular-nums text-zinc-700">
                    {SELLER.rating} ({SELLER.reviewCount} ratings) &middot; {SELLER.trades} trades
                  </p>
                </div>
                <p className="mt-3 text-xs font-normal text-zinc-600">{SELLER.responseTime}</p>
                <p className="mt-1 text-xs font-normal text-zinc-600">{SELLER.memberSince}</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-zinc-900">Shipping & authentication</h3>
                <ol className="mt-3 space-y-3">
                  {SHIPPING_STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-zinc-100 text-xs font-medium tabular-nums text-zinc-700">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{step.title}</p>
                        <p className="text-xs font-normal leading-relaxed text-zinc-600">{step.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-zinc-200 pt-4 text-xs font-normal text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                    Ships from Portland, OR
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <PackageCheck className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                    14-day return window
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                    Ships to US &amp; Canada
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                    Authentication adds 1–2 business days
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {active === "reviews" ? (
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Reviews</h2>
            <div className="mt-4">
              <ReviewsPanel reviews={REVIEWS} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type { TabId };
export { TABS };
