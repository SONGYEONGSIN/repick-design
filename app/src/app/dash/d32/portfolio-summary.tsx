import { PORTFOLIO_CHANGE_24H_PCT, PORTFOLIO_CHANGE_24H_USD, TOTAL_BALANCE, formatUSD } from "./data";
import { Card, ChangeBadge } from "./ui";
import AllocationDonut from "./allocation-donut";

/**
 * Right-rail portfolio summary: hero total balance + 24h P/L, then a compact
 * allocation donut. Replaces the old 4-card KPI row — one hero number with
 * supporting stats instead of a repeated card grid.
 */
export default function PortfolioSummary() {
  const isGain = PORTFOLIO_CHANGE_24H_USD >= 0;

  return (
    <Card id="portfolio-summary" title="포트폴리오 요약" description="전체 보유 자산 기준" bodyClassName="px-5 pb-5">
      <div className="mt-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">총 자산 가치</p>
        <p className="mt-1.5 text-3xl font-semibold tabular-nums text-zinc-50">{formatUSD(TOTAL_BALANCE)}</p>
        <div className="mt-2 flex items-center gap-2">
          <ChangeBadge value={PORTFOLIO_CHANGE_24H_PCT} size="sm" />
          <span className={isGain ? "text-xs tabular-nums text-emerald-400" : "text-xs tabular-nums text-red-400"}>
            {isGain ? "+" : ""}
            {formatUSD(PORTFOLIO_CHANGE_24H_USD)} (24시간)
          </span>
        </div>
      </div>

      <div className="mt-5 border-t border-white/5 pt-5">
        <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">자산 배분</p>
        <AllocationDonut />
      </div>
    </Card>
  );
}
