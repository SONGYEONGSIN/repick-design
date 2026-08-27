"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { SKUS, daysOfCover, riskTier, type Sku } from "./data";
import { BORDER, RISK_BADGE, RISK_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type RiskTier, cx } from "./tokens";
import { Badge } from "./ui";

type SortKey = "daysOfCover" | "onHand";
const TIERS: RiskTier[] = ["critical", "watch", "healthy"];

function SortHeader({
  label,
  sortKeyId,
  sortKey,
  asc,
  onToggle,
  className,
}: {
  label: string;
  sortKeyId: SortKey;
  sortKey: SortKey;
  asc: boolean;
  onToggle: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortKeyId;
  const Icon = active ? (asc ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th scope="col" aria-sort={active ? (asc ? "ascending" : "descending") : "none"} className={cx("py-2 text-left align-middle", className)}>
      <button
        type="button"
        onClick={() => onToggle(sortKeyId)}
        className={cx(
          "inline-flex items-center gap-1 rounded px-1 text-[11px] font-medium uppercase tracking-[0.06em]",
          TRANSITION,
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
          active ? "text-zinc-50" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function SkuTable() {
  const [activeTiers, setActiveTiers] = useState<RiskTier[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("daysOfCover");
  const [asc, setAsc] = useState(true);

  function toggleTier(t: RiskTier) {
    setActiveTiers((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }
  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  const rows = useMemo(() => {
    let list: Sku[] = SKUS;
    if (activeTiers.length > 0) list = list.filter((s) => activeTiers.includes(riskTier(s)));
    const copy = [...list];
    copy.sort((a, b) => {
      const av = sortKey === "daysOfCover" ? daysOfCover(a) : a.onHand;
      const bv = sortKey === "daysOfCover" ? daysOfCover(b) : b.onHand;
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [activeTiers, sortKey, asc]);

  return (
    <div>
      <div role="group" aria-label="Filter by risk tier" className="flex flex-wrap items-center gap-1.5">
        {TIERS.map((t) => {
          const active = activeTiers.includes(t);
          return (
            <button
              key={t}
              type="button"
              aria-pressed={active}
              onClick={() => toggleTier(t)}
              className={cx(
                "h-7 rounded-full border px-2.5 text-[11px] font-medium",
                TRANSITION,
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400",
                active ? RISK_BADGE[t] : cx(BORDER, "bg-white/[0.03]", TEXT_MUTED, "hover:bg-white/[0.06]"),
              )}
            >
              {RISK_LABEL[t]}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <p className={cx("mt-3 rounded-lg border px-3 py-4 text-center text-sm font-normal", BORDER, TEXT_AUX)}>No SKUs match this filter.</p>
      ) : (
        <table className="mt-3 w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">SKU inventory risk</caption>
          <colgroup>
            <col className="w-[44%]" />
            <col className="hidden w-[16%] sm:table-column" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                SKU
              </th>
              <th scope="col" className={cx("hidden py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em] sm:table-cell", TEXT_AUX)}>
                Warehouse
              </th>
              <SortHeader label="On hand" sortKeyId="onHand" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Cover" sortKeyId="daysOfCover" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((s) => {
              const tier = riskTier(s);
              const cover = daysOfCover(s);
              return (
                <tr key={s.id} className="hover:bg-white/[0.03]">
                  <td className="py-2.5 pr-2 align-middle">
                    <p className={cx("truncate text-[13px] font-medium", TEXT_PRIMARY)}>{s.name}</p>
                    <p className={cx("truncate font-mono text-[11px] font-normal", TEXT_AUX)}>{s.code}</p>
                  </td>
                  <td className={cx("hidden truncate py-2.5 pr-2 align-middle text-[13px] font-normal sm:table-cell", TEXT_MUTED)}>{s.warehouse === "east" ? "East DC" : "West DC"}</td>
                  <td className={cx("whitespace-nowrap py-2.5 pr-2 align-middle text-[13px] font-normal tabular-nums", TEXT_MUTED)}>{s.onHand.toLocaleString("en-US")}</td>
                  <td className="whitespace-nowrap py-2.5 align-middle">
                    <Badge className={RISK_BADGE[tier]}>{`${cover.toFixed(1)}d`}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
