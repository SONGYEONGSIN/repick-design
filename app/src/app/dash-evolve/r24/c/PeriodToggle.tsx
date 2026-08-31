"use client";

import type { Period } from "./data";

const OPTIONS: { value: Period; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

export default function PeriodToggle({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (
    <div role="radiogroup" aria-label="Period" className="inline-flex rounded-lg border border-zinc-200 bg-zinc-100 p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium outline-none transition-colors duration-150 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 motion-reduce:transition-none ${
              active ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
