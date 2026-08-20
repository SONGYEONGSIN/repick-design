"use client";

/**
 * Backhaul — the stage inspector strip: why units leave the selected stage, and how long the ones
 * still sitting in it have been there.
 *
 * Tab one is the drop-off reason breakdown, a horizontal bar set where every bar prints its own
 * count and its share of the stage's drop-off as text — the bar length is a second reading of a
 * number that is already legible without it. The reason counts are the same authored values the
 * funnel sums to get `dropped`, so the breakdown always adds up to the wedge above it.
 *
 * Tab two profiles how long the units currently held in this stage have been waiting. Those buckets
 * are counted from the very rows the held-units table renders, so the two can never drift apart.
 *
 * The strip runs the full 12 columns rather than sharing a row with the units table: at 1280 a
 * seven-column table squeezed into a 7-of-12 span truncates half its cells, and a bar set is the
 * one panel here that reads better wide and short than narrow and tall.
 */

import { CircleCheck, Timer } from "lucide-react";
import { useState } from "react";
import type { Stage, UnitRow } from "./data";
import { dwellBuckets, fmtInt, fmtPct } from "./data";
import { BORDER, EYEBROW, FOCUS_INSET, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Tabs, ValueBar } from "./ui";

type TabId = "reasons" | "dwell";

const TABS: { id: TabId; label: string }[] = [
  { id: "reasons", label: "Drop-off reasons" },
  { id: "dwell", label: "Dwell profile" },
];

/* Two columns until 2xl: at 1280 a third column drops each bar's label under the intrinsic width of
   "Battery health under 80%" and starts truncating reason codes, which are the whole point here. */
const BAR_GRID = "grid gap-x-8 gap-y-4 sm:grid-cols-2 2xl:grid-cols-3";
const BAR_FOOT = "text-[11px] font-normal leading-relaxed sm:col-span-2 2xl:col-span-3";

export default function StageInspector({ stage, units }: { stage: Stage; units: UnitRow[] }) {
  const [tab, setTab] = useState<TabId>("reasons");
  const maxReason = stage.reasons.length === 0 ? 1 : stage.reasons[0].count;
  const buckets = dwellBuckets(units);
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <div className="mt-4">
      <Tabs tabs={TABS} value={tab} onChange={setTab} ariaLabel="Inspector view" />

      <div className="mt-4 grid gap-x-6 gap-y-4 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
        <div className={cx("h-fit rounded-xl border px-3.5 py-3", BORDER, "bg-zinc-950/40")}>
          <span className={cx(EYEBROW, TEXT_CAPTION)}>{tab === "reasons" ? "Leaving this stage" : "Waiting in this stage"}</span>
          {tab === "reasons" ? (
            stage.dropped === 0 ? (
              <p className={cx("mt-1.5 text-sm font-medium leading-snug", TEXT_SECONDARY)}>
                No drop-off — units reaching {stage.name.toLowerCase()} are sellable inventory.
              </p>
            ) : (
              <p className={cx("mt-1.5 text-sm font-normal leading-snug", TEXT_SECONDARY)}>
                <span className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{fmtInt(stage.dropped)}</span> of{" "}
                <span className={cx("font-medium", NUM)}>{fmtInt(stage.entered)}</span> units entering leave here —{" "}
                <span className={cx("font-medium", NUM, "text-indigo-300")}>{fmtPct(stage.dropRatePct)}</span> of the stage.
              </p>
            )
          ) : (
            <p className={cx("mt-1.5 text-sm font-normal leading-snug", TEXT_SECONDARY)}>
              <span className={cx("text-xl font-semibold", NUM, TEXT_PRIMARY)}>{fmtInt(units.length)}</span> units are held here awaiting a decision. The stage
              breaches its operations SLA after <span className={cx("font-medium", NUM)}>{fmtInt(stage.holdSlaHours)} hours</span>.
            </p>
          )}
        </div>

        {tab === "reasons" ? (
          <div role="tabpanel" id="panel-reasons" aria-labelledby="tab-reasons" tabIndex={0} className={cx("rounded-lg", FOCUS_INSET)}>
            {stage.reasons.length === 0 ? (
              <div className={cx("flex h-full min-h-28 flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 text-center", BORDER)}>
                <CircleCheck size={20} aria-hidden="true" className="text-emerald-300" />
                <p className={cx("text-sm font-medium", TEXT_SECONDARY)}>Terminal stage — nothing drops out</p>
                <p className={cx("text-xs font-normal", TEXT_CAPTION)}>Units leave this stage as sales, not as losses, so there are no reason codes to break down.</p>
              </div>
            ) : (
              <div className={BAR_GRID}>
                {stage.reasons.map((r, i) => (
                  <ValueBar key={r.id} label={r.label} value={fmtInt(r.count)} share={fmtPct(r.shareOfDropPct)} fillPct={(r.count / maxReason) * 100} emphasis={i === 0} />
                ))}
                <p className={cx(BAR_FOOT, TEXT_CAPTION)}>
                  Reason codes are exclusive and sum to the stage&apos;s {fmtInt(stage.dropped)} dropped units. Share is measured against that drop-off, not against
                  the {fmtInt(stage.entered)} units entering.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div role="tabpanel" id="panel-dwell" aria-labelledby="tab-dwell" tabIndex={0} className={cx("rounded-lg", FOCUS_INSET)}>
            <div className={BAR_GRID}>
              {buckets.map((b) => (
                <ValueBar
                  key={b.id}
                  label={b.label}
                  value={fmtInt(b.count)}
                  share={units.length === 0 ? "—" : fmtPct(Math.round((b.count / units.length) * 1000) / 10)}
                  fillPct={(b.count / maxBucket) * 100}
                  emphasis={b.id === "b4" && b.count > 0}
                />
              ))}
              <p className={cx(BAR_FOOT, "flex items-start gap-1.5", TEXT_CAPTION)}>
                <Timer size={13} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span>
                  Buckets are counted from the same {fmtInt(units.length)} rows the held-units table below renders, so the two always agree. Anything over{" "}
                  {fmtInt(stage.holdSlaHours)} hours has breached this stage&apos;s SLA.
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
