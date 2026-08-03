import { ArrowRight, CalendarX2 } from "lucide-react";
import {
  AVG_BOOKING_VALUE,
  BLOCKED_BOOKINGS_COUNT,
  BLOCKED_REQUESTS,
  BLOCKED_WINDOW,
  CURRENT_USAGE,
  MISSED_VALUE,
  cx,
  fmt,
  usd,
} from "./data";
import UsageChart from "./usage-chart";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

/** Step 1 — persuasion. Concrete, at-rest evidence of why the account is blocked: a usage chart,
 * a dollar estimate of what the overflow cost, and the actual requests that were turned away. No
 * pricing decision happens here — that is deliberately left to step 2. */
export default function EvidenceStep({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <p className="text-sm font-normal text-amber-700">Solo plan · Bookings paused</p>
      <h1 className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        You&apos;ve used all {fmt(CURRENT_USAGE.bookingsLimit)} bookings on Solo this month.
      </h1>
      <p className="mt-2.5 max-w-prose text-sm font-normal leading-relaxed text-zinc-600">
        New booking requests stop reaching your calendar until the cycle resets in{" "}
        {CURRENT_USAGE.resetsIn}, or you upgrade — every confirmed appointment you already have
        stays exactly as booked.
      </p>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-medium text-zinc-900">Daily booking requests, last 14 days</h2>
        <div className="mt-4">
          <UsageChart />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-normal text-zinc-500">Estimated missed value</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            {usd(MISSED_VALUE)}
          </p>
          <p className="mt-1 text-xs font-normal text-zinc-600">
            {fmt(BLOCKED_BOOKINGS_COUNT)} declined requests over {BLOCKED_WINDOW} × your{" "}
            {usd(AVG_BOOKING_VALUE)} average booking value.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <p className="text-xs font-normal text-zinc-500">Declined requests</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            {fmt(BLOCKED_BOOKINGS_COUNT)}
          </p>
          <p className="mt-1 text-xs font-normal text-zinc-600">
            Clients who tried to book and were turned away, {BLOCKED_WINDOW}.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
        <h2 className="text-sm font-medium text-zinc-900">A few of the requests you lost</h2>
        <ul role="list" className="mt-3 flex flex-col divide-y divide-zinc-100">
          {BLOCKED_REQUESTS.map((r) => (
            <li key={r.client} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <CalendarX2 className="mt-0.5 h-4 w-4 flex-none text-amber-700" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900">
                  {r.client} <span className="font-normal text-zinc-500">— {r.service}</span>
                </p>
                <p className="mt-0.5 text-xs font-normal text-zinc-600">
                  Requested {r.requested} with {r.staff} · declined, calendar full
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onNext}
          className={cx(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-amber-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-amber-800 sm:w-auto",
            FOCUS,
          )}
        >
          See a plan sized to your bookings
          <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
