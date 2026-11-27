"use client";

import { Pin } from "lucide-react";
import { Card, SectionLabel, Badge, ChangeReadout } from "./ui";
import { STATUS_META, CATEGORY_ICON, currencyFmt, countFmt, type Lot } from "./data";

/**
 * The one summary card that reacts to the watchlist pin. Nothing else on the
 * page updates when a row is pinned besides this card and the right-hand
 * detail pane — the chart and activity feed are deliberately independent.
 */
export function PinnedSummaryCard({ lot }: { lot: Lot }) {
  const meta = STATUS_META[lot.status];
  const CategoryIcon = CATEGORY_ICON[lot.category];

  return (
    <Card className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300" aria-hidden="true">
            <CategoryIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Pin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-indigo-300" />
              <SectionLabel as="h2">Pinned lot</SectionLabel>
            </div>
            <p className="truncate text-sm font-medium text-zinc-50">
              {lot.code} &middot; {lot.title}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Current price</p>
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-zinc-50" style={{ fontFamily: "var(--font-display-mono)" }}>
              {currencyFmt.format(lot.currentPrice)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Today</p>
            <p className="mt-0.5 text-sm">
              <ChangeReadout pct={lot.dayChangePct} />
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Active bids</p>
            <p className="mt-0.5 text-sm font-medium tabular-nums text-zinc-50">{countFmt.format(lot.bidCount)}</p>
          </div>
          <Badge tone={lot.status === "active" ? "emerald" : lot.status === "review" ? "amber" : lot.status === "reserved" ? "teal" : "zinc"} icon={meta.icon}>
            {meta.label}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
