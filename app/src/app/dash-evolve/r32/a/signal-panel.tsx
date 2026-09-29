"use client";

import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import type { Signal, Window } from "./data";
import { breakdownFor, casesFor, formatValue, formatWithUnit, isCurrentlyElevated, latestValue, visibleSlice } from "./data";
import SignalChart from "./signal-chart";
import CaseTable from "./case-table";
import { Card, FOCUS_RING, SignalStatusBadge, cx } from "./ui";

interface Props {
  signal: Signal;
  windowDays: Window;
  isPinned: boolean;
  onPin: (id: string) => void;
  onClose: () => void;
}

export default function SignalPanel({ signal, windowDays, isPinned, onPin, onClose }: Props) {
  // Ephemeral crosshair cursor — lives ONLY inside this panel, never lifted to a shared
  // "selectedId"/"hoveredId" prop threaded through the grid. It cannot collide with `isPinned`
  // (a boolean passed down from the parent's pin state) because the two never share a variable.
  const [cursor, setCursor] = useState<number | null>(null);

  const elevated = isCurrentlyElevated(signal);
  const compactPoints = visibleSlice(signal.series, windowDays);
  const fullPoints = signal.series; // pinned detail always shows the full 90-day history
  const displayPoints = isPinned ? fullPoints : compactPoints;
  const anomaliesInView = compactPoints.filter((p) => p.value >= signal.threshold).length;

  const breakdown = isPinned ? breakdownFor(signal) : [];
  const cases = isPinned ? casesFor(signal) : [];

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setCursor((c) => Math.min(displayPoints.length - 1, (c ?? displayPoints.length - 1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCursor((c) => Math.max(0, (c ?? displayPoints.length - 1) - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isPinned) onClose();
      else onPin(signal.id);
    } else if (e.key === "Escape") {
      setCursor(null);
    }
  }

  const label = `${signal.name}, ${formatWithUnit(signal, latestValue(signal))}, ${elevated ? "elevated above threshold" : "nominal"}. Press Enter to ${isPinned ? "close" : "pin"} detail view.`;

  return (
    <Card className={cx("relative flex h-full flex-col overflow-hidden", isPinned && "border-rose-200 ring-1 ring-rose-100")}>
      {isPinned && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Unpin ${signal.name}`}
          className={cx("absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700", FOCUS_RING)}
        >
          <X aria-hidden className="h-4 w-4" />
        </button>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-pressed={isPinned}
        aria-label={label}
        onClick={() => (isPinned ? undefined : onPin(signal.id))}
        onKeyDown={handleKeyDown}
        onFocus={() => setCursor(displayPoints.length - 1)}
        onBlur={() => setCursor(null)}
        className={cx("flex flex-1 flex-col gap-2.5 p-4 pb-3", isPinned ? "cursor-default" : "cursor-pointer", FOCUS_RING)}
      >
        <div className="flex items-start justify-between gap-2 pr-6">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium uppercase tracking-wide text-zinc-500">{signal.category}</p>
            <h3 className="truncate text-[13px] font-semibold text-zinc-900">{signal.name}</h3>
          </div>
          <SignalStatusBadge elevated={elevated} />
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-semibold tabular-nums text-zinc-900">{formatValue(signal, latestValue(signal))}</span>
          <span className="text-[12px] text-zinc-500">{signal.unit}</span>
        </div>

        <SignalChart
          signal={signal}
          points={displayPoints}
          width={isPinned ? 560 : 260}
          height={isPinned ? 190 : 84}
          variant={isPinned ? "expanded" : "compact"}
          cursorIndex={cursor}
          onCursorChange={setCursor}
        />

        <p className="text-[11px] text-zinc-500">
          {isPinned
            ? `Full 90-day history · threshold ${formatWithUnit(signal, signal.threshold)}`
            : `${anomaliesInView} anomal${anomaliesInView === 1 ? "y" : "ies"} in last ${windowDays}d · threshold ${formatWithUnit(signal, signal.threshold)}`}
        </p>
      </div>

      {isPinned && (
        <div className="grid grid-cols-1 gap-4 border-t border-zinc-100 p-4 pt-3.5">
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Root-cause breakdown</h4>
            <ul className="mt-2 flex flex-col gap-2">
              {breakdown.map((row) => (
                <li key={row.label} className="flex items-center gap-2">
                  <span className="w-28 shrink-0 truncate text-[11px] text-zinc-600">{row.label}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <span className="block h-full rounded-full bg-rose-500" style={{ width: `${row.share}%` }} />
                  </span>
                  <span className="w-8 shrink-0 text-right text-[11px] font-medium tabular-nums text-zinc-700">{row.share}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Related open cases</h4>
            <div className="mt-2">
              <CaseTable cases={cases} signalName={signal.name} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
