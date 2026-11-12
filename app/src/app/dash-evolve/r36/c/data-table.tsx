"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Pin, PinOff } from "lucide-react";
import { useMemo, useState } from "react";
import { channelLabel, formatInt, formatPercent, formatUsd, goalLabel, type CampaignWithMetrics } from "./data";
import { CHANNEL_SHAPE, FOCUS, HOVER_ROW, NUM, TEXT_DIM, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ChannelGlyph } from "./ui";

type SortKey = "name" | "spend" | "conversions" | "rate" | "cpa";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={12} aria-hidden="true" className="opacity-50" />;
  return dir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
}

/**
 * FIX #3 — the button's rendered height must not come purely from its text/icon
 * content at text-[11px]: that alone would line-box to roughly 14-16px tall, well
 * under the 24px target-size floor. `min-h-7` (28px) is an explicit CSS min-height,
 * which always wins over a smaller content box per spec — a flex item's rendered
 * height is `max(content height, min-height)`, so this button is guaranteed >=28px
 * regardless of font metrics. The extra 4px over the bare 24px minimum is
 * deliberate headroom against any sub-pixel/antialiasing rounding at the boundary.
 */
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
    <th scope="col" aria-sort={ariaSort} className={cx("px-2 py-1.5 align-bottom", className)}>
      <button
        type="button"
        onClick={() => onSort(sortableKey)}
        className={cx(
          "inline-flex min-h-7 items-center gap-1 rounded px-1.5 py-1 text-[11px] font-semibold uppercase tracking-[0.04em]",
          TRANSITION,
          FOCUS,
          active ? TEXT_PRIMARY : TEXT_DIM,
        )}
      >
        {label}
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

/**
 * The mandatory always-visible fallback for the scatter chart above it. Every
 * campaign's exact spend, conversions, rate and CPA is printed here in full
 * regardless of hover/pin state on the chart — sorting only reorders these rows,
 * never hides a number behind an interaction. This is also the only fully
 * keyboard-navigable path to the chart's pin/unpin action (see fix #2 in
 * scatter-chart.tsx): the Pin button below is a real, properly-sized, focusable
 * `<button>`, at ordinary row spacing, unlike the chart's own pointer-only marks.
 *
 * Every `<td>` carries `overflow-hidden` as a hard backstop against FIX #4's
 * failure mode: even if a column's percentage width ever runs tighter than a cell's
 * longest value at some viewport, the text clips inside its own cell instead of
 * visually bleeding into the next one. The colgroup widths below were sized from
 * each column's own longest real value (see candidates/c.md), and the extra
 * "Pin" column's width was taken from "Campaign" (a text column with slack), never
 * from a numeric column — Spend/Conversions/Rate/CPA keep their original room.
 */
export default function DataTable({
  items,
  pinnedIds,
  onTogglePin,
  onFocusRow,
}: {
  items: CampaignWithMetrics[];
  pinnedIds: Set<string>;
  onTogglePin: (id: string) => void;
  onFocusRow: (id: string | null) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("spend");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const dirMul = sortDir === "asc" ? 1 : -1;
    return [...items].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dirMul;
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
      {/* `relative` is load-bearing: the sr-only caption below is position:absolute,
          and without a positioned ancestor its containing block would skip this
          scroll boundary and paint at the pre-scroll layout position at 390px. This
          div is both the clip boundary and the containing block. */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse text-sm lg:min-w-0">
          <caption className="sr-only">
            {`Campaign performance, every currently filtered campaign: ${rows.length} rows. Columns are pin, campaign, channel, spend, conversions, conversion rate and cost per acquisition. Select a column header to sort by it.`}
          </caption>
          <colgroup>
            <col style={{ width: "9%" }} />
            <col style={{ width: "27%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-2 py-1.5">
                <span className="sr-only">Pin</span>
              </th>
              <SortableHead label="Campaign" sortableKey="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-left" />
              <th scope="col" className={cx("px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.04em]", TEXT_DIM)}>
                Channel
              </th>
              <SortableHead label="Spend" sortableKey="spend" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="Conv." sortableKey="conversions" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="Rate" sortableKey="rate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
              <SortableHead label="CPA" sortableKey="cpa" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((c) => {
              const pinned = pinnedIds.has(c.id);
              return (
                <tr key={c.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className="overflow-hidden px-2 py-2 align-middle">
                    <button
                      type="button"
                      aria-pressed={pinned}
                      onClick={() => onTogglePin(c.id)}
                      onFocus={() => onFocusRow(c.id)}
                      onBlur={() => onFocusRow(null)}
                      aria-label={`${pinned ? "Unpin" : "Pin"} ${c.name} on the scatter chart`}
                      className={cx("flex h-6 w-6 items-center justify-center rounded-full", TRANSITION, FOCUS, pinned ? "text-orange-400" : "text-zinc-400 hover:text-zinc-300")}
                    >
                      {pinned ? <PinOff size={14} aria-hidden="true" /> : <Pin size={14} aria-hidden="true" />}
                    </button>
                  </td>
                  <td
                    className="overflow-hidden px-2 py-2 align-middle"
                    onMouseEnter={() => onFocusRow(c.id)}
                    onMouseLeave={() => onFocusRow(null)}
                  >
                    <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{c.name}</span>
                    <span className="mt-0.5 inline-flex max-w-full items-center truncate rounded-full border border-white/10 bg-zinc-950 px-1.5 py-0.5 text-[9.5px] font-medium text-zinc-400">
                      {goalLabel(c.goal)}
                    </span>
                  </td>
                  <td className="overflow-hidden px-2 py-2 align-middle">
                    <span className="flex min-w-0 items-center gap-1.5 text-[12px] font-normal text-zinc-300">
                      <ChannelGlyph channel={c.channel} shape={CHANNEL_SHAPE[c.channel]} size={12} />
                      <span className="truncate">{channelLabel(c.channel)}</span>
                    </span>
                  </td>
                  <td className={cx("overflow-hidden whitespace-nowrap px-2 py-2 text-right align-middle text-[13px]", NUM, TEXT_PRIMARY)}>{formatUsd(c.m.spend)}</td>
                  <td className={cx("overflow-hidden whitespace-nowrap px-2 py-2 text-right align-middle text-[13px]", NUM, "text-zinc-300")}>{formatInt(c.m.conversions)}</td>
                  <td className={cx("overflow-hidden whitespace-nowrap px-2 py-2 text-right align-middle text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{formatPercent(c.m.conversionRate)}</td>
                  <td className={cx("overflow-hidden whitespace-nowrap px-2 py-2 text-right align-middle text-[13px]", NUM, "text-zinc-300")}>{formatUsd(c.m.cpa)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={cx("overflow-hidden px-2 py-6 text-center text-sm font-normal", TEXT_DIM)}>
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
