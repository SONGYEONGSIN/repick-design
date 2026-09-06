"use client";

import { AlertTriangle, Pin, PinOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { formatHoursAgo, formatInt, formatUSD, scanTrailOf, valueImpactOf, varianceOf, type ReconLine } from "./data";
import { BORDER, FOCUS, NUM, STATUS_BADGE, STATUS_LABEL, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Badge, Card, Progress, Tabs } from "./ui";

type Tab = "summary" | "trail";

/**
 * The other half of the branched selection pattern: clicking a row's pin button lands here and
 * *only* here — the header hero strip above and the grid below stay exactly as they were. Pinning
 * is for cross-referencing one line while you keep working the full list, not for filtering it.
 */
export default function PinnedTray({
  line,
  isFilteredOut,
  onUnpin,
  onClearFilters,
}: {
  line: ReconLine | null;
  isFilteredOut: boolean;
  onUnpin: () => void;
  onClearFilters: () => void;
}) {
  const [tab, setTab] = useState<Tab>("summary");

  if (!line) {
    return (
      <div className={cx("flex h-11 items-center gap-2 rounded-xl border border-dashed px-4", BORDER, TEXT_AUX)}>
        <PinOff size={14} aria-hidden="true" />
        <p className="text-xs font-normal">No line pinned — use the pin icon on any grid row to cross-reference it here.</p>
      </div>
    );
  }

  const variance = varianceOf(line);
  const value = valueImpactOf(line);
  const trail = scanTrailOf(line);

  return (
    <Card padded={false} className="overflow-hidden">
      {isFilteredOut ? (
        <div className={cx("flex flex-wrap items-center gap-2 border-b bg-orange-500/10 px-4 py-2 text-orange-300", BORDER)}>
          <AlertTriangle size={14} aria-hidden="true" className="shrink-0" />
          <p className="text-xs font-medium">Pinned line is hidden by the grid&rsquo;s current filter — out of sync with what&rsquo;s shown below.</p>
          <button type="button" onClick={onClearFilters} className={cx("ml-auto shrink-0 rounded-lg border border-orange-400/30 px-2.5 py-1 text-[11px] font-semibold text-orange-200", TRANSITION, FOCUS, "hover:bg-orange-500/10")}>
            Clear filters
          </button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-blue-300")}>
            <Pin size={15} aria-hidden="true" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{line.title}</p>
            <p className={cx("truncate font-mono text-[11px] font-normal", TEXT_AUX)}>{`${line.sku} · ${line.warehouse} · ${line.category}`}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Badge className={STATUS_BADGE[line.status]}>{STATUS_LABEL[line.status]}</Badge>
          <button type="button" onClick={onUnpin} className={cx("flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-semibold", BORDER, SURFACE_INSET, TEXT_SECONDARY, TRANSITION, FOCUS, "hover:bg-white/[0.06]")}>
            <PinOff size={12} aria-hidden="true" />
            Unpin
          </button>
        </div>
      </div>

      <div className="mt-3 px-4">
        <Tabs<Tab> ariaLabel="Pinned line detail" value={tab} onChange={setTab} options={[{ id: "summary", label: "Summary" }, { id: "trail", label: "Scan trail" }]} />
      </div>

      {tab === "summary" ? (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-4 sm:grid-cols-4">
          <div className="min-w-0">
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Expected / scanned</dt>
            <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{`${formatInt(line.expected)} / ${formatInt(line.scanned)}`}</dd>
          </div>
          <div className="min-w-0">
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Variance</dt>
            <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{variance > 0 ? `+${formatInt(variance)} units` : `${formatInt(variance)} units`}</dd>
          </div>
          <div className="min-w-0">
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Value impact</dt>
            <dd className={cx("mt-1 text-sm font-semibold", NUM, TEXT_PRIMARY)}>{formatUSD(value)}</dd>
          </div>
          <div className="min-w-0">
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Match confidence</dt>
            <dd className="mt-1.5 flex items-center gap-2">
              <Progress value={line.confidence} label="Match confidence" tone={line.status === "missing" ? "danger" : line.status === "matched" ? "ok" : "accent"} />
              <span className={cx("shrink-0 text-xs font-semibold", NUM, TEXT_PRIMARY)}>{`${line.confidence}%`}</span>
            </dd>
          </div>
          <div className="col-span-2 min-w-0 sm:col-span-4">
            <dt className={cx("text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>Reviewer</dt>
            <dd className="mt-1.5 flex items-center gap-1.5">
              <Image
                src={`https://images.unsplash.com/photo-${line.reviewer.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 rounded-full bg-zinc-800 object-cover"
              />
              <span className={cx("text-sm font-normal", TEXT_SECONDARY)}>{line.reviewer.name}</span>
              <span className={cx("ml-2 text-xs font-normal", TEXT_MUTED)}>{`Last scan ${formatHoursAgo(line.lastScanHoursAgo)}`}</span>
            </dd>
          </div>
        </dl>
      ) : (
        <ul className="flex flex-col gap-1.5 px-4 py-4">
          {trail.map((ev, i) => (
            <li key={i} className={cx("flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs", BORDER, SURFACE_INSET)}>
              <span className={TEXT_SECONDARY}>{`${formatHoursAgo(ev.hoursAgo)} · ${line.warehouse}`}</span>
              <span className={cx(NUM, "font-medium", TEXT_PRIMARY)}>{`+${formatInt(ev.units)} units scanned`}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
