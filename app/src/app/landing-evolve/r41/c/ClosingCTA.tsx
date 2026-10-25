"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { formatPrice, type PoolItem } from "./data";

export default function ClosingCTA({ best }: { best: PoolItem | null }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center sm:p-14">
            {best ? (
              <>
                <p className="text-sm font-normal text-zinc-600">Your current match</p>
                <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-zinc-950">
                  {best.name} at {best.matchBase}%
                </h2>
                <p className="mt-3 text-sm font-normal text-zinc-600">
                  {formatPrice(best.price)} · &minus;{best.discountPct}% vs retail ·{" "}
                  {best.grade}
                </p>
                <a
                  href="#quiz"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  Lock in this match
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm font-normal text-zinc-600">No match yet</p>
                <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-zinc-950">
                  Widen a filter to find your match
                </h2>
                <a
                  href="#quiz"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  Back to the quiz
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
