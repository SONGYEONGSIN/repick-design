"use client";

import { useEffect, useState, type ComponentType } from "react";
import {
  Anchor,
  ArrowDownToLine,
  Bell,
  BatteryMedium,
  ChevronRight,
  CircleCheck,
  CircleDot,
  Compass,
  FileText,
  Flag,
  Gauge,
  Layers,
  LogOut,
  MapPin,
  Menu,
  Radio,
  Route,
  Settings,
  ShieldAlert,
  Thermometer,
  TriangleAlert,
  Users,
  Wind,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import {
  DIVES,
  SAMPLES,
  VEHICLES,
  LOG_LINES,
  STATUS_LABEL,
  VEHICLE_STATUS_LABEL,
  type Dive,
  type DiveStatus,
  type Vehicle,
} from "./data";
import { DepthColumn } from "./depth-column";
import { SonarSweep } from "./sonar-sweep";
import { Sparkline } from "./sparkline";

const nf = new Intl.NumberFormat("ko-KR");
const nf1 = new Intl.NumberFormat("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const df = new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" });

function formatDate(iso: string): string {
  return df.format(new Date(`${iso}T00:00:00Z`)).replaceAll(" ", "");
}

const FOCUS_1 = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink-1)]";
const FOCUS_0 = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink-0)]";

const NAV_ITEMS: { label: string; icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>; current?: boolean }[] = [
  { label: "플릿 콘솔", icon: Gauge, current: true },
  { label: "다이브 미션", icon: Route },
  { label: "샘플 아카이브", icon: Layers },
  { label: "시스템 로그", icon: FileText },
  { label: "환경 설정", icon: Settings },
];

const STATUS_FILTERS: { key: DiveStatus | "all"; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "in-progress", label: "진행 중" },
  { key: "complete", label: "완료" },
  { key: "aborted", label: "중단" },
];

function DiveStatusBadge({ status }: { status: DiveStatus }) {
  const cfg = {
    complete: { icon: CircleCheck, colorClass: "text-[var(--accent)]", pulse: false },
    "in-progress": { icon: Radio, colorClass: "text-[var(--accent)]", pulse: true },
    aborted: { icon: TriangleAlert, colorClass: "text-[var(--crit)]", pulse: false },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-[var(--line-strong)] bg-[var(--ink-2)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${cfg.colorClass}`}>
      <Icon aria-hidden className={`h-3 w-3 shrink-0 ${cfg.pulse ? "hadal-glow-breathe" : ""}`} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function VehicleStatusBadge({ status }: { status: Vehicle["status"] }) {
  const cfg = {
    active: { icon: Radio, colorClass: "text-[var(--accent)]" },
    standby: { icon: CircleDot, colorClass: "text-[var(--text-mid)]" },
    maintenance: { icon: Wrench, colorClass: "text-[var(--warn)]" },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${cfg.colorClass}`}>
      <Icon aria-hidden className="h-3 w-3" />
      {VEHICLE_STATUS_LABEL[status]}
    </span>
  );
}

function SectionHeader({
  id,
  index,
  title,
  icon: Icon,
}: {
  id: string;
  index: string;
  title: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}) {
  return (
    <header className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-3">
      <span className="hadal-mono font-mono text-[10px] text-[var(--text-low)]">{index}</span>
      <Icon aria-hidden className="h-3.5 w-3.5 text-[var(--accent-dim)]" />
      <h2 id={id} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-mid)]">
        {title}
      </h2>
    </header>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <li key={item.label}>
          <button
            type="button"
            aria-current={item.current ? "page" : undefined}
            onClick={onNavigate}
            className={`flex min-h-11 w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[13px] transition-colors ${FOCUS_0} ${
              item.current
                ? "bg-[var(--ink-2)] text-[var(--text-hi)]"
                : "text-[var(--text-mid)] hover:bg-[var(--ink-2)] hover:text-[var(--text-hi)]"
            }`}
          >
            <item.icon aria-hidden className={`h-4 w-4 ${item.current ? "text-[var(--accent)]" : ""}`} />
            {item.label}
            {item.current && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />}
          </button>
        </li>
      ))}
    </ul>
  );
}

