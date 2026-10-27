"use client";

import { TrendingUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import DataTable from "./DataTable";
import ProviderDetailCard from "./ProviderDetailCard";
import Sidebar from "./Sidebar";
import StreamGraph from "./StreamGraph";
import Topbar from "./Topbar";
import { type ProviderId, type WindowId, WINDOWS, WORST_PERFORMER_ID, buildTableRows, sliceForWindow, toCsv } from "./data";
import { APP_BG, TEXT_AUX, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

export default function InboxlineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [windowId, setWindowId] = useState<WindowId>("30d");
  const [pinnedId, setPinnedId] = useState<ProviderId | null>(null);

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

  // Clicking a ribbon/legend chip toggles its own pin; this is the ONLY place a raw provider id
  // flows into a value other components read — the streamgraph's ephemeral per-day crosshair
  // (inside StreamGraph) never touches this state, by construction (see concept doc, interaction 4).
  const togglePin = useCallback((id: ProviderId) => {
    setPinnedId((cur) => (cur === id ? null : id));
  }, []);

  // Default-populate with a sensible fallback — the worst-performing provider today — rather than
  // an empty "select a provider" state (page-brief-core §3).
  const effectivePinnedId = pinnedId ?? WORST_PERFORMER_ID;
  const explicitPin = pinnedId != null;

  const days = useMemo(() => sliceForWindow(windowId), [windowId]);
  const windowDef = WINDOWS.find((w) => w.id === windowId) ?? WINDOWS[1];
  const totalVolume = useMemo(() => days.reduce((sum, d) => sum + d.totalHits, 0), [days]);

  const handleExport = useCallback(() => {
    const csv = toCsv(buildTableRows(days));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inboxline-placement-${windowId}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [days, windowId]);

  const pinnedFromPalette = useCallback((id: ProviderId) => setPinnedId(id), []);

  return (
    <div className={cx("flex min-h-dvh", APP_BG, TEXT_PRIMARY)}>
      {/* This route commits to a real dark theme; a fixed ground behind the shell keeps overscroll
          and any sub-viewport gap from ever flashing the host document's own light scheme. */}
      <div aria-hidden="true" className={cx("pointer-events-none fixed inset-0 -z-10", APP_BG)} />
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} onExport={handleExport} />

        <main id="main-content" className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          {/* ---------------------------------------------------------------- page header */}
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{"Deliverability · mail.acme.com"}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Inbox placement</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                {`Daily seed-list placement, up to ${WINDOWS[2].days} days of history across four mailbox providers. Pin a ribbon or legend chip to inspect one provider; scrub the rail under the chart to read any single day.`}
              </p>
            </div>
            <Segmented ariaLabel="Trend window" value={windowId} onChange={setWindowId} options={WINDOWS.map((w) => ({ id: w.id, label: w.label }))} />
          </div>

          {/* --------------------------------------------------------------------- hero: streamgraph (dominant, no competing stat strip) */}
          <Card id="trend-card" className="mt-4">
            <CardHead
              title="Inbox placement trend"
              Icon={TrendingUp}
              hint="Ribbon thickness is that day's successful inbox placements by provider — the stack always sums to the day's total. Each legend chip is that provider's placement rate today, persistent whether or not you're hovering. Hatch angle and edge dash separate the four providers independent of colour."
            />
            <div className="mt-3">
              <StreamGraph days={days} pinnedId={effectivePinnedId} explicitPin={explicitPin} onPinProvider={togglePin} />
            </div>
            <p className={cx("mt-3 border-t pt-3 text-[11px] font-normal", "border-white/10", TEXT_AUX)}>
              {`${windowDef.days}-day window — ${totalVolume.toLocaleString("en-US")} inbox placements monitored. Switching windows rescales the ribbons; it never changes which days exist.`}
            </p>
          </Card>

          {/* --------------------------------------------------------------- supporting: pinned detail + full ledger */}
          <div className="mt-4 grid grid-cols-12 gap-4">
            <div className="col-span-12 min-w-0 sm:h-[520px] lg:col-span-4">
              <ProviderDetailCard pinnedId={effectivePinnedId} explicitPin={explicitPin} onClearPin={() => setPinnedId(null)} />
            </div>
            <div className="col-span-12 min-w-0 sm:h-[520px] lg:col-span-8">
              <DataTable days={days} windowLabel={`${windowDef.days}-day`} />
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onPinProvider={pinnedFromPalette} onSetWindow={setWindowId} /> : null}
    </div>
  );
}
