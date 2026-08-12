"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import ListingCard from "./listing-card";
import {
  GRADE_META,
  INITIAL_BRIEF,
  READING_OPTIONS,
  SLOT_META,
  buildReport,
  money,
  phrasesFor,
  type BriefState,
  type SlotKey,
} from "./data";

/**
 * Entrance is a keyframe whose *resting* state is the finished one (see `@keyframes rise` in
 * globals.css), not a viewport-triggered opacity flip. Anything below the fold is therefore painted
 * fully visible whether or not an IntersectionObserver ever fires, and `motion-reduce` lands on a
 * visible element rather than an invisible one.
 */
const RISE = "animate-[rise_600ms_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none";

const CTA =
  "inline-flex items-center gap-2 rounded-full bg-[#6E56CF] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-[#5B45B4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6A6F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]";

const EYEBROW = "text-[11px] font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]";
const CAPTION = "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]";
const SHELL = "mx-auto w-full max-w-[1120px] px-5 md:px-8";

function GhostNumber({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      className="block font-extrabold leading-none text-[#606070]"
      style={{ fontFamily: "var(--font-display-mono)", fontSize: "clamp(2.5rem,6vw,4rem)", letterSpacing: "-0.02em" }}
    >
      {value}
    </span>
  );
}

function PhraseChip({
  slot,
  phrase,
  active,
  reduced,
  onOpen,
}: {
  slot: SlotKey;
  phrase: string;
  active: boolean;
  reduced: boolean;
  onOpen: (slot: SlotKey) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(slot)}
      whileTap={{ scale: reduced ? 1 : 0.97 }}
      aria-expanded={active}
      aria-controls="brief-options"
      className={`relative inline-flex items-center rounded-lg border px-2 py-0.5 font-extrabold text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6A6F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] ${
        active ? "border-[#6E56CF] bg-[#6E56CF]/25" : "border-[#2E2E38] bg-[#15151B] hover:border-[#6E56CF]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrase}
          initial={{ opacity: 0, y: reduced ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -6 }}
          transition={{ duration: reduced ? 0 : 0.16 }}
          className="inline-block"
        >
          {phrase}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only"> — press to swap this phrase</span>
    </motion.button>
  );
}

function OptionButton({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6A6F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F] ${
        selected
          ? "border-[#6E56CF] bg-[#6E56CF] text-white"
          : "border-[#2E2E38] bg-[#15151B] text-[#E7E7EC] hover:border-[#6E56CF]"
      }`}
    >
      {selected ? <Check aria-hidden="true" className="size-3.5" /> : null}
      {label}
    </button>
  );
}

