'use client';

import { useId, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import Reveal from './Reveal';
import { filteredPrices, computeBoxStats } from './data';

interface ClosingCtaProps {
  minPrice: number;
  maxPrice: number;
}

export default function ClosingCta({ minPrice, maxPrice }: ClosingCtaProps) {
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();

  const goodStats = useMemo(
    () => computeBoxStats(filteredPrices('good', minPrice, maxPrice)),
    [minPrice, maxPrice],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  const ctaLabel = goodStats
    ? `Browse comps $${minPrice}–$${maxPrice}`
    : 'Widen your range to see comps';

  return (
    <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <Reveal>
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2
                className="text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold tracking-[-0.02em] text-zinc-900"
                style={{ fontFamily: 'var(--font-display-wide)' }}
              >
                Your range, your comps.
              </h2>
              <p className="mt-4 max-w-[520px] text-[17px] leading-[1.6] text-zinc-600">
                {goodStats
                  ? `Within $${minPrice}–$${maxPrice}, Good-grade Sneakers are closing at a median of $${goodStats.median} across ${goodStats.count} comparable sales. Every listing you open carries this same breakdown.`
                  : `There are no Good-grade comps between $${minPrice} and $${maxPrice} yet — widen the range in the chart above and this section updates with it.`}
              </p>
              <div className="mt-7">
                <a
                  href="#listings"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-[14px] font-semibold tabular-nums text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  {ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                <h3 className="text-[14px] font-semibold text-zinc-900">
                  Get an alert in this range
                </h3>
                <p className="mt-1 text-[13px] leading-[1.5] text-zinc-600">
                  We will email you when a new Sneakers listing sells inside $
                  {minPrice}–${maxPrice}.
                </p>
                {submitted ? (
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-[13px] text-sky-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                    <span>
                      Alert saved for ${minPrice}–${maxPrice}. Nothing else gets sent.
                    </span>
                  </div>
                ) : (
                  <form className="mt-4" onSubmit={handleSubmit}>
                    <label htmlFor={emailId} className="text-[12px] font-semibold text-zinc-700">
                      Email address
                    </label>
                    <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 has-[:focus-visible]:border-sky-600">
                      <Mail className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
                      <input
                        id={emailId}
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full min-w-0 bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-3 w-full rounded-lg bg-zinc-900 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    >
                      Save this price alert
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
