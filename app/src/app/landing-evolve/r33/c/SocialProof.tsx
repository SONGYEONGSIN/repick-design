"use client";

import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { STATS, TESTIMONIALS } from "./data";
import { ACCENT_TINT, BORDER_SOFT, MUTED, PANEL_BG } from "./theme";

export default function SocialProof() {
  return (
    <section id="trust" className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <h2
            className="max-w-[22em] text-3xl font-extrabold tracking-[-0.02em] text-white sm:text-4xl"
            style={{ fontFamily: "var(--font-display-mono)" }}
          >
            People check the line too.
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mt-3 max-w-[32em] text-base leading-[1.6]" style={{ color: MUTED }}>
            An independent read from buyers and sellers who have watched their own listings move
            it.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STATS.map((stat, i) => (
            <Reveal key={stat.id} delay={i * 0.05}>
              <div
                className="rounded-2xl border p-5"
                style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
              >
                <p
                  className="tabular-nums font-extrabold leading-none text-white"
                  style={{ fontFamily: "var(--font-display-mono)", fontSize: "2.25rem" }}
                >
                  {stat.value}
                </p>
                <p className="mt-2 max-w-[22em] text-sm leading-[1.6]" style={{ color: MUTED }}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <figure
                className="flex h-full flex-col rounded-2xl border p-5"
                style={{ borderColor: BORDER_SOFT, backgroundColor: PANEL_BG }}
              >
                <Quote aria-hidden="true" className="h-4 w-4" style={{ color: ACCENT_TINT }} />
                <blockquote className="mt-3 flex-1 text-sm leading-[1.6] text-white/90">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-4 text-xs" style={{ color: MUTED }}>
                  <span className="font-semibold text-white">{item.name}</span> — {item.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
