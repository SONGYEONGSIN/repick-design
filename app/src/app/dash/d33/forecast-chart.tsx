"use client";

import { useId, useMemo, useState } from "react";
import { round2 } from "./format";

/**
 * 가중 예측 추이 — 면적+선 크로스헤어 차트.
 * 마우스 호버(위치→최근접 인덱스)와 키보드(← → Home End)로 활성 포인트를 이동하며
 * 툴팁·크로스헤어를 갱신한다. aria-live로 활성 포인트를 낭독한다.
 * 좌표는 소수 2자리 반올림(하이드레이션 안정), 선은 non-scaling-stroke로 스케일 왜곡 방지.
 */
export function ForecastChart({
  points,
  unit,
  ariaTitle,
}: {
  points: { label: string; value: number }[];
  unit: string;
  ariaTitle: string;
}) {
  const gradientId = useId();
  const n = points.length;
  const [active, setActive] = useState(n - 1);

  const idx = Math.min(Math.max(active, 0), n - 1);

  const { linePath, areaPath, coords, min, max } = useMemo(() => {
    const values = points.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    // 0..100 좌표계, 상하 12% 패딩.
    const xy = points.map((p, i) => {
      const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
      const y = round2(88 - ((p.value - lo) / span) * 76);
      return { x, y };
    });
    const line = xy.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
    const area = `${line} L100,100 L0,100 Z`;
    return { linePath: line, areaPath: area, coords: xy, min: lo, max: hi };
  }, [points, n]);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    const ratio = (e.clientX - rect.left) / rect.width;
    const i = Math.round(ratio * (n - 1));
    setActive(Math.min(Math.max(i, 0), n - 1));
  }

  function handleKey(e: React.KeyboardEvent<HTMLDivElement>) {
    let next = idx;
    if (e.key === "ArrowLeft") next = idx - 1;
    else if (e.key === "ArrowRight") next = idx + 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    setActive(Math.min(Math.max(next, 0), n - 1));
  }

  const activePoint = points[idx];
  const activeCoord = coords[idx];

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
          가중 예측 추이
        </span>
        <span className="text-[11px] text-zinc-400">
          최고 {max}
          {unit} · 최저 {min}
          {unit}
        </span>
      </div>
      <div
        role="img"
        aria-label={`${ariaTitle}. ${points
          .map((p) => `${p.label} ${p.value}${unit}`)
          .join(", ")}`}
        tabIndex={0}
        onKeyDown={handleKey}
        onPointerMove={handleMove}
        className="relative h-[68px] w-full cursor-crosshair touch-none rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(37 99 235)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="rgb(37 99 235)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path
            d={linePath}
            fill="none"
            stroke="rgb(37 99 235)"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* 크로스헤어 + 활성 포인트 (HTML 오버레이 — 스케일 왜곡 없음) */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-blue-500/30"
          style={{ left: `${activeCoord.x}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-600 shadow-sm"
          style={{ left: `${activeCoord.x}%`, top: `${activeCoord.y}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-zinc-900 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-white shadow-lg"
          style={{
            left: `${Math.min(Math.max(activeCoord.x, 12), 88)}%`,
            top: `${Math.max(activeCoord.y - 6, 4)}%`,
          }}
          aria-hidden="true"
        >
          {activePoint.label} · {activePoint.value}
          {unit}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {activePoint.label} 가중 예측 {activePoint.value}
        {unit}
      </p>
    </div>
  );
}
