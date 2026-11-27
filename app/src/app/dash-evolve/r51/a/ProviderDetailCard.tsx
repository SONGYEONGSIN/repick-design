"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, PinOff, ShieldAlert } from "lucide-react";
import { DAILY, type ProviderId, PROVIDER_BY_ID, SNAPSHOT_BY_ID, TOTAL_DAYS, r2, rateOf } from "./data";
import { BORDER, FOCUS, NUM, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, GradeBadge } from "./ui";

const INCIDENT_NOTE: Partial<Record<ProviderId, string>> = {
  yahoo: "A 16-day authentication issue (Sep 22–Oct 7) pushed this provider's placement rate as low as the mid-60s. It has been recovering since, but has not yet closed the gap to its pre-incident baseline.",
};

/** Last 14 days of this provider's rate, as a small generated sparkline — coordinates rounded to
 *  2dp, same determinism contract as the hero chart. */
function Sparkline({ id }: { id: ProviderId }) {
  const days = DAILY.slice(TOTAL_DAYS - 14);
  const rates = days.map((d) => rateOf(d.byProvider[id]));
  const lo = Math.min(...rates);
  const hi = Math.max(...rates);
  const span = Math.max(1, hi - lo);
  const w = 100;
  const h = 28;
  const pts = rates.map((r, i) => ({ x: r2((i * w) / (rates.length - 1)), y: r2(h - ((r - lo) / span) * (h - 4) - 2) }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const meta = PROVIDER_BY_ID[id];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`${meta.label} placement rate over the last 14 days, from ${lo}% to ${hi}%`} className="shrink-0">
      <path d={path} fill="none" stroke={meta.strokeHex} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r={2} fill={meta.strokeHex} />
    </svg>
  );
}

export default function ProviderDetailCard({ pinnedId, explicitPin, onClearPin }: { pinnedId: ProviderId; explicitPin: boolean; onClearPin: () => void }) {
  const meta = PROVIDER_BY_ID[pinnedId];
  const snap = SNAPSHOT_BY_ID[pinnedId];
  const delta = snap.deltaVsPriorWeek;
  const DeltaIcon = delta > 0.5 ? ArrowUpRight : delta < -0.5 ? ArrowDownRight : ArrowRight;
  const deltaLabel = delta > 0.5 ? "up" : delta < -0.5 ? "down" : "flat vs";
  const note = INCIDENT_NOTE[pinnedId];

  return (
    <Card className="flex h-full flex-col">
      <CardHead
        title="Provider detail"
        Icon={ShieldAlert}
        hint={explicitPin ? `Pinned — click its ribbon or legend chip again to release it.` : `Auto-selected: today's worst-performing provider. Click any ribbon or legend chip to pin a different one.`}
        action={
          explicitPin ? (
            <button type="button" onClick={onClearPin} className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium", BORDER, "bg-white/[0.04] hover:bg-white/[0.07]", TRANSITION, FOCUS, TEXT_AUX)}>
              <PinOff size={13} aria-hidden="true" />
              Release
            </button>
          ) : null
        }
      />

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className={cx("truncate text-lg font-semibold", TEXT_PRIMARY)}>{meta.label}</p>
          <p className={cx("mt-0.5 text-xs font-normal", TEXT_AUX)}>{`${snap.volumeShareToday}% of today's monitored inbox volume`}</p>
        </div>
        <Sparkline id={pinnedId} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>Today</dt>
          <dd className="mt-1 flex items-baseline gap-1.5">
            <span className={cx("text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{snap.todayRate}%</span>
            <GradeBadge grade={snap.todayGrade} />
          </dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <dt className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>7-day average</dt>
          <dd className="mt-1 flex items-baseline gap-1.5">
            <span className={cx("text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{snap.rate7d}%</span>
            <span className={cx("flex items-center gap-0.5 text-xs font-medium", NUM, delta > 0.5 ? "text-emerald-300" : delta < -0.5 ? "text-rose-300" : TEXT_AUX)}>
              <DeltaIcon size={13} aria-hidden="true" />
              {`${Math.abs(delta)}pt`}
            </span>
          </dd>
        </div>
      </dl>

      <p className={cx("mt-3 text-xs font-normal leading-relaxed", TEXT_AUX)}>
        {`${meta.label} is landing in the inbox ${snap.todayRate}% of the time today (grade ${snap.todayGrade}), `}
        {`${deltaLabel === "flat vs" ? "roughly flat vs" : deltaLabel} last week's ${snap.rate7dPrior}% average.`}
      </p>

      {note ? <p className={cx("mt-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.06] p-2.5 text-[11px] leading-relaxed text-amber-200")}>{note}</p> : null}
    </Card>
  );
}
