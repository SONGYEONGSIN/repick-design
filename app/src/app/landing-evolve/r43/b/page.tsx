"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ShieldCheck, Tag, Trophy, Camera } from "lucide-react";

const DISPLAY = { fontFamily: "var(--font-display-wide)" } as const;
const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]";

const ASK_PRICE = 480;
const FIXED_BIDS = [410, 395, 430, 365, 448, 300];

function rankOf(yourOffer: number): { rank: number; total: number; chance: number } {
  const all = [...FIXED_BIDS, yourOffer];
  const sorted = [...all].sort((x, y) => y - x);
  const rank = sorted.indexOf(yourOffer) + 1;
  const total = all.length;
  const chance = Math.round(((total - rank + 1) / total) * 100 * 0.9 + 5);
  return { rank, total, chance };
}

const LISTING = {
  title: "Sony A7III body, shutter count under 12k",
  match: 93,
  grade: "A-",
  verified: true,
  off: 14,
};

export default function Page() {
  const [offer, setOffer] = useState(326); // non-trivial default: mid-pack, not top or last

  const { rank, total, chance } = useMemo(() => rankOf(offer), [offer]);

  const ladder = useMemo(() => {
    const rows = [...FIXED_BIDS.map((v) => ({ value: v, you: false })), { value: offer, you: true }];
    return rows.sort((a, b) => b.value - a.value);
  }, [offer]);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-[#c2410c] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-white ${FOCUS_RING}`}
      >
        Skip to content
      </a>

      <header className="border-b border-zinc-100 px-4 py-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <span className="text-sm font-semibold tracking-[-0.02em] text-zinc-950">repick</span>
          <nav className="hidden items-center gap-6 sm:flex" aria-label="Primary">
            <a href="#ladder" className={`text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 ${FOCUS_RING} rounded-sm`}>
              The ladder
            </a>
            <a href="#proof" className={`text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 ${FOCUS_RING} rounded-sm`}>
              Reviews
            </a>
          </nav>
          <a
            href="#ladder"
            className={`rounded-md bg-[#c2410c] px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9a3412] ${FOCUS_RING}`}
          >
            Place a bid
          </a>
        </div>
      </header>

      <main id="main-content">
        <section id="ladder" className="px-4 py-24 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-zinc-500">LIVE BIDDING</p>
              <h1
                style={DISPLAY}
                className="mt-4 text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] lg:max-w-xl"
              >
                See exactly where your bid lands.
              </h1>
              <p className="mt-6 max-w-[500px] text-base font-normal leading-[1.6] text-zinc-600">
                Move your offer and watch the ladder re-sort in real time —
                your rank and your odds come from the same six competing bids.
              </p>

              <div className="mt-10 max-w-[480px] rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="flex items-center justify-between">
                  <label htmlFor="offer" className="text-sm font-semibold text-zinc-700">
                    Your offer
                  </label>
                  <span className="text-lg font-bold tabular-nums text-zinc-950">${offer}</span>
                </div>
                <input
                  id="offer"
                  type="range"
                  min={250}
                  max={ASK_PRICE}
                  step={1}
                  value={offer}
                  onChange={(e) => setOffer(Number(e.target.value))}
                  className={`mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-[#c2410c] ${FOCUS_RING}`}
                  aria-valuetext={`$${offer}`}
                />
                <div className="mt-2 flex justify-between text-xs font-normal text-zinc-500">
                  <span>$250</span>
                  <span>Ask ${ASK_PRICE}</span>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-[0.28em] text-zinc-500">THE LADDER</p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#c2410c]/10 px-3 py-1 text-xs font-semibold text-[#9a3412]">
                    <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                    Rank {rank} of {total}
                  </span>
                </div>
                <ul className="mt-5 space-y-1.5" aria-label="Current bid ladder">
                  {ladder.map((row, i) => (
                    <motion.li
                      key={row.you ? "you" : `bid-${row.value}`}
                      layout
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-sm ${
                        row.you ? "bg-[#c2410c] font-semibold text-white" : "bg-white font-normal text-zinc-700"
                      }`}
                    >
                      <span>{row.you ? "You" : `Bidder ${i + 1}`}</span>
                      <span className="tabular-nums">${row.value}</span>
                    </motion.li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-normal text-zinc-700">
                  Estimated chance to win:{" "}
                  <span className="font-semibold tabular-nums text-zinc-950">{chance}%</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-500">UP FOR BID</p>
            <div className="mt-8 max-w-xl rounded-xl border border-zinc-200 p-5">
              <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-zinc-100">
                <Camera className="h-8 w-8 text-zinc-400" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold text-zinc-950">{LISTING.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-normal text-zinc-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#c2410c]" aria-hidden="true" />
                  {LISTING.match}% match
                </span>
                <span className="rounded-full bg-zinc-100 px-2 py-1">Grade {LISTING.grade}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#c2410c]" aria-hidden="true" />
                  Verified seller
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1">
                  <Tag className="h-3.5 w-3.5 text-[#c2410c]" aria-hidden="true" />
                  -{LISTING.off}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
            {[
              { title: "Six real bids, one ladder", body: "Your offer is inserted into the same ordered list every other bidder sees — nothing is hidden behind a modal." },
              { title: "Odds from rank, not guesswork", body: "Chance to win is computed from where you land among seven total bids, not a marketing estimate." },
              { title: "Move it as many times as you like", body: "The ladder re-sorts on every change. There's no submit step until you're ready." },
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: i * 0.04 }}
                className="rounded-xl border border-zinc-200 p-6"
              >
                <h2 className="text-base font-semibold text-zinc-950">{v.title}</h2>
                <p className="mt-2 max-w-[420px] text-sm font-normal leading-[1.6] text-zinc-600">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="proof" className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-zinc-500">FROM BIDDERS</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <blockquote className="rounded-xl border border-zinc-200 p-6 text-sm font-normal leading-[1.6] text-zinc-700">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                I raised my offer by eleven dollars and watched myself jump two spots. No other site shows you that.
                <footer className="mt-4 text-xs font-semibold text-zinc-500">— Dana K., buyer</footer>
              </blockquote>
              <blockquote className="rounded-xl border border-zinc-200 p-6 text-sm font-normal leading-[1.6] text-zinc-700">
                <span aria-hidden="true" className="text-2xl text-zinc-500">&ldquo;</span>
                The chance-to-win number actually tracked with what happened. I won at 71%.
                <footer className="mt-4 text-xs font-semibold text-zinc-500">— Ravi S., buyer</footer>
              </blockquote>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-100 px-4 py-20 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-center">
            <h2 style={DISPLAY} className="text-2xl font-bold tracking-[-0.02em] text-zinc-950 sm:text-3xl">
              At <span className="tabular-nums text-[#c2410c]">${offer}</span>, you&apos;re rank{" "}
              <span className="tabular-nums">{rank}</span> of {total} — about{" "}
              <span className="tabular-nums">{chance}%</span> to win.
            </h2>
            <p className="mt-4 text-sm font-normal text-zinc-600">
              Lock this offer in, or go back and move the slider.
            </p>
            <a
              href="#ladder"
              className={`mt-8 inline-flex items-center rounded-md bg-[#c2410c] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#9a3412] ${FOCUS_RING}`}
            >
              Lock in this bid
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
