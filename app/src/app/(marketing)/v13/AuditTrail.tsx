"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { CAPTION, EYEBROW, NUM, STAT, cx, money, type Row, type Trade } from "./data";

type Props = {
  trade: Trade;
  rows: Row[];
  total: number;
  value: number;
};

/**
 * The audit trail. Scroll position *is* the argument here: each entry from the ledger above gets one
 * block of evidence, and the sticky bar carries the running "audited so far" figure next to the
 * total that was already stated in the first fold. The total is never withheld — scrolling proves
 * where it came from, it does not reveal whether it exists.
 *
 * Nothing is rendered at `opacity: 0` waiting for a viewport callback. Every block is fully legible
 * before, during and after its reveal; the only thing the viewport callback changes is which entry
 * the sticky bar is pointing at, and the pending/audited stamp on each block. A capture taken at any
 * scroll depth, with JavaScript disabled, or with reduced motion on, shows complete content.
 */
export default function AuditTrail({ trade, rows, total, value }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end end"],
  });

  const audited = rows.reduce(
    (sum, row, i) => (i <= current && !row.waived ? sum + row.amount : sum),
    0,
  );

  return (
    <section aria-labelledby="audit-title" className="border-t border-[#E2E2DC] bg-[#F5F5F2]">
      {/* running bar — sticks for the whole trail, so the conclusion is on screen at every depth */}
      <div className="sticky top-0 z-30 border-b border-[#E2E2DC] bg-[#F5F5F2]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-1 px-5 py-2.5 sm:px-6 md:px-8">
          <p className={cx(STAT, "text-[#5B5B55]")}>
            Audit trail
            <span className={cx(NUM, "ml-2 text-[#12120F]")}>
              {current + 1} / {rows.length}
            </span>
          </p>
          <p className={cx(NUM, "text-[0.78rem] text-[#5B5B55]")}>
            <span className="font-semibold text-[#0F766E]">{money(audited)}</span> of{" "}
            <span className="font-semibold text-[#12120F]">{money(total)}</span> evidenced
          </p>
        </div>
        <div className="h-0.5 w-full bg-[#E2E2DC]">
          <motion.div
            style={{ scaleX: scrollYProgress, transformOrigin: "left center" }}
            className="h-full w-full bg-[#0F766E]"
          />
        </div>
      </div>

      <div ref={sectionRef} className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-14 sm:px-6 md:px-8 md:pb-28 md:pt-20">
        <header className="max-w-[62ch]">
          <p className={cx(EYEBROW, "text-[#5B5B55]")}>Where the number came from</p>
          <h2
            style={{ fontFamily: "var(--font-display-wide)" }}
            id="audit-title"
            className="mt-3 text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.015em] text-[#12120F]"
          >
            Four entries, four pieces of evidence.
          </h2>
          <p className="mt-3 max-w-[470px] text-[0.95rem] leading-[1.65] text-[#5B5B55]">
            The total above is already settled. What follows is the paperwork behind each line, in
            the order the checks ran, for the {trade.item.toLowerCase()} at {money(value)}.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-24">
          {rows.map((row, i) => {
            const line = row.line;
            const done = i <= current;
            return (
              <motion.article
                key={line.id}
                id={`audit-${line.id}`}
                onViewportEnter={() => setCurrent(i)}
                viewport={{ amount: 0.2 }}
                className="scroll-mt-24 grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10"
              >
                {/* left rail — entry, figure, stamp */}
                <div className="md:col-span-4">
                  <p className={cx(CAPTION, "text-[#5B5B55]")}>{line.fig}</p>
                  <p
                    style={{ fontFamily: "var(--font-display-wide)" }}
                    className={cx(
                      NUM,
                      "mt-1 text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-[0.95] tracking-[-0.02em] text-[#0F766E]",
                    )}
                  >
                    0{i + 1}
                  </p>
                  <h3 className="mt-3 text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] text-[#12120F]">
                    {line.entry}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-display-wide)" }}
                    className={cx(
                      NUM,
                      "mt-2 text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-none",
                      row.waived ? "text-[#5B5B55] line-through" : "text-[#12120F]",
                    )}
                  >
                    {line.settled ? money(0) : `+${money(row.amount)}`}
                  </p>
                  <p className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className={cx(
                        "inline-flex min-h-[26px] items-center rounded-md px-2 text-[0.68rem] font-semibold transition-colors duration-200 motion-reduce:transition-none",
                        done
                          ? "bg-[#0F766E] text-white"
                          : "border border-[#E2E2DC] bg-white text-[#5B5B55]",
                      )}
                    >
                      {done ? "Evidence read" : "Further down"}
                    </span>
                    {row.waived ? (
                      <span className="inline-flex min-h-[26px] items-center rounded-md border border-[#5B5B55] px-2 text-[0.68rem] font-semibold text-[#5B5B55]">
                        Written off by you
                      </span>
                    ) : null}
                  </p>
                </div>

                {/* right — the evidence itself, data first */}
                <div className="md:col-span-8">
                  <div className="rounded-xl border border-[#E2E2DC] bg-white">
                    <div className="border-b border-[#E2E2DC] px-4 py-3.5 sm:px-5">
                      <p className={cx(STAT, "text-[#5B5B55]")}>The listing said</p>
                      <p className="mt-1 max-w-[440px] text-[0.9rem] leading-normal text-[#12120F]">
                        {line.claim}
                      </p>
                    </div>
                    <div className="border-b border-[#E2E2DC] bg-[#E3F1EF] px-4 py-3.5 sm:px-5">
                      <p className={cx(STAT, "text-[#0B4F4A]")}>The check found</p>
                      <p className="mt-1 max-w-[440px] text-[0.9rem] leading-normal text-[#12120F]">
                        {line.found}
                      </p>
                    </div>
                    <dl className="divide-y divide-[#E2E2DC]">
                      {line.facts.map((fact) => (
                        <div
                          key={fact.k}
                          className="flex items-baseline justify-between gap-4 px-4 py-2.5 sm:px-5"
                        >
                          <dt className="min-w-0 text-[0.8rem] text-[#5B5B55]">{fact.k}</dt>
                          <dd
                            className={cx(
                              NUM,
                              "shrink-0 text-[0.85rem] font-semibold text-[#12120F]",
                            )}
                          >
                            {fact.v}
                          </dd>
                        </div>
                      ))}
                      {line.settled ? (
                        <div className="flex items-baseline justify-between gap-4 px-4 py-2.5 sm:px-5">
                          <dt className="min-w-0 text-[0.8rem] text-[#5B5B55]">
                            Escrow returned
                          </dt>
                          <dd
                            className={cx(NUM, "shrink-0 text-[0.85rem] font-semibold text-[#0F766E]")}
                          >
                            {money(value)}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </div>

                  <p className="mt-4 max-w-[470px] text-[0.95rem] leading-[1.7] text-[#5B5B55]">
                    {line.note}
                  </p>

                  {line.image ? (
                    <figure className="mt-5">
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#E2E2DC]">
                        <Image
                          src={line.image.src}
                          alt={line.image.alt}
                          fill
                          sizes="(min-width: 768px) 640px, 100vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className={cx(CAPTION, "mt-2 text-[#5B5B55]")}>
                        {line.fig} — the item as it was photographed for the listing
                      </figcaption>
                    </figure>
                  ) : null}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
