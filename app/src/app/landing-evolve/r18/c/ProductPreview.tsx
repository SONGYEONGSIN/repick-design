"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { PRODUCT_CARDS, discountPct } from "./data";
import { ACCENT, ACCENT_BRIGHT } from "./Hero";

function ProductCard({ card, index }: { card: (typeof PRODUCT_CARDS)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = discountPct(card.originalPrice, card.price);
  const panelId = `rationale-${card.id}`;

  return (
    <Reveal delay={index * 0.08} className="flex flex-col rounded-2xl border border-[#1C1C22] bg-[#111116]">
      {/* Fixed aspect-ratio box with a background placeholder — layout never collapses on a slow/failed load. */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-[#1C1C22]">
        <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        {/* Discount lives in a bottom scrim over the photo frame, not a floating badge that can collide with fallback alt text. */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-3 pt-8">
          <p className="text-[13px] font-semibold text-white">
            ${card.price.toLocaleString()}{" "}
            <span className="text-[12px] font-normal text-white/60 line-through">${card.originalPrice.toLocaleString()}</span>{" "}
            <span style={{ color: ACCENT_BRIGHT }}>&minus;{pct}%</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase text-[#71717A]" style={{ letterSpacing: "0.16em" }}>
          Fig. {String(index + 2).padStart(2, "0")}
        </p>
        <h3 className="mt-1.5 text-[15px] font-semibold text-white">{card.title}</h3>

        {/* Badges as a plain row below the photo — never absolutely positioned over it. */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-semibold text-white">
            Grade {card.conditionGrade}
          </span>
          {card.sellerVerified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-[#A1A1AA]">
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
              Verified seller
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-[#27272E] px-3 py-2 text-left text-[12px] font-semibold text-white transition-colors duration-150 hover:border-[#3F3F46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ outlineColor: ACCENT_BRIGHT }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
            AI matching rationale
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-[#A1A1AA] transition-transform duration-200 motion-reduce:transition-none"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-hidden="true"
          />
        </button>

        {expanded && (
          <ul id={panelId} className="mt-3 flex flex-col gap-1.5">
            {card.rationale.map((line) => (
              <li key={line} className="flex gap-2 text-[12px] font-normal leading-snug text-[#A1A1AA]">
                <span aria-hidden="true" style={{ color: ACCENT_BRIGHT }}>
                  &middot;
                </span>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  );
}

export function ProductPreview() {
  return (
    <section className="border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="max-w-[492px]">
          <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
            Fig. 02 — Listings
          </p>
          <h2
            className="mt-4 text-white"
            style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1.4vw + 1.5rem, 2.75rem)" }}
          >
            Every card carries its own math.
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            Condition grade, seller verification, and the reasoning behind an AI match sit beside the
            photo, never on top of it.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CARDS.map((card, i) => (
            <ProductCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
