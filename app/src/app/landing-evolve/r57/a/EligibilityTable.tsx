"use client";

import { useId, useState } from "react";
import { Check, X } from "lucide-react";
import type { Listing } from "./data";
import { CRITERIA, checksFor, formatUsd, isEligible } from "./model";
import { ACCENT, BORDER, FAIL, FG, FOCUS_RING, INK, MUTED } from "./tokens";

interface EligibilityTableProps {
  listings: Listing[];
  min: number;
  max: number;
}

/**
 * The route's required output form: a live boolean/discrete status grid, not a chart. Every cell
 * is recomputed from checksFor()/isEligible() on every render — nothing here is a drawn bar, dial
 * or plotted point. Semantic table: one <caption>, scope="col"/"row" on headers, table-fixed with
 * a percentage <colgroup> so the desktop layout never needs a horizontal scrollbar. Pass/fail is
 * never color-only — every cell pairs its color with a Check/X icon AND the word "Pass"/"Fail"
 * (or "In range"/"Out of range" for the budget column).
 */
export function EligibilityTable({ listings, min, max }: EligibilityTableProps) {
  const [onlyEligible, setOnlyEligible] = useState(false);
  const toggleId = useId();

  const rows = listings.map((listing) => ({
    listing,
    checks: checksFor(listing, min, max),
    eligible: isEligible(listing, min, max),
  }));
  const visibleRows = onlyEligible ? rows.filter((r) => r.eligible) : rows;
  const count = rows.filter((r) => r.eligible).length;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={toggleId} className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: FG }}>
          <input
            id={toggleId}
            type="checkbox"
            checked={onlyEligible}
            onChange={(e) => setOnlyEligible(e.target.checked)}
            className={`h-4 w-4 shrink-0 rounded border-2 accent-[#F97316] ${FOCUS_RING}`}
            style={{ borderColor: BORDER }}
          />
          Show only eligible
        </label>
        <p className="text-[12.5px] font-normal tabular-nums" style={{ color: MUTED }}>
          {count} of {listings.length} eligible at {formatUsd(min)}–{formatUsd(max)}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${BORDER}` }}>
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="px-4 py-3 text-left text-[13px] font-normal leading-[1.6]" style={{ color: MUTED }}>
            Live eligibility for all six fixed listings against your current price range. Each
            column except &ldquo;Within budget&rdquo; is fixed per listing and never changes as you
            drag the handles.
          </caption>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "18%" }} />
          </colgroup>
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              <th scope="col" className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                Listing
              </th>
              {CRITERIA.map((c) => (
                <th
                  key={c.id}
                  scope="col"
                  className="px-2 py-3 text-[11px] font-semibold uppercase leading-[1.3] tracking-[0.04em]"
                  style={{ color: MUTED }}
                >
                  {c.label}
                </th>
              ))}
              <th scope="col" className="px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: MUTED }}>
                Eligible
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td colSpan={CRITERIA.length + 2} className="px-4 py-6 text-center text-[13px] font-normal" style={{ color: MUTED }}>
                  No listing is eligible at this range yet — widen it above.
                </td>
              </tr>
            ) : null}
            {visibleRows.map(({ listing, checks, eligible }) => (
              <tr key={listing.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                <th scope="row" className="px-4 py-3 text-[13px] font-semibold" style={{ color: FG }}>
                  {listing.title}
                  <div className="mt-0.5 text-[11px] font-normal tabular-nums" style={{ color: MUTED }}>
                    {formatUsd(listing.price)}
                  </div>
                </th>
                {CRITERIA.map((c) => {
                  const passed = checks[c.id];
                  return (
                    <td key={c.id} className="px-2 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                        style={{ color: passed ? ACCENT : FAIL }}
                      >
                        {passed ? (
                          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        ) : (
                          <X className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        )}
                        {passed ? c.passVerb : c.failVerb}
                      </span>
                    </td>
                  );
                })}
                <td className="px-2 py-3">
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                    style={eligible ? { backgroundColor: ACCENT, color: INK } : { border: `1px solid ${BORDER}`, color: MUTED }}
                  >
                    {eligible ? <Check className="h-3 w-3" aria-hidden="true" /> : <X className="h-3 w-3" aria-hidden="true" />}
                    {eligible ? "Eligible" : "Not eligible"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
