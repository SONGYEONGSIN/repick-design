"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Period, Vendor } from "./data";
import { cx } from "./ui";

interface Props {
  vendors: Vendor[];
  period: Period;
  pinnedId: string;
  onPin: (id: string) => void;
}

export default function VendorRail({ vendors, period, pinnedId, onPin }: Props) {
  const [query, setQuery] = useState("");
  const filtered = vendors.filter(
    (v) => v.name.toLowerCase().includes(query.toLowerCase()) || v.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex w-full min-w-0 shrink-0 flex-col gap-3 lg:w-64">
      <label className="relative block">
        <span className="sr-only">Filter vendors</span>
        <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter vendors"
          className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-8 pr-3 text-[13px] text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
        />
      </label>

      <ul className="flex flex-col gap-1">
        {filtered.map((v) => {
          const s = v.periods[period];
          const active = v.id === pinnedId;
          const over = s.median >= v.threshold;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => onPin(v.id)}
                aria-pressed={active}
                className={cx(
                  "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500",
                  active ? "border-rose-200 bg-rose-50" : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                )}
              >
                <span className="min-w-0">
                  <span className={cx("block truncate text-[13px] font-medium", active ? "text-rose-700" : "text-zinc-900")}>{v.name}</span>
                  <span className="block truncate text-[11px] text-zinc-600">{v.category}</span>
                </span>
                <span className={cx("shrink-0 text-[12px] font-semibold tabular-nums", over ? "text-rose-700" : "text-zinc-600")}>
                  {s.median}%
                </span>
              </button>
            </li>
          );
        })}
        {filtered.length === 0 && <li className="px-3 py-6 text-center text-[12px] text-zinc-400">No vendors match &ldquo;{query}&rdquo;.</li>}
      </ul>
    </div>
  );
}
