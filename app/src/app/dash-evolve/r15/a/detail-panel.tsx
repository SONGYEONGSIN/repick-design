"use client";

import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Clock, Gauge, Percent, ShieldCheck, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { CALLED_BY, CALLS_OUT, ERROR_TREND, LATENCY_TREND, NODE_MAP, TIER_LABEL, TREND_LABELS, type NodeId } from "./data";
import { formatMs, formatPct } from "./format";
import SparklineCrosshair from "./sparkline-crosshair";
import { BORDER, DIVIDE, FOCUS_RING, HEALTH_TONE, HOVER_ROW, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, type Health, cx } from "./tokens";
import { HealthBadge, StatItem } from "./ui";

const HEALTH_ICON: Record<Health, LucideIcon> = { healthy: CheckCircle2, degraded: AlertTriangle, critical: AlertOctagon };

export default function DetailPanel({ nodeId, onClose, onSelect }: { nodeId: NodeId | null; onClose: () => void; onSelect: (id: NodeId) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = nodeId !== null;
  const node = nodeId ? NODE_MAP[nodeId] : null;

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open, nodeId]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!node) return null;

  const tone = HEALTH_TONE[node.health];
  const callsOut = CALLS_OUT[node.id];
  const calledBy = CALLED_BY[node.id];

  return (
    <div className="fixed inset-0 z-40" role="presentation">
      <button type="button" aria-label="Close service detail panel" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-panel-heading"
        className={cx(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l shadow-2xl",
          BORDER,
          "bg-zinc-950",
          "transition-transform duration-200 ease-out motion-reduce:transition-none",
        )}
      >
        <div className={cx("flex shrink-0 items-start justify-between gap-3 border-b p-4", BORDER)}>
          <div className="min-w-0">
            <p className={cx("text-[11px] font-semibold uppercase tracking-wider", TEXT_CAPTION)}>{TIER_LABEL[node.tier]}</p>
            <h2 id="detail-panel-heading" className={cx("mt-0.5 truncate text-base font-semibold tracking-tight", TEXT_PRIMARY)}>
              {node.label}
            </h2>
            <div className="mt-1.5 flex items-center gap-2">
              <HealthBadge health={node.health} />
              <span className={cx("text-xs", TEXT_CAPTION)}>{node.owner}</span>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg", HOVER_ROW, TRANSITION, FOCUS_RING)}>
            <X size={16} aria-hidden="true" className={TEXT_CAPTION} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 [scrollbar-width:thin]">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatItem Icon={Clock} label="P99 latency" value={formatMs(node.p99Ms)} valueClassName={node.health !== "healthy" ? tone.text : undefined} />
            <StatItem Icon={Percent} label="Error rate" value={formatPct(node.errorRatePct)} valueClassName={node.health !== "healthy" ? tone.text : undefined} />
            <StatItem Icon={ShieldCheck} label="Uptime (30d)" value={formatPct(node.uptimePct)} />
            <StatItem Icon={Gauge} label="Requests/s" value={node.rps.toLocaleString("en-US")} />
          </dl>

          <div className="mt-6">
            <h3 className={cx("text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>P99 latency — last 40 minutes</h3>
            <div className="mt-2.5">
              <SparklineCrosshair data={LATENCY_TREND[node.id]} labels={TREND_LABELS} formatValue={formatMs} stroke={tone.stroke} fillId={`latency-${node.id}`} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className={cx("text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Error rate — last 40 minutes</h3>
            <div className="mt-2.5">
              <SparklineCrosshair data={ERROR_TREND[node.id]} labels={TREND_LABELS} formatValue={formatPct} stroke={tone.stroke} fillId={`error-${node.id}`} />
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <AdjacencyList title={`Calls (${callsOut.length})`} entries={callsOut} onSelect={onSelect} emptyLabel="Calls nothing downstream." />
            <AdjacencyList title={`Called by (${calledBy.length})`} entries={calledBy} onSelect={onSelect} emptyLabel="Nothing depends on this service." />
          </div>

          <dl className={cx("mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs", BORDER)}>
            <div>
              <dt className={TEXT_CAPTION}>Deployed version</dt>
              <dd className={cx("mt-0.5 font-medium tabular-nums", TEXT_PRIMARY)}>{node.version}</dd>
            </div>
            <div>
              <dt className={TEXT_CAPTION}>Owning team</dt>
              <dd className={cx("mt-0.5 font-medium", TEXT_PRIMARY)}>{node.owner}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function AdjacencyList({
  title,
  entries,
  onSelect,
  emptyLabel,
}: {
  title: string;
  entries: { id: NodeId; short: string; health: Health }[];
  onSelect: (id: NodeId) => void;
  emptyLabel: string;
}) {
  return (
    <div>
      <h3 className={cx("text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>{title}</h3>
      {entries.length === 0 ? (
        <p className={cx("mt-2 text-xs", TEXT_CAPTION)}>{emptyLabel}</p>
      ) : (
        <ul className={cx("mt-2 divide-y overflow-hidden rounded-lg border", DIVIDE, BORDER)}>
          {entries.map((e) => {
            const t = HEALTH_TONE[e.health];
            const Icon = HEALTH_ICON[e.health];
            return (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => onSelect(e.id)}
                  className={cx("flex min-h-9 w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-xs font-medium", TEXT_PRIMARY, HOVER_ROW, TRANSITION, FOCUS_RING)}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Icon size={11} aria-hidden="true" className={cx("shrink-0", t.text)} />
                    <span className="truncate">{NODE_MAP[e.id].label}</span>
                  </span>
                  <ArrowRight size={12} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
