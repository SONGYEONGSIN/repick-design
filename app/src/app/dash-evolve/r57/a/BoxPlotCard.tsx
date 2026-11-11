"use client";

import { useState } from "react";
import { Pin } from "lucide-react";
import { Card, CardHeader } from "./Card";
import { SegmentedControl } from "./SegmentedControl";
import { RESOLVED_HOURS, TEAMS, fiveNumberSummary, formatHours, formatCount, type Period, type TeamName } from "./data";

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400";

function pct(value: number, domainMin: number, domainMax: number): number {
  const raw = ((value - domainMin) / (domainMax - domainMin)) * 100;
  return Math.max(0, Math.min(100, Math.round(raw * 100) / 100));
}

export function BoxPlotCard({
  period,
  setPeriod,
  pinnedTeam,
  setPinnedTeam,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  pinnedTeam: TeamName | null;
  setPinnedTeam: (team: TeamName) => void;
}) {
  // Ephemeral, local-only hover/focus state. It never touches `pinnedTeam` and the ticket feed
  // below never reads it either — this is the "separate, non-persistent" interaction the chart
  // offers in addition to the persistent pin, kept intentionally un-synced from everything else.
  const [hoveredTeam, setHoveredTeam] = useState<TeamName | null>(null);

  const hoursByTeam = RESOLVED_HOURS[period];
  const summaries = TEAMS.map((team) => ({ team, summary: fiveNumberSummary(hoursByTeam[team]) }));

  const domainMax = Math.ceil(Math.max(...summaries.map((s) => s.summary.max)) * 1.08);
  const domainMin = 0;
  const axisTicks = [domainMin, Math.round(domainMax / 2), domainMax];

  return (
    <Card>
      <CardHeader
        title="Resolution time by team"
        description="Full distribution of time-to-resolve, in hours. Click a team to pin its details; hover or focus a row for the exact reading."
        action={<SegmentedControl label="Time range" value={period} onChange={setPeriod} options={[{ value: "7d", label: "7d" }, { value: "30d", label: "30d" }]} />}
      />

      <div className="min-w-0">
        <div className="mb-2 flex min-w-0 justify-between pl-0 text-[11px] font-normal text-slate-400" aria-hidden="true">
          {axisTicks.map((tick, i) => (
            <span key={`axis-tick-${i}`} className={i === 1 ? "flex-1 text-center" : i === 0 ? "" : "text-right"}>
              {formatHours(tick)}
            </span>
          ))}
        </div>

        <ul className="space-y-3">
          {summaries.map(({ team, summary }) => {
            const isPinned = team === pinnedTeam;
            const isHovered = team === hoveredTeam;
            return (
              <li key={team} className="relative min-w-0">
                <button
                  type="button"
                  onClick={() => setPinnedTeam(team)}
                  onMouseEnter={() => setHoveredTeam(team)}
                  onMouseLeave={() => setHoveredTeam(null)}
                  onFocus={() => setHoveredTeam(team)}
                  onBlur={() => setHoveredTeam(null)}
                  className={`flex w-full min-w-0 flex-col gap-1.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${FOCUS} ${
                    isPinned ? "border-green-500/40 bg-green-500/[0.06]" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex min-w-0 items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-sm font-semibold text-slate-100">
                      {isPinned ? <Pin className="h-3.5 w-3.5 flex-shrink-0 text-green-400" aria-hidden="true" /> : null}
                      <span className="truncate">{team}</span>
                    </span>
                    <span className="flex-shrink-0 text-xs font-normal tabular-nums text-slate-400">{formatCount(summary.count)} tickets</span>
                  </div>

                  {/* Decorative visual — the text line below already states every one of these
                      numbers, so this shape is hidden from assistive tech rather than given a
                      separate (and therefore mismatch-prone) label. */}
                  <div aria-hidden="true" className="relative h-5 w-full min-w-0 rounded bg-slate-800/70">
                    <span
                      className="absolute bg-slate-500"
                      style={{
                        left: `${pct(summary.min, domainMin, domainMax)}%`,
                        width: `${pct(summary.max, domainMin, domainMax) - pct(summary.min, domainMin, domainMax)}%`,
                        top: "50%",
                        height: "1px",
                        transform: "translateY(-50%)",
                      }}
                    />
                    <span className="absolute bg-slate-400" style={{ left: `${pct(summary.min, domainMin, domainMax)}%`, top: "50%", width: "1px", height: "10px", transform: "translate(-50%, -50%)" }} />
                    <span className="absolute bg-slate-400" style={{ left: `${pct(summary.max, domainMin, domainMax)}%`, top: "50%", width: "1px", height: "10px", transform: "translate(-50%, -50%)" }} />
                    <span
                      className={`absolute rounded-sm border ${isPinned ? "border-green-400/70 bg-green-500/35" : "border-green-400/40 bg-green-500/20"}`}
                      style={{
                        left: `${pct(summary.q1, domainMin, domainMax)}%`,
                        width: `${Math.max(2, pct(summary.q3, domainMin, domainMax) - pct(summary.q1, domainMin, domainMax))}%`,
                        top: "2px",
                        bottom: "2px",
                      }}
                    />
                    <span className="absolute bg-green-400" style={{ left: `${pct(summary.median, domainMin, domainMax)}%`, top: 0, bottom: 0, width: "2px", transform: "translateX(-50%)" }} />
                  </div>

                  <p className="text-xs font-normal tabular-nums text-slate-300">
                    Median {formatHours(summary.median)} · Q1 {formatHours(summary.q1)}–Q3 {formatHours(summary.q3)} · range {formatHours(summary.min)}–{formatHours(summary.max)}
                  </p>
                </button>

                {isHovered ? (
                  <div
                    role="tooltip"
                    className="absolute left-3 top-full z-10 mt-1 w-max max-w-[calc(100%-1.5rem)] rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-xs font-normal text-slate-200 shadow-xl"
                  >
                    <p className="font-medium text-slate-100">{team}</p>
                    <p className="mt-0.5 tabular-nums text-slate-300">
                      Min {formatHours(summary.min)} · Q1 {formatHours(summary.q1)} · Median {formatHours(summary.median)} · Q3 {formatHours(summary.q3)} · Max {formatHours(summary.max)}
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
