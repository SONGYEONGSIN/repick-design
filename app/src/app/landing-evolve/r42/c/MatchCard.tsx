import Image from "next/image";
import { Check } from "lucide-react";
import { thumbDataUri, type Listing } from "./data";
import { ACCENT, MUTED_ON_TINT } from "./tokens";

/**
 * Compact leaf card for one listing inside one matchup. Used at every
 * round (Round of 8, Semifinal, Final) so the same card keeps reappearing
 * as a listing advances — never relabelled, always the same catalogue
 * entry. The winning path is marked with visible "Advances" text and a
 * check icon, not just an accent border, per the no-color-only-signal rule.
 */
export default function MatchCard({
  listing,
  score,
  isWinner,
  showScore,
}: {
  listing: Listing;
  score: number;
  isWinner: boolean;
  showScore: boolean;
}) {
  return (
    <div
      className={`relative flex h-[72px] w-full items-center gap-2 rounded-lg border bg-white px-2 transition-transform motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md ${
        isWinner ? "border-2" : "border-zinc-200 opacity-65"
      }`}
      style={isWinner ? { borderColor: ACCENT } : undefined}
    >
      <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-md bg-zinc-100">
        <Image
          src={thumbDataUri(listing.swatch)}
          alt={`${listing.brand} ${listing.name}`}
          fill
          sizes="36px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold leading-tight text-zinc-950">
          {listing.name}
        </p>
        <p
          className={`truncate text-[10px] font-normal leading-tight tabular-nums ${MUTED_ON_TINT}`}
        >
          ${listing.price} · {listing.conditionLabel}
        </p>
        {isWinner ? (
          <p
            className="mt-0.5 flex items-center gap-1 truncate text-[9px] font-semibold uppercase tracking-[0.1em]"
            style={{ color: ACCENT }}
          >
            <Check className="h-2.5 w-2.5 flex-shrink-0" strokeWidth={3} aria-hidden="true" />
            Advances
          </p>
        ) : (
          <p className="mt-0.5 truncate text-[9px] font-normal uppercase tracking-[0.1em] text-zinc-500">
            Eliminated
          </p>
        )}
      </div>
      {showScore && (
        <span
          className="flex-shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold tabular-nums"
          style={{
            color: isWinner ? ACCENT : "#71717A",
            backgroundColor: isWinner ? "#EFF4FE" : "#F4F4F5",
          }}
        >
          {Math.round(score)}
        </span>
      )}
    </div>
  );
}
