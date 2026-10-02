"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Minus, Search, TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CohortRow } from "./data";
import { avatarUrl, formatInt } from "./data";
import { Avatar, Badge, FOCUS_RING } from "./ui";

type SortKey = "label" | "lead" | "entered" | "advanced" | "convRate";
type SortDir = "asc" | "desc";

export function CohortTable({
  rows,
  rowLabelHeader,
  advancedHeader,
  caption,
}: {
  rows: CohortRow[];
  rowLabelHeader: string;
  advancedHeader: string;
  caption: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("entered");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState("");

  const signalKind = rows[0]?.signal.kind === "share" ? "share" : "trend";
  const signalHeader = signalKind === "share" ? "Share of Entries" : "Week-over-Week";

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.label.toLowerCase().includes(q) || r.lead.name.toLowerCase().includes(q) || r.lead.company.toLowerCase().includes(q),
    );
  }, [rows, filter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "label":
          cmp = a.label.localeCompare(b.label);
          break;
        case "lead":
          cmp = a.lead.name.localeCompare(b.lead.name);
          break;
        case "entered":
          cmp = a.entered - b.entered;
          break;
        case "advanced":
          cmp = a.advanced - b.advanced;
          break;
        case "convRate":
          cmp = a.convRate - b.convRate;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

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

  function SortIcon({ keyName }: { keyName: SortKey }) {
    if (keyName !== sortKey) return <ArrowUpDown size={12} className="text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-violet-300" aria-hidden="true" />
    ) : (
      <ArrowDown size={12} className="text-violet-300" aria-hidden="true" />
    );
  }

  function HeaderButton({ keyName, children }: { keyName: SortKey; children: ReactNode }) {
    return (
      <button
        type="button"
        onClick={() => toggleSort(keyName)}
        className={`${FOCUS_RING} flex w-full items-center gap-1 text-left`}
      >
        <span className="truncate">{children}</span>
        <SortIcon keyName={keyName} />
      </button>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className={`flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 sm:max-w-xs`}>
          <Search size={13} className="flex-shrink-0 text-zinc-400" aria-hidden="true" />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter rows…"
            aria-label="Filter cohort rows"
            className={`h-full w-full min-w-0 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-400 ${FOCUS_RING}`}
          />
        </div>
        <p className="flex-shrink-0 text-[11px] whitespace-nowrap text-zinc-400">
          {sorted.length} of {rows.length} rows
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-xs">
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            <col style={{ width: "16%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              <th scope="col" className="px-3 py-2.5 text-left" aria-sort={ariaSortFor("label")}>
                <HeaderButton keyName="label">{rowLabelHeader}</HeaderButton>
              </th>
              <th scope="col" className="px-3 py-2.5 text-left" aria-sort={ariaSortFor("lead")}>
                <HeaderButton keyName="lead">Lead Account</HeaderButton>
              </th>
              <th scope="col" className="px-3 py-2.5 text-right" aria-sort={ariaSortFor("entered")}>
                <HeaderButton keyName="entered">Entered</HeaderButton>
              </th>
              <th scope="col" className="px-3 py-2.5 text-right" aria-sort={ariaSortFor("advanced")}>
                <HeaderButton keyName="advanced">{advancedHeader}</HeaderButton>
              </th>
              <th scope="col" className="px-3 py-2.5 text-right" aria-sort={ariaSortFor("convRate")}>
                <HeaderButton keyName="convRate">Conv. Rate</HeaderButton>
              </th>
              <th scope="col" className="px-3 py-2.5 text-left">
                {signalHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-zinc-400">
                  No rows match “{filter}”.
                </td>
              </tr>
            ) : (
              sorted.map((row) => (
                <tr key={row.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                  <td className="overflow-hidden px-3 py-2.5 text-ellipsis whitespace-nowrap font-medium text-zinc-200">
                    {row.label}
                  </td>
                  <td className="overflow-hidden px-3 py-2.5">
                    <span className="flex items-center gap-2">
                      <Avatar src={avatarUrl(row.lead.avatarId)} alt={`Portrait of ${row.lead.name}`} size={24} />
                      <span className="min-w-0 overflow-hidden">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-zinc-200">
                          {row.lead.name}
                        </span>
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-zinc-400">
                          {row.lead.company}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-200">
                    {formatInt(row.entered)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-200">
                    {formatInt(row.advanced)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-200">
                    {row.convRate.toFixed(1)}%
                  </td>
                  <td className="overflow-hidden px-3 py-2.5 text-ellipsis whitespace-nowrap">
                    <SignalBadge signal={row.signal} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SignalBadge({ signal }: { signal: CohortRow["signal"] }) {
  if (signal.kind === "share") {
    return <Badge tone="violet">{signal.value.toFixed(1)}% of entries</Badge>;
  }
  if (signal.kind === "baseline") {
    return (
      <Badge tone="neutral" icon={<Minus size={11} aria-hidden="true" />}>
        Baseline cohort
      </Badge>
    );
  }
  if (signal.kind === "up") {
    return (
      <Badge tone="positive" icon={<TrendingUp size={11} aria-hidden="true" />}>
        +{signal.value.toFixed(1)} pts WoW
      </Badge>
    );
  }
  return (
    <Badge tone="warning" icon={<TrendingDown size={11} aria-hidden="true" />}>
      {signal.value.toFixed(1)} pts WoW
    </Badge>
  );
}
