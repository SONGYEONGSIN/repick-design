"use client";

import Image from "next/image";
import { useState } from "react";
import { CategoryAudit } from "./CategoryAudit";
import { ProductPreview } from "./ProductPreview";
import { Reveal } from "./Reveal";
import { formatUnits, getCategory } from "./data";

const HERO_ITEM = {
  title: "Seamaster Diver 300M",
  photo: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
  alt: "A stainless steel dive watch with a blue dial, photographed against a plain background",
  grade: "Excellent (9/10)",
  tier: "Verified Pro" as const,
  matchPct: 96,
  retail: 2450,
  resale: 1180,
};

const TESTIMONIALS = [
  {
    quote:
      "I buy sneakers and my partner buys watches. We compared our two audit screens side by side — same three tiers, same labels, different numbers underneath. That consistency is the whole reason we trust the grade.",
    name: "Priya R.",
    role: "Sneaker and watch buyer",
  },
  {
    quote:
      "Bags run 52% Verified Pro on this platform, which is the highest of any category I checked. I didn't have to take that on faith — the breakdown table is right there.",
    name: "Daniel O.",
    role: "Handbag reseller",
  },
  {
    quote:
      "Electronics is a messier category everywhere else I've shopped resale. Seeing the real New Seller share before I buy, instead of after a return, changed how I shop it.",
    name: "Mette K.",
    role: "Camera and lens buyer",
  },
];

function discountPct(retail: number, resale: number): number {
  return Math.round(((retail - resale) / retail) * 100);
}

export function LandingExperience() {
  const [selected, setSelected] = useState("watches");
  const current = getCategory(selected);
  const heroDiscount = discountPct(HERO_ITEM.retail, HERO_ITEM.resale);

  return (
    <main className="bg-[#0B0B0F] text-zinc-50">
      {/* 1. HERO — headline, subhead, one CTA, product proof, all in one fold. */}
      <section className="px-4 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-14">
            <div className="min-w-0">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-teal-300">
                Category audit
              </p>
              <h1 className="font-[family-name:var(--font-display-grotesk)] text-[clamp(2.5rem,6.6vw,5.25rem)] font-bold leading-[1.03] tracking-[-0.02em] text-zinc-50">
                No category
                <br />
                grades on a curve.
              </h1>
              <p className="mt-6 max-w-[554px] text-lg font-normal leading-relaxed text-zinc-300">
                Every seller on Repick is scored against the same three-tier bar. Open the
                audit below and see the unfiltered mix for each category — not a highlight
                reel picked to flatter one department.
              </p>
              <a
                href="#audit"
                className="mt-8 inline-flex items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-sm font-bold text-[#0B0B0F] transition-colors hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              >
                Open the category audit
              </a>
            </div>

            {/* Product proof — a real item, visible with the headline, no scrolling needed. */}
            <div className="w-full min-w-0 max-w-[300px] rounded-lg border border-zinc-800 bg-zinc-950 justify-self-start lg:justify-self-end">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg bg-zinc-800">
                <Image
                  src={HERO_ITEM.photo}
                  alt={HERO_ITEM.alt}
                  fill
                  sizes="300px"
                  preload
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 px-4 py-3">
                <span className="rounded-sm bg-teal-700 px-2 py-0.5 text-xs font-semibold text-white">
                  {HERO_ITEM.tier}
                </span>
                <span className="rounded-sm bg-zinc-800 px-2 py-0.5 text-xs font-semibold text-zinc-200">
                  Grade: {HERO_ITEM.grade}
                </span>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm font-bold text-zinc-50">{HERO_ITEM.title}</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.12em] text-teal-300">
                  {HERO_ITEM.matchPct}% MATCH
                </p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-zinc-50">${HERO_ITEM.resale}</span>
                  <span className="text-sm text-zinc-400 line-through">${HERO_ITEM.retail}</span>
                  <span className="text-xs font-semibold text-teal-300">{heroDiscount}% off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT PREVIEW — rich cards with match tags, grade, badge, before/after price. */}
      <section className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-50 sm:text-3xl">
              The listings behind the numbers
            </h2>
            <p className="mt-3 max-w-[494px] text-base font-normal leading-relaxed text-zinc-300">
              Three items, three categories, one verification standard applied without
              exception.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <ProductPreview />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. VALUE, THREE-WAY SPLIT — the live Marimekko audit. */}
      <section id="audit" className="scroll-mt-20 px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-50 sm:text-3xl">
              Every category, audited the same way
            </h2>
            <p className="mt-3 max-w-[494px] text-base font-normal leading-relaxed text-zinc-300">
              Pick a category. The chart redraws to that category&apos;s real share of
              inventory and its real trust-tier mix — nothing staged for the screenshot.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="mt-8">
              <CategoryAudit selected={selected} onSelect={setSelected} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. SOCIAL PROOF */}
      <section className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-50 sm:text-3xl">
              Buyers compare categories, not just items
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <figure className="h-full min-w-0 rounded-lg border border-zinc-800 bg-zinc-950 p-5">
                  <blockquote className="text-sm leading-relaxed text-zinc-300">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm">
                    <span className="font-semibold text-zinc-100">{t.name}</span>
                    <span className="text-zinc-400"> — {t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLOSING CTA — references the live selection, never a frozen number. */}
      <section className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl rounded-xl border border-zinc-800 bg-zinc-950 p-8 sm:p-12">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-[-0.02em] text-zinc-50 sm:text-3xl">
                  Right now, you&apos;re auditing {current.label}.
                </h2>
                <p className="mt-3 max-w-[494px] text-base font-normal leading-relaxed text-zinc-300">
                  {current.label} runs {current.tierShare.pro}% Verified Pro,{" "}
                  {current.tierShare.id}% ID-Verified and {current.tierShare.new}% New Seller
                  across {formatUnits(current.volume)} live listings — {current.share}% of
                  everything on the platform. Switch categories above and this line updates
                  with it.
                </p>
              </div>
              <a
                href="#audit"
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-teal-600 px-6 py-3 text-sm font-bold text-[#0B0B0F] transition-colors hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
              >
                Browse {current.label} on Repick
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-zinc-800 px-4 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <p className="max-w-[494px] text-base leading-relaxed text-zinc-400">
            One verification bar, checked against every category&apos;s real inventory —
            sneakers, bags, outerwear, electronics and watches alike.
          </p>
        </div>
      </footer>
    </main>
  );
}
