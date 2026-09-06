"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import Reveal from "./Reveal";
import { CATEGORIES, LISTINGS, discountPct, type Answers, type Listing } from "./data";

function ProductCard({ listing, highlighted }: { listing: Listing; highlighted: boolean }) {
  const category = CATEGORIES.find((c) => c.id === listing.category);
  const pct = discountPct(listing.original, listing.current);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`min-w-0 rounded-2xl border bg-white p-4 ${
        highlighted ? "border-[#1F7A5C]" : "border-zinc-200"
      }`}
    >
      {highlighted && (
        <p className="mb-2 inline-flex items-center gap-1 text-[12px] font-medium text-[#1F7A5C]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Matches your search
        </p>
      )}

      <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 rounded-xl bg-zinc-100">
        <CategoryIcon icon={listing.icon} className="h-10 w-10 text-zinc-500" strokeWidth={1.5} aria-hidden="true" />
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600">
          {category?.noun ?? "item"}
        </span>
      </div>

      <h3 className="mt-3 truncate text-[15px] font-bold tracking-[-0.02em] text-[#121214]">{listing.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
          <ShieldCheck className="h-3 w-3 text-[#1F7A5C]" aria-hidden="true" />
          Verified
        </span>
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-bold text-[#121214]">
          Grade {listing.grade}
        </span>
      </div>

      <ul className="mt-2 space-y-1">
        {listing.tags.map((tag) => (
          <li key={tag} className="flex items-start gap-1.5 text-[12px] leading-[1.5] text-zinc-600">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-[#1F7A5C]" aria-hidden="true" />
            <span className="min-w-0">{tag}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-zinc-200 pt-3">
        <span className="text-[12px] text-zinc-500 line-through tabular-nums">${listing.original.toLocaleString("en-US")}</span>
        <span className="text-[16px] font-bold tabular-nums tracking-[-0.02em] text-[#121214]">
          ${listing.current.toLocaleString("en-US")}
        </span>
        <span className="rounded-full bg-[#1F7A5C] px-2 py-0.5 text-[11px] font-medium text-white tabular-nums">-{pct}%</span>
      </div>
    </motion.div>
  );
}

export default function ProductGrid({ answers }: { answers: Answers }) {
  const activeCategory = answers.category ? CATEGORIES.find((c) => c.id === answers.category) : undefined;
  const heading = activeCategory
    ? `Comparable ${activeCategory.label.toLowerCase()} listings selling right now`
    : "Comparable listings selling right now";

  return (
    <section id="listings" className="bg-white px-6 py-24 lg:px-10 lg:py-32 xl:px-16">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <div className="max-w-[540px]">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#1F7A5C]">Live on repick</p>
            <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-bold tracking-[-0.02em] text-[#121214]">{heading}</h2>
            <p className="mt-4 text-[18px] font-normal leading-[1.6] text-zinc-600">
              Every listing carries the same evidence trail as your estimate above: verified condition,
              comparable sales and an AI match score.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {LISTINGS.map((listing, i) => (
            <Reveal key={listing.id} delay={i * 0.06} className="min-w-0">
              <ProductCard listing={listing} highlighted={listing.category === answers.category} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
