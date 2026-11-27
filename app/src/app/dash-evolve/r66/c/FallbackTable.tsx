"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Search } from "lucide-react";
import {
  CATEGORY_LABEL,
  grandTotal,
  teamName,
  teamTotal,
  usd,
  pctFmt,
  type ServiceCategory,
  type TeamCost,
  type TeamId,
} from "./data";
import { CategoryBadge, FOCUS } from "./ui";

type SortKey = "name" | "cost";
type SortDir = "asc" | "desc";

function matches(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

/**
 * The required fallback for a Hierarchical/Nested chart (charts.catalog: Treemap is A11y grade
 * C, and the catalog's own guidance is "a collapsible indented tree table as the primary view,
 * the treemap as secondary"). This table is an equally-functional alternate view, not a
 * decorative afterthought: it has its own real sort (by name or cost, toggling `aria-sort`) and
 * its own real text filter, and clicking a service row opens the exact same selection drawer a
 * treemap tile would.
 */
export function FallbackTable({
  teams,
  period,
  highlightId,
  rowRefSetter,
  onSelect,
}: {
  teams: TeamCost[];
  period: string;
  highlightId: string | null;
  rowRefSetter?: (id: string, el: HTMLTableRowElement | null) => void;
  onSelect: (teamId: TeamId, category: ServiceCategory) => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [collapsed, setCollapsed] = useState<Set<TeamId>>(new Set());

  const total = grandTotal(teams);
  const q = query.trim();

  const rows = useMemo(() => {
    const built = teams.map((team) => {
      const teamMatches = q === "" || matches(teamName(team.id), q);
      const services = teamMatches ? team.services : team.services.filter((s) => matches(CATEGORY_LABEL[s.category], q));
      const visible = q === "" || teamMatches || services.length > 0;
      return { team, services, visible, forceExpand: q !== "" && !teamMatches && services.length > 0 };
    });
    const sorted = [...built].sort((a, b) => {
      const av = sortKey === "name" ? teamName(a.team.id) : teamTotal(a.team);
      const bv = sortKey === "name" ? teamName(b.team.id) : teamTotal(b.team);
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [teams, q, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function toggleCollapse(id: TeamId) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allCollapsed = teams.length > 0 && teams.every((t) => collapsed.has(t.id));

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex min-w-0 flex-1 items-center sm:max-w-xs">
          <span className="sr-only">Filter by team or category</span>
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-zinc-400" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by team or category&hellip;"
            className={`${FOCUS} h-10 w-full min-w-0 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm font-normal text-zinc-50 placeholder:text-zinc-400`}
          />
        </label>
        <button
          type="button"
          onClick={() => setCollapsed(allCollapsed ? new Set() : new Set(teams.map((t) => t.id)))}
          className={`${FOCUS} flex h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-medium text-zinc-300 hover:text-zinc-50`}
        >
          {allCollapsed ? <ChevronsUpDown className="h-4 w-4 shrink-0" aria-hidden="true" /> : <ChevronsDownUp className="h-4 w-4 shrink-0" aria-hidden="true" />}
          {allCollapsed ? "Expand all" : "Collapse all"}
        </button>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[520px] table-fixed border-collapse text-sm">
          <caption className="px-3 py-2.5 text-left text-xs font-normal text-zinc-400">
            Cloud spend by team and service, {period.toLowerCase()}. {teams.length} teams, {teams.reduce((s, t) => s + t.services.length, 0)} services,
            total {usd(total)}.
          </caption>
          <colgroup>
            <col style={{ width: "50%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr className="border-t border-white/10 bg-white/[0.03] text-left">
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-3 py-2.5 font-medium text-zinc-400">
                <button type="button" onClick={() => toggleSort("name")} className={`${FOCUS} inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 hover:text-zinc-50`}>
                  Team / service
                  <SortIcon active={sortKey === "name"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("cost")} className="px-3 py-2.5 text-right font-medium text-zinc-400">
                <button type="button" onClick={() => toggleSort("cost")} className={`${FOCUS} inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 hover:text-zinc-50`}>
                  Cost
                  <SortIcon active={sortKey === "cost"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.filter((r) => r.visible).map(({ team, services, forceExpand }) => {
              const expanded = forceExpand || !collapsed.has(team.id);
              const tTotal = teamTotal(team);
              const teamRowId = `row-${team.id}`;
              const isHighlighted = highlightId === teamRowId;
              return (
                <HighlightableRowGroup key={team.id}>
                  <tr
                    id={teamRowId}
                    ref={(el) => rowRefSetter?.(teamRowId, el)}
                    className={`border-t border-white/10 transition-colors ${isHighlighted ? "bg-violet-600/10" : "bg-white/[0.02]"}`}
                  >
                    <th scope="row" className="px-3 py-2.5 font-medium text-zinc-50">
                      <button
                        type="button"
                        onClick={() => toggleCollapse(team.id)}
                        aria-expanded={expanded}
                        className={`${FOCUS} flex min-w-0 items-center gap-1.5 rounded text-left`}
                      >
                        {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />}
                        <span className="min-w-0 truncate">{teamName(team.id)}</span>
                      </button>
                    </th>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums font-semibold text-zinc-50">{usd(tTotal)}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums font-normal text-zinc-400">{pctFmt((tTotal / total) * 100)}</td>
                  </tr>
                  {expanded &&
                    [...services].sort((a, b) => b.cost - a.cost).map((svc) => {
                      const rowId = `row-${team.id}-${svc.category}`;
                      const rowHighlighted = highlightId === rowId;
                      return (
                        <tr
                          key={svc.category}
                          id={rowId}
                          ref={(el) => rowRefSetter?.(rowId, el)}
                          className={`border-t border-white/5 transition-colors ${rowHighlighted ? "bg-violet-600/10" : ""}`}
                        >
                          <th scope="row" className="px-3 py-2 pl-9 font-normal text-zinc-300">
                            <button
                              type="button"
                              onClick={() => onSelect(team.id, svc.category)}
                              className={`${FOCUS} flex min-w-0 items-center gap-1.5 rounded text-left hover:text-zinc-50`}
                            >
                              <CategoryBadge category={svc.category} />
                            </button>
                          </th>
                          <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-normal text-zinc-300">{usd(svc.cost)}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-normal text-zinc-400">{pctFmt((svc.cost / tTotal) * 100)}</td>
                        </tr>
                      );
                    })}
                </HighlightableRowGroup>
              );
            })}
            {rows.every((r) => !r.visible) && (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-sm font-normal text-zinc-400">
                  No teams or services match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowDown className="h-3 w-3 shrink-0 opacity-40" aria-hidden="true" />;
  return dir === "asc" ? <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" /> : <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />;
}

/** `<tbody>` only accepts `<tr>` as a direct child — this fragment-like wrapper keeps the team
 *  row and its service rows together as one unit in the map above without breaking that rule. */
function HighlightableRowGroup({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
