"use client";

import { Pin } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ACTIVE_ROUTES, ZONES } from "./data";
import { BORDER, FOCUS, STATUS_BADGE, STATUS_ICON, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { CardHead, Progress, Segmented } from "./ui";

type SortKey = "priority" | "eta";
const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "eta", label: "ETA" },
];

// Priority sort deliberately ranks "at-risk"/"delayed" above "on-time" so the rail always surfaces
// what a dispatcher needs to look at first, independent of whichever route happens to be pinned.
const PRIORITY_RANK: Record<string, number> = { delayed: 0, "at-risk": 1, "on-time": 2, completed: 3 };

export default function RouteRail({
  pinnedRouteId,
  hoveredRouteId,
  onHoverRoute,
  onLeaveRoute,
  onTogglePin,
}: {
  pinnedRouteId: string | null;
  hoveredRouteId: string | null;
  onHoverRoute: (id: string) => void;
  onLeaveRoute: () => void;
  onTogglePin: (id: string) => void;
}) {
  const [sort, setSort] = useState<SortKey>("priority");

  const rows = useMemo(() => {
    const copy = [...ACTIVE_ROUTES];
    if (sort === "priority") copy.sort((a, b) => PRIORITY_RANK[a.status] - PRIORITY_RANK[b.status]);
    else copy.sort((a, b) => a.etaLabel.localeCompare(b.etaLabel));
    return copy;
  }, [sort]);

  return (
    <div className="flex h-full flex-col">
      <CardHead
        title="Active queue"
        hint={`${ACTIVE_ROUTES.length} routes still moving today`}
        action={<Segmented options={SORT_OPTIONS} value={sort} onChange={setSort} ariaLabel="Sort active queue" />}
      />

      <ul className="mt-3 flex max-h-[420px] flex-col gap-1.5 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
        {rows.map((route) => {
          const zone = ZONES.find((z) => z.id === route.zoneId)!;
          const StatusIcon = STATUS_ICON[route.status];
          const pinned = pinnedRouteId === route.id;
          const hovered = hoveredRouteId === route.id;
          return (
            <li key={route.id}>
              <div
                onMouseEnter={() => onHoverRoute(route.id)}
                onMouseLeave={onLeaveRoute}
                className={cx(
                  "flex items-center gap-2.5 rounded-xl border p-2.5",
                  TRANSITION,
                  pinned ? "border-blue-400/40 bg-blue-400/[0.07]" : hovered ? cx(BORDER, "bg-white/[0.05]") : cx(BORDER, "bg-transparent"),
                )}
              >
                <Image
                  src={`https://images.unsplash.com/photo-${route.avatarId}?w=64&h=64&fit=crop&crop=faces`}
                  alt=""
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px] shrink-0 rounded-full bg-zinc-800 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cx("text-xs font-semibold", TEXT_PRIMARY)}>{route.id}</span>
                    <span className={cx("truncate text-[11px] font-normal", TEXT_AUX)}>{zone.name}</span>
                    <span className={cx("ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium", STATUS_BADGE[route.status])}>
                      <StatusIcon size={10} aria-hidden="true" />
                      {STATUS_LABEL[route.status]}
                    </span>
                  </div>
                  <p className={cx("mt-0.5 truncate text-[11px] font-normal", TEXT_AUX)}>
                    {route.driver} · ETA {route.etaLabel}
                  </p>
                  <div className="mt-1.5">
                    <Progress value={(route.stopsDone / route.stopsTotal) * 100} label={`${route.id} stops complete`} />
                  </div>
                </div>
                <button
                  type="button"
                  onFocus={() => onHoverRoute(route.id)}
                  onBlur={onLeaveRoute}
                  onClick={() => onTogglePin(route.id)}
                  aria-pressed={pinned}
                  className={cx(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-full border",
                    pinned ? "border-blue-400/50 bg-blue-400/15 text-blue-300" : cx(BORDER, "text-zinc-400 hover:bg-white/[0.08]"),
                    TRANSITION,
                    FOCUS,
                  )}
                >
                  <Pin size={14} aria-hidden="true" />
                  <span className="sr-only">{pinned ? `Unpin ${route.id}` : `Pin ${route.id} for detail`}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
