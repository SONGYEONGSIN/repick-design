"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ArrowRight, Check } from "lucide-react";

import {
  type Active,
  type CategoryId,
  CATEGORIES,
  LISTINGS,
  activeCount,
  buildSteps,
  computeScore,
  discountPct,
  scoreLabel,
} from "./data";
import { FOCUS_RING, StatusIcon, StatusText } from "./ui";

interface HeroProps {
  active: Active;
  onToggle: (id: CategoryId) => void;
  selectedId: string;
  onSelect: (id: string) => void;
}

const monoFont = { fontFamily: "var(--font-display-mono)" };

export default function Hero({ active, onToggle, selectedId, onSelect }: HeroProps) {
  const prefersReducedMotion = useReducedMotion();
  const listing = LISTINGS.find((l) => l.id === selectedId) ?? LISTINGS[0];
  const steps = buildSteps(listing, active);
  const score = computeScore(listing, active);
  const nActive = activeCount(active);
  const label = scoreLabel(score, nActive);
  const discount = discountPct(listing);
  const Icon = listing.icon;
  const activeKey = CATEGORIES.map((c) => (active[c.id] ? "1" : "0")).join("");

  return (
    <section id="pipeline" className="relative border-b border-zinc-800/80 px-6 pb-20 pt-16 sm:px-10 lg:px-16 lg:pb-28 lg:pt-24">
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
        {/* Left: headline, subhead, single CTA, category toggles */}
        <div className="min-w-0">
          <p
            className="text-[12px] font-semibold uppercase text-amber-300"
            style={{ letterSpacing: "0.28em", ...monoFont }}
          >
            Validation pipeline
          </p>
          <h1
            className="mt-5 text-[42px] font-extrabold leading-[1.04] tracking-tight text-white sm:text-[52px] lg:text-[clamp(3.1rem,2vw+2.6rem,4.75rem)]"
            style={monoFont}
          >
            Nothing ships
            <br />
            until it&apos;s assayed.
          </h1>
          <p className="mt-6 max-w-[520px] text-[17px] leading-[1.6] text-zinc-400">
            Assay runs four independent checks on every secondhand listing before it reaches
            your feed. Switch any check off below and watch the pipeline — and the trust
            score — recompute in real time.
          </p>

          <a
            href="#get-started"
            className={`mt-8 inline-flex items-center gap-2 rounded-full bg-amber-700 px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-amber-600 ${FOCUS_RING}`}
          >
            Start a verification
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>

          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[13px] font-semibold uppercase text-zinc-300" style={{ letterSpacing: "0.16em" }}>
                Active checks
              </h2>
              <span className="text-[13px] text-zinc-400" style={{ ...monoFont }}>
                {nActive}/4 running
              </span>
            </div>
            <div role="group" aria-label="Toggle which checks run in the pipeline" className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CATEGORIES.map((cat) => {
                const isOn = active[cat.id];
                const isLast = isOn && nActive === 1;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={isOn}
                    aria-disabled={isLast}
                    onClick={() => {
                      if (isLast) return;
                      onToggle(cat.id);
                    }}
                    title={isLast ? "At least one check must stay on." : cat.blurb}
                    className={`rounded-xl border px-3 py-3 text-left transition-colors ${FOCUS_RING} ${
                      isOn
                        ? "border-amber-700 bg-amber-700/15 text-white"
                        : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                    } ${isLast ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span className="block text-[13px] font-semibold">{cat.label}</span>
                    <span className="mt-0.5 block text-[12px] text-zinc-400">{isOn ? "On" : "Off"}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 max-w-[400px] text-[13px] leading-[1.55] text-zinc-400">
              Each check carries its own weight in the trust score below — authenticity counts
              for more than seller history. Turn checks off to see how the verdict shifts.
            </p>
          </div>
        </div>

        {/* Right: the pipeline device + the listings it runs on, in the same component */}
        <div className="min-w-0">
          <div
            role="group"
            aria-label="Choose a listing to inspect"
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] sm:flex-wrap sm:overflow-visible sm:pb-0"
          >
            {LISTINGS.map((l) => {
              const s = computeScore(l, active);
              const isSelected = l.id === selectedId;
              const LIcon = l.icon;
              return (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(l.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] transition-colors ${FOCUS_RING} ${
                    isSelected
                      ? "border-amber-700 bg-amber-700/15 text-white"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  {isSelected ? (
                    <Check className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" strokeWidth={3} />
                  ) : (
                    <LIcon className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span className="font-semibold">{l.name}</span>
                  <span className="text-zinc-400" style={monoFont}>
                    {s}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 pb-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900">
                  <Icon className="h-5 w-5 text-zinc-300" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-white">{listing.name}</p>
                  <p className="truncate text-[12px] text-zinc-400">
                    {listing.categoryLabel} · {listing.conditionGrade}
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[15px] font-semibold text-white" style={monoFont}>
                  ${listing.price.toLocaleString("en-US")}
                </p>
                <p className="flex items-center justify-end gap-1 text-[12px] text-zinc-400">
                  {discount >= 0 ? (
                    <ArrowDownRight className="h-3 w-3 text-amber-300" aria-hidden="true" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                  )}
                  {Math.abs(discount)}% {discount >= 0 ? "under" : "over"} market
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedId}-${activeKey}`}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
                aria-live="polite"
              >
                <ol className="mt-5 space-y-0">
                  {steps.map((step, i) => (
                    <li key={step.id} className="relative flex gap-3 pb-5 last:pb-0">
                      {i < steps.length - 1 && (
                        <span
                          className="absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px bg-zinc-800"
                          aria-hidden="true"
                        />
                      )}
                      <StatusIcon status={step.status} className="relative z-10" />
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[13px] font-semibold text-zinc-100">{step.label}</span>
                          <StatusText status={step.status} />
                        </div>
                        <p className="mt-0.5 max-w-[400px] text-[12.5px] leading-[1.5] text-zinc-400">
                          {step.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-5 flex items-end justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
                      Trust score
                    </p>
                    <p className="mt-1 text-[34px] font-extrabold leading-none text-white" style={monoFont}>
                      {score}
                      <span className="text-[16px] font-normal text-zinc-400">/100</span>
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ${
                      label === "Clear" ? "bg-amber-700 text-white" : "border border-zinc-600 text-zinc-300"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
