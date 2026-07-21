"use client";

import { Activity, Gauge as GaugeIcon, Server, Siren } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import DetailPanel from "./DetailPanel";
import GaugeCluster from "./GaugeCluster";
import IncidentTable from "./IncidentTable";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { aggregateMetrics, formatUptimePct, INCIDENTS, PERIODS, SERVICES, type PeriodId, type ServiceId } from "./data";
import { BORDER, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import { Card, EyebrowLabel, SegmentedControl } from "./ui";

type Scope = ServiceId | "all";

const SCOPE_OPTIONS: { id: string; label: string }[] = [{ id: "all", label: "All services" }, ...SERVICES.map((s) => ({ id: s.id, label: s.label }))];

function firstIncidentIdForScope(scope: Scope): string | null {
  const match = INCIDENTS.find((inc) => scope === "all" || inc.service === scope);
  return match ? match.id : null;
}

export default function RedlineClient() {
  const [period, setPeriod] = useState<PeriodId>("24h");
  const [scope, setScope] = useState<Scope>("all");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(() => firstIncidentIdForScope("all"));
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

  function changeScope(next: string) {
    const nextScope = next as Scope;
    setScope(nextScope);
    setSelectedIncidentId(firstIncidentIdForScope(nextScope));
  }

  function selectServiceFromPalette(id: ServiceId) {
    changeScope(id);
  }

  function selectIncidentFromPalette(id: string) {
    const inc = INCIDENTS.find((i) => i.id === id);
    if (inc) setScope(inc.service);
    setSelectedIncidentId(id);
  }

  function selectIncidentFromTable(id: string) {
    setSelectedIncidentId(id);
  }

  const openIncidentCount = useMemo(() => INCIDENTS.filter((i) => i.status !== "resolved").length, []);
  const fleet = useMemo(() => aggregateMetrics("24h"), []);

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden", "bg-zinc-50 dark:bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>SLO &amp; Error-Budget Console</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Production Fleet · 4 services · updated on every observation window</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InlineStat icon={Activity} label="Fleet uptime (24h)" value={formatUptimePct(fleet.uptimePct)} />
                <InlineStat icon={Siren} label="Open incidents" value={String(openIncidentCount)} tone={openIncidentCount > 0 ? "text-rose-700 dark:text-rose-300" : undefined} />
                <InlineStat icon={Server} label="Services" value={String(SERVICES.length)} />
              </div>
            </header>

            <Card padded={false}>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <GaugeIcon size={14} aria-hidden="true" className={TEXT_CAPTION} />
                    <h2 id="cluster-heading" className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>
                      Live gauge cluster
                    </h2>
                  </div>
                  <p className={cx("mt-0.5 text-xs", TEXT_CAPTION)}>
                    {scope === "all" ? "Fleet composite" : scope} · arc fill + needle encode current reading against target &amp; danger zones · hover or focus a gauge for exact readings
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SegmentedControl ariaLabel="Service scope" options={SCOPE_OPTIONS} value={scope} onChange={changeScope} size="sm" />
                  <SegmentedControl ariaLabel="Observation window" options={PERIODS} value={period} onChange={setPeriod} size="sm" />
                </div>
              </div>
              <div className={cx("border-t p-4 sm:p-6", BORDER)} aria-labelledby="cluster-heading">
                <GaugeCluster scope={scope} period={period} />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
              <Card className="min-w-0 xl:col-span-8">
                <IncidentTable scope={scope} selectedId={selectedIncidentId} onSelect={selectIncidentFromTable} />
              </Card>
              <Card className="min-w-0 xl:col-span-4">
                <DetailPanel incidentId={selectedIncidentId} />
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette onClose={() => setPaletteOpen(false)} onSelectService={selectServiceFromPalette} onSelectIncident={selectIncidentFromPalette} />
      ) : null}
    </div>
  );
}

function InlineStat({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <EyebrowLabel>{label}</EyebrowLabel>
      </div>
      <p className={cx("mt-0.5 text-lg font-semibold tabular-nums", tone ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}

