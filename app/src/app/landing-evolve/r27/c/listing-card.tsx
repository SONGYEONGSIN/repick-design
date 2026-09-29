import Image from "next/image";
import { ArrowDownRight, BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";
import { CATEGORY_LABEL, discountPct, gradeFromCondition, type Item } from "./data";
import { ACCENT_FILL, ACCENT_INK, ACCENT_TINT, NUM, money } from "./tokens";

export default function ListingCard({
  item,
  heading = true,
  compact = false,
  preload = false,
}: {
  item: Item;
  /** Render the item name as an <h3> (nested under a section heading) or, in a
   *  context with no preceding <h2> yet (the hero), a plain styled label —
   *  keeps document heading levels sequential. */
  heading?: boolean;
  /** Smaller card used inside the hero grid. */
  compact?: boolean;
  /** Set on the one hero-image likely to be the LCP element. */
  preload?: boolean;
}) {
  const grade = gradeFromCondition(item.conditionScore);
  const discount = discountPct(item.sellerAsking, item.retailPrice);
  const verified = item.authenticityScore >= 90;
  const NameTag = heading ? "h3" : "p";

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#131319]">
      {/* Photo — badges live in the row below, never overlaid on top of it. */}
      <div className="relative aspect-[4/3] w-full flex-none overflow-hidden bg-[#1c1c24]">
        <Image
          src={`https://images.unsplash.com/photo-${item.photoId}?auto=format&fit=crop&w=800&q=70`}
          alt={`${item.name}, ${grade} condition grade, listed on repick`}
          fill
          sizes={
            compact
              ? "(min-width: 1024px) 220px, 45vw"
              : "(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
          }
          className="object-cover"
          preload={preload}
        />
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
          {CATEGORY_LABEL[item.category]}
        </p>
        <NameTag
          className={`mt-1 font-extrabold tracking-[-0.01em] text-white ${compact ? "text-base" : "text-lg"}`}
        >
          {item.short}
        </NameTag>

        <div className={`mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 ${NUM}`}>
          <span className="text-sm text-[#A1A1AA] line-through">{money(item.retailPrice)}</span>
          <span className="text-xl font-extrabold text-white">{money(item.sellerAsking)}</span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 text-xs font-semibold"
            style={{ color: ACCENT_TINT }}
          >
            <ArrowDownRight className="h-3 w-3" aria-hidden="true" strokeWidth={2.5} />
            {discount}% off retail
          </span>
        </div>

        {/* Badge row — below the photo, never absolute-overlaid on it. */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: ACCENT_FILL, color: ACCENT_INK }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            {item.matchPct}% match
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold"
            style={{ color: ACCENT_TINT }}
          >
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
            Grade {grade}
          </span>
          {verified && (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold"
              style={{ color: ACCENT_TINT }}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2} />
              Verified authenticity
            </span>
          )}
        </div>

        {!compact && (
          <p className="mt-4 text-xs leading-relaxed text-[#A1A1AA]">{item.reasonTags.join(" · ")}</p>
        )}
      </div>
    </article>
  );
}
