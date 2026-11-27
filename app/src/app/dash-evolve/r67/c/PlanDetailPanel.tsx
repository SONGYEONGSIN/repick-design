"use client";

import { useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import type { PlanId } from "./data";
import { ACCOUNTS, CURRENT_MRR, PLAN_LABEL, fmtUsd, planBridge } from "./data";
import { Card, CardTitle, FOCUS, ProgressBar, StatusBadge, Tabs } from "./ui";

type DetailTab = "bridge" | "accounts";

const BRIDGE_ROWS: { key: "start" | "newMrr" | "expansion" | "contraction" | "churn" | "end"; label: string; sign: "" | "+" | "−" }[] = [
  { key: "start", label: "Starting MRR", sign: "" },
  { key: "newMrr", label: "New business", sign: "+" },
  { key: "expansion", label: "Expansion", sign: "+" },
  { key: "contraction", label: "Contraction", sign: "−" },
  { key: "churn", label: "Churn", sign: "−" },
  { key: "end", label: "Ending MRR", sign: "" },
];

/**
 * Independently-scoped selection axis A: the ONLY widget `pinnedPlanId` is allowed to drive. It
 * never reads or writes the accounts table's sort/filter state, and the table's own per-row trend
 * inspector (axis B, entirely local to `InspectableSparkline`) never reaches here either.
 */
export function PlanDetailPanel({ pinnedPlanId, onUnpin }: { pinnedPlanId: PlanId | null; onUnpin: () => void }) {
  const [tab, setTab] = useState<DetailTab>("bridge");

  if (!pinnedPlanId) {
    return (
      <Card className="flex min-h-[220px] flex-col items-center justify-center text-center">
        <LayoutGrid className="h-6 w-6 shrink-0 text-zinc-400" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium text-zinc-900">No plan selected</p>
        <p className="mt-1 max-w-xs text-xs font-normal text-zinc-600">
          Select a plan in the revenue bridge grid to see its full monthly breakdown and top accounts here.
        </p>
      </Card>
    );
  }

  const bridge = planBridge(pinnedPlanId);
  const share = CURRENT_MRR > 0 ? (bridge.end / CURRENT_MRR) * 100 : 0;
  const topAccounts = ACCOUNTS.filter((a) => a.planId === pinnedPlanId)
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 5);

  return (
    <Card>
      <div className="flex min-w-0 items-start justify-between gap-2">
        <CardTitle>{PLAN_LABEL[pinnedPlanId]} plan detail</CardTitle>
        <button type="button" onClick={onUnpin} aria-label="Close plan detail" className={`${FOCUS} -m-1 shrink-0 rounded-lg p-1 text-zinc-500 hover:text-zinc-900`}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3">
        <Tabs
          label="Plan detail view"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "bridge", label: "Bridge" },
            { value: "accounts", label: "Top accounts" },
          ]}
        />
      </div>

      {tab === "bridge" ? (
        <div className="mt-3">
          <dl className="divide-y divide-zinc-100">
            {BRIDGE_ROWS.map((row) => (
              <div key={row.key} className="flex items-center justify-between gap-2 py-1.5">
                <dt className={`text-sm font-normal ${row.key === "end" ? "font-medium text-zinc-900" : "text-zinc-600"}`}>{row.label}</dt>
                <dd className={`text-sm font-medium tabular-nums ${row.key === "end" ? "text-zinc-900" : row.sign === "+" ? "text-emerald-700" : row.sign === "−" ? "text-rose-700" : "text-zinc-900"}`}>
                  {row.sign}
                  {fmtUsd(bridge[row.key])}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-3">
            <ProgressBar value={bridge.end} max={CURRENT_MRR} label={`${PLAN_LABEL[pinnedPlanId]} is ${share.toFixed(1)}% of total company MRR`} />
            <p className="mt-1 text-xs font-normal text-zinc-600">{share.toFixed(1)}% of total company MRR</p>
          </div>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100">
          {topAccounts.map((account) => (
            <li key={account.id} className="flex min-w-0 items-center justify-between gap-2 py-2">
              <span className="min-w-0 flex-1 truncate text-sm font-normal text-zinc-900">{account.company}</span>
              <span className="shrink-0 text-sm font-medium tabular-nums text-zinc-900">{fmtUsd(account.mrr)}</span>
              <span className="shrink-0">
                <StatusBadge status={account.status} />
              </span>
            </li>
          ))}
          {topAccounts.length === 0 && <li className="py-6 text-center text-sm font-normal text-zinc-600">No accounts on this plan yet.</li>}
        </ul>
      )}
    </Card>
  );
}
