"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Menu as MenuIcon } from "lucide-react";
import {
  VENDORS,
  computePortfolioStats,
  computeVendorStats,
  formatPct,
  getDefaultVendorId,
  getIncidentsForVendor,
} from "./data";
import { MobileSidebar, Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { MobileVendorRail, VendorRailPanel, type VendorRow } from "./vendor-rail";
import { DetailPane, type TabId } from "./detail-pane";
import { Card, FOCUS_RING, Label } from "./ui";

export function LatchClient() {
  // Axis A — "pinned" vendor (persistent). Set only by an explicit click in the vendor rail (or
  // the ⌘K palette). Drives the entire detail pane: header, stat grid, expanded box plot and the
  // incidents table. This is the one piece of state threaded across components, and it goes to
  // exactly one direct consumer (DetailPane) plus the rail that owns the click — never broadcast
  // identically to three or more siblings.
  const [pinnedId, setPinnedId] = useState<string>(() => getDefaultVendorId());
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileRailOpen, setMobileRailOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteTriggerRef = useRef<HTMLButtonElement>(null);

  const vendorRows: VendorRow[] = useMemo(
    () => VENDORS.map((v) => ({ ...v, stats: computeVendorStats(v) })),
    [],
  );
  const pinnedVendor = vendorRows.find((v) => v.id === pinnedId) ?? vendorRows[0];
  const pinnedIncidents = useMemo(() => getIncidentsForVendor(pinnedVendor.id), [pinnedVendor.id]);
  const portfolio = useMemo(() => computePortfolioStats(), []);

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

  function pinVendor(id: string) {
    setPinnedId(id);
  }

  return (
    <div className="flex h-screen min-w-0 overflow-hidden bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-zinc-900 focus:shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-orange-700"
      >
        Skip to main content
      </a>

      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:pl-64">
        <Topbar
          onOpenPalette={() => setPaletteOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
          paletteTriggerRef={paletteTriggerRef}
        />

        <main id="main-content" className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-w-0 shrink-0 px-4 pb-4 pt-5 sm:px-6 lg:px-8">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1
                  className="truncate text-xl font-semibold tracking-tight text-zinc-900"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  Vendor SLA console
                </h1>
                <p className="mt-1 max-w-md break-words text-sm text-zinc-600">
                  Response-time compliance across every third-party vendor, compared on one shared scale.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMobileRailOpen(true)}
                className={`flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 lg:hidden ${FOCUS_RING}`}
              >
                <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Vendors
                <MenuIcon className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
              </button>
            </div>

            <Card className="mt-4" padded={false}>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4 sm:grid-cols-4 sm:p-5">
                <div className="min-w-0">
                  <Label>Vendors tracked</Label>
                  <dd className="text-lg font-semibold tabular-nums text-zinc-900">{portfolio.vendorCount}</dd>
                </div>
                <div className="min-w-0">
                  <Label>Breaching SLA</Label>
                  <dd className="text-lg font-semibold tabular-nums text-rose-700">{portfolio.breachCount}</dd>
                </div>
                <div className="min-w-0">
                  <Label>Open incidents</Label>
                  <dd className="text-lg font-semibold tabular-nums text-zinc-900">{portfolio.openIncidents}</dd>
                </div>
                <div className="min-w-0">
                  <Label>Avg. compliance</Label>
                  <dd className="text-lg font-semibold tabular-nums text-zinc-900">{formatPct(portfolio.avgCompliancePct)}</dd>
                </div>
              </dl>
            </Card>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 gap-4 overflow-hidden px-4 pb-4 sm:px-6 lg:px-8">
            <aside className="hidden min-w-0 w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 lg:flex">
              <VendorRailPanel vendors={vendorRows} pinnedId={pinnedVendor.id} onPin={pinVendor} />
            </aside>

            <section className="min-w-0 flex-1 overflow-y-auto overscroll-contain pb-2">
              <DetailPane vendor={pinnedVendor} incidents={pinnedIncidents} activeTab={activeTab} onTabChange={setActiveTab} />
            </section>
          </div>
        </main>
      </div>

      <MobileVendorRail
        open={mobileRailOpen}
        onClose={() => setMobileRailOpen(false)}
        vendors={vendorRows}
        pinnedId={pinnedVendor.id}
        onPin={pinVendor}
      />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onPinVendor={pinVendor}
        onSwitchTab={setActiveTab}
        triggerRef={paletteTriggerRef}
      />
    </div>
  );
}
