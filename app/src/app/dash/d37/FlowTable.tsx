"use client";

import { ArrowRight, Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { formatCount, formatUsd, type FlowGraph, type MetricId } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, OUTCOME_TONE, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Card, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

type StageFilter = "all" | "hop1" | "hop2";
const STAGE_OPTIONS: { id: StageFilter; label: string }[] = [
  { id: "all", label: "All hops" },
  { id: "hop1", label: "Channel → Tier" },
  { id: "hop2", label: "Tier → Outcome" },
];

type SortKey = "path" | "customers" | "mrr" | "share";

export default function FlowTable({
  graph,
  metric,
  selectedId,
  onSelect,
}: {
  graph: FlowGraph;
  metric: MetricId;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>(metric === "customers" ? "customers" : "mrr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  const allLinks = useMemo(() => [...graph.linksChannelTier, ...graph.linksTierOutcome], [graph]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allLinks.filter((l) => {
      if (stageFilter === "hop1" && l.col !== 0) return false;
      if (stageFilter === "hop2" && l.col !== 1) return false;
      if (q && !`${l.sourceLabel} ${l.targetLabel}`.toLowerCase().includes(q)) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "path") cmp = `${a.sourceLabel}${a.targetLabel}`.localeCompare(`${b.sourceLabel}${b.targetLabel}`);
      else if (sortKey === "customers") cmp = a.customers - b.customers;
      else if (sortKey === "mrr") cmp = a.mrr - b.mrr;
      else cmp = a.shareOfSourcePct - b.shareOfSourcePct;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [allLinks, stageFilter, query, sortKey, sortDir]);

  const totalCustomers = rows.reduce((a, r) => a + r.customers, 0);
  const totalMrr = rows.reduce((a, r) => a + r.mrr, 0);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "path" ? "asc" : "desc");
    }
  }

  function selectRow(id: string) {
    onSelect(id);
    rowRefs.current.get(id)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  return (
    <Card padded={false}>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <CardHeader
          title="Flow paths"
          titleId="flow-table-heading"
          description={`${rows.length} ribbons shown · sortable · filter by hop or search`}
          action={<SegmentedControl ariaLabel="Filter by flow hop" options={STAGE_OPTIONS} value={stageFilter} onChange={setStageFilter} size="sm" />}
        />
        <label className="relative block">
          <span className="sr-only">Search flow paths by channel, tier, or outcome name</span>
          <Search size={14} aria-hidden="true" className={cx("pointer-events-none absolute left-3 top-1/2 -translate-y-1/2", TEXT_CAPTION)} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channel, tier, or outcome…"
            className={cx(
              "h-9 w-full max-w-xs rounded-lg border pl-8 pr-3 text-xs",
              BORDER,
              "bg-zinc-50 dark:bg-zinc-950",
              TEXT_PRIMARY,
              "placeholder:text-zinc-500 dark:placeholder:text-zinc-400",
              FOCUS_RING,
            )}
          />
        </label>
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[720px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="flow-table-heading">
              <caption className="sr-only">
                Revenue attribution flow paths from acquisition channel to plan tier and from plan tier to 90-day outcome. Sortable by
                path, customers, new MRR, and share of source. Filterable by hop and searchable by name.
              </caption>
              <colgroup>
                <col style={{ width: "19%" }} />
                <col style={{ width: "27%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "18%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="path" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    From
                  </SortableTh>
                  <th scope="col" className="py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                    <span className={TEXT_CAPTION}>To</span>
                  </th>
                  <SortableTh columnKey="customers" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Accts
                  </SortableTh>
                  <SortableTh columnKey="mrr" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    New MRR
                  </SortableTh>
                  <SortableTh columnKey="share" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    Share
                  </SortableTh>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>
                      No flow paths match this search.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const selected = r.id === selectedId;
                    const outcomeTone = r.col === 1 ? OUTCOME_TONE[r.targetId] : undefined;
                    return (
                      <tr
                        key={r.id}
                        ref={(el) => {
                          rowRefs.current.set(r.id, el);
                        }}
                        className={cx(HOVER_ROW, TRANSITION, selected && "bg-sky-50/70 dark:bg-sky-500/10")}
                      >
                        <td className="py-2 pl-3 text-left">
                          <button
                            type="button"
                            onClick={() => selectRow(r.id)}
                            aria-pressed={selected}
                            className={cx("max-w-full truncate rounded text-left text-sm font-medium hover:underline", FOCUS_RING, TEXT_PRIMARY)}
                          >
                            {r.sourceLabel}
                          </button>
                        </td>
                        <td className="py-2 pl-3 text-left">
                          <span className="flex min-w-0 items-center gap-1.5">
                            <ArrowRight size={12} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                            {outcomeTone ? (
                              <Badge tone={outcomeTone}>{r.targetLabel}</Badge>
                            ) : (
                              <span className={cx("truncate text-sm", TEXT_SECONDARY)}>{r.targetLabel}</span>
                            )}
                          </span>
                        </td>
                        <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{formatCount(r.customers)}</td>
                        <td className={cx("py-2 pr-3 text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(r.mrr)}</td>
                        <td className={cx("py-2 pr-3 text-right text-sm whitespace-nowrap", NUM, TEXT_SECONDARY)}>{r.shareOfSourcePct.toFixed(1)}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              <tfoot>
                <tr className={cx("border-t", BORDER)}>
                  <td colSpan={2} className={cx("py-2 pl-3 text-left text-xs font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    Total ({rows.length} shown)
                  </td>
                  <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatCount(totalCustomers)}</td>
                  <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(totalMrr)}</td>
                  <td className="py-2 pr-3" />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
