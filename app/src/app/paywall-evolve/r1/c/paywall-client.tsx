"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Headphones,
  History,
  Infinity as InfinityIcon,
  LayoutGrid,
  Lock,
  ShieldCheck,
} from "lucide-react";
import PricePanel from "./price-panel";
import TestimonialCarousel from "./testimonial-carousel";
import FaqAccordion from "./faq-accordion";
import { lockedFeatures } from "./data";

const featureIcons: Record<string, typeof InfinityIcon> = {
  boards: InfinityIcon,
  history: History,
  permissions: ShieldCheck,
  support: Headphones,
};

export default function PaywallClient() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-400 text-zinc-950">
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium text-zinc-100">Trestle</span>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
          >
            <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Not now
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:px-8 sm:py-14">
        {/* Hard-paywall moment: a single-tier interrupt, not a tiered grid. Everything a
            visitor needs at rest — why they're here, the price, the CTA — sits in this first
            section with no scroll or click required to reach any of it. */}
        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-14">
          <div>
            <p className="flex items-start gap-1.5 text-xs font-medium text-amber-400 tabular-nums">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0">Board limit reached · Fernhollow Studio · 3 of 3 used</span>
            </p>
            <h1
              className="mt-3 text-3xl leading-[1.1] font-semibold text-zinc-50 sm:text-4xl lg:text-[2.6rem]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Your team ran out of room on the Free plan
            </h1>
            <p className="mt-4 max-w-prose text-base font-normal text-zinc-400">
              Trestle Free stops at 3 boards and 2 seats. Upgrade to Trestle Pro to unlock
              unlimited boards, your full version history, and room for the rest of Fernhollow
              Studio.
            </p>
          </div>

          <div className="lg:sticky lg:top-8">
            <PricePanel />
          </div>
        </section>

        <section id="whats-included" className="mt-16 scroll-mt-24 sm:mt-24">
          <h2
            className="text-2xl font-semibold text-zinc-50 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Everything in Trestle Pro
          </h2>
          <p className="mt-2 max-w-prose text-sm font-normal text-zinc-400">
            The same boards, cards, and comments your team already made — just without the wall.
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="relative aspect-video overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800">
                <Image
                  src="https://picsum.photos/seed/trestle-sprint-board/960/540"
                  alt="A preview of a locked Trestle board layout with sticky-note style cards arranged in columns"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover brightness-[0.55] blur-[1px]"
                />
              </div>
              <p className="mt-3 flex items-start gap-1.5 text-xs font-normal text-zinc-400 tabular-nums">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  Sprint Planning Q3 — the 4th board Fernhollow Studio couldn&rsquo;t create on
                  Free.
                </span>
              </p>
            </div>

            <dl className="grid gap-5 sm:grid-cols-2">
              {lockedFeatures.map((feature) => {
                const Icon = featureIcons[feature.id] ?? InfinityIcon;
                return (
                  <div key={feature.id}>
                    <dt className="flex items-center gap-3 text-sm font-medium text-zinc-100">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-amber-400">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      {feature.label}
                    </dt>
                    <dd className="mt-0.5 pl-[3.25rem] text-sm font-normal text-zinc-400">
                      {feature.detail}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <h2
            className="text-2xl font-semibold text-zinc-50 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Teams who made the jump
          </h2>
          <p className="mt-2 max-w-prose text-sm font-normal text-zinc-400">
            Including one from the workspace hitting this same wall right now.
          </p>
          <div className="mt-8 max-w-2xl">
            <TestimonialCarousel />
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <h2
            className="text-2xl font-semibold text-zinc-50 sm:text-3xl"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Questions before you upgrade
          </h2>
          <div className="mt-8 max-w-2xl">
            <FaqAccordion />
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-zinc-800 sm:mt-24">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs font-normal text-zinc-400 sm:px-8">
          Trestle — pricing and usage figures shown are illustrative for this design review.
        </div>
      </footer>
    </div>
  );
}
