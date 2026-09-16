"use client";

import Image from "next/image";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, Tag } from "lucide-react";
import { Reveal } from "./Reveal";
import { discountPct, HERO_LISTING, unsplashUrl } from "./data";
import { ACCENT, ACCENT_BRIGHT, cx, DISPLAY_FONT, FOCUS, NUM } from "./tokens";

export function Hero() {
  const pct = discountPct(HERO_LISTING.retailPrice, HERO_LISTING.listedPrice);

  return (
    <section className="relative overflow-hidden border-b border-[#1C1C22] bg-[#0B0B0F] px-6 pb-16 pt-14 sm:px-10 lg:px-16 lg:pt-20">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left: headline, subhead, single CTA */}
        <div className="min-w-0 lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.28em" }}>
            Fig. 01 &mdash; Matched for you
          </p>
          <h1
            className="mt-5 text-balance text-white"
            style={{
              ...DISPLAY_FONT,
              letterSpacing: "-0.02em",
              fontSize: "clamp(2.5rem, 3.4vw + 1.6rem, 4.25rem)",
              lineHeight: 1.02,
            }}
          >
            Resale, priced with proof.
          </h1>
          <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
            repick matches you to listings its model has already checked for fit, condition and
            authenticity &mdash; and lets sellers type an exact asking price to see, instantly, how
            it changes their odds of selling.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#find"
              className={cx(
                "inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                FOCUS,
              )}
              style={{ backgroundColor: ACCENT }}
            >
              See your matches
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <span className="text-[13px] font-normal text-zinc-400">No account needed to browse.</span>
          </div>
        </div>

        {/* Right: the matched listing itself, with its proof, inside the hero */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal className="overflow-hidden rounded-2xl border border-[#1C1C22] bg-[#111116]">
            <div className="relative aspect-[16/10] w-full bg-[#1C1C22] sm:aspect-[21/9]">
              <Image
                src={unsplashUrl(HERO_LISTING.photoId, 1000)}
                alt={HERO_LISTING.alt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-3 pt-14 sm:px-5">
                <p className={cx("text-[15px] font-semibold text-white", NUM)}>
                  ${HERO_LISTING.listedPrice}{" "}
                  <span className="text-[12px] font-normal text-white/80 line-through">${HERO_LISTING.retailPrice}</span>{" "}
                  <span style={{ color: ACCENT_BRIGHT }}>&minus;{pct}%</span>
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.16em" }}>
                Fig. 02 &mdash; Matched listing
              </p>
              <h2 className="mt-1.5 text-[16px] font-semibold text-white">{HERO_LISTING.title}</h2>

              {/* Proof, in its own row below the photo — never a badge overlaid on the image. */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
                  <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                  {HERO_LISTING.matchPct}% match
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
                  <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                  Grade {HERO_LISTING.grade}
                </span>
                {HERO_LISTING.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
                    <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                    Verified seller
                  </span>
                )}
                <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
                  <Tag className={cx("h-3.5 w-3.5", NUM)} style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
                  &minus;{pct}% vs. retail
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
