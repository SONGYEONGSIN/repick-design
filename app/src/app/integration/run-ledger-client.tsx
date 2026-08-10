"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  ChevronDown,
  GitMerge,
} from "lucide-react";

import { RUNS, type RunOutcome } from "./data";

const DISPLAY = { fontFamily: "var(--font-display-grotesk)" } as const;

const OUTCOME = {
  complete: {
    Icon: CheckCircle2,
    label: "Complete",
    text: "text-emerald-300",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  partial: {
    Icon: AlertTriangle,
    label: "Partial",
    text: "text-amber-200",
    chip: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
  conflict: {
    Icon: GitMerge,
    label: "Conflict held",
    text: "text-rose-200",
    chip: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  },
} as const satisfies Record<RunOutcome, unknown>;

export function RunLedger() {
  const [openRun, setOpenRun] = useState<string | null>(null);

  return (
    <ul className="mt-6 space-y-3">
      {RUNS.map((run) => {
        const { Icon, label, chip } = OUTCOME[run.outcome];
        const isOpen = openRun === run.id;
        const panelId = `run-${run.id}-detail`;

        return (
          <li
            key={run.id}
            className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-4 sm:px-5"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                className="text-base font-semibold tabular-nums text-zinc-50"
                style={DISPLAY}
              >
                #{run.id}
              </span>
              <span className="text-sm tabular-nums text-zinc-400">{run.window}</span>
              <span className="inline-flex items-center gap-1.5 text-sm text-zinc-300">
                <ArrowRightLeft aria-hidden className="size-3.5 text-orange-300" />
                Both ways
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${chip}`}
              >
                <Icon aria-hidden className="size-3.5" />
                {label}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <p className="text-sm text-zinc-300">
                <span className="font-medium tabular-nums text-zinc-50">{run.read}</span> read from
                HubSpot
              </p>
              <p className="text-sm text-zinc-300">
                <span className="font-medium tabular-nums text-zinc-50">{run.written}</span> written
                to HubSpot
              </p>
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-300">{run.headline}</p>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenRun(isOpen ? null : run.id)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-zinc-200 hover:border-orange-400/50 hover:text-orange-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              <ChevronDown
                aria-hidden
                className={`size-3.5 transition-transform duration-200 motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
              {isOpen ? "Hide" : "Show"} {run.detailLabel}
            </button>

            {isOpen ? (
              <div
                id={panelId}
                className="mt-3 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3"
              >
                <dl className="divide-y divide-zinc-800">
                  {run.detail.map((item) => (
                    <div key={item.record} className="py-2 first:pt-0 last:pb-0">
                      <dt className="break-words font-mono text-xs font-medium text-zinc-100">
                        {item.record}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-zinc-300">{item.reason}</dd>
                    </div>
                  ))}
                </dl>
                {run.footnote ? (
                  <p className="mt-3 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
                    {run.footnote}
                  </p>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
