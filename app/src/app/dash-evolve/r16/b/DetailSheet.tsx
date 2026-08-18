"use client";

import { useEffect, useRef } from "react";
import { X, PackageCheck, TriangleAlert, PackageX, Archive } from "lucide-react";
import type { Sku } from "./data";
import { USD, USD2, INT, dailyBurn } from "./data";
import { Sparkline } from "./Sparkline";
import { FOCUS_RING } from "./ui";

const STATUS_META = {
  Healthy: { icon: PackageCheck, badge: "bg-emerald-50 text-emerald-700", tone: "up" as const },
  "Low Stock": { icon: TriangleAlert, badge: "bg-amber-50 text-amber-700", tone: "down" as const },
  Backorder: { icon: PackageX, badge: "bg-rose-50 text-rose-700", tone: "down" as const },
  Discontinued: { icon: Archive, badge: "bg-zinc-100 text-zinc-600", tone: "flat" as const },
};

export function DetailSheet({ sku, onClose }: { sku: Sku | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (sku) closeRef.current?.focus();
  }, [sku]);

  useEffect(() => {
    if (!sku) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sku, onClose]);

  if (!sku) return null;

  const meta = STATUS_META[sku.status];
  const Icon = meta.icon;
  const burn = dailyBurn(sku);
  const coverDays = sku.onHand > 0 ? Math.round(sku.onHand / burn) : 0;

  let recommendation: string;
  if (sku.status === "Backorder") {
    recommendation = `Out of stock. Lead time is ${sku.leadTimeDays} days — place a purchase order with ${sku.supplier} now to limit the gap.`;
  } else if (sku.status === "Low Stock") {
    recommendation = `At the recent burn rate of ~${burn}/day, on-hand covers roughly ${coverDays} more day${coverDays === 1 ? "" : "s"}. Reorder before it crosses zero.`;
  } else if (sku.status === "Discontinued") {
    recommendation = "Discontinued — remaining units are sell-through only, no further purchase orders planned.";
  } else {
    recommendation = `Stock is healthy at ~${coverDays} days of cover above the ${INT.format(sku.reorderPoint)}-unit reorder point.`;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-zinc-900/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-sheet-title"
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-200 px-6 py-5">
          <div className="min-w-0">
            <p className="font-mono text-xs tabular-nums text-zinc-500">{sku.code}</p>
            <h2 id="detail-sheet-title" className="mt-1 text-lg font-bold leading-snug text-zinc-900">
              {sku.name}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close SKU detail"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 space-y-6 px-6 py-5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {sku.status}
          </span>

          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">14-day trend</p>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <Sparkline values={sku.trend} label={sku.name} deltaPct={sku.deltaPct} tone={meta.tone} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-200 p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">On hand</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{INT.format(sku.onHand)}</dd>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Reorder point</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{INT.format(sku.reorderPoint)}</dd>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Unit value</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{USD2.format(sku.unitValue)}</dd>
            </div>
            <div className="rounded-xl border border-zinc-200 p-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Total value</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-zinc-900">{USD.format(sku.totalValue)}</dd>
            </div>
          </dl>

          <dl className="space-y-2 border-t border-zinc-200 pt-4 text-sm">
            {[
              ["Category", sku.category],
              ["Warehouse", sku.warehouse],
              ["Supplier", sku.supplier],
              ["Lead time", `${sku.leadTimeDays} days`],
              ["Last restock", sku.lastRestock],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <dt className="text-zinc-500">{k}</dt>
                <dd className="font-semibold text-zinc-900">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">Recommendation</p>
            <p className="mt-1 leading-relaxed">{recommendation}</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
