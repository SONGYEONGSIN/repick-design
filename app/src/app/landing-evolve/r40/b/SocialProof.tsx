"use client";

import { Quote } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { value: "48,000+", label: "items graded and matched this year" },
  { value: "94%", label: "of grades confirmed accurate on arrival" },
  { value: "6,200", label: "verified sellers tracked in the open" },
];

const QUOTES = [
  {
    text: "I stopped guessing at seam wear from thumbnail photos. The grade on arrival matched the listing every time I checked.",
    name: "Mara T.",
    role: "frequent buyer",
  },
  {
    text: "My account is the collateral now. Twenty straight accurate grades got me the verified badge — one bad one and it's gone.",
    name: "Dion K.",
    role: "verified seller",
  },
];

export default function SocialProof() {
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="border-t border-white/10 px-4 py-24 sm:px-6 lg:px-10 lg:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-emerald-400">
            trusted on both sides of the trade
          </span>
          <h2
            id="proof-heading"
            className="mt-4 max-w-[28rem] text-3xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white sm:text-4xl"
          >
            Sellers stake their account on these grades
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-8 border-y border-white/10 py-8 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col gap-1.5">
                <span className="font-[family-name:var(--font-display-mono)] text-3xl font-extrabold tabular-nums text-white">
                  {s.value}
                </span>
                <span className="text-sm font-normal leading-[1.6] text-zinc-400">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={i * 0.08}>
              <figure className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <Quote className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                <blockquote className="text-sm font-normal leading-[1.6] text-zinc-300">
                  &ldquo;{q.text}&rdquo;
                </blockquote>
                <figcaption className="text-xs font-semibold text-zinc-400">
                  {q.name} <span className="font-normal text-zinc-400">· {q.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
