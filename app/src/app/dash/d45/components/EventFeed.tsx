"use client";

import { Check, CheckCircle2, Package, Plane, ShieldCheck, Ship, Truck, Warehouse } from "lucide-react";
import { useOps } from "../context";
import { getShipment } from "../data";
import { Card } from "./ui";
import { cn } from "../utils";
import type { TrackingEvent } from "../types";

const EVENT_ICON: Record<TrackingEvent["icon"], typeof Package> = {
  package: Package,
  truck: Truck,
  ship: Ship,
  plane: Plane,
  warehouse: Warehouse,
  check: CheckCircle2,
  customs: ShieldCheck,
};

export function EventFeed() {
  const { selectedShipmentId } = useOps();
  const shipment = getShipment(selectedShipmentId);

  if (!shipment) return null;

  return (
    <Card id="event-feed" title="Tracking events" description={`${shipment.events.filter((e) => e.done).length} of ${shipment.events.length} reported`} bodyClassName="px-5 pb-5">
      <ol className="mt-3 space-y-0">
        {shipment.events.map((event, i) => {
          const Icon = EVENT_ICON[event.icon];
          const isLast = i === shipment.events.length - 1;
          return (
            <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && (
                <span aria-hidden="true" className={cn("absolute left-[15px] top-8 h-[calc(100%-1.75rem)] w-px", event.done ? "bg-rose-400/30" : "bg-white/10")} />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border",
                  event.done ? "border-rose-400/40 bg-rose-500/15 text-rose-300" : "border-white/10 bg-white/5 text-zinc-400",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className={cn("truncate text-[13px] font-medium", event.done ? "text-zinc-100" : "text-zinc-400")}>
                  {event.label}
                  {event.done && <Check aria-hidden="true" className="ml-1.5 inline size-3 text-rose-400" />}
                </p>
                <p className={cn("mt-0.5 truncate text-[11.5px] tabular-nums", event.done ? "text-zinc-400" : "text-zinc-400")}>{event.timeLabel}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
