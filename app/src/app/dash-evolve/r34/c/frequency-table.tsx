"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { ScaledWord } from "./data";
import { SENTIMENT_LABEL } from "./data";
import { SENTIMENT_ICON, SENTIMENT_BADGE_TONE } from "./sentiment-meta";
import { Badge } from "./ui";

const NUMBER_FORMAT = new Intl.NumberFormat("en-US");

type SortKey = "word" | "count" | "sharePct" | "sentiment";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; defaultDir: SortDir; width: string }[] = [
  { key: "word", label: "Word", defaultDir: "asc", width: "36%" },
  { key: "count", label: "Count", defaultDir: "desc", width: "18%" },
  { key: "sharePct", label: "Share", defaultDir: "desc", width: "16%" },
  { key: "sentiment", label: "Sentiment", defaultDir: "asc", width: "30%" },
];

function compare(a: ScaledWord, b: ScaledWord, key: SortKey): number {
  if (key === "word" || key === "sentiment") {
    return a[key].localeCompare(b[key]);
  }
  return a[key] - b[key];
}

export function FrequencyTable({
  words,
  captionSuffix,
}: {
  words: ScaledWord[];
  captionSuffix: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? words.filter((w) => w.word.toLowerCase().includes(q)) : words;
    const sorted = filtered.slice().sort((a, b) => compare(a, b, sortKey));
    return sortDir === "asc" ? sorted : sorted.reverse();
  }, [words, query, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(COLUMNS.find((c) => c.key === key)!.defaultDir);
    }
  };

  return (
    <div className="min-w-0">
      <label className="relative mb-3 block">
        <span className="sr-only">Filter words in the frequency list</span>
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter words…"
          className="h-9 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm font-normal text-zinc-50 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
        />
      </label>

      <div className="relative max-h-[420px] overflow-y-auto rounded-lg border border-white/10">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">
            Word frequency and sentiment breakdown, {captionSuffix}. Columns: word, mention count, share
            of all mentions, and sentiment. Select a column heading to sort.
          </caption>
          <colgroup>
            {COLUMNS.map((c) => (
              <col key={c.key} style={{ width: c.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {COLUMNS.map((c) => {
                const active = c.key === sortKey;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                const numeric = c.key === "count" || c.key === "sharePct";
                return (
                  <th
                    key={c.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 text-left"
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(c.key)}
                      className={`flex w-full items-center gap-1 rounded text-[11px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${
                        numeric ? "justify-end" : "justify-start"
                      }`}
                    >
                      {numeric ? (
                        <>
                          <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
                          {c.label}
                        </>
                      ) : (
                        <>
                          {c.label}
                          <Icon aria-hidden="true" className="h-3 w-3 shrink-0" />
                        </>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm font-normal text-zinc-400">
                  No words match “{query}”.
                </td>
              </tr>
            ) : (
              rows.map((w) => {
                const Icon = SENTIMENT_ICON[w.sentiment];
                return (
                  <tr key={w.word} className="border-t border-white/5 hover:bg-white/5">
                    <td className="overflow-hidden px-3 py-2 text-ellipsis whitespace-nowrap font-medium text-zinc-50">
                      {w.word}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-normal text-zinc-300">
                      {NUMBER_FORMAT.format(w.count)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-normal text-zinc-300">
                      {w.sharePct.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2">
                      <Badge tone={SENTIMENT_BADGE_TONE[w.sentiment]} icon={<Icon className="h-3 w-3" />}>
                        {SENTIMENT_LABEL[w.sentiment]}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
