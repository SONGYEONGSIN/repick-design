"use client";

import { Wallet } from "lucide-react";
import { PERIOD_OPTIONS, currencyWhole, formatDate, pct, TODAY_ISO, type HeroSnapshot, type Period } from "./data";
import { NUM, TEXT_MUTED, TEXT_PRIMARY, cx } from "./tokens";
import { Card, CardHead, DeltaChip, Segmented } from "./ui";

/**
 * The hero-number-first layout this round is assigned: ONE dominant metric, not a row of
 * equal-weight KPI cards. Supporting figures ride along as a light inline strip (label/value pairs
 * separated by hairlines), never boxed as their own cards.
 */
export default function HeroPanel({ period, onPeriodChange, snapshot }: { period: Period; onPeriodChange: (p: Period) => void; snapshot: HeroSnapshot }) {
  const deltaPct = ((snapshot.amount - snapshot.prevAmount) / snapshot.prevAmount) * 100;

  const stats: { label: string; value: string }[] = [
    { label: "Take rate", value: pct(snapshot.takeRatePct) },
    { label: "Settlements processed", value: new Intl.NumberFormat("en-US").format(snapshot.settlements) },
    { label: "Avg. settlement time", value: `${snapshot.avgSettleDays.toFixed(1)} days` },
    { label: "New disputes", value: new Intl.NumberFormat("en-US").format(snapshot.newDisputes) },
  ];

  return (
    <Card padded={false} className="p-6 sm:p-8">
      <style>{`
        @keyframes payline-hero-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .payline-hero-anim { animation: payline-hero-in 220ms ease-out; }
        @media (prefers-reduced-motion: reduce) { .payline-hero-anim { animation: none; } }
      `}</style>

      <CardHead
        title="Net payout volume"
        Icon={Wallet}
        hint="Total paid out to sellers, net of refunds and reversals, for the selected window."
        action={<Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriodChange} ariaLabel="Payout period" />}
      />

      <div key={period} className="payline-hero-anim mt-5">
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <p className={cx("text-[56px] font-semibold leading-none tracking-tight sm:text-[72px] lg:text-[96px]", NUM, TEXT_PRIMARY)} style={{ fontFamily: "var(--font-display-mono)" }}>
            {currencyWhole(snapshot.amount)}
          </p>
          <DeltaChip pct={deltaPct} />
        </div>
        <p className={cx("mt-2 text-sm font-normal", TEXT_MUTED)}>{`${snapshot.rangeLabel} · as of ${formatDate(TODAY_ISO)}`}</p>
      </div>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-zinc-100 pt-5">
        {stats.map((s, i) => (
          <div key={s.label} className={cx("min-w-[9rem]", i > 0 && "border-zinc-100 sm:border-l sm:pl-8")}>
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_MUTED)}>{s.label}</dt>
            <dd className={cx("mt-1 text-lg font-semibold leading-none", NUM, TEXT_PRIMARY)}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
