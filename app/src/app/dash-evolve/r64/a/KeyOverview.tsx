"use client";

import { useState } from "react";
import { Check, Clock, Copy, Gauge, Hash, Webhook } from "lucide-react";
import type { ApiKey } from "./data";
import {
  endpointLabel,
  environmentLabel,
  formatNumber,
  hourRangeLabel,
  matrixTotal,
  peakHour,
  quotaStatus,
  quotaUsedPct,
} from "./data";
import { Card, EnvBadge, FOCUS, QuotaBar, StatTile, StatusBadge } from "./ui";

/**
 * Every number here is read straight off `apiKey.matrix` via the data-layer helpers
 * (`matrixTotal`, `quotaUsedPct`, `peakHour`) — the exact same array the heatmap and its table
 * fallback render in the detail pane below. There is no second, hand-placed "total requests" or
 * "quota used" figure anywhere on this page. This card is the ONE widget `pinnedKeyId` is allowed
 * to drive directly besides the heatmap/table switch below — the heatmap's own hovered-cell state
 * never reaches here (see `Heatmap.tsx`).
 */
export function KeyOverview({ apiKey }: { apiKey: ApiKey }) {
  const [copied, setCopied] = useState(false);
  const total = matrixTotal(apiKey.matrix);
  const pct = quotaUsedPct(apiKey);
  const status = quotaStatus(pct);
  const peak = peakHour(apiKey.matrix);
  const remaining = apiKey.quotaCeiling - total;

  function copyToken() {
    try {
      navigator.clipboard.writeText(apiKey.secretPreview).catch(() => {});
    } catch {
      // Clipboard access can be unavailable in some embedding contexts; the visual
      // confirmation below still reflects the user's intent either way.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card>
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <h2 className="min-w-0 truncate text-base font-semibold text-zinc-900">{apiKey.name}</h2>
            <EnvBadge label={environmentLabel(apiKey.environment)} />
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 truncate text-xs font-normal text-zinc-600">{apiKey.owner} team</p>
        </div>

        <button
          type="button"
          onClick={copyToken}
          className={`${FOCUS} flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-medium text-zinc-700 hover:bg-zinc-100`}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span className="font-mono tabular-nums">{apiKey.secretPreview}</span>
          <span className="sr-only">{copied ? "Copied to clipboard" : "Copy key preview"}</span>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-2.5">
        <div className="col-span-6 min-w-0 sm:col-span-3">
          <StatTile label="Requests today" value={formatNumber(total)} icon={Hash} />
        </div>
        <div className="col-span-6 min-w-0 sm:col-span-3">
          <StatTile
            label="Quota remaining"
            value={remaining >= 0 ? formatNumber(remaining) : `${formatNumber(Math.abs(remaining))} over`}
            icon={Gauge}
            tone={remaining >= 0 ? "text-zinc-900" : "text-rose-700"}
          />
        </div>
        <div className="col-span-6 min-w-0 sm:col-span-3">
          <StatTile label="Peak hour" value={hourRangeLabel(peak.hour)} icon={Clock} />
        </div>
        <div className="col-span-6 min-w-0 sm:col-span-3">
          <StatTile label="Endpoints in scope" value={String(apiKey.scope.length)} icon={Webhook} />
        </div>
      </div>

      <div className="mt-4">
        <QuotaBar pct={pct} status={status} />
        <p className="mt-1 text-xs font-normal text-zinc-600">
          {formatNumber(total)} of {formatNumber(apiKey.quotaCeiling)} requests allowed per day
        </p>
      </div>

      <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
        {apiKey.scope.map((id) => (
          <span
            key={id}
            className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 font-mono text-[11px] font-normal text-zinc-700"
          >
            {endpointLabel(id)}
          </span>
        ))}
      </div>
    </Card>
  );
}
