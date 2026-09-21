"use client";

import { X } from "lucide-react";
import { type Job, STATUS_META, TOTALS, formatPercent, formatRange, FOCUS_RING } from "./data";

interface DetailStripProps {
  job: Job | null;
  onClear: () => void;
}

export default function DetailStrip({ job, onClear }: DetailStripProps) {
  if (!job) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-50">Fleet snapshot</h2>
          <p className="text-xs text-zinc-400">Pin a job from the queue or the schedule to see it here.</p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] text-zinc-400">Total jobs</dt>
            <dd className="mt-0.5 text-lg font-semibold text-zinc-50 tabular-nums">{TOTALS.total}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] text-zinc-400">On track</dt>
            <dd className="mt-0.5 text-lg font-semibold text-emerald-400 tabular-nums">{TOTALS.onTrack}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] text-zinc-400">At risk</dt>
            <dd className="mt-0.5 text-lg font-semibold text-amber-400 tabular-nums">{TOTALS.atRisk}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] text-zinc-400">Blocked</dt>
            <dd className="mt-0.5 text-lg font-semibold text-rose-400 tabular-nums">{TOTALS.blocked}</dd>
          </div>
          <div className="rounded-lg bg-white/[0.03] px-3 py-2">
            <dt className="text-[11px] text-zinc-400">Avg. progress</dt>
            <dd className="mt-0.5 text-lg font-semibold text-zinc-50 tabular-nums">{formatPercent(TOTALS.avgProgress)}</dd>
          </div>
        </dl>
      </div>
    );
  }

  const meta = STATUS_META[job.status];
  const Icon = meta.icon;

  return (
    <div className={`rounded-xl border bg-zinc-900 p-4 ring-1 ring-inset ${meta.ring} border-white/10`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${meta.bg} ${meta.text}`}>
            <Icon className="h-3 w-3" aria-hidden="true" />
            {meta.label}
          </span>
          <h2 className="mt-1.5 truncate text-sm font-semibold text-zinc-50">{job.site}</h2>
          <p className="truncate text-xs text-zinc-400">
            {job.code} &middot; {job.city}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-zinc-50 ${FOCUS_RING}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Clear pinned job</span>
        </button>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <dt className="text-[11px] text-zinc-400">Crew</dt>
          <dd className="mt-0.5 truncate text-sm font-medium text-zinc-50">{job.crew}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-zinc-400">Dates</dt>
          <dd className="mt-0.5 whitespace-nowrap text-sm font-medium text-zinc-50">
            {job.startDay !== null && job.endDay !== null ? formatRange(job.startDay, job.endDay) : "Not yet scheduled"}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-zinc-400">Progress</dt>
          <dd className="mt-0.5 text-sm font-medium text-zinc-50 tabular-nums">{formatPercent(job.progressPct)}</dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-[11px] text-zinc-400">Note</dt>
          <dd className="mt-0.5 text-sm text-zinc-300">{job.note}</dd>
        </div>
      </dl>
    </div>
  );
}
