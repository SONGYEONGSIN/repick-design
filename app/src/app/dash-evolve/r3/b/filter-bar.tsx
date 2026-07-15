"use client";

import { ListFilter } from "lucide-react";
import { ZONES, type ZoneId } from "./data";
import { ALL_STATUS_OPTIONS } from "./status-meta";
import { ChipToggle, Popover } from "./ui";
import { cn, FOCUS_RING } from "./cn";

export function FilterBar({
  activeZone,
  onZoneChange,
  selectedStatuses,
  onToggleStatus,
  onSelectAllStatuses,
}: {
  activeZone: ZoneId | "all";
  onZoneChange: (zone: ZoneId | "all") => void;
  selectedStatuses: Set<string>;
  onToggleStatus: (key: string) => void;
  onSelectAllStatuses: () => void;
}) {
  const activeCount = selectedStatuses.size;
  const totalCount = ALL_STATUS_OPTIONS.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div
        className="flex min-w-0 flex-1 flex-wrap gap-1.5"
        role="group"
        aria-label="Filter map and history by zone"
      >
        <ChipToggle active={activeZone === "all"} onClick={() => onZoneChange("all")}>
          All zones
        </ChipToggle>
        {ZONES.map((zone) => (
          <ChipToggle
            key={zone.id}
            active={activeZone === zone.id}
            onClick={() => onZoneChange(zone.id)}
          >
            {zone.name}
          </ChipToggle>
        ))}
      </div>

      <Popover
        label={
          <span>
            Status
            {activeCount < totalCount ? (
              <span className="ml-1.5 tabular-nums text-cyan-300">({activeCount})</span>
            ) : null}
          </span>
        }
        icon={ListFilter}
        align="right"
      >
        {() => (
          <div className="w-64">
            <div className="flex items-center justify-between px-2 pb-1.5 pt-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Filter by status
              </p>
              <button
                type="button"
                onClick={onSelectAllStatuses}
                className={cn(FOCUS_RING, "rounded px-1.5 py-0.5 text-xs font-medium text-cyan-300 hover:underline")}
              >
                Select all
              </button>
            </div>
            <ul className="space-y-0.5">
              {ALL_STATUS_OPTIONS.map(({ key, meta, domain }) => {
                const checked = selectedStatuses.has(key);
                const Icon = meta.icon;
                return (
                  <li key={key}>
                    <label
                      className={cn(
                        FOCUS_RING,
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-200 hover:bg-white/5",
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleStatus(key)}
                        className="size-3.5 shrink-0 rounded border-white/20 bg-transparent accent-cyan-400"
                      />
                      <Icon aria-hidden="true" className={cn("size-3.5 shrink-0", meta.text)} />
                      <span className="flex-1">{meta.label}</span>
                      <span className="text-[10px] uppercase tracking-wide text-zinc-400">
                        {domain === "both" ? "fleet + history" : domain === "vehicle" ? "fleet" : "history"}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </Popover>
    </div>
  );
}
