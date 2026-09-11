"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, BadgeCheck, Quote, ShieldCheck, Star } from "lucide-react";
import BundleBuilder from "./bundle-builder";
import ProductCard from "./product-card";
import {
  computeBundle,
  PRODUCTS,
  TESTIMONIALS,
  TRUST_SIGNALS,
  TRUST_STATS,
  type ProductId,
} from "./data";

const DEFAULT_SELECTION: ProductId[] = ["sneakers", "camera"];
const STAR_POSITIONS = [0, 1, 2, 3, 4];

export default function BundleLanding() {
  const [selectedIds, setSelectedIds] = useState<ProductId[]>(DEFAULT_SELECTION);
  const reduceMotion = useReducedMotion();
  const summary = computeBundle(selectedIds);

  const toggle = (id: ProductId) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // always keep at least one item selected
        return prev.filter((existing) => existing !== id);
      }
      return [...prev, id];
    });
  };

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  const heroCards = PRODUCTS.filter((p) => p.id === "sneakers" || p.id === "chair");

  return (
    <div className="bg-[#0B0B0F] text-white">
      {/* ---------------------------------------------------------------- Nav */}
      <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-base font-bold tracking-[-0.02em] text-white">
            <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
            repick
          </span>
          <a
            href="#value"
            className="rounded-full border border-zinc-700 px-4 py-1.5 text-sm font-semibold text-zinc-200 transition-colors hover:border-teal-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
          >
            Build a bundle
          </a>
        </div>
      </header>

      {/* `<main>` 랜드마크. 없으면 axe 의 `landmark-one-main` 이 실패한다 —
          a11y 95 로 문턱에 붙어 있었다(2026-09-12 승격 시 §3-1 해소). */}
      <main id="main-content">

      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16 sm:px-10 lg:px-16 lg:pb-32 lg:pt-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 lg:col-span-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-400">
                AI-matched resale
              </p>
              <h1 className="mt-5">
                <span className="block text-[clamp(1.3rem,1.2vw+1rem,1.9rem)] font-normal leading-[1.15] text-zinc-300">
                  Find the exact
                </span>
                <span className="block text-[clamp(3rem,5.4vw+1rem,6.25rem)] font-bold leading-[0.98] tracking-[-0.02em] text-white">
                  right item.
                </span>
                <span className="block text-[clamp(1.3rem,1.2vw+1rem,1.9rem)] font-normal leading-[1.15] text-zinc-300">
                  Skip the wrong nine.
                </span>
              </h1>
              <p className="mt-6 max-w-[555px] text-[18px] font-normal leading-[1.6] text-zinc-400">
                repick reads condition photos, price history and your saved preferences before it
                shows you a single listing &mdash; then prints the reasoning next to the price, not
                behind it.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#value"
                  className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
                >
                  Start matching
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="text-sm font-normal text-zinc-400">
                  No account needed to see a match.
                </span>
              </div>
            </motion.div>

            {/* Product + proof, inside the hero block itself */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="min-w-0 lg:col-span-5"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                Two matches, live from this week
              </p>
              <div className="flex flex-col gap-4">
                {heroCards.map((product) => (
                  <ProductCard key={product.id} product={product} variant="compact" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Product grid */}
      <section className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-[555px]"
          >
            <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              Every listing comes with its receipts.
            </h2>
            <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-400">
              Match score, condition grade, seller verification and the before/after price sit next
              to the photo &mdash; not hidden behind a click.
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.06 }}
                whileHover={reduceMotion ? undefined : { y: -4 }}
                className="min-w-0"
              >
                <ProductCard product={product} variant="full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Value: bundle builder */}
      <section id="value" className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-[1400px]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="max-w-[555px]"
          >
            <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              Build a bundle, watch the math move.
            </h2>
            <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-400">
              Add a second or third item and two independent numbers recompute at once: the extra
              bundle discount, and the trust rollup across everything you have picked.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <BundleBuilder selectedIds={selectedIds} onToggle={toggle} />
          </motion.div>
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
            className="max-w-[555px]"
          >
            <h2 className="text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
              Trusted by people who almost did not switch.
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
                  <Quote className="h-5 w-5 text-teal-500" aria-hidden="true" />
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-300">
                    {t.quote}
                  </p>
                  {/* `role="img"` 필수 — 역할 없는 `<div>` 에 `aria-label` 은 허용되지 않아 axe 의
                      `aria-prohibited-attr` 가 실패한다(2026-09-12 승격 시 §3-1 해소). 별점은 그래픽이라 img 가 맞다. */}
                  <div role="img" className="mt-4 flex items-center gap-1" aria-label={`Rated ${t.rating} out of 5`}>
                    {STAR_POSITIONS.map((starIndex) => (
                      <Star
                        key={starIndex}
                        aria-hidden="true"
                        className={[
                          "h-3.5 w-3.5",
                          starIndex < t.rating ? "fill-teal-400 text-teal-400" : "text-zinc-400",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-semibold text-zinc-100">{t.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-zinc-400">
                    {t.verified && <BadgeCheck className="h-3 w-3 text-teal-400" aria-hidden="true" />}
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
                    <dd className="mt-1 text-3xl font-bold tabular-nums tracking-[-0.02em] text-white">
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
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-500" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Closing CTA */}
      <section className="border-t border-zinc-800/80 px-6 py-24 sm:px-10 lg:px-16">
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
              <h2 className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
                Ready when your bundle is.
              </h2>
              <p className="mt-4 max-w-[500px] text-[16px] font-normal leading-[1.6] text-zinc-400">
                Your current <span className="tabular-nums">{summary.count}</span>-item bundle carries a{" "}
                <span className="font-semibold tabular-nums text-teal-400">{summary.discountPct}%</span>{" "}
                bundle discount on top of each item&rsquo;s own markdown, for{" "}
                <span className="font-semibold tabular-nums text-white">${summary.total}</span> total
                and a{" "}
                <span className="font-semibold tabular-nums text-teal-400">{summary.rollup}/100</span>{" "}
                trust rollup. Change the selection above and this line changes with it.
              </p>
            </div>
            <div className="min-w-0 lg:col-span-4 lg:text-right">
              <a
                href="#value"
                className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 text-[15px] font-semibold text-[#0B0B0F] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              >
                Claim this bundle &middot; <span className="tabular-nums">${summary.total}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- Footer */}
      </main>
      <footer className="border-t border-zinc-800/80 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" aria-hidden="true" />
            repick
          </span>
          <p className="text-xs font-normal text-zinc-400">
            Match reasoning and bundle math are illustrative figures for this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
