"use client";

import { AlertTriangle, Gauge, ListFilter } from "lucide-react";
import { CATEGORY_META, type Category, COUNT_FMT, REPORTS, REVIEWERS, WORKLOAD_CAPACITY, slaMinutesRemaining } from "./data";
import SparklineChart from "./SparklineChart";
import { BORDER, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHead, ProgressBar } from "./ui";

const OPEN_REPORTS = REPORTS.filter((r) => r.status !== "Resolved");
const SLA_BREACHES = OPEN_REPORTS.filter((r) => slaMinutesRemaining(r) < 0).length;
const RESOLVED_COUNT = REPORTS.length - OPEN_REPORTS.length;

const CATEGORY_COUNTS = (Object.keys(CATEGORY_META) as Category[]).map((id) => ({
  id,
  label: CATEGORY_META[id].label,
  Icon: CATEGORY_META[id].Icon,
  count: REPORTS.filter((r) => r.category === id).length,
}));

const WORKLOAD = REVIEWERS.map((name) => ({
  name,
  count: OPEN_REPORTS.filter((r) => r.assignedReviewer === name).length,
}));

/**
 * Left rail — queue health summary. The category chip row here is one independently-scoped
 * selection mechanism: clicking a chip narrows only the feed list and this rail's own active-chip
 * state. It never touches `selectedReportId` (the feed-item → detail-panel pin, owned by the feed
 * column) in either direction — see FeedColumn / DetailPanel for the other half of that pair.
 */
export default function QueueSummaryRail({ activeCategory, onCategoryChange }: { activeCategory: Category | "all"; onCategoryChange: (id: Category | "all") => void }) {
  const visibleCount = activeCategory === "all" ? REPORTS.length : CATEGORY_COUNTS.find((c) => c.id === activeCategory)?.count ?? 0;

  return (
    <div className="flex h-full min-w-0 flex-col gap-4 lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]">
      <Card>
        <CardHead title="Queue health" Icon={Gauge} hint="14-day volume of newly flagged content across the whole marketplace." />
        <div className="mt-3">
          <SparklineChart />
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 border-t pt-3 border-zinc-200">
          <div>
            <dt className={cx("text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Open reports</dt>
            <dd className={cx("mt-0.5 text-lg font-semibold", NUM, TEXT_PRIMARY)}>{COUNT_FMT.format(OPEN_REPORTS.length)}</dd>
          </div>
          <div>
            <dt className={cx("flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
              <AlertTriangle size={11} aria-hidden="true" className="text-red-700" />
              SLA breaches
            </dt>
            <dd className={cx("mt-0.5 text-lg font-semibold", NUM, SLA_BREACHES > 0 ? "text-red-700" : TEXT_PRIMARY)}>{COUNT_FMT.format(SLA_BREACHES)}</dd>
          </div>
        </dl>
      </Card>

      <Card padded={false} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="p-4 sm:p-5">
          <CardHead title="Filter by category" Icon={ListFilter} hint={`Showing ${COUNT_FMT.format(visibleCount)} of ${COUNT_FMT.format(REPORTS.length)} reports.`} />
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto border-t px-2 pb-2 [scrollbar-width:thin] border-zinc-200">
          <li>
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              aria-pressed={activeCategory === "all"}
              className={cx("mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TRANSITION, FOCUS, activeCategory === "all" ? "bg-green-50 font-semibold text-green-800" : cx("font-medium hover:bg-zinc-100", TEXT_PRIMARY))}
            >
              <span className="min-w-0 flex-1 truncate">All categories</span>
              <span className={cx("shrink-0 text-xs", NUM, TEXT_AUX)}>{REPORTS.length}</span>
            </button>
          </li>
          {CATEGORY_COUNTS.map((c) => {
            const active = activeCategory === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onCategoryChange(c.id)}
                  aria-pressed={active}
                  className={cx("mt-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm", TRANSITION, FOCUS, active ? "bg-green-50 font-semibold text-green-800" : cx("font-medium hover:bg-zinc-100", TEXT_PRIMARY))}
                >
                  <c.Icon size={15} aria-hidden="true" className={cx("shrink-0", active ? "text-green-700" : TEXT_AUX)} />
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  <span className={cx("shrink-0 text-xs", NUM, TEXT_AUX)}>{c.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <CardHead title="Reviewer workload" hint={`${COUNT_FMT.format(RESOLVED_COUNT)} resolved overall. Capacity shown against an ${WORKLOAD_CAPACITY}-report ceiling per reviewer.`} />
        <ul className="mt-3 flex flex-col gap-3">
          {WORKLOAD.map((w) => (
            <li key={w.name} className="flex items-center gap-2.5">
              <Avatar name={w.name} size={24} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={cx("truncate text-xs font-medium", TEXT_PRIMARY)}>{w.name}</span>
                  <span className={cx("shrink-0 text-xs", NUM, TEXT_AUX)}>
                    {w.count}/{WORKLOAD_CAPACITY}
                  </span>
                </div>
                <div className="mt-1">
                  <ProgressBar value={w.count} max={WORKLOAD_CAPACITY} label={`${w.name} open workload`} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className={cx("mt-3 border-t pt-3 text-[11px] font-normal leading-relaxed", BORDER, TEXT_AUX)}>
          {`Reviewer accuracy and handle-time averages are in the `}
          <a href="#audit-log" className={cx("font-medium underline", TEXT_PRIMARY, TRANSITION, FOCUS)}>
            decision audit log
          </a>
          {` below.`}
        </p>
      </Card>
    </div>
  );
}

