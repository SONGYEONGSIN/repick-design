"use client";

import { Leaf, MapPin, Scale, Users, X } from "lucide-react";
import { CERTIFICATION_META, currentScore, facilityById, FACILITY_TYPE_META, formatScore, periodValues, scoreHistory } from "./data";
import { BORDER, FOCUS, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Card, CardHead, DeltaTag, ProgressBar, Sparkline } from "./ui";

/**
 * Independently scoped from the slope chart's row disclosure: this panel only changes when a
 * facility is explicitly pinned from the table or the command palette, and it never reacts to
 * the slope chart's per-row click (that only opens an ephemeral breakdown inline, in the chart
 * itself). Two separate selections, neither resetting the other.
 */
export default function DetailPanel({ facilityId, onClear }: { facilityId: string | null; onClear: () => void }) {
  const facility = facilityId ? facilityById(facilityId) : undefined;

  if (!facility) {
    return (
      <Card className="flex min-h-[220px] flex-col items-center justify-center text-center">
        <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>No facility pinned</p>
        <p className={cx("mt-1 max-w-[260px] text-xs font-normal leading-relaxed", TEXT_AUX)}>
          Select a row in the facility table, or search with ⌘K, to pin its full ESG breakdown here.
        </p>
      </Card>
    );
  }

  const TypeIcon = FACILITY_TYPE_META[facility.type].Icon;
  const cert = CERTIFICATION_META[facility.certification];
  const current = currentScore(facility);
  const qoq = periodValues(facility, "qoq");
  const yoy = periodValues(facility, "yoy");
  const history = scoreHistory(facility);

  return (
    <Card>
      <CardHead
        title="Facility detail"
        action={
          <button type="button" onClick={onClear} className={cx("grid h-9 w-9 place-items-center rounded-lg", TRANSITION, FOCUS, "hover:bg-zinc-100")}>
            <X size={15} aria-hidden="true" className={TEXT_AUX} />
            <span className="sr-only">Clear pinned facility</span>
          </button>
        }
      />

      <div className="mt-4 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-200 bg-zinc-100">
          <TypeIcon size={18} aria-hidden="true" className="text-zinc-500" />
        </span>
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{facility.name}</p>
          <p className={cx("flex items-center gap-1 text-xs font-normal", TEXT_AUX)}>
            <MapPin size={11} aria-hidden="true" className="shrink-0" />
            {facility.region} · {facility.type}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
        <div>
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Current ESG score</p>
          <p className={cx("text-2xl font-semibold leading-none", NUM, TEXT_PRIMARY)}>{formatScore(current)}</p>
        </div>
        <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none", cert.className)}>
          <cert.Icon size={11} aria-hidden="true" />
          {facility.certification}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className={cx("min-w-0 rounded-xl border p-2.5", BORDER)}>
          <p className={cx("text-[11px] font-medium", TEXT_AUX)}>Quarter over quarter</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className={cx("whitespace-nowrap text-xs font-normal", NUM, TEXT_MUTED)}>
              {qoq.previous} → {qoq.current}
            </span>
            <DeltaTag delta={qoq.delta} direction={qoq.direction} />
          </div>
        </div>
        <div className={cx("min-w-0 rounded-xl border p-2.5", BORDER)}>
          <p className={cx("text-[11px] font-medium", TEXT_AUX)}>Year over year</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className={cx("whitespace-nowrap text-xs font-normal", NUM, TEXT_MUTED)}>
              {yoy.previous} → {yoy.current}
            </span>
            <DeltaTag delta={yoy.delta} direction={yoy.direction} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-2">
          <Leaf size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
          <span className={cx("w-24 shrink-0 text-xs font-normal", TEXT_MUTED)}>Environmental</span>
          <div className="min-w-0 flex-1">
            <ProgressBar pct={facility.environmental} label="Environmental score" />
          </div>
          <span className={cx("w-7 shrink-0 text-right text-xs font-medium", NUM, TEXT_PRIMARY)}>{facility.environmental}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
          <span className={cx("w-24 shrink-0 text-xs font-normal", TEXT_MUTED)}>Social</span>
          <div className="min-w-0 flex-1">
            <ProgressBar pct={facility.social} label="Social score" />
          </div>
          <span className={cx("w-7 shrink-0 text-right text-xs font-medium", NUM, TEXT_PRIMARY)}>{facility.social}</span>
        </div>
        <div className="flex items-center gap-2">
          <Scale size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
          <span className={cx("w-24 shrink-0 text-xs font-normal", TEXT_MUTED)}>Governance</span>
          <div className="min-w-0 flex-1">
            <ProgressBar pct={facility.governance} label="Governance score" />
          </div>
          <span className={cx("w-7 shrink-0 text-right text-xs font-medium", NUM, TEXT_PRIMARY)}>{facility.governance}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
        <div>
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>5-quarter trend</p>
          <p className={cx("mt-0.5 text-xs font-normal", TEXT_AUX)}>{facility.openIncidents} open incident{facility.openIncidents === 1 ? "" : "s"}</p>
        </div>
        <Sparkline values={history} ariaLabel={`${facility.name} ESG score over the last five quarters, ending at ${current}`} />
      </div>

      <p className={cx("mt-3 text-xs font-normal leading-relaxed", TEXT_AUX)}>{facility.description}</p>
    </Card>
  );
}
