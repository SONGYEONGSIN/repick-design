"use client";

import { useMemo, useState } from "react";
import { formatMs, formatPercent, formatVolume, LAYER_META, NODES, RELIABILITY_META, type ReliabilityId } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, ProgressBar, SegmentedControl, SortableTh, StatusBadge, type SortDir } from "./ui";

type SortKey = "name" | "requestVolume" | "errorRate" | "p99";
type FilterId = "all" | ReliabilityId;

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "healthy", label: "Healthy" },
  { id: "degraded", label: "Degraded" },
  { id: "critical", label: "Critical" },
];

export default function ServiceTable({ selectedId, onSelect }: { selectedId: string | null; onSelect: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("requestVolume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filter, setFilter] = useState<FilterId>("all");

  const rows = useMemo(() => {
    const filtered = filter === "all" ? NODES : NODES.filter((n) => n.reliability === filter);
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "requestVolume") cmp = a.requestVolume - b.requestVolume;
      else if (sortKey === "errorRate") cmp = a.errorRate - b.errorRate;
      else cmp = a.p99 - b.p99;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sortKey, sortDir, filter]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <Card padded={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <CardHeader
          title="서비스 디렉터리"
          titleId="service-table-heading"
          description={`그래프의 전체 노드를 표로 · ${rows.length}건 · 행을 선택하면 위 그래프와 상세 패널이 동기화됩니다`}
        />
        <SegmentedControl ariaLabel="신뢰도 상태 필터" options={FILTERS} value={filter} onChange={setFilter} size="sm" />
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[720px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="service-table-heading">
              <caption className="sr-only">
                Bramwell Commerce 서비스 디렉터리. 서비스명, 오너 팀, 요청량, 오류율, P99 지연, 상태 기준으로 정렬 및 필터할 수 있습니다.
              </caption>
              <colgroup>
                <col style={{ width: "27%" }} />
                <col style={{ width: "17%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "13%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "14%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="name" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    서비스
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    오너 팀
                  </th>
                  <SortableTh columnKey="requestVolume" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    요청량
                  </SortableTh>
                  <SortableTh columnKey="errorRate" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    오류율
                  </SortableTh>
                  <SortableTh columnKey="p99" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    P99
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.map((n) => {
                  const selected = n.id === selectedId;
                  const status = RELIABILITY_META[n.reliability];
                  const LayerIcon = LAYER_META[n.layer].Icon;
                  return (
                    <tr key={n.id} className={cx(HOVER_ROW, TRANSITION, selected && "bg-indigo-50/70 dark:bg-indigo-500/10")}>
                      <td className="py-2 pl-3 text-left">
                        <button type="button" onClick={() => onSelect(n.id)} aria-pressed={selected} className={cx("group flex min-w-0 max-w-full items-center gap-1.5 rounded text-left", FOCUS_RING)}>
                          <LayerIcon size={13} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
                          <span className={cx("truncate text-sm font-medium group-hover:underline", NUM, TEXT_PRIMARY)}>{n.name}</span>
                        </button>
                        <p className={cx("truncate pl-[19px] text-[11px]", TEXT_CAPTION)}>{LAYER_META[n.layer].label}</p>
                      </td>
                      <td className={cx("py-2 pl-3 text-left text-xs", TEXT_SECONDARY)}>
                        <span className="truncate">{n.owner}</span>
                      </td>
                      <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatVolume(n.requestVolume)}</td>
                      <td className="py-2 pr-3 text-right">
                        <span className={cx("text-xs font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatPercent(n.errorRate)}</span>
                        <ProgressBar
                          value={Math.min(n.errorRate, 5)}
                          max={5}
                          toneClass={status.bar}
                          className="ml-auto mt-1 w-16"
                          label={`${n.name} 오류율 ${formatPercent(n.errorRate)}`}
                        />
                      </td>
                      <td className={cx("py-2 pr-3 text-right text-xs font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatMs(n.p99)}</td>
                      <td className="py-2 pr-3 text-right">
                        <StatusBadge meta={status} />
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className={cx("py-8 text-center text-sm", TEXT_CAPTION)}>
                      선택한 상태에 해당하는 서비스가 없습니다.
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
