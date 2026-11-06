"use client";

import { Star } from "lucide-react";
import Reveal from "./Reveal";

const STATS = [
  { label: "items scanned to date", value: "148,000+" },
  { label: "average scan confidence", value: "93%" },
  { label: "buyer-reported mismatches", value: "<1%" },
];

const TESTIMONIALS = [
  {
    name: "J. Okafor",
    detail: "Field Jacket, Very Good",
    quote: "I watched the scan run before I bought. Every point it flagged matched the jacket in hand.",
  },
  {
    name: "L. Fernandez",
    detail: "Chronograph, Excellent",
    quote: "No guessing — the confidence number only moved once a real check-point confirmed it.",
  },
];

export default function SocialProof() {
  return (
    <section className="border-t border-white/10 bg-white/[0.02] px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal className="grid gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold tabular-nums tracking-[-0.02em] text-white">
                {s.value}
              </p>
              <p className="mt-1 text-sm font-normal text-zinc-400">{s.label}</p>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-12 grid gap-4 sm:grid-cols-2" delay={0.05}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="flex items-center gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-violet-400 text-violet-400" />
                ))}
              </div>
              <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-300">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold text-zinc-400">
                {t.name} · {t.detail}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
