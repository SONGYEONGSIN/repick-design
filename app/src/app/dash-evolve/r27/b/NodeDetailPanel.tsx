"use client";

import { ChevronRight, Flame } from "lucide-react";
import type { CompareMode } from "./DecompTree";
import { ANOMALY_THRESHOLD_PCT, LEVEL_ICON, REGISTRY, pathLabels, formatPct1, formatUsd } from "./data";
import { BORDER, LEVEL_BADGE, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, ContributionBar, DeltaChip } from "./ui";

/**
 * The single, clearly-scoped consumer of the tree's `selectedId`. Nothing else on this page
 * recomputes from a tree selection — TopMovers.tsx has its own independent sort/expand state and
 * never receives `selectedId` as a prop at all (see the comment block in that file).
 */
export default function NodeDetailPanel({ selectedId, compareMode }: { selectedId: string; compareMode: CompareMode }) {
  const node = REGISTRY.get(selectedId);
  if (!node) return null;

  const path = pathLabels(selectedId);
  const Icon = LEVEL_ICON[node.level];
  const delta = compareMode === "prior" ? node.deltaPriorPct : node.budgetDeltaPct;
  const compareLabel = compareMode === "prior" ? "vs. prior period" : "vs. budget";
  const isAnomaly = node.deltaPriorPct >= ANOMALY_THRESHOLD_PCT;
  const topChildren = [...(node.children ?? [])].sort((a, b) => b.value - a.value).slice(0, 6);

  return (
    <Card className="flex h-full flex-col">
      <CardHead
        title="Node detail"
        hint="Reacts only to the tree selection above — nothing else on this page changes when you pick a node."
        Icon={Icon}
      />

      <nav aria-label="Selected node path" className="mt-3">
        <ol className="flex flex-wrap items-center gap-1 text-xs">
          {path.map((label, i) => (
            <li key={`${label}-${i}`} className="flex items-center gap-1">
              {i > 0 ? <ChevronRight size={11} aria-hidden="true" className="text-zinc-300" /> : null}
              <span className={cx(i === path.length - 1 ? cx("font-semibold", TEXT_PRIMARY) : TEXT_AUX)}>{label}</span>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-3 flex items-center gap-2">
        <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", LEVEL_BADGE[node.level])}>{node.level}</span>
        {isAnomaly ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
            <Flame size={11} aria-hidden="true" />
            {`≥${ANOMALY_THRESHOLD_PCT}% vs. prior period`}
          </span>
        ) : null}
      </div>

      <p className={cx("mt-3 text-3xl font-semibold tabular-nums leading-none", TEXT_PRIMARY)}>{formatUsd(node.value)}</p>
      <p className={cx("mt-2 text-sm", TEXT_MUTED)}>{`${formatPct1(node.pctOfParent)} of its parent · ${formatPct1(node.pctOfTotal)} of total cloud spend`}</p>
      <div className="mt-2">
        <ContributionBar pct={node.pctOfParent} />
      </div>

      <dl className={cx("mt-4 grid grid-cols-2 gap-3 border-t pt-4", BORDER)}>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{compareLabel}</dt>
          <dd className="mt-1">{delta !== undefined ? <DeltaChip pct={delta} /> : <span className={cx("text-sm", TEXT_AUX)}>Not tracked at this level</span>}</dd>
        </div>
        <div>
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Budget</dt>
          <dd className={cx("mt-1 text-sm font-medium tabular-nums", TEXT_PRIMARY)}>{node.budget !== undefined ? formatUsd(node.budget) : <span className={cx("font-normal", TEXT_AUX)}>Not set here</span>}</dd>
        </div>
      </dl>

      {topChildren.length > 0 ? (
        <div className={cx("mt-4 flex-1 border-t pt-3", BORDER)}>
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>{`Top contributors inside ${node.label}`}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {topChildren.map((c) => (
              <li key={c.id} className="flex items-center gap-2">
                <span className={cx("min-w-0 flex-1 truncate text-sm", TEXT_PRIMARY)}>{c.label}</span>
                <span className={cx("shrink-0 whitespace-nowrap text-xs tabular-nums", TEXT_AUX)}>{formatPct1(c.pctOfParent)}</span>
                <span className={cx("w-[4.5rem] shrink-0 whitespace-nowrap text-right text-sm font-medium tabular-nums", TEXT_PRIMARY)}>{formatUsd(c.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className={cx("mt-4 flex-1 border-t pt-3 text-sm", BORDER, TEXT_AUX)}>This is a SKU — the deepest level Fathom tracks for cloud spend.</p>
      )}
    </Card>
  );
}
