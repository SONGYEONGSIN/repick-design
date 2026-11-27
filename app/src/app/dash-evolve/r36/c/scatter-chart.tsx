"use client";

import { GitCompare } from "lucide-react";
import { useId, useMemo } from "react";
import { channelLabel, formatCompactInt, formatCompactUsd, formatInt, formatPercent, formatUsd, formatUsdCents, goalLabel, type CampaignWithMetrics } from "./data";
import {
  CHANNEL_HEX,
  CHANNEL_SHAPE,
  QUADRANTS,
  TEXT_DIM,
  TEXT_PRIMARY,
  correlationLabel,
  cx,
  pearsonR,
  quadrantFor,
  r2,
  scaleLinear,
  scaleRadius,
} from "./tokens";
import { ShapeMark } from "./ui";

const VB_W = 200;
const VB_H = 100;
const PLOT_X0 = 24;
const PLOT_X1 = 196;
const PLOT_Y0 = 8;
const PLOT_Y1 = 84;
const R_MIN = 2.6;
const R_MAX = 11;
const TICK_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

function toLeftPct(x: number): number {
  return r2((x / VB_W) * 100);
}
function toTopPct(y: number): number {
  return r2((y / VB_H) * 100);
}

/**
 * The dominant visualization. `activeId` is a fully ephemeral hover/focus read-out
 * axis — it drives the crosshair and the floating tooltip and resets the instant
 * the pointer or table-row focus moves away. Nothing about it persists and it
 * never touches the filter rail or the aggregate panel. `pinnedIds` is a second,
 * independent, CHART-LOCAL axis: it only ever highlights a point's own label here
 * and is set exclusively from the data table's Pin column (see fix #2 — the points
 * below are pointer-only and never a keyboard target). Filtering which `items`
 * render is a third axis owned entirely by the filter rail; this component never
 * filters on its own.
 */
