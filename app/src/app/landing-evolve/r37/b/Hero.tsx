import Link from "next/link";
import { Eyebrow } from "./ui";
import { FOCUS, CONTAINER } from "./theme";
import TrustScoreCard from "./TrustScoreCard";
import VerificationWalk from "./VerificationWalk";
import ProductPreview from "./ProductPreview";
import type { StepId } from "./data";

interface HeroProps {
  inspected: ReadonlySet<StepId>;
  onInspect: (id: StepId) => void;
}

/**
 * Carries the headline/subhead/CTA, the Trust Score card, the verification
 * walk device AND the four product-preview cards with their proof badges —
 * all physically inside this one component, not split across a separate
 * section below. The top row is an 8/4 split (copy / trust card), a
 * deliberately different ratio from the flagged 7/5 headline+proof-card
 * skeleton, and the device plus the cards both run full-width beneath it
 * rather than living in a second column.
 */
export default function Hero({ inspected, onInspect }: HeroProps) {
  return (
    <section id="hero" className="border-b border-zinc-200 pb-16 pt-14 sm:pt-16 lg:pb-24 lg:pt-20">
      <div className={CONTAINER}>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow>FOUR CHECKS, INSPECTED ONE BY ONE</Eyebrow>
            <h1
              className="mt-5 text-[clamp(2.1rem,1.7rem+1.9vw,3.75rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-zinc-950"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Inspect the checks.
              <br />
              The trust score only means something once you have.
            </h1>
            <p className="mt-6 max-w-[480px] text-base font-normal leading-[1.6] text-zinc-600">
              Repick runs every listing through a four-step verification walk — AI photo scan,
              condition grading, authenticity check, listed. Open any step below to see the actual
              evidence, not just a badge that asks you to take it on faith.
            </p>
            <div className="mt-8">
              <Link
                href="#preview"
                className={`inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition-opacity hover:opacity-90 ${FOCUS}`}
              >
                Browse verified listings
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4">
            <TrustScoreCard inspected={inspected} />
          </div>
        </div>

        <div id="walk">
          <VerificationWalk inspected={inspected} onInspect={onInspect} />
        </div>

        <div id="preview">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
