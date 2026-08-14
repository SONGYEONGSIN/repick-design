import { Check, X } from "lucide-react";

import { COMPARE_ROWS } from "./data";

/**
 * repick vs. a generic marketplace — a real semantic `<table>` (caption + `scope`), not a card
 * grid. Wrapped defensively in `overflow-x-auto`; columns are percentage-based via `table-fixed`
 * so the wrapper should never actually need to scroll at any of the required widths.
 */
export default function CompareTable() {
  return (
    <section aria-labelledby="compare-title" className="border-b border-white/10 bg-white/[0.02]">
      <div className="mx-auto w-full max-w-[1120px] px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-[62ch]">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#B6A6F0]">
            Side by side
          </p>
          <h2
            id="compare-title"
            className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display-grotesk)" }}
          >
            What a typical listing skips.
          </h2>
        </div>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">
              Comparison of a typical secondhand marketplace listing and a repick listing across five
              criteria
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
                  className="px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#A1A1AA] sm:px-4"
                >
                  Criteria
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#A1A1AA] sm:px-4"
                >
                  Typical marketplace
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#B6A6F0] sm:px-4"
                >
                  repick
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.feature} className="border-b border-white/10 last:border-b-0">
                  <th scope="row" className="px-3 py-4 text-sm font-semibold text-white sm:px-4">
                    {row.feature}
                  </th>
                  <td className="px-3 py-4 text-sm font-normal text-[#A1A1AA] sm:px-4">
                    <span className="flex items-start gap-2">
                      <X aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#A1A1AA]" />
                      {row.generic}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm font-normal text-white sm:px-4">
                    <span className="flex items-start gap-2">
                      <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#B6A6F0]" />
                      {row.repick}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
