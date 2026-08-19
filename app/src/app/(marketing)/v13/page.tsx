"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Quote, ShieldCheck } from "lucide-react";
import AuditTrail from "./AuditTrail";
import LedgerCard from "./LedgerCard";
import ProductRail from "./ProductRail";
import {
  CAPTION,
  EYEBROW,
  FOCUS,
  NUM,
  PROOF_STATS,
  STAT,
  TESTIMONIAL,
  TRADES,
  buildRows,
  cx,
  feeFor,
  money,
  sumRows,
  waivedTotal,
  type CheckId,
  type TradeId,
} from "./data";

/**
 * auto-landing-r11/c — "Running Ledger".
 *
 * The argument is a single number: what one inspection was worth, in money. The number is stated in
 * the first fold, at rest, before any interaction and before any scrolling. Scrolling does not
 * reveal it; scrolling decomposes it into the four entries that produced it, with the sticky audit
 * bar carrying the total along at every depth. Three controls (category, order value, and the
 * per-entry "I would have caught this" write-off) each recompute the whole ledger at once.
 */
export default function Page() {
  const [tradeId, setTradeId] = useState<TradeId>("sneakers");
  const [value, setValue] = useState<number>(TRADES[0].base);
  const [waived, setWaived] = useState<CheckId[]>([]);

  const trade = useMemo(() => TRADES.find((t) => t.id === tradeId) ?? TRADES[0], [tradeId]);
  const rows = useMemo(() => buildRows(trade, value, waived), [trade, value, waived]);
  const total = sumRows(rows);
  const writtenOff = waivedTotal(rows);
  const fee = feeFor(value);
  const multiple = fee > 0 ? Math.round(total / fee) : 0;

  function selectTrade(id: TradeId) {
    const next = TRADES.find((t) => t.id === id) ?? TRADES[0];
    setTradeId(next.id);
    setValue(next.base);
    setWaived([]);
  }

  function toggleWaive(id: CheckId) {
    setWaived((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <main className="min-h-dvh w-full bg-[#F5F5F2] text-[#12120F]">
      <a
        href="#main-content"
        className={cx(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-[#0F766E] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white",
          FOCUS,
        )}
      >
        Skip to main content
      </a>

      {/* masthead ------------------------------------------------------------------------------- */}
      <header className="border-b border-[#E2E2DC]">
        <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-3 sm:px-6 md:px-8">
          <p className="flex items-center gap-2 text-[0.95rem] font-extrabold tracking-[-0.01em] text-[#12120F]">
            <ShieldCheck aria-hidden="true" className="size-4 text-[#0F766E]" />
            repick
          </p>
          <nav aria-label="Primary" className="flex items-center gap-1">
            <a
              href="#audit-title"
              className={cx(
                "hidden min-h-[34px] items-center rounded-md px-3 text-[0.8rem] text-[#5B5B55] hover:text-[#12120F] sm:inline-flex",
                FOCUS,
              )}
            >
              Audit trail
            </a>
            <a
              href="#picks"
              className={cx(
                "hidden min-h-[34px] items-center rounded-md px-3 text-[0.8rem] text-[#5B5B55] hover:text-[#12120F] sm:inline-flex",
                FOCUS,
              )}
            >
              Listings
            </a>
            <a
              href="#cta"
              className={cx(
                "inline-flex min-h-[34px] items-center rounded-md bg-[#0F766E] px-3 text-[0.8rem] font-semibold text-white hover:bg-[#0B4F4A]",
                FOCUS,
              )}
            >
              Start an inspection
            </a>
          </nav>
        </div>
      </header>

      <div id="main-content">
        {/* hero — the conclusion, the ledger and the listings all at scroll zero ---------------- */}
        <section aria-labelledby="hero-title" className="pb-10 pt-8 md:pb-14 md:pt-10">
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-10">
              {/* copy + the total, stated up front */}
              <div className="order-1 min-w-0 lg:col-span-5 lg:col-start-1 lg:row-start-1">
                <p className={cx(EYEBROW, "text-[#5B5B55]")}>repick, inspection ledger</p>
                <h1
                  style={{ fontFamily: "var(--font-display-wide)" }}
                  id="hero-title"
                  className="mt-3 text-[clamp(1.75rem,3.1vw,2.65rem)] font-extrabold leading-[1.06] tracking-[-0.02em] text-[#12120F]"
                >
                  Every check we run has a number attached.
                </h1>

                <div className="mt-5 border-l-2 border-[#0F766E] pl-4">
                  <p className={cx(STAT, "text-[#5B5B55]")}>Protected on this one order</p>
                  <p
                    style={{ fontFamily: "var(--font-display-wide)" }}
                    className={cx(
                      NUM,
                      "mt-1 text-[clamp(2.75rem,6vw,4.25rem)] font-extrabold leading-[0.92] tracking-[-0.03em] text-[#12120F]",
                    )}
                  >
                    {money(total)}
                  </p>
                  <p className={cx(NUM, "mt-2 text-[0.85rem] text-[#5B5B55]")}>
                    {multiple}x the {money(fee)} inspection fee
                    {writtenOff > 0 ? `, after you wrote off ${money(writtenOff)}` : ""}
                  </p>
                </div>

                <p className="mt-5 max-w-[58ch] text-[0.95rem] leading-[1.65] text-[#5B5B55]">
                  That is the closed ledger for one real trade. Four checks, four entries, one total,
                  and one of those entries is a genuine zero. Change the order beside it and the whole
                  ledger recomputes; scroll and every figure gets its evidence.
                </p>

                <a
                  href="#cta"
                  className={cx(
                    "mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-[#0F766E] px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    FOCUS,
                  )}
                >
                  Inspect my next order
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
              </div>

              {/* the ledger */}
              <div className="order-3 min-w-0 lg:order-2 lg:col-span-7 lg:col-start-6 lg:row-start-1">
                <LedgerCard
                  trade={trade}
                  value={value}
                  rows={rows}
                  total={total}
                  fee={fee}
                  waivedSum={writtenOff}
                  onTrade={selectTrade}
                  onValue={setValue}
                  onWaive={toggleWaive}
                />
              </div>

              {/* four fully tagged listings, in the fold */}
              <div className="order-2 min-w-0 lg:order-3 lg:col-span-12 lg:col-start-1 lg:row-start-2">
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <h2 className={cx(CAPTION, "text-[#12120F]")}>
                    Inspected and listed tonight
                  </h2>
                  <p className="text-[0.72rem] text-[#5B5B55]">Every tag shown at rest</p>
                </div>
                <ProductRail />
              </div>
            </div>
          </div>
        </section>

        {/* the decomposition — scroll position is the argument -------------------------------- */}
        <AuditTrail trade={trade} rows={rows} total={total} value={value} />

        {/* proof --------------------------------------------------------------------------------- */}
        <section
          aria-labelledby="proof-title"
          className="border-t border-[#E2E2DC] bg-white py-16 md:py-24"
        >
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-7">
                <p className={cx(EYEBROW, "text-[#5B5B55]")}>From a buyer</p>
                <h2 id="proof-title" className="sr-only">
                  What buyers say about the ledger
                </h2>
                <figure className="mt-4">
                  <Quote aria-hidden="true" className="size-6 text-[#0F766E]" />
                  <blockquote className="mt-3 max-w-[52ch] text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.4] tracking-[-0.01em] text-[#12120F]">
                    {TESTIMONIAL.quote}
                  </blockquote>
                  <figcaption className="mt-4 text-[0.85rem] text-[#5B5B55]">
                    <span className="font-semibold text-[#12120F]">{TESTIMONIAL.name}</span> ·{" "}
                    {TESTIMONIAL.role}
                  </figcaption>
                </figure>
              </div>

              <dl className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
                {PROOF_STATS.map((stat) => (
                  <div key={stat.label} className="border-t border-[#E2E2DC] pt-3">
                    <dt className={cx(STAT, "text-[#5B5B55]")}>{stat.label}</dt>
                    <dd
                      style={{ fontFamily: "var(--font-display-wide)" }}
                      className={cx(
                        NUM,
                        "mt-1 text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold leading-none tracking-[-0.02em] text-[#12120F]",
                      )}
                    >
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* closing --------------------------------------------------------------------------------- */}
        <section
          id="cta"
          aria-labelledby="cta-title"
          className="scroll-mt-24 border-t border-[#E2E2DC] bg-[#F5F5F2] py-16 md:py-24"
        >
          <div className="mx-auto w-full max-w-[1180px] px-5 sm:px-6 md:px-8">
            <div className="rounded-2xl border border-[#E2E2DC] bg-white px-6 py-10 md:px-12 md:py-14">
              <p className={cx(EYEBROW, "text-[#5B5B55]")}>Ledger closed</p>
              <h2
                style={{ fontFamily: "var(--font-display-wide)" }}
                id="cta-title"
                className="mt-3 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-[#12120F]"
              >
                {money(total)} on one order, for {money(fee)}.
              </h2>
              <p className="mt-4 max-w-[470px] text-[0.95rem] leading-[1.7] text-[#5B5B55]">
                Nothing on this page was a projection. It is one settled trade, priced line by line,
                with the entry that cost nothing left in at zero. Your first inspection is billed the
                same way: a flat 2% of the order, and a ledger you can argue with.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#hero-title"
                  className={cx(
                    "inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#0F766E] px-5 text-[0.9rem] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    FOCUS,
                  )}
                >
                  Open a ledger for my order
                  <ArrowRight aria-hidden="true" className="size-4" />
                </a>
                <a
                  href="#audit-title"
                  className={cx(
                    "inline-flex min-h-[44px] items-center rounded-lg border border-[#E2E2DC] px-5 text-[0.9rem] font-semibold text-[#12120F] hover:border-[#0F766E] hover:text-[#0F766E]",
                    FOCUS,
                  )}
                >
                  Read the audit trail again
                </a>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#E2E2DC] bg-[#F5F5F2]">
          <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-6 sm:px-6 md:px-8">
            <p className="text-[0.75rem] text-[#5B5B55]">
              repick, secondhand inspection and escrow
            </p>
            <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5">
              <a
                href="#audit-title"
                className={cx(
                  "inline-flex min-h-[28px] items-center rounded-sm px-1 text-[0.75rem] text-[#5B5B55] hover:text-[#12120F]",
                  FOCUS,
                )}
              >
                How grading works
              </a>
              <a
                href="#picks"
                className={cx(
                  "inline-flex min-h-[28px] items-center rounded-sm px-1 text-[0.75rem] text-[#5B5B55] hover:text-[#12120F]",
                  FOCUS,
                )}
              >
                Listings
              </a>
              <a
                href="#cta"
                className={cx(
                  "inline-flex min-h-[28px] items-center rounded-sm px-1 text-[0.75rem] text-[#5B5B55] hover:text-[#12120F]",
                  FOCUS,
                )}
              >
                Pricing
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
