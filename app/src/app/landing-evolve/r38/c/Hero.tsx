import ScrubLedger from "./ScrubLedger";
import ProofStrip from "./ProofStrip";
import { Eyebrow } from "./ui";
import { CONTAINER, FOCUS_LIGHT, ACCENT_FILL, INK, MUTED_ON_PAGE } from "./theme";
import type { ItemPreset } from "./data";

interface HeroProps {
  playhead: number;
  onPlayheadChange: (next: number) => void;
  item: ItemPreset;
}

/**
 * Carries the headline/subhead/single CTA, the scrub-timeline + ledger
 * device, AND the compact product-preview proof strip — all physically
 * inside this one component's own grid, never split into a section below.
 */
export default function Hero({ playhead, onPlayheadChange, item }: HeroProps) {
  return (
    <section className="border-b border-zinc-200 pb-14 pt-12 sm:pt-16 lg:pb-20 lg:pt-20">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
          <div className="lg:col-span-5">
            <Eyebrow>ONE LISTING, TIMESTAMPED IN FULL</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2rem,1.6rem+1.9vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.01em]"
              style={{ color: INK, fontFamily: "var(--font-display-mono)" }}
            >
              Drag the timeline.
              <br />
              Watch trust add up.
            </h1>
            <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6]" style={{ color: MUTED_ON_PAGE }}>
              Every repick listing runs through six stages before a buyer ever sees it — scan,
              grading, authenticity, pricing. Scrub the timeline below and watch each stage&apos;s
              line on the ledger fill in, running subtotal climbing as you go.
            </p>
            <div className="mt-8">
              <a
                href="#product-preview"
                className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 motion-reduce:transition-none ${FOCUS_LIGHT}`}
                style={{ backgroundColor: ACCENT_FILL }}
              >
                Shop the graded drop
              </a>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ScrubLedger value={playhead} onChange={onPlayheadChange} itemName={item.name} />
            <ProofStrip item={item} />
          </div>
        </div>
      </div>
    </section>
  );
}
