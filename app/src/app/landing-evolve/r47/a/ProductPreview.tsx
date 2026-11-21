"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, ChevronDown } from "lucide-react";
import { COLORS, EYEBROW, CAPTION, FOCUS_RING } from "./tokens";
import { LISTINGS, discountPercent } from "./data";
import Reveal from "./Reveal";

export default function ProductPreview() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="preview" className="border-t" style={{ borderColor: COLORS.line, backgroundColor: COLORS.bg }}>
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Reveal>
          <p className={EYEBROW} style={{ color: COLORS.accentStrong }}>
            Listed this week
          </p>
          <h2
            className="mt-3 max-w-[20ch] text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
            style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
          >
            Every listing ships with its own receipt.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {LISTINGS.map((item, index) => {
            const off = discountPercent(item.priceOriginal, item.priceNow);
            const expanded = expandedId === item.id;
            return (
              <Reveal key={item.id} delay={index * 0.08} className="min-w-0">
                <article
                  className="flex h-full min-w-0 flex-col rounded-2xl border"
                  style={{ borderColor: COLORS.line }}
                >
                  {/* Fixed aspect-ratio + background color so a slow/failed load never collapses
                      the card, and alt text falls into normal flow below instead of colliding
                      with any overlay. */}
                  <div
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl"
                    style={{ backgroundColor: COLORS.bgTint }}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>

                  {/* Badge row sits below the image frame, never overlaid on the photo. */}
                  <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: COLORS.bgTintStrong, color: COLORS.accentStrong }}
                    >
                      Grade {item.grade}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{ backgroundColor: COLORS.bgTintStrong, color: COLORS.accentStrong }}
                    >
                      <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />
                      Verified seller · {item.sellerRating.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-3">
                    <p className={CAPTION} style={{ color: COLORS.mutedOnTint }}>
                      {item.category}
                    </p>
                    <h3 className="mt-1 text-[17px] font-semibold leading-[1.3]" style={{ color: COLORS.fg }}>
                      {item.name}
                    </h3>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span
                        className="text-[20px] font-extrabold tabular-nums"
                        style={{ color: COLORS.fg, fontFamily: "var(--font-display-grotesk)" }}
                      >
                        ${item.priceNow.toLocaleString("en-US")}
                      </span>
                      <span className="text-[13px] font-normal tabular-nums line-through" style={{ color: COLORS.muted }}>
                        ${item.priceOriginal.toLocaleString("en-US")}
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums" style={{ color: COLORS.accentStrong }}>
                        −{off}%
                      </span>
                    </div>

                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={`${item.id}-reason`}
                      onClick={() => setExpandedId((cur) => (cur === item.id ? null : item.id))}
                      className={`mt-3 inline-flex items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors ${FOCUS_RING}`}
                      style={{ backgroundColor: COLORS.bgTint, color: COLORS.accentStrong }}
                    >
                      <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                      Why the AI matched this
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div
                      id={`${item.id}-reason`}
                      className={`overflow-hidden transition-[max-height] motion-reduce:transition-none ${expanded ? "max-h-24" : "max-h-0"}`}
                    >
                      <p className="mt-2 text-[13px] font-normal leading-[1.6]" style={{ color: COLORS.muted }}>
                        {item.matchReason}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
