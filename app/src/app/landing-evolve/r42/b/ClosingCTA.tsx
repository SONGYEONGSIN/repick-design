"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import { DISPLAY, FOCUS_RING, type LeaderId } from "./data";

export default function ClosingCTA({
  leaderId,
  leaderName,
  scoreLeft,
  scoreRight,
  dominant,
  weakest,
}: {
  leaderId: LeaderId;
  leaderName: string | null;
  scoreLeft: number;
  scoreRight: number;
  dominant: string;
  weakest: string;
}) {
  const high = Math.max(scoreLeft, scoreRight).toFixed(1);
  const low = Math.min(scoreLeft, scoreRight).toFixed(1);

  return (
    <section
      id="closing"
      aria-labelledby="closing-heading"
      className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#15803d]">
            the current result
          </span>

          <h2
            id="closing-heading"
            className="mt-4 max-w-[34rem] text-3xl font-extrabold leading-[1.15] tracking-[-0.02em] text-zinc-950 sm:text-4xl"
          >
            {leaderId === "tie" ? (
              <>Both listings are tied under your current weights.</>
            ) : (
              <>
                The{" "}
                <span className="text-[#15803d]">{leaderName}</span> listing leads,{" "}
                <span className="tabular-nums" style={DISPLAY}>
                  {high}
                </span>{" "}
                to{" "}
                <span className="tabular-nums" style={DISPLAY}>
                  {low}
                </span>
                .
              </>
            )}
          </h2>

          <p className="mt-5 max-w-[32rem] text-base font-normal leading-[1.6] text-zinc-600">
            That&rsquo;s with <span className="font-semibold text-zinc-950">{dominant}</span> weighted
            heaviest and <span className="font-semibold text-zinc-950">{weakest}</span> weighted
            lightest. Move either one in the hero above and this line, the two score badges and
            the beam all recompute together from the same four numbers.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#breakdown"
              className={`inline-flex items-center gap-2 rounded-full bg-[#15803d] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#166534] ${FOCUS_RING}`}
            >
              {leaderId === "tie" ? "Break the tie" : `See ${leaderName}'s full breakdown`}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
