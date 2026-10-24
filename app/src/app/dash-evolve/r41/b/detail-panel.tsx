"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { CategoryEntry } from "./data";
import { categoryDeltaPct, categoryPercent } from "./data";
import { formatCurrency, formatPercent1, formatSignedPercent1 } from "./format";
import { CATEGORY_ICON } from "./category-icons";
import { Badge, Card, ProgressBar, Tabs } from "./ui";

type DetailTab = "overview" | "budget";

export default function DetailPanel({
  category,
  total,
  isLargest,
  comparisonLabel,
}: {
  category: CategoryEntry;
  total: number;
  isLargest: boolean;
  comparisonLabel: string;
}) {
  const [tab, setTab] = useState<DetailTab>("overview");
  const Icon = CATEGORY_ICON[category.id];
  const percent = categoryPercent(category, total);
  const delta = categoryDeltaPct(category);
  const remaining = category.allocated - category.amount;
  const usedPct = (category.amount / category.allocated) * 100;
  const DeltaIcon = delta >= 0 ? TrendingUp : TrendingDown;

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${category.color}26` }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" style={{ color: category.color }} />
          </span>
          <div>
            <h2 className="font-semibold text-sm text-zinc-50">{category.name}</h2>
            <p className="font-normal text-xs text-zinc-400">Selected category detail</p>
          </div>
        </div>
        {isLargest ? <Badge tone="accent">Largest category</Badge> : null}
      </div>

      <div className="mt-4">
        <Tabs
          ariaLabel="Detail view"
          value={tab}
          onChange={setTab}
          options={[
            { value: "overview", label: "Overview" },
            { value: "budget", label: "Budget" },
          ]}
        />
      </div>

      {tab === "overview" ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-normal text-xs uppercase tracking-wide text-zinc-400">Spend</span>
            <span className="font-semibold text-lg text-zinc-50 tabular-nums">{formatCurrency(category.amount)}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-normal text-xs uppercase tracking-wide text-zinc-400">Share of total</span>
            <span className="font-medium text-sm text-zinc-50 tabular-nums">{formatPercent1(percent)}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-normal text-xs uppercase tracking-wide text-zinc-400">{comparisonLabel}</span>
            <span className="flex items-center gap-1 font-medium text-sm text-zinc-50 tabular-nums">
              <DeltaIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
              {formatSignedPercent1(delta)}
            </span>
          </div>
          <p className="border-t border-white/10 pt-3 font-normal text-xs text-zinc-400">{category.note}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-normal text-xs uppercase tracking-wide text-zinc-400">Allocated</span>
            <span className="font-semibold text-lg text-zinc-50 tabular-nums">{formatCurrency(category.allocated)}</span>
          </div>
          <ProgressBar
            percent={usedPct}
            tone={usedPct > 100 ? "neutral" : "accent"}
            label={`${category.name} budget: ${formatCurrency(category.amount)} of ${formatCurrency(category.allocated)} used`}
          />
          <div className="flex items-baseline justify-between gap-2 text-xs">
            <span className="font-normal text-zinc-400">{formatPercent1(usedPct)} used</span>
            <span className="font-normal text-zinc-400 tabular-nums">
              {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(-remaining)} over`}
            </span>
          </div>
          <p className="border-t border-white/10 pt-3 font-normal text-xs text-zinc-400">
            Spend is {formatCurrency(category.amount)} against an allocated budget of {formatCurrency(category.allocated)}.
          </p>
        </div>
      )}
    </Card>
  );
}
