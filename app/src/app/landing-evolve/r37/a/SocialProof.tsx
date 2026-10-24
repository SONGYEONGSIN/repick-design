'use client';

import Reveal from './Reveal';
import { COLORS, TESTIMONIALS, TRUST_STATS } from './data';

export default function SocialProof() {
  return (
    <section id="proof" className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="mb-10 flex flex-col gap-3 sm:max-w-[500px]">
          <h2
            className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[32px]"
            style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}
          >
            Sellers checked their own estimate before listing.
          </h2>
        </div>
      </Reveal>

      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {TRUST_STATS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex h-full flex-col gap-1 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <p className="tabular-nums text-[32px] font-extrabold leading-none tracking-[-0.02em]" style={{ fontFamily: 'var(--font-display-grotesk)', color: COLORS.fg }}>
                {stat.value}
              </p>
              <p className="text-[14px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.id} delay={0.1 + i * 0.08}>
            <figure className="flex h-full flex-col gap-4 rounded-2xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.surfaceLine}` }}>
              <blockquote className="text-[15px] font-normal leading-[1.6]" style={{ color: COLORS.fg }}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold" style={{ backgroundColor: COLORS.surfaceLine, color: COLORS.accentTint }}>
                  {t.initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-[13px] font-semibold" style={{ color: COLORS.fg }}>
                    {t.name}
                  </span>
                  <span className="text-[12px] font-normal" style={{ color: COLORS.muted }}>
                    {t.context}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
