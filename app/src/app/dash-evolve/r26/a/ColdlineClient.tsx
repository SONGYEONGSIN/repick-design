"use client";

import { Bell, MapPin, ShieldCheck, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";
import AlertsLog from "./AlertsLog";
import CommandPalette from "./CommandPalette";
import ExcursionHeatmap, { type PinnedCell } from "./ExcursionHeatmap";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ALERTS, DAY_LABELS, MATRIX_BY_PERIOD, PERIOD_LABEL, TIER_LABEL, WORKSPACES, computeStats, formatInt, formatMin, hourLabel, tierFor, type Period } from "./data";
import { APP_BG, BORDER, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, Eyebrow, Segmented } from "./ui";

const PERIOD_OPTIONS: { id: Period; label: string }[] = (Object.keys(PERIOD_LABEL) as Period[]).map((id) => ({ id, label: PERIOD_LABEL[id] }));

export default function ColdlineClient() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [period, setPeriod] = useState<Period>("week");
  // `pinned` is the only piece of state the heatmap shares with anything else on the
  // page — and it only ever reaches the KPI row below, never the Alerts Log.
  const [pinned, setPinned] = useState<PinnedCell | null>(null);

  const matrix = MATRIX_BY_PERIOD[period];
  const stats = computeStats(matrix);
  const openAlertCount = ALERTS.filter((a) => a.status === "open").length;

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

  // Changing the period swaps the whole dataset out from under any pinned index,
  // so the pin is cleared rather than silently pointing at a different cell.
  function handlePeriodChange(p: Period) {
    setPeriod(p);
    setPinned(null);
  }

  const pinnedValue = pinned ? matrix[pinned.day][pinned.hour] : null;
  const pinnedTier = pinnedValue !== null ? tierFor(pinnedValue) : null;
  const pinnedShareOfTotal = pinnedValue !== null && stats.total > 0 ? Math.round((pinnedValue / stats.total) * 1000) / 10 : null;
  const pinnedMultiple = pinnedValue !== null && stats.avgPerSlot > 0 ? Math.round((pinnedValue / stats.avgPerSlot) * 10) / 10 : null;

  return (
    <div className={cx("flex min-h-dvh overflow-x-hidden", APP_BG, TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <Eyebrow>{`Cold chain ops · ${WORKSPACES[0].name}`}</Eyebrow>
              <h1 className={cx("mt-1 text-2xl font-semibold tracking-tight sm:text-[28px]", TEXT_PRIMARY)}>Excursion intensity</h1>
              <p className={cx("mt-1.5 max-w-2xl text-sm font-normal leading-relaxed", TEXT_AUX)}>
                Pinning a cell in the grid below recalculates only the first two summary cards; compliance and open alerts stay
                network-wide, and the alerts log further down never reads the pin at all.
              </p>
            </div>
          </div>

          <h2 className="sr-only font-medium">Network summary</h2>
          <dl className="mt-4 grid grid-cols-12 gap-3">
            <div className={cx("relative col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              {pinned ? <PinnedTag /> : null}
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Excursion minutes</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Thermometer size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatMin(pinnedValue ?? stats.total)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>
                  {pinned && pinnedShareOfTotal !== null
                    ? `${DAY_LABELS[pinned.day]} ${hourLabel(pinned.hour)} · ${pinnedShareOfTotal}% of the ${PERIOD_LABEL[period].toLowerCase()} total`
                    : `Summed across all 168 hourly slots, ${PERIOD_LABEL[period].toLowerCase()}`}
                </span>
              </dd>
            </div>

            <div className={cx("relative col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              {pinned ? <PinnedTag /> : null}
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>{pinned ? "Selected slot" : "Peak window"}</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", TEXT_PRIMARY)}>
                  <MapPin size={17} aria-hidden="true" className={TEXT_AUX} />
                  {pinned && pinnedTier ? TIER_LABEL[pinnedTier] : `${DAY_LABELS[stats.peak.day]} ${hourLabel(stats.peak.hour)}`}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal tabular-nums", TEXT_MUTED)}>
                  {pinned && pinnedMultiple !== null
                    ? `${formatMin(pinnedValue ?? 0)} · ${pinnedMultiple}× the ${stats.avgPerSlot} min network average`
                    : `${formatMin(stats.peak.value)} — the network's single highest slot`}
                </span>
              </dd>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Compliance rate</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <ShieldCheck size={17} aria-hidden="true" className={TEXT_AUX} />
                  {stats.compliancePct}%
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>Hourly slots within the 15 min safe band — network-wide, not affected by the pin</span>
              </dd>
            </div>

            <div className={cx("col-span-12 min-w-0 rounded-2xl border p-4 sm:col-span-6 xl:col-span-3", BORDER, SURFACE_INSET)}>
              <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>Open alerts</dt>
              <dd className="mt-1.5">
                <span className={cx("flex items-center gap-1.5 text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>
                  <Bell size={17} aria-hidden="true" className={TEXT_AUX} />
                  {formatInt(openAlertCount)}
                </span>
                <span className={cx("mt-2 block text-[11px] font-normal", TEXT_MUTED)}>From the alerts log below — its own dataset, unrelated to the grid</span>
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <Card>
              <CardHead
                title="Excursion minutes by hour and day"
                hint="Every cell prints its own minute count; hover or focus reads it out below without changing anything else."
                action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={handlePeriodChange} ariaLabel="Time window" />}
              />
              <div className="mt-3">
                <ExcursionHeatmap matrix={matrix} stats={stats} pinned={pinned} onPinCell={setPinned} periodLabel={PERIOD_LABEL[period]} />
              </div>
            </Card>
          </div>

          <div className="mt-4">
            <Card>
              <CardHead title="Recent alerts" hint="Every open, acknowledged and resolved excursion across the network, most severe or longest first." />
              <div className="mt-3">
                <AlertsLog />
              </div>
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen ? <CommandPalette onClose={() => setPaletteOpen(false)} onSelectAlert={() => setPaletteOpen(false)} /> : null}
    </div>
  );
}

function PinnedTag() {
  return <span className="absolute right-3 top-3 rounded-full border border-violet-200 bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">Pinned</span>;
}
