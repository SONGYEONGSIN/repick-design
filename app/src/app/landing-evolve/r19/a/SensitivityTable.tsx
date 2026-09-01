"use client";

import { Check, Minus } from "lucide-react";
import { Folio } from "./ui";
import { COLOR, DISPLAY_FONT, TRACK, W } from "./tokens";
import { sensitivityRows, WINDOWS, type RigorId, type WindowId } from "./data";
import Reveal from "./Reveal";

// A real, semantic comparison table — every row is the SAME `deriveVerdict` function the hero
// card uses, run for the three rigor tiers at whatever comparables window is currently selected.
// Change the window in the hero and this whole table re-derives; the current rigor row is
// highlighted with a border + an explicit "Selected" cell, never color alone.
export default function SensitivityTable({
  rigorId,
  windowId,
}: {
  rigorId: RigorId;
  windowId: WindowId;
}) {
  const rows = sensitivityRows(windowId);
  const win = WINDOWS.find((w) => w.id === windowId) ?? WINDOWS[1];

  return (
    <section id="sensitivity" className="mx-auto max-w-[1600px] px-5 sm:px-8 py-14 sm:py-20">
      <Reveal>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h2
                className={`${W.heavy} text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] leading-[1.05]`}
                style={{ color: COLOR.ink, letterSpacing: "-0.02em", fontFamily: DISPLAY_FONT }}
              >
                Exhibit B — assumption sensitivity
              </h2>
              <Folio n={2} of={6} />
            </div>
            <p className={`${W.body} mt-4 text-[15px] leading-[1.6] max-w-[440px]`} style={{ color: COLOR.ink }}>
              How Case File 2291&apos;s verdict moves if inspection rigor changes, holding the{" "}
              {win.short} comparables window fixed. This is the same calculation the dossier card
              runs above — just laid out as a table instead of a single answer.
            </p>
          </div>

          <div className="lg:col-span-8 min-w-0">
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed border-collapse min-w-[560px]">
                <caption
                  className={`${W.body} text-left text-[12px] mb-3`}
                  style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
                >
                  Table 1 — Confidence and recommended price by inspection rigor, at the {win.short}{" "}
                  window ({win.comps} comparables found).
                </caption>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLOR.ink}33` }}>
                    <th
                      scope="col"
                      className={`${W.label} py-2.5 text-left text-[11px] uppercase w-[26%]`}
                      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
                    >
                      Rigor
                    </th>
                    <th
                      scope="col"
                      className={`${W.label} py-2.5 text-left text-[11px] uppercase w-[20%]`}
                      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
                    >
                      Checks
                    </th>
                    <th
                      scope="col"
                      className={`${W.label} py-2.5 text-left text-[11px] uppercase w-[22%]`}
                      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
                    >
                      Confidence
                    </th>
                    <th
                      scope="col"
                      className={`${W.label} py-2.5 text-left text-[11px] uppercase w-[22%]`}
                      style={{ color: COLOR.mutedOnBg, letterSpacing: TRACK.caption }}
                    >
                      Recommended price
                    </th>
                    <th scope="col" className="relative w-[10%]">
                      {/* `relative` here, not on the sr-only span itself: the span stays
                          `position:absolute`, but this th is now its positioned ancestor, so it
                          can't escape the `overflow-x-auto` wrapper's clip and inflate
                          `document.scrollWidth` on mobile. */}
                      <span className="sr-only">Currently selected</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ rigor, verdict }) => {
                    const isSelected = rigor.id === rigorId;
                    return (
                      <tr
                        key={rigor.id}
                        style={{
                          borderBottom: `1px solid ${COLOR.ink}1F`,
                          borderLeft: isSelected ? `3px solid ${COLOR.accent}` : "3px solid transparent",
                          background: isSelected ? COLOR.surface : "transparent",
                        }}
                      >
                        <th scope="row" className={`${W.label} py-3 pl-3 text-left text-[14px]`} style={{ color: COLOR.ink }}>
                          {rigor.label}
                        </th>
                        <td className={`${W.body} py-3 text-[14px] tabular-nums`} style={{ color: COLOR.ink }}>
                          {verdict.checksPassed}/{verdict.checksTotal}
                        </td>
                        <td className={`${W.heavy} py-3 text-[14px] tabular-nums`} style={{ color: COLOR.ink }}>
                          {verdict.confidence}%
                        </td>
                        <td className={`${W.body} py-3 text-[14px] tabular-nums`} style={{ color: COLOR.ink }}>
                          ${verdict.recommendedPrice.toLocaleString("en-US")}
                        </td>
                        <td className="py-3 pr-3">
                          {isSelected ? (
                            <span
                              className={`${W.label} inline-flex items-center gap-1 text-[11px]`}
                              style={{ color: COLOR.accentDark, letterSpacing: TRACK.caption }}
                            >
                              <Check className="size-3.5 shrink-0" aria-hidden="true" />
                              Selected
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[11px]" style={{ color: COLOR.mutedOnBg }}>
                              <Minus className="size-3.5 shrink-0" aria-hidden="true" />
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
