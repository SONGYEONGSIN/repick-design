"use client";

import { useEffect, useRef, useState } from "react";
import {
  AISLES,
  BIN_COLS,
  BINS,
  formatPercent,
  formatRestocked,
  formatUnits,
  RAW_ZONES,
  utilTierFor,
  UTIL_TIER_META,
  velocityTierFor,
  VELOCITY_TIER_META,
  ZONE_MAP,
  ZONE_STATS_MAP,
  type BinCell,
} from "./data";
import { BORDER, FOCUS_RING, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, SegmentedControl } from "./ui";

export type HeatmapMetric = "utilization" | "velocity";

const METRIC_OPTIONS: { id: HeatmapMetric; label: string }[] = [
  { id: "utilization", label: "적재율" },
  { id: "velocity", label: "피킹 속도" },
];

const ROW_GRID = "grid grid-cols-[38px_repeat(8,minmax(0,1fr))] gap-[3px] sm:grid-cols-[46px_repeat(8,minmax(0,1fr))]";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function HeatmapGrid({ selectedZoneId }: { selectedZoneId: string }) {
  const [metric, setMetric] = useState<HeatmapMetric>("utilization");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-zone-group="${selectedZoneId}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [selectedZoneId]);

  const hovered = hoveredId ? BINS.find((b) => b.id === hoveredId) ?? null : null;
  const legendEntries =
    metric === "utilization"
      ? (["empty", "low", "mid", "high", "critical", "over"] as const).map((t) => ({ key: t, meta: UTIL_TIER_META[t] }))
      : (["idle", "low", "medium", "high", "veryHigh", "hot"] as const).map((t) => ({ key: t, meta: VELOCITY_TIER_META[t] }));

  return (
    <Card padded={false} className="flex h-full min-h-0 flex-col">
      <div className={cx("border-b p-3.5 sm:p-5", BORDER)}>
        <CardHeader
          title="빈 적재 히트맵"
          titleId="heatmap-heading"
          description="행 = 통로, 열 = 빈 포지션(01~08). 셀 색과 숫자는 선택한 지표를 함께 인코딩합니다. 존 레일에서 존을 고르면 아래 해당 구간이 강조됩니다."
          action={<SegmentedControl ariaLabel="히트맵 지표" options={METRIC_OPTIONS} value={metric} onChange={setMetric} />}
        />

        <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5" aria-label={`${metric === "utilization" ? "적재율" : "피킹 속도"} 등급 범례`}>
          {legendEntries.map(({ key, meta }) => (
            <li key={key} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={cx("h-2.5 w-2.5 rounded-[2px] border", meta.bg, meta.border)} />
              <span className={cx("text-[11px] font-medium", TEXT_CAPTION)}>{meta.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto p-3 [scrollbar-width:thin] sm:p-4" role="group" aria-labelledby="heatmap-heading">
        {/* 열 헤더(빈 포지션 01~08) — 스크롤 시 상단 고정 */}
        <div className={cx(ROW_GRID, "sticky top-0 z-10 mb-1.5 bg-white pb-1.5 dark:bg-zinc-900")}>
          <span aria-hidden="true" />
          {Array.from({ length: BIN_COLS }, (_, i) => i + 1).map((col) => (
            <span
              key={col}
              className={cx(
                "flex h-5 items-center justify-center rounded text-[10px] font-semibold",
                NUM,
                hovered && hovered.binPos === col ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200" : TEXT_CAPTION,
              )}
            >
              {String(col).padStart(2, "0")}
            </span>
          ))}
        </div>

        {RAW_ZONES.map((zone) => {
          const zoneStats = ZONE_STATS_MAP[zone.id];
          const zoneAisles = AISLES.filter((a) => a.zoneId === zone.id);
          const isSelected = zone.id === selectedZoneId;
          return (
            <div key={zone.id} data-zone-group={zone.id} className={cx("mb-2.5 rounded-lg last:mb-0", isSelected && "bg-indigo-50/60 ring-1 ring-indigo-300 dark:bg-indigo-500/[0.06] dark:ring-indigo-500/40")}>
              <div className="flex items-center gap-1.5 px-1 py-1">
                <zone.Icon size={12} aria-hidden="true" className={isSelected ? "text-indigo-600 dark:text-indigo-300" : TEXT_CAPTION} />
                <span className={cx("text-[11px] font-semibold uppercase tracking-wide", isSelected ? "text-indigo-700 dark:text-indigo-300" : TEXT_CAPTION)}>
                  {zone.code} · {zone.name}
                </span>
                <span className={cx("ml-auto text-[11px]", NUM, TEXT_CAPTION)}>{formatPercent(zoneStats.utilizationPct)} 평균</span>
              </div>

              <div className="px-1 pb-1">
                {zoneAisles.map((aisle) => {
                  const rowIndex = AISLES.indexOf(aisle);
                  const bins = BINS.filter((b) => b.aisleCode === aisle.code).sort((a, b) => a.binPos - b.binPos);
                  const rowHovered = hovered?.rowIndex === rowIndex;
                  return (
                    <div key={aisle.code} className={cx(ROW_GRID, "mb-[3px] last:mb-0")}>
                      <span
                        className={cx(
                          "flex h-6 items-center justify-center rounded text-[10px] font-semibold sm:h-7",
                          NUM,
                          rowHovered ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/25 dark:text-indigo-200" : cx("bg-zinc-50 dark:bg-zinc-950", TEXT_CAPTION),
                        )}
                      >
                        {aisle.code}
                      </span>
                      {bins.map((bin) => (
                        <HeatmapCell key={bin.id} bin={bin} metric={metric} hovered={hoveredId === bin.id} onHover={setHoveredId} />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 스크린리더 전용 전체 빈 데이터 표 — 시각 히트맵의 접근성 대체(표에 sr-only를 직접 걸지 않고 래퍼에 적용). */}
      <div className="sr-only">
        <table>
          <caption>
            창고 전체 빈 적재 현황. 존, 통로, 빈 번호별 재고 수량, 용량, 가동률, 일일 피킹 속도, 최근 입고 경과일을 나열합니다.
          </caption>
          <thead>
            <tr>
              <th scope="col">존</th>
              <th scope="col">통로</th>
              <th scope="col">빈</th>
              <th scope="col">재고/용량</th>
              <th scope="col">가동률</th>
              <th scope="col">피킹 속도</th>
              <th scope="col">최근 입고</th>
            </tr>
          </thead>
          <tbody>
            {BINS.map((b) => (
              <tr key={b.id}>
                <td>{ZONE_MAP[b.zoneId].name}</td>
                <td>{b.aisleCode}</td>
                <td>{b.id}</td>
                <td>
                  {b.itemCount}/{b.capacity}
                </td>
                <td>{formatPercent(b.utilizationPct)}</td>
                <td>{b.velocity}건/일</td>
                <td>{formatRestocked(b.lastRestockedDaysAgo)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function HeatmapCell({
  bin,
  metric,
  hovered,
  onHover,
}: {
  bin: BinCell;
  metric: HeatmapMetric;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const meta =
    metric === "utilization" ? UTIL_TIER_META[utilTierFor(bin.utilizationPct)] : VELOCITY_TIER_META[velocityTierFor(bin.velocity)];
  const emphasize = meta.pattern === "stripe";
  const label = metric === "utilization" ? formatPercent(bin.utilizationPct) : String(bin.velocity);
  const tooltipBelow = bin.rowIndex <= 1;
  const tooltipAlign = bin.binPos <= 2 ? "left-0 translate-x-0" : bin.binPos >= BIN_COLS - 1 ? "right-0 left-auto translate-x-0" : "left-1/2 -translate-x-1/2";

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => onHover(bin.id)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(bin.id)}
        onBlur={() => onHover(null)}
        aria-label={`${bin.id} 빈 — ${
          metric === "utilization" ? `가동률 ${formatPercent(bin.utilizationPct)}, 재고 ${bin.itemCount}/${bin.capacity}` : `피킹 속도 일 ${bin.velocity}건`
        }, 최근 입고 ${formatRestocked(bin.lastRestockedDaysAgo)}`}
        className={cx(
          "relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[4px]",
          emphasize ? "border-2" : "border",
          meta.bg,
          meta.text,
          meta.border,
          TRANSITION,
          FOCUS_RING,
          "motion-safe:hover:z-20 motion-safe:hover:scale-[1.14] motion-safe:hover:shadow-md motion-safe:focus-visible:z-20 motion-safe:focus-visible:scale-[1.14]",
        )}
      >
        {meta.pattern === "stripe" ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.95)_0px,rgba(255,255,255,0.95)_2px,transparent_2px,transparent_6px)]"
          />
        ) : null}
        <span className={cx("relative text-[9.5px] font-bold leading-none sm:text-[10.5px]", NUM)}>{label}</span>
      </button>

      {hovered ? (
        <div
          role="tooltip"
          className={cx(
            "pointer-events-none absolute z-30 w-40 rounded-lg border p-2 text-[11px] shadow-lg",
            BORDER,
            "bg-white dark:bg-zinc-900",
            tooltipBelow ? "top-[calc(100%+6px)]" : "bottom-[calc(100%+6px)]",
            tooltipAlign,
          )}
        >
          <p className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{bin.id}</p>
          <dl className="mt-1 space-y-0.5">
            <div className="flex items-center justify-between gap-2">
              <dt className={TEXT_CAPTION}>재고/용량</dt>
              <dd className={cx("font-semibold", NUM, TEXT_PRIMARY)}>
                {formatUnits(bin.itemCount)}/{formatUnits(bin.capacity)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className={TEXT_CAPTION}>가동률</dt>
              <dd className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{formatPercent(bin.utilizationPct)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className={TEXT_CAPTION}>피킹 속도</dt>
              <dd className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{bin.velocity}건/일</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className={TEXT_CAPTION}>최근 입고</dt>
              <dd className={cx("font-semibold", NUM, TEXT_PRIMARY)}>{formatRestocked(bin.lastRestockedDaysAgo)}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </div>
  );
}
