"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Layers,
  Quote,
  ShieldCheck,
  Shirt,
  Star,
  Truck,
} from "lucide-react";
import ReceiptDevice from "./ReceiptDevice";
import {
  computeReceipt,
  formatKRW,
  TESTIMONIALS,
  TRUST_SIGNALS,
  TRUST_STATS,
  type AuthId,
  type CategoryId,
  type ConditionId,
  type ShippingId,
} from "./data";

const STAR_POSITIONS = [0, 1, 2, 3, 4];

const TRACE_ITEMS = [
  {
    icon: <Shirt className="h-4 w-4" aria-hidden="true" />,
    control: "Category",
    line: "Base estimate",
    copy: "Each category carries its own median resale comps.",
  },
  {
    icon: <Layers className="h-4 w-4" aria-hidden="true" />,
    control: "Condition grade",
    line: "Condition adjustment",
    copy: "Wear knocks a fixed percentage off the base figure.",
  },
  {
    icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
    control: "Authentication",
    line: "Authentication fee",
    copy: "Premium in-hand inspection costs more than a photo check.",
  },
  {
    icon: <Truck className="h-4 w-4" aria-hidden="true" />,
    control: "Shipping speed",
    line: "Shipping & pickup",
    copy: "Faster pickup is a real courier cost, passed through.",
  },
];

export default function PayoutLanding() {
  const [categoryId, setCategoryId] = useState<CategoryId>("outerwear");
  const [conditionId, setConditionId] = useState<ConditionId>("good");
  const [authId, setAuthId] = useState<AuthId>("standard");
  const [shippingId, setShippingId] = useState<ShippingId>("standard");
  const reduceMotion = useReducedMotion();

  // Single source of truth: every figure on the page — the hero receipt AND the closing line —
  // is read from this one computation, so the closing CTA can never go stale relative to the
  // controls above it.
  const receipt = useMemo(
    () => computeReceipt(categoryId, conditionId, authId, shippingId),
    [categoryId, conditionId, authId, shippingId]
  );

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#0B0B0F] text-white">
      {/* ---------------------------------------------------------------- Nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-base font-semibold tracking-[-0.02em] text-white">
            <span className="h-2 w-2 rounded-full bg-rose-500" aria-hidden="true" />
            repick <span className="font-normal text-zinc-400">for sellers</span>
          </span>
          <a
            href="#receipt"
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-rose-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
          >
            Calculate your payout
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------------------- Hero (device lives here too) */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-10 lg:px-16 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 lg:col-span-5"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-400">
                For sellers
              </p>
              <h1 className="mt-5 leading-[1.02]">
                <span className="block text-[clamp(1.2rem,1.1vw+0.9rem,1.7rem)] font-normal leading-[1.2] text-zinc-300">
                  Before you list,
                </span>
                <span
                  className="block text-[clamp(2.6rem,5.4vw+1rem,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-mono)" }}
                >
                  see the payout.
                </span>
                <span className="block text-[clamp(1.2rem,1.1vw+0.9rem,1.7rem)] font-normal leading-[1.2] text-zinc-300">
                  Not a guess &mdash; a receipt.
                </span>
              </h1>
              <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-400">
                Pick your item&rsquo;s category, condition, authentication tier and shipping
                speed. Every fee recomputes instantly, itemized like a real receipt &mdash; never
                a single ballpark number.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#receipt"
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
                >
                  See your itemized payout
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="text-sm font-normal text-zinc-400">
                  Free to check &mdash; no listing fee.
                </span>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
                {TRUST_STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <dt className="text-[11px] font-normal leading-[1.4] text-zinc-400">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>

            {/* Product preview + the value-manipulation device, inside the hero component itself */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 lg:col-span-7"
            >
              <ReceiptDevice
                receipt={receipt}
                onCategory={setCategoryId}
                onCondition={setConditionId}
                onAuth={setAuthId}
                onShipping={setShippingId}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Traceability explainer */}
      <section className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-[500px]"
          >
            <h2
              className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Every line traces to a choice you made.
            </h2>
            <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-400">
              Nothing on the receipt is a hidden platform markup. Each row above comes directly
              from one control you touched.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRACE_ITEMS.map((item, i) => (
              <motion.div
                key={item.control}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.08 }}
                className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-400">
                  {item.icon}
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  {item.control}
                </p>
                <p className="mt-1 text-sm font-semibold text-white">&rarr; {item.line}</p>
                <p className="mt-2 text-xs font-normal leading-[1.6] text-zinc-400">{item.copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Social proof */}
      <section className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-[500px]"
          >
            <h2
              className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-mono)" }}
            >
              Sellers who priced before they listed.
            </h2>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <ul className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.li
                  key={t.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                  className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"
                >
                  <Quote className="h-5 w-5 text-rose-500" aria-hidden="true" />
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-300">{t.quote}</p>
                  <div className="mt-4 flex items-center gap-1" aria-label={`Rated ${t.rating} out of 5`}>
                    {STAR_POSITIONS.map((starIndex) => (
                      <Star
                        key={starIndex}
                        aria-hidden="true"
                        className={[
                          "h-3.5 w-3.5",
                          starIndex < t.rating ? "fill-rose-400 text-rose-400" : "text-zinc-400",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-zinc-100">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-zinc-400">
                    {t.verified && <BadgeCheck className="h-3 w-3 text-rose-400" aria-hidden="true" />}
                    {t.context}
                  </p>
                </motion.li>
              ))}
            </ul>

            <div className="min-w-0 lg:col-span-4">
              <dl className="flex flex-col gap-6">
                {TRUST_STATS.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Decorative marquee — every phrase already appears above as prose or stat copy. */}
          <div className="relative mt-14 overflow-hidden border-y border-zinc-800/80 py-4" aria-hidden="true">
            <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 motion-reduce:animate-none">
              {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((signal, i) => (
                <span
                  key={`${signal}-${i}`}
                  className="flex shrink-0 items-center gap-2 text-sm font-normal text-zinc-400"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Closing CTA — quotes the live total */}
      <section id="get-started" className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end"
          >
            <div className="min-w-0 lg:col-span-8">
              <h2
                className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-mono)" }}
              >
                Ready when your numbers are.
              </h2>
              <p className="mt-4 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-400">
                Right now, a <span className="text-zinc-200">{receipt.condition.shortLabel.toLowerCase()}-grade</span>{" "}
                <span className="text-zinc-200">{receipt.category.label.toLowerCase()}</span> item with{" "}
                <span className="text-zinc-200">{receipt.auth.shortLabel.toLowerCase()}</span> authentication and{" "}
                <span className="text-zinc-200">{receipt.shipping.shortLabel.toLowerCase()}</span> shipping pays
                out{" "}
                <span className="font-semibold tabular-nums text-rose-400">{formatKRW(receipt.total)}</span>.
                Change any control above and this line updates with it.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-4 lg:text-right">
              <a
                href="#receipt"
                className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400"
              >
                Start your listing &middot;{" "}
                <span className="tabular-nums">{formatKRW(receipt.total)}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Footer */}
      <footer className="border-t border-zinc-800/80 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            repick
          </span>
          <p className="text-xs font-normal text-zinc-400">
            Payout figures are illustrative estimates for this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
