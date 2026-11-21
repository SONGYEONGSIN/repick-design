"use client";

import { useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Menu,
  Quote,
  ShieldCheck,
  X,
} from "lucide-react";
import { LISTINGS, type Listing } from "./data";
import { compare } from "./compare";
import { ListingCard } from "./ListingCard";
import { DiffTable } from "./DiffTable";
import { RadarChart } from "./RadarChart";

const NAV_LINKS = [
  { href: "#proof", label: "Product proof" },
  { href: "#compare", label: "Compare" },
  { href: "#proof-social", label: "Sellers" },
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#B8410A]">
      {children}
    </p>
  );
}

export function LandingExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAId, setSelectedAId] = useState<string>(LISTINGS[0].id);
  const [selectedBId, setSelectedBId] = useState<string>(LISTINGS[2].id);
  const selectAId = useId();
  const selectBId = useId();

  const listingA = useMemo<Listing>(
    () => LISTINGS.find((l) => l.id === selectedAId) ?? LISTINGS[0],
    [selectedAId],
  );
  const listingB = useMemo<Listing>(
    () => LISTINGS.find((l) => l.id === selectedBId) ?? LISTINGS[1],
    [selectedBId],
  );

  const comparison = useMemo(() => compare(listingA, listingB), [listingA, listingB]);

  function swapSelections() {
    setSelectedAId(selectedBId);
    setSelectedBId(selectedAId);
  }

  const heroCards = [LISTINGS[0], LISTINGS[2]];
  const previewCards = [LISTINGS[1], LISTINGS[3], LISTINGS[5], LISTINGS[4]];

  const closingHeadline = comparison.identical
    ? `${listingA.title} compared to itself is a wash — zero points apart.`
    : comparison.compositeBetter === "tie"
      ? `${listingA.title} and ${listingB.title} are a dead heat — 0.0 points apart.`
      : `${comparison.compositeBetter === "a" ? listingA.title : listingB.title} wins by ${comparison.compositeDelta.toFixed(1)} points over ${comparison.compositeBetter === "a" ? listingB.title : listingA.title}.`;

  return (
    <div className="bg-[#FAF9F7] text-[#171311]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#F1EDE8] bg-[#FAF9F7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-3 sm:px-8 sm:py-4 lg:px-10">
          <a
            href="#top"
            className="text-base font-extrabold tracking-[-0.02em] text-[#171311] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7] sm:text-lg"
          >
            repick
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-[#6B6560] outline-none transition-colors hover:text-[#171311] focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#compare"
              className="rounded-full bg-[#C2410C] px-4 py-2 text-sm font-semibold text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]"
            >
              Get started
            </a>
          </nav>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#171311] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7] md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <nav
          id="mobile-nav"
          inert={!menuOpen}
          className={`overflow-hidden transition-[max-height] duration-300 md:hidden ${
            menuOpen ? "max-h-64 border-t border-[#F1EDE8]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col gap-3 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold text-[#6B6560] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#compare"
                onClick={() => setMenuOpen(false)}
                className="inline-flex rounded-full bg-[#C2410C] px-4 py-2 text-sm font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7]"
              >
                Get started
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero — kept deliberately short so the proof cards clear the fold. */}
      <section id="top" className="mx-auto max-w-[1320px] px-5 pt-5 pb-8 sm:px-8 sm:pt-12 sm:pb-12 lg:px-10">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-start lg:gap-8">
          <div className="min-w-0 lg:col-span-7">
            <Eyebrow>Head-to-head resale proof</Eyebrow>
            <h1
              className="mt-2 text-[clamp(2rem,6vw,4.25rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-[#171311] sm:mt-3"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Pick two listings.
              <br />
              Let the math decide.
            </h1>
            <p className="mt-3 max-w-[586px] text-base leading-[1.6] text-[#6B6560] sm:mt-5 sm:text-[19px]">
              Same scoring for every seller, so comparing two listings is
              subtraction, not guesswork.
            </p>
            <div className="mt-4 sm:mt-7">
              <a
                href="#compare"
                className="inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-5 py-3 text-[15px] font-semibold text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF9F7] sm:px-6 sm:py-3.5"
              >
                Compare two listings
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
              Live proof, not a mockup
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:mt-3 sm:gap-4">
              {heroCards.map((listing) => (
                <ListingCard key={listing.id} listing={listing} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Product preview */}
      <section id="proof" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 max-w-[524px]">
              <Eyebrow>Product proof</Eyebrow>
              <h2
                className="mt-3 text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#171311]"
                style={{ fontFamily: "var(--font-display-wide)" }}
              >
                Every card makes the same four claims.
              </h2>
              <p className="mt-3 text-[17px] leading-[1.6] text-[#6B6560]">
                Match score, condition grade, seller verification, and the
                discount against original retail — reasoned out loud, not
                just asserted.
              </p>
            </div>
            <p
              aria-hidden="true"
              className="hidden shrink-0 text-[32px] font-semibold leading-none tracking-[0.12em] sm:block"
              style={{ color: "#BE7249" }}
            >
              02
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {previewCards.map((listing, index) => (
            <Reveal key={listing.id} className="min-w-0" delay={index * 0.08}>
              <ListingCard listing={listing} variant="rich" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Value: live pairwise comparison, in three parts */}
      <section id="compare" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10">
        <Reveal>
          <Eyebrow>Live comparison</Eyebrow>
          <h2
            className="mt-3 max-w-[760px] text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#171311]"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            Put any two listings on the same scale.
          </h2>
          <p className="mt-3 max-w-[524px] text-[17px] leading-[1.6] text-[#6B6560]">
            Choose any listing for each side. The table, the chart, and the
            line below all read from the same live comparison — move either
            pick and every number updates together.
          </p>
        </Reveal>

        {/* Part 1: selectors */}
        <Reveal className="mt-8">
          <div className="grid grid-cols-1 items-end gap-4 rounded-2xl bg-[#F1EDE8] p-5 sm:grid-cols-[1fr_auto_1fr] sm:p-6">
            <div className="min-w-0">
              <label
                htmlFor={selectAId}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#534E49]"
              >
                Listing A
              </label>
              <select
                id={selectAId}
                value={selectedAId}
                onChange={(e) => setSelectedAId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E4DED7] bg-white px-3 py-2.5 text-sm font-semibold text-[#171311] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EDE8]"
              >
                {LISTINGS.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={swapSelections}
              aria-label="Swap listing A and listing B"
              className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#B8410A] outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EDE8]"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <label
                htmlFor={selectBId}
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#534E49]"
              >
                Listing B
              </label>
              <select
                id={selectBId}
                value={selectedBId}
                onChange={(e) => setSelectedBId(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E4DED7] bg-white px-3 py-2.5 text-sm font-semibold text-[#171311] outline-none focus-visible:ring-2 focus-visible:ring-[#B8410A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F1EDE8]"
              >
                {LISTINGS.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-[#6B6560]">
            {comparison.identical
              ? "You've picked the same listing twice — every row below reads zero. Choose a different listing on either side to see a real difference."
              : comparison.biggestSwing
                ? `Biggest swing: ${comparison.biggestSwing.label} (${Math.round(comparison.biggestSwing.magnitude)} pts apart on our 0–100 scale).`
                : "No standout difference between these two picks."}
          </p>
        </Reveal>

        {/* Parts 2 & 3: diff table + radar overlay */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal className="min-w-0">
            <DiffTable comparison={comparison} listingA={listingA} listingB={listingB} />
          </Reveal>
          <Reveal className="min-w-0">
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-[#F1EDE8] bg-white p-6">
              <RadarChart a={listingA} b={listingB} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Social proof */}
      <section id="proof-social" className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10">
        <Reveal>
          <Eyebrow>Sellers and buyers, both</Eyebrow>
          <h2
            className="mt-3 max-w-[760px] text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-[#171311]"
            style={{ fontFamily: "var(--font-display-wide)" }}
          >
            The same scoring, on both sides of the trade.
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              quote:
                "I compared two watches side by side and saw exactly why one cost more. No back-and-forth with the seller needed.",
              name: "Priya N.",
              role: "Buyer, Chicago",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
            },
            {
              quote:
                "My listing's grade matched what I actually sent in. The discount math was transparent from the first offer.",
              name: "Marcus O.",
              role: "Seller, Austin",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            },
            {
              quote:
                "The condition grade and the price finally agree with each other. That's the whole pitch, and it holds up.",
              name: "Lena H.",
              role: "Buyer, Portland",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
            },
          ].map((t) => (
            <Reveal key={t.name} className="min-w-0">
              <figure className="flex h-full flex-col rounded-2xl border border-[#F1EDE8] bg-white p-6">
                <Quote className="h-6 w-6 text-[#BE7249]" aria-hidden="true" />
                <blockquote className="mt-3 flex-1 text-[15px] leading-[1.6] text-[#171311]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#F1EDE8]">
                    <Image
                      src={t.avatar}
                      alt={`Portrait of ${t.name}`}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#171311]">{t.name}</p>
                    <p className="truncate text-xs font-semibold text-[#6B6560]">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <div className="grid grid-cols-1 gap-8 rounded-2xl bg-[#F1EDE8] p-7 sm:grid-cols-3">
            {[
              { value: "12,400+", label: "Verified trades completed" },
              { value: "91%", label: "Average AI match score" },
              { value: "6 days", label: "Average time to sell" },
            ].map((stat) => (
              <div key={stat.label} className="min-w-0 text-center sm:text-left">
                <p className="text-[32px] font-semibold leading-none tracking-[0.12em] text-[#171311]">
                  {stat.value}
                </p>
                <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#534E49]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-10">
        <Reveal>
          <div className="rounded-2xl bg-[#171311] px-6 py-12 text-center sm:px-10">
            <ShieldCheck className="mx-auto h-8 w-8 text-[#BE7249]" aria-hidden="true" />
            <h2
              className="mx-auto mt-4 max-w-[720px] text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              {closingHeadline}
            </h2>
            <p className="mx-auto mt-4 max-w-[524px] text-[17px] leading-[1.6] text-[#D9D2CB]">
              That number comes straight from the comparison above. Pick your
              own two listings and start your own trade with the same math
              behind it.
            </p>
            <div className="mt-7">
              <a
                href="#compare"
                className="inline-flex items-center gap-2 rounded-full bg-[#C2410C] px-6 py-3.5 text-[15px] font-semibold text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#BE7249] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171311]"
              >
                Start comparing
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#6B6560]">
          repick · AI match scoring · condition grading · seller verification
        </p>
      </section>
    </div>
  );
}
