"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  CAPTION,
  EYEBROW,
  FILTERS,
  FOCUS,
  LISTINGS,
  PRIORITIES,
  DEFAULT_ORDER,
  applyFilter,
  cx,
  discountOf,
  photoUrl,
  priorityLabel,
  rankBoard,
  type FilterId,
  type PriorityId,
  type RankedCard,
} from "./data";

const AUX = "text-zinc-400"; // dark auxiliary text floor (7.6:1 on BG)

function move(order: PriorityId[], from: number, to: number): PriorityId[] {
  if (to < 0 || to >= order.length) return order;
  const next = order.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export default function MatchBoard() {
  const [order, setOrder] = useState<PriorityId[]>(DEFAULT_ORDER);
  const [filter, setFilter] = useState<FilterId>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();

  const ranked = useMemo(() => rankBoard(order, LISTINGS), [order]);
  const cards = useMemo(() => applyFilter(ranked, filter), [ranked, filter]);
  const topLabel = priorityLabel(order[0]);

  return (
    <section id="board" className="border-b border-white/10 px-5 pb-20 pt-14 sm:px-8 lg:px-10 lg:pb-28 lg:pt-20">
      <div className="mx-auto max-w-[1180px]">
        {/* compact headline above the panes */}
        <div className="max-w-[640px]">
          <p className={cx(EYEBROW, "text-[#38bdf8]")}>Priority-ranked resale</p>
          <h1 className="mt-4 text-[clamp(2.1rem,7.5vw,2.7rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-white lg:text-[clamp(2.7rem,4.2vw,3.6rem)]">
            You rank what matters.
            <br />
            The board proves the order.
          </h1>
          {/* 500px ÷ (0.44 × 17px) = 66.8 chars/line ≤ 70 */}
          <p className={cx("mt-5 max-w-[500px] text-[17px] font-normal leading-[1.6]", AUX)}>
            Reorder your priorities and every listing re-ranks in real time — match score, condition
            grade, seller check and discount always in view, with one line saying why it placed here.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-8">
          {/* LEFT PANE — priority control */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className={cx(CAPTION, "text-white")}>Your priorities</h2>
                <span className={cx("text-[0.7rem] font-semibold", AUX)}>Top weighs most</span>
              </div>

              <ol className="mt-4 flex flex-col gap-2.5">
                {order.map((id, rank) => {
                  const priority = PRIORITIES.find((p) => p.id === id)!;
                  const Icon = priority.icon;
                  const isTop = rank === 0;
                  return (
                    <li key={id}>
                      <div
                        className={cx(
                          "flex items-center gap-3 rounded-2xl border p-3 sm:p-3.5",
                          isTop
                            ? "border-[#38bdf8]/40 bg-[#38bdf8]/[0.08]"
                            : "border-white/10 bg-white/[0.02]",
                        )}
                      >
                        <span
                          className={cx(
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.72rem] font-extrabold tabular-nums",
                            isTop ? "bg-[#0369a1] text-white" : "bg-white/10 text-zinc-400",
                          )}
                        >
                          {rank + 1}
                        </span>
                        <Icon
                          className={cx("h-[18px] w-[18px] shrink-0", isTop ? "text-[#38bdf8]" : AUX)}
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{priority.label}</p>
                          <p className={cx("truncate text-xs font-normal", AUX)}>{priority.gloss}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setOrder((o) => move(o, rank, rank - 1))}
                            disabled={rank === 0}
                            className={cx(
                              "flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border border-white/15 px-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-300",
                              FOCUS,
                            )}
                          >
                            <ChevronUp className="h-4 w-4" aria-hidden />
                            <span className="sr-only sm:not-sr-only">Up</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrder((o) => move(o, rank, rank + 1))}
                            disabled={rank === order.length - 1}
                            className={cx(
                              "flex h-8 min-w-8 items-center justify-center gap-1 rounded-lg border border-white/15 px-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-zinc-300",
                              FOCUS,
                            )}
                          >
                            <ChevronDown className="h-4 w-4" aria-hidden />
                            <span className="sr-only sm:not-sr-only">
                              Down<span className="sr-only"> — move {priority.label} lower</span>
                            </span>
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              <p className={cx("mt-4 text-xs font-normal leading-[1.6]", AUX)} aria-live="polite">
                Board ranked by{" "}
                <span className="font-semibold text-[#38bdf8]">{topLabel.toLowerCase()}</span> first.
                Reordering re-weights every card.
              </p>
            </div>
          </div>

          {/* RIGHT PANE — live match board */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className={cx(CAPTION, "text-white")}>
                Live match board
                <span className={cx("ml-2 font-semibold tabular-nums", AUX)}>
                  {cards.length} shown
                </span>
              </p>
              <div role="group" aria-label="Filter the board" className="flex flex-wrap gap-1.5">
                {FILTERS.map((f) => {
                  const active = f.id === filter;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(f.id)}
                      className={cx(
                        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold transition-colors",
                        active
                          ? "border-[#0369a1] bg-[#0369a1] text-white"
                          : "border-white/15 text-zinc-300 hover:text-white",
                        FOCUS,
                      )}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <ul className="mt-5 flex flex-col gap-3">
              {cards.map((card) => (
                <motion.li
                  key={card.listing.id}
                  layout={prefersReduced ? false : "position"}
                  transition={prefersReduced ? { duration: 0 } : { duration: 0.4, ease: "easeOut" }}
                >
                  <BoardCard
                    card={card}
                    topLabel={topLabel}
                    expanded={expandedId === card.listing.id}
                    onToggle={() =>
                      setExpandedId((cur) => (cur === card.listing.id ? null : card.listing.id))
                    }
                  />
                </motion.li>
              ))}
              {cards.length === 0 ? (
                <li className={cx("rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-sm font-normal", AUX)}>
                  No listings match this filter right now.
                </li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function BoardCard({
  card,
  topLabel,
  expanded,
  onToggle,
}: {
  card: RankedCard;
  topLabel: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { listing, match, reason } = card;
  const discount = discountOf(listing);
  const panelId = `explain-${listing.id}`;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex gap-4">
        {/* reserved photo container — fixed aspect, background color, proof lives OUTSIDE it */}
        <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-900 sm:w-28">
          <Image
            src={photoUrl(listing.photoId, 220)}
            alt={listing.alt}
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-white">{listing.title}</p>
              <p className={cx("truncate text-xs font-normal", AUX)}>{listing.brand}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xl font-extrabold tabular-nums leading-none text-white">
                {match}
                <span className="text-sm font-semibold text-[#38bdf8]">%</span>
              </p>
              <p className={cx("mt-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.1em]", AUX)}>
                match
              </p>
            </div>
          </div>

          {/* price row: before → after + discount */}
          <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 tabular-nums">
            <span className="text-lg font-extrabold text-white">${listing.price}</span>
            <span className={cx("text-sm font-normal line-through", AUX)}>${listing.originalPrice}</span>
            <span className="rounded-full bg-[#0369a1] px-2 py-0.5 text-[0.7rem] font-semibold text-white">
              −{discount}%
            </span>
          </div>

          {/* proof badges — separate row, never overlaid on the photo */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
            <span className="inline-flex items-center rounded-full border border-white/15 px-2 py-0.5 font-semibold text-zinc-300">
              Grade {listing.grade}
            </span>
            {listing.verified ? (
              <span className="inline-flex items-center gap-1 font-normal text-zinc-300">
                <ShieldCheck className="h-3.5 w-3.5 text-[#38bdf8]" aria-hidden />
                Verified seller
              </span>
            ) : (
              <span className={cx("inline-flex items-center gap-1 font-normal", AUX)}>
                <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                Seller verifying
              </span>
            )}
            <span className={cx("font-normal", AUX)}>{listing.shipLabel}</span>
          </div>
        </div>
      </div>

      {/* reasoning line — cites the current top priority, updates on every reorder */}
      <p className="mt-3 border-t border-white/10 pt-3 text-[13px] font-normal leading-[1.5] text-zinc-300">
        <span className="font-semibold text-[#38bdf8]">Ranked for {topLabel.toLowerCase()}:</span>{" "}
        {reason}
      </p>

      {/* explain expander — ADDS detail, never gates the always-shown proof above */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className={cx(
          "mt-3 inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-zinc-300 transition-colors hover:text-white",
          FOCUS,
        )}
      >
        {expanded ? <Minus className="h-3.5 w-3.5" aria-hidden /> : <Plus className="h-3.5 w-3.5" aria-hidden />}
        {expanded ? "Hide the full read" : "Explain this match"}
      </button>

      {expanded ? (
        <ul id={panelId} className="mt-3 flex flex-col gap-1.5 text-xs font-normal text-zinc-300">
          {listing.explain.map((line) => (
            <li key={line} className="flex gap-2">
              <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#38bdf8]" aria-hidden />
              <span className="leading-[1.5]">{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
