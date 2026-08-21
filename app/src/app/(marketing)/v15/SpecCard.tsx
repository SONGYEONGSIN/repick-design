"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import {
  CAPTION,
  MONO,
  NUM,
  RING_C,
  RING_R,
  SPARK_H,
  SPARK_W,
  comma,
  cx,
  ringOffset,
  sparkGeometry,
  type SpecItem,
} from "./data";

/**
 * One spec-sheet listing card. Every proof value is real text at rest — the
 * budget slider and priority control only refresh them. Three surfaces move on
 * a single budget drag: the match ring (`match`), the card's grid rank (handled
 * by the parent), and the "fits your budget" marker on the sparkline below.
 */
export default function SpecCard({
  item,
  budget,
  match,
  fits,
  rank,
}: {
  item: SpecItem;
  budget: number;
  match: number;
  fits: boolean;
  rank: number;
}) {
  const g = sparkGeometry(item, budget);
  const dashOffset = ringOffset(match);
  const overBy = item.price - budget;

  return (
    <article
      className={cx(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white",
        fits ? "border-zinc-200" : "border-zinc-200/70",
      )}
    >
      {/* reserved photo container — proof never overlaid on it */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 100vw"
          className={cx("object-cover", !fits && "opacity-80")}
        />
        <span
          className={cx(
            "absolute left-2.5 top-2.5 rounded bg-white/90 px-1.5 py-0.5 text-[0.62rem] font-semibold text-zinc-600 backdrop-blur-sm",
            NUM,
          )}
        >
          #{rank}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* title block + match ring */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={cx(CAPTION, "text-zinc-500")}>{item.brand}</p>
            <h3 className="mt-1 text-[0.95rem] font-semibold leading-snug text-zinc-950">
              {item.title}
            </h3>
          </div>
          <div className="relative shrink-0" aria-hidden>
            <svg width="46" height="46" viewBox="0 0 46 46" className="-rotate-90">
              <circle cx="23" cy="23" r={RING_R} fill="none" stroke="#e4e4e7" strokeWidth="4" />
              <circle
                cx="23"
                cy="23"
                r={RING_R}
                fill="none"
                stroke="#047857"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <span
              className={cx(
                "absolute inset-0 flex items-center justify-center text-[0.72rem] font-semibold text-zinc-950",
                NUM,
              )}
              style={MONO}
            >
              {match}
            </span>
          </div>
        </div>
        <p className="sr-only">{match}% match to your profile</p>

        {/* proof data row — grade / verification / discount, all text */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cx(
              "rounded border border-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-emerald-700",
              NUM,
            )}
          >
            Grade {item.grade} · {item.cond}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-semibold text-zinc-600">
            <BadgeCheck className="h-3 w-3 text-emerald-700" aria-hidden />
            {item.seller}
          </span>
          <span
            className={cx(
              "ml-auto rounded bg-emerald-700 px-1.5 py-0.5 text-[0.65rem] font-semibold text-white",
              NUM,
            )}
          >
            -{item.discount}%
          </span>
        </div>

        {/* price-trajectory sparkline — the discount rendered AS a line */}
        <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-2.5">
          <div className="flex items-center justify-between">
            <span className={cx(CAPTION, "text-zinc-600")}>Price history</span>
            <span className={cx("text-[0.65rem] font-semibold text-zinc-600", NUM)}>
              ${comma(item.original)} <span className="text-zinc-500">&rarr;</span> ${comma(item.price)}
            </span>
          </div>
          <svg
            className="mt-1.5 w-full"
            viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Price dropped from $${item.original} to $${item.price}, ${item.discount} percent off. Your $${budget} budget marker ${fits ? "sits within" : "sits below"} this listing's history.`}
          >
            {/* budget guide line */}
            <line
              x1="0"
              y1={g.budgetY}
              x2={SPARK_W}
              y2={g.budgetY}
              stroke={fits ? "#047857" : "#a1a1aa"}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.7"
            />
            {/* trajectory */}
            <polyline
              points={g.points}
              fill="none"
              stroke="#18181b"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* budget marker */}
            <circle cx={g.markerX} cy={g.markerY} r="3.2" fill={fits ? "#047857" : "#71717a"} />
            <circle cx={g.markerX} cy={g.markerY} r="6" fill="none" stroke={fits ? "#047857" : "#71717a"} strokeWidth="1" opacity="0.4" />
          </svg>
          <p
            className={cx(
              "mt-1.5 text-[0.66rem] font-semibold",
              fits ? "text-emerald-700" : "text-zinc-600",
            )}
          >
            {fits ? `Fits your $${comma(budget)} budget` : `$${comma(overBy)} over your budget`}
          </p>
        </div>

        {/* price row */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className={cx("text-lg font-extrabold text-zinc-950", NUM)} style={MONO}>
            ${comma(item.price)}
          </span>
          <span className={cx("text-[0.72rem] font-normal text-zinc-500 line-through", NUM)}>
            ${comma(item.original)}
          </span>
          <span className={cx("ml-auto text-[0.72rem] font-semibold text-zinc-600", NUM)}>
            {item.category}
          </span>
        </div>
      </div>
    </article>
  );
}
