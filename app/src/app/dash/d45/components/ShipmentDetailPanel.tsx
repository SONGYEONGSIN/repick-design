"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useOps } from "../context";
import { formatKg, formatKm, getCarrier, getShipment } from "../data";
import { Card, DeltaText, ModeIcon, StatusPill } from "./ui";

function StatRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 py-2.5 text-sm last:border-b-0">
      <dt className="text-zinc-400">{label}</dt>
      <dd className="min-w-0 truncate text-right tabular-nums text-zinc-200">{value}</dd>
    </div>
  );
}

export function ShipmentDetailPanel() {
  const { selectedShipmentId } = useOps();
  const shipment = getShipment(selectedShipmentId);

  if (!shipment) {
    return (
      <Card id="shipment-detail" title="Shipment detail" bodyClassName="px-5 pb-5">
        <p className="mt-3 text-sm text-zinc-400">Select a shipment from the list to see its detail here.</p>
      </Card>
    );
  }

  const carrier = getCarrier(shipment.carrierId);

  return (
    <Card
      id="shipment-detail"
      title={shipment.id}
      description={`${shipment.originCode} → ${shipment.destCode} · ${carrier.name}`}
      action={<StatusPill status={shipment.status} />}
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
        <span aria-hidden="true" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
          <ModeIcon mode={shipment.mode} className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-100">
            {shipment.originCity} → {shipment.destCity}
          </p>
          <p className="truncate text-xs text-zinc-400">{shipment.mode} freight · {formatKm(shipment.distanceKm)}</p>
        </div>
      </div>

      <dl className="mt-3">
        <StatRow label="Scheduled ETA" value={shipment.scheduledEtaLabel} />
        <StatRow label="Predicted ETA" value={shipment.predictedEtaLabel} />
        <StatRow label="ETA delta" value={<DeltaText hours={shipment.etaDeltaHours} className="justify-end" />} />
        <StatRow label="Weight" value={formatKg(shipment.weightKg)} />
        <StatRow label="Distance" value={formatKm(shipment.distanceKm)} />
      </dl>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/5 p-2.5">
        <Image
          src={`https://images.unsplash.com/photo-${shipment.dispatcher.photoId}?w=64&h=64&fit=crop&crop=faces`}
          alt={`${shipment.dispatcher.name} profile photo`}
          width={32}
          height={32}
          className="size-8 shrink-0 rounded-full object-cover"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-100">{shipment.dispatcher.name}</span>
          <span className="block truncate text-[11px] text-zinc-400">{shipment.dispatcher.role} · assigned</span>
        </span>
      </div>
    </Card>
  );
}
