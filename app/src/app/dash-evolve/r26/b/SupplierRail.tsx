"use client";

import { Eye, Pin } from "lucide-react";
import { useState } from "react";
import { BOX_STATS, PERIOD_LABEL, RECORDS, TIER_BADGE, TIER_ICON, TIER_LABEL, formatInt, riskTierOf, type Period, type SupplierProfile } from "./data";
import { BORDER, FOCUS, NUM, PANEL_BG, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, Eyebrow, Sparkline } from "./ui";

/**
 * Two structurally separate interaction scopes, on purpose (per the recurring
 * "branched selection" requirement):
 *
 *  - HOVER / FOCUS  → `previewId`, state local to *this* component only. It
 *    never leaves SupplierRail, never touches `pinnedId` in the parent, and
 *    disappears the instant the pointer/focus leaves the row. It renders a
 *    small "Preview" popover with a snapshot reading — nothing else on the
 *    page re-renders because of it.
 *
 *  - CLICK (or Enter/Space on the row)  → calls `onPin`, which is owned by
 *    the parent and is the *only* thing that swaps the detail pane (box
 *    plot + summary table + ledger). That is the persistent selection.
 *
 * The visible split: a pinned row carries a solid "Pinned" badge + filled
 * pin icon that stays until another row is clicked; a merely-hovered row
 * only ever shows the dashed-bordered "Preview" popover, which vanishes on
 * blur/mouseleave and never earns a badge of its own.
 */
export default function SupplierRail({ suppliers, period, pinnedId, onPin }: { suppliers: SupplierProfile[]; period: Period; pinnedId: string; onPin: (id: string) => void }) {
  const [previewId, setPreviewId] = useState<string | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className={cx("border-b px-4 py-3", BORDER)}>
        <p className={cx("text-sm font-semibold", TEXT_PRIMARY)}>Supplier cohorts</p>
        <p className={cx("mt-0.5 text-[11px] font-normal", TEXT_AUX)}>Hover a row to preview · click to pin it open</p>
      </div>

      <ul className="flex-1">
        {suppliers.map((s) => {
          const stats = BOX_STATS[s.id][period];
          const tier = riskTierOf(stats.median);
          const TierIcon = TIER_ICON[tier];
          const pinned = s.id === pinnedId;
          const previewing = previewId === s.id && !pinned;
          const trend = RECORDS[s.id]["90D"].map((r) => r.severity);

          return (
            <li key={s.id} className={cx("relative border-b last:border-b-0", BORDER)}>
              <button
                type="button"
                onClick={() => onPin(s.id)}
                onMouseEnter={() => setPreviewId(s.id)}
                onMouseLeave={() => setPreviewId((v) => (v === s.id ? null : v))}
                onFocus={() => setPreviewId(s.id)}
                onBlur={() => setPreviewId((v) => (v === s.id ? null : v))}
                aria-current={pinned ? "true" : undefined}
                className={cx(
                  "flex w-full items-start gap-2.5 border-l-2 px-3.5 py-3 text-left",
                  TRANSITION,
                  FOCUS,
                  pinned ? "border-l-violet-700 bg-violet-50/60" : "border-l-transparent hover:bg-zinc-50",
                )}
              >
                <TierIcon
                  size={15}
                  aria-hidden="true"
                  className={cx("mt-0.5 shrink-0", tier === "steady" ? "text-emerald-500" : tier === "elevated" ? "text-amber-500" : "text-rose-500")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{s.name}</span>
                    {pinned ? (
                      <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-violet-700">
                        <Pin size={11} aria-hidden="true" className="fill-violet-700" />
                        Pinned
                      </span>
                    ) : (
                      <Sparkline values={trend} className={tier === "steady" ? "text-emerald-500" : tier === "elevated" ? "text-amber-500" : "text-rose-500"} />
                    )}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-1.5">
                    <Badge className={TIER_BADGE[tier]}>{TIER_LABEL[tier]}</Badge>
                    <span className={cx("truncate text-[11px] font-normal", TEXT_MUTED)}>{`${s.region} · ${s.category}`}</span>
                  </span>
                  <span className={cx("mt-1.5 flex items-center gap-1.5 text-[11px] font-normal", TEXT_AUX)}>
                    <span className={cx(NUM, "font-semibold text-zinc-700")}>{stats.median.toFixed(1)}</span>
                    median severity ·{" "}
                    <span className={NUM}>{formatInt(stats.n)}</span> insp.
                    {stats.outliers.length > 0 ? <span className="text-rose-600">{`· ${stats.outliers.length} outlier${stats.outliers.length === 1 ? "" : "s"}`}</span> : null}
                  </span>
                </span>
              </button>

              {previewing ? (
                <div
                  role="status"
                  aria-live="polite"
                  className={cx(
                    "pointer-events-none absolute left-3 right-3 top-full z-30 -mt-px rounded-lg border border-dashed p-2.5 text-xs shadow-lg",
                    "border-violet-300",
                    PANEL_BG,
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye size={12} aria-hidden="true" className="text-violet-600" />
                    <Eyebrow className="text-violet-700">{`Preview · ${PERIOD_LABEL[period]}`}</Eyebrow>
                  </span>
                  <p className={cx("mt-1 leading-snug", TEXT_MUTED)}>
                    {`Median ${stats.median.toFixed(1)} · Q1–Q3 ${stats.q1.toFixed(1)}–${stats.q3.toFixed(1)} · ${stats.outliers.length} outlier${stats.outliers.length === 1 ? "" : "s"}.`}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-violet-700">Click to pin and open full detail →</p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
