"use client";

import { ArrowRight } from "lucide-react";
import { ToneToggle } from "./ToneToggle";
import { CategorySelect } from "./CategorySelect";
import { GeneratedCopy } from "./GeneratedCopy";
import { ProductGrid } from "./ProductGrid";
import { CATEGORY_OPTIONS, type Category, type GeneratedCopy as GeneratedCopyType, type Tone } from "./data";

export function Hero({
  tone,
  category,
  copy,
  onToneChange,
  onCategoryChange,
}: {
  tone: Tone;
  category: Category;
  copy: GeneratedCopyType;
  onToneChange: (tone: Tone) => void;
  onCategoryChange: (category: Category) => void;
}) {
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.id === category)?.label ?? category;

  return (
    <section
      id="listing-generator"
      className="px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-10 lg:pt-28 lg:pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Left: pitch + live generator */}
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-display-mono)] text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.05] tracking-tight text-zinc-950">
              You have the closet.
              <br />
              repick writes the listing.
            </h1>
            <p className="mt-4 max-w-[480px] text-base leading-[1.6] text-zinc-600">
              Pick a tone and a category below — repick turns one sample item into a complete,
              ready-to-post description, tagline, and selling points. No blank page, no guesswork.
            </p>

            <a
              href="#closing-cta"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#0d6961] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]"
            >
              Start selling with repick
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <div className="mt-9 flex flex-wrap items-end gap-6 border-t border-zinc-200 pt-7">
              <ToneToggle value={tone} onChange={onToneChange} />
              <CategorySelect value={category} onChange={onCategoryChange} />
            </div>

            <p className="mt-3 text-[12px] text-zinc-500">
              Previewing a sample {categoryLabel.toLowerCase()} listing — your own photos and
              details generate a listing the same way.
            </p>

            <div className="mt-6">
              <GeneratedCopy copy={copy} swapKey={`${tone}-${category}`} />
            </div>
          </div>

          {/* Right: sample listings for the selected category */}
          <div className="min-w-0">
            <p className="mb-3 text-[13px] font-semibold text-zinc-700">
              Live in {categoryLabel.toLowerCase()} right now
            </p>
            <ProductGrid category={category} />
          </div>
        </div>
      </div>
    </section>
  );
}
