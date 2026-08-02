"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cx, FOCUS, TESTIMONIALS } from "./data";

/** A manually-navigated testimonial carousel — no autoplay, so nothing moves without the visitor
 * asking it to and there's nothing for prefers-reduced-motion to fight. Previous/next buttons and
 * the dot indicators all point at the same index, and the live quote sits in an aria-live region so
 * assistive tech hears the change without needing to re-find the panel. */
export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  function go(delta: number) {
    setIndex((i) => (i + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <section aria-labelledby="proof-heading" className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="proof-heading" className="text-xl font-semibold text-zinc-50">
          Trusted by fast-moving teams
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100",
              FOCUS,
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className={cx(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-100",
              FOCUS,
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        aria-live="polite"
        className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8"
      >
        <Quote className="h-6 w-6 text-sky-500" aria-hidden="true" />
        <p className="mt-3 max-w-prose text-base font-normal leading-relaxed text-zinc-200 sm:text-lg">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="mt-5 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300"
          >
            {t.initials}
          </span>
          <p className="text-sm font-normal text-zinc-400">
            <span className="font-medium text-zinc-100">{t.name}</span>, {t.role} at {t.company}
          </p>
        </div>
      </div>

      <div role="tablist" aria-label="Choose testimonial" className="mt-3 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((item, i) => (
          <button
            key={item.company}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Testimonial from ${item.company}`}
            onClick={() => setIndex(i)}
            className={cx(
              "flex h-6 w-6 flex-none items-center justify-center rounded-full",
              FOCUS,
            )}
          >
            <span
              aria-hidden="true"
              className={cx(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-sky-500" : "w-1.5 bg-zinc-700",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
