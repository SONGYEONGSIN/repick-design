"use client";

import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { ANNUAL_SAVINGS_PCT, TIERS } from "./data";

const DISPLAY_FONT = { fontFamily: "var(--font-display-wide)" } as const;

type Period = "monthly" | "annual";

export default function MembershipTiers() {
  const [period, setPeriod] = useState<Period>("monthly");

  return (
    <section aria-labelledby="membership-heading" className="border-b border-zinc-800">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="membership-heading" style={DISPLAY_FONT} className="text-xl font-semibold text-zinc-50 sm:text-2xl">
              Membership
            </h2>
            <p className="mt-1 text-sm font-normal text-zinc-400">
              Support Signal &amp; Noise directly and get the full archive.
            </p>
          </div>

          <div role="group" aria-label="Choose billing period" className="flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900 p-1">
            {(["monthly", "annual"] as const).map((p) => {
              const active = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(p)}
                  className={
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
                    (active ? "bg-cyan-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-800")
                  }
                >
                  {p}
                  {p === "annual" && (
                    <span
                      className={
                        "rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums " +
                        (active ? "bg-zinc-950/15 text-zinc-950" : "bg-cyan-400/10 text-cyan-300")
                      }
                    >
                      Save {ANNUAL_SAVINGS_PCT}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TIERS.map((tier) => {
            const isFree = tier.monthlyPrice === 0;
            const displayPrice = period === "monthly" ? tier.monthlyPrice : tier.annualMonthlyEquivalent;
            return (
              <div
                key={tier.id}
                className={
                  "relative flex min-w-0 flex-col rounded-2xl border p-6 " +
                  (tier.highlight ? "border-cyan-400/40 bg-cyan-400/[0.04]" : "border-zinc-800 bg-zinc-900/40")
                }
              >
                {tier.highlight && (
                  <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-cyan-400 px-2.5 py-1 text-[11px] font-medium text-zinc-950">
                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                    Most popular
                  </span>
                )}

                <h3 style={DISPLAY_FONT} className="text-lg font-semibold text-zinc-50">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm font-normal text-zinc-400">{tier.tagline}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  {isFree ? (
                    <span style={DISPLAY_FONT} className="text-3xl font-semibold tabular-nums text-zinc-50">
                      Free
                    </span>
                  ) : (
                    <>
                      <span style={DISPLAY_FONT} className="text-3xl font-semibold tabular-nums text-zinc-50">
                        ${displayPrice}
                      </span>
                      <span className="text-sm font-normal text-zinc-400">/mo</span>
                    </>
                  )}
                </div>
                <p className="mt-1 text-xs font-normal text-zinc-400">
                  {isFree
                    ? "No card required"
                    : period === "monthly"
                      ? "Billed monthly"
                      : `Billed $${tier.annualTotal}/yr`}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm font-normal text-zinc-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={
                    "mt-6 rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 " +
                    (tier.highlight
                      ? "bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
                      : "border border-zinc-700 bg-zinc-900 text-zinc-50 hover:bg-zinc-800")
                  }
                >
                  {tier.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
