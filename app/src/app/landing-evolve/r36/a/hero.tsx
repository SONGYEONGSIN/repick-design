"use client";

import { ArrowRight, Minus, TrendingDown, TrendingUp } from "lucide-react";
import {
  CATEGORIES,
  formatDelta,
  type CategoryId,
  type CategorySummary,
  type GradeId,
  type SlopeRow,
} from "./data";
import { GradeCategoryControl } from "./grade-category-control";
import SlopeChart from "./slope-chart";
import { SpotlightThumb } from "./spotlight-thumb";
import { ACCENT_FILL, ACCENT_ON_FILL_TEXT, EYEBROW, FOCUS_RING, NUM } from "./tokens";

interface HeroProps {
  categoryId: CategoryId;
  gradeId: GradeId;
  onCategoryChange: (id: CategoryId) => void;
  onGradeChange: (id: GradeId) => void;
  hoveredGradeId: GradeId | null;
  onHoverGrade: (id: GradeId | null) => void;
  rows: SlopeRow[];
  selectedRow: SlopeRow;
  summary: CategorySummary;
  ctaLabel: string;
}

/**
 * Headline, subhead, CTA and the full grade/category device -- select, slider, slope chart,
 * hover detail and the four parallel listing thumbnails -- all live inside this one section.
 * Nothing proof-shaped is pushed to a sibling component below it.
 */
export function Hero({
  categoryId,
  gradeId,
  onCategoryChange,
  onGradeChange,
  hoveredGradeId,
  onHoverGrade,
  rows,
  selectedRow,
  summary,
  ctaLabel,
}: HeroProps) {
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0];
  const detailRow = rows.find((r) => r.grade.id === (hoveredGradeId ?? gradeId)) ?? selectedRow;
  const DirIcon = detailRow.direction === "up" ? TrendingUp : detailRow.direction === "down" ? TrendingDown : Minus;
  const verb = detailRow.direction === "up" ? "above" : detailRow.direction === "down" ? "below" : "right at";

  return (
    <section id="hero" className="border-b border-zinc-200">
      <div className="mx-auto max-w-[1280px] px-4 pb-14 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-start lg:gap-14">
          {/* Left: the argument */}
          <div className="min-w-0">
            <p className={`${EYEBROW} text-teal-700`}>Grading &amp; pricing confidence</p>
            <h1 className="mt-4 font-[var(--font-display-wide)] text-[clamp(2.25rem,1.7rem+2.4vw,3.75rem)] font-extrabold leading-[1.03] tracking-[-0.02em] text-zinc-950">
              A grade is a claim.
              <br />
              The price should agree with it.
            </h1>
            <p className="mt-5 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-600">
              Pick any condition grade and category on the right. The comparable listings redraw
              themselves instantly &mdash; what the seller asked, against the price repick&rsquo;s
              AI assigns for that exact condition.
            </p>
            <div className="mt-7">
              <a
                href="#listings"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold ${ACCENT_FILL} ${ACCENT_ON_FILL_TEXT} transition-opacity hover:opacity-90 ${FOCUS_RING}`}
              >
                {ctaLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className={`mt-6 text-sm font-normal text-zinc-500 ${NUM}`}>
              <span className="font-extrabold text-zinc-950">184,000+</span> comparable listings
              graded to date across repick.
            </p>
          </div>

          {/* Right: the device */}
          <div id="device" className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 sm:p-7">
            <p className={`${EYEBROW} text-zinc-500`}>Live comparison</p>
            <div className="mt-4">
              <GradeCategoryControl
                categoryId={categoryId}
                gradeId={gradeId}
                onCategoryChange={onCategoryChange}
                onGradeChange={onGradeChange}
                idPrefix="hero"
              />
            </div>

            <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
              <SlopeChart rows={rows} selectedGradeId={gradeId} hoveredGradeId={hoveredGradeId} onHoverGrade={onHoverGrade} />
            </div>

            <div className="mt-4 rounded-xl border border-teal-700/20 bg-teal-50/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    aria-live="polite"
                    className={`${NUM} font-[var(--font-display-wide)] text-[clamp(1.75rem,1.5rem+1vw,2.5rem)] font-extrabold leading-none text-zinc-950`}
                  >
                    {formatDelta(detailRow.delta)}
                  </p>
                  <p className="mt-1.5 max-w-[320px] text-sm font-normal leading-[1.5] text-zinc-600">
                    repick&rsquo;s AI price for this {detailRow.grade.label.toLowerCase()}-grade{" "}
                    {category.singular} is <span className="font-semibold text-zinc-950">{verb}</span> what the
                    seller listed it for.
                  </p>
                </div>
                <DirIcon className="mt-1 h-6 w-6 flex-none text-teal-700" aria-hidden="true" strokeWidth={2.5} />
              </div>
              <p className="mt-3 border-t border-teal-700/15 pt-3 text-xs font-normal leading-[1.5] text-zinc-600">
                {detailRow.item.reasonTags.join(" · ")}
              </p>
            </div>

            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
              All four {category.plural} grades, side by side
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {rows.map((r, i) => (
                <SpotlightThumb key={r.item.id} item={r.item} selected={r.grade.id === gradeId} preload={i === 0} />
              ))}
            </div>
            <p className="mt-3 text-xs font-normal leading-[1.5] text-zinc-500">
              Across {category.plural} right now: {summary.upCount} underpriced, {summary.downCount}{" "}
              overpriced, {summary.flatCount} already fair &mdash; average swing{" "}
              {summary.avgAbsDeltaPct.toFixed(1)}%.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
