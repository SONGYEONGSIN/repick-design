"use client";

import { useMemo, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { FOCUS, cx, REVIEWS, GRADES, type GradeId } from "./data";

const GRADE_LABEL: Record<GradeId | "new", string> = {
  mint: "Mint",
  excellent: "Excellent",
  good: "Good",
  new: "New, sealed",
};

/** Star-rating filter over a fixed review set — a real narrowing interaction, not decorative:
 * the list, the visible count, and the empty state all respond to the selected rating. */
export default function ReviewsPanel() {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const filtered = useMemo(
    () => (ratingFilter === null ? REVIEWS : REVIEWS.filter((r) => r.rating === ratingFilter)),
    [ratingFilter],
  );

  return (
    <div>
      <div role="group" aria-label="Filter reviews by rating" className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setRatingFilter(null)}
          aria-pressed={ratingFilter === null}
          className={cx(
            "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
            ratingFilter === null ? "border-sky-700 bg-sky-50 font-medium text-sky-700" : "border-slate-200 bg-white font-normal text-slate-700 hover:border-slate-300",
            FOCUS,
          )}
        >
          All ratings ({REVIEWS.length})
        </button>
        {[5, 4, 3, 2, 1].map((n) => {
          const count = REVIEWS.filter((r) => r.rating === n).length;
          return (
            <button
              key={n}
              type="button"
              onClick={() => setRatingFilter(n)}
              aria-pressed={ratingFilter === n}
              disabled={count === 0}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                ratingFilter === n ? "border-sky-700 bg-sky-50 font-medium text-sky-700" : "border-slate-200 bg-white font-normal text-slate-700 hover:border-slate-300",
                FOCUS,
              )}
            >
              <Star className="h-3.5 w-3.5 flex-none fill-current" aria-hidden="true" />
              {n} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm font-normal text-slate-600">
          No reviews at this rating yet.
        </p>
      ) : (
        <ul role="list" className="mt-5 flex flex-col gap-4">
          {filtered.map((review) => {
            const gradeLabel = GRADE_LABEL[review.gradeBought];
            const gradeMeta = GRADES.find((g) => g.id === review.gradeBought);
            return (
              <li key={review.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} className={cx("h-3.5 w-3.5", n <= review.rating ? "fill-sky-700 text-sky-700" : "fill-slate-200 text-slate-200")} />
                      ))}
                    </span>
                    <span className="sr-only">{review.rating} out of 5 stars</span>
                    <span className="text-sm font-medium text-slate-900">{review.title}</span>
                  </div>
                  <span className="text-xs font-normal text-slate-600 tabular-nums">{review.date}</span>
                </div>
                <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-slate-700">{review.body}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-normal text-slate-600">
                  <BadgeCheck className="h-3.5 w-3.5 flex-none text-slate-500" aria-hidden="true" />
                  {review.author} — verified {gradeLabel} buyer{gradeMeta ? ` (${gradeMeta.cosmeticScore})` : ""}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
