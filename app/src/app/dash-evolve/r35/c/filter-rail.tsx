"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { CHANNELS, OBJECTIVES, PERIODS, TOTAL_CAMPAIGNS, type Campaign } from "./data";
import { BORDER, CHANNEL_HEX, CHANNEL_SHAPE, FOCUS, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type ChannelId, type ObjectiveFilter, type PeriodId, cx } from "./tokens";
import { CardHead, ChannelGlyph, Eyebrow, Segmented } from "./ui";

const OBJECTIVE_OPTIONS: { id: ObjectiveFilter; label: string }[] = [{ id: "all", label: "All" }, ...OBJECTIVES.map((o) => ({ id: o.id as ObjectiveFilter, label: o.label }))];
const PERIOD_OPTIONS = PERIODS.map((p) => ({ id: p.id, label: p.label }));

/**
 * The filter rail IS the scatter's categorical legend — each chip shows the exact
 * shape + color pairing the chart draws for that channel (charts.catalog's
 * "group-by-shape markers" fallback), so there is no separate decorative legend
 * duplicating this information. Toggling a chip only changes which points are
 * rendered and feeds the aggregate panel to the right; it never touches the
 * chart's own hover/pin state (see scatter-chart.tsx).
 */
export default function FilterRail({
  campaigns,
  channelFilter,
  onToggleChannel,
  objective,
  onObjective,
  period,
  onPeriod,
  onReset,
  isDefault,
}: {
  campaigns: Campaign[];
  channelFilter: Set<ChannelId>;
  onToggleChannel: (id: ChannelId) => void;
  objective: ObjectiveFilter;
  onObjective: (v: ObjectiveFilter) => void;
  period: PeriodId;
  onPeriod: (v: PeriodId) => void;
  onReset: () => void;
  isDefault: boolean;
}) {
  const channelCounts = new Map<ChannelId, number>();
  for (const c of campaigns) channelCounts.set(c.channel, (channelCounts.get(c.channel) ?? 0) + 1);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900 p-4 shadow-sm shadow-black/20 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CardHead
          title="Filters"
          hint="Channel, objective and date window all narrow which campaigns plot below — the cohort panel recalculates to match, live."
          Icon={SlidersHorizontal}
        />
        <button
          type="button"
          onClick={onReset}
          disabled={isDefault}
          className={cx(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium",
            TRANSITION,
            FOCUS,
            isDefault ? cx(BORDER, SURFACE_INSET, "cursor-not-allowed text-zinc-600") : cx(BORDER, SURFACE_INSET, TEXT_MUTED, "hover:bg-white/5 hover:text-zinc-50"),
          )}
        >
          <RotateCcw size={13} aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-start lg:gap-6">
        <fieldset className="min-w-0">
          <legend className="mb-2">
            <Eyebrow>Channel</Eyebrow>
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {CHANNELS.map((ch) => {
              const selected = channelFilter.has(ch.id);
              const count = channelCounts.get(ch.id) ?? 0;
              return (
                <button
                  key={ch.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onToggleChannel(ch.id)}
                  style={selected ? { borderColor: `${CHANNEL_HEX[ch.id]}66`, backgroundColor: `${CHANNEL_HEX[ch.id]}1a` } : undefined}
                  className={cx(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs",
                    TRANSITION,
                    FOCUS,
                    selected ? "font-semibold text-zinc-50" : cx("font-medium", BORDER, SURFACE_INSET, "text-zinc-500 hover:text-zinc-300"),
                  )}
                >
                  <ChannelGlyph channel={ch.id} shape={CHANNEL_SHAPE[ch.id]} size={13} dim={!selected} />
                  {ch.label}
                  <span className={cx("tabular-nums", selected ? "text-zinc-300" : "text-zinc-600")}>{count}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="min-w-0">
          <div className="mb-2">
            <Eyebrow>Objective</Eyebrow>
          </div>
          <Segmented options={OBJECTIVE_OPTIONS} value={objective} onChange={onObjective} ariaLabel="Filter by campaign objective" />
        </div>

        <div className="min-w-0">
          <div className="mb-2">
            <Eyebrow>Window</Eyebrow>
          </div>
          <Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriod} ariaLabel="Trailing date window" />
        </div>

        <div className="min-w-0 lg:ml-auto">
          <div className="mb-2">
            <Eyebrow>Cohort</Eyebrow>
          </div>
          <p className={cx("text-sm font-medium", TEXT_PRIMARY)}>
            <span className="tabular-nums">{campaigns.length}</span> <span className={cx("font-normal", TEXT_AUX)}>{`of ${TOTAL_CAMPAIGNS} campaigns shown`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
