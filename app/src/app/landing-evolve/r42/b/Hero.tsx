"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import ListingCard from "./ListingCard";
import BalanceBeam from "./BalanceBeam";
import WeightSliders from "./WeightSliders";
import { FOCUS_RING, LISTINGS, type LeaderId, type Weights } from "./data";

export default function Hero({
  weights,
  onWeightChange,
  onReset,
  scoreLeft,
  scoreRight,
  tilt,
  leaderId,
}: {
  weights: Weights;
  onWeightChange: (key: keyof Weights, value: number) => void;
  onReset: () => void;
  scoreLeft: number;
  scoreRight: number;
  tilt: number;
  leaderId: LeaderId;
}) {
  return (
    <section className="relative px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 lg:px-10 lg:pt-24 lg:pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
              repick · live weighted comparison
            </span>
            <h1 className="mt-5 text-[clamp(2.1rem,8vw,2.75rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-zinc-950 sm:text-[clamp(2.75rem,5vw,3.5rem)]">
              Two listings. Four weights. Only one wins the scale.
            </h1>
            <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-600">
              Price, condition, ship speed and seller trust combine into a weighted score for
              each listing below. Move any slider and the score, the beam and the recap at the
              bottom of this page all recalculate from it.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#compare"
                className={`inline-flex items-center gap-2 rounded-full bg-[#15803d] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#166534] ${FOCUS_RING}`}
              >
                Tip the scale
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <span className="text-sm font-normal text-zinc-600">Two real listings, side by side.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:gap-6">
            <div className="flex-1">
              <ListingCard listing={LISTINGS.left} weights={weights} score={scoreLeft} isLeader={leaderId === "left"} side="left" />
            </div>

            <div className="flex w-full flex-col items-center gap-2 lg:w-[180px] lg:flex-shrink-0">
              <BalanceBeam tilt={tilt} leaderId={leaderId} />
              <p
                aria-live="polite"
                className="flex items-center gap-1.5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-zinc-700"
              >
                {leaderId === "tie"
                  ? "Evenly matched"
                  : `${LISTINGS[leaderId].seller} leads`}
              </p>
            </div>

            <div className="flex-1">
              <ListingCard listing={LISTINGS.right} weights={weights} score={scoreRight} isLeader={leaderId === "right"} side="right" />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div id="compare" className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:p-7">
            <h2 id="weights-heading" className="text-sm font-semibold uppercase tracking-[0.16em] text-zinc-600">
              Weight what matters most
            </h2>
            <div className="mt-5">
              <WeightSliders weights={weights} onChange={onWeightChange} onReset={onReset} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
