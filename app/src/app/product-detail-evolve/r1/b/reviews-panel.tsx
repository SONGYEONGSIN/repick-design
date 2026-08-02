"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, BadgeCheck, Star, ThumbsUp } from "lucide-react";
import { REVIEWS, RATING_SUMMARY, FOCUS, cx, type Review } from "./data";

type SortKey = "helpful" | "newest" | "highest" | "lowest";
type RatingFilter = "all" | 5 | 4 | 3 | 2 | 1;

const SORT_LABELS: Record<SortKey, string> = {
  helpful: "Most helpful",
  newest: "Newest",
  highest: "Highest rated",
  lowest: "Lowest rated",
};

function sortReviews(items: Review[], key: SortKey): Review[] {
  const copy = [...items];
  switch (key) {
    case "helpful":
      return copy.sort((a, b) => b.helpful - a.helpful);
    case "newest":
      return copy.sort((a, b) => b.order - a.order);
    case "highest":
      return copy.sort((a, b) => b.rating - a.rating || b.helpful - a.helpful);
    case "lowest":
      return copy.sort((a, b) => a.rating - b.rating || b.helpful - a.helpful);
  }
}

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={cx("h-3.5 w-3.5", n <= rating ? "fill-orange-600 text-orange-600" : "fill-zinc-200 text-zinc-200")} />
      ))}
    </span>
  );
}

/** Reviews with independent sort (order) and rating filter (subset) controls — the two most common
 * "narrow this list" interactions on a real reviews module, kept separate so either can be reset
 * without disturbing the other. Sort key never touches the clock: "newest" uses a hand-authored
 * `order` integer, not a parsed date. */
export default function ReviewsPanel() {
  const [sortKey, setSortKey] = useState<SortKey>("helpful");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");

  const filtered = useMemo(
    () => (ratingFilter === "all" ? REVIEWS : REVIEWS.filter((r) => r.rating === ratingFilter)),
    [ratingFilter],
  );
  const sorted = useMemo(() => sortReviews(filtered, sortKey), [filtered, sortKey]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-start gap-1.5">
          <p className="text-4xl font-semibold tracking-tight text-zinc-900 tabular-nums">{RATING_SUMMARY.average.toFixed(1)}</p>
          <div aria-hidden="true" className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={cx("h-4 w-4", n <= Math.round(RATING_SUMMARY.average) ? "fill-orange-600 text-orange-600" : "fill-zinc-200 text-zinc-200")} />
            ))}
          </div>
          <p className="text-sm font-normal text-zinc-600 tabular-nums">Based on {RATING_SUMMARY.count} reviews</p>
        </div>

        <ul role="list" className="flex flex-col justify-center gap-1.5">
          {RATING_SUMMARY.distribution.map((row) => (
            <li key={row.stars} className="flex items-center gap-2.5 text-xs font-normal text-zinc-600">
              <span className="w-10 flex-none tabular-nums">{row.stars} star</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
                <span className="block h-full rounded-full bg-orange-600" style={{ width: `${row.pct}%` }} />
              </span>
              <span className="w-9 flex-none text-right tabular-nums">{row.pct}%</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-5">
        <div role="group" aria-label="Filter by rating" className="flex flex-wrap gap-2">
          {(["all", 5, 4, 3, 2, 1] as RatingFilter[]).map((f) => (
            <button
              key={String(f)}
              type="button"
              aria-pressed={ratingFilter === f}
              onClick={() => setRatingFilter(f)}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums transition-colors",
                ratingFilter === f
                  ? "border-orange-700 bg-orange-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
                FOCUS,
              )}
            >
              {f === "all" ? "All" : `${f}★`}
            </button>
          ))}
        </div>

        <div className="relative flex-none">
          <label htmlFor="reviews-sort" className="sr-only">
            Sort reviews
          </label>
          <ArrowUpDown className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" aria-hidden="true" />
          <select
            id="reviews-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className={cx(
              "appearance-none rounded-lg border border-zinc-200 bg-white py-1.5 pr-8 pl-8 text-xs font-medium text-zinc-900",
              FOCUS,
            )}
          >
            {(Object.entries(SORT_LABELS) as Array<[SortKey, string]>).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm font-normal text-zinc-600 tabular-nums" aria-live="polite">
        {sorted.length} review{sorted.length === 1 ? "" : "s"}{ratingFilter !== "all" ? ` at ${ratingFilter} stars` : ""}
      </p>

      {sorted.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-zinc-200 px-5 py-8 text-center text-sm font-normal text-zinc-600">
          No reviews at this rating yet.
        </p>
      ) : (
        <ul role="list" className="mt-4 flex flex-col gap-4">
          {sorted.map((review) => (
            <li key={review.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <Stars rating={review.rating} />
                  <p className="mt-1.5 text-sm font-medium text-zinc-900">{review.title}</p>
                </div>
                <p className="text-xs font-normal text-zinc-600 tabular-nums">{review.date}</p>
              </div>
              <p className="mt-2 text-sm font-normal leading-relaxed text-zinc-700">{review.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-normal text-zinc-600">
                <span className="font-medium text-zinc-900">{review.author}</span>
                <span aria-hidden="true">·</span>
                <span>{review.role}</span>
                {review.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">
                    <BadgeCheck className="h-3 w-3 text-orange-700" aria-hidden="true" />
                    Verified buyer
                  </span>
                )}
                <span className="ml-auto inline-flex items-center gap-1 tabular-nums">
                  <ThumbsUp className="h-3 w-3" aria-hidden="true" />
                  {review.helpful} found this helpful
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
