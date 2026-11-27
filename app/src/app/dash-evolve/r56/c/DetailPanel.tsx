"use client";

import { ChartNetwork, ArrowUpRight, ArrowDownRight, Radius, Activity } from "lucide-react";
import {
  getNode,
  getDirectDependencies,
  getDirectDependents,
  getBlastRadius,
  formatInt,
  formatMs,
  formatCallsPerMin,
} from "./data";
import { NODE_ICONS, STATUS_META } from "./icons";
import { Card, CardHeader, FOCUS_RING, Stat, StatusBadge } from "./ui";

function Chip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 ${FOCUS_RING}`}
    >
      {label}
    </button>
  );
}

export function DetailPanel({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const node = selectedId ? getNode(selectedId) : undefined;

  if (!node) {
    return (
      <Card className="xl:sticky xl:top-20">
        <CardHeader title="Service detail" subtitle="Nothing selected yet" icon={ChartNetwork} />
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-4 py-10 text-center">
          <ChartNetwork size={28} className="text-zinc-300" aria-hidden="true" />
          <p className="text-sm text-zinc-500">
            Select a service in the map, or press <kbd className="rounded border border-zinc-200 bg-zinc-50 px-1 py-0.5 text-[11px]">{"⌘K"}</kbd> to
            search, and its dependencies and blast radius will appear here.
          </p>
        </div>
      </Card>
    );
  }

  const Icon = NODE_ICONS[node.icon];
  const meta = STATUS_META[node.status];
  const deps = getDirectDependencies(node.id);
  const dependents = getDirectDependents(node.id);
  const blast = getBlastRadius(node.id);

  return (
    <Card className="xl:sticky xl:top-20">
      <CardHeader title="Service detail" subtitle={node.team} icon={ChartNetwork} />

      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
          <Icon size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-zinc-900">{node.name}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{node.region}</p>
        </div>
        <StatusBadge status={node.status} />
      </div>

      <p className="mt-3 text-sm text-zinc-600">{node.summary}</p>

      {node.note ? (
        <div className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2.5 ${meta.badgeBg} ${meta.badgeBorder}`}>
          <meta.icon size={15} className={`mt-0.5 flex-shrink-0 ${meta.text}`} aria-hidden="true" />
          <p className={`text-xs ${meta.text}`}>{node.note}</p>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Stat label="Direct dependencies" value={formatInt(deps.length)} />
        <Stat label="Direct dependents" value={formatInt(dependents.length)} />
        <Stat label="Blast radius" value={formatInt(blast.length)} caption="Transitive" />
        <Stat label="Incidents (90d)" value={formatInt(node.incidents90d)} />
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-zinc-50 px-3 py-2.5">
        <Radius size={15} className="mt-0.5 flex-shrink-0 text-indigo-600" aria-hidden="true" />
        <p className="text-xs text-zinc-600">
          {blast.length === 0
            ? `Nothing calls ${node.name}, even indirectly — an outage here has no downstream blast radius.`
            : `If ${node.name} goes down, ${formatInt(blast.length)} other ${blast.length === 1 ? "service" : "services"} could be affected downstream.`}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
        <span className="inline-flex items-center gap-1.5 text-zinc-500">
          <Activity size={13} aria-hidden="true" /> p99 latency
        </span>
        <span className="text-right font-medium tabular-nums text-zinc-800">{formatMs(node.p99Ms)}</span>
        <span className="inline-flex items-center gap-1.5 text-zinc-500">
          <Activity size={13} aria-hidden="true" /> Throughput
        </span>
        <span className="text-right font-medium tabular-nums text-zinc-800">{formatCallsPerMin(node.callsPerMin)}</span>
      </div>

      <div className="mt-4 border-t border-zinc-100 pt-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
          <ArrowUpRight size={12} aria-hidden="true" /> Depends on ({deps.length})
        </p>
        {deps.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {deps.map((id) => (
              <Chip key={id} label={id} onClick={() => onSelect(id)} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No downstream calls.</p>
        )}
      </div>

      <div className="mt-3">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-zinc-600">
          <ArrowDownRight size={12} aria-hidden="true" /> Depended on by ({dependents.length})
        </p>
        {dependents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {dependents.map((id) => (
              <Chip key={id} label={id} onClick={() => onSelect(id)} />
            ))}
          </div>
        ) : (
          <p className="text-xs text-zinc-500">No other service calls this one directly.</p>
        )}
      </div>
    </Card>
  );
}
