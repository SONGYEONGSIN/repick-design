"use client";

import { useState } from "react";
import Image from "next/image";
import { PriceSlider } from "./PriceSlider";
import { BulletRow } from "./BulletRow";
import { ProductCard } from "./ProductCard";
import { Reveal } from "./Reveal";
import { CATEGORIES, PRODUCTS, DEFAULT_PRICE, closingLine, summaryFor } from "./data";

const heroProduct = PRODUCTS[0];

export function LandingPage() {
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const { clearing } = summaryFor(price);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white">
      <main>
        {/* ============ HERO ============ */}
        <section className="mx-auto max-w-7xl px-4 pt-16 pb-14 sm:px-6 sm:pt-20 lg:px-10 lg:pt-24 xl:px-16">
          <p className="text-xs font-semibold tracking-[0.28em] text-amber-300">A WORKED EXAMPLE</p>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <h1 className="max-w-[18ch] text-[clamp(2.3rem,1.1rem+6.3vw,4.75rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-white">
                You&apos;ve got{" "}
                <span className="font-[family-name:var(--font-display-mono)] text-amber-300">$180</span> to spend
                on a jacket this week.
              </h1>

              <p className="mt-6 max-w-[34rem] text-lg leading-[1.6] text-zinc-300">
                That number is real, and so is the data underneath it. Drag it below and
                five resale categories answer back against this week&apos;s actual asking prices.
              </p>

              <div className="mt-8">
                <a
                  href="#start"
                  className="inline-flex items-center rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0B0B0F] transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  Start your own budget check
                </a>
              </div>

              <div className="mt-10 max-w-[30rem] rounded-lg border border-zinc-800 bg-zinc-900/50 p-5">
                <PriceSlider price={price} onChange={setPrice} />
              </div>
            </div>

            {/* product proof — same component as the headline, not a separate section */}
            <div className="min-w-0 lg:pt-2">
              <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">THIS WEEK&apos;S EXAMPLE ITEM</p>
              <div className="mt-3 flex min-w-0 gap-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="relative aspect-[4/5] w-28 flex-none overflow-hidden rounded-md bg-zinc-800 sm:w-32">
                  <Image
                    src={`https://images.unsplash.com/photo-${heroProduct.photoId}?auto=format&fit=crop&w=400&q=70`}
                    alt={heroProduct.alt}
                    fill
                    sizes="140px"
                    className="object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                  <div>
                    <p className="text-[11px] font-semibold tracking-[0.1em] text-zinc-400">
                      {heroProduct.brand.toUpperCase()}
                    </p>
                    <p className="text-sm font-semibold text-white">{heroProduct.title}</p>
                  </div>
                  <p className="font-[family-name:var(--font-display-mono)] text-xl font-semibold tabular-nums text-white">
                    ${heroProduct.ask}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                      {heroProduct.matchPct}% match
                    </span>
                    <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                      Grade {heroProduct.grade}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">Verified seller · {heroProduct.sellerSales} sales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PRODUCT PREVIEW ============ */}
        <Reveal>
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 xl:px-16">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
              Why the AI picked these, not just what they cost
            </h2>
            <p className="mt-3 max-w-[31rem] text-base leading-[1.6] text-zinc-400">
              Three items currently live in the three categories from the walkthrough.
              Open any card to see the actual reasoning behind the match.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* ============ VALUE — the bullet-graph budget fit ============ */}
        <Reveal>
          <section id="value" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 xl:px-16">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
                Five categories, one number
              </h2>
              <p className="font-[family-name:var(--font-display-mono)] text-sm font-semibold tracking-[0.12em] text-amber-300">
                {clearing.length} OF 5 CLEAR AT ${price}
              </p>
            </div>

            <p className="mt-3 max-w-[31rem] text-base leading-[1.6] text-zinc-400">
              Each row is this week&apos;s real price range for the category — not a
              model, the actual spread of listings. The diamond is your number; the thin
              line is what most sellers are asking.
            </p>

            <div className="mt-6 max-w-sm">
              <PriceSlider price={price} onChange={setPrice} id="budget-slider-value" />
            </div>

            <ul className="mt-8 border-t border-zinc-800">
              {CATEGORIES.map((cat) => (
                <BulletRow key={cat.id} cat={cat} price={price} />
              ))}
            </ul>
          </section>
        </Reveal>

        {/* ============ SOCIAL PROOF ============ */}
        <Reveal>
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 xl:px-16">
            <h2 className="text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
              Buyers who ran their own number
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <blockquote className="min-w-0 rounded-lg border border-zinc-800 p-5">
                <p className="max-w-[31rem] text-base leading-[1.6] text-zinc-200">
                  &ldquo;I dragged it down to $90 just to see. Denim and sneakers still
                  cleared. I didn&apos;t expect that.&rdquo;
                </p>
                <cite className="mt-3 block text-xs font-semibold tracking-[0.08em] text-zinc-400">
                  — DANIEL R., FIRST RESALE PURCHASE
                </cite>
              </blockquote>

              <blockquote className="min-w-0 rounded-lg border border-zinc-800 p-5">
                <p className="max-w-[31rem] text-base leading-[1.6] text-zinc-200">
                  &ldquo;The median line is what sold me. I could see my number against
                  real asks, not a sale banner.&rdquo;
                </p>
                <cite className="mt-3 block text-xs font-semibold tracking-[0.08em] text-zinc-400">
                  — PRIYA M., FOUR PURCHASES
                </cite>
              </blockquote>

              <blockquote className="min-w-0 rounded-lg border border-zinc-800 p-5">
                <p className="max-w-[31rem] text-base leading-[1.6] text-zinc-200">
                  &ldquo;Watches never clear for me and the page just says so. That
                  honesty is why I keep checking back weekly.&rdquo;
                </p>
                <cite className="mt-3 block text-xs font-semibold tracking-[0.08em] text-zinc-400">
                  — OMAR K., WATCH COLLECTOR
                </cite>
              </blockquote>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-zinc-800 pt-6 text-xs font-semibold tracking-[0.12em] text-zinc-400">
              <span>5 CATEGORIES TRACKED WEEKLY</span>
              <span>PRICES RE-PULLED EVERY MONDAY</span>
              <span>EVERY BAND FROM REAL LISTINGS, NOT A MODEL</span>
            </div>
          </section>
        </Reveal>

        {/* ============ CLOSING CTA — live, slider-derived ============ */}
        <Reveal>
          <section id="start" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-10 xl:px-16">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 sm:p-10">
              <h2 className="max-w-[24ch] text-2xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-3xl">
                Run your own number before this week&apos;s listings turn over.
              </h2>
              <p
                aria-live="polite"
                className="mt-4 max-w-[34rem] text-lg leading-[1.6] text-zinc-300"
              >
                {closingLine(price)}
              </p>
              <div className="mt-7">
                <a
                  href="#value"
                  className="inline-flex items-center rounded-md bg-amber-500 px-5 py-3 text-sm font-semibold text-[#0B0B0F] transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                  Start your own budget check
                </a>
              </div>
              <p className="mt-3 text-xs text-zinc-400">Free to look. You decide if you buy.</p>
            </div>
          </section>
        </Reveal>
      </main>

      <footer className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-10 xl:px-16">
        <p className="max-w-[27rem] text-sm leading-[1.6] text-zinc-400">
          Every band above comes from this week&apos;s live resale listings. We just put a
          slider in front of it.
        </p>
      </footer>
    </div>
  );
}
