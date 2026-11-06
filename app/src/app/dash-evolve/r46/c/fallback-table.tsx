"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { CHANNELS, currentValue, periodAvg, periodMax, periodMin } from "./data";
import { formatPctSigned } from "./format";
import { Card, FOCUS_RING, valueTextClass } from "./ui";

type SortKey = "channel" | "current" | "avg30" | "avg90" | "min" | "max";

type Row = {
  id: string;
  name: string;
  category: string;
  current: number;
  avg30: number;
  avg90: number;
  min: number;
  max: number;
};

const MOMENTUM_EPSILON = 1;

function Momentum({ avg30, avg90 }: { avg30: number; avg90: number }) {
  const delta = avg30 - avg90;
  if (delta > MOMENTUM_EPSILON) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-xs text-violet-400">
        <TrendingUp className="h-3 w-3 shrink-0" aria-hidden="true" />
        Improving
      </span>
    );
  }
  if (delta < -MOMENTUM_EPSILON) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-xs text-rose-400">
        <TrendingDown className="h-3 w-3 shrink-0" aria-hidden="true" />
        Worsening
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-medium text-xs text-zinc-400">
      <Minus className="h-3 w-3 shrink-0" aria-hidden="true" />
      Steady
    </span>
  );
}

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  align = "left",
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={`py-2 align-middle ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={`inline-flex min-h-6 items-center gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-200"
        } ${align === "right" ? "flex-row-reverse" : ""}`}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

export default function FallbackTable() {
  // Fully independent of every horizon row's expand/crosshair state and of the
  // board's period/scheme toggles above — sorting here never touches, and is
  // never touched by, anything in the chart section.
  const [sortKey, setSortKey] = useState<SortKey>("current");
  const [asc, setAsc] = useState(true);

  const rows = useMemo<Row[]>(
    () =>
      CHANNELS.map((c) => ({
        id: c.id,
        name: c.name,
        category: c.category,
        current: currentValue(c.id),
        avg30: periodAvg(c.id, 30),
        avg90: periodAvg(c.id, 90),
        min: periodMin(c.id, 90),
        max: periodMax(c.id, 90),
      })),
    [],
  );

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "channel") diff = a.name.localeCompare(b.name);
      else diff = a[sortKey] - b[sortKey];
      return asc ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "channel");
    }
  }

  return (
    <Card className="col-span-12 min-w-0 p-4 sm:p-6" as="section" aria-labelledby="table-heading">
      <h2 id="table-heading" className="font-semibold text-sm text-zinc-50">
        Same data, as numbers
      </h2>
      <p className="mt-1 font-normal text-xs text-zinc-400">
        Every value the horizon strips encode as color and band height, reachable here as plain sortable figures — no toggle needed to see it.
      </p>

      {/* Mobile card list (<sm) */}
      <ul className="mt-3 divide-y divide-white/10 sm:hidden">
        {sorted.map((row) => (
          <li key={row.id} className="py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate font-medium text-sm text-zinc-50">{row.name}</p>
              <span className={`shrink-0 tabular-nums font-semibold text-sm ${valueTextClass(row.current)}`}>{formatPctSigned(row.current)}</span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 font-normal text-[11px] text-zinc-400">
              <span>
                30d avg <span className="font-semibold tabular-nums text-zinc-200">{formatPctSigned(row.avg30)}</span>
              </span>
              <span>
                90d avg <span className="font-semibold tabular-nums text-zinc-200">{formatPctSigned(row.avg90)}</span>
              </span>
              <span>
                Min (90d) <span className="font-semibold tabular-nums text-zinc-200">{formatPctSigned(row.min)}</span>
              </span>
              <span>
                Max (90d) <span className="font-semibold tabular-nums text-zinc-200">{formatPctSigned(row.max)}</span>
              </span>
            </div>
            <div className="mt-2">
              <Momentum avg30={row.avg30} avg90={row.avg90} />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="mt-3 hidden w-full sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only font-normal">Revenue channels with current deviation, 30- and 90-day averages, 90-day min/max and momentum — sortable by any column</caption>
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[13%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <SortHeader label="Channel" sortKeyId="channel" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Current" sortKeyId="current" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" />
              <SortHeader label="30d avg" sortKeyId="avg30" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" />
              <SortHeader label="90d avg" sortKeyId="avg90" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" />
              <SortHeader label="Min 90d" sortKeyId="min" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" />
              <SortHeader label="Max 90d" sortKeyId="max" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="right" />
              <th scope="col" className="py-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-400">
                Momentum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sorted.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                <td className="py-2.5 pr-2 align-middle">
                  <p className="truncate font-medium text-[13px] text-zinc-50">{row.name}</p>
                  <p className="truncate font-normal text-[11px] text-zinc-400">{row.category}</p>
                </td>
                <td className={`whitespace-nowrap py-2.5 pr-2 text-right align-middle font-semibold tabular-nums text-[13px] ${valueTextClass(row.current)}`}>
                  {formatPctSigned(row.current)}
                </td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-300">{formatPctSigned(row.avg30)}</td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-300">{formatPctSigned(row.avg90)}</td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-300">{formatPctSigned(row.min)}</td>
                <td className="whitespace-nowrap py-2.5 pr-2 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-300">{formatPctSigned(row.max)}</td>
                <td className="py-2.5 align-middle">
                  <Momentum avg30={row.avg30} avg90={row.avg90} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
