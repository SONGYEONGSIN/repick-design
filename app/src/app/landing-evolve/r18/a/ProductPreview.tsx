"use client";

import { useState } from "react";
import { Armchair, BadgeCheck, Camera, ShieldCheck, ShieldQuestion, Watch } from "lucide-react";
import { ACCENT_TINT_BG, ACCENT_DEEP, BORDER, CATEGORIES, INK, MUTED, PRODUCTS, SURFACE, type Product } from "./data";
import { Caption, Eyebrow, FOCUS_RING, Reveal } from "./ui";

const CATEGORY_ICON: Record<Product["category"], typeof Camera> = {
  Photography: Camera,
  Furniture: Armchair,
  Accessories: Watch,
};

export function ProductPreview() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const visible = category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);

  return (
    <section id="product-preview" className="border-b" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1240px] px-6 py-20 sm:px-10">
        <Reveal>
          <Eyebrow>Currently graded</Eyebrow>
          <h2
            className="mt-4 max-w-[620px] font-extrabold"
            style={{
              fontFamily: "var(--font-display-wide)",
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              fontSize: "clamp(1.9rem, 1.6vw + 1.4rem, 3rem)",
              color: INK,
            }}
          >
            Four items, four completed inspection records.
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-8 flex flex-wrap gap-2" >
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-[12.5px] font-semibold transition-colors ${FOCUS_RING}`}
                style={{
                  borderColor: category === c ? ACCENT_DEEP : BORDER,
                  backgroundColor: category === c ? ACCENT_TINT_BG : "transparent",
                  color: category === c ? ACCENT_DEEP : MUTED,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {visible.map((product, i) => (
            <Reveal key={product.id} delay={0.06 * i}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const CategoryIcon = CATEGORY_ICON[product.category];
  return (
    <article className="rounded-md border p-5" style={{ borderColor: BORDER }}>
      {/* Fixed aspect-ratio frame with an explicit background color placeholder — no remote image,
          so there's no fallback-alt-text collision risk, and no layout collapse on slow/failed
          loads either way. Generated flat panel, not a photo, per the SVG/CSS-art allowance. */}
      <div
        className="flex aspect-[4/3] w-full items-center justify-center rounded-sm"
        style={{ backgroundColor: SURFACE }}
        aria-hidden="true"
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `${product.tone}22` }}
        >
          <CategoryIcon size={26} style={{ color: product.tone }} />
        </div>
      </div>

      {/* Badges live in their own row below the frame, never absolutely positioned over it — the
          brief's explicit anti-pattern (top-left overlay badges colliding with alt-text fallback
          on failed image loads) can't occur here regardless. */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className="rounded-sm border px-2 py-0.5 text-[11px] font-semibold"
          style={{ borderColor: BORDER, color: INK }}
        >
          Grade {product.grade} · {product.gradeLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: product.sellerVerified ? ACCENT_DEEP : MUTED }}>
          {product.sellerVerified ? (
            <ShieldCheck size={13} aria-hidden="true" />
          ) : (
            <ShieldQuestion size={13} aria-hidden="true" />
          )}
          {product.sellerVerified ? "Verified seller" : "Seller pending review"}
        </span>
      </div>

      <h3 className="mt-3 text-[15px] font-semibold" style={{ color: INK }}>
        {product.title}
      </h3>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {product.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10.5px]"
            style={{ borderColor: BORDER, color: MUTED }}
          >
            <BadgeCheck size={11} aria-hidden="true" />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-baseline gap-2 border-t pt-3" style={{ borderColor: BORDER }}>
        <span className="text-[19px] font-extrabold" style={{ color: INK }}>
          ${product.price}
        </span>
        <span className="text-[12.5px] line-through" style={{ color: MUTED }}>
          ${product.originalPrice}
        </span>
        <Caption className="ml-auto">-{product.discountPercent}% vs new</Caption>
      </div>
    </article>
  );
}
