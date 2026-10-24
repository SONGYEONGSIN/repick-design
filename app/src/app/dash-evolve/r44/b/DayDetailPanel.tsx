"use client";

import { PinOff, Package, Gauge, AlertTriangle, CalendarClock } from "lucide-react";
import {
  EXCEPTIONS,
  TODAY_ISO,
  formatCompactUnits,
  formatDateLong,
  formatPercent,
  formatSignedPercent,
  getRecordByIso,
  metricDeltaPct,
  metricStatus,
  type Status,
  type WarehouseId,
} from "./data";
import { Card, Pill, cn, FOCUS_RING } from "./ui";

const STATUS_TONE: Record<Status, "good" | "watch" | "critical"> = { good: "good", watch: "watch", critical: "critical" };
const STATUS_LABEL: Record<Status, string> = { good: "On target", watch: "Watch", critical: "At risk" };

export function DayDetailPanel({
  warehouseId,
  warehouseName,
  pinnedIso,
  onClearPin,
}: {
  warehouseId: WarehouseId;
  warehouseName: string;
  pinnedIso: string | null;
  onClearPin: () => void;
}) {
  const isPinned = pinnedIso !== null;
  // Never an empty "select a day" placeholder: falls back to today's
  // reading at first paint when nothing is pinned yet.
  const iso = pinnedIso ?? TODAY_ISO;
  const record = getRecordByIso(warehouseId, iso);

  if (!record) {
    return (
      <Card className="flex h-full flex-col">
        <p className="text-sm font-normal text-zinc-500">No data for this day yet.</p>
      </Card>
    );
  }

  const dayExceptions = EXCEPTIONS.filter((e) => e.warehouseId === warehouseId && e.iso === iso);

  return (
    <Card className="flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn("text-[11px] font-medium uppercase tracking-wide", isPinned ? "text-emerald-700" : "text-zinc-500")}>
            {isPinned ? "Pinned day" : "Today — default"}
          </p>
          <h2 className="mt-1 text-base font-semibold text-zinc-900">{formatDateLong(record)}</h2>
        </div>
        {isPinned && (
          <button
            type="button"
            onClick={onClearPin}
            className={cn("inline-flex h-8 items-center gap-1 rounded-md border border-zinc-200 px-2 text-xs font-medium text-zinc-500 hover:text-zinc-900", FOCUS_RING)}
          >
            <PinOff className="h-3 w-3" aria-hidden="true" />
            Unpin
          </button>
        )}
      </div>

      <p className="mt-1 text-sm font-normal text-zinc-500">{warehouseName}</p>

      {record.isFuture ? (
        <div className="mt-4 flex flex-1 flex-col items-start justify-center gap-2 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-4">
          <CalendarClock className="h-4 w-4 text-zinc-500" aria-hidden="true" />
          <p className="text-sm font-normal text-zinc-600">
            This day hasn&apos;t happened yet. Daily target is{" "}
            <span className="font-medium tabular-nums text-zinc-900">{formatCompactUnits(record.shippedTarget)} units</span>, on-time
            floor <span className="font-medium tabular-nums text-zinc-900">{formatPercent(record.onTimeTarget, 0)}</span>.
          </p>
        </div>
      ) : (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="flex items-center gap-1.5 text-zinc-500">
              <Package className="h-3.5 w-3.5" aria-hidden="true" />
              Units shipped
            </dt>
            <dd className="mt-1 text-base font-semibold tabular-nums text-zinc-900">{formatCompactUnits(record.shippedUnits ?? 0)}</dd>
            <dd className="mt-0.5 text-[11px] font-normal tabular-nums text-zinc-500">
              of {formatCompactUnits(record.shippedTarget)} target ({formatSignedPercent(metricDeltaPct(record, "shipped") ?? 0)})
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-zinc-500">
              <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
              On-time rate
            </dt>
            <dd className="mt-1 text-base font-semibold tabular-nums text-zinc-900">{formatPercent(record.onTimePct ?? 0, 1)}</dd>
            <dd className="mt-0.5 text-[11px] font-normal tabular-nums text-zinc-500">
              of {formatPercent(record.onTimeTarget, 0)} floor ({formatSignedPercent(metricDeltaPct(record, "onTime") ?? 0)})
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-zinc-500">Shipped-volume status</dt>
            <dd className="mt-1">
              <Pill tone={STATUS_TONE[metricStatus(record, "shipped") ?? "good"]}>{STATUS_LABEL[metricStatus(record, "shipped") ?? "good"]}</Pill>
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="flex items-center gap-1.5 text-zinc-500">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Exceptions logged this day
            </dt>
            <dd className="mt-1 font-medium tabular-nums text-zinc-900">
              {dayExceptions.length === 0 ? "None" : `${dayExceptions.length} — ${dayExceptions.map((e) => e.issue).join("; ")}`}
            </dd>
          </div>
        </dl>
      )}
    </Card>
  );
}
