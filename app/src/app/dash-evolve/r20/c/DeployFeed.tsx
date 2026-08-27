"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { DEPLOYS, formatDuration, type Deploy, type DeployStatus } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";

type SortKey = "duration" | "recency";
type SortDir = "asc" | "desc";
type Filter = "all" | DeployStatus;

const STATUS_META: Record<DeployStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  success: { label: "Success", className: "border-emerald-800/60 bg-emerald-950/40 text-emerald-300", Icon: CheckCircle2 },
  failed: { label: "Failed", className: "border-rose-800/60 bg-rose-950/40 text-rose-300", Icon: XCircle },
  "rolled-back": { label: "Rolled back", className: "border-amber-800/60 bg-amber-950/30 text-amber-300", Icon: RotateCcw },
};

export default function DeployFeed() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recency");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const filtered = DEPLOYS.filter((d) => filter === "all" || d.status === filter);
    const withIndex = filtered.map((d, i) => ({ d, recencyIndex: i }));
    const sorted = [...withIndex].sort((a, b) => {
      const av = sortKey === "duration" ? a.d.durationSec : a.recencyIndex;
      const bv = sortKey === "duration" ? b.d.durationSec : b.recencyIndex;
      return (av - bv) * (sortDir === "asc" ? 1 : -1);
    });
    return sorted.map((x) => x.d);
  }, [filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const failedShown = rows.filter((d) => d.status !== "success").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>{`${rows.length} deploys in view · ${failedShown} needed attention`}</p>
        <div role="group" aria-label="Filter deploys by status" className="inline-flex items-center gap-0.5 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
          {([
            { id: "all", label: "All" },
            { id: "success", label: "Success" },
            { id: "failed", label: "Failed" },
            { id: "rolled-back", label: "Rolled back" },
          ] as { id: Filter; label: string }[]).map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx("h-8 rounded-md px-2.5 text-xs", TRANSITION, FOCUS, filter === f.id ? "bg-emerald-800 font-semibold text-white" : cx("font-medium", TEXT_AUX, "hover:bg-white/[0.06] hover:text-zinc-50"))}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full table-fixed text-sm">
          <caption className="sr-only">Recent deploys, filterable by status and sortable by duration or recency</caption>
          <colgroup>
            <col className="w-[40%] sm:w-[30%]" />
            <col className="hidden sm:table-column sm:w-[18%]" />
            <col className="w-[30%] sm:w-[22%]" />
            <col className="w-[30%] sm:w-[15%]" />
            <col className="hidden sm:table-column sm:w-[15%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, PANEL_BG)}>
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Service
              </th>
              <th scope="col" className={cx("hidden px-2 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] sm:table-cell", TEXT_AUX)}>
                Branch
              </th>
              <th scope="col" className={cx("px-2 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Status
              </th>
              <SortHeader label="Duration" active={sortKey === "duration"} dir={sortDir} onClick={() => toggleSort("duration")} />
              <SortHeader label="When" active={sortKey === "recency"} dir={sortDir} onClick={() => toggleSort("recency")} className="hidden sm:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((d) => {
              const meta = STATUS_META[d.status];
              return (
                <tr key={d.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <Image
                        src={`https://images.unsplash.com/photo-${d.actor.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                        alt=""
                        width={22}
                        height={22}
                        className="h-[22px] w-[22px] shrink-0 rounded-full bg-white/5 object-cover"
                      />
                      <div className="min-w-0">
                        <p className={cx("truncate font-mono text-[12.5px] font-medium", TEXT_PRIMARY)}>{d.service}</p>
                        <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{d.actor.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cx("hidden truncate px-2 py-2.5 text-[12px] font-normal sm:table-cell", TEXT_AUX)}>{d.branch}</td>
                  <td className="px-2 py-2.5">
                    <span className={cx("inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap", meta.className)}>
                      <meta.Icon size={11} aria-hidden="true" />
                      {meta.label}
                    </span>
                  </td>
                  <td className={cx("px-2 py-2.5 text-right text-[12.5px] font-normal", NUM, TEXT_PRIMARY)}>{formatDuration(d.durationSec)}</td>
                  <td className={cx("hidden px-3 py-2.5 text-right text-[12px] font-normal sm:table-cell", TEXT_AUX)}>{d.timeAgo}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHeader({ label, active, dir, onClick, className }: { label: string; active: boolean; dir: SortDir; onClick: () => void; className?: string }) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={cx("px-1 py-1 text-right", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cx("inline-flex h-8 w-full items-center justify-end gap-1 rounded-md px-2 text-[11px] font-medium uppercase tracking-[0.06em]", TRANSITION, FOCUS, active ? "text-emerald-300" : cx(TEXT_AUX, "hover:text-zinc-50"))}
      >
        {label}
        <Icon size={12} aria-hidden="true" />
      </button>
    </th>
  );
}

export type { Deploy };