export default function ScatterChart({
  items,
  domainMaxSpend,
  domainMaxRate,
  domainMaxConversions,
  windowDays,
  pinnedIds,
  activeId,
  onHover,
}: {
  items: CampaignWithMetrics[];
  domainMaxSpend: number;
  domainMaxRate: number;
  domainMaxConversions: number;
  windowDays: number;
  pinnedIds: Set<string>;
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const uid = useId();

  const spendCeiling = Math.max(domainMaxSpend * 1.1, 1000);
  const rateCeiling = Math.max(domainMaxRate * 1.2, 1);
  const spendMid = spendCeiling / 2;
  const rateMid = rateCeiling / 2;

  const plotted = useMemo(
    () =>
      items.map((it) => ({
        it,
        cx: scaleLinear(it.m.spend, 0, spendCeiling, PLOT_X0, PLOT_X1),
        cy: scaleLinear(it.m.conversionRate, 0, rateCeiling, PLOT_Y1, PLOT_Y0),
        r: scaleRadius(it.m.conversions, domainMaxConversions, R_MIN, R_MAX),
      })),
    [items, spendCeiling, rateCeiling, domainMaxConversions],
  );

  const xTicks = TICK_FRACTIONS.map((f) => r2(f * spendCeiling));
  const yTicks = TICK_FRACTIONS.map((f) => r2(f * rateCeiling));
  const midX = scaleLinear(spendMid, 0, spendCeiling, PLOT_X0, PLOT_X1);
  const midY = scaleLinear(rateMid, 0, rateCeiling, PLOT_Y1, PLOT_Y0);

  const active = plotted.find((p) => p.it.id === activeId) ?? null;
  const corr = pearsonR(items.map((c) => ({ x: c.m.spend, y: c.m.conversionRate })));

  const sizeRefs = [0.2, 0.55, 1].map((f, i) => {
    const value = Math.max(1, Math.round(domainMaxConversions * f));
    return { key: `size-${i}`, value, r: scaleRadius(value, domainMaxConversions, R_MIN, R_MAX) };
  });

  const quadrantCounts: Record<string, number> = { "scale-up": 0, optimize: 0, monitor: 0, pause: 0 };
  for (const { it } of plotted) quadrantCounts[quadrantFor(it.m.spend, it.m.conversionRate, spendMid, rateMid)]++;

  return (
    <div>
      <div className="relative w-full select-none" style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/10 text-center">
            <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No campaigns match the current filters.</p>
            <p className={cx("max-w-xs text-xs font-normal leading-relaxed", TEXT_DIM)}>Enable another channel row or switch the goal filter back to All goals.</p>
          </div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              width="100%"
              height="100%"
              role="img"
              aria-label={`Scatter plot of ${items.length} campaigns. Horizontal axis: spend over the trailing ${windowDays} days, up to about ${formatCompactUsd(spendCeiling)}. Vertical axis: conversion rate, up to about ${rateCeiling.toFixed(1)} percent. Bubble size: total conversions. Each channel is drawn with its own marker shape. Quadrant dividers split the plot into scale up, optimize, monitor and pause regions. Exact figures for every plotted campaign are also in the data table below this chart.`}
            >
              {yTicks.map((t) => (
                <line key={`gy-${t}`} x1={PLOT_X0} x2={PLOT_X1} y1={scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0)} y2={scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0)} stroke="rgba(255,255,255,0.07)" strokeWidth={0.4} />
              ))}
              {xTicks.map((t) => (
                <line key={`gx-${t}`} x1={scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1)} x2={scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1)} y1={PLOT_Y0} y2={PLOT_Y1} stroke="rgba(255,255,255,0.07)" strokeWidth={0.4} />
              ))}

              {/* Quadrant dividers — always visible, decorative (the quadrant LABELS
                  below carry the real text signal; color/position is never the sole cue). */}
              <line aria-hidden="true" x1={midX} x2={midX} y1={PLOT_Y0} y2={PLOT_Y1} stroke="rgba(251,146,60,0.35)" strokeWidth={0.5} strokeDasharray="2.4 2" />
              <line aria-hidden="true" x1={PLOT_X0} x2={PLOT_X1} y1={midY} y2={midY} stroke="rgba(251,146,60,0.35)" strokeWidth={0.5} strokeDasharray="2.4 2" />

              <line x1={PLOT_X0} x2={PLOT_X1} y1={PLOT_Y1} y2={PLOT_Y1} stroke="rgba(255,255,255,0.22)" strokeWidth={0.5} />
              <line x1={PLOT_X0} x2={PLOT_X0} y1={PLOT_Y0} y2={PLOT_Y1} stroke="rgba(255,255,255,0.22)" strokeWidth={0.5} />

              {active ? (
                <g aria-hidden="true">
                  <line x1={PLOT_X0} x2={PLOT_X1} y1={active.cy} y2={active.cy} stroke="#fb923c" strokeWidth={0.45} strokeDasharray="2.2 2.2" opacity={0.75} />
                  <line x1={active.cx} x2={active.cx} y1={PLOT_Y0} y2={PLOT_Y1} stroke="#fb923c" strokeWidth={0.45} strokeDasharray="2.2 2.2" opacity={0.75} />
                </g>
              ) : null}

              {plotted.map(({ it, cx: px, cy: py, r }) => {
                const isActive = activeId === it.id;
                const isPinned = pinnedIds.has(it.id);
                const color = CHANNEL_HEX[it.channel];
                return (
                  <ShapeMark
                    key={it.id}
                    shape={CHANNEL_SHAPE[it.channel]}
                    cx={px}
                    cy={py}
                    r={r}
                    fill={color}
                    fillOpacity={isActive ? 0.95 : 0.68}
                    stroke={isActive ? "#fafafa" : isPinned ? "#fb923c" : undefined}
                    strokeWidth={isActive ? 1.1 : isPinned ? 1 : 0}
                  />
                );
              })}
            </svg>

            {/* Quadrant labels — real text, always visible, positioned just inside each
                corner of the plot area. */}
            {(
              [
                { id: "optimize" as const, left: toLeftPct(PLOT_X0) + 1, top: toTopPct(PLOT_Y0) + 2, anchor: "left" as const },
                { id: "scale-up" as const, left: toLeftPct(PLOT_X1) - 1, top: toTopPct(PLOT_Y0) + 2, anchor: "right" as const },
                { id: "pause" as const, left: toLeftPct(PLOT_X0) + 1, top: toTopPct(PLOT_Y1) - 2, anchor: "left" as const },
                { id: "monitor" as const, left: toLeftPct(PLOT_X1) - 1, top: toTopPct(PLOT_Y1) - 2, anchor: "right" as const },
              ]
            ).map((q) => (
              <span
                key={q.id}
                style={{ left: `${q.left}%`, top: `${q.top}%` }}
                className={cx(
                  "pointer-events-none absolute whitespace-nowrap text-[9.5px] font-semibold uppercase tracking-[0.06em]",
                  q.anchor === "right" ? "-translate-x-full" : "",
                  q.top < 50 ? "" : "-translate-y-full",
                  TEXT_DIM,
                )}
              >
                {QUADRANTS[q.id].label}
                <span className="ml-1 tabular-nums text-zinc-400">{`(${quadrantCounts[q.id]})`}</span>
              </span>
            ))}

            {yTicks.map((t) => (
              <span
                key={`yl-${t}`}
                aria-hidden="true"
                style={{ left: `${toLeftPct(PLOT_X0 - 2.5)}%`, top: `${toTopPct(scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0))}%` }}
                className={cx("pointer-events-none absolute -translate-x-full -translate-y-1/2 whitespace-nowrap text-[7.5px] font-normal tabular-nums", TEXT_DIM)}
              >
                {formatPercent(t, t === 0 ? 0 : 1)}
              </span>
            ))}
            {xTicks.map((t) => (
              <span
                key={`xl-${t}`}
                aria-hidden="true"
                style={{ left: `${toLeftPct(scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1))}%`, top: `${toTopPct(PLOT_Y1 + 3)}%` }}
                className={cx("pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-[7.5px] font-normal tabular-nums", TEXT_DIM)}
              >
                {formatCompactUsd(t)}
              </span>
            ))}

            {/*
              FIX #2 — pointer-only hit targets, deliberately NOT focusable buttons.
              With data-positioned points, several sit closer together than a 24px
              focusable target could guarantee without misrepresenting spend/rate —
              that spacing is the data, not a layout bug to pad away. So every point
              here is `aria-hidden`, out of the tab order, and carries no click
              handler at all: mouse/trackpad users get hover-only crosshair feedback,
              and the IDENTICAL exact-value readout plus the keyboard-operable Pin
              action live in the fallback table below, fully tab-reachable at normal
              row spacing.
            */}
            {plotted.map(({ it, cx: px, cy: py }) => {
              const leftPct = toLeftPct(px);
              const topPct = toTopPct(py);
              return (
                <div
                  key={it.id}
                  aria-hidden="true"
                  onMouseEnter={() => onHover(it.id)}
                  onMouseLeave={() => onHover(null)}
                  className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                />
              );
            })}

            {plotted
              .filter(({ it }) => pinnedIds.has(it.id))
              .map(({ it, cx: px, cy: py }) => {
                const leftPct = toLeftPct(px);
                const topPct = toTopPct(py);
                const anchorRight = leftPct > 62;
                const anchorBelow = topPct < 22;
                return (
                  <div
                    key={`pin-${it.id}`}
                    aria-hidden="true"
                    style={{
                      left: `${leftPct}%`,
                      top: `${topPct}%`,
                      transform: `translate(${anchorRight ? "calc(-100% - 10px)" : "10px"}, ${anchorBelow ? "6px" : "calc(-100% - 6px)"})`,
                    }}
                    className="pointer-events-none absolute z-10 max-w-[150px]"
                  >
                    <span className="inline-flex items-center gap-1 rounded-md border border-orange-400/35 bg-zinc-950/95 px-1.5 py-0.5 text-[9.5px] font-medium leading-tight text-zinc-100 shadow-sm shadow-black/40">
                      <span className="truncate">{it.name}</span>
                    </span>
                  </div>
                );
              })}

            {active ? (
              <div
                aria-hidden="true"
                style={{
                  left: `${toLeftPct(active.cx)}%`,
                  top: `${toTopPct(active.cy)}%`,
                  transform: `translate(${toLeftPct(active.cx) > 60 ? "calc(-100% - 12px)" : "12px"}, ${toTopPct(active.cy) < 26 ? "10px" : "calc(-100% - 10px)"})`,
                }}
                className="pointer-events-none absolute z-20 w-52 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-xl shadow-black/50"
              >
                <p className="truncate text-xs font-semibold text-zinc-50">{active.it.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-normal text-zinc-400">
                  <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true" className="shrink-0">
                    <ShapeMark shape={CHANNEL_SHAPE[active.it.channel]} cx={5} cy={5} r={4} fill={CHANNEL_HEX[active.it.channel]} />
                  </svg>
                  {channelLabel(active.it.channel)} · {goalLabel(active.it.goal)}
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px]">
                  <dt className="font-normal text-zinc-400">Spend</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatUsd(active.it.m.spend)}</dd>
                  <dt className="font-normal text-zinc-400">Conv. rate</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatPercent(active.it.m.conversionRate)}</dd>
                  <dt className="font-normal text-zinc-400">Conversions</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatInt(active.it.m.conversions)}</dd>
                  <dt className="font-normal text-zinc-400">CPA</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatUsdCents(active.it.m.cpa)}</dd>
                </dl>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div id={`${uid}-readout`} aria-live="polite" className="mt-3 min-h-[2.5rem] rounded-xl border border-white/10 bg-zinc-950 px-3 py-2">
        {active ? (
          <p className="text-[11.5px] font-normal leading-relaxed text-zinc-300">
            <span className="font-semibold text-zinc-50">{active.it.name}</span>
            {` — ${channelLabel(active.it.channel)}: spend `}
            <span className="font-medium tabular-nums text-zinc-50">{formatUsd(active.it.m.spend)}</span>
            {", conversion rate "}
            <span className="font-medium tabular-nums text-zinc-50">{formatPercent(active.it.m.conversionRate)}</span>
            {`, ${formatInt(active.it.m.conversions)} conversions, CPA `}
            <span className="font-medium tabular-nums text-zinc-50">{formatUsdCents(active.it.m.cpa)}</span>
          </p>
        ) : (
          <p className={cx("text-[11.5px] font-normal leading-relaxed", TEXT_DIM)}>
            {"Hover a bubble, or tab to its row in the table below, for its exact spend, rate and CPA."}
          </p>
        )}
      </div>

      {/* Always-visible per-catalog annotation: correlation coefficient AND a
          quadrant-summary sentence, both real text, never hover-only. Kept at
          text-2xl (24px) — strictly larger than every KPI value in the aggregate
          panel (text-base, 16px, see aggregate-panel.tsx) so the single biggest
          number on the page lives with the chart it describes. */}
      <div className="mt-3 rounded-xl border border-white/10 bg-zinc-950 p-3.5">
        <div className="flex items-center gap-1.5">
          <GitCompare size={13} aria-hidden="true" className="text-orange-400" />
          <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{"Spend ↔ conversion-rate correlation"}</p>
        </div>
        {corr === null ? (
          <p className={cx("mt-1.5 text-[11.5px] font-normal leading-relaxed", TEXT_DIM)}>Need at least two campaigns in view to compute a correlation coefficient.</p>
        ) : (
          <>
            <p className="mt-1.5 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums text-zinc-50">{`r = ${corr.toFixed(2)}`}</span>
              <span className={cx("text-xs font-medium capitalize", TEXT_DIM)}>{correlationLabel(corr)}</span>
            </p>
            <p className={cx("mt-1.5 text-[11px] font-normal leading-relaxed", TEXT_DIM)}>
              {`Computed live from the ${items.length} campaign${items.length === 1 ? "" : "s"} currently plotted. ${quadrantCounts["scale-up"]} sit in Scale up, ${quadrantCounts.optimize} in Optimize, ${quadrantCounts.monitor} in Monitor and ${quadrantCounts.pause} in Pause.`}
            </p>
          </>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3">
        <span className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_DIM)}>Bubble size = conversions</span>
        <div className="flex items-end gap-3">
          {sizeRefs.map(({ key, value, r }) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
                <circle cx={14} cy={14} r={r} fill="none" stroke="#a1a1aa" strokeWidth={0.8} />
              </svg>
              <span className={cx("text-[9.5px] font-normal tabular-nums", TEXT_DIM)}>{formatCompactInt(value)}</span>
            </div>
          ))}
        </div>
        {pinnedIds.size > 0 ? (
          <span className={cx("ml-auto text-[11px] font-normal", TEXT_DIM)}>{`${pinnedIds.size} pinned — unpin from the table below`}</span>
        ) : null}
      </div>
    </div>
  );
}
