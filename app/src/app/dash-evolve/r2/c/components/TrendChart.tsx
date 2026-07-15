"use client";

import type { KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { SENT_HISTORY } from "../lib/data";
import { formatDate, formatNumber } from "../lib/format";

interface Point {
  id: string;
  name: string;
  date: string;
  recipients: number;
  x: number;
  y: number;
}

function buildPoints(): Point[] {
  const values = SENT_HISTORY.map((row) => row.recipients);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const n = SENT_HISTORY.length;
  return SENT_HISTORY.map((row, i) => {
    const x = Number(((i * 100) / (n - 1 || 1)).toFixed(2));
    const yRatio = (row.recipients - min) / range;
    const y = Number((88 - yRatio * 72).toFixed(2)); // 16..88 범위로 패딩
    return { id: row.id, name: row.name, date: row.date, recipients: row.recipients, x, y };
  });
}

const POINTS = buildPoints();
const POLYLINE = POINTS.map((p) => `${p.x},${p.y}`).join(" ");

function clampLeftClass(x: number): string {
  if (x < 14) return "left-0 translate-x-0";
  if (x > 86) return "right-0 left-auto translate-x-0";
  return "-translate-x-1/2";
}

export default function TrendChart() {
  const [active, setActive] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = Math.min(POINTS.length - 1, Math.max(0, index + dir));
    setActive(next);
    document.getElementById(`trend-point-${next}`)?.focus();
  };

  const handleMouseLeave = () => {
    if (!containerRef.current?.contains(document.activeElement)) setActive(null);
  };

  const activePoint = active !== null ? POINTS[active] : null;

  return (
    <div>
      <div
        ref={containerRef}
        onMouseLeave={handleMouseLeave}
        className="relative h-32 w-full sm:h-36"
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full text-indigo-500"
          aria-hidden="true"
        >
          <line x1="0" y1="88" x2="100" y2="88" stroke="currentColor" strokeOpacity="0.12" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <polyline
            points={POLYLINE}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {active !== null ? (
            <line
              x1={POINTS[active].x}
              y1="0"
              x2={POINTS[active].x}
              y2="100"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ) : null}
        </svg>

        {POINTS.map((p, i) => (
          <button
            key={p.id}
            id={`trend-point-${i}`}
            type="button"
            onFocus={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            aria-label={`${p.name}, ${formatDate(p.date)}, ${formatNumber(p.recipients)}명 발송`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            className="absolute flex size-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <span
              className={`block size-2 rounded-full transition-transform motion-reduce:transition-none ${
                active === i ? "scale-125 bg-indigo-600" : "bg-indigo-300"
              }`}
              aria-hidden="true"
            />
          </button>
        ))}

        {activePoint ? (
          <div
            role="status"
            style={{ left: `${activePoint.x}%`, top: `${activePoint.y}%` }}
            className={`pointer-events-none absolute z-10 mt-[-14px] w-max -translate-y-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs shadow-md ${clampLeftClass(
              activePoint.x
            )}`}
          >
            <p className="font-medium text-zinc-800">{activePoint.name}</p>
            <p className="tabular-nums text-zinc-500">
              {formatDate(activePoint.date)} · {formatNumber(activePoint.recipients)}명
            </p>
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {activePoint
          ? `선택된 지점: ${activePoint.name}, ${formatDate(activePoint.date)}, ${formatNumber(activePoint.recipients)}명 발송`
          : ""}
      </p>
    </div>
  );
}
