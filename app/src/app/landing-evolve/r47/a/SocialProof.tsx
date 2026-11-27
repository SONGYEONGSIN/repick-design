"use client";

import Image from "next/image";
import { COLORS, EYEBROW, STAT_LABEL } from "./tokens";
import { TESTIMONIALS, TRUST_STATS } from "./data";
import Reveal from "./Reveal";

export default function SocialProof() {
  return (
    <section className="border-t" style={{ borderColor: COLORS.line, backgroundColor: COLORS.bg }}>
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
            Proof, not promises
          </p>
          <h2
            className="mt-3 max-w-[20ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
            style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
          >
            Numbers from the last twelve months.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TRUST_STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06} className="min-w-0 border-l pl-5" >
              <div style={{ borderColor: COLORS.line }}>
                <p
                  className="text-[36px] font-extrabold leading-none tabular-nums"
                  style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
                >
                  {stat.value}
                </p>
                <p className={`mt-2 ${STAT_LABEL}`} style={{ color: COLORS.mutedOnTint }}>
                  {stat.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <Reveal key={t.id} delay={index * 0.08} className="min-w-0">
              <figure
                className="flex h-full min-w-0 flex-col rounded-2xl border p-5"
                style={{ borderColor: COLORS.line }}
              >
                <blockquote className="flex-1 text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.fg }}>
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={`Portrait of ${t.name}`}
                    width={40}
                    height={40}
                    className="h-10 w-10 flex-none rounded-full object-cover"
                    style={{ backgroundColor: COLORS.bgTint }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold" style={{ color: COLORS.fg }}>
                      {t.name}
                    </span>
                    <span className="block text-[12px] font-normal" style={{ color: COLORS.muted }}>
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
