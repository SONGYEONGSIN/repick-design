"use client";

import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { TESTIMONIALS, TRUST_STATS } from "./data";
import { ACCENT, BODY, BORDER, INK, MUTED } from "./tokens";

export function SocialProof() {
  return (
    <section className="border-b px-6 py-20 sm:px-10 lg:px-16" style={{ borderColor: BORDER, backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.28em", color: MUTED }}>
          Fig. 04 — In the field
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {TRUST_STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06} className="min-w-0">
              <p
                className="tabular-nums"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  fontSize: "clamp(1.75rem, 1.3vw + 1.4rem, 2.5rem)",
                  color: INK,
                }}
              >
                {stat.value}
              </p>
              <p className="mt-2 text-[12px] font-semibold uppercase" style={{ letterSpacing: "0.12em", color: MUTED }}>
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="min-w-0">
              <div className="flex h-full flex-col rounded-2xl border p-6" style={{ borderColor: BORDER }}>
                <Quote className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />
                <p className="mt-4 max-w-[300px] flex-1 text-[14px] font-normal leading-[1.6]" style={{ color: BODY }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="mt-5 text-[13px] font-semibold" style={{ color: INK }}>
                  {t.name}
                </p>
                <p className="text-[12px] font-normal" style={{ color: MUTED }}>
                  {t.role}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
