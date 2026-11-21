"use client";

import {
  FileText,
  Pin,
  Repeat,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { CohortTable } from "./cohort-table";
import {
  PERIOD_OPTIONS,
  STAGES,
  formatInt,
  getCohorts,
  getFunnelView,
  getKpis,
  type Period,
  type StageId,
} from "./data";
import { Badge, Card, CardHeader, FOCUS_RING, Progress, SegmentedControl, Sparkline, Tabs } from "./ui";

const STAGE_ICONS: Record<string, typeof Users> = {
  users: Users,
  userPlus: UserPlus,
  fileText: FileText,
  shoppingCart: ShoppingCart,
  repeat: Repeat,
};

export function FunnelConsole({
  period,
  onPeriodChange,
  pinnedId,
  onPinStage,
}: {
  period: Period;
  onPeriodChange: (p: Period) => void;
  pinnedId: StageId;
  onPinStage: (id: StageId) => void;
}) {
  const [hoveredId, setHoveredId] = useState<StageId | null>(null);
  const [cohortView, setCohortView] = useState<"week" | "channel">(
    pinnedId === "visitors" ? "channel" : "week",
  );

  // `pinnedId` is owned by the parent and can change from more than one place
  // (this console's own pin button, or the command palette's "Pin funnel
  // stage" action, which sets it directly). Resetting `cohortView` here
  // during render — rather than in a reactive effect — keeps it in sync with
  // `pinnedId` regardless of which caller changed it, while still letting
  // the Tabs control below override it locally afterward.
  const [prevPinnedId, setPrevPinnedId] = useState(pinnedId);
  if (pinnedId !== prevPinnedId) {
    setPrevPinnedId(pinnedId);
    setCohortView(pinnedId === "visitors" ? "channel" : "week");
  }

  const funnel = useMemo(() => getFunnelView(period), [period]);
  const kpis = useMemo(() => getKpis(period), [period]);
  const pinnedStage = STAGES.find((s) => s.id === pinnedId) ?? STAGES[0];
  const cohorts = useMemo(() => getCohorts(period, pinnedId), [period, pinnedId]);
  const rows = cohortView === "week" ? cohorts.byWeek : cohorts.byChannel;

  return (
    <div className="grid grid-cols-12 gap-4">
      <header className="col-span-12 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1
            id="funnel-heading"
            className="truncate text-xl font-semibold text-zinc-50 font-[family-name:var(--font-display-mono)]"
          >
            Buyer Activation Funnel
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            From first visit to repeat purchase across the wholesale marketplace.
          </p>
        </div>
      </header>

      <div className="col-span-12 grid grid-cols-12 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="col-span-6 min-w-0 lg:col-span-3">
            <Card className="h-full">
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-zinc-400">{kpi.label}</p>
              <div className="mt-1.5 flex items-end justify-between gap-2">
                <span className="truncate text-xl font-semibold tabular-nums text-zinc-50">{kpi.value}</span>
                <span className="flex-shrink-0 text-violet-400">
                  <Sparkline values={kpi.series} />
                </span>
              </div>
              <p className="mt-1 truncate text-[11px] text-zinc-400">{kpi.caption}</p>
            </Card>
          </div>
        ))}
      </div>

      <div className="col-span-12 min-w-0">
        <Card>
          <CardHeader
            title="Conversion Funnel"
            caption="Every count and drop-off percentage is permanent — hover or focus a stage for the exact figures."
            action={
              <SegmentedControl aria-label="Funnel period" options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} />
            }
          />
          <ul className="flex flex-col gap-2">
            {funnel.map((view, i) => {
              const Icon = STAGE_ICONS[view.stage.icon];
              const isPinned = pinnedId === view.stage.id;
              const isHovered = hoveredId === view.stage.id;
              const prevWidth = i === 0 ? view.widthPct : funnel[i - 1].widthPct;
              const topHalf = prevWidth / 2;
              const botHalf = view.widthPct / 2;
              const prevCount = i === 0 ? null : funnel[i - 1].count;
              const lost = prevCount !== null ? prevCount - view.count : null;

              return (
                <li key={view.stage.id} className="relative">
                  <button
                    type="button"
                    onClick={() => onPinStage(view.stage.id)}
                    onMouseEnter={() => setHoveredId(view.stage.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setHoveredId(view.stage.id)}
                    onBlur={() => setHoveredId(null)}
                    aria-pressed={isPinned}
                    aria-describedby={isHovered ? `tooltip-${view.stage.id}` : undefined}
                    className={`${FOCUS_RING} flex w-full items-center gap-3 rounded-xl border p-3 text-left motion-safe:transition-colors sm:gap-4 ${
                      isPinned
                        ? "border-violet-400/50 bg-violet-500/[0.08]"
                        : "border-white/10 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                      <Icon size={16} aria-hidden="true" />
                    </span>

                    <span className="relative hidden h-12 w-24 flex-shrink-0 sm:block md:w-36" aria-hidden="true">
                      <span
                        className="absolute inset-y-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-violet-400/80 to-violet-500/60"
                        style={{
                          width: "100%",
                          clipPath: `polygon(${round2(50 - topHalf)}% 0%, ${round2(50 + topHalf)}% 0%, ${round2(50 + botHalf)}% 100%, ${round2(50 - botHalf)}% 100%)`,
                        }}
                      />
                      {isHovered ? (
                        <span
                          className="absolute inset-y-0 w-px bg-violet-100"
                          style={{ left: `${round2(50 + botHalf)}%` }}
                        />
                      ) : null}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-zinc-50">{view.stage.name}</span>
                      <span className="mt-0.5 hidden truncate text-xs text-zinc-400 sm:block">
                        {view.stage.description}
                      </span>
                    </span>

                    <span className="flex-shrink-0 text-right">
                      <span className="block text-lg font-semibold tabular-nums text-zinc-50">
                        {formatInt(view.count)}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center justify-end gap-1">
                        {i === 0 ? (
                          <Badge tone="neutral">Top of funnel</Badge>
                        ) : (
                          <>
                            <Badge tone="positive" icon={<TrendingUp size={11} aria-hidden="true" />}>
                              {view.convFromPrev?.toFixed(1)}%
                            </Badge>
                            <Badge tone="warning" icon={<TrendingDown size={11} aria-hidden="true" />}>
                              {view.dropFromPrev?.toFixed(1)}% drop
                            </Badge>
                          </>
                        )}
                      </span>
                    </span>

                    <span
                      className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full motion-safe:transition-colors ${
                        isPinned ? "bg-violet-500 text-white" : "bg-white/5 text-zinc-400"
                      }`}
                    >
                      <Pin size={13} aria-hidden="true" />
                      <span className="sr-only">{isPinned ? "Pinned" : "Pin this stage"}</span>
                    </span>
                  </button>

                  {isHovered ? (
                    <div
                      id={`tooltip-${view.stage.id}`}
                      role="status"
                      className="absolute left-3 right-3 top-full z-20 mt-1.5 rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-xs text-zinc-300 shadow-xl shadow-black/40 motion-safe:animate-[rise_0.12s_ease-out]"
                    >
                      <span className="font-medium text-zinc-100">{formatInt(view.count)} accounts</span> at{" "}
                      {view.stage.name.toLowerCase()}
                      {lost !== null ? (
                        <>
                          {" "}
                          · <span className="text-amber-300">{formatInt(lost)} lost</span> vs{" "}
                          {funnel[i - 1].stage.name.toLowerCase()}
                        </>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div id="cohort-section" className="col-span-12 min-w-0 scroll-mt-4">
        <Card>
          <CardHeader
            title={`Cohort Breakdown — ${pinnedStage.name}`}
            caption={`Pinned stage. Rows advance to “${pinnedStage.nextLabel}.” Switch the grouping with the tabs below.`}
          />
          <Tabs
            aria-label="Cohort grouping"
            options={[
              { id: "channel", label: "By Channel" },
              { id: "week", label: "By Signup Week" },
            ]}
            value={cohortView}
            onChange={setCohortView}
          />
          <div
            className="mt-4"
            role="tabpanel"
            aria-label={cohortView === "channel" ? "By Channel" : "By Signup Week"}
          >
            <CohortTable
              rows={rows}
              rowLabelHeader={cohortView === "week" ? "Cohort Week" : "Channel"}
              advancedHeader={pinnedStage.nextLabel}
              caption={`Cohort breakdown of ${pinnedStage.name} by ${cohortView === "week" ? "signup week" : "channel"}, showing accounts entered, accounts that advanced to ${pinnedStage.nextLabel}, conversion rate, lead account, and signal.`}
            />
          </div>
          <div className="mt-4 grid grid-cols-12 gap-3 border-t border-white/10 pt-4">
            <div className="col-span-12 min-w-0 sm:col-span-6">
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">Stage conversion</p>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={rows.reduce((a, r) => a + r.advanced, 0) / Math.max(rows.reduce((a, r) => a + r.entered, 0), 1) * 100} />
                <span className="flex-shrink-0 text-xs tabular-nums text-zinc-300">
                  {((rows.reduce((a, r) => a + r.advanced, 0) / Math.max(rows.reduce((a, r) => a + r.entered, 0), 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
