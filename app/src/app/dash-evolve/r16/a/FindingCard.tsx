"use client";

import { ArrowRight } from "lucide-react";
import { STAGE_META, STAGE_ORDER, getTeamMember, type Finding } from "./data";
import { daysOpen, slaStatus, slaTargetDays } from "./format";
import { Avatar, SeverityBadge, SlaBar } from "./ui";

export function FindingCard({
  finding,
  selected,
  onOpen,
  onAdvance,
  todayISO,
}: {
  finding: Finding;
  selected: boolean;
  onOpen: (id: string) => void;
  onAdvance: (id: string) => void;
  todayISO: string;
}) {
  const assignee = getTeamMember(finding.assigneeId);
  const open = daysOpen(finding, todayISO);
  const target = slaTargetDays(finding.severity);
  const status = slaStatus(finding, todayISO);
  const currentIndex = STAGE_ORDER.indexOf(finding.stage);
  const nextStage = STAGE_ORDER[currentIndex + 1];

  return (
    <article
      className={`group relative rounded-lg border bg-white p-3 shadow-sm transition-colors ${
        selected ? "border-teal-600 ring-1 ring-teal-600" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(finding.id)}
        aria-label={`Open finding ${finding.id}: ${finding.title}`}
        aria-current={selected ? "true" : undefined}
        className="absolute inset-0 z-0 rounded-lg focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:outline-none"
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <SeverityBadge severity={finding.severity} />
          <span className="shrink-0 font-mono text-[11px] whitespace-nowrap text-zinc-500 tabular-nums">
            {finding.id}
          </span>
        </div>

        <p className="line-clamp-2 text-sm font-medium text-zinc-900">{finding.title}</p>

        <p className="truncate text-xs text-zinc-500">
          {finding.asset} <span aria-hidden="true">·</span> {finding.source}
          {finding.cve ? (
            <>
              {" "}
              <span aria-hidden="true">·</span> {finding.cve}
            </>
          ) : null}
        </p>

        <div className="flex items-center gap-1.5">
          {assignee ? (
            <>
              <Avatar src={assignee.avatarUrl} name={assignee.name} size="xs" />
              <span className="truncate text-xs text-zinc-600">{assignee.name}</span>
            </>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
              <span className="h-5 w-5 shrink-0 rounded-full border border-dashed border-zinc-300" aria-hidden="true" />
              Unassigned
            </span>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-2.5 pointer-events-auto">
        <SlaBar
          open={open}
          target={target}
          status={status}
          discoveredISO={finding.discoveredISO}
          resolvedISO={finding.resolvedISO}
          compact
        />
      </div>

      {nextStage ? (
        <div className="relative z-10 mt-2 flex justify-end pointer-events-auto">
          <button
            type="button"
            onClick={() => onAdvance(finding.id)}
            className="inline-flex h-7 items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 text-[11px] font-medium text-zinc-600 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1 focus-visible:outline-none"
          >
            Move to {STAGE_META[nextStage].short}
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </article>
  );
}
