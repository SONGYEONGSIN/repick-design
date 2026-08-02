"use client";

import { useId, useMemo, useState } from "react";
import { ArrowRight, Check, ShieldCheck, Users } from "lucide-react";
import { cx, FOCUS, formatEvents, PLANS, usd, type BillingPeriod, type PlanId } from "./data";

/**
 * The subscribe rail — three of this route's interactions live here, all driving the same price:
 *
 * 1. Plan tabs (Pro / Team) swap the feature list and pricing basis.
 * 2. The billing toggle (Monthly / Annual) recomputes the displayed price and shows the flat "2
 *    months free" saving for whichever plan is active.
 * 3. The seat slider (Team only) recomputes both the price *and* the pooled event allowance live —
 *    two numbers changing off one control, not just a price ticking up.
 *
 * There is one price on screen at a time (derived, never duplicated), so the toggle/tab/slider can
 * never show a number that disagrees with the CTA below it.
 */
export default function PricingRail() {
  const [planId, setPlanId] = useState<PlanId>("team");
  const [period, setPeriod] = useState<BillingPeriod>("annual");
  const [seats, setSeats] = useState(PLANS.team.defaultSeats ?? 5);

  const tablistId = useId();
  const seatSliderId = useId();

  const plan = PLANS[planId];
  const seatCount = plan.seatBased ? seats : 1;

  const perUnit = period === "annual" ? plan.annual / 12 : plan.monthly;
  const monthlyTotal = perUnit * seatCount;
  const annualTotal = plan.annual * seatCount;
  const monthlySavings = (plan.monthly * 12 - plan.annual) * seatCount;

  const pooledEvents = useMemo(() => {
    if (!plan.seatBased) return plan.flatEvents ?? 0;
    return (plan.baseEvents ?? 0) + (plan.perSeatEvents ?? 0) * seats;
  }, [plan, seats]);

  return (
    <aside aria-labelledby="rail-heading" className="min-w-0">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6 lg:sticky lg:top-24">
        <h2 id="rail-heading" className="text-lg font-semibold text-zinc-50">
          Upgrade to keep shipping
        </h2>
        <p className="mt-1 text-sm font-normal text-zinc-400">
          Resumes ingestion immediately. Cancel anytime.
        </p>

        {/* Interaction 1 — plan selector */}
        <div
          role="tablist"
          aria-label="Plan"
          id={tablistId}
          className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-zinc-800 p-1"
        >
          {(Object.values(PLANS)).map((p) => (
            <button
              key={p.id}
              id={`tab-${p.id}`}
              type="button"
              role="tab"
              aria-selected={planId === p.id}
              aria-controls="plan-panel"
              onClick={() => setPlanId(p.id)}
              className={cx(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                planId === p.id ? "bg-zinc-950 font-semibold text-zinc-50" : "font-medium text-zinc-400 hover:text-zinc-200",
                FOCUS,
              )}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Interaction 2 — billing period */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-zinc-300">Billing</span>
          <div role="group" aria-label="Billing period" className="inline-flex rounded-lg border border-zinc-800 p-0.5">
            {(["monthly", "annual"] as BillingPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={period === p}
                onClick={() => setPeriod(p)}
                className={cx(
                  "rounded-md px-2.5 py-1 text-xs transition-colors",
                  period === p ? "bg-sky-500 font-semibold text-zinc-950" : "font-medium text-zinc-400 hover:text-zinc-200",
                  FOCUS,
                )}
              >
                {p === "monthly" ? "Monthly" : "Annual"}
              </button>
            ))}
          </div>
        </div>

        {/* Interaction 3 — seat slider (Team only) */}
        {plan.seatBased && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <label htmlFor={seatSliderId} className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                <Users className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Seats
              </label>
              <span className="tabular-nums text-sm font-semibold text-zinc-50">{seats}</span>
            </div>
            <input
              id={seatSliderId}
              type="range"
              min={plan.minSeats}
              max={plan.maxSeats}
              step={1}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className={cx(
                "mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-800 accent-sky-500",
                FOCUS,
              )}
              aria-valuetext={`${seats} seats`}
            />
            <div className="mt-1 flex justify-between text-[11px] font-normal text-zinc-400">
              <span className="tabular-nums">{plan.minSeats} seats</span>
              <span className="tabular-nums">{plan.maxSeats} seats</span>
            </div>
          </div>
        )}

        {/* Live price */}
        <div id="plan-panel" role="tabpanel" aria-labelledby={`tab-${planId}`} className="mt-5 border-t border-zinc-800 pt-5">
          <p className="flex items-baseline gap-1.5">
            <span className="tabular-nums text-4xl font-semibold text-zinc-50">{usd(monthlyTotal)}</span>
            <span className="text-sm font-normal text-zinc-400">
              / month{plan.seatBased ? `, ${seats} seats` : ""}
            </span>
          </p>
          {period === "annual" ? (
            <p className="mt-1 text-sm font-normal text-zinc-400">
              <span className="tabular-nums">{usd(annualTotal)}</span> billed yearly &middot; save{" "}
              <span className="tabular-nums font-medium text-emerald-400">{usd(monthlySavings)}</span>/yr
            </p>
          ) : (
            <p className="mt-1 text-sm font-normal text-zinc-400">
              Switch to annual for <span className="font-medium text-zinc-200">2 months free</span>
            </p>
          )}
          <p className="mt-2 text-sm font-normal text-zinc-400">
            <span className="tabular-nums font-medium text-zinc-200">{formatEvents(pooledEvents)}</span>{" "}
            events / month included{plan.seatBased ? ", pooled across seats" : ""}
          </p>
        </div>

        <button
          type="button"
          className={cx(
            "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-sky-400",
            FOCUS,
          )}
        >
          Upgrade to {plan.name}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <ul className="mt-5 space-y-2.5 text-sm">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 font-normal text-zinc-300">
              <Check className="mt-0.5 h-4 w-4 flex-none text-sky-400" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>

        <p className="mt-5 flex items-center gap-1.5 text-xs font-normal text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
          Secure checkout &middot; no setup fees &middot; cancel anytime
        </p>
      </div>
    </aside>
  );
}
