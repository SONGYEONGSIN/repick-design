"use client";

import { Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { formatDate, formatUsd, type AccountSnapshot } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, QUADRANT, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TONE, TRANSITION, cx, type QuadrantId } from "./tokens";
import { Badge, Card, CardHeader, SortableTh, type SortDir } from "./ui";

type SortKey = "name" | "health" | "arr" | "renewal";

export default function AccountsTable({
  accounts,
  selectedId,
  onSelect,
  quadrantFilter,
  onClearQuadrant,
}: {
  accounts: AccountSnapshot[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  quadrantFilter: QuadrantId | null;
  onClearQuadrant: () => void;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("arr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = accounts.filter((a) => {
      if (quadrantFilter && a.quadrant !== quadrantFilter) return false;
      if (q && !`${a.name} ${a.industry} ${a.csm}`.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "health") cmp = a.health - b.health;
      else if (sortKey === "arr") cmp = a.arr - b.arr;
      else cmp = a.renewalIso.localeCompare(b.renewalIso);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [accounts, query, quadrantFilter, sortKey, sortDir]);

  const totalArr = rows.reduce((sum, r) => sum + r.arr, 0);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function selectRow(id: string) {
    onSelect(id);
    rowRefs.current.get(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return (
    <Card padded={false} className="flex h-full flex-col">
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <CardHeader
          title="Accounts"
          titleId="accounts-table-heading"
          description={`${rows.length} of ${accounts.length} accounts shown · sortable · click a row or a scatter point to inspect`}
        />
        <div className="flex flex-wrap items-center gap-2">
          <label className="relative block flex-1">
            <span className="sr-only">Search accounts by name, industry, or CSM</span>
            <Search size={14} aria-hidden="true" className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search account, industry, or CSM…"
              className={cx(
                "h-9 w-full max-w-xs rounded-lg border pl-8 pr-3 text-xs",
                BORDER,
                "bg-zinc-50",
                TEXT_PRIMARY,
                "placeholder:text-zinc-500",
                FOCUS_RING,
              )}
            />
          </label>
          {quadrantFilter
            ? (() => {
                const t = TONE[QUADRANT[quadrantFilter].tone];
                return (
                  <button
                    type="button"
                    onClick={onClearQuadrant}
                    className={cx("flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium", t.border, t.text, t.bg, TRANSITION, FOCUS_RING)}
                  >
                    Filtered: {QUADRANT[quadrantFilter].label}
                    <X size={13} aria-hidden="true" />
                  </button>
                );
              })()
            : null}
        </div>
      </div>

      <div className={cx("min-h-0 flex-1 border-t", BORDER)}>
        <div className="h-full overflow-y-auto [scrollbar-width:thin]">
          <div className="overflow-x-auto [scrollbar-width:thin]">
            <div className="min-w-[640px] lg:min-w-0">
              <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="accounts-table-heading">
                <caption className="sr-only">
                  Accounts in the current book of business with health score, ARR, quadrant, renewal date, and CSM owner. Sortable by
                  name, health, ARR, and renewal date. Filterable by quadrant (via the scatter plot) and by search.
                </caption>
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "19%" }} />
                </colgroup>
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className={cx("border-b", BORDER)}>
                    <SortableTh columnKey="name" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                      Account
                    </SortableTh>
                    <SortableTh columnKey="health" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                      Health
                    </SortableTh>
                    <SortableTh columnKey="arr" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                      ARR
                    </SortableTh>
                    <th scope="col" className="py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                      <span className={TEXT_CAPTION}>Quadrant</span>
                    </th>
                    <SortableTh columnKey="renewal" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                      Renews
                    </SortableTh>
                  </tr>
                </thead>
                <tbody className={cx("divide-y", DIVIDE)}>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>
                        No accounts match this filter.
                      </td>
                    </tr>
                  ) : (
                    rows.map((a) => {
                      const selected = a.id === selectedId;
                      const meta = QUADRANT[a.quadrant];
                      return (
                        <tr
                          key={a.id}
                          ref={(el) => {
                            rowRefs.current.set(a.id, el);
                          }}
                          className={cx(HOVER_ROW, TRANSITION, selected && "bg-indigo-50/70")}
                        >
                          <td className="py-2 pl-3 text-left">
                            <button
                              type="button"
                              onClick={() => selectRow(a.id)}
                              aria-pressed={selected}
                              className={cx("flex max-w-full items-start gap-2 rounded py-0.5 text-left", FOCUS_RING)}
                            >
                              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-zinc-100">
                                <a.Icon size={13} aria-hidden="true" className={TEXT_CAPTION} />
                              </span>
                              <span className="min-w-0">
                                <span className={cx("line-clamp-2 text-sm font-medium leading-snug hover:underline", TEXT_PRIMARY)}>{a.name}</span>
                                <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{a.industry}</span>
                              </span>
                            </button>
                          </td>
                          <td className={cx("py-2 pr-3 text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{a.health.toFixed(0)}</td>
                          <td className={cx("py-2 pr-3 text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(a.arr)}</td>
                          <td className="py-2 pl-3 text-left">
                            <Badge tone={meta.tone}>{meta.label}</Badge>
                          </td>
                          <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatDate(a.renewalIso)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className={cx("border-t", BORDER)}>
                    <td className={cx("py-2 pl-3 text-left text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>Total ({rows.length})</td>
                    <td />
                    <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(totalArr)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
