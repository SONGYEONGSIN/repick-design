"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  CircleAlert,
  CircleCheck,
  CircleDot,
  Clock,
  FileCheck2,
  MapPin,
  Timer,
  TriangleAlert,
  Truck,
} from "lucide-react";
import "./theme.css";
import {
  GRID_LETTERS,
  PHASE_FILTERS,
  PROJECTS,
  type Issue,
  type Material,
  type MaterialStatus,
  type Phase,
  type Project,
  type Severity,
  type Zone,
  type ZoneStatus,
} from "./data";

/* ── 정적 Tailwind 클래스 맵 (동적 문자열 조합 대신 리터럴 참조 — JIT 스캔 안전) ── */
const COL_START: Record<number, string> = {
  1: "col-start-1",
  2: "col-start-2",
  3: "col-start-3",
  4: "col-start-4",
  5: "col-start-5",
  6: "col-start-6",
};
const COL_SPAN: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
};
const ROW_START: Record<number, string> = {
  1: "row-start-1",
  2: "row-start-2",
  3: "row-start-3",
  4: "row-start-4",
};
const ROW_SPAN: Record<number, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
};

// 5% 단위로 반올림한 진행률 → 정적 폭 클래스 (동적 bracket 값은 JIT가 스캔 못하므로 리터럴 전량 나열)
const WIDTH_CLASS: Record<number, string> = {
  0: "w-[0%]",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-[25%]",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-[50%]",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-[75%]",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-[100%]",
};
function widthClassFor(percent: number): string {
  const rounded = Math.min(100, Math.max(0, Math.round(percent / 5) * 5));
  return WIDTH_CLASS[rounded];
}

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--redline)]";

const ZONE_STATUS_META: Record<
  ZoneStatus,
  { icon: typeof CircleCheck; box: string; textColor: string }
> = {
  완료: {
    icon: CircleCheck,
    box: "bg-[var(--ink)]/7 border-[var(--ink)]",
    textColor: "text-[var(--ink)]",
  },
  진행중: {
    icon: Clock,
    box: "bg-[var(--blueprint)]/10 border-[var(--blueprint)]",
    textColor: "text-[var(--blueprint)]",
  },
  대기: {
    icon: CircleDot,
    box: "bg-[var(--paper-raised)] border-dashed border-[var(--line-strong)]",
    textColor: "text-[var(--ink-soft)]",
  },
  이슈: {
    icon: TriangleAlert,
    box: "bg-[var(--redline)]/10 border-[var(--redline)] border-2",
    textColor: "text-[var(--redline)]",
  },
};

const SEVERITY_META: Record<Severity, { icon: typeof CircleCheck; cls: string }> = {
  높음: { icon: TriangleAlert, cls: "border-[var(--redline)] text-[var(--redline)]" },
  중간: { icon: CircleAlert, cls: "border-[var(--blueprint)] text-[var(--blueprint)]" },
  낮음: { icon: CircleDot, cls: "border-[var(--line-strong)] text-[var(--ink-soft)]" },
};

const MATERIAL_STATUS_META: Record<MaterialStatus, { icon: typeof CircleCheck; cls: string }> = {
  발주완료: { icon: FileCheck2, cls: "border-[var(--blueprint)] text-[var(--blueprint)]" },
  배송중: { icon: Truck, cls: "border-[var(--line-strong)] text-[var(--ink-soft)]" },
  지연: { icon: Timer, cls: "border-[var(--redline)] text-[var(--redline)]" },
  입고완료: { icon: CircleCheck, cls: "border-[var(--ink)] text-[var(--ink)]" },
};

function PanelHeading({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="flex items-center gap-2 border-b border-[var(--line-strong)] px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
      <span className="font-mono text-[var(--redline)]">{index}</span>
      {title}
    </h2>
  );
}

