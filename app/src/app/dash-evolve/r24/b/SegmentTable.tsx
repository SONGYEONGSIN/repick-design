"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { RolloutView } from "./data";
import { fmt } from "./data";

type SortKey = "label" | "eligible" | "included" | "excluded" | "coverage";
type Row = RolloutView["segments"][number] & { coverage: number };

function SortHeader({
  label,
  active,
  dir,
  onClick,
  align = "right",
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right";
}) {
  return (
    <th scope="col" aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"} className="px-3 py-2">
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400 hover:text-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
          align === "right" ? "justify-end" : "justify-start"
        }`}
      >
        {align === "left" && (active ? dir === "asc" ? <ArrowUp className="size-3" aria-hidden="true" /> : <ArrowDown className="size-3" aria-hidden="true" /> : <ArrowUpDown className="size-3 opacity-50" aria-hidden="true" />)}
        {label}
        {align === "right" && (active ? dir === "asc" ? <ArrowUp className="size-3" aria-hidden="true" /> : <ArrowDown className="size-3" aria-hidden="true" /> : <ArrowUpDown className="size-3 opacity-50" aria-hidden="true" />)}
      </button>
    </th>
  );
}

export default function SegmentTable({ view, env }: { view: RolloutView; env: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("eligible");
  const [dir, setDir] = useState<"asc" | "desc">("desc");

  const rows: Row[] = useMemo(
    () =>
      view.segments.map((s) => ({
        ...s,
        coverage: s.eligible > 0 ? Math.round((s.included / s.eligible) * 1000) / 10 : 0,
      })),
    [view]
  );

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = sortKey === "label" ? a.label : a[sortKey];
      const vb = sortKey === "label" ? b.label : b[sortKey];
      const cmp = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      return dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, dir]);

  function toggle(key: SortKey) {
    if (key === sortKey) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir("desc");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <caption className="mb-2 text-left text-xs text-zinc-400">
          Audience segments in {env}, split by whether they fall inside or outside the current rollout percentage.
        </caption>
        <colgroup>
          <col style={{ width: "26%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "20%" }} />
        </colgroup>
        <thead>
          <tr className="border-b border-white/10">
            <SortHeader label="Segment" active={sortKey === "label"} dir={dir} onClick={() => toggle("label")} align="left" />
            <SortHeader label="Eligible" active={sortKey === "eligible"} dir={dir} onClick={() => toggle("eligible")} />
            <SortHeader label="Included" active={sortKey === "included"} dir={dir} onClick={() => toggle("included")} />
            <SortHeader label="Excluded" active={sortKey === "excluded"} dir={dir} onClick={() => toggle("excluded")} />
            <SortHeader label="Coverage" active={sortKey === "coverage"} dir={dir} onClick={() => toggle("coverage")} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="border-b border-white/[0.06] last:border-0 hover:bg-white/[0.02]">
              <td className="overflow-hidden truncate px-3 py-2.5 text-zinc-200">{row.label}</td>
              <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-300">{fmt(row.eligible)}</td>
              <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-sky-300">{fmt(row.included)}</td>
              <td className="overflow-hidden whitespace-nowrap px-3 py-2.5 text-right tabular-nums text-zinc-400">{fmt(row.excluded)}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-2">
                  <div className="h-1.5 w-9 shrink-0 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                    <div
                      className="h-full origin-left rounded-full bg-sky-400 transition-transform duration-200 ease-out motion-reduce:transition-none"
                      style={{ transform: `scaleX(${row.coverage / 100})` }}
                    />
                  </div>
                  <span className="w-9 shrink-0 whitespace-nowrap text-right text-xs tabular-nums text-zinc-300">{row.coverage}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
