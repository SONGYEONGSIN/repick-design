"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { BadgeCheck, ChevronDown, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { discountPct, PREVIEW_LISTINGS, unsplashUrl, type PreviewListing } from "./data";
import { ACCENT_BRIGHT, cx, FOCUS, NUM } from "./tokens";

function PreviewCard({ listing, index }: { listing: PreviewListing; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const pct = discountPct(listing.retailPrice, listing.listedPrice);

  return (
    <Reveal delay={index * 0.08} className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#1C1C22] bg-[#111116]">
      <div className="relative aspect-[4/3] w-full bg-[#1C1C22]">
        <Image
          src={unsplashUrl(listing.photoId, 700)}
          alt={listing.alt}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-4 pb-3 pt-10">
          <p className={cx("text-[14px] font-semibold text-white", NUM)}>
            ${listing.listedPrice}{" "}
            <span className="text-[11.5px] font-normal text-white/80 line-through">${listing.retailPrice}</span>{" "}
            <span style={{ color: ACCENT_BRIGHT }}>&minus;{pct}%</span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[15px] font-semibold leading-snug text-white">{listing.title}</h3>

        {/* Proof lives in its own row, never overlaid on the photo above. */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
            <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
            {listing.matchPct}% match
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
            <BadgeCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
            Grade {listing.grade}
          </span>
          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#27272E] px-2.5 py-1 text-[11px] font-normal text-zinc-300">
              <ShieldCheck className="h-3.5 w-3.5" style={{ color: ACCENT_BRIGHT }} aria-hidden="true" />
              Verified seller
            </span>
          )}
        </div>

        <ul className="mt-4 flex flex-col gap-1.5">
          {listing.primaryTags.map((tag) => (
            <li key={tag} className="text-[12.5px] font-normal leading-snug text-zinc-400">
              {tag}
            </li>
          ))}
        </ul>

        <ul id={panelId} hidden={!expanded} className="mt-1.5 flex flex-col gap-1.5">
          {listing.moreTags.map((tag) => (
            <li key={tag} className="text-[12.5px] font-normal leading-snug text-zinc-400">
              {tag}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className={cx(
            "mt-4 inline-flex min-h-[24px] items-center gap-1.5 self-start rounded-full px-1 py-1.5 text-[12px] font-semibold text-zinc-300 transition-colors duration-150 hover:text-white",
            FOCUS,
          )}
        >
          {expanded ? "Show fewer match signals" : `Show ${listing.moreTags.length} more match signals`}
          <ChevronDown className={cx("h-3.5 w-3.5 transition-transform duration-200", expanded && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
    </Reveal>
  );
}

export function ProductPreview() {
  return (
    <section id="find" className="scroll-mt-24 border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[11px] font-semibold uppercase text-zinc-400" style={{ letterSpacing: "0.28em" }}>
          Fig. 03 &mdash; Matched listings
        </p>
        <h2
          className="mt-4 max-w-[720px] text-white"
          style={{ fontFamily: "var(--font-display-wide)", fontWeight: 800, letterSpacing: "-0.015em", fontSize: "clamp(1.75rem, 1.6vw + 1.3rem, 2.5rem)", lineHeight: 1.08 }}
        >
          Every match ships with its evidence.
        </h2>
        <p className="mt-4 max-w-[493px] text-[16px] font-normal leading-[1.6] text-zinc-400">
          Condition grade, seller verification and the discount off retail sit next to every
          listing by default. Open a card for the full list of signals behind its match score.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PREVIEW_LISTINGS.map((listing, index) => (
            <PreviewCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
