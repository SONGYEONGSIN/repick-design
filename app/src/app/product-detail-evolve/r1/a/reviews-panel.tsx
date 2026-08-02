"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Star, ThumbsUp } from "lucide-react";
import type { Review } from "./data";

export type ReviewSort = "recent" | "rating" | "helpful";

const SORT_LABEL: Record<ReviewSort, string> = {
  recent: "Most recent",
  rating: "Highest rated",
  helpful: "Most helpful",
};

function sortReviews(reviews: Review[], sort: ReviewSort): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.helpful - a.helpful);
    case "helpful":
      return copy.sort((a, b) => b.helpful - a.helpful);
    case "recent":
    default:
      return copy.sort((a, b) => a.daysAgo - b.daysAgo);
  }
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`h-3.5 w-3.5 ${i < rating ? "fill-[#A16207] text-[#A16207]" : "fill-zinc-200 text-zinc-200"}`}
        />
      ))}
    </span>
  );
}

/**
 * Interaction 5 — reviews sort. A roving set of pressed buttons (not a native <select>) so the
 * current sort is always visible as UI state, matching the rest of the page's "state is always on
 * screen" rule. Re-sorting mutates the render order only; nothing about the review count or averages
 * moves, so shoppers scanning by rating never lose their place mid-comparison.
 */
export default function ReviewsPanel({ reviews }: { reviews: Review[] }) {
  const [sort, setSort] = useState<ReviewSort>("recent");
  const sorted = useMemo(() => sortReviews(reviews, sort), [reviews, sort]);
  const average = useMemo(
    () => reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    [reviews],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-2xl font-semibold tabular-nums text-zinc-900">{average.toFixed(1)}</p>
          <div>
            <Stars rating={Math.round(average)} />
            <p className="text-xs font-normal tabular-nums text-zinc-600">{reviews.length} reviews</p>
          </div>
        </div>
        <div role="group" aria-label="Sort reviews" className="flex flex-wrap gap-2">
          {(Object.keys(SORT_LABEL) as ReviewSort[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={sort === key}
              onClick={() => setSort(key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 ${
                sort === key
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 text-zinc-700 hover:border-zinc-500"
              }`}
            >
              {SORT_LABEL[key]}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-6 divide-y divide-zinc-200 border-t border-zinc-200">
        {sorted.map((review) => (
          <li key={review.id} className="py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
                <p className="text-sm font-medium text-zinc-900">{review.title}</p>
              </div>
              <p className="text-xs font-normal tabular-nums text-zinc-600">{review.daysAgo}d ago</p>
            </div>
            <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{review.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-normal text-zinc-600">
              <span className="inline-flex items-center gap-1.5">
                {review.verifiedPurchase ? (
                  <>
                    <BadgeCheck className="h-3.5 w-3.5 flex-none text-[#A16207]" aria-hidden="true" />
                    Verified purchase &middot; {review.author}
                  </>
                ) : (
                  <>{review.author}</>
                )}
              </span>
              <span className="inline-flex items-center gap-1.5 tabular-nums">
                <ThumbsUp className="h-3.5 w-3.5 flex-none text-zinc-500" aria-hidden="true" />
                {review.helpful} found this helpful
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
