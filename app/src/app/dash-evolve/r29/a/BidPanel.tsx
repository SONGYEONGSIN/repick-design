"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, CheckCircle2, Circle } from "lucide-react";
import { Card, SectionLabel, Avatar, ProgressBar, FOCUS_RING } from "./ui";
import { bidsForLot, currencyFmt, dateTimeFmt, type Lot } from "./data";

type SortDir = "desc" | "asc";

/** Reacts to the pin: shows the active bid ladder and a floor-price adjustment tool for the pinned lot. */
export function BidPanel({ lot }: { lot: Lot }) {
  const bids = useMemo(() => bidsForLot(lot), [lot]);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const copy = [...bids];
    copy.sort((a, b) => (sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount));
    return copy;
  }, [bids, sortDir]);

  const range = Math.max(lot.reservePrice - lot.floorPrice, 1);
  const positionPct = Math.max(0, Math.min(100, ((lot.currentPrice - lot.floorPrice) / range) * 100));

  return (
    <div className="space-y-6">
      <Card className="min-w-0">
        <SectionLabel as="h2">Floor &amp; reserve, {lot.code}</SectionLabel>
        <div className="mt-3 flex items-center justify-between text-xs font-normal text-zinc-400">
          <span>Floor {currencyFmt.format(lot.floorPrice)}</span>
          <span>Reserve {currencyFmt.format(lot.reservePrice)}</span>
        </div>
        <div className="mt-1.5">
          <ProgressBar value={positionPct} tone="indigo" />
        </div>
        <p className="mt-2 text-xs font-normal text-zinc-400">
          Current price sits {Math.round(positionPct)}% of the way from floor to reserve.
        </p>
        <FloorAdjuster key={lot.id} lot={lot} />
      </Card>

      <Card padded={false} className="overflow-hidden">
        <div className="px-4 pt-4 sm:px-5">
          <SectionLabel as="h2">Active bids, {lot.code}</SectionLabel>
        </div>
        <div className="mt-3">
          <table className="w-full table-fixed border-collapse text-sm">
            <caption className="sr-only">Active bids for {lot.title}, sortable by amount</caption>
            <colgroup>
              <col style={{ width: "46%" }} />
              <col style={{ width: "32%" }} />
              <col style={{ width: "22%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/10">
                <th scope="col" className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Bidder
                </th>
                <th scope="col" aria-sort={sortDir === "desc" ? "descending" : "ascending"} className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  <button
                    type="button"
                    onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
                    className={`inline-flex items-center gap-1 rounded ${FOCUS_RING}`}
                  >
                    Amount
                    {sortDir === "desc" ? (
                      <ArrowDown aria-hidden="true" className="h-3 w-3" />
                    ) : (
                      <ArrowUp aria-hidden="true" className="h-3 w-3" />
                    )}
                  </button>
                </th>
                <th scope="col" className="px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Placed
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((bid) => (
                <tr key={bid.id} className="transition-colors motion-reduce:transition-none hover:bg-white/[0.03]">
                  <td className="px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar initials={bid.initials} size={24} />
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-zinc-50">{bid.bidder}</p>
                        <span
                          className={`mt-0.5 inline-flex items-center gap-1 text-[11px] font-normal ${
                            bid.leading ? "text-emerald-400" : "text-zinc-400"
                          }`}
                        >
                          {bid.leading ? (
                            <CheckCircle2 aria-hidden="true" className="h-3 w-3 shrink-0" />
                          ) : (
                            <Circle aria-hidden="true" className="h-3 w-3 shrink-0" />
                          )}
                          {bid.leading ? "Leading" : "Outbid"}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-xs font-medium tabular-nums text-zinc-50">
                    {currencyFmt.format(bid.amount)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2.5 text-right text-[11px] font-normal tabular-nums text-zinc-400">
                    {dateTimeFmt.format(bid.placedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-4" />
      </Card>
    </div>
  );
}

function FloorAdjuster({ lot }: { lot: Lot }) {
  const [draft, setDraft] = useState(lot.floorPrice);
  const delta = draft - lot.floorPrice;

  return (
    <div className="mt-4 border-t border-white/10 pt-4">
      <label htmlFor="floor-adjust" className="text-xs font-medium text-zinc-300">
        Propose new floor price
      </label>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex h-10 flex-1 items-center rounded-lg border border-white/10 bg-white/5 px-3">
          <span className="text-sm font-normal text-zinc-400" aria-hidden="true">
            $
          </span>
          <input
            id="floor-adjust"
            type="number"
            min={0}
            step={10}
            value={draft}
            onChange={(e) => setDraft(Number(e.target.value) || 0)}
            className={`ml-1 w-full min-w-0 rounded bg-transparent text-sm font-medium tabular-nums text-zinc-50 ${FOCUS_RING}`}
          />
        </div>
        <button
          type="button"
          onClick={() => setDraft(lot.floorPrice)}
          className={`h-10 shrink-0 rounded-lg border border-white/10 px-3 text-xs font-medium text-zinc-300 hover:bg-white/5 ${FOCUS_RING}`}
        >
          Reset
        </button>
      </div>
      <p className="mt-2 text-xs font-normal text-zinc-400">
        {delta === 0
          ? "No change from the current floor."
          : delta > 0
            ? `${currencyFmt.format(delta)} above the current floor of ${currencyFmt.format(lot.floorPrice)}.`
            : `${currencyFmt.format(Math.abs(delta))} below the current floor of ${currencyFmt.format(lot.floorPrice)}.`}
      </p>
    </div>
  );
}
