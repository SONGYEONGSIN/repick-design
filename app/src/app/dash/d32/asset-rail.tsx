"use client";

import { useMemo, useState } from "react";
import { Layers, Search, X } from "lucide-react";
import { usePortfolio } from "./context";
import {
  HOLDINGS,
  PORTFOLIO_CHANGE_24H_PCT,
  TOTAL_BALANCE,
  WATCHLIST,
  formatPercent,
  formatPrice,
  formatUSDCompact,
  getPortfolioSparklineValues,
  getSparklineValues,
} from "./data";
import { AssetIcon, SectionLabel, Sparkline } from "./ui";
import { cn } from "./utils";
import type { AssetId } from "./types";

interface RailItem {
  id: Exclude<AssetId, "portfolio">;
  symbol: string;
  name: string;
  color: string;
  price: number;
  change24h: number;
}

const HELD_ITEMS: RailItem[] = HOLDINGS.map((h) => ({
  id: h.id,
  symbol: h.symbol,
  name: h.name,
  color: h.color,
  price: h.price,
  change24h: h.change24h,
}));

const WATCH_ITEMS: RailItem[] = WATCHLIST.map((w) => ({
  id: w.id,
  symbol: w.symbol,
  name: w.name,
  color: w.color,
  price: w.price,
  change24h: w.change24h,
}));

function matches(item: RailItem, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return item.symbol.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
}

function ChangeText({ value }: { value: number }) {
  const isZero = Math.abs(value) < 0.005;
  return (
    <span
      className={cn(
        "block whitespace-nowrap text-[11px] tabular-nums",
        isZero ? "text-zinc-500" : value > 0 ? "text-emerald-400" : "text-red-400",
      )}
    >
      {formatPercent(value)}
    </span>
  );
}

function DesktopRow({
  item,
  selected,
  onSelect,
}: {
  item: RailItem;
  selected: boolean;
  onSelect: (id: AssetId) => void;
}) {
  const sparkline = getSparklineValues(item.id);
  const trendColor = item.change24h >= 0 ? "#34d399" : "#f87171";
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => onSelect(item.id)}
        className={cn(
          "flex min-h-[52px] w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          selected ? "bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30" : "hover:bg-white/5",
        )}
      >
        <AssetIcon symbol={item.symbol} color={item.color} size="sm" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-medium text-zinc-100">{item.symbol}</span>
          <span className="block truncate text-[11px] text-zinc-500">{item.name}</span>
        </span>
        <span className="hidden shrink-0 xl:block">
          <Sparkline values={sparkline} color={trendColor} width={36} />
        </span>
        <span className="shrink-0 text-right">
          <span className="block whitespace-nowrap text-[13px] tabular-nums text-zinc-100">{formatPrice(item.price)}</span>
          <ChangeText value={item.change24h} />
        </span>
      </button>
    </li>
  );
}

function MobileChip({
  item,
  selected,
  onSelect,
}: {
  item: RailItem;
  selected: boolean;
  onSelect: (id: AssetId) => void;
}) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        role="option"
        aria-selected={selected}
        onClick={() => onSelect(item.id)}
        className={cn(
          "flex min-h-11 items-center gap-2 rounded-full border px-3 text-left outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          selected ? "border-indigo-400/40 bg-indigo-500/15" : "border-white/10 bg-white/5 hover:bg-white/10",
        )}
      >
        <AssetIcon symbol={item.symbol} color={item.color} size="sm" />
        <span className="whitespace-nowrap text-[13px] font-medium text-zinc-100">{item.symbol}</span>
        <ChangeText value={item.change24h} />
      </button>
    </li>
  );
}

/**
 * Left rail: search + "전체 포트폴리오" master row + 보유 자산 / 워치리스트
 * sections. Selecting any row drives the master selection (context) that the
 * center chart, transactions table, and right-rail detail all read from.
 * Collapses to a horizontal scrollable chip strip below the lg breakpoint.
 */
