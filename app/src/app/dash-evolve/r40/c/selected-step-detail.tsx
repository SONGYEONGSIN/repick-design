import { MousePointerClick } from "lucide-react";
import { StateBadge } from "./badge";
import {
  EDGE_GEOMETRY,
  EDGE_STATS,
  INCIDENTS,
  NODE_CURRENT,
  NODE_DISTRIBUTION,
  NODE_HINT,
  NODE_LAYOUT,
  edgeLabel,
  type PeriodId,
  type SelectedTarget,
  type StateId,
} from "./data";

const numberFormat = new Intl.NumberFormat("en-US");

export default function SelectedStepDetail({
  selected,
  period,
}: {
  selected: SelectedTarget | null;
  period: PeriodId;
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-zinc-900 p-4 sm:p-5">
      <h2 className="font-semibold text-lg text-zinc-50">Selected step</h2>
      {selected === null ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <MousePointerClick className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          <p className="max-w-[220px] font-normal text-sm text-zinc-400">
            Select a node or transition in the flow above to see its detail here.
          </p>
        </div>
      ) : selected.kind === "node" ? (
        <NodeDetail stateId={selected.id} />
      ) : (
        <EdgeDetail edgeId={selected.id} period={period} />
      )}
    </div>
  );
}

function NodeDetail({ stateId }: { stateId: StateId }) {
  const node = NODE_LAYOUT.find((n) => n.id === stateId)!;
  const current = NODE_CURRENT[stateId];
  const buckets = NODE_DISTRIBUTION[stateId];
  const max = Math.max(...buckets.map((b) => b.count));

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between gap-2">
        <StateBadge state={stateId} label={node.label} />
        <p className="font-semibold text-lg text-zinc-50 tabular-nums">{current}</p>
      </div>
      <p className="mt-2 font-normal text-sm text-zinc-400">{NODE_HINT[stateId]}</p>

      <p className="mt-4 font-medium text-xs text-zinc-400 uppercase tracking-wide">Time in state right now</p>
      <ul className="mt-2 space-y-1.5">
        {buckets.map((bucket) => (
          <li key={bucket.label} className="flex items-center gap-2">
            <span className="w-20 shrink-0 truncate font-normal text-xs text-zinc-400">{bucket.label}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <span
                className="block h-2 rounded-full bg-cyan-400"
                style={{ width: `${max > 0 ? (bucket.count / max) * 100 : 0}%` }}
              />
            </span>
            <span className="w-6 shrink-0 text-right font-medium text-xs text-zinc-50 tabular-nums">
              {bucket.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EdgeDetail({ edgeId, period }: { edgeId: string; period: PeriodId }) {
  const stats = EDGE_STATS[period].find((s) => s.id === edgeId)!;
  const geo = EDGE_GEOMETRY.find((e) => e.id === edgeId)!;
  const label = edgeLabel(edgeId);
  const toState = geo.to;
  const toLabel = NODE_LAYOUT.find((n) => n.id === toState)!.label;
  const recent = INCIDENTS.filter((i) => i.state === toState).slice(0, 3);

  return (
    <div className="mt-3">
      <p className="font-medium text-sm text-zinc-50">{label}</p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/10 p-2.5">
          <p className="font-medium text-[11px] text-zinc-400 uppercase tracking-wide">Volume</p>
          <p className="mt-0.5 font-semibold text-lg text-zinc-50 tabular-nums">
            {numberFormat.format(stats.volume)}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 p-2.5">
          <p className="font-medium text-[11px] text-zinc-400 uppercase tracking-wide">Avg wait</p>
          <p className="mt-0.5 font-semibold text-lg text-zinc-50 tabular-nums">{stats.avgWaitHours.toFixed(1)}h</p>
        </div>
      </div>

      <p className="mt-4 font-medium text-xs text-zinc-400 uppercase tracking-wide">
        Recent tickets now in &ldquo;{toLabel}&rdquo;
      </p>
      {recent.length === 0 ? (
        <p className="mt-2 font-normal text-sm text-zinc-400">No open tickets currently in this state.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {recent.map((incident) => (
            <li key={incident.id} className="flex items-center justify-between gap-2">
              <span className="min-w-0 truncate font-normal text-sm text-zinc-50">{incident.title}</span>
              <span className="shrink-0 font-normal text-xs text-zinc-400 tabular-nums">{incident.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
