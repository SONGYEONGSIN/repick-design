"use client";

import { useMemo, useState } from "react";
import { EDGES, SPRINT_LABELS, TEAMS, type HandoffEdge, type Period } from "./data";
import { formatSignedPercent } from "./format";
import { Delta, FOCUS_RING, HandoffTypeBadge, SortHeader, TeamLeadAvatar } from "./ui";

/**
 * The mandated accessibility fallback for the arc diagram above: every handoff pair, exact
 * numbers, in a real `<table>` — reachable by scrolling or by Tab like any other content on the
 * page, never gated behind opening a panel or flipping a piece of JS state. The "rework only"
 * toggle below only filters which ROWS this table shows; the table itself is always mounted.
 */

type SortColumn = "from" | "to" | "type" | "weight" | "delta";

interface SortState {
  column: SortColumn;
  direction: "asc" | "desc";
}

function deltaPct(edge: HandoffEdge): number {
  return ((edge.weight.current - edge.weight.prior) / edge.weight.prior) * 100;
}

function valueFor(edge: HandoffEdge, period: Period, column: SortColumn): number | string {
  if (column === "from") return TEAMS[edge.from].name;
  if (column === "to") return TEAMS[edge.to].name;
  if (column === "type") return edge.type;
  if (column === "weight") return edge.weight[period];
  return deltaPct(edge);
}

export function HandoffTable({ period }: { period: Period }) {
  const [sort, setSort] = useState<SortState>({ column: "weight", direction: "desc" });
  const [reworkOnly, setReworkOnly] = useState(false);

  function toggleSort(column: SortColumn) {
    setSort((prev) => (prev.column === column ? { column, direction: prev.direction === "asc" ? "desc" : "asc" } : { column, direction: "desc" }));
  }

  const rows = useMemo(() => {
    const base = EDGES.filter((e) => !reworkOnly || e.type === "rework");
    const sorted = [...base].sort((a, b) => {
      const av = valueFor(a, period, sort.column);
      const bv = valueFor(b, period, sort.column);
      const cmp = typeof av === "string" || typeof bv === "string" ? String(av).localeCompare(String(bv)) : (av as number) - (bv as number);
      return sort.direction === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [period, sort, reworkOnly]);

  const sprintLabel = SPRINT_LABELS[period];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-sm text-zinc-900">Handoff log</h2>
          <p className="mt-0.5 max-w-xl font-normal text-xs text-zinc-500">
            The exact from→to→weight data behind the diagram above — sortable by any column, filterable to rework pairs only.
          </p>
        </div>
        <button
          type="button"
          aria-pressed={reworkOnly}
          onClick={() => setReworkOnly((v) => !v)}
          className={`min-h-9 shrink-0 rounded-lg border px-3 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
            reworkOnly ? "border-amber-200 bg-amber-50 text-amber-700" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
          }`}
        >
          {reworkOnly ? `Rework only (${rows.length} of ${EDGES.length})` : "Show rework only"}
        </button>
      </div>

      {/* Desktop / tablet: real sortable table. */}
      <div className="mt-3 hidden overflow-x-auto sm:block">
        {/* No min-w floor: the colgroup below is already percentage-based, so table-fixed can
            compress to fit the real available width at the narrowest tested desktop viewport
            (1264px) instead of forcing a horizontal scrollbar there. */}
        <table className="w-full table-fixed border-collapse">
          <caption className="mb-2 text-left font-normal text-xs text-zinc-500">
            Fifteen handoff pairs across eight engineering teams for {sprintLabel.toLowerCase()}. Click a column heading to sort; use the toggle
            above to show only rework pairs.
          </caption>
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <SortHeader label="From" active={sort.column === "from"} dir={sort.direction} onSort={() => toggleSort("from")} />
              <SortHeader label="To" active={sort.column === "to"} dir={sort.direction} onSort={() => toggleSort("to")} />
              <SortHeader label="Type" active={sort.column === "type"} dir={sort.direction} onSort={() => toggleSort("type")} />
              <SortHeader label="Weight" active={sort.column === "weight"} dir={sort.direction} onSort={() => toggleSort("weight")} align="right" />
              <SortHeader label="Δ vs prior" active={sort.column === "delta"} dir={sort.direction} onSort={() => toggleSort("delta")} align="right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((edge) => (
              <tr key={edge.id} className="hover:bg-zinc-50">
                <th scope="row" className="px-2 py-2.5 text-left font-medium text-sm text-zinc-900">
                  <span className="flex min-w-0 items-center gap-2">
                    <TeamLeadAvatar teamId={edge.from} />
                    <span className="min-w-0">
                      <span className="block truncate">{TEAMS[edge.from].name}</span>
                      <span className="block truncate font-normal text-xs text-zinc-500">{TEAMS[edge.from].lead.name}</span>
                    </span>
                  </span>
                </th>
                <td className="px-2 py-2.5 text-left font-medium text-sm text-zinc-900">{TEAMS[edge.to].name}</td>
                <td className="px-2 py-2.5 text-left">
                  <HandoffTypeBadge type={edge.type} />
                </td>
                <td className="px-2 py-2.5 text-right font-normal text-sm tabular-nums text-zinc-900">{edge.weight[period]}</td>
                <td className="px-2 py-2.5 text-right">
                  {/* A rising forward handoff is more throughput (good); a rising rework handoff is
                      more rework (bad) — `invertGoodness` flips which direction reads as green only
                      for rework rows, never the arrow itself, which always just reports the sign. */}
                  <Delta value={deltaPct(edge)} invertGoodness={edge.type === "rework"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card list. Five columns cannot fit at 390px without a second horizontal
          scroller on the page, so mobile gets a stacked alternative instead. */}
      <ul className="mt-3 space-y-2 sm:hidden">
        {rows.map((edge) => (
          <li key={edge.id} className="rounded-lg border border-zinc-200 p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <TeamLeadAvatar teamId={edge.from} />
                <p className="min-w-0 truncate font-medium text-sm text-zinc-900">
                  {TEAMS[edge.from].name} <span aria-hidden="true">→</span> {TEAMS[edge.to].name}
                </p>
              </span>
              <HandoffTypeBadge type={edge.type} className="shrink-0" />
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-2">
              <div className="min-w-0">
                <dt className="font-semibold text-[10px] uppercase tracking-[0.06em] text-zinc-500">Weight</dt>
                <dd className="mt-0.5 font-medium text-xs tabular-nums text-zinc-900">{edge.weight[period]} items</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-[10px] uppercase tracking-[0.06em] text-zinc-500">vs prior</dt>
                <dd className="mt-0.5 font-medium text-xs tabular-nums text-zinc-900">{formatSignedPercent(deltaPct(edge))}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      {rows.length === 0 ? (
        <p className="mt-3 rounded-lg bg-zinc-50 px-3 py-6 text-center font-normal text-sm text-zinc-500">No handoffs match this filter.</p>
      ) : null}
    </div>
  );
}
