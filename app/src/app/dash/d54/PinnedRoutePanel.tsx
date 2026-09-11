"use client";

import { MousePointerClick, Package, Weight } from "lucide-react";
import Image from "next/image";
import { ROUTES, ZONES } from "./data";
import { NUM, STATUS_BADGE, STATUS_ICON, STATUS_LABEL, TEXT_AUX, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { CardHead, Progress, Sparkline } from "./ui";

/**
 * The other half of the branched selection: this panel IS wired to `pinnedRouteId` (unlike
 * ZoneLoadPanel next to it), and shows nothing until a route has been pinned — pinning is a
 * deliberate "commit" action, distinct from the hover inspector on the map, which never lands here.
 */
export default function PinnedRoutePanel({ pinnedRouteId }: { pinnedRouteId: string | null }) {
  const route = pinnedRouteId ? ROUTES.find((r) => r.id === pinnedRouteId) ?? null : null;

  if (!route) {
    return (
      <div>
        <CardHead title="Pinned route detail" hint="Click a marker on the map, or the pin on a queue row, to inspect a route here." />
        <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-8 text-center">
          <MousePointerClick size={20} aria-hidden="true" className={TEXT_AUX} />
          <p className={cx("text-xs font-normal", TEXT_AUX)}>No route pinned yet.</p>
        </div>
      </div>
    );
  }

  const zone = ZONES.find((z) => z.id === route.zoneId)!;
  const StatusIcon = STATUS_ICON[route.status];

  return (
    <div>
      <CardHead
        title="Pinned route detail"
        hint={`${route.id} · ${zone.name}`}
        action={
          <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", STATUS_BADGE[route.status])}>
            <StatusIcon size={11} aria-hidden="true" />
            {STATUS_LABEL[route.status]}
          </span>
        }
      />

      <div className="mt-4 flex items-center gap-3">
        <Image
          src={`https://images.unsplash.com/photo-${route.avatarId}?w=88&h=88&fit=crop&crop=faces`}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-full bg-zinc-800 object-cover"
        />
        <div className="min-w-0">
          <p className={cx("truncate text-sm font-semibold", TEXT_PRIMARY)}>{route.driver}</p>
          <p className={cx("truncate text-xs font-normal", TEXT_AUX)}>
            Van {route.vanId} · ETA {route.etaLabel}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className={cx("text-xs font-medium", TEXT_SECONDARY)}>
            {route.stopsDone} of {route.stopsTotal} stops
          </span>
          <span className={cx(NUM, "text-xs font-medium", TEXT_AUX)}>{Math.round((route.stopsDone / route.stopsTotal) * 100)}%</span>
        </div>
        <div className="mt-1.5">
          <Progress value={(route.stopsDone / route.stopsTotal) * 100} label={`${route.id} stops complete`} />
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <dt className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
            <Package size={12} aria-hidden="true" />
            Items
          </dt>
          <dd className={cx(NUM, "mt-1 text-lg font-semibold", TEXT_PRIMARY)}>{route.items}</dd>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <dt className={cx("flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>
            <Weight size={12} aria-hidden="true" />
            Weight
          </dt>
          <dd className={cx(NUM, "mt-1 text-lg font-semibold", TEXT_PRIMARY)}>{route.weightKg} kg</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div>
          <p className={cx("text-[11px] font-medium uppercase tracking-[0.08em]", TEXT_AUX)}>On-time, last 7 routes</p>
          <p className={cx(NUM, "mt-1 text-sm font-semibold", TEXT_PRIMARY)}>{route.trend7d[route.trend7d.length - 1]}%</p>
        </div>
        <Sparkline values={route.trend7d} />
      </div>
    </div>
  );
}
