"use client";

import { useMemo, useState } from "react";
import ListingCard from "./ListingCard";
import Reveal from "./Reveal";
import { SectionIntro } from "./ui";
import { FOCUS } from "./theme";
import { CONCERNS, GRID_LISTINGS, type ConcernId, type Listing } from "./data";
import { coveredCount, overallMatch } from "./score-math";

interface ProductGridProps {
  selected: ReadonlySet<ConcernId>;
}

type SortMode = "coverage" | "recent";

const SORTS: { id: SortMode; label: string }[] = [
  { id: "coverage", label: "Best coverage first" },
  { id: "recent", label: "Most recently listed" },
];

function sortListings(listings: Listing[], mode: SortMode, selectedIds: ConcernId[]): Listing[] {
  const copy = [...listings];
  if (mode === "recent") {
    copy.sort((a, b) => a.daysListed - b.daysListed);
    return copy;
  }
  copy.sort((a, b) => {
    const coverDiff = coveredCount(b.scores, selectedIds) - coveredCount(a.scores, selectedIds);
    if (coverDiff !== 0) return coverDiff;
    return overallMatch(b.scores) - overallMatch(a.scores);
  });
  return copy;
}

/**
 * The browsable grid. Sort order (4th interaction) re-sorts against the
 * *same* selected-concern state the hero's rings use, so "best coverage
 * first" genuinely depends on what the viewer picked above — it is not a
 * fixed popularity ranking relabeled.
 */
export default function ProductGrid({ selected }: ProductGridProps) {
  const [sortMode, setSortMode] = useState<SortMode>("coverage");
  const selectedIds = useMemo(() => CONCERNS.filter((c) => selected.has(c.id)).map((c) => c.id), [selected]);
  const ordered = useMemo(
    () => sortListings(GRID_LISTINGS, sortMode, selectedIds),
    [sortMode, selectedIds]
  );

  return (
    <section id="catalog" className="border-b border-zinc-200 py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <SectionIntro
            eyebrow="THE CATALOG, FILTERED BY YOUR RINGS"
            heading="Nothing here is reordered by us."
            body="Only the concerns you selected above change what counts as a cover below — the scores themselves don't move, so turning a concern off never hides a weak number, it just stops counting it."
          />

          <div
            role="group"
            aria-label="Sort the catalog"
            className="inline-flex shrink-0 rounded-full border border-zinc-300 p-1"
          >
            {SORTS.map((sort) => {
              const active = sortMode === sort.id;
              return (
                <button
                  key={sort.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSortMode(sort.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${FOCUS} ${
                    active ? "bg-zinc-950 text-white" : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  {sort.label}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ordered.map((listing, i) => (
            <li key={listing.id} className="min-w-0">
              <Reveal delay={Math.min(i, 3) * 0.06} className="min-w-0">
                <ListingCard listing={listing} selectedIds={selectedIds} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
