"use client";

import { useMemo, useState } from "react";
import { formatCount, NODE_MAP, NODES, STATUS_META, type StatusId } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, ProgressBar, SegmentedControl, SortableTh, StatusBadge, type SortDir } from "./ui";

type SortKey = "team" | "headcount" | "utilization" | "openReqs";
type FilterId = "all" | StatusId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "healthy", label: "Healthy" },
  { id: "at-risk", label: "At Risk" },
  { id: "overloaded", label: "Overloaded" },
];

const KIND_LABEL: Record<string, string> = { company: "회사", division: "부문", team: "팀" };

export default function RosterTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("headcount");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<FilterId>("all");

  const rows = useMemo(() => {
    const filtered = filter === "all" ? NODES : NODES.filter((n) => n.status === filter);
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "team") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "headcount") cmp = a.headcount - b.headcount;
      else if (sortKey === "utilization") cmp = a.utilization - b.utilization;
      else cmp = a.openReqs - b.openReqs;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sortKey, sortDir, filter]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "team" ? "asc" : "desc");
    }
  }

  return (
    <Card padded={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <CardHeader
          title="팀 로스터"
          titleId="roster-heading"
          description={`조직도의 전체 노드를 표로 · ${rows.length}건 · 행을 선택하면 위 조직도가 동기화됩니다`}
        />
        <SegmentedControl ariaLabel="상태 필터" options={FILTERS} value={filter} onChange={setFilter} size="sm" />
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[760px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="roster-heading">
              <caption className="sr-only">
                Solace Systems 조직 로스터. 팀, 상위 부문, 리드, 헤드카운트, 가동률, 채용 요청, 상태 기준으로 정렬 및 필터할 수 있습니다.
              </caption>
              <colgroup>
                <col style={{ width: "24%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "11%" }} />
                <col style={{ width: "19%" }} />
                <col style={{ width: "12%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="team" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    팀
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    상위 부문
                  </th>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    리드
                  </th>
                  <SortableTh columnKey="headcount" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    HC
                  </SortableTh>
                  <SortableTh columnKey="utilization" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    가동률
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.map((n) => {
                  const parent = n.parentId ? NODE_MAP[n.parentId] : null;
                  const selected = n.id === selectedId;
                  const status = STATUS_META[n.status];
                  return (
                    <tr key={n.id} className={cx(HOVER_ROW, TRANSITION, selected && "bg-teal-50/70 dark:bg-teal-500/10")}>
                      <td className="py-2 pl-3 text-left">
                        <button type="button" onClick={() => onSelect(n.id)} aria-pressed={selected} className={cx("group flex min-w-0 max-w-full items-center gap-1.5 rounded text-left", FOCUS_RING)}>
                          <span className={cx("truncate text-sm font-medium group-hover:underline", TEXT_PRIMARY)}>{n.name}</span>
                        </button>
                        <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{KIND_LABEL[n.kind]}</p>
                      </td>
                      <td className={cx("py-2 pl-3 text-left text-xs", TEXT_SECONDARY)}>
                        <span className="truncate">{parent ? parent.name : "—"}</span>
                      </td>
                      <td className={cx("py-2 pl-3 text-left text-xs", TEXT_SECONDARY)}>
                        <span className="truncate">{n.leadName}</span>
                      </td>
                      <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatCount(n.headcount)}</td>
                      <td className="py-2 pr-3 text-right">
                        <div className="ml-auto flex w-24 items-center justify-end gap-2">
                          <span className={cx("shrink-0 text-xs font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{n.utilization}%</span>
                        </div>
                        <ProgressBar
                          value={Math.min(n.utilization, 130)}
                          max={130}
                          toneClass={status.bar}
                          className="ml-auto mt-1 w-24"
                          label={`${n.name} 가동률 ${n.utilization}%`}
                        />
                      </td>
                      <td className="py-2 pr-3 text-right">
                        <StatusBadge status={n.status} />
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>
                      선택한 상태에 해당하는 팀이 없습니다.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
