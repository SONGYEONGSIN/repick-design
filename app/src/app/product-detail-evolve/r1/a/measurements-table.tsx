import { formatUsd, type SizeOption } from "./data";

/**
 * A semantic size chart — real `<table>`, a `<caption>` for assistive tech, `scope` on every header
 * cell. The row matching the ledger's currently-selected size is highlighted by state (passed in),
 * not by color alone: the row also gets a small "Selected" text badge so the link to the size
 * selector above is legible without relying on background color.
 */
export default function MeasurementsTable({
  sizes,
  selectedUs,
}: {
  sizes: SizeOption[];
  selectedUs: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="border-b border-zinc-200 px-5 py-3 text-left text-xs font-normal text-zinc-600 sm:px-6">
          Available US sizes for this listing, with EU equivalent, current lowest ask, and live count of
          asks in that size.
        </caption>
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th scope="col" className="w-[22%] px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600 sm:px-6">
              US
            </th>
            <th scope="col" className="w-[22%] px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600 sm:px-6">
              EU
            </th>
            <th scope="col" className="w-[28%] px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600 sm:px-6">
              Lowest ask
            </th>
            <th scope="col" className="w-[28%] px-5 py-3 text-xs font-medium uppercase tracking-wide text-zinc-600 sm:px-6">
              Live asks
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {sizes.map((s) => {
            const isSelected = s.us === selectedUs;
            return (
              <tr key={s.us} className={isSelected ? "bg-[#A16207]/[0.06]" : undefined}>
                <th scope="row" className="px-5 py-3 text-sm font-medium tabular-nums text-zinc-900 sm:px-6">
                  {s.us}
                  {isSelected ? (
                    <span className="ml-2 text-xs font-normal text-[#A16207]">Selected</span>
                  ) : null}
                </th>
                <td className="px-5 py-3 text-sm font-normal tabular-nums text-zinc-700 sm:px-6">{s.eu}</td>
                <td className="px-5 py-3 text-sm font-normal tabular-nums text-zinc-700 sm:px-6">
                  {s.inStock ? formatUsd(s.price) : "—"}
                </td>
                <td className="px-5 py-3 text-sm font-normal tabular-nums text-zinc-700 sm:px-6">
                  {s.inStock ? s.asksAvailable : "Sold out"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
