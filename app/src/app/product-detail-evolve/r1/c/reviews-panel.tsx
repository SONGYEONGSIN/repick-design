import { Star, ThumbsUp } from "lucide-react";
import { AVERAGE_RATING, RATING_DISTRIBUTION, REVIEW_COUNT, REVIEWS, type Review } from "./data";

export type ReviewSort = "helpful" | "recent" | "rating";
export type StarFilter = 0 | 1 | 2 | 3 | 4 | 5;

const SORT_LABELS: Record<ReviewSort, string> = {
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
          className={`${size} flex-none ${i <= rating ? "fill-blue-500 text-blue-500 dark:fill-blue-400 dark:text-blue-400" : "fill-none text-zinc-300 dark:text-zinc-700"}`}
        />
      ))}
    </span>
  );
}

function sortReviews(reviews: Review[], sort: ReviewSort): Review[] {
  const copy = [...reviews];
  switch (sort) {
    case "helpful":
      return copy.sort((a, b) => b.helpful - a.helpful);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || a.recencyRank - b.recencyRank);
    case "recent":
    default:
      return copy.sort((a, b) => a.recencyRank - b.recencyRank);
  }
}

export default function ReviewsPanel({
  sort,
  onSortChange,
  starFilter,
  onStarFilterChange,
}: {
  sort: ReviewSort;
  onSortChange: (s: ReviewSort) => void;
  starFilter: StarFilter;
  onStarFilterChange: (s: StarFilter) => void;
}) {
  const filtered = starFilter === 0 ? REVIEWS : REVIEWS.filter((r) => r.rating === starFilter);
  const visible = sortReviews(filtered, sort);

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 border-b border-zinc-200 pb-6 sm:grid-cols-[auto_1fr] dark:border-zinc-800">
        <div className="flex flex-col items-start gap-1">
          <span className="text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
            {AVERAGE_RATING.toFixed(1)}
          </span>
          <StarRow rating={Math.round(AVERAGE_RATING)} size="h-4 w-4" />
          <span className="text-xs font-normal tabular-nums text-zinc-600 dark:text-zinc-400">
            {REVIEW_COUNT} verified reviews
          </span>
        </div>
        <ul role="list" className="flex flex-col justify-center gap-1.5">
          {RATING_DISTRIBUTION.slice()
            .reverse()
            .map((d) => {
              const pct = Math.round((d.count / REVIEW_COUNT) * 100);
              return (
                <li key={d.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-10 flex-none font-normal tabular-nums text-zinc-600 dark:text-zinc-400">
                    {d.stars} star
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900" aria-hidden="true">
                    <span className="block h-full rounded-full bg-blue-500 dark:bg-blue-400" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-16 flex-none text-right font-normal tabular-nums text-zinc-600 dark:text-zinc-400">
                    {pct}% ({d.count})
                  </span>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by rating">
          {([0, 5, 4, 3, 2, 1] as StarFilter[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={starFilter === s}
              onClick={() => onStarFilterChange(s)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950 ${
                starFilter === s
                  ? "border-blue-600 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-500/10 dark:text-blue-400"
                  : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700"
              }`}
            >
              {s === 0 ? "All" : `${s} star`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="review-sort" className="text-xs font-normal text-zinc-600 dark:text-zinc-400">
            Sort
          </label>
          <select
            id="review-sort"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as ReviewSort)}
            className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          >
            {(Object.entries(SORT_LABELS) as Array<[ReviewSort, string]>).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs font-normal tabular-nums text-zinc-600 dark:text-zinc-400" aria-live="polite">
        Showing {visible.length} of {REVIEW_COUNT} reviews
      </p>

      {visible.length === 0 ? (
        <p className="mt-6 text-sm font-normal text-zinc-600 dark:text-zinc-400">
          No reviews at this rating yet. Try a different filter.
        </p>
      ) : (
        <ul role="list" className="mt-2 divide-y divide-zinc-200 dark:divide-zinc-800">
          {visible.map((review) => (
            <li key={review.id} className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <StarRow rating={review.rating} />
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{review.title}</span>
              </div>
              <p className="mt-1 text-xs font-normal text-zinc-600 dark:text-zinc-400">
                {review.author} · {review.role} · purchased {review.variantLabel}
              </p>
              <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-700 dark:text-zinc-300">
                {review.body}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-normal tabular-nums text-zinc-600 dark:text-zinc-400">
                <ThumbsUp className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                {review.helpful} found this helpful
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
