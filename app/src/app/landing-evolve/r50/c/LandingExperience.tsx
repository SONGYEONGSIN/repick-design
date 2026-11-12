"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { HERO_PRODUCTS, PLATFORM_STATS, SHOWCASE_PRODUCTS, TESTIMONIALS } from "./data";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { SellerTierLadder } from "./SellerTierLadder";
import { FOCUS_RING } from "./styles";
import {
  BASELINE_DAYS,
  type ChecklistItemId,
  DEFAULT_CHECKED,
  MAX_SCORE,
  daysToSellFor,
  nextTierInfo,
  scoreFor,
  tierFor,
} from "./tier-logic";

export function LandingExperience() {
  const [checked, setChecked] = useState<Set<ChecklistItemId>>(() => new Set(DEFAULT_CHECKED));

  const onToggle = (id: ChecklistItemId) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const onSetAll = (ids: ChecklistItemId[]) => setChecked(new Set(ids));

  // Every surface below derives independently from this same `checked` set through the same pure
  // functions — never a duplicated/cached number — so the header badge, the ladder, and the
  // closing CTA can never disagree with one another.
  const score = useMemo(() => scoreFor(checked), [checked]);
  const tier = useMemo(() => tierFor(score), [score]);

  return (
    <div className="bg-zinc-50">
      <Header tierName={tier.name} />
      <main>
        <Hero />
        <ProductShowcase />
        <SellerTierLadder checked={checked} onToggle={onToggle} onSetAll={onSetAll} />
        <SocialProof />
        <ClosingCTA checked={checked} />
      </main>
      <Footer />
    </div>
  );
}

function Header({ tierName }: { tierName: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-zinc-50/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6 sm:px-8 lg:px-10">
        <a
          href="#top"
          style={{ fontFamily: "var(--font-display-mono)" }}
          className={`${FOCUS_RING} text-xl font-bold tracking-[-0.02em] text-[#16151C]`}
        >
          repick
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-zinc-600 sm:flex">
          <a href="#listings" className={`${FOCUS_RING} hover:text-[#16151C]`}>
            Listings
          </a>
          <a href="#tier-ladder" className={`${FOCUS_RING} hover:text-[#16151C]`}>
            Seller tiers
          </a>
          <a href="#proof" className={`${FOCUS_RING} hover:text-[#16151C]`}>
            Proof
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium tracking-[0.12em] text-zinc-600 uppercase sm:flex">
            Your tier: <span className="text-[#5B21B6]">{tierName}</span>
          </span>
          <a
            href="#tier-ladder"
            className={`${FOCUS_RING} rounded-full bg-[#7C3AED] px-4 py-2 text-sm font-medium text-white`}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const reduce = useReducedMotion() === true;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -24]);

  return (
    <div id="top" ref={ref} className="mx-auto max-w-[1280px] px-6 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10 lg:px-10">
      <p className="text-[11px] font-medium tracking-[0.28em] text-[#7C3AED] uppercase">
        AI-powered resale marketplace
      </p>
      <h1
        style={{ fontFamily: "var(--font-display-mono)" }}
        className="mt-3 max-w-xl text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.98] font-bold tracking-[-0.02em] text-[#16151C]"
      >
        Every match, graded.
        <br />
        Every seller, verified.
      </h1>
      <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-700">
        repick scores every listing&apos;s AI match percentage, condition grade, and seller trust
        before you ever open the photos.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <a
          href="#tier-ladder"
          className={`${FOCUS_RING} flex items-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white`}
        >
          Start selling
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          href="#listings"
          className={`${FOCUS_RING} rounded-md text-sm font-medium text-[#16151C] underline underline-offset-2`}
        >
          See how grading works
        </a>
      </div>

      <motion.div style={{ y }} className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {HERO_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} variant="compact" />
        ))}
      </motion.div>
    </div>
  );
}

