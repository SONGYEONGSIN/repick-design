"use client";

import { useState } from "react";
import { VENDORS, getVendorStat, formatNum, formatMs, STATUS_LABEL, type Period } from "./data";
import { Card, SrOnly } from "./ui";

const round2 = (n: number): number => Math.round(n * 100) / 100;

const CHART_W = 56;
const CHART_H = 160;
const CHART_TOP = 4;
const CHART_BOTTOM = 156;

function scaleY(value: number, domainMax: number): number {
  const ratio = Math.max(0, Math.min(1, value / domainMax));
  return round2(CHART_BOTTOM - ratio * (CHART_BOTTOM - CHART_TOP));
}

function BoxPlotGlyph({ min, q1, median, q3, max, domainMax }: { min: number; q1: number; median: number; q3: number; max: number; domainMax: number }) {
  const yMin = scaleY(min, domainMax);
  const yQ1 = scaleY(q1, domainMax);
  const yMed = scaleY(median, domainMax);
  const yQ3 = scaleY(q3, domainMax);
  const yMax = scaleY(max, domainMax);
  return (
    <svg width={CHART_W} height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`} aria-hidden="true" className="shrink-0">
      <line x1={28} x2={28} y1={yMax} y2={yQ3} stroke="#818cf8" strokeWidth={1.5} />
      <line x1={20} x2={36} y1={yMax} y2={yMax} stroke="#818cf8" strokeWidth={1.5} />
      <rect x={12} y={yQ3} width={32} height={Math.max(1, round2(yQ1 - yQ3))} fill="#eef2ff" stroke="#4f46e5" strokeWidth={1.5} rx={2} />
      <line x1={12} x2={44} y1={yMed} y2={yMed} stroke="#4f46e5" strokeWidth={2.5} />
      <line x1={28} x2={28} y1={yQ1} y2={yMin} stroke="#818cf8" strokeWidth={1.5} />
      <line x1={20} x2={36} y1={yMin} y2={yMin} stroke="#818cf8" strokeWidth={1.5} />
    </svg>
  );
}

/**
 * The strip's only horizontal scroller on the page (the hard rule is never two). Its vertical
 * reserve (`pt-28`) exists purely so the hover/focus tooltip has somewhere to render: `overflow-x:
 * auto` forces the paired `overflow-y` to `auto` too, but a child painting into the *padding* area
 * (rather than past the padding edge) is never clipped by that, so the tooltip can pop up above a
 * column without needing its own escape hatch.
 */
export function BoxPlotPanel({ period, pinnedId, onSelect }: { period: Period; pinnedId: string | null; onSelect: (id: string) => void }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const stats = VENDORS.map((v) => ({ vendor: v, stat: getVendorStat(v, period) }));
  const rawMax = Math.max(...stats.map((s) => s.stat.max));
  const domainMax = Math.ceil(rawMax / 100) * 100;

  return (
    <Card className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 pb-4">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-zinc-900">Response latency distribution</h2>
          <p className="mt-0.5 text-xs font-normal text-zinc-500">
            {VENDORS.length} vendors · {period} window · box marks Q1–median–Q3, whiskers mark min/max, chip marks outlier count
          </p>
        </div>
        <p className="shrink-0 text-xs font-normal tabular-nums text-zinc-500">Axis 0–{formatNum(domainMax)} ms</p>
      </div>

      <div className="min-w-0 overflow-x-auto px-5 pb-5 pt-28">
        <div className="flex min-w-0 items-end gap-3">
          {stats.map(({ vendor: v, stat }, index) => {
            const isHovered = hoveredId === v.id;
            const isPinned = pinnedId === v.id;
            const anchor = index === 0 ? "left-0" : index === stats.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2";
            return (
              <div key={v.id} className="relative flex w-16 shrink-0 flex-col items-center">
                {isHovered && (
                  <div aria-hidden="true" className={`absolute bottom-full z-10 mb-2 w-44 rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-left shadow-lg ${anchor}`}>
                    <p className="truncate text-xs font-medium text-zinc-50">{v.name}</p>
                    <p className="mt-1 text-[11px] font-normal text-zinc-300">
                      Median <span className="font-semibold tabular-nums text-zinc-50">{formatMs(stat.median)}</span>
                    </p>
                    <p className="text-[11px] font-normal tabular-nums text-zinc-300">
                      Q1 {formatNum(stat.q1)} · Q3 {formatNum(stat.q3)}
                    </p>
                    <p className="text-[11px] font-normal tabular-nums text-zinc-300">
                      Min {formatNum(stat.min)} · Max {formatNum(stat.max)}
                    </p>
                    <p className="text-[11px] font-normal text-zinc-300">
                      {stat.outliers} outlier{stat.outliers === 1 ? "" : "s"} · {STATUS_LABEL[stat.status]}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  id={`vendor-box-${v.id}`}
                  aria-pressed={isPinned}
                  onMouseEnter={() => setHoveredId(v.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(v.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => onSelect(v.id)}
                  className={`group flex flex-col items-center gap-1 rounded-lg p-1 outline-offset-2 transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-indigo-600 motion-reduce:transition-none ${
                    isPinned ? "bg-indigo-50" : "hover:bg-zinc-50"
                  }`}
                >
                  <span className="text-xs font-semibold tabular-nums text-zinc-900">{formatNum(stat.median)}</span>
                  <span className="relative">
                    <BoxPlotGlyph min={stat.min} q1={stat.q1} median={stat.median} q3={stat.q3} max={stat.max} domainMax={domainMax} />
                    {stat.outliers > 0 && (
                      <span className="absolute -right-2 -top-1 rounded-full bg-zinc-900 px-1 py-0.5 text-[10px] font-medium leading-none tabular-nums text-white">
                        +{stat.outliers}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-600">{v.code}</span>
                  <SrOnly>
                    {`milliseconds median. ${v.name}, ${v.category} vendor. Min ${stat.min}, first quartile ${stat.q1}, third quartile ${stat.q3}, max ${stat.max} milliseconds. ${stat.outliers} outlier${
                      stat.outliers === 1 ? "" : "s"
                    }. ${STATUS_LABEL[stat.status]}. ${isPinned ? "Pinned." : "Press to pin this vendor's summary card."}`}
                  </SrOnly>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
