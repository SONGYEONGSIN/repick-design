"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Card, CardTitle, MethodBadge, FOCUS } from "./ui";
import { ENDPOINTS, type Endpoint } from "./data";

type SortKey = "path" | "rps" | "p99" | "errorRatePct";

function sortEndpoints(rows: Endpoint[], key: SortKey, dir: 1 | -1): Endpoint[] {
  const copy = [...rows];
  copy.sort((a, b) => {
    const cmp = key === "path" ? a.path.localeCompare(b.path) : a[key] - b[key];
    return cmp * dir;
  });
  return copy;
}

function HeaderButton({
  k,
  align = "left",
  onToggle,
  children,
}: {
  k: SortKey;
  align?: "left" | "right";
  onToggle: (k: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(k)}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 hover:text-slate-200 ${FOCUS} ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {children}
      <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
    </button>
  );
}

export function EndpointTable({
  focusedId,
  onFocus,
}: {
  focusedId: string | null;
  onFocus: (endpoint: Endpoint) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("rps");
  const [dir, setDir] = useState<1 | -1>(-1);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setDir(-1);
    }
  }

  function ariaSortFor(key: SortKey) {
    if (key !== sortKey) return "none" as const;
    return dir === 1 ? ("ascending" as const) : ("descending" as const);
  }

  const rows = sortEndpoints(ENDPOINTS, sortKey, dir);

  return (
    <Card id="endpoint-table" className="min-w-0">
      <CardTitle>Endpoints</CardTitle>
      <div className="mt-3 min-w-0 overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-collapse">
          <caption className="sr-only">Monitored endpoints, sortable by path, requests per second, p99 latency, or error rate.</caption>
          <colgroup>
            <col style={{ width: "38%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" aria-sort={ariaSortFor("path")} className="px-2 py-2 text-left">
                <HeaderButton k="path" onToggle={toggleSort}>Endpoint</HeaderButton>
              </th>
              <th scope="col" className="px-2 py-2 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Method
              </th>
              <th scope="col" aria-sort={ariaSortFor("rps")} className="px-2 py-2 text-right">
                <span className="flex justify-end">
                  <HeaderButton k="rps" align="right" onToggle={toggleSort}>RPS</HeaderButton>
                </span>
              </th>
              <th scope="col" aria-sort={ariaSortFor("p99")} className="px-2 py-2 text-right">
                <span className="flex justify-end">
                  <HeaderButton k="p99" align="right" onToggle={toggleSort}>p99</HeaderButton>
                </span>
              </th>
              <th scope="col" aria-sort={ariaSortFor("errorRatePct")} className="px-2 py-2 text-right">
                <span className="flex justify-end">
                  <HeaderButton k="errorRatePct" align="right" onToggle={toggleSort}>Errors</HeaderButton>
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const isFocused = focusedId === e.id;
              return (
                <tr key={e.id} className={`border-b border-white/5 last:border-0 ${isFocused ? "bg-rose-500/10" : ""}`}>
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => onFocus(e)}
                      aria-pressed={isFocused}
                      className={`block w-full min-w-0 truncate text-left text-sm font-medium text-slate-100 hover:text-rose-300 ${FOCUS}`}
                    >
                      {e.path}
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <MethodBadge method={e.method} />
                  </td>
                  <td className="px-2 py-2 text-right text-sm font-normal tabular-nums text-slate-300">{e.rps}</td>
                  <td className="px-2 py-2 text-right text-sm font-normal tabular-nums text-slate-300">{e.p99}ms</td>
                  <td className="px-2 py-2 text-right text-sm font-normal tabular-nums text-slate-300">{e.errorRatePct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
