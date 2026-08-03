"use client";

import { useId } from "react";
import { ArrowUpRight, ChevronDown, Minus, Plus, Sparkles } from "lucide-react";
import {
  EVENTS_SLIDER,
  FAQS,
  RETENTION_OPTIONS,
  SEATS_RANGE,
  cx,
  fmt,
  planFeatures,
  usd,
  type BillingPeriod,
  type PlanTier,
} from "./data";

const BILLING_OPTIONS: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual — save 20%" },
];

const FOCUS_TEAL =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

interface SizingPaneProps {
  billing: BillingPeriod;
  onBilling: (b: BillingPeriod) => void;
  events: number;
  onEvents: (n: number) => void;
  seats: number;
  onSeats: (n: number) => void;
  retentionDays: number;
  onRetention: (d: number) => void;
  plan: PlanTier;
  price: number;
}

/** Right pane — sizing. A live calculator that fits the recommended plan and price to the
 * reader's own inputs; every control shares the same three pieces of state, so the "Recommended
 * for your usage" card above re-derives itself the instant any control moves. */
export default function SizingPane({
  billing,
  onBilling,
  events,
  onEvents,
  seats,
  onSeats,
  retentionDays,
  onRetention,
  plan,
  price,
}: SizingPaneProps) {
  const billingName = useId();
  const eventsId = useId();
  const pct = ((events - EVENTS_SLIDER.min) / (EVENTS_SLIDER.max - EVENTS_SLIDER.min)) * 100;

  const headroom = plan.includedEvents - events;
  const headroomText =
    headroom >= 0
      ? `Includes ${fmt(plan.includedEvents)} events — ${(plan.includedEvents / Math.max(events, 1)).toFixed(1)}× your selected volume.`
      : `Includes ${fmt(plan.includedEvents)} events, plus ${fmt(Math.abs(headroom))} more billed at overage pricing.`;

  return (
    <aside aria-labelledby="plan-heading" id="plan" className="min-w-0 border-t border-slate-200 bg-slate-50 px-5 py-8 sm:px-8 sm:py-10 lg:border-t-0 lg:border-l lg:py-12">
      <h2 id="plan-heading" className="text-lg font-semibold tracking-tight text-slate-900">
        Find your plan
      </h2>
      <p className="mt-1 max-w-prose text-sm font-normal text-slate-600">
        Adjust these to your real usage — the recommended plan and price recalculate as you go.
      </p>

      {/* Always-visible recommended plan + price — the calculator's single source of truth */}
      <div className="mt-5 rounded-2xl border border-teal-600/30 bg-white p-5 sm:p-6" aria-live="polite">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
          <Sparkles className="h-3 w-3 flex-none" aria-hidden="true" />
          Recommended for your usage
        </span>

        <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900">{plan.name}</p>

        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-4xl font-semibold tracking-tight text-slate-900 tabular-nums">{usd(price)}</span>
          <span className="text-sm font-normal text-slate-600">/ month</span>
        </div>
        <p className="mt-1 text-xs font-normal text-slate-500 tabular-nums">
          {billing === "annual" ? `Billed ${usd(price * 12)} annually` : "Billed monthly, cancel anytime"}
        </p>

        {/* Interaction 1: billing period */}
        <fieldset className="mt-4 border-0 p-0">
          <legend className="sr-only">Billing period</legend>
          <div className="grid grid-cols-2 gap-2">
            {BILLING_OPTIONS.map((opt) => (
              <label
                key={opt.id}
                className={cx(
                  "flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 has-[:focus-visible]:ring-offset-2",
                  billing === opt.id ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name={billingName}
                  value={opt.id}
                  checked={billing === opt.id}
                  onChange={() => onBilling(opt.id)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <ul role="list" className="mt-5 flex flex-col gap-2">
          {planFeatures(plan.id).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm font-normal text-slate-700">
              <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-teal-600" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={cx(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800",
            FOCUS_TEAL,
          )}
        >
          Upgrade to {plan.name} — {usd(price)}/mo
          <ArrowUpRight className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
      </div>

      {/* Calculator controls */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">Size it to your usage</h3>

        {/* Interaction 2: events volume slider */}
        <div className="mt-4">
          <label htmlFor={eventsId} className="text-sm font-medium text-slate-800">
            Monthly tracked events
          </label>
          <input
            id={eventsId}
            type="range"
            min={EVENTS_SLIDER.min}
            max={EVENTS_SLIDER.max}
            step={EVENTS_SLIDER.step}
            value={events}
            onChange={(e) => onEvents(Number(e.target.value))}
            className={cx("mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-teal-600", FOCUS_TEAL)}
            style={{ background: `linear-gradient(to right, #0f766e ${pct}%, #e2e8f0 ${pct}%)` }}
            aria-valuetext={`${fmt(events)} events per month`}
          />
          <div className="mt-2 flex items-center justify-between text-xs font-normal text-slate-500 tabular-nums">
            <span>{fmt(EVENTS_SLIDER.min)}</span>
            <span className="text-sm font-medium text-slate-900">{fmt(events)} / mo</span>
            <span>{fmt(EVENTS_SLIDER.max)}+</span>
          </div>
        </div>

        {/* Interaction 3: seats stepper */}
        <div className="mt-5">
          <span id={`${eventsId}-seats-label`} className="text-sm font-medium text-slate-800">
            Team seats
          </span>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease team seats"
              onClick={() => onSeats(Math.max(SEATS_RANGE.min, seats - 1))}
              disabled={seats <= SEATS_RANGE.min}
              className={cx(
                "flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40",
                FOCUS_TEAL,
              )}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span aria-labelledby={`${eventsId}-seats-label`} className="w-10 text-center text-sm font-medium tabular-nums text-slate-900">
              {seats}
            </span>
            <button
              type="button"
              aria-label="Increase team seats"
              onClick={() => onSeats(Math.min(SEATS_RANGE.max, seats + 1))}
              disabled={seats >= SEATS_RANGE.max}
              className={cx(
                "flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-40",
                FOCUS_TEAL,
              )}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-xs font-normal text-slate-500">
              {plan.includedSeats} included on {plan.name}
            </span>
          </div>
        </div>

        {/* Interaction 4: session replay retention */}
        <fieldset className="mt-5 border-0 p-0">
          <legend className="text-sm font-medium text-slate-800">Session replay retention</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {RETENTION_OPTIONS.map((opt) => (
              <label
                key={opt.days}
                className={cx(
                  "flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 has-[:focus-visible]:ring-offset-2",
                  retentionDays === opt.days ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <input
                  type="radio"
                  name={`${eventsId}-retention`}
                  value={opt.days}
                  checked={retentionDays === opt.days}
                  onChange={() => onRetention(opt.days)}
                  className="sr-only"
                />
                <span className={cx("text-xs font-medium", retentionDays === opt.days ? "text-teal-700" : "text-slate-700")}>{opt.label}</span>
                <span className="text-[11px] font-normal text-slate-500">{opt.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-4 text-xs font-normal text-slate-600 tabular-nums">{headroomText}</p>
      </div>

      {/* Compact FAQ */}
      <div className="mt-9">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">Common questions</h3>
        <div className="mt-3 flex flex-col gap-2">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-lg border border-slate-200 bg-white px-4 py-3">
              <summary className={cx("flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-slate-800", FOCUS_TEAL, "rounded")}>
                {f.q}
                <ChevronDown className="h-4 w-4 flex-none text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-2 text-sm font-normal leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </aside>
  );
}
