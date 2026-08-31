"use client";

import { useCallback, useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import FlagList from "./FlagList";
import RuleEditor from "./RuleEditor";
import EnvironmentToggle from "./EnvironmentToggle";
import RolloutControl from "./RolloutControl";
import RolloutChart from "./RolloutChart";
import SegmentTable from "./SegmentTable";
import { Card } from "./ui";
import { FLAGS, deriveRollout, type Env } from "./data";

export default function Page() {
  const [selectedFlagId, setSelectedFlagId] = useState(FLAGS[0].id);
  const [env, setEnv] = useState<Env>("prod");
  const [pctOverrides, setPctOverrides] = useState<Record<string, number>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedFlag = FLAGS.find((f) => f.id === selectedFlagId) ?? FLAGS[0];
  const overrideKey = `${selectedFlagId}:${env}`;
  const committedPct = pctOverrides[overrideKey] ?? selectedFlag.environments[env].rolloutPct;

  const resolvePct = useCallback(
    (flag: (typeof FLAGS)[number]) => {
      const key = `${flag.id}:${env}`;
      return pctOverrides[key] ?? flag.environments[env].rolloutPct;
    },
    [env, pctOverrides]
  );

  // The single re-encoding step: every number the right pane shows is recomputed here, from the
  // current flag + environment + rollout percentage, never swapped in as a pre-baked block.
  const view = useMemo(() => deriveRollout(selectedFlag, env, committedPct), [selectedFlag, env, committedPct]);

  function setCommittedPct(v: number) {
    setPctOverrides((prev) => ({ ...prev, [overrideKey]: v }));
  }

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-zinc-950 text-zinc-50 md:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-sky-400 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-950"
      >
        Skip to main content
      </a>

      <Sidebar mobileOpen={mobileMenuOpen} onCloseMobile={() => setMobileMenuOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
              Feature flags
            </h1>
            <p className="mt-0.5 text-sm text-zinc-400">Target, roll out and monitor releases across environments.</p>
          </div>
          <EnvironmentToggle value={env} onChange={setEnv} />
        </div>

        <main id="main-content" className="flex min-h-0 flex-1 flex-col md:flex-row md:overflow-hidden">
          {/* Left pane: fixed width workbench — flag list on top, targeting-rule editor below. */}
          <section
            aria-label="Flags and targeting rules"
            className="flex min-h-0 shrink-0 flex-col border-b border-white/10 md:h-full md:w-[400px] md:border-b-0 md:border-r"
          >
            <div className="flex min-h-0 flex-[1_1_44%] flex-col">
              <h2 className="sr-only">Flags</h2>
              <FlagList flags={FLAGS} env={env} selectedId={selectedFlagId} onSelect={setSelectedFlagId} resolvePct={resolvePct} />
            </div>

            <div className="flex min-h-0 flex-[1_1_56%] flex-col">
              <div className="px-3 pt-3">
                <h2 className="truncate text-sm font-semibold text-zinc-100">{selectedFlag.name}</h2>
                <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-400">{selectedFlag.key}</p>
              </div>
              <RuleEditor key={selectedFlag.id} flag={selectedFlag} />
            </div>
          </section>

          {/* Right pane: flex-1 — absorbs all remaining width so it can never end up narrower than the fixed left pane. */}
          <section aria-label="Rollout impact" className="min-w-0 flex-1 md:h-full md:overflow-y-auto">
            <div className="mx-auto max-w-[1800px] space-y-4 p-6">
              <Card>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-zinc-100">Rollout impact</h2>
                  <span className="text-xs text-zinc-400">
                    {selectedFlag.name} · {env}
                  </span>
                </div>
                <RolloutChart totalEligible={view.totalEligible} committedPct={committedPct} view={view} />
                <div className="mt-5 border-t border-white/10 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Rollout percentage</span>
                    <span className="text-xs text-zinc-400">Drag, type, or pick a preset — the breakdown below recomputes live.</span>
                  </div>
                  <RolloutControl pct={committedPct} onChange={setCommittedPct} disabled={selectedFlag.status === "draft" && env !== "dev"} />
                </div>
              </Card>

              <Card padded={false}>
                <div className="flex items-center justify-between gap-2 p-5 pb-0">
                  <h2 className="text-sm font-semibold text-zinc-100">Audience segments</h2>
                  <span className="text-xs tabular-nums text-zinc-400">{view.segments.length} segments</span>
                </div>
                <div className="p-5">
                  <SegmentTable view={view} env={env} />
                </div>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
