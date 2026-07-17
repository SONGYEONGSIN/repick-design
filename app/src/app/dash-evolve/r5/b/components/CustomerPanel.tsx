"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Mail, X } from "lucide-react";
import type { Customer } from "../lib/data";
import { Avatar, Badge, Card, EyebrowLabel, StatusBadge, Tabs } from "./ui";
import { ResponseTrendChart } from "./Sparkline";
import { formatUSD, cn } from "../lib/format";

type Tab = "overview" | "history";
type SortDir = "asc" | "desc";

// Static ISO-ish rank for each "Month DD, YYYY" style date string so the
// history table can sort deterministically without parsing with `new Date`.
const MONTH_RANK: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

function dateRank(date: string): number {
  const match = /^(\w{3})\s+(\d{1,2}),\s+(\d{4})$/.exec(date);
  if (!match) return 0;
  const [, mon, day, year] = match;
  return Number(year) * 10000 + (MONTH_RANK[mon] ?? 0) * 100 + Number(day);
}

export default function CustomerPanel({
  customer,
  onClose,
  className = "",
}: {
  customer: Customer;
  onClose?: () => void;
  className?: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedTickets = [...customer.previousTickets].sort((a, b) =>
    sortDir === "desc" ? dateRank(b.date) - dateRank(a.date) : dateRank(a.date) - dateRank(b.date),
  );

  return (
    <div className={cn("flex h-full w-72 shrink-0 flex-col overflow-y-auto border-l border-zinc-200 bg-zinc-50/60", className)}>
      <div className="flex shrink-0 items-center justify-between px-4 pb-2 pt-4">
        <EyebrowLabel>Customer</EyebrowLabel>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customer details"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 2xl:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="px-4 pb-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Avatar avatarId={customer.avatarId} name={customer.name} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">{customer.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-zinc-500">
                <Mail className="h-3 w-3 shrink-0" aria-hidden="true" />
                {customer.email}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {customer.tags.map((tag) => (
              <Badge key={tag} tone="info">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <div className="px-2">
        <Tabs
          ariaLabel="Customer detail sections"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "overview", label: "Overview" },
            { id: "history", label: "History" },
          ]}
        />
      </div>

      {tab === "overview" ? (
        <div className="space-y-4 px-4 py-4">
          <Card className="p-4">
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Tier</dt>
                <dd className="mt-0.5 font-medium text-zinc-900">{customer.tier}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Lifetime value</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">{formatUSD(customer.ltv)}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Member since</dt>
                <dd className="mt-0.5 font-medium text-zinc-900">{customer.memberSince}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wide text-zinc-500">Orders</dt>
                <dd className="mt-0.5 font-medium tabular-nums text-zinc-900">{customer.orders}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-medium text-zinc-700">First response time — last 7 days</p>
            <div className="mt-2">
              <ResponseTrendChart points={customer.responseTrend} ariaTitle={`${customer.name} first response time trend`} />
            </div>
          </Card>
        </div>
      ) : (
        <div className="px-4 py-4">
          <Card className="overflow-hidden p-0">
            {customer.previousTickets.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-zinc-500">No previous tickets on file.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-left text-xs">
                  <caption className="sr-only">Previous support tickets for {customer.name}</caption>
                  <colgroup>
                    <col className="w-[52%]" />
                    <col className="w-[26%]" />
                    <col className="w-[22%]" />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500">
                      <th scope="col" className="px-3 py-2 font-medium">
                        Ticket
                      </th>
                      <th scope="col" className="px-3 py-2 font-medium">
                        Status
                      </th>
                      <th scope="col" aria-sort={sortDir === "desc" ? "descending" : "ascending"} className="px-3 py-2 font-medium">
                        <button
                          type="button"
                          onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                          className="inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          Date
                          {sortDir === "desc" ? (
                            <ArrowDown className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ArrowUp className="h-3 w-3" aria-hidden="true" />
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTickets.map((t) => (
                      <tr key={t.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50">
                        <td className="px-3 py-2.5 text-zinc-700">
                          <span className="block truncate" title={t.subject}>
                            {t.subject}
                          </span>
                          <span className="text-[11px] tabular-nums text-zinc-500">{t.id}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-500">{t.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
