"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { DURATION_BY_TYPE, SITES, formatDayHeading, type SiteId, type Visit, type VisitType } from "./data";
import { cx, FOCUS_RING } from "./ui";

const VISIT_TYPES: VisitType[] = [
  "Screening",
  "Baseline",
  "Follow-up Wk4",
  "Follow-up Wk12",
  "Follow-up Wk24",
  "End of Study",
  "Unscheduled",
];

const TIME_OPTIONS = [480, 540, 600, 660, 720, 780, 840, 900, 960];

function formatTimeOption(minutes: number): string {
  const hour24 = Math.floor(minutes / 60);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:00 ${period}`;
}

interface NewVisitModalProps {
  day: number;
  onClose: () => void;
  onCreate: (visit: Visit) => void;
  trialId: Visit["trialId"];
  nextId: string;
}

export function NewVisitModal({ day, onClose, onCreate, trialId, nextId }: NewVisitModalProps) {
  const [patientId, setPatientId] = useState("");
  const [siteId, setSiteId] = useState<SiteId>(SITES[0].id);
  const [visitType, setVisitType] = useState<VisitType>("Follow-up Wk4");
  const [start, setStart] = useState(TIME_OPTIONS[2]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = patientId.trim();
    if (!trimmed) return;
    onCreate({
      id: nextId,
      trialId,
      day,
      start,
      duration: DURATION_BY_TYPE[visitType],
      siteId,
      visitType,
      status: "scheduled",
      patientId: trimmed,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button type="button" aria-label="Close new visit form" className="absolute inset-0 bg-zinc-900/40" onClick={onClose} />
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-visit-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl motion-safe:animate-[rise_0.15s_ease-out] motion-reduce:animate-none"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="new-visit-title" className="text-sm font-bold text-zinc-900">
              Schedule a visit
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500">For {formatDayHeading(day)}</p>
          </div>
          <button type="button" onClick={onClose} className={cx("flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100", FOCUS_RING)} aria-label="Close new visit form">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Patient ID</span>
            <input
              required
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="e.g. 014-142"
              className={cx(
                "mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-900 placeholder:text-zinc-500",
                FOCUS_RING
              )}
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Site</span>
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value as SiteId)}
              className={cx("mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-900", FOCUS_RING)}
            >
              {SITES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Visit type</span>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as VisitType)}
                className={cx("mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-900", FOCUS_RING)}
              >
                {VISIT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Time</span>
              <select
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
                className={cx("mt-1 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm tabular-nums text-zinc-900", FOCUS_RING)}
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {formatTimeOption(t)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={cx("h-11 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50", FOCUS_RING)}
          >
            Cancel
          </button>
          <button type="submit" className={cx("h-11 rounded-md bg-lime-700 px-4 text-sm font-medium text-white hover:bg-lime-800", FOCUS_RING)}>
            Schedule visit
          </button>
        </div>
      </form>
    </div>
  );
}
