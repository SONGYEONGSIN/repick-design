"use client";

import { Filter, RotateCcw } from "lucide-react";
import { Card, CardHeader, Checkbox, FOCUS_RING } from "./ui";
import { CHANNEL_LABELS, type Channel, type RiskTier } from "./data";

const TIERS: { value: RiskTier; label: string }[] = [
  { value: "high", label: "High (70-100)" },
  { value: "medium", label: "Medium (40-69)" },
  { value: "low", label: "Low (0-39)" },
];

export function FiltersPanel({
  riskFilter,
  onToggleRisk,
  channelFilter,
  onToggleChannel,
  onClear,
  resultCount,
}: {
  riskFilter: Record<RiskTier, boolean>;
  onToggleRisk: (t: RiskTier) => void;
  channelFilter: Record<Channel, boolean>;
  onToggleChannel: (c: Channel) => void;
  onClear: () => void;
  resultCount: number;
}) {
  return (
    <Card className="xl:sticky xl:top-20">
      <CardHeader
        title="Filters"
        subtitle={`${resultCount} matching`}
        action={
          <button
            type="button"
            onClick={onClear}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-100 ${FOCUS_RING}`}
          >
            <RotateCcw size={12} aria-hidden="true" />
            Clear
          </button>
        }
      />

      <div className="mb-5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          <Filter size={12} aria-hidden="true" />
          Risk tier
        </p>
        <div className="space-y-2">
          {TIERS.map((t) => (
            <Checkbox key={t.value} checked={riskFilter[t.value]} onChange={() => onToggleRisk(t.value)} label={t.label} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Channel</p>
        <div className="space-y-2">
          {(Object.keys(CHANNEL_LABELS) as Channel[]).map((c) => (
            <Checkbox key={c} checked={channelFilter[c]} onChange={() => onToggleChannel(c)} label={CHANNEL_LABELS[c]} />
          ))}
        </div>
      </div>
    </Card>
  );
}
