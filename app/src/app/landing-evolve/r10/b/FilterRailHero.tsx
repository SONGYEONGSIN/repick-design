"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";
import {
  BUDGET_OPTIONS,
  CATEGORY_OPTIONS,
  CONDITION_OPTIONS,
  computeAggregate,
  cx,
  DISPLAY_FACE,
  EYEBROW,
  filterProducts,
  formatUSD,
  FOCUS,
  NUM,
  type BudgetId,
  type CategoryId,
  type ConditionId,
} from "./data";

/**
 * Filter chip — a real radio input with the visible pill layered exactly on
 * top of it (not `sr-only`-clipped), so the interactive hit target the a11y
 * gate measures is the full pill, not a 1px clipped input. See the writeup
 * for why `sr-only` was rejected here specifically.
 */
function FilterChip<T extends string>({
  name,
  option,
  selected,
  onSelect,
}: {
  name: string;
  option: { id: T; label: string };
  selected: boolean;
  onSelect: (id: T) => void;
}) {
  return (
    <label className="relative inline-flex cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={() => onSelect(option.id)}
        className={cx(
          "peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent",
          FOCUS,
        )}
      />
      <span
        className={cx(
          "pointer-events-none inline-flex min-h-[32px] items-center rounded-full border px-2.5 py-1 text-sm font-semibold transition-colors duration-150",
          selected
            ? "border-[#6E56CF] bg-[#6E56CF] text-white"
            : "border-zinc-300 bg-white text-[#0B0B0F] peer-hover:border-zinc-400",
        )}
      >
        {option.label}
      </span>
    </label>
  );
}

export default function FilterRailHero() {
  const [budget, setBudget] = useState<BudgetId>("all");
  const [category, setCategory] = useState<CategoryId>("all");
  const [condition, setCondition] = useState<ConditionId>("all");
  const railRef = useRef<HTMLUListElement>(null);

  const filtered = useMemo(
    () => filterProducts(budget, category, condition),
    [budget, category, condition],
  );
  const aggregate = useMemo(() => computeAggregate(filtered), [filtered]);

  function scrollRail(direction: -1 | 1) {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="hero-title" className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-10 pt-8 sm:px-8 sm:pb-24 sm:pt-16">
        <p className={cx(EYEBROW, "text-[#5A3FC0]")}>Live filters, live shelf</p>
        <h1
          id="hero-title"
          style={DISPLAY_FACE}
          className="mt-3 max-w-none text-[clamp(1.9rem,6vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-[#0B0B0F] sm:mt-4 sm:max-w-[20ch] sm:leading-[1.03]"
        >
          <span className="block sm:inline">Set three filters.</span>{" "}
          <span className="block sm:inline">The shelf answers.</span>
        </h1>
        <p className="mt-3 max-w-[46ch] text-base font-normal leading-[1.5] text-zinc-600 sm:mt-4 sm:leading-[1.6]">
          Budget, category, condition — change any one and every matching
          pick, its savings, and its match score recompute together, live.
        </p>

        {/* filters */}
        <div className="mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-10 sm:gap-y-5">
          <fieldset className="min-w-0">
            <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Budget
            </legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {BUDGET_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.id}
                  name="rail-budget"
                  option={opt}
                  selected={budget === opt.id}
                  onSelect={setBudget}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Category
            </legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.id}
                  name="rail-category"
                  option={opt}
                  selected={category === opt.id}
                  onSelect={setCategory}
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="min-w-0">
            <legend className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Condition
            </legend>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CONDITION_OPTIONS.map((opt) => (
                <FilterChip
                  key={opt.id}
                  name="rail-condition"
                  option={opt}
                  selected={condition === opt.id}
                  onSelect={setCondition}
                />
              ))}
            </div>
          </fieldset>
        </div>

        {/* aggregate proof — recomputes with every filter change, alongside the rail below */}
        <p aria-live="polite" className="sr-only">
          {aggregate.count} picks match your filters. Combined savings{" "}
          {formatUSD(aggregate.totalSaved)}. Average match {aggregate.avgMatch}{" "}
          percent.
        </p>
        <dl className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-200 pt-4 sm:mt-8 sm:gap-x-10 sm:gap-y-4 sm:pt-6">
          <div className="min-w-0">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Picks
            </dt>
            <dd
              className={cx(
                "mt-1 text-[clamp(1.5rem,3.4vw,2.5rem)] font-extrabold leading-none text-[#0B0B0F]",
                NUM,
              )}
            >
              {aggregate.count}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Saved
            </dt>
            <dd
              className={cx(
                "mt-1 text-[clamp(1.5rem,3.4vw,2.5rem)] font-extrabold leading-none text-[#0B0B0F]",
                NUM,
              )}
            >
              {formatUSD(aggregate.totalSaved)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-zinc-600">
              Avg. AI match
            </dt>
            <dd
              className={cx(
                "mt-1 text-[clamp(1.5rem,3.4vw,2.5rem)] font-extrabold leading-none text-[#0B0B0F]",
                NUM,
              )}
            >
              {aggregate.count > 0 ? `${aggregate.avgMatch}%` : "—"}
            </dd>
          </div>
        </dl>

        {/* rail */}
        <div className="mt-5 sm:mt-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              {aggregate.count > 0
                ? `${aggregate.count} matching pick${aggregate.count === 1 ? "" : "s"}`
                : "No picks match this exact combination"}
              {aggregate.count > 0 && (
                <span className="md:hidden"> — drag or use the arrows</span>
              )}
            </p>
            {aggregate.count > 0 && (
              <div className="flex shrink-0 gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => scrollRail(-1)}
                  aria-label="Scroll picks left"
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-[#0B0B0F] transition-colors duration-150 hover:border-zinc-400",
                    FOCUS,
                  )}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail(1)}
                  aria-label="Scroll picks right"
                  className={cx(
                    "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-[#0B0B0F] transition-colors duration-150 hover:border-zinc-400",
                    FOCUS,
                  )}
                >
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>

          {aggregate.count > 0 ? (
            <ul
              ref={railRef}
              role="list"
              aria-label="Matching picks"
              className="mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 motion-safe:scroll-smooth md:grid md:snap-none md:grid-cols-4 md:overflow-visible md:pb-0"
            >
              {filtered.map((p) => (
                <li key={p.id} className="w-[248px] shrink-0 snap-start sm:w-[268px] md:w-auto">
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 flex flex-col items-start gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10">
              <p className="text-base font-semibold text-[#0B0B0F]">
                No picks match every filter at once.
              </p>
              <p className="max-w-[46ch] text-sm font-normal leading-[1.6] text-zinc-600">
                Widen one filter — the shelf and the totals above fill back
                in immediately.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
