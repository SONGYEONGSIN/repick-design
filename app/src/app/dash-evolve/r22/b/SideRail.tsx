"use client";

import { Network, X, Timer, Percent, ArrowDownRight, ArrowUpRight, Activity } from "lucide-react";
import {
  getNode,
  canonicalStatus,
  upstreamCount,
  downstreamCount,
  primaryTraffic,
  intFormat,
} from "./data";
import { STATUS_META, ACCENT } from "./tokens";
import { Card, Badge, Progress, Sparkline } from "./ui";

function LegendRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2.5 text-xs text-zinc-600">{children}</div>;
}

export function GraphLegend({ encoding }: { encoding: "latency" | "error" }) {
  return (
    <Card className="p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Legend</h2>
      <div className="mt-3 space-y-2">
        <LegendRow>
          <svg width="20" height="8" aria-hidden="true"><line x1="1" y1="4" x2="19" y2="4" strokeWidth="2" className="stroke-zinc-300" /></svg>
          Healthy call path
        </LegendRow>
        <LegendRow>
          <svg width="20" height="8" aria-hidden="true"><line x1="1" y1="4" x2="19" y2="4" strokeWidth="2" strokeDasharray="6 3" className="stroke-amber-700" /></svg>
          Degraded — dashed
        </LegendRow>
        <LegendRow>
          <svg width="20" height="8" aria-hidden="true"><line x1="1" y1="4" x2="19" y2="4" strokeWidth="2" strokeDasharray="1.5 3" className="stroke-rose-700" /></svg>
          Critical — dotted
        </LegendRow>
        <LegendRow>
          <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" strokeDasharray="3 3" className={ACCENT.stroke} /></svg>
          Hovered / focused node
        </LegendRow>
        <LegendRow>
          <svg width="16" height="16" aria-hidden="true"><circle cx="8" cy="8" r="6" fill="none" strokeWidth="2" className={ACCENT.stroke} /></svg>
          Pinned node (click or Enter)
        </LegendRow>
      </div>
      <p className="mt-3 border-t border-zinc-100 pt-3 text-xs leading-relaxed text-zinc-500">
        {encoding === "latency"
          ? "Node color follows p99 latency — healthy under 100ms, degraded 100–249ms, critical 250ms and above."
          : "Node color follows error rate — healthy under 1%, degraded 1–3.4%, critical 3.5% and above."}
      </p>
    </Card>
  );
}

interface InspectorProps {
  activeId: string | null;
  pinnedId: string | null;
  onClear: () => void;
}

/** Ephemeral inspector: reads only `activeId` (pinned-or-hovered node id) from the parent. It never
 *  reaches into the KPI strip or AdjacencyTable, and nothing here writes back to them either — the
 *  data flow is one-directional and scoped to this one panel. */
export function InspectorPanel({ activeId, pinnedId, onClear }: InspectorProps) {
  if (!activeId) {
    return (
      <Card className="flex flex-col items-center gap-2 px-5 py-10 text-center">
        <h2 className="sr-only">Service inspector</h2>
        <Network size={22} className="text-zinc-300" aria-hidden="true" />
        <p className="text-sm font-medium text-zinc-600">No service selected</p>
        <p className="text-xs leading-relaxed text-zinc-500">
          Click or Tab to a node in the graph, pick one from ⌘K, or select a row in the table below to inspect it
          here.
        </p>
      </Card>
    );
  }

  const node = getNode(activeId)!;
  const status = canonicalStatus(node);
  const meta = STATUS_META[status];
  const StatusIcon = meta.icon;
  const up = upstreamCount(node.id);
  const down = downstreamCount(node.id);
  const traffic = primaryTraffic(node.id);
  const successRate = 100 - node.errorRatePct;
  const progressColor = status === "healthy" ? "bg-emerald-500" : status === "degraded" ? "bg-amber-700" : "bg-rose-700";

  return (
    <Card className="p-4">
      <h2 className="sr-only">Service inspector</h2>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-semibold text-zinc-900">{node.label}</p>
          <Badge className={`mt-1.5 ${meta.badge}`}>
            <StatusIcon size={11} aria-hidden="true" />
            {meta.label}
          </Badge>
        </div>
        {pinnedId === node.id && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear pinned selection"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-zinc-500 outline-none hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-teal-700"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3">
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
            <Timer size={11} aria-hidden="true" /> P99 latency
          </dt>
          <dd className="text-sm font-semibold text-zinc-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {node.latencyMs}ms
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
            <Percent size={11} aria-hidden="true" /> Error rate
          </dt>
          <dd className="text-sm font-semibold text-zinc-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {node.errorRatePct.toFixed(2)}%
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
            <ArrowDownRight size={11} aria-hidden="true" /> Upstream
          </dt>
          <dd className="text-sm font-semibold text-zinc-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {up} {up === 1 ? "caller" : "callers"}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-500">
            <ArrowUpRight size={11} aria-hidden="true" /> Downstream
          </dt>
          <dd className="text-sm font-semibold text-zinc-900" style={{ fontVariantNumeric: "tabular-nums" }}>
            {down} {down === 1 ? "dependency" : "dependencies"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-zinc-500">
          <span className="flex items-center gap-1">
            <Activity size={11} aria-hidden="true" /> Traffic
          </span>
          <span className="font-semibold text-zinc-700" style={{ fontVariantNumeric: "tabular-nums" }}>
            {intFormat.format(traffic)}/min
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-zinc-500">
          <span>Success rate</span>
          <span className="font-semibold text-zinc-700" style={{ fontVariantNumeric: "tabular-nums" }}>
            {successRate.toFixed(2)}%
          </span>
        </div>
        <Progress value={successRate} className={progressColor} />
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wide text-zinc-500">Latency trend, 6 samples</span>
          <span className="text-[11px] text-zinc-500">ms</span>
        </div>
        <div className="mt-1.5">
          <Sparkline
            data={node.latencyTrend}
            strokeClassName={status === "healthy" ? "stroke-zinc-500" : status === "degraded" ? "stroke-amber-700" : "stroke-rose-700"}
            dotClassName={status === "healthy" ? "fill-zinc-500" : status === "degraded" ? "fill-amber-700" : "fill-rose-700"}
          />
        </div>
      </div>
    </Card>
  );
}
