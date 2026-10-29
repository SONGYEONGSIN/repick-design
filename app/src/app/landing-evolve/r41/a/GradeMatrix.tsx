"use client";

import { useId, useRef } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import { Check, ShieldCheck } from "lucide-react";
import {
  CATEGORIES,
  CATEGORY_PHOTO,
  MATRIX,
  TIERS,
  type Category,
  type Tier,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0369a1]";

function Dots({ density }: { density: 1 | 2 | 3 | 4 | 5 }) {
  return (
    <span className="flex items-center gap-[3px]" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: i <= density ? "#0284c7" : "#e4e4e7" }}
        />
      ))}
    </span>
  );
}

function Chip({
  children,
  tone = "outline",
}: {
  children: React.ReactNode;
  tone?: "outline" | "filled";
}) {
  if (tone === "filled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-2.5 py-1 text-xs font-semibold text-white">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-semibold text-zinc-700">
      {children}
    </span>
  );
}

export default function GradeMatrix({
  selected,
  onSelect,
}: {
  selected: { tier: Tier; category: Category };
  onSelect: (tier: Tier, category: Category) => void;
}) {
  const liveId = useId();
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>(
    TIERS.map(() => CATEGORIES.map(() => null)),
  );

  function handleKeyDown(
    e: KeyboardEvent<HTMLButtonElement>,
    row: number,
    col: number,
  ) {
    let nr = row;
    let nc = col;
    if (e.key === "ArrowUp") nr = Math.max(0, row - 1);
    else if (e.key === "ArrowDown") nr = Math.min(TIERS.length - 1, row + 1);
    else if (e.key === "ArrowLeft") nc = Math.max(0, col - 1);
    else if (e.key === "ArrowRight") nc = Math.min(CATEGORIES.length - 1, col + 1);
    else return;
    e.preventDefault();
    cellRefs.current[nr]?.[nc]?.focus();
  }

  const cell = MATRIX[selected.tier][selected.category];
  const photo = CATEGORY_PHOTO[selected.category];

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-zinc-200">
        <table className="w-full min-w-[520px] border-collapse">
          <caption className="sr-only">
            Condition tier by category availability. Select one cell to load its
            best match and two closest alternatives below.
          </caption>
          <thead>
            <tr className="bg-zinc-50">
              <th scope="col" className="p-3 text-left align-bottom font-semibold">
                <span className="sr-only">Condition tier</span>
              </th>
              {CATEGORIES.map((cat) => (
                <th
                  key={cat}
                  scope="col"
                  className="p-3 text-left align-bottom text-xs font-semibold uppercase tracking-[0.16em] text-zinc-700"
                >
                  {cat}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier, rowIdx) => (
              <tr key={tier} className="border-t border-zinc-200">
                <th
                  scope="row"
                  className="p-3 text-left text-sm font-semibold text-zinc-800"
                >
                  {tier}
                </th>
                {CATEGORIES.map((cat, colIdx) => {
                  const c = MATRIX[tier][cat];
                  const isSelected =
                    selected.tier === tier && selected.category === cat;
                  return (
                    <td key={cat} className="p-1.5 sm:p-2">
                      <button
                        type="button"
                        ref={(el) => {
                          cellRefs.current[rowIdx][colIdx] = el;
                        }}
                        onClick={() => onSelect(tier, cat)}
                        onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                        aria-pressed={isSelected}
                        /*
                         * `relative` here is the fix for reassign-queue #16: the trailing
                         * sr-only span below is absolutely positioned (Tailwind `sr-only`),
                         * and this table lives inside an `overflow-x-auto` wrapper. Without a
                         * `position:relative` anchor on this button (the sr-only span's direct
                         * parent), that span's containing block skips the clipping ancestor and
                         * paints at unscrolled viewport coordinates, inflating
                         * `document.scrollWidth` at 390px (page-brief-core §2 "sr-only 앵커").
                         * Anchoring on the button itself (the nearest ancestor) fixes it without
                         * touching layout — `relative` with no offsets changes no visible pixel.
                         */
                        className={`relative flex min-h-16 w-full min-w-16 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2.5 transition-colors motion-reduce:transition-none ${FOCUS_RING} ${
                          isSelected
                            ? "border-sky-700 bg-sky-700 text-white"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-sky-600 hover:bg-sky-50"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Dots density={c.density} />
                        )}
                        <span className="text-sm font-extrabold tabular-nums">
                          {c.count}
                        </span>
                        {c.popular && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.08em] ${
                              isSelected
                                ? "bg-sky-900 text-white"
                                : "bg-sky-700 text-white"
                            }`}
                          >
                            Top pick
                          </span>
                        )}
                        {/* Visible text above ("168", "Top pick") is the accessible-name prefix by
                            DOM order; this sr-only span appends the remaining context without a
                            competing aria-label (label-content-name-mismatch precedent). */}
                        <span className="sr-only">
                          {" "}
                          — {tier} {cat} grid cell, {c.count} items available
                          {isSelected ? ", currently selected" : ""}.
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        id={liveId}
        aria-live="polite"
        className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]"
      >
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
                Best match for {selected.tier} · {selected.category}
              </p>
              <h3 className="mt-1 text-lg font-extrabold tracking-[-0.02em] text-zinc-950">
                {cell.best.name}
              </h3>
            </div>
            <Chip tone="filled">{cell.best.match}% match</Chip>
          </div>

          <div
            className="relative mt-4 overflow-hidden rounded-xl bg-zinc-100"
            style={{ aspectRatio: "4 / 3" }}
          >
            <Image
              src={`https://images.unsplash.com/photo-${photo.id}?auto=format&fit=crop&w=800&q=80`}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 420px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Chip>{selected.tier}</Chip>
            <Chip>
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {cell.best.seller}
            </Chip>
            <Chip>&minus;{cell.best.discount}% vs retail</Chip>
          </div>

          <p className="mt-4 text-2xl font-extrabold tabular-nums tracking-[-0.02em] text-zinc-950">
            ${cell.best.price}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-600">
            Also close in this cell
          </p>
          <ul className="mt-3 space-y-3">
            {cell.alts.map((alt) => (
              <li
                key={alt.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{alt.name}</p>
                  <p className="mt-0.5 text-xs font-normal text-zinc-600">
                    ${alt.price}
                  </p>
                </div>
                <span className="rounded-full border border-zinc-200 px-2 py-1 text-xs font-semibold text-zinc-700">
                  {alt.match}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
