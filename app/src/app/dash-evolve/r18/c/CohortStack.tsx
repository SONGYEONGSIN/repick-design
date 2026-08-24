"use client";

/**
 * Below xl the triangle is not squeezed — it is replaced.
 *
 * A twelve-column matrix cannot survive 390px: percentage columns compress under the intrinsic
 * width of their own text, the numbers bleed into each other, and a scrollWidth sweep never sees it
 * because nothing overflows. So the small-screen view is a different layout entirely — one stacked
 * card per cohort, its observed months as a four-across chip grid. Nothing here scrolls sideways,
 * nothing is an interactive target smaller than 44px, and the same `GridEncoding` paints it, so the
 * pin re-encodes this view exactly as it re-encodes the table.
 */

import { Pin } from "lucide-react";
import { formatCount, HORIZON, type MatrixRow, type PooledCell } from "./cohort-data";
import { CELL_INK, type GridEncoding } from "./encoding";
import { FOCUS_RING, LABEL } from "./ui";

const OFFSETS = Array.from({ length: HORIZON }, (_, index) => index);

function Chip({
  offset,
  label,
  bg,
  ink,
  detail,
}: {
  offset: number;
  label: string;
  bg: string;
  ink: string;
  detail: string;
}) {
  return (
    <li
      className="relative flex flex-col items-center justify-center gap-0.5 rounded-[5px] border border-zinc-900/10 px-1 py-2"
      style={{ backgroundColor: bg, color: ink }}
    >
      {/* Both lines carry the same ink: on a ramp cell no second text colour clears AA everywhere. */}
      <span className="text-[10px] leading-none tabular-nums" style={{ color: ink }}>
        M{offset}
      </span>
      <span className="text-[13px] font-semibold leading-none tabular-nums" style={{ color: ink }}>
        {label}
      </span>
      <span className="sr-only">{detail}</span>
    </li>
  );
}

export default function CohortStack({
  rows,
  pooled,
  encoding,
  onPin,
}: {
  rows: MatrixRow[];
  pooled: PooledCell[];
  encoding: GridEncoding;
  onPin: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <ul className="flex flex-col gap-2.5">
        {rows.map((row) => {
          const pinned = encoding.baselineId === row.id;
          const marginal = encoding.rowMarginal(row);
          return (
            <li
              key={row.id}
              className={`rounded-[9px] border bg-white p-3 ${
                pinned ? "border-orange-300 ring-1 ring-orange-200" : "border-zinc-200"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold tabular-nums tracking-[-0.01em] text-zinc-900">
                    {row.short} 코호트
                  </h3>
                  <p className="mt-0.5 text-[12px] tabular-nums text-zinc-600">
                    규모 {formatCount(row.accounts)}개 계정 · 관측 {row.observed}개월
                  </p>
                </div>
                <button
                  type="button"
                  aria-pressed={pinned}
                  onClick={() => onPin(row.id)}
                  className={`relative inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[8px] border px-3 text-[12px] font-medium transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                    pinned
                      ? "border-orange-300 bg-orange-50 text-orange-800"
                      : "border-zinc-200 bg-white text-zinc-700"
                  }`}
                >
                  <Pin
                    aria-hidden="true"
                    className={`size-4 ${pinned ? "text-orange-700" : "text-zinc-500"}`}
                  />
                  {pinned ? "기준 해제" : "기준 고정"}
                  <span className="sr-only"> — {row.long} 코호트</span>
                </button>
              </div>

              <p className="mt-2 flex items-baseline gap-1.5 text-[12px] text-zinc-600">
                <span className={LABEL}>{marginal.heading}</span>
                <span className="text-[14px] font-semibold tabular-nums text-zinc-900">
                  {marginal.value}
                </span>
                <span className="tabular-nums">{marginal.caption}</span>
              </p>

              <ul className="mt-2 grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-12">
                {OFFSETS.slice(0, row.observed).map((offset) => {
                  const paint = encoding.cell(row, offset);
                  if (!paint) return null;
                  return (
                    <Chip
                      key={offset}
                      offset={offset}
                      label={paint.label}
                      bg={paint.bg}
                      ink={paint.ink}
                      detail={paint.detail}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      <div className="rounded-[9px] border-2 border-zinc-200 bg-zinc-50 p-3">
        <h3 className="text-[13px] font-semibold text-zinc-900">열 요약 — 가중 평균</h3>
        <p className="mt-0.5 text-[12px] text-zinc-600">
          같은 경과 개월에 있는 모든 코호트를 합산한 값. {encoding.curve.caption}.
        </p>
        <ul className="mt-2 grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-12">
          {OFFSETS.map((offset) => {
            const column = encoding.column(offset);
            const cell = pooled[offset];
            return (
              <li
                key={offset}
                className="relative flex flex-col items-center justify-center gap-0.5 rounded-[5px] border border-zinc-200 bg-white px-1 py-2"
                style={{ color: CELL_INK }}
              >
                <span className="text-[10px] leading-none tabular-nums text-zinc-600">M{offset}</span>
                <span className="text-[13px] font-semibold leading-none tabular-nums text-zinc-900">
                  {column.label}
                </span>
                <span className="sr-only">
                  {column.detail}. 표본 {cell.cohorts}개 코호트.
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
