"use client";

import { AlertTriangle, Pin, Rocket, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { FEED_ITEMS, type FeedItem, type FeedType, regionById } from "./data";
import { BORDER, FOCUS, TEXT_AUX, TEXT_PRIMARY, TONE_BADGE, TRANSITION, cx } from "./tokens";
import { Card, CardHead, Segmented } from "./ui";

const FILTERS: { id: FeedType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "incident", label: "Incidents" },
  { id: "deployment", label: "Deployments" },
  { id: "spike", label: "Spikes" },
];

const TYPE_ICON = { incident: AlertTriangle, deployment: Rocket, spike: TrendingUp } as const;
const TYPE_LABEL = { incident: "Incident", deployment: "Deployment", spike: "Traffic spike" } as const;

/**
 * The feed's one and only effect on the rest of the page: calling `onPinRegion`, which the
 * orchestrator threads to exactly one consumer (the map panel). Clicking an item also sets
 * `activeId` here, purely local, so the clicked row stays visibly selected within this
 * component's own scroll list — that local highlight is not a second external consumer of the
 * pin, it never leaves this component.
 */
export function RegionFeed({ onPinRegion }: { onPinRegion: (regionId: string) => void }) {
  const [filter, setFilter] = useState<FeedType | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const items = useMemo(() => (filter === "all" ? FEED_ITEMS : FEED_ITEMS.filter((f) => f.type === filter)), [filter]);

  function handleClick(item: FeedItem) {
    setActiveId(item.id);
    onPinRegion(item.regionId);
  }

  return (
    <Card id="feed" className="flex h-full flex-col" padded={false}>
      <div className="p-4 pb-3 sm:p-5 sm:pb-3">
        <CardHead
          title="Regional activity"
          hint="Live stream of incidents, deployments and traffic spikes across all regions. Select an item to pin its region on the map."
        />
        <div className="mt-3">
          <Segmented options={FILTERS} value={filter} onChange={setFilter} ariaLabel="Filter activity feed" />
        </div>
      </div>

      <ul className={cx("flex-1 overflow-y-auto border-t", BORDER)} style={{ maxHeight: 560 }}>
        {items.map((item) => {
          const Icon = TYPE_ICON[item.type];
          const region = regionById(item.regionId);
          const active = item.id === activeId;
          return (
            <li key={item.id} className={cx("border-b last:border-b-0", BORDER)}>
              <button
                type="button"
                onClick={() => handleClick(item)}
                aria-pressed={active}
                className={cx("flex w-full items-start gap-3 px-4 py-3 text-left sm:px-5", TRANSITION, FOCUS, active ? "bg-sky-400/10" : "hover:bg-white/5")}
              >
                <span aria-hidden="true" className={cx("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border", TONE_BADGE[item.tone])}>
                  <Icon size={13} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{item.title}</span>
                    <span className={cx("shrink-0 text-[11px] font-normal tabular-nums", TEXT_AUX)}>{item.time}</span>
                  </span>
                  <span className={cx("mt-0.5 block text-xs font-normal leading-relaxed", TEXT_AUX)}>{item.detail}</span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className={cx("rounded-full border px-1.5 py-0.5 text-[10px] font-medium", TONE_BADGE[item.tone])}>{TYPE_LABEL[item.type]}</span>
                    <span className={cx("inline-flex items-center gap-1 text-[11px] font-medium", active ? "text-sky-300" : TEXT_AUX)}>
                      {active ? <Pin size={10} aria-hidden="true" /> : null}
                      {region?.code ?? "—"} · {region?.name ?? "Unknown region"}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
