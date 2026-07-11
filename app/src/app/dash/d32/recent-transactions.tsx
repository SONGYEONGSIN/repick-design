import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { TRANSACTIONS, formatQty, formatUSD, getAssetById } from "./data";
import { AssetIcon, Card, StatusBadge } from "./ui";
import { cn } from "./utils";
import type { TransactionType } from "./types";

const TYPE_META: Record<TransactionType, { label: string; incoming: boolean }> = {
  buy: { label: "매수", incoming: true },
  sell: { label: "매도", incoming: false },
  transfer_in: { label: "입금", incoming: true },
  transfer_out: { label: "출금", incoming: false },
};

export default function RecentTransactions() {
  return (
    <Card
      id="transactions"
      title="최근 거래 내역"
      description="최근 7건의 매매·이체 활동"
      className="col-span-12"
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-3 -mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <caption className="sr-only">최근 거래 내역, 최신순 정렬</caption>
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th scope="col" className="py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                거래
              </th>
              <th scope="col" className="py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                수량
              </th>
              <th scope="col" className="py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                금액
              </th>
              <th scope="col" className="py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                일시
              </th>
              <th scope="col" className="py-2 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                상태
              </th>
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx) => {
              const meta = TYPE_META[tx.type];
              const asset = getAssetById(tx.assetId);
              const Icon = meta.incoming ? ArrowDownLeft : ArrowUpRight;
              return (
                <tr key={tx.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/5">
                  <th scope="row" className="py-2.5 text-left font-normal">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-full",
                          meta.incoming ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      {asset ? <AssetIcon symbol={asset.symbol} color={asset.color} size="sm" /> : null}
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-zinc-100">
                          {meta.label} · {tx.symbol}
                        </span>
                        <span className="block text-xs text-zinc-500">거래 ID {tx.id.toUpperCase()}</span>
                      </span>
                    </div>
                  </th>
                  <td className="py-2.5 text-right tabular-nums text-zinc-300">
                    {formatQty(tx.qty, asset?.decimals ?? 2)} {tx.symbol}
                  </td>
                  <td className="py-2.5 text-right font-medium tabular-nums text-zinc-100">{formatUSD(tx.value)}</td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-500">
                    {tx.date} · {tx.time}
                  </td>
                  <td className="py-2.5 text-right">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
