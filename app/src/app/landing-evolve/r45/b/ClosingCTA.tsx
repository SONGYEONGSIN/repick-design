"use client";

import { ArrowRight, GitBranch } from "lucide-react";
import type { Match } from "./data";
import { ACCENT_FILL, BODY_WIDTH_SM, DISPLAY, FOCUS_RING, MUTED_TEXT, ON_ACCENT_FILL_TEXT } from "./tokens";

export function ClosingCTA({ match }: { match: Match | null }) {
  return (
    <section className="border-t border-white/10 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[760px] rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center sm:p-12">
        <GitBranch className="mx-auto h-5 w-5 text-[#FB7185]" aria-hidden="true" />

        {match ? (
          <>
            <h2 className={`${DISPLAY} mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.01em] text-[#F5F5F6] sm:text-3xl`}>
              Your path landed on{" "}
              <span className="tabular-nums">
                {match.sellers} active sellers, avg {match.days}-day sale
              </span>
              .
            </h2>
            <p className={`mx-auto mt-3 text-sm font-normal leading-[1.6] ${MUTED_TEXT} ${BODY_WIDTH_SM}`}>
              That figure is read off the exact branch your three answers lit above — change any
              one of them and this sentence changes with it. List a {match.archetype} lot now
              and you&rsquo;re matched into that same pool.
            </p>
            <a
              href="#tree"
              className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full ${ACCENT_FILL} px-6 text-sm font-semibold ${ON_ACCENT_FILL_TEXT} transition-colors duration-200 hover:bg-[#BE123C] ${FOCUS_RING}`}
            >
              List into this match
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        ) : (
          <>
            <h2 className={`${DISPLAY} mt-4 text-2xl font-extrabold leading-[1.15] tracking-[-0.01em] text-[#F5F5F6] sm:text-3xl`}>
              No path lit yet — three questions stand between you and a match.
            </h2>
            <p className={`mx-auto mt-3 text-sm font-normal leading-[1.6] ${MUTED_TEXT} ${BODY_WIDTH_SM}`}>
              Nothing below is faked while you decide: the leaf stays honestly locked until
              budget, category, and condition are all answered above.
            </p>
            <a
              href="#tree"
              className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-full ${ACCENT_FILL} px-6 text-sm font-semibold ${ON_ACCENT_FILL_TEXT} transition-colors duration-200 hover:bg-[#BE123C] ${FOCUS_RING}`}
            >
              Answer the tree above
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </>
        )}
      </div>
    </section>
  );
}
