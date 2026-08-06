"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import HeroDiagram from "./hero-diagram";
import ProcessSteps from "./process-steps";
import LogoStrip from "./logo-strip";
import { processSteps, impactStats, partnerLogos } from "./data";

const STEP_LABELS = processSteps.map((s) => s.title);

export default function AboutClient() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-dvh bg-white text-zinc-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-rose-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className="border-b border-zinc-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <span className="font-bold text-lg tracking-tight text-zinc-900">
            Northline
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-8 sm:flex">
            <a
              href="#process"
              className="font-medium text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 rounded-sm"
            >
              How it works
            </a>
            <a
              href="#impact"
              className="font-medium text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 rounded-sm"
            >
              Impact
            </a>
            <a
              href="#careers"
              className="font-medium text-sm text-zinc-600 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 rounded-sm"
            >
              Careers
            </a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* Hero: mission + always-visible process diagram. */}
        <section className="mx-auto max-w-6xl px-6 pb-4 pt-14 sm:pt-20">
          <p className="font-medium text-xs uppercase tracking-wide text-rose-600">
            About Northline
          </p>
          <h1 className="mt-3 max-w-3xl font-bold text-4xl leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            Sourcing that a retail buyer can actually audit.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Northline connects independent manufacturers with retail and DTC buyers through
            one verified pipeline: every factory on the platform is sourced, audited, matched
            and shipped through the same four steps, in the same order, every time.
          </p>

          <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-10 sm:px-10">
            <HeroDiagram activeStep={activeStep} labels={STEP_LABELS} />
          </div>
        </section>

        {/* Process steps, synchronized to the diagram above via activeStep. */}
        <section id="process" className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="font-bold text-2xl tracking-tight text-zinc-900 sm:text-3xl">
              How the pipeline works
            </h2>
            <p className="mt-3 text-base leading-relaxed text-zinc-600">
              Hover or focus a step to see it highlighted in the diagram above. On mobile,
              tap a step to open it — the diagram updates with it.
            </p>
          </div>
          <div className="mt-8">
            <ProcessSteps steps={processSteps} activeStep={activeStep} onActivate={setActiveStep} />
          </div>
        </section>

        {/* Impact stats: static, always-visible facts. */}
        <section id="impact" className="border-y border-zinc-100 bg-zinc-50">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-bold text-2xl tracking-tight text-zinc-900 sm:text-3xl">
              What the pipeline has produced so far
            </h2>
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {impactStats.map((stat) => (
                <div key={stat.label} className="min-w-0">
                  <dt className="font-medium text-sm text-zinc-600">{stat.label}</dt>
                  <dd className="mt-1 font-bold tabular-nums text-3xl tracking-tight text-zinc-900 sm:text-4xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 flex items-start gap-2 text-sm leading-relaxed text-zinc-600">
              <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 flex-none text-rose-600" />
              Figures reflect completed, independently audited engagements as tracked in
              Northline&rsquo;s supplier ledger.
            </p>
          </div>
        </section>

        {/* Partner logo strip. */}
        <section className="mx-auto max-w-6xl px-6 py-16">
          <LogoStrip logos={partnerLogos} />
        </section>

        {/* Careers CTA. */}
        <section id="careers" className="mx-auto max-w-6xl px-6 pb-20">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-zinc-900 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
            <div className="max-w-xl">
              <h2 className="font-bold text-2xl tracking-tight text-white sm:text-3xl">
                We&rsquo;re hiring across audit, ops and engineering.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-zinc-300">
                Northline is a small team building the sourcing pipeline we wished existed
                the last time we tried to import anything. Open roles span supplier audit,
                logistics operations and platform engineering.
              </p>
            </div>
            <a
              href="#careers"
              className="inline-flex flex-none items-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-semibold text-sm text-white transition-colors hover:bg-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
            >
              View open roles
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-100">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500">
          Copyright 2026 Northline Sourcing, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
