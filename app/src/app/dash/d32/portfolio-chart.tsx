"use client";

import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { getAllocation, getAssetSeries, getPortfolioSeries, formatPrice, formatUSD } from "./data";
import { usePortfolio } from "./context";
import { Card, ChangeBadge } from "./ui";
import { cn } from "./utils";
import type { Period, SeriesPoint } from "./types";

const PERIODS: Period[] = ["1D", "1W", "1M", "1Y"];
const PERIOD_LABEL: Record<Period, string> = { "1D": "1일", "1W": "1주", "1M": "1개월", "1Y": "1년" };

const CHART_W = 640;
const CHART_H = 220;
const PAD_Y = 16;

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function PeriodTabs({
  period,
  onChange,
  panelId,
}: {
  period: Period;
  onChange: (p: Period) => void;
  panelId: string;
}) {
  const refs = useRef<Partial<Record<Period, HTMLButtonElement | null>>>({});

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const delta = e.key === "ArrowRight" ? 1 : -1;
      const next = PERIODS[(idx + delta + PERIODS.length) % PERIODS.length];
      onChange(next);
      refs.current[next]?.focus();
    }
  }

  return (
    <div role="tablist" aria-label="차트 기간 선택" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/5 p-1">
      {PERIODS.map((p, idx) => (
        <button
          key={p}
          ref={(el) => {
            refs.current[p] = el;
          }}
          role="tab"
          type="button"
          id={`period-tab-${p}`}
          aria-selected={p === period}
          aria-controls={panelId}
          tabIndex={p === period ? 0 : -1}
          onClick={() => onChange(p)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          className={cn(
            "min-h-9 rounded-md px-3 text-xs font-medium tabular-nums outline-none transition-colors",
            "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
            p === period ? "bg-white/10 text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

function LineChart({
  series,
  color,
  period,
  assetLabel,
}: {
  series: SeriesPoint[];
  color: string;
  period: Period;
  assetLabel: string;
}) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = series.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || Math.max(max * 0.01, 1);
  const plotH = CHART_H - PAD_Y * 2;

  function mapX(i: number) {
    return round2((i / (series.length - 1)) * CHART_W);
  }
  function mapY(v: number) {
    return round2(PAD_Y + ((max - v) / range) * plotH);
  }

  const linePoints = series.map((p, i) => `${mapX(i)},${mapY(p.value)}`).join(" L ");
  const linePath = `M ${linePoints}`;
  const areaPath = `M ${mapX(0)},${CHART_H} L ${linePoints} L ${mapX(series.length - 1)},${CHART_H} Z`;

  const activeIndex = hoverIndex ?? series.length - 1;
  const activePoint = series[activeIndex];
  const activeX = mapX(activeIndex);
  const activeY = mapY(activePoint.value);
  const tooltipLeftPct = clamp((activeX / CHART_W) * 100, 8, 92);

  function indexFromClientX(clientX: number, rect: DOMRect) {
    const fraction = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(fraction * (series.length - 1));
  }

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverIndex(indexFromClientX(e.clientX, rect));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setHoverIndex(clamp(activeIndex + 1, 0, series.length - 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setHoverIndex(clamp(activeIndex - 1, 0, series.length - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHoverIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHoverIndex(series.length - 1);
    }
  }

  const gridValues = [max, max - range / 3, max - (range * 2) / 3, min];
  const axisStartLabel = series[0].label || series[0].full;
  const axisMidLabel = series[Math.floor((series.length - 1) / 2)].label || "";
  const axisEndLabel = series[series.length - 1].label || series[series.length - 1].full;

  return (
    <div className="px-1">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${assetLabel} 가격 차트, ${PERIOD_LABEL[period]} 기간. 화살표 키로 시점을 탐색합니다.`}
        aria-valuemin={0}
        aria-valuemax={series.length - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`${activePoint.full}, ${formatUSD(activePoint.value)}`}
        aria-orientation="horizontal"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setHoverIndex(null)}
        className={cn(
          "relative h-64 w-full cursor-crosshair rounded-lg outline-none sm:h-80 lg:h-96",
          "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
        )}
      >
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          preserveAspectRatio="none"
          className="h-full w-full overflow-visible"
          role="presentation"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridValues.map((gv, i) => (
            <line
              key={i}
              x1={0}
              x2={CHART_W}
              y1={mapY(gv)}
              y2={mapY(gv)}
              stroke="currentColor"
              className="text-white/5"
              strokeWidth={1}
            />
          ))}

          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {hoverIndex !== null && (
            <line
              x1={activeX}
              x2={activeX}
              y1={PAD_Y}
              y2={CHART_H - PAD_Y}
              stroke="currentColor"
              className="text-white/25 motion-reduce:transition-none"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
          <circle cx={activeX} cy={activeY} r={4} fill={color} stroke="#09090b" strokeWidth={2} />
        </svg>

        {gridValues.map((gv, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="pointer-events-none absolute right-1 -translate-y-1/2 text-[10px] tabular-nums text-zinc-500"
            style={{ top: `${(mapY(gv) / CHART_H) * 100}%` }}
          >
            {formatPrice(gv)}
          </span>
        ))}

        {hoverIndex !== null && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border border-white/10 bg-zinc-800/95 px-2.5 py-1.5 text-xs shadow-lg motion-reduce:transition-none"
            style={{ left: `${tooltipLeftPct}%`, top: `${(activeY / CHART_H) * 100}%` }}
          >
            <p className="font-semibold tabular-nums text-zinc-50">{formatUSD(activePoint.value)}</p>
            <p className="tabular-nums text-zinc-400">{activePoint.full}</p>
          </div>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between px-1 text-[11px] tabular-nums text-zinc-500" aria-hidden="true">
        <span>{axisStartLabel}</span>
        <span>{axisMidLabel}</span>
        <span>{axisEndLabel}</span>
      </div>
    </div>
  );
}

export default function PortfolioChartCard() {
  const { selectedAssetId, period, setPeriod } = usePortfolio();
  const panelId = "portfolio-chart-panel";

  const isPortfolio = selectedAssetId === "portfolio";
  const series = isPortfolio ? getPortfolioSeries(period) : getAssetSeries(selectedAssetId, period);

  const allocation = getAllocation();
  const heldAsset = allocation.find((a) => a.holding.id === selectedAssetId)?.holding;

  const label = isPortfolio ? "전체 포트폴리오" : heldAsset?.name ?? selectedAssetId.toUpperCase();
  const color = isPortfolio ? "#6366F1" : heldAsset?.color ?? "#6366F1";
  const current = series[series.length - 1].value;
  const start = series[0].value;
  const changePct = round2(((current - start) / start) * 100);
  const changeUsd = round2(current - start);

  return (
    <Card
      id="portfolio-chart"
      title={label}
      description={isPortfolio ? "총 자산 가치 추이" : "자산 가격 추이"}
      action={<PeriodTabs period={period} onChange={setPeriod} panelId={panelId} />}
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <p className="min-w-0 break-words text-3xl font-semibold tabular-nums text-zinc-50 sm:text-4xl 2xl:text-5xl">
          {formatUSD(current)}
        </p>
        <div className="mb-1.5 flex items-center gap-2">
          <ChangeBadge value={changePct} />
          <span className="text-xs tabular-nums text-zinc-500">
            {changeUsd >= 0 ? "+" : ""}
            {formatUSD(changeUsd)} · {PERIOD_LABEL[period]}
          </span>
        </div>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`period-tab-${period}`} className="mt-5">
        <LineChart series={series} color={color} period={period} assetLabel={label} />
      </div>
    </Card>
  );
}
