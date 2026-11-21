"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, XCircle, Pin } from "lucide-react";
import {
  MONTHS,
  METRIC_META,
  TODAY_ISO,
  buildMonthGrid,
  formatCompactUnits,
  formatDateLong,
  formatPercent,
  formatSignedPercent,
  metricBandStops,
  metricBarPct,
  metricDeltaPct,
  metricDomain,
  metricStatus,
  metricTarget,
  metricValue,
  type DayRecord,
  type Metric,
  type Status,
  type WarehouseId,
} from "./data";
import { Card, SegmentedControl, cn, FOCUS_RING } from "./ui";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const METRIC_OPTIONS: { id: Metric; label: string }[] = [
  { id: "shipped", label: "Shipped" },
  { id: "onTime", label: "On-time %" },
];

const STATUS_ICON = { good: CheckCircle2, watch: AlertTriangle, critical: XCircle } as const;
const STATUS_LABEL: Record<Status, string> = { good: "on target", watch: "watch", critical: "at risk" };
const STATUS_ICON_CLASS: Record<Status, string> = { good: "text-emerald-700", watch: "text-amber-700", critical: "text-rose-700" };
const STATUS_FILL_CLASS: Record<Status, string> = { good: "bg-emerald-500", watch: "bg-amber-500", critical: "bg-rose-500" };
const STATUS_TEXT_CLASS: Record<Status, string> = { good: "text-emerald-700", watch: "text-amber-700", critical: "text-rose-700" };

function primaryValueLabel(record: DayRecord, metric: Metric): string {
  const v = metricValue(record, metric);
  if (v === null) return "—";
  return metric === "shipped" ? formatCompactUnits(v) : formatPercent(v, 1);
}

function targetLabel(record: DayRecord, metric: Metric): string {
  const t = metricTarget(record, metric);
  return metric === "shipped" ? `Target ${formatCompactUnits(t)}` : `Target ${formatPercent(t, 0)}`;
}

function cellDescription(record: DayRecord, metric: Metric, pinned: boolean): string {
  const dateLabel = formatDateLong(record);
  const todayStr = record.iso === TODAY_ISO ? ", today" : "";
  const pinStr = pinned ? ", pinned" : "";
  if (record.isFuture) return `${dateLabel}${todayStr} — scheduled, ${targetLabel(record, metric).toLowerCase()}${pinStr}`;
  const v = metricValue(record, metric);
  const t = metricTarget(record, metric);
  const status = metricStatus(record, metric);
  const delta = metricDeltaPct(record, metric);
  const valueStr = metric === "shipped" ? `${v} units` : `${formatPercent(v ?? 0, 1)}`;
  const targetStr = metric === "shipped" ? `${t} target` : `${formatPercent(t, 0)} target`;
  return `${dateLabel}${todayStr} — ${METRIC_META[metric].label} ${valueStr} of ${targetStr}, ${formatSignedPercent(delta ?? 0)}, ${status ? STATUS_LABEL[status] : ""}${pinStr}`;
}

function readoutText(record: DayRecord, metric: Metric): string {
  const dateLabel = formatDateLong(record);
  if (record.isFuture) return `${dateLabel} — scheduled, ${targetLabel(record, metric).toLowerCase()}, no actuals yet.`;
  const v = metricValue(record, metric);
  const t = metricTarget(record, metric);
  const status = metricStatus(record, metric);
  const delta = metricDeltaPct(record, metric);
  const valueStr = metric === "shipped" ? `${formatCompactUnits(v ?? 0)} units shipped` : `${formatPercent(v ?? 0, 1)} on-time`;
  const targetStr = metric === "shipped" ? `${formatCompactUnits(t)} target` : `${formatPercent(t, 0)} target`;
  return `${dateLabel} — ${valueStr} of ${targetStr} (${formatSignedPercent(delta ?? 0)}) · ${status ? STATUS_LABEL[status] : ""}`;
}

