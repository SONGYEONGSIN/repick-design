"use client";

import { useId, useState } from "react";
import { FOCUS, Pill } from "./ui";

export interface ProductCardData {
  id: string;
  name: string;
  meta: string;
  categoryGhost: string;
  price: number;
  originalPrice: number;
  grade: string;
  gradeLabel: string;
  sellerRating: number;
  reasons: readonly string[];
  signals: readonly [
    { label: string; raw: number },
    { label: string; raw: number },
    { label: string; raw: number },
  ];
  isLive?: boolean;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const [open, setOpen] = useState(false);
  const detailId = useId();
  const discount = Math.round(100 - (product.price / product.originalPrice) * 100);
  const ranked = [...product.signals].sort((a, b) => b.raw - a.raw);
  const [top, mid, low] = ranked;

  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-2xl bg-zinc-900">
        <span
          aria-hidden="true"
          className="select-none text-[clamp(1.75rem,6vw,2.75rem)] font-bold tracking-[-0.02em] text-[#71717A]"
        >
          {product.categoryGhost}
        </span>
        {product.isLive && (
          <span className="absolute left-3 top-3 rounded-full border border-[#0E7490]/70 bg-[#0B0B0F]/80 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#67E8F9]">
            Live example ↑
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill tone="outline">Grade {product.grade}</Pill>
          <Pill tone="muted">{product.sellerRating.toFixed(1)}★ Verified seller</Pill>
        </div>

        <h3 className="mt-3 text-base font-bold text-white">{product.name}</h3>
        <p className="mt-1 text-[13px] text-zinc-500">{product.meta}</p>

        <p className="mt-3 text-lg font-bold text-white">
          ${product.price}
          <span className="ml-2 text-sm font-normal text-zinc-500 line-through">
            ${product.originalPrice}
          </span>
          <span className="ml-2 text-sm font-normal text-[#67E8F9]">{discount}% below retail</span>
        </p>

        <ul className="mt-3 flex flex-wrap gap-2">
          {product.reasons.map((reason) => (
            <li
              key={reason}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[12px] text-zinc-300"
            >
              {reason}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex-1" />

        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailId}
          onClick={() => setOpen((v) => !v)}
          className={`mt-2 inline-flex w-fit items-center gap-1.5 rounded-sm text-sm font-semibold text-[#67E8F9] ${FOCUS}`}
        >
          {open ? "Hide" : "Why this match"} — {product.name}
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>

        {open && (
          <div id={detailId} className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
            <p className="text-[13px] leading-[1.6] text-zinc-300">
              <span className="font-semibold text-white">{top.label}</span> is carrying this
              match at {top.raw}/100 — ahead of {mid.label} ({mid.raw}) and {low.label} (
              {low.raw}).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
