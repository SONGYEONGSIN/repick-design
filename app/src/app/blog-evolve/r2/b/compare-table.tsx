"use client";

// app/src/app/blog-evolve/r2/b/compare-table.tsx
//
// The "compare" mode: a semantic, sortable table where every report is one row, so metrics can be
// scanned and ranked against each other without opening any single report. Column headers are real
// buttons carrying `aria-sort` on their parent `<th>`; a row's detail — methodology note and link —
// expands inline via a disclosure button rather than navigation, keeping the whole comparison on
// one page.
import { Fragment, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from "lucide-react";
import { CATEGORIES, metricDelta, type Report } from "./data";
import { ConfidenceBadge } from "./badges";

type SortKey = "metric" | "sample" | "date";
type SortDir = "asc" | "desc";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

const COLUMN_LABEL: Record<SortKey, string> = {
  metric: "Effect size",
  sample: "Sample",
  date: "Published",
};

function sortValue(report: Report, key: SortKey): number {
  if (key === "metric") return Math.abs(metricDelta(report.metric).value);
  if (key === "sample") return report.sampleSize;
  return Date.parse(`${report.date}T00:00:00Z`) || 0;
}

/** Declared at module scope (not inside the component body) so it isn't recreated every render. */
function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5 text-zinc-500" />;
  return sortDir === "asc" ? (
    <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
  ) : (
    <ArrowDown aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
  );
}

export default function CompareTable({ reports }: { reports: Report[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const sorted = useMemo(() => {
    const copy = [...reports];
    copy.sort((a, b) => {
      const diff = sortValue(a, sortKey) - sortValue(b, sortKey);
      return sortDir === "asc" ? diff : -diff;
    });
    return copy;
  }, [reports, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  function toggleExpanded(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="relative overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
        <caption className="caption-top border-b border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-normal text-zinc-400">
          {sorted.length} benchmark reports, sorted by {COLUMN_LABEL[sortKey].toLowerCase()} (
          {sortDir === "asc" ? "ascending" : "descending"}). Click a column header to change the sort.
        </caption>
        <thead>
          <tr className="bg-zinc-900 text-xs font-medium text-zinc-400">
            <th scope="col" style={{ width: "30%" }} className="px-4 py-3">
              Report
            </th>
            <th scope="col" style={{ width: "14%" }} className="px-4 py-3">
              Category
            </th>
            <th scope="col" style={{ width: "16%" }} aria-sort={ariaSortFor("metric")} className="px-4 py-3">
              <button type="button" onClick={() => toggleSort("metric")} className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}>
                Effect size
                <SortIcon column="metric" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" style={{ width: "12%" }} aria-sort={ariaSortFor("sample")} className="px-4 py-3">
              <button type="button" onClick={() => toggleSort("sample")} className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}>
                Sample
                <SortIcon column="sample" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" style={{ width: "14%" }} className="px-4 py-3">
              Confidence
            </th>
            <th scope="col" style={{ width: "10%" }} aria-sort={ariaSortFor("date")} className="px-4 py-3">
              <button type="button" onClick={() => toggleSort("date")} className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}>
                Published
                <SortIcon column="date" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th scope="col" style={{ width: "4%" }} className="px-2 py-3">
              <span className="sr-only">Expand details</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {sorted.map((report) => {
            const cat = CATEGORIES.find((c) => c.id === report.category)!;
            const CatIcon = cat.icon;
            const { value, improved } = metricDelta(report.metric);
            const isExpanded = expanded.has(report.slug);
            const detailId = `detail-${report.slug}`;

            return (
              <Fragment key={report.slug}>
                <tr className="align-top text-sm text-zinc-300 hover:bg-zinc-900/60">
                  <td className="px-4 py-3">
                    <Link href={`#${report.slug}`} className={`block truncate font-medium text-zinc-50 hover:text-emerald-400 ${FOCUS_RING}`}>
                      {report.title}
                    </Link>
                    <span className="mt-0.5 block truncate text-xs font-normal text-zinc-400">{report.author.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                      <CatIcon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{cat.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <span className="font-medium text-zinc-50">
                      {value > 0 ? "+" : ""}
                      {value}%
                    </span>
                    <span className="ml-1.5 text-xs font-normal text-zinc-400">{improved ? "better" : "worse"}</span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{report.sampleSize.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge level={report.confidence} />
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    <time dateTime={report.date}>{report.dateLabel}</time>
                  </td>
                  <td className="px-2 py-3">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(report.slug)}
                      aria-expanded={isExpanded}
                      aria-controls={detailId}
                      aria-label={`${isExpanded ? "Collapse" : "Expand"} methodology for ${report.title}`}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-emerald-400 ${FOCUS_RING}`}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform motion-reduce:transition-none ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </button>
                  </td>
                </tr>
                {isExpanded && (
                  <tr id={detailId}>
                    <td colSpan={7} className="border-t border-zinc-800 bg-zinc-900/60 px-4 py-4">
                      <p className="max-w-3xl text-sm leading-relaxed font-normal text-zinc-300">
                        <span className="font-medium text-zinc-50">Methodology — </span>
                        {report.methodology}
                      </p>
                      <Link
                        href={`#${report.slug}`}
                        className={`mt-2 inline-flex items-center gap-1 rounded text-sm font-medium text-emerald-400 hover:text-emerald-300 ${FOCUS_RING}`}
                      >
                        Read the full report
                      </Link>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
