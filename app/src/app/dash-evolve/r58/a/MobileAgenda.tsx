"use client";

import { Card, Badge } from "./ui";
import { HOURS, SLOT_MAP, slotKey, type Day, type Resource } from "./data";

export function MobileAgenda({ day, resources }: { day: Day; resources: Resource[] }) {
  return (
    <div className="space-y-2 md:hidden">
      {resources.map((resource) => {
        const bookedHours = HOURS.filter((h) => {
          const s = SLOT_MAP.get(slotKey(resource.id, day, h));
          return s !== undefined;
        });
        return (
          <Card key={resource.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">{resource.shortName}</p>
              <p className="truncate text-xs font-normal text-slate-400">
                {bookedHours.length === 0 ? "Open all day" : `${bookedHours.length} hour${bookedHours.length === 1 ? "" : "s"} booked`}
              </p>
            </div>
            {bookedHours.length > 0 ? (
              <Badge tone="confirmed">{bookedHours[0]}:00–{bookedHours[bookedHours.length - 1] + 1}:00</Badge>
            ) : (
              <Badge>Open</Badge>
            )}
          </Card>
        );
      })}
    </div>
  );
}
