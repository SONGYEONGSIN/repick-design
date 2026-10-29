import Image from "next/image";
import { ArrowDownRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { discountPct, needById, topEdgeForProduct, type Product } from "./data";
import { ACCENT_BASE, BODY_12 } from "./ui";

/**
 * Badges (best-match need, condition grade, verified seller, discount) live in a row *below* the
 * photo, never as absolute overlays on top of it, so a failed remote-image load never collides with
 * badge text -- and the image container reserves a fixed aspect ratio + background color so a slow
 * or failed load never collapses the layout.
 */
export default function ListingCard({ product }: { product: Product }) {
  const discount = discountPct(product);
  const top = topEdgeForProduct(product.id);
  const need = needById(top.needId);

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-800" style={{ backgroundColor: "#131318" }}>
      <div className="relative aspect-[4/3] w-full flex-none bg-zinc-900">
        <Image
          src={`https://images.unsplash.com/photo-${product.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={`${product.name}, ${product.conditionLabel.toLowerCase()}, listed on repick`}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
          {product.brand} {"·"} {product.category}
        </p>
        <p className="mt-1 truncate text-[16px] font-semibold tracking-[-0.01em] text-zinc-50">
          {product.name}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
          <span className="text-[13px] text-zinc-400 line-through">
            ${product.priceOriginal.toLocaleString("en-US")}
          </span>
          <span className="text-[19px] font-bold text-zinc-50" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            ${product.priceNow.toLocaleString("en-US")}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            style={{ backgroundColor: ACCENT_BASE, color: "#18181B" }}
          >
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-zinc-200"
          >
            {top.strength}% match on {need.label}
          </span>
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
        </div>

        <p className={`mt-4 ${BODY_12}`}>
          <span className="font-semibold text-zinc-300">Why this match: </span>
          {top.reason}
        </p>
      </div>
    </article>
  );
}
