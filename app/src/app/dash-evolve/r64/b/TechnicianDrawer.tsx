"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X, Truck, CheckCircle2, Clock, CalendarX2 } from "lucide-react";
import {
  getTechnicianById, getTechUtilization, getJobsForTech, formatHours, formatRange, pctFmt, STATUS_LABEL,
  type TechnicianId, type Job,
} from "./data";
import { Badge, FOCUS_RING, NUM, Progress, TabList, TabPanel, DISPLAY_FACE } from "./ui";

type DrawerTab = "overview" | "history";

function statusTone(status: Job["status"]): "success" | "strong" | "muted" | "neutral" {
  if (status === "completed") return "success";
  if (status === "in_progress") return "strong";
  if (status === "cancelled") return "muted";
  return "neutral";
}

/** The ONE summary widget that a technician pin touches. Pinning (clicking a column/row header in
 *  the board or calendar) only ever opens this drawer and sets which technician it describes — it
 *  never filters or recomputes the board/calendar grid itself, which keeps rendering every
 *  technician and every job exactly as it did before the pin. */
export function TechnicianDrawer({ techId, onClose }: { techId: TechnicianId | null; onClose: () => void }) {
  const [tab, setTab] = useState<DrawerTab>("overview");
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // Reset the tab whenever a *different* technician gets pinned — applied during render (React's
  // documented pattern for adjusting state on a prop change) rather than inside an effect body, so
  // there is no `set-state-in-effect`.
  const [prevTechId, setPrevTechId] = useState(techId);
  if (techId !== prevTechId) {
    setPrevTechId(techId);
    setTab("overview");
  }

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (techId) {
      if (!wasOpenRef.current) restoreFocusRef.current = document.activeElement as HTMLElement | null;
      wasOpenRef.current = true;
      const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      restoreFocusRef.current?.focus();
    }
  }, [techId]);

  useEffect(() => {
    if (!techId) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [techId]);

  if (!techId) return null;

  const tech = getTechnicianById(techId);
  const util = getTechUtilization(tech);
  const jobs = getJobsForTech(techId);
  const idPrefix = "tech-drawer";

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" aria-label="Close technician panel" onClick={onClose} className="absolute inset-0 bg-zinc-900/40" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${idPrefix}-title`}
        onKeyDown={handleKeyDown}
        className="relative z-10 flex h-full w-full max-w-sm min-w-0 flex-col border-l border-zinc-200 bg-white shadow-xl"
      >
        <div className="flex h-14 min-w-0 shrink-0 items-center justify-between gap-2 border-b border-zinc-200 px-4">
          <h2 id={`${idPrefix}-title`} className="min-w-0 truncate text-sm font-semibold text-zinc-900" style={DISPLAY_FACE}>
            {tech.name}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close technician panel"
            onClick={onClose}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-w-0 flex-1 overflow-y-auto p-4">
          <div className="mb-4 flex min-w-0 items-center gap-2 text-sm text-zinc-600">
            <Truck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate">{tech.role} · {tech.vehicle}</span>
          </div>

          <TabList
            idPrefix={idPrefix}
            label="Technician detail"
            value={tab}
            onChange={setTab}
            tabs={[
              { value: "overview", label: "Overview" },
              { value: "history", label: "Job history" },
            ]}
          />

          <TabPanel idPrefix={idPrefix} value="overview" activeValue={tab}>
            <div className="mt-4 flex min-w-0 flex-col gap-4">
              <div>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">Utilization</span>
                  <span className={`whitespace-nowrap text-sm font-medium text-zinc-900 ${NUM}`}>
                    {formatHours(util.assignedMin)} / {formatHours(tech.capacityMin)} · {pctFmt.format(util.utilization)}
                  </span>
                </div>
                <Progress value={util.utilization} label={`${tech.name} utilization, ${pctFmt.format(util.utilization)} of capacity`} />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg border border-zinc-200 p-2">
                  <p className={`text-lg font-semibold text-zinc-900 ${NUM}`}>{util.completedCount}</p>
                  <p className="text-[11px] text-zinc-500">Completed</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-2">
                  <p className={`text-lg font-semibold text-zinc-900 ${NUM}`}>{util.activeCount}</p>
                  <p className="text-[11px] text-zinc-500">Active</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-2">
                  <p className={`text-lg font-semibold text-zinc-900 ${NUM}`}>{util.scheduledCount}</p>
                  <p className="text-[11px] text-zinc-500">Scheduled</p>
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-xs text-zinc-600">
                <p className="mb-1 font-medium text-zinc-900">Skills</p>
                <p>{tech.role.replace("Senior ", "").replace("Lead ", "")} certified · Van-stocked parts kit · On-call rotation eligible</p>
              </div>
            </div>
          </TabPanel>

          <TabPanel idPrefix={idPrefix} value="history" activeValue={tab}>
            <ul className="mt-4 flex min-w-0 flex-col gap-2">
              {jobs.map((job) => (
                <li key={job.id} className="min-w-0 rounded-lg border border-zinc-200 p-2.5">
                  <div className="flex min-w-0 items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-sm font-medium text-zinc-900">{job.title}</p>
                    <Badge tone={statusTone(job.status)}>{STATUS_LABEL[job.status]}</Badge>
                  </div>
                  <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-zinc-500">
                    <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span className={`whitespace-nowrap ${NUM}`}>{formatRange(job.start, job.duration)}</span>
                    <span className="min-w-0 truncate">· {job.customer}</span>
                  </div>
                </li>
              ))}
              {jobs.length === 0 ? (
                <li className="flex flex-col items-center gap-2 py-8 text-center text-sm text-zinc-500">
                  <CalendarX2 className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                  No jobs today.
                </li>
              ) : null}
            </ul>
          </TabPanel>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-700" aria-hidden="true" />
            Pinning a technician only updates this panel — the board and calendar keep showing every job.
          </div>
        </div>
      </div>
    </div>
  );
}
