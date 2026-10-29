"use client";

import { ScanLine, ShieldCheck, Tag } from "lucide-react";
import Reveal from "./Reveal";

export default function ValueProp({
  category,
  matchLabel,
}: {
  category: string;
  matchLabel: string;
}) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange-700">
            what backs the number
          </span>
          <h2 className="mt-4 max-w-[30rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-4xl">
            Behind your {category.toLowerCase()} match
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid gap-10 sm:grid-cols-3" delay={0.05}>
          <div>
            <ScanLine className="h-5 w-5 text-orange-700" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">
              Computer-vision grading
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
              Every photo is scored against reference images for wear, damage
              and finish before a listing ever goes live.
            </p>
          </div>
          <div>
            <ShieldCheck className="h-5 w-5 text-orange-700" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">
              {matchLabel}
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
              This is your live pick for the category, budget and condition
              floor you just set — change any answer above and it recalculates.
            </p>
          </div>
          <div>
            <Tag className="h-5 w-5 text-orange-700" aria-hidden="true" />
            <h3 className="mt-3 text-sm font-semibold text-zinc-950">
              Dynamic resale pricing
            </h3>
            <p className="mt-2 text-sm font-normal leading-[1.6] text-zinc-600">
              Prices are set against what items at the same condition actually
              sold for, not a fixed markdown.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
