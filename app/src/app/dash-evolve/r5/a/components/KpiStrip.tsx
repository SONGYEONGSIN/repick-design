"use client";

import { AlertTriangle, Layers, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { INSTRUMENTS, POSITIONS } from "../lib/data";
import { formatUsdCompact } from "../lib/format";
import { NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";
import { Card } from "./ui";

function Tile({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: LucideIcon;
  label: string;
  value: string;
  tone?: "positive" | "negative" | "warning";
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-700 dark:text-emerald-400"
      : tone === "negative"
        ? "text-red-700 dark:text-red-400"
        : tone === "warning"
          ? "text-amber-700 dark:text-amber-400"
          : TEXT_PRIMARY;
  return (
    <Card className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon size={16} aria-hidden="true" className={TEXT_CAPTION} />
      </span>
      <span className="min-w-0">
        <span className={cx("block text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
        <span className={cx("block truncate text-lg font-semibold", NUM, toneClass)}>{value}</span>
      </span>
    </Card>
  );
}

export default function KpiStrip() {
  const open = POSITIONS.filter((p) => p.status === "오픈");
  const totalNotional = open.reduce((sum, p) => sum + p.notionalUsd, 0);
  const totalPnl = open.reduce((sum, p) => sum + p.pnlUsd, 0);
  const underHedged = INSTRUMENTS.filter((i) => i.hedgeRatioPct !== null && i.hedgeRatioPct < 60).length;

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <Tile Icon={Layers} label="오픈 포지션" value={`${open.length}건`} />
      <Tile Icon={Wallet} label="총 명목 익스포저" value={formatUsdCompact(totalNotional)} />
      <Tile
        Icon={totalPnl >= 0 ? TrendingUp : TrendingDown}
        label="미실현 손익"
        value={`${totalPnl >= 0 ? "+" : ""}${formatUsdCompact(totalPnl)}`}
        tone={totalPnl >= 0 ? "positive" : "negative"}
      />
      <Tile Icon={AlertTriangle} label="헤지 미달 종목" value={`${underHedged}종목`} tone={underHedged > 0 ? "warning" : undefined} />
    </div>
  );
}
