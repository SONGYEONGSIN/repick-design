"use client";

import { ArrowUpDown, ChevronDown, ChevronUp, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CERTIFICATION_META, FACILITIES, FACILITY_TYPE_META, type PeriodMode, periodValues, REGIONS, type Region } from "./data";
import { BORDER, FOCUS, NUM, SURFACE_INSET, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { DeltaTag } from "./ui";

type SortKey = "name" | "region" | "previous" | "current" | "delta" | "incidents";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Facility" },
  { key: "region", label: "Region" },
  { key: "previous", label: "Prev.", align: "right" },
  { key: "current", label: "Current", align: "right" },
  { key: "delta", label: "Change", align: "right" },
  { key: "incidents", label: "Incidents", align: "right" },
];

export default function FacilityTable({
  mode,
  pinnedId,
  onPin,
}: {
  mode: PeriodMode;
  pinnedId: string | null;
  onPin: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "current", dir: "desc" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = FACILITIES.filter((f) => {
      if (region !== "all" && f.region !== region) return false;
      if (q === "") return true;
      return f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q) || f.type.toLowerCase().includes(q);
    });
    const withValues = filtered.map((f) => ({ facility: f, ...periodValues(f, mode) }));
    const dirMul = sort.dir === "asc" ? 1 : -1;
    withValues.sort((a, b) => {
      switch (sort.key) {
        case "name":
          return a.facility.name.localeCompare(b.facility.name) * dirMul;
        case "region":
          return a.facility.region.localeCompare(b.facility.region) * dirMul;
        case "previous":
          return (a.previous - b.previous) * dirMul;
        case "current":
          return (a.current - b.current) * dirMul;
        case "delta":
          return (a.delta - b.delta) * dirMul;
        case "incidents":
          return (a.facility.openIncidents - b.facility.openIncidents) * dirMul;
        default:
          return 0;
      }
    });
    return withValues;
  }, [query, region, sort, mode]);

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  }

  return (
    <div>
      <h2 className={cx("mb-3 text-sm font-semibold tracking-tight", TEXT_PRIMARY)}>All facilities</h2>
      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <div className={cx("flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 sm:max-w-xs", BORDER, SURFACE_INSET)}>
          <Search size={15} aria-hidden="true" className={cx("shrink-0", TEXT_AUX)} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Filter facilities…"
            aria-label="Filter facilities by name, region or type"
            className={cx("h-full min-w-0 flex-1 rounded-md bg-transparent text-sm font-normal", TEXT_PRIMARY, "placeholder:text-zinc-400", FOCUS)}
          />
        </div>
        <label className="flex items-center gap-2">
          <span className="sr-only">Filter by region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as Region | "all")}
            className={cx("h-11 rounded-lg border px-3 text-sm font-medium", BORDER, SURFACE_INSET, TEXT_MUTED, TRANSITION, FOCUS)}
          >
            <option value="all">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <p className={cx("text-xs font-normal", TEXT_AUX)}>
          {rows.length} of {FACILITIES.length} facilities
        </p>
      </div>

      <div className="relative overflow-x-auto rounded-xl border border-zinc-200 [scrollbar-width:thin]">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className={cx("border-b", BORDER, SURFACE_INSET)}>
              {COLUMNS.map((col) => {
                const active = sort.key === col.key;
                const ariaSort = active ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
                const SortIcon = active ? (sort.dir === "asc" ? ChevronUp : ChevronDown) : ArrowUpDown;
                return (
                  <th key={col.key} scope="col" aria-sort={ariaSort} className={cx("px-3 py-2.5 text-xs font-medium", col.align === "right" ? "text-right" : "text-left")}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cx(
                        "inline-flex min-h-9 items-center gap-1 rounded-md px-1.5 whitespace-nowrap",
                        TRANSITION,
                        FOCUS,
                        col.align === "right" && "flex-row-reverse",
                        active ? "text-zinc-900" : TEXT_MUTED,
                        "hover:text-zinc-900",
                      )}
                    >
                      {col.label}
                      <SortIcon size={13} aria-hidden="true" className={active ? "text-lime-700" : "text-zinc-400"} />
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="px-3 py-2.5 text-left text-xs font-medium">
                Certification
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map(({ facility, previous, current, delta, direction }) => {
              const TypeIcon = FACILITY_TYPE_META[facility.type].Icon;
              const cert = CERTIFICATION_META[facility.certification];
              const pinned = pinnedId === facility.id;
              return (
                <tr key={facility.id} className={cx(TRANSITION, pinned ? "bg-lime-50" : "hover:bg-zinc-50")}>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => onPin(facility.id)}
                      aria-pressed={pinned}
                      className={cx("flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-left", TRANSITION, FOCUS, "hover:bg-white")}
                    >
                      <TypeIcon size={15} aria-hidden="true" className="shrink-0 text-zinc-400" />
                      <span className={cx("min-w-0 truncate text-sm font-medium", TEXT_PRIMARY)}>{facility.name}</span>
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <span className={cx("flex items-center gap-1.5 whitespace-nowrap text-sm font-normal", TEXT_MUTED)}>
                      <MapPin size={12} aria-hidden="true" className="shrink-0 text-zinc-400" />
                      {facility.region}
                    </span>
                  </td>
                  <td className={cx("px-3 py-2 text-right text-sm font-medium whitespace-nowrap", NUM, TEXT_MUTED)}>{previous}</td>
                  <td className={cx("px-3 py-2 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{current}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <DeltaTag delta={delta} direction={direction} className="ml-auto" />
                  </td>
                  <td className={cx("px-3 py-2 text-right text-sm font-normal whitespace-nowrap", NUM, TEXT_MUTED)}>{facility.openIncidents}</td>
                  <td className="px-3 py-2">
                    <span className={cx("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none whitespace-nowrap", cert.className)}>
                      <cert.Icon size={11} aria-hidden="true" />
                      {facility.certification}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className={cx("px-3 py-8 text-center text-sm font-normal", TEXT_AUX)}>
                  No facilities match that filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
