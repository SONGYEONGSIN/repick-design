"use client";

import { useState } from "react";
import { MousePointerClick, CheckCircle2, ArrowUpRight, Clock, Pin } from "lucide-react";
import {
  Card,
  CardHeader,
  Tabs,
  TierBadge,
  StatusBadge,
  InitialsAvatar,
  BulletGauge,
  FOCUS_RING,
} from "./ui";
import {
  accountHistory,
  dayTimeLabel,
  riskTier,
  STATUS_LABELS,
  CHANNEL_LABELS,
  RISK_DISTRIBUTION,
  QUEUE_SUMMARY,
  type SignalEvent,
} from "./data";

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type InspectorTab = "overview" | "history";
type Decision = "approved" | "escalated";

export function Inspector({ selected, pinnedCount }: { selected: SignalEvent | null; pinnedCount: number }) {
  return (
    // At the xl tier the inspector spans the full 12 columns (below the feed), so its three
    // cards sit side by side there; from 2xl it becomes a narrow right rail and stacks instead.
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 2xl:grid-cols-1">
      <CaseInspector selected={selected} />
      <RiskDistributionCard />
      <QueueSummaryCard pinnedCount={pinnedCount} />
    </div>
  );
}

function CaseInspector({ selected }: { selected: SignalEvent | null }) {
  const [tab, setTab] = useState<InspectorTab>("overview");
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  if (!selected) {
    return (
      <Card>
        <CardHeader title="Case inspector" subtitle="Driven by feed row selection" />
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 py-10 text-center">
          <MousePointerClick size={20} className="text-zinc-400" aria-hidden="true" />
          <p className="max-w-[16rem] text-xs text-zinc-400">
            Select a signal from the feed to inspect the account, score and history.
          </p>
        </div>
      </Card>
    );
  }

  const tier = riskTier(selected.riskScore);
  const decision = decisions[selected.id];
  const history = accountHistory(selected.accountId);

  return (
    <Card>
      <CardHeader title="Case inspector" subtitle="Driven by feed row selection" />

      <div className="flex items-center gap-3">
        <InitialsAvatar name={selected.accountName} size={40} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold text-zinc-50">{selected.accountName}</p>
            <TierBadge tier={tier} />
          </div>
          <p className="truncate text-xs text-zinc-400">{selected.accountId}</p>
        </div>
      </div>

      <div className="mt-4">
        <Tabs
          tabs={[
            { value: "overview" as InspectorTab, label: "Overview" },
            { value: "history" as InspectorTab, label: `History (${history.length})` },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {tab === "overview" ? (
        <div className="mt-4 space-y-4">
          <BulletGauge value={selected.riskScore} target={70} />

          <dl className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <dt className="text-zinc-400">Amount</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-zinc-100">{currency.format(selected.amount)}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Channel</dt>
              <dd className="mt-0.5 font-medium text-zinc-100">{CHANNEL_LABELS[selected.channel]}</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Reported</dt>
              <dd className="mt-0.5 whitespace-nowrap font-medium tabular-nums text-zinc-100">
                {dayTimeLabel(selected.day, selected.time)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-400">Status</dt>
              <dd className="mt-0.5">
                <StatusBadge status={selected.status} label={STATUS_LABELS[selected.status]} />
              </dd>
            </div>
          </dl>

          <div>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-zinc-400">Triggered rules</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.reasons.map((r) => (
                <span key={r} className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => setDecisions((d) => ({ ...d, [selected.id]: "approved" }))}
              aria-pressed={decision === "approved"}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
                decision === "approved"
                  ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                  : "border-white/10 text-zinc-300 hover:border-white/20"
              } ${FOCUS_RING}`}
            >
              <CheckCircle2 size={14} aria-hidden="true" />
              Approve
            </button>
            <button
              type="button"
              onClick={() => setDecisions((d) => ({ ...d, [selected.id]: "escalated" }))}
              aria-pressed={decision === "escalated"}
              className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition-colors ${
                decision === "escalated"
                  ? "border-red-500/40 bg-red-500/15 text-red-400"
                  : "border-white/10 text-zinc-300 hover:border-white/20"
              } ${FOCUS_RING}`}
            >
              <ArrowUpRight size={14} aria-hidden="true" />
              Escalate
            </button>
          </div>
          {decision ? (
            <p className="text-[11px] text-zinc-400">
              Marked {decision} for this review — case record unchanged outside this session.
            </p>
          ) : null}
        </div>
      ) : (
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1">
          {history.map((h) => (
            <li key={h.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-zinc-950/60 px-3 py-2">
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[11px] tabular-nums text-zinc-400">{dayTimeLabel(h.day, h.time)}</p>
                <p className="truncate text-xs text-zinc-200">{h.reasons[0]}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-1.5">
                <TierBadge tier={riskTier(h.riskScore)} />
                <span className="text-xs font-medium tabular-nums text-zinc-100">{currency.format(h.amount)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RiskDistributionCard() {
  const max = Math.max(...RISK_DISTRIBUTION.map((b) => b.count));
  return (
    <Card>
      <CardHeader title="Risk distribution" subtitle="All signals, last 14 days" />
      <div className="flex h-24 items-end gap-2">
        {RISK_DISTRIBUTION.map((b) => (
          <div key={b.rangeLabel} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[11px] font-medium tabular-nums text-zinc-300">{b.count}</span>
            <div
              className="w-full rounded-sm bg-blue-500/70"
              style={{ height: `${max > 0 ? Math.max((b.count / max) * 100, 4) : 4}%` }}
            />
            <span className="whitespace-nowrap text-[10px] text-zinc-400">{b.rangeLabel}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function QueueSummaryCard({ pinnedCount }: { pinnedCount: number }) {
  return (
    <Card>
      <CardHeader title="Queue summary" subtitle="Computed from the full signal set" />
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/5 bg-zinc-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-zinc-400">Open</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{QUEUE_SUMMARY.open}</dd>
        </div>
        <div className="rounded-lg border border-white/5 bg-zinc-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-wide text-zinc-400">Escalated</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{QUEUE_SUMMARY.escalated}</dd>
        </div>
        <div className="rounded-lg border border-white/5 bg-zinc-950/60 p-3">
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-zinc-400">
            <Clock size={11} aria-hidden="true" /> Avg handle
          </dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-zinc-50">{QUEUE_SUMMARY.avgHandleMinutes}m</dd>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
          <dt className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-blue-300">
            <Pin size={11} aria-hidden="true" /> Pinned
          </dt>
          {/* Axis C: this count comes only from the feed's pin toggles, never from row selection
              (axis A) or the chart's hover preview (axis B) — three independently-scoped
              selection states living in three different widgets. */}
          <dd className="mt-1 text-xl font-semibold tabular-nums text-blue-50">{pinnedCount}</dd>
        </div>
      </dl>
    </Card>
  );
}
