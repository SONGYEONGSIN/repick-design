"use client";

import { useId, useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { PLAN, savingsPercent } from "./data";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type Billing = "monthly" | "annual";

const stepperBtnClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-50 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

function billingBtnClass(active: boolean) {
  return [
    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
    active ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:text-zinc-200",
  ].join(" ");
}

// Sticky, always-visible upgrade panel: this is the page's core value block per the brief
// (what you get / price / primary CTA), so it renders fully at rest — nothing here waits on
// scroll or a prior click. The billing toggle and seat control both feed the same live price
// engine below; two distinct controls, one deterministic computation, no Math.random/Date.now.
export default function PricePanel() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [seats, setSeats] = useState<number>(PLAN.seatDefault);
  const seatFieldId = useId();

  const perSeat = billing === "annual" ? PLAN.annualPerSeatMonthly : PLAN.monthlyPerSeat;
  const totalPerCycle = billing === "annual" ? perSeat * 12 * seats : perSeat * seats;
  const cycleLabel = billing === "annual" ? "/ year" : "/ month";
  const annualSavings = (PLAN.monthlyPerSeat - PLAN.annualPerSeatMonthly) * 12 * seats;

  const clampSeats = (next: number) => {
    setSeats(Math.min(PLAN.seatMax, Math.max(PLAN.seatMin, next)));
  };

  return (
    <div
      id="upgrade"
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xs font-medium tracking-[0.14em] text-amber-400 uppercase">
          {PLAN.name}
        </h2>
        {billing === "annual" && (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-xs font-medium text-amber-300 tabular-nums">
            Save {savingsPercent}%
          </span>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span
          className="text-4xl font-semibold text-zinc-50 tabular-nums"
          style={{ fontFamily: "var(--font-display-wide)" }}
        >
          {currency.format(perSeat)}
        </span>
        <span className="text-sm font-normal text-zinc-400">/ seat / mo</span>
      </div>

      <div
        role="group"
        aria-label="Billing period"
        className="mt-4 grid grid-cols-2 gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-1"
      >
        <button
          type="button"
          aria-pressed={billing === "monthly"}
          onClick={() => setBilling("monthly")}
          className={billingBtnClass(billing === "monthly")}
        >
          Monthly
        </button>
        <button
          type="button"
          aria-pressed={billing === "annual"}
          onClick={() => setBilling("annual")}
          className={billingBtnClass(billing === "annual")}
        >
          Annual
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label htmlFor={seatFieldId} className="text-sm font-medium text-zinc-200">
            Seats
          </label>
          <span className="text-sm font-medium text-zinc-50 tabular-nums">{seats}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => clampSeats(seats - 1)}
            disabled={seats <= PLAN.seatMin}
            aria-label="Remove one seat"
            className={stepperBtnClass}
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <input
            id={seatFieldId}
            type="range"
            min={PLAN.seatMin}
            max={PLAN.seatMax}
            step={1}
            value={seats}
            onChange={(e) => clampSeats(Number(e.target.value))}
            aria-valuetext={`${seats} seat${seats === 1 ? "" : "s"}`}
            className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800 accent-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          />
          <button
            type="button"
            onClick={() => clampSeats(seats + 1)}
            disabled={seats >= PLAN.seatMax}
            aria-label="Add one seat"
            className={stepperBtnClass}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-zinc-800 pt-4">
        <span className="text-sm font-normal text-zinc-400">
          Total for {seats} seat{seats === 1 ? "" : "s"}
        </span>
        <span className="text-lg font-semibold text-zinc-50 tabular-nums">
          {currency.format(totalPerCycle)}
          <span className="ml-1 text-sm font-normal text-zinc-400">{cycleLabel}</span>
        </span>
      </div>
      {billing === "annual" && (
        <p className="mt-1 text-right text-xs font-normal text-zinc-400 tabular-nums">
          You save {currency.format(annualSavings)} this year
        </p>
      )}

      <button
        type="button"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-medium text-zinc-950 tabular-nums transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
      >
        <span className="min-w-0 text-center">
          Upgrade to Pro — {currency.format(totalPerCycle)}
          {cycleLabel}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>

      <a
        href="#whats-included"
        className="mt-3 block text-center text-xs font-medium text-zinc-400 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-zinc-200 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        See everything included
      </a>

      <p className="mt-4 text-center text-xs font-normal text-zinc-400">
        Cancel anytime. Seats prorate automatically.
      </p>
    </div>
  );
}
