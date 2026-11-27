import { BadgeCheck, BatteryMedium, Percent, Sparkles } from "lucide-react";
import Image from "next/image";
import { discountPercent, photoUrl, type Listing } from "./listings";
import { ACCENT, BORDER, FG, MUTED, PROSE_WIDTH_ROW, SURFACE } from "./tokens";

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

/**
 * Full product-proof: AI-match reasoning, condition grade, battery health, and the before/after
 * discount — as a `dl` whose `dt`/`dd` pairs are direct children of the `dl`'s own child `div`s
 * (never nested one level deeper inside an icon wrapper), with each icon placed inside its `dt`.
 * Badges sit below the photo, never as an absolute overlay on top of it, so a failed image load's
 * fallback alt text never collides with badge text.
 *
 * `compact` (used once, inside Hero) swaps the full-width top-stacked photo for a small
 * FIXED-SIZE 80px thumbnail laid out horizontally next to the title/price column — a full-width
 * image stacked above the badges would by itself consume the mobile fold's vertical budget.
 */
export function ListingCard({ listing, compact = false }: ListingCardProps) {
  const discount = discountPercent(listing);

  if (compact) {
    return (
      <div className="rounded-2xl p-3" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
        <div className="flex items-start gap-3">
          <div
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg"
            style={{ backgroundColor: "#27272A", aspectRatio: "1 / 1" }}
          >
            <Image
              src={photoUrl(160)}
              alt={`${listing.name}, verified refurbished, ${listing.conditionGrade.toLowerCase()}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
              {listing.name}
            </p>
            <p className="mt-0.5 flex items-baseline gap-1.5 tabular-nums">
              <span className="text-[15px] font-extrabold" style={{ color: FG }}>
                ${listing.resalePrice.toLocaleString("en-US")}
              </span>
              <span className="text-[12px] font-normal line-through" style={{ color: MUTED }}>
                ${listing.listPrice.toLocaleString("en-US")}
              </span>
            </p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
          <div>
            <dt className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <Sparkles className="h-3 w-3" aria-hidden="true" style={{ color: ACCENT }} />
              Match
            </dt>
            <dd className="mt-0.5 text-[13px] font-semibold tabular-nums" style={{ color: FG }}>
              {listing.matchPercent}%
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <BatteryMedium className="h-3 w-3" aria-hidden="true" style={{ color: ACCENT }} />
              Condition
            </dt>
            <dd className="mt-0.5 text-[13px] font-semibold" style={{ color: FG }}>
              {listing.conditionGrade}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <BadgeCheck className="h-3 w-3" aria-hidden="true" style={{ color: ACCENT }} />
              Seller
            </dt>
            <dd className="mt-0.5 text-[13px] font-semibold" style={{ color: FG }}>
              Verified
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <Percent className="h-3 w-3" aria-hidden="true" style={{ color: ACCENT }} />
              Discount
            </dt>
            <dd className="mt-0.5 text-[13px] font-semibold tabular-nums" style={{ color: FG }}>
              {discount}% off
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl" style={{ border: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
      <div className="relative w-full" style={{ aspectRatio: "4 / 3", backgroundColor: "#27272A" }}>
        <Image
          src={photoUrl(640)}
          alt={`${listing.name}, verified refurbished, ${listing.conditionGrade.toLowerCase()}`}
          fill
          sizes="(min-width: 1024px) 360px, 90vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[16px] font-semibold tracking-[-0.02em]" style={{ color: FG }}>
          {listing.name}
        </h3>
        <p className="mt-0.5 flex items-baseline gap-2 tabular-nums">
          <span className="text-[19px] font-extrabold" style={{ color: FG }}>
            ${listing.resalePrice.toLocaleString("en-US")}
          </span>
          <span className="text-[13px] font-normal line-through" style={{ color: MUTED }}>
            ${listing.listPrice.toLocaleString("en-US")}
          </span>
          <span className="text-[12px] font-semibold tabular-nums" style={{ color: ACCENT }}>
            {discount}% off
          </span>
        </p>

        <p className="mt-1 text-[12.5px] font-normal" style={{ color: MUTED }}>
          {listing.conditionNote}
        </p>

        <p className={`mt-2 text-[13px] font-normal leading-[1.55] ${PROSE_WIDTH_ROW}`} style={{ color: MUTED }}>
          {listing.reasoning}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-3" style={{ borderColor: BORDER }}>
          <div>
            <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT }} />
              AI match
            </dt>
            <dd className="mt-1 text-[14px] font-semibold tabular-nums" style={{ color: FG }}>
              {listing.matchPercent}%
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <BatteryMedium className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT }} />
              Condition
            </dt>
            <dd className="mt-1 text-[14px] font-semibold" style={{ color: FG }}>
              {listing.conditionGrade}
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT }} />
              Seller
            </dt>
            <dd className="mt-1 text-[14px] font-semibold" style={{ color: FG }}>
              Verified
            </dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: MUTED }}>
              <Percent className="h-3.5 w-3.5" aria-hidden="true" style={{ color: ACCENT }} />
              Savings
            </dt>
            <dd className="mt-1 text-[14px] font-semibold tabular-nums" style={{ color: FG }}>
              {discount}% off
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
