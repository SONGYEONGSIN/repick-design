"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "./data";

const navBtnClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

// Real navigation, not a decorative auto-scroller: prev/next cycle a fixed deterministic index,
// dots jump directly, and the swapped content is wrapped in aria-live so screen reader users get
// the same update sighted users see instead of only the moved-focus.
export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const current = testimonials[index];

  const go = (delta: number) => setIndex((prev) => (prev + delta + count) % count);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div aria-live="polite" className="min-h-[176px] sm:min-h-[144px]">
        <div className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={[
                "h-3.5 w-3.5",
                i < current.rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-800 text-zinc-800",
              ].join(" ")}
            />
          ))}
        </div>
        <p className="sr-only">{current.rating} out of 5 stars.</p>
        <p className="mt-3 text-base font-normal text-zinc-100 sm:text-lg">
          &ldquo;{current.quote}&rdquo;
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-800">
            <Image
              src={`https://picsum.photos/seed/${current.avatarSeed}/96/96`}
              alt=""
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100">{current.name}</p>
            <p className="text-xs font-normal text-zinc-400">
              {current.role}, {current.company}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-1.5">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === index}
              className="flex h-6 w-6 flex-none items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span
                aria-hidden="true"
                className={[
                  "h-1.5 rounded-full transition-[width,background-color] duration-200 motion-reduce:transition-none",
                  i === index ? "w-5 bg-amber-400" : "w-1.5 bg-zinc-700",
                ].join(" ")}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => go(-1)} aria-label="Previous testimonial" className={navBtnClass}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next testimonial" className={navBtnClass}>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
