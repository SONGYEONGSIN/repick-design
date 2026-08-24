"use client";

/**
 * The one thin auxiliary surface under the grid: four plan segments, sortable, and doubling as the
 * segment filter (pressing a segment name re-slices the matrix above it).
 *
 * It deliberately knows nothing about the baseline. Pinning a cohort re-encodes the grid; it does
 * not ripple into a second and third widget, which is the whole point of routing the pin through a
 * `GridEncoding` instead of a shared `selectedId`.
 *
 * Five columns, not eight: at 390px a wider table-fixed layout compresses percentage columns below
 * the intrinsic width of their own numerals, and the digits bleed into the neighbouring column
 * without ever overflowing the page — invisible to a scrollWidth sweep.
 */

import { useState } from "react";
import { formatCount, formatRate, type SegmentFilter, type SegmentSummaryRow } from "./cohort-data";
import { FOCUS_RING, LABEL, Sparkline, SortIndicator } from "./ui";

type SortKey = "label" | "accounts" | "m3" | "m6";

const COLUMNS: { key: SortKey; label: string; hint: string; align: "left" | "right"; width: string }[] = [
  { key: "label", label: "세그먼트", hint: "요금제 이름순", align: "left", width: "30%" },
  { key: "accounts", label: "계정", hint: "누적 가입 계정 수", align: "right", width: "17%" },
  { key: "m3", label: "M3", hint: "가입 후 3개월 가중 평균 잔존율, 퍼센트", align: "right", width: "16%" },
  { key: "m6", label: "M6", hint: "가입 후 6개월 가중 평균 잔존율, 퍼센트", align: "right", width: "16%" },
];

export default function SegmentPanel({
  rows,
  segment,
  onSegment,
}: {
  rows: SegmentSummaryRow[];
  segment: SegmentFilter;
  onSegment: (next: SegmentFilter) => void;
}) {
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "accounts",
    dir: "desc",
  });

  const sorted = [...rows].sort((a, b) => {
    const direction = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "label") return a.label.localeCompare(b.label) * direction;
    return (a[sort.key] - b[sort.key]) * direction;
  });

  function toggle(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "label" ? "asc" : "desc" },
    );
  }

  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">
        요금제 세그먼트별 누적 계정과 잔존율. M3와 M6 열은 가중 평균 잔존율을 퍼센트로 적었고, 마지막 열은
        M0부터 M11까지의 잔존 곡선입니다. 세그먼트 이름을 누르면 위 코호트 행렬이 그 세그먼트만으로 다시
        계산됩니다.
      </caption>
      <colgroup>
        {COLUMNS.map((column) => (
          <col key={column.key} style={{ width: column.width }} />
        ))}
        <col style={{ width: "21%" }} />
      </colgroup>
      <thead>
        <tr className="border-b border-zinc-200">
          {COLUMNS.map((column) => {
            const isActive = sort.key === column.key;
            return (
              <th
                key={column.key}
                scope="col"
                aria-sort={isActive ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                className="pb-1.5"
              >
                <button
                  type="button"
                  onClick={() => toggle(column.key)}
                  className={`relative flex h-7 w-full items-center gap-1 rounded-[4px] px-1 ${LABEL} hover:bg-zinc-100 ${FOCUS_RING} ${
                    column.align === "right" ? "justify-end" : "justify-start"
                  }`}
                >
                  {column.label}
                  <SortIndicator state={isActive ? sort.dir : "none"} />
                  <span className="sr-only">
                    {" "}
                    — {column.hint}. 누르면 이 열로 정렬합니다.
                  </span>
                </button>
              </th>
            );
          })}
          <th scope="col" className={`pb-1.5 pl-2 text-right ${LABEL}`}>
            곡선
          </th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((row) => {
          const active = segment === row.id;
          return (
            <tr key={row.id} className="border-b border-zinc-100 last:border-b-0">
              <th scope="row" className="py-1 pr-1 text-left font-normal">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSegment(active ? "all" : row.id)}
                  className={`relative flex h-11 w-full flex-col justify-center rounded-[6px] border px-2 text-left transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                    active
                      ? "border-orange-300 bg-orange-50"
                      : "border-transparent hover:border-zinc-200 hover:bg-zinc-50"
                  }`}
                >
                  <span
                    className={`truncate text-[13px] font-medium ${active ? "text-orange-900" : "text-zinc-900"}`}
                  >
                    {row.label}
                  </span>
                  <span className="truncate text-[10px] tabular-nums text-zinc-600">
                    매출 {formatRate(row.revenueShare)}%
                  </span>
                  <span className="sr-only">
                    {active
                      ? " 세그먼트만 보는 중입니다. 누르면 전체로 돌아갑니다."
                      : " 세그먼트만 보도록 행렬을 다시 계산합니다."}
                  </span>
                </button>
              </th>
              <td className="px-1 text-right text-[13px] tabular-nums text-zinc-900">
                {formatCount(row.accounts)}
              </td>
              <td className="px-1 text-right text-[13px] tabular-nums text-zinc-900">
                {formatRate(row.m3)}
              </td>
              <td className="px-1 text-right text-[13px] tabular-nums text-zinc-900">
                {formatRate(row.m6)}
              </td>
              <td className="pl-2">
                <Sparkline values={row.spark} className="block h-[22px] w-full" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
