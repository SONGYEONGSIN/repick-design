"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import type { RiskCase } from "./data";
import { BORDER, SEVERITY_BADGE, SEVERITY_LABEL, TEXT_AUX, TEXT_MUTED, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, Segmented } from "./ui";

type SortKey = "severity" | "dueInDays";
type View = "open" | "all";
const SEVERITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };

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
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700",
          active ? "text-zinc-900" : TEXT_AUX,
        )}
      >
        {label}
        <Icon size={11} aria-hidden="true" />
      </button>
    </th>
  );
}

export default function FindingsTable({ riskCase }: { riskCase: RiskCase }) {
  const [view, setView] = useState<View>("open");
  const [sortKey, setSortKey] = useState<SortKey>("dueInDays");
  const [asc, setAsc] = useState(true);

  const rows = useMemo(() => {
    const base = view === "open" ? riskCase.findings.filter((f) => f.status === "open") : riskCase.findings;
    const copy = [...base];
    copy.sort((a, b) => {
      const av = sortKey === "severity" ? SEVERITY_RANK[a.severity] : a.dueInDays;
      const bv = sortKey === "severity" ? SEVERITY_RANK[b.severity] : b.dueInDays;
      return asc ? av - bv : bv - av;
    });
    return copy;
  }, [riskCase, view, sortKey, asc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setAsc((v) => !v);
    else {
      setSortKey(key);
      setAsc(true);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={cx("text-[11px] font-normal", TEXT_MUTED)}>{`${rows.length} finding${rows.length === 1 ? "" : "s"} for ${riskCase.key}`}</p>
        <Segmented<View>
          ariaLabel="Findings view"
          value={view}
          onChange={setView}
          options={[
            { id: "open", label: "Open only" },
            { id: "all", label: "All, 90d" },
          ]}
        />
      </div>

      {rows.length === 0 ? (
        <p className={cx("mt-3 rounded-lg border px-3 py-4 text-center text-sm font-normal", BORDER, TEXT_AUX)}>No findings in this view.</p>
      ) : (
        <table className="mt-3 w-full table-fixed border-collapse text-sm">
          <caption className="sr-only">{`Findings for ${riskCase.vendor}`}</caption>
          <colgroup>
            <col className="w-[52%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 text-left text-[11px] font-medium uppercase tracking-[0.06em]", TEXT_AUX)}>
                Finding
              </th>
              <SortHeader label="Severity" sortKeyId="severity" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
              <SortHeader label="Due" sortKeyId="dueInDays" sortKey={sortKey} asc={asc} onToggle={toggleSort} />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {rows.map((f) => (
              <tr key={f.id} className="hover:bg-zinc-50">
                <td className="py-2.5 pr-2 align-middle">
                  <p className={cx("text-[13px] font-medium leading-snug", TEXT_PRIMARY)}>{f.title}</p>
                </td>
                <td className="py-2.5 pr-2 align-middle">
                  <Badge className={SEVERITY_BADGE[f.severity]}>{SEVERITY_LABEL[f.severity]}</Badge>
                </td>
                <td className={cx("whitespace-nowrap py-2.5 align-middle text-[13px] font-normal tabular-nums", TEXT_MUTED)}>
                  {f.status === "resolved" ? "Resolved" : `${f.dueInDays}d`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
