"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import Reveal from "./Reveal";
import ProductCard from "./ProductCard";
import { ITEMS } from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399]";

const SHOWCASE_IDS = ["down-parka", "prime-lens"];
const showcase = ITEMS.filter((i) => SHOWCASE_IDS.includes(i.id));

export default function Hero() {
  return (
    <section className="relative px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-28 lg:px-10 lg:pt-32 lg:pb-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10">
        <div>
          <Reveal>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-400">
              repick · ai resale
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-display-mono)] text-[clamp(2.25rem,9vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white lg:text-[clamp(3.5rem,5.5vw,5.5rem)]">
              Resale that grades itself before you buy.
            </h1>
            <p className="mt-6 max-w-[30rem] text-base font-normal leading-[1.6] text-zinc-400">
              Every listing on repick is scored for condition, checked against a seller&rsquo;s
              track record, and priced against what items like it actually sold for — before it
              ever reaches your search results.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#sweep"
                className={`inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-[#0B0B0F] transition-colors duration-200 hover:bg-emerald-400 ${FOCUS}`}
              >
                Start matching
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm font-normal text-zinc-400">
                No account needed to browse.
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
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
