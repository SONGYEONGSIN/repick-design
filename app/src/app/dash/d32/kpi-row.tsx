import { ArrowDownRight, ArrowUpRight, Layers, TrendingUp, Wallet } from "lucide-react";
import {
  BEST_PERFORMER,
  HOLDINGS,
  PORTFOLIO_CHANGE_24H_PCT,
  PORTFOLIO_CHANGE_24H_USD,
  TOTAL_BALANCE,
  WATCHLIST,
  formatUSD,
} from "./data";
import { Card, ChangeBadge, SectionLabel } from "./ui";
import { cn } from "./utils";

function KpiCard({
  label,
  icon: Icon,
  iconClassName,
  value,
  footer,
}: {
  label: string;
  icon: typeof Wallet;
  iconClassName: string;
  value: string;
  footer: React.ReactNode;
}) {
  return (
    <Card className="col-span-6 xl:col-span-3" bodyClassName="p-5">
      <div className="flex items-center justify-between gap-2">
        <SectionLabel>{label}</SectionLabel>
        <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconClassName)}>
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      <p className="mt-3 truncate text-2xl font-semibold tabular-nums text-zinc-50">{value}</p>
      <div className="mt-2 min-h-6">{footer}</div>
    </Card>
  );
}

export default function KpiRow() {
  const isGain = PORTFOLIO_CHANGE_24H_USD >= 0;

  return (
    <div className="col-span-12 grid grid-cols-12 gap-4">
      <KpiCard
        label="총 자산 가치"
        icon={Wallet}
        iconClassName="bg-indigo-500/15 text-indigo-300"
        value={formatUSD(TOTAL_BALANCE)}
        footer={<ChangeBadge value={PORTFOLIO_CHANGE_24H_PCT} size="sm" />}
      />

      <KpiCard
        label="24시간 손익"
        icon={isGain ? ArrowUpRight : ArrowDownRight}
        iconClassName={isGain ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}
        value={`${isGain ? "+" : ""}${formatUSD(PORTFOLIO_CHANGE_24H_USD)}`}
        footer={
          <span className={cn("text-xs font-medium tabular-nums", isGain ? "text-emerald-400" : "text-red-400")}>
            {isGain ? "전일 대비 상승" : "전일 대비 하락"}
          </span>
        }
      />

      <KpiCard
        label="베스트 퍼포머 (24H)"
        icon={TrendingUp}
        iconClassName="bg-emerald-500/15 text-emerald-400"
        value={BEST_PERFORMER.symbol}
        footer={<ChangeBadge value={BEST_PERFORMER.change24h} size="sm" />}
      />

      <KpiCard
        label="보유 · 워치리스트"
        icon={Layers}
        iconClassName="bg-white/10 text-zinc-300"
        value={`${HOLDINGS.length}종`}
        footer={<span className="text-xs tabular-nums text-zinc-500">워치리스트 {WATCHLIST.length}종 추적 중</span>}
      />
    </div>
  );
}
