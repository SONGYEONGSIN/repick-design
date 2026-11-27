"use client";

import { X, Pin } from "lucide-react";
import {
  SELLERS,
  TOTALS,
  TIER_META,
  formatCurrency,
  formatCount,
  formatPercent,
  FOCUS_RING,
} from "./data";
import { TierBadge, TrendPill, Sparkline } from "./ui";

interface DetailCardProps {
  pinnedId: string | null;
  onClear: () => void;
}

export default function DetailCard({ pinnedId, onClear }: DetailCardProps) {
  const seller = pinnedId ? SELLERS.find((s) => s.id === pinnedId) ?? null : null;

  if (!seller) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-50">Marketplace snapshot</h2>
          <p className="text-xs font-normal text-zinc-400">Pin a seller from the rail or the chart to see it here.</p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] font-normal text-zinc-400">Sellers</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50">{formatCount(TOTALS.sellerCount)}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] font-normal text-zinc-400">Total revenue</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50">{formatCurrency(TOTALS.totalRevenue)}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] font-normal text-zinc-400">Avg. return rate</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-zinc-50">{formatPercent(TOTALS.avgReturnRatePct)}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] font-normal text-zinc-400">Flagged</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums text-amber-400">{formatCount(TOTALS.flaggedCount)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const meta = TIER_META[seller.tier];

  return (
    <div className={`rounded-xl border border-white/10 bg-zinc-900 p-4 ring-1 ring-inset sm:p-5 ${meta.ring}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-2 py-0.5 text-[11px] font-medium text-sky-300">
            <Pin aria-hidden="true" className="h-3 w-3" />
            Pinned
          </span>
          <h2 className="mt-1.5 truncate text-base font-semibold text-zinc-50">{seller.name}</h2>
          <p className="truncate text-xs font-normal text-zinc-400">{seller.category}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <X aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only font-normal">Unpin seller</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <TierBadge tier={seller.tier} />
        <TrendPill pts={seller.trend30dPts} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <dt className="text-[11px] font-normal text-zinc-400">Revenue (90d)</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{formatCurrency(seller.revenue)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-normal text-zinc-400">Return rate</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{formatPercent(seller.returnRatePct)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-normal text-zinc-400">Orders (90d)</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{formatCount(seller.orderVolume)}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-normal text-zinc-400">Avg. order value</dt>
          <dd className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{formatCurrency(seller.avgOrderValue)}</dd>
        </div>
      </dl>

      {/* Plain labeled fields (not a <dl>): the sparkline sitting beside its caption would
          otherwise be a non-dt/dd child of a dl > div group, which fails the definition-list
          structure rule — simpler to keep this pair outside the dl entirely. */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white/[0.03] px-3 py-2.5">
          <p className="text-[11px] font-normal text-zinc-400">Top return reason</p>
          <p className="mt-0.5 text-sm font-medium text-zinc-50">{seller.topReturnReason}</p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5">
          <div>
            <p className="text-[11px] font-normal text-zinc-400">Return-rate trend, 6 reviews</p>
            <p className="mt-0.5 text-xs font-normal text-zinc-400">{seller.tenureLabel} &middot; {seller.reviewedLabel}</p>
          </div>
          <Sparkline values={seller.sparkline} />
        </div>
      </div>
    </div>
  );
}
