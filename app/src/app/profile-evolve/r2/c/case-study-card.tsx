"use client";

import { ChevronDown, TrendingUp } from "lucide-react";
import CoverArt from "./cover-art";
import type { CaseStudy } from "./data";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const DISPLAY_FONT = { fontFamily: "var(--font-display-mono)" } as const;

export default function CaseStudyCard({
  study,
  expanded,
  onToggle,
}: {
  study: CaseStudy;
  expanded: boolean;
  onToggle: () => void;
}) {
  const panelId = `case-study-panel-${study.id}`;
  const buttonId = `case-study-toggle-${study.id}`;

  return (
    <li className="min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white">
      <CoverArt seed={study.id} discipline={study.discipline} />

      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full border border-zinc-300 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
            {study.discipline}
          </span>
          <span className="text-[11px] font-normal text-zinc-500">{study.durationLabel}</span>
        </div>

        <h3 className="mt-2 text-sm font-semibold leading-snug text-zinc-900">{study.title}</h3>
        <p className="mt-0.5 text-xs font-normal text-zinc-600">
          {study.client} <span aria-hidden="true">&middot;</span> {study.clientContext}
        </p>

        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2">
          <TrendingUp aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-700" />
          <span className="text-xs font-normal text-zinc-600">{study.impactLabel}</span>
          <span className="ml-auto text-base font-semibold tabular-nums text-blue-700" style={DISPLAY_FONT}>
            {study.impactValue}
          </span>
        </div>

        <button
          id={buttonId}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={onToggle}
          className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-300 py-2 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 ${FOCUS_RING}`}
        >
          {expanded ? "Hide case study" : "View case study"}
          <ChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!expanded}
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-200 p-4 sm:p-5">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-600">The problem</h4>
            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-700">{study.summary}</p>

            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-600">Approach</h4>
            <p className="mt-1 text-sm font-normal leading-relaxed text-zinc-700">{study.approach}</p>

            <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-zinc-600">Results</h4>
            <div className="relative mt-2 overflow-x-auto">
              <table className="w-full table-fixed border-collapse text-left text-xs">
                <caption className="sr-only">Before-and-after metrics for {study.client}</caption>
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th scope="col" className="w-1/2 py-1.5 pr-2 font-medium text-zinc-600">
                      Metric
                    </th>
                    <th scope="col" className="w-1/4 py-1.5 pr-2 font-medium text-zinc-600">
                      Before
                    </th>
                    <th scope="col" className="w-1/4 py-1.5 font-medium text-zinc-600">
                      After
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {study.metrics.map((row) => (
                    <tr key={row.metric} className="border-b border-zinc-100 last:border-0">
                      <th scope="row" className="py-1.5 pr-2 font-normal text-zinc-700">
                        {row.metric}
                      </th>
                      <td className="py-1.5 pr-2 font-normal tabular-nums text-zinc-500">{row.before}</td>
                      <td className="py-1.5 font-semibold tabular-nums text-blue-700">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <blockquote className="mt-4 border-l-2 border-blue-200 pl-3">
              <p className="text-sm font-normal italic leading-relaxed text-zinc-700">&ldquo;{study.testimonial.quote}&rdquo;</p>
              <footer className="mt-1 text-xs font-normal text-zinc-500">&mdash; {study.testimonial.attribution}</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </li>
  );
}
