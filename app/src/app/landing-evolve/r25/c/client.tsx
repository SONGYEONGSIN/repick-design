"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Quote, ShieldCheck, Star, TrendingDown, TrendingUp } from "lucide-react";
import RibbonChart from "./ribbon-chart";
import WeightPanel from "./weight-panel";
import ListingCard from "./listing-card";
import FaqAccordion from "./faq-accordion";
import {
  BASE_TREND,
  CATEGORIES,
  CATEGORY_IDS,
  DEFAULT_WEIGHTS,
  HERO_LISTINGS,
  NOW_INDEX,
  PREVIEW_FILTERS,
  PREVIEW_LISTINGS,
  TESTIMONIALS,
  TRUST_SIGNALS,
  TRUST_STATS,
  YOUR_ITEM,
  computeRibbon,
  discountPct,
  getItemReadout,
  matchPreset,
  type CategoryId,
  type Weights,
} from "./data";
import { cx, FOCUS, INK_TEXT, MUTED_TEXT, NUM } from "./tokens";

const SKIP_LINK =
  "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-[#111114] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[13px] focus-visible:font-semibold focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A3412]";

const STAR_POSITIONS = [0, 1, 2, 3, 4];

const NAV_LINK = cx(
  "inline-flex items-center py-2 text-[13px] font-semibold text-[#52525B] transition-colors hover:text-[#111114]",
  FOCUS,
  "rounded-sm",
);

const SECTION_LEDE = cx("mt-4 max-w-[480px] text-[16px] font-normal leading-[1.6]", MUTED_TEXT);
const SECTION_TITLE = "text-[clamp(1.75rem,1.6vw+1.3rem,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#111114]";
const EYEBROW = cx("text-[11px] font-semibold uppercase text-[#9A3412]");

