"use client";

import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { TRANSITIONS, customerById, type Transition } from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, SortableTh, StageTag, type SortDir } from "./ui";

type SortKey = "customer" | "delta" | "when";

export default function TransitionTable({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  const [sortKey, setSortKey] = useState<SortKey>("when");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const rows = useMemo(() => {
    const list = [...TRANSITIONS];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "when") cmp = a.daysAgo - b.daysAgo;
      else if (sortKey === "delta") cmp = a.healthDelta - b.healthDelta;
      else cmp = (customerById(a.customerId)?.name ?? "").localeCompare(customerById(b.customerId)?.name ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [sortKey, sortDir]);

  function onSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "when" || key === "customer" ? "asc" : "desc");
    }
  }

  return (
    <Card padded={false}>
      <div className="p-4 sm:p-5">
        <CardHeader
          title="라이프사이클 단계 전환"
          titleId="transition-heading"
          description={`최근 궤도 이동 · ${rows.length}건 · 행을 선택하면 위 궤도와 상세 패널이 동기화됩니다`}
        />
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[680px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="transition-heading">
              <caption className="sr-only">고객 라이프사이클 단계 전환 로그. 고객명, 헬스 변화, 시점 기준으로 정렬할 수 있습니다.</caption>
              <colgroup>
                <col style={{ width: "28%" }} />
                <col style={{ width: "26%" }} />
                <col style={{ width: "15%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "13%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="customer" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    고객
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    이동
                  </th>
                  <SortableTh columnKey="delta" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    헬스 변화
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    담당 CSM
                  </th>
                  <SortableTh columnKey="when" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    시점
                  </SortableTh>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.map((t) => (
                  <Row key={t.id} t={t} selected={t.customerId === selectedId} onSelect={onSelect} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Row({ t, selected, onSelect }: { t: Transition; selected: boolean; onSelect: (id: string) => void }) {
  const c = customerById(t.customerId);
  if (!c) return null;
  const DeltaIcon = t.positive ? TrendingUp : TrendingDown;
  return (
    <tr className={cx(HOVER_ROW, TRANSITION, selected && "bg-indigo-50/70 dark:bg-indigo-500/10")}>
      <td className="py-2 pl-3 text-left">
        <button
          type="button"
          onClick={() => onSelect(t.customerId)}
          aria-pressed={selected}
          className={cx("group flex min-w-0 max-w-full items-center gap-1 rounded text-left", FOCUS_RING)}
        >
          <span className={cx("truncate text-sm font-medium group-hover:underline", TEXT_PRIMARY)}>{c.name}</span>
        </button>
        <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{c.contactName}</p>
      </td>
      <td className="py-2 pl-3 text-left">
        <span className="flex items-center gap-1.5">
          <StageTag stage={t.from} />
          <ArrowRight size={13} aria-hidden="true" className={TEXT_CAPTION} />
          <StageTag stage={t.to} />
        </span>
      </td>
      <td className="py-2 pr-3 text-right">
        <span
          className={cx(
            "inline-flex items-center justify-end gap-1 whitespace-nowrap text-sm font-semibold tabular-nums",
            t.positive ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300",
          )}
        >
          <DeltaIcon size={13} aria-hidden="true" />
          {t.healthDelta > 0 ? "+" : ""}
          {t.healthDelta}
        </span>
      </td>
      <td className={cx("py-2 pl-3 text-left text-xs", TEXT_SECONDARY)}>
        <span className="truncate">{c.csm}</span>
      </td>
      <td className={cx("py-2 pr-3 text-right text-xs whitespace-nowrap", NUM, TEXT_CAPTION)}>{t.when}</td>
    </tr>
  );
}
