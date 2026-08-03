"use client";

import { useMemo, useState } from "react";
import { Waves } from "lucide-react";
import {
  ACCOUNT_LABEL,
  BRAND,
  EVENTS_SLIDER,
  RETENTION_DEFAULT,
  SEATS_RANGE,
  planPrice,
  recommendPlan,
  type BillingPeriod,
} from "./data";
import PersuasionPane from "./persuasion-pane";
import SizingPane from "./sizing-pane";

/** Simultaneous split-screen hard paywall: two permanently visible, equal-weight panes rather than
 * sequential sections. Left = persuasion (why the account is blocked, at rest). Right = sizing (a
 * live calculator fitting plan + price to real usage). Calculator state lives here so the plan
 * mentioned in the left pane and the card in the right pane are always reading the same numbers. */
export default function PaywallClient() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [events, setEvents] = useState(EVENTS_SLIDER.default);
  const [seats, setSeats] = useState(SEATS_RANGE.default);
  const [retentionDays, setRetentionDays] = useState(RETENTION_DEFAULT);

  const plan = useMemo(() => recommendPlan(events, retentionDays), [events, retentionDays]);
  const price = useMemo(() => planPrice(plan, events, seats, billing), [plan, events, seats, billing]);

  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <a
        href="#plan"
        className={cxSkip}
      >
        Skip to plan selector
      </a>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
              <Waves className="h-4.5 w-4.5 text-teal-700" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">{BRAND}</span>
          </span>
          <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-normal text-slate-600">
            {ACCOUNT_LABEL}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <PersuasionPane recommendedPlan={plan} recommendedPrice={price} billing={billing} />
          <SizingPane
            billing={billing}
            onBilling={setBilling}
            events={events}
            onEvents={setEvents}
            seats={seats}
            onSeats={setSeats}
            retentionDays={retentionDays}
            onRetention={setRetentionDays}
            plan={plan}
            price={price}
          />
        </div>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-[1180px] px-4 py-8 text-xs font-normal text-slate-500 sm:px-6">
          {BRAND}, Inc. — event counts reset on your billing date. Prices shown in USD.
        </div>
      </footer>
    </div>
  );
}

const cxSkip =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-teal-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none";
