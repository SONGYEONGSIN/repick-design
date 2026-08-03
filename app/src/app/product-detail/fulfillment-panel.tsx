import { PackageCheck, TriangleAlert, ShieldCheck, Truck } from "lucide-react";
import type { Grade } from "./data";

const STOCK_CEILING = 12;

/** Fulfillment readout — reads only the grade axis. Stock, warranty and ship estimate are the
 * numbers most likely to change a buyer's mind, so they sit in their own always-visible panel
 * rather than behind the configurator. */
export default function FulfillmentPanel({ grade }: { grade: Grade }) {
  const low = grade.stock <= 3;
  const pct = Math.min(100, Math.round((grade.stock / STOCK_CEILING) * 100));

  return (
    <section
      id="fulfillment"
      aria-labelledby="fulfillment-heading"
      className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-sky-50">
          <PackageCheck className="h-4.5 w-4.5 text-sky-700" aria-hidden="true" />
        </span>
        <h2 id="fulfillment-heading" className="text-base font-semibold tracking-tight text-slate-900">
          Fulfillment
        </h2>
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-normal text-slate-600">In stock, {grade.short}</span>
          <span className="text-sm font-medium text-slate-900 tabular-nums">{grade.stock} units</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className={low ? "h-full rounded-full bg-amber-600" : "h-full rounded-full bg-sky-700"} style={{ width: `${pct}%` }} />
        </div>
        {low && (
          <p className="mt-2 flex items-start gap-1.5 text-xs font-normal text-amber-700">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
            Low stock in this grade — remaining units may sell out before restock.
          </p>
        )}
      </div>

      <ul role="list" className="mt-4 flex flex-col gap-2.5 border-t border-slate-200 pt-4">
        <li className="flex items-start gap-2 text-sm font-normal text-slate-600">
          <Truck className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-600" aria-hidden="true" />
          {grade.shipsIn}
        </li>
        <li className="flex items-start gap-2 text-sm font-normal text-slate-600">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-600" aria-hidden="true" />
          {grade.warranty}
        </li>
      </ul>
    </section>
  );
}
