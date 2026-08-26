"use client";

import { Building2, LayoutGrid, Video } from "lucide-react";
import { useState } from "react";
import { PEAK_DAILY_PCT, RESOURCE_STATS, WEEK_DAYS, type ResourceId } from "./data";
import { formatHours, formatPercent } from "./format";
import { ACCENT_FILL, ACCENT_SUBTLE, ACCENT_TEXT, BORDER, FOCUS, NUM, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, TRANSITION_SIZE, cx, r2 } from "./tokens";
import { Card, CardHeader, HoverTip } from "./ui";

/**
 * Resource rail — the page's secondary chart (horizontal bars, one row per resource, per
 * charts.catalog "Compare Categories"), doubling as the selection surface. Every headline number
 * (hours booked, avg occupancy) is always-visible text next to its bar; the 7-bar sparkline is
 * additionally disclosed on hover/focus into exact per-day percentages via a tooltip, never the
 * only source of the number. Selecting a row does NOT thread a raw id into siblings for a
 * highlight — the parent recomputes the week board, table and stat tiles from the filtered
 * dataset (see CorridorClient), which is the substantive difference from a shared-id highlight.
 */
export default function ResourceRail({
  selected,
  onSelect,
  className,
}: {
  selected: ResourceId | null;
  onSelect: (id: ResourceId | null) => void;
  className?: string;
}) {
  const [tipId, setTipId] = useState<ResourceId | null>(null);

  return (
    <Card ariaLabelledBy="resource-rail-heading" className={cx("flex flex-col gap-3", className)}>
      <CardHeader titleId="resource-rail-heading" Icon={Building2} title="Resources" description="Select one to filter the board, table and totals below" />

      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={cx(
          "flex h-9 items-center gap-2 rounded-lg border px-2.5 text-left text-xs",
          TRANSITION,
          FOCUS,
          selected === null ? cx(ACCENT_SUBTLE, "font-medium") : cx(BORDER, "bg-white font-normal", TEXT_CAPTION, "hover:bg-zinc-50"),
        )}
      >
        <LayoutGrid size={13} aria-hidden="true" />
        All resources
      </button>

      <ul className="flex flex-col gap-1">
        {RESOURCE_STATS.map(({ resource, weekHours, avgOccupancyPct, dailyPct }) => {
          const isSelected = selected === resource.id;
          const showTip = tipId === resource.id;
          const KindIcon = resource.kind === "Studio" ? Video : Building2;
          const domTipId = `resource-tip-${resource.id}`;
          return (
            <li key={resource.id} className="relative">
              <button
                type="button"
                aria-pressed={isSelected}
                aria-describedby={showTip ? domTipId : undefined}
                onClick={() => onSelect(isSelected ? null : resource.id)}
                onMouseEnter={() => setTipId(resource.id)}
                onMouseLeave={() => setTipId((k) => (k === resource.id ? null : k))}
                onFocus={() => setTipId(resource.id)}
                onBlur={() => setTipId((k) => (k === resource.id ? null : k))}
                className={cx(
                  "flex w-full flex-col gap-1.5 rounded-xl border px-2.5 py-2 text-left",
                  TRANSITION,
                  FOCUS,
                  isSelected ? "border-sky-300 bg-sky-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <KindIcon size={13} aria-hidden="true" className={isSelected ? ACCENT_TEXT : TEXT_CAPTION} />
                  <span className="min-w-0 flex-1">
                    <span className={cx("block truncate text-[13px] font-medium", TEXT_PRIMARY)}>{resource.name}</span>
                    <span className={cx("block truncate text-[11px]", TEXT_CAPTION_MUTED)}>
                      {resource.kind} · Floor {resource.floor} · Cap {resource.capacity}
                    </span>
                  </span>
                  <span className={cx("shrink-0 text-xs font-medium", NUM, isSelected ? ACCENT_TEXT : TEXT_CAPTION)}>{formatHours(weekHours)}</span>
                </span>

                <span className="flex h-4 items-stretch gap-[3px]" aria-hidden="true">
                  {dailyPct.map((pct, i) => {
                    const barHeight = pct === 0 ? 0 : r2(Math.max(18, Math.min(100, (pct / (PEAK_DAILY_PCT || 1)) * 100)));
                    return (
                      <span key={WEEK_DAYS[i].id} className="relative min-w-0 flex-1 overflow-hidden rounded-[1px] bg-zinc-100">
                        <span className={cx("absolute inset-x-0 bottom-0 rounded-[1px]", isSelected ? ACCENT_FILL : "bg-zinc-300", TRANSITION_SIZE)} style={{ height: `${barHeight}%` }} />
                      </span>
                    );
                  })}
                </span>
                <span className={cx("text-[11px]", TEXT_CAPTION_MUTED)}>{formatPercent(avgOccupancyPct)} avg daily occupancy this week</span>
              </button>

              {showTip ? (
                <HoverTip id={domTipId} className="left-2 right-2 top-full mt-1">
                  <p className="font-medium">Daily occupancy — {resource.name}</p>
                  <dl className="mt-1 grid grid-cols-7 gap-x-1.5 text-center">
                    {WEEK_DAYS.map((d, i) => (
                      <div key={d.id}>
                        <dt className="text-[9px] uppercase text-zinc-400">{d.label[0]}</dt>
                        <dd className={cx("text-[10px]", NUM)}>{dailyPct[i]}%</dd>
                      </div>
                    ))}
                  </dl>
                </HoverTip>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
