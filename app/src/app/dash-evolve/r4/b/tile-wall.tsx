"use client";

import { SearchX } from "lucide-react";
import type { ServiceRecord, TimeRange } from "./data";
import { ServiceTile } from "./tile";

export function TileWall({
  services,
  range,
  onOpenService,
}: {
  services: ServiceRecord[];
  range: TimeRange;
  onOpenService: (id: string) => void;
}) {
  if (services.length === 0) {
    return (
      <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-zinc-900/30 p-8 text-center">
        <SearchX aria-hidden="true" className="size-6 text-zinc-400" />
        <p className="text-sm font-medium text-zinc-200">No services match the current filters</p>
        <p className="max-w-[36ch] text-xs text-zinc-400">
          Try clearing the search, status, team or environment filters above.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
      {services.map((service) => (
        <li key={service.id} className="min-w-0">
          <ServiceTile service={service} range={range} onOpen={() => onOpenService(service.id)} />
        </li>
      ))}
    </ul>
  );
}
