import { useId, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import type { Listing } from "./data";
import { discountPct } from "./compare";

interface ListingCardProps {
  listing: Listing;
  variant?: "compact" | "rich";
}

// Keeps the compact badge row from overflowing its narrow column on four-
// figure listings (e.g. "$4,400") — the rich variant has room for full
// numbers and uses them as-is.
function compactCurrency(value: number): string {
  if (value < 1000) return `$${value}`;
  const thousands = value / 1000;
  const rounded = Math.round(thousands * 10) / 10;
  return `$${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}k`;
}

// The core conversion-proof unit: every instance carries all four badges
// (match, grade, verification, before/after discount) below the image,
// never as overlays on top of it, so a failed image load never collides
// with the browser's default alt text.
export function ListingCard({ listing, variant = "compact" }: ListingCardProps) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();
  const isRich = variant === "rich";
  const discount = discountPct(listing);

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#F1EDE8] bg-white">
      <div
        className="relative w-full overflow-hidden bg-[#F1EDE8]"
        style={{ aspectRatio: isRich ? "4 / 5" : "1 / 1" }}
      >
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes={isRich ? "(min-width: 1024px) 320px, 45vw" : "(min-width: 1024px) 220px, 40vw"}
          className="object-cover"
        />
      </div>

      {isRich ? (
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
              {listing.category}
            </p>
            <p className="mt-1 text-base font-semibold leading-snug text-[#171311]">
              {listing.title}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-full bg-[#C2410C] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-white">
              {listing.match}% match
            </span>
            <span className="inline-flex items-center rounded-full border border-[#C2410C] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#B8410A]">
              Grade {listing.grade}
            </span>
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EDE8] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#171311]">
                <ShieldCheck className="h-3 w-3 text-[#B8410A]" aria-hidden="true" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EDE8] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#534E49]">
                <Clock className="h-3 w-3" aria-hidden="true" />
                Pending review
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F1EDE8] px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#171311]">
              <span className="text-[#6B6560] line-through">
                ${listing.retail.toLocaleString("en-US")}
              </span>
              <ArrowRight className="h-3 w-3 text-[#B8410A]" aria-hidden="true" />
              <span>${listing.price.toLocaleString("en-US")}</span>
              <span className="text-[#B8410A]">-{discount}%</span>
            </span>
          </div>

          <div className="mt-auto pt-1">
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex w-full items-center justify-between gap-2 rounded-lg px-1 py-1.5 text-left text-[13px] font-semibold text-[#171311] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Why this match?
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#B8410A] transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            <div
              id={panelId}
              className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <ul className="flex flex-col gap-1.5 px-1 pb-1 pt-1">
                {listing.tags.map((tag) => (
                  <li key={tag} className="text-[13px] leading-snug text-[#534E49]">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-1 p-2.5">
          <p className="truncate text-[13px] font-semibold leading-snug text-[#171311]">
            {listing.title}
          </p>

          <div className="grid grid-cols-2 gap-1">
            <span className="inline-flex items-center justify-center truncate rounded-full bg-[#C2410C] px-1 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-white">
              {listing.match}% match
            </span>
            <span className="inline-flex items-center justify-center truncate rounded-full border border-[#C2410C] px-1 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#B8410A]">
              Grade {listing.grade}
            </span>
          </div>

          {listing.verified ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#F1EDE8] px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#171311]">
              <ShieldCheck className="h-2.5 w-2.5 shrink-0 text-[#B8410A]" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#F1EDE8] px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.12em] text-[#534E49]">
              <Clock className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
              Pending
            </span>
          )}

          <p className="truncate text-[11px] font-semibold tracking-[0.12em] text-[#171311]">
            <span className="text-[#6B6560] line-through">
              {compactCurrency(listing.retail)}
            </span>
            {" → "}
            <span>{compactCurrency(listing.price)}</span>{" "}
            <span className="text-[#B8410A]">-{discount}%</span>
          </p>
        </div>
      )}
    </div>
  );
}
