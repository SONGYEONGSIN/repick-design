"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { QUEUE_META, REVIEWER_CAPACITY } from "./data";
import { BORDER, DISPLAY, DIVIDE, FOCUS, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Card, CardHeader } from "./ui";
import type { QueueFilterValue } from "./types";

type SortKey = "queue" | "utilization";
type SortDir = "asc" | "desc";

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return <ArrowUpDown size={12} aria-hidden="true" className="opacity-60" />;
  return sortDir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
}

function statusFor(utilization: number): { label: string; tone: { text: string; bg: string; border: string } } {
  if (utilization >= 95) return { label: "Critical", tone: { text: "text-rose-300", bg: "bg-rose-500/12", border: "border-rose-500/25" } };
  if (utilization >= 85) return { label: "High", tone: { text: "text-amber-300", bg: "bg-amber-500/12", border: "border-amber-500/25" } };
  return { label: "Healthy", tone: { text: "text-emerald-300", bg: "bg-emerald-500/12", border: "border-emerald-500/25" } };
}

export default function ReviewerTable({ highlightQueue }: { highlightQueue: QueueFilterValue }) {
  const [sortKey, setSortKey] = useState<SortKey>("utilization");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => REVIEWER_CAPACITY.map((r) => ({ ...r, utilization: (r.active / r.capacity) * 100 })), []);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const cmp = sortKey === "queue" ? a.label.localeCompare(b.label) : a.utilization - b.utilization;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const totalActive = rows.reduce((sum, r) => sum + r.active, 0);
  const totalCapacity = rows.reduce((sum, r) => sum + r.capacity, 0);
  const totalUtilization = (totalActive / totalCapacity) * 100;

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card id="reviewer-capacity" padded={false} className="scroll-mt-20">
      <div className="p-4 pb-0 sm:p-5 sm:pb-0">
        <CardHeader title="Reviewer capacity by queue" description="Active reviewers against staffed capacity — sortable, updated live." />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-collapse text-sm lg:min-w-0">
          <caption className="sr-only">Reviewer capacity by queue: active reviewers, capacity, utilization, and staffing status.</caption>
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "22%" }} />
          </colgroup>
          <thead>
            <tr className={cx("border-y", BORDER)}>
              <th scope="col" aria-sort={ariaSortFor("queue")} className="px-4 py-2.5 text-left sm:px-5">
                <button type="button" onClick={() => toggleSort("queue")} className={cx("inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase", TEXT_CAPTION, TRANSITION, FOCUS, "hover:text-zinc-100")}>
                  Queue
                  <SortIcon column="queue" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th scope="col" className={cx("px-4 py-2.5 text-right text-[11px] font-semibold tracking-wide uppercase sm:px-5", TEXT_CAPTION)}>
                Active / capacity
              </th>
              <th scope="col" aria-sort={ariaSortFor("utilization")} className="px-4 py-2.5 text-right sm:px-5">
                <button
                  type="button"
                  onClick={() => toggleSort("utilization")}
                  className={cx("ml-auto inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase", TEXT_CAPTION, TRANSITION, FOCUS, "hover:text-zinc-100")}
                >
                  Utilization
                  <SortIcon column="utilization" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th scope="col" className={cx("px-4 py-2.5 text-right text-[11px] font-semibold tracking-wide uppercase sm:px-5", TEXT_CAPTION)}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {sorted.map((r) => {
              const status = statusFor(r.utilization);
              const Icon = QUEUE_META[r.queue].Icon;
              const highlighted = highlightQueue !== "all" && highlightQueue === r.queue;
              return (
                <tr key={r.queue} className={cx(TRANSITION, highlighted ? "bg-emerald-500/[0.06]" : undefined)}>
                  <th scope="row" className="px-4 py-2.5 text-left font-medium whitespace-nowrap sm:px-5">
                    <span className={cx("inline-flex items-center gap-2", TEXT_PRIMARY)}>
                      <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                      {r.label}
                    </span>
                  </th>
                  <td className={cx("px-4 py-2.5 text-right whitespace-nowrap sm:px-5", TEXT_SECONDARY, NUM)} style={DISPLAY}>
                    {r.active} / {r.capacity}
                  </td>
                  <td className={cx("px-4 py-2.5 text-right font-semibold whitespace-nowrap sm:px-5", TEXT_PRIMARY, NUM)} style={DISPLAY}>
                    {r.utilization.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap sm:px-5">
                    <Badge tone={status.tone}>{status.label}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={cx("border-t", BORDER)}>
              <th scope="row" className={cx("px-4 py-2.5 text-left text-sm font-semibold whitespace-nowrap sm:px-5", TEXT_PRIMARY)}>
                All queues
              </th>
              <td className={cx("px-4 py-2.5 text-right font-semibold whitespace-nowrap sm:px-5", TEXT_PRIMARY, NUM)} style={DISPLAY}>
                {totalActive} / {totalCapacity}
              </td>
              <td className={cx("px-4 py-2.5 text-right font-semibold whitespace-nowrap sm:px-5", TEXT_PRIMARY, NUM)} style={DISPLAY}>
                {totalUtilization.toFixed(1)}%
              </td>
              <td className="px-4 py-2.5" />
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
