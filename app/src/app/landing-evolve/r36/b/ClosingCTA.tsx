import Link from "next/link";
import { Eyebrow } from "./ui";
import { FOCUS } from "./theme";
import { CONCERNS, FEATURED_LISTING, type ConcernId } from "./data";
import { aggregateForSelection, ctaLabel } from "./score-math";

interface ClosingCtaProps {
  selected: ReadonlySet<ConcernId>;
}

/**
 * Closing CTA. Both the sentence and the button's own label read the same
 * `selected` state and the same `aggregateForSelection` call as the hero
 * and the value section above — the figure that follows a viewer down the
 * page is literally the same number, not a restated demo value.
 */
export default function ClosingCTA({ selected }: ClosingCtaProps) {
  const selectedIds = CONCERNS.filter((c) => selected.has(c.id)).map((c) => c.id);
  const aggregate = aggregateForSelection(FEATURED_LISTING.scores, selectedIds);
  const selectedCount = selectedIds.length;

  return (
    <section id="closing" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>YOUR SELECTION, NOT A SAMPLE</Eyebrow>
          <h2
            className="mt-4 text-[clamp(1.9rem,1.3rem+2.1vw,3rem)] font-bold leading-[1.05] tracking-[-0.02em] text-zinc-950"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            That match number followed you down here.
          </h2>
          <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-700" style={{ maxWidth: "490px" }}>
            {selectedCount === 0 ? (
              <>
                No concern is selected yet, so there is no honest match number to show. Pick at
                least one above and this sentence, and the catalog, will narrow to match it.
              </>
            ) : (
              <>
                You picked {selectedCount} concern{selectedCount === 1 ? "" : "s"}. The Leica M6
                above cleared them at{" "}
                <span className="font-bold tabular-nums text-zinc-950">{aggregate}%</span> match
                confidence &mdash; the same figure the rings showed, unchanged by the scroll.
              </>
            )}
          </p>
          <div className="mt-8">
            <Link
              href="#catalog"
              className={`inline-flex items-center justify-center rounded-full bg-emerald-600 px-7 py-3.5 text-base font-semibold text-zinc-950 transition-opacity hover:opacity-90 ${FOCUS}`}
            >
              {ctaLabel(selectedCount)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
