"use client";

import { Command, Check, ShoppingCart, PackageCheck } from "lucide-react";
import { BRAND, PRODUCT_NAME, FOCUS, cx, usd, type Grade, type SwitchOption } from "./data";

/** Persistent app-style toolbar — sticky from the very top of the page, not a header that appears
 * after scrolling. It is the second, simultaneous exposure of price and the primary action: the
 * hero below carries the full-size version, this carries the compact one that survives scroll
 * through the console grid. */
export default function StickyToolbar({
  sw,
  grade,
  total,
  added,
  onAddToCart,
}: {
  sw: SwitchOption;
  grade: Grade;
  total: number;
  added: boolean;
  onAddToCart: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-3 sm:px-6">
        <a href="#configure" aria-label={BRAND} className={cx("flex flex-none items-center gap-2", FOCUS)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50">
            <Command className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-slate-900 sm:inline">{BRAND}</span>
        </a>

        <span className="hidden truncate text-sm font-normal text-slate-600 md:inline">{PRODUCT_NAME}</span>

        <span className="ml-2 hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 lg:inline-flex">
          <span aria-hidden="true" className="h-2 w-2 flex-none rounded-full" style={{ backgroundColor: sw.swatch }} />
          {grade.short} &middot; {sw.label}
        </span>

        <div className="ml-auto flex flex-none items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs font-normal text-slate-600 sm:inline-flex">
            <PackageCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
            {grade.stock} in stock
          </span>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">{usd(total)}</span>
          <button
            type="button"
            onClick={onAddToCart}
            aria-label={added ? "Added to cart" : "Add to cart"}
            className={cx(
              "inline-flex items-center gap-2 rounded-lg bg-sky-700 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-800",
              FOCUS,
            )}
          >
            {added ? <Check className="h-4 w-4 flex-none" aria-hidden="true" /> : <ShoppingCart className="h-4 w-4 flex-none" aria-hidden="true" />}
            <span className="hidden sm:inline">{added ? "Added" : "Add to cart"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
