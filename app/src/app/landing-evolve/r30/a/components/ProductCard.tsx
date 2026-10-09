"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { Product } from "./data";

export function ProductCard({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const discountPct = Math.round((1 - product.ask / product.retail) * 100);

  return (
    <div className="flex min-w-0 flex-col rounded-lg border border-zinc-800 bg-zinc-900/40">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-lg bg-zinc-800">
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={product.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.1em] text-zinc-400">{product.brand.toUpperCase()}</p>
          <h3 className="mt-0.5 text-base font-semibold text-white">{product.title}</h3>
        </div>

        <div className="flex items-baseline gap-2 font-[family-name:var(--font-display-mono)] tabular-nums">
          <span className="text-xl font-semibold text-white">${product.ask}</span>
          <span className="text-sm text-zinc-400 line-through">${product.retail}</span>
          <span className="text-xs font-semibold text-amber-300">{discountPct}% off retail</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-amber-200">
            {product.matchPct}% AI match
          </span>
          <span className="rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-zinc-300">
            Grade {product.grade}
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Verified seller · {product.sellerName} · {product.sellerRating.toFixed(1)}★ · {product.sellerSales} sales
        </p>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-1 flex items-center justify-between gap-2 rounded-md border border-zinc-700 px-3 py-2 text-left text-xs font-semibold tracking-[0.04em] text-zinc-200 transition-colors hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
        >
          <span>Why the AI picked this</span>
          <span aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
            ↓
          </span>
        </button>

        {open && (
          <ul id={panelId} className="flex flex-col gap-2 border-t border-zinc-800 pt-3 text-xs leading-[1.6] text-zinc-300">
            {product.reasons.map((reason) => (
              <li key={reason} className="flex gap-2">
                <span aria-hidden="true" className="text-amber-300">
                  —
                </span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
