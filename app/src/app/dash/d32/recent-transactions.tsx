"use client";

import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import { usePortfolio } from "./context";
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

/**
 * Recent trade history for the currently selected asset — scoped to the
 * master selection so it stays in sync with the rail and chart above it.
 * Shows every asset's activity when "전체 포트폴리오" is selected.
 */
export default function RecentTransactions() {
  const { selectedAssetId } = usePortfolio();
  const isPortfolio = selectedAssetId === "portfolio";
  const asset = isPortfolio ? null : getAssetById(selectedAssetId);
  const rows = isPortfolio ? TRANSACTIONS : TRANSACTIONS.filter((tx) => tx.assetId === selectedAssetId);

  return (
    <Card
      id="transactions"
      title="최근 거래 내역"
      description={isPortfolio ? "최근 7건의 매매·이체 활동" : `${asset?.name ?? ""} 최근 거래`}
      bodyClassName="px-5 pb-5"
    >
      {rows.length === 0 ? (
        <div role="status" className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-10 text-center">
          <History aria-hidden="true" className="size-5 text-zinc-600" />
          <p className="text-sm text-zinc-500">이 자산에 대한 최근 거래 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="mt-3 -mx-5 overflow-x-auto px-5">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              {isPortfolio ? "최근 거래 내역, 최신순 정렬" : `${asset?.name ?? ""} 최근 거래 내역, 최신순 정렬`}
            </caption>
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th scope="col" className="py-2 pr-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  거래
                </th>
                <th scope="col" className="py-2 pl-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  금액
                </th>
                <th scope="col" className="py-2 pl-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  일시
                </th>
                <th scope="col" className="py-2 pl-3 text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                  상태
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
                    <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-full",
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
                          {/* 3-페인 중앙 카드는 데스크톱에서도 좁아(≈450px) 수량을 별도 열이 아닌
                              서브텍스트로 상시 표기 — 뷰포트 브레이크포인트로 열을 늘리면 카드 밖으로 넘친다. */}
                          <span className="block whitespace-nowrap text-xs text-zinc-500">
                            {formatQty(tx.qty, txAsset?.decimals ?? 2)} {tx.symbol}
                          </span>
                        </span>
                      </div>
                    </th>
                    <td className="whitespace-nowrap py-2.5 pl-3 text-right font-medium tabular-nums text-zinc-100">{formatUSD(tx.value)}</td>
                    <td className="whitespace-nowrap py-2.5 pl-3 text-right tabular-nums text-zinc-500">{tx.date}</td>
                    <td className="whitespace-nowrap py-2.5 pl-3 text-right">
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
