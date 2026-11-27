"use client";

import { Cpu, Shirt, Lamp } from "lucide-react";
import type { Category } from "./data";
import { CATEGORY_SWATCH } from "./data";

const ICON: Record<Category, typeof Cpu> = {
  electronics: Cpu,
  clothing: Shirt,
  home: Lamp,
};

/**
 * Generated CSS/SVG placeholder standing in for a product photo — a fixed
 * aspect-ratio box with a deterministic per-category gradient and a single
 * centered glyph, so there is never a remote image, a random image host,
 * or a layout jump on load failure. The glyph is decorative (the product
 * name is rendered as real text elsewhere in the card), so it is
 * aria-hidden rather than carrying a conflicting label.
 */
export default function ProductGlyph({ category }: { category: Category }) {
  const swatch = CATEGORY_SWATCH[category];
  const Icon = ICON[category];
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-orange-200"
      style={{ backgroundColor: swatch.from }}
    >
      <svg
        viewBox="0 0 100 75"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`glyph-grad-${category}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={swatch.from} />
            <stop offset="1" stopColor={swatch.to} />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="100" height="75" fill={`url(#glyph-grad-${category})`} />
        <circle cx="78.00" cy="14.00" r="22.00" fill="#FFFFFF" opacity="0.18" />
        <circle cx="12.00" cy="68.00" r="16.00" fill="#FFFFFF" opacity="0.14" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className="h-10 w-10 text-white drop-shadow-sm" aria-hidden="true" />
      </div>
    </div>
  );
}
