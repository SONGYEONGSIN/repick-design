"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { SELLERS, TIER_META, formatCurrencyCompact, formatPercent, FOCUS_RING, type QualityTier } from "./data";
import { Avatar } from "./ui";

type FilterKey = "all" | QualityTier;
type SortKey = "revenue" | "returnRate";

interface SellerRailProps {
  pinnedId: string | null;
  hoveredId: string | null;
  onPin: (id: string) => void;
  onHover: (id: string | null) => void;
}

export default function SellerRail({ pinnedId, hoveredId, onPin, onHover }: SellerRailProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("revenue");

  const chips: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: SELLERS.length },
    { key: "critical", label: "Critical", count: SELLERS.filter((s) => s.tier === "critical").length },
    { key: "watch", label: "Watch", count: SELLERS.filter((s) => s.tier === "watch").length },
    { key: "healthy", label: "Healthy", count: SELLERS.filter((s) => s.tier === "healthy").length },
  ];

  const filtered = useMemo(() => {
    const base = filter === "all" ? SELLERS : SELLERS.filter((s) => s.tier === filter);
    return [...base].sort((a, b) =>
      sortKey === "revenue" ? b.revenue - a.revenue : b.returnRatePct - a.returnRatePct
    );
  }, [filter, sortKey]);

  return (
    <section aria-labelledby="rail-heading" className="w-full shrink-0 lg:w-72">
      <div className="rounded-xl border border-white/10 bg-zinc-900">
        <div className="border-b border-white/10 p-4">
          <h2 id="rail-heading" className="text-sm font-semibold text-zinc-50">
            Sellers
          </h2>
          <p className="mt-0.5 text-xs font-normal text-zinc-400">
            Click a seller to pin it — the chart and detail card below update. Hovering only
            previews, nothing is saved.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter sellers by quality tier">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                aria-pressed={filter === chip.key}
                className={`min-h-6 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  filter === chip.key
                    ? "border-sky-400/60 bg-sky-500/15 text-sky-300"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
                }`}
              >
                {chip.label} <span className="tabular-nums">({chip.count})</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-normal text-zinc-400">
            <ArrowUpDown className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="shrink-0">Sort:</span>
            <div className="flex overflow-hidden rounded-md border border-white/10">
              {(["revenue", "returnRate"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortKey(key)}
                  aria-pressed={sortKey === key}
                  className={`min-h-6 px-2 py-1.5 font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    sortKey === key ? "bg-sky-500/20 text-sky-300" : "bg-transparent text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  {key === "revenue" ? "Revenue" : "Return rate"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="max-h-[34rem] divide-y divide-white/5 overflow-y-auto lg:max-h-[42rem]">
          {filtered.map((seller) => {
            const meta = TIER_META[seller.tier];
            const isPinned = seller.id === pinnedId;
            const isHovered = seller.id === hoveredId && !isPinned;
            return (
              <li key={seller.id}>
                <button
                  type="button"
                  onClick={() => onPin(seller.id)}
                  onMouseEnter={() => onHover(seller.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(seller.id)}
                  onBlur={() => onHover(null)}
                  aria-pressed={isPinned}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    isPinned ? "bg-sky-500/10" : isHovered ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <Avatar initials={seller.initials} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-zinc-50">{seller.name}</span>
                    </span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-zinc-400">{seller.category}</span>
                    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${meta.bg} ${meta.text}`}>
                        <meta.icon className="h-3 w-3" aria-hidden="true" />
                        {meta.label}
                      </span>
                      <span className="whitespace-nowrap text-[11px] font-normal tabular-nums text-zinc-400">
                        {formatCurrencyCompact(seller.revenue)} &middot; {formatPercent(seller.returnRatePct)}
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && (
            <li className="px-4 py-8 text-center text-sm font-normal text-zinc-400">No sellers match this filter.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
