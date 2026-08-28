import SwatchTile from "./SwatchTile";
import ProofRow from "./ProofRow";
import type { ListingProof } from "./data";

/**
 * One of the 3 plain comparison listings that sit alongside the redlined hero card, each carrying
 * its own full proof stack so the "product + proof visible at rest" beat holds even for the cards
 * that aren't the flagship redline. Titles are h3s, nested under the shared sr-only h2 in Hero.
 */
export default function ListingCard({ listing }: { listing: ListingProof }) {
  return (
    <article className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <SwatchTile icon={listing.icon} size="sm" />
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
            {listing.categoryLabel}
          </p>
          <h3 className="mt-1 truncate text-[15px] font-medium text-zinc-900">{listing.title}</h3>
        </div>
      </div>
      <ProofRow listing={listing} />
    </article>
  );
}
