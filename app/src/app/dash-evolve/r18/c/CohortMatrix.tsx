"use client";

/**
 * The cohort triangle — rows are acquisition months, columns are months since signup, and every row
 * is one cell shorter than the one above it. That decreasing row length is the shape: this is a
 * triangular cohort matrix, not a calendar heatmap on a rectangular week x day field.
 *
 * The pin does not arrive here as a `selectedId`. It arrives already resolved into a `GridEncoding`,
 * and this component simply draws what the encoding says — cell text, ramp, row marginal, column
 * marginal and curve domain all come from that one object.
 *
 * Marginals live inside the same <table>: the two right-hand columns are the row marginals, the
 * <tfoot> carries the column marginals plus the pooled curve. A separating 2px rule tells them
 * apart from the body of the triangle.
 */

import { useRef, useState, type KeyboardEvent } from "react";
import { Crosshair, Pin } from "lucide-react";
import { formatCount, HORIZON, type MatrixRow, type PooledCell } from "./cohort-data";
import type { GridEncoding } from "./encoding";
import { FOCUS_RING, LABEL, SortIndicator } from "./ui";

const OFFSETS = Array.from({ length: HORIZON }, (_, index) => index);

const EMPTY_CELL = {
  backgroundImage: "repeating-linear-gradient(135deg,#F4F4F5 0 3px,#FAFAFA 3px 6px)",
};

type Cursor = { row: string; offset: number };

function curveGeometry(encoding: GridEncoding) {
  const [lo, hi] = encoding.curve.domain;
  const span = hi - lo || 1;
  const pad = 6;
  const height = 46;
  const usable = height - pad * 2;
  const yFor = (value: number) => Math.round((pad + (1 - (value - lo) / span) * usable) * 100) / 100;

  const pts: { x: number; y: number; value: number; offset: number }[] = [];
  encoding.curve.points.forEach((value, offset) => {
    if (value === null) return;
    pts.push({ x: Math.round((offset * 10 + 5) * 100) / 100, y: yFor(value), value, offset });
  });

  const baseY = encoding.curve.zero === null ? height - 1 : yFor(0);
  const firstX = pts.length > 0 ? pts[0].x : 0;
  const lastX = pts.length > 0 ? pts[pts.length - 1].x : 0;
  const path = pts.map((point) => `${point.x},${point.y}`).join(" ");
  return {
    pts,
    baseY,
    height,
    firstX,
    lastX,
    path,
    zeroY: encoding.curve.zero === null ? null : yFor(0),
  };
}

