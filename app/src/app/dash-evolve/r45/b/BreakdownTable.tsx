"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { REGIONS, TIERS, grandTotal, regionTotal, tierTotal, type TierId } from "./data";
import { formatArr, formatArrExact } from "./format";
import { Card, FOCUS_RING, cn } from "./ui";

type SortKey = "region" | TierId | "total";

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  align = "right",
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
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cn("py-2 align-middle", align === "right" ? "text-right" : "text-left")}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cn(
          "inline-flex min-h-6 items-center gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors",
          FOCUS_RING,
          active ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-300",
          align === "right" ? "flex-row-reverse" : "",
        )}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

/** The accessibility-mandated fallback for the Mekko board above: the same region × tier
 *  figures as plain, sortable, keyboard-navigable semantic data — present in the DOM at first
 *  paint, with no JS state change required to reach it. Independent of `pinnedRegionId`: sorting
 *  this table never touches the spotlight card or the board. */
export function BreakdownTable() {
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => REGIONS.map((r) => ({ region: r, total: regionTotal(r) })), []);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let diff = 0;
      if (sortKey === "region") diff = a.region.name.localeCompare(b.region.name);
      else if (sortKey === "total") diff = a.total - b.total;
      else diff = a.region.tiers[sortKey] - b.region.tiers[sortKey];
      return asc ? diff : -diff;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(key === "region");
    }
  }

  return (
    <Card as="section" aria-labelledby="breakdown-heading" className="min-w-0 p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="breakdown-heading" className="font-semibold text-sm text-zinc-50">
          Full region × tier breakdown
        </h2>
        <p className="font-normal text-xs text-zinc-400">Accessible table form of the board above — sortable by any column.</p>
      </div>

      {/* Mobile card list (below sm) */}
      <ul className="mt-3 divide-y divide-white/10 sm:hidden">
        {sorted.map(({ region, total }) => (
          <li key={region.id} className="py-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate font-medium text-sm text-zinc-50">{region.name}</p>
              <p className="shrink-0 font-semibold text-sm tabular-nums text-zinc-50">{formatArr(total)}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {TIERS.map((t) => (
                <div key={t.id} className="flex items-center gap-1.5">
                  <span className={cn("inline-block h-2 w-2 shrink-0 rounded-sm", t.swatch)} aria-hidden="true" />
                  <span className="truncate font-normal text-[11px] text-zinc-400">{t.label}</span>
                  <span className="ml-auto shrink-0 font-medium text-[11px] tabular-nums text-zinc-200">{formatArr(region.tiers[t.id])}</span>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="mt-3 hidden w-full sm:block">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Annual recurring revenue by region and plan tier, in US dollars, for Q4 2026. Sortable by region name, any tier column, or total.
          </caption>
          <thead>
            <tr className="border-b border-white/10">
              <SortHeader label="Region" sortKeyId="region" sortKey={sortKey} asc={asc} onToggle={toggleSort} align="left" />
              {TIERS.map((t) => (
                <SortHeader key={t.id} label={t.label} sortKeyId={t.id} sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              ))}
              <SortHeader label="Total" sortKeyId="total" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sorted.map(({ region, total }) => (
              <tr key={region.id} className="hover:bg-white/5">
                <th scope="row" className="py-2.5 pr-3 text-left align-middle font-medium text-[13px] text-zinc-100">
                  {region.name}
                </th>
                {TIERS.map((t) => (
                  <td key={t.id} className="whitespace-nowrap py-2.5 pl-3 text-right align-middle font-normal tabular-nums text-[13px] text-zinc-300">
                    {formatArrExact(region.tiers[t.id])}
                  </td>
                ))}
                <td className="whitespace-nowrap py-2.5 pl-3 text-right align-middle font-medium tabular-nums text-[13px] text-zinc-50">{formatArrExact(total)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10">
              <th scope="row" className="py-2.5 pr-3 text-left align-middle font-semibold text-[13px] text-zinc-50">
                Total
              </th>
              {TIERS.map((t) => (
                <td key={t.id} className="whitespace-nowrap py-2.5 pl-3 text-right align-middle font-semibold tabular-nums text-[13px] text-zinc-50">
                  {formatArrExact(tierTotal(t.id))}
                </td>
              ))}
              <td className="whitespace-nowrap py-2.5 pl-3 text-right align-middle font-semibold tabular-nums text-[13px] text-zinc-50">{formatArrExact(grandTotal())}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  );
}
