"use client";

import { AlertTriangle, CircleCheck, CircleX, ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import BulletGrid from "./BulletGrid";
import CheckinsTable from "./CheckinsTable";
import CommandPalette from "./CommandPalette";
import FocusRail from "./FocusRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AT_RISK_COUNT, CHECKINS_THIS_WEEK, CHECKIN_TREND, KEY_RESULTS, OBJECTIVES, OFF_TRACK_COUNT, ON_TRACK_COUNT, ON_TRACK_TREND } from "./data";
import { APP_BG, BORDER, DISPLAY_STYLE, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Eyebrow, Sparkline } from "./ui";

export default function WaymarkClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // The ONE lifted selection in this page: pinning a row in the bullet grid recomputes exactly the
  // focus-rail card above the objectives rollup — nothing else (see FocusRail.tsx and
  // CheckinsTable.tsx for the explicit "does not recompute" notes on the two widgets that stay put).
  const [pinnedId, setPinnedId] = useState<string | null>(null);

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

  function togglePin(id: string) {
    setPinnedId((cur) => (cur === id ? null : id));
  }

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Q3 2026 cycle · ${OBJECTIVES.length} objectives · ${KEY_RESULTS.length} key results`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)} style={DISPLAY_STYLE}>
                Goals console
              </h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                The key-result grid below is the source of truth — every value, target and status reads at a glance. Pinning a row only updates the focus card on the right; the check-ins log keeps its own filters.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Cycle summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>On track</dt>
              <dd className="mt-1.5">
                <span className="flex items-end justify-between gap-2">
                  <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                    <CircleCheck size={17} aria-hidden="true" className="text-teal-400" />
                    {ON_TRACK_COUNT}
                  </span>
                  <Sparkline values={ON_TRACK_TREND} colorClass="stroke-teal-400" />
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>{`of ${KEY_RESULTS.length} key results, 6-week trend`}</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", AT_RISK_COUNT > 0 ? "border-amber-800/50 bg-amber-950/20" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", AT_RISK_COUNT > 0 ? "text-amber-300" : TEXT_MUTED)}>At risk</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <AlertTriangle size={17} aria-hidden="true" className={AT_RISK_COUNT > 0 ? "text-amber-400" : TEXT_AUX} />
                  {AT_RISK_COUNT}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", AT_RISK_COUNT > 0 ? "text-amber-300" : TEXT_MUTED)}>in the satisfactory band, not yet at target</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", OFF_TRACK_COUNT > 0 ? "border-rose-800/50 bg-rose-950/20" : cx(BORDER, SURFACE_INSET))}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", OFF_TRACK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>Off track</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <CircleX size={17} aria-hidden="true" className={OFF_TRACK_COUNT > 0 ? "text-rose-400" : TEXT_AUX} />
                  {OFF_TRACK_COUNT}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", OFF_TRACK_COUNT > 0 ? "text-rose-300" : TEXT_MUTED)}>need an owner action this week</span>
              </dd>
            </div>

            <div className={cx("col-span-12 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Check-ins logged</dt>
              <dd className="mt-1.5">
                <span className="flex items-end justify-between gap-2">
                  <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                    <ListChecks size={17} aria-hidden="true" className={TEXT_AUX} />
                    {CHECKINS_THIS_WEEK}
                  </span>
                  <Sparkline values={CHECKIN_TREND} colorClass="stroke-teal-400" />
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>this week, across all teams</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 xl:col-span-8">
              <BulletGrid pinnedId={pinnedId} onTogglePin={togglePin} />
            </div>
            <div className="col-span-12 min-w-0 xl:col-span-4">
              <FocusRail pinnedId={pinnedId} onClearPin={() => setPinnedId(null)} />
            </div>
          </div>

          <div className="mt-4">
            <CheckinsTable />
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectResult={(id) => {
            const isKr = KEY_RESULTS.some((kr) => kr.id === id);
            if (isKr) setPinnedId(id);
          }}
        />
      ) : null}
    </div>
  );
}
