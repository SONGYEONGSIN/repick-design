"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Pin, PinOff } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { accountAvatar, accountById, EVENTS, EVENT_STATUS_META, EVENT_TYPE_META, eventStatusKey, formatUSD, type EventType, type LedgerEvent } from "./data";
import { BORDER, FOCUS, HOVER_ROW, NUM, PANEL_BG, TEXT_AUX, TEXT_PRIMARY, TONE_BADGE, TRANSITION, cx } from "./tokens";

type SortKey = "amount" | "recency";
type SortDir = "asc" | "desc";
type Filter = "all" | EventType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "charge", label: "Charges" },
  { id: "refund", label: "Refunds" },
  { id: "payout", label: "Payouts" },
  { id: "dispute", label: "Disputes" },
];

export default function LedgerFeed({ pinnedAccountId, onPin }: { pinnedAccountId: string | null; onPin: (id: string | null) => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recency");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  // Ephemeral only — never written to any prop passed to a sibling widget. It exists purely
  // so a keyboard or mouse user gets a quick preview of the row under focus; it resets the
  // instant focus/hover leaves and has no effect on `pinnedAccountId` above.
  const [hoverRowId, setHoverRowId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const filtered = EVENTS.filter((e) => filter === "all" || e.type === filter);
    const withIndex = filtered.map((e, i) => ({ e, recencyIndex: i }));
    const sorted = [...withIndex].sort((a, b) => {
      const av = sortKey === "amount" ? a.e.amount : a.recencyIndex;
      const bv = sortKey === "amount" ? b.e.amount : b.recencyIndex;
      return (av - bv) * (sortDir === "asc" ? 1 : -1);
    });
    return sorted.map((x) => x.e);
  }, [filter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "amount" ? "desc" : "asc");
    }
  }

  const hovered = hoverRowId ? EVENTS.find((e) => e.id === hoverRowId) : null;
  const hoveredAccount = hovered ? accountById(hovered.accountId) : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-xs font-normal leading-relaxed", TEXT_AUX)}>{`${rows.length} events in view`}</p>
        <div role="group" aria-label="Filter the ledger by event type" className="inline-flex flex-wrap items-center gap-0.5 rounded-lg border border-zinc-200 bg-zinc-100 p-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cx("h-8 rounded-md px-2.5 text-xs", TRANSITION, FOCUS, filter === f.id ? "bg-violet-700 font-semibold text-white" : cx("font-medium", TEXT_AUX, "hover:bg-white hover:text-zinc-900"))}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ephemeral inspector: a single reserved readout line, not a floating tooltip, so it
          reads clearly at a glance and never overlaps neighboring rows. It changes on hover
          or keyboard focus and clears on leave/blur — it never touches `pinnedAccountId`. */}
      <div aria-live="polite" className={cx("mt-2 min-h-[1.75rem] rounded-lg border px-2.5 py-1.5 text-[11px] font-normal", BORDER, TEXT_AUX, "bg-zinc-50")}>
        {hovered && hoveredAccount
          ? `Quick view — ${hoveredAccount.name} · ${hoveredAccount.region} · ${hoveredAccount.channel} · ${hoveredAccount.tier} plan`
          : "Hover or focus a row for a quick account preview — it doesn't change anything on the page."}
      </div>

      {/* `relative` here anchors the sr-only caption and header cell below: without a
          positioned ancestor inside this scrolling wrapper, an absolutely-positioned
          sr-only element's containing-block lookup can walk out to the viewport and
          get sized against it instead — the source of the 390px page-overflow bug the
          grid-craft rules warn about. */}
      <div className="relative mt-2 overflow-x-auto rounded-xl border border-zinc-200">
        <table className="w-full min-w-[300px] table-fixed text-sm">
          <caption className="sr-only">Recent ledger events, filterable by type and sortable by amount or recency</caption>
          <colgroup>
            <col className="w-[52%] sm:w-[48%]" />
            <col className="w-[22%]" />
            <col className="hidden sm:table-column sm:w-[16%]" />
            <col style={{ width: 52 }} />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER, PANEL_BG)}>
              <th scope="col" className={cx("px-3 py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Event
              </th>
              <SortHeader label="Amount" active={sortKey === "amount"} dir={sortDir} onClick={() => toggleSort("amount")} />
              <SortHeader label="When" active={sortKey === "recency"} dir={sortDir} onClick={() => toggleSort("recency")} className="hidden sm:table-cell" />
              <th scope="col" className="px-1 py-2 text-right text-[11px] font-medium uppercase tracking-[0.06em]">
                <span className="sr-only">Pin account</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((e) => {
              const meta = EVENT_STATUS_META[eventStatusKey(e)];
              const account = accountById(e.accountId);
              const isPinned = pinnedAccountId === e.accountId;
              return (
                <tr
                  key={e.id}
                  onMouseEnter={() => setHoverRowId(e.id)}
                  onMouseLeave={() => setHoverRowId((id) => (id === e.id ? null : id))}
                  className={cx(HOVER_ROW, TRANSITION, isPinned && "bg-violet-50/60")}
                >
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      {account ? (
                        <Image
                          src={`https://images.unsplash.com/photo-${accountAvatar(account.id)}?w=48&h=48&fit=crop&crop=faces`}
                          alt=""
                          width={22}
                          height={22}
                          className="h-[22px] w-[22px] shrink-0 rounded-full bg-zinc-100 object-cover"
                        />
                      ) : null}
                      <div className="min-w-0">
                        <p className={cx("truncate text-[12.5px] font-medium", TEXT_PRIMARY)}>
                          <span className={cx("mr-1.5 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium align-middle", TONE_BADGE[meta.tone])}>
                            <meta.Icon size={10} aria-hidden="true" />
                            {`${EVENT_TYPE_META[e.type].label} · ${meta.label}`}
                          </span>
                        </p>
                        <p className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{`${e.description} — ${account?.name ?? "Unknown account"}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cx("px-2 py-2.5 text-right text-[12.5px] font-normal whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUSD(e.amount)}</td>
                  <td className={cx("hidden px-2 py-2.5 text-right text-[12px] font-normal whitespace-nowrap sm:table-cell", NUM, TEXT_AUX)} title={e.timeFull}>
                    {e.timeShort}
                  </td>
                  <td className="px-1 py-1.5 text-right">
                    <button
                      type="button"
                      onFocus={() => setHoverRowId(e.id)}
                      onBlur={() => setHoverRowId((id) => (id === e.id ? null : id))}
                      onClick={() => onPin(isPinned ? null : e.accountId)}
                      aria-pressed={isPinned}
                      className={cx(
                        "grid h-9 w-9 place-items-center rounded-lg",
                        TRANSITION,
                        FOCUS,
                        isPinned ? "bg-violet-700 text-white" : cx(TEXT_AUX, "hover:bg-zinc-100 hover:text-zinc-900"),
                      )}
                    >
                      {isPinned ? <PinOff size={14} aria-hidden="true" /> : <Pin size={14} aria-hidden="true" />}
                      <span className="sr-only">{isPinned ? `Unpin ${account?.name ?? "account"}` : `Pin ${account?.name ?? "account"} to the summary rail`}</span>
                    </button>
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

function SortHeader({ label, active, dir, onClick, className }: { label: string; active: boolean; dir: SortDir; onClick: () => void; className?: string }) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className={cx("px-1 py-1 text-right", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cx("inline-flex h-8 w-full items-center justify-end gap-1 rounded-md px-2 text-[11px] font-medium uppercase tracking-[0.06em]", TRANSITION, FOCUS, active ? "text-violet-700" : cx(TEXT_AUX, "hover:text-zinc-900"))}
      >
        {label}
        <Icon size={12} aria-hidden="true" />
      </button>
    </th>
  );
}

export type { LedgerEvent };
