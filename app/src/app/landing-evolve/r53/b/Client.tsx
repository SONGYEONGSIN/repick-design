"use client";

import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowUpDown, BadgeCheck, ShieldCheck, Sparkles, Star } from "lucide-react";
import { DEFAULT_SELECTED, LISTINGS, MAX_TRAY } from "./data";
import { bestByMatch, formatUsd, sortListings, type SortId } from "./model";
import { Reveal } from "./Reveal";
import {
  ACCENT_FILL,
  ACCENT_TEXT,
  EYEBROW,
  FOCUS_RING,
  MUTED_TEXT,
  ON_ACCENT_FILL_TEXT,
  PROSE_WIDTH,
  STAT_LABEL,
  SURFACE,
} from "./tokens";

export default function Client() {
  const sortLabelId = useId();
  const [sort, setSort] = useState<SortId>("match");
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED);
  const prefersReducedMotion = useReducedMotion();

  const sorted = sortListings(sort);
  const chosen = LISTINGS.filter((l) => selected.includes(l.id));
  const top = bestByMatch(selected);
  const atMax = selected.length >= MAX_TRAY;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_TRAY) return prev;
      return [...prev, id];
    });
  }

  return (
    <main className="bg-white text-[#0B0B0F]">
      {/* ---------------------------------------------------------------- HERO + grid + live comparison,
          all in one component -- the comparison table is the page's proof and renders without
          navigating away from the hero, per this catalog's own hero-fold rule. */}
      <section className="px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:px-10 lg:pb-20 lg:pt-32" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-[1320px]">
          <div className="flex flex-col gap-5 lg:max-w-[720px]">
            <p className={`${EYEBROW} ${MUTED_TEXT}`}>repick · compare before you decide</p>
            <h1
              id="hero-heading"
              className="text-[clamp(2.25rem,4.4vw+1rem,3.75rem)] font-extrabold leading-[1.05] tracking-[-0.02em]"
              style={{ fontFamily: "var(--font-display-wide)" }}
            >
              Add up to three. <span className={ACCENT_TEXT}>Compare everything</span> that matters.
            </h1>
            <p className={`${PROSE_WIDTH} text-[17px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
              Every match comes with the same AI-matching proof as its own listing -- price,
              match score, condition, seller rating. Add any two or three to see them side by side.
            </p>
          </div>

          {/* Sort control -- a real second manipulation, not decorative: it re-orders the grid below. */}
          <div className="mt-8 flex items-center gap-3">
            <span id={sortLabelId} className={`${STAT_LABEL} ${MUTED_TEXT}`}>
              Sort by
            </span>
            <div role="group" aria-labelledby={sortLabelId} className="inline-flex rounded-full border p-1" style={{ borderColor: "#E3E3EE" }}>
              {(["match", "price"] as SortId[]).map((id) => {
                const active = id === sort;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSort(id)}
                    className={`${FOCUS_RING} inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                      active ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}` : "text-[#0B0B0F]"
                    }`}
                  >
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    {id === "match" ? "Best match" : "Lowest price"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Listing grid -- each card toggles itself into the comparison tray. */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((listing) => {
              const isChosen = selected.includes(listing.id);
              const disabled = !isChosen && atMax;
              return (
                <article
                  key={listing.id}
                  className={`flex min-w-0 flex-col rounded-2xl border transition-colors ${isChosen ? "border-[#4F46E5]" : ""}`}
                  style={{ borderColor: isChosen ? undefined : "#E3E3EE" }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl" style={{ backgroundColor: SURFACE }}>
                    <Image
                      src={`https://images.unsplash.com/photo-${listing.photoId}?auto=format&fit=crop&w=800&q=70`}
                      alt={listing.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 px-4 pt-3 text-[11px] font-semibold">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT}`}>
                      <Sparkles className="h-3 w-3" aria-hidden="true" /> {listing.matchPct}% match
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E3E3EE" }}>
                      {listing.grade}
                    </span>
                    {listing.verified ? (
                      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1" style={{ borderColor: "#E3E3EE" }}>
                        <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Verified
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col gap-1 px-4 pb-3 pt-2">
                    <h2 className="text-[15px] font-semibold leading-snug">{listing.title}</h2>
                    <p className={`text-[12px] font-normal ${MUTED_TEXT}`}>{listing.category}</p>
                    <p className="mt-1 text-[16px] font-extrabold tabular-nums">{formatUsd(listing.price)}</p>
                  </div>

                  <label className="border-t px-4 py-3" style={{ borderColor: "#E3E3EE" }}>
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={isChosen}
                      disabled={disabled}
                      onChange={() => toggle(listing.id)}
                    />
                    <span
                      className={`${FOCUS_RING} block cursor-pointer select-none rounded-full border px-3 py-2 text-center text-[13px] font-semibold transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${
                        isChosen ? `${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} border-transparent` : "border-[#E3E3EE] text-[#0B0B0F]"
                      }`}
                    >
                      {isChosen ? "Added to compare" : disabled ? `Compare is full (${MAX_TRAY})` : "Add to compare"}
                    </span>
                  </label>
                </article>
              );
            })}
          </div>

          {/* Live comparison table -- the page's proof, inside the hero component itself. */}
          <div className="mt-10 rounded-2xl border p-5 sm:p-6" style={{ borderColor: "#E3E3EE", backgroundColor: SURFACE }} aria-live="polite">
            <p className={`${EYEBROW} ${MUTED_TEXT}`}>Comparing {chosen.length} of {MAX_TRAY}</p>
            {chosen.length === 0 ? (
              <p className={`mt-3 text-[14px] font-normal ${MUTED_TEXT}`}>Select at least one item above to compare it here.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                  <caption className="sr-only">Side-by-side comparison of selected listings</caption>
                  <colgroup>
                    <col style={{ width: "26%" }} />
                    {chosen.map((c) => (
                      <col key={c.id} style={{ width: `${Math.floor(74 / chosen.length)}%` }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col" className="sr-only">
                        Attribute
                      </th>
                      {chosen.map((c) => (
                        <th key={c.id} scope="col" className="px-2 py-2 text-left text-[13px] font-semibold">
                          {c.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t" style={{ borderColor: "#E3E3EE" }}>
                      <th scope="row" className={`px-2 py-2 text-left text-[12px] font-semibold ${MUTED_TEXT}`}>
                        Price
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-[14px] font-normal tabular-nums">
                          {formatUsd(c.price)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t" style={{ borderColor: "#E3E3EE" }}>
                      <th scope="row" className={`px-2 py-2 text-left text-[12px] font-semibold ${MUTED_TEXT}`}>
                        Match score
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-[14px] font-normal tabular-nums">
                          {c.matchPct}%
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t" style={{ borderColor: "#E3E3EE" }}>
                      <th scope="row" className={`px-2 py-2 text-left text-[12px] font-semibold ${MUTED_TEXT}`}>
                        Condition
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-[14px] font-normal">
                          {c.grade}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t" style={{ borderColor: "#E3E3EE" }}>
                      <th scope="row" className={`px-2 py-2 text-left text-[12px] font-semibold ${MUTED_TEXT}`}>
                        Seller rating
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-[14px] font-normal tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" aria-hidden="true" /> {c.sellerRating.toFixed(1)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t" style={{ borderColor: "#E3E3EE" }}>
                      <th scope="row" className={`px-2 py-2 text-left text-[12px] font-semibold ${MUTED_TEXT}`}>
                        Ships in
                      </th>
                      {chosen.map((c) => (
                        <td key={c.id} className="px-2 py-2 text-[14px] font-normal">
                          {c.shipsIn}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- VALUE TRIPTYCH */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="why-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="why-heading" className="text-[clamp(1.6rem,2.4vw+1rem,2.4rem)] font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display-wide)" }}>
              Why comparing beats browsing alone
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {[
              { title: "See it next to the alternative", body: "A single listing never tells you if it's the best option -- only a second one next to it does." },
              { title: "Same stats, every row", body: "Every column is sourced the same way: match score, condition, and rating never come from a different pipeline." },
              { title: "No oversell", body: "The table shows exactly what each listing has -- it never pads a weaker option to make a comparison look closer." },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08} className="min-w-0">
                <div className="flex min-w-0 flex-col gap-2 rounded-2xl border p-5" style={{ borderColor: "#E3E3EE" }}>
                  <BadgeCheck className={`h-5 w-5 ${ACCENT_TEXT}`} aria-hidden="true" />
                  <h3 className="text-[16px] font-semibold">{item.title}</h3>
                  <p className={`${PROSE_WIDTH} text-[14px] font-normal leading-[1.6] ${MUTED_TEXT}`}>{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- SOCIAL PROOF */}
      <section className="px-4 py-16 sm:px-6 lg:px-10 lg:py-20" style={{ backgroundColor: SURFACE }} aria-labelledby="proof-heading">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <h2 id="proof-heading" className="sr-only">
              Buyer results
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { stat: "41%", label: "of buyers compare 2+ items before checkout" },
                { stat: "4.7 / 5", label: "average rating across compared sellers" },
                { stat: "9 sec", label: "average time to build a 3-item comparison" },
              ].map((row) => (
                <div key={row.label} className="rounded-2xl border bg-white p-5 text-center" style={{ borderColor: "#E3E3EE" }}>
                  <p className="text-[28px] font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display-wide)" }}>
                    {row.stat}
                  </p>
                  <p className={`mt-1 text-[13px] font-normal ${MUTED_TEXT}`}>{row.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { quote: "I almost bought the first camera until the table showed the second one shipped two days faster for five dollars more.", name: "Owen K." },
              { quote: "Seeing seller rating next to price changed which one I picked entirely.", name: "Farrah I." },
              { quote: "Three tabs open became one table. I didn't lose the comparison when I closed my laptop.", name: "Devon R." },
            ].map((t) => (
              <figure key={t.name} className="rounded-2xl border bg-white p-5" style={{ borderColor: "#E3E3EE" }}>
                <blockquote className={`${PROSE_WIDTH} text-[14px] font-normal leading-[1.6]`}>&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className={`mt-3 text-[12px] font-semibold ${MUTED_TEXT}`}>{t.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- CLOSING CTA -- echoes the SAME live tray state */}
      <section id="start-comparing" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24" aria-labelledby="cta-heading">
        <motion.div
          className="mx-auto flex max-w-[1320px] flex-col items-start gap-5 rounded-2xl border p-8 sm:p-12"
          style={{ borderColor: "#E3E3EE" }}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 id="cta-heading" className="text-[clamp(1.6rem,2.6vw+1rem,2.6rem)] font-extrabold tracking-[-0.02em]" style={{ fontFamily: "var(--font-display-wide)" }}>
            {top ? (
              <>
                Of your {chosen.length} picks, <span className={ACCENT_TEXT}>{top.title}</span> leads on match
              </>
            ) : (
              "Build your comparison above"
            )}
          </h2>
          <p className={`${PROSE_WIDTH} text-[15px] font-normal leading-[1.6] ${MUTED_TEXT}`}>
            {top
              ? `${top.matchPct}% match, ${formatUsd(top.price)}, ${top.grade.toLowerCase()} condition. Every number here came straight from the table above.`
              : "Add at least one listing to the comparison tray to see a recommendation here."}
          </p>
          <a
            href="#hero-heading"
            className={`${FOCUS_RING} ${ACCENT_FILL} ${ON_ACCENT_FILL_TEXT} mt-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-semibold`}
          >
            Review your comparison
          </a>
        </motion.div>
      </section>
    </main>
  );
}
