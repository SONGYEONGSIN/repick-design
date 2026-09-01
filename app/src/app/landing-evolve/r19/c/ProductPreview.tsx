"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { PRODUCT_CARDS, discountPct } from "./data";
import type { ProductCard as ProductCardData } from "./data";
import { ACCENT, BODY, BORDER, INK, MUTED, MUTED_STRONG, SURFACE } from "./tokens";

function ProductCard({ card, index }: { card: ProductCardData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const pct = discountPct(card.originalPrice, card.price);
  const panelId = `rationale-${card.id}`;

  return (
    <Reveal delay={index * 0.08} className="min-w-0">
      <div className="flex h-full flex-col rounded-2xl border" style={{ borderColor: BORDER }}>
        {/* Fixed aspect-ratio box with a background placeholder — layout never collapses on a slow/failed load. */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl" style={{ backgroundColor: SURFACE }}>
          <Image src={card.image} alt={card.imageAlt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
          {/* Discount lives in a bottom scrim over the photo frame, not a floating badge that can collide with alt text. */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pt-10 pb-3">
            <p className="text-[13px] font-semibold text-white tabular-nums">
              ${card.price.toLocaleString()}{" "}
              <span className="text-[12px] font-normal text-white/85 line-through">${card.originalPrice.toLocaleString()}</span>{" "}
              <span className="text-white">&minus;{pct}%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.16em", color: MUTED }}>
            Fig. {String(index + 2).padStart(2, "0")}
          </p>
          <h3 className="mt-1.5 text-[15px] font-semibold" style={{ color: INK }}>
            {card.title}
          </h3>

          {/* Badges as a plain row below the photo — never absolutely positioned over it. */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold" style={{ borderColor: "#D4D4D8", color: INK }}>
              Grade {card.conditionGrade}
            </span>
            {card.sellerVerified && (
              <span
                className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-normal"
                style={{ borderColor: "#D4D4D8", color: MUTED_STRONG }}
              >
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
                Verified seller
              </span>
            )}
            <span className="ml-auto text-[11px] font-semibold tabular-nums" style={{ color: ACCENT }}>
              {card.matchPct}% match
            </span>
          </div>

          {/* AI match-reasoning tags — visible by default, not hidden behind the disclosure. */}
          <ul className="mt-3 flex flex-col gap-1">
            {card.tags.map((tag) => (
              <li key={tag} className="flex items-start gap-1.5 text-[12px] leading-snug" style={{ color: BODY }}>
                <span aria-hidden="true" style={{ color: ACCENT }}>
                  &middot;
                </span>
                {tag}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={panelId}
            className="mt-4 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-[12px] font-semibold transition-colors duration-150 hover:bg-[#F4F4F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ borderColor: "#D4D4D8", color: INK, outlineColor: ACCENT }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} aria-hidden="true" />
              Full AI matching rationale
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none"
              style={{ color: MUTED, transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <ul id={panelId} className="mt-3 flex flex-col gap-1.5">
              {card.rationale.map((line) => (
                <li key={line} className="flex gap-2 text-[12px] font-normal leading-snug" style={{ color: MUTED_STRONG }}>
                  <span aria-hidden="true" style={{ color: ACCENT }}>
                    &middot;
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Reveal>
  );
}

export function ProductPreview() {
  return (
    <section className="border-b px-6 py-20 sm:px-10 lg:px-16" style={{ borderColor: BORDER, backgroundColor: "#FFFFFF" }}>
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="max-w-[520px]">
          <p className="text-[11px] font-semibold uppercase" style={{ letterSpacing: "0.28em", color: MUTED }}>
            Fig. 02 — Listings
          </p>
          <h2
            className="mt-4"
            style={{ fontFamily: "var(--font-display-mono)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.5rem, 1.1vw + 1.3rem, 2.25rem)", color: INK }}
          >
            Every card carries its own trail.
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-[1.6]" style={{ color: BODY }}>
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
