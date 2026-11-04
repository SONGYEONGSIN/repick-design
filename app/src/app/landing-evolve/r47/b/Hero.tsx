import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CheckpointDeck, ResetDeckButton } from "./CheckpointDeck";
import { TrustTally } from "./TrustTally";
import { FEATURED_LISTING, type CheckpointDef, type CheckpointId, type CheckpointStatus } from "./checkpoint-data";
import type { Verdict } from "./checkpoint-math";
import { ACCENT_FILL, CAPTION, EYEBROW, FOCUS_RING, MUTED_TEXT, ON_ACCENT_TEXT, PROSE_WIDTH_18, DISPLAY, ACCENT_TEXT, ACCENT_TEXT_LARGE } from "./tokens";

interface HeroProps {
  checkpoints: CheckpointDef[];
  statuses: Record<CheckpointId, CheckpointStatus>;
  verdict: Verdict;
  onConfirm: (id: CheckpointId) => void;
  onFlag: (id: CheckpointId) => void;
  onUndo: (id: CheckpointId) => void;
  onReset: () => void;
}

/**
 * The hero carries the whole mechanic — headline, subhead, single CTA on the left; the live
 * Checkpoint Deck AND its persistent trust-score/price-range tally on the right, inside this
 * same component. Nothing about the device lives in a section below the fold.
 */
export function Hero({ checkpoints, statuses, verdict, onConfirm, onFlag, onUndo, onReset }: HeroProps) {
  return (
    <section className="border-b border-zinc-200 px-4 pb-10 pt-8 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-10">
          {/* Left: asymmetric headline block, not centered */}
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <p className={`${EYEBROW} ${ACCENT_TEXT}`}>AI-verified resale</p>
            <h1
              id="hero-heading"
              className={`${DISPLAY} text-[clamp(2.25rem,4.8vw,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-900`}
            >
              Every listing runs
              <br />
              its own <span className={ACCENT_TEXT_LARGE}>checkpoint deck</span>.
            </h1>
            <p className={`${PROSE_WIDTH_18} text-base font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Four fixed checks — confirm or flag any card and the trust score and price range
              on the right update instantly.
            </p>
            <div>
              <a
                href="#catalog"
                className={`inline-flex items-center gap-2 rounded-full ${ACCENT_FILL} px-6 py-3 text-sm font-semibold ${ON_ACCENT_TEXT} transition-colors duration-200 hover:bg-amber-400 ${FOCUS_RING}`}
              >
                See more verified listings
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Right: the Checkpoint Deck device, inside the Hero component itself */}
          <div className="flex min-w-0 flex-col gap-2.5 rounded-2xl border border-zinc-200 bg-white p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <Image
                  src={`https://images.unsplash.com/photo-${FEATURED_LISTING.photoId}?q=80&w=200&auto=format&fit=crop`}
                  alt={FEATURED_LISTING.alt}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className={`${CAPTION} ${ACCENT_TEXT}`}>Checkpoint deck</p>
                <p className="truncate text-sm font-semibold text-zinc-900">{FEATURED_LISTING.title}</p>
                <p className={`truncate text-xs font-normal ${MUTED_TEXT}`}>{FEATURED_LISTING.listingCode}</p>
              </div>
            </div>

            <CheckpointDeck
              checkpoints={checkpoints}
              statuses={statuses}
              verdict={verdict}
              onConfirm={onConfirm}
              onFlag={onFlag}
              onUndo={onUndo}
            />

            <TrustTally verdict={verdict} />

            <ResetDeckButton onReset={onReset} />
          </div>
        </div>
      </div>
    </section>
  );
}
