"use client";

import { Pin, PinOff } from "lucide-react";
import { useRef, useState } from "react";
import { LINE_BY_ID, STATUS_ICON, TODAY_OFFSET, buildTicks, dueOffset, formatRangeLong, formatShort, lineUtilization } from "./data";
import type { LineId, ScaleConfig, WorkOrder } from "./data";
import { buildLineRows } from "./encoding";
import { BORDER, CHART, FOCUS, STATUS_BADGE, STATUS_CHART, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { ProgressBar, r2, useElementWidth } from "./ui";

const LABEL_W = 208;
const HEADER_H = 34;
const ROW_H = 64;
/** WCAG 2.5.8 wants every interactive target at least 24x24 CSS px — the floor below guarantees
 *  it even for the shortest work order at the widest zoom-out (quarter scale). */
const BAR_H = 32;
const MIN_BAR_W = 26;

export default function GanttChart({
  scale,
  orders,
  focusLineId,
  onToggleFocus,
}: {
  scale: ScaleConfig;
  orders: WorkOrder[];
  focusLineId: LineId | null;
  onToggleFocus: (id: LineId) => void;
}) {
  const { ref, width } = useElementWidth<HTMLDivElement>(1180);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const rows = buildLineRows(focusLineId);
  const plotWidth = Math.max(200, width - LABEL_W);
  const span = Math.max(1, scale.windowEnd - scale.windowStart);
  const pxPerDay = plotWidth / span;
  const xFor = (offset: number) => r2((offset - scale.windowStart) * pxPerDay);
  const ticks = buildTicks(scale);
  const bodyHeight = rows.length * ROW_H;
  const showToday = TODAY_OFFSET >= scale.windowStart && TODAY_OFFSET <= scale.windowEnd;

  const ordersByLine: Record<LineId, WorkOrder[]> = {} as Record<LineId, WorkOrder[]>;
  for (const row of rows) ordersByLine[row.line.id] = orders.filter((o) => o.lineId === row.line.id);

  const hoveredOrder = hoveredId ? orders.find((o) => o.id === hoveredId) ?? null : null;
  const hoveredVisible = hoveredOrder ? dueOffset(hoveredOrder) > scale.windowStart && hoveredOrder.startOffset < scale.windowEnd : false;
  const hoveredRowIndex = hoveredOrder ? rows.findIndex((r) => r.line.id === hoveredOrder.lineId) : -1;

  function segment(o: WorkOrder) {
    const segStart = Math.max(o.startOffset, scale.windowStart);
    const segEnd = Math.min(dueOffset(o), scale.windowEnd);
    const left = xFor(segStart);
    const rawWidth = xFor(segEnd) - xFor(segStart);
    return { left, width: r2(Math.max(MIN_BAR_W, rawWidth)) };
  }

  function orderedBars(lineId: LineId): WorkOrder[] {
    return [...(ordersByLine[lineId] ?? [])]
      .filter((o) => dueOffset(o) > scale.windowStart && o.startOffset < scale.windowEnd)
      .sort((a, b) => a.startOffset - b.startOffset);
  }

  function moveFocus(current: WorkOrder, deltaOrEdge: number | "home" | "end") {
    const siblings = orderedBars(current.lineId);
    const idx = siblings.findIndex((o) => o.id === current.id);
    let nextIdx = idx;
    if (deltaOrEdge === "home") nextIdx = 0;
    else if (deltaOrEdge === "end") nextIdx = siblings.length - 1;
    else nextIdx = Math.min(siblings.length - 1, Math.max(0, idx + deltaOrEdge));
    const next = siblings[nextIdx];
    if (next) {
      setHoveredId(next.id);
      buttonRefs.current[next.id]?.focus();
    }
  }

  function moveRow(current: WorkOrder, delta: number) {
    const rowIdx = rows.findIndex((r) => r.line.id === current.lineId);
    const nextRow = rows[Math.min(rows.length - 1, Math.max(0, rowIdx + delta))];
    if (!nextRow) return;
    const siblings = orderedBars(nextRow.line.id);
    const target = siblings[0];
    if (target) {
      setHoveredId(target.id);
      buttonRefs.current[target.id]?.focus();
    }
  }

  let tooltip: { top: number; left: number; above: boolean } | null = null;
  if (hoveredOrder && hoveredVisible && hoveredRowIndex >= 0) {
    const seg = segment(hoveredOrder);
    const centerX = LABEL_W + seg.left + seg.width / 2;
    const tipW = 252;
    const clampedLeft = Math.min(Math.max(centerX - tipW / 2, LABEL_W + 4), Math.max(LABEL_W + 4, width - tipW - 4));
    const rowTop = HEADER_H + hoveredRowIndex * ROW_H;
    const above = rowTop > 100;
    tooltip = { top: above ? rowTop - 8 : rowTop + ROW_H + 8, left: r2(clampedLeft), above };
  }

  return (
    <div ref={ref} className="relative hidden lg:block">
      {/* ---------------------------------------------------------------------- header */}
      <div className={cx("flex border-b", BORDER)}>
        <div style={{ width: LABEL_W }} className={cx("shrink-0 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
          Production line
        </div>
        <div className="relative min-w-0 flex-1" style={{ height: HEADER_H }}>
          {ticks.map((t) => (
            <span
              key={t.offset}
              className={cx("absolute bottom-1.5 whitespace-nowrap text-[10px]", t.major ? cx("font-medium", TEXT_PRIMARY) : TEXT_AUX)}
              style={{ left: `${xFor(t.offset)}px` }}
            >
              {t.label}
            </span>
          ))}
          {showToday ? (
            <span
              className="absolute top-0.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-indigo-600 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
              style={{ left: `${xFor(TODAY_OFFSET)}px` }}
            >
              Today
            </span>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------------------- body */}
      <div className="relative" style={{ height: bodyHeight }}>
        {/* grid lines, spanning every row */}
        {ticks.map((t) => (
          <div
            key={`grid-${t.offset}`}
            aria-hidden="true"
            className={cx("absolute top-0 bottom-0 w-px", t.major ? "bg-zinc-200" : "bg-zinc-100")}
            style={{ left: `${LABEL_W + xFor(t.offset)}px` }}
          />
        ))}
        {showToday ? (
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 w-px bg-indigo-300"
            style={{ left: `${LABEL_W + xFor(TODAY_OFFSET)}px` }}
          />
        ) : null}
        {tooltip && hoveredOrder ? (
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 border-x"
            style={{ left: `${LABEL_W + segment(hoveredOrder).left}px`, width: `${segment(hoveredOrder).width}px`, backgroundColor: CHART.band, borderColor: CHART.bandLine + "55" }}
          />
        ) : null}

        {rows.map((row, i) => {
          const focused = row.emphasis === "focused";
          const utilization = lineUtilization(row.line.id);
          const overloaded = utilization > 100;
          return (
            <div key={row.line.id} className="absolute inset-x-0 flex" style={{ top: i * ROW_H, height: ROW_H }}>
              <button
                type="button"
                onClick={() => onToggleFocus(row.line.id)}
                aria-pressed={focused}
                className={cx(
                  "flex w-full shrink-0 items-center gap-2.5 border-t border-r px-3 text-left",
                  BORDER,
                  TRANSITION,
                  FOCUS,
                  focused ? "border-l-4 border-l-indigo-600 bg-indigo-50/70" : "hover:bg-zinc-50",
                )}
                style={{ width: LABEL_W }}
              >
                <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg border", focused ? "border-indigo-300 bg-indigo-100 text-indigo-700" : cx(BORDER, "bg-zinc-100", TEXT_AUX))}>
                  <row.line.Icon size={15} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cx("flex items-center gap-1 truncate text-sm font-medium", focused ? "text-indigo-700" : TEXT_PRIMARY)}>
                    {row.line.name}
                    {focused ? <Pin size={11} aria-hidden="true" className="shrink-0" /> : null}
                  </span>
                  <span className={cx("mt-0.5 block truncate text-[11px] font-normal tabular-nums", overloaded ? "text-amber-700" : TEXT_AUX)}>
                    {`${orderedBars(row.line.id).length} shown · ${utilization.toFixed(1)}% util`}
                  </span>
                </span>
                <span className="sr-only">{focused ? `${row.line.name} is the focused line. Activate to clear focus.` : `Focus schedule on ${row.line.name}.`}</span>
              </button>

              <div className={cx("relative min-w-0 flex-1 overflow-hidden border-t", BORDER, focused && "bg-indigo-50/30")}>
                {orderedBars(row.line.id).map((o) => {
                  const seg = segment(o);
                  const chart = STATUS_CHART[o.status];
                  const StatusIcon = STATUS_ICON[o.status];
                  const isHovered = hoveredId === o.id;
                  const showId = seg.width >= 96;
                  const showProgress = seg.width >= 56;
                  return (
                    <span key={o.id} className="contents">
                      {isHovered ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute z-10 rounded-[9px] border-2 border-indigo-500"
                          style={{
                            left: `${r2(seg.left - 3)}px`,
                            width: `${r2(seg.width + 6)}px`,
                            top: `${(ROW_H - BAR_H) / 2 - 3}px`,
                            height: `${BAR_H + 6}px`,
                          }}
                        />
                      ) : null}
                      <button
                        ref={(el) => {
                          buttonRefs.current[o.id] = el;
                        }}
                        type="button"
                        onMouseEnter={() => setHoveredId(o.id)}
                        onMouseLeave={() => setHoveredId((h) => (h === o.id ? null : h))}
                        onFocus={() => setHoveredId(o.id)}
                        onBlur={() => setHoveredId((h) => (h === o.id ? null : h))}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowRight") {
                            e.preventDefault();
                            moveFocus(o, 1);
                          } else if (e.key === "ArrowLeft") {
                            e.preventDefault();
                            moveFocus(o, -1);
                          } else if (e.key === "ArrowDown") {
                            e.preventDefault();
                            moveRow(o, 1);
                          } else if (e.key === "ArrowUp") {
                            e.preventDefault();
                            moveRow(o, -1);
                          } else if (e.key === "Home") {
                            e.preventDefault();
                            moveFocus(o, "home");
                          } else if (e.key === "End") {
                            e.preventDefault();
                            moveFocus(o, "end");
                          }
                        }}
                        className={cx("absolute rounded-md border text-left", TRANSITION, FOCUS, chart.dashed && "border-dashed", isHovered && "z-10")}
                        style={{
                          left: `${seg.left}px`,
                          width: `${seg.width}px`,
                          top: `${(ROW_H - BAR_H) / 2}px`,
                          height: `${BAR_H}px`,
                          backgroundColor: chart.fill,
                          borderColor: chart.stroke,
                        }}
                      >
                        <span className="sr-only">
                          {`${o.id}, ${o.sku}. ${STATUS_LABEL[o.status]}. ${formatRangeLong(o)}. ${o.progress} percent complete. ${o.priority} priority on ${LINE_BY_ID[o.lineId].name}. Use arrow keys to move between work orders and lines.`}
                        </span>
                        <span aria-hidden="true" className="flex h-full items-center gap-1 overflow-hidden px-1.5">
                          <StatusIcon size={11} strokeWidth={2.25} className="shrink-0 text-white" />
                          {showId ? <span className="truncate text-[10px] font-semibold text-white">{o.id}</span> : null}
                          {showProgress ? <span className="ml-auto shrink-0 text-[10px] font-medium tabular-nums text-white">{`${o.progress}%`}</span> : null}
                        </span>
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {tooltip && hoveredOrder ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-20 w-[252px] rounded-xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-900/10"
          style={{ left: `${tooltip.left}px`, top: `${tooltip.top}px`, transform: tooltip.above ? "translateY(-100%)" : undefined }}
        >
          <div className="flex items-start justify-between gap-2">
            <span className={cx("min-w-0 truncate text-sm font-semibold", TEXT_PRIMARY)}>{hoveredOrder.id}</span>
            <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", STATUS_BADGE[hoveredOrder.status])}>
              {STATUS_LABEL[hoveredOrder.status]}
            </span>
          </div>
          <p className={cx("mt-0.5 truncate text-xs font-normal", TEXT_AUX)}>{hoveredOrder.sku}</p>
          <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <dt className={TEXT_AUX}>Line</dt>
            <dd className={cx("text-right font-medium", TEXT_PRIMARY)}>{LINE_BY_ID[hoveredOrder.lineId].name}</dd>
            <dt className={TEXT_AUX}>Window</dt>
            <dd className={cx("text-right font-medium tabular-nums", TEXT_PRIMARY)}>{`${formatShort(hoveredOrder.startOffset)} – ${formatShort(dueOffset(hoveredOrder))}`}</dd>
            <dt className={TEXT_AUX}>Progress</dt>
            <dd className={cx("text-right font-medium tabular-nums", TEXT_PRIMARY)}>{`${hoveredOrder.progress}%`}</dd>
          </dl>
          <div className="mt-1.5">
            <ProgressBar value={hoveredOrder.progress} />
          </div>
        </div>
      ) : null}

      <p aria-live="polite" className="sr-only">
        {hoveredOrder
          ? `${hoveredOrder.id}, ${hoveredOrder.sku}, ${STATUS_LABEL[hoveredOrder.status]}, ${formatRangeLong(hoveredOrder)}, ${hoveredOrder.progress} percent complete.`
          : ""}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------- mobile: stacked, not pixel-dated */

export function MobileScheduleList({
  orders,
  focusLineId,
  onToggleFocus,
}: {
  orders: WorkOrder[];
  focusLineId: LineId | null;
  onToggleFocus: (id: LineId) => void;
}) {
  const rows = buildLineRows(focusLineId);
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {rows.map((row) => {
        const lineOrders = orders.filter((o) => o.lineId === row.line.id).sort((a, b) => a.startOffset - b.startOffset);
        const focused = row.emphasis === "focused";
        const utilization = lineUtilization(row.line.id);
        return (
          <div key={row.line.id} className={cx("rounded-xl border p-3", focused ? "border-indigo-300 bg-indigo-50/60" : cx(BORDER, "bg-white"))}>
            <button
              type="button"
              onClick={() => onToggleFocus(row.line.id)}
              aria-pressed={focused}
              className={cx("flex w-full min-h-11 items-center gap-2.5 rounded-lg text-left", TRANSITION, FOCUS)}
            >
              <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg border", focused ? "border-indigo-300 bg-indigo-100 text-indigo-700" : cx(BORDER, "bg-zinc-100", TEXT_AUX))}>
                <row.line.Icon size={15} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cx("flex items-center gap-1 truncate text-sm font-semibold", focused ? "text-indigo-700" : TEXT_PRIMARY)}>
                  {row.line.name}
                  {focused ? <Pin size={11} aria-hidden="true" /> : <PinOff size={11} aria-hidden="true" className={TEXT_AUX} />}
                </span>
                <span className={cx("block text-[11px] font-normal tabular-nums", TEXT_AUX)}>{`${lineOrders.length} work orders · ${utilization.toFixed(1)}% util`}</span>
              </span>
            </button>

            <ul className="mt-2 flex flex-col gap-1.5">
              {lineOrders.map((o) => {
                const chart = STATUS_CHART[o.status];
                const StatusIcon = STATUS_ICON[o.status];
                return (
                  <li key={o.id} className={cx("rounded-lg border p-2.5", BORDER, "bg-white")}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span aria-hidden="true" className={cx("grid h-4 w-4 shrink-0 place-items-center rounded-sm", chart.dashed && "border border-dashed")} style={{ backgroundColor: chart.dashed ? "transparent" : chart.fill, borderColor: chart.stroke }}>
                          <StatusIcon size={10} strokeWidth={2.25} style={{ color: chart.dashed ? chart.fill : "#fff" }} />
                        </span>
                        <span className={cx("truncate text-xs font-semibold", TEXT_PRIMARY)}>{o.id}</span>
                      </span>
                      <span className={cx("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium", STATUS_BADGE[o.status])}>{STATUS_LABEL[o.status]}</span>
                    </div>
                    <p className={cx("mt-0.5 truncate text-[11px] font-normal", TEXT_AUX)}>{o.sku}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ProgressBar value={o.progress} className="flex-1" />
                      <span className={cx("shrink-0 text-[11px] font-medium tabular-nums", TEXT_PRIMARY)}>{`${o.progress}%`}</span>
                    </div>
                    <p className={cx("mt-1 text-[11px] font-normal tabular-nums", TEXT_AUX)}>{formatRangeLong(o)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
