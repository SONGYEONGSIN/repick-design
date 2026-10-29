"use client";

import { Star } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { label: "match quizzes completed", value: "62,000+" },
  { label: "average match score", value: "91%" },
  { label: "buyer-reported mismatches", value: "<1%" },
];

const TESTIMONIALS = [
  {
    name: "A. Novak",
    detail: "Footwear, Excellent",
    quote: "Three taps and the trail runner it found was exactly my size and budget.",
  },
  {
    name: "T. Brennan",
    detail: "Outerwear, Like New",
    quote: "Setting the condition floor myself meant no surprises when it arrived.",
  },
];

export default function SocialProof() {
  return (
    <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-zinc-950">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-normal text-zinc-600">{s.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2" delay={0.05}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-orange-700 text-orange-700" />
                ))}
              </div>
              <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-zinc-600">
                {t.name} · {t.detail}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
