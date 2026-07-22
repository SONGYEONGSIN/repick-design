"use client";

import { useMemo, useState } from "react";
import { formatDate, signalsFor, type AccountSnapshot } from "./data";
import { BORDER, DIVIDE, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TRANSITION, cx } from "./tokens";
import { Badge, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

type ImpactFilter = "all" | "risk" | "positive" | "neutral";
const IMPACT_OPTIONS: { id: ImpactFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "risk", label: "Risk" },
  { id: "positive", label: "Positive" },
  { id: "neutral", label: "Neutral" },
];

type SortKey = "date" | "category";

const CATEGORY_LABEL: Record<string, string> = {
  support: "Support",
  usage: "Usage",
  sentiment: "Sentiment",
  org: "Org change",
  adoption: "Adoption",
};

export default function SignalsTable({ account }: { account: AccountSnapshot }) {
  const [impact, setImpact] = useState<ImpactFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const signals = useMemo(() => signalsFor(account), [account]);

  const rows = useMemo(() => {
    let list = signals.filter((s) => {
      if (impact === "risk") return s.tone === "down";
      if (impact === "positive") return s.tone === "up";
      if (impact === "neutral") return s.tone === "warn" || s.tone === "neutral";
      return true;
    });
    list = [...list].sort((a, b) => {
      const cmp = sortKey === "date" ? a.dateIso.localeCompare(b.dateIso) : a.category.localeCompare(b.category);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [signals, impact, sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <CardHeader
        as="h3"
        title="Recent support & usage signals"
        titleId="signals-table-heading"
        description={`${rows.length} of ${signals.length} shown for ${account.name}`}
        action={<SegmentedControl ariaLabel="Filter signals by impact" options={IMPACT_OPTIONS} value={impact} onChange={setImpact} size="sm" />}
      />

      <div className={cx("mt-3 min-h-0 flex-1 overflow-y-auto rounded-lg border [scrollbar-width:thin]", BORDER)}>
        <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="signals-table-heading">
          <caption className="sr-only">
            Recent support and usage signals for {account.name}, sortable by date and category, filterable by impact.
          </caption>
          <colgroup>
            <col style={{ width: "22%" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "52%" }} />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className={cx("border-b", BORDER)}>
              <SortableTh columnKey="date" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Date
              </SortableTh>
              <SortableTh columnKey="category" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                Type
              </SortableTh>
              <th scope="col" className="py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide">
                <span className={TEXT_CAPTION}>Signal</span>
              </th>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className={cx("py-6 text-center text-sm", TEXT_CAPTION)}>
                  No signals match this filter.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className={cx(HOVER_ROW, TRANSITION)}>
                  <td className={cx("py-2 pl-3 align-top text-xs whitespace-nowrap", NUM, TEXT_CAPTION)}>{formatDate(s.dateIso)}</td>
                  <td className="py-2 pl-3 align-top">
                    <Badge tone={s.tone} Icon={s.Icon}>
                      {CATEGORY_LABEL[s.category]}
                    </Badge>
                  </td>
                  <td className={cx("py-2 pl-3 pr-3 align-top text-xs leading-snug", TEXT_PRIMARY)}>{s.title}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
