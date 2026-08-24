"use client";

import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  LifeBuoy,
  Mail,
  Minus,
  MoreHorizontal,
  Receipt,
  RotateCcw,
  StickyNote,
  UserRound,
} from "lucide-react";
import UsageChart from "./UsageChart";
import TicketLedger from "./TicketLedger";
import { Avatar, cx, FieldLabel, focusRing, Panel, RiskChip, Segment, tierOf } from "./ui";
import {
  krw,
  krwEok,
  monthLabels,
  num,
  pct,
  renewalLabel,
  vantageLabel,
  type Contract,
  type EventKind,
} from "./data";

/**
 * The detail pane — one contract, read from a movable point in time.
 *
 * The rail decides *which* contract; the scrubber below decides *when*, and it is the control that
 * carries the weight of the page. Moving it recomputes the usage cursor, the posture badge, the
 * four counters, the event window and the ticket ledger — all without touching the rail.
 */

const EVENT_META: Record<EventKind, { icon: typeof Activity; label: string; tone: string }> = {
  usage: { icon: Activity, label: "사용량", tone: "border-white/15 bg-white/[0.05] text-zinc-300" },
  support: {
    icon: LifeBuoy,
    label: "지원",
    tone: "border-rose-500/25 bg-rose-500/10 text-rose-300",
  },
  commercial: {
    icon: Receipt,
    label: "계약",
    tone: "border-white/15 bg-white/[0.05] text-zinc-300",
  },
  stakeholder: {
    icon: UserRound,
    label: "관계",
    tone: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  },
};

function Metric({
  label,
  value,
  delta,
  deltaUnit = "",
  adverse,
}: {
  label: string;
  value: string;
  delta: number | null;
  deltaUnit?: string;
  /** true when a rising number is the bad news (tickets), false when a falling one is (seats). */
  adverse: boolean;
}) {
  const rising = delta !== null && delta > 0;
  const falling = delta !== null && delta < 0;
  const bad = adverse ? rising : falling;
  const Icon = rising ? ArrowUp : falling ? ArrowDown : Minus;
  return (
    <div className="min-w-0 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
      <FieldLabel>{label}</FieldLabel>
      <p className="mt-1.5 text-[17px] font-semibold tabular-nums text-zinc-50">{value}</p>
      <p
        className={cx(
          "mt-0.5 flex items-center gap-1 text-[11px] tabular-nums",
          delta === null || delta === 0 ? "text-zinc-400" : bad ? "text-rose-300" : "text-zinc-300",
        )}
      >
        <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
        {delta === null
          ? "직전 달 없음"
          : delta === 0
            ? "직전 달과 동일"
            : `${delta > 0 ? "+" : "−"}${num(Math.abs(delta))}${deltaUnit} 직전 달 대비`}
      </p>
    </div>
  );
}

