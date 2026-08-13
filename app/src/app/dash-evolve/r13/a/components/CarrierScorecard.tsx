"use client";

import { useOps } from "../context";
import { formatCount, formatPercent, getCarrierScorecard, getShipment } from "../data";
import { Card, ModeIcon } from "./ui";
import { cn } from "../utils";

/**
 * Read-only carrier ranking, aggregated straight from the same fleet series
 * the chart above renders — no separately hand-authored numbers to drift out
 * of sync. The row for the currently selected shipment's carrier is
 * highlighted, reinforcing the rail → chart → scorecard selection sync.
 */
export function CarrierScorecard() {
  const { selectedShipmentId } = useOps();
  const shipment = getShipment(selectedShipmentId);
  const rows = getCarrierScorecard();

  return (
    <Card id="carrier-scorecard" title="Carrier scorecard" description="Ranked by 30-day on-time rate" bodyClassName="px-5 pb-5">
      <div className="mt-3">
        <table className="w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[19%]" />
          </colgroup>
          <caption className="sr-only">Carrier scorecard, ranked by on-time rate, highest first</caption>
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th scope="col" className="py-2 pr-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Carrier
              </th>
              <th scope="col" className="py-2 px-1 text-center text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Mode
              </th>
              <th scope="col" className="py-2 pl-1 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                On time
              </th>
              <th scope="col" className="py-2 pl-1 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Avg delay
              </th>
              <th scope="col" className="py-2 pl-1 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Active
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = shipment?.carrierId === row.carrier.id;
              return (
                <tr key={row.carrier.id} className={cn("border-b border-white/5 last:border-b-0 transition-colors", isSelected ? "bg-rose-500/10" : "hover:bg-white/5")}>
                  <th scope="row" className="py-2.5 pr-2 text-left font-normal">
                    <span className="block truncate text-[13px] font-medium text-zinc-100">{row.carrier.shortName}</span>
                  </th>
                  <td className="py-2.5 px-1 text-center text-zinc-400">
                    <ModeIcon mode={row.carrier.primaryMode} className="mx-auto size-3.5" />
                    <span className="sr-only">{row.carrier.primaryMode}</span>
                  </td>
                  <td className="whitespace-nowrap py-2.5 pl-1 text-right font-medium tabular-nums text-zinc-100">{formatPercent(row.onTimePct)}</td>
                  <td className="whitespace-nowrap py-2.5 pl-1 text-right tabular-nums text-zinc-400">{row.avgDelayHours.toFixed(1)}h</td>
                  <td className="whitespace-nowrap py-2.5 pl-1 text-right tabular-nums text-zinc-400">{formatCount(row.activeShipments)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