function ProductShowcase() {
  return (
    <section id="listings" className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-4 text-[72px] font-medium tracking-[0.12em] text-zinc-500 sm:right-10 sm:text-[96px]"
      >
        01
      </span>
      <Reveal>
        <p className="text-[11px] font-medium tracking-[0.28em] text-[#7C3AED] uppercase">
          Product preview
        </p>
        <h2
          style={{ fontFamily: "var(--font-display-mono)" }}
          className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.02em] text-[#16151C]"
        >
          Every listing, already graded.
        </h2>
        <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-700">
          Each card carries the same four checks before a buyer scrolls past it: an AI match
          score, a condition grade, seller verification, and the discount off original retail.
        </p>
      </Reveal>
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {SHOWCASE_PRODUCTS.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.06} className="min-w-0">
            <ProductCard product={product} variant="full" figureIndex={String(i + 1).padStart(2, "0")} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section id="proof" className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-4 text-[72px] font-medium tracking-[0.12em] text-zinc-500 sm:right-10 sm:text-[96px]"
      >
        03
      </span>
      <Reveal>
        <p className="text-[11px] font-medium tracking-[0.28em] text-[#7C3AED] uppercase">
          Social proof
        </p>
        <h2
          style={{ fontFamily: "var(--font-display-mono)" }}
          className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.02em] text-[#16151C]"
        >
          Sellers feel the difference.
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.06} className="min-w-0">
            <figure className="flex min-w-0 flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
              <Quote aria-hidden="true" className="h-8 w-8 text-zinc-300" />
              <blockquote className="max-w-[432px] text-sm leading-[1.6] text-zinc-700">
                {t.quote}
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100">
                  <Image src={t.avatar.src} alt={t.avatar.alt} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#16151C]">{t.name}</p>
                  <p className="truncate text-xs text-zinc-600">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-8 border-t border-zinc-200 pt-8">
        {PLATFORM_STATS.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold tracking-[-0.02em] text-[#16151C]">{stat.value}</p>
            <p className="mt-1 text-[11px] font-medium tracking-[0.12em] text-zinc-600 uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function ClosingCTA({ checked }: { checked: ReadonlySet<ChecklistItemId> }) {
  const score = scoreFor(checked);
  const tier = tierFor(score);
  const info = nextTierInfo(checked);
  const days = daysToSellFor(score);

  const projectedDays = info.reached
    ? days
    : daysToSellFor(Math.min(MAX_SCORE, score + info.nextItems.reduce((sum, item) => sum + item.weight, 0)));

  return (
    <section className="relative mx-auto max-w-[1280px] px-6 py-20 sm:px-8 lg:px-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-4 text-[72px] font-medium tracking-[0.12em] text-zinc-500 sm:right-10 sm:text-[96px]"
      >
        04
      </span>
      <Reveal className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-12">
        <p className="text-[11px] font-medium tracking-[0.28em] text-[#7C3AED] uppercase">
          Your status, right now
        </p>
        <h2
          style={{ fontFamily: "var(--font-display-mono)" }}
          className="mt-3 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] font-bold tracking-[-0.02em] text-[#16151C]"
        >
          You&apos;re at {tier.name}.
        </h2>
        <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-700">
          {info.reached
            ? `Every seller benefit is live on your listings — AI match visibility, the lowest platform fee, and same-day payout, all at once.`
            : `Verify ${info.needed} more step${info.needed === 1 ? "" : "s"} to reach ${info.nextTier.name} — your estimated time-to-sell would drop to about ${projectedDays} days.`}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-6">
          <a
            href="#tier-ladder"
            className={`${FOCUS_RING} flex items-center gap-2 rounded-full bg-[#7C3AED] px-5 py-3 text-sm font-medium text-white`}
          >
            {info.reached ? "Keep your listings at Platinum" : `Verify your next step`}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </a>
          <p className="text-sm font-medium text-zinc-600">
            Trust score <span className="font-bold text-[#16151C]">{score}/100</span> · Est.{" "}
            <span className="font-bold text-[#16151C]">{days} days</span> to sell
          </p>
        </div>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-6 py-8 text-xs font-medium text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <p>repick — resale, verified.</p>
        <p>Baseline time-to-sell without verification: {BASELINE_DAYS} days.</p>
      </div>
    </footer>
  );
}
