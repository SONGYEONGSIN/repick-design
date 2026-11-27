"use client";

import { useState } from "react";
import { CATEGORY_TOTALS, RISK_BAND_LABEL, pct, usdCompact } from "./data";
import { FOCUS_RING_INSET } from "./focus";
import { riskBandClass } from "./ui";

const TOTAL = CATEGORY_TOTALS.reduce((sum, c) => sum + c.spendUsd, 0);
const MAX = Math.max(...CATEGORY_TOTALS.map((c) => c.spendUsd));

/**
 * Small-multiples strip — totally independent of the graph's pinned node. Hover or focus here
 * only ever touches this component's own local state; it never reads or writes the pin, and the
 * pin never reads this. Two selection axes, two different dominant widgets, neither aware of
 * the other.
 */
export function CategorySpendStrip() {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <ul className="flex min-w-0 flex-col gap-1.5">
      {CATEGORY_TOTALS.map((c) => {
        const widthPct = Math.max(4, Math.round((c.spendUsd / MAX) * 1000) / 10);
        const sharePct = Math.round((c.spendUsd / TOTAL) * 1000) / 10;
        const c2 = riskBandClass(c.riskBand);
        const active = activeId === c.vendorId;
        return (
          <li key={c.vendorId} className="min-w-0">
            <button
              type="button"
              onMouseEnter={() => setActiveId(c.vendorId)}
              onMouseLeave={() => setActiveId((cur) => (cur === c.vendorId ? null : cur))}
              onFocus={() => setActiveId(c.vendorId)}
              onBlur={() => setActiveId((cur) => (cur === c.vendorId ? null : cur))}
              className={`${FOCUS_RING_INSET} flex w-full min-w-0 flex-col gap-1 rounded-md px-2 py-1.5 text-left transition-colors motion-reduce:transition-none ${
                active ? "bg-white/[0.04]" : "hover:bg-white/[0.03]"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${c2.bg} ${c2.border} border`} />
                <span className="min-w-0 flex-1 truncate text-xs font-normal text-zinc-300">{c.category}</span>
                <span className="shrink-0 whitespace-nowrap text-xs font-medium tabular-nums text-zinc-50">{usdCompact(c.spendUsd)}</span>
              </span>
              <span className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <span className={`block h-full rounded-full ${c2.bar}`} style={{ width: `${widthPct}%` }} />
              </span>
              {active && (
                <span className="truncate text-[11px] font-normal text-zinc-400">
                  {pct(sharePct)} of total spend &middot; {c.vendorName} &middot; {RISK_BAND_LABEL[c.riskBand]} risk
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
