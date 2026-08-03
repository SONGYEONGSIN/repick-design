"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, Gauge, Mail, ScanSearch, Sparkles, Table2 } from "lucide-react";
import {
  BRAND,
  type BillingPeriod,
  CURRENT_USAGE,
  RECOMMENDED_PLAN_ID,
  TOTAL_QUEUED,
  VOLUME_SLIDER,
  WORKSPACE_LABEL,
  cx,
  fmt,
  FOCUS,
  getPlan,
  planPrice,
  usd,
} from "./data";
import SummaryBar from "./summary-bar";
import Disclosure from "./disclosure";
import BlockedEvidence from "./blocked-evidence";
import SizingCalculator from "./sizing-calculator";
import CompareTable from "./compare-table";

const BILLING_OPTIONS: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual — save 20%" },
];

function jumpTo(el: HTMLElement | null) {
  if (!el) return;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
}

export default function PaywallClient() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [volume, setVolume] = useState(VOLUME_SLIDER.default);
  const [openBlocked, setOpenBlocked] = useState(true);
  const [openSizing, setOpenSizing] = useState(false);
  const [openCompare, setOpenCompare] = useState(false);
  const billingName = useId();

  const sizingRef = useRef<HTMLDivElement>(null);
  const blockedRef = useRef<HTMLDivElement>(null);

  const currentPlan = getPlan(CURRENT_USAGE.planId);
  const recommendedPlan = getPlan(RECOMMENDED_PLAN_ID);
  const price = planPrice(recommendedPlan, billing);
  const delta = price - planPrice(currentPlan, billing);

  function goToSizing() {
    setOpenSizing(true);
    requestAnimationFrame(() => jumpTo(sizingRef.current));
  }

  function goToBlocked() {
    setOpenBlocked(true);
    requestAnimationFrame(() => jumpTo(blockedRef.current));
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <a
        href="#overview"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-blue-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-zinc-950 focus-visible:outline-none"
      >
        Skip to upgrade summary
      </a>

      {/* Persistent anchored bar — fixed, so it renders early and stays visible with zero scrolling. */}
      <SummaryBar currentPlan={currentPlan} recommendedPlan={recommendedPlan} billing={billing} onViewRecommended={goToSizing} />

      <header className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-4 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
              <Mail className="h-4.5 w-4.5 text-blue-400" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-zinc-50">{BRAND}</span>
          </span>
          <span className="ml-auto rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-normal text-zinc-400">
            {WORKSPACE_LABEL}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 pb-28 pt-10 sm:px-6 sm:pt-12">
        {/* ---------------------------------------------------------------- Overview */}
        <section id="overview" aria-label="Upgrade overview" className="scroll-mt-6">
          <p className="text-sm font-medium text-blue-400">
            {currentPlan.name} plan · Monthly email sends
          </p>
          <h1 className="mt-1.5 max-w-2xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            You&apos;ve sent all {fmt(CURRENT_USAGE.sendsLimit)} emails included this cycle.
          </h1>
          <p className="mt-3 max-w-prose text-sm font-normal leading-relaxed text-zinc-400">
            New sends are queued, not delivered — password resets, order receipts, and account alerts wait until
            your cycle resets in {CURRENT_USAGE.resetsIn} or you upgrade. {fmt(TOTAL_QUEUED)} emails are waiting
            right now.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3">
            <Sparkles className="h-4 w-4 flex-none text-blue-400" aria-hidden="true" />
            <p className="text-sm font-normal text-zinc-300">
              Recommended: <span className="font-semibold text-zinc-50">{recommendedPlan.name}</span>
              {" — "}
              <span className="font-semibold tabular-nums text-zinc-50">{usd(price)}</span>
              <span className="font-normal text-zinc-400">/mo</span>
              {" "}
              <span className="font-medium tabular-nums text-blue-400">(+{usd(delta)}/mo vs {currentPlan.name})</span>
            </p>
          </div>

          {/* Billing period toggle — interaction 1: recalculates price everywhere at once. */}
          <fieldset className="mt-5 w-fit border-0 p-0">
            <legend className="mb-2 text-xs font-medium text-zinc-400">Billing period</legend>
            <div className="grid grid-cols-2 gap-2">
              {BILLING_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={cx(
                    "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-zinc-950",
                    billing === opt.id
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700",
                  )}
                >
                  <input
                    type="radio"
                    name={billingName}
                    value={opt.id}
                    checked={billing === opt.id}
                    onChange={() => setBilling(opt.id)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={goToSizing}
              className={cx(
                "flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-blue-400",
                FOCUS,
              )}
            >
              Upgrade to {recommendedPlan.name} — {usd(price)}/mo
              <ArrowUpRight className="h-4 w-4 flex-none" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToBlocked}
              className={cx("flex items-center gap-1.5 rounded text-sm font-normal text-zinc-400 hover:text-zinc-200", FOCUS)}
            >
              <ScanSearch className="h-4 w-4 flex-none" aria-hidden="true" />
              See why you&apos;re blocked
            </button>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Independently expandable modules */}
        <div className="mt-12 flex flex-col gap-4">
          <div ref={blockedRef} className="scroll-mt-6">
            <Disclosure
              id="why-blocked"
              icon={Mail}
              title="Why you're blocked"
              peek={`${fmt(TOTAL_QUEUED)} queued · avg delay noted below`}
              open={openBlocked}
              onToggle={() => setOpenBlocked((v) => !v)}
            >
              <BlockedEvidence />
            </Disclosure>
          </div>

          <div ref={sizingRef} className="scroll-mt-6">
            <Disclosure
              id="right-size"
              icon={Gauge}
              title="Right-size your plan"
              peek={`Recommended: ${recommendedPlan.name} — ${usd(price)}/mo`}
              open={openSizing}
              onToggle={() => setOpenSizing((v) => !v)}
            >
              <SizingCalculator billing={billing} volume={volume} onVolumeChange={setVolume} />
            </Disclosure>
          </div>

          <Disclosure
            id="compare"
            icon={Table2}
            title="Compare all plans"
            peek="Starter · Growth · Scale"
            open={openCompare}
            onToggle={() => setOpenCompare((v) => !v)}
          >
            <CompareTable billing={billing} />
          </Disclosure>
        </div>
      </main>

      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-[1180px] px-4 pt-8 pb-28 text-xs font-normal text-zinc-400 sm:px-6">
          {BRAND}, Inc. — send counts reset on your billing date. Prices shown in USD.
        </div>
      </footer>
    </div>
  );
}
