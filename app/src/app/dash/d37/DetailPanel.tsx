"use client";

import { ArrowRight, MousePointerClick, Waves } from "lucide-react";
import {
  formatCount,
  formatUsd,
  nodeTrend,
  type FlowGraph,
  type MetricId,
} from "./data";
import { BORDER, OUTCOME_TONE, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Badge, Card, CardHeader, EyebrowLabel, Progress, Sparkline } from "./ui";

const COL_LABEL = ["Acquisition Channel", "Plan Tier at Signup", "90-Day Outcome"] as const;

export default function DetailPanel({
  graph,
  metric,
  selectedId,
  onSelect,
}: {
  graph: FlowGraph;
  metric: MetricId;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const isLink = selectedId?.includes("__") ?? false;

  if (!selectedId) {
    return (
      <Card className="flex h-full flex-col" padded={false}>
        <div className="p-4 sm:p-5">
          <CardHeader title="Flow detail" titleId="flow-detail-heading" description="Select a node or ribbon in the diagram (or a table row) to inspect it here." />
        </div>
        <div className={cx("flex flex-1 flex-col items-center justify-center gap-2 border-t p-8 text-center", BORDER)}>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
            <MousePointerClick size={18} aria-hidden="true" />
          </span>
          <p className={cx("text-sm", TEXT_SECONDARY)}>Nothing selected yet</p>
          <p className={cx("max-w-[22rem] text-xs", TEXT_CAPTION)}>
            Click any channel, plan tier, outcome, or connecting ribbon — the diagram, this panel, and the table below stay in sync.
          </p>
        </div>
      </Card>
    );
  }

  if (isLink) {
    const [sourceId, targetId] = selectedId.split("__");
    const link =
      graph.linksChannelTier.find((l) => l.id === selectedId) ?? graph.linksTierOutcome.find((l) => l.id === selectedId);
    if (!link) return null;
    const outcomeTone = OUTCOME_TONE[targetId];

    return (
      <Card className="flex h-full flex-col" padded={false}>
        <div className="p-4 sm:p-5">
          <CardHeader title="Flow detail" titleId="flow-detail-heading" description="Selected ribbon" />
        </div>
        <div className={cx("border-t p-4 sm:p-5", BORDER)}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cx("truncate text-base font-semibold", TEXT_PRIMARY)}>{link.sourceLabel}</span>
            <ArrowRight size={15} aria-hidden="true" className={TEXT_CAPTION} />
            <span className={cx("truncate text-base font-semibold", TEXT_PRIMARY)}>{link.targetLabel}</span>
          </div>
          {outcomeTone ? (
            <div className="mt-2">
              <Badge tone={outcomeTone}>{link.targetLabel}</Badge>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label="Customers in this ribbon" value={formatCount(link.customers)} />
            <Stat label="New MRR in this ribbon" value={formatUsd(link.mrr)} />
            <Stat label={`Share of ${link.sourceLabel}`} value={`${link.shareOfSourcePct.toFixed(1)}%`} valueClass="text-sky-700 dark:text-sky-300" />
            <Stat label="Active metric" value={metric === "customers" ? "Customers" : "New MRR"} />
          </div>

          <Progress pct={link.shareOfSourcePct} tone="info" />
        </div>

        <div className={cx("flex flex-wrap gap-2 border-t p-4 sm:p-5", BORDER)}>
          <button
            type="button"
            onClick={() => onSelect(sourceId)}
            className={cx("rounded-lg border px-3 py-1.5 text-xs font-medium", BORDER, TEXT_PRIMARY, "hover:bg-zinc-50 dark:hover:bg-zinc-800")}
          >
            Inspect source: {link.sourceLabel}
          </button>
          <button
            type="button"
            onClick={() => onSelect(targetId)}
            className={cx("rounded-lg border px-3 py-1.5 text-xs font-medium", BORDER, TEXT_PRIMARY, "hover:bg-zinc-50 dark:hover:bg-zinc-800")}
          >
            Inspect target: {link.targetLabel}
          </button>
        </div>
      </Card>
    );
  }

  const all = [...graph.channels, ...graph.tiers, ...graph.outcomes];
  const node = all.find((n) => n.id === selectedId);
  if (!node) return null;

  const outgoing = node.col === 0 ? graph.linksChannelTier.filter((l) => l.sourceId === node.id) : node.col === 1 ? graph.linksTierOutcome.filter((l) => l.sourceId === node.id) : [];
  const incoming = node.col === 1 ? graph.linksChannelTier.filter((l) => l.targetId === node.id) : node.col === 2 ? graph.linksTierOutcome.filter((l) => l.targetId === node.id) : [];
  const breakdown = node.col === 2 ? incoming : outgoing;
  const breakdownLabel = node.col === 2 ? "Where these accounts came from" : "Where they go next";

  const trendBase = metric === "customers" ? node.customers / 12 : node.mrr / 12;
  const trend = nodeTrend(node.id, Math.max(trendBase, 1));

  return (
    <Card className="flex h-full flex-col" padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader title="Flow detail" titleId="flow-detail-heading" description="Selecting a node syncs this panel and the table below." />
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            <node.Icon size={17} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className={cx("truncate text-base font-semibold", TEXT_PRIMARY)}>{node.label}</p>
            <p className={cx("text-xs", TEXT_CAPTION)}>{COL_LABEL[node.col]}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Customers" value={formatCount(node.customers)} />
          <Stat label="New MRR" value={formatUsd(node.mrr)} />
          <Stat label="Avg. new MRR / account" value={formatUsd(node.customers > 0 ? Math.round(node.mrr / node.customers) : 0)} />
          <Stat label="Links" value={String(breakdown.length)} />
        </div>
      </div>

      <div className={cx("border-t p-4 sm:p-5", BORDER)}>
        <EyebrowLabel>{breakdownLabel}</EyebrowLabel>
        <ul className="mt-2.5 flex flex-col gap-2.5">
          {breakdown.map((l) => {
            const otherLabel = node.col === 2 ? l.sourceLabel : l.targetLabel;
            const otherId = node.col === 2 ? l.sourceId : l.targetId;
            const shown = metric === "customers" ? formatCount(l.customers) : formatUsd(l.mrr);
            const tone = TONE_FOR(node.col, otherId);
            return (
              <li key={l.id}>
                <button type="button" onClick={() => onSelect(l.id)} className="block w-full text-left">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className={cx("truncate text-xs", TEXT_SECONDARY)}>{otherLabel}</span>
                    <span className={cx("shrink-0 whitespace-nowrap text-xs tabular-nums", TEXT_CAPTION)}>
                      {shown} · {l.shareOfSourcePct.toFixed(1)}%
                    </span>
                  </div>
                  <Progress pct={l.shareOfSourcePct} tone={tone} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className={cx("flex-1 border-t p-4 sm:p-5", BORDER)}>
        <div className="mb-2 flex items-center justify-between">
          <EyebrowLabel>12-week trend (illustrative)</EyebrowLabel>
          <span className={cx("inline-flex items-center gap-1 text-xs", TEXT_CAPTION)}>
            <Waves size={11} aria-hidden="true" />
            weekly avg
          </span>
        </div>
        <Sparkline values={trend.map((t) => t.value)} stroke="stroke-sky-600 dark:stroke-sky-400" fill="fill-sky-600 dark:fill-sky-400" />
      </div>
    </Card>
  );
}

function TONE_FOR(col: 0 | 1 | 2, otherId: string) {
  if (col === 2 && otherId) return "neutral" as const;
  const tone = OUTCOME_TONE[otherId];
  return tone ?? ("info" as const);
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="min-w-0 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-950">
      <EyebrowLabel>{label}</EyebrowLabel>
      <p className={cx("mt-0.5 truncate text-sm font-semibold tabular-nums", valueClass ?? TEXT_PRIMARY)}>{value}</p>
    </div>
  );
}
