"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { getOwner, stageMeta, TODAY_ISO, type Deal } from "./data";
import { formatDday, formatKRWCompact } from "./format";
import { Avatar, Badge, Card, HealthBadge } from "./ui";
import type { SortKey, SortState } from "./types";

const COLUMNS: { key: SortKey; label: string; align?: "right"; sortable: boolean }[] = [
  { key: "company", label: "Deal", sortable: true },
  { key: "stage", label: "Stage", sortable: true },
  { key: "probability", label: "Probability", align: "right", sortable: true },
  { key: "amount", label: "Amount", align: "right", sortable: true },
  { key: "closeDate", label: "Closes", align: "right", sortable: true },
];

export function DealList({
  deals,
  sort,
  onSort,
}: {
  deals: Deal[];
  sort: SortState;
  onSort: (key: SortKey) => void;
}) {
  return (
    <Card as="section" aria-labelledby="deal-list-heading" className="overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4">
        <div className="min-w-0">
          <h2 id="deal-list-heading" className="text-sm font-semibold text-zinc-900">
            Deal list
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {deals.length} deals total · Click a column header to sort
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">
            List of deals with account, owner, stage, win probability, amount, close date, and status
          </caption>
          <colgroup>
            <col className="lg:w-[30%]" />
            <col className="lg:w-[14%]" />
            <col className="lg:w-[19%]" />
            <col className="lg:w-[15%]" />
            <col className="lg:w-[11%]" />
            <col className="lg:w-[11%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-100">
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                const ariaSort = active ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={`px-4 py-2.5 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase ${
                      col.align === "right" ? "text-right" : "text-left"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSort(col.key)}
                      className={`inline-flex min-h-[40px] items-center gap-1 rounded focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                        col.align === "right" ? "flex-row-reverse" : ""
                      } ${active ? "text-zinc-900" : "hover:text-zinc-700"}`}
                    >
                      {col.label}
                      {active ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="h-3 w-3" aria-hidden="true" />
                        ) : (
                          <ArrowDown className="h-3 w-3" aria-hidden="true" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3 w-3 text-zinc-300" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th
                scope="col"
                className="px-4 py-2.5 text-right text-[11px] font-semibold tracking-wide text-zinc-500 uppercase"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {deals.map((deal) => {
              const owner = getOwner(deal.ownerId);
              const stage = stageMeta[deal.stage];
              return (
                <tr key={deal.id} className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/70">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={owner.avatarUrl} name={owner.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900">{deal.company}</p>
                        <p className="truncate text-xs text-zinc-500">
                          {deal.title} · {owner.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="border-zinc-200 bg-white text-zinc-600" icon={<span className={`h-1.5 w-1.5 rounded-full ${stage.dotClass}`} aria-hidden="true" />}>
                      {stage.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-zinc-700 tabular-nums">
                    {deal.probability}%
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-zinc-900 tabular-nums">
                    {formatKRWCompact(deal.amount)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm whitespace-nowrap text-zinc-600 tabular-nums">
                    {formatDday(TODAY_ISO, deal.closeDate)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <HealthBadge health={deal.health} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
