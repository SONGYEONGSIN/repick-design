"use client";

import { useState } from "react";
import Image from "next/image";
import { Info, PackageSearch, Users, ShieldAlert } from "lucide-react";
import {
  fromISO,
  capacityFor,
  rowsForDay,
  isWithinOperatingWeek,
  inspectorById,
  formatLong,
  currency,
  TODAY_ISO,
  TIER_CLASSES,
  TIER_LABEL,
} from "./data";
import { Card, Badge, Progress, Tabs, statusTone, riskTone } from "./ui";

type PanelTab = "items" | "inspectors" | "risk";

export function DayDetailPanel({ selectedIso }: { selectedIso: string }) {
  const [tab, setTab] = useState<PanelTab>("items");
  const civil = fromISO(selectedIso);
  const cap = capacityFor(civil);
  const rows = rowsForDay(selectedIso);
  const hasDetail = isWithinOperatingWeek(selectedIso);
  const tone = TIER_CLASSES[cap.tier];
  const isToday = selectedIso === TODAY_ISO;

  const uniqueInspectorIds = Array.from(new Set(rows.map((r) => r.inspectorId)));
  const riskCounts = { Low: 0, Medium: 0, High: 0 } as Record<"Low" | "Medium" | "High", number>;
  rows.forEach((r) => riskCounts[r.risk]++);

  return (
    <Card className="flex h-full flex-col" padded={false}>
      <div className="border-b border-zinc-100 p-5">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400">Pinned day</p>
          {isToday ? <Badge tone="teal">Today</Badge> : null}
        </div>
        <h2 className="text-[16px] font-semibold text-zinc-900">{formatLong(civil)}</h2>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[20px] font-semibold tabular-nums text-zinc-900">
            {cap.hoursBooked}h <span className="text-[13px] font-normal text-zinc-400">/ {cap.capacityMax}h</span>
          </span>
          <Badge tone={cap.tier === "over" ? "red" : cap.tier === "busy" ? "amber" : "neutral"} dotClassName={tone.bar}>
            {TIER_LABEL[cap.tier]}
          </Badge>
        </div>
        <Progress
          value={cap.hoursBooked}
          max={Math.max(cap.capacityMax, 1)}
          label={`${cap.hoursBooked} of ${cap.capacityMax} inspector hours booked`}
          barClassName={tone.bar}
          className="mt-2"
        />
        <p className="mt-1.5 text-[12px] text-zinc-500">
          {cap.pickupCount} {cap.pickupCount === 1 ? "pickup" : "pickups"} scheduled across inspector capacity of{" "}
          {cap.capacityMax}h.
        </p>
      </div>

      {hasDetail ? (
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="px-5 pt-3">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { value: "items", label: `Items (${rows.length})` },
                { value: "inspectors", label: `Inspectors (${uniqueInspectorIds.length})` },
                { value: "risk", label: "Risk" },
              ]}
            />
          </div>

          <div className="flex-1 overflow-y-auto p-5 pt-4">
            {tab === "items" ? (
              rows.length > 0 ? (
                <ul className="space-y-2.5">
                  {rows.map((r) => (
                    <li key={r.id} className="flex items-start gap-3 rounded-lg border border-zinc-100 p-2.5">
                      <span className="w-11 shrink-0 pt-0.5 text-[11.5px] tabular-nums text-zinc-500">{r.time}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-zinc-900">{r.item}</p>
                        <p className="truncate text-[11.5px] text-zinc-500">
                          {r.seller} · {inspectorById(r.inspectorId).name}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[12px] font-medium tabular-nums text-zinc-900">{currency(r.estValue)}</p>
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={PackageSearch} text="No pickups scheduled — inspection bays closed." />
              )
            ) : null}

            {tab === "inspectors" ? (
              uniqueInspectorIds.length > 0 ? (
                <ul className="space-y-2.5">
                  {uniqueInspectorIds.map((id) => {
                    const insp = inspectorById(id);
                    const count = rows.filter((r) => r.inspectorId === id).length;
                    const minutes = rows.filter((r) => r.inspectorId === id).reduce((s, r) => s + r.durationMin, 0);
                    return (
                      <li key={id} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-2.5">
                        <Image
                          src={`https://picsum.photos/seed/${insp.avatarSeed}/64/64`}
                          alt={`${insp.name} avatar`}
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-zinc-900">{insp.name}</p>
                          <p className="truncate text-[11.5px] text-zinc-500">{insp.role}</p>
                        </div>
                        <div className="shrink-0 text-right text-[11.5px] tabular-nums text-zinc-500">
                          {count} {count === 1 ? "item" : "items"} · {minutes}m
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <EmptyState icon={Users} text="No inspectors assigned for this day." />
              )
            ) : null}

            {tab === "risk" ? (
              rows.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {(["Low", "Medium", "High"] as const).map((level) => (
                      <div key={level} className="rounded-lg border border-zinc-100 p-2.5 text-center">
                        <p className="text-[18px] font-semibold tabular-nums text-zinc-900">{riskCounts[level]}</p>
                        <Badge tone={riskTone(level)}>{level}</Badge>
                      </div>
                    ))}
                  </div>
                  {riskCounts.High > 0 ? (
                    <ul className="space-y-2">
                      {rows
                        .filter((r) => r.risk === "High")
                        .map((r) => (
                          <li key={r.id} className="flex items-center gap-2.5 rounded-lg bg-red-50 p-2.5">
                            <ShieldAlert className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
                            <span className="min-w-0 flex-1 truncate text-[12.5px] text-red-800">
                              {r.item} — grading backlog risk, verify condition photos before {r.status.toLowerCase()}.
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : null}
                </div>
              ) : (
                <EmptyState icon={ShieldAlert} text="No grading risk to review for this day." />
              )
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center p-5">
          <EmptyState
            icon={Info}
            text={
              cap.capacityMax === 0
                ? "Inspection bays closed this day — no capacity allocated."
                : "Outside the current operating week — capacity is a projection. Itemized pickups appear once logged."
            }
          />
        </div>
      )}
    </Card>
  );
}

function EmptyState({ icon: Icon, text }: { icon: typeof Info; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-zinc-200 px-4 py-8 text-center">
      <Icon className="h-5 w-5 text-zinc-300" aria-hidden />
      <p className="max-w-[220px] text-[12.5px] text-zinc-500">{text}</p>
    </div>
  );
}
