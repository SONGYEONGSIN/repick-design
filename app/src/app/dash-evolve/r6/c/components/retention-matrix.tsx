"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { cellColor, rampSwatch } from "../lib/color-scale";
import {
  domainMax,
  formatPercent,
  formatUsers,
  type DatasetDefinition,
  type MetricId,
  valueFor,
} from "../lib/data";

interface HoveredCell {
  cohortId: string;
  period: number;
}

interface RetentionMatrixProps {
  dataset: DatasetDefinition;
  metric: MetricId;
  selectedCohortId: string;
  onSelectCohort: (id: string) => void;
}

export function RetentionMatrix({
  dataset,
  metric,
  selectedCohortId,
  onSelectCohort,
}: RetentionMatrixProps) {
  const [hovered, setHovered] = useState<HoveredCell | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const max = domainMax(metric);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [dataset, metric]);

  const hoveredCohort = hovered ? dataset.cohorts.find((c) => c.id === hovered.cohortId) : null;
  const metricLabel = metric === "retention" ? "사용자 리텐션" : "순매출 리텐션";

  return (
    <div>
      <div
        role="status"
        aria-live="polite"
        className="mb-3 flex min-h-[52px] items-center gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 dark:border-white/10 dark:bg-white/5"
      >
        {hoveredCohort && hovered ? (
          <>
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-semibold text-zinc-900 dark:text-zinc-50">
                {hoveredCohort.fullLabel}
              </p>
              <p className="truncate text-[11.5px] text-zinc-500 dark:text-zinc-400">
                {dataset.periodFullLabels[hovered.period]} · {formatUsers(hoveredCohort.size)} 가입
              </p>
            </div>
            <div className="ml-auto shrink-0 text-right">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
                {metricLabel}
              </p>
              <p className="text-[18px] font-bold tabular-nums text-zinc-900 dark:text-zinc-50">
                {formatPercent(valueFor(hoveredCohort, hovered.period, metric))}
              </p>
            </div>
          </>
        ) : (
          <p className="text-[12.5px] text-zinc-500 dark:text-zinc-400">
            셀에 마우스를 올리거나 키보드로 포커스하면 정확한 값이 여기에 표시됩니다.
          </p>
        )}
      </div>

      <div className="relative">
        <div
          aria-hidden={!canScrollLeft}
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent transition-opacity duration-200 dark:from-zinc-900 lg:hidden",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden={!canScrollRight}
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent transition-opacity duration-200 dark:from-zinc-900 lg:hidden",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="overflow-x-auto [contain:layout] lg:overflow-visible lg:[contain:none]"
        >
          <table className="w-full min-w-[860px] border-separate border-spacing-1 lg:min-w-0 lg:table-fixed">
            <caption className="mb-2 text-left text-[12.5px] text-zinc-500 dark:text-zinc-400">
              {dataset.label} · {metricLabel} 히트맵 — 행: 가입 코호트(최신순), 열: 가입 후{" "}
              {dataset.periodUnitLabel}. 셀 값은 색상과 숫자(%)로 함께 표시됩니다.
            </caption>
            <colgroup>
              <col style={{ width: "17%" }} />
              {dataset.periodShortLabels.map((label) => (
                <col key={label} style={{ width: `${83 / dataset.periodShortLabels.length}%` }} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="p-0">
                  <span className="sr-only">코호트</span>
                </th>
                {dataset.periodShortLabels.map((short, idx) => (
                  <th
                    key={short}
                    scope="col"
                    className="whitespace-nowrap pb-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500"
                  >
                    <span aria-hidden="true">{short}</span>
                    <span className="sr-only">{dataset.periodFullLabels[idx]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.cohorts.map((cohort) => {
                const isSelected = cohort.id === selectedCohortId;
                return (
                  <tr key={cohort.id}>
                    <th scope="row" className="p-0 pr-1.5 text-left align-middle">
                      <button
                        type="button"
                        onClick={() => onSelectCohort(cohort.id)}
                        aria-pressed={isSelected}
                        aria-label={`${cohort.fullLabel} 선택 — ${formatUsers(cohort.size)} 가입, 상세 패널과 동기화`}
                        className={cn(
                          "flex h-9 w-full flex-col justify-center whitespace-nowrap rounded-md px-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 lg:h-10",
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
                        )}
                      >
                        <span className="text-[12px] font-semibold tabular-nums leading-tight">
                          {cohort.shortLabel}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] leading-tight tabular-nums",
                            isSelected ? "text-indigo-100" : "text-zinc-400 dark:text-zinc-500",
                          )}
                        >
                          {formatUsers(cohort.size)}
                        </span>
                      </button>
                    </th>
                    {dataset.periodShortLabels.map((_, period) => {
                      const available = period < cohort.periodsAvailable;
                      if (!available) {
                        return (
                          <td key={period} className="p-0">
                            <div className="flex h-9 w-full items-center justify-center rounded-md border border-dashed border-zinc-200 text-[11px] text-zinc-500 lg:h-10 dark:border-white/10 dark:text-zinc-400">
                              <span aria-hidden="true">&mdash;</span>
                              <span className="sr-only">
                                {cohort.fullLabel} · {dataset.periodFullLabels[period]} · 아직 관측되지
                                않음
                              </span>
                            </div>
                          </td>
                        );
                      }
                      const value = valueFor(cohort, period, metric);
                      const color = cellColor(value, max, metric);
                      const isHovered =
                        hovered?.cohortId === cohort.id && hovered?.period === period;
                      return (
                        <td key={period} className="p-0">
                          <button
                            type="button"
                            style={color.style}
                            onMouseEnter={() => setHovered({ cohortId: cohort.id, period })}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered({ cohortId: cohort.id, period })}
                            onBlur={() => setHovered(null)}
                            onClick={() => onSelectCohort(cohort.id)}
                            aria-label={`${cohort.fullLabel} · ${dataset.periodFullLabels[period]} · ${metricLabel} ${formatPercent(value)}`}
                            className={cn(
                              "flex h-9 w-full items-center justify-center rounded-md text-[11.5px] font-semibold tabular-nums transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 motion-safe:hover:scale-[1.05] motion-reduce:transition-none lg:h-10",
                              color.isDark ? "text-white" : "text-zinc-800",
                              isSelected && "ring-1 ring-inset ring-indigo-400",
                              isHovered && "z-10 scale-[1.05]",
                            )}
                          >
                            {value}%
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          낮음
        </span>
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {[0.1, 0.3, 0.5, 0.7, 0.9, 1].map((stop) => (
            <span
              key={stop}
              className="h-3.5 w-6 rounded-sm"
              style={{ backgroundColor: rampSwatch(metric, stop) }}
            />
          ))}
        </div>
        <span className="font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
          높음
        </span>
        <span className="ml-1">
          — 색상은 보조 신호이며 정확한 값은 항상 셀 안의 숫자로 표기됩니다. 점선 셀은 아직 관측되지
          않은 기간입니다.
        </span>
      </div>
    </div>
  );
}
