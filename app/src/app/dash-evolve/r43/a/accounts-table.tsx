"use client";

import { useId, useMemo, useState } from "react";
import type { AccountRow, AccountStage, Period } from "./data";
import { ACCOUNTS, STAGE_LABEL, channelName } from "./data";
import { formatCurrency, formatNumber } from "./format";
import { Avatar, Card, FOCUS_RING, ProgressBar, SortHeader, Sparkline, StageBadge } from "./ui";

type SortKey = "name" | "mrr" | "health" | "lastActivityRank";

const STAGE_FILTERS: { value: AccountStage | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "expanding", label: STAGE_LABEL.expanding },
  { value: "stable", label: STAGE_LABEL.stable },
  { value: "contracting", label: STAGE_LABEL.contracting },
  { value: "trialing", label: STAGE_LABEL.trialing },
  { value: "churned", label: STAGE_LABEL.churned },
];

function compare(a: AccountRow, b: AccountRow, key: SortKey): number {
  if (key === "name") return a.name.localeCompare(b.name);
  return a[key] - b[key];
}

export function AccountsTable({ period }: { period: Period }) {
  const [stageFilter, setStageFilter] = useState<AccountStage | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("mrr");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const headingId = useId();

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = stageFilter === "all" ? ACCOUNTS : ACCOUNTS.filter((a) => a.stage === stageFilter);
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey));
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [stageFilter, sortKey, sortDir]);

  return (
    <Card className="min-w-0 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id={headingId} className="font-semibold text-sm text-zinc-900">
            Accounts Flagged for Review
          </h2>
          <p className="mt-0.5 font-normal text-xs text-zinc-500">
            {formatNumber(rows.length)} of {formatNumber(ACCOUNTS.length)} accounts shown.
          </p>
        </div>
        <div role="group" aria-label="Filter by lifecycle stage" className="flex flex-wrap gap-1.5">
          {STAGE_FILTERS.map((f) => {
            const active = stageFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => setStageFilter(f.value)}
                className={`min-h-7 rounded-full px-2.5 py-1 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
                  active ? "bg-blue-700 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 min-w-0 overflow-x-auto">
        <table aria-labelledby={headingId} className="w-full min-w-[820px] table-fixed border-collapse">
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="Account" active={sortKey === "name"} direction={sortDir} onClick={() => toggleSort("name")} />
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Channel
              </th>
              <th scope="col" className="px-3 py-2.5 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Stage
              </th>
              <SortHeader label="MRR" active={sortKey === "mrr"} direction={sortDir} onClick={() => toggleSort("mrr")} align="right" />
              <th scope="col" className="px-3 py-2.5 text-right font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                6-mo trend
              </th>
              <SortHeader label="Health" active={sortKey === "health"} direction={sortDir} onClick={() => toggleSort("health")} align="right" />
              <SortHeader
                label="Last Activity"
                active={sortKey === "lastActivityRank"}
                direction={sortDir}
                onClick={() => toggleSort("lastActivityRank")}
                align="right"
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((account) => (
              <tr key={account.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                <td className="px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar name={account.name} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-sm text-zinc-900">{account.name}</span>
                      <span className="block truncate font-normal text-xs text-zinc-500">{account.domain}</span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-normal text-sm text-zinc-700">
                  <span className="block truncate">{channelName(account.channelId, period)}</span>
                </td>
                <td className="px-3 py-2.5">
                  <StageBadge stage={account.stage} />
                </td>
                <td className="px-3 py-2.5 text-right font-medium text-sm tabular-nums text-zinc-900">{formatCurrency(account.mrr)}</td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end">
                    <Sparkline
                      values={account.trend}
                      tone={account.stage === "expanding" ? "up" : account.stage === "contracting" || account.stage === "churned" ? "down" : "neutral"}
                    />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    <span className="w-16">
                      <ProgressBar
                        pct={account.health}
                        fillClassName={account.health >= 70 ? "bg-emerald-500" : account.health >= 40 ? "bg-amber-500" : "bg-rose-500"}
                      />
                    </span>
                    <span className="w-7 shrink-0 text-right font-medium text-sm tabular-nums text-zinc-900">{account.health}</span>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-600">{account.lastActivity}</td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center font-normal text-sm text-zinc-500">
                  No accounts match this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