export default function CohortMatrix({
  rows,
  pooled,
  encoding,
  order,
  onToggleOrder,
  onPin,
  totalAccounts,
}: {
  rows: MatrixRow[];
  pooled: PooledCell[];
  encoding: GridEncoding;
  order: "oldest" | "newest";
  onToggleOrder: () => void;
  onPin: (id: string) => void;
  totalAccounts: number;
}) {
  const gridRef = useRef<HTMLTableElement | null>(null);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [active, setActive] = useState<Cursor>({ row: rows[0].id, offset: 0 });

  const cursorRow = cursor ? rows.find((row) => row.id === cursor.row) ?? null : null;
  const cursorPaint = cursorRow && cursor ? encoding.cell(cursorRow, cursor.offset) : null;

  const m3 = encoding.column(3);
  const readout =
    cursorPaint?.readout ??
    `${rows.length}개 코호트 · 누적 ${formatCount(totalAccounts)}개 계정 · ${encoding.metricLabel} ${
      m3.value === null ? "M3는 기준 코호트 관측 구간 밖" : `가중 평균 M3 ${m3.label}${encoding.unit}`
    }`;

  const geometry = curveGeometry(encoding);

  function focusCell(rowIndex: number, offset: number) {
    const target = rows[rowIndex];
    if (!target) return;
    const clamped = Math.max(0, Math.min(offset, target.observed - 1));
    const node = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-cell="${target.id}|${clamped}"]`,
    );
    if (node) node.focus();
  }

  function onCellKey(event: KeyboardEvent<HTMLButtonElement>, rowIndex: number, offset: number) {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "ArrowRight") focusCell(rowIndex, offset + 1);
    if (event.key === "ArrowLeft") focusCell(rowIndex, offset - 1);
    if (event.key === "ArrowDown") focusCell(rowIndex + 1, offset);
    if (event.key === "ArrowUp") focusCell(rowIndex - 1, offset);
    if (event.key === "Home") focusCell(rowIndex, 0);
    if (event.key === "End") focusCell(rowIndex, rows[rowIndex].observed - 1);
  }

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[8px] border border-zinc-200 bg-zinc-50 px-3 py-2">
        <Crosshair aria-hidden="true" className="size-4 shrink-0 text-orange-700" />
        <p className="min-w-0 flex-1 text-[12px] leading-snug tabular-nums text-zinc-900">{readout}</p>
        <p className="text-[11px] text-zinc-600">셀·행 머리글을 누르면 그 코호트가 기준선이 됩니다</p>
      </div>

      <table ref={gridRef} className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          코호트 잔존 행렬. 행은 가입한 달, 열은 가입 후 경과 개월. 최근 코호트일수록 관측된 개월 수가 짧아
          삼각형 모양이 됩니다. 오른쪽 두 열은 행 요약, 표 아래는 열 요약입니다. 현재 {encoding.statement}.
        </caption>
        <colgroup>
          <col style={{ width: "12%" }} />
          {OFFSETS.map((offset) => (
            <col key={offset} style={{ width: "5.5%" }} />
          ))}
          <col style={{ width: "8%" }} />
          <col style={{ width: "14%" }} />
        </colgroup>

        <thead>
          <tr>
            <th
              scope="col"
              aria-sort={order === "oldest" ? "ascending" : "descending"}
              className="p-[2px] pb-2 align-bottom"
            >
              <button
                type="button"
                onClick={onToggleOrder}
                className={`relative flex h-7 w-full items-center gap-1 rounded-[4px] px-1.5 text-left ${LABEL} hover:bg-zinc-100 ${FOCUS_RING}`}
              >
                코호트
                <SortIndicator state={order === "oldest" ? "asc" : "desc"} />
                <span className="sr-only">
                  {order === "oldest"
                    ? "오래된 코호트가 위에 있습니다. 누르면 최신 코호트를 위로 올립니다."
                    : "최신 코호트가 위에 있습니다. 누르면 오래된 코호트를 위로 올립니다."}
                </span>
              </button>
            </th>

            {OFFSETS.map((offset) => {
              const lit = cursor?.offset === offset;
              return (
                <th
                  key={offset}
                  scope="col"
                  className={`px-1 pb-2 align-bottom text-center text-[11px] font-medium tabular-nums ${
                    lit ? "text-orange-800" : "text-zinc-600"
                  }`}
                >
                  M{offset}
                  <span className="sr-only"> 가입 후 {offset}개월</span>
                  <span
                    aria-hidden="true"
                    className={`mx-auto mt-1 block h-[2px] w-4 rounded-full ${
                      lit ? "bg-orange-500" : "bg-transparent"
                    }`}
                  />
                </th>
              );
            })}

            <th
              scope="col"
              className={`border-l-2 border-zinc-200 px-2 pb-2 align-bottom text-right ${LABEL}`}
            >
              규모
            </th>
            <th scope="col" className={`px-2 pb-2 align-bottom text-right ${LABEL}`}>
              {encoding.rowMarginalHeading}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => {
            const pinned = encoding.baselineId === row.id;
            const marginal = encoding.rowMarginal(row);
            const lit = cursor?.row === row.id;
            return (
              <tr key={row.id}>
                <th scope="row" className="p-[2px]">
                  <button
                    type="button"
                    aria-pressed={pinned}
                    onClick={() => onPin(row.id)}
                    className={`relative flex h-8 w-full items-center gap-1.5 rounded-[4px] border px-2 text-left text-[12px] tabular-nums transition-colors duration-150 motion-reduce:transition-none ${FOCUS_RING} ${
                      pinned
                        ? "border-orange-300 bg-orange-50 font-semibold text-orange-900"
                        : lit
                          ? "border-zinc-300 bg-zinc-50 text-zinc-900"
                          : "border-transparent text-zinc-700 hover:border-zinc-200 hover:bg-zinc-50"
                    }`}
                  >
                    <Pin
                      aria-hidden="true"
                      className={`size-3.5 shrink-0 ${pinned ? "text-orange-700" : "text-zinc-500"}`}
                    />
                    {row.short}
                    <span className="sr-only">
                      {pinned
                        ? " 코호트가 기준선입니다. 누르면 기준을 해제하고 절대 잔존율로 돌아갑니다."
                        : " 코호트를 기준선으로 고정합니다."}
                    </span>
                  </button>
                </th>

                {OFFSETS.map((offset) => {
                  const paint = encoding.cell(row, offset);
                  if (!paint) {
                    return (
                      <td key={offset} className="p-[2px]">
                        <span
                          aria-hidden="true"
                          className="block h-8 rounded-[4px] border border-zinc-100"
                          style={EMPTY_CELL}
                        />
                      </td>
                    );
                  }
                  const isActive = active.row === row.id && active.offset === offset;
                  const isCursor = cursor?.row === row.id && cursor.offset === offset;
                  return (
                    <td key={offset} className="p-[2px]">
                      <button
                        type="button"
                        data-cell={`${row.id}|${offset}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => onPin(row.id)}
                        onFocus={() => {
                          setActive({ row: row.id, offset });
                          setCursor({ row: row.id, offset });
                        }}
                        onBlur={() => setCursor(null)}
                        onMouseEnter={() => setCursor({ row: row.id, offset })}
                        onMouseLeave={() => setCursor(null)}
                        onKeyDown={(event) => onCellKey(event, rowIndex, offset)}
                        className={`relative block h-8 w-full rounded-[4px] border text-center text-[12px] font-medium leading-[30px] tabular-nums transition-colors duration-150 motion-reduce:transition-none focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 ${
                          paint.state === "baseline" ? "border-orange-300" : "border-zinc-900/10"
                        }`}
                        style={{
                          backgroundColor: paint.bg,
                          color: paint.ink,
                          boxShadow: isCursor ? "inset 0 0 0 2px #18181B" : undefined,
                        }}
                      >
                        {paint.label}
                        <span className="sr-only">
                          {" "}
                          {paint.detail}. 누르면 이 코호트를 기준선으로 고정합니다.
                        </span>
                      </button>
                    </td>
                  );
                })}

                <td className="relative border-l-2 border-zinc-200 px-2 text-right text-[12px] tabular-nums text-zinc-700">
                  {formatCount(row.accounts)}
                  <span className="sr-only"> 개 계정 규모</span>
                </td>

                <td className="relative px-2">
                  <span className="flex items-baseline justify-end gap-1">
                    <span className="text-[12px] font-semibold tabular-nums text-zinc-900">
                      {marginal.value}
                    </span>
                    <span className="text-[10px] tabular-nums text-zinc-600">{marginal.caption}</span>
                  </span>
                  <span aria-hidden="true" className="mt-1 block h-[3px] w-full rounded-full bg-zinc-100">
                    {encoding.kind === "absolute" ? (
                      <span
                        className="block h-full rounded-full bg-orange-500"
                        style={{ width: `${Math.round(marginal.ratio * 1000) / 10}%` }}
                      />
                    ) : (
                      <span className="relative block h-full">
                        <span className="absolute inset-y-0 left-1/2 w-px bg-zinc-300" />
                        <span
                          className="absolute inset-y-0 rounded-full"
                          style={
                            marginal.ratio >= 0
                              ? {
                                  left: "50%",
                                  width: `${Math.round(marginal.ratio * 500) / 10}%`,
                                  backgroundColor: "#F97316",
                                }
                              : {
                                  right: "50%",
                                  width: `${Math.round(-marginal.ratio * 500) / 10}%`,
                                  backgroundColor: "#64748B",
                                }
                          }
                        />
                      </span>
                    )}
                  </span>
                  <span className="sr-only">{marginal.detail}</span>
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr>
            <th scope="row" className={`border-t-2 border-zinc-200 px-1.5 pt-2.5 text-left ${LABEL}`}>
              가중 평균
            </th>
            {OFFSETS.map((offset) => {
              const column = encoding.column(offset);
              const lit = cursor?.offset === offset;
              return (
                <td
                  key={offset}
                  className={`relative border-t-2 border-zinc-200 px-1 pt-2.5 text-center text-[12px] font-medium tabular-nums ${
                    lit ? "text-orange-800" : "text-zinc-900"
                  }`}
                >
                  {column.label}
                  <span className="sr-only"> {column.detail}</span>
                </td>
              );
            })}
            <td
              colSpan={2}
              className="border-l-2 border-t-2 border-zinc-200 px-2 pt-2.5 text-right text-[11px] tabular-nums text-zinc-600"
            >
              표본 {pooled[0].cohorts}개 코호트
            </td>
          </tr>
          <tr>
            <th scope="row" className={`px-1.5 pb-1 pt-2 align-top text-left ${LABEL}`}>
              평균 곡선
            </th>
            <td colSpan={12} className="px-1 pb-1 pt-2">
              <svg
                viewBox={`0 0 120 ${geometry.height}`}
                preserveAspectRatio="none"
                className="block h-[46px] w-full"
                aria-hidden="true"
                focusable="false"
              >
                <polygon
                  points={`${geometry.firstX},${geometry.baseY} ${geometry.path} ${geometry.lastX},${geometry.baseY}`}
                  fill="#FFEDD5"
                />
                {geometry.zeroY !== null ? (
                  <line
                    x1="0"
                    x2="120"
                    y1={geometry.zeroY}
                    y2={geometry.zeroY}
                    stroke="#A1A1AA"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                {/* Stems, not dots: the viewBox is stretched horizontally, and a circle would come
                    out an ellipse. A vertical line survives non-uniform scaling intact. */}
                {geometry.pts.map((point) => (
                  <line
                    key={point.offset}
                    x1={point.x}
                    x2={point.x}
                    y1={geometry.baseY}
                    y2={point.y}
                    stroke="#FDBA74"
                    strokeWidth={1}
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <polyline
                  points={geometry.path}
                  fill="none"
                  stroke="#C2410C"
                  strokeWidth={1.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
                {geometry.pts.map((point) => (
                  <line
                    key={`cap-${point.offset}`}
                    x1={point.x - 1.4}
                    x2={point.x + 1.4}
                    y1={point.y}
                    y2={point.y}
                    stroke="#7C2D12"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </td>
            <td
              colSpan={2}
              className="border-l-2 border-zinc-200 px-2 pb-1 pt-2 text-right align-top text-[11px] tabular-nums text-zinc-600"
            >
              {encoding.curve.caption}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
