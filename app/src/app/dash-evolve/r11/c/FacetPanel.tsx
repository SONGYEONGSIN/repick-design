"use client";

import { RotateCcw, X } from "lucide-react";
import {
  CAPABILITY_IDS,
  CAPABILITY_META,
  CATEGORY_IDS,
  CATEGORY_META,
  EMPTY_FILTERS,
  PRICE_BAND_IDS,
  PRICE_BAND_META,
  RATING_THRESHOLDS,
  REGION_IDS,
  REGION_META,
  activeFilterCount,
  countByCapability,
  countByCategory,
  countByPriceBand,
  countByRegion,
  type CapabilityId,
  type CategoryId,
  type Filters,
  type PriceBandId,
  type RegionId,
} from "./data";
import { BORDER, FOCUS_RING, HOVER_ACTIVE_BG, PRIMARY_TEXT, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, FacetCheckbox, ToggleChip } from "./ui";

function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function FacetPanelBody({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  const count = activeFilterCount(filters);

  return (
    <div className="flex h-full flex-col">
      <div className={cx("flex h-11 shrink-0 items-center justify-between border-b px-4", BORDER)}>
        <h2 className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Filters</h2>
        {count > 0 ? (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className={cx("flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium", PRIMARY_TEXT, "hover:underline", FOCUS_RING)}
          >
            <RotateCcw size={12} aria-hidden="true" />
            Clear all ({count})
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]">
        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-1.5">
            <EyebrowLabel>Category</EyebrowLabel>
          </legend>
          <div className="flex flex-col gap-0.5">
            {CATEGORY_IDS.map((id: CategoryId) => (
              <FacetCheckbox
                key={id}
                id={`facet-category-${id}`}
                label={CATEGORY_META[id].label}
                count={countByCategory(id)}
                checked={filters.categories.includes(id)}
                onChange={() => onChange({ ...filters, categories: toggleIn(filters.categories, id) })}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-1.5">
            <EyebrowLabel>Region</EyebrowLabel>
          </legend>
          <div className="flex flex-col gap-0.5">
            {REGION_IDS.map((id: RegionId) => (
              <FacetCheckbox
                key={id}
                id={`facet-region-${id}`}
                label={REGION_META[id].label}
                count={countByRegion(id)}
                checked={filters.regions.includes(id)}
                onChange={() => onChange({ ...filters, regions: toggleIn(filters.regions, id) })}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-1.5">
            <EyebrowLabel>Price band</EyebrowLabel>
          </legend>
          <div className="flex flex-col gap-0.5">
            {PRICE_BAND_IDS.map((id: PriceBandId) => (
              <FacetCheckbox
                key={id}
                id={`facet-price-${id}`}
                label={`${PRICE_BAND_META[id].label} (${PRICE_BAND_META[id].symbol})`}
                count={countByPriceBand(id)}
                checked={filters.priceBands.includes(id)}
                onChange={() => onChange({ ...filters, priceBands: toggleIn(filters.priceBands, id) })}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="mb-5 border-0 p-0">
          <legend className="mb-1.5">
            <EyebrowLabel>Minimum rating</EyebrowLabel>
          </legend>
          <div role="radiogroup" aria-label="Minimum rating" className="flex flex-wrap gap-1.5">
            {RATING_THRESHOLDS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={filters.minRating === t.min}
                onClick={() => onChange({ ...filters, minRating: t.min })}
                className={cx(
                  "min-h-8 rounded-full border px-3 py-1 text-xs font-medium",
                  TRANSITION,
                  FOCUS_RING,
                  filters.minRating === t.min
                    ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-300"
                    : cx(BORDER, "bg-white text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-white/5"),
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="border-0 p-0">
          <legend className="mb-1.5">
            <EyebrowLabel>Capabilities</EyebrowLabel>
          </legend>
          <p className={cx("mb-2 text-xs", TEXT_CAPTION)}>A supplier must offer every tag you select.</p>
          <div className="flex flex-wrap gap-1.5">
            {CAPABILITY_IDS.map((id: CapabilityId) => (
              <ToggleChip key={id} pressed={filters.capabilities.includes(id)} onClick={() => onChange({ ...filters, capabilities: toggleIn(filters.capabilities, id) })} size="sm">
                {CAPABILITY_META[id].label}
                <span className={cx("ml-0.5", TEXT_CAPTION)}>({countByCapability(id)})</span>
              </ToggleChip>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}

export default function FacetPanel({
  filters,
  onChange,
  mobileOpen,
  onCloseMobile,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      <aside className={cx("hidden w-64 shrink-0 overflow-hidden rounded-2xl border lg:block", BORDER, "bg-white dark:bg-zinc-900", "shadow-sm shadow-zinc-900/5 dark:shadow-black/30")}>
        <div className="h-[calc(100dvh-11rem)] min-h-[26rem]">
          <FacetPanelBody filters={filters} onChange={onChange} />
        </div>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close filters" onClick={onCloseMobile} className="absolute inset-0 bg-zinc-900/50 dark:bg-black/60" />
          <aside role="dialog" aria-modal="true" aria-label="Filters" className={cx("absolute inset-y-0 left-0 w-80 max-w-[88vw] border-r shadow-xl", BORDER, "bg-white dark:bg-zinc-950")}>
            <div className="flex justify-end p-2">
              <button type="button" onClick={onCloseMobile} aria-label="Close filters" className={cx("grid h-11 w-11 place-items-center rounded-full border", BORDER, HOVER_ACTIVE_BG, TRANSITION, FOCUS_RING)}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="h-[calc(100%-52px)]">
              <FacetPanelBody filters={filters} onChange={onChange} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
