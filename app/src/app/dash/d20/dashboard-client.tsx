"use client";

import { useMemo, useRef, useState } from "react";
import {
  SHOTS,
  SEQUENCE_START,
  SEQUENCE_END,
  SEQUENCE_TOTAL_FRAMES,
  shotPosition,
  RENDER_JOBS,
  NODE_LOADS,
  REVIEW_ITEMS,
  type ShotStatus,
} from "./data";
import { STATUS_META } from "./status-meta";
import styles from "./d20.module.css";

const TABS = [
  { id: "timeline", label: "시퀀스 타임라인" },
  { id: "farm", label: "렌더팜 큐" },
  { id: "dailies", label: "데일리즈 리뷰" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const FILTERS: { id: "all" | ShotStatus; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "queued", label: "대기" },
  { id: "rendering", label: "렌더링 중" },
  { id: "review", label: "검토중" },
  { id: "approved", label: "승인" },
  { id: "error", label: "오류" },
];

const PLAYHEAD_FRAME = 1552;

function framePct(frame: number): number {
  return ((frame - SEQUENCE_START) / SEQUENCE_TOTAL_FRAMES) * 100;
}

const MAJOR_TICKS = [1001, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600];
const MINOR_TICKS: number[] = [];
for (let f = 1050; f < SEQUENCE_END; f += 50) {
  if (f % 200 !== 0) MINOR_TICKS.push(f);
}

function nodeTone(load: number): "teal" | "amber" | "red" {
  if (load >= 85) return "red";
  if (load >= 65) return "amber";
  return "teal";
}

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabId>("timeline");
  const [filter, setFilter] = useState<"all" | ShotStatus>("all");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const filteredShots = useMemo(
    () => (filter === "all" ? SHOTS : SHOTS.filter((s) => s.status === filter)),
    [filter],
  );

  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section aria-labelledby="pipeline-tabs-heading" className="mt-8">
      <h2 id="pipeline-tabs-heading" className="sr-only">
        파이프라인 뷰 전환
      </h2>

      <div
        role="tablist"
        aria-label="파이프라인 뷰"
        className="flex gap-1 overflow-x-auto border-b border-[var(--dg-border)]"
      >
        {TABS.map((tab, idx) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => onTabKeyDown(e, idx)}
              className={`relative shrink-0 px-4 py-3 text-sm font-medium tracking-wide whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--dg-amber)] ${
                selected
                  ? "text-[var(--dg-text)]"
                  : "text-[var(--dg-text-dim)] hover:text-[var(--dg-text)]"
              }`}
            >
              {tab.label}
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-[var(--dg-amber)]"
                />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "timeline" && (
        <div role="tabpanel" id="panel-timeline" aria-labelledby="tab-timeline" tabIndex={0}>
          <TimelinePanel filter={filter} setFilter={setFilter} filteredShots={filteredShots} />
        </div>
      )}
      {activeTab === "farm" && (
        <div role="tabpanel" id="panel-farm" aria-labelledby="tab-farm" tabIndex={0}>
          <FarmPanel />
        </div>
      )}
      {activeTab === "dailies" && (
        <div role="tabpanel" id="panel-dailies" aria-labelledby="tab-dailies" tabIndex={0}>
          <DailiesPanel />
        </div>
      )}
    </section>
  );
}

