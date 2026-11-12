"use client";

import { Check, RotateCcw, SlidersHorizontal } from "lucide-react";
import { CHANNELS, GOALS, PERIODS, TOTAL_CAMPAIGNS, type Campaign } from "./data";
import { BORDER, CHANNEL_SHAPE, FOCUS, INSET_BG, TEXT_DIM, TEXT_PRIMARY, TRANSITION, type ChannelId, type GoalFilter, type PeriodId, cx } from "./tokens";
import { ChannelGlyph, Eyebrow, Segmented } from "./ui";

const GOAL_OPTIONS: { id: GoalFilter; label: string }[] = [{ id: "all", label: "All goals" }, ...GOALS.map((g) => ({ id: g.id as GoalFilter, label: g.label }))];
const PERIOD_OPTIONS = PERIODS.map((p) => ({ id: p.id, label: p.label }));

/**
 * Left, narrow filter rail — this IS the scatter's categorical legend too: each
 * channel row shows the exact shape + color pairing the chart draws for that
 * channel, so there is no separate decorative legend duplicating it. Toggling a
 * channel or changing the goal/period only changes which campaigns are passed to
 * the aggregate panel and the chart below; it never reads or writes the chart's
 * own hover/pin state.
 */
export default function FilterRail({
  countsSource,
  visibleCount,
  channelFilter,
  onToggleChannel,
  goal,
  onGoal,
  period,
  onPeriod,
  onReset,
  isDefault,
}: {
  /** Campaigns narrowed by the GOAL filter only (never by channel) — each row's
   * count reflects this, so toggling a channel off never makes its own count read
   * "0" (which would look broken rather than "currently hidden"). */
  countsSource: Campaign[];
  /** The fully filtered (channel + goal) count — what is actually plotted. */
  visibleCount: number;
  channelFilter: Set<ChannelId>;
  onToggleChannel: (id: ChannelId) => void;
  goal: GoalFilter;
  onGoal: (v: GoalFilter) => void;
  period: PeriodId;
  onPeriod: (v: PeriodId) => void;
  onReset: () => void;
  isDefault: boolean;
}) {
  const channelCounts = new Map<ChannelId, number>();
  for (const c of countsSource) channelCounts.set(c.channel, (channelCounts.get(c.channel) ?? 0) + 1);

  return (
    <div className={cx("rounded-2xl border p-4", BORDER, "bg-zinc-900 shadow-sm shadow-black/20")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={14} aria-hidden="true" className={TEXT_DIM} />
          <h2 className={cx("text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={isDefault}
          className={cx(
            "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium",
            TRANSITION,
            FOCUS,
            BORDER,
            INSET_BG,
            isDefault ? cx(TEXT_DIM, "cursor-not-allowed opacity-60") : cx(TEXT_DIM, "hover:bg-white/5 hover:text-zinc-50"),
          )}
        >
          <RotateCcw size={12} aria-hidden="true" />
          Reset
        </button>
      </div>
      <p className={cx("mt-1.5 text-xs font-normal leading-relaxed", TEXT_DIM)}>
        {"Channel, goal and date window narrow which campaigns plot below — the cohort panel recalculates to match, live."}
      </p>

      <fieldset className="mt-5">
        <legend className="mb-2">
          <Eyebrow>Channel</Eyebrow>
        </legend>
        <div className="flex flex-col gap-1">
          {CHANNELS.map((ch) => {
            const selected = channelFilter.has(ch.id);
            const count = channelCounts.get(ch.id) ?? 0;
            return (
              <button
                key={ch.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onToggleChannel(ch.id)}
                className={cx(
                  "flex h-10 w-full items-center gap-2 rounded-lg border px-2.5 text-left text-xs",
                  TRANSITION,
                  FOCUS,
                  BORDER,
                  selected ? "bg-white/[0.06] font-semibold text-zinc-50" : cx(INSET_BG, "font-medium", TEXT_DIM, "hover:text-zinc-200"),
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx("grid h-4 w-4 shrink-0 place-items-center rounded-[4px] border", selected ? "border-orange-400 bg-orange-400" : "border-white/20")}
                >
                  {selected ? <Check size={11} strokeWidth={3} className="text-zinc-950" /> : null}
                </span>
                <ChannelGlyph channel={ch.id} shape={CHANNEL_SHAPE[ch.id]} size={13} dim={!selected} />
                <span className="min-w-0 flex-1 truncate">{ch.label}</span>
                <span className="tabular-nums text-zinc-400">{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5">
        <div className="mb-2">
          <Eyebrow>Goal</Eyebrow>
        </div>
        <div role="radiogroup" aria-label="Filter by campaign goal" className="flex flex-col gap-1">
          {GOAL_OPTIONS.map((opt) => {
            const active = opt.id === goal;
            return (
              <button
                key={opt.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onGoal(opt.id)}
                className={cx(
                  "flex h-9 w-full items-center rounded-lg px-2.5 text-left text-xs",
                  TRANSITION,
                  FOCUS,
                  active ? "bg-orange-400/10 font-semibold text-orange-300" : cx("font-medium", TEXT_DIM, "hover:bg-white/5 hover:text-zinc-200"),
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2">
          <Eyebrow>Window</Eyebrow>
        </div>
        <Segmented options={PERIOD_OPTIONS} value={period} onChange={onPeriod} ariaLabel="Trailing date window" />
      </div>

      <div className={cx("mt-5 rounded-xl border p-3", BORDER, INSET_BG)}>
        <Eyebrow>Cohort</Eyebrow>
        <p className={cx("mt-1 text-sm font-medium", TEXT_PRIMARY)}>
          <span className="tabular-nums">{visibleCount}</span> <span className={cx("font-normal", TEXT_DIM)}>{`of ${TOTAL_CAMPAIGNS} campaigns shown`}</span>
        </p>
      </div>
    </div>
  );
}
