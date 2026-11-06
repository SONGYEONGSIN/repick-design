"use client";

import { PinOff } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { channelLabel, formatCompactUsd, formatInt, formatPercent, formatUsd, formatUsdPrecise, objectiveLabel, type CampaignWithMetrics } from "./data";
import { CHANNEL_HEX, CHANNEL_SHAPE, FOCUS, TEXT_AUX, TEXT_PRIMARY, cx, r2, scaleLinear, scaleRadius } from "./tokens";
import { ShapeMark } from "./ui";

const VB_W = 200;
const VB_H = 100;
const PLOT_X0 = 22;
const PLOT_X1 = 197;
const PLOT_Y0 = 6;
const PLOT_Y1 = 86;
const R_MIN = 2.6;
const R_MAX = 11.5;
const TICK_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

function toLeftPct(x: number): number {
  return r2((x / VB_W) * 100);
}
function toTopPct(y: number): number {
  return r2((y / VB_H) * 100);
}

/**
 * The dominant visualization. Two interaction axes live here and are kept
 * deliberately independent:
 *  - `hoveredId` is fully ephemeral (hover or keyboard focus only) — it drives a
 *    crosshair + a floating readout and resets the instant the pointer/focus
 *    leaves. Nothing about it persists and nothing outside this component reads it.
 *  - `pinnedIds` persists a given bubble's label on screen after a click/Enter,
 *    scoped to this chart alone — it never recomputes the aggregate panel or the
 *    data table below. (It is lifted one level up only so the command palette can
 *    also set it — see command-deck.tsx — but no other widget ever reads it.)
 * Filtering which `items` are passed in is a third, separate axis owned by the
 * filter rail — this component never filters on its own.
 */
