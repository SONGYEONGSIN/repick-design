"use client";

import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { useState } from "react";
import type { TrendPoint } from "../../lib/data";
import { formatDate, formatNumber, round2 } from "../../lib/format";
import { Card, WidgetHeader } from "../ui";

const W = 640;
const H = 220;
const PAD_X = 10;
const PAD_Y = 18;

export default function TrendWidget({
  id,
  highlighted,
  title,
  subtitle,
  data,
}: {
  id: string;
  highlighted: boolean;
  title: string;
  subtitle: string;
  data: TrendPoint[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const n = data.length;
  const step = n > 1 ? innerW / (n - 1) : 0;

  const xFor = (i: number) => round2(PAD_X + i * step);
  const yFor = (v: number) => round2(PAD_Y + innerH - ((v - min) / range) * innerH);

  const linePoints = data.map((d, i) => `${xFor(i)},${yFor(d.value)}`).join(" ");
  const areaPoints = `${xFor(0)},${H - PAD_Y} ${linePoints} ${xFor(n - 1)},${H - PAD_Y}`;

  const indexFromClientX = (clientX: number, rect: DOMRect): number => {
    const ratio = (clientX - rect.left) / rect.width;
    return Math.min(n - 1, Math.max(0, Math.round(ratio * (n - 1))));
  };

  const handlePointerMove = (e: ReactPointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveIndex(indexFromClientX(e.clientX, rect));
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((cur) => Math.min(n - 1, (cur ?? -1) + 1));
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((cur) => Math.max(0, (cur ?? n) - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(n - 1);
    }
  };

  const active = activeIndex !== null ? data[activeIndex] : null;
  const activeX = activeIndex !== null ? xFor(activeIndex) : null;
  const activeY = activeIndex !== null ? yFor(data[activeIndex].value) : null;

  const tooltipAlign: "start" | "center" | "end" =
    activeIndex === null ? "center" : activeIndex === 0 ? "start" : activeIndex === n - 1 ? "end" : "center";
  const tooltipTransform =
    tooltipAlign === "start" ? "translateX(0)" : tooltipAlign === "end" ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <Card id={id} highlighted={highlighted} className="col-span-12 flex min-w-0 flex-col gap-4 p-4 sm:p-5 lg:col-span-8">
      <WidgetHeader
        title={title}
        subtitle={subtitle}
        right={
          <span className="text-lg font-semibold tabular-nums text-zinc-900">
            {formatNumber(values[values.length - 1])}
            <span className="ml-1 text-xs font-medium text-zinc-500">명 · 오늘</span>
          </span>
        }
      />

      <div
        className="relative min-w-0 outline-none"
        tabIndex={0}
        role="group"
        aria-label={`${title} 라인 차트. 화살표 키로 지점을 탐색할 수 있습니다.`}
        onKeyDown={handleKeyDown}
        onBlur={() => setActiveIndex(null)}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[220px] w-full text-indigo-600" preserveAspectRatio="none" role="img" aria-hidden="true">
          {/* 그리드 라인 */}
          <line x1={PAD_X} y1={PAD_Y} x2={W - PAD_X} y2={PAD_Y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          <line x1={PAD_X} y1={H - PAD_Y} x2={W - PAD_X} y2={H - PAD_Y} stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" />

          <polygon points={areaPoints} fill="currentColor" fillOpacity="0.08" stroke="none" />
          <polyline points={linePoints} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

          {activeX !== null && activeY !== null ? (
            <>
              <line x1={activeX} y1={PAD_Y} x2={activeX} y2={H - PAD_Y} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx={activeX} cy={activeY} r="4" fill="white" stroke="currentColor" strokeWidth="2" />
            </>
          ) : null}

          {/* 포인터/터치 캡처 레이어 */}
          <rect
            x="0"
            y="0"
            width={W}
            height={H}
            fill="transparent"
            onPointerMove={handlePointerMove}
            className="cursor-crosshair"
          />
        </svg>

        {active && activeX !== null ? (
          <div
            className="pointer-events-none absolute top-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-md"
            style={{ left: `${(activeX / W) * 100}%`, transform: tooltipTransform }}
          >
            <p className="font-medium text-zinc-900">{formatDate(active.date)}</p>
            <p className="tabular-nums text-zinc-600">{formatNumber(active.value)}명 활성</p>
          </div>
        ) : null}

        <span className="sr-only" aria-live="polite">
          {active ? `${formatDate(active.date)}: 활성 사용자 ${formatNumber(active.value)}명` : ""}
        </span>

        <div className="mt-1 flex justify-between text-xs text-zinc-500">
          <span>{formatDate(data[0].date)}</span>
          <span>{formatDate(data[n - 1].date)}</span>
        </div>
      </div>
    </Card>
  );
}