export default function AssetRail() {
  const { selectedAssetId, setSelectedAssetId } = usePortfolio();
  const [query, setQuery] = useState("");

  const filteredHeld = useMemo(() => HELD_ITEMS.filter((i) => matches(i, query)), [query]);
  const filteredWatch = useMemo(() => WATCH_ITEMS.filter((i) => matches(i, query)), [query]);
  const filteredAll = useMemo(() => [...HELD_ITEMS, ...WATCH_ITEMS].filter((i) => matches(i, query)), [query]);
  const noResults = query.length > 0 && filteredHeld.length === 0 && filteredWatch.length === 0;
  const portfolioSparkline = getPortfolioSparklineValues();
  const portfolioSelected = selectedAssetId === "portfolio";
  const portfolioTrendColor = PORTFOLIO_CHANGE_24H_PCT >= 0 ? "#34d399" : "#f87171";

  return (
    <aside aria-label="자산 목록" className="flex w-full shrink-0 flex-col border-b border-white/5 lg:w-64 lg:border-b-0 lg:border-r xl:w-80">
      <div className="p-3">
        <div role="search" className="flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="자산 검색…"
            aria-label="보유 자산 및 워치리스트 검색"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="flex size-6 shrink-0 items-center justify-center rounded text-zinc-500 outline-none transition-colors hover:text-zinc-200 focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <X aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Mobile / tablet: horizontal scrollable chip strip replaces the full list */}
      <ul role="listbox" aria-label="자산 빠른 선택" className="flex gap-2 overflow-x-auto px-3 pb-3 lg:hidden">
        {query.length === 0 && (
          <li className="shrink-0">
            <button
              type="button"
              role="option"
              aria-selected={portfolioSelected}
              onClick={() => setSelectedAssetId("portfolio")}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-full border px-3 text-left outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                portfolioSelected ? "border-indigo-400/40 bg-indigo-500/15" : "border-white/10 bg-white/5 hover:bg-white/10",
              )}
            >
              <Layers aria-hidden="true" className="size-3.5 text-indigo-300" />
              <span className="whitespace-nowrap text-[13px] font-medium text-zinc-100">전체</span>
              <ChangeText value={PORTFOLIO_CHANGE_24H_PCT} />
            </button>
          </li>
        )}
        {filteredAll.map((item) => (
          <MobileChip key={item.id} item={item} selected={selectedAssetId === item.id} onSelect={setSelectedAssetId} />
        ))}
      </ul>
      {noResults && <p className="px-3 pb-3 text-xs text-zinc-500 lg:hidden">일치하는 자산이 없습니다.</p>}

      {/* Desktop: full vertical rail with sections */}
      <div className="hidden flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4 lg:flex">
        {query.length === 0 && (
          <ul role="listbox" aria-label="포트폴리오 전체" className="space-y-0.5">
            <li>
              <button
                type="button"
                role="option"
                aria-selected={portfolioSelected}
                onClick={() => setSelectedAssetId("portfolio")}
                className={cn(
                  "flex min-h-[52px] w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                  portfolioSelected ? "bg-indigo-500/10 ring-1 ring-inset ring-indigo-500/30" : "hover:bg-white/5",
                )}
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                  <Layers aria-hidden="true" className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-zinc-100">전체 포트폴리오</span>
                  <span className="block truncate text-[11px] text-zinc-500">보유 {HOLDINGS.length}종</span>
                </span>
                <span className="hidden shrink-0 xl:block">
                  <Sparkline values={portfolioSparkline} color={portfolioTrendColor} width={36} />
                </span>
                <span className="shrink-0 text-right">
                  <span className="block whitespace-nowrap text-[13px] tabular-nums text-zinc-100">{formatUSDCompact(TOTAL_BALANCE)}</span>
                  <ChangeText value={PORTFOLIO_CHANGE_24H_PCT} />
                </span>
              </button>
            </li>
          </ul>
        )}

        {filteredHeld.length > 0 && (
          <div>
            <SectionLabel>보유 자산 · {filteredHeld.length}</SectionLabel>
            <ul role="listbox" aria-label="보유 자산" className="mt-1.5 space-y-0.5">
              {filteredHeld.map((item) => (
                <DesktopRow key={item.id} item={item} selected={selectedAssetId === item.id} onSelect={setSelectedAssetId} />
              ))}
            </ul>
          </div>
        )}

        {filteredWatch.length > 0 && (
          <div>
            <SectionLabel>워치리스트 · {filteredWatch.length}</SectionLabel>
            <ul role="listbox" aria-label="워치리스트" className="mt-1.5 space-y-0.5">
              {filteredWatch.map((item) => (
                <DesktopRow key={item.id} item={item} selected={selectedAssetId === item.id} onSelect={setSelectedAssetId} />
              ))}
            </ul>
          </div>
        )}

        {noResults && <p className="px-1 text-xs text-zinc-500">일치하는 자산이 없습니다.</p>}
      </div>
    </aside>
  );
}
