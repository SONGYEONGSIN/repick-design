"use client";

import { useState } from "react";
import { AlertOctagon, AlertTriangle, AlertCircle, CheckCircle2, Wrench } from "lucide-react";
import type { FeedItem, FeedStatus, Severity } from "./data";
import { regionById } from "./data";
import { Avatar, FOCUS_RING } from "./ui";

const SEVERITY_META: Record<Severity, { icon: typeof AlertOctagon; text: string; label: string }> = {
  critical: { icon: AlertOctagon, text: "text-red-400", label: "Critical" },
  major: { icon: AlertTriangle, text: "text-amber-400", label: "Major" },
  minor: { icon: AlertCircle, text: "text-amber-400", label: "Minor" },
  maintenance: { icon: Wrench, text: "text-sky-400", label: "Maintenance" },
  resolved: { icon: CheckCircle2, text: "text-green-400", label: "Resolved" },
};

type FeedTab = "active" | "resolved" | "all";

const TABS: { id: FeedTab; label: string; test: (status: FeedStatus) => boolean }[] = [
  { id: "active", label: "Active", test: (s) => s !== "resolved" },
  { id: "resolved", label: "Resolved", test: (s) => s === "resolved" },
  { id: "all", label: "All", test: () => true },
];

/**
 * The scroll spine. This feed is the ONLY place the pin axis originates from a text selection —
 * clicking an item sets `pinnedRegionId` on the page, which the hex map and region table both read.
 * Deliberately NOT wired from here: the tab filter never touches the map (the map always shows all
 * sixteen regions) and never touches the KPI header row, keeping the fan-out narrow per-item rather
 * than broadcasting a tab change into every sibling widget.
 */
export default function IncidentFeed({
  items,
  pinnedRegionId,
  onPin,
}: {
  items: FeedItem[];
  pinnedRegionId: string;
  onPin: (regionId: string) => void;
}) {
  const [tab, setTab] = useState<FeedTab>("active");
  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0]!;
  const visible = items.filter((item) => activeTab.test(item.status));

  return (
    <div>
      <div role="tablist" aria-label="Incident feed filter" className="flex items-center gap-1 border-b border-white/10">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`feed-tab-${t.id}`}
              aria-selected={active}
              aria-controls="feed-panel"
              onClick={() => setTab(t.id)}
              className={`relative flex h-10 items-center px-3 font-medium text-sm motion-safe:transition-colors ${FOCUS_RING} ${
                active ? "text-zinc-50" : "text-zinc-400 hover:text-zinc-50"
              }`}
            >
              {t.label}
              <span
                className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full ${active ? "bg-green-500" : "bg-transparent"}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <ul
        id="feed-panel"
        role="tabpanel"
        aria-labelledby={`feed-tab-${tab}`}
        className="mt-3 flex flex-col gap-2"
      >
        {visible.length === 0 ? (
          <li className="rounded-lg border border-white/10 px-4 py-8 text-center text-sm text-zinc-400">
            No {activeTab.label.toLowerCase()} incidents right now.
          </li>
        ) : (
          visible.map((item) => {
            const region = regionById(item.regionId);
            const meta = SEVERITY_META[item.severity];
            const Icon = meta.icon;
            const isPinned = item.regionId === pinnedRegionId;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onPin(item.regionId)}
                  className={`flex w-full min-w-0 items-start gap-3 rounded-lg border px-3 py-3 text-left motion-safe:transition-colors ${FOCUS_RING} ${
                    isPinned ? "border-green-400/40 bg-green-400/5" : "border-white/10 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.text}`} aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                      <p className="min-w-0 truncate font-medium text-sm text-zinc-50">{item.title}</p>
                      <p className="shrink-0 font-normal text-xs tabular-nums text-zinc-400">{item.elapsed}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-zinc-400">{item.detail}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className={`font-medium text-xs ${meta.text}`}>{meta.label}</span>
                      <span className="text-xs text-zinc-400">&middot;</span>
                      <span className="font-medium text-xs text-zinc-50">
                        {region ? `${region.code} · ${region.name}` : item.regionId.toUpperCase()}
                      </span>
                      {item.acknowledgedBy ? (
                        <>
                          <span className="text-xs text-zinc-400">&middot;</span>
                          <span className="inline-flex items-center gap-1.5">
                            <Avatar initials={item.acknowledgedBy.initials} className="h-5 w-5 text-[10px]" />
                            <span className="text-xs text-zinc-400">Resolved by {item.acknowledgedBy.name}</span>
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
