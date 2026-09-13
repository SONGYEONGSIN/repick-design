"use client";

import { CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { ACCENT, ACCENT_BRIGHT } from "./Hero";
import { INTENSITIES, PERIODS, METRICS, WHY_ITEMS } from "./data";
import type { Intensity, Period } from "./data";

export function ExhibitB({
  intensity,
  period,
  onSelect,
}: {
  intensity: Intensity;
  period: Period;
  onSelect: (intensity: Intensity, period: Period) => void;
}) {
  return (
    <section id="exhibit-b" className="border-b border-[#1C1C22] bg-[#0B0B0F] px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <Reveal className="max-w-[492px]">
          <p className="text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.28em" }}>
            Fig. 03 — Sensitivity ledger
          </p>
          <h2
            className="mt-4 text-white"
            style={{ fontFamily: "var(--font-display-grotesk)", fontWeight: 800, letterSpacing: "-0.02em", fontSize: "clamp(1.75rem, 1.4vw + 1.5rem, 2.75rem)" }}
          >
            Exhibit B: nine outcomes, one formula.
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-[1.6] text-[#A1A1AA]">
            Every intensity-and-window combination is fixed in advance. Select any cell to load
            that combination into the case file — the same numbers you saw above.
          </p>
        </Reveal>

        {/* Mobile-only horizontal scroll: the wrapper only scrolls when the table's own min-width
            exceeds the viewport (390px), never on desktop where the column is already wider than
            that floor. The min-width lives on the <table> element itself, not on individual cells —
            constraining a <td> instead leaves table-fixed free to compress cells into overlapping
            text at 390px, which is what failed this same archetype last round. */}
        <Reveal delay={0.1} className="mt-8 overflow-x-auto rounded-2xl border border-[#1C1C22]">
          <table className="w-full min-w-[500px] table-fixed border-collapse text-left">
            <caption className="border-b border-[#1C1C22] bg-[#111116] px-4 py-3 text-left text-[12px] font-normal leading-[1.6] text-[#A1A1AA]">
              Confidence score (%) by inspection intensity and comparison period. Sub-line shows
              recommended price and days-to-sell for that combination. The highlighted cell matches
              your current selection above.
            </caption>
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "24%" }} />
            </colgroup>
            <thead>
              <tr className="bg-[#111116]">
                <th scope="col" className="whitespace-normal px-3 py-3 text-[11px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.12em" }}>
                  Intensity
                </th>
                {PERIODS.map((p) => (
                  <th
                    key={p.id}
                    scope="col"
                    className="whitespace-normal px-3 py-3 text-[11px] font-semibold uppercase text-[#A1A1AA]"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    {p.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INTENSITIES.map((row, ri) => (
                <tr key={row.id} className={ri > 0 ? "border-t border-[#1C1C22]" : undefined}>
                  <th scope="row" className="whitespace-normal px-3 py-3 align-top text-[13px] font-semibold text-white">
                    {row.label}
                  </th>
                  {PERIODS.map((col) => {
                    const cell = METRICS[row.id][col.id];
                    const selected = row.id === intensity && col.id === period;
                    return (
                      <td key={col.id} className="whitespace-normal p-0 align-top">
                        <button
                          type="button"
                          onClick={() => onSelect(row.id, col.id)}
                          aria-pressed={selected}
                          className="flex w-full flex-col items-start gap-1 px-3 py-3 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          style={{
                            backgroundColor: selected ? "rgba(214,51,108,0.14)" : "transparent",
                            borderLeft: selected ? `2px solid ${ACCENT}` : "2px solid transparent",
                            outlineColor: ACCENT_BRIGHT,
                          }}
                        >
                          <span className="sr-only">
                            {row.label}, {col.label}:{" "}
                          </span>
                          <span className="text-[15px] font-semibold tabular-nums leading-none text-white">{cell.confidence}%</span>
                          <span className="text-[11px] font-normal tabular-nums leading-snug text-[#A1A1AA]">
                            ${cell.price} &middot; {cell.days}d
                          </span>
                          {selected && (
                            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold uppercase" style={{ color: ACCENT_BRIGHT, letterSpacing: "0.12em" }}>
                              <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                              Current
                            </span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal delay={0.15}>
          <h3 className="mt-12 text-[13px] font-semibold uppercase text-[#A1A1AA]" style={{ letterSpacing: "0.16em" }}>
            Why the ledger moves
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="min-w-0">
                <dt className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: ACCENT }} />
                  {item.title}
                </dt>
                <dd className="mt-2 text-[13px] font-normal leading-[1.6] text-[#A1A1AA]">{item.body}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