function TimelinePanel({
  filter,
  setFilter,
  filteredShots,
}: {
  filter: "all" | ShotStatus;
  setFilter: (f: "all" | ShotStatus) => void;
  filteredShots: typeof SHOTS;
}) {
  const activeShotSet = useMemo(() => new Set(filteredShots.map((s) => s.code)), [filteredShots]);

  return (
    <div className="py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--dg-text)]">
          시퀀스 타임라인 <span className="font-mono text-sm font-normal text-[var(--dg-text-dim)]">SQ040_ICECAVE</span>
        </h2>
        <p className="font-mono text-xs text-[var(--dg-text-faint)]">
          {SEQUENCE_START}–{SEQUENCE_END} · {SEQUENCE_TOTAL_FRAMES}F
        </p>
      </div>

      <p className="mt-1 text-sm text-[var(--dg-text-dim)]">
        컷 순서대로 이어붙인 편집 타임라인 시각화입니다. 상세 정보는 아래 표를 확인하세요.
      </p>

      {/* 시각적 타임라인 — 장식/보조 표현이며 접근성 정보원은 아래 표 */}
      <div className={`mt-4 overflow-x-auto pb-2 ${styles.timelineScroll}`} aria-hidden="true">
        <div className="relative min-w-[720px]">
          <div className="relative h-6">
            {MINOR_TICKS.map((f) => (
              <div
                key={f}
                className="absolute top-2 h-2 w-px bg-[var(--dg-border-strong)]"
                style={{ left: `${framePct(f)}%` }}
              />
            ))}
            {MAJOR_TICKS.map((f) => (
              <div key={f} className="absolute top-0 h-4 w-px bg-[var(--dg-text-faint)]" style={{ left: `${framePct(f)}%` }}>
                <span className="absolute top-4 left-1 font-mono text-[10px] text-[var(--dg-text-faint)]">{f}</span>
              </div>
            ))}
          </div>

          <div className="relative mt-4 h-16 overflow-hidden rounded-md bg-[var(--dg-panel-raised)] ring-1 ring-[var(--dg-border)]">
            {SHOTS.map((shot) => {
              const { leftPct, widthPct } = shotPosition(shot);
              const meta = STATUS_META[shot.status];
              const dimmed = filter !== "all" && !activeShotSet.has(shot.code);
              return (
                <div
                  key={shot.code}
                  className={`absolute inset-y-1 rounded-sm border border-white/10 transition-opacity duration-300 ${meta.dot} ${
                    dimmed ? "opacity-15" : "opacity-90"
                  }`}
                  style={{ left: `${leftPct}%`, width: `calc(${widthPct}% - 2px)` }}
                />
              );
            })}
          </div>

          <div
            className="pointer-events-none absolute inset-y-0 flex flex-col items-center"
            style={{ left: `${framePct(PLAYHEAD_FRAME)}%` }}
          >
            <div className="h-full w-px bg-[var(--dg-amber)]" />
          </div>
          <span
            className="absolute -bottom-5 -translate-x-1/2 font-mono text-[10px] whitespace-nowrap text-[var(--dg-amber)]"
            style={{ left: `${framePct(PLAYHEAD_FRAME)}%` }}
          >
            리뷰 헤드 · {PLAYHEAD_FRAME}F
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="샷 상태 필터">
        {FILTERS.map((f) => {
          const pressed = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(f.id)}
              className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dg-amber)] ${
                pressed
                  ? "border-[var(--dg-amber)] bg-[var(--dg-amber-soft)] text-[var(--dg-amber)]"
                  : "border-[var(--dg-border)] text-[var(--dg-text-dim)] hover:border-[var(--dg-border-strong)] hover:text-[var(--dg-text)]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {filteredShots.length}개 샷 중 {SHOTS.length}개 표시됨, 필터: {FILTERS.find((f) => f.id === filter)?.label}
      </p>

      <div className="mt-4 overflow-x-auto rounded-lg border border-[var(--dg-border)]">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">SQ040_ICECAVE 시퀀스 샷 목록, {filteredShots.length}건 표시</caption>
          <thead>
            <tr className="border-b border-[var(--dg-border)] bg-[var(--dg-panel)] text-xs text-[var(--dg-text-dim)] uppercase">
              <th scope="col" className="px-4 py-3 font-medium">샷</th>
              <th scope="col" className="px-4 py-3 font-medium">프레임</th>
              <th scope="col" className="px-4 py-3 font-medium">상태</th>
              <th scope="col" className="px-4 py-3 font-medium">담당/노드</th>
            </tr>
          </thead>
          <tbody>
            {filteredShots.map((shot) => {
              const meta = STATUS_META[shot.status];
              const Icon = meta.Icon;
              return (
                <tr key={shot.code} className="border-b border-[var(--dg-border)] last:border-b-0 hover:bg-[var(--dg-panel)]">
                  <td className="px-4 py-3 font-mono text-[var(--dg-text)]">{shot.code}</td>
                  <td className="px-4 py-3 font-mono text-[var(--dg-text-dim)] tabular-nums">
                    {shot.start}–{shot.end} <span className="text-[var(--dg-text-faint)]">({shot.frames}f)</span>
                  </td>
                  <td className={`px-4 py-3 ${meta.text}`}>
                    <span className="inline-flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                      {meta.label}
                      {shot.status === "rendering" && typeof shot.progress === "number" && (
                        <span className="text-[var(--dg-text-faint)]">{shot.progress}%</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--dg-text-dim)]">
                    {shot.artist ?? shot.node ?? (shot.priority === "high" ? "우선순위 높음" : "—")}
                    {shot.note && <span className="ml-2 text-[var(--dg-red)]">{shot.note}</span>}
                  </td>
                </tr>
              );
            })}
            {filteredShots.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--dg-text-dim)]">
                  선택한 상태의 샷이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FarmPanel() {
  return (
    <div className="py-6">
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">렌더팜 큐</h2>
      <p className="mt-1 text-sm text-[var(--dg-text-dim)]">클러스터 8개 노드의 실시간 부하와 활성 렌더 잡입니다.</p>

      <h3 className="mt-6 text-sm font-semibold tracking-wide text-[var(--dg-text)] uppercase">노드별 GPU 사용률</h3>
      <div className="mt-3 flex h-40 items-end gap-3 rounded-lg border border-[var(--dg-border)] bg-[var(--dg-panel)] p-4">
        {NODE_LOADS.map((node, i) => {
          const tone = nodeTone(node.load);
          const color =
            tone === "red" ? "bg-[var(--dg-red)]" : tone === "amber" ? "bg-[var(--dg-amber)]" : "bg-[var(--dg-teal)]";
          return (
            <div key={node.id} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <span className="font-mono text-[11px] text-[var(--dg-text-dim)] tabular-nums">{node.load}%</span>
              <div
                className={`w-full rounded-t-sm ${color} ${styles.enter}`}
                style={{ height: `${node.load}%`, animationDelay: `${i * 60}ms` }}
              />
              <span className="font-mono text-[10px] text-[var(--dg-text-faint)]">{node.id}</span>
            </div>
          );
        })}
      </div>

      <h3 className="mt-8 text-sm font-semibold tracking-wide text-[var(--dg-text)] uppercase">활성 렌더 잡</h3>
      <div className="mt-3 overflow-x-auto rounded-lg border border-[var(--dg-border)]">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <caption className="sr-only">활성 렌더 잡 목록, {RENDER_JOBS.length}건</caption>
          <thead>
            <tr className="border-b border-[var(--dg-border)] bg-[var(--dg-panel)] text-xs text-[var(--dg-text-dim)] uppercase">
              <th scope="col" className="px-4 py-3 font-medium">잡 ID</th>
              <th scope="col" className="px-4 py-3 font-medium">샷</th>
              <th scope="col" className="px-4 py-3 font-medium">노드 / GPU</th>
              <th scope="col" className="px-4 py-3 font-medium">진행률</th>
              <th scope="col" className="px-4 py-3 font-medium">ETA</th>
              <th scope="col" className="px-4 py-3 font-medium">우선순위</th>
            </tr>
          </thead>
          <tbody>
            {RENDER_JOBS.map((job) => {
              const meta = STATUS_META[job.status];
              const Icon = meta.Icon;
              return (
                <tr key={job.id} className="border-b border-[var(--dg-border)] last:border-b-0 hover:bg-[var(--dg-panel)]">
                  <td className="px-4 py-3 font-mono text-[var(--dg-text)]">{job.id}</td>
                  <td className="px-4 py-3 font-mono text-[var(--dg-text-dim)]">{job.shot}</td>
                  <td className="px-4 py-3 text-[var(--dg-text-dim)]">
                    <div>{job.node}</div>
                    <div className="text-xs text-[var(--dg-text-faint)]">{job.gpu}</div>
                  </td>
                  <td className="px-4 py-3">
                    {job.progress === null ? (
                      <span className={`inline-flex items-center gap-1.5 ${meta.text}`}>
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                        {job.note}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 w-24 overflow-hidden rounded-full bg-[var(--dg-border)]"
                          role="progressbar"
                          aria-valuenow={job.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${job.id} 렌더 진행률`}
                        >
                          <div className={`h-full ${meta.dot}`} style={{ width: `${job.progress}%` }} />
                        </div>
                        <span className="font-mono text-xs text-[var(--dg-text-dim)] tabular-nums">{job.progress}%</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[var(--dg-text-dim)] tabular-nums">{job.eta}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium tracking-wide uppercase ${
                        job.priority === "high"
                          ? "text-[var(--dg-amber)]"
                          : job.priority === "low"
                            ? "text-[var(--dg-text-faint)]"
                            : "text-[var(--dg-text-dim)]"
                      }`}
                    >
                      {job.priority === "high" ? "높음" : job.priority === "low" ? "낮음" : "표준"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DailiesPanel() {
  const counts = useMemo(() => {
    const c = { approved: 0, rejected: 0, reviewing: 0, pending: 0 } as Record<string, number>;
    for (const item of REVIEW_ITEMS) c[item.status] += 1;
    return c;
  }, []);
  const total = REVIEW_ITEMS.length;

  return (
    <div className="py-6">
      <h2 className="text-lg font-semibold text-[var(--dg-text)]">데일리즈 리뷰</h2>
      <p className="mt-1 text-sm text-[var(--dg-text-dim)]">오늘 상영된 데일리즈 컷과 리뷰 결과입니다.</p>

      <h3 className="mt-6 text-sm font-semibold tracking-wide text-[var(--dg-text)] uppercase">리뷰 현황</h3>
      <div
        className="mt-3 flex h-3 overflow-hidden rounded-full bg-[var(--dg-border)]"
        role="img"
        aria-label={`전체 ${total}건 중 승인 ${counts.approved}건, 검토중 ${counts.reviewing}건, 대기 ${counts.pending}건, 반려 ${counts.rejected}건`}
      >
        <div className="h-full bg-[var(--dg-teal)]" style={{ width: `${(counts.approved / total) * 100}%` }} />
        <div className="h-full bg-[var(--dg-amber)]" style={{ width: `${(counts.reviewing / total) * 100}%` }} />
        <div className="h-full bg-[var(--dg-text-faint)]" style={{ width: `${(counts.pending / total) * 100}%` }} />
        <div className="h-full bg-[var(--dg-red)]" style={{ width: `${(counts.rejected / total) * 100}%` }} />
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--dg-text-dim)]">
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--dg-teal)]" aria-hidden />승인 {counts.approved}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--dg-amber)]" aria-hidden />검토중 {counts.reviewing}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--dg-text-faint)]" aria-hidden />대기 {counts.pending}
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--dg-red)]" aria-hidden />반려 {counts.rejected}
        </li>
      </ul>

      <h3 className="mt-8 text-sm font-semibold tracking-wide text-[var(--dg-text)] uppercase">오늘의 리뷰 큐</h3>
      <ul className="mt-3 space-y-2">
        {REVIEW_ITEMS.map((item, i) => {
          const meta = STATUS_META[item.status];
          const Icon = meta.Icon;
          return (
            <li
              key={`${item.shot}-${item.version}`}
              className={`flex flex-col gap-2 rounded-lg border border-[var(--dg-border)] bg-[var(--dg-panel)] p-4 sm:flex-row sm:items-center sm:justify-between ${styles.enter}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-[var(--dg-text-faint)] tabular-nums">{item.tc}</span>
                  <span className="font-mono text-sm font-medium text-[var(--dg-text)]">
                    {item.shot} <span className="text-[var(--dg-text-dim)]">{item.version}</span>
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--dg-text-dim)]">{item.note}</p>
                <p className="mt-1 text-xs text-[var(--dg-text-faint)]">리뷰어 · {item.reviewer}</p>
              </div>
              <span className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-[var(--dg-border)] px-3 py-1.5 text-xs font-medium sm:self-center ${meta.text}`}>
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {meta.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
