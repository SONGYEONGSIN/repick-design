"use client";

import { useCallback, useRef, useState } from "react";
import type { Period } from "./data";
import { PERIOD_LABEL, PERIOD_SUBLABEL } from "./data";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BulletGrid } from "./bullet-grid";
import { MetricsTable } from "./metrics-table";
import { CommandPalette } from "./command-palette";
import { SegmentedControl } from "./ui";

const PERIODS: readonly Period[] = ["q3", "q2"];

/**
 * Root composition for the Setpoint OKR console.
 *
 * Macro skeleton: the bullet grid below is the full-width hero (no
 * persistent third pane, no always-open detail sidebar). Clicking a bullet
 * expands an inline accordion directly below that bullet, inside the grid
 * itself. The metrics table underneath is a fully independent secondary
 * widget — see the comment on MetricsTable for why it never re-syncs to the
 * bullet selection.
 */
export function SetpointConsole() {
  const [period, setPeriod] = useState<Period>("q3");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const paletteReturnFocusRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());

  const registerCardRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const handlePaletteOpenChange = useCallback((next: boolean) => {
    if (next && typeof document !== "undefined") {
      paletteReturnFocusRef.current = document.activeElement as HTMLElement | null;
    }
    setPaletteOpen(next);
  }, []);

  const handlePaletteSelect = useCallback((id: string) => {
    setSelectedId(id);
    const el = cardRefs.current.get(id);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.focus();
    }
  }, []);

  return (
    <div className="flex h-screen min-h-screen w-full bg-zinc-50 text-zinc-900">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => handlePaletteOpenChange(true)}
          searchTriggerRef={searchTriggerRef}
        />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
          {/* Cap computed from this shell's own geometry: 256px sidebar + up
              to 80px of xl: side padding leaves 1584px of room at a 1920px
              viewport, so a 2240px cap never binds there and only bites
              gently once the viewport reaches ~2560px, per the brief's
              ultra-wide rule. */}
          <div className="mx-auto w-full max-w-[2240px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Company OKRs</h1>
                <p className="mt-1 text-sm text-zinc-500">
                  Bullet targets across every department, refreshed at each quarter close —{" "}
                  {PERIOD_SUBLABEL[period]}.
                </p>
              </div>
              <SegmentedControl
                options={PERIODS}
                value={period}
                onChange={setPeriod}
                getLabel={(p) => PERIOD_LABEL[p]}
                ariaLabel="Reporting period"
              />
            </div>

            <BulletGrid period={period} selectedId={selectedId} onToggle={handleToggle} registerRef={registerCardRef} />

            <div className="mt-6">
              <MetricsTable period={period} />
            </div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onOpenChange={handlePaletteOpenChange}
        period={period}
        onSelect={handlePaletteSelect}
        returnFocusRef={paletteReturnFocusRef}
      />
    </div>
  );
}
