"use client";

/**
 * 피드의 한 항목. 제자리에서 펼쳐지고(accordion-in-feed), 결정을 내리면 접힌다.
 * 상세를 보려고 다른 페인으로 눈이 이동하지 않는다.
 */

import {
  Ban,
  Check,
  ChevronDown,
  CircleUser,
  Clock,
  FileText,
  Flame,
  MessageSquare,
  RotateCcw,
  Shield,
  ShieldAlert,
  Store,
  TriangleAlert,
  Video,
} from "lucide-react";
import {
  DECISION_META,
  PERIOD_LABELS,
  PERIOD_TICKS,
  REASON_META,
  SEVERITY_META,
  SURFACE_META,
  formatMinutes,
  numberFormat,
  type DecisionKind,
  type PeriodKey,
  type ReviewItem,
  type SurfaceKind,
} from "./data";
import { EvidenceTabs, IntakeChart, PolicyNote, ReasonBreakdown } from "./Evidence";
import { Avatar, Badge, FieldLabel, FOCUS, SlaMeter, cn } from "./ui";

const SURFACE_ICON: Record<SurfaceKind, typeof FileText> = {
  post: FileText,
  comment: MessageSquare,
  profile: CircleUser,
  listing: Store,
  clip: Video,
};

const SEVERITY_ICON = { high: Flame, medium: TriangleAlert, low: Shield } as const;

const DECISION_ICON: Record<DecisionKind, typeof Check> = {
  keep: Check,
  remove: Ban,
  escalate: ShieldAlert,
};

const POLICY_NOTE: Record<string, string> = {
  "CS-4736":
    "위기 대응 정책 적용 대상 — 어떤 결정을 내리든 작성자에게 지원 리소스 안내가 자동 발송되며, 삭제 여부와 무관하게 위기 대응 팀에 사본이 남습니다.",
  "CS-4796":
    "브랜드 사칭 건은 결정 즉시 도메인 차단 목록에 반영됩니다. 되돌리려면 상급 검토가 필요합니다.",
};

