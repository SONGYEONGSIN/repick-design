"use client";

import { useId, useState } from "react";
import type { Grouping, Quarter, Severity } from "./data";
import { COST_TYPE_META, COST_TYPE_ORDER, DEPARTMENT_META, DEPARTMENT_ORDER, classifySeverity, companyTotal, costTypeTotal, departmentTotal, variancePct } from "./data";
import { formatCurrency, formatCurrencyCompact, formatPercent, formatSignedPercent } from "./format";
import { FOCUS, NUM, SEVERITY_BADGE, SEVERITY_LABEL, SEVERITY_TILE, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { layoutTreemap, tileArea } from "./treemap";

type Tile = {
  id: string;
  label: string;
  value: number;
  target: number;
  severity: Severity;
  variance: number;
  share: number;
  meta: string;
};

function buildTiles(grouping: Grouping, quarter: Quarter): Tile[] {
  const total = companyTotal(quarter);
  if (grouping === "department") {
    return DEPARTMENT_ORDER.map((id) => {
      const value = departmentTotal(quarter, id);
      const target = DEPARTMENT_META[id].quarterlyTarget;
      const variance = variancePct(value, target);
      return {
        id,
        label: DEPARTMENT_META[id].name,
        value,
        target,
        variance,
        severity: classifySeverity(variance),
        share: total > 0 ? (value / total) * 100 : 0,
        meta: `${DEPARTMENT_META[id].headcount} headcount`,
      };
    }).sort((a, b) => b.value - a.value);
  }
  return COST_TYPE_ORDER.map((id) => {
    const value = costTypeTotal(quarter, id);
    const target = COST_TYPE_META[id].quarterlyTarget;
    const variance = variancePct(value, target);
    return {
      id,
      label: COST_TYPE_META[id].name,
      value,
      target,
      variance,
      severity: classifySeverity(variance),
      share: total > 0 ? (value / total) * 100 : 0,
      meta: "Company-wide",
    };
  }).sort((a, b) => b.value - a.value);
}

function tileFontSize(area: number): string {
  if (area >= 0.16) return "text-base sm:text-lg";
  if (area >= 0.07) return "text-sm sm:text-base";
  if (area >= 0.03) return "text-xs sm:text-sm";
  return "text-[11px] sm:text-xs";
}

function tileValueFontSize(area: number): string {
  if (area >= 0.16) return "text-lg sm:text-xl";
  if (area >= 0.07) return "text-base sm:text-lg";
  if (area >= 0.03) return "text-sm sm:text-base";
  return "text-xs sm:text-sm";
}

export default function Treemap({
  grouping,
  quarter,
  selectedId,
  onSelect,
}: {
  grouping: Grouping;
  quarter: Quarter;
  selectedId: string;
  onSelect: (id: string, kind: Grouping) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const tooltipId = useId();

  const tiles = buildTiles(grouping, quarter);
  const rects = layoutTreemap(tiles.map((t) => ({ id: t.id, value: t.value })));
  const rectById = new Map(rects.map((r) => [r.id, r]));

  const activeId = focusId ?? hoverId;
  const activeTile = tiles.find((t) => t.id === activeId) ?? null;
  const activeRect = activeId ? rectById.get(activeId) ?? null : null;

  const total = tiles.reduce((sum, t) => sum + t.value, 0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className={cx("text-xs font-normal", TEXT_AUX)}>
          {grouping === "department" ? "Click a department to see its cost-type breakdown." : "Click a cost type to see which departments drive it."}
        </p>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-zinc-200" />
          <span className={cx("text-[11px] font-medium", TEXT_MUTED)}>Within budget</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
          <span className={cx("text-[11px] font-medium", TEXT_MUTED)}>Over budget</span>
        </span>
      </div>

      {/* Desktop / tablet: true recursive treemap, absolutely positioned within a fixed-ratio box. */}
      <div className="relative mt-3 hidden w-full overflow-visible sm:block" style={{ aspectRatio: "280 / 120" }}>
        {tiles.map((tile) => {
          const rect = rectById.get(tile.id);
          if (!rect) return null;
          const tone = SEVERITY_TILE[tile.severity];
          const area = tileArea(rect);
          const selected = tile.id === selectedId;
          const isActive = tile.id === activeId;
          return (
            <div key={tile.id} className="absolute p-[2px]" style={{ left: `${rect.xPct}%`, top: `${rect.yPct}%`, width: `${rect.wPct}%`, height: `${rect.hPct}%` }}>
              <button
                type="button"
                onMouseEnter={() => setHoverId(tile.id)}
                onMouseLeave={() => setHoverId((cur) => (cur === tile.id ? null : cur))}
                onFocus={() => setFocusId(tile.id)}
                onBlur={() => setFocusId((cur) => (cur === tile.id ? null : cur))}
                onClick={() => onSelect(tile.id, grouping)}
                aria-describedby={isActive ? tooltipId : undefined}
                aria-pressed={selected}
                className={cx(
                  "flex h-full w-full flex-col items-start justify-between overflow-hidden rounded-lg p-2 text-left",
                  tone.bg,
                  selected ? "border-2 border-zinc-900" : cx("border", tone.border),
                  TRANSITION,
                  FOCUS,
                )}
              >
                <span className={cx("block w-full truncate font-medium leading-tight", tileFontSize(area), tone.text)}>{tile.label}</span>
                <span className={cx("block w-full truncate font-semibold leading-tight", tileValueFontSize(area), NUM, tone.text)}>
                  {area >= 0.03 ? formatCurrency(tile.value) : formatCurrencyCompact(tile.value)}
                </span>
                <span className="sr-only">
                  {formatPercent(tile.share)} of total. {tile.meta}. {SEVERITY_LABEL[tile.severity]}
                  {tile.severity !== "within" ? `, ${formatSignedPercent(tile.variance)} vs target` : ""}.
                </span>
              </button>
            </div>
          );
        })}

        {/* Crosshair + tooltip: strictly additive — label and value are already real text on every
            tile above; this only layers in share/variance context on hover or keyboard focus. */}
        {activeTile && activeRect ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute inset-y-0 w-px bg-rose-300/70" style={{ left: `${activeRect.xPct + activeRect.wPct / 2}%` }} />
            <div className="absolute inset-x-0 h-px bg-rose-300/70" style={{ top: `${activeRect.yPct + activeRect.hPct / 2}%` }} />
          </div>
        ) : null}
        {activeTile && activeRect ? (
          <div
            id={tooltipId}
            role="tooltip"
            className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-lg shadow-zinc-900/10"
            style={{
              left: `${Math.min(Math.max(activeRect.xPct + activeRect.wPct / 2, 14), 86)}%`,
              top: `${activeRect.yPct + activeRect.hPct / 2 > 50 ? activeRect.yPct - 2 : activeRect.yPct + activeRect.hPct + 2}%`,
              transform: `translate(-50%, ${activeRect.yPct + activeRect.hPct / 2 > 50 ? "-100%" : "0%"})`,
            }}
          >
            <p className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{activeTile.label}</p>
            <p className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(activeTile.value)}</p>
            <p className={cx("mt-1 text-[11px] font-normal", TEXT_AUX)}>
              {formatPercent(activeTile.share)} of total · {activeTile.meta}
            </p>
            <span className={cx("mt-1.5 inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium", SEVERITY_BADGE[activeTile.severity])}>
              {SEVERITY_LABEL[activeTile.severity]}
              {activeTile.severity !== "within" ? ` · ${formatSignedPercent(activeTile.variance)}` : ""}
            </span>
          </div>
        ) : null}
      </div>

      {/* Mobile: the treemap simplifies to a stacked, proportional bar list — same tiles, same
          values, no absolutely-positioned rectangles that would shrink below legibility. */}
      <ul className="mt-3 flex flex-col gap-2 sm:hidden">
        {tiles.map((tile) => {
          const tone = SEVERITY_TILE[tile.severity];
          const selected = tile.id === selectedId;
          const isActive = tile.id === activeId;
          const widthPct = total > 0 ? Math.max((tile.value / total) * 100, 6) : 6;
          return (
            <li key={tile.id}>
              <button
                type="button"
                onClick={() => onSelect(tile.id, grouping)}
                onFocus={() => setFocusId(tile.id)}
                onBlur={() => setFocusId((cur) => (cur === tile.id ? null : cur))}
                aria-pressed={selected}
                className={cx("w-full rounded-lg p-2.5 text-left", selected ? "border-2 border-zinc-900" : cx("border", tone.border), TRANSITION, FOCUS)}
                style={{ background: "transparent" }}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{tile.label}</span>
                  <span className={cx("shrink-0 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatCurrency(tile.value)}</span>
                </span>
                <span className="mt-1.5 block h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <span className={cx("block h-full rounded-full", tone.bg)} style={{ width: `${widthPct}%` }} />
                </span>
                {isActive ? (
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={cx("inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium", SEVERITY_BADGE[tile.severity])}>
                      {SEVERITY_LABEL[tile.severity]}
                      {tile.severity !== "within" ? ` · ${formatSignedPercent(tile.variance)}` : ""}
                    </span>
                    <span className={cx("text-[11px] font-normal", TEXT_AUX)}>
                      {formatPercent(tile.share)} of total · {tile.meta}
                    </span>
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <p className={cx("mt-3 text-xs font-normal", TEXT_AUX)}>
        {formatCurrency(total)} shown{grouping === "department" ? " across departments" : " across cost types"}, {formatCurrency(companyTotal(quarter))} company-wide.
      </p>
    </div>
  );
}
