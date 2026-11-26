"use client";

import { useMemo, useState } from "react";
import { ListingCard } from "./ListingCard";
import { LISTINGS, discountPercent } from "./listings";
import { ACCENT, BORDER, FG, FOCUS_RING, MUTED, ON_ACCENT_TEXT, SURFACE_TINT } from "./tokens";

type SortKey = "match" | "price" | "savings";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "match", label: "Best match" },
  { id: "price", label: "Lowest price" },
  { id: "savings", label: "Biggest discount" },
];

/**
 * Product preview — the main conversion proof. All three listings keep their full badge row
 * (AI-match, condition grade, verified-seller, before/after discount) visible at all times; the
 * segmented control only changes display ORDER, never what's shown.
 */
export function ProductPreview() {
  const [sort, setSort] = useState<SortKey>("match");

  const sorted = useMemo(() => {
    const copy = [...LISTINGS];
    if (sort === "match") copy.sort((a, b) => b.matchPercent - a.matchPercent);
    if (sort === "price") copy.sort((a, b) => a.resalePrice - b.resalePrice);
    if (sort === "savings") copy.sort((a, b) => discountPercent(b) - discountPercent(a));
    return copy;
  }, [sort]);

  return (
    <section id="preview" className="px-4 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]" style={{ color: FG }}>
              Every listing, graded the same way
            </h2>
            <p className="mt-1.5 text-[14.5px] font-normal" style={{ color: MUTED }}>
              The same four proof points on every card — nothing summarized away.
            </p>
          </div>

          <div
            className="flex items-center gap-1 rounded-full p-1"
            role="group"
            aria-label="Sort listings by"
            style={{ backgroundColor: SURFACE_TINT, border: `1px solid ${BORDER}` }}
          >
            {SORTS.map((option) => {
              const active = sort === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSort(option.id)}
                  className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${FOCUS_RING}`}
                  style={{
                    backgroundColor: active ? ACCENT : "transparent",
                    color: active ? ON_ACCENT_TEXT : MUTED,
                  }}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((listing) => (
            <div key={listing.id} className="min-w-0">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
