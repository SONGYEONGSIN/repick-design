import { Sparkles } from "lucide-react";
import { CURRENT_USAGE, fmt, getPlan, usd, type BillingPeriod, type PlanId } from "./data";

/** Persistent plan/price readout — mounted alongside every step, not only the confirm step, so the
 * number the calculator lands on is visible at rest the moment it changes rather than gated behind
 * reaching the last screen. */
export default function SummaryRail({
  recommendedId,
  price,
  billing,
  headroom,
}: {
  recommendedId: PlanId;
  price: number;
  billing: BillingPeriod;
  headroom: number;
}) {
  const current = getPlan(CURRENT_USAGE.planId);
  const recommended = getPlan(recommendedId);
  const changed = recommendedId !== CURRENT_USAGE.planId;

  return (
    <aside aria-label="Plan summary" className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <p className="text-xs font-normal text-zinc-500">Current plan</p>
        <div className="mt-1 flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-zinc-900">{current.name}</span>
          <span className="text-xs font-normal text-zinc-500 tabular-nums">
            {fmt(CURRENT_USAGE.bookingsUsed)} / {fmt(CURRENT_USAGE.bookingsLimit)} used
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full w-full rounded-full bg-zinc-900" />
        </div>

        <div className="mt-5 border-t border-zinc-200 pt-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
            <Sparkles className="h-3 w-3 flex-none" aria-hidden="true" />
            Recommended for your usage
          </span>
          <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-900">{recommended.name}</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">{usd(price)}</span>
            <span className="text-sm font-normal text-zinc-500">/ month</span>
          </div>
          <p className="mt-1 text-xs font-normal text-zinc-500 tabular-nums">
            {billing === "annual" ? `Billed ${usd(price * 12)} annually` : "Billed monthly, cancel anytime"}
          </p>
          <p className="mt-3 text-xs font-normal text-zinc-600 tabular-nums">
            {headroom >= 0
              ? `${fmt(headroom)} bookings of headroom left in this tier`
              : `${fmt(Math.abs(headroom))} bookings over this tier's limit`}
          </p>
          {changed && (
            <p className="mt-2 text-xs font-normal text-zinc-500">
              Up from {current.name} at {usd(current.monthlyPrice)}/mo.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
