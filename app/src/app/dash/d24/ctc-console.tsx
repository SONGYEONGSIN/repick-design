"use client";

import { useState } from "react";
import {
  TowerControl,
  TrainTrack,
  Waypoints,
  ListChecks,
  Signal as SignalIcon,
  ArrowLeftRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  GaugeCircle,
  ChevronRight,
} from "lucide-react";
import styles from "./console.module.css";
import {
  LINE_NAME,
  NOW_T,
  STATIONS,
  KPIS,
  TURNBACKS,
  DELAY_CHAIN,
  CATEGORY_LABEL,
  formatClock,
  getSnapshot,
  computeSignals,
  locationLabel,
  delayLabel,
  stationName,
} from "./data";
import { TrackSchematic } from "./track-schematic";
import { TrainGraph } from "./train-graph";
import { AspectBadge, AspectDot, DelayChip, LEVEL_TO_ASPECT, DOT_CLASS, TEXT_CLASS } from "./aspect-lamp";

const NAV_ITEMS = [
  { href: "#schematic", label: "계통도", icon: TrainTrack },
  { href: "#operations", label: "운행분석", icon: Waypoints },
  { href: "#roster", label: "현황표", icon: ListChecks },
  { href: "#schedule", label: "회차", icon: ArrowLeftRight },
];

const DELTA_ICON = { up: TrendingUp, down: TrendingDown, flat: Minus };

