"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { CATEGORIES, ITEMS, computeAiPrice, deltaPct, type CategoryId } from "./data";
import { ListingCard } from "./listing-card";
import { Reveal } from "./reveal";
import { ACCENT_FILL, ACCENT_ON_FILL_TEXT, EYEBROW, FOCUS_RING } from "./tokens";

// Meaningfully mispriced, either direction -- the threshold the "needs re-grading" filter uses.
const RE_GRADE_THRESHOLD_PCT = 15;

type CategoryFilter = "all" | CategoryId;

/**
 * Independent gallery of all 16 comparables -- its category chips and its "needs re-grading"
 * toggle are a second, separate control surface from the hero's device above, not a restatement
 * of it, so moving one never silently moves the other.
 */
export function ProductPreview() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [needsRegradeOnly, setNeedsRegradeOnly] = useState(false);

  const filtered = useMemo(() => {
    return ITEMS.filter((item) => {
      if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
      if (needsRegradeOnly) {
        const ai = computeAiPrice(item);
        const delta = Math.abs(deltaPct(item.listedPrice, ai));
        if (delta < RE_GRADE_THRESHOLD_PCT) return false;
      }
      return true;
    });
  }, [categoryFilter, needsRegradeOnly]);

  return (
    <section id="listings" className="border-b border-zinc-200 bg-zinc-50/60">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <Reveal>
          <p className={`${EYEBROW} text-teal-700`}>Every comparable, gradeable</p>
          <h2 className="mt-3 max-w-xl font-[var(--font-display-wide)] text-[clamp(1.75rem,1.5rem+1.2vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-950">
            Sixteen listings, the same evidence on every one
          </h2>
          <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-600">
            Filter by category, or isolate the listings where the AI price and the asking price
            disagree by more than {RE_GRADE_THRESHOLD_PCT}% &mdash; the ones most worth a second
            look before you buy or sell.
          </p>
        </Reveal>

        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={categoryFilter === "all"}
              onClick={() => setCategoryFilter("all")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                categoryFilter === "all"
                  ? `border-transparent ${ACCENT_FILL} ${ACCENT_ON_FILL_TEXT}`
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
              }`}
            >
              All categories
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={categoryFilter === c.id}
                onClick={() => setCategoryFilter(c.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                  categoryFilter === c.id
                    ? `border-transparent ${ACCENT_FILL} ${ACCENT_ON_FILL_TEXT}`
                    : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-pressed={needsRegradeOnly}
            onClick={() => setNeedsRegradeOnly((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
              needsRegradeOnly
                ? "border-teal-700/30 bg-teal-50 text-teal-800"
                : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
            {needsRegradeOnly ? `Showing mispriced only (${filtered.length})` : "Needs re-grading only"}
          </button>
        </Reveal>

        <Reveal className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
          {filtered.map((item) => (
            <div key={item.id} className="min-w-0">
              <ListingCard item={item} />
            </div>
          ))}
        </Reveal>

        {filtered.length === 0 && (
          <p className="mt-8 text-sm font-semibold text-zinc-500">
            No listings match this combination of filters right now.
          </p>
        )}
      </div>
    </section>
  );
}
