"use client";

/**
 * 펼친 심사 건 안에서만 쓰이는 증거 패널들.
 * 세 패널 모두 hover 이전에 핵심 수치를 텍스트로 병기한다 — 조작은 증거를 지연시키는 게
 * 아니라 더 자세히 보게 만드는 용도다.
 */

import { useId, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, History, Layers, Scale, TriangleAlert } from "lucide-react";
import {
  DECISION_META,
  REASON_META,
  SURFACE_META,
  numberFormat,
  type AccountSignal,
  type HistoryEntry,
  type ReasonSlice,
  type SimilarCase,
} from "./data";
import { Avatar, Badge, FieldLabel, FOCUS, cn } from "./ui";

/* ------------------------------------------------------- 신고 사유 분포 */

export function ReasonBreakdown({ reasons, total }: { reasons: ReasonSlice[]; total: number }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-baseline justify-between gap-3">
        <FieldLabel>신고 사유 분포</FieldLabel>
        <p className="text-sm text-zinc-500">
          <span className="tabular-nums text-zinc-900">{numberFormat.format(total)}</span>건
        </p>
      </div>

      {/* 누적 막대 — 사유별 비중을 한 줄로 먼저 보여 준다. */}
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        {reasons.map((slice) => (
          <span
            key={slice.key}
            className={cn("block h-full", REASON_META[slice.key].fill)}
            style={{ width: `${Math.round((slice.count / total) * 10000) / 100}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-3">
        {reasons.map((slice) => {
          const pct = Math.round((slice.count / total) * 1000) / 10;
          return (
            <li key={slice.key} className="grid grid-cols-12 items-center gap-2">
              <span className="col-span-6 flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className={cn("h-2.5 w-2.5 shrink-0 rounded-sm", REASON_META[slice.key].swatch)}
                />
                <span className="truncate text-sm text-zinc-700">{REASON_META[slice.key].label}</span>
              </span>
              <span className="col-span-3 hidden h-1.5 rounded-full bg-zinc-100 sm:block">
                <span
                  className={cn("block h-full rounded-full", REASON_META[slice.key].fill)}
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="col-span-6 text-right text-sm tabular-nums text-zinc-900 sm:col-span-3">
                {numberFormat.format(slice.count)}
                <span className="ml-2 text-zinc-500">{pct.toFixed(1)}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* --------------------------------------------------------- 신고 유입 추이 */

export function IntakeChart({
  values,
  ticks,
  periodLabel,
}: {
  values: number[];
  ticks: string[];
  periodLabel: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const liveId = useId();

  const chart = useMemo(() => {
    const count = values.length;
    const max = Math.max(...values);
    const peakIndex = values.indexOf(max);
    const total = values.reduce((sum, value) => sum + value, 0);
    const coords = values.map((value, index) => {
      const x = Math.round((index / (count - 1)) * 64000) / 100;
      const y = Math.round((128 - (value / max) * 112) * 100) / 100;
      return { x, y };
    });
    const line = coords.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
    const area = `${line} L640 140 L0 140 Z`;
    const tickIndices =
      count <= 8
        ? values.map((_, index) => index)
        : [0, 1, 2, 3, 4, 5].map((step) => Math.round((step / 5) * (count - 1)));
    return { count, max, peakIndex, total, coords, line, area, tickIndices };
  }, [values]);

  const activeIndex = active === null ? null : Math.min(active, chart.count - 1);
  const shown = activeIndex ?? chart.peakIndex;
  const shownPct = Math.round((shown / (chart.count - 1)) * 10000) / 100;
  const tooltipPct = Math.max(9, Math.min(91, shownPct));

  function move(next: number) {
    setActive(Math.max(0, Math.min(chart.count - 1, next)));
  }

  return (
    <figure className="flex h-full flex-col">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <FieldLabel>신고 유입 · 최근 {periodLabel}</FieldLabel>
        <p className="text-sm text-zinc-500">
          총 <span className="tabular-nums text-zinc-900">{numberFormat.format(chart.total)}</span>건 · 피크{" "}
          <span className="text-zinc-900">{ticks[chart.peakIndex]}</span>{" "}
          <span className="tabular-nums text-zinc-900">{chart.max}</span>건 · 마지막 구간{" "}
          <span className="tabular-nums text-zinc-900">{values[chart.count - 1]}</span>건
        </p>
      </figcaption>

      <div
        ref={wrapRef}
        role="group"
        tabIndex={0}
        aria-label={`${periodLabel} 신고 유입 추이. 좌우 화살표 키로 구간을 이동합니다.`}
        aria-describedby={liveId}
        onPointerMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          if (rect.width === 0) return;
          const ratio = (event.clientX - rect.left) / rect.width;
          move(Math.round(ratio * (chart.count - 1)));
        }}
        onPointerLeave={() => setActive(null)}
        onFocus={() => setActive((prev) => prev ?? chart.peakIndex)}
        onBlur={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move((activeIndex ?? chart.peakIndex) + 1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move((activeIndex ?? chart.peakIndex) - 1);
          } else if (event.key === "Home") {
            event.preventDefault();
            move(0);
          } else if (event.key === "End") {
            event.preventDefault();
            move(chart.count - 1);
          }
        }}
        className={cn("relative mt-3 min-w-0 rounded-lg pt-7", FOCUS)}
      >
        <div className="relative h-36 w-full">
          <svg viewBox="0 0 640 140" className="h-36 w-full" preserveAspectRatio="none" aria-hidden>
            <line x1="0" y1="16" x2="640" y2="16" stroke="#e4e4e7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="72" x2="640" y2="72" stroke="#e4e4e7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="128" x2="640" y2="128" stroke="#e4e4e7" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={chart.area} fill="#8b5cf6" fillOpacity="0.12" />
            <path
              d={chart.line}
              fill="none"
              stroke="#6d28d9"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-px bg-violet-400"
            style={{ left: `${shownPct}%` }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-violet-700"
            style={{
              left: `${shownPct}%`,
              top: `${Math.round((chart.coords[shown].y / 140) * 10000) / 100}%`,
            }}
          />
        </div>
        <span
          className="pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md border border-zinc-200 bg-white px-2 py-0.5 text-[11px] text-zinc-700 shadow-[0_2px_6px_rgba(24,24,27,0.10)]"
          style={{ left: `${tooltipPct}%` }}
        >
          {ticks[shown]} · <span className="tabular-nums text-zinc-900">{values[shown]}</span>건
          {activeIndex === null ? <span className="ml-1 text-zinc-600">(피크)</span> : null}
        </span>
      </div>

      <div className="mt-2 flex justify-between gap-1">
        {chart.tickIndices.map((index) => (
          <span key={index} className="text-[11px] tabular-nums text-zinc-500">
            {ticks[index]}
          </span>
        ))}
      </div>
      <p id={liveId} aria-live="polite" className="sr-only">
        {ticks[shown]} 구간 신고 {values[shown]}건
      </p>
    </figure>
  );
}

/* ------------------------------------------------------------ 증거 탭들 */

type TabKey = "similar" | "history" | "signals";

const TABS: Array<{ key: TabKey; label: string; icon: typeof Layers }> = [
  { key: "similar", label: "유사 사례", icon: Layers },
  { key: "history", label: "위반 이력", icon: History },
  { key: "signals", label: "계정 신호", icon: Scale },
];

export function EvidenceTabs({
  similar,
  history,
  signals,
}: {
  similar: SimilarCase[];
  history: HistoryEntry[];
  signals: AccountSignal[];
}) {
  const [tab, setTab] = useState<TabKey>("similar");
  const baseId = useId();

  return (
    <div className="min-w-0">
      <div role="tablist" aria-label="증거 자료" className="flex flex-wrap gap-1 border-b border-zinc-200">
        {TABS.map(({ key, label, icon: Icon }) => {
          const selected = tab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`${baseId}-tab-${key}`}
              aria-selected={selected}
              aria-controls={selected ? `${baseId}-panel-${key}` : undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(key)}
              onKeyDown={(event) => {
                const index = TABS.findIndex((entry) => entry.key === tab);
                let nextIndex: number | null = null;
                if (event.key === "ArrowRight") nextIndex = (index + 1) % TABS.length;
                if (event.key === "ArrowLeft") nextIndex = (index - 1 + TABS.length) % TABS.length;
                if (nextIndex === null) return;
                event.preventDefault();
                const nextKey = TABS[nextIndex].key;
                setTab(nextKey);
                document.getElementById(`${baseId}-tab-${nextKey}`)?.focus();
              }}
              className={cn(
                "-mb-px inline-flex h-10 items-center gap-2 border-b-2 px-3 text-sm transition-colors motion-reduce:transition-none",
                FOCUS,
                selected
                  ? "border-violet-600 text-zinc-900"
                  : "border-transparent text-zinc-600 hover:text-zinc-900",
              )}
            >
              <Icon className={cn("h-4 w-4", selected ? "text-violet-700" : "text-zinc-500")} aria-hidden />
              {label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${tab}`}
        aria-labelledby={`${baseId}-tab-${tab}`}
        tabIndex={0}
        className={cn("mt-4 min-w-0 rounded-lg", FOCUS)}
      >
        {tab === "similar" ? <SimilarCases rows={similar} /> : null}
        {tab === "history" ? <HistoryList entries={history} /> : null}
        {tab === "signals" ? <SignalGrid signals={signals} /> : null}
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 유사 사례 표 */

type SortKey = "caseId" | "similarity" | "decidedOn";
type SortDir = "asc" | "desc";

function SortButton({
  label,
  keyName,
  sortKey,
  sortDir,
  onToggle,
  align,
}: {
  label: string;
  keyName: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onToggle: (key: SortKey) => void;
  align?: "right";
}) {
  const activeSort = keyName === sortKey;
  const Icon = !activeSort ? ArrowUpDown : sortDir === "asc" ? ArrowUp : ArrowDown;
  return (
    <button
      type="button"
      onClick={() => onToggle(keyName)}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-md px-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors motion-reduce:transition-none",
        FOCUS,
        align === "right" && "flex-row-reverse",
        activeSort ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900",
      )}
    >
      {label}
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </button>
  );
}

function SimilarCases({ rows }: { rows: SimilarCase[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("similarity");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const factor = sortDir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      let delta = 0;
      if (sortKey === "similarity") delta = a.similarity - b.similarity;
      else if (sortKey === "caseId") delta = a.caseId.localeCompare(b.caseId);
      else delta = a.decidedOn.localeCompare(b.decidedOn);
      return delta === 0 ? a.key.localeCompare(b.key) : delta * factor;
    });
  }, [rows, sortKey, sortDir]);

  function toggle(key: SortKey) {
    if (key === sortKey) setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "caseId" ? "asc" : "desc");
    }
  }

  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="min-w-0">
      {/* 데스크톱: 시맨틱 테이블 (table-fixed + % 열) */}
      <div className="hidden md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            같은 정책 조항으로 이미 결정된 과거 사례 — 유사도 높은 순
          </caption>
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[14%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSort("caseId")} className="px-2 py-1 text-left">
                <SortButton label="사례" keyName="caseId" sortKey={sortKey} sortDir={sortDir} onToggle={toggle} />
              </th>
              <th scope="col" className="px-2 py-1 text-left">
                <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-600">유형</span>
              </th>
              <th scope="col" className="px-2 py-1 text-left">
                <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-600">결정</span>
              </th>
              <th scope="col" aria-sort={ariaSort("similarity")} className="px-2 py-1 text-right">
                <SortButton
                  label="유사도"
                  keyName="similarity"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onToggle={toggle}
                  align="right"
                />
              </th>
              <th scope="col" aria-sort={ariaSort("decidedOn")} className="px-2 py-1 text-right">
                <SortButton
                  label="처리일"
                  keyName="decidedOn"
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onToggle={toggle}
                  align="right"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.key} className="border-b border-zinc-100 transition-colors hover:bg-zinc-50 motion-reduce:transition-none">
                <td className="px-2 py-3">
                  <span className="block truncate text-zinc-900">{row.caseId}</span>
                  <span className="mt-1 flex items-center gap-1.5">
                    <Avatar name={row.reviewer} tint={row.reviewer.length} size="sm" />
                    <span className="truncate text-xs text-zinc-500">{row.reviewer}</span>
                  </span>
                </td>
                <td className="px-2 py-3 align-top">
                  <span className="block truncate text-zinc-700">{SURFACE_META[row.surface]}</span>
                </td>
                <td className="px-2 py-3 align-top">
                  <Badge className={cn("ring-1 ring-inset", DECISION_META[row.decision].chip)}>
                    {DECISION_META[row.decision].short}
                  </Badge>
                </td>
                <td className="px-2 py-3 text-right align-top">
                  <span className="tabular-nums text-zinc-900">{row.similarity}%</span>
                  <span aria-hidden className="mt-1.5 block h-1 rounded-full bg-zinc-100">
                    <span className="block h-full rounded-full bg-violet-500" style={{ width: `${row.similarity}%` }} />
                  </span>
                </td>
                <td className="px-2 py-3 text-right align-top tabular-nums text-zinc-600">{row.decidedOn}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모바일: 같은 표를 더 좁게 밀어 넣지 않고 스택 카드로 교체 */}
      <ul className="space-y-2 md:hidden">
        {sorted.map((row) => (
          <li key={row.key} className="rounded-lg border border-zinc-200 bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-900">{row.caseId}</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">
                  {SURFACE_META[row.surface]} · {row.decidedOn}
                </p>
              </div>
              <Badge className={cn("ring-1 ring-inset", DECISION_META[row.decision].chip)}>
                {DECISION_META[row.decision].short}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-1.5">
                <Avatar name={row.reviewer} tint={row.reviewer.length} size="sm" />
                <span className="truncate text-xs text-zinc-500">{row.reviewer}</span>
              </span>
              <span className="text-xs tabular-nums text-zinc-700">유사도 {row.similarity}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------- 위반 이력 */

function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center">
        <p className="text-sm text-zinc-700">확인된 위반 이력이 없습니다.</p>
        <p className="mt-1 text-xs text-zinc-600">
          첫 위반으로 판단될 경우 정책상 경고 단계부터 적용됩니다.
        </p>
      </div>
    );
  }
  return (
    <ol className="space-y-3">
      {entries.map((entry) => (
        <li key={`${entry.date}-${entry.action}`} className="flex gap-3">
          <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-600" />
          <div className="min-w-0">
            <p className="text-sm text-zinc-900">
              {entry.action}
              <span className="ml-2 text-xs tabular-nums text-zinc-500">{entry.date}</span>
            </p>
            <p className="mt-0.5 text-sm text-zinc-600">{entry.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------- 계정 신호 */

function SignalGrid({ signals }: { signals: AccountSignal[] }) {
  return (
    <div className="grid grid-cols-12 gap-3">
      {signals.map((signal) => (
        <div key={signal.label} className="col-span-12 min-w-0 rounded-lg border border-zinc-200 bg-white p-3 sm:col-span-4">
          <FieldLabel>{signal.label}</FieldLabel>
          <p className="mt-1.5 text-lg tabular-nums text-zinc-900">{signal.value}</p>
          <p className="mt-0.5 text-xs text-zinc-600">{signal.note}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- 정책 안내문 */

export function PolicyNote({ text }: { text: string }) {
  return (
    <p className="flex items-start gap-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" aria-hidden />
      <span className="min-w-0">{text}</span>
    </p>
  );
}
