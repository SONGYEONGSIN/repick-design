"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { DEPARTMENTS, FLOWS_BY_PERIOD, PERIODS, flowValue, grandTotal, type Period } from "./data";
import { formatCount } from "./format";
import { FOCUS_RING, Progress } from "./ui";

type SortKey = "from" | "total" | string;

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className="py-2 pr-2 text-right align-middle">
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={`inline-flex min-h-6 w-full items-center justify-end gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

export default function AdjacencyTable({ period }: { period: Period }) {
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [asc, setAsc] = useState(false);

  const flows = FLOWS_BY_PERIOD[period];
  const periodLabel = PERIODS.find((p) => p.value === period)?.label ?? period;
  const grand = grandTotal(flows);

  const rows = useMemo(
    () =>
      DEPARTMENTS.map((dept) => {
        const cells = DEPARTMENTS.map((to) => (to.id === dept.id ? null : flowValue(flows, dept.id, to.id)));
        const total = cells.reduce((s: number, v) => s + (v ?? 0), 0);
        return { dept, cells, total };
      }),
    [flows],
  );

  const columnTotals = useMemo(
    () => DEPARTMENTS.map((to) => DEPARTMENTS.reduce((s, from) => s + (from.id === to.id ? 0 : flowValue(flows, from.id, to.id)), 0)),
    [flows],
  );

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "from") diff = a.dept.name.localeCompare(b.dept.name);
      else if (sortKey === "total") diff = a.total - b.total;
      else {
        const colIndex = DEPARTMENTS.findIndex((d) => d.id === sortKey);
        diff = (a.cells[colIndex] ?? 0) - (b.cells[colIndex] ?? 0);
      }
      return asc ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "from");
    }
  }

  return (
    <div>
      <p className="font-normal text-xs text-zinc-500">
        {formatCount(grand)} handoffs recorded {periodLabel.toLowerCase()} across {DEPARTMENTS.length} departments &mdash; every row&apos;s
        &ldquo;Total out&rdquo; and every column&apos;s &ldquo;Total in&rdquo; foot to the same grand total, below.
      </p>

      {/* Mobile card list (<sm) — the same from&rarr;to&rarr;value data as the matrix, one card per department. */}
      <ul className="mt-3 divide-y divide-zinc-100 sm:hidden">
        {sorted.map((row) => (
          <li key={row.dept.id} className="py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium text-sm text-zinc-900">{row.dept.name}</p>
              <p className="shrink-0 font-semibold tabular-nums text-sm text-zinc-900">{formatCount(row.total)}</p>
            </div>
            <dl className="mt-1.5 grid grid-cols-1 gap-0.5">
              {DEPARTMENTS.map((to, i) =>
                to.id === row.dept.id ? null : (
                  <div key={to.id} className="flex items-center justify-between gap-2 font-normal text-xs text-zinc-600">
                    <dt className="truncate">&rarr; {to.name}</dt>
                    <dd className="shrink-0 tabular-nums text-zinc-700">{formatCount(row.cells[i] ?? 0)}</dd>
                  </div>
                ),
              )}
            </dl>
          </li>
        ))}
      </ul>

      {/* Desktop matrix (sm and up) — the only horizontally-scrolling container on this page. */}
      <div className="relative mt-3 hidden w-full overflow-x-auto sm:block">
        <table className="min-w-[640px] table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Handoff matrix: ticket count routed from each department (rows) to each department (columns), {periodLabel.toLowerCase()}. Activate a
            column header to sort departments by that column&apos;s value.
          </caption>
          <colgroup>
            <col className="w-[22%]" />
            {DEPARTMENTS.map((d) => (
              <col key={d.id} className="w-[11%]" />
            ))}
            <col className="w-[11%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 pr-2 text-left align-middle font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                From &darr; / To &rarr;
              </th>
              {DEPARTMENTS.map((to) => (
                <SortHeader key={to.id} label={to.short} sortKeyId={to.id} sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              ))}
              <SortHeader label="Total out" sortKeyId="total" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((row) => (
              <tr key={row.dept.id} className="hover:bg-zinc-50">
                <th scope="row" className="py-2 pr-2 text-left align-middle font-medium text-[13px] text-zinc-900">
                  {row.dept.name}
                </th>
                {row.cells.map((value, i) => (
                  <td key={DEPARTMENTS[i].id} className="whitespace-nowrap py-2 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-700">
                    {value === null ? <span className="text-zinc-500">&mdash;</span> : formatCount(value)}
                  </td>
                ))}
                <td className="whitespace-nowrap py-2 pr-2 text-right align-middle font-semibold tabular-nums text-[13px] text-zinc-900">
                  {formatCount(row.total)}
                  <Progress value={grand === 0 ? 0 : (row.total / grand) * 100} className="mt-1 hidden lg:block" />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-zinc-200">
              <th scope="row" className="py-2 pr-2 text-left align-middle font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Total in
              </th>
              {columnTotals.map((value, i) => (
                <td key={DEPARTMENTS[i].id} className="whitespace-nowrap py-2 pr-2 text-right align-middle font-medium tabular-nums text-[13px] text-zinc-700">
                  {formatCount(value)}
                </td>
              ))}
              <td className="whitespace-nowrap py-2 pr-2 text-right align-middle font-semibold tabular-nums text-[13px] text-zinc-900">
                {formatCount(grand)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
