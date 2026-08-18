"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Gauge, ShieldHalf, X } from "lucide-react";
import { STAGE_META, STAGE_ORDER, getTeamMember, type Finding } from "./data";
import { buildStageHistory, daysOpen, formatDateYear, slaStatus, slaTargetDays } from "./format";
import { Avatar, SeverityBadge, SlaBar } from "./ui";

const STAGE_SEGMENT_COLOR: Record<string, string> = {
  backlog: "bg-zinc-300",
  triaged: "bg-zinc-400",
  assigned: "bg-teal-300",
  remediation: "bg-teal-500",
  verifying: "bg-teal-700",
  resolved: "bg-emerald-500",
};

export function DetailDrawer({
  finding,
  onClose,
  onAdvance,
  onRetreat,
  todayISO,
}: {
  finding: Finding | null;
  onClose: () => void;
  onAdvance: (id: string) => void;
  onRetreat: (id: string) => void;
  todayISO: string;
}) {
  const isOpen = finding !== null;
  const [entered, setEntered] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocused.current = document.activeElement as HTMLElement;
    const raf = requestAnimationFrame(() => setEntered(true));
    const focusId = window.setTimeout(() => closeBtnRef.current?.focus(), 60);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(focusId);
    };
  }, [isOpen, finding?.id]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleClose() {
    onClose();
    setEntered(false);
    previouslyFocused.current?.focus?.();
  }

  if (!finding) return null;

  const assignee = getTeamMember(finding.assigneeId);
  const daysOpenCount = daysOpen(finding, todayISO);
  const target = slaTargetDays(finding.severity);
  const status = slaStatus(finding, todayISO);
  const currentIndex = STAGE_ORDER.indexOf(finding.stage);
  const prevStage = currentIndex > 0 ? STAGE_ORDER[currentIndex - 1] : undefined;
  const nextStage = currentIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentIndex + 1] : undefined;
  const history = buildStageHistory(finding, todayISO);
  const historyTotal = history.reduce((acc, h) => acc + h.days, 0) || 1;

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close finding panel"
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-zinc-900/30 transition-opacity duration-200 motion-reduce:transition-none ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-xl transition-transform duration-200 motion-reduce:transition-none [scrollbar-width:thin] ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <SeverityBadge severity={finding.severity} />
              <span className="font-mono text-xs text-zinc-500 tabular-nums">{finding.id}</span>
            </div>
            <h2 id="drawer-title" className="mt-1.5 text-base leading-snug font-semibold text-zinc-900">
              {finding.title}
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label="Close finding panel"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-5 py-5">
          {/* Meta */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">Asset</dt>
              <dd className="mt-0.5 font-medium text-zinc-900">{finding.asset}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">Source</dt>
              <dd className="mt-0.5 flex items-center gap-1 text-zinc-700">
                <ShieldHalf className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                {finding.source}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">CVSS score</dt>
              <dd className="mt-0.5 flex items-center gap-1 font-medium text-zinc-900 tabular-nums">
                <Gauge className="h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
                {finding.cvss.toFixed(1)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">CVE</dt>
              <dd className="mt-0.5 text-zinc-700 tabular-nums">{finding.cve ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">Discovered</dt>
              <dd className="mt-0.5 text-zinc-700 whitespace-nowrap tabular-nums">{formatDateYear(finding.discoveredISO)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase">Assignee</dt>
              <dd className="mt-0.5">
                {assignee ? (
                  <span className="flex items-center gap-1.5 text-zinc-700">
                    <Avatar src={assignee.avatarUrl} name={assignee.name} size="xs" />
                    {assignee.name}
                  </span>
                ) : (
                  <span className="text-zinc-500">Unassigned</span>
                )}
              </dd>
            </div>
          </dl>

          {/* Description */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Description</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-700">{finding.description}</p>
          </div>

          {/* SLA */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Remediation SLA</h3>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <SlaBar
                open={daysOpenCount}
                target={target}
                status={status}
                discoveredISO={finding.discoveredISO}
                resolvedISO={finding.resolvedISO}
              />
              <p className="mt-2 text-xs text-zinc-600">
                {finding.resolvedISO
                  ? `Resolved ${formatDateYear(finding.resolvedISO)} — ${daysOpenCount} days after discovery, against a ${target}-day target for ${finding.severity} severity.`
                  : `Discovered ${formatDateYear(finding.discoveredISO)}. Target: ${target} days for ${finding.severity} severity.`}
              </p>
            </div>
          </div>

          {/* Stage history — per-item mini visualization + table fallback */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Time in each stage</h3>
            <div
              className="mt-2 flex h-3 w-full overflow-hidden rounded-full"
              role="img"
              aria-label={history.map((h) => `${STAGE_META[h.stage].label} ${h.days} days`).join(", ")}
            >
              {history.map((h) => (
                <div
                  key={h.stage}
                  className={`h-full ${STAGE_SEGMENT_COLOR[h.stage]} ${h.stage !== "resolved" ? "border-r border-white/60" : ""}`}
                  style={{ width: `${(h.days / historyTotal) * 100}%` }}
                />
              ))}
            </div>
            <table className="mt-2 w-full table-fixed text-xs">
              <caption className="sr-only">Days spent in each stage for {finding.id}</caption>
              <thead>
                <tr className="text-left text-zinc-500">
                  <th scope="col" className="w-1/2 py-1 font-medium">
                    Stage
                  </th>
                  <th scope="col" className="w-1/4 py-1 text-right font-medium">
                    Entered
                  </th>
                  <th scope="col" className="w-1/4 py-1 text-right font-medium">
                    Days
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.stage} className="border-t border-zinc-100">
                    <td className="py-1 text-zinc-700">
                      <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${STAGE_SEGMENT_COLOR[h.stage]}`} aria-hidden="true" />
                      {STAGE_META[h.stage].label}
                    </td>
                    <td className="py-1 text-right whitespace-nowrap text-zinc-500 tabular-nums">{formatDateYear(h.enteredISO)}</td>
                    <td className="py-1 text-right font-medium text-zinc-900 tabular-nums">{h.days}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity */}
          {finding.activity.length > 0 ? (
            <div>
              <h3 className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">Activity</h3>
              <ul className="mt-2 space-y-2.5">
                {finding.activity.map((a, i) => {
                  const author = getTeamMember(a.authorId);
                  return (
                    <li key={i} className="flex gap-2">
                      {author ? <Avatar src={author.avatarUrl} name={author.name} size="xs" className="mt-0.5" /> : null}
                      <p className="text-xs leading-relaxed text-zinc-600">
                        <span className="font-medium text-zinc-900">{author?.name ?? "Unknown"}</span> {a.note}{" "}
                        <span className="text-zinc-500 tabular-nums">· {a.daysAgo}d ago</span>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        {/* Stage controls — the primary move-stage action */}
        <div className="sticky bottom-0 flex shrink-0 items-center justify-between gap-2 border-t border-zinc-100 bg-white px-5 py-3.5">
          <button
            type="button"
            disabled={!prevStage}
            onClick={() => prevStage && onRetreat(finding.id)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-zinc-100 disabled:bg-zinc-50 disabled:text-zinc-500 disabled:hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {prevStage ? STAGE_META[prevStage].label : "Backlog"}
          </button>
          <button
            type="button"
            disabled={!nextStage}
            onClick={() => nextStage && onAdvance(finding.id)}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-sm font-medium text-white hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-600"
          >
            {nextStage ? STAGE_META[nextStage].label : "Resolved"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
