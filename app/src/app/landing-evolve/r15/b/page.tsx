"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import SwipeDeck from "./SwipeDeck";
import {
  ENTRANCE_DURATION,
  LISTINGS,
  discountPct,
  money,
  passStats,
  profileFromHistory,
  rankChangeCount,
  rankListings,
  tagLabel,
  topTag,
  type RankedListing,
  type SwipeDir,
  type SwipeRecord,
} from "./data";

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]";
const EYEBROW = "text-[11px] font-semibold tracking-[0.28em] text-[#0F766E]";
const CAPTION = "text-[11px] font-normal tracking-[0.16em] text-[#6B6B76]";
const STAT_LABEL = "text-[10px] font-semibold tracking-[0.12em] text-[#6B6B76]";
const DISPLAY = { fontFamily: "var(--font-display-mono)" } as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "180px 0px 180px 0px" }}
      transition={{ duration: ENTRANCE_DURATION, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StateChip({ state }: { state: RankedListing["state"] }) {
  if (state === "keep") {
    return (
      <span className="rounded-full bg-[#0F766E]/[0.12] px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#0F766E]">
        KEPT
      </span>
    );
  }
  if (state === "pass") {
    return (
      <span className="rounded-full bg-black/[0.06] px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#6B6B76]">
        PASSED
      </span>
    );
  }
  return (
    <span className="rounded-full border border-black/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#6B6B76]">
      QUEUED
    </span>
  );
}

function RankedCard({ item, delay }: { item: RankedListing; delay: number }) {
  const reduce = useReducedMotion();
  const delta = item.match - item.baseMatch;
  const deltaText =
    delta === 0 ? "at baseline" : delta > 0 ? `+${delta} from baseline` : `${delta} from baseline`;
  const revealProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0, margin: "180px 0px 180px 0px" },
        transition: {
          duration: ENTRANCE_DURATION,
          delay,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        },
      };
  return (
    <motion.li
      className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_18px_40px_-24px_rgba(17,17,20,0.35)]"
      {...revealProps}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="select-none text-[26px] font-extrabold leading-none tracking-[-0.01em] tabular-nums text-[#7A7A85]"
          style={DISPLAY}
        >
          {String(item.rank).padStart(2, "0")}
        </span>
        <StateChip state={item.state} />
      </div>

      <div className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 1024px) 280px, 45vw"
          className="object-cover"
        />
      </div>

      <p className="mt-3 text-[11px] font-normal text-[#6B6B76]">
        {item.category} · {item.brand}
      </p>
      <h3 className="mt-1 text-[16px] font-semibold leading-snug tracking-[-0.01em] text-[#111114]">
        {item.title}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full bg-[#0F766E] px-2.5 py-1 text-[11px] font-semibold text-white">
          {item.match}% match
        </span>
        <span className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-normal text-[#111114]">
          Grade {item.grade}
        </span>
        <span className="rounded-full border border-[#0F766E]/40 bg-[#0F766E]/[0.08] px-2.5 py-1 text-[11px] font-normal text-[#0F766E]">
          Verified
        </span>
      </div>

      <p className="mt-2 text-[12px] font-normal leading-[1.6] text-[#6B6B76]">
        Matches your {tagLabel(item.tags[0])} &amp; {tagLabel(item.tags[1])} lean —{" "}
        <span className="tabular-nums">{deltaText}</span>
      </p>

      <div className="mt-auto pt-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-[18px] font-extrabold tracking-[-0.02em] tabular-nums text-[#111114]">
            {money(item.repick)} won
          </span>
          <span className="text-[12px] font-normal tabular-nums text-[#6B6B76] line-through">
            {money(item.retail)} won
          </span>
          <span className="rounded-full border border-black/20 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#111114]">
            -{discountPct(item)}%
          </span>
        </div>
      </div>
    </motion.li>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "I passed on the first three boots and the fourth pick already knew I meant leather, not suede. That is faster than any filter I have used.",
    who: "Iris Vance",
    what: "Kept a leather sneaker on pick 5",
    avatar: {
      src: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
      alt: "Iris Vance, portrait photo",
    },
  },
  {
    quote:
      "The bars next to the deck are the actual model, not a summary of it. I could see minimal pull ahead in real time and I trusted the ranking because of it.",
    who: "Dae-hyun Roh",
    what: "Reviewed all 8 nearby picks",
    avatar: {
      src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      alt: "Dae-hyun Roh, portrait photo",
    },
  },
  {
    quote:
      "Passing on the trucker jacket quietly dropped every other workwear piece a few points. Nobody tells you that part usually.",
    who: "Priya Nair",
    what: "Kept 3 of 8 on first pass",
    avatar: {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
      alt: "Priya Nair, portrait photo",
    },
  },
];

