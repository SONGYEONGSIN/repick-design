"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, FlaskConical } from "lucide-react";
import type { Experiment, PeriodId } from "../lib/data";
import { EXPERIMENTS, OWNERS, PERIOD_OPTIONS } from "../lib/data";
import { Avatar, Badge, Card, SegmentedControl } from "./ui";

export default function ControlBar({
  experiment,
  onSelectExperiment,
  period,
  onSelectPeriod,
}: {
  experiment: Experiment;
  onSelectExperiment: (id: string) => void;
  period: PeriodId;
  onSelectPeriod: (id: PeriodId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const owner = OWNERS[experiment.ownerId];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <Card className="min-w-0 p-3 sm:p-3.5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative" ref={ref}>
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 min-w-0 max-w-[19rem] items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 text-left outline-none transition-colors motion-reduce:transition-none hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-white/10 dark:bg-zinc-900 dark:hover:bg-white/5"
          >
            <FlaskConical className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {experiment.name}
              </span>
              <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                {experiment.metricLabel} · {owner?.name}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
          </button>
          {open ? (
            <div
              role="listbox"
              aria-label="Select experiment"
              className="absolute left-0 z-20 mt-2 w-[22rem] max-w-[90vw] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-zinc-900"
            >
              {EXPERIMENTS.map((exp) => {
                const active = exp.id === experiment.id;
                const expOwner = OWNERS[exp.ownerId];
                return (
                  <button
                    key={exp.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onSelectExperiment(exp.id);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      active ? "bg-indigo-50 dark:bg-indigo-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/5"
                    }`}
                  >
                    {expOwner ? <Avatar src={expOwner.avatar} name={expOwner.name} size={22} /> : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-900 dark:text-zinc-100">{exp.name}</span>
                      <span className="block truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                        {exp.metricLabel}
                      </span>
                    </span>
                    {active ? (
                      <Check className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <SegmentedControl
          ariaLabel="Comparison period"
          options={PERIOD_OPTIONS.map((p) => ({ id: p.id, label: p.label }))}
          value={period}
          onChange={onSelectPeriod}
        />

        <div className="ml-auto flex items-center gap-2">
          <Badge className="border-zinc-200 bg-zinc-50 py-1 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <span className="h-2 w-2 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" aria-hidden="true" />
            Variant A · {experiment.trafficSplitA}%
          </Badge>
          <Badge className="border-indigo-200 bg-indigo-50 py-1 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" aria-hidden="true" />
            Variant B · {experiment.trafficSplitB}%
          </Badge>
        </div>
      </div>
    </Card>
  );
}
