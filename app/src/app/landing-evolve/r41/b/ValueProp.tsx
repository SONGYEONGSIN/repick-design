"use client";

import { ScanLine, ShieldCheck, Tag } from "lucide-react";
import Reveal from "./Reveal";

export default function ValueProp({
  confidencePct,
  itemName,
}: {
  confidencePct: number;
  itemName: string;
}) {
  return (
    <section className="border-t border-white/10 px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-violet-400">
            what backs the scan
          </span>
          <h2 className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl">
            Every point checked, nothing assumed.
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid gap-10 sm:grid-cols-3" delay={0.05}>
          <div>
            <ScanLine className="h-5 w-5 text-violet-400" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-white">
              Computer-vision scanning
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-400">
              Photos are checked point by point against reference images for
              wear, damage and finish before a listing ever goes live.
            </p>
          </div>
          <div>
            <ShieldCheck className="h-5 w-5 text-violet-400" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-white">
              Your current scan: {confidencePct}%
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-400">
              At your current scan position on {itemName}, {confidencePct}% of
              the condition checklist has been confirmed — drag further to
              confirm the rest.
            </p>
          </div>
          <div>
            <Tag className="h-5 w-5 text-violet-400" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-white">
              Dynamic resale pricing
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-400">
              Price is set against what items at the same condition actually
              sold for, recalculated as each check-point confirms.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
