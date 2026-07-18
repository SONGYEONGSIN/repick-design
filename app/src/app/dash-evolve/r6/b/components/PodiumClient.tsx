"use client";

import { useEffect, useMemo, useState } from "react";
import { Coins, Layers, Trophy } from "lucide-react";
import {
  PERIOD_META,
  PERIOD_ORDER,
  TEAM_META,
  TEAM_ORDER,
  WORKSPACE,
  getRankedReps,
  repById,
  summarizeScope,
  type PeriodId,
  type TeamId,
} from "../lib/data";
import { formatUSDCompact, formatPct } from "../lib/format";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import Leaderboard from "./Leaderboard";
import RepDetailDrawer from "./RepDetailDrawer";
import CommandPalette from "./CommandPalette";
import { Card, EyebrowLabel, SegmentedControl } from "./ui";

type TeamScope = TeamId | "all";

const TEAM_SCOPE_OPTIONS: { id: TeamScope; label: string }[] = [
  { id: "all", label: "All Teams" },
  ...TEAM_ORDER.map((t) => ({ id: t as TeamScope, label: TEAM_META[t].short })),
];

const PERIOD_OPTIONS = PERIOD_ORDER.map((p) => ({ id: p, label: PERIOD_META[p].short }));

export default function PodiumClient() {
  const [period, setPeriod] = useState<PeriodId>("quarter");
  const [teamScope, setTeamScope] = useState<TeamScope>("all");
  const [selectedRepId, setSelectedRepId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const ranked = useMemo(() => getRankedReps(period, teamScope), [period, teamScope]);
  const summary = useMemo(() => summarizeScope(ranked), [ranked]);

  const selectedEntry = useMemo(() => {
    if (!selectedRepId) return null;
    const inScope = ranked.find((e) => e.rep.id === selectedRepId);
    if (inScope) return inScope;
    // Rep picked via ⌘K may fall outside the current team-scope filter —
    // still resolve their rank within their own team so the drawer works.
    const rep = repById(selectedRepId);
    if (!rep) return null;
    return getRankedReps(period, rep.team).find((e) => e.rep.id === selectedRepId) ?? null;
  }, [selectedRepId, ranked, period]);

  const scopeLabel = teamScope === "all" ? "All Teams" : TEAM_META[teamScope].label;

  function handleSelectFromPalette(id: string) {
    setSelectedRepId(id);
  }

  return (
    <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-white text-zinc-900">
      <AppSidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex h-full min-w-0 flex-1 flex-col">
        <AppTopbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex max-w-6xl min-w-0 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">Sales Leaderboard</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Ranked by quota attainment across {WORKSPACE.name}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <SegmentedControl
                  ariaLabel="Leaderboard period"
                  options={PERIOD_OPTIONS}
                  value={period}
                  onChange={setPeriod}
                  size="md"
                />
                <SegmentedControl
                  ariaLabel="Team scope"
                  options={TEAM_SCOPE_OPTIONS}
                  value={teamScope}
                  onChange={setTeamScope}
                  className="max-w-full"
                />
              </div>
            </div>

            <Card className="p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <EyebrowLabel>
                    Team attainment · {scopeLabel} · {PERIOD_META[period].label}
                  </EyebrowLabel>
                  <p className="mt-1 text-4xl font-bold tabular-nums text-zinc-900">{formatPct(summary.avgAttainment)}</p>
                  <p className="mt-1 text-xs text-zinc-500">Average across {summary.repCount} reps</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-8">
                  <HeroStatItem icon={Trophy} label="Reps at goal" value={`${summary.repsAtGoal}/${summary.repCount}`} />
                  <HeroStatItem icon={Coins} label="Closed revenue" value={formatUSDCompact(summary.totalRevenue)} />
                  <HeroStatItem icon={Layers} label="Open pipeline" value={formatUSDCompact(summary.openPipelineValue)} />
                </div>
              </div>
            </Card>

            <Leaderboard
              ranked={ranked}
              period={period}
              selectedRepId={selectedRepId}
              onSelectRep={setSelectedRepId}
              scopeLabel={scopeLabel}
            />
          </div>
        </main>
      </div>

      {selectedEntry ? (
        <RepDetailDrawer entry={selectedEntry} period={period} onClose={() => setSelectedRepId(null)} />
      ) : null}

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectRep={handleSelectFromPalette} />
    </div>
  );
}

function HeroStatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</p>
        <p className="text-sm font-semibold tabular-nums text-zinc-900">{value}</p>
      </div>
    </div>
  );
}
