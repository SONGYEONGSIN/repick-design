"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";
import {
  SPEEDS,
  INSURANCE,
  deriveCombo,
  nearestByCost,
  cheapestCombo,
  formatUSD,
  type Speed,
  type Insurance,
} from "../lib/delivery";

interface DeliveryGridProps {
  speed: Speed;
  insurance: Insurance;
  onSelect: (speed: Speed, insurance: Insurance) => void;
}

/**
 * The assigned device: a flat 3×2 matrix. One click on any cell selects that exact
 * speed + insurance combination — not a two-step row-then-column flow. Everything below the
 * grid (the readout and the "next-best" strip) is derived from that one selection through
 * `deriveCombo` / `nearestByCost`, so it is never a second, independently-typed number.
 */
export default function DeliveryGrid({ speed, insurance, onSelect }: DeliveryGridProps) {
  const selected = deriveCombo(speed, insurance);
  const neighbors = nearestByCost(selected.key, 2);
  const cheapest = cheapestCombo();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-extrabold tracking-[-0.02em] text-zinc-100">
          Delivery Grid Pick
        </h2>
        <span className="text-[11px] text-zinc-400">6 combos · 1 click</span>
      </div>

      <div
        role="group"
        aria-label="Choose a shipping speed and insurance combination"
        className="mt-3 grid grid-cols-[3.25rem_1fr_1fr_1fr] gap-1.5 sm:grid-cols-[4.5rem_1fr_1fr_1fr]"
      >
        <div className="min-w-0" aria-hidden="true" />
        {SPEEDS.map((s) => (
          <div
            key={s.id}
            className="min-w-0 self-end text-center text-[10px] font-semibold uppercase tracking-wide text-zinc-400"
          >
            {s.shortLabel}
          </div>
        ))}

        {INSURANCE.map((ins) => (
          <Fragment key={ins.id}>
            <div className="min-w-0 flex items-center text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
              {ins.shortLabel}
            </div>
            {SPEEDS.map((s) => {
              const combo = deriveCombo(s.id, ins.id);
              const isSelected = combo.key === selected.key;
              return (
                <button
                  key={combo.key}
                  type="button"
                  onClick={() => onSelect(s.id, ins.id)}
                  aria-pressed={isSelected}
                  aria-label={`${s.label} speed, ${ins.label} insurance — total ${formatUSD(combo.totalCost)}, arrives ${combo.deliveryWindow}`}
                  className={`min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-lg border px-1 py-2.5 text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                    isSelected
                      ? "border-violet-500 bg-violet-600 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800"
                  }`}
                >
                  {isSelected ? (
                    <Check aria-hidden="true" className="h-3 w-3" />
                  ) : (
                    <span aria-hidden="true" className="h-3 w-3" />
                  )}
                  <span className="text-[11px] font-semibold tabular-nums">
                    {formatUSD(combo.totalCost)}
                  </span>
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2 border-t border-zinc-800 pt-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-zinc-400">Total for this order</p>
          <p className="text-2xl font-extrabold tracking-[-0.02em] tabular-nums text-white sm:text-3xl">
            {formatUSD(selected.totalCost)}
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[11px] uppercase tracking-wide text-zinc-400">Arrives</p>
          <p className="text-sm font-semibold text-zinc-100">{selected.deliveryWindow}</p>
        </div>
      </div>
      <p className="mt-1 text-[11px] text-zinc-400 tabular-nums">
        ${selected.itemPrice} item + ${selected.shippingCost.toFixed(2)} {selected.speedMeta.label.toLowerCase()} /{" "}
        {selected.insuranceMeta.label.toLowerCase()} shipping
      </p>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          Next-best by cost, from your pick
        </p>
        <ul role="list" className="mt-2 grid grid-cols-3 gap-1.5">
          <li className="min-w-0 rounded-lg border border-violet-500 bg-violet-600/15 px-2 py-2">
            <p className="truncate text-[10px] font-semibold text-violet-200">Your pick</p>
            <p className="truncate text-[11px] text-zinc-200">
              {selected.speedMeta.label} · {selected.insuranceMeta.label}
            </p>
            <p className="tabular-nums text-sm font-semibold text-white">{formatUSD(selected.totalCost)}</p>
          </li>
          {neighbors.map((n) => {
            const delta = n.totalCost - selected.totalCost;
            const sign = delta >= 0 ? "+" : "−";
            return (
              <li key={n.key} className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-2">
                <p className="truncate text-[10px] font-semibold text-zinc-400">Alternative</p>
                <p className="truncate text-[11px] text-zinc-300">
                  {n.speedMeta.label} · {n.insuranceMeta.label}
                </p>
                <p className="tabular-nums text-sm font-semibold text-zinc-100">
                  {formatUSD(n.totalCost)}{" "}
                  <span className="text-[11px] font-normal text-zinc-400">
                    ({sign}${Math.abs(delta).toFixed(2)})
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
        <p className="mt-2 text-[11px] text-zinc-400 tabular-nums">
          Cheapest overall: {cheapest.speedMeta.label} + {cheapest.insuranceMeta.label} — {formatUSD(cheapest.totalCost)}
        </p>
      </div>
    </div>
  );
}
