"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Server, Clock, UserRound, Activity } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { CommandPalette } from "./command-palette";
import { TimelineChart } from "./timeline-chart";
import { AnomalyTable } from "./anomaly-table";
import { RunbookChecklist } from "./runbook-checklist";
import { Card, SectionLabel, SegmentedControl, StatusBadge, SEVERITY_STYLE } from "./ui";
import { getPoints, getAnomalies, statusFor, METRIC_META, RANGE_META } from "./data";
import type { MetricId, RangeId, Severity } from "./data";
import { formatValue, formatInt } from "./format";

const METRIC_OPTIONS: readonly MetricId[] = ["error-rate", "latency", "volume"];
const RANGE_OPTIONS: readonly RangeId[] = ["24h", "7d", "30d"];
const SEVERITIES: readonly Severity[] = ["minor", "moderate", "severe"];

// Short forms for the segmented control only — METRIC_META.label (the full name) is still what
// shows in the heading, the legend and the table. At 390px the full labels ("Request volume")
// don't leave enough room for all three pills side by side; these do.
const METRIC_SHORT_LABEL: Record<MetricId, string> = {
  "error-rate": "Errors",
  latency: "Latency",
  volume: "Volume",
};

function formatDiff(metric: MetricId, diff: number): string {
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  const abs = Math.abs(diff);
  if (metric === "error-rate") return `${sign}${abs.toFixed(2)}pp`;
  if (metric === "latency") return `${sign}${formatInt(abs)} ms`;
  return `${sign}${formatInt(abs)} req/s`;
}

export function IncidentConsole() {
  const [metric, setMetric] = useState<MetricId>("error-rate");
  const [range, setRange] = useState<RangeId>("24h");
  const [hoveredAnomaly, setHoveredAnomaly] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);

  // Global ⌘K / Ctrl+K shortcut. This effect only adds/removes a DOM event
  // listener — it never sets state in response to a prop, so it is not the
  // `react-hooks/set-state-in-effect` pattern this catalog has hit before.
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

  function handleMetricChange(next: MetricId) {
    setMetric(next);
    setHoveredAnomaly(null);
  }

  function handleRangeChange(next: RangeId) {
    setRange(next);
    setHoveredAnomaly(null);
  }

  const points = useMemo(() => getPoints(metric, range), [metric, range]);
  const anomalies = useMemo(() => getAnomalies(metric, range), [metric, range]);
  const status = useMemo(() => statusFor(metric, range), [metric, range]);

  const current = points[points.length - 1].value;
  const previous = points.length > 1 ? points[points.length - 2].value : current;
  const diff = current - previous;
  const trendUp = diff > 0;

  return (
    <div className="flex h-screen min-h-0 overflow-hidden bg-zinc-950 text-zinc-50">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onOpenMobileNav={() => setMobileNavOpen(true)}
          onOpenPalette={() => setPaletteOpen(true)}
          searchTriggerRef={searchTriggerRef}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1680px] px-4 py-6 sm:px-6 lg:px-8">
            <header className="mb-6">
              <h1
                className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Incident Response Console
              </h1>
              <p className="mt-1 text-sm font-normal text-zinc-400">
                One live metric, flagged anomalies always labeled on the chart, and a static runbook below.
              </p>
            </header>

            {/* KPI strip — numbers here are deliberately the smallest tabular-nums text on the
                page (11px), strictly smaller than both the hero's current-value readout and its
                anomaly magnitude annotations, per this round's KPI-row subordination rule. */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Card className="min-w-0" padded={false}>
                <div className="flex items-center gap-2 p-4">
                  <Activity className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <SectionLabel>Flagged now</SectionLabel>
                    <p className="text-[11px] font-semibold tabular-nums text-zinc-50">{anomalies.length} anomalies</p>
                  </div>
                </div>
              </Card>
              <Card className="min-w-0" padded={false}>
                <div className="flex items-center gap-2 p-4">
                  <Server className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <SectionLabel>Services</SectionLabel>
                    <p className="text-[11px] font-semibold tabular-nums text-zinc-50">6 monitored</p>
                  </div>
                </div>
              </Card>
              <Card className="min-w-0" padded={false}>
                <div className="flex items-center gap-2 p-4">
                  <Clock className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <SectionLabel>Avg. MTTR (30d)</SectionLabel>
                    <p className="text-[11px] font-semibold tabular-nums text-zinc-50">18m</p>
                  </div>
                </div>
              </Card>
              <Card className="min-w-0" padded={false}>
                <div className="flex items-center gap-2 p-4">
                  <UserRound className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden="true" />
                  <div className="min-w-0">
                    <SectionLabel>On-call</SectionLabel>
                    <p className="truncate text-[11px] font-semibold text-zinc-50">Alex Rivera</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Hero: the single full-width anomaly timeline. No side rail, no persistent detail
                pane beside it — the only reaction to a hovered/focused point is the ephemeral
                tooltip rendered inside TimelineChart itself. */}
            <Card className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <SectionLabel>{METRIC_META[metric].label} — {RANGE_META[range].description}</SectionLabel>
                  <div className="mt-1 flex flex-wrap items-baseline gap-3">
                    <p className="text-4xl font-semibold tabular-nums text-zinc-50">
                      {formatValue(metric, current)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-normal tabular-nums ${
                        trendUp ? "text-zinc-50" : "text-zinc-400"
                      }`}
                    >
                      {trendUp ? (
                        <ArrowUp className="h-3 w-3 shrink-0" aria-hidden="true" />
                      ) : (
                        <ArrowDown className="h-3 w-3 shrink-0" aria-hidden="true" />
                      )}
                      {formatDiff(metric, diff)} vs previous reading
                    </span>
                    <StatusBadge severity={status.severity} label={status.label} />
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <SegmentedControl
                    options={METRIC_OPTIONS}
                    value={metric}
                    onChange={handleMetricChange}
                    getLabel={(v) => METRIC_SHORT_LABEL[v]}
                    ariaLabel="Metric"
                  />
                  <SegmentedControl
                    options={RANGE_OPTIONS}
                    value={range}
                    onChange={handleRangeChange}
                    getLabel={(v) => RANGE_META[v].label}
                    ariaLabel="Time range"
                  />
                </div>
              </div>

              <div className="mt-6">
                <TimelineChart metric={metric} range={range} hoveredIndex={hoveredAnomaly} onHoverChange={setHoveredAnomaly} />
              </div>

              {/* Legend: shape AND color both carry severity meaning, never color alone. */}
              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                {SEVERITIES.map((sev) => {
                  const style = SEVERITY_STYLE[sev];
                  const Icon = style.icon;
                  return (
                    <span key={sev} className={`inline-flex items-center gap-1.5 text-xs font-normal ${style.text}`}>
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {style.word}
                    </span>
                  );
                })}
                <span className="text-xs font-normal text-zinc-400">Markers are focusable — tab through flagged points for full detail.</span>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <AnomalyTable metric={metric} anomalies={anomalies} />
              </div>
            </Card>

            {/* Independent runbook — see comment in runbook-checklist.tsx for why it never
                reads `metric`, `range` or `hoveredAnomaly`. */}
            <Card>
              <RunbookChecklist />
            </Card>
          </div>
        </main>
      </div>

      {paletteOpen && (
        <CommandPalette
          onClose={() => {
            setPaletteOpen(false);
            searchTriggerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}
