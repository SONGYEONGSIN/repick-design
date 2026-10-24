"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ChannelRow } from "./data";
import { formatNumber, formatPercent } from "./format";
import { Card, Delta, FOCUS_RING, ProgressBar, Tabs } from "./ui";

/**
 * Master-detail, tier-3 style: there is no separate detail pane anywhere on this page. Selecting
 * a channel expands that row itself, in place, into its own breakdown — the row is both the list
 * item and its own detail. Collapsing/expanding never touches any other widget (the Sankey above
 * and the accounts table below are both independent of this selection), which is a deliberate
 * choice: fanning this selection out to other components was the exact pattern this round's brief
 * asked NOT to reach for.
 */
export function ChannelRail({
  channels,
  otherPeriodChannels,
  otherPeriodLabel,
  expandedId,
  onToggle,
}: {
  channels: ChannelRow[];
  otherPeriodChannels: ChannelRow[];
  otherPeriodLabel: string;
  expandedId: string | null;
  onToggle: (id: string) => void;
}) {
  const [detailView, setDetailView] = useState<"stage" | "quarter">("stage");

  return (
    <Card className="p-4">
      <h2 className="font-semibold text-sm text-zinc-900">Acquisition Channels</h2>
      <p className="mt-0.5 font-normal text-xs text-zinc-500">Select a channel to expand its own stage-by-stage breakdown.</p>
      <ul className="mt-3 space-y-1.5">
        {channels.map((channel) => {
          const otherChannel = otherPeriodChannels.find((c) => c.id === channel.id);
          const isOpen = expandedId === channel.id;
          const activationRate = (channel.activated / channel.signups) * 100;
          const paidConversionRate = (channel.paidConverted / channel.activated) * 100;
          return (
            <li key={channel.id} className="rounded-lg border border-zinc-200">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`channel-detail-${channel.id}`}
                onClick={() => onToggle(channel.id)}
                className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                  isOpen ? "bg-blue-50" : "hover:bg-zinc-50"
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-sm text-zinc-900">{channel.name}</span>
                  <span className="mt-0.5 block font-normal text-[11px] tabular-nums text-zinc-500">
                    {formatNumber(channel.signups)} signups · {formatPercent(activationRate)} activated
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-zinc-500 motion-safe:transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              {isOpen ? (
                <div id={`channel-detail-${channel.id}`} className="border-t border-zinc-200 px-3 py-3">
                  <p className="font-normal text-xs text-zinc-600">{channel.description}</p>

                  <div className="mt-3">
                    <Tabs
                      ariaLabel={`${channel.name} detail view`}
                      idBase={`channel-${channel.id}`}
                      tabs={[
                        { value: "stage", label: "By Stage" },
                        { value: "quarter", label: "By Quarter" },
                      ]}
                      value={detailView}
                      onChange={(v) => setDetailView(v as "stage" | "quarter")}
                    />
                  </div>

                  {detailView === "stage" ? (
                    <div className="mt-3">
                      <div className="space-y-2.5">
                        <BreakdownRow label="Activated" value={channel.activated} ofValue={channel.signups} ofLabel="signups" />
                        <BreakdownRow label="Not activated" value={channel.notActivated} ofValue={channel.signups} ofLabel="signups" tone="bg-zinc-400" />
                      </div>

                      <div className="mt-3 border-t border-zinc-100 pt-3">
                        <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">Of {formatNumber(channel.activated)} activated</p>
                        <div className="mt-2 space-y-2.5">
                          <BreakdownRow label="Converted to paid" value={channel.paidConverted} ofValue={channel.activated} ofLabel="activated" />
                          <BreakdownRow label="Still trialing" value={channel.trialing} ofValue={channel.activated} ofLabel="activated" tone="bg-amber-500" />
                          <BreakdownRow label="Churned in trial" value={channel.churnedInTrial} ofValue={channel.activated} ofLabel="activated" tone="bg-rose-500" />
                        </div>
                      </div>

                      <div className="mt-3 border-t border-zinc-100 pt-3">
                        <p className="font-semibold text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                          Of {formatNumber(channel.paidConverted)} paid ({formatPercent(paidConversionRate)} of activated)
                        </p>
                        <div className="mt-2 space-y-2.5">
                          <BreakdownRow label="Expanding" value={channel.expanding} ofValue={channel.paidConverted} ofLabel="paid" tone="bg-emerald-500" />
                          <BreakdownRow label="Stable" value={channel.stable} ofValue={channel.paidConverted} ofLabel="paid" />
                          <BreakdownRow label="Contracting" value={channel.contracting} ofValue={channel.paidConverted} ofLabel="paid" tone="bg-amber-500" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 space-y-2.5">
                      {otherChannel ? (
                        <>
                          <QuarterCompareRow label="Signups" current={channel.signups} previous={otherChannel.signups} otherPeriodLabel={otherPeriodLabel} />
                          <QuarterCompareRow label="Activated" current={channel.activated} previous={otherChannel.activated} otherPeriodLabel={otherPeriodLabel} />
                          <QuarterCompareRow
                            label="Converted to paid"
                            current={channel.paidConverted}
                            previous={otherChannel.paidConverted}
                            otherPeriodLabel={otherPeriodLabel}
                          />
                        </>
                      ) : (
                        <p className="font-normal text-xs text-zinc-600">No comparison data for {otherPeriodLabel}.</p>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function QuarterCompareRow({
  label,
  current,
  previous,
  otherPeriodLabel,
}: {
  label: string;
  current: number;
  previous: number;
  otherPeriodLabel: string;
}) {
  const delta = ((current - previous) / previous) * 100;
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-2.5 py-2">
      <span className="min-w-0 truncate font-normal text-xs text-zinc-700">{label}</span>
      <span className="flex shrink-0 items-baseline gap-2">
        <span className="font-medium text-sm tabular-nums text-zinc-900">{formatNumber(current)}</span>
        <Delta value={delta} />
        <span className="font-normal text-[11px] text-zinc-500">vs {formatNumber(previous)} {otherPeriodLabel}</span>
      </span>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  ofValue,
  ofLabel,
  tone = "bg-blue-600",
}: {
  label: string;
  value: number;
  ofValue: number;
  ofLabel: string;
  tone?: string;
}) {
  const pct = (value / ofValue) * 100;
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="min-w-0 truncate font-normal text-xs text-zinc-700">{label}</span>
        <span className="shrink-0 font-medium text-xs tabular-nums text-zinc-900">
          {formatNumber(value)} <span className="font-normal text-zinc-500">({formatPercent(pct)} of {ofLabel})</span>
        </span>
      </div>
      <ProgressBar pct={pct} fillClassName={tone} className="mt-1" />
    </div>
  );
}
