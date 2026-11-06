"use client";

import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { DISPLAY } from "./data";

const STATS = [
  { value: "3,140", label: "weighted comparisons run across repick last quarter" },
  { value: "68%", label: "of those comparisons changed leader after at least one weight moved" },
  { value: "312", label: "sellers currently tracked for a verified trust score" },
];

const QUOTES = [
  {
    text: "I weighted ship speed to zero out of habit and the cheaper listing stopped winning. That's when I actually understood what I was paying for.",
    name: "Priya N.",
    role: "frequent buyer",
  },
  {
    text: "Buyers used to just ask for a discount. Now they ask why my ship time scores an 85 instead of a 100 — I can answer that, and it closes the sale.",
    name: "Marcus D.",
    role: "verified seller",
  },
];

export default function SocialProof() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="border-t border-zinc-100 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
            what the weights change
          </span>
          <h2
            id="proof-heading"
            className="mt-4 max-w-[28rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-4xl"
          >
            A different weight, a different winner
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-8 border-y border-zinc-200 py-8 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <span className="text-3xl font-extrabold tabular-nums text-zinc-950" style={DISPLAY}>
                  {s.value}
                </span>
                <span className="text-sm font-normal leading-[1.6] text-zinc-600">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08}>
              <figure className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
                <Quote className="h-5 w-5 text-[#15803d]" aria-hidden="true" />
                <blockquote className="text-sm font-normal leading-[1.6] text-zinc-700">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="text-xs font-semibold text-zinc-600">
                  {q.name} <span className="font-normal text-zinc-600">· {q.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
