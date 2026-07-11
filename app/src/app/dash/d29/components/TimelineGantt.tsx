"use client";

import { useId, useState } from "react";
import { useFilter } from "../context/FilterContext";
import { TODAY_ISO, statusMeta } from "../data";
import { dayDiff, formatDate } from "../lib/format";
import { Card, CardHeader } from "./ui/Card";
import { HoverTooltip } from "./ui/Tooltip";

const WINDOW_START = "2026-06-01";
const WINDOW_END = "2026-08-24";
const WINDOW_DAYS = dayDiff(WINDOW_START, WINDOW_END);

const MONTH_MARKERS = [
  { iso: "2026-06-01", label: "6월" },
  { iso: "2026-07-01", label: "7월" },
  { iso: "2026-08-01", label: "8월" },
];

function toPercent(iso: string): number {
  const offset = dayDiff(WINDOW_START, iso);
  return Math.round((offset / WINDOW_DAYS) * 1000) / 10;
}

const BAR_COLOR: Record<string, string> = {
  on_track: "bg-indigo-500",
  at_risk: "bg-amber-500",
  delayed: "bg-rose-500",
};

export function TimelineGantt() {
  const { projects } = useFilter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const headingId = useId();
  const todayLeft = toPercent(TODAY_ISO);

  return (
    <Card as="section" aria-labelledby={headingId}>
      <CardHeader
        title="타임라인"
        titleId={headingId}
        description="프로젝트 일정 개요 · 막대에 포인터를 올리면 세부 정보가 표시됩니다"
      />
      <div className="px-5 py-5">
        <div className="relative">
          <div className="mb-2 flex justify-between text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
            {MONTH_MARKERS.map((m) => (
              <span key={m.iso}>{m.label}</span>
            ))}
          </div>

          <div className="relative rounded-lg bg-zinc-50">
            {/* 오늘 마커 */}
            <div
              className="absolute top-0 bottom-0 z-10 w-px bg-rose-400"
              style={{ left: `${todayLeft}%` }}
              aria-hidden="true"
            >
              <span className="absolute -top-5 -translate-x-1/2 text-[10px] font-semibold whitespace-nowrap text-rose-500">
                오늘
              </span>
            </div>

            <ul className="space-y-2 p-3">
              {projects.map((project) => {
                const left = toPercent(project.startDate);
                const right = toPercent(project.dueDate);
                const width = Math.max(right - left, 2);
                const tooltipId = `gantt-tip-${project.id}`;
                return (
                  <li key={project.id} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 truncate text-xs font-medium text-zinc-600 sm:w-40">
                      {project.name}
                    </span>
                    <span className="relative h-6 flex-1">
                      {/*
                        left/width(%)는 이 span(진짜 크기를 가진 flex-1 컨테이너)을 기준으로
                        계산되어야 한다. HoverTooltip의 내부 wrapper는 자식이 absolute라
                        자체 크기가 0으로 붕괴하므로, %기반 위치 지정은 반드시 이 바깥 span의
                        직계 자식에서 수행하고 HoverTooltip은 이미 크기가 정해진 박스를
                        h-full/w-full로 채우기만 하게 한다.
                      */}
                      <span
                        className="absolute top-0 h-6"
                        style={{ left: `${left}%`, width: `${width}%` }}
                      >
                        <HoverTooltip
                          id={tooltipId}
                          content={
                            <span>
                              {formatDate(project.startDate)} – {formatDate(project.dueDate)} ·{" "}
                              {statusMeta[project.status].label} · {project.progress}% 진행
                            </span>
                          }
                          className="block h-full w-full"
                        >
                          <button
                            type="button"
                            tabIndex={0}
                            aria-describedby={tooltipId}
                            onMouseEnter={() => setHoveredId(project.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className="flex h-full w-full items-center rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 focus-visible:outline-none"
                          >
                            <span
                              className={`h-4 w-full rounded-full ${BAR_COLOR[project.status]} ${
                                hoveredId === project.id ? "opacity-100" : "opacity-90"
                              }`}
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              {project.name}: {formatDate(project.startDate)}부터 {formatDate(project.dueDate)}까지,
                              진행률 {project.progress}%, {statusMeta[project.status].label}
                            </span>
                          </button>
                        </HoverTooltip>
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
          {(Object.keys(statusMeta) as Array<keyof typeof statusMeta>).map((key) => (
            <li key={key} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${BAR_COLOR[key]}`} aria-hidden="true" />
              {statusMeta[key].label}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
