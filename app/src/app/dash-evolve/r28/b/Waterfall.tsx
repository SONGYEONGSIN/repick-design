"use client";

import { useMemo, useState } from "react";
import { Pin } from "lucide-react";
import {
  formatMillions,
  formatSignedThousands,
  round2,
  type BridgeId,
  type BridgeStep,
  type CategoryId,
} from "./data";
import { cn, FOCUS_RING } from "./ui";

interface Bar {
  id: BridgeId;
  label: string;
  kind: BridgeStep["kind"];
  bottomPct: number;
  heightPct: number;
  topPct: number;
  barLeft: number;
  barWidth: number;
  center: number;
  runningTotal: number;
  previousTotal: number;
  value: number;
}

interface Connector {
  key: string;
  x1: number;
  x2: number;
  y: number;
}

const isCategory = (id: BridgeId): id is CategoryId => id !== "starting" && id !== "ending";

export function Waterfall({
  steps,
  pinnedId,
  onTogglePin,
}: {
  steps: BridgeStep[];
  pinnedId: CategoryId | null;
  onTogglePin: (id: CategoryId) => void;
}) {
  const [hoveredId, setHoveredId] = useState<BridgeId | null>(null);

  const { bars, connectors } = useMemo(() => {
    const n = steps.length;
    const colWidth = 100 / n;
    const barWidthFrac = 0.56;
    const scaleMax =
      Math.max(...steps.map((s) => Math.max(s.runningTotal, s.previousTotal))) * 1.12;

    const built: Bar[] = steps.map((step, i) => {
      const bottomValue = step.kind === "total" ? 0 : Math.min(step.previousTotal, step.runningTotal);
      const topValue = step.kind === "total" ? step.runningTotal : Math.max(step.previousTotal, step.runningTotal);
      const bottomPct = (bottomValue / scaleMax) * 100;
      const heightPct = Math.max(((topValue - bottomValue) / scaleMax) * 100, 1.4);
      const colLeft = i * colWidth;
      const barWidth = colWidth * barWidthFrac;
      const barLeft = colLeft + (colWidth - barWidth) / 2;
      const center = colLeft + colWidth / 2;
      return {
        id: step.id,
        label: step.label,
        kind: step.kind,
        bottomPct: round2(bottomPct),
        heightPct: round2(heightPct),
        topPct: round2(bottomPct + heightPct),
        barLeft: round2(barLeft),
        barWidth: round2(barWidth),
        center: round2(center),
        runningTotal: step.runningTotal,
        previousTotal: step.previousTotal,
        value: step.value,
      };
    });

    const builtConnectors: Connector[] = [];
    for (let i = 0; i < built.length - 1; i++) {
      const yLevel = round2(100 - (steps[i].runningTotal / scaleMax) * 100);
      builtConnectors.push({
        key: `${built[i].id}-${built[i + 1].id}`,
        x1: round2(built[i].barLeft + built[i].barWidth),
        x2: round2(built[i + 1].barLeft),
        y: yLevel,
      });
    }

    return { bars: built, connectors: builtConnectors };
  }, [steps]);

  const hoveredBar = bars.find((b) => b.id === hoveredId) ?? null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden="true" />
          Increase
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-rose-500" aria-hidden="true" />
          Decrease
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-zinc-900" aria-hidden="true" />
          Running total
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Pin className="h-3 w-3 text-cyan-600" aria-hidden="true" />
          Pinned step
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="relative h-56 sm:h-64">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full overflow-visible"
            >
              {[25, 50, 75].map((g) => (
                <line key={g} x1={0} y1={100 - g} x2={100} y2={100 - g} stroke="#f4f4f5" strokeWidth={0.5} />
              ))}
              <line x1={0} y1={99.5} x2={100} y2={99.5} stroke="#e4e4e7" strokeWidth={0.6} />
              {connectors.map((c) => (
                <line
                  key={c.key}
                  x1={c.x1}
                  y1={c.y}
                  x2={c.x2}
                  y2={c.y}
                  stroke="#a1a1aa"
                  strokeWidth={0.6}
                  strokeDasharray="1.6 1.6"
                />
              ))}
              {hoveredBar && (
                <line
                  x1={hoveredBar.center}
                  y1={0}
                  x2={hoveredBar.center}
                  y2={100}
                  stroke="#0891b2"
                  strokeWidth={0.5}
                  strokeDasharray="1.2 1.2"
                  opacity={0.5}
                />
              )}
            </svg>

            <div className="absolute inset-0">
              {bars.map((bar) => {
                const pinnable = isCategory(bar.id);
                const pinned = pinnable && pinnedId === bar.id;
                const barColor =
                  bar.kind === "total"
                    ? "bg-zinc-900"
                    : bar.kind === "increase"
                    ? "bg-emerald-500"
                    : "bg-rose-500";

                const description =
                  bar.kind === "total"
                    ? `${bar.label}: ${formatMillions(bar.runningTotal)}.`
                    : `${bar.label}: ${formatSignedThousands(bar.value)}. Running total ${formatMillions(
                        bar.runningTotal,
                      )}, from ${formatMillions(bar.previousTotal)}.${pinned ? " Pinned." : ""}`;

                return (
                  // The hit/focus target spans the full column height (well over
                  // the 24px minimum) regardless of how thin a small contribution's
                  // bar is — only the child bar visual is sized by data, so a tiny
                  // $20K contraction stays exactly as easy to select as a $1.3M one.
                  <button
                    key={bar.id}
                    type="button"
                    aria-pressed={pinnable ? pinned : undefined}
                    aria-label={description}
                    onMouseEnter={() => setHoveredId(bar.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(bar.id)}
                    onBlur={() => setHoveredId(null)}
                    onClick={() => {
                      if (isCategory(bar.id)) onTogglePin(bar.id);
                    }}
                    style={{
                      left: `${bar.barLeft}%`,
                      width: `${bar.barWidth}%`,
                    }}
                    className={cn(
                      "group absolute inset-y-0 rounded-t-[4px] bg-transparent",
                      pinnable ? "cursor-pointer" : "cursor-default",
                      FOCUS_RING,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        bottom: `${bar.bottomPct}%`,
                        height: `${bar.heightPct}%`,
                      }}
                      className={cn(
                        "absolute inset-x-0 rounded-t-[4px] transition-[filter] motion-reduce:transition-none",
                        barColor,
                        pinnable && "group-hover:brightness-110",
                        pinned && "ring-2 ring-cyan-500 ring-offset-2",
                      )}
                    />
                    {pinned && (
                      <span className="absolute left-1/2 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-cyan-600 text-white shadow" style={{ bottom: `calc(${bar.topPct}% + 4px)` }}>
                        <Pin className="h-2.5 w-2.5" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Delta / total labels above each bar */}
              {bars.map((bar) => (
                <div
                  key={`${bar.id}-label`}
                  aria-hidden="true"
                  style={{
                    left: `${bar.center}%`,
                    bottom: `${bar.topPct}%`,
                  }}
                  className="pointer-events-none absolute -translate-x-1/2 translate-y-[-6px] whitespace-nowrap text-center"
                >
                  {bar.kind === "total" ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {bar.id === "starting" ? "Start" : "End"}
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-semibold tabular-nums",
                        bar.kind === "increase" ? "text-emerald-700" : "text-rose-700",
                      )}
                    >
                      {formatSignedThousands(bar.value)}
                    </span>
                  )}
                </div>
              ))}

              {/* Hover tooltip */}
              {hoveredBar && (
                <div
                  aria-hidden="true"
                  style={{
                    left: `${Math.min(Math.max(hoveredBar.center, 14), 86)}%`,
                    bottom: `${Math.min(hoveredBar.topPct + 10, 92)}%`,
                  }}
                  className="pointer-events-none absolute z-10 w-44 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white p-2.5 text-xs shadow-lg motion-reduce:transition-none"
                >
                  <p className="font-semibold text-zinc-900">{hoveredBar.label}</p>
                  {hoveredBar.kind !== "total" && (
                    <p className="mt-0.5 flex items-center justify-between text-zinc-500">
                      <span>Contribution</span>
                      <span
                        className={cn(
                          "font-medium tabular-nums",
                          hoveredBar.kind === "increase" ? "text-emerald-700" : "text-rose-700",
                        )}
                      >
                        {formatSignedThousands(hoveredBar.value)}
                      </span>
                    </p>
                  )}
                  <p className="mt-0.5 flex items-center justify-between text-zinc-500">
                    <span>Running total</span>
                    <span className="font-medium tabular-nums text-zinc-900">
                      {formatMillions(hoveredBar.runningTotal)}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Category + running-total footer, aligned to bar centers */}
          <div className="mt-2 flex">
            {bars.map((bar) => (
              <div
                key={`${bar.id}-foot`}
                style={{ width: `${100 / bars.length}%` }}
                className="px-0.5 text-center"
              >
                <p className="truncate text-[11px] leading-snug text-zinc-500">{bar.label}</p>
                <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-zinc-900">
                  {formatMillions(bar.runningTotal)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
