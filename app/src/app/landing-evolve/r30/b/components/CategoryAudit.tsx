"use client";

import { useId, useState } from "react";
import {
  CATEGORIES,
  TIERS,
  formatUnits,
  getCategory,
  type TierId,
} from "./data";

// Width scale for the detail column: a fixed reference ceiling, not the live maximum, so the
// mapping stays stable even if a future category's share changed. 40% is comfortably above the
// current leader (Sneakers, 32.4%), leaving headroom instead of ever rendering a full-width bar.
const WIDTH_SCALE_MAX = 40;

const TIER_FILL: Record<TierId, string> = {
  pro: "bg-teal-700",
  id: "bg-teal-400",
  new: "bg-teal-200",
};

const TIER_TEXT: Record<TierId, string> = {
  pro: "text-white",
  id: "text-[#0B0B0F]",
  new: "text-[#0B0B0F]",
};

const TIER_SWATCH: Record<TierId, string> = {
  pro: "bg-teal-700",
  id: "bg-teal-400",
  new: "bg-teal-200",
};

interface CategoryAuditProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function CategoryAudit({ selected, onSelect }: CategoryAuditProps) {
  const [tableOpen, setTableOpen] = useState(false);
  const tableId = useId();
  const current = getCategory(selected);
  const widthPct = Math.min(100, (current.share / WIDTH_SCALE_MAX) * 100);

