import Image from "next/image";
import { Award, ShieldCheck, Sparkles, TrendingDown } from "lucide-react";
import type { Product } from "./data";
import { discountPct } from "./tier-logic";

/**
 * Badges never sit as an overlay on top of the photo (a failed/slow image load would collapse
 * into default browser alt text and collide with them). The image box reserves its own
 * aspect-ratio + background color, and the four badges always live in a separate row below it.
 */
export function ProductCard({
  product,
  variant,
  figureIndex,
}: {
  product: Product;
  variant: "compact" | "full";
  figureIndex?: string;
}) {
  const pct = discountPct(product.originalPrice, product.price);

  if (variant === "compact") {
    return (
      <div className="flex min-w-0 gap-3 rounded-2xl border border-zinc-200 bg-white p-2.5">
        <div className="relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-bold text-[#16151C]">{product.title}</p>
            <div className="flex shrink-0 items-baseline gap-1">
              <span className="text-sm font-bold text-[#16151C]">${product.price}</span>
              <span className="text-xs text-zinc-600 line-through">${product.originalPrice}</span>
            </div>
          </div>
          <BadgeRow product={product} pct={pct} size="sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={product.image.src}
          alt={product.image.alt}
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          className="object-cover"
        />
      </div>
      {figureIndex ? (
        <p className="text-[11px] font-medium tracking-[0.16em] text-zinc-600 uppercase">
          Fig. {figureIndex} — {product.category}
        </p>
      ) : null}
      <p className="text-lg font-bold text-[#16151C]">{product.title}</p>
      {product.reasoningTags ? (
        <ul className="flex flex-wrap gap-1.5">
          {product.reasoningTags.map((tag) => (
            <li
              key={tag}
              className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-600"
            >
              <Sparkles aria-hidden="true" className="h-3 w-3 shrink-0 text-[#5B21B6]" />
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <BadgeRow product={product} pct={pct} size="md" />
      <p className="text-sm text-zinc-600">
        <span className="font-bold text-[#16151C]">${product.price}</span>{" "}
        <span className="line-through">${product.originalPrice}</span>
      </p>
    </div>
  );
}

function BadgeRow({
  product,
  pct,
  size,
}: {
  product: Product;
  pct: number;
  size: "sm" | "md";
}) {
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5";
  return (
    <ul className={`flex flex-wrap items-center gap-1 ${textSize}`}>
      <li className="flex items-center gap-1 rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-2 py-0.5 font-medium text-[#5B21B6]">
        <Sparkles aria-hidden="true" className={`${iconSize} shrink-0`} />
        {product.match}% match
      </li>
      <li className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-medium text-[#16151C]">
        <Award aria-hidden="true" className={`${iconSize} shrink-0`} />
        {size === "sm" ? `Grade ${product.gradeShort}` : `Grade ${product.gradeShort} · ${product.gradeLabel}`}
      </li>
      <li className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-medium text-[#16151C]">
        <ShieldCheck aria-hidden="true" className={`${iconSize} shrink-0`} />
        Verified
      </li>
      <li className="flex items-center gap-1 rounded-full bg-[#7C3AED] px-2 py-0.5 font-medium text-white">
        <TrendingDown aria-hidden="true" className={`${iconSize} shrink-0`} />
        -{pct}%
      </li>
    </ul>
  );
}
