"use client";

import { useState, type KeyboardEvent } from "react";
import { cx, focusRing } from "./ui";
import { num, pct } from "./data";

/**
 * Seat consumption against licensed capacity for one contract, T-12 → renewal.
 *
 * Rendered as SVG geometry inside an HTML coordinate shell: the plot paths live in a
 * `preserveAspectRatio="none"` viewBox (with `non-scaling-stroke`, so line weight stays even),
 * while every dot, gridline, label and tooltip is a percentage-positioned HTML node. That keeps
 * typography at real pixel sizes at any container width instead of scaling down with the viewBox.
 *
 * The chart has no state of its own beyond a transient hover index — the persistent cursor is the
 * vantage the detail pane owns, so arrow keys here move the same control the scrubber does.
 */

type Props = {
  labels: Array<{ long: string; short: string }>;
  licensed: number[];
  active: number[];
  tickets: number[];
  vantage: number;
  onVantage: (index: number) => void;
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const X = (i: number) => r2(2 + i * 8);
const LAST = 12;

export default function UsageChart({
  labels,
  licensed,
  active,
  tickets,
  vantage,
  onVantage,
}: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const ceiling = Math.max(...licensed) * 1.12;
  const Y = (value: number) => r2(96 - (value / ceiling) * 88);

  // Licensed capacity as a step area — seats are bought in blocks, not interpolated.
  let capacity = `M ${X(0)},96 L ${X(0)},${Y(licensed[0])}`;
  for (let i = 1; i <= LAST; i += 1) {
    if (licensed[i] !== licensed[i - 1]) {
      capacity += ` L ${X(i)},${Y(licensed[i - 1])} L ${X(i)},${Y(licensed[i])}`;
    } else {
      capacity += ` L ${X(i)},${Y(licensed[i])}`;
    }
  }
  capacity += ` L ${X(LAST)},96 Z`;

  const activeLine = active.map((v, i) => `${i === 0 ? "M" : "L"} ${X(i)},${Y(v)}`).join(" ");
  const activeArea = `${activeLine} L ${X(LAST)},96 L ${X(0)},96 Z`;

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(Math.max(...licensed) * f));
  const maxTickets = Math.max(1, ...tickets);
  const readIndex = hover ?? vantage;

  function pointerToIndex(clientX: number, element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    return Math.min(LAST, Math.max(0, Math.round((ratio - 2) / 8)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onVantage(Math.max(0, vantage - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onVantage(Math.min(LAST, vantage + 1));
    } else if (event.key === "Home") {
      event.preventDefault();
      onVantage(0);
    } else if (event.key === "End") {
      event.preventDefault();
      onVantage(LAST);
    }
  }

  const tipAlign =
    readIndex <= 2 ? "translateX(0)" : readIndex >= 10 ? "translateX(-100%)" : "translateX(-50%)";

  return (
    <div className="relative">
      {/* At-a-glance readout: the headline numbers are text before any hover happens. */}
      <div className="mb-3 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
        <span className="inline-flex items-baseline gap-2">
          <span
            aria-hidden="true"
            className="relative top-[-2px] inline-block h-[3px] w-4 rounded-full bg-rose-400"
          />
          <span className="text-xs text-zinc-400">활성 좌석</span>
          <span className="text-sm font-semibold tabular-nums text-zinc-50">
            {num(active[vantage])}석
          </span>
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span
            aria-hidden="true"
            className="relative top-[-2px] inline-block h-2.5 w-4 rounded-[2px] border border-white/25 bg-white/10"
          />
          <span className="text-xs text-zinc-400">라이선스</span>
          <span className="text-sm font-semibold tabular-nums text-zinc-50">
            {num(licensed[vantage])}석
          </span>
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span className="text-xs text-zinc-400">활용률</span>
          <span className="text-sm font-semibold tabular-nums text-zinc-50">
            {pct(active[vantage] / licensed[vantage])}
          </span>
        </span>
        <span className="inline-flex items-baseline gap-2">
          <span className="text-xs text-zinc-400">접수 티켓</span>
          <span className="text-sm font-semibold tabular-nums text-zinc-50">
            {num(tickets[vantage])}건
          </span>
        </span>
      </div>

      <div className="flex gap-2">
        {/* y gutter */}
        <div className="relative h-[196px] w-11 shrink-0">
          {gridValues.map((value) => (
            <span
              key={value}
              className="absolute right-0 -translate-y-1/2 text-[11px] tabular-nums text-zinc-400"
              style={{ top: `${Y(value)}%` }}
            >
              {num(value)}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div
            role="group"
            tabIndex={0}
            aria-label="좌석 사용량 추이 차트. 좌우 화살표 키로 시점을 옮기면 아래 수치가 함께 바뀝니다."
            onKeyDown={onKeyDown}
            onPointerMove={(e) => setHover(pointerToIndex(e.clientX, e.currentTarget))}
            onPointerLeave={() => setHover(null)}
            onPointerDown={(e) => onVantage(pointerToIndex(e.clientX, e.currentTarget))}
            className={cx(
              "relative h-[196px] cursor-crosshair rounded-lg border border-white/10 bg-zinc-950/40",
              focusRing,
            )}
          >
            {gridValues.map((value) => (
              <span
                key={value}
                aria-hidden="true"
                className="absolute inset-x-0 border-t border-white/[0.07]"
                style={{ top: `${Y(value)}%` }}
              />
            ))}

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <path d={capacity} fill="rgba(255,255,255,0.05)" />
              <path
                d={capacity}
                fill="none"
                stroke="rgba(228,228,231,0.35)"
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
              <path d={activeArea} fill="rgba(244,63,94,0.13)" />
              <path
                d={activeLine}
                fill="none"
                stroke="#fb7185"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* persistent vantage cursor */}
            <span
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-px bg-rose-400/60 transition-[left] duration-150 motion-reduce:transition-none"
              style={{ left: `${X(vantage)}%` }}
            />
            <span
              aria-hidden="true"
              className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-rose-400 transition-[left,top] duration-150 motion-reduce:transition-none"
              style={{ left: `${X(vantage)}%`, top: `${Y(active[vantage])}%` }}
            />

            {/* hover crosshair */}
            {hover !== null && hover !== vantage && (
              <>
                <span
                  aria-hidden="true"
                  className="absolute top-0 bottom-0 w-px bg-zinc-300/40"
                  style={{ left: `${X(hover)}%` }}
                />
                <span
                  aria-hidden="true"
                  className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-200"
                  style={{ left: `${X(hover)}%`, top: `${Y(active[hover])}%` }}
                />
              </>
            )}

            <div
              className="pointer-events-none absolute top-2 z-10 w-[164px] rounded-lg border border-white/15 bg-zinc-900 p-2.5 shadow-lg shadow-black/60"
              style={{ left: `${X(readIndex)}%`, transform: tipAlign }}
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400">
                {labels[readIndex].long}
              </p>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-zinc-400">활성</span>
                  <span className="text-xs font-semibold tabular-nums text-rose-300">
                    {num(active[readIndex])}석
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-zinc-400">라이선스</span>
                  <span className="text-xs font-semibold tabular-nums text-zinc-100">
                    {num(licensed[readIndex])}석
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs text-zinc-400">티켓</span>
                  <span className="text-xs font-semibold tabular-nums text-zinc-100">
                    {num(tickets[readIndex])}건
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* support ticket volume, sharing the x scale */}
          <div className="relative mt-2 h-8" aria-hidden="true">
            {tickets.map((count, i) => (
              <span
                key={labels[i].long}
                className={cx(
                  "absolute bottom-0 w-[4.4%] -translate-x-1/2 rounded-t-[2px]",
                  i === vantage ? "bg-rose-400" : "bg-rose-500/30",
                )}
                style={{
                  left: `${X(i)}%`,
                  height: `${r2(Math.max(count === 0 ? 2 : 8, (count / maxTickets) * 100))}%`,
                }}
              />
            ))}
          </div>

          <div className="relative mt-1.5 h-4">
            {[0, 3, 6, 9, 12].map((i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 text-[11px] tabular-nums text-zinc-400"
                style={{ left: `${X(i)}%` }}
              >
                {labels[i].short}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-zinc-400">
        면적 상단 점선은 계약 좌석, 실선은 실제 활성 좌석. 하단 막대는 월별 접수 티켓 수.
      </p>
    </div>
  );
}
