"use client";

import { Star } from "lucide-react";
import type { Category, Pricing } from "./data";
import { CATEGORIES, PRICING_OPTIONS, RATING_OPTIONS } from "./data";
import { CATEGORY_ICON } from "./icons";

export interface FilterRailProps {
  idPrefix: string;
  selectedCategories: Set<Category>;
  onToggleCategory: (c: Category) => void;
  categoryCounts: Record<Category, number>;
  selectedPricing: Set<Pricing>;
  onTogglePricing: (p: Pricing) => void;
  pricingCounts: Record<Pricing, number>;
  minRating: number;
  onChangeMinRating: (r: number) => void;
  verifiedOnly: boolean;
  onToggleVerified: () => void;
}

const checkboxCls =
  "h-4 w-4 flex-none rounded border-zinc-600 bg-zinc-800 accent-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function FilterRail({
  idPrefix,
  selectedCategories,
  onToggleCategory,
  categoryCounts,
  selectedPricing,
  onTogglePricing,
  pricingCounts,
  minRating,
  onChangeMinRating,
  verifiedOnly,
  onToggleVerified,
}: FilterRailProps) {
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="text-sm font-semibold text-zinc-100">Category</legend>
        <div className="mt-3 space-y-2.5">
          {CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICON[category];
            const id = `${idPrefix}-cat-${category}`;
            const count = categoryCounts[category] ?? 0;
            return (
              <label
                key={category}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-zinc-300"
              >
                <input
                  id={id}
                  type="checkbox"
                  className={checkboxCls}
                  checked={selectedCategories.has(category)}
                  onChange={() => onToggleCategory(category)}
                />
                <Icon className="h-4 w-4 flex-none text-zinc-400" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate">{category}</span>
                <span className="flex-none tabular-nums text-zinc-400">{count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-zinc-100">Pricing</legend>
        <div className="mt-3 space-y-2.5">
          {PRICING_OPTIONS.map((pricing) => {
            const id = `${idPrefix}-price-${pricing}`;
            const count = pricingCounts[pricing] ?? 0;
            return (
              <label
                key={pricing}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2.5 text-sm font-normal text-zinc-300"
              >
                <input
                  id={id}
                  type="checkbox"
                  className={checkboxCls}
                  checked={selectedPricing.has(pricing)}
                  onChange={() => onTogglePricing(pricing)}
                />
                <span className="min-w-0 flex-1 truncate">{pricing}</span>
                <span className="flex-none tabular-nums text-zinc-400">{count}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold text-zinc-100">Minimum rating</legend>
        <div role="group" aria-label="Minimum rating" className="mt-3 flex flex-wrap gap-2">
          {RATING_OPTIONS.map((option) => {
            const active = minRating === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => onChangeMinRating(option)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
                  active
                    ? "border-emerald-400 bg-emerald-400/10 font-semibold text-emerald-300"
                    : "border-zinc-700 font-normal text-zinc-300 hover:border-zinc-600 hover:text-zinc-100"
                }`}
              >
                {option === 0 ? (
                  "Any"
                ) : (
                  <>
                    <Star
                      className={`h-3.5 w-3.5 flex-none ${active ? "fill-emerald-300" : "fill-zinc-400 text-zinc-400"}`}
                      aria-hidden="true"
                    />
                    {option.toFixed(1)}+
                  </>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-3 border-t border-zinc-800 pt-5">
        <span id={`${idPrefix}-verified-label`} className="text-sm font-semibold text-zinc-100">
          Verified only
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={verifiedOnly}
          aria-labelledby={`${idPrefix}-verified-label`}
          onClick={onToggleVerified}
          className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 ${
            verifiedOnly ? "bg-emerald-500" : "bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-4.5 w-4.5 flex-none translate-x-1 rounded-full bg-zinc-50 transition-transform motion-reduce:transition-none ${
              verifiedOnly ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
