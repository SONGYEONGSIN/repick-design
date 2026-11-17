import Image from "next/image";

import type { Listing, Profile } from "./lib";
import { matchPercent, matchReason } from "./lib";
import { ProofBadges } from "./ui";

interface RecommendRailProps {
  profile: Profile;
  ranked: Listing[];
}

/**
 * The "Recommended for you" rail: the remaining, not-yet-seen listings, re-ranked live by fit to
 * the current profile. Plain, non-interactive cards (no hover-lift, no cursor-pointer) — they are
 * not wired to anything on click, so they are deliberately styled to not read as clickable.
 */
export default function RecommendRail({ profile, ranked }: RecommendRailProps) {
  const shown = ranked.slice(0, 4);

  return (
    <div className="mt-5">
      <div className="flex items-baseline justify-between">
        <p className="text-[12px] font-semibold uppercase text-zinc-500" style={{ letterSpacing: "0.16em" }}>
          Recommended for you
        </p>
        <p className="text-[11.5px] font-normal text-zinc-500 tabular-nums">{shown.length} left to see</p>
      </div>

      {shown.length === 0 ? (
        <p className="mt-2 text-[13px] font-normal text-zinc-500">
          No more unseen picks — you&apos;ve made it through the whole deck.
        </p>
      ) : (
        <ul
          role="list"
          aria-label="Listings re-ranked by fit to your current profile"
          className="mt-2 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]"
        >
          {shown.map((listing) => {
            const pct = matchPercent(profile, listing);
            const reason = matchReason(profile, listing);
            return (
              <li
                key={listing.id}
                className="w-[160px] shrink-0 rounded-xl border border-zinc-200 bg-white p-2.5"
              >
                <div className="relative h-20 w-full overflow-hidden rounded-lg bg-zinc-100">
                  <Image
                    src={listing.image}
                    alt={listing.imageAlt}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 truncate text-[12.5px] font-semibold text-zinc-900">{listing.title}</p>
                <p className="text-[11.5px] font-normal text-zinc-500 tabular-nums">${listing.price}</p>
                <div className="mt-1.5">
                  <ProofBadges listing={listing} matchPct={pct} reason={reason} compact />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
