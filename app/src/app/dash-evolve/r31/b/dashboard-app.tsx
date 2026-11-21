"use client";

import { useMemo, useState } from "react";
import { Bell, Building2, Search, Settings, ShieldCheck, Users } from "lucide-react";
import { DEPARTMENTS, findTeam, type Metric } from "./data";
import Sunburst from "./sunburst";
import Legend from "./legend";
import DetailPanel from "./detail-panel";
import { SegmentedControl } from "./ui";

const NAV = [
  { label: "Directory", icon: Users, active: false },
  { label: "Org structure", icon: Building2, active: true },
  { label: "Access", icon: ShieldCheck, active: false },
];

export default function DashboardApp() {
  const [metric, setMetric] = useState<Metric>("headcount");
  const [pinnedDept, setPinnedDept] = useState("engineering");
  const [pinnedTeam, setPinnedTeam] = useState("platform");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  function selectTeam(deptId: string, teamId: string) {
    setPinnedDept(deptId);
    setPinnedTeam(teamId);
  }

  function selectDept(deptId: string) {
    const dept = DEPARTMENTS.find((d) => d.id === deptId);
    if (dept) selectTeam(deptId, dept.teams[0].id);
  }

  const current = useMemo(() => findTeam(pinnedDept, pinnedTeam), [pinnedDept, pinnedTeam]);
  const pinnedKey = `${pinnedDept}:${pinnedTeam}`;

  const hoveredLabel = useMemo(() => {
    if (!hoveredKey || hoveredKey === pinnedDept || hoveredKey === pinnedKey) return null;
    if (hoveredKey.includes(":")) {
      const [d, t] = hoveredKey.split(":");
      const found = findTeam(d, t);
      if (!found) return null;
      const value = metric === "headcount" ? found.team.headcount : found.team.openPositions;
      return `${found.dept.name} · ${found.team.name}: ${value} ${metric === "headcount" ? "people" : "open roles"}`;
    }
    const dept = DEPARTMENTS.find((d) => d.id === hoveredKey);
    if (!dept) return null;
    const value = dept.teams.reduce((s, t) => s + (metric === "headcount" ? t.headcount : t.openPositions), 0);
    return `${dept.name}: ${value} ${metric === "headcount" ? "people" : "open roles"}`;
  }, [hoveredKey, pinnedDept, pinnedKey, metric]);

  const q = query.trim().toLowerCase();
  const matchCount = q.length
    ? DEPARTMENTS.flatMap((d) => d.teams.map((t) => ({ d, t }))).filter(
        ({ d, t }) => t.name.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
      ).length
    : 0;

  if (!current) return null;

  return (
    <div className="flex min-h-dvh w-full bg-zinc-950 font-sans text-zinc-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-950 p-4 lg:flex">
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-[13px] font-semibold text-white">O</span>
          <span className="text-[14px] font-semibold text-zinc-50">Orgline</span>
        </div>
        <nav aria-label="Primary" className="mt-6 flex flex-col gap-0.5">
          {NAV.map((item) => (
            <div key={item.label} className={item.active ? "flex items-center gap-2.5 rounded-lg bg-indigo-500/15 px-2.5 py-2 text-[13px] font-medium text-indigo-200" : "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-400"}>
              <item.icon aria-hidden className="h-4 w-4" />
              {item.label}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-2 rounded-lg border border-white/10 px-2.5 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 text-[11px] font-semibold text-zinc-300">RH</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-zinc-100">Reyna Holt</p>
            <p className="truncate text-[11px] text-zinc-400">People operations</p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-11 items-center gap-3 border-b border-white/10 bg-zinc-950 px-4 lg:px-6">
          <label className="relative hidden max-w-xs flex-1 sm:block">
            <span className="sr-only">Search teams</span>
            <Search aria-hidden className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search teams"
              className="h-8 w-full rounded-md border border-white/10 bg-zinc-900 pl-8 pr-3 text-[12px] text-zinc-100 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            />
          </label>
          {query && (
            <span className="text-[11px] text-zinc-400" aria-live="polite">
              {matchCount} team{matchCount === 1 ? "" : "s"} match
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button type="button" aria-label="Notifications" className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
              <Bell aria-hidden className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Settings" className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400">
              <Settings aria-hidden className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-[20px] font-semibold tracking-tight text-zinc-50">Org structure</h1>
              <p className="mt-0.5 text-[13px] text-zinc-400">
                {DEPARTMENTS.length} departments · {DEPARTMENTS.flatMap((d) => d.teams).length} teams
              </p>
            </div>
            <SegmentedControl
              label="Metric"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "headcount", label: "Headcount" },
                { value: "open", label: "Open roles" },
              ]}
            />
          </div>

          <div className="flex flex-1 flex-col gap-4 lg:flex-row">
            <section aria-label="Department and team proportions" className="min-w-0 flex-[1.4] rounded-xl border border-white/10 bg-zinc-900/60 p-4 lg:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[13px] font-semibold text-zinc-50">Headcount by department and team</h2>
                <p className="text-[12px] text-zinc-400" aria-live="polite">
                  {hoveredLabel ?? "Hover or focus a segment for its exact count"}
                </p>
              </div>
              <div className="mt-4">
                <Sunburst metric={metric} pinnedDept={pinnedDept} pinnedTeam={pinnedTeam} hoveredKey={hoveredKey} onSelectTeam={selectTeam} onHoverChange={setHoveredKey} />
              </div>
              <div className="mt-4">
                <Legend metric={metric} pinnedDept={pinnedDept} onSelectDept={selectDept} />
              </div>
            </section>

            <DetailPanel dept={current.dept} team={current.team} onSelectTeam={(teamId) => selectTeam(pinnedDept, teamId)} />
          </div>
        </main>
      </div>
    </div>
  );
}
