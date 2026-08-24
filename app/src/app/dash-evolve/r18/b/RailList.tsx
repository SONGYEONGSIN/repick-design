"use client";

import { useState } from "react";
import { ArrowUpDown, Check, ChevronDown, SearchX } from "lucide-react";
import { cx, focusRing, RiskChip, tierOf, type RiskTier } from "./ui";
import { krwEok, num, pct, type Contract } from "./data";

/**
 * The master rail: every renewal in the desk, one row each.
 *
 * Rows stack their fields rather than laying them out in a single line — at 1280px the rail is
 * roughly 370px wide, and an inline "company · ARR · utilisation" run is exactly where captions get
 * orphaned or clipped without any container ever reporting an overflow.
 */

type SortKey = "date" | "arr" | "risk";

const SORT_LABEL: Record<SortKey, string> = {
  date: "갱신일 임박순",
  arr: "ARR 높은순",
  risk: "리스크 높은순",
};

const TIER_FILTERS: Array<{ key: RiskTier | "all"; label: string }> = [
  { key: "all", label: "전체" },
  { key: "critical", label: "위험" },
  { key: "watch", label: "주의" },
  { key: "steady", label: "안정" },
];

function Sparkline({ values, tier }: { values: number[]; tier: RiskTier }) {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const span = high - low || 1;
  const path = values
    .map((value, index) => {
      const x = Math.round((index / (values.length - 1)) * 10000) / 100;
      const y = Math.round((96 - ((value - low) / span) * 88) * 100) / 100;
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-6 w-16 shrink-0"
    >
      <path
        d={path}
        fill="none"
        stroke={tier === "critical" ? "#fb7185" : tier === "watch" ? "#fcd34d" : "#a1a1aa"}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function RailList({
  contracts,
  activeId,
  onSelect,
}: {
  contracts: Contract[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [tierFilter, setTierFilter] = useState<RiskTier | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortOpen, setSortOpen] = useState(false);

  const counts = TIER_FILTERS.map((entry) => ({
    ...entry,
    count:
      entry.key === "all"
        ? contracts.length
        : contracts.filter((c) => tierOf(c.risk[c.risk.length - 1]) === entry.key).length,
  }));

  const visible = contracts
    .filter((c) => tierFilter === "all" || tierOf(c.risk[c.risk.length - 1]) === tierFilter)
    .slice()
    .sort((a, b) => {
      if (sortKey === "arr") return b.arr - a.arr;
      if (sortKey === "risk") return b.risk[b.risk.length - 1] - a.risk[a.risk.length - 1];
      return a.daysOut - b.daysOut;
    });

  const visibleArr = visible.reduce((sum, c) => sum + c.arr, 0);

  return (
    <>
      <div className="shrink-0 border-b border-white/10 px-3 pb-2.5">
        <div className="flex items-center justify-between gap-2 py-2.5">
          <h2 id="rail-heading" className="text-sm font-semibold text-zinc-100">
            갱신 파이프라인
          </h2>
          <span className="text-xs tabular-nums text-zinc-400">{num(contracts.length)}건</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex flex-wrap items-center gap-1">
            {counts.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setTierFilter(entry.key)}
                aria-pressed={tierFilter === entry.key}
                className={cx(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border px-2 text-xs transition-colors duration-150 motion-reduce:transition-none",
                  tierFilter === entry.key
                    ? "border-rose-500/35 bg-rose-500/10 text-rose-200"
                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07]",
                  focusRing,
                )}
              >
                {entry.label}
                <span className="tabular-nums text-zinc-400">{entry.count}</span>
              </button>
            ))}
          </div>

          <div
            className="relative ml-auto"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setSortOpen(false);
              }
            }}
          >
            <button
              type="button"
              onClick={() => setSortOpen((open) => !open)}
              aria-expanded={sortOpen}
              aria-haspopup="menu"
              className={cx(
                "inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs text-zinc-300 transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
              정렬
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {sortOpen && (
              <div
                role="menu"
                aria-label="목록 정렬 기준"
                className="absolute right-0 z-30 mt-1.5 w-44 rounded-lg border border-white/15 bg-zinc-900 p-1 shadow-xl shadow-black/60"
              >
                {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="menuitemradio"
                    aria-checked={key === sortKey}
                    onClick={() => {
                      setSortKey(key);
                      setSortOpen(false);
                    }}
                    className={cx(
                      "flex h-9 w-full items-center justify-between gap-2 rounded-md px-2 text-left text-xs transition-colors duration-150 hover:bg-white/[0.07] motion-reduce:transition-none",
                      key === sortKey ? "text-rose-200" : "text-zinc-300",
                      focusRing,
                    )}
                  >
                    {SORT_LABEL[key]}
                    {key === sortKey && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <SearchX className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            <p className="text-sm text-zinc-300">해당 등급의 갱신 건이 없습니다.</p>
            <p className="text-xs text-zinc-400">
              필터를 전체로 되돌리면 {num(contracts.length)}건이 모두 보입니다.
            </p>
          </div>
        ) : (
          <ul className="space-y-1">
            {visible.map((contract) => {
              const last = contract.risk.length - 1;
              const tier = tierOf(contract.risk[last]);
              const selected = contract.id === activeId;
              return (
                <li key={contract.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(contract.id)}
                    aria-current={selected ? "true" : undefined}
                    className={cx(
                      "relative block w-full rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 motion-reduce:transition-none",
                      selected
                        ? "border-rose-500/30 bg-rose-500/[0.09]"
                        : "border-transparent hover:border-white/10 hover:bg-white/[0.04]",
                      focusRing,
                    )}
                  >
                    {selected && (
                      <span
                        aria-hidden="true"
                        className="absolute top-3 bottom-3 left-0 w-[3px] rounded-full bg-rose-400"
                      />
                    )}
                    <span className="flex items-center justify-between gap-2">
                      <RiskChip tier={tier} score={contract.risk[last]} size="xs" />
                      <span className="text-[11px] tabular-nums text-zinc-400">
                        D-{contract.daysOut}
                      </span>
                    </span>
                    <span className="mt-1.5 block truncate text-[15px] font-medium text-zinc-50">
                      {contract.company}
                    </span>
                    <span className="mt-0.5 block text-xs text-zinc-400">
                      {contract.segment} · 라이선스 {num(contract.licensed[last])}석
                    </span>
                    <span className="mt-2 flex items-end justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold tabular-nums text-zinc-100">
                          {krwEok(contract.arr)}
                        </span>
                        <span className="mt-0.5 block text-[11px] tabular-nums text-zinc-400">
                          활용률 {pct(contract.utilization[last])}
                        </span>
                      </span>
                      <Sparkline values={contract.active} tier={tier} />
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="shrink-0 space-y-1 border-t border-white/10 px-3 py-2.5">
        <p className="text-[11px] text-zinc-400">정렬 · {SORT_LABEL[sortKey]}</p>
        <p className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs text-zinc-400">
          <span>
            표시 <span className="tabular-nums text-zinc-200">{num(visible.length)}</span>건
          </span>
          <span>
            합계 ARR{" "}
            <span className="font-semibold tabular-nums text-zinc-100">{krwEok(visibleArr)}</span>
          </span>
        </p>
      </div>
    </>
  );
}
