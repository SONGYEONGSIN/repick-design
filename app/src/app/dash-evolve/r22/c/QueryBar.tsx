"use client";

import { useEffect, useRef, useState } from "react";
import { BarChart3, Layers, Star } from "lucide-react";
import { DIMENSIONS, METRICS, PERIODS, type DimensionId, type MetricId, type PeriodId } from "./data";
import { FOCUS_RING, Segmented, SelectPopover } from "./ui";

/**
 * The question-assembly bar. Three explicit controls — not a search box —
 * because the "question" here is a triple (metric, dimension, period), and a
 * free-text box would let the user type something the engine can't answer.
 * Every change recomputes the chart + table below in one deterministic pass.
 */
export function QueryBar({
  metric,
  dimension,
  period,
  onMetric,
  onDimension,
  onPeriod,
  saved,
  onToggleSaved,
}: {
  metric: MetricId;
  dimension: DimensionId;
  period: PeriodId;
  onMetric: (id: MetricId) => void;
  onDimension: (id: DimensionId) => void;
  onPeriod: (id: PeriodId) => void;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<"metric" | "dimension" | null>(null);
  const [metricHighlight, setMetricHighlight] = useState(0);
  const [dimensionHighlight, setDimensionHighlight] = useState(0);
  const metricTriggerRef = useRef<HTMLButtonElement>(null);
  const dimensionTriggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    function onDocPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    }
    function onDocKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [openDropdown]);

  const metricOptions = METRICS.map((m) => ({ id: m.id, label: m.label, meta: m.description }));
  const dimensionOptions = DIMENSIONS.map((d) => ({
    id: d.id,
    label: d.groupLabel,
    meta: `${d.categories.length} categories`,
  }));
  const periodOptions = PERIODS.map((p) => ({ id: p.id, label: p.short }));

  return (
    <div ref={rootRef} className="grid grid-cols-12 items-end gap-3">
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <SelectPopover
          id="qb-metric"
          label="Metric"
          icon={<BarChart3 size={16} className="shrink-0 text-zinc-400" aria-hidden="true" />}
          value={metric}
          options={metricOptions}
          onChange={(id) => onMetric(id as MetricId)}
          open={openDropdown === "metric"}
          onOpenChange={(o) => setOpenDropdown(o ? "metric" : null)}
          highlight={metricHighlight}
          onHighlightChange={setMetricHighlight}
          triggerRef={metricTriggerRef}
        />
      </div>
      <div className="col-span-12 sm:col-span-6 lg:col-span-3">
        <SelectPopover
          id="qb-dimension"
          label="Break down by"
          icon={<Layers size={16} className="shrink-0 text-zinc-400" aria-hidden="true" />}
          value={dimension}
          options={dimensionOptions}
          onChange={(id) => onDimension(id as DimensionId)}
          open={openDropdown === "dimension"}
          onOpenChange={(o) => setOpenDropdown(o ? "dimension" : null)}
          highlight={dimensionHighlight}
          onHighlightChange={setDimensionHighlight}
          triggerRef={dimensionTriggerRef}
        />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-zinc-400">Period</span>
        <Segmented ariaLabel="Period" options={periodOptions} value={period} onChange={onPeriod} />
      </div>
      <div className="col-span-12 flex justify-start lg:col-span-2 lg:justify-end">
        <button
          type="button"
          aria-pressed={saved}
          onClick={onToggleSaved}
          className={`flex h-11 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium ${FOCUS_RING} ${
            saved
              ? "border-[rgba(57,135,229,0.32)] bg-[rgba(57,135,229,0.14)] text-[#8ab6f2]"
              : "border-white/10 bg-zinc-950/60 text-zinc-300 hover:border-white/20"
          }`}
        >
          <Star size={16} aria-hidden="true" fill={saved ? "currentColor" : "none"} />
          {saved ? "Saved" : "Save question"}
        </button>
      </div>
    </div>
  );
}
