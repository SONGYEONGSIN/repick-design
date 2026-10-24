import { LISTINGS, TOTAL_BOXES } from "./data";
import { confidenceAt, fairPrice, formatUsd, revealedBoxes } from "./score-math";
import { BORDER, SURFACE } from "./theme";
import { Reveal } from "./Reveal";
import { SectionIntro, STAT_LABEL } from "./ui";

/**
 * Section 3 — the three-way split the brief requires, fed directly by the
 * same `selectedId` + `reveal` state the device owns. Nothing here is a
 * separate snapshot: all three pillars call the identical score-math
 * functions SplitDevice does, so dragging the divider (or switching tabs)
 * above re-renders every number here too.
 */
export default function ValueSection({ selectedId, reveal }: { selectedId: string; reveal: number }) {
  const listing = LISTINGS.find((l) => l.id === selectedId) ?? LISTINGS[0];
  const confidence = confidenceAt(listing, reveal);
  const revealed = revealedBoxes(listing, reveal);
  const estimate = fairPrice(listing, confidence);
  const delta = listing.price - estimate;

  return (
    <section id="value" className="border-b py-16 sm:py-20" style={{ borderColor: BORDER }}>
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="WHAT THE DRAG ACTUALLY MOVES"
          heading="Three numbers, one drag."
          body="Nothing below is a separate demo. It's the exact same divider position and the exact same listing you left selected above, read out three different ways."
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Reveal>
            <Pillar label="AI confidence" value={`${confidence}%`}>
              <p className="text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                On the {listing.title.toLowerCase()}, right now. Drag further toward the overlay, or pick
                a different listing above, and this number moves with you.
              </p>
            </Pillar>
          </Reveal>
          <Reveal delay={0.06}>
            <Pillar label="Checks visible" value={`${revealed.length} / ${TOTAL_BOXES}`}>
              <p className="text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                Every bounding box the overlay has swept past so far — flagged wear included, not just
                the clean reads.
              </p>
            </Pillar>
          </Reveal>
          <Reveal delay={0.12}>
            <Pillar label="Fair price estimate" value={formatUsd(estimate)}>
              <p className="text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                {delta > 0 ? (
                  <>About {formatUsd(delta)} under the {formatUsd(listing.price)} asking price at this confidence.</>
                ) : (
                  <>Matches the {formatUsd(listing.price)} asking price at this confidence.</>
                )}
              </p>
            </Pillar>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Pillar({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border p-6" style={{ borderColor: BORDER, backgroundColor: SURFACE }}>
      <p className={STAT_LABEL} style={{ color: "#A1A1AA" }}>
        {label}
      </p>
      <p className="text-4xl font-extrabold tabular-nums text-white">{value}</p>
      {children}
    </div>
  );
}
