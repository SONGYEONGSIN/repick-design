"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronDown, ShieldCheck, ShieldX, Sparkles } from "lucide-react";
import type { Listing } from "./data";
import { discountPercent } from "./search-math";
import { ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, ACCENT_TINT_TEXT, FOCUS, MUTED_TEXT, PANEL_BORDER } from "./tokens";
import { useMounted } from "./useMounted";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Rich, full-size product card for the standalone Product Preview section. Four
 * distinct badge types sit in rows BELOW the photo, never overlaid on top of it, so
 * a failed/slow image load's fallback alt text never collides with a badge: an
 * AI-match-reasoning tag, a condition-grade chip, a seller-verification badge
 * (always rendered, in either state, rather than hidden when false), and a
 * before/after discount figure. "Details" is a genuine, focusable interaction — a
 * real `<button aria-expanded>`, not a hover-only reveal. The card also lifts
 * slightly on hover/focus (transform/opacity only, reduced-motion gated).
 */
export default function ProductCard({ listing }: { listing: Listing }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();
  const pct = discountPercent(listing);

  return (
    <motion.article
      className={`min-w-0 flex flex-col overflow-hidden rounded-2xl border ${PANEL_BORDER} bg-[#15141C]`}
      whileHover={mounted && !reduceMotion ? { y: -4 } : undefined}
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      <div className="relative aspect-[4/5] w-full shrink-0 bg-[#1D1B24]">
        <Image
          src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=640&q=70`}
          alt={listing.alt}
          fill
          sizes="(min-width: 768px) 280px, 70vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight text-white">
              {listing.title}
            </p>
            <p className={`mt-0.5 text-[12px] font-normal ${MUTED_TEXT}`}>
              {listing.brand} · {listing.category}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular-nums text-[15px] font-extrabold leading-tight text-white">
              ${listing.price}
            </p>
            <p className={`tabular-nums text-[11px] font-normal leading-tight ${MUTED_TEXT} line-through`}>
              ${listing.originalPrice}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex max-w-full items-center gap-1 rounded-full border ${ACCENT_SOFT_BORDER} ${ACCENT_SOFT_BG} px-2 py-0.5 text-[11px] font-semibold ${ACCENT_TINT_TEXT}`}
          >
            <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{listing.aiReasoning}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#1D1B24] px-2 py-0.5 text-[11px] font-semibold text-white`}>
            Grade: {listing.grade}
          </span>

          {listing.verifiedSeller ? (
            <span className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#1D1B24] px-2 py-0.5 text-[11px] font-semibold text-white`}>
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified seller
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#1D1B24] px-2 py-0.5 text-[11px] font-semibold ${MUTED_TEXT}`}
            >
              <ShieldX className="h-3 w-3" aria-hidden="true" />
              Unverified seller
            </span>
          )}

          <span className={`tabular-nums inline-flex items-center gap-1 rounded-full border ${PANEL_BORDER} bg-[#1D1B24] px-2 py-0.5 text-[11px] font-semibold text-white`}>
            {pct}% off retail
          </span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`mt-auto flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-[12px] font-semibold text-white ${FOCUS}`}
        >
          Details
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <p id={panelId} className={`text-[12px] leading-[1.5] ${MUTED_TEXT}`}>
            {listing.verifiedSeller
              ? "This seller's identity and past shipments have been checked by repick."
              : "This seller is new — repick holds the payout until the buyer confirms delivery."}{" "}
            Listed at {listing.grade.toLowerCase()} condition, {pct}% under its original retail
            price.
          </p>
        )}
      </div>
    </motion.article>
  );
}
