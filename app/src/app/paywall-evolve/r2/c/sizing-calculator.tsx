"use client";

import { useId } from "react";
import { Gauge } from "lucide-react";
import {
  type BillingPeriod,
  VOLUME_SLIDER,
  cx,
  fmt,
  FOCUS,
  getPlan,
  planPrice,
  recommendPlanId,
  usd,
} from "./data";

interface SizingCalculatorProps {
  billing: BillingPeriod;
  volume: number;
  onVolumeChange: (v: number) => void;
}

/**
 * The sizing module — kept structurally separate from the persuasion module (`BlockedEvidence`) and
 * from the always-visible summary bar. Moving the slider recomputes a recommended tier from pure
 * arithmetic (`recommendPlanId`), never from a stored plan choice, so the number on screen always
 * matches the slider position exactly.
 */
export default function SizingCalculator({ billing, volume, onVolumeChange }: SizingCalculatorProps) {
  const sliderId = useId();
  const recommendedId = recommendPlanId(volume);
  const plan = getPlan(recommendedId);
  const price = planPrice(plan, billing);
  const headroom = plan.sendsIncluded - volume;
  const percent = Math.round(((volume - VOLUME_SLIDER.min) / (VOLUME_SLIDER.max - VOLUME_SLIDER.min)) * 1000) / 10;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
      <div className="min-w-0">
        <label htmlFor={sliderId} className="text-sm font-medium text-zinc-50">
          Estimated sends per month
        </label>
        <p className="mt-1 max-w-prose text-xs font-normal leading-relaxed text-zinc-400">
          Move the slider to your best guess. The recommendation and price below recalculate from that
          number alone — the billing toggle above controls whether it&apos;s shown monthly or annual.
        </p>

        <div className="mt-4 flex items-center gap-4">
          <input
            id={sliderId}
            type="range"
            min={VOLUME_SLIDER.min}
            max={VOLUME_SLIDER.max}
            step={VOLUME_SLIDER.step}
            value={volume}
            onChange={(e) => onVolumeChange(Number(e.target.value))}
            aria-describedby={`${sliderId}-value`}
            className={cx(
              "h-2 w-full flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-blue-500",
              FOCUS,
            )}
            style={{ background: `linear-gradient(to right, var(--color-blue-500, #3b82f6) ${percent}%, var(--color-zinc-800, #27272a) ${percent}%)` }}
          />
          <span id={`${sliderId}-value`} className="w-24 flex-none text-right text-sm font-semibold tabular-nums text-zinc-50">
            {fmt(volume)}
          </span>
        </div>
        <div className="mt-1.5 flex justify-between text-[11px] font-normal tabular-nums text-zinc-400">
          <span>{fmt(VOLUME_SLIDER.min)}</span>
          <span>{fmt(VOLUME_SLIDER.max)} / mo</span>
        </div>
      </div>

      <div aria-live="polite" className="min-w-0 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 lg:w-64">
        <p className="flex items-center gap-1.5 text-xs font-medium text-blue-300">
          <Gauge className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          Recommended for that volume
        </p>
        <p className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-50">{plan.name}</p>
        <p className="mt-0.5 flex items-baseline gap-1 text-sm">
          <span className="font-semibold tabular-nums text-zinc-50">{usd(price)}</span>
          <span className="font-normal text-zinc-400">/ month</span>
        </p>
        <p className="mt-2 text-xs font-normal leading-relaxed text-zinc-400">
          {headroom >= 0
            ? `Covers ${fmt(plan.sendsIncluded)}/mo — leaves ${fmt(headroom)} sends of headroom at this estimate.`
            : `Our highest tier tops out at ${fmt(plan.sendsIncluded)}/mo — talk to sales for volume above that.`}
        </p>
      </div>
    </div>
  );
}
