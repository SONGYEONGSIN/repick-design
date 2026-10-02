"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import Hero from "./hero";
import ListingCard from "./listing-card";
import {
  CATEGORIES,
  NEEDS,
  PRODUCTS,
  STATS,
  TESTIMONIALS,
  discountPct,
  edgeFor,
  needById,
  productById,
  savingsOf,
  topEdgeForNeed,
  type Category,
  type NeedId,
  type ProductId,
} from "./data";
import { ACCENT_BASE, ACCENT_BRIGHT, BODY_14, BODY_16, DISPLAY, Eyebrow, FOCUS, INK, PrimaryButton, Reveal, SKIP_LINK, SectionFolio } from "./ui";

const NAV_LINKS = [
  { href: "#graph", label: "The graph" },
  { href: "#preview", label: "Listings" },
  { href: "#proof", label: "Reviews" },
];

export default function ConstellationLanding() {
  // Default-focused pair, chosen deliberately: Condition -> Jordan 1 at 97% is the strongest single
  // edge on the whole graph, so the page opens on a differentiated, fully-reasoned result before
  // anyone clicks anything (required baseline-diff rule for the graph's rest state).
  const [activeNeedId, setActiveNeedId] = useState<NeedId>("condition");
  const [activeProductId, setActiveProductId] = useState<ProductId>("jordan-1");
  const [category, setCategory] = useState<"All" | Category>("All");

  function selectNeed(id: NeedId) {
    setActiveNeedId(id);
    setActiveProductId(topEdgeForNeed(id).productId);
  }

  function selectProduct(id: ProductId) {
    setActiveProductId(id);
  }

  function selectPair(needId: NeedId, productId: ProductId) {
    setActiveNeedId(needId);
    setActiveProductId(productId);
  }

  const activeEdge = edgeFor(activeNeedId, activeProductId)!;
  const activeNeed = needById(activeNeedId);
  const activeProduct = productById(activeProductId);
  const discount = discountPct(activeProduct);
  const savings = savingsOf(activeProduct);

  const filteredProducts = useMemo(
    () => (category === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  );

  return (
    <div className="min-h-dvh overflow-x-clip font-normal text-zinc-100 antialiased" style={{ backgroundColor: "#0B0B0F" }}>
      <a href="#main" className={SKIP_LINK}>
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-zinc-800 px-5 py-4 backdrop-blur sm:px-8 lg:px-12" style={{ backgroundColor: "rgba(11,11,15,0.92)" }}>
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-[15px] font-bold tracking-[-0.02em] text-zinc-50" style={DISPLAY}>
            <span className="h-2 w-2 rounded-full" aria-hidden="true" style={{ backgroundColor: ACCENT_BRIGHT }} />
            repick
          </span>
          <nav aria-label="Sections" className="hidden items-center gap-6 sm:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-zinc-100 ${FOCUS}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#graph"
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS}`}
            style={{ backgroundColor: ACCENT_BRIGHT, color: INK }}
          >
            Trace your matches
          </a>
        </div>
      </header>

      <main id="main">
        <Hero
          activeNeedId={activeNeedId}
          activeProductId={activeProductId}
          onSelectNeed={selectNeed}
          onSelectProduct={selectProduct}
          onSelectPair={selectPair}
        />

        {/* ------------------------------------------------------- 2. PRODUCT PREVIEW */}
        <section id="preview" className="border-b border-zinc-800 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="02" />
                <div>
                  <Eyebrow>Product preview</Eyebrow>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.02em] text-zinc-50"
                    style={DISPLAY}
                  >
                    Every listing, graded and reasoned
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY_16}`}>
                Each grade comes from a 32-point inspection, not a seller&rsquo;s description, and
                every card shows exactly which need it answers best.
              </p>
            </Reveal>

            <div role="group" aria-label="Filter listings by category" className="mt-8 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${FOCUS} ${
                    category === c ? "border-transparent" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                  }`}
                  style={category === c ? { backgroundColor: ACCENT_BRIGHT, color: INK } : undefined}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div key={product.id} className="min-w-0">
                  <ListingCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- 3. VALUE (graph-is-the-split) */}
        <section className="border-b border-zinc-800 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="03" />
                <div>
                  <Eyebrow>How the graph decides</Eyebrow>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.02em] text-zinc-50"
                    style={DISPLAY}
                  >
                    Exploring the graph is the comparison
                  </h2>
                </div>
              </div>
              <p className={`mt-5 ${BODY_16}`} aria-live="polite">
                Right now you&rsquo;re focused on <span className="font-semibold text-zinc-100">{activeNeed.label.toLowerCase()}</span>,
                and the graph points to <span className="font-semibold text-zinc-100">{activeProduct.name}</span> at{" "}
                <span className="font-semibold tabular-nums text-zinc-100">{activeEdge.strength}%</span>. Switch the
                need above the graph and every number on this page changes with it &mdash; nothing here is a
                static example.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {NEEDS.map((need) => (
                <div key={need.id} className="min-w-0 rounded-xl border border-zinc-800 p-5" style={{ backgroundColor: "#131318" }}>
                  <p className="text-[13px] font-semibold text-zinc-100">{need.label}</p>
                  <p className="mt-2 text-[13px] font-normal leading-[1.6] text-zinc-400">{need.method}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------- 4. SOCIAL PROOF */}
        <section id="proof" className="border-b border-zinc-800 px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal>
              <div className="flex items-end gap-5">
                <SectionFolio n="04" />
                <div>
                  <Eyebrow>Social proof</Eyebrow>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.4rem,3.2vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.02em] text-zinc-50"
                    style={DISPLAY}
                  >
                    Buyers who traced before they bought
                  </h2>
                </div>
              </div>
            </Reveal>

            {/* A plain div grid, not a <dl> -- each "pair" below is a styled stat block, not a
                term/definition relationship, and a <dl> whose direct children are wrapper <div>s
                (rather than only dt/dd) is exactly the promoted "definition-list" hard-fail
                pattern this catalog has hit before. */}
            <Reveal delay={0.06}>
              <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
                {STATS.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <p className="text-[13px] font-normal text-zinc-400">{stat.label}</p>
                    <p
                      className="mt-1 text-[clamp(1.3rem,2.6vw,1.8rem)] font-bold tabular-nums tracking-[-0.01em] text-zinc-50"
                      style={DISPLAY}
                    >
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <figure key={t.name} className="h-full min-w-0 rounded-2xl border border-zinc-800 p-6" style={{ backgroundColor: "#131318" }}>
                  <Quote className="h-5 w-5" aria-hidden="true" style={{ color: ACCENT_BASE }} />
                  <blockquote className={`mt-3 ${BODY_14}`}>{t.quote}</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-[12px] font-semibold"
                      style={{ backgroundColor: ACCENT_BRIGHT, color: INK }}
                    >
                      {t.initials}
                    </span>
                    <span className="min-w-0 text-[12px] text-zinc-400">
                      <span className="block truncate text-[13px] font-semibold text-zinc-100">{t.name}</span>
                      <span className="block truncate">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- 5. CLOSING CTA */}
        <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="mx-auto w-full max-w-[1240px]">
            <Reveal className="rounded-3xl border border-zinc-800 bg-[#131318] px-6 py-12 sm:px-12 sm:py-16">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <Eyebrow tone="bright">Still tracing {activeNeed.label.toLowerCase()}</Eyebrow>
                  <h2
                    className="mt-3 max-w-[720px] text-[clamp(1.6rem,4vw,2.5rem)] font-bold leading-[1.12] tracking-[-0.02em] text-zinc-50"
                    style={DISPLAY}
                  >
                    See why we matched you with {activeProduct.name}
                  </h2>
                  <p className={`mt-5 ${BODY_16}`} aria-live="polite">
                    For <span className="font-semibold text-zinc-100">{activeNeed.label.toLowerCase()}</span>, the
                    graph points to <span className="font-semibold text-zinc-100">{activeProduct.name}</span>: $
                    {activeProduct.priceNow.toLocaleString("en-US")} now, a $
                    {savings.toLocaleString("en-US")} saving ({discount}%) off its $
                    {activeProduct.priceOriginal.toLocaleString("en-US")} original price, at{" "}
                    <span className="font-semibold tabular-nums text-zinc-100">{activeEdge.strength}%</span> match
                    because {activeEdge.reason.toLowerCase()}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[12px] font-normal text-zinc-400">
                    <ShieldCheck className="h-3.5 w-3.5 flex-none" aria-hidden="true" style={{ color: ACCENT_BASE }} />
                    Every figure above is backed by a verified, in-hand listing.
                  </p>
                </div>
                <div>
                  <PrimaryButton href="#graph">
                    Adjust the graph
                  </PrimaryButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-6">
          <span className="text-[13px] font-semibold tracking-[-0.01em] text-zinc-100">repick</span>
          <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`rounded px-1 py-2 text-[13px] font-normal text-zinc-400 transition-colors hover:text-zinc-100 ${FOCUS}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <span className="flex items-center gap-1 text-[11px] font-normal tracking-[0.16em] text-zinc-400">
            GRADED BEFORE IT SHIPS
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </footer>
    </div>
  );
}
