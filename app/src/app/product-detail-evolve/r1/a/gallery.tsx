"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "./data";

/**
 * Interaction 1 — media gallery navigation. The active photo is state, driven three ways (arrow
 * buttons, thumbnail clicks, and native keyboard focus on the thumbnails), all pointing at the same
 * `active` index so they can never disagree. The frame reserves a fixed aspect-ratio box with a
 * background color before any photo has loaded, per the brief's CLS rule. The image index is a plain
 * caption row under the frame, not an overlay on top of the photo (page-brief-core §4).
 */
export default function Gallery({
  images,
  active,
  onChange,
}: {
  images: GalleryImage[];
  active: number;
  onChange: (index: number) => void;
}) {
  const current = images[active];
  const go = (delta: number) => {
    const next = (active + delta + images.length) % images.length;
    onChange(next);
  };

  return (
    <div aria-label="Product images">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        <Image
          key={current.id}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
          priority
        />
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div role="tablist" aria-label="Select product image" className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`View ${img.label} photo, ${i + 1} of ${images.length}`}
              onClick={() => onChange(i)}
              className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg border bg-zinc-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A16207] focus-visible:ring-offset-2 ${
                i === active ? "border-zinc-900" : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <Image src={img.src} alt="" fill sizes="56px" className="object-cover" />
            </button>
          ))}
        </div>
        <p className="text-xs font-normal tabular-nums text-zinc-500">
          {active + 1} / {images.length} — {current.label}
        </p>
      </div>
    </div>
  );
}
