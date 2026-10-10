'use client';

import { Quote } from 'lucide-react';
import Reveal from './Reveal';
import { PROOF_STATS, TESTIMONIALS } from './data';

export default function SocialProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
      <Reveal>
        <div className="grid grid-cols-1 gap-8 border-y border-zinc-200 py-10 sm:grid-cols-3">
          {PROOF_STATS.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <p className="font-mono text-3xl font-extrabold tabular-nums text-zinc-900">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex min-w-0 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6"
            >
              <div>
                <Quote size={18} strokeWidth={2} className="text-[#4d7c0f]" aria-hidden="true" />
                <blockquote className="mt-3 text-sm leading-[1.6] text-zinc-700">{t.quote}</blockquote>
              </div>
              <figcaption className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">
                {t.name} · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
