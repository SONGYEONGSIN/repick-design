"use client";

import { ClipboardList, Gauge, Percent, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import CommandPalette from "./CommandPalette";
import {
  ACTIVE_TASK_COUNT,
  AT_RISK_OR_LATE_COUNT,
  formatPercent,
  formatUnits,
  OVERALL_AVG_VELOCITY,
  OVERALL_UTIL_PCT,
  TOTAL_CAPACITY,
  TOTAL_OCCUPIED,
  TOTAL_OVER_COUNT,
} from "./data";
import HeatmapGrid from "./HeatmapGrid";
import PickQueueRail from "./PickQueueRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { EyebrowLabel } from "./ui";
import ZoneRail from "./ZoneRail";

function InlineStat({ Icon, label, value, valueClass }: { Icon: typeof Gauge; label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <Icon size={14} aria-hidden="true" className={TEXT_CAPTION} />
      </span>
      <div className="min-w-0">
        <EyebrowLabel>{label}</EyebrowLabel>
        <p className={cx("truncate text-sm font-semibold leading-tight", NUM, valueClass ?? TEXT_PRIMARY)}>{value}</p>
      </div>
    </div>
  );
}

export default function StackyardClient() {
  const [selectedZoneId, setSelectedZoneId] = useState("fastpick");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-4 pb-3 pt-4 sm:px-6 sm:pt-6">
            <div className="mx-auto flex max-w-[1600px] flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">존 운영 현황</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Northgate DC1 · 빈 적재율과 피킹 큐를 실시간으로 동기화해 보여줍니다.</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <InlineStat Icon={Gauge} label="전체 가동률" value={formatPercent(OVERALL_UTIL_PCT)} />
                <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                <InlineStat Icon={Percent} label="적재 현황" value={`${formatUnits(TOTAL_OCCUPIED)}/${formatUnits(TOTAL_CAPACITY)}`} />
                <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                <InlineStat
                  Icon={TriangleAlert}
                  label="초과 적재 빈"
                  value={`${TOTAL_OVER_COUNT}개`}
                  valueClass={TOTAL_OVER_COUNT > 0 ? "text-rose-700 dark:text-rose-300" : undefined}
                />
                <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                <InlineStat Icon={ClipboardList} label="활성 피킹 작업" value={`${ACTIVE_TASK_COUNT}건`} />
                <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                <InlineStat
                  Icon={TriangleAlert}
                  label="임박·지연"
                  value={`${AT_RISK_OR_LATE_COUNT}건`}
                  valueClass={AT_RISK_OR_LATE_COUNT > 0 ? "text-amber-700 dark:text-amber-300" : undefined}
                />
                <span aria-hidden="true" className="hidden h-8 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />
                <InlineStat Icon={Gauge} label="평균 피킹 속도" value={`${OVERALL_AVG_VELOCITY.toFixed(1)}건/일`} />
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6 lg:overflow-hidden">
            <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4 lg:flex-row">
              <div className="h-[22rem] shrink-0 lg:h-full lg:w-56">
                <ZoneRail selectedZoneId={selectedZoneId} onSelect={setSelectedZoneId} />
              </div>
              <div className="h-[34rem] min-w-0 flex-1 lg:h-full">
                <HeatmapGrid selectedZoneId={selectedZoneId} />
              </div>
              <div className="h-[28rem] shrink-0 lg:h-full lg:w-[21rem]">
                <PickQueueRail selectedZoneId={selectedZoneId} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectZone={setSelectedZoneId} /> : null}
    </div>
  );
}
