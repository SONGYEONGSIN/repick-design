"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpDown, SlidersHorizontal } from "lucide-react";
import type { Account, AccountStatus, PlanId } from "./data";
import { ACCOUNTS, PLAN_LABEL, PLAN_ORDER, fmtUsd } from "./data";
import { Card, CardTitle, FOCUS, InspectableSparkline, PlanBadge, SegmentedControl, StatusBadge } from "./ui";

type SortKey = "company" | "mrr";
type SortDir = "asc" | "desc";
type StatusFilter = AccountStatus | "all";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "at_risk", label: "At risk" },
  { value: "churned", label: "Churned" },
];

function sortValue(a: Account, key: SortKey): string | number {
  return key === "mrr" ? a.mrr : a.company.toLowerCase();
}

/**
 * Sortable + filterable accounts table. Its sort/filter/plan-popover state is entirely local to
 * this component and never touches `pinnedPlanId` (the click-to-pin axis on the plan bridge grid
 * above) — filtering this table to one plan never pins that plan's detail panel, and pinning a
 * plan never filters this table. The Trend column's hover/focus inspector (axis B) is local to
 * each individual cell (see `InspectableSparkline`), so it is fully ephemeral on top of that.
 */
export function AccountsTable() {
  const [sortKey, setSortKey] = useState<SortKey>("mrr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [planFilter, setPlanFilter] = useState<Set<PlanId>>(() => new Set(PLAN_ORDER));
  const [planMenuOpen, setPlanMenuOpen] = useState(false);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "mrr" ? "desc" : "asc");
    }
  }

  function togglePlan(planId: PlanId) {
    setPlanFilter((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) next.delete(planId);
      else next.add(planId);
      return next;
    });
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) return <ArrowUpDown className="h-3 w-3 shrink-0 text-zinc-500" aria-hidden="true" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 shrink-0 text-emerald-700" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 shrink-0 text-emerald-700" aria-hidden="true" />;
  }

  const filtered = ACCOUNTS.filter((a) => (statusFilter === "all" || a.status === statusFilter) && planFilter.has(a.planId));
  const sorted = [...filtered].sort((a, b) => {
    const av = sortValue(a, sortKey);
    const bv = sortValue(b, sortKey);
    const diff = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? diff : -diff;
  });

  return (
    <Card>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>Top accounts</CardTitle>
          <p className="mt-0.5 text-xs font-normal text-zinc-600">
            Showing {sorted.length} of {ACCOUNTS.length} accounts
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <SegmentedControl label="Filter accounts by status" options={STATUS_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
          <div className="relative">
            <button
              type="button"
              onClick={() => setPlanMenuOpen((v) => !v)}
              aria-expanded={planMenuOpen}
              className={`${FOCUS} flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-50`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Plan<span className="sr-only"> filter</span>
              {planFilter.size < PLAN_ORDER.length ? ` (${planFilter.size})` : ""}
            </button>
            {planMenuOpen && (
              <>
                <button type="button" aria-label="Close plan filter" onClick={() => setPlanMenuOpen(false)} className="fixed inset-0 z-40 cursor-default" />
                <div role="menu" aria-label="Filter accounts by plan" className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                  {PLAN_ORDER.map((planId) => {
                    const checked = planFilter.has(planId);
                    return (
                      <label key={planId} className="flex w-full min-w-0 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-normal text-zinc-700 hover:bg-zinc-50">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePlan(planId)}
                          className={`${FOCUS} h-3.5 w-3.5 shrink-0 rounded border-zinc-300 text-emerald-700`}
                        />
                        <span className="min-w-0 flex-1 truncate">{PLAN_LABEL[planId]}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative mt-4 overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse text-left">
          <caption className="sr-only">Top accounts by monthly recurring revenue, with plan, status and an 8-week trend for each.</caption>
          <colgroup>
            <col style={{ width: "28%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" aria-sort={ariaSortFor("company")} className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                <button type="button" onClick={() => toggleSort("company")} className={`-m-1.5 flex items-center gap-1 p-1.5 ${FOCUS}`}>
                  Account {sortIcon("company")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Plan
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                CSM
              </th>
              <th scope="col" aria-sort={ariaSortFor("mrr")} className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                <button type="button" onClick={() => toggleSort("mrr")} className={`-m-1.5 ml-auto flex items-center gap-1 p-1.5 ${FOCUS}`}>
                  MRR {sortIcon("mrr")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Status
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                Trend (8 wks)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((account) => (
              <tr key={account.id} className="hover:bg-zinc-50">
                <td className="px-3 py-2.5 align-middle">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      src={`https://images.unsplash.com/photo-${account.photoId}?q=80&w=64&auto=format&fit=crop`}
                      alt={`Portrait of ${account.contact}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 shrink-0 rounded-full object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-900">{account.company}</span>
                      <span className="block truncate text-xs font-normal text-zinc-600">{account.contact}</span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <PlanBadge label={PLAN_LABEL[account.planId]} />
                </td>
                <td className="truncate px-3 py-2.5 align-middle text-sm font-normal text-zinc-700">{account.csm}</td>
                <td className="whitespace-nowrap px-3 py-2.5 align-middle text-right text-sm font-medium tabular-nums text-zinc-900">{fmtUsd(account.mrr)}</td>
                <td className="px-3 py-2.5 align-middle">
                  <StatusBadge status={account.status} />
                </td>
                <td className="px-3 py-2.5 align-middle">
                  <InspectableSparkline values={account.trend} ariaLabel={`Weekly MRR trend for ${account.company}, currently ${fmtUsd(account.mrr)}`} />
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm font-normal text-zinc-600">
                  No accounts match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <p className="sr-only">Table has 6 columns: account, plan, CSM, MRR, status and trend.</p>
      </div>
    </Card>
  );
}
