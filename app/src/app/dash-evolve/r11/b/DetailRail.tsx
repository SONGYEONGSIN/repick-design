"use client";

import { ArrowDown, ArrowUp, BadgeCheck, Building2, Equal } from "lucide-react";
import Image from "next/image";
import type { AccountContribution, BridgeBar, MetricId } from "./data";
import { formatMetric, formatMetricSigned, unsplashAvatar } from "./data";
import { BORDER, DIVIDE, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, CardHeader, EyebrowLabel, NUM } from "./ui";

export default function DetailRail({
  bar,
  metric,
  accounts,
  leadOwner,
  startLabel,
  endLabel,
}: {
  bar: BridgeBar;
  metric: MetricId;
  accounts: AccountContribution[];
  leadOwner: { name: string; role: string; avatarId: string } | null;
  startLabel: string;
  endLabel: string;
}) {
  const isAnchor = bar.kind === "anchor";
  const Icon = isAnchor ? Equal : bar.kind === "positive" ? ArrowUp : ArrowDown;
  const tone = isAnchor ? "info" : bar.kind === "positive" ? "good" : "bad";

  return (
    <div className="flex h-full flex-col">
      <CardHeader
        as="h2"
        titleId="detail-heading"
        title="Selected driver"
        description={isAnchor ? "Anchor total — carries the running balance forward" : "Segment-level detail for the highlighted bridge bar"}
        action={
          <Badge tone={tone} Icon={Icon}>
            {isAnchor ? "Total" : bar.kind === "positive" ? "Growth" : "Attrition"}
          </Badge>
        }
      />

      <div className="mt-3">
        <h3 className={cx("text-base font-semibold leading-snug", TEXT_PRIMARY)}>{bar.label}</h3>
        <p className={cx("mt-1 text-2xl font-semibold tracking-tight", NUM, isAnchor ? TEXT_PRIMARY : bar.kind === "positive" ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>
          {isAnchor ? formatMetric(metric, bar.cumulativeAfter) : formatMetricSigned(metric, bar.signedValue)}
        </p>
        <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>Period: {startLabel} → {endLabel}</p>
      </div>

      <div className={cx("mt-4 grid grid-cols-2 gap-3 border-t pt-4", BORDER)}>
        <div>
          <EyebrowLabel>Running total before</EyebrowLabel>
          <p className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{bar.cumulativeBefore != null ? formatMetric(metric, bar.cumulativeBefore) : "—"}</p>
        </div>
        <div>
          <EyebrowLabel>Running total after</EyebrowLabel>
          <p className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatMetric(metric, bar.cumulativeAfter)}</p>
        </div>
      </div>

      {isAnchor ? (
        <div className={cx("mt-4 flex items-start gap-2.5 rounded-xl border p-3", BORDER, "bg-zinc-50 dark:bg-zinc-950/60")}>
          <BadgeCheck size={16} aria-hidden="true" className={cx("mt-0.5 shrink-0", TEXT_CAPTION)} />
          <p className={cx("text-xs leading-relaxed", TEXT_SECONDARY)}>
            {bar.key === "start"
              ? "Carried forward from the prior period's ending balance — the floor this bridge builds from."
              : "Verified against the billing ledger after new business, expansion, reactivation, contraction and churn are applied."}
          </p>
        </div>
      ) : (
        <>
          {leadOwner ? (
            <div className={cx("mt-4 border-t pt-4", BORDER)}>
              <EyebrowLabel>Segment lead</EyebrowLabel>
              <div className="mt-2 flex items-center gap-2.5">
                <Image src={unsplashAvatar(leadOwner.avatarId, 72)} alt={`${leadOwner.name} profile photo`} width={36} height={36} className="h-9 w-9 shrink-0 rounded-full border border-zinc-200 object-cover dark:border-white/10" />
                <div className="min-w-0 flex-1">
                  <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{leadOwner.name}</p>
                  <p className={cx("truncate text-xs", TEXT_CAPTION)}>{leadOwner.role} · largest contributor to this driver</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className={cx("mt-4 flex-1 border-t pt-4", BORDER)}>
            <EyebrowLabel>Top contributing accounts</EyebrowLabel>
            <ul className={cx("mt-2 divide-y", DIVIDE)}>
              {accounts.map((acc) => (
                <li key={acc.name} className="flex items-center gap-2.5 py-2">
                  <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
                    <Building2 size={14} aria-hidden="true" />
                  </span>
                  <span className={cx("min-w-0 flex-1 truncate text-sm", TEXT_PRIMARY)}>{acc.name}</span>
                  <span className={cx("shrink-0 text-sm font-medium", NUM, acc.amount >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300")}>{formatMetricSigned(metric, acc.amount, true)}</span>
                </li>
              ))}
            </ul>
            <p className={cx("mt-2 text-[11px] leading-snug", TEXT_CAPTION)}>These four accounts sum exactly to this driver&rsquo;s bridge bar value.</p>
          </div>
        </>
      )}
    </div>
  );
}
