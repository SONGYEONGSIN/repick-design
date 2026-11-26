"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import {
  ALL_NODES,
  RISK_BAND_LABEL,
  TIER_LABEL,
  isConcentrationRisk,
  isSupplierNode,
  neighborsOf,
  ownerOf,
  riskBand,
  spendIncomingTo,
  spendOutgoingFrom,
  usdCompact,
  type GraphNodeData,
  type Tier,
} from "./data";
import { FOCUS_RING, FOCUS_RING_INSET } from "./focus";
import { DropdownMenu, RiskBadge, TierBadge, ToggleSwitch } from "./ui";

type SortKey = "name" | "risk" | "connections" | "spend";
type SortDir = "asc" | "desc";
type TierFilter = "all" | Tier;

const SORT_LABEL: Record<SortKey, string> = { name: "node name", risk: "risk score", connections: "link count", spend: "annual spend" };

const TIER_FILTER_OPTIONS: Array<{ value: TierFilter; label: string }> = [
  { value: "all", label: "All tiers" },
  { value: "site", label: "Sites" },
  { value: "tier1", label: "Tier-1" },
  { value: "tier2", label: "Tier-2" },
];

function riskScoreOf(n: GraphNodeData): number {
  return isSupplierNode(n) ? n.riskScore : -1;
}

function spendOf(n: GraphNodeData): number {
  if (n.tier === "site") return spendOutgoingFrom(n.id);
  if (n.tier === "tier1") return spendIncomingTo(n.id);
  return 0;
}

function connectionsOf(n: GraphNodeData): number {
  const { upstream, downstream } = neighborsOf(n.id);
  return upstream.length + downstream.length;
}

function matches(node: GraphNodeData, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return [node.name, node.code, node.category, node.country].some((v) => v.toLowerCase().includes(needle));
}