export default function DetailPane({
  contract,
  vantage,
  onVantage,
  onBack,
}: {
  contract: Contract;
  vantage: number;
  onVantage: (index: number) => void;
  onBack: () => void;
}) {
  const labels = monthLabels(contract);
  const last = labels.length - 1;
  const score = contract.risk[vantage];
  const tier = tierOf(score);
  const monthsToRenewal = last - vantage;

  const windowLow = Math.max(0, vantage - 2);
  const windowText =
    windowLow === vantage ? labels[vantage].long : `${labels[windowLow].long} – ${labels[vantage].long}`;
  const windowTickets = contract.ticketLog.filter(
    (ticket) => ticket.monthIndex >= windowLow && ticket.monthIndex <= vantage,
  );
  const windowEvents = contract.events
    .filter((event) => Math.abs(event.monthIndex - vantage) <= 2)
    .slice()
    .sort((a, b) => b.monthIndex - a.monthIndex);

  const delta = (series: number[]) => (vantage === 0 ? null : series[vantage] - series[vantage - 1]);
  const utilisationDelta =
    vantage === 0
      ? null
      : Math.round(contract.utilization[vantage] * 100) -
        Math.round(contract.utilization[vantage - 1] * 100);

  const arrDelta = contract.arr - contract.priorArr;

  return (
    <div className="@container flex min-h-0 flex-1 flex-col">
      {/* contract header */}
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              onClick={onBack}
              className={cx(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none lg:hidden",
                focusRing,
              )}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">갱신 목록으로 돌아가기</span>
            </button>
            <div className="min-w-0">
              <h2 id="detail-heading" className="truncate text-lg font-semibold text-zinc-50">
                {contract.company}
              </h2>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-400">
                <Segment>{contract.segment}</Segment>
                <span>{contract.plan}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                  갱신 {renewalLabel(contract)} (D-{contract.daysOut})
                </span>
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-2 @2xl:flex">
            <button
              type="button"
              className={cx(
                "inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              메모
            </button>
            <button
              type="button"
              className={cx(
                "inline-flex h-9 items-center gap-1.5 rounded-lg bg-rose-500 px-3 text-xs font-medium text-zinc-950 transition-colors duration-150 hover:bg-rose-400 motion-reduce:transition-none",
                focusRing,
              )}
            >
              갱신 제안 작성
            </button>
            <button
              type="button"
              className={cx(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-300 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">계약 추가 작업</span>
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* ── vantage scrubber ─────────────────────────────────────── */}
          <Panel className="col-span-12 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <FieldLabel>Vantage · 되짚는 시점</FieldLabel>
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-lg font-semibold text-zinc-50">
                    {labels[vantage].long}
                  </span>
                  <span className="text-sm tabular-nums text-zinc-400">
                    {vantageLabel(vantage)}
                    {monthsToRenewal > 0 ? ` · 갱신 ${monthsToRenewal}개월 전` : " · 갱신 당월"}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                    시점 리스크
                  </span>
                  <RiskChip tier={tier} score={score} />
                </span>
                <span className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onVantage(Math.max(0, vantage - 1))}
                    disabled={vantage === 0}
                    className={cx(
                      "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-transparent disabled:text-zinc-400 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">이전 달 시점으로</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onVantage(Math.min(last, vantage + 1))}
                    disabled={vantage === last}
                    className={cx(
                      "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:bg-transparent disabled:text-zinc-400 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">다음 달 시점으로</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onVantage(last)}
                    className={cx(
                      "inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs text-zinc-200 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    갱신 시점
                  </button>
                </span>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={last}
                step={1}
                value={vantage}
                onChange={(event) => onVantage(Number(event.target.value))}
                aria-label="계약 기간 안에서 되짚을 시점"
                aria-valuetext={`${labels[vantage].long}, ${vantageLabel(vantage)}`}
                className={cx(
                  "h-9 w-full cursor-pointer accent-rose-500",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400",
                )}
              />
              <div className="relative mx-2 h-4" aria-hidden="true">
                {labels.map((label, index) => {
                  const hasEvent = contract.events.some((event) => event.monthIndex === index);
                  return (
                    <span
                      key={label.long}
                      className={cx(
                        "absolute top-0 -translate-x-1/2 rounded-full",
                        hasEvent ? "h-1.5 w-1.5 bg-rose-400" : "h-1 w-1 bg-white/25",
                      )}
                      style={{ left: `${Math.round((index / last) * 10000) / 100}%` }}
                    />
                  );
                })}
              </div>
              <p className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[11px] tabular-nums text-zinc-400">
                <span>{labels[0].long} · T-12</span>
                <span className="text-rose-300">굵은 점 = 기록된 사건</span>
                <span>{labels[last].long} · 갱신</span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-2">
              <div className="col-span-12 min-w-0 @md:col-span-6 @2xl:col-span-3">
                <Metric
                  label="활성 좌석"
                  value={`${num(contract.active[vantage])}석`}
                  delta={delta(contract.active)}
                  deltaUnit="석"
                  adverse={false}
                />
              </div>
              <div className="col-span-12 min-w-0 @md:col-span-6 @2xl:col-span-3">
                <Metric
                  label="좌석 활용률"
                  value={pct(contract.utilization[vantage])}
                  delta={utilisationDelta}
                  deltaUnit="%p"
                  adverse={false}
                />
              </div>
              <div className="col-span-12 min-w-0 @md:col-span-6 @2xl:col-span-3">
                <Metric
                  label="주간 실행"
                  value={`${num(contract.runs[vantage])}회`}
                  delta={delta(contract.runs)}
                  deltaUnit="회"
                  adverse={false}
                />
              </div>
              <div className="col-span-12 min-w-0 @md:col-span-6 @2xl:col-span-3">
                <Metric
                  label="접수 티켓"
                  value={`${num(contract.ticketsByMonth[vantage])}건`}
                  delta={delta(contract.ticketsByMonth)}
                  deltaUnit="건"
                  adverse
                />
              </div>
            </div>
          </Panel>

          {/* ── usage chart ──────────────────────────────────────────── */}
          <Panel className="col-span-12 p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">좌석 소진 추이</h3>
              <p className="text-xs text-zinc-400">
                계약 기간 13개월 · 커서는 {labels[vantage].long}
              </p>
            </div>
            <UsageChart
              labels={labels}
              licensed={contract.licensed}
              active={contract.active}
              tickets={contract.ticketsByMonth}
              vantage={vantage}
              onVantage={onVantage}
            />
          </Panel>

          {/* ── what happened then ───────────────────────────────────── */}
          <Panel className="col-span-12 p-4 @2xl:col-span-7">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">그때 무슨 일이 있었나</h3>
              <p className="text-xs text-zinc-400">{windowText} 전후</p>
            </div>
            {windowEvents.length === 0 ? (
              <p className="rounded-lg border border-dashed border-white/15 px-4 py-8 text-center text-sm text-zinc-300">
                이 시점 전후에 기록된 사건이 없습니다.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {windowEvents.map((event) => {
                  const meta = EVENT_META[event.kind];
                  const Icon = meta.icon;
                  const current = event.monthIndex === vantage;
                  return (
                    <li
                      key={`${event.monthIndex}-${event.title}`}
                      className={cx(
                        "rounded-lg border px-3 py-2.5",
                        current
                          ? "border-rose-500/25 bg-rose-500/[0.07]"
                          : "border-white/10 bg-white/[0.02]",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cx(
                            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium",
                            meta.tone,
                          )}
                        >
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {meta.label}
                        </span>
                        <span className="text-[11px] tabular-nums text-zinc-400">
                          {labels[event.monthIndex].long} · {vantageLabel(event.monthIndex)}
                        </span>
                        {current && (
                          <span className="text-[11px] font-medium text-rose-300">현재 시점</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm font-medium break-keep text-zinc-50">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs break-keep text-zinc-400">{event.note}</p>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          {/* ── commercial terms ─────────────────────────────────────── */}
          <Panel className="col-span-12 p-4 @2xl:col-span-5">
            <h3 className="mb-3 text-sm font-semibold text-zinc-100">계약 조건과 담당</h3>
            <div className="grid grid-cols-12 gap-x-4 gap-y-3">
              <div className="col-span-6 min-w-0">
                <FieldLabel>계약 ARR</FieldLabel>
                <p className="mt-1 text-sm font-semibold tabular-nums text-zinc-50">
                  {krw(contract.arr)}
                </p>
              </div>
              <div className="col-span-6 min-w-0">
                <FieldLabel>직전 기간</FieldLabel>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-1.5 text-sm tabular-nums text-zinc-300">
                  {krwEok(contract.priorArr)}
                  <span
                    className={cx(
                      "inline-flex items-baseline gap-0.5 text-[11px]",
                      arrDelta >= 0 ? "text-zinc-300" : "text-rose-300",
                    )}
                  >
                    {arrDelta >= 0 ? (
                      <ArrowUp className="h-3 w-3 self-center" aria-hidden="true" />
                    ) : (
                      <ArrowDown className="h-3 w-3 self-center" aria-hidden="true" />
                    )}
                    {arrDelta >= 0 ? "+" : "−"}
                    {Math.abs(Math.round((arrDelta / contract.priorArr) * 1000) / 10)}%
                  </span>
                </p>
              </div>
              <div className="col-span-6 min-w-0">
                <FieldLabel>좌석 단가</FieldLabel>
                <p className="mt-1 text-sm tabular-nums text-zinc-100">
                  {krw(contract.unitPrice)}
                </p>
                <p className="mt-0.5 text-[11px] tabular-nums text-zinc-400">
                  직전 {krw(contract.priorUnitPrice)}
                </p>
              </div>
              <div className="col-span-6 min-w-0">
                <FieldLabel>{labels[vantage].long} 좌석</FieldLabel>
                <p className="mt-1 text-sm tabular-nums text-zinc-100">
                  {num(contract.active[vantage])} / {num(contract.licensed[vantage])}석
                </p>
                <p className="mt-0.5 text-[11px] tabular-nums text-zinc-400">
                  미사용 {num(contract.licensed[vantage] - contract.active[vantage])}석
                </p>
              </div>
              <div className="col-span-12 min-w-0">
                <FieldLabel>계약 기간 누적 티켓</FieldLabel>
                <p className="mt-1 text-sm tabular-nums text-zinc-100">
                  {num(contract.ticketLog.length)}건
                  <span className="ml-1.5 text-[11px] text-zinc-400">
                    미해결{" "}
                    {num(contract.ticketLog.filter((ticket) => ticket.status !== "해결").length)}건
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5">
              <Avatar initials={contract.ownerInitials} tone="accent" />
              <div className="min-w-0">
                <p className="truncate text-sm text-zinc-100">{contract.ownerName}</p>
                <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-zinc-400">
                  <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {contract.ownerEmail}
                </p>
              </div>
            </div>
          </Panel>

          {/* ── support ledger ───────────────────────────────────────── */}
          <Panel className="col-span-12 p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-100">지원 티켓</h3>
              <p className="text-xs text-zinc-400">
                {windowText} · {num(windowTickets.length)}건
              </p>
            </div>
            <TicketLedger tickets={windowTickets} labels={labels} windowText={windowText} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
