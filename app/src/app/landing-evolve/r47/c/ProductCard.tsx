"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { ChevronDown, ShieldCheck, ShieldX, Sparkles } from "lucide-react";
import type { Product } from "./data";
import { ACCENT_SMALL_TEXT, ACCENT_SOFT_BG, ACCENT_SOFT_BORDER, FOCUS, MUTED_TEXT } from "./tokens";

/**
 * Rich product preview card. Four distinct badge types, all in a row BELOW the
 * photo — never overlaid directly on the image, per the brief: AI-match-reasoning
 * tag, condition-grade badge, seller-verification badge (always rendered, in either
 * its verified or unverified state, rather than being hidden when false), and a
 * before/after discount indicator. "Quick look" is the genuine, focusable
 * interaction for this section: a real `<button aria-expanded>`, not a hover-only
 * decoration.
 */
export default function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const discountPct = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  return (
    <article className="min-w-0 flex flex-col overflow-hidden rounded-2xl border border-[#E7E4E3] bg-white">
      <div className="relative aspect-[4/5] w-full shrink-0 bg-[#EFEDEC]">
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=640&q=70`}
          alt={product.alt}
          fill
          sizes="(min-width: 768px) 280px, 70vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold leading-tight text-[#171717]">
              {product.title}
            </p>
            <p className={`mt-0.5 text-[12px] font-normal ${MUTED_TEXT}`}>{product.category}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="tabular-nums text-[15px] font-extrabold leading-tight text-[#171717]">
              ${product.price}
            </p>
            <p
              className={`tabular-nums text-[11px] font-normal leading-tight ${MUTED_TEXT} line-through`}
            >
              ${product.originalPrice}
            </p>
          </div>
        </div>

        {/* Badge row — four distinct signal types, below the photo, never on it. */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex max-w-full items-center gap-1 rounded-full border ${ACCENT_SOFT_BORDER} ${ACCENT_SOFT_BG} px-2 py-0.5 text-[11px] font-semibold ${ACCENT_SMALL_TEXT}`}
          >
            <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{product.aiReasoning}</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E4E3] bg-[#F6F4F4] px-2 py-0.5 text-[11px] font-semibold text-[#171717]">
            Grade: {product.grade}
          </span>

          {product.verifiedSeller ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#E7E4E3] bg-[#F6F4F4] px-2 py-0.5 text-[11px] font-semibold text-[#171717]">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Verified seller
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 rounded-full border border-[#E7E4E3] bg-[#F6F4F4] px-2 py-0.5 text-[11px] font-semibold ${MUTED_TEXT}`}>
              <ShieldX className="h-3 w-3" aria-hidden="true" />
              Unverified seller
            </span>
          )}

          <span className="tabular-nums inline-flex items-center gap-1 rounded-full border border-[#E7E4E3] bg-[#F6F4F4] px-2 py-0.5 text-[11px] font-semibold text-[#171717]">
            {discountPct}% off retail
          </span>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`mt-auto flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-[12px] font-semibold text-[#171717] ${FOCUS}`}
        >
          Quick look
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
        {open && (
          <p id={panelId} className={`text-[12px] leading-[1.5] ${MUTED_TEXT}`}>
            {product.verifiedSeller
              ? "This seller's identity and past shipments have been checked by repick."
              : "This seller is new — repick still holds the payout until the buyer confirms delivery."}{" "}
            Listed at {product.grade.toLowerCase()} condition, {discountPct}% under its original
            retail price.
          </p>
        )}
      </div>
    </article>
  );
}