function BrandPlate() {
  return (
    <div className="px-5 pb-5 pt-6">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--line-strong)] bg-[var(--ink-2)]">
          <Anchor aria-hidden className="h-4 w-4 text-[var(--accent)]" />
        </span>
        <div>
          <p className="font-mono text-[15px] font-semibold tracking-[0.08em] text-[var(--text-hi)]">HADAL</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-low)]">Subsea Fleet Console</p>
        </div>
      </div>
      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-low)]">Control Unit MK.II · Deck 4</p>
    </div>
  );
}

function WorkspaceFooter() {
  return (
    <div className="mt-auto border-t border-[var(--line)] px-5 py-4">
      <p className="text-[11px] font-medium text-[var(--text-hi)]">Meridian Institute</p>
      <p className="text-[10px] text-[var(--text-low)]">Ops Bay 4 · R. Okafor</p>
      <button type="button" className={`mt-3 flex min-h-11 items-center gap-2 rounded-sm px-2 text-[11px] text-[var(--text-mid)] hover:text-[var(--text-hi)] ${FOCUS_0}`}>
        <LogOut aria-hidden className="h-3.5 w-3.5" />
        세션 종료
      </button>
    </div>
  );
}

export default function DashboardClient() {
  const [selectedDiveId, setSelectedDiveId] = useState<string>("DV-0511");
  const [statusFilter, setStatusFilter] = useState<DiveStatus | "all">("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  const selectedDive: Dive = DIVES.find((d) => d.id === selectedDiveId) ?? DIVES[0];
  const selectedVehicle: Vehicle = VEHICLES.find((v) => v.id === selectedDive.vehicleId) ?? VEHICLES[0];
  const filteredDives = statusFilter === "all" ? DIVES : DIVES.filter((d) => d.status === statusFilter);
  const samplesForDive = SAMPLES.filter((s) => s.diveId === selectedDive.id);
  const logsForVehicle = LOG_LINES.filter((l) => l.vehicleId === selectedVehicle.id);

  const kpis: {
    key: string;
    label: string;
    icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
    value: string;
    unit: string;
    spark?: number[];
  }[] = [
    { key: "pressure", label: "외압", icon: Gauge, value: nf1.format(selectedDive.telemetry.pressure), unit: "BAR", spark: selectedDive.sparklines.pressure },
    { key: "temp", label: "수온", icon: Thermometer, value: nf1.format(selectedDive.telemetry.temp), unit: "°C" },
    { key: "battery", label: "배터리", icon: BatteryMedium, value: nf.format(selectedDive.telemetry.battery), unit: "%", spark: selectedDive.sparklines.battery },
    { key: "o2", label: "산소 공급", icon: Wind, value: nf.format(selectedDive.telemetry.o2), unit: "%" },
    { key: "heading", label: "방위각", icon: Compass, value: nf.format(selectedDive.telemetry.heading), unit: "°" },
    { key: "thruster", label: "추진기 부하", icon: Zap, value: nf.format(selectedDive.telemetry.thrusterLoad), unit: "%", spark: selectedDive.sparklines.thruster },
  ];

  return (
    <div className="hadal flex h-screen w-full overflow-hidden bg-[var(--ink-0)] text-[var(--text-hi)]">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--line)] bg-[var(--ink-1)] md:flex">
        <BrandPlate />
        <nav aria-label="주 메뉴">
          <NavList />
        </nav>
        <WorkspaceFooter />
      </aside>

      {/* 모바일 드로어 */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="메뉴 닫기"
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
          />
          <div role="dialog" aria-modal="true" aria-label="주 메뉴" className="hadal relative flex h-full w-72 flex-col border-r border-[var(--line)] bg-[var(--ink-1)]">
            <div className="flex items-center justify-between px-3 pt-3">
              <span className="sr-only">메뉴</span>
              <button
                type="button"
                autoFocus
                onClick={() => setMobileNavOpen(false)}
                aria-label="메뉴 닫기"
                className={`ml-auto flex h-11 w-11 items-center justify-center rounded-sm text-[var(--text-mid)] hover:text-[var(--text-hi)] ${FOCUS_0}`}
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>
            <BrandPlate />
            <nav aria-label="주 메뉴">
              <NavList onNavigate={() => setMobileNavOpen(false)} />
            </nav>
            <WorkspaceFooter />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* 탑바 */}
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--ink-1)] px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="메뉴 열기"
              onClick={() => setMobileNavOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-sm text-[var(--text-mid)] hover:text-[var(--text-hi)] md:hidden ${FOCUS_1}`}
            >
              <Menu aria-hidden className="h-5 w-5" />
            </button>
            <nav aria-label="위치 정보" className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text-low)]">
              <span>플릿</span>
              <ChevronRight aria-hidden className="h-3 w-3 shrink-0" />
              <span className="truncate text-[var(--text-hi)]">{selectedVehicle.name}</span>
            </nav>
          </div>
          <div className="hidden items-center gap-4 font-mono text-[11px] text-[var(--text-mid)] sm:flex">
            <span className="flex items-center gap-1.5">
              <Radio aria-hidden className="h-3.5 w-3.5 text-[var(--accent)]" />
              UPLINK · TETHER 4/4
            </span>
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <span className="flex items-center gap-1.5" role="status">
              <Bell aria-hidden className="h-3.5 w-3.5" />
              미확인 알림 3건
            </span>
            <span className="h-3 w-px bg-[var(--line-strong)]" aria-hidden />
            <span>{formatDate(selectedDive.date)} UTC</span>
          </div>
        </header>

        {/* 메인 */}
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          <h1 className="sr-only">HADAL 서브씨 플릿 콘솔 — {selectedVehicle.name} 텔레메트리 대시보드</h1>

          <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-12">
            {/* 01 수심 단면 (히어로) */}
            <section aria-labelledby="panel-depth" className="hadal-bracket flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4 xl:row-span-2">
              <SectionHeader id="panel-depth" index="01" title="Depth Column" icon={ArrowDownToLine} />
              <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-low)]">
                      최대 수심 도달 · {selectedDive.id}
                    </p>
                    <p className="hadal-mono font-mono text-5xl font-semibold leading-none text-[var(--text-hi)]">
                      {nf.format(selectedDive.maxDepth)}
                      <span className="ml-1.5 text-base font-normal text-[var(--text-mid)]">M</span>
                    </p>
                  </div>
                  <DiveStatusBadge status={selectedDive.status} />
                </div>
                <div className="min-h-[380px] flex-1">
                  <DepthColumn dive={selectedDive} />
                </div>
              </div>
            </section>

            {/* 02 소나 스윕 */}
            <section aria-labelledby="panel-sonar" className="hadal-bracket flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4 xl:row-span-2">
              <SectionHeader id="panel-sonar" index="02" title="Sonar Sweep" icon={Radio} />
              <div className="flex flex-1 flex-col p-4">
                <SonarSweep dive={selectedDive} />
              </div>
            </section>

            {/* 03 텔레메트리 */}
            <section aria-labelledby="panel-telemetry" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4 xl:row-span-2">
              <SectionHeader id="panel-telemetry" index="03" title="Telemetry" icon={Gauge} />
              <ul className="flex flex-1 flex-col justify-around divide-y divide-[var(--line)]">
                {kpis.map((k) => (
                  <li key={k.key} className="flex items-center justify-between gap-3 px-4 py-3.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <k.icon aria-hidden className="h-4 w-4 shrink-0 text-[var(--accent-dim)]" />
                      <div className="min-w-0">
                        <p className="truncate text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">{k.label}</p>
                        <p className="hadal-mono font-mono text-xl font-semibold text-[var(--text-hi)]">
                          {k.value}
                          <span className="ml-1 text-[11px] font-normal text-[var(--text-mid)]">{k.unit}</span>
                        </p>
                      </div>
                    </div>
                    {k.spark && <Sparkline values={k.spark} label={k.label} />}
                  </li>
                ))}
              </ul>
            </section>

            {/* 04 다이브 로그 */}
            <section aria-labelledby="panel-log" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-7">
              <SectionHeader id="panel-log" index="04" title="Dive Log" icon={Route} />
              <div className="flex min-w-0 flex-col gap-3 p-4">
                <div role="group" aria-label="다이브 상태 필터" className="flex flex-wrap gap-2">
                  {STATUS_FILTERS.map((f) => {
                    const active = statusFilter === f.key;
                    const count = f.key === "all" ? DIVES.length : DIVES.filter((d) => d.status === f.key).length;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setStatusFilter(f.key)}
                        className={`min-h-11 rounded-sm border px-3 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${FOCUS_1} ${
                          active
                            ? "border-[var(--accent)] bg-[var(--ink-2)] text-[var(--accent)]"
                            : "border-[var(--line-strong)] text-[var(--text-mid)] hover:text-[var(--text-hi)]"
                        }`}
                      >
                        {f.label} <span className="text-[var(--text-low)]">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="relative min-w-0 overflow-x-auto">
                  <table className="w-full min-w-[560px] border-collapse text-left sm:min-w-0 sm:table-fixed">
                    <colgroup>
                      <col className="sm:w-[15%]" />
                      <col className="sm:w-[19%]" />
                      <col className="sm:w-[20%]" />
                      <col className="sm:w-[15%]" />
                      <col className="sm:w-[18%]" />
                      <col className="sm:w-[13%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[var(--line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-low)]">
                        <th scope="col" className="py-2 pr-3 font-medium">
                          ID
                        </th>
                        <th scope="col" className="py-2 pr-3 font-medium">
                          유닛
                        </th>
                        <th scope="col" className="py-2 pr-3 font-medium">
                          사이트
                        </th>
                        <th scope="col" className="py-2 pr-3 text-right font-medium">
                          최대수심
                        </th>
                        <th scope="col" className="py-2 pr-3 font-medium">
                          상태
                        </th>
                        <th scope="col" className="py-2 pr-3 font-medium">
                          <span className="sr-only">열기</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDives.map((dive) => {
                        const vehicle = VEHICLES.find((v) => v.id === dive.vehicleId);
                        const isSelected = dive.id === selectedDive.id;
                        return (
                          <tr
                            key={dive.id}
                            aria-selected={isSelected}
                            onClick={() => setSelectedDiveId(dive.id)}
                            className={`cursor-pointer border-b border-[var(--line)] text-[12px] transition-colors ${
                              isSelected ? "bg-[var(--ink-2)]" : "hover:bg-[var(--ink-2)]/60"
                            }`}
                          >
                            <td className={`truncate py-2.5 pr-3 font-mono ${isSelected ? "text-[var(--accent)]" : "text-[var(--text-hi)]"}`}>
                              {isSelected && <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden />}
                              {dive.id}
                            </td>
                            <td className="truncate py-2.5 pr-3 text-[var(--text-mid)]" title={vehicle?.name}>
                              {vehicle?.name}
                            </td>
                            <td className="truncate py-2.5 pr-3 text-[var(--text-mid)]" title={dive.site}>
                              {dive.site}
                            </td>
                            <td className="hadal-mono whitespace-nowrap py-2.5 pr-3 text-right font-mono text-[var(--text-hi)]">{nf.format(dive.maxDepth)} m</td>
                            <td className="py-2.5 pr-3">
                              <DiveStatusBadge status={dive.status} />
                            </td>
                            <td className="py-0.5 pr-0 text-right">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDiveId(dive.id);
                                }}
                                aria-pressed={isSelected}
                                className={`ml-auto flex h-11 w-11 items-center justify-center rounded-sm text-[var(--text-low)] hover:text-[var(--accent)] ${FOCUS_1}`}
                              >
                                <span className="sr-only">
                                  다이브 선택: {dive.id}, {vehicle?.name}, {dive.site}, 최대 수심 {nf.format(dive.maxDepth)}m, {STATUS_LABEL[dive.status]}
                                </span>
                                <ChevronRight aria-hidden className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* 05 샘플 매니페스트 */}
            <section aria-labelledby="panel-samples" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-5">
              <SectionHeader id="panel-samples" index="05" title="Sample Manifest" icon={Layers} />
              <div className="min-w-0 flex-1 overflow-x-auto p-4">
                {samplesForDive.length > 0 ? (
                  <table className="w-full table-fixed border-collapse text-left text-[12px]">
                    <colgroup>
                      <col className="w-[22%]" />
                      <col className="w-[38%]" />
                      <col className="w-[20%]" />
                      <col className="w-[20%]" />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[var(--line)] font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-low)]">
                        <th scope="col" className="py-2 pr-2 font-medium">
                          ID
                        </th>
                        <th scope="col" className="py-2 pr-2 font-medium">
                          분류 / 명칭
                        </th>
                        <th scope="col" className="py-2 pr-2 text-right font-medium">
                          수심
                        </th>
                        <th scope="col" className="py-2 pr-2 text-right font-medium">
                          수량
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {samplesForDive.map((s) => (
                        <tr key={s.id} className="border-b border-[var(--line)] last:border-0">
                          <td className="hadal-mono truncate py-2 pr-2 font-mono text-[var(--text-hi)]">{s.id}</td>
                          <td className="py-2 pr-2 text-[var(--text-mid)]">
                            <div className="flex min-w-0 items-center gap-1.5">
                              <span className="shrink-0 rounded-sm border border-[var(--line-strong)] px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--accent-dim)]">{s.tag}</span>
                              <span className="truncate" title={s.label}>
                                {s.label}
                              </span>
                            </div>
                          </td>
                          <td className="hadal-mono whitespace-nowrap py-2 pr-2 text-right font-mono text-[var(--text-hi)]">{nf.format(s.depth)} m</td>
                          <td className="hadal-mono whitespace-nowrap py-2 pr-2 text-right font-mono text-[var(--text-mid)]">{s.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="py-6 text-center text-[12px] text-[var(--text-low)]">이 다이브에서 수집된 샘플이 없습니다.</p>
                )}
              </div>
            </section>

            {/* 06 플릿 상태 */}
            <section aria-labelledby="panel-fleet" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4">
              <SectionHeader id="panel-fleet" index="06" title="Fleet Status" icon={Users} />
              <ul className="flex flex-1 flex-col divide-y divide-[var(--line)]">
                {VEHICLES.map((v) => {
                  const isTracked = v.id === selectedVehicle.id;
                  return (
                    <li
                      key={v.id}
                      aria-current={isTracked ? "true" : undefined}
                      className={`flex items-center justify-between gap-2 px-4 py-3 ${isTracked ? "border-l-2 border-[var(--accent)] bg-[var(--ink-2)]" : "border-l-2 border-transparent"}`}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[12px] font-semibold text-[var(--text-hi)]">{v.name}</p>
                        <p className="truncate text-[10px] text-[var(--text-low)]">{v.className}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <VehicleStatusBadge status={v.status} />
                        {isTracked && <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--accent)]">Tracking</span>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* 07 미션 상세 */}
            <section aria-labelledby="panel-mission" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4">
              <SectionHeader id="panel-mission" index="07" title="Mission Detail" icon={Flag} />
              <dl className="flex-1 space-y-3 p-4 text-[12px]">
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">
                    <MapPin aria-hidden className="h-3 w-3" /> 사이트
                  </dt>
                  <dd className="mt-0.5 text-[var(--text-hi)]">{selectedDive.site}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">
                    <Flag aria-hidden className="h-3 w-3" /> 임무 목표
                  </dt>
                  <dd className="mt-0.5 text-[var(--text-mid)]">{selectedDive.objective}</dd>
                </div>
                <div className="flex gap-6">
                  <div>
                    <dt className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">
                      <Users aria-hidden className="h-3 w-3" /> 파일럿
                    </dt>
                    <dd className="mt-0.5 font-mono text-[var(--text-hi)]">{selectedDive.pilot}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">소요 시간</dt>
                    <dd className="hadal-mono mt-0.5 font-mono text-[var(--text-hi)]">{selectedDive.durationLabel}</dd>
                  </div>
                </div>
                <div className="border-t border-[var(--line)] pt-3">
                  <dt className="text-[10px] uppercase tracking-[0.1em] text-[var(--text-low)]">비고</dt>
                  <dd className="mt-0.5 text-[var(--text-mid)]">{selectedDive.note}</dd>
                </div>
              </dl>
            </section>

            {/* 08 시스템 로그 */}
            <section aria-labelledby="panel-syslog" className="flex min-w-0 flex-col rounded-sm border border-[var(--line)] bg-[var(--ink-1)] xl:col-span-4">
              <SectionHeader id="panel-syslog" index="08" title="System Log" icon={FileText} />
              <ul className="flex-1 space-y-2 overflow-y-auto p-4 font-mono text-[11px]">
                {logsForVehicle.map((log, i) => {
                  const cfg = {
                    INFO: { icon: CircleCheck, colorClass: "text-[var(--text-mid)]" },
                    WARN: { icon: TriangleAlert, colorClass: "text-[var(--warn)]" },
                    CRIT: { icon: ShieldAlert, colorClass: "text-[var(--crit)]" },
                  }[log.level];
                  const Icon = cfg.icon;
                  return (
                    <li key={`${log.vehicleId}-${log.time}-${i}`} className="flex items-start gap-2">
                      <Icon aria-hidden className={`mt-0.5 h-3 w-3 shrink-0 ${cfg.colorClass}`} />
                      <span className="shrink-0 text-[var(--text-low)]">{log.time}</span>
                      <span className={`shrink-0 text-[10px] font-semibold uppercase ${cfg.colorClass}`}>{log.level}</span>
                      <span className="text-[var(--text-mid)]">{log.msg}</span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