/* ── 좌측: 시트 인덱스 (프로젝트 목록) ── */
function SheetIndex({
  projects,
  selectedId,
  onSelect,
}: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav
      aria-label="프로젝트 시트 인덱스"
      className="flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)] lg:h-full"
    >
      <PanelHeading index="01" title="시트 인덱스" />
      <ol className="min-h-0 divide-y divide-[var(--line)] overflow-y-auto lg:flex-1">
        {projects.map((p, i) => {
          const active = p.id === selectedId;
          return (
            <li key={p.id}>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect(p.id)}
                className={`datum-transition ${FOCUS_RING} block w-full min-w-0 border-l-4 px-2 py-2 text-left ${
                  active
                    ? "border-l-[var(--redline)] bg-[var(--ink)]/5"
                    : "border-l-transparent hover:bg-[var(--ink)]/3"
                }`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] tabular-nums text-[var(--ink-soft)]">
                    {String(i + 1).padStart(2, "0")} · {p.code}
                  </span>
                  {p.issues.length > 0 && (
                    <span className="flex items-center gap-1 border border-[var(--redline)] px-1 text-[9px] font-mono tabular-nums text-[var(--redline)]">
                      <TriangleAlert className="h-2.5 w-2.5" aria-hidden="true" />
                      {p.issues.length}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block truncate text-[13px] font-medium text-[var(--ink)]">
                  {p.name}
                </span>
                <span className="mt-1 flex items-center gap-1.5 text-[10px] text-[var(--ink-soft)]">
                  <MapPin className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{p.location}</span>
                </span>
                <span className="mt-1 inline-block border border-[var(--line-strong)] px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
                  {p.phase} · 인허가 {p.permit}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ── 중앙 히어로: 조닝 플랜 ── */
function ZoningPlan({
  project,
  activeZoneKey,
  onZoneSelect,
  className = "",
}: {
  project: Project;
  activeZoneKey: string | null;
  onZoneSelect: (key: string | null) => void;
  className?: string;
}) {
  return (
    <section
      className={`flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[var(--line-strong)] px-2 py-1.5">
        <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">
          <span className="font-mono text-[var(--redline)]">02</span>
          조닝 플랜
        </h2>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[10px] font-mono tabular-nums text-[var(--ink-soft)]">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
              <path d="M6 0 L9 8 L6 6.2 L3 8 Z" fill="var(--ink)" />
            </svg>
            N
          </span>
          <span className="font-mono text-[10px] tabular-nums text-[var(--ink-soft)]">
            SCALE {project.scale}
          </span>
        </div>
      </div>

      {/* 치수선 */}
      <div className="flex items-center gap-2 px-2 pt-2">
        <span className="h-px flex-1 bg-[var(--line-strong)]" aria-hidden="true" />
        <span className="font-mono text-[10px] tabular-nums text-[var(--ink-soft)]">
          {project.gridSpan} mm
        </span>
        <span className="h-px flex-1 bg-[var(--line-strong)]" aria-hidden="true" />
      </div>

      <p className="sr-only">
        {project.name}의 조닝 플랜입니다. 총 {project.zones.length}개 구역이 있으며, 각 구역을
        선택하면 하단 현장 이슈 표가 해당 구역 기준으로 강조됩니다.
      </p>

      <div className="grid min-h-0 flex-1 grid-cols-[16px_1fr] grid-rows-[16px_1fr] gap-1 p-2">
        <div aria-hidden="true" />
        <div className="grid grid-cols-6 gap-[3px]" aria-hidden="true">
          {GRID_LETTERS.map((l) => (
            <span
              key={l}
              className="flex items-center justify-center border border-[var(--line-strong)] font-mono text-[9px] text-[var(--ink-soft)]"
            >
              {l}
            </span>
          ))}
        </div>
        <div className="grid grid-rows-4 gap-[3px]" aria-hidden="true">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className="flex items-center justify-center border border-[var(--line-strong)] font-mono text-[9px] text-[var(--ink-soft)]"
            >
              {n}
            </span>
          ))}
        </div>
        <div
          role="group"
          aria-label="조닝 구역 목록"
          className="grid min-h-[220px] grid-cols-6 grid-rows-4 gap-[3px] lg:min-h-0"
        >
          {project.zones.map((zone) => {
            const meta = ZONE_STATUS_META[zone.status];
            const Icon = meta.icon;
            const active = activeZoneKey === zone.zoneKey;
            return (
              <button
                key={zone.id}
                type="button"
                aria-pressed={active}
                onClick={() => onZoneSelect(active ? null : zone.zoneKey)}
                className={`datum-transition relative flex flex-col justify-between overflow-hidden border p-1 text-left ${FOCUS_RING} ${
                  COL_START[zone.colStart]
                } ${COL_SPAN[zone.colSpan]} ${ROW_START[zone.rowStart]} ${
                  ROW_SPAN[zone.rowSpan]
                } ${meta.box} ${active ? "z-10 ring-2 ring-[var(--redline)]" : ""}`}
              >
                {zone.status === "진행중" && (
                  <span className="datum-hatch pointer-events-none absolute inset-0" aria-hidden="true" />
                )}
                <span className="relative flex items-center justify-between gap-1">
                  <Icon className={`h-3 w-3 shrink-0 ${meta.textColor}`} aria-hidden="true" />
                  <span className="font-mono text-[9px] tabular-nums text-[var(--ink-soft)]">
                    {zone.area}㎡
                  </span>
                </span>
                <span className="relative truncate text-[10px] font-medium leading-tight text-[var(--ink)] sm:text-[11px]">
                  {zone.label}
                </span>
                <span className={`relative text-[8px] uppercase tracking-wide sm:text-[9px] ${meta.textColor}`}>
                  {zone.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1 border-t border-[var(--line-strong)] px-2 py-1.5 text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
        {(Object.keys(ZONE_STATUS_META) as ZoneStatus[]).map((s) => {
          const meta = ZONE_STATUS_META[s];
          const Icon = meta.icon;
          return (
            <li key={s} className="flex items-center gap-1">
              <Icon className={`h-2.5 w-2.5 ${meta.textColor}`} aria-hidden="true" />
              {s}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ── 공정 단면 (건물 입면형 진행률) ── */
function ProcessSection({ project, className = "" }: { project: Project; className?: string }) {
  const phases = [...project.processPhases].reverse();
  const summary = project.processPhases.map((p) => `${p.name} ${p.percent}%`).join(", ");
  return (
    <section
      className={`flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)] ${className}`}
    >
      <PanelHeading index="03" title="공정 단면" />
      <div
        role="img"
        aria-label={`${project.name} 공정 단면. 기초부터 준공까지 ${summary}`}
        className="flex min-h-0 flex-1 flex-col justify-center gap-1.5 p-2"
      >
        {phases.map((phase) => (
          <div key={phase.name} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[10px] text-[var(--ink-soft)] sm:w-20 sm:text-[11px]">
              {phase.name}
            </span>
            <span
              className="relative h-4 flex-1 overflow-hidden border border-[var(--line-strong)] bg-[var(--paper)]"
              aria-hidden="true"
            >
              <span className="datum-hatch absolute inset-0" />
              <span
                className={`absolute inset-y-0 left-0 bg-[var(--ink)]/85 ${widthClassFor(phase.percent)}`}
              />
            </span>
            <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-[var(--ink)]">
              {phase.percent}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 우측: 타이틀 블록 ── */
function TitleBlock({ project }: { project: Project }) {
  const rows: [string, string][] = [
    ["PROJECT", project.name],
    ["LOCATION", project.location],
    ["SCALE", project.scale],
    ["GRID SPAN", `${project.gridSpan} mm`],
    ["PERMIT", project.permit],
    ["DATE", project.date],
    ["DRAWN BY", project.drawnBy],
    ["CHECKED BY", project.checkedBy],
    ["SHEET NO", project.sheetNo],
  ];
  return (
    <section className="border border-[var(--line-strong)] bg-[var(--paper-raised)]">
      <PanelHeading index="04" title="타이틀 블록" />
      <dl className="grid grid-cols-[86px_1fr] divide-y divide-[var(--line)] border-t border-[var(--line)] text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="border-r border-[var(--line)] px-2 py-1 font-mono text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
              {label}
            </dt>
            <dd className="min-w-0 truncate px-2 py-1 font-medium text-[var(--ink)]">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ── 우측: KPI ── */
function KpiStrip({ projects }: { projects: Project[] }) {
  const activeCount = projects.length;
  const reviewCount = projects.filter((p) => p.permit === "심의중" || p.permit === "보완요청").length;
  const issueCount = projects.reduce((sum, p) => sum + p.issues.length, 0);
  const delayCount = projects.reduce(
    (sum, p) => sum + p.materials.filter((m) => m.status === "지연").length,
    0,
  );
  const kpis: [string, number, string][] = [
    ["진행 프로젝트", activeCount, "text-[var(--ink)]"],
    ["인허가 심의대기", reviewCount, "text-[var(--blueprint)]"],
    ["미결 현장 이슈", issueCount, "text-[var(--redline)]"],
    ["자재 발주 지연", delayCount, "text-[var(--redline)]"],
  ];
  return (
    <section className="border border-[var(--line-strong)] bg-[var(--paper-raised)]">
      <PanelHeading index="05" title="현황 지표" />
      <div className="grid grid-cols-2 divide-x divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {kpis.map(([label, value, cls]) => (
          <div key={label} className="px-2 py-2">
            <p className={`font-mono text-2xl font-semibold leading-none tabular-nums ${cls}`}>
              {String(value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 우측: 리비전 로그 ── */
function RevisionLog({ project, className = "" }: { project: Project; className?: string }) {
  const revs = [...project.revisions].reverse();
  return (
    <section
      className={`flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)] ${className}`}
    >
      <PanelHeading index="06" title="도면 리비전" />
      <div className="min-h-0 flex-1 overflow-y-auto">
      <table className="w-full text-[10px]">
        <caption className="sr-only">{project.name} 도면 리비전 이력</caption>
        <thead>
          <tr className="border-b border-[var(--line)] text-left text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
            <th scope="col" className="px-2 py-1 font-medium">REV</th>
            <th scope="col" className="px-2 py-1 font-medium">DATE</th>
            <th scope="col" className="px-2 py-1 font-medium">NOTE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {revs.map((r) => (
            <tr key={`${r.rev}-${r.date}`}>
              <td className="px-2 py-1 font-mono font-semibold text-[var(--redline)]">{r.rev}</td>
              <td className="px-2 py-1 font-mono tabular-nums text-[var(--ink-soft)]">{r.date}</td>
              <td className="px-2 py-1 text-[var(--ink)]">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}

/* ── 하단: 현장 이슈 ── */
function IssuesTable({
  project,
  activeZoneKey,
  onZoneSelect,
}: {
  project: Project;
  activeZoneKey: string | null;
  onZoneSelect: (key: string | null) => void;
}) {
  const zoneLabel = (key: string) =>
    project.zones.find((z: Zone) => z.zoneKey === key)?.label ?? key;
  return (
    <section className="flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)]">
      <PanelHeading index="07" title="현장 이슈" />
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[440px] text-[11px]">
          <caption className="sr-only">{project.name} 현장 이슈 목록</caption>
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
              <th scope="col" className="px-2 py-1 font-medium">DATE</th>
              <th scope="col" className="px-2 py-1 font-medium">구역</th>
              <th scope="col" className="px-2 py-1 font-medium">내용</th>
              <th scope="col" className="px-2 py-1 font-medium">심각도</th>
              <th scope="col" className="px-2 py-1 font-medium">담당</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {project.issues.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-4 text-center text-[var(--ink-soft)]">
                  등록된 현장 이슈가 없습니다.
                </td>
              </tr>
            ) : (
              project.issues.map((issue: Issue) => {
                const meta = SEVERITY_META[issue.severity];
                const Icon = meta.icon;
                const active = activeZoneKey === issue.zoneKey;
                return (
                  <tr
                    key={issue.id}
                    className={`datum-transition ${active ? "bg-[var(--redline)]/6" : ""}`}
                  >
                    <td className="px-2 py-1.5 font-mono tabular-nums text-[var(--ink-soft)]">
                      {issue.date}
                    </td>
                    <td className="px-2 py-1.5">
                      <button
                        type="button"
                        aria-pressed={active}
                        onClick={() => onZoneSelect(active ? null : issue.zoneKey)}
                        className={`datum-transition ${FOCUS_RING} border border-[var(--line-strong)] px-1.5 py-0.5 text-[10px] text-[var(--ink)] hover:border-[var(--redline)] ${
                          active ? "border-[var(--redline)] text-[var(--redline)]" : ""
                        }`}
                      >
                        {zoneLabel(issue.zoneKey)}
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-[var(--ink)]">{issue.title}</td>
                    <td className="px-2 py-1.5">
                      <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] ${meta.cls}`}>
                        <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-[var(--ink-soft)]">{issue.assignee}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── 하단: 자재 발주 ── */
function MaterialsTable({ project }: { project: Project }) {
  return (
    <section className="flex min-h-0 flex-col border border-[var(--line-strong)] bg-[var(--paper-raised)]">
      <PanelHeading index="08" title="자재 발주" />
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full min-w-[440px] text-[11px]">
          <caption className="sr-only">{project.name} 자재 발주 현황</caption>
          <thead>
            <tr className="border-b border-[var(--line)] text-left text-[9px] uppercase tracking-wide text-[var(--ink-soft)]">
              <th scope="col" className="px-2 py-1 font-medium">품목</th>
              <th scope="col" className="px-2 py-1 font-medium text-right">수량</th>
              <th scope="col" className="px-2 py-1 font-medium">납기</th>
              <th scope="col" className="px-2 py-1 font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {project.materials.map((m: Material) => {
              const meta = MATERIAL_STATUS_META[m.status];
              const Icon = meta.icon;
              return (
                <tr key={m.id}>
                  <td className="px-2 py-1.5 text-[var(--ink)]">{m.item}</td>
                  <td className="px-2 py-1.5 text-right font-mono tabular-nums text-[var(--ink)]">
                    {m.qty.toLocaleString("ko-KR")} {m.unit}
                  </td>
                  <td className="px-2 py-1.5 font-mono tabular-nums text-[var(--ink-soft)]">
                    {m.dueDate}
                  </td>
                  <td className="px-2 py-1.5">
                    <span className={`inline-flex items-center gap-1 border px-1.5 py-0.5 text-[9px] ${meta.cls}`}>
                      <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                      {m.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashClient() {
  const [activePhase, setActivePhase] = useState<"전체" | Phase>("전체");
  const [selectedId, setSelectedId] = useState<string>(PROJECTS[0].id);
  const [activeZoneKey, setActiveZoneKey] = useState<string | null>(null);

  const filteredProjects = useMemo(
    () => (activePhase === "전체" ? PROJECTS : PROJECTS.filter((p) => p.phase === activePhase)),
    [activePhase],
  );

  const selectedProject = useMemo(
    () => filteredProjects.find((p) => p.id === selectedId) ?? filteredProjects[0] ?? PROJECTS[0],
    [filteredProjects, selectedId],
  );

  function handleSelectProject(id: string) {
    setSelectedId(id);
    setActiveZoneKey(null);
  }

  function handlePhaseFilter(phase: "전체" | Phase) {
    setActivePhase(phase);
    setActiveZoneKey(null);
  }

  return (
    <div className="datum-scope flex flex-col text-[var(--ink)] lg:h-screen lg:overflow-hidden">
      <a
        href="#datum-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:border focus:border-[var(--ink)] focus:bg-[var(--paper)] focus:px-3 focus:py-2 focus:text-sm"
      >
        본문 바로가기
      </a>

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--ink)] px-3 py-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--ink)]" aria-hidden="true" />
          <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--ink)]">DATUM</h1>
          <span className="hidden text-[11px] text-[var(--ink-soft)] sm:inline">
            오블리크 건축사사무소 · 프로젝트 관제
          </span>
        </div>

        <div role="group" aria-label="설계 단계 필터" className="flex flex-wrap items-center gap-1">
          {PHASE_FILTERS.map((f) => {
            const active = f === activePhase;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => handlePhaseFilter(f)}
                className={`datum-transition ${FOCUS_RING} min-h-[28px] border px-2 py-1 text-[11px] font-medium ${
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]"
                    : "border-[var(--line-strong)] text-[var(--ink-soft)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-[var(--ink-soft)] md:inline">정다은 소장</span>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center border border-[var(--ink)] text-[11px] font-semibold"
          >
            정
          </span>
        </div>
      </header>

      <div
        aria-hidden="true"
        className="hidden shrink-0 grid-cols-12 border-b border-[var(--line)] px-3 py-0.5 font-mono text-[9px] tracking-wide text-[var(--line-strong)] lg:grid"
      >
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="text-center">
            {String.fromCharCode(65 + i)}
          </span>
        ))}
      </div>

      <main
        id="datum-main"
        className="grid min-h-0 grid-cols-1 gap-[3px] p-[3px] lg:flex-1 lg:grid-cols-12 lg:overflow-hidden"
      >
        <div className="min-h-[280px] lg:col-span-3 lg:h-full lg:min-h-0">
          <SheetIndex
            projects={filteredProjects}
            selectedId={selectedProject.id}
            onSelect={handleSelectProject}
          />
        </div>

        <div className="flex min-h-0 flex-col gap-[3px] lg:col-span-6 lg:h-full">
          <ZoningPlan
            project={selectedProject}
            activeZoneKey={activeZoneKey}
            onZoneSelect={setActiveZoneKey}
            className="min-h-[340px] lg:min-h-0 lg:flex-[3]"
          />
          <ProcessSection project={selectedProject} className="min-h-[180px] lg:min-h-0 lg:flex-[2]" />
        </div>

        <div className="flex min-h-0 flex-col gap-[3px] overflow-y-auto lg:col-span-3 lg:h-full">
          <TitleBlock project={selectedProject} />
          <KpiStrip projects={filteredProjects} />
          <RevisionLog project={selectedProject} className="min-h-[160px] lg:min-h-0 lg:flex-1" />
        </div>
      </main>

      <div className="grid shrink-0 grid-cols-1 gap-[3px] p-[3px] pt-0 lg:max-h-[30vh] lg:grid-cols-2">
        <IssuesTable
          project={selectedProject}
          activeZoneKey={activeZoneKey}
          onZoneSelect={setActiveZoneKey}
        />
        <MaterialsTable project={selectedProject} />
      </div>
    </div>
  );
}
