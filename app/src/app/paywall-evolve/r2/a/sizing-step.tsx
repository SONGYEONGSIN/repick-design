"use client";

import { useId } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus } from "lucide-react";
import {
  BOOKING_SLIDER,
  CALENDAR_SLIDER,
  COMPARE_FIELDS,
  PLANS,
  cx,
  fmt,
  getPlan,
  planPrice,
  recommendPlanId,
  usd,
  type BillingPeriod,
} from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const BILLING_OPTIONS: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual — save 2 months" },
];

/** Step 2 — sizing. A genuinely separate interaction state from step 1: no persuasion copy here,
 * just two inputs (calendars, expected bookings) that recompute the recommended tier, its price,
 * and its headroom live, plus a full comparison of the three tiers so the recommendation is never
 * the only number on screen. */
export default function SizingStep({
  calendars,
  bookings,
  billing,
  onCalendarsChange,
  onBookingsChange,
  onBillingChange,
  onNext,
  onBack,
}: {
  calendars: number;
  bookings: number;
  billing: BillingPeriod;
  onCalendarsChange: (n: number) => void;
  onBookingsChange: (n: number) => void;
  onBillingChange: (b: BillingPeriod) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const billingName = useId();
  const recommendedId = recommendPlanId(calendars, bookings);
  const recommended = getPlan(recommendedId);
  const price = planPrice(recommended, billing);
  const headroom = recommended.bookingsIncluded - bookings;
  const pctOfRange = Math.round(
    ((bookings - BOOKING_SLIDER.min) / (BOOKING_SLIDER.max - BOOKING_SLIDER.min)) * 10000,
  ) / 100;

  return (
    <div>
      <p className="text-sm font-normal text-amber-700">Step 2 of 3</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Find a plan sized to your bookings.
      </h1>
      <p className="mt-2.5 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">
        Set your staff calendars and expected monthly bookings — the recommendation and price
        below update as you move them.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Calendars stepper — interaction */}
          <div>
            <label htmlFor="calendars-input" className="text-sm font-medium text-zinc-900">
              Staff calendars
            </label>
            <p className="mt-1 text-xs font-normal text-zinc-500">
              Staff members or resources clients can book independently.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onCalendarsChange(Math.max(CALENDAR_SLIDER.min, calendars - 1))}
                disabled={calendars <= CALENDAR_SLIDER.min}
                aria-label="Decrease staff calendars"
                className={cx(
                  "flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-40",
                  FOCUS,
                )}
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </button>
              <input
                id="calendars-input"
                type="number"
                inputMode="numeric"
                min={CALENDAR_SLIDER.min}
                max={CALENDAR_SLIDER.max}
                value={calendars}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (!Number.isNaN(n)) {
                    onCalendarsChange(Math.min(CALENDAR_SLIDER.max, Math.max(CALENDAR_SLIDER.min, n)));
                  }
                }}
                className={cx(
                  "h-9 w-20 rounded-lg border border-zinc-200 text-center text-sm font-medium text-zinc-900 tabular-nums",
                  FOCUS,
                )}
              />
              <button
                type="button"
                onClick={() => onCalendarsChange(Math.min(CALENDAR_SLIDER.max, calendars + 1))}
                disabled={calendars >= CALENDAR_SLIDER.max}
                aria-label="Increase staff calendars"
                className={cx(
                  "flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition-colors hover:border-zinc-300 disabled:cursor-not-allowed disabled:opacity-40",
                  FOCUS,
                )}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="text-xs font-normal text-zinc-500">of {CALENDAR_SLIDER.max} max</span>
            </div>
          </div>

          {/* Bookings slider — interaction */}
          <div>
            <label htmlFor="bookings-input" className="text-sm font-medium text-zinc-900">
              Expected bookings / month
            </label>
            <p className="mt-1 text-xs font-normal text-zinc-500">
              Your best guess is enough — you can revisit this anytime.
            </p>
            <input
              id="bookings-input"
              type="range"
              min={BOOKING_SLIDER.min}
              max={BOOKING_SLIDER.max}
              step={BOOKING_SLIDER.step}
              value={bookings}
              onChange={(e) => onBookingsChange(Number(e.target.value))}
              aria-valuetext={`${fmt(bookings)} bookings per month`}
              className={cx(
                "mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-amber-700",
                FOCUS,
              )}
              style={{ background: `linear-gradient(to right, #B45309 ${pctOfRange}%, #e4e4e7 ${pctOfRange}%)` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs font-normal text-zinc-500 tabular-nums">
              <span>{fmt(BOOKING_SLIDER.min)}</span>
              <span className="text-base font-medium text-zinc-900">{fmt(bookings)} / mo</span>
              <span>{fmt(BOOKING_SLIDER.max)}+</span>
            </div>
          </div>
        </div>

        {/* Billing toggle — interaction */}
        <fieldset className="mt-6 border-0 p-0">
          <legend className="text-sm font-medium text-zinc-900">Billing period</legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:w-80">
            {BILLING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={cx(
                  "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-amber-700 has-[:focus-visible]:ring-offset-2",
                  billing === opt.id
                    ? "border-amber-700 bg-amber-50 text-amber-800"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300",
                )}
              >
                <input
                  type="radio"
                  name={billingName}
                  value={opt.id}
                  checked={billing === opt.id}
                  onChange={() => onBillingChange(opt.id)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Live recommendation — visible at rest */}
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4" aria-live="polite">
          <p className="text-xs font-normal text-amber-800">Recommended plan</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="text-2xl font-semibold tracking-tight text-zinc-900">{recommended.name}</span>
            <span className="text-lg font-medium text-amber-800 tabular-nums">{usd(price)} / mo</span>
          </div>
          <p className="mt-1 text-xs font-normal text-zinc-600 tabular-nums">
            {headroom >= 0
              ? `${fmt(headroom)} bookings of headroom left in this tier at ${fmt(bookings)}/mo`
              : `${fmt(Math.abs(headroom))} bookings over this tier's limit`}
          </p>
        </div>
      </div>

      {/* Always-visible three-tier comparison, recommended column marked */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[520px] table-fixed border-collapse text-sm">
          <caption className="sr-only">Plan comparison across Solo, Studio, and Scale</caption>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="w-[28%] px-4 py-3 text-left text-xs font-medium text-zinc-500">
                Plan
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className={cx(
                    "px-4 py-3 text-left text-xs font-medium",
                    p.id === recommendedId ? "bg-amber-50 text-amber-800" : "text-zinc-500",
                  )}
                >
                  {p.name}
                  {p.id === recommendedId && <span className="ml-1.5 font-normal">— recommended</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_FIELDS.map((field) => (
              <tr key={field.key} className="border-b border-zinc-100 last:border-0">
                <th scope="row" className="px-4 py-3 text-left text-xs font-normal text-zinc-600">
                  {field.label}
                </th>
                {PLANS.map((p) => (
                  <td
                    key={p.id}
                    className={cx(
                      "px-4 py-3 text-xs font-normal text-zinc-900 tabular-nums",
                      p.id === recommendedId && "bg-amber-50/60",
                    )}
                  >
                    {field.get(p, billing)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          className={cx(
            "flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300",
            FOCUS,
          )}
        >
          <ArrowLeft className="h-4 w-4 flex-none" aria-hidden="true" />
          Back to evidence
        </button>
        <button
          type="button"
          onClick={onNext}
          className={cx(
            "flex items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-800",
            FOCUS,
          )}
        >
          Continue to confirm — {usd(price)}/mo
          <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
