"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";

import { PREVIEW_LISTINGS, fmtInt } from "./data";

export function PreviewDeck() {
  const [openRef, setOpenRef] = useState<string>("RP-9068");
  const prefersReduced = useReducedMotion();
  const reduce = prefersReduced ?? false;
  const open =
    PREVIEW_LISTINGS.find((l) => l.ref === openRef) ?? PREVIEW_LISTINGS[0];

  const bandDelta = open.finalBand - open.firstBand;

  return (
    <section
      id="listings"
      className="relative isolate border-t border-white/10 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
              Fig. 03
            </p>
            <h2
              className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Four live listings, and what we first said about them
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pt-14">
            <p className="max-w-[492px] text-[16px] font-normal leading-[1.6] text-[#D4D4D8]">
              Every listing carries both calls, permanently. The first one is
              the model, the second one is what survived a person. Three of
              these four moved, and the third one moved because the buyer
              corrected us rather than the other way round.
            </p>
          </div>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PREVIEW_LISTINGS.map((l) => {
            const on = l.ref === openRef;
            const moved = l.finalBand !== l.firstBand;
            return (
              <li key={l.ref} className="flex">
                <motion.button
                  type="button"
                  aria-pressed={on}
                  aria-label={`${l.title}, reference ${l.ref}, ${l.meta}. Match ${l.matchPct} percent, grade ${l.grade}, ${l.certification}, ${l.discountPct} percent under retail. First call grade ${l.firstGrade} at ${fmtInt(l.firstBand)} dollars. Final call grade ${l.finalGrade} at ${fmtInt(l.finalBand)} dollars. ${l.verdict}. Show the full trail.`}
                  onClick={() => setOpenRef(l.ref)}
                  whileHover={reduce ? undefined : { y: -3 }}
                  transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
                  className={`flex w-full flex-col border p-5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none ${
                    on
                      ? "border-[#F2A93B] bg-white/[0.05]"
                      : "border-white/12 bg-transparent hover:border-white/30"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex items-baseline justify-between gap-3"
                  >
                    <span className="text-[11px] font-medium tracking-[0.16em] text-[#A1A1AA]">
                      {l.ref}
                    </span>
                    <span
                      className={`text-[10px] font-medium uppercase tracking-[0.16em] ${
                        on ? "text-[#F7C77A]" : "text-transparent"
                      }`}
                    >
                      Trail shown
                    </span>
                  </span>

                  <span className="mt-3 block text-[17px] font-medium leading-[1.3] text-white">
                    {l.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 block text-[13px] font-normal leading-[1.6] text-[#A1A1AA]"
                  >
                    {l.meta}
                  </span>

                  <span aria-hidden="true" className="mt-4 flex flex-wrap gap-1.5">
                    <Tag>{`Match ${l.matchPct}%`}</Tag>
                    <Tag>{`Grade ${l.grade}`}</Tag>
                    <Tag>{l.certification}</Tag>
                    <Tag>{`${l.discountPct}% under retail`}</Tag>
                  </span>

                  <span
                    aria-hidden="true"
                    className="mt-5 block border-t border-white/10 pt-4"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                        First call
                      </span>
                      <span className="text-[14px] font-normal text-[#A1A1AA] tabular-nums line-through">
                        {l.firstGrade} &middot; ${fmtInt(l.firstBand)}
                      </span>
                    </span>
                    <span className="mt-2 flex items-baseline justify-between gap-3">
                      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                        Final call
                      </span>
                      <span className="text-[15px] font-medium text-white tabular-nums">
                        {l.finalGrade} &middot; ${fmtInt(l.finalBand)}
                      </span>
                    </span>
                    <span className="mt-3 block text-[11px] font-medium uppercase tracking-[0.12em] text-[#D4D4D8]">
                      {moved
                        ? `Down ${fmtInt(l.firstBand - l.finalBand)} dollars`
                        : "Did not move"}{" "}
                      &middot; {l.verdict}
                    </span>
                  </span>
                </motion.button>
              </li>
            );
          })}
        </ul>

        <motion.div
          key={open.ref}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: "easeOut" }}
          className="mt-4 border border-white/12 bg-white/[0.02] p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
                Trail &middot; {open.ref}
              </p>
              <h3
                className="mt-3 text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                {open.title}
              </h3>
              <dl className="mt-6 flex flex-col gap-4">
                <TrailStat
                  label="Model confidence at first call"
                  value={`${open.confidence}%`}
                />
                <TrailStat label="Who caught it" value={open.caughtBy} />
                <TrailStat
                  label="Days to close"
                  value={fmtInt(open.daysToClose)}
                />
                <TrailStat
                  label="Band movement"
                  value={
                    bandDelta === 0
                      ? "None"
                      : `Down ${fmtInt(-bandDelta)} dollars`
                  }
                />
              </dl>
            </div>

            <div className="lg:col-span-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                What the second look found
              </p>
              <p className="mt-3 max-w-[554px] text-[18px] font-normal leading-[1.6] text-[#D4D4D8]">
                {open.found}
              </p>
              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7C77A]">
                How it was settled
              </p>
              <p className="mt-3 max-w-[554px] text-[16px] font-normal leading-[1.6] text-[#D4D4D8]">
                {open.settled}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-8 right-2 -z-10 select-none text-[clamp(6rem,18vw,14rem)] font-extrabold leading-none tracking-[-0.02em] text-white/[0.035]"
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        03
      </p>
    </section>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#D4D4D8]">
      {children}
    </span>
  );
}

function TrailStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
        {label}
      </dt>
      <dd className="mt-1 text-[16px] font-medium text-white">{value}</dd>
    </div>
  );
}
