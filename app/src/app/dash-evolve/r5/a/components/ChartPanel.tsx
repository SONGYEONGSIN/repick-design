"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useId, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";
import { generateSeries, PERIODS, PERIOD_LABEL, type Instrument, type Period, type SeriesPoint } from "../lib/data";
import { formatPct, formatRate } from "../lib/format";
import { clamp, round2 } from "../lib/math";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, SegmentedControl } from "./ui";

const CHART_W = 720;
const CHART_H = 260;
const PAD_Y = 18;

function LineChart({ series, instrument, period }: { series: SeriesPoint[]; instrument: Instrument; period: Period }) {
  const gradientBase = useId();
  const gradientIdLight = `${gradientBase}-light`;
  const gradientIdDark = `${gradientBase}-dark`;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const values = series.map((p) => p.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || Math.max(max * 0.005, 0.0001);
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
  const tooltipLeftPct = clamp((activeX / CHART_W) * 100, 10, 90);

  const rising = activePoint.value >= series[0].value;
  const lineColor = rising ? "rgb(5 150 105)" : "rgb(220 38 38)"; // emerald-600 / red-600
  const lineColorDark = rising ? "rgb(52 211 153)" : "rgb(248 113 113)"; // emerald-400 / red-400

  function indexFromClientX(clientX: number, rect: DOMRect) {
    const fraction = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(fraction * (series.length - 1));
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverIndex(indexFromClientX(e.clientX, rect));
  }

  function handleKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
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
  const axisStart = series[0].label;
  const axisMid = series[Math.floor((series.length - 1) / 2)].label;
  const axisEnd = series[series.length - 1].label;

  return (
    <div className="flex h-full flex-col">
      <div
        role="slider"
        tabIndex={0}
        aria-label={`${instrument.pair} 환율 차트, ${PERIOD_LABEL[period]} 기간. 화살표 키로 시점을 탐색합니다.`}
        aria-valuemin={0}
        aria-valuemax={series.length - 1}
        aria-valuenow={activeIndex}
        aria-valuetext={`${activePoint.full}, ${formatRate(activePoint.value, instrument)}`}
        aria-orientation="horizontal"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        onKeyDown={handleKeyDown}
        onBlur={() => setHoverIndex(null)}
        className={cx(
          "relative min-h-[220px] w-full flex-1 cursor-crosshair select-none rounded-lg outline-none",
          FOCUS_RING,
        )}
      >
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible" role="presentation">
          <defs>
            <linearGradient id={gradientIdLight} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.16" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={gradientIdDark} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColorDark} stopOpacity="0.22" />
              <stop offset="100%" stopColor={lineColorDark} stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridValues.map((gv, i) => (
            <line key={i} x1={0} x2={CHART_W} y1={mapY(gv)} y2={mapY(gv)} stroke="currentColor" className="text-zinc-100 dark:text-white/5" strokeWidth={1} />
          ))}

          <path d={areaPath} fill={`url(#${gradientIdLight})`} className="dark:hidden" />
          <path d={areaPath} fill={`url(#${gradientIdDark})`} className="hidden dark:block" />
          <path d={linePath} fill="none" stroke={lineColor} className="dark:hidden" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          <path d={linePath} fill="none" stroke={lineColorDark} className="hidden dark:block" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {hoverIndex !== null && (
            <line x1={activeX} x2={activeX} y1={PAD_Y} y2={CHART_H - PAD_Y} stroke="currentColor" className="text-zinc-300 dark:text-white/25" strokeWidth={1} strokeDasharray="3 3" />
          )}
          <circle cx={activeX} cy={activeY} r={4} fill={lineColor} stroke="white" strokeWidth={2} className="dark:hidden" />
          <circle cx={activeX} cy={activeY} r={4} fill={lineColorDark} stroke="#09090b" strokeWidth={2} className="hidden dark:block" />
        </svg>

        {gridValues.map((gv, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cx("pointer-events-none absolute right-1 -translate-y-1/2 text-[10px]", NUM, TEXT_CAPTION)}
            style={{ top: `${(mapY(gv) / CHART_H) * 100}%` }}
          >
            {formatRate(gv, instrument)}
          </span>
        ))}

        {hoverIndex !== null && (
          <div
            aria-hidden="true"
            className={cx(
              "pointer-events-none absolute -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-lg border px-2.5 py-1.5 text-xs shadow-lg",
              BORDER,
              "bg-white dark:bg-zinc-800",
            )}
            style={{ left: `${tooltipLeftPct}%`, top: `${(activeY / CHART_H) * 100}%` }}
          >
            <p className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{formatRate(activePoint.value, instrument)}</p>
            <p className={cx(NUM, TEXT_CAPTION)}>{activePoint.full}</p>
          </div>
        )}
      </div>

      <div className={cx("mt-2 flex shrink-0 items-center justify-between px-1 text-[11px]", NUM, TEXT_CAPTION)} aria-hidden="true">
        <span>{axisStart}</span>
        <span>{axisMid}</span>
        <span>{axisEnd}</span>
      </div>
    </div>
  );
}

export default function ChartPanel({
  instrument,
  period,
  onPeriodChange,
}: {
  instrument: Instrument;
  period: Period;
  onPeriodChange: (p: Period) => void;
}) {
  const panelId = "chart-panel";
  const series = generateSeries(instrument, period);
  const current = series[series.length - 1].value;
  const start = series[0].value;
  const changePct = round2(((current - start) / start) * 100);
  const changeAbs = round2(current - start);
  const tone = changePct > 0.01 ? "positive" : changePct < -0.01 ? "negative" : "neutral";
  const Icon = changePct > 0.01 ? TrendingUp : changePct < -0.01 ? TrendingDown : Minus;

  return (
    <Card className="flex h-full min-w-0 flex-1 flex-col">
      <CardHeader
        titleId="chart-heading"
        title={`${instrument.pair} 환율 추이`}
        description="크로스헤어로 시점별 환율을 확인하세요"
        action={
          <SegmentedControl
            ariaLabel="차트 기간 선택"
            options={PERIODS.map((p) => ({ id: p, label: p }))}
            value={period}
            onChange={onPeriodChange}
          />
        }
      />

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <p className={cx("text-3xl font-semibold sm:text-4xl", NUM, TEXT_PRIMARY)}>{formatRate(current, instrument)}</p>
        <div className="mb-1 flex items-center gap-2">
          <Badge tone={tone} Icon={Icon}>
            {formatPct(changePct, true)}
          </Badge>
          <span className={cx("text-xs", NUM, TEXT_CAPTION)}>
            {changeAbs >= 0 ? "+" : ""}
            {formatRate(changeAbs, instrument)} · {PERIOD_LABEL[period]}
          </span>
        </div>
      </div>

      <div id={panelId} role="region" aria-labelledby="chart-heading" className="mt-4 flex min-h-0 flex-1 flex-col">
        <LineChart series={series} instrument={instrument} period={period} />
      </div>
    </Card>
  );
}
