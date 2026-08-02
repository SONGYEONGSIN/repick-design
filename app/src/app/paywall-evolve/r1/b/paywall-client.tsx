"use client";

import { useId, useState } from "react";
import { ArrowUpRight, Check, Sparkles, Workflow } from "lucide-react";
import {
  ACCOUNT_LABEL,
  BRAND,
  type BillingPeriod,
  RECOMMENDED_PLAN_ID,
  TEAM_FEATURES,
  cx,
  FOCUS,
  getPlan,
  planPrice,
  usd,
} from "./data";
import WorkflowLockCard from "./workflow-lock-card";
import WorkloadEstimator from "./workload-estimator";
import CompareDrawer from "./compare-drawer";
import Faq from "./faq";
import Testimonials from "./testimonials";

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" };

const BILLING_OPTIONS: { id: BillingPeriod; label: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "annual", label: "Annual — save 20%" },
];

export default function PaywallClient() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const billingName = useId();
  const plan = getPlan(RECOMMENDED_PLAN_ID);
  const price = planPrice(plan, billing);

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <a
        href="#upgrade"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-green-500 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-zinc-950 focus-visible:outline-none"
      >
        Skip to upgrade options
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
              <Workflow className="h-4.5 w-4.5 text-green-400" aria-hidden="true" />
            </span>
            <span style={DISPLAY_FONT} className="text-base font-semibold tracking-tight text-zinc-50">
              {BRAND}
            </span>
          </span>
          <span className="ml-auto rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-normal text-zinc-400">
            {ACCOUNT_LABEL}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 sm:py-12">
        {/* ---------------------------------------------------------------- Hero / upgrade */}
        <section id="upgrade" aria-label="Upgrade" className="scroll-mt-20">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
            {/* Left: what happened + what's blocked */}
            <div className="min-w-0">
              <p className="text-sm font-normal text-green-400">Starter plan · Automation runs</p>
              <h1 style={DISPLAY_FONT} className="mt-1.5 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                You&apos;ve used all 10,000 runs on Starter.
              </h1>
              <p className="mt-2.5 max-w-prose text-sm font-normal leading-relaxed text-zinc-400">
                New automation runs are paused until your cycle resets or you upgrade — nothing you&apos;ve
                already built is lost.
              </p>

              <div className="mt-5">
                <WorkflowLockCard />
              </div>
            </div>

            {/* Right: the single recommended plan */}
            <div className="min-w-0 rounded-2xl border border-green-500/30 bg-zinc-900/60 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-400">
                  <Sparkles className="h-3 w-3 flex-none" aria-hidden="true" />
                  Recommended for your usage
                </span>
              </div>

              <p className="mt-3 text-xl font-semibold tracking-tight text-zinc-50">{plan.name}</p>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-zinc-50 tabular-nums">{usd(price)}</span>
                <span className="text-sm font-normal text-zinc-400">/ month</span>
              </div>
              <p className="mt-1 text-xs font-normal text-zinc-400 tabular-nums">
                {billing === "annual" ? `Billed ${usd(price * 12)} annually` : "Billed monthly, cancel anytime"}
              </p>

              {/* Billing period toggle — interaction 1 */}
              <fieldset className="mt-4 border-0 p-0">
                <legend className="sr-only">Billing period</legend>
                <div className="grid grid-cols-2 gap-2">
                  {BILLING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={cx(
                        "flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-zinc-900",
                        billing === opt.id ? "border-green-500 bg-green-500/10 text-green-400" : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700",
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

              <ul role="list" className="mt-5 flex flex-col gap-2">
                {TEAM_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm font-normal text-zinc-300">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-green-400" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={cx(
                  "mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-medium text-zinc-950 transition-colors hover:bg-green-400",
                  FOCUS,
                )}
              >
                Upgrade to {plan.name} — {usd(price)}/mo
                <ArrowUpRight className="h-4 w-4 flex-none" aria-hidden="true" />
              </button>
              <a href="#compare" className={cx("mt-3 flex items-center justify-center gap-1 rounded text-xs font-normal text-zinc-400 hover:text-zinc-200", FOCUS)}>
                Need more volume? Compare plans
              </a>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- Estimate */}
        <section id="estimate" aria-labelledby="estimate-heading" className="mt-16 scroll-mt-20">
          <h2 id="estimate-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
            Estimate next month&apos;s workload
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-400">
            Not sure Team is the right size? Move the slider to your best guess and we&apos;ll point you
            at the plan that covers it — the price updates with your billing period above.
          </p>
          <div className="mt-5">
            <WorkloadEstimator billing={billing} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- Compare */}
        <section id="compare" aria-labelledby="compare-heading" className="mt-16 scroll-mt-20">
          <h2 id="compare-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
            Compare plans
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-400">
            Team covers most teams that outgrow Starter. Scale exists for high-volume operations —
            see the full breakdown below.
          </p>
          <div className="mt-5">
            <CompareDrawer billing={billing} />
          </div>
        </section>

        {/* ---------------------------------------------------------------- Proof */}
        <section id="proof" aria-labelledby="proof-heading" className="mt-16 scroll-mt-20">
          <h2 id="proof-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
            Why teams upgrade
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-400">
            A few of the ops teams that hit this same wall on Starter.
          </p>
          <div className="mt-5">
            <Testimonials />
          </div>
        </section>

        {/* ---------------------------------------------------------------- FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="mt-16 scroll-mt-20">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-zinc-50">
            Common questions
          </h2>
          <p className="mt-1.5 max-w-prose text-sm font-normal text-zinc-400">
            Billing, resets, and what happens to work already in flight.
          </p>
          <div className="mt-5">
            <Faq />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-[1180px] px-4 py-8 text-xs font-normal text-zinc-400 sm:px-6">
          {BRAND}, Inc. — automation run counts reset on your billing date. Prices shown in USD.
        </div>
      </footer>
    </div>
  );
}
