"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Pin } from "lucide-react";
import { Avatar, FOCUS_RING, PriorityTag, SentimentBadge, StatusBadge, Tabs } from "./ui";
import { FEED_ITEMS, TERM_BY_ID, type FeedItem, type TicketStatus } from "./data";
import { formatHoursAgo } from "./format";

type SortKey = "hoursAgo" | "sentimentScore";
type TabId = "all" | TicketStatus;

function PinButton({
  item,
  pinned,
  onPin,
}: {
  item: FeedItem;
  pinned: boolean;
  onPin: (id: string) => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-label={pinned ? `${item.id} is the pinned ticket` : `Pin ${item.id}`}
      onClick={() => onPin(item.id)}
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md motion-safe:transition-colors ${FOCUS_RING} ${
        pinned ? "bg-rose-700 text-white" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
      }`}
    >
      <Pin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </button>
  );
}

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  className = "",
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={`py-2 text-left align-middle ${className}`}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={`inline-flex min-h-6 items-center gap-1 rounded px-1 py-0.5 font-medium text-[11px] uppercase tracking-[0.06em] motion-safe:transition-colors ${FOCUS_RING} ${
          active ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
        }`}
      >
        {label}
        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
      </button>
    </th>
  );
}

/** The macro shell's main event: a central, sortable, filterable activity stream.
 *  `pinnedId` / `onPin` and `selectedTermId` are owned by the page and each drive a
 *  separate widget elsewhere — this component only reads `selectedTermId` to render a
 *  non-color "matches theme" chip, it never writes it, keeping the two selection
 *  states fully independent.
 *
 *  Below `sm` this renders as a wrapping card list instead of the fixed-width table:
 *  at ~326px of content width there isn't room for a status badge + sentiment badge +
 *  priority dot + relative time to sit in four adjacent fixed columns without text
 *  spilling across column boundaries. `flex-wrap` lets that row of badges reflow onto
 *  a second line instead of overlapping, which a percentage `colgroup` can't do. */
export default function FeedbackFeed({
  pinnedId,
  onPin,
  selectedTermId,
}: {
  pinnedId: string;
  onPin: (id: string) => void;
  selectedTermId: string;
}) {
  const [tab, setTab] = useState<TabId>("all");
  const [sortKey, setSortKey] = useState<SortKey>("hoursAgo");
  const [asc, setAsc] = useState(true);

  const counts = useMemo(
    () => ({
      all: FEED_ITEMS.length,
      open: FEED_ITEMS.filter((t) => t.status === "open").length,
      escalated: FEED_ITEMS.filter((t) => t.status === "escalated").length,
      resolved: FEED_ITEMS.filter((t) => t.status === "resolved").length,
    }),
    [],
  );

  const rows = tab === "all" ? FEED_ITEMS : FEED_ITEMS.filter((t) => t.status === tab);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [rows, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setAsc((v) => !v);
    } else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const selectedTermLabel = TERM_BY_ID[selectedTermId]?.label;

  return (
    <div>
      <Tabs<TabId>
        ariaLabel="Filter feedback feed by status"
        value={tab}
        onChange={setTab}
        options={[
          { id: "all", label: `All (${counts.all})` },
          { id: "open", label: `Open (${counts.open})` },
          { id: "escalated", label: `Escalated (${counts.escalated})` },
          { id: "resolved", label: `Resolved (${counts.resolved})` },
        ]}
      />

      {/* Mobile card list (<640px) */}
      <ul className="mt-3 divide-y divide-zinc-100 sm:hidden">
        {sorted.map((item: FeedItem) => {
          const pinned = item.id === pinnedId;
          const matchesTerm = item.themeIds.includes(selectedTermId);
          return (
            <li key={item.id} className={pinned ? "bg-rose-50" : ""}>
              <div className="flex items-start gap-2 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[13px] text-zinc-900">{item.subject}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[11px] text-zinc-600">{item.id}</span>
                    {matchesTerm ? (
                      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 font-medium text-[11px] text-zinc-600">
                        Matches &ldquo;{selectedTermLabel}&rdquo;
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1.5 flex min-w-0 items-center gap-2">
                    <Avatar initials={item.initials} className="h-6 w-6 shrink-0 text-[10px]" />
                    <span className="truncate font-normal text-[13px] text-zinc-700">{item.customer}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <SentimentBadge sentiment={item.sentiment} />
                    <PriorityTag priority={item.priority} />
                    <span className="font-normal text-[11px] tabular-nums text-zinc-600">{formatHoursAgo(item.hoursAgo)}</span>
                  </div>
                </div>
                <PinButton item={item} pinned={pinned} onPin={onPin} />
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="mt-3 hidden w-full sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Feedback feed, filterable by status and sortable by time or sentiment score</caption>
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="hidden w-[10%] md:table-column" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[6%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Ticket
              </th>
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Customer
              </th>
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Status
              </th>
              <th scope="col" className="hidden py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500 md:table-cell">
                Priority
              </th>
              <SortHeader label="Sentiment" sortKeyId="sentimentScore" sortKey={sortKey} asc={asc} onToggle={toggleSort} className="pr-2" />
              <SortHeader label="Reported" sortKeyId="hoursAgo" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <th scope="col" className="py-2 text-right font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                <span className="sr-only">Pin</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {sorted.map((item: FeedItem) => {
              const pinned = item.id === pinnedId;
              const matchesTerm = item.themeIds.includes(selectedTermId);
              return (
                <tr key={item.id} className={pinned ? "bg-rose-50" : "hover:bg-zinc-50"}>
                  <td className="py-2.5 pr-2 align-middle">
                    <p className="truncate font-medium text-[13px] text-zinc-900">{item.subject}</p>
                    <p className="mt-0.5 flex min-w-0 items-center gap-1.5 font-normal text-[11px] text-zinc-600">
                      <span className="truncate font-mono">{item.id}</span>
                      {matchesTerm ? (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 font-medium text-zinc-600">
                          Matches &ldquo;{selectedTermLabel}&rdquo;
                        </span>
                      ) : null}
                    </p>
                  </td>
                  <td className="truncate py-2.5 pr-2 align-middle">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar initials={item.initials} className="h-6 w-6 shrink-0 text-[10px]" />
                      <span className="truncate font-normal text-[13px] text-zinc-700">{item.customer}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2 align-middle">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="hidden py-2.5 pr-2 align-middle md:table-cell">
                    <PriorityTag priority={item.priority} />
                  </td>
                  <td className="py-2.5 pr-2 align-middle">
                    <SentimentBadge sentiment={item.sentiment} />
                  </td>
                  <td className="whitespace-nowrap py-2.5 pr-2 align-middle font-normal text-[13px] tabular-nums text-zinc-600">
                    {formatHoursAgo(item.hoursAgo)}
                  </td>
                  <td className="py-2.5 text-right align-middle">
                    <PinButton item={item} pinned={pinned} onPin={onPin} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
