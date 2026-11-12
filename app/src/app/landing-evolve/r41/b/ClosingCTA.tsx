"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { formatPrice, type ScanItem } from "./data";

export default function ClosingCTA({
  item,
  revealedCount,
  total,
  confidencePct,
}: {
  item: ScanItem;
  revealedCount: number;
  total: number;
  confidencePct: number;
}) {
  const done = revealedCount >= total;

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-14">
            <p className="text-sm font-normal text-zinc-400">
              {done ? "Scan complete" : "Scan in progress"}
            </p>
            <h2 className="mt-2 text-[clamp(1.5rem,5vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-white">
              {item.name}: {revealedCount} of {total} points, {confidencePct}%
              confidence
            </h2>
            <p className="mt-3 text-sm font-normal text-zinc-400">
              {formatPrice(item.price)} · -{item.discountPct}% vs retail ·{" "}
              {item.grade}
            </p>
            <a
              href="#scan"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-violet-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
            >
              {done ? "View this listing" : "Finish the scan"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
