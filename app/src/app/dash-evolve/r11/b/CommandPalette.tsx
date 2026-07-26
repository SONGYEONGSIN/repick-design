"use client";

import { ArrowDown, ArrowUp, CornerDownLeft, Equal, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import type { BridgeBar, DriverRow, MetricId, SegmentId, StepKey } from "./data";
import { formatMetricSigned } from "./data";
import { BORDER, FOCUS_RING, TEXT_CAPTION, TEXT_PRIMARY, cx } from "./tokens";

type ResultItem =
  | { kind: "step"; id: StepKey; label: string; hint: string; icon: "up" | "down" | "eq" }
  | { kind: "segment"; id: SegmentId; label: string; hint: string; icon: "seg" };

export default function CommandPalette({
  bars,
  driverRows,
  metric,
  onClose,
  onSelectStep,
}: {
  bars: BridgeBar[];
  driverRows: DriverRow[];
  metric: MetricId;
  onClose: () => void;
  onSelectStep: (key: StepKey) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const segmentTopStep = useMemo(() => {
    const map = new Map<SegmentId, StepKey>();
    for (const row of driverRows) {
      const cur = map.get(row.segmentId);
      const curRow = cur ? driverRows.find((r) => r.segmentId === row.segmentId && r.step === cur) : undefined;
      if (!curRow || Math.abs(row.amount) > Math.abs(curRow.amount)) map.set(row.segmentId, row.step);
    }
    return map;
  }, [driverRows]);

  const allItems: ResultItem[] = useMemo(() => {
    const stepItems: ResultItem[] = bars.map((b) => ({
      kind: "step",
      id: b.key,
      label: b.label,
      hint: b.kind === "anchor" ? `Total · running balance ${formatMetricSigned(metric, b.cumulativeAfter, true)}` : `${formatMetricSigned(metric, b.signedValue, true)} · running total ${formatMetricSigned(metric, b.cumulativeAfter, true)}`,
      icon: b.kind === "anchor" ? "eq" : b.kind === "positive" ? "up" : "down",
    }));
    const segmentItems: ResultItem[] = Array.from(segmentTopStep.entries()).map(([segId, step]) => {
      const row = driverRows.find((r) => r.segmentId === segId && r.step === step);
      return {
        kind: "segment",
        id: segId,
        label: row?.segmentLabel ?? segId,
        hint: `Top driver: ${row?.stepLabel ?? step} · ${row ? formatMetricSigned(metric, row.amount, true) : ""}`,
        icon: "seg",
      };
    });
    return [...stepItems, ...segmentItems];
  }, [bars, driverRows, metric, segmentTopStep]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? allItems.filter((it) => it.label.toLowerCase().includes(q) || it.hint.toLowerCase().includes(q)) : allItems;
    return pool.slice(0, 11);
  }, [query, allItems]);

  function handleQueryChange(next: string) {
    setQuery(next);
    setActive(0);
  }

  function choose(idx: number) {
    const it = results[idx];
    if (!it) return;
    if (it.kind === "step") onSelectStep(it.id);
    else onSelectStep(segmentTopStep.get(it.id) ?? "new");
    onClose();
  }

  function onKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(active);
    }
  }

  const iconFor = (icon: ResultItem["icon"]) => (icon === "up" ? ArrowUp : icon === "down" ? ArrowDown : icon === "eq" ? Equal : Search);
  const kindTag: Record<ResultItem["kind"], string> = { step: "BAR", segment: "SEG" };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
      <button type="button" aria-label="Close command palette" onClick={onClose} className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm" />
      <div role="dialog" aria-modal="true" aria-label="Search bridge drivers and segments" onKeyDown={onKeyDown} className={cx("relative w-full max-w-lg overflow-hidden rounded-2xl border shadow-xl", BORDER, "bg-white dark:bg-zinc-900 dark:shadow-black/50")}>
        <div className={cx("flex items-center gap-2 border-b px-3.5", BORDER)}>
          <Search size={17} aria-hidden="true" className={TEXT_CAPTION} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search bridge bars, segments"
            aria-label="Search query"
            className={cx("h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400", TEXT_PRIMARY)}
          />
          <button type="button" onClick={onClose} aria-label="Close" className={cx("grid h-8 w-8 place-items-center rounded-lg", TEXT_CAPTION, "hover:bg-zinc-100 dark:hover:bg-white/5", FOCUS_RING)}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <ul className="max-h-[46vh] overflow-y-auto p-1.5 [scrollbar-width:thin]">
          {results.length === 0 ? (
            <li className={cx("px-3 py-6 text-center text-sm", TEXT_CAPTION)}>No results.</li>
          ) : (
            results.map((it, i) => {
              const Icon = iconFor(it.icon);
              return (
                <li key={`${it.kind}-${it.id}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(i)}
                    aria-current={i === active}
                    className={cx("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left", i === active ? "bg-[#A16207]/10" : "hover:bg-zinc-50 dark:hover:bg-white/5")}
                  >
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      <Icon size={13} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={cx("block truncate text-sm font-medium", TEXT_PRIMARY)}>{it.label}</span>
                      <span className={cx("block truncate text-xs", TEXT_CAPTION)}>{it.hint}</span>
                    </span>
                    <span className={cx("shrink-0 text-[10px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>{kindTag[it.kind]}</span>
                    {i === active ? <CornerDownLeft size={14} aria-hidden="true" className={TEXT_CAPTION} /> : null}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <div className={cx("flex items-center justify-between border-t px-3.5 py-2 text-[11px]", BORDER, TEXT_CAPTION)}>
          <span>Jump to a bridge bar or segment</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </div>
  );
}
