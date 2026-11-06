"use client";

import Image from "next/image";
import { BadgeCheck, Check, SearchX, ShieldCheck } from "lucide-react";
import {
  BUDGETS,
  CATEGORIES,
  TOLERANCES,
  findMatch,
  formatPrice,
  type Budget,
  type Category,
  type Tolerance,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700";

function PillGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-zinc-950">{label}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = opt === value;
          return (
            <button
              key={opt}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(opt)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-normal transition-colors motion-reduce:transition-none ${FOCUS} ${
                isActive
                  ? "border-orange-700 bg-orange-700 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-orange-700/50"
              }`}
            >
              {isActive && <Check className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />}
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function MatchQuiz({
  category,
  budget,
  tolerance,
  onCategory,
  onBudget,
  onTolerance,
}: {
  category: Category;
  budget: Budget;
  tolerance: Tolerance;
  onCategory: (v: Category) => void;
  onBudget: (v: Budget) => void;
  onTolerance: (v: Tolerance) => void;
}) {
  const { best, alts, poolSize } = findMatch(category, budget, tolerance);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start">
      <div className="flex flex-col gap-7">
        <PillGroup label="Category" options={CATEGORIES} value={category} onChange={onCategory} />
        <PillGroup label="Budget" options={BUDGETS} value={budget} onChange={onBudget} />
        <PillGroup
          label="Minimum condition"
          options={TOLERANCES}
          value={tolerance}
          onChange={onTolerance}
        />
      </div>

      <div aria-live="polite" className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
        {best ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
              {poolSize} match{poolSize === 1 ? "" : "es"} for {category} · {budget} ·{" "}
              {tolerance}
            </p>
            <div className="mt-4 flex items-start justify-between gap-3">
              <h3 className="text-lg font-extrabold tracking-[-0.02em] text-zinc-950">
                {best.name}
              </h3>
              <span className="inline-flex items-center rounded-full bg-orange-700 px-2.5 py-1 text-xs font-semibold text-white">
                {best.matchBase}% match
              </span>
            </div>

            <div
              className="relative mt-4 overflow-hidden rounded-xl bg-zinc-100"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src={`https://images.unsplash.com/photo-${best.photoId}?auto=format&fit=crop&w=800&q=80`}
                alt={best.alt}
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
                {best.grade}
              </span>
              {best.verified && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-700">
                &minus;{best.discountPct}% vs retail
              </span>
            </div>

            <p className="mt-4 text-2xl font-extrabold tabular-nums tracking-[-0.02em] text-zinc-950">
              {formatPrice(best.price)}
            </p>

            {alts.length > 0 && (
              <ul className="mt-5 space-y-2 border-t border-zinc-200 pt-4">
                {alts.map((alt) => (
                  <li
                    key={alt.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <BadgeCheck
                        className="h-3.5 w-3.5 text-orange-700"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-semibold text-zinc-900">{alt.name}</p>
                    </div>
                    <span className="text-sm font-normal tabular-nums text-zinc-600">
                      {formatPrice(alt.price)} · {alt.matchBase}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="flex flex-col items-start gap-2">
            <SearchX className="h-5 w-5 text-orange-700" aria-hidden="true" />
            <h3 className="text-base font-semibold text-zinc-950">
              No listings match this combination yet
            </h3>
            <p className="text-sm font-normal leading-[1.6] text-zinc-600">
              Try widening your budget or lowering the condition floor — new{" "}
              {category.toLowerCase()} listings are graded daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
