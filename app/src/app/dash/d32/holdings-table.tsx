"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Layers } from "lucide-react";
import { usePortfolio } from "./context";
import { HOLDINGS, formatPrice, formatQty, formatUSD, getHoldingValue } from "./data";
import { AssetIcon, Card, ChangeBadge } from "./ui";
import { cn } from "./utils";
import type { Holding } from "./types";

type SortKey = "name" | "price" | "qty" | "value" | "change24h";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "name", label: "자산", align: "left" },
  { key: "price", label: "가격", align: "right" },
  { key: "qty", label: "보유 수량", align: "right" },
  { key: "value", label: "평가 금액", align: "right" },
  { key: "change24h", label: "24시간", align: "right" },
];

function sortValue(h: Holding, key: SortKey): number | string {
  switch (key) {
    case "name":
      return h.name;
    case "price":
      return h.price;
    case "qty":
      return h.qty;
    case "value":
      return getHoldingValue(h);
    case "change24h":
      return h.change24h;
  }
}

export default function HoldingsTable() {
  const { selectedAssetId, setSelectedAssetId } = usePortfolio();
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const list = [...HOLDINGS];
    list.sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : av - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const isPortfolioView = selectedAssetId === "portfolio";

  return (
    <Card
      id="holdings"
      title="보유 자산"
      description="전체 보유 종목과 평가 금액"
      action={
        !isPortfolioView ? (
          <button
            type="button"
            onClick={() => setSelectedAssetId("portfolio")}
            className={cn(
              "flex min-h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 outline-none transition-colors",
              "hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
            )}
          >
            <Layers aria-hidden="true" className="size-3.5" />
            전체 포트폴리오
          </button>
        ) : undefined
      }
      className="col-span-12 xl:col-span-8"
      bodyClassName="px-5 pb-5"
    >
      <div className="mt-3 -mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">보유 자산 목록, 열 제목을 선택해 정렬할 수 있습니다.</caption>
          <thead>
            <tr className="border-b border-white/5 text-left">
              {COLUMNS.map((col) => {
                const active = sortKey === col.key;
                const ariaSort = active ? (sortDir === "asc" ? "ascending" : "descending") : "none";
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={ariaSort}
                    className={cn(
                      "py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500",
                      col.align === "right" ? "text-right" : "text-left",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "inline-flex min-h-6 items-center gap-1 rounded outline-none transition-colors hover:text-zinc-200",
                        "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                        col.align === "right" && "flex-row-reverse",
                        active && "text-zinc-200",
                      )}
                    >
                      {col.label}
                      <Icon aria-hidden="true" className={cn("size-3", !active && "opacity-40")} />
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((h) => {
              const selected = selectedAssetId === h.id;
              return (
                <tr
                  key={h.id}
                  aria-selected={selected}
                  onClick={() => setSelectedAssetId(h.id)}
                  className={cn(
                    "cursor-pointer border-b border-white/5 transition-colors last:border-b-0",
                    selected ? "bg-indigo-500/10" : "hover:bg-white/5",
                  )}
                >
                  <th scope="row" className="py-2.5 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => setSelectedAssetId(h.id)}
                      className={cn(
                        "-m-1 flex min-w-0 items-center gap-2.5 rounded-md p-1 text-left outline-none",
                        "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                      )}
                    >
                      <AssetIcon symbol={h.symbol} color={h.color} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-zinc-100">{h.name}</span>
                        <span className="block text-xs text-zinc-500">{h.symbol}</span>
                      </span>
                    </button>
                  </th>
                  <td className="py-2.5 text-right tabular-nums text-zinc-300">{formatPrice(h.price)}</td>
                  <td className="py-2.5 text-right tabular-nums text-zinc-300">{formatQty(h.qty, h.decimals)}</td>
                  <td className="py-2.5 text-right font-medium tabular-nums text-zinc-100">
                    {formatUSD(getHoldingValue(h))}
                  </td>
                  <td className="py-2.5 text-right">
                    <ChangeBadge value={h.change24h} size="sm" />
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
