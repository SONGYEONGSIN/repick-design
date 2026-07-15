"use client";

import { Gauge, MapPinned, PackageCheck, Route, Timer, LocateFixed } from "lucide-react";
import {
  DELIVERY_HISTORY,
  vehicleById,
  zoneById,
  type DeliveryRecord,
  type Vehicle,
} from "./data";
import { VEHICLE_STATUS_META, DELIVERY_STATUS_META } from "./status-meta";
import { Avatar, Badge, Card, CaptionLabel, Progress } from "./ui";
import { cn, FOCUS_RING } from "./cn";
import type { Selection } from "./map-panel";

const DRIVER_AVATARS: Record<string, string> = {
  "Marcus Webb":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&q=80",
  "Priya Nair":
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&h=128&fit=crop&q=80",
  "Grace Lindqvist":
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&q=80",
};

function StatCell({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Gauge;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-zinc-400">
        <Icon aria-hidden="true" className="size-3.5" />
        <CaptionLabel>{label}</CaptionLabel>
      </div>
      <p className="mt-1.5 truncate text-lg font-semibold tabular-nums text-zinc-50">{value}</p>
    </div>
  );
}

function DeliveryRow({
  delivery,
  active,
  onSelect,
}: {
  delivery: DeliveryRecord;
  active: boolean;
  onSelect: () => void;
}) {
  const meta = DELIVERY_STATUS_META[delivery.status];
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={active}
        className={cn(
          FOCUS_RING,
          "flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left transition-colors",
          active
            ? "border-cyan-400/30 bg-cyan-400/[0.06]"
            : "border-white/10 bg-transparent hover:bg-white/5",
        )}
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium tabular-nums text-zinc-100">
            {delivery.id}
          </span>
          <span className="block truncate text-xs text-zinc-400">{delivery.customer}</span>
        </span>
        <Badge meta={meta} className="shrink-0" />
      </button>
    </li>
  );
}

function VehicleSummary({ vehicle, onFocusMap }: { vehicle: Vehicle; onFocusMap?: () => void }) {
  const meta = VEHICLE_STATUS_META[vehicle.status];
  const zone = zoneById(vehicle.zoneId);
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={DRIVER_AVATARS[vehicle.driver]} name={vehicle.driver} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tabular-nums text-zinc-50">{vehicle.id}</p>
            <p className="truncate text-sm text-zinc-300">{vehicle.driver}</p>
          </div>
        </div>
        <Badge meta={meta} className="shrink-0" />
      </div>

      <div className="flex items-center gap-1.5 text-sm text-zinc-300">
        <MapPinned aria-hidden="true" className="size-4 text-zinc-400" />
        {zone.name}
      </div>

      {vehicle.note ? (
        <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-zinc-300">
          {vehicle.note}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <StatCell label="Speed" value={`${vehicle.speedKph} km/h`} icon={Gauge} />
        <StatCell label="Stops left" value={String(vehicle.stopsRemaining)} icon={Route} />
        <StatCell
          label="ETA next stop"
          value={vehicle.etaMin !== null ? `${vehicle.etaMin} min` : "—"}
          icon={Timer}
        />
        <StatCell
          label="Current delivery"
          value={vehicle.currentDeliveryId ?? "—"}
          icon={PackageCheck}
        />
      </div>

      <Progress value={vehicle.loadPct} label="Cargo load" />

      {onFocusMap ? (
        <button
          type="button"
          onClick={onFocusMap}
          className={cn(
            FOCUS_RING,
            "flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10",
          )}
        >
          <LocateFixed aria-hidden="true" className="size-4" />
          Focus on map
        </button>
      ) : null}
    </Card>
  );
}

export function DetailRail({
  selection,
  onSelectVehicle,
  onSelectDelivery,
}: {
  selection: Selection | null;
  onSelectVehicle: (id: string) => void;
  onSelectDelivery: (id: string) => void;
}) {
  if (!selection) {
    return (
      <div className="flex h-full flex-col">
        <h2 className="px-1 text-sm font-semibold text-zinc-100">Selection detail</h2>
        <Card className="mt-3 flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <MapPinned aria-hidden="true" className="size-6 text-zinc-500" />
          <p className="text-sm text-zinc-300">Nothing selected yet</p>
          <p className="max-w-[22ch] text-xs text-zinc-400">
            Choose a vehicle marker on the map, or a row in the delivery history table, to see its
            detail here.
          </p>
        </Card>
      </div>
    );
  }

  const vehicleId = selection.type === "vehicle" ? selection.id : null;
  const deliveryRecord =
    selection.type === "delivery" ? DELIVERY_HISTORY.find((d) => d.id === selection.id) ?? null : null;
  const resolvedVehicleId = vehicleId ?? deliveryRecord?.vehicleId ?? null;
  const vehicle = resolvedVehicleId ? vehicleById(resolvedVehicleId) : undefined;

  const relatedDeliveries = resolvedVehicleId
    ? DELIVERY_HISTORY.filter((d) => d.vehicleId === resolvedVehicleId).slice(0, 5)
    : [];

  return (
    <div className="flex h-full flex-col gap-3">
      <h2 className="px-1 text-sm font-semibold text-zinc-100">Selection detail</h2>

      {deliveryRecord ? (
        <Card className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold tabular-nums text-zinc-50">
                {deliveryRecord.id}
              </p>
              <p className="truncate text-sm text-zinc-300">
                {deliveryRecord.customer} · {deliveryRecord.address}
              </p>
            </div>
            <Badge meta={DELIVERY_STATUS_META[deliveryRecord.status]} className="shrink-0" />
          </div>
          {deliveryRecord.note ? (
            <p className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs text-zinc-300">
              {deliveryRecord.note}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <StatCell label="Scheduled" value={deliveryRecord.scheduled} icon={Timer} />
            <StatCell label="Completed" value={deliveryRecord.completed ?? "—"} icon={PackageCheck} />
            <StatCell
              label="Duration"
              value={deliveryRecord.durationMin !== null ? `${deliveryRecord.durationMin} min` : "—"}
              icon={Gauge}
            />
            <StatCell label="Distance" value={`${deliveryRecord.distanceKm.toFixed(1)} km`} icon={Route} />
          </div>
        </Card>
      ) : null}

      {vehicle ? (
        <VehicleSummary
          vehicle={vehicle}
          onFocusMap={
            selection.type === "delivery" ? () => onSelectVehicle(vehicle.id) : undefined
          }
        />
      ) : null}

      {relatedDeliveries.length > 0 ? (
        <div className="min-h-0 flex-1">
          <CaptionLabel className="px-1">Recent deliveries · {vehicle?.id}</CaptionLabel>
          <ul className="mt-2 space-y-1.5">
            {relatedDeliveries.map((d) => (
              <DeliveryRow
                key={d.id}
                delivery={d}
                active={deliveryRecord?.id === d.id}
                onSelect={() => onSelectDelivery(d.id)}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
