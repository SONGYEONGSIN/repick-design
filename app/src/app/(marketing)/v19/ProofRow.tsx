import { Hourglass, ShieldCheck, Sparkles } from "lucide-react";
import { pctOff, type ListingProof } from "./data";

/**
 * The proof stack every listing card carries: match %, condition grade, seller verification, and
 * a before/after discount. Always rendered below the swatch tile as its own row — never layered
 * on top of a photo — and shared by the redlined hero card and the plain listing cards so the two
 * never drift into different visual languages.
 */
export default function ProofRow({ listing }: { listing: ListingProof }) {
  const discount = pctOff(listing.priceBefore, listing.priceAfter);
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="inline-flex items-center gap-1 rounded-full border border-[#bae6fd] bg-[#f0f9ff] px-2 py-1 text-[12px] font-medium text-[#0369a1]">
        <Sparkles className="h-3 w-3" aria-hidden="true" />
        <span className="tabular-nums">{listing.matchPct}%</span> match
      </span>
      <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[12px] font-medium text-zinc-700">
        Grade <span className="ml-1 tabular-nums">{listing.grade}</span>
      </span>
      {listing.verified === "verified" ? (
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[12px] font-medium text-zinc-700">
          <ShieldCheck className="h-3 w-3 text-[#0369a1]" aria-hidden="true" />
          Verified seller
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2 py-1 text-[12px] font-medium text-zinc-600">
          <Hourglass className="h-3 w-3" aria-hidden="true" />
          In review
        </span>
      )}
      <span className="inline-flex items-center gap-1.5 pl-0.5">
        <span className="sr-only">
          Originally ${listing.priceBefore}, now ${listing.priceAfter} — {discount}% off.
        </span>
        <span aria-hidden="true" className="inline-flex items-center gap-1.5 text-[12px]">
          <span className="tabular-nums text-zinc-500 line-through decoration-zinc-300">
            ${listing.priceBefore}
          </span>
          <span className="tabular-nums font-bold text-zinc-900">${listing.priceAfter}</span>
          <span className="tabular-nums font-medium text-[#0369a1]">-{discount}%</span>
        </span>
      </span>
    </div>
  );
}
