"use client";

import { ChevronDown, ChevronRight, ChevronsUpDown, ChevronUp } from "lucide-react";
import { Fragment, useState } from "react";
import {
  API_ERRORS,
  ERROR_SAMPLE,
  ERROR_TOTAL_PER_10K,
  FOCUS_RING,
  pctText,
} from "./data";

type SortKey = "per10k" | "status";
type SortDir = "asc" | "desc";

const SORT_LABEL: Record<SortKey, string> = {
  per10k: "how often it happens",
  status: "HTTP status",
};

/**
 * Schedule to clause 4: every error this API can return, and the obligation each one places on the
 * caller.
 *
 * Two decisions are worth naming. The first is that the busiest row is expanded on load — the
 * obligation is the point of the table, and a contract whose terms only appear after a click is a
 * contract nobody read. The second is that the frequency column is a measured rate rather than a
 * likelihood word: "rare" is unfalsifiable, 0.9 per ten thousand is not.
 *
 * Only the two numeric columns are sortable. Sorting a contract by its obligations would mean
 * nothing, so those columns are not offered as sort keys and no header pretends otherwise.
 */
export default function ErrorContract() {
  const [sortKey, setSortKey] = useState<SortKey>("per10k");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [openCode, setOpenCode] = useState<string | null>(API_ERRORS[0].code);

  const rows = [...API_ERRORS].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortDir === "asc" ? diff : -diff;
  });

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (key !== sortKey) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  function sortIcon(key: SortKey) {
    if (key !== sortKey) {
      return <ChevronsUpDown aria-hidden="true" className="h-3.5 w-3.5 flex-none text-zinc-600" />;
    }
    return sortDir === "asc" ? (
      <ChevronUp aria-hidden="true" className="h-3.5 w-3.5 flex-none text-teal-700" />
    ) : (
      <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 flex-none text-teal-700" />
    );
  }

  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="max-w-2xl text-sm font-normal leading-relaxed text-zinc-700">
          {pctText(ERROR_TOTAL_PER_10K / 10_000, 2)} of requests end in one of these eight. Open a
          code to read the obligation it places on your code.
        </p>
        <p className="text-xs font-normal text-zinc-600">Sample: {ERROR_SAMPLE}</p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-300 bg-white">
        <table className="w-full min-w-[700px] table-fixed border-collapse text-left">
          <caption className="caption-top border-b border-zinc-200 px-4 py-3 text-left text-xs font-normal text-zinc-600">
            Schedule 4 &mdash; every error the Extract API returns, how often it occurs per ten
            thousand requests, whether your code may retry it, and whether it is billed.
          </caption>
          <colgroup>
            <col className="w-[27%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[31%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-300 bg-zinc-50">
              <th scope="col" className="px-4 py-2.5 text-xs font-semibold text-zinc-700">
                Error code
              </th>
              <th
                scope="col"
                aria-sort={ariaSort("status")}
                className="px-3 py-2.5 text-xs font-semibold text-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => onSort("status")}
                  aria-label={`Sort by ${SORT_LABEL.status}`}
                  className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}
                >
                  HTTP {sortIcon("status")}
                </button>
              </th>
              <th
                scope="col"
                aria-sort={ariaSort("per10k")}
                className="px-3 py-2.5 text-xs font-semibold text-zinc-700"
              >
                <button
                  type="button"
                  onClick={() => onSort("per10k")}
                  aria-label={`Sort by ${SORT_LABEL.per10k}`}
                  className={`inline-flex items-center gap-1 rounded text-left ${FOCUS_RING}`}
                >
                  Per 10k {sortIcon("per10k")}
                </button>
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold text-zinc-700">
                Retry policy
              </th>
              <th scope="col" className="px-3 py-2.5 text-xs font-semibold text-zinc-700">
                Billed
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const open = openCode === row.code;
              const panelId = `err-${row.code}`;
              return (
                <Fragment key={row.code}>
                  <tr className="border-b border-zinc-200 align-top last:border-0">
                    <th scope="row" className="px-4 py-3 font-normal">
                      <button
                        type="button"
                        onClick={() => setOpenCode(open ? null : row.code)}
                        aria-expanded={open}
                        aria-controls={open ? panelId : undefined}
                        className={`flex w-full items-start gap-1.5 rounded text-left ${FOCUS_RING}`}
                      >
                        {open ? (
                          <ChevronDown
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 flex-none text-teal-700"
                          />
                        ) : (
                          <ChevronRight
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 flex-none text-zinc-600"
                          />
                        )}
                        <span className="min-w-0 break-words font-mono text-sm font-semibold text-zinc-900">
                          {row.code}
                        </span>
                      </button>
                    </th>
                    <td className="px-3 py-3 font-mono text-sm font-normal tabular-nums text-zinc-900">
                      {row.status}
                    </td>
                    <td className="px-3 py-3 text-sm font-normal tabular-nums text-zinc-800">
                      {row.per10k.toFixed(1)}
                    </td>
                    <td className="px-3 py-3 text-sm font-normal leading-relaxed text-zinc-700">
                      {row.retry}
                    </td>
                    <td className="px-3 py-3 text-sm font-normal leading-relaxed text-zinc-700">
                      {row.billed}
                    </td>
                  </tr>
                  {open ? (
                    <tr className="border-b border-zinc-200 last:border-0">
                      <td colSpan={5} className="bg-zinc-50 px-4 pb-5 pt-4">
                        <div id={panelId} className="min-w-0 border-l-2 border-teal-700 pl-4">
                          <p className="text-xs font-semibold uppercase tracking-widest text-teal-800">
                            What your code must do about {row.code}
                          </p>
                          <p className="mt-2 max-w-3xl text-sm font-normal leading-relaxed text-zinc-800">
                            {row.mustDo}
                          </p>
                          <pre className="mt-3 max-w-3xl overflow-x-auto rounded-md bg-zinc-900 p-4 text-xs font-normal leading-relaxed text-zinc-100">
                            <code className="font-mono">{row.handler}</code>
                          </pre>
                          <p className="mt-2 text-xs font-normal text-zinc-600">
                            Against your quota: {row.quota}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
