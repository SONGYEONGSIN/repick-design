"use client";

import { useState } from "react";
import { FOCUS_RING, VALUE_CATEGORIES, VALUES, type ValueCategory } from "./data";

type FilterKey = "all" | ValueCategory;

const CHIPS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  ...VALUE_CATEGORIES.map((category) => ({ key: category.key as FilterKey, label: category.label })),
];

/**
 * Second wired interaction: clicking a category chip narrows the visible value cards by real React
 * state (not decorative) and the "Showing N of M" count is computed from the actual filtered array.
 */
export default function ValuesGrid() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = filter === "all" ? VALUES : VALUES.filter((value) => value.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter values by category" className="flex flex-wrap gap-2">
        {CHIPS.map((chip) => {
          const isActive = filter === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(chip.key)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                isActive
                  ? "border-amber-700 bg-amber-50 font-semibold text-amber-900"
                  : "border-zinc-200 bg-zinc-100 font-normal text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm font-normal text-zinc-600" aria-live="polite">
        Showing <span className="tabular-nums font-semibold text-zinc-900">{visible.length}</span> of{" "}
        <span className="tabular-nums font-semibold text-zinc-900">{VALUES.length}</span> values
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {visible.map((value) => (
          <li key={value.id} className="min-w-0 rounded-lg border border-zinc-200 bg-white p-5">
            <h3 className="font-semibold text-zinc-900">{value.title}</h3>
            <p className="mt-2 font-normal text-zinc-600">{value.body}</p>
            <span className="mt-3 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-normal text-zinc-600">
              {VALUE_CATEGORIES.find((category) => category.key === value.category)?.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
