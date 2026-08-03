"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { AVERAGE_RATING, RATING_DISTRIBUTION, REVIEW_COUNT, REVIEWS, cx, FOCUS, type Review } from "./data";

type Sort = "helpful" | "recent" | "rating";
const SORT_LABELS: Record<Sort, string> = {
  helpful: "Most helpful",
  recent: "Most recent",
  rating: "Highest rating",
};

function StarRow({ rating, size = "h-3.5 w-3.5" }: { rating: number; size?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cx("flex-none", size, i <= rating ? "fill-amber-600 text-amber-600" : "fill-none text-zinc-300")}
        />
      ))}
    </span>
  );
}

function sortReviews(reviews: Review[], sort: Sort): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || a.recencyRank - b.recencyRank);
    case "recent":
      return copy.sort((a, b) => a.recencyRank - b.recencyRank);
    case "helpful":
    default:
      return copy.sort((a, b) => b.helpful - a.helpful);
  }
}

/** Sorting is the fourth genuinely informational interaction — it reorders real review data, not a decorative filter. */
export default function Reviews() {
  const [sort, setSort] = useState<Sort>("helpful");
  const visible = sortReviews(REVIEWS, sort);

  return (
    <section aria-labelledby="reviews-heading" className="mt-16 border-t border-zinc-200 pt-12 sm:mt-20 sm:pt-16">
      <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
        Reviews
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 border-b border-zinc-200 pb-6 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-start gap-1">
          <span className="text-3xl font-semibold tabular-nums text-zinc-900">{AVERAGE_RATING.toFixed(1)}</span>
          <StarRow rating={Math.round(AVERAGE_RATING)} size="h-4 w-4" />
          <span className="text-xs font-normal tabular-nums text-zinc-600">{REVIEW_COUNT} verified reviews</span>
        </div>
        <ul role="list" className="flex flex-col justify-center gap-1.5">
          {RATING_DISTRIBUTION.slice()
            .reverse()
            .map((d) => {
              const pct = Math.round((d.count / REVIEW_COUNT) * 100);
              return (
                <li key={d.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-10 flex-none font-normal tabular-nums text-zinc-600">{d.stars} star</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100" aria-hidden="true">
                    <span className="block h-full rounded-full bg-amber-600" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-16 flex-none text-right font-normal tabular-nums text-zinc-600">
                    {pct}% ({d.count})
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <label htmlFor="review-sort" className="text-xs font-normal text-zinc-600">
          Sort
        </label>
        <select
          id="review-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className={cx("rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900", FOCUS)}
        >
          {(Object.entries(SORT_LABELS) as Array<[Sort, string]>).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <ul role="list" className="mt-2 divide-y divide-zinc-200">
        {visible.map((review) => (
          <li key={review.id} className="py-4">
            <div className="flex flex-wrap items-center gap-2">
              <StarRow rating={review.rating} />
              <span className="text-sm font-semibold text-zinc-900">{review.title}</span>
            </div>
            <p className="mt-1 text-xs font-normal text-zinc-600">
              {review.author} · {review.role} · bought {review.bladeLabel}
            </p>
            <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-700">{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
