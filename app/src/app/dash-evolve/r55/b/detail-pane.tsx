"use client";

import { useRef, type KeyboardEvent } from "react";
import { AlertTriangle } from "lucide-react";
import type { Incident } from "./data";
import { formatMinutes, formatPct } from "./data";
import type { VendorRow } from "./vendor-rail";
import { Card, ComplianceBadge, FOCUS_RING, Label } from "./ui";
import { ExpandedBoxPlot } from "./box-plot";
import { IncidentsTable } from "./incidents-table";

export type TabId = "overview" | "incidents";

// Tabs and panels share one hand-set id pair each, declared once here, so the two sides can
// never drift apart the way two independently-`useId()`'d components would.
const TABS: { id: TabId; label: string; tabId: string; panelId: string }[] = [
  { id: "overview", label: "Overview", tabId: "vendor-tab-overview", panelId: "vendor-panel-overview" },
  { id: "incidents", label: "Incidents", tabId: "vendor-tab-incidents", panelId: "vendor-panel-incidents" },
];

function statusTargetCopy(status: VendorRow["stats"]["status"]): string {
  if (status === "compliant") return "90% of responses land inside target.";
  if (status === "at-risk") return "The median beats target, but the slow tail doesn't.";
  return "Even the median response misses target.";
}

export function DetailPane({
  vendor,
  incidents,
  activeTab,
  onTabChange,
}: {
  vendor: VendorRow;
  incidents: Incident[];
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}) {
  const openCount = incidents.filter((i) => i.status === "Open").length;
  const withinTargetCount = vendor.samples.filter((s) => s <= vendor.targetMinutes).length;
  const withinTargetPct = (withinTargetCount / vendor.samples.length) * 100;
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ overview: null, incidents: null });

  function handleTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = TABS.findIndex((t) => t.id === activeTab);
    const nextIdx = e.key === "ArrowRight" ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
    const next = TABS[nextIdx];
    onTabChange(next.id);
    tabRefs.current[next.id]?.focus();
  }

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Card>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-zinc-900">{vendor.name}</h2>
              <ComplianceBadge status={vendor.stats.status} />
            </div>
            <p className="mt-1 truncate text-sm text-zinc-600">
              {vendor.category} · relationship owner {vendor.owner}
            </p>
            <p className="mt-1.5 max-w-prose text-sm text-zinc-600">{statusTargetCopy(vendor.stats.status)}</p>
          </div>
          {vendor.stats.status !== "compliant" ? (
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {openCount} open incident{openCount === 1 ? "" : "s"}
            </div>
          ) : null}
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
          <div className="min-w-0">
            <Label>SLA target</Label>
            <dd className="text-sm font-medium tabular-nums text-zinc-900">{formatMinutes(vendor.targetMinutes)}</dd>
          </div>
          <div className="min-w-0">
            <Label>Within target</Label>
            <dd className="text-sm font-medium tabular-nums text-zinc-900">{formatPct(withinTargetPct)}</dd>
          </div>
          <div className="min-w-0">
            <Label>Sample size</Label>
            <dd className="text-sm font-medium tabular-nums text-zinc-900">{vendor.stats.sampleSize} tickets</dd>
          </div>
          <div className="min-w-0">
            <Label>Slowest observed</Label>
            <dd className="text-sm font-medium tabular-nums text-zinc-900">{formatMinutes(vendor.stats.max)}</dd>
          </div>
        </dl>
      </Card>

      <Card padded={false}>
        <div role="tablist" aria-label="Vendor detail views" className="flex min-w-0 border-b border-zinc-200 px-2 pt-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                id={tab.tabId}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={tab.panelId}
                tabIndex={active ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={handleTabKeyDown}
                className={`relative -mb-px h-11 min-w-0 shrink-0 whitespace-nowrap px-4 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                  active ? "border-b-2 border-orange-800 text-zinc-900" : "border-b-2 border-transparent text-zinc-600 hover:text-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id={TABS[0].panelId}
          role="tabpanel"
          aria-labelledby={TABS[0].tabId}
          hidden={activeTab !== "overview"}
          className="min-w-0 p-4 sm:p-5"
        >
          <h3 className="text-sm font-semibold text-zinc-900">Response-time distribution</h3>
          <p className="mt-0.5 text-xs text-zinc-600">
            P10–P90 across the last {vendor.stats.sampleSize} tickets, drawn on the same shared scale as every row in the rail.
          </p>
          <div className="mt-4 min-w-0">
            <ExpandedBoxPlot stats={vendor.stats} target={vendor.targetMinutes} vendorName={vendor.name} />
          </div>
        </div>

        <div
          id={TABS[1].panelId}
          role="tabpanel"
          aria-labelledby={TABS[1].tabId}
          hidden={activeTab !== "incidents"}
          className="min-w-0 p-4 sm:p-5"
        >
          <IncidentsTable vendorName={vendor.name} incidents={incidents} />
        </div>
      </Card>
    </div>
  );
}
