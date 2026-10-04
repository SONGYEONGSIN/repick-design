"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { channelLabel, formatInt, formatPercent, formatUsd, formatUsdPrecise, objectiveLabel, type CampaignWithMetrics } from "./data";
import { CHANNEL_SHAPE, FOCUS, HOVER_ROW, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ChannelGlyph } from "./ui";

type SortKey = "name" | "spend" | "clicks" | "conversions" | "rate" | "cpa";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={12} aria-hidden="true" className="opacity-50" />;
  return dir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
}

function SortableHead({
  label,
  sortableKey,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  sortableKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortableKey;
  const ariaSort: "ascending" | "descending" | "none" = !active ? "none" : sortDir === "asc" ? "ascending" : "descending";
  return (
    <th scope="col" aria-sort={ariaSort} className={cx("px-2 py-2 align-bottom", className)}>
      <button
        type="button"
        onClick={() => onSort(sortableKey)}
        className={cx("inline-flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-[0.04em]", TRANSITION, FOCUS, active ? TEXT_PRIMARY : TEXT_MUTED)}
      >
        {label}
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

/**
 * The mandatory always-visible fallback for the scatter above it (charts.catalog
 * B-grade scatter/bubble row: "required fallback ... supporting data table"). Every
 * campaign's exact spend, clicks, conversions, rate and CPA is printed here in full
 * regardless of hover/pin state on the chart — sorting only reorders these rows, it
 * never hides a number behind an interaction. This is also the fully
 * keyboard-navigable path to every plotted value, independent of the chart's own
 * (smaller) set of focusable bubbles.
 */
export default function DataTable({ items }: { items: CampaignWithMetrics[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const dirMul = sortDir === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dirMul;
      if (sortKey === "clicks") return (a.m.clicks - b.m.clicks) * dirMul;
      if (sortKey === "conversions") return (a.m.conversions - b.m.conversions) * dirMul;
      if (sortKey === "rate") return (a.m.conversionRate - b.m.conversionRate) * dirMul;
      if (sortKey === "cpa") return (a.m.cpa - b.m.cpa) * dirMul;
      return (a.m.spend - b.m.spend) * dirMul;
    });
  }, [items, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div>
      {/* `relative` is load-bearing: the sr-only caption below is position:absolute, and
          without a positioned ancestor its containing block would skip this scroll
          boundary and paint at the pre-scroll layout position at 390px (page-brief-core
          §2 "sr-only anchor"). This div is both the clip boundary and the containing block. */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[760px] lg:min-w-0 table-fixed border-collapse text-sm">
          <caption className="sr-only">
            {`Campaign performance, every currently filtered campaign: ${rows.length} rows. Columns are campaign, channel, objective, spend, clicks, conversions, conversion rate and cost per acquisition. Select a column header to sort by it.`}
          </caption>
          <colgroup>
            <col style={{ width: "23%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "9%" }} />
            <col style={{ width: "9%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <SortableHead label="Campaign" sortableKey="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-left" />
              <th scope="col" className={cx("px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em]", TEXT_MUTED)}>
                Channel
              </th>
              <th scope="col" className={cx("px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.04em]", TEXT_MUTED)}>
                Objective
              </th>
              <SortableHead label="Spend" sortableKey="spend" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="Clicks" sortableKey="clicks" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="Conversions" sortableKey="conversions" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="Rate" sortableKey="rate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="CPA" sortableKey="cpa" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((c) => (
              <tr key={c.id} className={cx(HOVER_ROW, TRANSITION)}>
                <td className="px-2 py-2.5 align-middle">
                  <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{c.name}</span>
                </td>
                <td className="px-2 py-2.5 align-middle">
                  <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-normal text-zinc-300">
                    <ChannelGlyph channel={c.channel} shape={CHANNEL_SHAPE[c.channel]} size={12} />
                    <span className="truncate">{channelLabel(c.channel)}</span>
                  </span>
                </td>
                <td className="px-2 py-2.5 align-middle">
                  <span className={cx("inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10.5px] font-medium leading-none", "border-white/10 bg-zinc-950", TEXT_MUTED)}>
                    {objectiveLabel(c.objective)}
                  </span>
                </td>
                <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(c.m.spend)}</td>
                <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] whitespace-nowrap", NUM, "text-zinc-300")}>{formatInt(c.m.clicks)}</td>
                <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] whitespace-nowrap", NUM, "text-zinc-300")}>{formatInt(c.m.conversions)}</td>
                <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatPercent(c.m.conversionRate)}</td>
                <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] whitespace-nowrap", NUM, "text-zinc-300")}>{formatUsdPrecise(c.m.cpa)}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className={cx("px-2 py-6 text-center text-sm font-normal", TEXT_AUX)}>
                  No campaigns match the current filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
