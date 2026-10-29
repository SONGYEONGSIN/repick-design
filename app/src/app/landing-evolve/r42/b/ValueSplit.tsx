"use client";

import { Scale, ShieldCheck, Truck } from "lucide-react";
import Reveal from "./Reveal";

const COLUMNS = [
  {
    icon: Scale,
    title: "Weights you set, not a hidden sort order",
    body: "Repick doesn't rank listings against a fixed, unlabeled formula. The four inputs behind every weighted score are shown plainly, and you decide how much each one counts before any number is final.",
  },
  {
    icon: ShieldCheck,
    title: "Condition graded before it's listed",
    body: "Every grade shown above was confirmed against the seller's submitted photos before the listing went live — the score reflects what arrives, not what's claimed.",
  },
  {
    icon: Truck,
    title: "Shipping time disclosed up front",
    body: "Dispatch windows come from each seller's actual fulfillment history, not an estimate. A faster number here means a faster package, consistently.",
  },
];

export default function ValueSplit() {
  return (
    <section
      id="value"
      aria-labelledby="value-heading"
      className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
            why the inputs hold up
          </span>
          <h2
            id="value-heading"
            className="mt-4 max-w-[28rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-4xl"
          >
            Behind every score, four plain facts
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {COLUMNS.map((col, i) => {
            const Icon = col.icon;
            return (
              <Reveal key={col.title} delay={i * 0.08}>
                <div className="flex flex-col gap-3">
                  <Icon className="h-5 w-5 text-[#15803d]" aria-hidden="true" />
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-zinc-950">{col.title}</h3>
                  <p className="max-w-[22rem] text-sm font-normal leading-[1.6] text-zinc-600">{col.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