export default function DemandRibbonLanding() {
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [heroCategory, setHeroCategory] = useState<CategoryId>("lenses");
  const [previewFilter, setPreviewFilter] = useState<"all" | CategoryId>("all");
  const reduceMotion = useReducedMotion();

  const series = useMemo(() => computeRibbon(weights), [weights]);
  const itemReadout = useMemo(() => getItemReadout(series), [series]);
  const activePreset = matchPreset(weights);

  const dominant = series.dominant;
  const dominantMeta = CATEGORIES[dominant];
  const dominantTotal = series.totals[NOW_INDEX] || 1;
  const dominantSharePct = (series.value[dominant][NOW_INDEX] / dominantTotal) * 100;
  const dominantIndexNow = BASE_TREND[dominant][NOW_INDEX];
  const dominantIndexPrev = BASE_TREND[dominant][NOW_INDEX - 1];
  const dominantUp = dominantIndexNow >= dominantIndexPrev;
  const dominantDelta = Math.abs(dominantIndexNow - dominantIndexPrev);

  const filteredListings =
    previewFilter === "all" ? PREVIEW_LISTINGS : PREVIEW_LISTINGS.filter((l) => l.category === previewFilter);

  const fadeUp: Variants = reduceMotion
    ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="bg-[#FAFAFA] text-[#111114]">
      <a href="#main-content" className={SKIP_LINK}>
        Skip to main content
      </a>

      {/* ------------------------------------------------------------------------------ Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-[#FAFAFA]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
          <span className="flex items-center gap-2 text-base font-extrabold tracking-[-0.02em] text-[#111114]">
            <span className="h-2 w-2 rounded-full bg-[#C2410C]" aria-hidden="true" />
            repick
          </span>
          <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
            <a href="#ribbon" className={NAV_LINK}>
              Demand ribbon
            </a>
            <a href="#listings" className={NAV_LINK}>
              Listings
            </a>
            <a href="#proof" className={NAV_LINK}>
              Proof
            </a>
            <a href="#faq" className={NAV_LINK}>
              FAQ
            </a>
          </nav>
          <a
            href="#ribbon"
            className={cx(
              "rounded-full bg-[#C2410C] px-4 py-2 text-[13px] font-semibold text-white transition-transform hover:-translate-y-0.5",
              FOCUS,
            )}
          >
            List your gear
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* -------------------------------------------------------------------------- Hero */}
        <section id="hero" className="relative overflow-hidden px-6 pb-20 pt-14 sm:px-10 lg:px-16 lg:pb-28 lg:pt-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10 lg:items-start">
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-7"
              >
                <p className={cx(EYEBROW)} style={{ letterSpacing: "0.28em" }}>
                  Live category demand
                </p>
                <h1 className="mt-5" style={{ fontFamily: "var(--font-display-grotesk)" }}>
                  <span className="block text-[clamp(1.1rem,1vw+0.85rem,1.6rem)] font-normal leading-[1.2] text-[#52525B]">
                    Twelve months, four categories.
                  </span>
                  <span className="block text-[clamp(2.6rem,4.6vw+1rem,5.25rem)] font-extrabold leading-[0.98] tracking-[-0.02em] text-[#111114]">
                    One ribbon shows
                    <br />
                    where you sit.
                  </span>
                </h1>
                <p className="mt-6 max-w-[500px] text-[17px] font-normal leading-[1.6] text-[#52525B]">
                  repick tracks resale-value demand across lenses, bodies, accessories and
                  vintage film gear every month. Set how your kit is weighted and watch the
                  ribbon reflow around your item, live.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#ribbon"
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5",
                      FOCUS,
                    )}
                  >
                    See my ribbon reflow
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <span className="text-sm font-normal text-[#52525B]">No account needed to try the weights.</span>
                </div>
              </motion.div>

              {/* Real listing card + proof, inside the hero itself, zero scroll required */}
              <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0 lg:col-span-5"
              >
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <p className={cx("text-[11px] font-semibold uppercase", MUTED_TEXT)} style={{ letterSpacing: "0.16em" }}>
                    Real listing, real proof
                  </p>
                  <div
                    role="group"
                    aria-label="Preview a real listing from each category"
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    {CATEGORY_IDS.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        aria-pressed={heroCategory === cat}
                        onClick={() => setHeroCategory(cat)}
                        className={cx(
                          "rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
                          FOCUS,
                          heroCategory === cat
                            ? "border-[#C2410C] bg-[#C2410C] text-white"
                            : "border-zinc-300 text-[#111114] hover:border-[#C2410C]",
                        )}
                      >
                        {CATEGORIES[cat].short}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4">
                    <ListingCard listing={HERO_LISTINGS[heroCategory]} compact />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Product preview */}
        <section id="listings" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[480px]"
            >
              <h2 className={SECTION_TITLE}>Every listing carries its own receipts.</h2>
              <p className={SECTION_LEDE}>
                AI-match reasoning, condition grade, seller verification and the before/after
                price sit in their own row — never stamped over the photo.
              </p>
            </motion.div>

            <div
              role="group"
              aria-label="Filter listings by category"
              className="mt-8 flex flex-wrap gap-2"
            >
              {PREVIEW_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={previewFilter === f.id}
                  onClick={() => setPreviewFilter(f.id)}
                  className={cx(
                    "rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors",
                    FOCUS,
                    previewFilter === f.id
                      ? "border-[#C2410C] bg-[#C2410C] text-white"
                      : "border-zinc-300 text-[#111114] hover:border-[#C2410C]",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeUp}
                  transition={{ duration: 0.45, delay: reduceMotion ? 0 : Math.min(i, 3) * 0.06 }}
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="min-w-0"
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Value: the ribbon itself */}
        <section id="ribbon" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[480px]"
            >
              <h2 className={SECTION_TITLE}>Move the mix. Watch the ribbon answer.</h2>
              <p className={SECTION_LEDE}>
                Every slider below is a share of your kit. Change one and all four bands
                resize, reorder and carry your listing&rsquo;s marker with them — nothing here
                is precomputed for a single default mix.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
              className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              <div className="min-w-0 lg:col-span-4">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <WeightPanel weights={weights} onChange={setWeights} activePreset={activePreset} />
                </div>

                <div className="mt-6 rounded-2xl border border-[#C2410C]/30 bg-[#FFF7ED] p-5">
                  <p className={cx("text-[11px] font-semibold uppercase text-[#9A3412]")} style={{ letterSpacing: "0.16em" }}>
                    Live readout
                  </p>
                  <p className={cx("mt-2 text-[15px] font-semibold leading-[1.5]", INK_TEXT)}>
                    <span className={NUM}>{dominantMeta.label}</span> carries{" "}
                    <span className={NUM}>{Math.round(dominantSharePct)}%</span> of the ribbon this
                    month, index <span className={NUM}>{dominantIndexNow}</span>/100.
                  </p>
                  <p
                    className={cx(
                      "mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-semibold",
                      dominantUp ? "text-[#3F3F46]" : "text-[#9A3412]",
                    )}
                  >
                    {dominantUp ? (
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {dominantUp ? "Up" : "Down"} <span className={NUM}>{dominantDelta}</span> pts from last
                    month
                  </p>
                  <p className={cx("mt-3 border-t border-[#C2410C]/20 pt-3 text-[13.5px] leading-[1.5]", MUTED_TEXT)}>
                    Your <span className={cx("font-semibold", INK_TEXT)}>{YOUR_ITEM.name}</span> sits in the{" "}
                    {CATEGORIES[itemReadout.category].label} band — currently{" "}
                    <span className={cx("font-semibold", NUM, INK_TEXT)}>{Math.round(itemReadout.shareNowPct)}%</span>{" "}
                    of the stack, index <span className={cx("font-semibold", NUM, INK_TEXT)}>{itemReadout.indexNow}</span>
                    /100.
                  </p>
                </div>
              </div>

              <div className="min-w-0 lg:col-span-8">
                <RibbonChart series={series} itemReadout={itemReadout} reduceMotion={!!reduceMotion} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Social proof */}
        <section id="proof" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[480px]"
            >
              <h2 className={SECTION_TITLE}>Trusted by sellers who checked timing first.</h2>
              <p className={SECTION_LEDE}>Real sellers, matched to the band they sold into.</p>
            </motion.div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <ul className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-8">
                {TESTIMONIALS.map((t, i) => (
                  <motion.li
                    key={t.name}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={fadeUp}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.08 }}
                    className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-5"
                  >
                    <Quote className="h-5 w-5 text-[#C2410C]" aria-hidden="true" />
                    <p className="mt-3 text-sm font-normal leading-[1.6] text-[#111114]">{t.quote}</p>
                    <div
                      role="img"
                      className="mt-4 flex items-center gap-1"
                      aria-label={`Rated ${t.rating} out of 5`}
                    >
                      {STAR_POSITIONS.map((starIndex) => (
                        <Star
                          key={starIndex}
                          aria-hidden="true"
                          className={cx(
                            "h-3.5 w-3.5",
                            starIndex < t.rating ? "fill-[#C2410C] text-[#C2410C]" : "text-zinc-300",
                          )}
                        />
                      ))}
                    </div>
                    <p className="mt-3 text-xs font-semibold text-[#111114]">{t.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs font-normal text-[#52525B]">
                      {t.verified && <ShieldCheck className="h-3 w-3 text-[#9A3412]" aria-hidden="true" />}
                      {t.context}
                    </p>
                  </motion.li>
                ))}
              </ul>

              <div className="min-w-0 lg:col-span-4">
                <dl className="flex flex-col gap-6">
                  {TRUST_STATS.map((stat) => (
                    <div key={stat.label}>
                      <dt className={cx("text-xs font-semibold uppercase text-[#52525B]")} style={{ letterSpacing: "0.12em" }}>
                        {stat.label}
                      </dt>
                      <dd className={cx("mt-1 text-3xl font-extrabold tracking-[-0.02em] text-[#111114]", NUM)}>
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="relative mt-14 overflow-hidden border-y border-zinc-200 py-4" aria-hidden="true">
              <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-10 motion-reduce:animate-none">
                {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((signal, i) => (
                  <span key={`${signal}-${i}`} className="flex shrink-0 items-center gap-2 text-sm font-normal text-[#52525B]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#C2410C]" />
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- FAQ */}
        <section id="faq" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="max-w-[480px]"
            >
              <h2 className={SECTION_TITLE}>Questions before you move a slider.</h2>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-10 max-w-[680px]"
            >
              <FaqAccordion />
            </motion.div>
          </div>
        </section>

        {/* -------------------------------------------------------------------------- Closing CTA */}
        <section id="cta" className="border-t border-zinc-200 px-6 py-24 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-[1400px]">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end"
            >
              <div className="min-w-0 lg:col-span-8">
                <h2 className="text-[clamp(1.9rem,2vw+1.3rem,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-[#111114]">
                  Ready when your ribbon is.
                </h2>
                <p className="mt-4 max-w-[480px] text-[16px] font-normal leading-[1.6] text-[#52525B]">
                  Under your current mix, <span className="font-semibold text-[#111114]">{dominantMeta.label}</span> is
                  carrying <span className={cx("font-semibold text-[#9A3412]", NUM)}>{Math.round(dominantSharePct)}%</span>{" "}
                  of the ribbon at index <span className={cx("font-semibold text-[#111114]", NUM)}>{dominantIndexNow}</span>.
                  Your <span className="font-semibold text-[#111114]">{YOUR_ITEM.name}</span> holds{" "}
                  <span className={cx("font-semibold text-[#111114]", NUM)}>{Math.round(itemReadout.shareNowPct)}%</span> of
                  the {CATEGORIES[itemReadout.category].label} band right now. Move any slider above and this line moves
                  with it.
                </p>
              </div>
              <div className="min-w-0 lg:col-span-4 lg:text-right">
                <a
                  href="#ribbon"
                  className={cx(
                    "inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5",
                    FOCUS,
                  )}
                >
                  List for{" "}
                  <span className={NUM}>${YOUR_ITEM.price.toLocaleString()}</span> &middot;{" "}
                  {discountPct(YOUR_ITEM.price, YOUR_ITEM.originalPrice)}% off
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------------------------ Footer */}
      <footer className="border-t border-zinc-200 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2 text-sm font-semibold text-[#111114]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C2410C]" aria-hidden="true" />
            repick
          </span>
          <p className={cx("text-xs font-normal", MUTED_TEXT)}>
            Demand index, listing data and match scores on this page are illustrative figures for
            this preview.
          </p>
        </div>
      </footer>
    </div>
  );
}
