"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import {
  CLASSES,
  LENSES,
  TARGETS,
  classCount,
  classShare,
  fmtInt,
  lensTotal,
  missRate,
  overBy,
  periodOf,
  type ClassId,
  type LensId,
  type PeriodId,
} from "./data";

export function AuditConsole({ periodId }: { periodId: PeriodId }) {
  const [lens, setLens] = useState<LensId>("all");
  const [openClass, setOpenClass] = useState<ClassId>("authenticity");
  const prefersReduced = useReducedMotion();
  const reduce = prefersReduced ?? false;

  const period = periodOf(periodId);
  const total = lensTotal(period, lens);
  const rate = missRate(period, lens);
  const gap = overBy(period, lens);
  const lensMeta = LENSES.find((l) => l.id === lens) ?? LENSES[0];
  const cls = CLASSES.find((c) => c.id === openClass) ?? CLASSES[0];
  const stat = cls.stats[periodId];
  const closedShare = (stat.remedied / stat.customer) * 100;

  const swap = { duration: reduce ? 0 : 0.28, ease: "easeOut" as const };
  const grow = { duration: reduce ? 0 : 0.55, ease: "easeOut" as const };

  return (
    <section
      id="taxonomy"
      className="relative isolate border-t border-white/10 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
              Fig. 02
            </p>
            <h2
              className="mt-4 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Every kind of wrong, counted
            </h2>
            <p className="mt-5 max-w-[492px] text-[16px] font-normal leading-[1.6] text-[#D4D4D8]">
              Six classes. Each one is defined before it is counted, so the
              definition cannot move to flatter the number. Ordered by
              consequence rather than by volume, which is why the rarest class
              sits at the top: it is the one that ends with a fake in
              someone&rsquo;s hands.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div
              role="group"
              aria-label="Choose which misses are counted"
              className="flex flex-col gap-2 sm:flex-row lg:flex-col"
            >
              {LENSES.map((l) => {
                const on = l.id === lens;
                return (
                  <button
                    key={l.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setLens(l.id)}
                    className={`flex-1 rounded-[3px] border px-4 py-3 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none ${
                      on
                        ? "border-[#F2A93B] bg-[#F2A93B]/10"
                        : "border-white/12 bg-transparent hover:border-white/30"
                    }`}
                  >
                    <span
                      className={`block text-[13px] font-medium ${
                        on ? "text-white" : "text-[#D4D4D8]"
                      }`}
                    >
                      {l.label}
                    </span>
                    <span
                      className={`mt-1 block text-[11px] font-medium uppercase tracking-[0.16em] ${
                        on ? "text-[#F7C77A]" : "text-[#A1A1AA]"
                      }`}
                    >
                      {on ? "In view" : "Switch"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 lg:grid-cols-12">
          {/* ---- matrix ---- */}
          <div className="lg:col-span-7">
            <div className="border-y border-white/12 py-6">
              <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                    {lensMeta.label} &middot; {period.label}
                  </p>
                  <motion.p
                    key={`${lens}-${periodId}-rate`}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={swap}
                    className="mt-2 text-[clamp(2.6rem,6vw,4rem)] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums"
                    style={{ fontFamily: "var(--font-display-wide)" }}
                  >
                    {rate.toFixed(2)}%
                  </motion.p>
                </div>
                <div className="max-w-[431px]">
                  <p className="text-[13px] font-normal leading-[1.6] text-[#D4D4D8]">
                    <motion.span
                      key={`${lens}-${periodId}-count`}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={swap}
                      className="tabular-nums text-white"
                    >
                      {fmtInt(total)}
                    </motion.span>{" "}
                    of {fmtInt(period.appraisals)} appraisals.
                  </p>
                  <p className="mt-2 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
                    Ceiling we published:{" "}
                    <span className="font-medium text-[#F7C77A] tabular-nums">
                      {TARGETS[lens].toFixed(2)}%
                    </span>
                    . Over it by{" "}
                    <span className="tabular-nums text-white">
                      {gap.toFixed(2)}
                    </span>{" "}
                    points, this quarter and the two before it.
                  </p>
                </div>
              </div>
              <p className="mt-4 max-w-[462px] text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
                {lensMeta.caption}
              </p>
            </div>

            {/* column header, decorative for screen readers */}
            <div
              aria-hidden="true"
              className="mt-6 hidden items-end justify-between px-5 md:flex"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                Class &middot; share of the column in view
              </span>
              <span className="grid w-[16rem] grid-cols-3 gap-4 text-right text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                <span className={lens === "all" ? "text-white" : undefined}>
                  Cases
                </span>
                <span className={lens === "customer" ? "text-white" : undefined}>
                  Reached buyer
                </span>
                <span>Made good</span>
              </span>
            </div>

            <ul className="mt-2 flex flex-col">
              {CLASSES.map((c) => {
                const s = c.stats[periodId];
                const on = c.id === openClass;
                const share = classShare(c, periodId, lens);
                const count = classCount(c, periodId, lens);
                return (
                  <li key={c.id} className="border-t border-white/10 last:border-b">
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-label={`${c.name}. ${share.toFixed(
                        1
                      )} percent of the column in view. ${fmtInt(
                        s.cases
                      )} cases, ${fmtInt(s.internal)} caught by us, ${fmtInt(
                        s.customer
                      )} reached the buyer, ${fmtInt(
                        s.remedied
                      )} made good. Open the file.`}
                      onClick={() => setOpenClass(c.id)}
                      className={`w-full px-4 py-5 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7C77A] motion-reduce:transition-none md:px-5 ${
                        on ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className="text-[11px] font-medium tracking-[0.16em] text-[#A1A1AA] tabular-nums"
                        >
                          {c.index}
                        </span>
                        <span
                          className={`text-[15px] font-medium md:text-[16px] ${
                            on ? "text-white" : "text-[#D4D4D8]"
                          }`}
                        >
                          {c.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`ml-auto shrink-0 text-[10px] font-medium uppercase tracking-[0.16em] ${
                            on ? "text-[#F7C77A]" : "text-transparent"
                          }`}
                        >
                          Open
                        </span>
                      </span>

                      <span className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <span className="block w-full md:pr-8">
                          <span
                            aria-hidden="true"
                            className="block h-[6px] w-full rounded-full bg-white/10"
                          >
                            <motion.span
                              className={`block h-full rounded-full ${
                                on ? "bg-white" : "bg-[#8A8A93]"
                              }`}
                              initial={false}
                              animate={{ width: `${share.toFixed(2)}%` }}
                              transition={grow}
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className="mt-2 block text-[11px] font-medium tracking-[0.12em] text-[#A1A1AA] tabular-nums"
                          >
                            {share.toFixed(1)}% of the column &middot;{" "}
                            {((count / period.appraisals) * 100).toFixed(2)}% of
                            all appraisals
                          </span>
                        </span>

                        <span
                          aria-hidden="true"
                          className="hidden w-[16rem] shrink-0 grid-cols-3 gap-4 text-right md:grid"
                        >
                          <Cell value={s.cases} strong={lens === "all"} />
                          <Cell value={s.customer} strong={lens === "customer"} />
                          <Cell value={s.remedied} amber />
                        </span>

                        <span
                          aria-hidden="true"
                          className="grid grid-cols-3 gap-3 md:hidden"
                        >
                          <MiniCell label="Cases" value={s.cases} strong={lens === "all"} />
                          <MiniCell
                            label="Reached buyer"
                            value={s.customer}
                            strong={lens === "customer"}
                          />
                          <MiniCell label="Made good" value={s.remedied} amber />
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="mt-6 max-w-[462px] text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">
              Six rows and no seventh. There is no
              &ldquo;inconclusive&rdquo; column and no class called other. If a
              call was reversed, it sits in one of these six rows.
            </p>
          </div>

          {/* ---- dossier ---- */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <motion.article
                key={`${cls.id}-${periodId}-${lens}`}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={swap}
                className="border border-white/12 bg-white/[0.02] p-6 md:p-8"
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#A1A1AA]">
                  File {cls.index} &middot; {period.label}
                </p>
                <h3
                  className="mt-3 text-[22px] font-extrabold leading-[1.15] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-wide)" }}
                >
                  {cls.name}
                </h3>
                <p className="mt-3 max-w-[431px] text-[14px] font-normal leading-[1.6] text-[#A1A1AA]">
                  {cls.definition}
                </p>

                <dl className="mt-7 grid grid-cols-2 gap-x-4 gap-y-5 border-y border-white/10 py-6 sm:grid-cols-4">
                  <Stat label="Cases" value={fmtInt(stat.cases)} />
                  <Stat label="Caught by us" value={fmtInt(stat.internal)} />
                  <Stat label="Reached buyer" value={fmtInt(stat.customer)} />
                  <Stat
                    label="Median days to close"
                    value={fmtInt(stat.medianDays)}
                  />
                </dl>

                <div className="mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7C77A]">
                    Made good
                  </p>
                  <p className="mt-2 text-[14px] font-normal leading-[1.6] text-[#D4D4D8]">
                    <span className="tabular-nums text-white">
                      {fmtInt(stat.remedied)}
                    </span>{" "}
                    of {fmtInt(stat.customer)} settled
                    {stat.pending > 0 ? (
                      <>
                        , {fmtInt(stat.pending)} still open at the date this
                        report was compiled
                      </>
                    ) : (
                      <>, none left open</>
                    )}
                    .
                  </p>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-[3px] w-full bg-white/10"
                  >
                    <motion.span
                      className="block h-full bg-[#F2A93B]"
                      initial={false}
                      animate={{ width: `${closedShare.toFixed(2)}%` }}
                      transition={grow}
                    />
                  </span>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                    Worst logged case in this class &middot; {cls.worstRef}{" "}
                    &middot; {cls.worstLogged}
                  </p>
                  <p className="mt-3 max-w-[431px] text-[16px] font-medium leading-[1.5] text-white">
                    {cls.worstHeadline}
                  </p>
                  <p className="mt-3 max-w-[431px] text-[14px] font-normal leading-[1.6] text-[#D4D4D8]">
                    {cls.worstBody}
                  </p>
                  <p className="mt-4 max-w-[431px] text-[14px] font-normal leading-[1.6] text-[#A1A1AA]">
                    <span className="font-medium text-[#D4D4D8]">
                      What the person got:
                    </span>{" "}
                    {cls.worstOutcome}
                  </p>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#F7C77A]">
                    What we changed &middot; {cls.guardrailShipped}
                  </p>
                  <p className="mt-3 max-w-[431px] text-[14px] font-normal leading-[1.6] text-[#D4D4D8]">
                    {cls.guardrail}
                  </p>
                </div>

                <div className="mt-6 border-l-2 border-white/25 pl-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
                    What is still open
                  </p>
                  <p className="mt-2 max-w-[431px] text-[14px] font-normal leading-[1.6] text-[#D4D4D8]">
                    {cls.stillOpen}
                  </p>
                </div>
              </motion.article>
            </div>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-6 left-2 -z-10 select-none text-[clamp(6rem,18vw,14rem)] font-extrabold leading-none tracking-[-0.02em] text-white/[0.035]"
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        02
      </p>
    </section>
  );
}

function Cell({
  value,
  strong,
  amber,
}: {
  value: number;
  strong?: boolean;
  amber?: boolean;
}) {
  const tone = amber
    ? "text-[#F7C77A]"
    : strong
      ? "text-white"
      : "text-[#A1A1AA]";
  return (
    <span className={`text-[15px] font-medium tabular-nums ${tone}`}>
      {fmtInt(value)}
    </span>
  );
}

function MiniCell({
  label,
  value,
  strong,
  amber,
}: {
  label: string;
  value: number;
  strong?: boolean;
  amber?: boolean;
}) {
  const tone = amber
    ? "text-[#F7C77A]"
    : strong
      ? "text-white"
      : "text-[#D4D4D8]";
  return (
    <span className="block">
      <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
        {label}
      </span>
      <span className={`mt-1 block text-[15px] font-medium tabular-nums ${tone}`}>
        {fmtInt(value)}
      </span>
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#A1A1AA]">
        {label}
      </dt>
      <dd
        className="mt-2 text-[24px] font-extrabold leading-none tracking-[-0.02em] text-white tabular-nums"
        style={{ fontFamily: "var(--font-display-wide)" }}
      >
        {value}
      </dd>
    </div>
  );
}