export default function Page() {
  const reduce = useReducedMotion();
  const [history, setHistory] = useState<SwipeRecord[]>([]);

  const profile = useMemo(() => profileFromHistory(history), [history]);
  const ranked = useMemo(() => rankListings(history), [history]);
  const changed = useMemo(() => rankChangeCount(history), [history]);
  const lead = useMemo(() => topTag(profile), [profile]);
  const passInfo = useMemo(() => passStats(history), [history]);
  const best = ranked[0];

  function commit(dir: SwipeDir) {
    setHistory((h) => {
      const next = LISTINGS[h.length];
      if (!next) return h;
      return [...h, { itemId: next.id, dir }];
    });
  }
  function undo() {
    setHistory((h) => h.slice(0, -1));
  }
  function reset() {
    setHistory([]);
  }

  const heroIn = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: ENTRANCE_DURATION, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      };

  return (
    <main className="min-h-dvh overflow-x-clip bg-[#FAFAF7] font-normal text-[#111114] antialiased">
      {/* ---------------------------------------------------------------- HERO */}
      <section className="border-b border-black/10 px-5 pb-16 pt-14 sm:px-8 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
            <motion.div className="lg:col-span-5" {...heroIn}>
              <p className={EYEBROW}>SWIPE-BUILT MATCH PROFILE</p>
              <h1
                className="mt-5 text-[clamp(2.1rem,7.4vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#111114]"
                style={DISPLAY}
              >
                Keep what fits.
                <span className="block">Pass what doesn&rsquo;t.</span>
              </h1>
              <p className="mt-6 max-w-[554px] text-[18px] font-normal leading-[1.6] text-[#3F3F46]">
                Drag right on a nearby pick to keep it, left to pass. Each choice sharpens your
                match score and reorders every pick below it — while you watch, not after a form.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#ranked"
                  className={`inline-flex rounded-full bg-[#0F766E] px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0C5F58] ${FOCUS}`}
                >
                  See the ranked list
                </a>
                <span className={STAT_LABEL}>8 PICKS NEAR YOU · NO ACCOUNT NEEDED</span>
              </div>

              <p className={`mt-10 ${CAPTION}`}>Fig. 01 — Live picks, reordered by your last swipe</p>
            </motion.div>

            <motion.div className="lg:col-span-7" {...heroIn}>
              <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className={CAPTION}>Fig. 02 — Drag, or use Pass / Keep</p>
                  <p className={`${STAT_LABEL} tabular-nums`}>ITEM {Math.min(history.length + 1, LISTINGS.length)} OF {LISTINGS.length}</p>
                </div>
                <div className="mt-4">
                  <SwipeDeck
                    history={history}
                    profile={profile}
                    onCommit={commit}
                    onUndo={undo}
                    onReset={reset}
                    reduce={!!reduce}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- RANKED */}
      <section id="ranked" className="border-b border-black/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <div className="flex items-end gap-5">
              <span
                aria-hidden="true"
                className="select-none text-[clamp(2rem,3.2vw,2.5rem)] font-extrabold leading-[0.9] tracking-[0.02em] text-[#7A7A85]"
                style={DISPLAY}
              >
                02
              </span>
              <div>
                <p className={EYEBROW}>RANKED FOR YOU</p>
                <h2
                  className="mt-3 max-w-[720px] text-[clamp(1.6rem,4.2vw,2.7rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
                  style={DISPLAY}
                >
                  The same 8 picks, reordered live.
                </h2>
              </div>
            </div>
            <p className="mt-5 max-w-[493px] text-[16px] font-normal leading-[1.6] text-[#3F3F46]">
              No separate results page. This is the exact catalogue in the deck above, sorted by
              the match score your last swipe just changed.
            </p>
          </Reveal>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ranked.map((item, i) => (
              <RankedCard key={item.id} item={item} delay={Math.min(i, 4) * 0.04} />
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- THREE-WAY */}
      <section className="border-b border-black/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>WHY IT WORKS</p>
            <h2
              className="mt-4 max-w-[820px] text-[clamp(1.6rem,4.2vw,2.7rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={DISPLAY}
            >
              A swipe is a rewrite, not a vote you cast once.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                idx: "01",
                title: "It reorders, not just glows",
                value: `${changed} of ${LISTINGS.length} moved`,
                copy: "Watch rank change while you swipe — the grid above updates in place, using the same eight nearby picks, not a curated highlight reel.",
              },
              {
                idx: "02",
                title: "Your lean, shown plainly",
                value: lead ? `${lead.tag.label} +${lead.value}` : "No lean yet",
                copy: "The bars beside the deck are the whole model. Nothing about your taste profile sits behind a black box you can't see.",
              },
              {
                idx: "03",
                title: "A pass prunes too",
                value:
                  passInfo.count > 0
                    ? `${passInfo.count} passed · avg ${passInfo.avgDrop}%`
                    : "No passes yet",
                copy: "Passing on a style does more than skip one item — it quietly lowers the match on everything else that shares its tags.",
              },
            ].map((card, i) => (
              <Reveal key={card.idx} delay={i * 0.05}>
                <div className="h-full rounded-2xl border border-black/10 bg-white p-6">
                  <span
                    aria-hidden="true"
                    className="block select-none text-[1.7rem] font-extrabold leading-none tracking-[0.02em] text-[#7A7A85]"
                    style={DISPLAY}
                  >
                    {card.idx}
                  </span>
                  <h3 className="mt-5 text-[15px] font-semibold tracking-[-0.01em]">{card.title}</h3>
                  <p
                    className="mt-3 text-[clamp(1.2rem,2.8vw,1.6rem)] font-extrabold leading-tight tracking-[-0.02em] tabular-nums"
                    style={DISPLAY}
                  >
                    {card.value}
                  </p>
                  <p className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#3F3F46]">
                    {card.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- SOCIAL PROOF */}
      <section className="border-b border-black/10 px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>SWIPERS</p>
            <h2
              className="mt-4 max-w-[720px] text-[clamp(1.6rem,4.2vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={DISPLAY}
            >
              They stopped scrolling and started deciding.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.who} delay={i * 0.05}>
                <figure className="h-full rounded-2xl border border-black/10 bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-black/10">
                      <Image src={t.avatar.src} alt={t.avatar.alt} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight">{t.who}</p>
                      <p className="text-[12px] font-normal leading-tight text-[#6B6B76]">{t.what}</p>
                    </div>
                  </div>
                  <blockquote className="mt-4 max-w-[440px] text-[15px] font-normal leading-[1.6] text-[#111114]">
                    {t.quote}
                  </blockquote>
                </figure>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <dl className="mt-10 grid grid-cols-1 gap-6 border-t border-black/10 pt-8 tabular-nums sm:grid-cols-3">
              {[
                { k: "SWIPE SESSIONS THIS MONTH", v: "14,208", n: "across every metro" },
                { k: "KEEP WITHIN TOP 3 RANKED", v: "92%", n: "median across sessions" },
                { k: "MEDIAN SWIPES BEFORE A KEEP", v: "2.4", n: "before the first keep" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className={STAT_LABEL}>{s.k}</dt>
                  <dd
                    className="mt-2 text-[clamp(1.4rem,3.2vw,1.9rem)] font-extrabold leading-none tracking-[-0.02em]"
                    style={DISPLAY}
                  >
                    {s.v}
                  </dd>
                  <dd className="mt-1 text-[13px] font-normal text-[#6B6B76]">{s.n}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- CLOSING CTA */}
      <section className="px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <p className={EYEBROW}>KEEP SWIPING</p>
            <h2
              className="mt-5 max-w-[900px] text-[clamp(1.9rem,6vw,3.3rem)] font-extrabold leading-[1.02] tracking-[-0.02em]"
              style={DISPLAY}
            >
              Bring your next swipe. We already reordered for it.
            </h2>
            <p className="mt-6 max-w-[493px] text-[16px] font-normal leading-[1.6] text-[#3F3F46]">
              No account to build a profile — eight nearby picks, drag or tap, and the list
              rewrites itself while you watch.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#ranked"
                className={`inline-flex rounded-full bg-[#0F766E] px-8 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[#0C5F58] ${FOCUS}`}
              >
                Start swiping
              </a>
              <span className="text-[13px] font-normal tabular-nums text-[#6B6B76]">
                {best
                  ? history.length === 0
                    ? `No picks reviewed yet — best match defaults to ${best.title} at ${best.match}%.`
                    : `${history.length} of ${LISTINGS.length} reviewed. Best match now: ${best.title} at ${best.match}%, ${discountPct(best)}% below retail.`
                  : ""}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-black/10 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-4">
          <span className="text-[13px] font-semibold tracking-[-0.02em]">Repick</span>
          <span className={CAPTION}>SWIPE-BUILT MATCH PROFILE · SAMPLE DATA</span>
        </div>
      </footer>
    </main>
  );
}
