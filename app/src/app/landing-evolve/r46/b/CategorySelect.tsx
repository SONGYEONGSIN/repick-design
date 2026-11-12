"use client";

import { ChevronDown } from "lucide-react";
import { CATEGORY_OPTIONS, type Category } from "./data";

export function CategorySelect({
  value,
  onChange,
}: {
  value: Category;
  onChange: (category: Category) => void;
}) {
  return (
    <div>
      <label htmlFor="category-select" className="block text-[13px] font-semibold text-zinc-700">
        Category
      </label>
      <div className="relative mt-1.5 inline-block">
        <select
          id="category-select"
          value={value}
          onChange={(e) => onChange(e.target.value as Category)}
          className="appearance-none rounded-xl border border-zinc-300 bg-white py-1.5 pl-3.5 pr-9 text-[13px] font-semibold text-zinc-800 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
        />
      </div>
    </div>
  );
}
