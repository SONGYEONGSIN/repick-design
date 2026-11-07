"use client";

import { MouseEvent, useState } from "react";
import { TeamId, TEAMS } from "./data";
import { TeamSummary, round2 } from "./stats";
import { formatHours } from "./format";
import { ACCENT, FOCUS_RING, TEXT, SLA_THRESHOLD_HOURS, BOX_SCALE_MAX_HOURS } from "./tokens";
import { Card, CardHeader } from "./ui";

const VB_WIDTH = 280;
const VB_HEIGHT = 40;
const PAD = 6;
const INNER_WIDTH = VB_WIDTH - PAD * 2;
const CENTER_Y = 20;
const BOX_TOP = 10;
const BOX_BOTTOM = 30;
const CAP_TOP = 13;
const CAP_BOTTOM = 27;

function scaleX(hours: number): number {
  const clamped = Math.min(Math.max(hours, 0), BOX_SCALE_MAX_HOURS);
  return round2(PAD + (clamped / BOX_SCALE_MAX_HOURS) * INNER_WIDTH);
}

function valueAtX(fraction: number): number {
  const hours = ((fraction - PAD) / INNER_WIDTH) * BOX_SCALE_MAX_HOURS;
  return round2(Math.min(Math.max(hours, 0), BOX_SCALE_MAX_HOURS));
}

function TeamBoxPlotRow({
  team,
  summary,
  selected,
  onSelect,
}: {
  team: { id: TeamId; name: string; short: string };
  summary: TeamSummary;
  selected: boolean;
  onSelect: (id: TeamId) => void;
}) {
  const [crosshair, setCrosshair] = useState<number | null>(null);

  function handleMove(e: MouseEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xInViewBox = ((e.clientX - rect.left) / rect.width) * VB_WIDTH;
    setCrosshair(valueAtX(xInViewBox));
  }

  const summaryText = `${team.name}: median ${summary.median} hours across ${summary.ticketCount} resolved tickets, ${summary.breachCount} breached SLA. Range ${summary.min} to ${summary.max} hours. ${
    selected ? "Currently selected. " : ""
  }Activate to filter the ticket feed and detail card to this team.`;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={summaryText}
      onClick={() => onSelect(team.id)}
      onFocus={() => setCrosshair(summary.median)}
      onBlur={() => setCrosshair(null)}
      onMouseLeave={() => setCrosshair(null)}
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${FOCUS_RING} ${
        selected ? `${ACCENT.borderSoft} ${ACCENT.bgSoft}` : "border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-sm font-medium ${TEXT.primary}`}>{team.short}</span>
        <span className={`shrink-0 text-sm font-semibold tabular-nums ${TEXT.primary}`}>{formatHours(summary.median)}</span>
      </div>
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        width="100%"
        height={VB_HEIGHT}
        className="mt-1.5 block"
        role="img"
        aria-hidden="true"
        onMouseMove={handleMove}
      >
        {/* whiskers */}
        <line x1={scaleX(summary.lowerWhisker)} y1={CENTER_Y} x2={scaleX(summary.q1)} y2={CENTER_Y} stroke="currentColor" className="text-white/30" strokeWidth={1} />
        <line x1={scaleX(summary.q3)} y1={CENTER_Y} x2={scaleX(summary.upperWhisker)} y2={CENTER_Y} stroke="currentColor" className="text-white/30" strokeWidth={1} />
        <line x1={scaleX(summary.lowerWhisker)} y1={CAP_TOP} x2={scaleX(summary.lowerWhisker)} y2={CAP_BOTTOM} stroke="currentColor" className="text-white/30" strokeWidth={1} />
        <line x1={scaleX(summary.upperWhisker)} y1={CAP_TOP} x2={scaleX(summary.upperWhisker)} y2={CAP_BOTTOM} stroke="currentColor" className="text-white/30" strokeWidth={1} />
        {/* box */}
        <rect
          x={scaleX(summary.q1)}
          y={BOX_TOP}
          width={round2(scaleX(summary.q3) - scaleX(summary.q1))}
          height={BOX_BOTTOM - BOX_TOP}
          rx={3}
          fill="white"
          fillOpacity={0.06}
          stroke="currentColor"
          className="text-white/25"
          strokeWidth={1}
        />
        {/* median */}
        <line x1={scaleX(summary.median)} y1={BOX_TOP} x2={scaleX(summary.median)} y2={BOX_BOTTOM} stroke="currentColor" className={ACCENT.text} strokeWidth={2} />
        {/* outliers */}
        {summary.outliers.map((v, i) => {
          const breach = v > SLA_THRESHOLD_HOURS;
          const x = scaleX(v);
          return (
            <rect
              key={`${team.id}-outlier-${i}`}
              x={round2(x - 3)}
              y={round2(CENTER_Y - 3)}
              width={6}
              height={6}
              transform={`rotate(45 ${x} ${CENTER_Y})`}
              fill="currentColor"
              className={breach ? "text-amber-400" : "text-zinc-300"}
            />
          );
        })}
        {/* SLA reference */}
        <line x1={VB_WIDTH / 2} y1={2} x2={VB_WIDTH / 2} y2={VB_HEIGHT - 2} stroke="currentColor" className="text-amber-400/40" strokeWidth={1} strokeDasharray="2 2" />
        {/* crosshair */}
        {crosshair !== null ? (
          <>
            <line x1={scaleX(crosshair)} y1={0} x2={scaleX(crosshair)} y2={VB_HEIGHT} stroke="currentColor" className="text-zinc-50/70" strokeWidth={1} />
            <text x={scaleX(crosshair)} y={8} textAnchor="middle" fontSize={8} fill="currentColor" className="text-zinc-50">
              {crosshair}h
            </text>
          </>
        ) : null}
      </svg>
      <p className={`mt-1.5 text-xs tabular-nums ${TEXT.muted}`}>
        {summary.ticketCount} tickets · {summary.breachCount} breached · {summary.min}–{summary.max}h range
      </p>
    </button>
  );
}

export function BoxPlotPanel({
  summaries,
  selectedTeam,
  onSelectTeam,
}: {
  summaries: TeamSummary[];
  selectedTeam: TeamId | null;
  onSelectTeam: (id: TeamId) => void;
}) {
  return (
    <Card>
      <CardHeader title="Resolution time by team" subtitle="Hours to resolve, 50 resolved tickets" />
      <div className="px-5 pb-2 pt-3">
        <div className="flex items-center justify-between text-[11px] tabular-nums text-zinc-400">
          <span>0h</span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="inline-block h-px w-3 border-t border-dashed border-amber-400/60" aria-hidden="true" />
            SLA {SLA_THRESHOLD_HOURS}h
          </span>
          <span>{BOX_SCALE_MAX_HOURS}h</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-3 pb-5">
        {TEAMS.map((team) => {
          const summary = summaries.find((s) => s.teamId === team.id);
          if (!summary) return null;
          return (
            <TeamBoxPlotRow key={team.id} team={team} summary={summary} selected={selectedTeam === team.id} onSelect={onSelectTeam} />
          );
        })}
      </div>
    </Card>
  );
}
