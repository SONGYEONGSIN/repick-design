"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { type Job, type JobStatus, STATUS_META, TOTALS, formatRange, FOCUS_RING } from "./data";

type FilterKey = "all" | "at-risk" | "blocked" | "unscheduled";
type SortKey = "severity" | "start";

const SEVERITY_ORDER: Record<JobStatus, number> = {
  blocked: 0,
  "at-risk": 1,
  unscheduled: 2,
  "on-track": 3,
};

interface QueueRailProps {
  jobs: Job[];
  pinnedId: string | null;
  onPin: (id: string) => void;
}

export default function QueueRail({ jobs, pinnedId, onPin }: QueueRailProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("severity");

  const filtered = useMemo(() => {
    const base = filter === "all" ? jobs : jobs.filter((j) => j.status === filter);
    const sorted = [...base].sort((a, b) => {
      if (sortKey === "severity") {
        const diff = SEVERITY_ORDER[a.status] - SEVERITY_ORDER[b.status];
        if (diff !== 0) return diff;
        return (a.startDay ?? 999) - (b.startDay ?? 999);
      }
      return (a.startDay ?? 999) - (b.startDay ?? 999);
    });
    return sorted;
  }, [jobs, filter, sortKey]);

  const chips: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: jobs.length },
    { key: "blocked", label: "Blocked", count: TOTALS.blocked },
    { key: "at-risk", label: "At risk", count: TOTALS.atRisk },
    { key: "unscheduled", label: "Unsched.", count: TOTALS.unscheduled },
  ];

  return (
    <section aria-labelledby="queue-heading" className="w-full shrink-0 lg:w-64">
      <div className="rounded-xl border border-white/10 bg-zinc-900">
        <div className="border-b border-white/10 p-4">
          <h2 id="queue-heading" className="text-sm font-semibold text-zinc-50">
            Needs attention
          </h2>
          <p className="mt-0.5 text-xs text-zinc-400">Jobs that aren&rsquo;t on track, ranked by risk.</p>

          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                aria-pressed={filter === chip.key}
                className={`min-h-6 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  filter === chip.key
                    ? "border-cyan-400/60 bg-cyan-500/15 text-cyan-300"
                    : "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-zinc-200"
                }`}
              >
                {chip.label} <span className="tabular-nums">({chip.count})</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ArrowUpDown className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="shrink-0">Sort:</span>
            <div className="flex overflow-hidden rounded-md border border-white/10">
              {(["severity", "start"] as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSortKey(key)}
                  aria-pressed={sortKey === key}
                  className={`min-h-6 px-2 py-1.5 font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    sortKey === key ? "bg-cyan-500/20 text-cyan-300" : "bg-transparent text-zinc-400 hover:bg-white/5"
                  }`}
                >
                  {key === "severity" ? "Risk" : "Start date"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <ul className="max-h-[32rem] divide-y divide-white/5 overflow-y-auto lg:max-h-[40rem]">
          {filtered.map((job) => {
            const meta = STATUS_META[job.status];
            const Icon = meta.icon;
            const isPinned = job.id === pinnedId;
            return (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => onPin(job.id)}
                  aria-pressed={isPinned}
                  className={`block w-full px-4 py-3 text-left transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                    isPinned ? "bg-cyan-500/10" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium ${meta.bg} ${meta.text}`}>
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    {meta.label}
                  </span>
                  <p className="mt-1.5 truncate text-sm font-medium text-zinc-50" title={job.site}>
                    {job.site}
                  </p>
                  <p className="truncate text-xs text-zinc-400">
                    {job.code} &middot; {job.crew}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{job.note}</p>
                  <p className="mt-1.5 whitespace-nowrap text-[11px] text-zinc-400">
                    {job.startDay !== null && job.endDay !== null ? formatRange(job.startDay, job.endDay) : "Not yet scheduled"}
                  </p>
                </button>
              </li>
            );
          })}
          {filtered.length === 0 && <li className="px-4 py-8 text-center text-sm text-zinc-400">No jobs match this filter.</li>}
        </ul>
      </div>
    </section>
  );
}
