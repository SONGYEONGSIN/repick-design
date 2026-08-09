"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import {
  FOCUS_RING,
  SAMPLE_WINDOW,
  clock,
  dayLabel,
  duration,
  groupThousands,
  mod,
  type Channel,
  type Outcome,
  type SendContext,
} from "./data";

export type ChannelRow = { channel: Channel; outcome: Outcome };

type SortKey = "expected" | "median" | "sample" | "name";

const COLUMNS: { key: SortKey; label: string; hint: string; hideOnMobile: boolean }[] = [
  { key: "name", label: "Channel", hint: "Sort channels by name", hideOnMobile: false },
  {
    key: "expected",
    label: "First reply at your hour",
    hint: "Sort by how soon a reply lands at the hour you picked",
    hideOnMobile: false,
  },
  { key: "median", label: "Median once open", hint: "Sort by median reply time", hideOnMobile: false },
  { key: "sample", label: "Replies measured", hint: "Sort by sample size", hideOnMobile: true },
];

/**
 * The channels, ranked for the hour the reader picked rather than in a fixed marketing order.
 *
 * The default sort is the answer to the page's question — soonest reply first — so the table is
 * already useful before anyone touches it, and sorting only ever re-ranks rows that were all
 * visible to begin with. The "first reply" column is the only computed one: it is the desk wait at
 * that hour plus the channel's own median, and the cell shows both halves so the arithmetic is
 * checkable rather than asserted.
 */
export default function ChannelTable({ rows, ctx }: { rows: ChannelRow[]; ctx: SendContext }) {
  const [sortKey, setSortKey] = useState<SortKey>("expected");
  const [descending, setDescending] = useState(false);

  const sorted = useMemo(() => {
    const value = (row: ChannelRow) => {
      if (sortKey === "expected") return row.outcome.totalMin;
      if (sortKey === "median") return row.channel.medianMin;
      if (sortKey === "sample") return row.channel.sampleN;
      return 0;
    };
    const copy = [...rows];
    copy.sort((a, b) =>
      sortKey === "name"
        ? a.channel.name.localeCompare(b.channel.name)
        : value(a) - value(b),
    );
    return descending ? copy.reverse() : copy;
  }, [rows, sortKey, descending]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setDescending((d) => !d);
      return;
    }
    setSortKey(key);
    setDescending(key === "sample");
  }

  return (
    <div>
      <table className="w-full border-collapse text-left">
        <caption className="caption-top pb-5 text-left text-sm font-normal leading-relaxed text-zinc-300">
          Median time to a <span className="font-semibold text-zinc-100">first human reply</span>,
          measured over the {SAMPLE_WINDOW} and counted from the moment a desk is on shift. Time
          spent waiting for a desk to open is added separately in the second column, never folded
          into the median.
        </caption>
        <thead>
          <tr className="border-b border-zinc-700">
            {COLUMNS.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sortKey === column.key ? (descending ? "descending" : "ascending") : "none"}
                className={`py-2 align-bottom ${column.hideOnMobile ? "hidden md:table-cell" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onSort(column.key)}
                  aria-label={column.hint}
                  className={`inline-flex items-center gap-1.5 rounded text-xs font-semibold uppercase tracking-wide ${FOCUS_RING} ${
                    sortKey === column.key ? "text-amber-300" : "text-zinc-300 hover:text-zinc-100"
                  }`}
                >
                  {column.label}
                  <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 flex-none" />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ channel, outcome }) => (
            <tr key={channel.id} className="border-b border-zinc-800 align-top">
              <th scope="row" className="min-w-0 py-4 pr-3 font-normal">
                <span className="block text-sm font-semibold text-zinc-50">{channel.name}</span>
                <span className="mt-0.5 block break-words text-xs font-normal text-zinc-400">
                  {channel.how}
                </span>
                <span className="mt-1 block text-xs font-normal leading-relaxed text-zinc-300">
                  {channel.bestFor}
                </span>
              </th>
              <td className="py-4 pr-3">
                <span
                  className="block text-sm font-semibold tabular-nums text-amber-300"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  {clock(mod(outcome.replyAbsLocal, 1440))} {dayLabel(outcome.replyAbsLocal, ctx.nowAbsLocal)}
                </span>
                <span className="mt-0.5 block text-xs font-normal tabular-nums text-zinc-300">
                  about {duration(outcome.totalMin)} after you send
                </span>
                <span className="mt-1 block text-xs font-normal leading-relaxed text-zinc-400">
                  {outcome.waitMin === 0
                    ? channel.alwaysOn
                      ? "Answered on the rota, no desk wait"
                      : `${outcome.desk.city} is on shift, no wait`
                    : `Waits ${duration(outcome.waitMin)} for ${outcome.desk.city}, then ${duration(channel.medianMin)}`}
                </span>
              </td>
              <td className="py-4 pr-3">
                <span className="block text-sm font-normal tabular-nums text-zinc-100">
                  {duration(channel.medianMin)}
                </span>
                <span className="mt-0.5 block text-xs font-normal tabular-nums text-zinc-400">
                  9 in 10 within {duration(channel.p90Min)}
                </span>
              </td>
              <td className="hidden py-4 text-sm font-normal tabular-nums text-zinc-300 md:table-cell">
                {groupThousands(channel.sampleN)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
