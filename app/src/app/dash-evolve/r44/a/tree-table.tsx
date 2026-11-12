"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Period, TeamId } from "./data";
import { CATEGORY_META, CATEGORY_ORDER, categoryTotal, resourcesForTeamAndCategory, resourceCost, teamTotal } from "./data";
import { formatCurrency, formatPercent } from "./format";
import { FOCUS_RING } from "./ui";

/**
 * The required keyboard-navigable alternative to the treemap: every category and every resource
 * underneath it, as plain rows with the same figures the tiles show — nothing here is reachable
 * only by hovering or clicking a tile. Expand/collapse state defaults to "all open" so the full
 * breakdown is visible at first paint without needing to interact with anything first; the
 * disclosure buttons are real extra interaction on top of that, not a requirement to see the data.
 */
export function TreeTable({ teamId, teamName, period }: { teamId: TeamId; teamName: string; period: Period }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const total = teamTotal(teamId, period);

  function toggle(categoryId: string) {
    setCollapsed((cur) => ({ ...cur, [categoryId]: !cur[categoryId] }));
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-sm text-zinc-50">Full breakdown — {teamName}</h2>
        <p className="font-normal text-xs text-zinc-400">Collapsible tree, keyboard navigable</p>
      </div>

      <table className="mt-3 w-full table-fixed border-collapse">
        <caption className="sr-only">
          Cost categories and resources for {teamName}, with monthly cost and share of team total. Each category row can be expanded or
          collapsed.
        </caption>
        <colgroup>
          <col style={{ width: "52%" }} />
          <col style={{ width: "28%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <th scope="col" className="px-2 py-2 text-left font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
              Name
            </th>
            <th scope="col" className="px-2 py-2 text-right font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
              Monthly cost
            </th>
            <th scope="col" className="px-2 py-2 text-right font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-400">
              % of team
            </th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_ORDER.map((categoryId) => {
            const category = CATEGORY_META[categoryId];
            const catTotal = categoryTotal(teamId, categoryId, period);
            const catShare = total > 0 ? (catTotal / total) * 100 : 0;
            const isCollapsed = Boolean(collapsed[categoryId]);
            const resources = resourcesForTeamAndCategory(teamId, categoryId).slice().sort((a, b) => resourceCost(b, period) - resourceCost(a, period));
            return (
              <Fragment key={categoryId}>
                <tr className="border-b border-white/5 bg-white/[0.03]">
                  <td className="min-w-0 px-2 py-2">
                    <button
                      type="button"
                      aria-expanded={!isCollapsed}
                      onClick={() => toggle(categoryId)}
                      className={`flex w-full min-w-0 items-center gap-1.5 rounded px-1 text-left font-medium text-sm text-zinc-50 hover:text-amber-400 ${FOCUS_RING}`}
                    >
                      {isCollapsed ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                      <category.icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
                      <span className="truncate">{category.label}</span>
                    </button>
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-sm tabular-nums text-zinc-50">{formatCurrency(catTotal)}</td>
                  <td className="px-2 py-2 text-right font-medium text-xs tabular-nums text-zinc-400">{formatPercent(catShare)}</td>
                </tr>
                {isCollapsed
                  ? null
                  : resources.map((resource) => {
                      const cost = resourceCost(resource, period);
                      const share = total > 0 ? (cost / total) * 100 : 0;
                      return (
                        <tr key={resource.id} className="border-b border-white/5">
                          <td className="min-w-0 px-2 py-1.5 pl-8">
                            <span className="block truncate font-normal text-sm text-zinc-50">{resource.name}</span>
                          </td>
                          <td className="px-2 py-1.5 text-right font-medium text-sm tabular-nums text-zinc-400">{formatCurrency(cost)}</td>
                          <td className="px-2 py-1.5 text-right font-normal text-xs tabular-nums text-zinc-400">{formatPercent(share)}</td>
                        </tr>
                      );
                    })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
