"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { TeamId, TICKETS, teamName, ticketStatus } from "./data";
import { dailyVolume, escalatedCount, overallAvgResolutionHours, overallCompliance, teamSummary } from "./stats";
import { formatCount, formatHours, formatPercent } from "./format";
import { FOCUS_RING, TEXT } from "./tokens";
import { Card, Progress, Sparkline, Tabs, VisuallyHidden } from "./ui";

function KpiTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <p className={`text-[11px] ${TEXT.muted}`}>{label}</p>
      <p className={`mt-1 text-lg font-semibold tabular-nums ${TEXT.primary}`}>{value}</p>
      {sub ? <p className={`mt-0.5 text-[11px] tabular-nums ${TEXT.muted}`}>{sub}</p> : null}
    </div>
  );
}

export function DetailPanel({ detailTeam, onClearDetail }: { detailTeam: TeamId | null; onClearDetail: () => void }) {
  const [tab, setTab] = useState<"summary" | "breaches">("summary");

  const compliance = overallCompliance();
  const avgResolution = overallAvgResolutionHours();
  const openEscalated = escalatedCount();
  const volume = dailyVolume();

  const scopedSummary = detailTeam ? teamSummary(detailTeam) : null;
  const breachedTickets = TICKETS.filter((t) => ticketStatus(t) === "breached" && (!detailTeam || t.team === detailTeam));

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <p className={`px-1 text-xs font-medium ${TEXT.muted}`}>SLA pulse, last 60 tickets</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <KpiTile label="Resolved" value={formatCount(compliance.total)} sub={`${compliance.resolvedOk} on track`} />
          <KpiTile label="Escalated now" value={formatCount(openEscalated)} sub="awaiting resolution" />
          <div className="col-span-2 rounded-lg border border-white/10 bg-white/[0.02] p-3">
            <Progress value={compliance.percent} label="SLA compliance" />
            <p className={`mt-2 text-lg font-semibold tabular-nums ${TEXT.primary}`}>{formatPercent(compliance.percent)}</p>
            <p className={`text-[11px] tabular-nums ${TEXT.muted}`}>{compliance.breached} breached of {compliance.total}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <div>
            <p className={`text-[11px] ${TEXT.muted}`}>Avg resolution</p>
            <p className={`mt-1 text-lg font-semibold tabular-nums ${TEXT.primary}`}>{formatHours(avgResolution)}</p>
            <p className={`text-[11px] ${TEXT.muted}`}>4-day volume</p>
          </div>
          <Sparkline values={volume} width={84} height={28} />
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between gap-2 px-5 pt-5">
          <div className="min-w-0">
            <h2 className={`text-sm font-semibold ${TEXT.primary}`}>Team detail</h2>
            <p className={`mt-0.5 text-xs ${TEXT.muted}`}>{detailTeam ? `Pinned to ${teamName(detailTeam)}` : "Select a team from the box plot"}</p>
          </div>
          {detailTeam ? (
            <button
              type="button"
              onClick={onClearDetail}
              className={`inline-flex shrink-0 items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs font-medium ${TEXT.muted} hover:text-zinc-50 ${FOCUS_RING}`}
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
              <VisuallyHidden>Clear pinned team</VisuallyHidden>
              Clear
            </button>
          ) : null}
        </div>
        <div className="mt-3">
          <Tabs
            ariaLabel="Team detail view"
            value={tab}
            onChange={(v) => setTab(v as "summary" | "breaches")}
            tabs={[
              { id: "summary", label: "Summary" },
              { id: "breaches", label: `Breach log (${breachedTickets.length})` },
            ]}
          />
        </div>

        {tab === "summary" ? (
          <div className="grid grid-cols-2 gap-3 p-5">
            <KpiTile label="Median resolution" value={scopedSummary ? formatHours(scopedSummary.median) : "—"} />
            <KpiTile label="Ticket count" value={scopedSummary ? formatCount(scopedSummary.ticketCount) : formatCount(compliance.total + openEscalated)} />
            <KpiTile label="Breached SLA" value={scopedSummary ? formatCount(scopedSummary.breachCount) : formatCount(compliance.breached)} />
            <KpiTile
              label="Still escalated"
              value={scopedSummary ? formatCount(scopedSummary.escalatedCount) : formatCount(openEscalated)}
            />
          </div>
        ) : (
          <ul className="flex flex-col gap-2 p-5">
            {breachedTickets.length === 0 ? (
              <li className={`text-sm ${TEXT.muted}`}>No SLA breaches in this scope.</li>
            ) : (
              breachedTickets.map((t) => (
                <li key={t.id} className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2">
                  <p className={`line-clamp-2 text-sm font-medium ${TEXT.primary}`}>{t.subject}</p>
                  <p className={`mt-0.5 text-xs tabular-nums ${TEXT.muted}`}>
                    {teamName(t.team)} · {t.kind === "resolved" ? formatHours(t.resolutionHours) : formatHours(t.elapsedHours)}
                  </p>
                </li>
              ))
            )}
          </ul>
        )}
      </Card>
    </div>
  );
}
