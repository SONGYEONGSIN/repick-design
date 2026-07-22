"use client";

import { ArrowDownRight, ArrowUpRight, Calendar, MousePointerClick, User } from "lucide-react";
import { accountHealthTrend, formatDate, formatUsd, type AccountSnapshot } from "./data";
import { BORDER, QUADRANT, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, Card, CardHeader, EyebrowLabel, Sparkline } from "./ui";
import SignalsTable from "./SignalsTable";

export default function AccountDetailPanel({ account }: { account: AccountSnapshot | null }) {
  if (!account) {
    return (
      <Card className="flex h-full flex-col" padded={false}>
        <div className="p-4 sm:p-5">
          <CardHeader title="Account detail" titleId="account-detail-heading" description="Select a point in the scatter (or a row in the table) to inspect an account." />
        </div>
        <div className={cx("flex flex-1 flex-col items-center justify-center gap-2 border-t p-8 text-center", BORDER)}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-indigo-50 text-indigo-600">
            <MousePointerClick size={18} aria-hidden="true" />
          </span>
          <p className={cx("text-sm", TEXT_SECONDARY)}>Nothing selected yet</p>
        </div>
      </Card>
    );
  }

  const meta = QUADRANT[account.quadrant];
  const trend = accountHealthTrend(account);
  const delta = account.healthDeltaVsPriorPeriod;
  const deltaUp = delta >= 0;

  return (
    <Card className="flex h-full flex-col" padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader title="Account detail" titleId="account-detail-heading" description="Selecting a point syncs this panel and the signals table below." />
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="flex items-start gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-100">
            <account.Icon size={17} aria-hidden="true" className={TEXT_CAPTION} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={cx("line-clamp-2 text-base font-semibold leading-snug", TEXT_PRIMARY)}>{account.name}</p>
            <p className={cx("text-xs", TEXT_CAPTION)}>{account.industry}</p>
          </div>
          <Badge tone={meta.tone}>{meta.label}</Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2">
            <EyebrowLabel>Health score</EyebrowLabel>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <p className={cx("text-lg font-semibold tabular-nums", TEXT_PRIMARY)}>{account.health.toFixed(0)}</p>
              <span className={cx("inline-flex items-center gap-0.5 text-xs font-medium tabular-nums", deltaUp ? "text-emerald-700" : "text-rose-700")}>
                {deltaUp ? <ArrowUpRight size={12} aria-hidden="true" /> : <ArrowDownRight size={12} aria-hidden="true" />}
                {Math.abs(delta).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2">
            <EyebrowLabel>ARR</EyebrowLabel>
            <p className={cx("mt-0.5 truncate text-lg font-semibold tabular-nums", TEXT_PRIMARY)}>{formatUsd(account.arr)}</p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} aria-hidden="true" className={TEXT_CAPTION} />
            <dt className={cx("text-xs", TEXT_CAPTION)}>Renews</dt>
            <dd className={cx("ml-auto text-xs font-medium tabular-nums", TEXT_PRIMARY)}>{formatDate(account.renewalIso)}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <User size={13} aria-hidden="true" className={TEXT_CAPTION} />
            <dt className={cx("text-xs", TEXT_CAPTION)}>CSM owner</dt>
            <dd className={cx("ml-auto truncate text-xs font-medium", TEXT_PRIMARY)}>{account.csm}</dd>
          </div>
        </dl>
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="mb-2 flex items-center justify-between">
          <EyebrowLabel>8-week health trend</EyebrowLabel>
          <span className={cx("text-xs tabular-nums", TEXT_CAPTION)}>
            {trend[0].value.toFixed(0)} → {trend[trend.length - 1].value.toFixed(0)}
          </span>
        </div>
        <div className="h-11">
          <Sparkline values={trend.map((t) => t.value)} stroke={meta.strokeClass} fill={meta.dotClass} />
        </div>
      </div>

      <div className={cx("min-h-0 flex-1 border-t p-4 sm:p-5", BORDER)}>
        <SignalsTable account={account} />
      </div>
    </Card>
  );
}
