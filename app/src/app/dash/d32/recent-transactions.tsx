"use client";

import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { usePortfolio } from "./context";
import { TRANSACTIONS, formatQty, formatUSD, getAssetById } from "./data";
import { AssetIcon, Card, StatusBadge } from "./ui";
import { cn } from "./utils";
import type { TransactionType } from "./types";

const TYPE_META: Record<TransactionType, { label: string; incoming: boolean }> = {
  buy: { label: "Buy", incoming: true },
  sell: { label: "Sell", incoming: false },
  transfer_in: { label: "Deposit", incoming: true },
  transfer_out: { label: "Withdrawal", incoming: false },
};

/**
 * Recent trade history for the currently selected asset — scoped to the
 * master selection so it stays in sync with the rail and chart above it.
 * Shows every asset's activity when "All Portfolio" is selected.
 */
export default function RecentTransactions() {
  const { selectedAssetId } = usePortfolio();
  const isPortfolio = selectedAssetId === "portfolio";
  const asset = isPortfolio ? null : getAssetById(selectedAssetId);
  const rows = isPortfolio ? TRANSACTIONS : TRANSACTIONS.filter((tx) => tx.assetId === selectedAssetId);

  return (
    <Card
      id="transactions"
      title="Recent transactions"
      description={isPortfolio ? "Last 7 trades and transfers" : `Recent ${asset?.name ?? ""} trades`}
      bodyClassName="px-5 pb-5"
    >
      {rows.length === 0 ? (
        <div role="status" className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center">
          <History aria-hidden="true" className="size-5 text-zinc-600" />
          <p className="text-sm text-zinc-400">No recent transactions for this asset.</p>
        </div>
      ) : (
        <div className="mt-3 -mx-5 overflow-x-auto px-5">
          {/* table-fixed: auto layout would size even truncated cells to their full content
              width, which structurally overflows the narrow center pane (same trap as d29).
              Three fixed columns + the transaction column absorb the rest. */}
          <table className="w-full table-fixed border-collapse text-sm">
            <colgroup>
              <col />
              <col className="w-[84px]" />
              <col className="w-[44px]" />
              <col className="w-[96px]" />
            </colgroup>
            <caption className="sr-only">
              {isPortfolio ? "Recent transactions, newest first" : `Recent ${asset?.name ?? ""} transactions, newest first`}
            </caption>
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th scope="col" className="py-2 pr-3 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Transaction
                </th>
                <th scope="col" className="py-2 pl-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Amount
                </th>
                <th scope="col" className="py-2 pl-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Date
                </th>
                <th scope="col" className="py-2 pl-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((tx) => {
                const meta = TYPE_META[tx.type];
                const txAsset = getAssetById(tx.assetId);
                const Icon = meta.incoming ? ArrowDownLeft : ArrowUpRight;
                return (
                  <tr key={tx.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                    <th scope="row" className="py-2.5 pr-2 text-left font-normal">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full",
                            meta.incoming ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                        {isPortfolio && txAsset ? <AssetIcon symbol={txAsset.symbol} color={txAsset.color} size="sm" /> : null}
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-zinc-100">
                            {isPortfolio ? `${meta.label} · ${tx.symbol}` : meta.label}
                          </span>
                          {/* The 3-pane center card stays narrow even on desktop (≈450px), so
                              quantity is always shown as subtext rather than its own column —
                              adding a column at a viewport breakpoint would overflow the card. */}
                          <span className="block truncate text-xs text-zinc-400">
                            {formatQty(tx.qty, txAsset?.decimals ?? 2)} {tx.symbol}
                          </span>
                        </span>
                      </div>
                    </th>
                    {/* Transaction amounts are always whole numbers — strip ".00" to save width in the narrow pane */}
                    <td className="whitespace-nowrap py-2.5 pl-2 text-right font-medium tabular-nums text-zinc-100">
                      {formatUSD(tx.value).replace(/\.00$/, "")}
                    </td>
                    {/* Dates are stored pre-abbreviated (e.g. "7.11") to fit the narrow center pane */}
                    <td className="whitespace-nowrap py-2.5 pl-2 text-right tabular-nums text-zinc-400">
                      {tx.date}
                    </td>
                    <td className="whitespace-nowrap py-2.5 pl-2 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
