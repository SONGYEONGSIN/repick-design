"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AXIS_SHORT, RISK_AXES, type Vendor, overallScore, riskBand } from "./data";
import { BAND_BADGE, BAND_DOT, BAND_LABEL, FOCUS, HOVER_ROW, NUM, SERIES_HEX, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, type RiskBand, cx } from "./tokens";
import { Badge, Segmented } from "./ui";

type SortKey = "name" | "overall" | "band";
type SortDir = "asc" | "desc";
const BAND_RANK: Record<RiskBand, number> = { weak: 0, watch: 1, strong: 2 };
const BAND_OPTIONS: { id: RiskBand | "all"; label: string }[] = [
  { id: "all", label: "All bands" },
  { id: "strong", label: "Strong" },
  { id: "watch", label: "Watch" },
  { id: "weak", label: "At risk" },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={12} aria-hidden="true" className="opacity-50" />;
  return dir === "asc" ? <ArrowUp size={12} aria-hidden="true" /> : <ArrowDown size={12} aria-hidden="true" />;
}

function SortableHead({
  label,
  sortableKey,
  sortKey,
  sortDir,
  onSort,
  className,
}: {
  label: string;
  sortableKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  className?: string;
}) {
  const active = sortKey === sortableKey;
  const ariaSort: "ascending" | "descending" | "none" = !active ? "none" : sortDir === "asc" ? "ascending" : "descending";
  return (
    <th scope="col" aria-sort={ariaSort} className={cx("px-2 py-2 text-left align-bottom", className)}>
      <button
        type="button"
        onClick={() => onSort(sortableKey)}
        className={cx("inline-flex items-center gap-1 rounded text-[11px] font-semibold uppercase tracking-[0.04em]", TRANSITION, FOCUS, active ? TEXT_PRIMARY : TEXT_MUTED)}
      >
        {label}
        <SortIcon active={active} dir={sortDir} />
      </button>
    </th>
  );
}

/**
 * This table is the mandatory always-visible fallback for the radar above it: every per-axis
 * score is printed as persistent text here, in full, regardless of which vendors are toggled on
 * or off the radar and regardless of any hover/focus state. Nothing on this page requires an
 * interaction to learn a vendor's exact numbers — sort and the band filter only reorder/narrow
 * which rows are visible, they never hide a number behind a hover.
 */
export default function ScoreTable({
  vendors,
  spotlightId,
  onSpotlight,
}: {
  vendors: Vendor[];
  spotlightId: string;
  onSpotlight: (id: string) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("overall");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [bandFilter, setBandFilter] = useState<RiskBand | "all">("all");

  const rows = useMemo(() => {
    const withScore = vendors.map((v) => ({ v, overall: overallScore(v), band: riskBand(overallScore(v)) }));
    const filtered = bandFilter === "all" ? withScore : withScore.filter((r) => r.band === bandFilter);
    const dirMul = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "name") return a.v.name.localeCompare(b.v.name) * dirMul;
      if (sortKey === "band") return (BAND_RANK[a.band] - BAND_RANK[b.band]) * dirMul;
      return (a.overall - b.overall) * dirMul;
    });
  }, [vendors, sortKey, sortDir, bandFilter]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <div>
      <div className="mb-3">
        <Segmented options={BAND_OPTIONS} value={bandFilter} onChange={setBandFilter} ariaLabel="Filter by risk band" />
      </div>

      {/* `relative` here is load-bearing, not cosmetic: the sr-only caption and the sr-only axis
          names inside <th> are position:absolute, and without a positioned ancestor their
          containing block would skip this scroll boundary entirely and paint at the pre-scroll
          layout position — silently inflating document.scrollWidth at 390px. This div is both the
          clip boundary and the containing block, so they stay correctly clipped together. */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[820px] lg:min-w-0 table-fixed border-collapse text-sm">
          <caption className="sr-only">
            {`Vendor risk scorecard: ${vendors.length} vendors scored 0 to 10 across seven axes — ${RISK_AXES.map((a) => `${AXIS_SHORT[a]} = ${a}`).join(", ")}. Select a vendor name to open its spotlight.`}
          </caption>
          <colgroup>
            <col style={{ width: "19%" }} />
            <col style={{ width: "10%" }} />
            {RISK_AXES.map((a) => (
              <col key={a} style={{ width: "9%" }} />
            ))}
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-white/10">
              <SortableHead label="Vendor" sortableKey="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              <SortableHead label="Band" sortableKey="band" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
              {RISK_AXES.map((axis) => (
                <th key={axis} scope="col" className={cx("px-2 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.04em]", TEXT_MUTED)}>
                  <span aria-hidden="true">{AXIS_SHORT[axis]}</span>
                  <span className="sr-only">{axis}</span>
                </th>
              ))}
              <SortableHead label="Ovr." sortableKey="overall" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="text-right" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map(({ v, overall, band }) => {
              const isSpotlight = v.id === spotlightId;
              return (
                <tr key={v.id} className={cx(HOVER_ROW, TRANSITION, isSpotlight && "bg-amber-400/[0.06]")}>
                  <td className="px-2 py-2.5 align-middle">
                    <button
                      type="button"
                      aria-current={isSpotlight ? "true" : undefined}
                      onClick={() => onSpotlight(v.id)}
                      className={cx("flex min-w-0 items-center gap-2 rounded text-left", FOCUS)}
                    >
                      <span className="relative shrink-0 rounded-full p-[1.5px]" style={{ backgroundColor: SERIES_HEX[v.id] }}>
                        <Image
                          src={`https://images.unsplash.com/photo-${v.owner.avatarId}?w=48&h=48&fit=crop&crop=faces`}
                          alt={`${v.owner.name}, relationship owner`}
                          width={24}
                          height={24}
                          className="h-6 w-6 rounded-full border-2 border-zinc-900 bg-zinc-800 object-cover"
                        />
                      </span>
                      <span className="min-w-0">
                        <span className={cx("block truncate text-[13px] font-semibold", TEXT_PRIMARY)}>{v.name}</span>
                        <span className={cx("block truncate font-mono text-[10.5px]", TEXT_AUX)}>{v.code}</span>
                      </span>
                    </button>
                  </td>
                  <td className="px-2 py-2.5 align-middle">
                    <Badge className={BAND_BADGE[band]}>
                      <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", BAND_DOT[band])} />
                      {BAND_LABEL[band]}
                    </Badge>
                  </td>
                  {RISK_AXES.map((axis) => (
                    <td key={axis} className={cx("px-2 py-2.5 text-right align-middle text-[13px]", NUM, TEXT_PRIMARY)}>
                      {v.axes[axis].toFixed(1)}
                    </td>
                  ))}
                  <td className={cx("px-2 py-2.5 text-right align-middle text-[13px] font-semibold", NUM, TEXT_PRIMARY)}>{overall.toFixed(1)}</td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={RISK_AXES.length + 3} className={cx("px-2 py-6 text-center text-sm", TEXT_AUX)}>
                  No vendors match this band filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p className={cx("mt-2.5 text-[11px] font-normal leading-relaxed", TEXT_AUX)}>
        {RISK_AXES.map((a) => `${AXIS_SHORT[a]} ${a}`).join(" · ")}
      </p>
    </div>
  );
}
