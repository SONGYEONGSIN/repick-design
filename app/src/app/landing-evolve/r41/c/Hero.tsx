"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { HERO_SHOWCASE_IDS, POOL } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700";

const showcase = POOL.filter((i) => HERO_SHOWCASE_IDS.includes(i.id));

export default function Hero() {
  return (
    <section className="relative px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-28 lg:px-10 lg:pt-32 lg:pb-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
        <div>
          <Reveal>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange-700">
              repick · build your match
            </span>
            <h1 className="mt-5 text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950 lg:text-[clamp(3.5rem,5.5vw,5.5rem)]">
              Answer three questions. Get one exact match.
            </h1>
            <p className="mt-6 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-600">
              Every listing on repick is scored for condition, checked against
              a seller&rsquo;s track record, and priced against what items
              like it actually sold for — pick your category, budget and
              condition floor below to find yours.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#quiz"
                className={`inline-flex items-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-800 ${FOCUS}`}
              >
                Find my match
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm font-normal text-zinc-600">
                No account needed to browse.
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-600">
              <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
              AI match preview
            </div>
            <div className="grid grid-cols-2 gap-4">
              {showcase.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
