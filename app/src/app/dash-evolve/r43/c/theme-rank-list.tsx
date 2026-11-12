"use client";

import { FOCUS_RING, SentimentBadge } from "./ui";
import { TERMS, TOTAL_MENTIONS } from "./data";
import { formatCount, formatSharePct } from "./format";

/** The required always-visible fallback for the word cloud: every term's exact count,
 *  share of total mentions, and sentiment label, ranked by frequency — a first-class
 *  part of the layout, not a hidden "data table" afterthought. Clicking a row drives
 *  the same `selectedTermId` as the cloud, so either entry point stays in sync.
 *
 *  Below `sm` this renders as a wrapping flex card list instead of the fixed-width
 *  table: a rigid 4-column `colgroup` at ~326px of content width left no room for
 *  "Mentions"/"Sentiment" header text or a count + sentiment badge side by side
 *  without spilling into the next column. `flex-wrap` can only ever push content to
 *  a new line, never overlap it, so this is a structural fix, not a width guess. */
export default function ThemeRankList({
  selectedTermId,
  onSelectTerm,
}: {
  selectedTermId: string;
  onSelectTerm: (id: string) => void;
}) {
  return (
    <div className="max-h-80 overflow-y-auto">
      {/* Mobile card list (<640px) */}
      <ul className="divide-y divide-zinc-100 sm:hidden">
        {TERMS.map((term, i) => {
          const selected = term.id === selectedTermId;
          return (
            <li key={term.id} className={selected ? "bg-rose-50" : ""}>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onSelectTerm(term.id)}
                  className={`flex min-h-6 min-w-0 flex-1 items-center gap-2 rounded px-1 py-0.5 text-left font-medium motion-safe:transition-colors ${FOCUS_RING} ${
                    selected ? "text-rose-700" : "text-zinc-900 hover:text-rose-700"
                  }`}
                >
                  <span className="shrink-0 font-normal tabular-nums text-zinc-600">{i + 1}</span>
                  <span className="truncate">{term.label}</span>
                </button>
                <div className="flex shrink-0 items-center gap-2 pl-1">
                  <span className="whitespace-nowrap font-normal tabular-nums text-xs text-zinc-600">
                    {formatCount(term.count)} ({formatSharePct(term.count, TOTAL_MENTIONS)})
                  </span>
                  <SentimentBadge sentiment={term.sentiment} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Desktop table (sm and up) */}
      <div className="hidden sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">Themes ranked by mention frequency, with sentiment</caption>
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[40%]" />
            <col className="w-[18%]" />
            <col className="w-[32%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Rank
              </th>
              <th scope="col" className="py-2 pr-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Theme
              </th>
              <th scope="col" className="py-2 pr-2 text-right font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Mentions
              </th>
              <th scope="col" className="py-2 text-left font-medium text-[11px] uppercase tracking-[0.06em] text-zinc-500">
                Sentiment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {TERMS.map((term, i) => {
              const selected = term.id === selectedTermId;
              return (
                <tr key={term.id} className={selected ? "bg-rose-50" : "hover:bg-zinc-50"}>
                  <td className="py-2 pr-2 align-middle font-normal tabular-nums text-zinc-600">{i + 1}</td>
                  <td className="py-2 pr-2 align-middle">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelectTerm(term.id)}
                      className={`block min-h-6 w-full truncate rounded px-1 py-0.5 -mx-1 text-left font-medium text-zinc-900 motion-safe:transition-colors ${FOCUS_RING} ${selected ? "text-rose-700" : "hover:text-rose-700"}`}
                    >
                      {term.label}
                    </button>
                  </td>
                  <td className="py-2 pr-2 align-middle text-right font-normal tabular-nums text-zinc-600">
                    {formatCount(term.count)}
                    <span className="ml-1 text-zinc-600">({formatSharePct(term.count, TOTAL_MENTIONS)})</span>
                  </td>
                  <td className="py-2 align-middle">
                    <SentimentBadge sentiment={term.sentiment} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
