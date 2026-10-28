"use client";

import { AlertCircle, AlertOctagon, AlertTriangle, ArrowUpCircle, CheckCircle2, Circle, Eye, Info, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { CATEGORY_META, CONTENT_TYPE_META, type QueueScope, QUEUE_SCOPE_OPTIONS, type Report, type SortKey, SORT_OPTIONS, formatRelative, formatSla } from "./data";
import { BORDER, FOCUS, NUM, type Severity, type Status, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHead, Segmented, SeverityBadge, StatusBadge } from "./ui";

const SEVERITY_ICON: Record<Severity, LucideIcon> = { Critical: AlertOctagon, High: AlertTriangle, Medium: AlertCircle, Low: Info };
const STATUS_ICON: Record<Status, LucideIcon> = { New: Circle, "In Review": Eye, Escalated: ArrowUpCircle, Resolved: CheckCircle2 };

function FeedItem({ report, selected, onSelect }: { report: Report; selected: boolean; onSelect: (id: string) => void }) {
  const category = CATEGORY_META[report.category];
  const content = CONTENT_TYPE_META[report.contentType];
  const SeverityIcon = SEVERITY_ICON[report.severity];
  const StatusIcon = STATUS_ICON[report.status];
  const sla = formatSla(report);
  const overdue = sla.startsWith("Overdue");

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(report.id)}
        aria-current={selected ? "true" : undefined}
        className={cx(
          "flex w-full flex-col gap-2 rounded-lg border px-3 py-3 text-left",
          TRANSITION,
          FOCUS,
          selected ? "border-green-300 bg-green-50" : cx(BORDER, "bg-white hover:bg-zinc-50"),
        )}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={report.severity} Icon={SeverityIcon} />
          <StatusBadge status={report.status} Icon={StatusIcon} />
          <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", BORDER, "bg-zinc-100", TEXT_AUX)}>
            <category.Icon size={11} aria-hidden="true" />
            {category.label}
          </span>
          <span className={cx("ml-auto shrink-0 whitespace-nowrap text-[11px] font-semibold", NUM, overdue ? "text-red-700" : TEXT_AUX)}>{sla}</span>
        </div>

        <p className={cx("line-clamp-2 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{report.title}</p>
        <p className={cx("line-clamp-2 text-xs font-normal leading-relaxed", TEXT_AUX)}>{report.snippet}</p>

        <div className="flex items-center gap-2 pt-0.5">
          <Avatar name={report.actorName} size={20} />
          <span className={cx("min-w-0 truncate text-xs font-medium", TEXT_PRIMARY)}>{report.actorName}</span>
          <span className={cx("shrink-0 text-xs font-normal", TEXT_AUX)} aria-hidden="true">
            ·
          </span>
          <span className={cx("flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-normal", TEXT_AUX)}>
            <content.Icon size={11} aria-hidden="true" />
            {content.label}
          </span>
          <span className={cx("ml-auto shrink-0 whitespace-nowrap text-xs font-normal", NUM, TEXT_AUX)}>{formatRelative(report.receivedMinutesAgo)}</span>
        </div>
      </button>
    </li>
  );
}

export default function FeedColumn({
  reports,
  totalCount,
  selectedId,
  onSelect,
  scope,
  onScopeChange,
  sort,
  onSortChange,
  query,
  onQueryChange,
}: {
  reports: Report[];
  totalCount: number;
  selectedId: string;
  onSelect: (id: string) => void;
  scope: QueueScope;
  onScopeChange: (scope: QueueScope) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  query: string;
  onQueryChange: (q: string) => void;
}) {
  return (
    <Card padded={false} className="flex h-full min-w-0 flex-col overflow-hidden">
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <CardHead
          title="Review queue"
          hint="The flagged-content stream — every open and resolved report, newest activity first by default."
          action={<Segmented ariaLabel="Queue view" value={scope} onChange={onScopeChange} options={QUEUE_SCOPE_OPTIONS} />}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className={cx("flex h-9 min-w-[180px] flex-1 items-center gap-2 rounded-lg border px-2.5", BORDER, "bg-zinc-50")}>
            <Search size={14} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Search reports by title or reported account</span>
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search by title or account…"
              className={cx("h-full min-w-0 flex-1 bg-transparent text-sm font-normal outline-none", TEXT_PRIMARY, "placeholder:text-zinc-500")}
            />
          </label>
          <Segmented ariaLabel="Sort queue" value={sort} onChange={onSortChange} options={SORT_OPTIONS} />
        </div>
      </div>

      <div className={cx("flex items-center justify-between border-t px-4 py-2 sm:px-5", BORDER, "bg-zinc-50")}>
        <span className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
          Showing <span className={NUM}>{reports.length}</span> of <span className={NUM}>{totalCount}</span> reports
        </span>
      </div>

      <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4 [scrollbar-width:thin]">
        {reports.map((r) => (
          <FeedItem key={r.id} report={r} selected={r.id === selectedId} onSelect={onSelect} />
        ))}
        {reports.length === 0 ? <li className={cx("py-10 text-center text-sm font-normal", TEXT_AUX)}>No reports match the current filters.</li> : null}
      </ul>
    </Card>
  );
}
