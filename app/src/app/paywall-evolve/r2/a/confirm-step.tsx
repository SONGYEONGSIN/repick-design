"use client";

import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Pencil } from "lucide-react";
import {
  COMPARE_FIELDS,
  CURRENT_USAGE,
  FAQS,
  PLANS,
  cx,
  fmt,
  getPlan,
  planPrice,
  usd,
  type BillingPeriod,
  type PlanId,
} from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** Step 3 — confirmation. Carries the sizing decision forward (no re-deciding here) and closes
 * with a single clear CTA. Compare-all-plans and FAQ use native <details> — keyboard- and
 * screen-reader-operable disclosure with no custom ARIA needed, and both are genuinely optional
 * reading, unlike the recommendation itself which is already visible above the fold. */
export default function ConfirmStep({
  recommendedId,
  calendars,
  bookings,
  billing,
  onBack,
  onEditSizing,
}: {
  recommendedId: PlanId;
  calendars: number;
  bookings: number;
  billing: BillingPeriod;
  onBack: () => void;
  onEditSizing: () => void;
}) {
  const plan = getPlan(recommendedId);
  const current = getPlan(CURRENT_USAGE.planId);
  const price = planPrice(plan, billing);

  return (
    <div>
      <p className="text-sm font-normal text-amber-700">Step 3 of 3</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        Confirm your upgrade to {plan.name}.
      </h1>
      <p className="mt-2.5 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">
        Sized to {fmt(calendars)} staff {calendars === 1 ? "calendar" : "calendars"} and{" "}
        {fmt(bookings)} bookings a month, billed {billing}.
      </p>

      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-normal text-amber-800">Upgrading from {current.name}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">{plan.name}</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
                {usd(price)}
              </span>
              <span className="text-sm font-normal text-zinc-600">/ month</span>
            </div>
            <p className="mt-1 text-xs font-normal text-zinc-600 tabular-nums">
              {billing === "annual" ? `Billed ${usd(price * 12)} annually` : "Billed monthly, cancel anytime"}
            </p>
          </div>
          <button
            type="button"
            onClick={onEditSizing}
            className={cx(
              "flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:border-amber-400",
              FOCUS,
            )}
          >
            <Pencil className="h-3 w-3 flex-none" aria-hidden="true" />
            Edit sizing
          </button>
        </div>

        <ul role="list" className="mt-5 flex flex-col gap-2 border-t border-amber-200 pt-4">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm font-normal text-zinc-700">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-amber-700" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className={cx(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-800",
            FOCUS,
          )}
        >
          Upgrade to {plan.name} — {usd(price)}/mo
          <ArrowUpRight className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
      </div>

      {/* Compare-all-plans disclosure — interaction */}
      <details className="group mt-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <summary
          className={cx(
            "flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-zinc-900",
            FOCUS,
          )}
        >
          Compare all plans
          <ChevronDown className="h-4 w-4 flex-none text-zinc-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </summary>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] table-fixed border-collapse text-sm">
            <caption className="sr-only">Full plan comparison across Solo, Studio, and Scale</caption>
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
      </details>

      {/* FAQ disclosures — interaction */}
      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-medium text-zinc-900">Common questions</h2>
        <div className="mt-3 flex flex-col divide-y divide-zinc-100">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-3 first:pt-0 last:pb-0">
              <summary
                className={cx(
                  "flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-zinc-900",
                  FOCUS,
                )}
              >
                {item.q}
                <ChevronDown className="h-4 w-4 flex-none text-zinc-500 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <p className="mt-2 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className={cx(
            "flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300",
            FOCUS,
          )}
        >
          <ArrowLeft className="h-4 w-4 flex-none" aria-hidden="true" />
          Back to sizing
        </button>
      </div>
    </div>
  );
}
