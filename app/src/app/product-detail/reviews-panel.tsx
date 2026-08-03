"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, BadgeCheck } from "lucide-react";
import { REVIEWS, RATING_SUMMARY, GRADES, FOCUS, cx, type GradeId } from "./data";

const STAR_FILTERS = [5, 4, 3, 2, 1] as const;

/** Reviews panel. The star filter is a real, list-narrowing interaction; the "buyers of this grade"
 * line is a second, non-destructive cross-panel readout — it recomputes from the grade chosen in
 * the configuration panel without ever hiding a review, so the panel stays informative even if a
 * grade has few reviews of its own. */
export default function ReviewsPanel({ selectedGradeId }: { selectedGradeId: GradeId }) {
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const grade = GRADES.find((g) => g.id === selectedGradeId) ?? GRADES[0];
  const gradeBuyerCount = REVIEWS.filter((r) => r.gradeBought === selectedGradeId).length;

  const visible = REVIEWS
    .filter((r) => (starFilter === null ? true : r.rating === starFilter))
    .slice()
    .sort((a, b) => b.order - a.order);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
          <MessageSquare className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
        </span>
        <h2 id="reviews-heading" className="text-base font-semibold tracking-tight text-slate-900">
          Reviews
        </h2>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-none items-center gap-3 sm:flex-col sm:items-start">
          <span className="text-3xl font-semibold text-slate-900 tabular-nums">{RATING_SUMMARY.average.toFixed(1)}</span>
          <span className="flex items-center gap-0.5" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={cx("h-3.5 w-3.5", n <= Math.round(RATING_SUMMARY.average) ? "fill-sky-700 text-sky-700" : "fill-slate-200 text-slate-200")}
              />
            ))}
          </span>
          <span className="text-xs font-normal text-slate-600 tabular-nums">{RATING_SUMMARY.count} reviews</span>
        </div>

        <ul role="list" className="flex flex-col gap-1">
          {RATING_SUMMARY.distribution.map((d) => (
            <li key={d.stars} className="flex items-center gap-2 text-xs">
              <span className="w-10 flex-none font-normal text-slate-600 tabular-nums">{d.stars} star</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <span className="block h-full rounded-full bg-sky-700" style={{ width: `${d.pct}%` }} />
              </span>
              <span className="w-8 flex-none text-right font-normal text-slate-600 tabular-nums">{d.pct}%</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-normal text-slate-600">
        <BadgeCheck className="h-3.5 w-3.5 flex-none text-sky-700" aria-hidden="true" />
        {gradeBuyerCount} of {REVIEWS.length} reviews below are from {grade.short} buyers.
      </p>

      <div role="group" aria-label="Filter reviews by rating" className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={starFilter === null}
          onClick={() => setStarFilter(null)}
          className={cx(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            starFilter === null ? "border-sky-700 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
            FOCUS,
          )}
        >
          All ratings
        </button>
        {STAR_FILTERS.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={starFilter === n}
            onClick={() => setStarFilter(n)}
            className={cx(
              "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              starFilter === n ? "border-sky-700 bg-sky-50 text-sky-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
              FOCUS,
            )}
          >
            {n}
            <Star className="h-3 w-3 flex-none fill-current" aria-hidden="true" />
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-xs font-normal text-slate-600 tabular-nums">
        Showing {visible.length} of {REVIEWS.length} reviews
      </p>

      <ul role="list" className="mt-3 flex flex-col divide-y divide-slate-200 border-t border-slate-200">
        {visible.map((r) => {
          const reviewGrade = GRADES.find((g) => g.id === r.gradeBought);
          return (
            <li key={r.id} className="py-4 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} className={cx("h-3 w-3", n <= r.rating ? "fill-sky-700 text-sky-700" : "fill-slate-200 text-slate-200")} />
                    ))}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{r.title}</span>
                </div>
                <span className="text-xs font-normal text-slate-600 tabular-nums">{r.date}</span>
              </div>
              <p className="mt-1.5 text-sm font-normal leading-relaxed text-slate-600">{r.body}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-normal text-slate-600">
                <span className="font-medium text-slate-900">{r.author}</span>
                <span>{r.role}</span>
                {reviewGrade && <span>Bought: {reviewGrade.short}</span>}
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3 flex-none" aria-hidden="true" />
                  {r.helpful} found this helpful
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
