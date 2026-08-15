"use client";

import { ArrowDownUp, Mail, MessageSquare, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ACCOUNT_BY_ID,
  AGENT_BY_ID,
  formatMinutes,
  slaRemainingMin,
  slaState,
  TICKETS,
  ticketOpenedMs,
  type Channel,
  type Ticket,
} from "./data";
import {
  ACCENT_SUBTLE,
  BORDER,
  DISPLAY_FONT,
  FOCUS_VISIBLE_INSET,
  NUM,
  PRIORITY_LABEL,
  PRIORITY_RANK,
  PRIORITY_TONE,
  STATUS_LABEL,
  STATUS_TONE,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TONE,
  TRANSITION,
  cx,
  type Status,
} from "./tokens";
import { Badge, InitialsAvatar, ListboxMenu, SegmentedControl } from "./ui";
import { formatDate } from "./data";

const CHANNEL_ICON: Record<Channel, typeof Mail> = { email: Mail, chat: MessageSquare, phone: Phone };
const CHANNEL_LABEL: Record<Channel, string> = { email: "Email", chat: "Chat", phone: "Phone" };

type StatusFilter = Status | "all";
type SortKey = "priority" | "sla" | "opened";

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "sla", label: "SLA remaining" },
  { id: "opened", label: "Recently opened" },
];

function SlaReadout({ t }: { t: Ticket }) {
  const state = slaState(t);
  const remaining = slaRemainingMin(t);
  if (state === "met" || state === "missed") {
    return <span className={cx("text-xs", state === "met" ? "text-emerald-700" : "text-rose-700")}>{state === "met" ? "Met SLA" : "Missed SLA"}</span>;
  }
  const tone = state === "breached" ? "text-rose-700" : state === "at-risk" ? "text-amber-700" : TEXT_CAPTION;
  const label = state === "breached" ? `${formatMinutes(remaining ?? 0)} overdue` : `${formatMinutes(remaining ?? 0)} left`;
  return <span className={cx("text-xs", NUM, tone)}>{label}</span>;
}

