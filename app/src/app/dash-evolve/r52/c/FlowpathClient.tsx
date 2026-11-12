"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { TicketRail } from "./TicketRail";
import { DetailPanel } from "./DetailPanel";
import { SankeyFlow } from "./SankeyFlow";
import { EscalationTable } from "./EscalationTable";
import { Card, SegmentedControl } from "./ui";
import { TICKETS, totalResolved, totalIntake, flowForPeriod, type FlowPeriod } from "./data";

export function FlowpathClient() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(TICKETS[0].id);
  const [period, setPeriod] = useState<FlowPeriod>("30d");

  const links = flowForPeriod(period);
  const resolved = totalResolved(links);
  const intake = totalIntake(links);
  const resolveRate = Math.round((resolved / intake) * 100);
  const escalatedCount = links.find((l) => l.from === "Engineering" && l.to === "Escalated")?.value ?? 0;

  return (
    <div className="min-h-dvh bg-white">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="lg:pl-60">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main id="main-content" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-[family-name:var(--font-display-grotesk)] text-xl font-semibold text-zinc-900">
                Ticket flow
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                From intake to resolution — where tickets go, and which ones escalate.
              </p>
            </div>
            <SegmentedControl
              label="Flow window"
              value={period}
              onChange={setPeriod}
              options={[
                { value: "30d", label: "Last 30 days" },
                { value: "7d", label: "Last 7 days" },
              ]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Intake</div>
              <div className="mt-1 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
                {intake}
              </div>
            </Card>
            <Card>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Resolved</div>
              <div className="mt-1 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
                {resolved}
              </div>
            </Card>
            <Card>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Resolve rate</div>
              <div className="mt-1 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
                {resolveRate}%
              </div>
            </Card>
            <Card>
              <div className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">Escalated</div>
              <div className="mt-1 font-[family-name:var(--font-display-grotesk)] text-2xl font-semibold tabular-nums text-zinc-900">
                {escalatedCount}
              </div>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
            <Card className="min-w-0 xl:col-span-2">
              <TicketRail selectedId={selectedId} onSelect={setSelectedId} />
            </Card>
            <Card className="min-w-0 xl:col-span-3">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="mb-3 text-sm font-semibold text-zinc-900">Flow, {period === "30d" ? "last 30 days" : "last 7 days"}</h2>
                  <SankeyFlow period={period} />
                </div>
                <div>
                  <DetailPanel ticketId={selectedId} />
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <EscalationTable selectedId={selectedId} onSelect={setSelectedId} />
          </Card>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelectTicket={setSelectedId} />
    </div>
  );
}
