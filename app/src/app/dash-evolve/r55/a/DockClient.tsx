"use client";

import { useEffect, useRef, useState } from "react";
import { MobileSidebar, Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { Hero } from "./Hero";
import { DockTimeline } from "./DockTimeline";
import { DetailPanel } from "./DetailPanel";
import { Card } from "./ui";
import { DOORS, type Period } from "./data";

export function DockClient() {
  // Axis A — period: a shared top-level scope (like a reporting-period toggle) that recomputes the
  // hero stats, the timeline and the detail panel together, because all three legitimately describe
  // the same day. This is NOT the selection fan-out the brief warns about — it's one value every
  // widget already needs for its own math, same as "this month / last month" elsewhere.
  const [period, setPeriod] = useState<Period>("today");

  // Axis B — "pin": clicking a dock-door row. Persistent, and scoped to exactly one widget: the
  // detail panel below the timeline. The timeline shows the pin too, but only as a ring on its own
  // row — it never reaches a second component.
  const [pinnedDoorId, setPinnedDoorId] = useState<string>("D3");

  // Axis C — "carrier focus": a second, independently-scoped persistent selection, picked from the
  // Hero's dropdown. It drives its own one-line summary in the Hero and dims non-matching bars
  // inside the timeline itself — it never touches the detail panel, and the pin never touches it.
  const [focusedCarrier, setFocusedCarrier] = useState<string | null>(null);

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function pinDoor(doorId: string) {
    if (DOORS.some((d) => d.id === doorId)) setPinnedDoorId(doorId);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-900 focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-50 focus:shadow-xl focus:outline-2 focus:outline-offset-2 focus:outline-emerald-400"
      >
        Skip to main content
      </a>
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} paletteTriggerRef={paletteTriggerRef} />
        <main id="main-content" className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full min-w-0 max-w-[1760px] px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 min-w-0">
                <Hero period={period} onPeriodChange={setPeriod} focusedCarrier={focusedCarrier} onFocusCarrier={setFocusedCarrier} />
              </div>

              <div className="col-span-12 min-w-0">
                <Card>
                  <DockTimeline period={period} pinnedDoorId={pinnedDoorId} onPinDoor={pinDoor} focusedCarrier={focusedCarrier} />
                </Card>
              </div>

              <div className="col-span-12 min-w-0">
                <DetailPanel period={period} pinnedDoorId={pinnedDoorId} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        period={period}
        onSwitchPeriod={setPeriod}
        onPinDoor={pinDoor}
        onFocusCarrier={setFocusedCarrier}
        triggerRef={paletteTriggerRef}
      />
    </div>
  );
}
