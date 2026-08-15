"use client";

import { ArrowLeft, Building2, Calendar, CircleUser, Mail, MessageSquare, Phone, ShieldCheck, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import type { PeriodId } from "./data";
import {
  ACCOUNT_BY_ID,
  AGENT_BY_ID,
  CURRENT_USER,
  conversationFor,
  formatDateTime,
  formatMinutes,
  SLA_TARGET_MIN,
  slaRemainingMin,
  slaState,
  ticketOpenedMs,
  ticketsForAccount,
  unsplashAvatar,
  type Ticket,
} from "./data";
import {
  BORDER,
  FOCUS_VISIBLE,
  NUM,
  PRIORITY_LABEL,
  PRIORITY_TONE,
  STATUS_LABEL,
  STATUS_TONE,
  TEXT_CAPTION,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  TONE,
  TRANSITION,
  cx,
} from "./tokens";
import { Badge, Card, CardHeader, InitialsAvatar } from "./ui";
import RelatedTicketsTable from "./RelatedTicketsTable";
import SlaTrendChart from "./SlaTrendChart";

const CHANNEL_ICON = { email: Mail, chat: MessageSquare, phone: Phone } as const;
const CHANNEL_LABEL = { email: "Email", chat: "Chat", phone: "Phone" } as const;

function HeaderSlaReadout({ t }: { t: Ticket }) {
  const state = slaState(t);
  const remaining = slaRemainingMin(t);
  const target = SLA_TARGET_MIN[t.priority];

  if (state === "met" || state === "missed") {
    const tone = state === "met" ? TONE.good : TONE.bad;
    return (
      <Badge tone={tone} Icon={ShieldCheck}>
        {state === "met" ? `Resolved within SLA (target ${formatMinutes(target)})` : `Resolved past SLA (target ${formatMinutes(target)})`}
      </Badge>
    );
  }
  const tone = state === "breached" ? TONE.bad : state === "at-risk" ? TONE.warn : TONE.good;
  const label = state === "breached" ? `${formatMinutes(remaining ?? 0)} overdue on the ${formatMinutes(target)} target` : `${formatMinutes(remaining ?? 0)} left on the ${formatMinutes(target)} target`;
  return (
    <Badge tone={tone} Icon={ShieldCheck}>
      {label}
    </Badge>
  );
}

export default function DetailPane({
  ticket,
  period,
  onPeriodChange,
  onSelectTicket,
  onFilterAccount,
  onBackToList,
}: {
  ticket: Ticket;
  period: PeriodId;
  onPeriodChange: (p: PeriodId) => void;
  onSelectTicket: (ticketId: string) => void;
  onFilterAccount: (accountName: string) => void;
  onBackToList: () => void;
}) {
  const account = ACCOUNT_BY_ID[ticket.accountId];
  const agent = ticket.assigneeId ? AGENT_BY_ID[ticket.assigneeId] : null;
  const ChannelIcon = CHANNEL_ICON[ticket.channel];
  const related = ticketsForAccount(ticket.accountId).filter((t) => t.id !== ticket.id);
  const conversation = conversationFor(ticket);
  const openedMs = ticketOpenedMs(ticket);

  return (
    <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <button type="button" onClick={onBackToList} className={cx("mb-4 inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium lg:hidden", TEXT_SECONDARY, TRANSITION, FOCUS_VISIBLE)}>
        <ArrowLeft size={15} aria-hidden="true" />
        Back to queue
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className={cx("text-sm font-medium", NUM, TEXT_CAPTION)}>{ticket.id}</span>
        <Badge tone={TONE[PRIORITY_TONE[ticket.priority]]}>{PRIORITY_LABEL[ticket.priority]}</Badge>
        <Badge tone={TONE[STATUS_TONE[ticket.status]]}>{STATUS_LABEL[ticket.status]}</Badge>
        <span className={cx("inline-flex items-center gap-1 text-xs", TEXT_CAPTION)}>
          <ChannelIcon size={13} aria-hidden="true" />
          {CHANNEL_LABEL[ticket.channel]}
        </span>
      </div>

      <h2 className={cx("mt-2 text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>{ticket.subject}</h2>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={() => onFilterAccount(account.name)}
          className={cx("inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-sm font-medium underline-offset-2 hover:underline", "text-teal-700", FOCUS_VISIBLE)}
        >
          <Building2 size={14} aria-hidden="true" />
          {account.name}
        </button>
        <span className={cx("inline-flex items-center gap-1.5 text-xs", TEXT_CAPTION)}>
          {agent ? <InitialsAvatar initials={agent.initials} size={18} /> : <CircleUser size={16} aria-hidden="true" />}
          {agent ? agent.name : "Unassigned"}
        </span>
        <span className={cx("inline-flex items-center gap-1.5 text-xs", NUM, TEXT_CAPTION)}>
          <Calendar size={13} aria-hidden="true" />
          Opened {formatDateTime(openedMs)}
        </span>
        <HeaderSlaReadout t={ticket} />
      </div>

      {/* Single column below xl (a 12-col grid would just stack to col-span-12 there anyway).
          At xl+, the aside gets a guaranteed minimum (300–340px) rather than a strict 4/12
          fraction of a 12-col split, so it never gets so narrow that a status badge in the
          related-tickets table has to overflow its cell — the main column is the one that's
          safe to keep shrinking, since its content (chart, prose) is fully fluid. */}
      <div className="mt-6 grid grid-cols-1 gap-5 xl:[grid-template-columns:minmax(0,1fr)_minmax(300px,340px)]">
        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader as="h3" title="SLA & response trend" description={`${account.name}'s weekly performance across all tickets`} Icon={TrendingUp} />
            <div className="mt-4">
              <SlaTrendChart accountId={ticket.accountId} period={period} onPeriodChange={onPeriodChange} />
            </div>
          </Card>

          <Card>
            <CardHeader as="h3" title="Conversation" description={`${conversation.length} messages on this ticket`} Icon={MessageSquare} />
            <ol className="mt-4 space-y-4">
              {conversation.map((m, i) => {
                const speakerName = m.speaker === "customer" ? account.contactName : agent?.name ?? "Support team";
                const ts = openedMs + i * 37 * 60_000;
                return (
                  <li key={i} className={cx("rounded-xl border p-3.5", BORDER, m.speaker === "agent" ? "bg-teal-50/50" : "bg-zinc-50")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cx("text-sm font-semibold", TEXT_PRIMARY)}>{speakerName}</span>
                      <span className={cx("shrink-0 text-xs", NUM, TEXT_CAPTION)}>{formatDateTime(ts)}</span>
                    </div>
                    <p className={cx("mt-1 text-sm leading-relaxed", TEXT_SECONDARY)}>{m.text}</p>
                  </li>
                );
              })}
            </ol>
          </Card>
        </div>

        <div className="min-w-0 space-y-5">
          <Card>
            <CardHeader as="h3" title="Customer" Icon={Users} />
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Plan</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", TEXT_PRIMARY)}>{account.plan}</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>MRR</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>${account.mrr.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Health score</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", NUM, account.healthScore >= 70 ? "text-emerald-700" : account.healthScore >= 50 ? "text-amber-700" : "text-rose-700")}>{account.healthScore} / 100</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Seats</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{account.seats.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Customer since</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{account.accountAgeMonths} mo.</dd>
              </div>
              <div>
                <dt className={cx("text-[11px] font-medium uppercase tracking-wider", TEXT_CAPTION)}>Open tickets</dt>
                <dd className={cx("mt-0.5 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{ticketsForAccount(ticket.accountId).filter((t) => t.status !== "resolved").length}</dd>
              </div>
            </dl>

            <div className={cx("mt-4 flex items-center gap-2.5 border-t pt-4", BORDER)}>
              {account.contactAvatarId ? (
                <Image src={unsplashAvatar(account.contactAvatarId, 64)} alt={`${account.contactName} profile photo`} width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
              ) : (
                <InitialsAvatar initials={account.contactName.split(" ").map((p) => p[0]).join("")} size={32} />
              )}
              <div className="min-w-0">
                <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{account.contactName}</p>
                <p className={cx("truncate text-xs", TEXT_CAPTION)}>{account.contactRole}</p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader as="h3" title="Other tickets from this account" />
            <div className="mt-3">
              <RelatedTicketsTable tickets={related} onSelect={onSelectTicket} />
            </div>
          </Card>
        </div>
      </div>

      <p className={cx("mt-6 text-xs", TEXT_CAPTION)}>
        Support agent viewing this ticket: <span className="font-medium">{CURRENT_USER.name}</span>, {CURRENT_USER.role}.
      </p>
    </div>
  );
}