  return (
    <div>
      {/* Shared legend — pairs every fill with its name, shown once but persistently alongside
          both chart elements below, so color is never the only signal for a tier. */}
      <ul
        aria-label="Trust tier legend"
        className="mb-6 flex flex-wrap gap-x-6 gap-y-2"
      >
        {TIERS.map((tier) => (
          <li key={tier.id} className="flex items-center gap-2 text-sm text-zinc-300">
            <span
              aria-hidden="true"
              className={`h-3 w-3 shrink-0 rounded-sm ${TIER_SWATCH[tier.id]}`}
            />
            <span className="font-semibold text-zinc-100">{tier.label}</span>
            <span className="text-zinc-400">— {tier.requirement}</span>
          </li>
        ))}
      </ul>

      {/* Selector + always-on comparison row. Every category's real share and tier mix is drawn
          here simultaneously — this is the "side-by-side audit," not a staged example — and
          clicking a column is how you pick which one zooms into the detail view below. */}

      {/* Desktop / tablet: true Marimekko row, column widths = literal share of inventory. */}
      <div
        role="group"
        aria-label="Select a category to audit"
        className="hidden items-stretch gap-1 sm:flex"
      >
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selected;
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(cat.id)}
              style={{ flex: `${cat.share} 0 0%` }}
              className={`group min-w-0 rounded-md border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 ${
                isSelected
                  ? "border-teal-300 bg-zinc-900"
                  : "border-zinc-800 bg-zinc-950 hover:border-zinc-600"
              }`}
            >
              <div className="flex h-28 flex-col overflow-hidden rounded-t-[5px]">
                <div
                  style={{ height: `${cat.tierShare.pro}%` }}
                  className={`${TIER_FILL.pro} ${isSelected ? "" : "opacity-80"}`}
                />
                <div
                  style={{ height: `${cat.tierShare.id}%` }}
                  className={`${TIER_FILL.id} ${isSelected ? "" : "opacity-80"}`}
                />
                <div
                  style={{ height: `${cat.tierShare.new}%` }}
                  className={`${TIER_FILL.new} ${isSelected ? "" : "opacity-80"}`}
                />
              </div>
              <div className="px-2 py-2">
                <p
                  className={`truncate text-[13px] font-semibold ${
                    isSelected ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {cat.label}
                </p>
                <p className="text-xs text-zinc-400">
                  {cat.share}%
                  <span className="sr-only">
                    {" "}
                    of inventory. Verified Pro {cat.tierShare.pro}%, ID-Verified{" "}
                    {cat.tierShare.id}%, New Seller {cat.tierShare.new}%.
                  </span>
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile: same data, a list layout so tap targets and labels stay legible under ~400px.
          Bar length is each category's share relative to the fixed 40% reference scale, same
          mapping the detail column below uses, so the two stay numerically consistent. */}
      <div role="group" aria-label="Select a category to audit" className="flex flex-col gap-2 sm:hidden">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === selected;
          const barPct = Math.min(100, (cat.share / WIDTH_SCALE_MAX) * 100);
          return (
            <button
              key={cat.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(cat.id)}
              className={`flex min-w-0 items-center gap-3 rounded-md border px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 ${
                isSelected
                  ? "border-teal-300 bg-zinc-900"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <span className={`w-20 shrink-0 truncate text-sm font-semibold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                {cat.label}
              </span>
              <span className="relative h-3 min-w-0 flex-1 overflow-hidden rounded-sm bg-zinc-800">
                <span
                  style={{ width: `${barPct}%` }}
                  className="absolute inset-y-0 left-0 bg-teal-500"
                />
              </span>
              <span className="w-12 shrink-0 text-right text-xs text-zinc-400">
                {cat.share}%
                <span className="sr-only">
                  {" "}
                  of inventory. Verified Pro {cat.tierShare.pro}%, ID-Verified {cat.tierShare.id}%,
                  New Seller {cat.tierShare.new}%.
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail recompute: a single zoomed column for the SELECTED category only. Width is its
          share mapped against the fixed 0–40% scale below; the three internal bands are its real
          Pro / ID-Verified / New Seller percentages. Every number here changes when the selector
          above is clicked — this panel is the live recompute, not an illustration. */}
      <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
        <div className="min-w-0">
          <p className="mb-3 text-sm text-zinc-400">
            <span className="font-semibold text-zinc-100">{current.label}</span> — {current.share}% of all
            marketplace inventory, {formatUnits(current.volume)} live listings
          </p>

          <div className="flex h-64 items-end sm:h-80">
            <div
              style={{ width: `${widthPct}%` }}
              className="flex h-full min-w-[72px] flex-col overflow-hidden rounded-t-md border border-zinc-700"
            >
              {(["pro", "id", "new"] as TierId[]).map((tierId) => {
                const pct = current.tierShare[tierId];
                const tier = TIERS.find((t) => t.id === tierId)!;
                const showLabel = pct >= 12;
                return (
                  <div
                    key={tierId}
                    style={{ height: `${pct}%` }}
                    className={`flex items-center justify-center ${TIER_FILL[tierId]}`}
                  >
                    {showLabel && (
                      <span className={`px-1 text-center text-xs font-semibold tracking-tight ${TIER_TEXT[tierId]}`}>
                        {tier.short} {pct}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Width-axis scale, read left to right under the column. */}
          <div className="mt-2 flex justify-between text-[11px] tracking-[0.04em] text-zinc-400">
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
            <span>40% of inventory</span>
          </div>
        </div>

        {/* Readout — exact figures for the selected category, independent of band pixel size. */}
        <dl className="min-w-0 space-y-3 border-t border-zinc-800 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
          {(["pro", "id", "new"] as TierId[]).map((tierId) => {
            const tier = TIERS.find((t) => t.id === tierId)!;
            return (
              <div key={tierId} className="flex items-start gap-2">
                <dt className="flex min-w-0 items-start gap-2 text-sm font-semibold text-zinc-100">
                  <span aria-hidden="true" className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${TIER_SWATCH[tierId]}`} />
                  <span>
                    {tier.label} <span className="text-zinc-400">· {current.tierShare[tierId]}%</span>
                  </span>
                </dt>
                <dd className="text-xs text-zinc-400">{formatUnits(current.tierVolume[tierId])} listings</dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Full side-by-side table — every category, same columns, so the audit claim is checkable
          at a glance rather than taken on faith. */}
      <div className="mt-8">
        <button
          type="button"
          aria-expanded={tableOpen}
          aria-controls={tableId}
          onClick={() => setTableOpen((v) => !v)}
          className="text-sm font-semibold text-teal-300 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
        >
          {tableOpen ? "Hide the full breakdown table" : "View the full breakdown table"}
        </button>

        <div
          id={tableId}
          hidden={!tableOpen}
          className="mt-4 w-full overflow-hidden rounded-md border border-zinc-800"
        >
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <caption className="sr-only">
              Inventory share and trust-tier mix for every category on Repick
            </caption>
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                <th scope="col" className="w-[26%] px-3 py-2 font-semibold text-zinc-200">
                  Category
                </th>
                <th scope="col" className="w-[18%] px-3 py-2 font-semibold text-zinc-200">
                  Share
                </th>
                <th scope="col" className="w-[18%] px-3 py-2 font-semibold text-zinc-200">
                  Verified Pro
                </th>
                <th scope="col" className="w-[19%] px-3 py-2 font-semibold text-zinc-200">
                  ID-Verified
                </th>
                <th scope="col" className="w-[19%] px-3 py-2 font-semibold text-zinc-200">
                  New Seller
                </th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => (
                <tr
                  key={cat.id}
                  className={`border-b border-zinc-800/60 last:border-b-0 ${
                    cat.id === selected ? "bg-zinc-900/70" : ""
                  }`}
                >
                  <th scope="row" className="truncate px-3 py-2 font-semibold text-zinc-100">
                    {cat.label}
                  </th>
                  <td className="px-3 py-2 text-zinc-300">{cat.share}%</td>
                  <td className="px-3 py-2 text-zinc-300">{cat.tierShare.pro}%</td>
                  <td className="px-3 py-2 text-zinc-300">{cat.tierShare.id}%</td>
                  <td className="px-3 py-2 text-zinc-300">{cat.tierShare.new}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
