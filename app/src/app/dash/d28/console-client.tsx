"use client";

import { useMemo, useRef, useState } from "react";
import {
  mission as missionData,
  milestones,
  stations,
  weatherRows,
  historyLog,
  kpis,
  currentMilestoneId,
} from "./data";
import { DesktopRail, MobileDrawer } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { KpiStrip } from "./components/KpiStrip";
import { TTimeline } from "./components/TTimeline";
import { PollBoard } from "./components/PollBoard";
import { MilestoneDetail } from "./components/MilestoneDetail";
import { PropellantPanel } from "./components/PropellantPanel";
import { WeatherPanel } from "./components/WeatherPanel";
import { HistoryLog } from "./components/HistoryLog";
import styles from "./console.module.css";

export function ConsoleClient() {
  const [selectedId, setSelectedId] = useState(currentMilestoneId);
  const drawerRef = useRef<HTMLDialogElement>(null);

  const selected = useMemo(
    () => milestones.find((m) => m.id === selectedId) ?? milestones[0],
    [selectedId],
  );

  return (
    <div className={`${styles.consoleRoot} flex h-dvh w-full overflow-hidden`}>
      <div aria-hidden="true" className={styles.lightRig}>
        <div className={styles.beamA} />
        <div className={styles.beamB} />
        <div className={styles.vignette} />
      </div>

      <DesktopRail />
      <MobileDrawer dialogRef={drawerRef} />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar mission={missionData} onOpenMenu={() => drawerRef.current?.showModal()} />

        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1920px] flex-col gap-8 pb-8">
            <KpiStrip kpis={kpis} snapshotAt={missionData.snapshotAt} />

            <TTimeline milestones={milestones} selectedId={selectedId} onSelect={setSelectedId} />

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
              <PollBoard
                stations={stations}
                relatedStations={selected.relatedStations}
                relatedMilestoneLabel={`${selected.tMinus} · ${selected.title}`}
              />
              <MilestoneDetail milestone={selected} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
              <PropellantPanel milestone={selected} />
              <WeatherPanel rows={weatherRows} />
              <HistoryLog entries={historyLog} />
            </div>

            <footer className="border-t pt-4 text-xs" style={{ borderColor: "var(--hf-border)", color: "var(--hf-text-3)" }}>
              Holdfire Launch Operations Console · {missionData.workspace} · Snapshot frozen at {missionData.snapshotAt} — this
              console does not auto-refresh.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