export default function BriefLanding() {
  const [brief, setBrief] = useState<BriefState>(INITIAL_BRIEF);
  const [openSlot, setOpenSlot] = useState<SlotKey>("condition");
  const reduced = useReducedMotion() ?? false;
  const report = useMemo(() => buildReport(brief), [brief]);

  function setSlot(slot: SlotKey, index: number) {
    setBrief((prev) => {
      const next: BriefState = { ...prev };
      next[slot] = index;
      return next;
    });
  }

  function setReading(index: number) {
    setBrief((prev) => ({ ...prev, reading: index }));
  }

  const railOptions = phrasesFor(openSlot);
  const railSelected = brief[openSlot];

  return (
    <div className="min-h-dvh bg-[#0B0B0F] text-white">
      <header className={`${SHELL} flex items-center justify-between gap-4 py-6`}>
        <span
          className="text-[15px] font-extrabold tracking-[-0.02em] text-white"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          repick
        </span>
        <span className={CAPTION}>Standing brief · marketplace</span>
      </header>

      <main>
        {/* 1 — HERO. The sentence is the interface; the readout beside it is the proof, on by default. */}
        <section id="brief" className={`${SHELL} pt-6 pb-14 md:pt-10 md:pb-24`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="min-w-0 lg:col-span-7">
              <p className={`${EYEBROW} ${RISE}`}>Standing brief</p>

              <h1
                className={`mt-5 font-extrabold ${RISE}`}
                style={{
                  fontFamily: "var(--font-display-mono)",
                  fontSize: "clamp(1.6rem,4.6vw,3.25rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.18,
                }}
              >
                Find me a{" "}
                <PhraseChip
                  slot="condition"
                  phrase={report.conditionPhrase}
                  active={openSlot === "condition"}
                  reduced={reduced}
                  onOpen={setOpenSlot}
                />{" "}
                <PhraseChip
                  slot="category"
                  phrase={report.categoryPhrase}
                  active={openSlot === "category"}
                  reduced={reduced}
                  onOpen={setOpenSlot}
                />{" "}
                under{" "}
                <PhraseChip
                  slot="budget"
                  phrase={report.budgetPhrase}
                  active={openSlot === "budget"}
                  reduced={reduced}
                  onOpen={setOpenSlot}
                />{" "}
                from{" "}
                <PhraseChip
                  slot="seller"
                  phrase={report.sellerPhrase}
                  active={openSlot === "seller"}
                  reduced={reduced}
                  onOpen={setOpenSlot}
                />
                .
              </h1>

              <div
                id="brief-options"
                className={`mt-7 rounded-2xl border border-[#232329] bg-[#101015] p-4 md:p-5 ${RISE}`}
                style={{ animationDelay: "90ms" }}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className={CAPTION} style={{ fontFamily: "var(--font-display-mono)" }}>
                    Swap · {SLOT_META[openSlot].label}
                  </p>
                  <p className="text-[13px] text-[#A1A1AA]">{SLOT_META[openSlot].hint}</p>
                </div>
                <div
                  role="group"
                  aria-label={`Alternatives for the ${SLOT_META[openSlot].label.toLowerCase()} phrase`}
                  className="mt-3 flex flex-wrap gap-2"
                >
                  {railOptions.map((option, index) => (
                    <OptionButton
                      key={option}
                      label={option}
                      selected={index === railSelected}
                      onSelect={() => setSlot(openSlot, index)}
                    />
                  ))}
                </div>
                <p className="mt-3 max-w-[62ch] text-[13px] leading-[1.6] text-[#A1A1AA]">
                  One swap rewrites the sentence, re-ranks the four listings below, rewrites every reason
                  tag on them and re-argues the order in plain English.
                </p>
              </div>

              <div
                className={`mt-7 flex flex-col gap-5 sm:flex-row sm:items-center ${RISE}`}
                style={{ animationDelay: "160ms" }}
              >
                <a href="#the-field" className={CTA}>
                  See the ranked field
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
                <p className="max-w-[46ch] text-[15px] leading-[1.6] text-[#A1A1AA]">
                  repick reads the brief as a sentence, not a keyword string. Nothing here is hidden
                  behind a click — the field is already ranked.
                </p>
              </div>
            </div>

            {/* Proof panel — first fold, no interaction required. */}
            <aside
              className={`min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5 md:p-6 lg:col-span-5 ${RISE}`}
              style={{ animationDelay: "230ms" }}
            >
              <p className={CAPTION}>Fig. 01 — Live readout</p>
              <h2
                className="mt-2 text-[20px] font-extrabold text-white"
                style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
              >
                Why this order
              </h2>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#E7E7EC]">{report.prose}</p>

              <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[#232329] pt-5">
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                    Full matches
                  </dt>
                  <dd
                    className="mt-1.5 text-[22px] font-extrabold tabular-nums text-white"
                    style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                  >
                    {report.fullMatches}
                    <span className="text-[#A1A1AA]">/{report.poolSize}</span>
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                    Median ask
                  </dt>
                  <dd
                    className="mt-1.5 text-[22px] font-extrabold tabular-nums text-white"
                    style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                  >
                    {money(report.medianAsk)}
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                    Below list
                  </dt>
                  <dd
                    className="mt-1.5 text-[22px] font-extrabold tabular-nums text-white"
                    style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                  >
                    {report.avgDiscount}%
                  </dd>
                </div>
              </dl>

              {report.nextUp ? (
                <p className="mt-5 border-t border-[#232329] pt-5 text-[13px] leading-[1.6] text-[#A1A1AA]">
                  <span className={CAPTION}>Closest miss</span>
                  <br />
                  {report.nextUp.listing.name} at{" "}
                  <span className="tabular-nums text-[#E7E7EC]">{report.nextUp.score}%</span> —{" "}
                  {report.nextUpReason}.
                </p>
              ) : null}
            </aside>
          </div>
        </section>

        {/* 2 — THE FIELD. Four parallel cards, fully tagged at rest. */}
        <section id="the-field" className={`${SHELL} border-t border-[#1B1B22] py-16 md:py-28`}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <GhostNumber value="02" />
              <h2
                className="mt-3 font-extrabold text-white"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  fontSize: "clamp(1.5rem,3.6vw,2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                The field, re-ranked
              </h2>
              <p className={`${CAPTION} mt-3`}>Fig. 02 — Four of {report.poolSize} listings</p>
            </div>
            <p className="min-w-0 max-w-[68ch] self-end text-[15px] leading-[1.6] text-[#A1A1AA] lg:col-span-7">
              Every card carries its match score, condition grade, seller verification and the gap
              between the asking price and the original list price — at rest, before you touch
              anything. Swap a phrase upstairs and the order, the scores and the tags below all move
              together.
            </p>
          </div>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AnimatePresence initial={false}>
              {report.shortlist.map((scored, index) => (
                <ListingCard
                  key={scored.listing.id}
                  scored={scored}
                  rank={index + 1}
                  reduced={reduced}
                />
              ))}
            </AnimatePresence>
          </ul>
        </section>

        {/* 3 — VALUE, computed. Each column is a figure the same brief moves. */}
        <section className={`${SHELL} border-t border-[#1B1B22] py-16 md:py-28`}>
          <GhostNumber value="03" />
          <h2
            className="mt-3 font-extrabold text-white"
            style={{
              fontFamily: "var(--font-display-mono)",
              fontSize: "clamp(1.5rem,3.6vw,2.5rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            What the sentence is worth
          </h2>

          <div className="mt-8 rounded-2xl border border-[#232329] bg-[#101015] p-5 md:p-6">
            <p
              className="font-extrabold text-white"
              style={{
                fontFamily: "var(--font-display-mono)",
                fontSize: "clamp(1.1rem,2.4vw,1.75rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}
            >
              Rank the field by{" "}
              <span className="rounded-lg border border-[#6E56CF] bg-[#6E56CF]/25 px-2 py-0.5">
                {report.readingPhrase}
              </span>{" "}
              of that brief.
            </p>
            <div
              role="group"
              aria-label="Alternatives for the reading phrase"
              className="mt-4 flex flex-wrap gap-2"
            >
              {READING_OPTIONS.map((option, index) => (
                <OptionButton
                  key={option.phrase}
                  label={option.phrase}
                  selected={index === brief.reading}
                  onSelect={() => setReading(index)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5 md:p-6 lg:col-span-5">
              <p className={CAPTION}>01 — Reads terms, not keywords</p>
              <h3 className="mt-2 text-[18px] font-semibold text-white">The term doing the work</h3>
              <p
                className="mt-4 text-[40px] font-extrabold tabular-nums leading-none text-white"
                style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
              >
                {report.binding.count}
                <span className="text-[#A1A1AA]">/{report.poolSize}</span>
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#A1A1AA]">
                listings fall out on{" "}
                <span className="text-[#E7E7EC]">
                  {report.binding.count === 0 ? "no single term" : report.binding.label}
                </span>{" "}
                alone. Four terms are parsed from one sentence, and repick tells you which one is
                costing you the field.
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5 md:p-6 lg:col-span-4">
              <p className={CAPTION}>02 — Graded before listed</p>
              <h3 className="mt-2 text-[18px] font-semibold text-white">
                Grade spread in {report.categoryPhrase}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {report.gradeSpread.map((row) => (
                  <li key={row.grade}>
                    <div className="flex items-baseline justify-between gap-2 text-[13px]">
                      <span className="font-semibold text-[#E7E7EC]">
                        {GRADE_META[row.grade].code} · {GRADE_META[row.grade].label}
                      </span>
                      <span className="tabular-nums text-[#A1A1AA]">
                        {row.count} of {report.inCategory}
                      </span>
                    </div>
                    <div aria-hidden="true" className="mt-1.5 h-1 w-full rounded-full bg-[#26262E]">
                      <motion.div
                        initial={false}
                        animate={{ scaleX: report.inCategory === 0 ? 0 : row.count / report.inCategory }}
                        transition={{ duration: reduced ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "left" }}
                        className="h-full w-full rounded-full bg-[#6E56CF]"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5 md:p-6 lg:col-span-3">
              <p className={CAPTION}>03 — Priced against the ask</p>
              <h3 className="mt-2 text-[18px] font-semibold text-white">Under your ceiling</h3>
              <p
                className="mt-4 text-[40px] font-extrabold tabular-nums leading-none text-white"
                style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
              >
                {report.underCeiling}
                <span className="text-[#A1A1AA]">/{report.inCategory}</span>
              </p>
              <p className="mt-3 text-[15px] leading-[1.6] text-[#A1A1AA]">
                sit under {report.budgetPhrase}. The shortlist asks a median of{" "}
                <span className="tabular-nums text-[#E7E7EC]">{money(report.medianAsk)}</span>, which is{" "}
                <span className="tabular-nums text-[#E7E7EC]">{report.avgDiscount}%</span> below what
                these sellers first listed at.
              </p>
            </div>
          </div>
        </section>

        {/* 4 — SOCIAL PROOF */}
        <section className={`${SHELL} border-t border-[#1B1B22] py-16 md:py-28`}>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <GhostNumber value="04" />
              <h2
                className="mt-3 font-extrabold text-white"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  fontSize: "clamp(1.5rem,3.6vw,2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                What holds up after the click
              </h2>
              <p className={`${CAPTION} mt-3`}>Fig. 03 — Buyers on kept purchases</p>

              <div className="mt-8 flex flex-col gap-6">
                <figure className="border-l-2 border-[#6E56CF] pl-5">
                  <span
                    aria-hidden="true"
                    className="block font-extrabold leading-none text-[#606070]"
                    style={{ fontFamily: "var(--font-display-mono)", fontSize: "2rem" }}
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mt-1 max-w-[68ch] text-[17px] leading-[1.6] text-[#E7E7EC]">
                    I stopped scrolling listings. I wrote one sentence, changed two words in it, and
                    the ranking told me what the change had cost me.
                  </blockquote>
                  <figcaption className="mt-3 text-[13px] text-[#A1A1AA]">
                    Priya S. — film shooter, third purchase
                  </figcaption>
                </figure>
                <figure className="border-l-2 border-[#2E2E38] pl-5">
                  <blockquote className="max-w-[68ch] text-[17px] leading-[1.6] text-[#E7E7EC]">
                    The grade on the card matched the item in the box. That has never happened to me
                    on a resale app before.
                  </blockquote>
                  <figcaption className="mt-3 text-[13px] text-[#A1A1AA]">
                    Tomas R. — bought the Marlow Steel Tourer
                  </figcaption>
                </figure>
                <figure className="border-l-2 border-[#2E2E38] pl-5">
                  <blockquote className="max-w-[68ch] text-[17px] leading-[1.6] text-[#E7E7EC]">
                    Seeing why a listing lost was worth more than seeing why one won.
                  </blockquote>
                  <figcaption className="mt-3 text-[13px] text-[#A1A1AA]">
                    Wren A. — coat buyer, kept it
                  </figcaption>
                </figure>
              </div>
            </div>

            <ul className="grid min-w-0 grid-cols-1 gap-4 self-start sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              <li className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5">
                <p
                  className="text-[32px] font-extrabold tabular-nums leading-none text-white"
                  style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                >
                  18,400
                </p>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  Items graded in person
                </p>
              </li>
              <li className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5">
                <p
                  className="text-[32px] font-extrabold tabular-nums leading-none text-white"
                  style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                >
                  92%
                </p>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  Of picks kept, not returned
                </p>
              </li>
              <li className="min-w-0 rounded-2xl border border-[#232329] bg-[#101015] p-5">
                <p
                  className="text-[32px] font-extrabold tabular-nums leading-none text-white"
                  style={{ fontFamily: "var(--font-display-mono)", letterSpacing: "-0.02em" }}
                >
                  4
                </p>
                <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  Terms parsed per brief
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* 5 — CLOSE. The brief, restated in its current state. */}
        <section className={`${SHELL} border-t border-[#1B1B22] py-16 md:py-28`}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <GhostNumber value="05" />
              <h2
                className="mt-3 font-extrabold text-white"
                style={{
                  fontFamily: "var(--font-display-mono)",
                  fontSize: "clamp(1.5rem,3.6vw,2.5rem)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                Take the brief to the field
              </h2>
              <p className="mt-5 max-w-[68ch] text-[16px] leading-[1.6] text-[#A1A1AA]">
                Your brief right now:{" "}
                <span className="text-[#E7E7EC]">
                  Find me a {report.conditionPhrase} {report.categoryPhrase} under{" "}
                  {report.budgetPhrase} from {report.sellerPhrase}
                </span>
                , ranked under {report.readingPhrase}. It stays live — repick re-runs it against every
                item graded into stock and tells you what changed.
              </p>
            </div>
            <div className="flex min-w-0 flex-col justify-end gap-3 lg:col-span-4 lg:items-end">
              <a href="#brief" className={CTA}>
                Rewrite the brief
                <ArrowRight aria-hidden="true" className="size-4" />
              </a>
              <p className="text-[13px] text-[#A1A1AA]">No account needed to watch the order move.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={`${SHELL} flex flex-wrap items-center justify-between gap-3 border-t border-[#1B1B22] py-8`}>
        <span
          className="text-[13px] font-extrabold tracking-[-0.02em] text-white"
          style={{ fontFamily: "var(--font-display-mono)" }}
        >
          repick
        </span>
        <span className={CAPTION}>Fig. 05 — Standing brief, r9 a</span>
      </footer>
    </div>
  );
}
