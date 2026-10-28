"use client";

import { AlertCircle, AlertOctagon, AlertTriangle, ArrowLeft, ArrowUpCircle, Ban, CheckCircle2, Circle, Eye, History, Info, RotateCcw, Scale, ShieldAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { CATEGORY_META, CONTENT_TYPE_META, type Report, formatRelative, formatSla, relatedReports } from "./data";
import { BORDER, FOCUS, NUM, type Severity, type Status, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Avatar, Card, CardHead, SeverityBadge, StatusBadge, TabPanel, Tabs } from "./ui";

const SEVERITY_ICON: Record<Severity, LucideIcon> = { Critical: AlertOctagon, High: AlertTriangle, Medium: AlertCircle, Low: Info };
const STATUS_ICON: Record<Status, LucideIcon> = { New: Circle, "In Review": Eye, Escalated: ArrowUpCircle, Resolved: CheckCircle2 };

export type Decision = { status: Status; resolutionLabel: string };

type TabId = "overview" | "history" | "related";

export default function DetailPanel({
  report,
  decision,
  onDecide,
  onUndo,
  onSelectReport,
  onBack,
}: {
  report: Report;
  decision: Decision | null;
  onDecide: (d: Decision) => void;
  onUndo: () => void;
  onSelectReport: (id: string) => void;
  onBack?: () => void;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const tabsId = "detail-tabs";

  const effectiveStatus = decision?.status ?? report.status;
  const category = CATEGORY_META[report.category];
  const content = CONTENT_TYPE_META[report.contentType];
  const SeverityIcon = SEVERITY_ICON[report.severity];
  const StatusIcon = STATUS_ICON[effectiveStatus];
  const related = relatedReports(report);

  const history = decision ? [{ label: decision.resolutionLabel, atLabel: "Just now" }, ...report.history] : report.history;

  return (
    <Card padded={false} className="flex h-full min-w-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b p-4 sm:p-5 border-zinc-200">
        <div className="min-w-0">
          {onBack ? (
            <button type="button" onClick={onBack} className={cx("mb-2 flex items-center gap-1 text-xs font-medium lg:hidden", TEXT_AUX, FOCUS)}>
              <ArrowLeft size={13} aria-hidden="true" />
              Back to queue
            </button>
          ) : null}
          <span className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX, NUM)}>{report.id.toUpperCase()}</span>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <SeverityBadge severity={report.severity} Icon={SeverityIcon} />
            <StatusBadge status={effectiveStatus} Icon={StatusIcon} />
          </div>
        </div>
        <span className={cx("shrink-0 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-semibold", NUM, BORDER, "bg-zinc-100", TEXT_AUX)}>{formatSla({ ...report, status: effectiveStatus })}</span>
      </div>

      {decision ? (
        <div className={cx("flex items-center justify-between gap-3 border-b px-4 py-2 sm:px-5", BORDER, "bg-green-50")}>
          <p className="text-xs font-medium text-green-800">{decision.resolutionLabel} by you, just now.</p>
          <button type="button" onClick={onUndo} className={cx("inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-green-800", TRANSITION, FOCUS, "hover:bg-green-100")}>
            <RotateCcw size={12} aria-hidden="true" />
            Undo
          </button>
        </div>
      ) : null}

      <div className="px-4 pt-3 sm:px-5">
        <Tabs<TabId>
          ariaLabel="Report detail sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "history", label: "History" },
            { id: "related", label: `Related (${related.length})` },
          ]}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 [scrollbar-width:thin]">
        <TabPanel id={tabsId} tabId="overview" active={tab === "overview"}>
          <div className="flex flex-col gap-4">
            <div>
              <CardHead title="Flagged content" Icon={content.Icon} hint={`${content.label} · reported via ${report.reporterType.toLowerCase()} · ${formatRelative(report.receivedMinutesAgo)}`} />
              <p className={cx("mt-2 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{report.title}</p>
              <p className={cx("mt-1.5 rounded-lg border p-3 text-xs font-normal leading-relaxed", BORDER, "bg-zinc-50", TEXT_SECONDARY)}>{report.snippet}</p>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg border p-3 border-zinc-200">
              <Avatar name={report.actorName} size={32} />
              <div className="min-w-0 flex-1">
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{report.actorName}</p>
                <p className={cx("truncate text-xs font-normal", TEXT_AUX)}>{related.length > 0 ? `${related.length} other report${related.length === 1 ? "" : "s"} on this account` : "No other reports on this account"}</p>
              </div>
              <span className={cx("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", BORDER, "bg-zinc-100", TEXT_AUX)}>
                <category.Icon size={11} aria-hidden="true" />
                {category.label}
              </span>
            </div>

            <div className="flex items-start gap-2 rounded-lg border p-3 border-amber-200 bg-amber-50">
              <Scale size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-amber-700" />
              <p className="text-xs font-normal leading-relaxed text-amber-800">
                <span className="font-semibold">Policy matched: </span>
                {report.policyMatched}
              </p>
            </div>

            <div>
              <p className={cx("mb-2 text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Decision</p>
              {/* Always a single stacked column, never a breakpoint-driven multi-column grid: this
                  panel is a fixed 3/12 grid column at desktop, so a viewport-keyed `sm:grid-cols-3`
                  would size each button against the viewport width rather than this narrow
                  container's actual width and crush the labels. Full-width rows fit at every size. */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onDecide({ status: "Resolved", resolutionLabel: "Approved — left standing" })}
                  className={cx("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold", TRANSITION, FOCUS, "border-green-200 bg-green-50 text-green-800 hover:bg-green-100")}
                >
                  <CheckCircle2 size={14} aria-hidden="true" className="shrink-0" />
                  Approve content
                </button>
                <button
                  type="button"
                  onClick={() => onDecide({ status: "Resolved", resolutionLabel: "Removed" })}
                  className={cx("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold", TRANSITION, FOCUS, "border-red-200 bg-red-50 text-red-700 hover:bg-red-100")}
                >
                  <Ban size={14} aria-hidden="true" className="shrink-0" />
                  Remove content
                </button>
                <button
                  type="button"
                  onClick={() => onDecide({ status: "Escalated", resolutionLabel: "Escalated to senior review" })}
                  className={cx("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold", TRANSITION, FOCUS, "border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200")}
                >
                  <ShieldAlert size={14} aria-hidden="true" className="shrink-0" />
                  Escalate to senior review
                </button>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel id={tabsId} tabId="history" active={tab === "history"}>
          <ol className="flex flex-col gap-3">
            {history.map((h, i) => (
              <li key={`${h.label}-${i}`} className="flex gap-2.5">
                <span className="mt-0.5 flex shrink-0 flex-col items-center">
                  <History size={13} aria-hidden="true" className={i === 0 ? "text-green-700" : TEXT_AUX} />
                  {i < history.length - 1 ? <span className="mt-1 h-full w-px flex-1 bg-zinc-200" /> : null}
                </span>
                <div className="min-w-0 pb-1">
                  <p className={cx("text-sm font-normal leading-snug", TEXT_PRIMARY)}>{h.label}</p>
                  <p className={cx("mt-0.5 text-[11px] font-normal", TEXT_AUX)}>{h.atLabel}</p>
                </div>
              </li>
            ))}
          </ol>
        </TabPanel>

        <TabPanel id={tabsId} tabId="related" active={tab === "related"}>
          {related.length === 0 ? (
            <p className={cx("py-6 text-center text-sm font-normal", TEXT_AUX)}>No other reports from this account in the current window.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {related.map((r) => {
                const RIcon = SEVERITY_ICON[r.severity];
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => onSelectReport(r.id)}
                      className={cx("flex w-full items-center gap-2 rounded-lg border p-2.5 text-left", BORDER, TRANSITION, FOCUS, "hover:bg-zinc-50")}
                    >
                      <SeverityBadge severity={r.severity} Icon={RIcon} />
                      <span className={cx("min-w-0 flex-1 truncate text-xs font-medium", TEXT_PRIMARY)}>{r.title}</span>
                      <span className={cx("shrink-0 whitespace-nowrap text-[11px] font-normal", NUM, TEXT_AUX)}>{formatRelative(r.receivedMinutesAgo)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </TabPanel>
      </div>
    </Card>
  );
}