export function AdjacencyTable({
  pinnedId,
  onPin,
}: {
  pinnedId: string;
  onPin: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [tierMenuOpen, setTierMenuOpen] = useState(false);
  const [concentrationOnly, setConcentrationOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const filtered = ALL_NODES.filter((n) => {
      if (tierFilter !== "all" && n.tier !== tierFilter) return false;
      if (concentrationOnly && !isConcentrationRisk(n.id)) return false;
      return matches(n, query);
    });
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "risk") cmp = riskScoreOf(a) - riskScoreOf(b);
      else if (sortKey === "connections") cmp = connectionsOf(a) - connectionsOf(b);
      else cmp = spendOf(a) - spendOf(b);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [query, tierFilter, concentrationOnly, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function ariaSortFor(key: SortKey): "ascending" | "descending" | "none" {
    if (sortKey !== key) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative flex min-w-0 flex-1 items-center sm:max-w-xs">
          <span className="sr-only">Filter the adjacency list by name, category or country</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 size-4 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, category, country…"
            className={`${FOCUS_RING} h-9 w-full min-w-0 rounded-md border border-white/10 bg-white/5 pl-9 pr-3 text-sm font-normal text-zinc-50 placeholder:text-zinc-400`}
          />
        </label>
        <DropdownMenu
          label="Tier"
          options={TIER_FILTER_OPTIONS}
          value={tierFilter}
          onChange={setTierFilter}
          open={tierMenuOpen}
          onOpenChange={setTierMenuOpen}
        />
        <ToggleSwitch
          id="concentration-only-switch"
          checked={concentrationOnly}
          onChange={setConcentrationOnly}
          label="Concentration risk only"
        />
      </div>

      <div className="min-w-0 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full table-fixed border-collapse text-sm">
          <caption className="px-3 py-2.5 text-left text-xs font-normal text-zinc-400">
            Vendor dependency adjacency list. {rows.length} of {ALL_NODES.length} nodes shown, sorted by {SORT_LABEL[sortKey]} (
            {sortDir === "asc" ? "ascending" : "descending"}).
          </caption>
          <colgroup>
            <col className="w-[50%] sm:w-[26%]" />
            <col className="hidden sm:table-column sm:w-[12%]" />
            <col className="w-[24%] sm:w-[14%]" />
            <col className="hidden sm:table-column sm:w-[14%]" />
            <col className="hidden sm:table-column sm:w-[18%]" />
            <col className="w-[26%] sm:w-[16%]" />
          </colgroup>
          <thead>
            <tr className="border-t border-white/10 bg-white/[0.03] text-left">
              <th scope="col" aria-sort={ariaSortFor("name")} className="px-3 py-2.5 font-medium text-zinc-400">
                <SortButton label="Node" active={sortKey === "name"} dir={sortDir} onClick={() => toggleSort("name")} />
              </th>
              <th scope="col" className="hidden px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 sm:table-cell">
                Tier
              </th>
              <th scope="col" aria-sort={ariaSortFor("risk")} className="px-3 py-2.5 font-medium text-zinc-400">
                <SortButton label="Risk" active={sortKey === "risk"} dir={sortDir} onClick={() => toggleSort("risk")} />
              </th>
              <th
                scope="col"
                aria-sort={ariaSortFor("connections")}
                className="hidden px-3 py-2.5 font-medium text-zinc-400 sm:table-cell"
              >
                <SortButton label="Links" active={sortKey === "connections"} dir={sortDir} onClick={() => toggleSort("connections")} />
              </th>
              <th scope="col" className="hidden px-3 py-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 sm:table-cell">
                Owner
              </th>
              <th scope="col" aria-sort={ariaSortFor("spend")} className="px-3 py-2.5 text-right font-medium text-zinc-400">
                <SortButton label="Spend" active={sortKey === "spend"} dir={sortDir} onClick={() => toggleSort("spend")} align="right" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((n) => {
              const supplier = isSupplierNode(n) ? n : null;
              const owner = supplier ? ownerOf(supplier.ownerId) : null;
              const band = supplier ? riskBand(supplier.riskScore) : null;
              const spend = spendOf(n);
              const links = connectionsOf(n);
              const pinned = pinnedId === n.id;
              return (
                <tr key={n.id} className={`border-t border-white/5 transition-colors motion-reduce:transition-none ${pinned ? "bg-violet-600/10" : "hover:bg-white/[0.03]"}`}>
                  <th scope="row" className="px-3 py-2.5 font-medium text-zinc-50">
                    <button
                      type="button"
                      onClick={() => onPin(n.id)}
                      className={`${FOCUS_RING_INSET} flex min-w-0 items-center gap-2 rounded text-left hover:text-violet-200`}
                    >
                      <span className="shrink-0 whitespace-nowrap rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] font-normal text-zinc-400">
                        {n.code}
                      </span>
                      <span className="min-w-0 truncate">{n.name}</span>
                      {isConcentrationRisk(n.id) && <span className="sr-only"> — flagged as concentration risk</span>}
                    </button>
                  </th>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    <TierBadge label={TIER_LABEL[n.tier]} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    {band && supplier ? (
                      <span className="flex items-center gap-1.5">
                        <span className="tabular-nums text-zinc-300">{supplier.riskScore}</span>
                        <RiskBadge band={band} label={RISK_BAND_LABEL[band]} />
                      </span>
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-2.5 tabular-nums text-zinc-300 sm:table-cell">{links}</td>
                  <td className="hidden px-3 py-2.5 sm:table-cell">
                    {owner ? (
                      <span className="flex min-w-0 items-center gap-2">
                        <Image
                          src={`https://images.unsplash.com/photo-${owner.photoId}?q=80&w=96&auto=format&fit=crop`}
                          alt={`Portrait of ${owner.name}`}
                          width={20}
                          height={20}
                          className="size-5 shrink-0 rounded-full object-cover"
                        />
                        <span className="min-w-0 truncate text-zinc-300">{owner.name}</span>
                      </span>
                    ) : (
                      <span className="text-zinc-400">Internal</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums font-medium text-zinc-50">
                    {spend > 0 ? usdCompact(spend) : <span className="font-normal text-zinc-400">—</span>}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-sm font-normal text-zinc-400">
                  No nodes match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortButton({
  label,
  active,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  align?: "left" | "right";
}) {
  const Icon = active ? (dir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${FOCUS_RING_INSET} inline-flex items-center gap-1 rounded text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400 hover:text-zinc-50 ${
        align === "right" ? "flex-row-reverse" : ""
      }`}
    >
      {label}
      <Icon aria-hidden="true" className={`size-3 shrink-0 ${active ? "text-violet-300" : "opacity-50"}`} />
    </button>
  );
}
