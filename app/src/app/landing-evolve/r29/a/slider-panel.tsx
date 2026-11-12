"use client";

import { ShieldCheck, Truck, Wallet, type LucideIcon } from "lucide-react";
import { AXES, type AxisId, type Weights } from "./data";
import { ACCENT, FOCUS_RING } from "./tokens";

const AXIS_ICON: Record<AxisId, LucideIcon> = {
  price: Wallet,
  speed: Truck,
  trust: ShieldCheck,
};

const THUMB =
  "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none " +
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0F766E] " +
  "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm " +
  "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0F766E] [&::-moz-range-thumb]:bg-white " +
  "[&::-moz-range-thumb]:shadow-sm";

export default function SliderPanel({
  weights,
  onChange,
  variant = "compact",
  idPrefix,
}: {
  weights: Weights;
  onChange: (id: AxisId, value: number) => void;
  variant?: "compact" | "full";
  /** Disambiguates <label htmlFor> ids when this panel is rendered twice on
   *  one page (compact copy in the hero, full copy in the mechanism
   *  section) — both control the SAME lifted state, they just render at
   *  two sizes. */
  idPrefix: string;
}) {
  return (
    <div
      className={
        variant === "full"
          ? "grid grid-cols-1 gap-8 sm:grid-cols-3"
          : "grid grid-cols-1 gap-5 sm:grid-cols-3"
      }
    >
      {AXES.map((axis) => {
        const Icon = AXIS_ICON[axis.id];
        const value = weights[axis.id];
        const inputId = `${idPrefix}-${axis.id}`;
        return (
          <div key={axis.id} className="min-w-0">
            <label htmlFor={inputId} className="flex items-center justify-between gap-2">
              <span className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-zinc-100">
                <Icon className="h-4 w-4 flex-none" aria-hidden="true" style={{ color: ACCENT }} strokeWidth={2} />
                <span className="truncate">{axis.label}</span>
              </span>
              <span className="flex-none tabular-nums text-sm font-semibold text-zinc-400">{value}%</span>
            </label>
            {variant === "full" && (
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{axis.description}</p>
            )}
            <input
              id={inputId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={value}
              onChange={(event) => onChange(axis.id, Number(event.target.value))}
              aria-valuetext={`${value} out of 100`}
              className={`mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#27272A] ${THUMB} ${FOCUS_RING}`}
              style={{
                background: `linear-gradient(to right, #14B8A6 0%, #14B8A6 ${value}%, #27272A ${value}%, #27272A 100%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
