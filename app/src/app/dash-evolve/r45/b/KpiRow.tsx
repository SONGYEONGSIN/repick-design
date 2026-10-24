"use client";

import { CircleDollarSign, Gauge, TrendingUp, Users } from "lucide-react";
import { grandTotal, totalAccounts } from "./data";
import { formatArr, formatCount, formatSignedArr } from "./format";
import { Card } from "./ui";

/** Every number in this row renders at text-xl (20px) at most — strictly smaller than the
 *  Mekko board's own headline readout (text-4xl / 36px, see MekkoBoard.tsx), so the dominant
 *  visualization's primary number always reads as the biggest figure on the page. */
export function KpiRow() {
  const total = grandTotal();
  const accounts = totalAccounts();

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <Card className="min-w-0 p-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-medium text-[11px] uppercase tracking-[0.06em]">Total ARR</span>
        </div>
        <p className="mt-2.5 font-semibold text-xl tabular-nums text-zinc-50">{formatArr(total)}</p>
        <p className="mt-1 font-normal text-[11px] text-zinc-400">Across 5 regions, Q4 2026</p>
      </Card>

      <Card className="min-w-0 p-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-medium text-[11px] uppercase tracking-[0.06em]">New ARR (QTD)</span>
        </div>
        <p className="mt-2.5 font-semibold text-xl tabular-nums text-emerald-400">{formatSignedArr(640)}</p>
        <p className="mt-1 font-normal text-[11px] text-zinc-400">New and expansion bookings</p>
      </Card>

      <Card className="min-w-0 p-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Gauge className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-medium text-[11px] uppercase tracking-[0.06em]">Net revenue retention</span>
        </div>
        <p className="mt-2.5 font-semibold text-xl tabular-nums text-zinc-50">112.0%</p>
        <p className="mt-1 font-normal text-[11px] text-zinc-400">Trailing 12 months</p>
      </Card>

      <Card className="min-w-0 p-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Users className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="font-medium text-[11px] uppercase tracking-[0.06em]">Active accounts</span>
        </div>
        <p className="mt-2.5 font-semibold text-xl tabular-nums text-zinc-50">{formatCount(accounts)}</p>
        <p className="mt-1 font-normal text-[11px] text-zinc-400">Billed and in good standing</p>
      </Card>
    </div>
  );
}
