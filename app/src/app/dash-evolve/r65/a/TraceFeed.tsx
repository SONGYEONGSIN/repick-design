"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { formatInt, type Service } from "./data";

type SortDir = "asc" | "desc" | null;

function statusTone(code: number): { className: string; label: string } {
  if (code >= 500) return { className: "text-rose-400", label: "Error" };
  if (code >= 400) return { className: "text-amber-400", label: "Client error" };
  return { className: "text-emerald-400", label: "OK" };
}

export default function TraceFeed({ service }: { service: Service }) {
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const traces = useMemo(() => {
    if (!sortDir) return service.traces;
    const copy = service.traces.slice();
    copy.sort((a, b) => (sortDir === "asc" ? a.durationMs - b.durationMs : b.durationMs - a.durationMs));
    return copy;
  }, [service, sortDir]);

  // Derived strictly from the same `traces` array the table renders below.
  const avgDuration = Math.round(traces.reduce((a, t) => a + t.durationMs, 0) / traces.length);
  const errorCount = traces.filter((t) => t.statusCode >= 400).length;

  function toggleSort() {
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  }

  const ariaSort = sortDir === "asc" ? "ascending" : sortDir === "desc" ? "descending" : "none";

  return (
    <section aria-labelledby="trace-feed-heading" className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-white/10 px-4 py-3">
        <h2 id="trace-feed-heading" className="text-sm font-semibold text-zinc-50">
          Recent traces
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          <span className="tabular-nums">{traces.length}</span> traces ·{" "}
          <span className="tabular-nums">{avgDuration}</span>ms avg ·{" "}
          <span className="tabular-nums">{errorCount}</span> errors
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <table className="w-full table-fixed border-collapse text-xs">
          <caption className="sr-only">
            Recent traces for {service.name}, sorted by duration {ariaSort}
          </caption>
          <colgroup>
            <col style={{ width: "42%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "22%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10 text-zinc-400">
              <th scope="col" className="px-2 py-2 text-left font-medium">
                Request
              </th>
              <th scope="col" className="px-2 py-2 text-left font-medium">
                Status
              </th>
              <th scope="col" aria-sort={ariaSort as "ascending" | "descending" | "none"} className="px-2 py-2 text-left font-medium">
                <button
                  type="button"
                  onClick={toggleSort}
                  className="flex items-center gap-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                  Duration
                  {sortDir === "asc" ? (
                    <ArrowUp aria-hidden="true" className="size-3" />
                  ) : sortDir === "desc" ? (
                    <ArrowDown aria-hidden="true" className="size-3" />
                  ) : (
                    <ArrowUpDown aria-hidden="true" className="size-3 opacity-60" />
                  )}
                </button>
              </th>
              <th scope="col" className="px-2 py-2 text-left font-medium">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {traces.map((t) => {
              const tone = statusTone(t.statusCode);
              return (
                <tr key={t.id} className="border-b border-white/5">
                  <td className="px-2 py-2">
                    <div className="flex min-w-0 items-baseline gap-1.5">
                      <span className="shrink-0 font-medium text-zinc-300">{t.method}</span>
                      <span className="truncate text-zinc-100">{t.endpoint}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <span className={`tabular-nums ${tone.className}`}>
                      {t.statusCode} <span className="text-zinc-400">· {tone.label}</span>
                    </span>
                  </td>
                  <td className="px-2 py-2 tabular-nums text-zinc-100">{formatInt(t.durationMs)}ms</td>
                  <td className="px-2 py-2 text-zinc-400">{t.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
