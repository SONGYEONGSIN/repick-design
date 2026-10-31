"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Pin, CreditCard, Landmark, Banknote, Smartphone } from "lucide-react";
import { TierIcon, StatusBadge, InitialsAvatar, FOCUS_RING } from "./ui";
import { dayTimeLabel, riskTier, STATUS_LABELS, CHANNEL_LABELS, type SignalEvent, type Channel } from "./data";

const CHANNEL_ICON: Record<Channel, typeof CreditCard> = {
  card: CreditCard,
  ach: Landmark,
  wire: Banknote,
  p2p: Smartphone,
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type SortKey = "time" | "amount" | "risk";
type SortDir = "asc" | "desc";

export function FeedTable({
  rows,
  selectedId,
  onSelectRow,
  pinnedIds,
  onTogglePin,
}: {
  rows: SignalEvent[];
  selectedId: string | null;
  onSelectRow: (id: string) => void;
  pinnedIds: Set<string>;
  onTogglePin: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "time") cmp = a.day * 1440 + a.minuteOfDay - (b.day * 1440 + b.minuteOfDay);
      if (sortKey === "amount") cmp = a.amount - b.amount;
      if (sortKey === "risk") cmp = a.riskScore - b.riskScore;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function sortIcon(key: SortKey) {
    if (key !== sortKey) return <ArrowUpDown size={12} className="text-zinc-400" aria-hidden="true" />;
    return sortDir === "asc" ? (
      <ArrowUp size={12} className="text-blue-400" aria-hidden="true" />
    ) : (
      <ArrowDown size={12} className="text-blue-400" aria-hidden="true" />
    );
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    // max-h + internal scroll, not an ever-taller page: at 42 rows this card would otherwise grow
    // far taller than its Filters/Inspector siblings and leave them floating in empty whitespace.
    <div className="max-h-[560px] overflow-auto rounded-lg border border-white/10">
      <table className="min-w-[920px] xl:min-w-0 xl:w-full xl:table-fixed">
        <caption className="sr-only relative">
          Signal feed: {sorted.length} transaction risk signals, sortable by time, amount and risk score.
        </caption>
        {/* Percentages tuned against a 720px floor (the feed column's narrowest width, at the
            1280px xl two-pane tier) with Time and Status given the most headroom since they
            carry the longest fixed strings ("Oct 18·08:00", "Escalated"). */}
        <colgroup>
          <col style={{ width: "17%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "7%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "7%" }} />
        </colgroup>
        <thead className="sticky top-0 z-10 bg-zinc-900">
          <tr className="border-b border-white/10 text-left">
            <th scope="col" aria-sort={ariaSortFor("time")} className="px-3 py-2.5">
              <button type="button" onClick={() => toggleSort("time")} className={`flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400 ${FOCUS_RING}`}>
                Time {sortIcon("time")}
              </button>
            </th>
            <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Event
            </th>
            <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Account
            </th>
            <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Channel
            </th>
            <th scope="col" aria-sort={ariaSortFor("amount")} className="px-3 py-2.5 text-right">
              <button type="button" onClick={() => toggleSort("amount")} className={`ml-auto flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400 ${FOCUS_RING}`}>
                Amount {sortIcon("amount")}
              </button>
            </th>
            <th scope="col" aria-sort={ariaSortFor("risk")} className="px-3 py-2.5 text-right">
              <button type="button" onClick={() => toggleSort("risk")} className={`ml-auto flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-zinc-400 ${FOCUS_RING}`}>
                Risk {sortIcon("risk")}
              </button>
            </th>
            <th scope="col" className="px-3 py-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Status
            </th>
            <th scope="col" className="px-3 py-2.5 text-center text-[11px] font-medium uppercase tracking-wide text-zinc-400">
              Pin
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.map((row) => {
            const tier = riskTier(row.riskScore);
            const ChannelIcon = CHANNEL_ICON[row.channel];
            const isSelected = row.id === selectedId;
            const isPinned = pinnedIds.has(row.id);
            const extraReasons = row.reasons.length - 1;
            return (
              <tr
                key={row.id}
                tabIndex={0}
                onClick={() => onSelectRow(row.id)}
                onKeyDown={(e) => {
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectRow(row.id);
                  }
                }}
                aria-selected={isSelected}
                className={`cursor-pointer outline-none transition-colors focus-visible:bg-blue-500/25 ${
                  isSelected ? "bg-blue-500/10" : "hover:bg-white/[0.03]"
                }`}
              >
                <td className="whitespace-nowrap px-3 py-2.5 text-xs tabular-nums text-zinc-400">
                  {dayTimeLabel(row.day, row.time)}
                </td>
                <td className="px-3 py-2.5 text-xs text-zinc-200">
                  <span className="block truncate">{row.reasons[0]}</span>
                  {extraReasons > 0 ? <span className="text-[11px] text-zinc-400">+{extraReasons} more</span> : null}
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-1.5" title={`${row.accountName} — ${row.accountId}`}>
                    <InitialsAvatar name={row.accountName} size={20} />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-zinc-100">{row.accountName}</p>
                      <p className="truncate text-[11px] text-zinc-400">{row.accountId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-300">
                    <ChannelIcon size={13} className="text-zinc-400" aria-hidden="true" />
                    {CHANNEL_LABELS[row.channel]}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right text-xs font-medium tabular-nums text-zinc-100">
                  {currency.format(row.amount)}
                </td>
                <td className="px-2 py-2.5 text-right">
                  <span className="inline-flex items-center justify-end gap-1 text-xs font-semibold tabular-nums text-zinc-100">
                    <TierIcon tier={tier} size={12} />
                    {row.riskScore}
                  </span>
                </td>
                <td className="px-2 py-2.5">
                  <StatusBadge status={row.status} label={STATUS_LABELS[row.status]} />
                </td>
                <td className="px-1.5 py-2.5 text-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(row.id);
                    }}
                    aria-pressed={isPinned}
                    aria-label={isPinned ? `Unpin ${row.accountName} signal` : `Pin ${row.accountName} signal`}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
                      isPinned ? "text-blue-400" : "text-zinc-400 hover:text-zinc-200"
                    } ${FOCUS_RING}`}
                  >
                    <Pin size={14} className={isPinned ? "fill-current" : ""} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-10 text-center text-xs text-zinc-400">
                No signals match the current filters.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
