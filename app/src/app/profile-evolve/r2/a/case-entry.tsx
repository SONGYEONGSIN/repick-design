"use client";

import { ChevronDown } from "lucide-react";
import { OutcomeBadge, SeverityBadge } from "./badges";
import { totalFindings, topSeverity, type CaseEntry as CaseEntryType } from "./data";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const SEVERITY_ROWS: { key: "critical" | "high" | "medium" | "low"; label: string }[] = [
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export default function CaseEntry({
  entry,
  expanded,
  onToggle,
}: {
  entry: CaseEntryType;
  expanded: boolean;
  onToggle: () => void;
}) {
  const panelId = `case-panel-${entry.id}`;
  const headingId = `case-heading-${entry.id}`;
  const total = totalFindings(entry.findings);

  return (
    <li className="rounded-xl border border-zinc-200 bg-white">
      <h3 id={headingId} className="text-base">
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className={`flex w-full items-start justify-between gap-3 rounded-xl px-4 py-3.5 text-left sm:px-5 ${FOCUS}`}
        >
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-zinc-900">{entry.title}</span>
              <SeverityBadge severity={topSeverity(entry.findings)} />
            </span>
            <span className="mt-1 block truncate text-sm font-normal text-zinc-600">
              {entry.client} &middot; {entry.scope}
            </span>
          </span>

          <span className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-xs font-normal whitespace-nowrap text-zinc-600 tabular-nums">{entry.dateLabel}</span>
            <OutcomeBadge outcome={entry.outcome} />
            <ChevronDown
              aria-hidden="true"
              className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
            />
          </span>
        </button>
      </h3>

      {expanded ? (
        <div id={panelId} role="region" aria-labelledby={headingId} className="border-t border-zinc-100 px-4 pb-4 sm:px-5">
          <p className="mt-3 max-w-3xl text-sm font-normal leading-relaxed text-zinc-700">{entry.summary}</p>

          <h4 className="mt-4 text-xs font-medium tracking-wide text-zinc-600 uppercase">Findings breakdown</h4>
          <div className="mt-2 overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">Findings by severity for {entry.title}</caption>
              <colgroup>
                <col className="w-1/2" />
                <col className="w-1/2" />
              </colgroup>
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th scope="col" className="px-3 py-2 font-medium text-zinc-700">
                    Severity
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium text-zinc-700">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {SEVERITY_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-zinc-100 last:border-0">
                    <td className="px-3 py-2 font-normal text-zinc-800">{row.label}</td>
                    <td className="px-3 py-2 text-right font-normal tabular-nums text-zinc-800">
                      {entry.findings[row.key]}
                    </td>
                  </tr>
                ))}
                <tr className="bg-zinc-50">
                  <td className="px-3 py-2 font-medium text-zinc-900">Total</td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums text-zinc-900">{total}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </li>
  );
}
