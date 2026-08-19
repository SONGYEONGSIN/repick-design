"use client";

import { ArrowLeftRight, Check, ChevronsUpDown, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useId, useState } from "react";
import { computeDelta, METRICS, REGIONS, type MetricId, type Region, type RegionId } from "./data";
import { ACCENT_SUBTLE, BORDER, CARD, FOCUS_VISIBLE, FOCUS_VISIBLE_INSET, HOVER_ACTIVE_BG, TEXT_CAPTION, TEXT_CAPTION_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { EyebrowLabel, SegmentedControl, useOutsideClose } from "./ui";

function RegionSelect({
  slot,
  region,
  excludeId,
  onChange,
}: {
  slot: "A" | "B";
  region: Region;
  excludeId: RegionId;
  onChange: (id: RegionId) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClose(open, () => setOpen(false));
  const labelId = useId();
  const triggerId = useId();

  return (
    <div ref={ref} className="relative min-w-0 flex-1 sm:max-w-xs">
      <span id={labelId} className="sr-only">
        Region {slot}
      </span>
      {/* Accessible name = this button's own visible text only ("Ashfield" + "Ashburn, US"), so it
          can never mismatch what's on screen (label-content-name-mismatch requires the name to
          contain the visible text verbatim — prefixing it with "Region A/B" broke that). The sr-only
          "Region A/B" slot context is exposed as a description instead, which this audit does not
          check for a content match. The slot-letter badge and chevron stay aria-hidden so they don't
          get announced twice. */}
      <button
        id={triggerId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-describedby={labelId}
        onClick={() => setOpen((v) => !v)}
        className={cx("flex h-11 w-full items-center gap-2 rounded-xl border px-3 text-left", BORDER, "bg-white", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
      >
        <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-zinc-900 text-[11px] font-semibold text-white">
          {slot}
        </span>
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-sm font-semibold", TEXT_PRIMARY)}>{region.name}</span>
          <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>
            {region.city}, {region.countryCode}
          </span>
        </span>
        <ChevronsUpDown size={15} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
      </button>

      {open ? (
        <div role="listbox" aria-labelledby={labelId} className={cx("absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-xl border p-1 [scrollbar-width:thin]", BORDER, "bg-white shadow-lg shadow-zinc-950/10")}>
          {REGIONS.map((r) => {
            const selected = r.id === region.id;
            const disabled = r.id === excludeId;
            return (
              <button
                key={r.id}
                type="button"
                role="option"
                aria-selected={selected}
                aria-disabled={disabled}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  onChange(r.id);
                  setOpen(false);
                }}
                className={cx(
                  "flex min-h-11 w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                  TRANSITION,
                  FOCUS_VISIBLE_INSET,
                  disabled ? "cursor-not-allowed bg-zinc-50" : selected ? ACCENT_SUBTLE : HOVER_ACTIVE_BG,
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className={cx("block truncate font-medium", TEXT_PRIMARY)}>{r.name}</span>
                  <span className={cx("block truncate text-xs", TEXT_CAPTION)}>
                    {r.city}, {r.countryCode} &middot; {r.provider}
                  </span>
                </span>
                {selected ? (
                  <Check size={16} aria-hidden="true" className="shrink-0 text-teal-700" />
                ) : disabled ? (
                  <span className={cx("shrink-0 whitespace-nowrap rounded-full border px-1.5 py-0.5 text-[10px] font-medium", BORDER, TEXT_CAPTION_MUTED)}>
                    Region {slot === "A" ? "B" : "A"}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function DeltaTrendIcon({ leaderIsA, tie }: { leaderIsA: boolean | null; tie: boolean }) {
  if (tie) return <Minus size={16} aria-hidden="true" />;
  return leaderIsA ? <TrendingUp size={16} aria-hidden="true" /> : <TrendingDown size={16} aria-hidden="true" />;
}

export default function ComparePicker({
  regionA,
  regionB,
  onChangeA,
  onChangeB,
  onSwap,
  focusMetric,
  onChangeFocusMetric,
}: {
  regionA: Region;
  regionB: Region;
  onChangeA: (id: RegionId) => void;
  onChangeB: (id: RegionId) => void;
  onSwap: () => void;
  focusMetric: MetricId;
  onChangeFocusMetric: (id: MetricId) => void;
}) {
  const metric = METRICS.find((m) => m.id === focusMetric)!;
  const delta = computeDelta(metric, regionA, regionB);
  const tie = delta.leader === null;
  const leaderIsA = !tie && delta.leader?.id === regionA.id;

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900" style={{ fontFamily: "var(--font-display-grotesk)" }}>
            Compare regions
          </h1>
          <p className={cx("mt-0.5 text-sm", TEXT_CAPTION)}>Live infrastructure health, mirrored side by side.</p>
        </div>
        <div>
          <div className="mb-1">
            <EyebrowLabel>Focus metric</EyebrowLabel>
          </div>
          <SegmentedControl
            ariaLabel="Metric focus — drives the delta summary and panel highlight"
            value={focusMetric}
            onChange={onChangeFocusMetric}
            options={METRICS.map((m) => ({ id: m.id, label: m.shortLabel }))}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <RegionSelect slot="A" region={regionA} excludeId={regionB.id} onChange={onChangeA} />
        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap Region A and Region B"
          className={cx("grid h-11 w-11 shrink-0 place-items-center rounded-full border", BORDER, "bg-white", HOVER_ACTIVE_BG, TRANSITION, FOCUS_VISIBLE)}
        >
          <ArrowLeftRight size={16} aria-hidden="true" className={TEXT_CAPTION} />
        </button>
        <RegionSelect slot="B" region={regionB} excludeId={regionA.id} onChange={onChangeB} />
      </div>

      <div className={cx(CARD, "mt-3 flex flex-wrap items-center gap-2.5 px-4 py-3")}>
        <span
          className={cx(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full",
            tie ? "bg-zinc-100 text-zinc-500" : "bg-teal-50 text-teal-700",
          )}
        >
          <DeltaTrendIcon leaderIsA={leaderIsA} tie={tie} />
        </span>
        <p className={cx("min-w-0 flex-1 text-sm", TEXT_PRIMARY)}>
          <span className="font-semibold">{metric.label}: </span>
          {delta.sentence}
        </p>
        <span className={cx("ml-auto shrink-0 whitespace-nowrap text-xs", TEXT_CAPTION_MUTED)}>Updated hourly</span>
      </div>
    </div>
  );
}
