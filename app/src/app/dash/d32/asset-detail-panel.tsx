"use client";

import type { ReactNode } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "./context";
import {
  BEST_PERFORMER,
  HOLDINGS,
  WATCHLIST,
  WORST_PERFORMER,
  formatPrice,
  formatQty,
  formatUSD,
  formatUSDCompact,
  getMarketStats,
  getReturnPct,
} from "./data";
import { AssetIcon, Card, ChangeBadge } from "./ui";

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm last:border-b-0">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="tabular-nums text-zinc-200">{value}</dd>
    </div>
  );
}

/**
 * Selected-asset detail stats for the right rail. When the master selection
 * is "portfolio" itself, shows lightweight performance highlights instead of
 * repeating totals already shown in PortfolioSummary above it.
 */
export default function AssetDetailPanel() {
  const { selectedAssetId } = usePortfolio();

  if (selectedAssetId === "portfolio") {
    return (
      <Card id="asset-detail" title="Performance highlights" description="Best & worst 24h movers" bodyClassName="px-5 pb-5">
        <dl className="mt-3">
          <StatRow label="Holdings" value={`${HOLDINGS.length}`} />
          <StatRow label="Watchlist" value={`${WATCHLIST.length}`} />
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              <ArrowUpRight aria-hidden="true" className="size-3.5" /> Best performer
            </p>
            <p className="mt-1.5 text-sm font-semibold text-zinc-100">{BEST_PERFORMER.symbol}</p>
            <ChangeBadge value={BEST_PERFORMER.change24h} size="sm" />
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-red-400">
              <ArrowDownLeft aria-hidden="true" className="size-3.5" /> Worst performer
            </p>
            <p className="mt-1.5 text-sm font-semibold text-zinc-100">{WORST_PERFORMER.symbol}</p>
            <ChangeBadge value={WORST_PERFORMER.change24h} size="sm" />
          </div>
        </div>
      </Card>
    );
  }

  const holding = HOLDINGS.find((h) => h.id === selectedAssetId);
  const watch = WATCHLIST.find((w) => w.id === selectedAssetId);
  const asset = holding ?? watch!;
  const stats = getMarketStats(selectedAssetId);
  const returnPct = holding ? getReturnPct(holding) : 0;

  return (
    <Card id="asset-detail" title={asset.name} description={holding ? "In holdings" : "Watchlist"} bodyClassName="px-5 pb-5">
      <div className="mt-3 flex items-center gap-3">
        <AssetIcon symbol={asset.symbol} color={asset.color} size="lg" />
        <div>
          <p className="text-2xl font-semibold tabular-nums text-zinc-50">{formatPrice(asset.price)}</p>
          <div className="mt-1">
            <ChangeBadge value={asset.change24h} size="sm" />
          </div>
        </div>
      </div>

      {holding && (
        <dl className="mt-4">
          <StatRow label="Qty held" value={`${formatQty(holding.qty, holding.decimals)} ${holding.symbol}`} />
          <StatRow label="Avg. cost" value={formatPrice(holding.avgCost)} />
          <StatRow label="Market value" value={formatUSD(holding.price * holding.qty)} />
          <StatRow label="Return" value={<ChangeBadge value={returnPct} size="sm" />} />
        </dl>
      )}

      <dl className="mt-2">
        <StatRow label="Market cap" value={formatUSDCompact(stats.marketCap)} />
        <StatRow label="24h volume" value={formatUSDCompact(stats.volume24h)} />
        <StatRow label="24h high" value={formatPrice(stats.high24h)} />
        <StatRow label="24h low" value={formatPrice(stats.low24h)} />
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="min-h-11 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 outline-none transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-emerald-600"
        >
          Buy {asset.symbol}
        </button>
        <button
          type="button"
          className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-white/15"
        >
          Sell {asset.symbol}
        </button>
      </div>
    </Card>
  );
}