export function CtcConsole() {
  const [selectedId, setSelectedId] = useState<string>("FR 3390");

  const snapshot = getSnapshot(NOW_T);
  const signals = computeSignals(NOW_T);
  const selected = snapshot.find((s) => s.train.id === selectedId) ?? snapshot[0];
  const selectedTrain = selected.train;
  const nextSignal = signals.find((s) => s.stationId === selectedTrain.nextStationId) ?? signals[0];

  return (
    <div className={`${styles.root} min-h-dvh w-full`}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[1920px]">
        {/* 좌측 아이콘 레일 (lg 이상) */}
        <aside
          aria-label="주 메뉴"
          className="sticky top-0 hidden h-dvh w-16 shrink-0 flex-col items-center gap-1 border-r border-[var(--border)] bg-[var(--panel)] py-4 lg:flex"
        >
          <span className={`mb-3 flex size-9 items-center justify-center rounded-sm border border-[var(--border-strong)] text-[var(--accent)] ${styles.gridBg}`}>
            <TowerControl aria-hidden="true" className="size-5" />
            <span className="sr-only">ASPECT 콘솔 홈</span>
          </span>
          <nav aria-label="섹션 이동" className="flex flex-col items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className="flex min-h-11 w-14 flex-col items-center justify-center gap-1 rounded-sm text-[var(--text-3)] transition-colors hover:bg-[var(--panel-raised)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
              >
                <Icon aria-hidden="true" className="size-4" />
                <span className="text-[9px] tracking-wide">{label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* 마스트헤드 */}
          <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg)]/97 backdrop-blur">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-8">
              <h1 className="flex items-baseline gap-2">
                <span className="flex items-center gap-1.5 font-mono text-base font-bold tracking-[0.18em] text-[var(--text)]">
                  <TowerControl aria-hidden="true" className="size-4 text-[var(--accent)] lg:hidden" />
                  ASPECT
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-3)]">CTC 관제 콘솔</span>
              </h1>
              <span aria-hidden="true" className="hidden h-5 w-px bg-[var(--border-strong)] sm:block" />
              <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--text-2)]">
                DESK 04 · {LINE_NAME}
              </p>

              <div className="ms-auto flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--clear)]">
                  <ShieldCheck aria-hidden="true" className="size-3.5" />
                  <span>정상 근무</span>
                </div>
                <div className="text-right leading-tight">
                  <div className="font-mono text-lg font-semibold tabular-nums text-[var(--text)]">{formatClock(NOW_T)}</div>
                  <div className="text-[9px] uppercase tracking-wide text-[var(--text-3)]">스냅샷 기준</div>
                </div>
                <div className="flex items-center gap-2 border-l border-[var(--border)] pl-4">
                  <span className="flex size-8 items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--panel)] font-mono text-[11px] font-semibold text-[var(--text-2)]" aria-hidden="true">
                    AC
                  </span>
                  <div className="hidden leading-tight sm:block">
                    <div className="text-[12px] font-medium text-[var(--text)]">AILEEN CHO</div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">수석 관제사</div>
                  </div>
                </div>
              </div>
            </div>
            {/* 모바일 상단 스택 내비 */}
            <nav aria-label="섹션 이동" className="flex gap-1 overflow-x-auto border-t border-[var(--border)] px-4 py-1.5 sm:px-6 lg:hidden">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm px-3 text-[12px] text-[var(--text-2)] transition-colors hover:bg-[var(--panel-raised)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </a>
              ))}
            </nav>
          </header>

          <main className="min-w-0 flex-1 space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            {/* KPI */}
            <section aria-labelledby="kpi-heading">
              <div className="mb-3 flex items-center gap-2">
                <GaugeCircle aria-hidden="true" className="size-4 text-[var(--text-3)]" />
                <h2 id="kpi-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                  금일 운행 지표
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {KPIS.map((kpi) => {
                  const DeltaIcon = kpi.deltaDir ? DELTA_ICON[kpi.deltaDir] : null;
                  return (
                    <div key={kpi.label} className="min-w-0 rounded border border-[var(--border)] bg-[var(--panel)] p-4">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-3)]">{kpi.label}</div>
                      <div className="mt-1 font-mono text-3xl font-semibold tabular-nums text-[var(--text)]">{kpi.value}</div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {kpi.delta ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-[var(--text-2)]">
                            {DeltaIcon && <DeltaIcon aria-hidden="true" className="size-3" />}
                            {kpi.delta}
                          </span>
                        ) : (
                          <span />
                        )}
                        <span className="truncate text-[10px] text-[var(--text-3)]">{kpi.caption}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 선로 계통도 */}
            <section id="schematic" aria-labelledby="schematic-heading" className="scroll-mt-24">
              <div className="mb-3 flex items-center gap-2">
                <TrainTrack aria-hidden="true" className="size-4 text-[var(--text-3)]" />
                <h2 id="schematic-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                  선로 계통도 — {LINE_NAME}
                </h2>
                <span className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">km 0.0–84.3</span>
              </div>
              <div className="rounded border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
                <TrackSchematic snapshot={snapshot} signals={signals} selectedId={selectedId} onSelect={setSelectedId} />
              </div>
            </section>

            {/* 운행 분석: 운행선도 + 상세/신호 */}
            <section id="operations" aria-labelledby="operations-heading" className="scroll-mt-24">
              <div className="mb-3 flex items-center gap-2">
                <Waypoints aria-hidden="true" className="size-4 text-[var(--text-3)]" />
                <h2 id="operations-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                  운행 분석
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div className="min-w-0 rounded border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5 lg:col-span-8">
                  <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-2)]">
                    운행선도 (Train Graph) · 06:00–10:00
                  </h3>
                  <TrainGraph snapshot={snapshot} selectedId={selectedId} onSelect={setSelectedId} />
                </div>

                <div className="flex min-w-0 flex-col gap-4 lg:col-span-4">
                  {/* 선택 열차 상세 */}
                  <div className="rounded border border-[var(--accent)]/40 bg-[var(--panel)] p-4 sm:p-5">
                    <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-2)]">선택 열차 상세</h3>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-2xl font-bold tabular-nums text-[var(--text)]">{selectedTrain.id}</span>
                      <DelayChip level={selected.level} text={delayLabel(selectedTrain.delayMin)} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-[12px]">
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">종별</dt>
                        <dd className="mt-0.5 text-[var(--text)]">{CATEGORY_LABEL[selectedTrain.category]}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">방향</dt>
                        <dd className="mt-0.5 flex items-center gap-1 text-[var(--text)]">
                          {stationName(selectedTrain.origin)}
                          <ChevronRight aria-hidden="true" className="size-3 text-[var(--text-3)]" />
                          {stationName(selectedTrain.destination)}
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">현재 위치</dt>
                        <dd className="mt-0.5 font-mono tabular-nums text-[var(--text)]">{locationLabel(selectedTrain, NOW_T)}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">속도</dt>
                        <dd className="mt-0.5 font-mono tabular-nums text-[var(--text)]">{selected.speedKmh} km/h</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">다음역 ETA</dt>
                        <dd className="mt-0.5 font-mono tabular-nums text-[var(--text)]">
                          {stationName(selectedTrain.nextStationId)} · {selectedTrain.etaMin}분
                        </dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-[10px] uppercase tracking-wide text-[var(--text-3)]">다음 신호</dt>
                        <dd className="mt-1">
                          <AspectBadge aspect={nextSignal.aspect} />
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* 지연 파급 경로 */}
                  <div className="rounded border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
                    <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-2)]">
                      <AlertTriangle aria-hidden="true" className="size-3.5 text-[var(--caution)]" />
                      지연 파급 경로
                    </h3>
                    <ol className="space-y-0">
                      {DELAY_CHAIN.map((step, i) => {
                        const aspect = LEVEL_TO_ASPECT[step.severity];
                        const isLast = i === DELAY_CHAIN.length - 1;
                        return (
                          <li key={step.actor} className={`relative ms-1.5 border-[var(--border)] ps-5 ${isLast ? "" : "border-l pb-4"}`}>
                            <span aria-hidden="true" className={`absolute -start-[5px] top-0.5 size-2.5 rounded-full ${DOT_CLASS[aspect]}`} />
                            <span className={`font-mono text-[12px] font-semibold ${TEXT_CLASS[aspect]}`}>{step.actor}</span>
                            <p className="mt-0.5 text-[12px] leading-snug text-[var(--text-2)]">{step.description}</p>
                          </li>
                        );
                      })}
                    </ol>
                  </div>

                  {/* 신호 현황 */}
                  <div className="rounded border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
                    <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-2)]">
                      <SignalIcon aria-hidden="true" className="size-3.5" />
                      신호 현황
                    </h3>
                    <ul className="space-y-2">
                      {signals.map((sig) => (
                        <li key={sig.stationId} className="flex items-start justify-between gap-3 text-[12px]">
                          <span className="mt-0.5 font-mono font-semibold text-[var(--text)]">{sig.stationId}</span>
                          <span className="flex-1 text-[11px] leading-snug text-[var(--text-3)]">{sig.note}</span>
                          <AspectBadge aspect={sig.aspect} dense />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* 열차 현황표 + 회차 스케줄 */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <section id="roster" aria-labelledby="roster-heading" className="min-w-0 scroll-mt-24 lg:col-span-7">
                <div className="mb-3 flex items-center gap-2">
                  <ListChecks aria-hidden="true" className="size-4 text-[var(--text-3)]" />
                  <h2 id="roster-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                    열차 현황표
                  </h2>
                </div>
                <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--panel)]">
                  <table className="w-full min-w-[720px] border-collapse text-[12px]">
                    <caption className="sr-only">본선 재선 7개 열차의 현재 위치, 속도, 다음역, 지연 현황표</caption>
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left text-[10px] uppercase tracking-wide text-[var(--text-3)]">
                        <th scope="col" className="px-3 py-2 font-medium">
                          열차
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          종별
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          현재 위치
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-medium">
                          속도
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          다음역 · ETA
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          상태
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {snapshot.map(({ train, level, speedKmh }) => {
                        const selectedRow = selectedId === train.id;
                        return (
                          <tr
                            key={train.id}
                            aria-selected={selectedRow}
                            className={`border-b border-[var(--border)] last:border-b-0 ${selectedRow ? "bg-[var(--accent)]/10" : "hover:bg-[var(--panel-raised)]"}`}
                          >
                            <th scope="row" className="px-3 py-2 text-left font-normal">
                              <button
                                type="button"
                                onClick={() => setSelectedId(train.id)}
                                aria-pressed={selectedRow}
                                className="flex min-h-11 items-center gap-1.5 rounded-sm font-mono font-semibold tabular-nums text-[var(--text)] underline-offset-4 hover:text-[var(--accent)] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--panel)]"
                              >
                                {train.direction === "up" ? (
                                  <TrendingUp aria-hidden="true" className="size-3.5 text-[var(--text-3)]" />
                                ) : (
                                  <TrendingDown aria-hidden="true" className="size-3.5 text-[var(--text-3)]" />
                                )}
                                {train.id}
                              </button>
                            </th>
                            <td className="px-3 py-2 text-[var(--text-2)]">{CATEGORY_LABEL[train.category]}</td>
                            <td className="px-3 py-2 font-mono tabular-nums text-[var(--text-2)]">{locationLabel(train, NOW_T)}</td>
                            <td className="px-3 py-2 text-right font-mono tabular-nums text-[var(--text-2)]">{speedKmh} km/h</td>
                            <td className="px-3 py-2 font-mono tabular-nums text-[var(--text-2)]">
                              {stationName(train.nextStationId)} · {train.etaMin}분
                            </td>
                            <td className="px-3 py-2">
                              <DelayChip level={level} text={delayLabel(train.delayMin)} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              <section id="schedule" aria-labelledby="schedule-heading" className="min-w-0 scroll-mt-24 lg:col-span-5">
                <div className="mb-3 flex items-center gap-2">
                  <ArrowLeftRight aria-hidden="true" className="size-4 text-[var(--text-3)]" />
                  <h2 id="schedule-heading" className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">
                    회차 스케줄
                  </h2>
                </div>
                <div className="overflow-x-auto rounded border border-[var(--border)] bg-[var(--panel)]">
                  <table className="w-full min-w-[520px] border-collapse text-[12px]">
                    <caption className="sr-only">종착역 회차 스케줄 — 도착 열차, 승강장, 정차시간, 출발 열차</caption>
                    <thead>
                      <tr className="border-b border-[var(--border)] text-left text-[10px] uppercase tracking-wide text-[var(--text-3)]">
                        <th scope="col" className="px-3 py-2 font-medium">
                          도착
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          승강장
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-medium">
                          정차
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          출발
                        </th>
                        <th scope="col" className="px-3 py-2 font-medium">
                          상태
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TURNBACKS.map((row) => (
                        <tr key={`${row.arriving}-${row.arrivalClock}`} className="border-b border-[var(--border)] text-[var(--text-2)] last:border-b-0">
                          <td className="px-3 py-2">
                            <div className="font-mono font-semibold tabular-nums text-[var(--text)]">{row.arriving}</div>
                            <div className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">{row.arrivalClock}</div>
                          </td>
                          <td className="px-3 py-2">{row.track}</td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums">{row.dwellMin}분</td>
                          <td className="px-3 py-2">
                            <div className="font-mono font-semibold tabular-nums text-[var(--text)]">{row.departing}</div>
                            <div className="font-mono text-[10px] tabular-nums text-[var(--text-3)]">{row.departureClock}</div>
                          </td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex items-center gap-1 rounded-sm border border-[var(--border)] px-1.5 py-0.5 text-[10px] ${
                                row.status === "지연영향" ? "text-[var(--caution)]" : row.status === "완료" ? "text-[var(--text-3)]" : "text-[var(--text-2)]"
                              }`}
                            >
                              <AspectDot aspect={row.status === "지연영향" ? "caution" : row.status === "완료" ? "clear" : "restrict"} />
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </main>

          <footer className="border-t border-[var(--border)] px-4 py-3 text-center text-[10px] text-[var(--text-3)] sm:px-6 lg:px-8">
            ASPECT CTC · {LINE_NAME} · 단선 + 교행대피선 {STATIONS.length}개 역 · km 0.0–84.3 · 표시 데이터는 스냅샷 더미입니다.
          </footer>
        </div>
      </div>
    </div>
  );
}