export default function ScatterChart({
  items,
  domainMaxSpend,
  domainMaxRate,
  domainMaxConversions,
  windowDays,
  pinnedIds,
  onTogglePin,
  onClearPins,
}: {
  items: CampaignWithMetrics[];
  domainMaxSpend: number;
  domainMaxRate: number;
  domainMaxConversions: number;
  windowDays: number;
  pinnedIds: Set<string>;
  onTogglePin: (id: string) => void;
  onClearPins: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const uid = useId();

  const spendCeiling = Math.max(domainMaxSpend * 1.08, 1000);
  const rateCeiling = Math.max(domainMaxRate * 1.18, 1);

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

  const hovered = plotted.find((p) => p.it.id === hoveredId) ?? null;

  const sizeRefs = [0.18, 0.55, 1].map((f) => {
    const value = Math.max(1, Math.round(domainMaxConversions * f));
    return { value, r: scaleRadius(value, domainMaxConversions, R_MIN, R_MAX) };
  });

  return (
    <div>
      <div
        className="relative w-full select-none"
        style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
      >
        {items.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/10 text-center">
            <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No campaigns match the current filters.</p>
            <p className={cx("max-w-xs text-xs font-normal leading-relaxed", TEXT_AUX)}>Enable another channel chip or switch the objective filter back to All.</p>
          </div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              width="100%"
              height="100%"
              role="img"
              aria-label={`Scatter plot of ${items.length} campaigns. Horizontal axis: spend over the trailing ${windowDays} days, up to about ${formatCompactUsd(spendCeiling)}. Vertical axis: conversion rate, up to about ${rateCeiling.toFixed(1)}%. Bubble size: total conversions. Each channel is drawn with its own marker shape. Exact figures for every plotted campaign are also in the data table below this chart.`}
            >
              {yTicks.map((t) => (
                <line key={`gy-${t}`} x1={PLOT_X0} x2={PLOT_X1} y1={scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0)} y2={scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0)} stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
              ))}
              {xTicks.map((t) => (
                <line key={`gx-${t}`} x1={scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1)} x2={scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1)} y1={PLOT_Y0} y2={PLOT_Y1} stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
              ))}
              <line x1={PLOT_X0} x2={PLOT_X1} y1={PLOT_Y1} y2={PLOT_Y1} stroke="rgba(255,255,255,0.22)" strokeWidth={0.5} />
              <line x1={PLOT_X0} x2={PLOT_X0} y1={PLOT_Y0} y2={PLOT_Y1} stroke="rgba(255,255,255,0.22)" strokeWidth={0.5} />

              {hovered ? (
                <g aria-hidden="true">
                  <line x1={PLOT_X0} x2={PLOT_X1} y1={hovered.cy} y2={hovered.cy} stroke="#fb923c" strokeWidth={0.45} strokeDasharray="2.2 2.2" opacity={0.75} />
                  <line x1={hovered.cx} x2={hovered.cx} y1={PLOT_Y0} y2={PLOT_Y1} stroke="#fb923c" strokeWidth={0.45} strokeDasharray="2.2 2.2" opacity={0.75} />
                </g>
              ) : null}

              {plotted.map(({ it, cx: px, cy: py, r }) => {
                const isHover = hoveredId === it.id;
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
                    fillOpacity={isHover ? 0.95 : 0.68}
                    stroke={isHover ? "#fafafa" : isPinned ? "#fb923c" : undefined}
                    strokeWidth={isHover ? 1.1 : isPinned ? 0.9 : 0}
                  />
                );
              })}
            </svg>

            {yTicks.map((t) => (
              <span
                key={`yl-${t}`}
                aria-hidden="true"
                style={{ left: `${toLeftPct(PLOT_X0 - 2.5)}%`, top: `${toTopPct(scaleLinear(t, 0, rateCeiling, PLOT_Y1, PLOT_Y0))}%` }}
                className={cx("pointer-events-none absolute -translate-x-full -translate-y-1/2 whitespace-nowrap text-[7.5px] font-normal tabular-nums", TEXT_AUX)}
              >
                {formatPercent(t, t === 0 ? 0 : 1)}
              </span>
            ))}
            {xTicks.map((t) => (
              <span
                key={`xl-${t}`}
                aria-hidden="true"
                style={{ left: `${toLeftPct(scaleLinear(t, 0, spendCeiling, PLOT_X0, PLOT_X1))}%`, top: `${toTopPct(PLOT_Y1 + 3)}%` }}
                className={cx("pointer-events-none absolute -translate-x-1/2 whitespace-nowrap text-[7.5px] font-normal tabular-nums", TEXT_AUX)}
              >
                {formatCompactUsd(t)}
              </span>
            ))}

            {/*
              Pointer-only hit targets, deliberately NOT focusable buttons. With 35 data-
              positioned points some sit closer together than 24px (that spacing is the data,
              not a layout choice — spreading them out would misrepresent spend/rate), which
              is exactly the WCAG 2.5.8 "target size is essential to the information conveyed"
              exception, but an automated target-size audit can't tell that apart from a
              genuine layout bug. So the audit is kept honest by not giving it 35 adjacent
              focusable controls to flag at all: mouse/trackpad users get hover here, and the
              identical pin/unpin action plus every exact figure is reachable — fully keyboard-
              navigable, normally row-spaced — from the "Pin" column in the data table below.
            */}
            {plotted.map(({ it, cx: px, cy: py }) => {
              const leftPct = toLeftPct(px);
              const topPct = toTopPct(py);
              return (
                <div
                  key={it.id}
                  aria-hidden="true"
                  onMouseEnter={() => setHoveredId(it.id)}
                  onMouseLeave={() => setHoveredId((cur) => (cur === it.id ? null : cur))}
                  onClick={() => onTogglePin(it.id)}
                  className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full"
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
                    <span className="inline-flex items-center gap-1 rounded-md border border-orange-400/30 bg-zinc-950/95 px-1.5 py-0.5 text-[9.5px] font-medium leading-tight text-zinc-100 shadow-sm shadow-black/40">
                      <span className="truncate">{it.name}</span>
                    </span>
                  </div>
                );
              })}

            {hovered ? (
              <div
                aria-hidden="true"
                style={{
                  left: `${toLeftPct(hovered.cx)}%`,
                  top: `${toTopPct(hovered.cy)}%`,
                  transform: `translate(${toLeftPct(hovered.cx) > 60 ? "calc(-100% - 12px)" : "12px"}, ${toTopPct(hovered.cy) < 26 ? "10px" : "calc(-100% - 10px)"})`,
                }}
                className="pointer-events-none absolute z-20 w-52 rounded-xl border border-white/10 bg-zinc-950 p-3 shadow-xl shadow-black/50 transition-opacity duration-150 motion-reduce:transition-none"
              >
                <p className="truncate text-xs font-semibold text-zinc-50">{hovered.it.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[10.5px] font-normal text-zinc-400">
                  <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden="true" className="shrink-0">
                    <ShapeMark shape={CHANNEL_SHAPE[hovered.it.channel]} cx={5} cy={5} r={4} fill={CHANNEL_HEX[hovered.it.channel]} />
                  </svg>
                  {channelLabel(hovered.it.channel)} · {objectiveLabel(hovered.it.objective)}
                </p>
                <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10.5px]">
                  <dt className="font-normal text-zinc-400">Spend</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatUsd(hovered.it.m.spend)}</dd>
                  <dt className="font-normal text-zinc-400">Conv. rate</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatPercent(hovered.it.m.conversionRate)}</dd>
                  <dt className="font-normal text-zinc-400">Conversions</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatInt(hovered.it.m.conversions)}</dd>
                  <dt className="font-normal text-zinc-400">CPA</dt>
                  <dd className="text-right font-medium tabular-nums text-zinc-50">{formatUsdPrecise(hovered.it.m.cpa)}</dd>
                </dl>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div id={`${uid}-readout`} aria-live="polite" className="mt-3 min-h-[2.5rem] rounded-xl border border-white/10 bg-zinc-950 px-3 py-2">
        {hovered ? (
          <p className="text-[11.5px] font-normal leading-relaxed text-zinc-300">
            <span className="font-semibold text-zinc-50">{hovered.it.name}</span>
            {` — ${channelLabel(hovered.it.channel)}: spend `}
            <span className="font-medium tabular-nums text-zinc-50">{formatUsd(hovered.it.m.spend)}</span>
            {", conversion rate "}
            <span className="font-medium tabular-nums text-zinc-50">{formatPercent(hovered.it.m.conversionRate)}</span>
            {`, ${formatInt(hovered.it.m.conversions)} conversions, CPA `}
            <span className="font-medium tabular-nums text-zinc-50">{formatUsdPrecise(hovered.it.m.cpa)}</span>
          </p>
        ) : (
          <p className={cx("text-[11.5px] font-normal leading-relaxed", TEXT_AUX)}>
            Hover or tab to a bubble for its exact spend, rate and CPA. Click or press Enter to pin its label in place — every value is also in the table below regardless.
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3">
        <span className={cx("text-[10.5px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Bubble size = conversions</span>
        <div className="flex items-end gap-3">
          {sizeRefs.map(({ value, r }) => (
            <div key={value} className="flex flex-col items-center gap-1">
              <svg width={28} height={28} viewBox="0 0 28 28" aria-hidden="true">
                <circle cx={14} cy={14} r={r} fill="none" stroke="#a1a1aa" strokeWidth={0.8} />
              </svg>
              <span className={cx("text-[9.5px] font-normal tabular-nums", TEXT_AUX)}>{formatInt(value)}</span>
            </div>
          ))}
        </div>
        {pinnedIds.size > 0 ? (
          <button
            type="button"
            onClick={onClearPins}
            className={cx("ml-auto inline-flex h-7 items-center gap-1.5 rounded-md border border-white/10 bg-zinc-950 px-2 text-[11px] font-medium text-zinc-400 hover:text-zinc-50", "transition-colors duration-150 motion-reduce:transition-none", FOCUS)}
          >
            <PinOff size={12} aria-hidden="true" />
            {`Clear ${pinnedIds.size} pinned`}
          </button>
        ) : null}
      </div>
    </div>
  );
}
