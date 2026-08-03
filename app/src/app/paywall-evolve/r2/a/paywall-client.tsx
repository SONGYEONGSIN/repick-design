"use client";

import { useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import {
  ACCOUNT_LABEL,
  BOOKING_SLIDER,
  BRAND,
  CALENDAR_SLIDER,
  CURRENT_USAGE,
  getPlan,
  planPrice,
  recommendPlanId,
  type BillingPeriod,
} from "./data";
import StepNav, { STEPS } from "./step-nav";
import EvidenceStep from "./evidence-step";
import SizingStep from "./sizing-step";
import ConfirmStep from "./confirm-step";
import SummaryRail from "./summary-rail";

/** Orchestrates the three-step interrupt flow. Unlike a single scrolling page with anchored
 * sections, only one step's content is ever mounted at a time — moving between "evidence" and
 * "size it" is a real state transition (the DOM for the other steps doesn't exist), not a scroll
 * position. The plan/price summary rail stays mounted across every step so the number the
 * calculator lands on is never gated behind reaching the last screen. */
export default function PaywallClient() {
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [calendars, setCalendars] = useState(CALENDAR_SLIDER.default);
  const [bookings, setBookings] = useState(BOOKING_SLIDER.default);
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  const recommendedId = recommendPlanId(calendars, bookings);
  const recommended = getPlan(recommendedId);
  const price = planPrice(recommended, billing);
  const headroom = recommended.bookingsIncluded - bookings;

  function goStep(i: number) {
    if (i <= maxReached) setStep(i);
  }
  function next() {
    setStep((s) => {
      const n = Math.min(s + 1, STEPS.length - 1);
      setMaxReached((m) => Math.max(m, n));
      return n;
    });
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#step-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-amber-700 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white focus-visible:outline-none"
      >
        Skip to step content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
              <CalendarCheck2 className="h-4.5 w-4.5 text-amber-700" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-900">{BRAND}</span>
          </span>
          <span className="ml-auto rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-normal text-zinc-600">
            {ACCOUNT_LABEL}
          </span>
        </div>
        <StepNav step={step} maxReached={maxReached} onGoStep={goStep} />
      </header>

      <main id="step-content" className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_336px] lg:items-start">
          <div key={step} className="min-w-0 animate-[rise_0.3s_ease-out_backwards] motion-reduce:animate-none">
            {step === 0 && <EvidenceStep onNext={next} />}
            {step === 1 && (
              <SizingStep
                calendars={calendars}
                bookings={bookings}
                billing={billing}
                onCalendarsChange={setCalendars}
                onBookingsChange={setBookings}
                onBillingChange={setBilling}
                onNext={next}
                onBack={back}
              />
            )}
            {step === 2 && (
              <ConfirmStep
                recommendedId={recommendedId}
                calendars={calendars}
                bookings={bookings}
                billing={billing}
                onBack={back}
                onEditSizing={() => goStep(1)}
              />
            )}
          </div>

          <div className="order-first lg:order-last">
            <SummaryRail recommendedId={recommendedId} price={price} billing={billing} headroom={headroom} />
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200">
        <div className="mx-auto max-w-[1180px] px-4 py-8 text-xs font-normal text-zinc-500 sm:px-6">
          {BRAND}, Inc. — booking counts reset on your billing date. Current usage:{" "}
          {CURRENT_USAGE.bookingsUsed}/{CURRENT_USAGE.bookingsLimit} on {getPlan(CURRENT_USAGE.planId).name}.
          Prices shown in USD.
        </div>
      </footer>
    </div>
  );
}
