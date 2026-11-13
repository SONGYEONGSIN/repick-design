"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";
import { KpiRow } from "./KpiRow";
import { ScheduleGrid } from "./ScheduleGrid";
import { MobileAgenda } from "./MobileAgenda";
import { DetailPanel } from "./DetailPanel";
import { BookingsTable } from "./BookingsTable";
import { SegmentedControl } from "./ui";
import { DAYS, RESOURCES, RESOURCE_TYPE_LABEL, type Day, type Resource, type ResourceType, type Slot } from "./data";

type TypeFilter = "all" | ResourceType;

type Selection = {
  key: string;
  day: Day;
  hour: number;
  resource: Resource;
  slot: Slot | undefined;
};

export function GrainhouseClient() {
  const [day, setDay] = useState<Day>("Mon");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const visibleResources =
    typeFilter === "all" ? RESOURCES : RESOURCES.filter((r) => r.type === typeFilter);

  function selectResourceById(id: string) {
    const resource = RESOURCES.find((r) => r.id === id);
    if (!resource) return;
    if (typeFilter !== "all" && resource.type !== typeFilter) setTypeFilter("all");
    setSelection({ key: `${id}__${day}__9`, day, hour: 9, resource, slot: undefined });
  }

  function scrollToId(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const selectedRevenue =
    selection && selection.slot
      ? selection.resource.hourlyRate * (selection.slot.status === "booked" || selection.slot.status === "hold" ? 1 : 0)
      : null;
  const selectedLabel = selection ? `${selection.resource.shortName} · ${selection.day} ${selection.hour}:00` : null;

  return (
    <div className="flex min-h-screen w-full min-w-0 bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Topbar onOpenPalette={() => setPaletteOpen(true)} />

        <main className="min-w-0 flex-1 space-y-4 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-[family-name:var(--font-display-wide)] text-xl font-semibold text-slate-50">
              Schedule
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <SegmentedControl
                label="Filter by resource type"
                value={typeFilter}
                onChange={(v) => setTypeFilter(v)}
                options={[
                  { value: "all", label: "All" },
                  { value: "studio", label: RESOURCE_TYPE_LABEL.studio },
                  { value: "edit-bay", label: RESOURCE_TYPE_LABEL["edit-bay"] },
                  { value: "equipment", label: RESOURCE_TYPE_LABEL.equipment },
                ]}
              />
              <SegmentedControl
                label="Select day"
                value={day}
                onChange={(v) => setDay(v)}
                options={DAYS.map((d) => ({ value: d, label: d }))}
              />
            </div>
          </div>

          <KpiRow selectedRevenue={selectedRevenue} selectedLabel={selectedLabel} />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <div className="hidden min-w-0 rounded-xl border border-white/10 bg-slate-900/60 p-4 shadow-sm md:block">
                <h2 className="text-sm font-medium text-slate-100">{day} availability, 9:00–17:00</h2>
                <p className="mt-0.5 text-xs font-normal text-slate-400">
                  Indigo = booked, amber = tentative hold. Hover or focus a cell for its client and project.
                </p>
                <div className="mt-3">
                  <ScheduleGrid
                    day={day}
                    resources={visibleResources}
                    selectedKey={selection?.key ?? null}
                    onSelect={({ key, slot, resource, hour }) => setSelection({ key, day, hour, resource, slot })}
                  />
                </div>
              </div>
              <MobileAgenda day={day} resources={visibleResources} />
            </div>

            <div className="min-w-0 xl:col-span-4">
              <DetailPanel
                day={selection?.day ?? null}
                hour={selection?.hour ?? null}
                resource={selection?.resource ?? null}
                slot={selection?.slot}
                onClear={() => setSelection(null)}
              />
            </div>
          </div>

          <BookingsTable highlightResourceId={selection?.resource.id ?? null} />
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        selectResource={selectResourceById}
        selectDay={setDay}
        scrollToBookings={() => scrollToId("upcoming-bookings")}
      />
    </div>
  );
}
