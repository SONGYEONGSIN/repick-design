"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { useState } from "react";
import { RISK_AXES, type Vendor, cohortAverage, formatDate, formatUsd, overallScore, riskBand } from "./data";
import { BAND_BADGE, BAND_LABEL, NUM, SERIES_HEX, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Badge, Meter, Sparkline, TabPanel, Tabs } from "./ui";

/**
 * The page's second, independently-scoped selection widget. `spotlightVendor` comes from
 * ScoreTable's row-click state — it recomputes rank + per-axis deltas *only inside this card*.
 * It deliberately does NOT touch RadarChart's plotted set or ScoreTable's own sort/filter state;
 * those stay exactly as the person left them when a different row is clicked.
 */
export default function VendorSpotlight({ vendor, cohort }: { vendor: Vendor; cohort: Vendor[] }) {
  const [tab, setTab] = useState<"scores" | "notes">("scores");
  const idBase = "spotlight";

  const overall = overallScore(vendor);
  const band = riskBand(overall);
  const ranked = [...cohort].sort((a, b) => overallScore(b) - overallScore(a));
  const rank = ranked.findIndex((v) => v.id === vendor.id) + 1;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: SERIES_HEX[vendor.id] }} />
            <h3 className={cx("truncate text-base font-semibold tracking-tight", TEXT_PRIMARY)}>{vendor.name}</h3>
          </div>
          <p className={cx("mt-0.5 text-xs font-normal", TEXT_AUX)}>{`${vendor.code} · ${vendor.hqRegion} · rank ${rank} of ${cohort.length} in cohort`}</p>
        </div>
        <Badge className={BAND_BADGE[band]}>{BAND_LABEL[band]}</Badge>
      </div>

      <div className="mt-3 flex items-end gap-3">
        <span className={cx("text-3xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{overall.toFixed(1)}</span>
        <span className={cx("pb-0.5 text-xs font-normal", TEXT_MUTED)}>overall / 10</span>
        <div className="ml-auto w-24">
          <Sparkline points={vendor.trend} strokeClassName="stroke-amber-400" />
        </div>
      </div>

      <div className="mt-4">
        <Tabs
          tabs={[{ id: "scores", label: "Axis breakdown" }, { id: "notes", label: "Context" }]}
          active={tab}
          onChange={(id) => setTab(id as "scores" | "notes")}
          idBase={idBase}
          ariaLabel={`${vendor.name} spotlight sections`}
        />

        <TabPanel id={idBase} tabId="scores" active={tab === "scores"}>
          <ul className="mt-3 flex flex-col gap-2.5">
            {RISK_AXES.map((axis) => {
              const value = vendor.axes[axis];
              const avg = cohortAverage(axis, cohort);
              const delta = Math.round((value - avg) * 10) / 10;
              return (
                <li key={axis}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className={cx("truncate text-xs font-medium", TEXT_MUTED)}>{axis}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className={cx("text-xs font-semibold", NUM, TEXT_PRIMARY)}>{value.toFixed(1)}</span>
                      <span className={cx("flex items-center text-[10.5px]", NUM, delta > 0 ? "text-emerald-400" : delta < 0 ? "text-rose-400" : TEXT_AUX)}>
                        {delta > 0 ? <ArrowUpRight size={11} aria-hidden="true" /> : delta < 0 ? <ArrowDownRight size={11} aria-hidden="true" /> : <Minus size={11} aria-hidden="true" />}
                        {delta === 0 ? "even" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)} vs avg`}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1">
                    <Meter value={value} barClassName="bg-amber-400" />
                  </div>
                </li>
              );
            })}
          </ul>
        </TabPanel>

        <TabPanel id={idBase} tabId="notes" active={tab === "notes"}>
          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <div>
              <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.05em]", TEXT_AUX)}>Category</dt>
              <dd className={cx("mt-0.5 text-xs font-medium", TEXT_PRIMARY)}>{vendor.category}</dd>
            </div>
            <div>
              <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.05em]", TEXT_AUX)}>Annual spend</dt>
              <dd className={cx("mt-0.5 whitespace-nowrap text-xs font-medium", NUM, TEXT_PRIMARY)}>{formatUsd(vendor.annualSpendUsd)}</dd>
            </div>
            <div>
              <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.05em]", TEXT_AUX)}>Lead time</dt>
              <dd className={cx("mt-0.5 text-xs font-medium", NUM, TEXT_PRIMARY)}>{`${vendor.leadTimeDays} days`}</dd>
            </div>
            <div>
              <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.05em]", TEXT_AUX)}>Open incidents</dt>
              <dd className={cx("mt-0.5 text-xs font-medium", NUM, TEXT_PRIMARY)}>{vendor.openIncidents}</dd>
            </div>
            <div className="col-span-2">
              <dt className={cx("text-[10.5px] font-medium uppercase tracking-[0.05em]", TEXT_AUX)}>Contract renewal</dt>
              <dd className={cx("mt-0.5 whitespace-nowrap text-xs font-medium", NUM, TEXT_PRIMARY)}>{formatDate(vendor.contractRenewal)}</dd>
            </div>
          </dl>
          <p className={cx("mt-3 text-xs font-normal leading-relaxed", TEXT_MUTED)}>{vendor.notes}</p>
        </TabPanel>
      </div>
    </div>
  );
}
