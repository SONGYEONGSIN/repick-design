"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, X } from "lucide-react";
import { TeamId, Ticket, agentById, avatarUrl, teamName, ticketStatus } from "./data";
import { formatAbsolute, formatHours, formatRelative } from "./format";
import { ACCENT, FOCUS_RING, TEXT } from "./tokens";
import { Card, CardHeader, SegmentedControl, StatusBadge, TeamTag, VisuallyHidden } from "./ui";

type StatusFilter = "all" | "resolved" | "breached" | "escalated";
type SortKey = "resolved" | "duration";
type SortDir = "asc" | "desc";

function ticketDurationHours(t: Ticket): number {
  return t.kind === "resolved" ? t.resolutionHours : t.elapsedHours;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 opacity-50" />;
  return dir === "asc" ? <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" /> : <ArrowDown aria-hidden="true" className="h-3.5 w-3.5" />;
}

export function TicketFeed({
  tickets,
  teamFilter,
  onClearTeamFilter,
}: {
  tickets: Ticket[];
  teamFilter: TeamId | null;
  onClearTeamFilter: () => void;
}) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("resolved");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    let rows = tickets;
    if (teamFilter) rows = rows.filter((t) => t.team === teamFilter);
    if (statusFilter !== "all") rows = rows.filter((t) => ticketStatus(t) === statusFilter);
    const sorted = [...rows].sort((a, b) => {
      const av = sortKey === "resolved" ? a.offsetMinutes : ticketDurationHours(a);
      const bv = sortKey === "resolved" ? b.offsetMinutes : ticketDurationHours(b);
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return sorted;
  }, [tickets, teamFilter, statusFilter, sortKey, sortDir]);

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <Card className="flex min-h-0 flex-col">
      <CardHeader
        title="Ticket activity"
        subtitle={`Showing ${filtered.length} of ${tickets.length} tickets${teamFilter ? ` · filtered to ${teamName(teamFilter)}` : ""}`}
      />
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        <SegmentedControl
          ariaLabel="Filter by status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { id: "all", label: "All" },
            { id: "resolved", label: "On track" },
            { id: "breached", label: "Breached" },
            { id: "escalated", label: "Escalated" },
          ]}
        />
        {teamFilter ? (
          <button
            type="button"
            onClick={onClearTeamFilter}
            className={`inline-flex items-center gap-1.5 rounded-lg border ${ACCENT.borderSoft} ${ACCENT.bgSoft} px-3 py-1.5 text-xs font-medium ${ACCENT.text} ${FOCUS_RING}`}
          >
            {teamName(teamFilter)}
            <X aria-hidden="true" className="h-3.5 w-3.5" />
            <VisuallyHidden>Clear team filter</VisuallyHidden>
          </button>
        ) : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto border-t border-white/10 px-2 pb-2" style={{ maxHeight: "640px" }}>
        <table className="w-full min-w-[700px] border-collapse">
          <caption className="sr-only">Recent support ticket activity, sortable by duration and resolved time</caption>
          <thead>
            <tr className={`text-left text-xs ${TEXT.muted}`}>
              <th scope="col" className="w-[320px] px-3 py-2 font-normal">
                Ticket
              </th>
              <th scope="col" className="whitespace-nowrap px-3 py-2 font-normal">
                Status
              </th>
              <th scope="col" aria-sort={ariaSortFor("duration")} className="whitespace-nowrap px-3 py-2 font-normal">
                <button type="button" onClick={() => toggleSort("duration")} className={`inline-flex min-h-6 items-center gap-1 whitespace-nowrap py-1 font-normal ${FOCUS_RING}`}>
                  Duration
                  <SortIcon active={sortKey === "duration"} dir={sortDir} />
                </button>
              </th>
              <th scope="col" aria-sort={ariaSortFor("resolved")} className="whitespace-nowrap px-3 py-2 font-normal">
                <button type="button" onClick={() => toggleSort("resolved")} className={`inline-flex min-h-6 items-center gap-1 whitespace-nowrap py-1 font-normal ${FOCUS_RING}`}>
                  Updated
                  <SortIcon active={sortKey === "resolved"} dir={sortDir} />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => {
              const agent = agentById(t.agentId);
              const status = ticketStatus(t);
              const duration = ticketDurationHours(t);
              return (
                <tr key={t.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <td className="min-w-0 px-3 py-3 align-top">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <Image
                        src={avatarUrl(t.agentId)}
                        alt={agent.name}
                        width={28}
                        height={28}
                        className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className={`line-clamp-2 text-sm font-medium ${TEXT.primary}`}>{t.subject}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className={`text-xs ${TEXT.muted}`}>{t.customer}</span>
                          <TeamTag>{teamName(t.team)}</TeamTag>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top">
                    <StatusBadge status={status} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top text-sm tabular-nums text-zinc-300">
                    {formatHours(duration)}
                    {t.kind === "escalated" ? <span className={`ml-1 text-xs ${TEXT.muted}`}>open</span> : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 align-top text-sm tabular-nums text-zinc-300" title={formatAbsolute(t.offsetMinutes)}>
                    {formatRelative(t.offsetMinutes)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 ? <p className={`px-3 py-8 text-center text-sm ${TEXT.muted}`}>No tickets match the current filters.</p> : null}
      </div>
    </Card>
  );
}
