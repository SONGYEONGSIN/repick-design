"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { GitBranch, Headset, Layers, MonitorSmartphone, PenTool, Server, ShieldCheck, TestTube2 } from "lucide-react";
import { DEFAULT_SPOTLIGHT_TEAM_ID, REWORK_FREE_TEAM_IDS, TEAMS, TEAM_ORDER, teamStats, type Period, type TeamId } from "./data";
import { formatCount, formatPercent } from "./format";
import { Card, FOCUS_RING, ProgressBar, Sparkline, Tabs } from "./ui";

type SpotlightTab = "overview" | "trend";

const SPOTLIGHT_TABS: { value: SpotlightTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "trend", label: "Volume trend" },
];

/**
 * This is the SECOND of the route's two independently-scoped selection mechanisms (the first is
 * `active` inside `arc-diagram.tsx`). `selectedTeamId` is a single `useState`, declared in this
 * file and read only in this file — the roster chips below are its only producer (click), and the
 * spotlight readout right under them is its only consumer, both rendered by this same component.
 * Nothing outside this file ever receives `selectedTeamId` or its setter as a prop, and nothing in
 * this file reads `arc-diagram.tsx`'s `active` state (that component is never imported here). The
 * command palette can move DOM focus onto a roster chip (see `command-palette.tsx`), which fires
 * this file's own hover preview below, exactly like a mouse hover would — a plain DOM `.focus()`
 * call, not a prop or shared id, so it never becomes a third consumer of this state.
 */

const TEAM_ICONS: Record<TeamId, LucideIcon> = {
  design: PenTool,
  product: Layers,
  frontend: MonitorSmartphone,
  backend: Server,
  qa: TestTube2,
  security: ShieldCheck,
  devops: GitBranch,
  support: Headset,
};

function listTeamNames(ids: TeamId[]): string {
  const names = ids.map((id) => TEAMS[id].name);
  if (names.length === 0) return "every team";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

const REWORK_FREE_CAPTION = `${listTeamNames(REWORK_FREE_TEAM_IDS)} stayed rework-free this sprint.`;

export function TeamSpotlight({ period }: { period: Period }) {
  // Ephemeral preview while hovering/focusing a chip — mirrors the pattern in `arc-diagram.tsx`
  // but is a completely separate `useState`, local to this component, never shared with it.
  const [hoverId, setHoverId] = useState<TeamId | null>(null);
  const [selectedId, setSelectedId] = useState<TeamId>(DEFAULT_SPOTLIGHT_TEAM_ID);
  const [tab, setTab] = useState<SpotlightTab>("overview");

  const displayedId = hoverId ?? selectedId;
  const team = TEAMS[displayedId];
  const stats = teamStats(displayedId, period);
  const Icon = TEAM_ICONS[displayedId];
  const isPreviewing = hoverId !== null && hoverId !== selectedId;

  return (
    <Card as="section" ariaLabelledBy="team-spotlight-heading" id="team-spotlight" className="min-w-0 p-4 sm:p-5">
      <h2 id="team-spotlight-heading" className="font-semibold text-sm text-zinc-900">
        Team Spotlight
      </h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-500">
        Pick a team to inspect its handoff volume — scoped only to this card, independent of the diagram above.
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Teams">
        {TEAM_ORDER.map((id) => {
          const t = TEAMS[id];
          const ItemIcon = TEAM_ICONS[id];
          const isSelected = id === selectedId;
          const isHovered = id === hoverId && id !== selectedId;
          return (
            <li key={id}>
              <button
                id={`team-chip-${id}`}
                type="button"
                aria-pressed={isSelected}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
                onFocus={() => setHoverId(id)}
                onBlur={() => setHoverId(null)}
                onClick={() => setSelectedId(id)}
                className={`flex h-9 items-center gap-1.5 rounded-full border px-3 font-medium text-xs motion-safe:transition-colors ${FOCUS_RING} ${
                  isSelected
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : isHovered
                      ? "border-zinc-300 bg-zinc-50 text-zinc-900"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <ItemIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {t.name}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center gap-2.5 border-t border-zinc-200 pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex min-w-0 items-center gap-1.5">
            <span className="truncate font-semibold text-sm text-zinc-900">{team.name}</span>
            {isPreviewing ? (
              <span className="shrink-0 rounded-full bg-zinc-200 px-1.5 py-0.5 font-medium text-[10px] text-zinc-700">Previewing</span>
            ) : (
              <span className="shrink-0 rounded-full bg-emerald-700 px-1.5 py-0.5 font-medium text-[10px] text-white">Selected</span>
            )}
          </p>
          <p className="truncate font-normal text-xs text-zinc-500">{team.category}</p>
        </div>
      </div>

      <div className="mt-3">
        <Tabs idBase="spotlight" ariaLabel={`${team.name} detail views`} tabs={SPOTLIGHT_TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "overview" ? (
        <div id="spotlight-panel-overview" role="tabpanel" aria-labelledby="spotlight-tab-overview" className="mt-3">
          <dl className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <dt className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Outgoing</dt>
              <dd className="mt-1 font-semibold text-lg tabular-nums text-zinc-900">{formatCount(stats.outgoing)}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Incoming</dt>
              <dd className="mt-1 font-semibold text-lg tabular-nums text-zinc-900">{formatCount(stats.incoming)}</dd>
            </div>
          </dl>
          <div className="mt-3 min-w-0">
            <p className="flex items-center justify-between">
              <span className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Rework share</span>
              <span className="font-semibold text-xs tabular-nums text-zinc-900">{formatPercent(stats.reworkSharePct)}</span>
            </p>
            <ProgressBar
              pct={stats.reworkSharePct}
              className="mt-1.5"
              fillClassName="bg-amber-600"
              ariaLabel={`${team.name} rework share, ${Math.round(stats.reworkSharePct)} percent`}
            />
          </div>
        </div>
      ) : (
        <div id="spotlight-panel-trend" role="tabpanel" aria-labelledby="spotlight-tab-trend" className="mt-3 flex flex-wrap items-center gap-4">
          <Sparkline values={team.volumeHistory} />
          <div className="min-w-0">
            <p className="font-medium text-sm tabular-nums text-zinc-900">
              {formatCount(team.volumeHistory[0])} <span aria-hidden="true">→</span> {formatCount(team.volumeHistory[team.volumeHistory.length - 1])}
            </p>
            <p className="font-normal text-xs text-zinc-500">Five-point combined handoff volume, ending at this sprint.</p>
          </div>
        </div>
      )}

      <p className="mt-3 border-t border-zinc-200 pt-3 font-normal text-xs text-zinc-500">{REWORK_FREE_CAPTION}</p>
    </Card>
  );
}
