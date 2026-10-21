"use client";

import { useId, useState } from "react";
import { Send, X } from "lucide-react";
import { REGIONS, SERVICES, type Incident, type RegionId, type Severity, type ServiceId } from "./data";
import { FOCUS_RING } from "./ui";

export type DraftIncident = Omit<Incident, "id">;

const SELECT_CLASS =
  "h-10 w-full min-w-0 rounded-lg border border-white/10 bg-zinc-950 px-2.5 font-normal text-sm text-zinc-50";
const LABEL_CLASS = "block font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400";

/** Real, client-side "Declare incident" composer — triggered only by the topbar's primary action.
 *  Submitting prepends a new incident to `page.tsx`'s `incidents` array via `onSubmit`, with an
 *  id assigned by `nextIncidentId` in data.ts, never a literal. */
export function IncidentComposer({ onSubmit, onCancel }: { onSubmit: (draft: DraftIncident) => void; onCancel: () => void }) {
  const [serviceId, setServiceId] = useState<ServiceId>(SERVICES[0].id);
  const [regionId, setRegionId] = useState<RegionId>(REGIONS[0].id);
  const [severity, setSeverity] = useState<Severity>("major");
  const [title, setTitle] = useState("");
  const titleId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = title.trim();
    onSubmit({
      title: trimmed.length > 0 ? trimmed : "Untitled incident",
      serviceId,
      regionId,
      severity,
      status: "open",
      elapsedMinutes: 0,
      resolutionMinutes: null,
      assignee: null,
      runbook: "Runbook: pending triage",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Declare a new incident"
      className="mb-4 rounded-xl border border-rose-800/50 bg-rose-950/20 p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm text-zinc-50">Declare incident</h3>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel declaring an incident"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        <label htmlFor={titleId} className={LABEL_CLASS}>
          Title
        </label>
        <input
          id={titleId}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Elevated checkout latency in EU West"
          className={`mt-1 h-10 w-full min-w-0 rounded-lg border border-white/10 bg-zinc-950 px-2.5 font-normal text-sm text-zinc-50 placeholder:text-zinc-400 ${FOCUS_RING}`}
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className={LABEL_CLASS} htmlFor="composer-service">
            Service
          </label>
          <select
            id="composer-service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value as ServiceId)}
            className={`mt-1 ${SELECT_CLASS} ${FOCUS_RING}`}
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS} htmlFor="composer-region">
            Region
          </label>
          <select
            id="composer-region"
            value={regionId}
            onChange={(e) => setRegionId(e.target.value as RegionId)}
            className={`mt-1 ${SELECT_CLASS} ${FOCUS_RING}`}
          >
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.full}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL_CLASS} htmlFor="composer-severity">
            Severity
          </label>
          <select
            id="composer-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
            className={`mt-1 ${SELECT_CLASS} ${FOCUS_RING}`}
          >
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className={`flex h-9 items-center rounded-lg px-3 font-medium text-xs text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex h-9 items-center gap-1.5 rounded-lg bg-rose-700 px-3.5 font-medium text-xs text-white hover:bg-rose-600 ${FOCUS_RING}`}
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          File incident
        </button>
      </div>
    </form>
  );
}
