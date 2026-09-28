"use client";

import { TrendingUp, Info } from "lucide-react";
import {
  GRADES,
  AGE_BRACKETS,
  PRICE_MATRIX,
  PERCENTILE_MATRIX,
  REFERENCE_ITEM,
} from "./data";

const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2410c]";

const INK = "#1c1917";
const ACCENT = "#ea580c";

/** Quantize retention % into a fixed heat tier so the grid's colour reads as "price level",
 *  independent of which cell is currently selected. */
function tierColor(pct: number): string {
  if (pct >= 85) return "#fdba74"; // orange-300
  if (pct >= 70) return "#fed7aa"; // orange-200
  if (pct >= 55) return "#ffedd5"; // orange-100
  if (pct >= 40) return "#fff7ed"; // orange-50
  return "#fafaf9"; // stone-50
}

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Blend a tier colour toward white by `t` (0 = full tier colour, 1 = white). Used to fade
 *  cells the further they sit from the live selected cell, producing the spotlight gradient. */
function fadeToWhite(hex: string, t: number): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => Math.round(c * (1 - t) + 255 * t);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}

function fadeForDistance(distance: number): number {
  if (distance <= 1) return 0;
  if (distance === 2) return 0.45;
  if (distance === 3) return 0.75;
  return 0.9;
}

type PriceMatrixProps = {
  gradeIndex: number;
  ageIndex: number;
  onGradeChange: (index: number) => void;
  onAgeChange: (index: number) => void;
};

export default function PriceMatrix({
  gradeIndex,
  ageIndex,
  onGradeChange,
  onAgeChange,
}: PriceMatrixProps) {
  const retention = PRICE_MATRIX[gradeIndex][ageIndex];
  const percentile = PERCENTILE_MATRIX[gradeIndex][ageIndex];
  const price = Math.round((REFERENCE_ITEM.msrp * retention) / 100);

  return (
    <div className="grid gap-10">
      {/* Controls */}
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-6">
        <div>
          <span
            id="grade-control-label"
            className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57534e]"
          >
            Condition grade
          </span>
          <div
            role="group"
            aria-labelledby="grade-control-label"
            className="mt-3 inline-flex flex-wrap gap-2"
          >
            {GRADES.map((grade, i) => {
              const active = i === gradeIndex;
              return (
                <button
                  key={grade.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onGradeChange(i)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                    active
                      ? "border-[#1c1917] bg-[#1c1917] text-white"
                      : "border-[#d6d3d1] bg-white text-[#1c1917] hover:border-[#78716c]"
                  }`}
                >
                  {grade.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-[#57534e]">{GRADES[gradeIndex].hint}</p>
        </div>

        <div>
          <label
            htmlFor="age-slider"
            className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57534e]"
          >
            Years since release
          </label>
          <input
            id="age-slider"
            type="range"
            min={0}
            max={4}
            step={1}
            value={ageIndex}
            onChange={(e) => onAgeChange(Number(e.target.value))}
            aria-valuetext={AGE_BRACKETS[ageIndex].label}
            className={`mt-4 h-2 w-full max-w-sm cursor-pointer appearance-none rounded-full bg-[#e7e5e4] accent-[#ea580c] ${FOCUS_RING}`}
          />
          <div className="mt-2 flex max-w-sm justify-between text-xs text-[#57534e]">
            {AGE_BRACKETS.map((bracket, i) => (
              <span
                key={bracket.short}
                className={
                  i === ageIndex
                    ? "font-semibold text-[#c2410c]"
                    : "font-normal text-[#57534e]"
                }
              >
                {bracket.short}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Readout + grid */}
      <div className="grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-6" aria-live="polite">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#57534e]">
            Fair price estimate
          </p>
          <p className="mt-3 text-5xl font-extrabold tracking-[0.12em] tabular-nums text-[#1c1917]">
            ${price.toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-sm text-[#57534e]">
            {GRADES[gradeIndex].label} &middot; {AGE_BRACKETS[ageIndex].label}
          </p>

          <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#fff7ed] px-3 py-3">
            <TrendingUp
              className="mt-0.5 h-4 w-4 flex-none text-[#c2410c]"
              aria-hidden="true"
              strokeWidth={2}
            />
            <p className="text-sm text-[#1c1917]">
              Priced ahead of{" "}
              <span className="font-semibold tabular-nums">{percentile}%</span> of comparable
              active listings at this grade and age.
            </p>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-[#57534e]">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" strokeWidth={2} />
            <p>
              Based on a ${REFERENCE_ITEM.msrp.toLocaleString("en-US")} reference body (
              {REFERENCE_ITEM.name}) &mdash; {retention}% retention.
            </p>
          </div>
        </div>

        <div
          tabIndex={0}
          role="region"
          aria-label="Fair price matrix table, scrollable"
          className={`overflow-x-auto rounded-2xl border border-[#e7e5e4] ${FOCUS_RING}`}
        >
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <caption className="border-b border-[#e7e5e4] px-5 py-3 text-left text-sm text-[#57534e]">
              Estimated resale retention (% of MSRP) by condition grade and years since release.
              Highlighted cell reflects the controls above.
            </caption>
            <thead>
              <tr>
                <th
                  scope="col"
                  className="w-32 border-b border-[#e7e5e4] bg-[#fafaf9] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-[#57534e]"
                >
                  Grade
                </th>
                {AGE_BRACKETS.map((bracket, c) => (
                  <th
                    key={bracket.short}
                    scope="col"
                    className={`border-b border-[#e7e5e4] bg-[#fafaf9] px-4 py-3 text-right text-xs font-semibold uppercase tracking-[0.16em] ${
                      c === ageIndex ? "text-[#c2410c]" : "text-[#57534e]"
                    }`}
                  >
                    {bracket.short}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRADES.map((grade, r) => (
                <tr key={grade.label}>
                  <th
                    scope="row"
                    className={`border-b border-[#e7e5e4] px-4 py-3 text-left text-sm font-semibold ${
                      r === gradeIndex ? "text-[#c2410c]" : "text-[#1c1917]"
                    }`}
                  >
                    {grade.label}
                  </th>
                  {AGE_BRACKETS.map((bracket, c) => {
                    const pct = PRICE_MATRIX[r][c];
                    const distance = Math.max(Math.abs(r - gradeIndex), Math.abs(c - ageIndex));
                    const selected = distance === 0;
                    const bg = selected
                      ? ACCENT
                      : fadeToWhite(tierColor(pct), fadeForDistance(distance));
                    return (
                      <td
                        key={bracket.short}
                        className="border-b border-[#e7e5e4] p-0 text-right"
                      >
                        <div
                          style={{ backgroundColor: bg }}
                          className="flex items-center justify-end gap-1.5 px-4 py-3"
                        >
                          {selected && (
                            <span className="sr-only">Currently selected: </span>
                          )}
                          <span
                            style={{ color: INK }}
                            className={`tabular-nums ${
                              selected ? "text-base font-extrabold" : "text-sm font-normal"
                            }`}
                          >
                            {pct}%
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
