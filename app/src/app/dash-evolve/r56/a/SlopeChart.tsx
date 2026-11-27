"use client";

import { ChevronDown, Leaf, Scale, Users } from "lucide-react";
import { CERTIFICATION_META, FACILITIES, FACILITY_TYPE_META, type Facility, type PeriodMode, PERIOD_OPTIONS, periodValues } from "./data";
import { BORDER, FOCUS, NUM, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx, r2 } from "./tokens";
import { DeltaTag, Eyebrow, Segmented } from "./ui";

// Score domain for the shared x-scale every row's track is plotted against. 40-100 covers the
// observed range of facility scores with a little headroom on both ends.
const SCORE_MIN = 40;
const SCORE_MAX = 100;
const TRACK_X0 = 6;
const TRACK_X1 = 194;
const TRACK_VIEW_W = 200;
const TRACK_VIEW_H = 32;
const TRACK_Y = 16;

function scoreToX(score: number): number {
  const t = (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  const clamped = Math.max(0, Math.min(1, t));
  return r2(TRACK_X0 + clamped * (TRACK_X1 - TRACK_X0));
}

const ROW_GRID = "grid grid-cols-[minmax(0,1fr)_32px_minmax(56px,1fr)_32px_60px] items-center gap-2 sm:grid-cols-[minmax(0,1.5fr)_48px_minmax(110px,1fr)_48px_92px] sm:gap-4";

function Track({ previous, current, direction }: { previous: number; current: number; direction: "up" | "down" | "flat" }) {
  const x0 = scoreToX(previous);
  const x1 = scoreToX(current);
  const lineColor = direction === "up" ? "#65a30d" : "#a1a1aa";
  const dotColor = direction === "up" ? "#3f6212" : "#52525b";
  return (
    <svg viewBox={`0 0 ${TRACK_VIEW_W} ${TRACK_VIEW_H}`} className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <line x1={TRACK_X0} y1={TRACK_Y} x2={TRACK_X1} y2={TRACK_Y} stroke="#e4e4e7" strokeWidth={2} strokeLinecap="round" />
      <line x1={x0} y1={TRACK_Y} x2={x1} y2={TRACK_Y} stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={x0} cy={TRACK_Y} r={3.5} fill="#a1a1aa" stroke="#ffffff" strokeWidth={1.5} />
      <circle cx={x1} cy={TRACK_Y} r={5} fill={dotColor} stroke="#ffffff" strokeWidth={1.5} />
    </svg>
  );
}

function RowDetail({ facility }: { facility: Facility }) {
  const cert = CERTIFICATION_META[facility.certification];
  return (
    <div className="grid grid-cols-2 gap-3 pb-3 pl-1 pr-1 pt-1 text-xs sm:grid-cols-4">
      <div className="flex items-center gap-1.5">
        <Leaf size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
        <span className={TEXT_MUTED}>Environmental</span>
        <span className={cx("ml-auto font-medium", NUM, TEXT_PRIMARY)}>{facility.environmental}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Users size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
        <span className={TEXT_MUTED}>Social</span>
        <span className={cx("ml-auto font-medium", NUM, TEXT_PRIMARY)}>{facility.social}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Scale size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
        <span className={TEXT_MUTED}>Governance</span>
        <span className={cx("ml-auto font-medium", NUM, TEXT_PRIMARY)}>{facility.governance}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <cert.Icon size={13} aria-hidden="true" className="shrink-0 text-zinc-500" />
        <span className={TEXT_MUTED}>{facility.certification}</span>
        <span className={cx("ml-auto font-medium", NUM, TEXT_PRIMARY)}>{facility.openIncidents} open</span>
      </div>
      <p className={cx("col-span-2 sm:col-span-4", TEXT_AUX)}>{facility.description}</p>
    </div>
  );
}

/**
 * The target-size fix this route exists to prove out: a slope-chart row's previous-period dot
 * and current-period dot are PURELY decorative SVG (aria-hidden, no onClick, no tabIndex). The
 * only interactive element in the row is this one <button>, which spans the row's full width and
 * height — nowhere near two small, closely-spaced hit targets, because there is only one target.
 * Both scores are also printed as plain, always-visible text in the row itself, so there was
 * never a reason to make the dots separately clickable in the first place.
 */
function Row({ facility, mode, expanded, onToggle }: { facility: Facility; mode: PeriodMode; expanded: boolean; onToggle: () => void }) {
  const { previous, current, delta, direction } = periodValues(facility, mode);
  const TypeIcon = FACILITY_TYPE_META[facility.type].Icon;
  const panelId = `arbor-row-detail-${facility.id}`;

  return (
    <li className="border-b border-zinc-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={cx("block w-full rounded-lg px-1 py-3 text-left", TRANSITION, FOCUS, "hover:bg-zinc-50")}
      >
        <div className={ROW_GRID}>
          <span className="flex min-w-0 items-center gap-2">
            <TypeIcon size={15} aria-hidden="true" className="shrink-0 text-zinc-400" />
            <span className="min-w-0">
              <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{facility.name}</span>
              <span className={cx("hidden truncate text-[11px] font-normal sm:block", TEXT_AUX)}>
                {facility.region} · {facility.type}
              </span>
            </span>
          </span>

          <span className={cx("text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_MUTED)}>{previous}</span>

          <Track previous={previous} current={current} direction={direction} />

          <span className={cx("text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{current}</span>

          <span className="flex items-center justify-end gap-1.5">
            <DeltaTag delta={delta} direction={direction} />
          </span>
        </div>
      </button>
      <div id={panelId} className="overflow-hidden transition-[max-height] duration-200 motion-reduce:transition-none" style={{ maxHeight: expanded ? "160px" : "0px" }}>
        {expanded ? <RowDetail facility={facility} /> : null}
      </div>
    </li>
  );
}

export default function SlopeChart({
  mode,
  onModeChange,
  expandedId,
  onToggleExpanded,
}: {
  mode: PeriodMode;
  onModeChange: (m: PeriodMode) => void;
  expandedId: string | null;
  onToggleExpanded: (id: string) => void;
}) {
  const previousColumnLabel = mode === "qoq" ? "Last quarter" : "Same quarter, last year";

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>ESG scorecard by facility</h2>
          </div>
          <p className={cx("mt-1 text-xs font-normal leading-relaxed", TEXT_AUX)}>
            Click a row for its environmental, social and governance breakdown. Scores are weighted 40% environmental, 30% social, 30% governance.
          </p>
        </div>
        <Segmented options={PERIOD_OPTIONS} value={mode} onChange={onModeChange} ariaLabel="Comparison period" />
      </div>

      <div className={cx(ROW_GRID, "mb-1 px-1")}>
        <Eyebrow>Facility</Eyebrow>
        <span className="text-right">
          <Eyebrow>{previousColumnLabel}</Eyebrow>
        </span>
        <span />
        <span className="text-right">
          <Eyebrow>This quarter</Eyebrow>
        </span>
        <span className="text-right">
          <Eyebrow>Change</Eyebrow>
        </span>
      </div>

      <ul className={cx("rounded-xl border", BORDER)}>
        {FACILITIES.map((f) => (
          <Row key={f.id} facility={f} mode={mode} expanded={expandedId === f.id} onToggle={() => onToggleExpanded(f.id)} />
        ))}
      </ul>

      <p className={cx("mt-3 flex items-center gap-1.5 text-[11px] font-normal", TEXT_AUX)}>
        <ChevronDown size={12} aria-hidden="true" />
        Each row is one click or focus target — the two score dots are visual only, never separately interactive.
      </p>
    </div>
  );
}
