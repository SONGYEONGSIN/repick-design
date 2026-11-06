"use client";

import { useState } from "react";
import type { Period, TeamId } from "./data";
import { TEAM_META, TEAM_ORDER, budgetVariancePct, resourcesForTeam, teamTotal } from "./data";
import { formatCurrency } from "./format";
import { Card, Delta, FOCUS_RING, ProgressBar, Sparkline, Tabs } from "./ui";

type SortMode = "spend" | "variance";

/**
 * The master list half of the master-detail shell. Selecting a team here re-scopes every widget
 * in the detail area (treemap, tree-table, resources table) to that team — a single, page-level
 * selection, kept deliberately separate from the two independent tier-1 selections (treemap drill
 * and table pin) that live further down this file tree.
 */
export function TeamsRail({
  period,
  activeTeamId,
  onSelect,
}: {
  period: Period;
  activeTeamId: TeamId;
  onSelect: (teamId: TeamId) => void;
}) {
  const [sortMode, setSortMode] = useState<SortMode>("spend");

  const rows = TEAM_ORDER.map((id) => {
    const team = TEAM_META[id];
    const spend = teamTotal(id, period);
    const lastMonthSpend = teamTotal(id, "last-month");
    const thisMonthSpend = teamTotal(id, "this-month");
    const variance = budgetVariancePct(spend, team.monthlyBudget);
    return { id, team, spend, variance, usagePct: (spend / team.monthlyBudget) * 100, trend: [lastMonthSpend, thisMonthSpend] };
  });

  const sortedRows =
    sortMode === "spend" ? [...rows].sort((a, b) => b.spend - a.spend) : [...rows].sort((a, b) => b.variance - a.variance);

  return (
    <Card as="section" ariaLabelledBy="teams-rail-heading" className="min-w-0 p-4 sm:p-5">
      <h2 id="teams-rail-heading" className="font-semibold text-sm text-zinc-50">
        Teams
      </h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-400">Select a team to scope the breakdown on the right.</p>

      <div className="mt-3">
        <Tabs
          idBase="teams-sort"
          ariaLabel="Sort teams"
          tabs={[
            { value: "spend", label: "By spend" },
            { value: "variance", label: "By budget variance" },
          ]}
          value={sortMode}
          onChange={setSortMode}
        />
      </div>

      <ul className="mt-3 space-y-1.5">
        {sortedRows.map(({ id, team, spend, variance, usagePct, trend }) => {
          const Icon = team.icon;
          const active = id === activeTeamId;
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect(id)}
                className={`flex w-full min-w-0 flex-col gap-2 rounded-lg border px-3 py-2.5 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  active ? "border-amber-400/40 bg-amber-400/10" : "border-transparent hover:bg-white/5"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-amber-400" : "text-zinc-400"}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate font-medium text-sm text-zinc-50">{team.name}</span>
                  <span className="shrink-0 font-normal text-[11px] text-zinc-400">{resourcesForTeam(id).length} resources</span>
                </span>
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm tabular-nums text-zinc-50">{formatCurrency(spend)}</span>
                    <Delta value={variance} invertGoodness />
                  </span>
                  <Sparkline values={trend} className="shrink-0" />
                </span>
                <ProgressBar pct={usagePct} fillClassName={usagePct > 100 ? "bg-rose-400" : "bg-amber-400"} />
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
