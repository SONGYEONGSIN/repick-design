"use client";

import { DollarSign, ShieldCheck, Zap } from "lucide-react";
import type { Weights } from "./scoring";
import { ACCENT_HEX, cx, FOCUS, INK, MUTED, NUM, TRACK_CAPTION } from "./tokens";

const AXES = [
  { key: "price" as const, label: "Price", icon: DollarSign },
  { key: "speed" as const, label: "Speed", icon: Zap },
  { key: "trust" as const, label: "Trust", icon: ShieldCheck },
];

export default function WeightControls({ weights, onChange }: { weights: Weights; onChange: (w: Weights) => void }) {
  return (
    <div
      className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-3"
      role="group"
      aria-label="Weight the order book by price, speed, and trust — the ranking below updates as you move these"
    >
      {AXES.map(({ key, label, icon: Icon }) => {
        const value = weights[key];
        return (
          <div key={key} className="min-w-0">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor={`weight-${key}`}
                className={cx("flex items-center gap-1.5 text-[11px] font-semibold uppercase", TRACK_CAPTION, MUTED)}
              >
                <Icon size={12} aria-hidden="true" />
                {label}
              </label>
              <span className={cx("text-xs font-semibold", NUM, INK)}>{value}</span>
            </div>
            <input
              id={`weight-${key}`}
              type="range"
              min={0}
              max={100}
              step={5}
              value={value}
              onChange={(e) => onChange({ ...weights, [key]: Number(e.target.value) })}
              className={cx("mt-2 h-2 w-full cursor-pointer", FOCUS)}
              style={{ accentColor: ACCENT_HEX }}
              aria-valuetext={`${label} weighted at ${value} out of 100`}
            />
          </div>
        );
      })}
    </div>
  );
}
