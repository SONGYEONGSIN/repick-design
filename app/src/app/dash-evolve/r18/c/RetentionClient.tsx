"use client";

/**
 * Trellis — 코호트 리텐션 콘솔.
 *
 * State lives here, but note what does NOT happen: `baselineId` is never handed to three sibling
 * widgets as a shared `selectedId`. It has exactly one consumer — `buildEncoding` — and the object
 * that comes back is what the grid draws. Change the pin and the grid's *encoding* changes
 * (sequential percent -> diverging points, new ramp, new marginals, new curve domain). The segment
 * table and the basis card below never receive it and never react to it.
 *
 * The grid is complete before anyone touches anything: every cell prints its own number on first
 * paint, the row marginals print final retention, the column marginals print the pooled curve. The
 * pin sharpens that answer; it does not unlock it.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Info, PinOff, SlidersHorizontal } from "lucide-react";
import AppFrame from "./AppFrame";
import CohortMatrix from "./CohortMatrix";
import CohortStack from "./CohortStack";
import CommandPalette from "./CommandPalette";
import SegmentPanel from "./SegmentPanel";
import {
  buildMatrix,
  buildPooled,
  buildSegmentSummary,
  formatCount,
  METRICS,
  OBSERVATION_WINDOW,
  REFRESHED_AT,
  SEGMENTS,
  type MetricId,
  type SegmentFilter,
} from "./cohort-data";
import { buildEncoding } from "./encoding";
import { Badge, Card, FilterChip, FOCUS_RING, LABEL, Popover, PopoverItem, SegmentedControl } from "./ui";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" };

const BASIS_NOTES = [
  {
    id: "refresh",
    label: "데이터 갱신",
    body: `${REFRESHED_AT} · 이벤트 파이프라인 마감분 기준, 실시간 스트림이 아닙니다.`,
  },
  {
    id: "definition",
    label: "잔존 판정",
    body: "해당 경과 월에 활성 세션이 1회 이상 기록된 계정. 결제 여부와 무관합니다.",
  },
  {
    id: "exclusion",
    label: "제외 규칙",
    body: "사내 계정, 파트너 샌드박스, 가입 30일 내 전액 환불 건은 코호트 규모에서 빠집니다.",
  },
  {
    id: "baseline",
    label: "기준 고정",
    body: "행 머리글이나 셀을 누르면 격자 전체가 그 코호트 대비 델타(pt)로 다시 그려집니다.",
  },
];

export default function RetentionClient() {
  const [metric, setMetric] = useState<MetricId>("accounts");
  const [segment, setSegment] = useState<SegmentFilter>("all");
  const [order, setOrder] = useState<"oldest" | "newest">("oldest");
  const [baselineId, setBaselineId] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const chronological = useMemo(() => buildMatrix(metric, segment), [metric, segment]);
  const pooled = useMemo(() => buildPooled(chronological), [chronological]);
  const rows = useMemo(
    () => (order === "oldest" ? chronological : [...chronological].reverse()),
    [chronological, order],
  );

  // The pin's single output. One object, one consumer: the grid.
  const encoding = useMemo(
    () => buildEncoding({ rows: chronological, pooled, baselineId, metric }),
    [chronological, pooled, baselineId, metric],
  );

  const segmentSummary = useMemo(() => buildSegmentSummary(), []);
  const totalAccounts = chronological.reduce((sum, row) => sum + row.accounts, 0);

  const togglePin = useCallback((id: string) => {
    setBaselineId((prev) => (prev === id ? null : id));
  }, []);
  const setBaseline = useCallback((id: string | null) => setBaselineId(id), []);
  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    document.getElementById("global-search-trigger")?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const segmentCounts = useMemo(() => {
    const map: Record<string, string> = { all: formatCount(totalAccounts) };
    segmentSummary.forEach((row) => {
      map[row.id] = formatCount(row.accounts);
    });
    return map;
  }, [segmentSummary, totalAccounts]);

  const legendLow = encoding.legend[0];
  const legendHigh = encoding.legend[encoding.legend.length - 1];

  return (
    <AppFrame onOpenPalette={() => setPaletteOpen(true)}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className={LABEL}>분석 · 코호트</p>
            <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-[-0.025em] text-zinc-900">
              코호트 리텐션
            </h1>
            <p className="mt-1.5 text-[13px] leading-snug text-zinc-600">
              Northsail Labs · {OBSERVATION_WINDOW} · 월간 코호트 12개 · {REFRESHED_AT} 갱신
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SegmentedControl<MetricId>
              label="잔존 지표"
              value={metric}
              onChange={setMetric}
              options={METRICS.map((item) => ({ value: item.id, label: item.chip }))}
            />
            <Popover
              align="end"
              triggerClassName="relative flex h-11 items-center gap-2 rounded-[8px] border border-zinc-200 bg-white px-3.5 text-[13px] font-medium text-zinc-700 hover:bg-zinc-50"
              panelClassName="w-[248px]"
              triggerContent={
                <>
                  <SlidersHorizontal aria-hidden="true" className="size-4 text-zinc-600" />
                  뷰 옵션
                </>
              }
            >
              {(close) => (
                <>
                  <p className={`${LABEL} px-2.5 pb-1 pt-1.5`}>행 순서</p>
                  <PopoverItem
                    selected={order === "oldest"}
                    onClick={() => {
                      setOrder("oldest");
                      close();
                    }}
                  >
                    오래된 코호트를 위로
                  </PopoverItem>
                  <PopoverItem
                    selected={order === "newest"}
                    onClick={() => {
                      setOrder("newest");
                      close();
                    }}
                  >
                    최신 코호트를 위로
                  </PopoverItem>
                  <p className={`${LABEL} px-2.5 pb-1 pt-2`}>기준선</p>
                  <PopoverItem
                    selected={baselineId === null}
                    onClick={() => {
                      setBaseline(null);
                      close();
                    }}
                  >
                    절대 잔존율로 복귀
                  </PopoverItem>
                </>
              )}
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card labelledBy="matrix-title" className="col-span-12 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 pb-4">
              <div className="min-w-0">
                <h2
                  id="matrix-title"
                  className="text-[17px] font-semibold tracking-[-0.015em] text-zinc-900"
                >
                  코호트 잔존 삼각행렬
                </h2>
                <p className="mt-1 max-w-[62ch] text-[13px] leading-snug text-zinc-600">
                  {encoding.statement}.
                </p>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2">
                <span className="flex items-center gap-2">
                  <span
                    style={DISPLAY}
                    className="text-[15px] uppercase leading-none tracking-[0.16em] text-orange-800"
                  >
                    {encoding.kind === "absolute" ? "Absolute" : "Delta"}
                  </span>
                  {encoding.baselineShort ? (
                    <Badge tone="accent">기준 {encoding.baselineShort}</Badge>
                  ) : (
                    <Badge>기준 없음</Badge>
                  )}
                </span>

                {encoding.baselineId ? (
                  <button
                    type="button"
                    onClick={() => setBaseline(null)}
                    className={`relative inline-flex h-8 items-center gap-1.5 rounded-full border border-orange-300 bg-orange-50 px-3 text-[12px] font-medium text-orange-800 hover:bg-orange-100 ${FOCUS_RING}`}
                  >
                    <PinOff aria-hidden="true" className="size-3.5" />
                    기준 해제
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-zinc-100 pb-4 pt-4">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className={`${LABEL} pr-1`}>세그먼트</span>
                <FilterChip
                  active={segment === "all"}
                  onClick={() => setSegment("all")}
                  count={segmentCounts.all}
                >
                  전체
                </FilterChip>
                {SEGMENTS.map((item) => (
                  <FilterChip
                    key={item.id}
                    active={segment === item.id}
                    onClick={() => setSegment(segment === item.id ? "all" : item.id)}
                    count={segmentCounts[item.id]}
                  >
                    {item.label}
                  </FilterChip>
                ))}
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span className={LABEL}>{encoding.legendTitle}</span>
                <span className="text-[11px] tabular-nums text-zinc-600">{legendLow.label}</span>
                <span aria-hidden="true" className="flex items-center gap-px">
                  {encoding.legend.map((stop) => (
                    <span
                      key={stop.label}
                      className="block h-3.5 w-4 rounded-[2px] border border-zinc-200"
                      style={{ backgroundColor: stop.swatch }}
                    />
                  ))}
                </span>
                <span className="text-[11px] tabular-nums text-zinc-600">{legendHigh.label}</span>
                <span className="sr-only">
                  색 램프 단계: {encoding.legend.map((stop) => stop.label).join(", ")} ({encoding.legendNote}).
                  모든 셀에는 수치가 직접 인쇄되므로 색만으로 값을 읽을 필요는 없습니다.
                </span>
              </div>
            </div>

            <div className="hidden xl:block">
              <CohortMatrix
                rows={rows}
                pooled={pooled}
                encoding={encoding}
                order={order}
                onToggleOrder={() => setOrder(order === "oldest" ? "newest" : "oldest")}
                onPin={togglePin}
                totalAccounts={totalAccounts}
              />
            </div>
            <div className="xl:hidden">
              <CohortStack rows={rows} pooled={pooled} encoding={encoding} onPin={togglePin} />
            </div>
          </Card>

          <Card labelledBy="segments-title" className="col-span-12 min-w-0 p-4 sm:p-5 xl:col-span-7">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 pb-3">
              <div className="min-w-0">
                <h2
                  id="segments-title"
                  className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900"
                >
                  세그먼트 요약
                </h2>
                <p className="mt-0.5 text-[12px] leading-snug text-zinc-600">
                  이름을 누르면 위 행렬이 그 세그먼트만으로 다시 계산됩니다.
                </p>
              </div>
              <Badge tone={segment === "all" ? "neutral" : "accent"}>
                {segment === "all"
                  ? "전체 합산"
                  : `${SEGMENTS.find((item) => item.id === segment)?.label ?? ""} 필터`}
              </Badge>
            </div>
            <SegmentPanel rows={segmentSummary} segment={segment} onSegment={setSegment} />
          </Card>

          <Card labelledBy="basis-title" className="col-span-12 min-w-0 p-4 sm:p-5 xl:col-span-5">
            <div className="flex items-start gap-2 pb-3">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-zinc-600" />
              <h2 id="basis-title" className="text-[15px] font-semibold tracking-[-0.01em] text-zinc-900">
                관측 기준
              </h2>
            </div>
            <ul className="flex flex-col gap-2.5">
              {BASIS_NOTES.map((note) => (
                <li key={note.id} className="border-t border-zinc-100 pt-2.5 first:border-t-0 first:pt-0">
                  <p className={LABEL}>{note.label}</p>
                  <p className="mt-1 text-[12.5px] leading-snug text-zinc-700">{note.body}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={closePalette}
        rows={chronological}
        metric={metric}
        onMetric={setMetric}
        segment={segment}
        onSegment={setSegment}
        order={order}
        onOrder={setOrder}
        baselineId={baselineId}
        onPin={setBaseline}
      />
    </AppFrame>
  );
}
