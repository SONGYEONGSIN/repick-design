"use client";

import { BadgeCheck } from "lucide-react";
import type { Review } from "./data";
import { RATING_BREAKDOWN, SELLER } from "./data";
import RatingStars from "./rating-stars";

export type ReviewSort = "recent" | "highest" | "helpful";

const SORT_LABEL: Record<ReviewSort, string> = {
  recent: "Most recent",
  highest: "Highest rated",
  helpful: "Most helpful",
};

function sortReviews(items: Review[], sort: ReviewSort): Review[] {
  const copy = [...items];
  if (sort === "highest") copy.sort((a, b) => b.rating - a.rating);
  else if (sort === "helpful") copy.sort((a, b) => b.helpful - a.helpful);
  return copy;
}

const maxBreakdown = Math.max(...RATING_BREAKDOWN.map((r) => r.count));

export default function ReviewsPanel({
  id,
  labelledBy,
  reviews,
  totalCount,
  sort,
  onSortChange,
  visibleCount,
  onShowMore,
}: {
  id: string;
  labelledBy: string;
  reviews: Review[];
  totalCount: number;
  sort: ReviewSort;
  onSortChange: (s: ReviewSort) => void;
  visibleCount: number;
  onShowMore: () => void;
}) {
  const sorted = sortReviews(reviews, sort).slice(0, visibleCount);
  const canShowMore = visibleCount < reviews.length;

  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} className="focus-visible:outline-none">
      <h2 className="sr-only">Reviews</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:gap-10">
        <div className="flex shrink-0 flex-col items-start gap-1 sm:items-center sm:text-center">
          <span className="tabular-nums text-4xl font-semibold text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            {SELLER.ratingAvg.toFixed(1)}
          </span>
          <RatingStars rating={SELLER.ratingAvg} size="md" />
          <span className="text-sm text-zinc-400">
            <span className="tabular-nums">{totalCount.toLocaleString()}</span> reviews
          </span>
        </div>

        <ul className="flex flex-col gap-1.5 sm:max-w-md">
          {RATING_BREAKDOWN.map((row) => {
            const pct = Math.round((row.count / maxBreakdown) * 1000) / 10;
            return (
              <li key={row.stars} className="flex items-center gap-2.5 text-xs text-zinc-400">
                <span className="w-10 shrink-0 tabular-nums">{row.stars} star</span>
                <span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <span className="block h-full rounded-full bg-rose-500" style={{ width: `${pct}%` }} />
                </span>
                <span className="w-10 shrink-0 text-right tabular-nums">{row.count}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-5">
        <h3 className="text-sm font-medium text-zinc-300">Recent reviews</h3>
        <label className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="hidden sm:inline">Sort</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReviewSort)}
            aria-label="Sort reviews"
            className="min-h-9 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 text-sm font-medium text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            {(Object.keys(SORT_LABEL) as ReviewSort[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-4 flex flex-col divide-y divide-zinc-800">
        {sorted.map((review) => (
          <li key={review.id} className="min-w-0 py-4">
            <article className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-zinc-300"
                >
                  {review.initials}
                </span>
                <span className="font-medium text-zinc-100">{review.author}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-300">
                    <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Verified purchase
                  </span>
                )}
                <span className="text-xs text-zinc-400">· {review.dateLabel}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <RatingStars rating={review.rating} />
                <span className="sr-only">{review.rating} out of 5 stars</span>
                <span className="text-xs text-zinc-400">Item: {review.itemTitle}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{review.text}</p>
              <p className="mt-2 text-xs text-zinc-400">
                <span className="tabular-nums">{review.helpful}</span> people found this helpful
              </p>
            </article>
          </li>
        ))}
      </ol>

      {canShowMore && (
        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={onShowMore}
            className="min-h-10 rounded-lg border border-zinc-700 px-4 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            Show more reviews
          </button>
        </div>
      )}
    </div>
  );
}
