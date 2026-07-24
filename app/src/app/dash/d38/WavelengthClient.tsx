"use client";

import { Radio, Siren, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CommandPalette from "./CommandPalette";
import CoverageCard from "./CoverageCard";
import DetailPanel from "./DetailPanel";
import IncidentRail from "./IncidentRail";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { ENGINEERS, INCIDENTS, NOW_LABEL, TODAY_DATE_LABEL, engineerById, openIncidentCount, shiftForHour, NOW_HOUR, type EngineerId, type ServiceId } from "./data";
import { TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";
import type { RingRange } from "./OnCallRing";
import { Card } from "./ui";

export default function WavelengthClient() {
  const [range, setRange] = useState<RingRange>("today");
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(INCIDENTS[0].id);
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

  const selectedIncident = useMemo(() => INCIDENTS.find((i) => i.id === selectedIncidentId) ?? INCIDENTS[0], [selectedIncidentId]);

  const highlightHour = range === "today" && selectedIncident.dateLabel === TODAY_DATE_LABEL ? selectedIncident.triggeredHour : null;
  const highlightDay = range === "week" ? selectedIncident.dayIndex : null;

  function selectIncidentFromPalette(id: string) {
    setSelectedIncidentId(id);
  }

  function selectServiceFromPalette(id: ServiceId) {
    const match = INCIDENTS.find((i) => i.service === id);
    if (match) setSelectedIncidentId(match.id);
  }

  function selectEngineerFromPalette(id: EngineerId) {
    const match = INCIDENTS.find((i) => i.responder === id);
    if (match) setSelectedIncidentId(match.id);
  }

  const currentOnCall = engineerById(shiftForHour(NOW_HOUR).engineer);

  return (
    <div className={cx("flex h-dvh min-h-dvh overflow-hidden bg-zinc-950", TEXT_PRIMARY)}>
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main id="main-content" className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          <div className="mx-auto flex max-w-[1680px] flex-col gap-4 p-4 sm:p-6">
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className={cx("text-xl font-semibold tracking-tight sm:text-2xl", TEXT_PRIMARY)}>Incident &amp; On-Call Response</h1>
                <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Core Platform · {ENGINEERS.length} responders · snapshot as of {NOW_LABEL}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <InlineStat icon={Siren} label="Open incidents" value={String(openIncidentCount)} tone={openIncidentCount > 0 ? "text-rose-300" : undefined} />
                <InlineStat icon={Radio} label="On call right now" value={currentOnCall.name} />
                <InlineStat icon={Users} label="Responders" value={String(ENGINEERS.length)} />
              </div>
            </header>

            <CoverageCard range={range} onRangeChange={setRange} highlightHour={highlightHour} highlightDay={highlightDay} />

            <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
              <Card className="w-full lg:w-[380px] lg:shrink-0">
                <IncidentRail selectedId={selectedIncidentId} onSelect={setSelectedIncidentId} />
              </Card>
              <Card className="min-w-0 flex-1">
                <DetailPanel incidentId={selectedIncidentId} />
              </Card>
            </div>
          </div>
        </main>
      </div>

      {paletteOpen ? (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onSelectIncident={selectIncidentFromPalette}
          onSelectService={selectServiceFromPalette}
          onSelectEngineer={selectEngineerFromPalette}
        />
      ) : null}
    </div>
  );
}

function InlineStat({ icon: Icon, label, value, tone }: { icon: typeof Siren; label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <Icon size={12} aria-hidden="true" className={TEXT_CAPTION} />
        <span className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{label}</span>
      </div>
      <p className={cx("mt-0.5 truncate text-lg font-semibold", tone ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
