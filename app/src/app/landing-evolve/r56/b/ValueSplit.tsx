import { Clock, Truck, Package } from "lucide-react";
import { getZoneResult } from "./zones";

export default function ValueSplit({ selectedZoneId }: { selectedZoneId: string }) {
  // Calls the exact same derivation function the hero device and the closing
  // CTA call — this section's numbers stay live for whatever zone is picked,
  // not a snapshot of the default zone.
  const result = getZoneResult(selectedZoneId);

  return (
    <section id="live-zones" aria-labelledby="live-zones-heading" className="border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-[500px]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            03 — Three numbers, one zone
          </p>
          <h2
            id="live-zones-heading"
            className="mt-2 text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl"
          >
            This stays live past the hero.
          </h2>
          <p className="mt-3 text-sm leading-[1.6] text-zinc-300">
            Every one of these three figures is read from the zone you last
            selected above. Pick a different district and all three — and the
            inventory grid — recompute together.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <Clock className="h-5 w-5 text-indigo-300" aria-hidden="true" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Pickup window
            </p>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-white">
              {result.etaLabel}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              for {result.zone.name}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <Truck className="h-5 w-5 text-indigo-300" aria-hidden="true" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Logistics fee
            </p>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-white">
              {result.feeLabel}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              adjusts with distance from the hub
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
            <Package className="h-5 w-5 text-indigo-300" aria-hidden="true" />
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Matched listings
            </p>
            <p className="mt-1 text-xl font-extrabold tabular-nums text-white">
              {result.listings.length} items
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              ready for pickup in {result.zone.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