export default function TicketRail({
  selectedTicketId,
  onSelectTicket,
  accountFilter,
  onClearAccountFilter,
}: {
  selectedTicketId: string;
  onSelectTicket: (ticketId: string) => void;
  accountFilter: string | null;
  onClearAccountFilter: () => void;
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("priority");

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return TICKETS.filter((t) => {
      if (accountFilter && ACCOUNT_BY_ID[t.accountId].name !== accountFilter) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (q === "") return true;
      const account = ACCOUNT_BY_ID[t.accountId].name.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || account.includes(q);
    });
  }, [q, statusFilter, accountFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sortKey === "priority") return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.createdOffsetMin - b.createdOffsetMin;
      if (sortKey === "sla") {
        const ra = slaRemainingMin(a) ?? Infinity;
        const rb = slaRemainingMin(b) ?? Infinity;
        return ra - rb;
      }
      return a.createdOffsetMin - b.createdOffsetMin;
    });
    return arr;
  }, [filtered, sortKey]);

  const counts = useMemo(() => {
    const base = accountFilter ? TICKETS.filter((t) => ACCOUNT_BY_ID[t.accountId].name === accountFilter) : TICKETS;
    return {
      all: base.length,
      open: base.filter((t) => t.status === "open").length,
      pending: base.filter((t) => t.status === "pending").length,
      escalated: base.filter((t) => t.status === "escalated").length,
      resolved: base.filter((t) => t.status === "resolved").length,
    };
  }, [accountFilter]);

  return (
    <div className="flex h-full flex-col">
      <div className={cx("shrink-0 border-b px-4 pb-3 pt-4", BORDER)}>
        <h1 style={DISPLAY_FONT} className={cx("text-lg font-semibold tracking-tight", TEXT_PRIMARY)}>
          Support queue
        </h1>
        <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
          <span className={NUM}>{counts.all}</span> tickets across Fernbridge Data customers
        </p>

        {accountFilter ? (
          <div className={cx("mt-2 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs", ACCENT_SUBTLE)}>
            <span className="min-w-0 flex-1 truncate">
              Filtered to <span className="font-semibold">{accountFilter}</span>
            </span>
            <button type="button" onClick={onClearAccountFilter} className={cx("shrink-0 rounded px-1.5 py-0.5 font-medium underline-offset-2 hover:underline", FOCUS_VISIBLE_INSET)}>
              Clear
            </button>
          </div>
        ) : null}

        <label className="relative mt-3 block">
          <span className="sr-only">Search tickets by ID, subject, or customer</span>
          <Search size={14} aria-hidden="true" className={cx("pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets…"
            className={cx(
              "h-9 w-full rounded-lg border pl-8 pr-2.5 text-sm outline-none",
              BORDER,
              "bg-white",
              TEXT_PRIMARY,
              "placeholder:text-zinc-400",
              "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-600",
            )}
          />
        </label>

        <div className="mt-3 flex items-center justify-between gap-2">
          <SegmentedControl
            options={[
              { id: "all", label: `All ${counts.all}` },
              { id: "open", label: `Open ${counts.open}` },
              { id: "pending", label: `Pending ${counts.pending}` },
              { id: "escalated", label: `Escalated ${counts.escalated}` },
              { id: "resolved", label: `Resolved ${counts.resolved}` },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            ariaLabel="Filter tickets by status"
          />
        </div>
        <div className="mt-2 flex justify-end">
          <ListboxMenu label="Sort by" options={SORT_OPTIONS} value={sortKey} onChange={setSortKey} triggerIcon={ArrowDownUp} />
        </div>
      </div>

      <div className="min-w-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        {sorted.length === 0 ? (
          <p className={cx("px-4 py-8 text-center text-sm", TEXT_CAPTION)}>No tickets match this filter.</p>
        ) : (
          <div role="listbox" aria-label="Support tickets">
            {sorted.map((t) => {
              const account = ACCOUNT_BY_ID[t.accountId];
              const agent = t.assigneeId ? AGENT_BY_ID[t.assigneeId] : null;
              const ChannelIcon = CHANNEL_ICON[t.channel];
              const selected = t.id === selectedTicketId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => onSelectTicket(t.id)}
                  className={cx(
                    "block w-full min-w-0 border-b px-4 py-3 text-left",
                    BORDER,
                    TRANSITION,
                    FOCUS_VISIBLE_INSET,
                    selected ? "bg-teal-50" : "bg-white hover:bg-zinc-50",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cx("h-2 w-2 shrink-0 rounded-full", TONE[PRIORITY_TONE[t.priority]].dot)} aria-hidden="true" />
                    <span className={cx("shrink-0 text-xs font-medium", TEXT_CAPTION, NUM)}>{t.id}</span>
                    <span className={cx("min-w-0 flex-1 truncate text-sm font-medium", TEXT_PRIMARY)}>{t.subject}</span>
                    {agent ? <InitialsAvatar initials={agent.initials} size={22} className="shrink-0" /> : <InitialsAvatar initials="—" size={22} className="shrink-0" />}
                  </div>
                  <div className="mt-1.5 flex min-w-0 flex-wrap items-center gap-1.5 pl-4">
                    <Badge tone={TONE[PRIORITY_TONE[t.priority]]}>{PRIORITY_LABEL[t.priority]}</Badge>
                    <Badge tone={TONE[STATUS_TONE[t.status]]}>{STATUS_LABEL[t.status]}</Badge>
                    <SlaReadout t={t} />
                    {!agent ? <span className={cx("shrink-0 text-xs", TEXT_CAPTION)}>Unassigned</span> : null}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 pl-4">
                    <span className={cx("min-w-0 flex-1 truncate text-xs", TEXT_CAPTION)}>{account.name}</span>
                    <ChannelIcon size={12} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                    <span className="sr-only">{CHANNEL_LABEL[t.channel]}</span>
                    <span className={cx("shrink-0 whitespace-nowrap text-xs", NUM, TEXT_CAPTION)}>{formatDate(ticketOpenedMs(t))}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
