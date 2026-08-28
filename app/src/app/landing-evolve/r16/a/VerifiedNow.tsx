"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Armchair,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Lamp,
  Luggage,
  Shirt,
} from "lucide-react";
import { LISTINGS, discountPercent, type ListingCategory } from "./data";
import { ACCENT_TEXT } from "./theme";

const CATEGORY_ICON: Record<ListingCategory, typeof Shirt> = {
  coat: Shirt,
  bag: Luggage,
  lamp: Lamp,
  dresser: Armchair,
};

export default function VerifiedNow() {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const total = LISTINGS.length;

  function scrollToIndex(next: number) {
    const clamped = Math.min(Math.max(next, 0), total - 1);
    const track = trackRef.current;
    const card = track?.children[clamped] as HTMLElement | undefined;
    if (track && card) {
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: shouldReduceMotion ? "auto" : "smooth",
      });
    }
    setIndex(clamped);
  }

  return (
    <section
      id="verified-now"
      aria-labelledby="verified-heading"
      className="border-b border-zinc-200 bg-zinc-50 px-6 py-16 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              id="verified-heading"
              className="text-2xl font-extrabold tracking-[-0.02em] text-zinc-900 sm:text-3xl"
            >
              What we surface differently now
            </h2>
            <p className="mt-3 max-w-[32rem] text-base leading-[1.6] text-zinc-600">
              Four listings live on repick right now, shown with the same
              proof this report holds us to: match score, condition grade,
              seller verification, and the price change from original
              listing.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p
              aria-live="polite"
              className="text-sm font-normal text-zinc-500 tabular-nums"
            >
              {index + 1} / {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollToIndex(index - 1)}
                disabled={index === 0}
                aria-label="Show previous listing"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] disabled:opacity-30 hover:enabled:border-zinc-500 hover:enabled:text-zinc-900"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToIndex(index + 1)}
                disabled={index === total - 1}
                aria-label="Show next listing"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 text-zinc-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C2410C] disabled:opacity-30 hover:enabled:border-zinc-500 hover:enabled:text-zinc-900"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <ul
          ref={trackRef}
          role="list"
          className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {LISTINGS.map((listing, i) => {
            const Icon = CATEGORY_ICON[listing.category];
            const discount = discountPercent(listing.priceNow, listing.priceWas);
            return (
              <motion.li
                key={listing.id}
                className="min-w-[260px] max-w-[260px] shrink-0 snap-start rounded-2xl border border-zinc-200 bg-white"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              >
                <div
                  className="flex items-center justify-center rounded-t-2xl bg-zinc-100"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <Icon aria-hidden="true" className="h-12 w-12 text-zinc-500" />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold leading-snug text-zinc-900">
                    {listing.title}
                  </h3>

                  <ul role="list" className="mt-3 flex flex-wrap gap-1.5">
                    <li className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-normal text-zinc-700 tabular-nums tracking-[0.12em]">
                      {listing.matchPercent}% match
                    </li>
                    <li className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-normal text-zinc-700">
                      {listing.grade}
                    </li>
                    {listing.verified && (
                      <li className="flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-normal text-zinc-700">
                        <BadgeCheck
                          aria-hidden="true"
                          className="h-3.5 w-3.5"
                          style={{ color: ACCENT_TEXT }}
                        />
                        Verified seller
                      </li>
                    )}
                  </ul>

                  <div className="mt-3 flex items-baseline gap-2">
                    <p className="text-base font-semibold text-zinc-900 tabular-nums">
                      ${listing.priceNow}
                    </p>
                    <p className="text-xs font-normal text-zinc-500 line-through tabular-nums">
                      ${listing.priceWas}
                    </p>
                    <p
                      className="text-xs font-semibold tabular-nums"
                      style={{ color: ACCENT_TEXT }}
                    >
                      &minus;{discount}%
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
