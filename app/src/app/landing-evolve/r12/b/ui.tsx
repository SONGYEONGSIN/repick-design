"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, ScanLine, Sparkles } from "lucide-react";
import HeroSwitcher from "./HeroSwitcher";
import NewsletterForm from "./NewsletterForm";
import {
  PREVIEW,
  PROCESS,
  HERO_STATS,
  PROOF,
  TESTIMONIAL,
  EASE,
  VIEWPORT,
  BODY_MAX,
  LEDE_MAX,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const GROTESK = { fontFamily: "var(--font-display-grotesk)" } as const;

const CTA_PRIMARY = cx(
  "inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-emerald-800",
  FOCUS,
);

const NAV_LINK = cx(
  "rounded text-sm font-normal text-zinc-600 transition-colors duration-150 hover:text-zinc-950",
  FOCUS,
);

export default function LandingClient() {
  const reduced = useReducedMotion();

  return (
    <main className="min-h-screen bg-white text-zinc-950 antialiased">
      <a
        href="#main-content"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1160px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className={cx("rounded text-base font-extrabold text-zinc-950", FOCUS)} style={GROTESK}>
            Assay
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#certificate" className={NAV_LINK}>
              Certificate
            </a>
            <a href="#preview" className={NAV_LINK}>
              Listings
            </a>
            <a href="#process" className={NAV_LINK}>
              Method
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            Get a certificate
          </a>
        </nav>
      </header>

      <div id="main-content">
      {/* hero — headline/sub/CTA left, photo + certificate (with tab switch) right, all in the first fold */}
      <section id="top" className="mx-auto w-full max-w-[1160px] px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative lg:col-span-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -left-1 -top-9 select-none text-[6.5rem] font-extrabold leading-none tracking-[-0.02em] text-zinc-100"
              style={GROTESK}
            >
              01
            </span>

            <p className={cx(EYEBROW, "relative inline-flex items-center gap-2 text-emerald-700")}>
              <ScanLine className="h-3.5 w-3.5" aria-hidden />
              Certificate of condition
            </p>

            <h1
              id="certificate"
              className="relative mt-5 text-[clamp(2.1rem,7vw,2.9rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-zinc-950 lg:text-[clamp(2.7rem,4.2vw,3.9rem)]"
              style={GROTESK}
            >
              Every listing arrives
              <br />
              with its papers <span className="text-emerald-700">already stamped.</span>
            </h1>

            <p className={cx("relative mt-6 text-base font-normal leading-[1.6] text-zinc-600 sm:text-lg", LEDE_MAX)}>
              Assay&rsquo;s AI inspects each item against our reference archive, grades its
              condition, and issues a certificate you can read before you buy — authenticity,
              grade, match reasoning, and price, confirmed in one document.
            </p>

            <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#cta" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                Get a certificate
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
              <span className="text-xs font-normal text-zinc-600">Issued in under 90 seconds</span>
            </div>

            <div className="relative mt-10 flex flex-wrap gap-x-8 gap-y-5 border-t border-zinc-200 pt-6">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div className={cx("text-xl font-extrabold text-zinc-950", NUM)}>{s.value}</div>
                  <div className="mt-1 text-xs font-normal text-zinc-600">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.16 }}
            className="lg:col-span-7"
          >
            <HeroSwitcher />
          </motion.div>
        </div>
      </section>

      {/* product preview — badges live in their own row under the photo, never overlaid on it */}
      <section id="preview" className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-[1160px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={BODY_MAX}
          >
            {/* BODY_MAX (16px paragraph below), not LEDE_MAX — the eyebrow/h2 above aren't
                subject to the char-count rule (display type), and constraining the wrapper to
                the paragraph's own cap is what keeps the 16px line inside 65–75 chars. */}
            <p className={cx(EYEBROW, "text-emerald-700")}>Fig. 02 — Already certified</p>
            <h2 className="mt-4 text-[clamp(1.8rem,4.8vw,2.6rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-zinc-950" style={GROTESK}>
              Four more listings, each with its file already open.
            </h2>
            <p className="mt-5 text-base font-normal leading-[1.6] text-zinc-600">
              Grade, verification, match reasoning, and discount sit at rest on every card — no
              hover required to see the proof.
            </p>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PREVIEW.map((item) => (
              <a
                key={item.id}
                href="#cta"
                className={cx(
                  "group flex min-w-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition-[transform,border-color] duration-200 hover:-translate-y-1 hover:border-zinc-300",
                  FOCUS,
                )}
              >
                <span className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105 group-focus-visible:scale-105"
                  />
                </span>

                {/* badge row — separate from the photo (design-principles §Landing 구조 기본형 2) */}
                <span className="flex flex-wrap items-center gap-1.5 border-b border-zinc-100 px-3.5 pt-3 pb-3">
                  <span className={cx("rounded border border-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-emerald-700", NUM)}>
                    Grade {item.grade}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-semibold text-zinc-600">
                    <BadgeCheck className="h-3 w-3 text-emerald-700" aria-hidden />
                    {item.seller}
                  </span>
                  <span className={cx("ml-auto rounded bg-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white", NUM)}>
                    -{item.discount}%
                  </span>
                </span>

                <span className="flex flex-1 flex-col gap-2 p-3.5">
                  <span className={cx(CAPTION, "text-zinc-600")}>{item.brand}</span>
                  <span className="text-[0.9rem] font-semibold leading-snug text-zinc-950">{item.title}</span>
                  <span className="text-[0.75rem] font-normal text-zinc-600">{item.gradeLabel}</span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-[0.75rem] font-normal text-zinc-600">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden />
                    {item.matchTag}
                  </span>
                  <span className="mt-auto flex items-baseline gap-1.5 pt-1">
                    <span className={cx("text-base font-extrabold text-zinc-950", NUM)}>${comma(item.price)}</span>
                    <span className={cx("text-[0.7rem] font-normal text-zinc-600 line-through", NUM)}>
                      ${comma(item.original)}
                    </span>
                    <span className={cx("ml-auto text-[0.72rem] font-semibold text-zinc-600", NUM)}>
                      {item.match}% match
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* process — 3-way split with ghost numbers */}
      <section id="process" className="border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[1160px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-emerald-700")}
          >
            Fig. 03 — How a certificate gets made
          </motion.p>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {PROCESS.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.index}
                  initial={reduced ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-zinc-100"
                    style={GROTESK}
                  >
                    {v.index}
                  </span>
                  <Icon className="h-6 w-6 text-emerald-700" strokeWidth={2} aria-hidden />
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-zinc-950">{v.title}</h3>
                  {/* No BODY_MAX cap needed here — the 3-col grid column (~339px at 1920px
                      desktop) is already narrower than the cap, so the grid is the binding
                      width constraint, not a max-w utility (14px text: 339/(0.44*14) ≈ 55 chars). */}
                  <p className="mt-3 text-sm font-normal leading-[1.6] text-zinc-600">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* social proof — stat band + testimonial */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto w-full max-w-[1160px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-10 block text-emerald-700")}
          >
            Fig. 04 — Read the receipts
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE }}
            className="grid grid-cols-1 gap-8 border-b border-zinc-200 pb-16 sm:grid-cols-3"
          >
            {PROOF.map((s) => (
              <div key={s.label}>
                <div className={cx("text-4xl font-extrabold text-zinc-950 sm:text-5xl", NUM)}>{s.value}</div>
                <div className="mt-2 text-sm font-normal text-zinc-600">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-16 max-w-3xl"
          >
            <span aria-hidden className="text-6xl font-extrabold leading-none text-emerald-700" style={GROTESK}>
              &ldquo;
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-zinc-950 sm:text-[1.75rem]">
              {TESTIMONIAL.quote}
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-zinc-600">
              <span className="font-semibold text-zinc-950">{TESTIMONIAL.name}</span> · {TESTIMONIAL.role}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA — newsletter form */}
      <section id="cta" className="border-t border-zinc-200">
        <div className="mx-auto w-full max-w-[1160px] px-5 py-28 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.55, ease: EASE }}
            className="max-w-2xl"
          >
            <h2
              className="text-[clamp(2rem,6.2vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-zinc-950"
              style={GROTESK}
            >
              See your first certificate
              <br />
              before you buy anything.
            </h2>
            <p className={cx("mt-6 text-base font-normal leading-[1.6] text-zinc-600", BODY_MAX)}>
              Leave your email and we&rsquo;ll send a live sample certificate — the same kind you
              saw stamped above, built from a real listing.
            </p>
            <div className="mt-9 max-w-xl">
              <NewsletterForm />
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-zinc-200">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold text-zinc-950" style={GROTESK}>
            Assay
          </span>
          <span className="text-xs font-normal text-zinc-600">AI-certified secondhand · 2026 REPICK</span>
        </div>
      </footer>
      </div>
    </main>
  );
}
