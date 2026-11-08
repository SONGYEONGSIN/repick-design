"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { PLATFORM_STATS, TESTIMONIALS } from "./data";
import { BORDER, GHOST, INK, MEASURE_15, MUTED } from "./tokens";

export default function SocialProof() {
  return (
    <section id="proof" className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="relative flex items-end gap-4">
          <span
            aria-hidden="true"
            className="pointer-events-none select-none shrink-0 font-semibold"
            style={{ color: GHOST, fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1, letterSpacing: "0.04em" }}
          >
            04
          </span>
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.6vw,2.5rem)] font-extrabold" style={{ fontFamily: "var(--font-display-wide)", color: INK, letterSpacing: "-0.02em" }}>
              Sellers and buyers rank it their own way
            </h2>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <figure className="h-full min-w-0 rounded-2xl p-5" style={{ border: `1px solid ${BORDER}`, backgroundColor: "#FFFFFF" }}>
                <Quote className="h-5 w-5" style={{ color: GHOST }} aria-hidden="true" />
                <blockquote className="mt-3 font-normal leading-[1.6]" style={{ color: INK, fontSize: "15px", maxWidth: MEASURE_15 }}>
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 flex min-w-0 items-center gap-3">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full" style={{ backgroundColor: "#F4F4F5" }}>
                    <Image
                      src={`https://images.unsplash.com/photo-${t.photoId}?auto=format&fit=crop&w=96&h=96&q=80`}
                      alt={`Portrait of ${t.name}`}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-extrabold" style={{ color: INK }}>
                      {t.name}
                    </p>
                    <p className="truncate text-[12px] font-normal" style={{ color: MUTED }}>
                      {t.context}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t pt-8 sm:grid-cols-4" style={{ borderColor: BORDER }}>
          {PLATFORM_STATS.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className="text-[26px] font-extrabold" style={{ fontFamily: "var(--font-display-wide)", color: INK }}>
                {stat.value}
              </p>
              <p className="mt-1 font-normal leading-[1.5]" style={{ color: MUTED, fontSize: "12.5px" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
