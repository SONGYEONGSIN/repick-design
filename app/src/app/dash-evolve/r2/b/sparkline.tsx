"use client";

import { useId, useMemo, useState } from "react";
import { round2 } from "./format";

export interface SparkPoint {
  label: string;
  value: number;
}

/**
 * 히어로 크로스헤어 차트 — 면적+선, 마우스 호버(위치→최근접 인덱스)와
 * 키보드(← → Home End)로 활성 포인트를 이동하며 툴팁을 갱신한다.
 * aria-live로 활성 포인트를 낭독. 좌표는 소수 2자리 반올림(하이드레이션 안정),
 * 고정 0~100 viewBox를 사용해 서버/클라이언트 렌더가 갈리지 않는다.
 */
export function CrosshairChart({
  points,
  formatValue,
  ariaTitle,
  accentClass = "text-sky-400",
  strokeColor = "rgb(56 189 248)",
  fillId,
}: {
  points: SparkPoint[];
  formatValue: (value: number) => string;
  ariaTitle: string;
  accentClass?: string;
  strokeColor?: string;
  fillId?: string;
}) {
  const gradientId = useId();
  const n = points.length;
  const [active, setActive] = useState<number | null>(null);
  const idx = active === null ? n - 1 : Math.min(Math.max(active, 0), n - 1);

  const { linePath, areaPath, coords, min, max } = useMemo(() => {
    const values = points.map((p) => p.value);
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    const xy = points.map((p, i) => {
      const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
      const y = round2(84 - ((p.value - lo) / span) * 68);
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
  const gid = fillId ?? gradientId;

  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`${ariaTitle}. ${points.map((p) => `${p.label || "구간"} ${formatValue(p.value)}`).join(", ")}`}
        tabIndex={0}
        onKeyDown={handleKey}
        onPointerMove={handleMove}
        onPointerLeave={() => setActive(null)}
        className="relative h-[104px] w-full cursor-crosshair touch-none rounded-lg focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill={`url(#${gid})`} />
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div
          className="pointer-events-none absolute top-0 bottom-0 w-px bg-sky-400/25"
          style={{ left: `${activeCoord.x}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-sky-400 shadow-[0_0_0_2px_rgba(56,189,248,0.25)]"
          style={{ left: `${activeCoord.x}%`, top: `${activeCoord.y}%` }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-zinc-800 px-2 py-1 text-[11px] font-medium whitespace-nowrap text-zinc-50 shadow-lg"
          style={{
            left: `${Math.min(Math.max(activeCoord.x, 14), 86)}%`,
            top: `${Math.max(activeCoord.y - 8, 4)}%`,
          }}
          aria-hidden="true"
        >
          {activePoint.label ? `${activePoint.label} · ` : ""}
          {formatValue(activePoint.value)}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {activePoint.label} {formatValue(activePoint.value)}
      </p>
      <div className={`mt-1 flex items-center justify-between text-[11px] tabular-nums ${accentClass}`}>
        <span className="text-zinc-500">최저 {formatValue(min)}</span>
        <span className="text-zinc-500">최고 {formatValue(max)}</span>
      </div>
    </div>
  );
}

/** 미니 스파크라인 — 벤토 소형 카드용, 정적 시각 요약(호버 없음). */
export function MiniSparkline({
  values,
  strokeColor = "rgb(52 211 153)",
  className = "",
}: {
  values: number[];
  strokeColor?: string;
  className?: string;
}) {
  const n = values.length;
  const path = useMemo(() => {
    const lo = Math.min(...values);
    const hi = Math.max(...values);
    const span = hi - lo || 1;
    return values
      .map((v, i) => {
        const x = n === 1 ? 0 : round2((i / (n - 1)) * 100);
        const y = round2(90 - ((v - lo) / span) * 80);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
  }, [values, n]);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={`h-full w-full ${className}`} aria-hidden="true">
      <path d={path} fill="none" stroke={strokeColor} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