export function ReviewCard({
  item,
  decision,
  expanded,
  period,
  onToggle,
  onDecide,
  onUndo,
  onRegister,
}: {
  item: ReviewItem;
  decision: DecisionKind | null;
  expanded: boolean;
  period: PeriodKey;
  onToggle: (id: string) => void;
  onDecide: (id: string, kind: DecisionKind) => void;
  onUndo: (id: string) => void;
  onRegister: (id: string, node: HTMLButtonElement | null) => void;
}) {
  const SurfaceIcon = SURFACE_ICON[item.surface];
  const SeverityIcon = SEVERITY_ICON[item.severity];
  const severity = SEVERITY_META[item.severity];
  const urgent = item.slaMinutes <= 60;
  const headingId = `${item.id}-heading`;
  const panelId = `${item.id}-panel`;
  const topReason = item.reasons[0];
  const policy = POLICY_NOTE[item.id];

  return (
    <article
      className={cn(
        "col-span-12 min-w-0 overflow-hidden rounded-xl border bg-white transition-colors motion-reduce:transition-none",
        expanded
          ? "border-violet-300 shadow-[0_6px_24px_rgba(24,24,27,0.08)]"
          : "border-zinc-200 shadow-[0_1px_2px_rgba(24,24,27,0.04)]",
      )}
    >
      <h3 className="min-w-0">
        <button
          type="button"
          id={headingId}
          ref={(node) => {
            onRegister(item.id, node);
          }}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(item.id)}
          className={cn(
            "grid w-full grid-cols-12 items-start gap-x-4 gap-y-3 p-4 text-left transition-colors hover:bg-zinc-50 motion-reduce:transition-none sm:p-5",
            FOCUS,
          )}
        >
          {/* 본문 */}
          <span className="col-span-12 flex min-w-0 gap-3 lg:col-span-8">
            <ChevronDown
              className={cn(
                "mt-1 h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 motion-reduce:transition-none",
                expanded && "rotate-180",
              )}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                <Badge icon={SeverityIcon} className={cn("ring-1 ring-inset", severity.chip)}>
                  심각도 {severity.label}
                </Badge>
                <Badge icon={SurfaceIcon}>{SURFACE_META[item.surface]}</Badge>
                <span className="text-xs tabular-nums text-zinc-500">{item.id}</span>
                {decision ? (
                  <Badge
                    icon={DECISION_ICON[decision]}
                    className={cn("ring-1 ring-inset", DECISION_META[decision].chip)}
                  >
                    {DECISION_META[decision].label}
                  </Badge>
                ) : null}
              </span>
              <span className="mt-2 block text-[15px] font-medium leading-6 text-zinc-900">
                {item.headline}
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Avatar name={item.authorName} tint={item.authorTint} size="sm" />
                  <span className="text-zinc-700">{item.authorName}</span>
                  <span className="hidden sm:inline">{item.authorHandle}</span>
                </span>
                <span aria-hidden>·</span>
                <span>{item.queuedLabel}</span>
                <span aria-hidden>·</span>
                <span>자동 분류 신뢰도 <span className="tabular-nums text-zinc-700">{item.classifier}</span></span>
              </span>
            </span>
          </span>

          {/* 신고 요약 — hover 이전에도 읽히는 상시 수치 */}
          <span className="col-span-12 flex min-w-0 flex-col gap-2 lg:col-span-4 lg:items-end">
            <span className="flex w-full items-baseline justify-between gap-3 lg:justify-end">
              <FieldLabel>누적 신고</FieldLabel>
              <span className="text-lg font-medium tabular-nums leading-none text-zinc-900">
                {numberFormat.format(item.reports)}
                <span className="ml-1 text-xs text-zinc-500">건</span>
              </span>
            </span>
            <span className="flex h-2 w-full overflow-hidden rounded-full bg-zinc-100">
              {item.reasons.map((slice) => (
                <span
                  key={slice.key}
                  className={cn("block h-full", REASON_META[slice.key].fill)}
                  style={{ width: `${Math.round((slice.count / item.reports) * 10000) / 100}%` }}
                />
              ))}
            </span>
            <span className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-zinc-500">
              <span>
                최다 <span className="text-zinc-700">{REASON_META[topReason.key].label}</span>{" "}
                <span className="tabular-nums text-zinc-700">
                  {Math.round((topReason.count / item.reports) * 100)}%
                </span>
              </span>
              <span className={cn("flex items-center gap-1", urgent ? "text-violet-800" : "text-zinc-500")}>
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                SLA 잔여 <span className="tabular-nums">{formatMinutes(item.slaMinutes)}</span>
              </span>
            </span>
          </span>
        </button>
      </h3>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <SlaMeter remaining={item.slaMinutes} budget={item.slaBudget} urgent={urgent} />
      </div>

      {expanded ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headingId}
          className="border-t border-zinc-200 bg-zinc-50/60"
        >
          <div className="grid grid-cols-12 gap-4 p-4 sm:p-5">
            <div className="col-span-12 min-w-0 rounded-lg border border-zinc-200 bg-white p-4">
              <FieldLabel>신고된 콘텐츠</FieldLabel>
              <blockquote className="mt-2 border-l-2 border-violet-300 pl-3 text-sm leading-6 text-zinc-700">
                {item.excerpt}
              </blockquote>
            </div>

            {policy ? (
              <div className="col-span-12 min-w-0">
                <PolicyNote text={policy} />
              </div>
            ) : null}

            <div className="col-span-12 min-w-0 rounded-lg border border-zinc-200 bg-white p-4 xl:col-span-7">
              <IntakeChart
                values={item.series[period]}
                ticks={PERIOD_TICKS[period]}
                periodLabel={PERIOD_LABELS[period]}
              />
            </div>
            <div className="col-span-12 min-w-0 rounded-lg border border-zinc-200 bg-white p-4 xl:col-span-5">
              <ReasonBreakdown reasons={item.reasons} total={item.reports} />
            </div>

            <div className="col-span-12 min-w-0 rounded-lg border border-zinc-200 bg-white p-4">
              <EvidenceTabs similar={item.similar} history={item.history} signals={item.signals} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-white px-4 py-4 sm:px-5">
            <p className="text-xs text-zinc-600">
              결정하면 이 건은 접히고 상단 요약이 다시 계산되며 다음 미결 건으로 이동합니다.
            </p>
            {decision ? (
              <div className="flex flex-wrap items-center gap-3">
                <Badge
                  icon={DECISION_ICON[decision]}
                  className={cn("ring-1 ring-inset", DECISION_META[decision].chip)}
                >
                  {DECISION_META[decision].label} 처리됨
                </Badge>
                <button
                  type="button"
                  onClick={() => onUndo(item.id)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 motion-reduce:transition-none",
                    FOCUS,
                  )}
                >
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  결정 되돌리기
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <DecisionButton kind="keep" onDecide={onDecide} id={item.id} />
                <DecisionButton kind="escalate" onDecide={onDecide} id={item.id} />
                <DecisionButton kind="remove" onDecide={onDecide} id={item.id} />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function DecisionButton({
  kind,
  id,
  onDecide,
}: {
  kind: DecisionKind;
  id: string;
  onDecide: (id: string, kind: DecisionKind) => void;
}) {
  const Icon = DECISION_ICON[kind];
  const primary = kind === "remove";
  return (
    <button
      type="button"
      onClick={() => onDecide(id, kind)}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors motion-reduce:transition-none",
        FOCUS,
        primary
          ? "bg-violet-600 text-white hover:bg-violet-700"
          : kind === "escalate"
            ? "border border-violet-300 bg-white text-violet-800 hover:bg-violet-50"
            : "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {DECISION_META[kind].label}
    </button>
  );
}
