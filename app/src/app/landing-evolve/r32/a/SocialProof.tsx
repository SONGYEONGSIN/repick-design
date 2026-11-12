'use client';

import { Quote } from 'lucide-react';
import Reveal from './Reveal';
import { TESTIMONIALS, STAT_ITEMS } from './data';

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <div className="max-w-[640px]">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">
            From people who sold and bought here
          </div>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.02em] text-zinc-900"
            style={{ fontFamily: 'var(--font-display-wide)' }}
          >
            The distribution changes decisions.
          </h2>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {TESTIMONIALS.map((t, index) => (
          <Reveal key={t.name} delay={index * 0.08} className="min-w-0">
            <figure className="flex h-full min-w-0 flex-col rounded-2xl border border-zinc-200 p-6">
              <Quote className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <blockquote className="mt-3 flex-1 text-[15px] leading-[1.6] text-zinc-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-[12px] font-semibold text-white"
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-zinc-900">{t.name}</span>
                  <span className="block text-[12px] text-zinc-500">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <dl className="mt-12 grid grid-cols-1 gap-6 border-t border-zinc-200 pt-10 sm:grid-cols-3">
          {STAT_ITEMS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[13px] leading-[1.5] text-zinc-600">{stat.label}</dt>
              <dd className="mt-1 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tabular-nums tracking-[-0.02em] text-zinc-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
