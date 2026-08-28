"use client";

import { Info, TrendingDown, TrendingUp, Wrench } from "lucide-react";
import {
  AUDIT_CATEGORIES,
  MEASUREMENT_LIMIT,
  SORT_RATIONALE,
  STAT_TOTAL_INCIDENTS,
  STAT_TOTAL_LAST_QUARTER,
  type AuditCategory,
} from "./data";
import { ACCENT, ACCENT_TEXT, ACCENT_TINT } from "./theme";

const MAX_COUNT = Math.max(
  ...AUDIT_CATEGORIES.flatMap((c) => [c.thisQuarter, c.lastQuarter]),
);

function barWidth(count: number): number {
  return Math.max(4, Math.round((count / MAX_COUNT) * 100));
}

interface AuditReportProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function AuditReport({ activeId, onSelect }: AuditReportProps) {
  const active: AuditCategory =
    AUDIT_CATEGORIES.find((c) => c.id === activeId) ?? AUDIT_CATEGORIES[0];

  return (
    <section
      id="audit-report"
      aria-labelledby="audit-heading"
      className="border-b border-zinc-200 bg-white px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="audit-heading"
          className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl"
        >
          The Q2 disclosure
        </h2>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-sm font-normal text-zinc-600 tabular-nums">
            <span className="font-semibold text-zinc-900">
              {STAT_TOTAL_INCIDENTS}
            </span>{" "}
            cases flagged this quarter, down from{" "}
            <span className="font-semibold text-zinc-900">
              {STAT_TOTAL_LAST_QUARTER}
            </span>{" "}
            last quarter.
          </p>
        </div>
        <p className="mt-2 max-w-[28rem] text-sm leading-[1.6] text-zinc-500">
          {SORT_RATIONALE}
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          {/* Ranked list — acts as the select control for the detail panel */}
          <ol role="list" className="flex flex-col gap-2">
            {AUDIT_CATEGORIES.map((category) => {
              const isActive = category.id === activeId;
              const TrendIcon =
                category.status === "worse" ? TrendingUp : TrendingDown;
              return (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(category.id)}
                    aria-current={isActive ? "true" : undefined}
                    className="w-full rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C]"
                    style={{
                      borderColor: isActive ? ACCENT_TEXT : "#e4e4e7",
                      backgroundColor: isActive ? ACCENT_TINT : "#ffffff",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-baseline gap-2">
                        <span className="shrink-0 text-xs font-normal text-zinc-600 tabular-nums">
                          {String(category.rank).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 text-sm font-semibold text-zinc-900">
                          {category.label}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-zinc-900 tabular-nums">
                        {category.thisQuarter}
                      </span>
                    </div>
                    <span className="mt-1.5 flex items-center gap-1.5 text-xs font-normal text-zinc-600">
                      <TrendIcon aria-hidden="true" className="h-3.5 w-3.5" />
                      {category.status === "worse"
                        ? "Worse than last quarter"
                        : "Better than last quarter"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Detail panel — recomputes on selection */}
          <div
            key={active.id}
            aria-live="polite"
            className="min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8"
          >
            <p className="text-xs font-semibold uppercase text-zinc-500 tracking-[0.16em]">
              Case {String(active.rank).padStart(2, "0")} of{" "}
              {AUDIT_CATEGORIES.length}
            </p>
            <h3 className="mt-2 text-xl font-extrabold tracking-[-0.02em] text-zinc-900">
              {active.label}
            </h3>
            <p className="mt-3 max-w-[28rem] text-sm leading-[1.6] text-zinc-600">
              {active.description}
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <div className="flex items-baseline justify-between text-xs font-normal text-zinc-500 tracking-[0.12em]">
                  <span>This quarter</span>
                  <span className="tabular-nums">{active.thisQuarter}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-2.5 rounded-full"
                    style={{
                      width: `${barWidth(active.thisQuarter)}%`,
                      backgroundColor: ACCENT,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-baseline justify-between text-xs font-normal text-zinc-500 tracking-[0.12em]">
                  <span>Last quarter</span>
                  <span className="tabular-nums">{active.lastQuarter}</span>
                </div>
                <div className="mt-1.5 h-2.5 w-full rounded-full bg-zinc-100">
                  <div
                    className="h-2.5 rounded-full bg-zinc-500"
                    style={{ width: `${barWidth(active.lastQuarter)}%` }}
                  />
                </div>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-zinc-200 pt-5 text-sm">
              <dt className="font-normal text-zinc-500">Cases resolved</dt>
              <dd className="text-right font-semibold text-zinc-900 tabular-nums">
                {active.resolutionRate}%
              </dd>
              <dt className="font-normal text-zinc-500">Quarter-over-quarter</dt>
              <dd className="text-right font-semibold text-zinc-900 tabular-nums">
                {active.thisQuarter > active.lastQuarter ? "+" : "−"}
                {Math.abs(active.thisQuarter - active.lastQuarter)}
              </dd>
            </dl>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4">
              <Wrench
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: ACCENT_TEXT }}
              />
              <p className="max-w-[28rem] text-sm leading-[1.6] text-zinc-700">
                <span
                  className="mr-1.5 text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: ACCENT_TEXT }}
                >
                  Changed
                </span>
                {active.whatChanged}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500 tracking-[0.16em]">
              What this report can&apos;t tell you
            </p>
            <p className="mt-2 max-w-[28rem] text-sm leading-[1.6] text-zinc-600">
              {MEASUREMENT_LIMIT}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
