"use client";

import { RECEIPTS, fmtNumber } from "./data";

export function ReceiptsTable() {
  return (
    <div id="panel-receipts" role="tabpanel" aria-labelledby="tab-receipts">
      <p className="py-3 text-xs font-normal text-zinc-500">Last {RECEIPTS.length} receipts logged across all zones</p>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "31%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-zinc-200">
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Receipt
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Zone
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Item
              </th>
              <th scope="col" className="px-3 py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Qty
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Received
              </th>
              <th scope="col" className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                Source
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {RECEIPTS.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-50">
                <td className="whitespace-nowrap px-3 py-2.5 text-sm font-medium text-zinc-900">{r.id}</td>
                <td className="truncate px-3 py-2.5 text-sm font-normal text-zinc-700">{r.zoneName}</td>
                <td className="truncate px-3 py-2.5 text-sm font-normal text-zinc-700">{r.item}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right text-sm font-medium tabular-nums text-zinc-900">
                  {fmtNumber(r.qty)}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-sm font-normal tabular-nums text-zinc-700">{r.receivedLabel}</td>
                <td className="truncate px-3 py-2.5 text-sm font-normal text-zinc-700">{r.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
