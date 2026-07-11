"use client";

import { ArrowDownLeft, ArrowUpRight, Layers } from "lucide-react";
import { usePortfolio } from "./context";
import {
  BEST_PERFORMER,
  HOLDINGS,
  PORTFOLIO_CHANGE_24H_PCT,
  PORTFOLIO_CHANGE_24H_USD,
  TOTAL_BALANCE,
  WATCHLIST,
  WORST_PERFORMER,
  formatPrice,
  formatQty,
  formatUSD,
  formatUSDCompact,
  getMarketStats,
} from "./data";
import { AssetIcon, Card, ChangeBadge } from "./ui";

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2.5 text-sm last:border-b-0">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="tabular-nums text-zinc-200">{value}</dd>
    </div>
  );
}

export default function AssetDetailPanel() {
  const { selectedAssetId } = usePortfolio();

  if (selectedAssetId === "portfolio") {
    return (
      <Card
        id="asset-detail"
        title="포트폴리오 요약"
        description="전체 보유 자산 기준"
        className="col-span-12 xl:col-span-4"
        bodyClassName="px-5 pb-5"
      >
        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
            <Layers aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-2xl font-semibold tabular-nums text-zinc-50">{formatUSD(TOTAL_BALANCE)}</p>
            <div className="mt-1 flex items-center gap-2">
              <ChangeBadge value={PORTFOLIO_CHANGE_24H_PCT} size="sm" />
              <span className="text-[11px] tabular-nums text-zinc-500">
                {PORTFOLIO_CHANGE_24H_USD >= 0 ? "+" : ""}
                {formatUSD(PORTFOLIO_CHANGE_24H_USD)} (24시간)
              </span>
            </div>
          </div>
        </div>

        <dl className="mt-4">
          <StatRow label="보유 자산 수" value={`${HOLDINGS.length}종`} />
          <StatRow label="워치리스트" value={`${WATCHLIST.length}종`} />
        </dl>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-emerald-400">
              <ArrowUpRight aria-hidden="true" className="size-3.5" /> 베스트 퍼포머
            </p>
            <p className="mt-1.5 text-sm font-semibold text-zinc-100">{BEST_PERFORMER.symbol}</p>
            <ChangeBadge value={BEST_PERFORMER.change24h} size="sm" />
          </div>
          <div className="rounded-xl border border-white/5 bg-white/5 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-red-400">
              <ArrowDownLeft aria-hidden="true" className="size-3.5" /> 워스트 퍼포머
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

  return (
    <Card
      id="asset-detail"
      title={asset.name}
      description={holding ? "보유 중" : "워치리스트"}
      className="col-span-12 xl:col-span-4"
      bodyClassName="px-5 pb-5"
    >
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
          <StatRow label="보유 수량" value={`${formatQty(holding.qty, holding.decimals)} ${holding.symbol}`} />
          <StatRow label="평가 금액" value={formatUSD(holding.price * holding.qty)} />
        </dl>
      )}

      <dl className="mt-2">
        <StatRow label="시가총액" value={formatUSDCompact(stats.marketCap)} />
        <StatRow label="24시간 거래량" value={formatUSDCompact(stats.volume24h)} />
        <StatRow label="24시간 고가" value={formatPrice(stats.high24h)} />
        <StatRow label="24시간 저가" value={formatPrice(stats.low24h)} />
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          className="min-h-11 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-zinc-950 outline-none transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-emerald-600"
        >
          {asset.symbol} 매수
        </button>
        <button
          type="button"
          className="min-h-11 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-semibold text-zinc-100 outline-none transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:bg-white/15"
        >
          {asset.symbol} 매도
        </button>
      </div>
    </Card>
  );
}
