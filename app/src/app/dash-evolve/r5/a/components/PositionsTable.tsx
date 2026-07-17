"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { comparePositions, instrumentById, POSITIONS, type SortKey } from "../lib/data";
import { formatPnl, formatRate, formatUsdCompact } from "../lib/format";
import { BORDER, DIVIDE, NUM, TEXT_CAPTION, TEXT_PRIMARY, cx } from "../lib/tokens";
import { Badge, Card, CardHeader, SegmentedControl, SortableTh, type SortDir } from "./ui";

type StatusFilter = "all" | "오픈" | "정산완료";

export default function PositionsTable({
  selectedInstrumentId,
  onSelectInstrument,
}: {
  selectedInstrumentId: string;
  onSelectInstrument: (id: string) => void;
}) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("pnl");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const rows = useMemo(() => {
    const filtered = filter === "all" ? POSITIONS : POSITIONS.filter((p) => p.status === filter);
    return [...filtered].sort((a, b) => comparePositions(a, b, sortKey, sortDir));
  }, [filter, sortKey, sortDir]);

  const openCount = POSITIONS.filter((p) => p.status === "오픈").length;
  const settledCount = POSITIONS.length - openCount;

  return (
    <Card padded={false} className="flex max-h-[420px] flex-col overflow-hidden">
      <div className={cx("flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-5", BORDER)}>
        <CardHeader title="전사 포지션 · 거래" description={`법인·통화쌍별 헤지 포지션 ${POSITIONS.length}건`} />
        <SegmentedControl
          ariaLabel="포지션 상태 필터"
          options={[
            { id: "all", label: `전체 ${POSITIONS.length}` },
            { id: "오픈", label: `오픈 ${openCount}` },
            { id: "정산완료", label: `정산완료 ${settledCount}` },
          ]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
        <table className="w-full min-w-[860px] border-collapse text-sm lg:min-w-0 lg:table-fixed">
          <caption className="sr-only">법인 및 통화쌍별 FX 헤지 포지션과 거래 내역, 정렬 및 상태 필터 가능</caption>
          <colgroup>
            <col className="lg:w-[13%]" />
            <col className="lg:w-[13%]" />
            <col className="lg:w-[9%]" />
            <col className="lg:w-[12%]" />
            <col className="lg:w-[11%]" />
            <col className="lg:w-[11%]" />
            <col className="lg:w-[12%]" />
            <col className="lg:w-[19%]" />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <SortableTh columnKey="instrument" activeKey={sortKey} dir={sortDir} onSort={handleSort}>
                통화쌍
              </SortableTh>
              <SortableTh columnKey="entity" activeKey={sortKey} dir={sortDir} onSort={handleSort}>
                법인
              </SortableTh>
              <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                방향
              </th>
              <SortableTh columnKey="notional" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right">
                명목금액
              </SortableTh>
              <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                평균가
              </th>
              <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                현재가
              </th>
              <SortableTh columnKey="pnl" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right">
                평가손익
              </SortableTh>
              <SortableTh columnKey="updated" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="right">
                상태 · 갱신일
              </SortableTh>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.map((p) => {
              const inst = instrumentById(p.instrumentId);
              if (!inst) return null;
              const selected = p.instrumentId === selectedInstrumentId;
              const pnlPositive = p.pnlUsd > 0;
              const pnlFlat = p.pnlUsd === 0;
              return (
                <tr
                  key={p.id}
                  className={cx(
                    "cursor-pointer transition-colors motion-reduce:transition-none",
                    selected ? "bg-blue-50 dark:bg-blue-500/10" : "hover:bg-zinc-50 dark:hover:bg-white/[0.03]",
                  )}
                  onClick={() => onSelectInstrument(p.instrumentId)}
                >
                  <th scope="row" className="px-4 py-2.5 text-left font-semibold">
                    <span className={cx("flex items-center gap-1.5 truncate", TEXT_PRIMARY)}>
                      {selected ? <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true" /> : null}
                      {inst.pair}
                    </span>
                  </th>
                  <td className={cx("truncate py-2.5 pl-3", TEXT_PRIMARY)}>{p.entity}</td>
                  <td className="py-2.5 pl-3">
                    <Badge tone={p.side === "Long" ? "positive" : "warning"}>{p.side === "Long" ? "매입" : "매도"}</Badge>
                  </td>
                  <td className={cx("py-2.5 pr-3 text-right", NUM, TEXT_PRIMARY)}>{formatUsdCompact(p.notionalUsd)}</td>
                  <td className={cx("whitespace-nowrap py-2.5 pr-3 text-right", NUM, TEXT_CAPTION)}>{formatRate(p.avgRate, inst)}</td>
                  <td className={cx("whitespace-nowrap py-2.5 pr-3 text-right", NUM, TEXT_PRIMARY)}>{formatRate(inst.last, inst)}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <span
                      className={cx(
                        "inline-flex items-center gap-1",
                        NUM,
                        pnlFlat ? TEXT_CAPTION : pnlPositive ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400",
                      )}
                    >
                      {!pnlFlat && (pnlPositive ? <TrendingUp size={12} aria-hidden="true" /> : <TrendingDown size={12} aria-hidden="true" />)}
                      {pnlFlat ? "±$0" : formatPnl(p.pnlUsd)}
                    </span>
                  </td>
                  <td className={cx("whitespace-nowrap py-2.5 pr-3 text-right", NUM, TEXT_CAPTION)}>
                    <span className="mr-1 inline-block">
                      <Badge tone={p.status === "오픈" ? "neutral" : "positive"}>{p.status}</Badge>
                    </span>
                    {p.updatedLabel}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
