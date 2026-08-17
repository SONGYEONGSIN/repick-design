"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { Experiment, ExperimentId } from "./data";
import { currentCi, currentLift, EXPERIMENTS, formatDate, formatLift, numberFmt, significanceState, startedMs, totalSample } from "./data";
import { Badge, CardHeader, SegmentedControl, SignificanceBadge } from "./ui";
import { BORDER, DIVIDE, FOCUS_VISIBLE_INSET, HOVER_ROW, NUM, STATUS_LABEL, STATUS_TONE, TEXT_CAPTION, TEXT_PRIMARY, TONE, TRANSITION, cx } from "./tokens";

type SortKey = "name" | "lift" | "samples" | "started";
type SortDir = "asc" | "desc";
type FilterId = "all" | "running" | "significant" | "not-yet";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "running", label: "Running" },
  { id: "significant", label: "Significant" },
  { id: "not-yet", label: "Not yet" },
];

const COLUMNS: { key: SortKey | null; label: string; width: string }[] = [
  { key: "name", label: "Experiment", width: "34%" },
  { key: null, label: "Status", width: "12%" },
  { key: "lift", label: "Lift", width: "12%" },
  { key: null, label: "95% CI", width: "20%" },
  { key: "samples", label: "Samples", width: "12%" },
  { key: "started", label: "Started", width: "10%" },
];

function rowMatchesFilter(exp: Experiment, filter: FilterId): boolean {
  if (filter === "all") return true;
  if (filter === "running") return exp.status === "running";
  const { ciLow, ciHigh } = currentCi(exp);
  const sig = significanceState(ciLow, ciHigh);
  if (filter === "significant") return sig !== "not-yet";
  return sig === "not-yet";
}

export default function ExperimentsTable({ selectedId, onSelect }: { selectedId: ExperimentId; onSelect: (id: ExperimentId) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("started");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<FilterId>("all");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = EXPERIMENTS.filter((e) => rowMatchesFilter(e, filter));
    const withMetrics = filtered.map((e) => ({ exp: e, lift: currentLift(e), samples: totalSample(e), started: startedMs(e) }));
    withMetrics.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.exp.name.localeCompare(b.exp.name);
      else if (sortKey === "lift") cmp = a.lift - b.lift;
      else if (sortKey === "samples") cmp = a.samples - b.samples;
      else cmp = a.started - b.started;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return withMetrics;
  }, [filter, sortKey, sortDir]);

  return (
    <div>
      <CardHeader
        title="All experiments"
        description={`${rows.length} of ${EXPERIMENTS.length} shown`}
        action={<SegmentedControl options={FILTERS} value={filter} onChange={setFilter} ariaLabel="Filter experiments" />}
      />

      <div className={cx("relative mt-3 overflow-x-auto rounded-lg border", BORDER)}>
        <table className="relative w-full min-w-[720px] text-left text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">All experiments with lift, confidence interval, sample size, and start date. Sortable by clicking a column header.</caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.label} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              {COLUMNS.map((col) => {
                if (!col.key) {
                  return (
                    <th key={col.label} scope="col" className={cx("px-3 py-2.5 text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>
                      {col.label}
                    </th>
                  );
                }
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={col.label} scope="col" aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"} className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key as SortKey)}
                      className={cx("flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION, "hover:text-zinc-50", TRANSITION, FOCUS_VISIBLE_INSET)}
                    >
                      {col.label}
                      <Icon size={11} aria-hidden="true" className={active ? "text-cyan-400" : undefined} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.map(({ exp, lift, samples, started }) => {
              const { ciLow, ciHigh } = currentCi(exp);
              const sig = significanceState(ciLow, ciHigh);
              const selected = exp.id === selectedId;
              return (
                <tr key={exp.id} className={cx(selected && "bg-cyan-400/5")}>
                  <td className="px-3 py-2.5">
                    <button
                      type="button"
                      onClick={() => onSelect(exp.id)}
                      aria-current={selected ? "true" : undefined}
                      className={cx("block w-full rounded text-left", FOCUS_VISIBLE_INSET, TRANSITION, HOVER_ROW, "-mx-1 px-1 py-0.5")}
                    >
                      <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{exp.name}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{exp.metricLabel}</span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <Badge tone={TONE[STATUS_TONE[exp.status]]}>{STATUS_LABEL[exp.status]}</Badge>
                  </td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm font-medium", NUM, sig === "significant-negative" ? "text-rose-400" : TEXT_PRIMARY)}>{formatLift(lift)}</td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5")}>
                    <SignificanceBadge state={sig} />
                  </td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm", NUM, TEXT_CAPTION)}>{numberFmt.format(samples)}</td>
                  <td className={cx("whitespace-nowrap px-3 py-2.5 text-sm", NUM, TEXT_CAPTION)}>{formatDate(started)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
