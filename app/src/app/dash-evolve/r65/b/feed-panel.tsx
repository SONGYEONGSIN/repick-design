"use client";

import { useMemo, useState } from "react";
import {
  ShoppingBag,
  MessageCircle,
  Mail,
  Check,
  Ban,
  ArrowUpCircle,
  ChevronDown,
  Users,
  Clock,
} from "lucide-react";
import { FOCUS_RING } from "./ui";
import {
  CATEGORY_LABEL,
  SEVERITY_LABEL,
  SLA_TARGET_MINUTES,
  formatMinutes,
  type FeedItem,
  type Severity,
} from "./data";

type SeverityFilter = Severity | "all";

const TYPE_META: Record<FeedItem["type"], { icon: typeof ShoppingBag; label: string }> = {
  listing: { icon: ShoppingBag, label: "Listing" },
  post: { icon: MessageCircle, label: "Post" },
  message: { icon: Mail, label: "Message" },
};

function SeverityBadge({ severity }: { severity: Severity }) {
  const classes: Record<Severity, string> = {
    critical: "bg-orange-700 text-white",
    high: "bg-orange-100 text-orange-800",
    medium: "bg-zinc-100 text-zinc-700",
    low: "border border-zinc-200 bg-white text-zinc-600",
  };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${classes[severity]}`}>
      {SEVERITY_LABEL[severity]}
    </span>
  );
}

function ResultBadge({ status }: { status: FeedItem["status"] }) {
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Approved
      </span>
    );
  }
  if (status === "removed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-800">
        <Ban className="h-3.5 w-3.5" aria-hidden="true" />
        Removed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-700 px-2.5 py-1 text-xs font-medium text-white">
      <ArrowUpCircle className="h-3.5 w-3.5" aria-hidden="true" />
      Escalated
    </span>
  );
}

interface FeedItemCardProps {
  item: FeedItem;
  compact: boolean;
  onAction: (id: string, status: "approved" | "removed" | "escalated") => void;
}

function FeedItemCard({ item, compact, onAction }: FeedItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const TypeIcon = TYPE_META[item.type].icon;
  const slaTarget = SLA_TARGET_MINUTES[item.severity];
  const breached = item.status === "pending" && item.queueMinutes > slaTarget;
  const detailId = `detail-${item.id}`;

  return (
    <li>
      <article
        className={`rounded-lg border bg-white ${compact ? "p-3" : "p-4"} ${
          item.status === "pending" ? "border-zinc-200" : "border-zinc-200 bg-zinc-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500"
            aria-hidden="true"
          >
            <TypeIcon className="h-5 w-5" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-mono text-xs text-zinc-500">{item.id}</span>
              <span className="text-xs text-zinc-500">{TYPE_META[item.type].label}</span>
              <SeverityBadge severity={item.severity} />
              {breached && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-800">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  SLA breached
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={detailId}
              className={`mt-1.5 flex w-full items-center gap-1.5 rounded text-left ${FOCUS_RING}`}
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900">{item.title}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            <p className={`mt-1 text-sm text-zinc-600 ${expanded ? "" : "line-clamp-2"}`}>{item.snippet}</p>

            {expanded && (
              <div id={detailId} className="mt-2.5 space-y-2 border-t border-zinc-100 pt-2.5">
                <div className="flex flex-wrap gap-1.5">
                  {item.flagReasons.map((reason) => (
                    <span key={reason} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700">
                      {reason}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  Category: <span className="text-zinc-700">{CATEGORY_LABEL[item.category]}</span> · SLA target{" "}
                  <span className="tabular-nums text-zinc-700">{formatMinutes(slaTarget)}</span>
                </p>
              </div>
            )}

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">{item.reporterCount}</span> reporter{item.reporterCount === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {item.status === "pending" ? (
                  <>
                    in queue <span className="tabular-nums">{formatMinutes(item.queueMinutes)}</span>
                  </>
                ) : (
                  <>
                    decided in <span className="tabular-nums">{formatMinutes(item.queueMinutes)}</span>
                  </>
                )}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {item.status === "pending" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onAction(item.id, "approved")}
                    className={`flex h-9 items-center gap-1.5 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50 ${FOCUS_RING}`}
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction(item.id, "removed")}
                    className={`flex h-9 items-center gap-1.5 rounded-md border border-orange-700 px-3 text-xs font-medium text-orange-700 hover:bg-orange-50 ${FOCUS_RING}`}
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction(item.id, "escalated")}
                    className={`flex h-9 items-center gap-1.5 rounded-md bg-orange-700 px-3 text-xs font-medium text-white hover:bg-orange-800 ${FOCUS_RING}`}
                  >
                    <ArrowUpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    Escalate
                  </button>
                </>
              ) : (
                <ResultBadge status={item.status} />
              )}
            </div>
          </div>
        </div>
      </article>
    </li>
  );
}

interface FeedPanelProps {
  items: FeedItem[];
  compact: boolean;
  severityFilter: SeverityFilter;
  onSeverityFilterChange: (f: SeverityFilter) => void;
  onAction: (id: string, status: "approved" | "removed" | "escalated") => void;
}

const FILTER_OPTIONS: { key: SeverityFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export function FeedPanel({ items, compact, severityFilter, onSeverityFilterChange, onAction }: FeedPanelProps) {
  const counts = useMemo(() => {
    const c: Record<SeverityFilter, number> = { all: items.length, critical: 0, high: 0, medium: 0, low: 0 };
    for (const item of items) c[item.severity] += 1;
    return c;
  }, [items]);

  const filtered = useMemo(
    () => (severityFilter === "all" ? items : items.filter((i) => i.severity === severityFilter)),
    [items, severityFilter]
  );

  const pendingItems = filtered.filter((i) => i.status === "pending");
  const resolvedItems = filtered.filter((i) => i.status !== "pending");

  return (
    <section aria-labelledby="feed-heading" className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="feed-heading" className="text-lg font-bold text-zinc-900">
          Flagged content queue
        </h2>
      </div>

      <div role="group" aria-label="Filter by severity" className="mb-4 flex flex-wrap gap-1.5">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            aria-pressed={severityFilter === opt.key}
            onClick={() => onSeverityFilterChange(opt.key)}
            className={`flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs font-medium ${FOCUS_RING} ${
              severityFilter === opt.key
                ? "border-orange-700 bg-orange-700 text-white"
                : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
            }`}
          >
            {opt.label}
            <span className={`tabular-nums ${severityFilter === opt.key ? "text-white" : "text-zinc-500"}`}>
              {counts[opt.key]}
            </span>
          </button>
        ))}
      </div>

      {pendingItems.length === 0 && resolvedItems.length === 0 && (
        <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-8 text-center text-sm text-zinc-500">
          No flagged items match this filter.
        </p>
      )}

      {pendingItems.length > 0 && (
        <ol className="space-y-3">
          {pendingItems.map((item) => (
            <FeedItemCard key={item.id} item={item} compact={compact} onAction={onAction} />
          ))}
        </ol>
      )}

      {resolvedItems.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold text-zinc-500">Resolved this session</h3>
          <ol className="space-y-3">
            {resolvedItems.map((item) => (
              <FeedItemCard key={item.id} item={item} compact={compact} onAction={onAction} />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

export type { SeverityFilter };
