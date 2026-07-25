"use client";

import { Fragment, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  ShieldCheck,
  Table2,
} from "lucide-react";
import {
  CATEGORIES,
  ROWS,
  EASE,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const CTA_PRIMARY =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] sm:w-auto " +
  FOCUS;

const TAB_BTN =
  "flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-center transition-colors duration-150 " +
  FOCUS;

const ROW_TRIGGER =
  "flex w-full items-center gap-1.5 py-3 pr-1 text-left transition-colors duration-150 hover:text-white " +
  FOCUS;

export default function CompareTable() {
  const reduced = useReducedMotion();
  const [catIdx, setCatIdx] = useState(0);
  // Open the first row (price basis) by default so the real-listing proof is visible even at rest (no hover-only reveal principle)
  const [openRowId, setOpenRowId] = useState<string | null>(ROWS[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const category = CATEGORIES[catIdx];

  const toggleRow = (id: string) => {
    setOpenRowId((cur) => (cur === id ? null : id));
  };

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % CATEGORIES.length;
    else if (e.key === "ArrowLeft")
      next = (idx - 1 + CATEGORIES.length) % CATEGORIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = CATEGORIES.length - 1;
    else return;
    e.preventDefault();
    setCatIdx(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.04]"
      >
        05
      </span>

      <div className="relative flex items-center justify-between gap-3">
        <p className={cx(EYEBROW, "flex items-center gap-2 text-[#a894f7]")}>
          <Table2 className="h-3.5 w-3.5" aria-hidden />
          Fig. 01 — AI matching comparison table
        </p>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>Recalculates on tab switch</span>
      </div>

      {/* Category tabs — switching recalculates every value in the table */}
      <div
        role="tablist"
        aria-label="Product category to compare"
        className="relative mt-5 flex gap-2"
      >
        {CATEGORIES.map((c, i) => {
          const selected = i === catIdx;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${c.id}`}
              aria-selected={selected}
              aria-controls={`panel-${c.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setCatIdx(i)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={cx(
                TAB_BTN,
                selected
                  ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                  : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white",
              )}
            >
              <Icon
                className={cx("h-4 w-4", selected ? "text-[#6E56CF]" : "text-current")}
                aria-hidden
              />
              <span className="text-[0.72rem] font-semibold sm:text-[0.78rem]">
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Comparison table — baseline values are always visible; expanding a row reveals deeper evidence */}
      <div
        id={`panel-${category.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${category.id}`}
        tabIndex={-1}
        className="mt-6 overflow-hidden rounded-xl border border-white/10"
      >
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">
            Comparison of ordinary secondhand trading and Repick AI matching — based on the {category.label} category;
            switching categories recalculates the values in real time
          </caption>
          <colgroup>
            <col className="w-[38%]" />
            <col className="w-[31%]" />
            <col className="w-[31%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th
                scope="col"
                className={cx(CAPTION, "px-2.5 py-2.5 font-semibold text-[#A1A1AA] sm:px-3")}
              >
                Criteria
              </th>
              <th
                scope="col"
                className={cx(CAPTION, "px-2.5 py-2.5 font-semibold text-[#A1A1AA] sm:px-3")}
              >
                Ordinary resale
              </th>
              <th
                scope="col"
                className={cx(CAPTION, "px-2.5 py-2.5 font-semibold text-[#a894f7] sm:px-3")}
              >
                Repick AI
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => {
              const rv = category.rows[i];
              const open = openRowId === row.id;
              const panelId = `row-panel-${row.id}`;
              const btnId = `row-trigger-${row.id}`;
              const Icon = row.icon;
              return (
                <Fragment key={row.id}>
                  <tr className="border-b border-white/5">
                    <td className="px-2.5 py-0 align-top sm:px-3">
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => toggleRow(row.id)}
                        className={ROW_TRIGGER}
                      >
                        <Icon
                          className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]"
                          aria-hidden
                        />
                        <span className="flex-1 break-keep text-[0.72rem] font-semibold text-white sm:text-[0.82rem]">
                          {row.label}
                        </span>
                        <ChevronDown
                          className={cx(
                            "h-3.5 w-3.5 shrink-0 text-[#A1A1AA] transition-transform duration-200 motion-reduce:transition-none",
                            open && "rotate-180 text-white",
                          )}
                          aria-hidden
                        />
                      </button>
                    </td>
                    <td
                      className="cursor-pointer px-2.5 py-3 align-top sm:px-3"
                      onClick={() => toggleRow(row.id)}
                    >
                      <motion.div
                        key={`${category.id}-general`}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <p
                          className={cx(
                            NUM,
                            "break-keep text-[0.72rem] font-semibold text-white/60 sm:text-[0.85rem]",
                          )}
                        >
                          {rv.general.value}
                        </p>
                        <p className="mt-0.5 break-keep text-[0.64rem] font-normal leading-[1.4] text-[#A1A1AA] sm:text-[0.7rem]">
                          {rv.general.sub}
                        </p>
                      </motion.div>
                    </td>
                    <td
                      className="cursor-pointer px-2.5 py-3 align-top sm:px-3"
                      onClick={() => toggleRow(row.id)}
                    >
                      <motion.div
                        key={`${category.id}-repick`}
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: EASE, delay: reduced ? 0 : 0.04 }}
                      >
                        <p
                          className={cx(
                            NUM,
                            "break-keep text-[0.72rem] font-extrabold text-white sm:text-[0.85rem]",
                          )}
                        >
                          {rv.repick.value}
                        </p>
                        <p className="mt-0.5 break-keep text-[0.64rem] font-normal leading-[1.4] text-[#a894f7] sm:text-[0.7rem]">
                          {rv.repick.sub}
                        </p>
                      </motion.div>
                    </td>
                  </tr>
                  <tr
                    id={panelId}
                    aria-labelledby={btnId}
                    className="border-b border-white/5 bg-[#0B0B0F]"
                  >
                    <td colSpan={3} className="p-0">
                      <div
                        className={cx(
                          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
                            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl border border-white/10 sm:h-auto sm:w-32">
                              <Image
                                src={category.image.src}
                                alt={category.image.alt}
                                fill
                                sizes="(min-width: 640px) 128px, 100vw"
                                className="object-cover"
                              />
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.66rem] font-semibold text-white backdrop-blur">
                                Grade {category.listing.grade}
                              </span>
                            </div>
                            <div className="flex flex-1 flex-col gap-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <p className={cx(CAPTION, "text-[#A1A1AA]")}>
                                    {category.listing.brand}
                                  </p>
                                  <h3 className="mt-0.5 text-[0.92rem] font-semibold leading-snug text-white">
                                    {category.listing.title}
                                  </h3>
                                </div>
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.72rem] font-semibold text-white">
                                  <span className={NUM}>AI match {category.listing.match}%</span>
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-white">
                                  <BadgeCheck
                                    className="h-3.5 w-3.5 text-[#6E56CF]"
                                    aria-hidden
                                  />
                                  {category.listing.seller}
                                </span>
                                <span className="text-[0.7rem] font-normal text-[#A1A1AA]">
                                  {category.listing.sellerMeta} ·{" "}
                                  {category.listing.gradeLabel}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span
                                  className={cx(
                                    NUM,
                                    "text-sm font-semibold text-white/40 line-through",
                                  )}
                                >
                                  {comma(category.listing.retail)} won
                                </span>
                                <span
                                  className={cx(NUM, "text-lg font-extrabold text-white")}
                                >
                                  {comma(category.listing.repick)} won
                                </span>
                                <span
                                  className={cx(
                                    NUM,
                                    "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white",
                                  )}
                                >
                                  -
                                  {Math.round(
                                    (1 -
                                      category.listing.repick /
                                        category.listing.retail) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>

                              <p className="mt-1 flex items-start gap-1.5 text-[0.76rem] font-normal leading-[1.5] text-[#A1A1AA]">
                                <ShieldCheck
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6E56CF]"
                                  aria-hidden
                                />
                                <span>
                                  <span className="font-semibold text-white">Evidence.</span>{" "}
                                  {rv.evidence}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <a href="#cta" className={cx(CTA_PRIMARY, "mt-6")}>
        Start matching in {category.label}
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </a>
    </div>
  );
}
