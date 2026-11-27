"use client";

import { useState } from "react";
import {
  HOURS,
  SLOT_MAP,
  slotKey,
  RESOURCE_TYPE_LABEL,
  fmtUsd,
  type Day,
  type Resource,
  type Slot,
} from "./data";
import { FOCUS } from "./ui";

function cellTone(status: Slot["status"] | "open") {
  if (status === "booked") return "bg-indigo-500/70 hover:bg-indigo-400";
  if (status === "hold") return "bg-amber-500/60 hover:bg-amber-400/80";
  return "bg-white/[0.04] hover:bg-white/10";
}

function cellLabel(resource: Resource, day: Day, hour: number, slot: Slot | undefined) {
  const time = `${hour}:00`;
  if (!slot) return `${resource.name}, ${day} ${time} — open`;
  if (slot.status === "hold") return `${resource.name}, ${day} ${time} — tentative hold for ${slot.client}, ${slot.project}`;
  return `${resource.name}, ${day} ${time} — booked by ${slot.client}, ${slot.project}`;
}

function cellSummary(resource: Resource, hour: number, slot: Slot | undefined) {
  if (!slot) return `${resource.shortName} at ${hour}:00 is open — ${fmtUsd(resource.hourlyRate)}/hr`;
  return `${resource.shortName} at ${hour}:00 — ${slot.client}, ${slot.project}`;
}

export function ScheduleGrid({
  day,
  resources,
  selectedKey,
  onSelect,
}: {
  day: Day;
  resources: Resource[];
  selectedKey: string | null;
  onSelect: (args: { key: string; slot: Slot | undefined; resource: Resource; hour: number }) => void;
}) {
  // Hover/focus state lives here, one level up from each cell, and renders into a single status
  // strip above the grid rather than a per-cell absolutely-positioned tooltip — the latter made
  // every <td> contribute its (non-clipped) floating content to the table's own scrollWidth,
  // which silently forced `table-overflow` at several desktop widths even though every column
  // was correctly sized by table-fixed + colgroup%. One shared strip reads cleanly for sighted,
  // keyboard and screen-reader users alike, and cannot push the table wider than its columns.
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-w-0">
      <p aria-live="polite" className="mb-2 h-4 truncate text-xs font-normal text-slate-400">
        {hovered ?? "Hover or focus a cell to preview its booking here."}
      </p>
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          Resource availability for {day}, 9:00 to 16:00. Each cell shows one hour of one resource — select a cell for
          details.
        </caption>
        <colgroup>
          <col style={{ width: "19%" }} />
          {HOURS.map((h) => (
            <col key={h} style={{ width: `${(81 / HOURS.length).toFixed(2)}%` }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th scope="col" className="px-2 py-1.5 text-left text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Resource
            </th>
            {HOURS.map((h) => (
              <th key={h} scope="col" className="px-1 py-1.5 text-center text-[11px] font-normal tabular-nums text-slate-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <th
                scope="row"
                className="px-2 py-1 text-left align-middle text-xs font-medium text-slate-200"
                title={resource.name}
              >
                <span className="block truncate">{resource.shortName}</span>
                <span className="block truncate text-[10px] font-normal text-slate-400">
                  {RESOURCE_TYPE_LABEL[resource.type]}
                </span>
              </th>
              {HOURS.map((hour) => {
                const key = slotKey(resource.id, day, hour);
                const slot = SLOT_MAP.get(key);
                const isSelected = selectedKey === key;
                const summary = cellSummary(resource, hour, slot);
                return (
                  <td key={key} className="p-0.5 align-middle">
                    <button
                      type="button"
                      onClick={() => onSelect({ key, slot, resource, hour })}
                      onMouseEnter={() => setHovered(summary)}
                      onMouseLeave={() => setHovered(null)}
                      onFocus={() => setHovered(summary)}
                      onBlur={() => setHovered(null)}
                      aria-pressed={isSelected}
                      aria-label={cellLabel(resource, day, hour, slot)}
                      className={`flex h-9 w-full min-w-6 items-center justify-center rounded-md text-[10px] font-medium tabular-nums text-white transition-colors ${FOCUS} ${cellTone(
                        slot?.status ?? "open",
                      )} ${isSelected ? "ring-2 ring-inset ring-white" : ""}`}
                    >
                      {slot?.status === "booked" ? "B" : slot?.status === "hold" ? "H" : ""}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
