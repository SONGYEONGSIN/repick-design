"use client";

import { useMemo, useState } from "react";
import { Camera, Watch as WatchIcon, Footprints, Handbag, Pin, ArrowUpDown, Check, TrendingUp, TrendingDown } from "lucide-react";
import { CATEGORY_LABEL, WATCHLIST, dayChangePct, type Category, type WatchItem } from "./data";
import { fmtCompact, fmtSignedPct } from "./format";
import { Tabs } from "./ui/Tabs";
import { Sparkline } from "./ui/Sparkline";
import { Popover, PopoverItem } from "./ui/Popover";
import { FOCUS_RING } from "./ui/focus";

const CATEGORY_ICON: Record<Category, typeof Camera> = {
  camera: Camera,
  watch: WatchIcon,
  sneaker: Footprints,
  bag: Handbag,
};

type SortKey = "change" | "price" | "name";
const SORT_LABEL: Record<SortKey, string> = { change: "Day Δ", price: "Repick avg", name: "Name" };

function CategoryIcon({ category, className }: { category: Category; className?: string }) {
  const Icon = CATEGORY_ICON[category];
  return <Icon className={className} aria-hidden="true" />;
}

export function WatchlistRail({
  activeId,
  pinnedFeedId,
  onSelect,
}: {
  activeId: string;
  pinnedFeedId: string;
  onSelect: (id: string) => void;
}) {
  const [category, setCategory] = useState<"all" | Category>("all");
  const [sortKey, setSortKey] = useState<SortKey>("change");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: WATCHLIST.length, camera: 0, watch: 0, sneaker: 0, bag: 0 };
    for (const item of WATCHLIST) c[item.category]++;
    return c;
  }, []);

  const items = useMemo(() => {
    const filtered = category === "all" ? WATCHLIST : WATCHLIST.filter((i) => i.category === category);
    const withChange = filtered.map((item) => ({ item, change: dayChangePct(item.series) }));
    withChange.sort((a, b) => {
      if (sortKey === "change") return b.change - a.change;
      if (sortKey === "price") return b.item.series[b.item.series.length - 1].repick - a.item.series[a.item.series.length - 1].repick;
      return a.item.name.localeCompare(b.item.name);
    });
    return withChange;
  }, [category, sortKey]);

  return (
    <nav aria-label="Tracked comp watchlist" className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-4 pt-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Watchlist</h2>
        <Popover
          align="end"
          trigger={({ onClick, ref, open, id }) => (
            <button
              ref={ref}
              onClick={onClick}
              aria-expanded={open}
              aria-controls={id}
              className={`flex h-7 items-center gap-1 rounded-md border border-white/10 px-2 text-[11px] text-zinc-400 transition-colors hover:text-zinc-200 ${FOCUS_RING}`}
            >
              <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
              {SORT_LABEL[sortKey]}
            </button>
          )}
        >
          {(close) => (
            <>
              {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                <PopoverItem
                  key={key}
                  onClick={() => {
                    setSortKey(key);
                    close();
                  }}
                  icon={sortKey === key ? <Check className="h-3.5 w-3.5 text-amber-400" /> : <span className="w-3.5" />}
                >
                  Sort by {SORT_LABEL[key]}
                </PopoverItem>
              ))}
            </>
          )}
        </Popover>
      </div>

      <div className="mt-3 px-3">
        <Tabs
          label="Filter watchlist by category"
          activeId={category}
          onChange={(id) => setCategory(id as "all" | Category)}
          items={[
            { id: "all", label: "All", count: counts.all },
            { id: "camera", label: "Camera", count: counts.camera },
            { id: "watch", label: "Watch", count: counts.watch },
            { id: "sneaker", label: "Sneaker", count: counts.sneaker },
            { id: "bag", label: "Bag", count: counts.bag },
          ]}
        />
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {items.map(({ item, change }) => (
          <WatchlistRow
            key={item.id}
            item={item}
            change={change}
            isActive={item.id === activeId}
            isPinnedFeed={item.id === pinnedFeedId}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </ul>
    </nav>
  );
}

function WatchlistRow({
  item,
  change,
  isActive,
  isPinnedFeed,
  onSelect,
}: {
  item: WatchItem;
  change: number;
  isActive: boolean;
  isPinnedFeed: boolean;
  onSelect: () => void;
}) {
  const latest = item.series[item.series.length - 1];
  const sparkValues = item.series.slice(-14).map((p) => p.repick);
  const rising = change >= 0;

  return (
    <li className="mb-1 last:mb-0">
      <button
        onClick={onSelect}
        aria-current={isActive ? "true" : undefined}
        className={`group flex w-full min-w-0 flex-col gap-1.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${FOCUS_RING} ${
          isActive
            ? "border-amber-400/30 bg-amber-400/[0.07]"
            : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
        }`}
      >
        {/* No separate aria-label here — the accessible name is built entirely from this visible
            content plus a few sr-only spans that add context (full model name, "repick average",
            "today", pinned status) without ever diverging from what's on screen, which is what
            label-content-name-mismatch requires. */}
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
              isActive ? "bg-amber-400/15 text-amber-300" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            <CategoryIcon category={item.category} className="h-3.5 w-3.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-zinc-100">{item.shortName}</span>
            <span className="sr-only">{item.name}</span>
            <span className="block truncate text-[11px] text-zinc-400">{CATEGORY_LABEL[item.category]}</span>
          </span>
          {isPinnedFeed && (
            <span title="Comp feed pinned to this item" className="shrink-0 text-amber-300">
              <Pin className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">Comp feed pinned to this item</span>
            </span>
          )}
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          {/* Day-over-day direction is a different axis from "vs. market" (see CompTable) and is
              deliberately kept out of the amber/teal accent pair — an icon carries the sign so
              color is never the only signal, and it stays neutral zinc regardless of direction. */}
          <Sparkline
            values={sparkValues}
            width={72}
            height={20}
            stroke={isActive ? "#fbbf24" : "#71717a"}
            className="shrink-0"
          />
          <span className="flex shrink-0 items-baseline gap-1">
            <span className="tabular-nums text-[12.5px] font-medium text-zinc-100">{fmtCompact(latest.repick)}</span>
            <span className="sr-only">repick average price,</span>
            <span className="flex items-center gap-0.5 text-[11px] tabular-nums text-zinc-400">
              {rising ? (
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
              ) : (
                <TrendingDown className="h-3 w-3" aria-hidden="true" />
              )}
              {fmtSignedPct(change)}
            </span>
            <span className="sr-only">today</span>
          </span>
        </div>
      </button>
    </li>
  );
}
