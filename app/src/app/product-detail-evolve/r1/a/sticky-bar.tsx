"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { formatUsd, type GalleryImage, type SizeOption } from "./data";

/**
 * Interaction 6 — a condensed purchase bar that only exists once the full-size ledger has scrolled
 * out of view (visibility is owned by the parent's IntersectionObserver, not a scroll-position
 * guess). It mirrors the ledger's live price/size rather than duplicating separate state, so the two
 * surfaces can never drift out of sync. Motion is a single transform/opacity slide, gated by
 * `motion-reduce` so it never fights a user's reduced-motion setting.
 */
export default function StickyBar({
  visible,
  image,
  title,
  size,
}: {
  visible: boolean;
  image: GalleryImage;
  title: string;
  size: SizeOption;
}) {
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur transition-transform duration-200 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-3 sm:px-8">
        <div className="relative h-10 w-10 flex-none overflow-hidden rounded-md bg-zinc-100">
          <Image src={image.src} alt="" fill sizes="40px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900">{title}</p>
          <p className="text-xs font-normal tabular-nums text-zinc-600">
            US {size.us} &middot; {size.inStock ? formatUsd(size.price) : "Sold out"}
          </p>
        </div>
        <button
          type="button"
          tabIndex={visible ? 0 : -1}
          disabled={!size.inStock}
          className="inline-flex flex-none items-center gap-2 rounded-lg bg-[#A16207] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#8A5306] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-zinc-300"
        >
          <ShoppingBag className="h-4 w-4 flex-none" aria-hidden="true" />
          <span className="hidden sm:inline">Add to bag</span>
        </button>
      </div>
    </div>
  );
}
