"use client";

import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import {
  discountPct,
  edgesForNeed,
  needById,
  productById,
  type NeedId,
  type ProductId,
} from "./data";
import { ACCENT_BASE, ACCENT_BRIGHT, BODY_14, FOCUS, INK } from "./ui";

type Props = {
  activeNeedId: NeedId;
  activeProductId: ProductId;
  onSelectProduct: (id: ProductId) => void;
};

/**
 * The always-legible text readout of the graph's current focus. This is not a tooltip -- it stays
 * on screen for as long as the need/product pair is active, and it is the thing that actually
 * carries the match data (%, grade, verification, discount, reason) that the graph itself only
 * encodes as line weight and a short numeric label.
 */
export default function MatchDetail({ activeNeedId, activeProductId, onSelectProduct }: Props) {
  const need = needById(activeNeedId);
  const edges = edgesForNeed(activeNeedId);
  const activeEdge = edges.find((e) => e.productId === activeProductId)!;
  const product = productById(activeProductId);
  const discount = discountPct(product);
  const others = edges.filter((e) => e.productId !== activeProductId);

  return (
    <div className="rounded-2xl border border-zinc-800 p-6" style={{ backgroundColor: "#131318" }}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ACCENT_BASE }}>
        Focused need: {need.label}
      </p>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        {/* Not a heading: this sits inside the hero, before the page's first h2, so promoting it
            to h3 here would skip a level (promoted heading-order hard-fail). It's a card title,
            styled like one, without claiming a place in the document outline. */}
        <p className="text-[20px] font-bold tracking-[-0.01em] text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
          {product.name}
        </p>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums"
          style={{ backgroundColor: ACCENT_BRIGHT, color: INK }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.2} />
          {activeEdge.strength}% match
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
          {product.conditionLabel}
        </span>
        {product.verified && (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold text-zinc-200">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} style={{ color: ACCENT_BASE }} />
            Verified seller
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-200">
          ${product.priceNow.toLocaleString("en-US")}{" "}
          <span className="text-zinc-400 line-through">${product.priceOriginal.toLocaleString("en-US")}</span>{" "}
          <span style={{ color: ACCENT_BASE }}>{discount}% off</span>
        </span>
      </div>

      <p className={`mt-4 ${BODY_14}`}>
        <span className="font-semibold text-zinc-100">Why this match: </span>
        {activeEdge.reason}
      </p>

      {others.length > 0 && (
        <div className="mt-5 border-t border-zinc-800 pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
            Also matched on {need.label.toLowerCase()}
          </p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {others.map((e) => {
              const p = productById(e.productId);
              return (
                <li key={e.productId}>
                  <button
                    type="button"
                    onClick={() => onSelectProduct(e.productId)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-white/5 ${FOCUS}`}
                  >
                    <span className="truncate font-normal">{p.name}</span>
                    <span className="flex-none font-semibold tabular-nums" style={{ color: ACCENT_BASE }}>
                      {e.strength}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
