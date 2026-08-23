"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HEX_PATH,
  HEX_W,
  HOME_CODE,
  MAP_H,
  MAP_W,
  METROS,
  MODELS,
  NATIONAL,
  RAMP_LEGEND,
  V_STEP,
  buildSnapshot,
  clampPct,
  getMetro,
  gradeLabel,
  hexCenter,
  pct,
  rampColor,
  round1,
  shipCostFor,
  tickColor,
  usd,
} from "./data";
import type { Delivery, GradeFilter, Listing, MetroStat, Snapshot } from "./data";

const GRADES: GradeFilter[] = ["ALL", "A", "B", "C"];

export default function Page() {
  const reduce = useReducedMotion();
  const [modelId, setModelId] = useState(MODELS[0]?.id ?? "lumen14");
  const [grade, setGrade] = useState<GradeFilter>("ALL");
  const [delivery, setDelivery] = useState<Delivery>("pickup");
  const [activeCode, setActiveCode] = useState("PHX");
  const [hoverCode, setHoverCode] = useState<string | null>(null);

  const snap = useMemo(
    () => buildSnapshot(modelId, grade, delivery),
    [modelId, grade, delivery],
  );

  const active = useMemo(() => {
    const found = snap.stats.find((s) => s.metro.code === activeCode);
    return found === undefined ? snap.low : found;
  }, [snap, activeCode]);

  const activeRows = useMemo(
    () =>
      snap.ticks
        .filter((t) => t.listing.metro === active.metro.code)
        .sort((a, b) => a.eff - b.eff),
    [snap, active],
  );

  const featured = useMemo(
    () =>
      snap.ranked.slice(0, 4).map((stat) => {
        const pool = snap.ticks
          .filter((t) => t.listing.metro === stat.metro.code)
          .sort((a, b) => a.eff - b.eff);
        const verified = pool.find((t) => t.listing.verified);
        const pick = verified === undefined ? pool.at(0) : verified;
        return { stat, tick: pick };
      }),
    [snap],
  );

  const heroPair = featured.slice(0, 2);
  const lowShip = shipCostFor(snap.model, snap.low.metro);
  const landed = snap.low.base + lowShip;
  const saving = snap.home.eff - landed;
  const supplyRatio = round1(active.metro.per10k / NATIONAL.per10k);
  const side = active.delta < 0 ? "under" : active.delta > 0 ? "over" : "on";

  return (
    <div className="min-h-dvh overflow-x-clip bg-[#0B0B0F] text-white antialiased">
      <header className="border-b border-[#1B1B23]">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-6 px-6 py-5">
          <a
            href="#hero"
            className="rounded-sm text-[14px] font-semibold tracking-[0.28em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            REPICK
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {[
              { href: "#hero", label: "Index" },
              { href: "#why", label: "Method" },
              { href: "#listings", label: "Listings" },
              { href: "#value", label: "Coverage" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-sm text-[13px] text-[#A1A1AA] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#cta"
            className="rounded-full bg-[#2563EB] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1E52A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none"
          >
            Open the index
          </a>
        </div>
      </header>

      <main>
      {/* ---------------------------------------------------------------- HERO */}
      <section id="hero" className="scroll-mt-24 border-b border-[#1B1B23]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD] md:text-[11px]">
                  Regional price index · 12 metros
                </p>
                <h1
                  className="mt-6 text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-[0.94] tracking-[-0.02em] text-white"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  Location is a<br />
                  price tag.
                </h1>
              </motion.div>

              <motion.p
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
                className="mt-7 max-w-[554px] text-[18px] leading-[1.6] text-[#A1A1AA]"
              >
                The {snap.model.name} clears at{" "}
                <span className="text-white">{usd(snap.low.eff)}</span> in {snap.low.metro.name} and{" "}
                <span className="text-white">{usd(snap.high.eff)}</span> in {snap.high.metro.name}.
                Same model, same week — a {snap.spreadPct.toFixed(1)}% spread that no single listing
                page will ever show you.
              </motion.p>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
                className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-3"
              >
                <Stat
                  label="National line"
                  value={usd(snap.line)}
                  foot={`Median of ${snap.total} live listings`}
                />
                <Stat
                  label="Widest gap"
                  value={usd(snap.spread)}
                  foot={`${snap.low.metro.code} to ${snap.high.metro.code}`}
                />
                <Stat
                  label="Your metro"
                  value={usd(snap.home.eff)}
                  foot={`${pct(snap.home.delta)} vs the line`}
                />
              </motion.div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
                className="mt-10"
              >
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]">
                  Cheapest two metros right now
                </p>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {heroPair.map(({ stat, tick }) =>
                    tick === undefined ? null : (
                      <MiniListing
                        key={stat.metro.code}
                        stat={stat}
                        listing={tick.listing}
                        eff={tick.eff}
                        retail={snap.model.retail}
                      />
                    ),
                  )}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
              >
                <Controls
                  modelId={modelId}
                  grade={grade}
                  delivery={delivery}
                  onModel={setModelId}
                  onGrade={setGrade}
                  onDelivery={setDelivery}
                />

                <PriceMap
                  snap={snap}
                  activeCode={active.metro.code}
                  hoverCode={hoverCode}
                  onSelect={setActiveCode}
                  onHover={setHoverCode}
                />
              </motion.div>
            </div>
          </div>

          <Distribution snap={snap} active={active} />
        </div>
      </section>

      {/* ----------------------------------------------------------------- WHY */}
      <section id="why" className="scroll-mt-24 border-b border-[#1B1B23]">
        <div className="relative mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 select-none text-[52px] font-extrabold leading-none tracking-[-0.04em] text-[#626269] md:text-[68px]"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            02
          </span>

          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD] md:text-[11px]">
                Fig. 03 — drivers behind the gap
              </p>
              <h2
                className="mt-6 text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Why {active.metro.name} sits {side} the line.
              </h2>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`${active.metro.code}-${snap.model.id}-${grade}-${delivery}`}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: "easeOut" }}
                  className="mt-6 max-w-[524px] text-[17px] leading-[1.6] text-[#A1A1AA]"
                >
                  {active.metro.name} runs{" "}
                  <span className="text-white">{pct(active.delta)}</span> against the{" "}
                  {usd(snap.line)} line on {gradeLabel(grade).toLowerCase()}. Supply density is{" "}
                  <span className="text-white">{supplyRatio.toFixed(1)}×</span> the national rate,
                  and grade-A stock is {active.metro.aShare}% of inventory against{" "}
                  {NATIONAL.aShare}% nationally. {active.metro.note}
                </motion.p>
              </AnimatePresence>

              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                <Meter
                  label="Listings / 10k residents"
                  value={active.metro.per10k.toFixed(1)}
                  ratio={active.metro.per10k / 8}
                  refRatio={NATIONAL.per10k / 8}
                  foot={`National ${NATIONAL.per10k.toFixed(1)}`}
                />
                <Meter
                  label="Grade-A share"
                  value={`${active.metro.aShare}%`}
                  ratio={active.metro.aShare / 55}
                  refRatio={NATIONAL.aShare / 55}
                  foot={`National ${NATIONAL.aShare}%`}
                />
                <Meter
                  label="Freight to Chicago"
                  value={usd(shipCostFor(snap.model, active.metro))}
                  ratio={active.metro.shipBase / 36}
                  refRatio={NATIONAL.ship / 36}
                  foot={`${active.metro.shipDays} day transit`}
                />
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#26262F] bg-[#121218] p-6">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]">
                  Cheapest in {active.metro.name} · {gradeLabel(grade)}
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {activeRows.slice(0, 3).map((t) => (
                    <li
                      key={t.listing.id}
                      className="rounded-xl border border-[#26262F] bg-[#16161C] p-4"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <p
                          className="text-[20px] font-extrabold leading-none tabular-nums text-white"
                          style={{ fontFamily: "var(--font-display-grotesk)" }}
                        >
                          {usd(t.eff)}
                        </p>
                        <p className="text-[11px] tabular-nums text-[#A1A1AA]">
                          {t.listing.ageMonths} mo old
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <Tag>Match {t.listing.match}%</Tag>
                        <Tag>Grade {t.listing.grade}</Tag>
                        <Tag>{t.listing.verified ? "Verified" : "In review"}</Tag>
                        <Tag tone="accent">
                          −{Math.round((1 - t.listing.price / snap.model.retail) * 100)}% vs new
                        </Tag>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[12px] leading-[1.6] text-[#A1A1AA]">
                  {active.count} listings of the {snap.model.name} are open in{" "}
                  {active.metro.name} tonight. Pick another hex to re-price the whole page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ LISTINGS */}
      <section id="listings" className="scroll-mt-24 border-b border-[#1B1B23]">
        <div className="relative mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 select-none text-[52px] font-extrabold leading-none tracking-[-0.04em] text-[#626269] md:text-[68px]"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            03
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD] md:text-[11px]">
            Fig. 04 — four metros, one model
          </p>
          <h2
            className="mt-6 max-w-[720px] text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            The four cheapest markets, ranked and fully tagged.
          </h2>
          <p className="mt-6 max-w-[524px] text-[17px] leading-[1.6] text-[#A1A1AA]">
            Hover a card and its hex lights up on the map. Every card carries the same four proofs,
            always visible: match, grade, verification and the discount against new.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map(({ stat, tick }) =>
              tick === undefined ? null : (
                <motion.article
                  key={stat.metro.code}
                  layout={reduce ? false : true}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onMouseEnter={() => setHoverCode(stat.metro.code)}
                  onMouseLeave={() => setHoverCode(null)}
                  className="flex flex-col rounded-2xl border border-[#26262F] bg-[#121218] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#A1A1AA]">
                      {stat.metro.name}, {stat.metro.state}
                    </p>
                    <span className="rounded-full border border-[#2A2A35] px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#93C5FD]">
                      #{stat.rank}
                    </span>
                  </div>
                  <p
                    className="mt-5 text-[30px] font-extrabold leading-none tabular-nums text-white"
                    style={{ fontFamily: "var(--font-display-grotesk)" }}
                  >
                    {usd(tick.eff)}
                  </p>
                  <p className="mt-2 text-[12px] tabular-nums text-[#93C5FD]">
                    {pct(stat.delta)} vs the {usd(snap.line)} line
                  </p>

                  <div className="mt-5">
                    <div className="relative h-1.5 w-full rounded-full bg-[#1E1E26]">
                      <span
                        aria-hidden="true"
                        className="absolute -top-1 h-3.5 w-[3px] rounded-full bg-[#93C5FD]"
                        style={{
                          left: `${clampPct(
                            ((tick.eff - snap.min) / Math.max(1, snap.max - snap.min)) * 100,
                            0,
                            99,
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#A1A1AA]">
                      Position in the national spread
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    <Tag>Match {tick.listing.match}%</Tag>
                    <Tag>Grade {tick.listing.grade}</Tag>
                    <Tag>{tick.listing.verified ? "Verified" : "In review"}</Tag>
                    <Tag tone="accent">
                      −{Math.round((1 - tick.listing.price / snap.model.retail) * 100)}% vs new
                    </Tag>
                  </div>

                  <p className="mt-5 text-[12px] leading-[1.6] text-[#A1A1AA]">
                    {snap.model.name} · {snap.model.spec} · {tick.listing.ageMonths} months old ·{" "}
                    {stat.metro.shipDays === 0
                      ? "local pickup"
                      : `${stat.metro.shipDays} day freight`}
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveCode(stat.metro.code)}
                    className="mt-6 rounded-full border border-[#2A2A35] px-4 py-2.5 text-[12px] font-semibold text-white transition-colors hover:border-[#93C5FD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none"
                  >
                    Inspect {stat.metro.code} on the map
                  </button>
                </motion.article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- VALUE */}
      <section id="value" className="scroll-mt-24 border-b border-[#1B1B23]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD] md:text-[11px]">
            Fig. 05 — what the map buys you
          </p>
          <h2
            className="mt-6 max-w-[720px] text-[clamp(1.9rem,3.4vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            Three numbers that move every time you touch a control.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            <ValueCard
              index="01"
              title="Listings, not estimates"
              value={`${snap.total}`}
              unit="priced tonight"
              body={`Every tick on the axis is an open ${snap.model.name} listing under ${gradeLabel(
                grade,
              ).toLowerCase()}, across ${METROS.length} metros and ${NATIONAL.inventory} tracked units.`}
            />
            <ValueCard
              index="02"
              title="Condition carries a price"
              value={usd(snap.medianA - snap.medianC)}
              unit="grade-A premium"
              body={`Grade A clears at ${usd(snap.medianA)} and grade C at ${usd(
                snap.medianC,
              )}. Cheap and worn are not the same discount, so we price them apart.`}
            />
            <ValueCard
              index="03"
              title="Landed, not listed"
              value={usd(saving)}
              unit="saved against home"
              body={`${snap.low.metro.name} pickup at ${usd(snap.low.base)} plus ${usd(
                lowShip,
              )} freight lands at ${usd(landed)}, against ${usd(
                snap.home.eff,
              )} in ${snap.home.metro.name}.`}
            />
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- PROOF */}
      <section className="border-b border-[#1B1B23]">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#93C5FD] md:text-[11px]">
            Fig. 06 — buyers who moved on the map
          </p>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                q: "We were about to pay Bay Area money for a Dallas phone. The index caught it in ten seconds.",
                n: "Marisol Vega",
                r: "Studio operations, Nine & Co.",
              },
              {
                q: "Freight is where most deals quietly die. Landed cost per metro changed which listings we even open.",
                n: "Devin Aluko",
                r: "IT procurement, Harbor Health",
              },
              {
                q: "The grade filter is the part nobody else shows. Cheap and grade C are not the same discount.",
                n: "Priya Raman",
                r: "Refurb lead, Coastline Devices",
              },
            ].map((t) => (
              <figure
                key={t.n}
                className="relative overflow-hidden rounded-2xl border border-[#26262F] bg-[#121218] p-6"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-0 select-none text-[86px] leading-none text-[#1B1B23]"
                  style={{ fontFamily: "var(--font-display-grotesk)" }}
                >
                  &ldquo;
                </span>
                <blockquote className="relative max-w-[420px] text-[17px] leading-[1.6] text-white">
                  {t.q}
                </blockquote>
                <figcaption className="mt-6 text-[12px] text-[#A1A1AA]">
                  <span className="text-white">{t.n}</span> · {t.r}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-[#26262F] pt-8 sm:grid-cols-3">
            <Stat label="Metros priced nightly" value="12" foot="Continental coverage" />
            <Stat label="Units in the index" value="2,677" foot="Across four tracked models" />
            <Stat label="Median landed saving" value="$186" foot="Home metro versus best market" />
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- CTA */}
      <section id="cta" className="scroll-mt-24">
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:py-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <h2
                className="max-w-[640px] text-[clamp(2.1rem,4.4vw,3.4rem)] font-extrabold leading-[1.0] tracking-[-0.02em] text-white"
                style={{ fontFamily: "var(--font-display-grotesk)" }}
              >
                Buy where the price is, not where you are.
              </h2>
              <p className="mt-6 max-w-[524px] text-[17px] leading-[1.6] text-[#A1A1AA]">
                Monday morning, one email: the twelve-metro line for every model you track, with
                landed cost already worked out from {snap.home.metro.name}.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-2xl border border-[#26262F] bg-[#121218] p-6"
              >
                <label
                  htmlFor="repick-email"
                  className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]"
                >
                  Email for the weekly index
                </label>
                <input
                  id="repick-email"
                  name="email"
                  type="email"
                  placeholder="you@studio.com"
                  className="mt-3 w-full rounded-lg border border-[#2A2A35] bg-[#16161C] px-4 py-3 text-[15px] text-white placeholder:text-[#8A8A96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
                />
                <button
                  type="submit"
                  className="mt-4 w-full rounded-lg bg-[#2563EB] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#1E52A6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none"
                >
                  Send me the line
                </button>
                <p className="mt-4 text-[12px] leading-[1.6] text-[#A1A1AA]">
                  No listings in the email. Just the medians, the spread and the freight.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      </main>

      <footer className="border-t border-[#1B1B23]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] tracking-[0.16em] text-[#A1A1AA]">
            REPICK INDEX — ALL FIGURES ILLUSTRATIVE
          </p>
          <div className="flex flex-wrap gap-6">
            {["Method", "Coverage", "Grading", "Contact"].map((l) => (
              <a
                key={l}
                href="#hero"
                className="rounded-sm text-[12px] text-[#A1A1AA] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function Stat({ label, value, foot }: { label: string; value: string; foot: string }) {
  return (
    <div className="border-t border-[#26262F] pt-4">
      <p className="text-[10px] uppercase tracking-[0.12em] text-[#A1A1AA]">{label}</p>
      <p
        className="mt-3 text-[26px] font-extrabold leading-none tabular-nums text-white"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {value}
      </p>
      <p className="mt-2 text-[12px] leading-[1.5] text-[#A1A1AA]">{foot}</p>
    </div>
  );
}

function Tag({ children, tone }: { children: ReactNode; tone?: "accent" }) {
  const cls =
    tone === "accent"
      ? "border-[#2563EB] bg-[#12203A] text-[#93C5FD]"
      : "border-[#2A2A35] bg-[#16161C] text-[#A1A1AA]";
  return (
    <span
      className={`inline-flex items-center rounded-[4px] border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${cls}`}
    >
      {children}
    </span>
  );
}

function MiniListing({
  stat,
  listing,
  eff,
  retail,
}: {
  stat: MetroStat;
  listing: Listing;
  eff: number;
  retail: number;
}) {
  return (
    <article className="rounded-xl border border-[#26262F] bg-[#121218] p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA]">{stat.metro.name}</p>
        <p className="text-[11px] font-semibold tabular-nums text-[#93C5FD]">{pct(stat.delta)}</p>
      </div>
      <p
        className="mt-3 text-[24px] font-extrabold leading-none tabular-nums text-white"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {usd(eff)}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag>Match {listing.match}%</Tag>
        <Tag>Grade {listing.grade}</Tag>
        <Tag>{listing.verified ? "Verified" : "In review"}</Tag>
        <Tag tone="accent">−{Math.round((1 - listing.price / retail) * 100)}% vs new</Tag>
      </div>
    </article>
  );
}

function Meter({
  label,
  value,
  ratio,
  refRatio,
  foot,
}: {
  label: string;
  value: string;
  ratio: number;
  refRatio: number;
  foot: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#A1A1AA]">{label}</p>
        <p className="text-[16px] font-semibold tabular-nums text-white">{value}</p>
      </div>
      <div className="relative mt-3 h-2 w-full rounded-full bg-[#16161C]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#2563EB] transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${clampPct(ratio * 100, 2, 100)}%` }}
        />
        <div
          aria-hidden="true"
          className="absolute -inset-y-1 w-px bg-white"
          style={{ left: `${clampPct(refRatio * 100, 0, 100)}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-[#A1A1AA]">{foot} · white mark</p>
    </div>
  );
}

function ValueCard({
  index,
  title,
  value,
  unit,
  body,
}: {
  index: string;
  title: string;
  value: string;
  unit: string;
  body: string;
}) {
  return (
    <article className="rounded-2xl border border-[#26262F] bg-[#121218] p-6">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]">
        {index} — {title}
      </p>
      <p
        className="mt-6 text-[40px] font-extrabold leading-none tabular-nums text-[#93C5FD]"
        style={{ fontFamily: "var(--font-display-grotesk)" }}
      >
        {value}
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA]">{unit}</p>
      <p className="mt-5 max-w-[524px] text-[15px] leading-[1.6] text-[#A1A1AA]">{body}</p>
    </article>
  );
}

/* ---------------------------------------------------------------- controls */

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD] motion-reduce:transition-none ${
        active
          ? "border-[#2563EB] bg-[#2563EB] text-white"
          : "border-[#2A2A35] bg-[#121218] text-[#A1A1AA] hover:border-[#3A3A48] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function Controls({
  modelId,
  grade,
  delivery,
  onModel,
  onGrade,
  onDelivery,
}: {
  modelId: string;
  grade: GradeFilter;
  delivery: Delivery;
  onModel: (v: string) => void;
  onGrade: (v: GradeFilter) => void;
  onDelivery: (v: Delivery) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span
          id="ctl-model"
          className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]"
        >
          Model
        </span>
        <div role="group" aria-labelledby="ctl-model" className="flex flex-wrap gap-2">
          {MODELS.map((m) => (
            <Chip key={m.id} active={m.id === modelId} onClick={() => onModel(m.id)}>
              {m.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span
            id="ctl-grade"
            className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]"
          >
            Grade
          </span>
          <div role="group" aria-labelledby="ctl-grade" className="flex flex-wrap gap-2">
            {GRADES.map((g) => (
              <Chip key={g} active={g === grade} onClick={() => onGrade(g)}>
                {g === "ALL" ? "All" : g}
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            id="ctl-ship"
            className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA]"
          >
            Cost
          </span>
          <div role="group" aria-labelledby="ctl-ship" className="flex flex-wrap gap-2">
            <Chip active={delivery === "pickup"} onClick={() => onDelivery("pickup")}>
              Local pickup
            </Chip>
            <Chip active={delivery === "ship"} onClick={() => onDelivery("ship")}>
              Shipped to Chicago
            </Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- map */

function PriceMap({
  snap,
  activeCode,
  hoverCode,
  onSelect,
  onHover,
}: {
  snap: Snapshot;
  activeCode: string;
  hoverCode: string | null;
  onSelect: (code: string) => void;
  onHover: (code: string | null) => void;
}) {
  return (
    <figure className="mt-8">
      <figcaption className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA] md:text-[11px]">
        Fig. 01 — median against the {usd(snap.line)} national line
      </figcaption>

      <div className="relative mt-5 w-full">
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="block h-auto w-full"
          aria-hidden="true"
          focusable="false"
        >
          {snap.stats.map((s) => {
            const c = hexCenter(s.metro.col, s.metro.row);
            const isActive = s.metro.code === activeCode;
            const isHover = s.metro.code === hoverCode;
            return (
              <path
                key={s.metro.code}
                d={HEX_PATH}
                transform={`translate(${c.x} ${c.y})`}
                fill={rampColor(s.step)}
                stroke={isActive ? "#FFFFFF" : isHover ? "#93C5FD" : "#26262F"}
                strokeWidth={isActive || isHover ? 2 : 1}
                className="transition-colors duration-300 motion-reduce:transition-none"
              />
            );
          })}
        </svg>

        {snap.stats.map((s) => {
          const c = hexCenter(s.metro.col, s.metro.row);
          const isActive = s.metro.code === activeCode;
          return (
            <button
              key={s.metro.code}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(s.metro.code)}
              onMouseEnter={() => onHover(s.metro.code)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(s.metro.code)}
              onBlur={() => onHover(null)}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93C5FD]"
              style={{
                left: `${(c.x / MAP_W) * 100}%`,
                top: `${(c.y / MAP_H) * 100}%`,
                width: `${(HEX_W / MAP_W) * 100}%`,
                height: `${(V_STEP / MAP_H) * 100}%`,
              }}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none flex flex-col items-center rounded-[7px] border bg-[#0B0B0F] px-1.5 py-1 ${
                  isActive ? "border-[#93C5FD]" : "border-[#2A2A35]"
                }`}
              >
                <span className="text-[10px] font-semibold leading-none tracking-[0.12em] text-white">
                  {s.metro.code}
                </span>
                <span className="mt-1 text-[11px] font-semibold leading-none tabular-nums text-[#93C5FD]">
                  {pct(s.delta)}
                </span>
              </span>
              <span className="sr-only">
                {`${s.metro.name}, ${s.metro.state}: median ${usd(s.eff)}, ${pct(
                  s.delta,
                )} against the ${usd(snap.line)} line, rank ${s.rank} of ${snap.stats.length}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
        {RAMP_LEGEND.map((l) => (
          <span key={l.label} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-3 w-7 rounded-[3px] border border-[#2A2A35]"
              style={{ backgroundColor: l.color }}
            />
            <span className="text-[10px] uppercase tracking-[0.14em] text-[#A1A1AA]">
              {l.label}
            </span>
          </span>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-1.5 md:hidden">
        {snap.ranked.map((s) => (
          <li
            key={s.metro.code}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
              s.metro.code === activeCode
                ? "border-[#93C5FD] bg-[#121218]"
                : "border-[#1E1E26] bg-[#121218]"
            }`}
          >
            <span className="w-8 text-[11px] font-semibold tracking-[0.12em] text-white">
              {s.metro.code}
            </span>
            <span className="relative h-2 flex-1 rounded-full bg-[#16161C]">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${clampPct(((s.eff - snap.min) / Math.max(1, snap.max - snap.min)) * 100, 4, 100)}%`,
                  backgroundColor: tickColor(s.step),
                }}
              />
            </span>
            <span className="w-16 text-right text-[12px] tabular-nums text-white">
              {usd(s.eff)}
            </span>
            <span className="w-14 text-right text-[11px] tabular-nums text-[#93C5FD]">
              {pct(s.delta)}
            </span>
          </li>
        ))}
      </ul>
    </figure>
  );
}

/* ----------------------------------------------------------- distribution */

function Distribution({ snap, active }: { snap: Snapshot; active: MetroStat }) {
  const span = Math.max(1, snap.max - snap.min);
  const xOf = (v: number) => ((v - snap.min) / span) * 100;
  const lineX = xOf(snap.line);
  const activeX = xOf(active.eff);
  const bandL = Math.min(lineX, activeX);
  const bandW = Math.abs(lineX - activeX);
  const gap = active.eff - snap.line;
  const lowest = getMetro(snap.low.metro.code);
  const highest = getMetro(snap.high.metro.code);

  return (
    <figure className="mt-16">
      <figcaption className="text-[10px] uppercase tracking-[0.16em] text-[#A1A1AA] md:text-[11px]">
        Fig. 02 — every one of the {snap.total} listings on a single price axis
      </figcaption>

      <div className="relative mt-6 h-9">
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-[#2A2A35] bg-[#121218] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-white"
          style={{ left: `${clampPct(lineX, 20, 80)}%` }}
        >
          National line {usd(snap.line)}
        </span>
      </div>

      <div className="relative h-[150px] w-full border-b border-[#2A2A35]">
        <span
          aria-hidden="true"
          className="absolute inset-y-0 border-x border-[#2563EB]/50 bg-[#2563EB]/10"
          style={{ left: `${bandL}%`, width: `${Math.max(bandW, 0.4)}%` }}
        />
        {snap.ticks.map((t) => {
          const isActive = t.listing.metro === active.metro.code;
          const h = t.listing.grade === "A" ? 112 : t.listing.grade === "B" ? 82 : 56;
          return (
            <span
              key={t.listing.id}
              aria-hidden="true"
              className="absolute bottom-0 rounded-t-full transition-colors duration-300 motion-reduce:transition-none"
              style={{
                left: `calc(${xOf(t.eff)}% - 1px)`,
                width: isActive ? 3 : 2,
                height: h,
                backgroundColor: isActive ? "#FFFFFF" : tickColor(t.step),
                zIndex: isActive ? 3 : 1,
              }}
            />
          );
        })}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-white"
          style={{ left: `${lineX}%`, zIndex: 4 }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-[#93C5FD]"
          style={{ left: `${activeX}%`, zIndex: 4 }}
        />
      </div>

      <div className="relative h-10">
        <span
          className="absolute mt-3 -translate-x-1/2 whitespace-nowrap rounded-[4px] border border-[#2563EB] bg-[#12203A] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#93C5FD]"
          style={{ left: `${clampPct(activeX, 26, 74)}%` }}
        >
          {active.metro.code} {usd(active.eff)}
          <span className="hidden sm:inline"> · {usd(gap)} vs the line</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-[11px] text-[#A1A1AA]">
          Low {usd(snap.min)} · {lowest.name}
        </p>
        <p className="text-[11px] text-[#A1A1AA]">
          Bar height reads condition — tall A, mid B, short C. Colour repeats the map ramp.
        </p>
        <p className="text-[11px] text-[#A1A1AA]">
          High {usd(snap.max)} · {highest.name}
        </p>
      </div>

      <p className="sr-only">
        {`Across ${snap.stats.length} metros the ${snap.model.name} spans ${usd(snap.min)} to ${usd(
          snap.max,
        )}. ${snap.low.metro.name} is cheapest at ${usd(snap.low.eff)} and ${
          snap.high.metro.name
        } dearest at ${usd(snap.high.eff)}. ${active.metro.name} sits at ${usd(active.eff)}, ${pct(
          active.delta,
        )} against the ${usd(snap.line)} national line. Home metro ${
          getMetro(HOME_CODE).name
        } sits at ${usd(snap.home.eff)}.`}
      </p>
    </figure>
  );
}