export function ShippingCalendar({
  warehouseId,
  metric,
  onMetricChange,
  monthIndex,
  onMonthIndexChange,
  pinnedIso,
  onTogglePin,
}: {
  warehouseId: WarehouseId;
  metric: Metric;
  onMetricChange: (m: Metric) => void;
  monthIndex: number;
  onMonthIndexChange: (i: number) => void;
  pinnedIso: string | null;
  onTogglePin: (iso: string) => void;
}) {
  const month = MONTHS[monthIndex];
  const grid = buildMonthGrid(monthIndex, warehouseId);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function firstInMonthIndex(): number {
    const i = grid.findIndex((c) => c.inMonth);
    return i >= 0 ? i : 0;
  }
  function lastInMonthIndex(): number {
    for (let i = grid.length - 1; i >= 0; i--) if (grid[i].inMonth) return i;
    return grid.length - 1;
  }
  function indexOfIso(iso: string | null): number {
    if (!iso) return firstInMonthIndex();
    const i = grid.findIndex((c) => c.record?.iso === iso);
    return i >= 0 ? i : firstInMonthIndex();
  }

  // Ephemeral, local-only hover state — never lifted or persisted. Reset
  // whenever the warehouse or visible month changes, via React's documented
  // "adjust state during render" pattern rather than a setState-in-effect.
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(() => indexOfIso(pinnedIso ?? TODAY_ISO));
  const resetKey = `${warehouseId}:${month.key}`;
  const [prevResetKey, setPrevResetKey] = useState(resetKey);
  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey);
    setHoveredIso(null);
    setFocusIndex(indexOfIso(pinnedIso ?? TODAY_ISO));
  }

  function move(delta: number) {
    setFocusIndex((i) => {
      const next = i + delta;
      if (next < 0 || next >= grid.length || !grid[next].inMonth) return i;
      cellRefs.current[next]?.focus();
      return next;
    });
  }

  function onGridKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); move(7); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-7); }
    else if (e.key === "Home") { e.preventDefault(); const i = firstInMonthIndex(); setFocusIndex(i); cellRefs.current[i]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); const i = lastInMonthIndex(); setFocusIndex(i); cellRefs.current[i]?.focus(); }
  }

  // Guarded ephemeral preview: suppressed when the hovered cell is the
  // pinned cell, since the Day detail panel already shows that reading.
  const showHoverPreview = hoveredIso !== null && hoveredIso !== pinnedIso;
  const hoveredCell = showHoverPreview ? grid.find((c) => c.record?.iso === hoveredIso) ?? null : null;

  return (
    <section aria-labelledby="shipping-calendar-heading" className="min-w-0">
      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 id="shipping-calendar-heading" className="sr-only">Shipping calendar</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onMonthIndexChange(monthIndex - 1)}
              disabled={monthIndex === 0}
              aria-label="Previous month"
              className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30", FOCUS_RING)}
            >
              <ChevronLeft aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
            <p className="w-36 text-center text-base font-semibold text-zinc-900 sm:w-40">
              {month.label}
            </p>
            <button
              type="button"
              onClick={() => onMonthIndexChange(monthIndex + 1)}
              disabled={monthIndex === MONTHS.length - 1}
              aria-label="Next month"
              className={cn("flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-30", FOCUS_RING)}
            >
              <ChevronRight aria-hidden="true" className="h-4.5 w-4.5" />
            </button>
          </div>

          <div className="ml-auto">
            <SegmentedControl label="Calendar metric" options={METRIC_OPTIONS} value={metric} onChange={onMetricChange} />
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w} className="text-center text-[11px] font-medium uppercase tracking-wide text-zinc-500">{w}</div>
          ))}
        </div>

        <div
          role="group"
          aria-label={`${month.label} calendar, ${METRIC_META[metric].label.toLowerCase()} against target`}
          onKeyDown={onGridKeyDown}
          className="grid grid-cols-7 gap-1.5 sm:gap-2"
        >
          {grid.map((cell, i) => {
            if (!cell.inMonth || !cell.record) {
              return (
                <div key={cell.key} aria-hidden="true" className="flex aspect-square items-start justify-start rounded-lg border border-transparent p-1.5 text-[11px] font-normal text-zinc-500 sm:p-2">
                  {cell.displayDay}
                </div>
              );
            }
            const record = cell.record;
            const iso = record.iso;
            const isPinned = iso === pinnedIso;
            const isToday = iso === TODAY_ISO;
            const status = metricStatus(record, metric);
            const target = metricTarget(record, metric);
            const barPct = metricBarPct(record, metric);
            const { tickPct } = metricDomain(metric, target);
            const { criticalToPct, watchToPct } = metricBandStops(metric, target);
            const deltaPct = metricDeltaPct(record, metric);
            const StatusIcon = status ? STATUS_ICON[status] : null;
            const isHoverActive = showHoverPreview && hoveredIso === iso;

            return (
              <button
                key={cell.key}
                ref={(el) => { cellRefs.current[i] = el; }}
                type="button"
                tabIndex={i === focusIndex ? 0 : -1}
                aria-pressed={isPinned}
                onClick={() => { setFocusIndex(i); onTogglePin(iso); }}
                onFocus={() => { setFocusIndex(i); setHoveredIso(iso); }}
                onBlur={() => setHoveredIso((cur) => (cur === iso ? null : cur))}
                onMouseEnter={() => setHoveredIso(iso)}
                onMouseLeave={() => setHoveredIso((cur) => (cur === iso ? null : cur))}
                className={cn(
                  "group relative flex aspect-square flex-col justify-between rounded-lg border p-1.5 text-left transition-colors motion-reduce:transition-none sm:p-2",
                  FOCUS_RING,
                  isPinned ? "border-emerald-700 bg-emerald-50" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50",
                )}
              >
                <span className="sr-only">{cellDescription(record, metric, isPinned)}</span>

                <span aria-hidden="true" className="flex items-center justify-between gap-1">
                  <span className={cn("text-[11px] font-medium", isToday ? "flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-700 text-white" : "text-zinc-500")}>
                    {record.d}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {isPinned && <Pin className="h-3 w-3 shrink-0 fill-current text-emerald-700" />}
                    {StatusIcon && <StatusIcon className={cn("h-3 w-3 shrink-0", STATUS_ICON_CLASS[status as Status])} />}
                  </span>
                </span>

                {!record.isFuture ? (
                  <>
                    <span aria-hidden="true" className="relative mt-1 h-3.5 w-full overflow-hidden rounded-sm bg-zinc-100">
                      <span className="absolute inset-y-0 left-0 bg-rose-50" style={{ width: `${criticalToPct}%` }} />
                      <span className="absolute inset-y-0 bg-amber-50" style={{ left: `${criticalToPct}%`, width: `${Math.max(0, watchToPct - criticalToPct)}%` }} />
                      <span className="absolute inset-y-0 bg-emerald-50" style={{ left: `${watchToPct}%`, width: `${Math.max(0, 100 - watchToPct)}%` }} />
                      <span className={cn("absolute inset-y-0 left-0 rounded-sm", STATUS_FILL_CLASS[status as Status])} style={{ width: `${barPct}%` }} />
                      <span className="absolute inset-y-0 w-px bg-zinc-900/70" style={{ left: `${tickPct}%` }} />
                      <span
                        className={cn(
                          "absolute -top-0.5 -bottom-0.5 w-0.5 rounded-full bg-zinc-900 opacity-0 transition-opacity motion-reduce:transition-none",
                          isHoverActive && "opacity-100",
                        )}
                        style={{ left: `calc(${barPct}% - 1px)` }}
                      />
                    </span>
                    <span aria-hidden="true" className="mt-1 flex items-baseline justify-between text-[10px] leading-none sm:text-[10.5px]">
                      <span className="font-semibold tabular-nums text-zinc-900">{primaryValueLabel(record, metric)}</span>
                      <span className={cn("font-medium tabular-nums", STATUS_TEXT_CLASS[status as Status])}>{formatSignedPercent(deltaPct ?? 0)}</span>
                    </span>
                  </>
                ) : (
                  <span aria-hidden="true" className="mt-1 flex flex-1 flex-col items-start justify-center gap-0.5 border-t border-dashed border-zinc-200 pt-1">
                    <span className="text-[9.5px] font-medium uppercase tracking-wide text-zinc-500">Scheduled</span>
                    <span className="text-[10px] font-normal tabular-nums text-zinc-500">{targetLabel(record, metric)}</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-3 min-h-[2.25rem] rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-normal text-zinc-600">
          <span className="tabular-nums">
            {hoveredCell?.record ? readoutText(hoveredCell.record, metric) : "Hover or focus a day for its exact reading against target."}
          </span>
        </div>

        <div aria-hidden="true" className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-normal text-zinc-500">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />On target</span>
          <span className="flex items-center gap-1.5"><AlertTriangle className="h-3.5 w-3.5 text-amber-700" />Watch</span>
          <span className="flex items-center gap-1.5"><XCircle className="h-3.5 w-3.5 text-rose-700" />At risk</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-px bg-zinc-900/70" />Daily target tick</span>
          <span className="flex items-center gap-1.5"><Pin className="h-3 w-3 fill-current text-emerald-700" />Pinned</span>
        </div>
      </Card>
    </section>
  );
}
