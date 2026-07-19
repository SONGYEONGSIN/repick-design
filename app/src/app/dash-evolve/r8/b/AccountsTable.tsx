"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ACCOUNTS,
  REGION_META,
  formatUsd,
  unsplashAvatar,
  type Account,
  type AccountStatus,
} from "./data";
import { BORDER, DIVIDE, FOCUS_RING, HOVER_ROW, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, TRANSITION, cx } from "./tokens";
import { Card, CardHeader, ProgressBar, SegmentedControl, SortableTh, Sparkline, StatusBadge, type SortDir } from "./ui";

type SortKey = "name" | "mrr" | "health";
export type FilterId = "all" | AccountStatus;

const FILTER_OPTIONS: { id: FilterId; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "at-risk", label: "위험" },
  { id: "growing", label: "성장" },
  { id: "stable", label: "안정" },
];

export default function AccountsTable({
  statusFilter,
  onStatusFilterChange,
  selectedId,
  onSelect,
}: {
  statusFilter: FilterId;
  onStatusFilterChange: (f: FilterId) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("mrr");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const rows = useMemo(() => {
    const filtered = statusFilter === "all" ? ACCOUNTS : ACCOUNTS.filter((a) => a.status === statusFilter);
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "mrr") cmp = a.mrr - b.mrr;
      else cmp = a.health - b.health;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [statusFilter, sortKey, sortDir]);

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
          title="계정"
          titleId="accounts-heading"
          description={`${rows.length}개 계정 · 행을 선택하면 상세와 매출 차트가 동기화됩니다`}
        />
        <SegmentedControl ariaLabel="계정 상태 필터" options={FILTER_OPTIONS} value={statusFilter} onChange={onStatusFilterChange} size="sm" />
      </div>

      <div className={cx("border-t", BORDER)}>
        <div className="overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[640px] lg:min-w-0">
            <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="accounts-heading">
              <caption className="sr-only">
                계정 목록. 계정명, MRR, 헬스 스코어 기준으로 정렬하고 상태로 필터링할 수 있습니다. 행을 선택하면 상세가 펼쳐집니다.
              </caption>
              <colgroup>
                <col style={{ width: "32%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "18%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "16%" }} />
              </colgroup>
              <thead>
                <tr className={cx("border-b", BORDER)}>
                  <SortableTh columnKey="name" activeKey={sortKey} dir={sortDir} onSort={onSort}>
                    계정
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    리전
                  </th>
                  <SortableTh columnKey="mrr" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    MRR
                  </SortableTh>
                  <SortableTh columnKey="health" activeKey={sortKey} dir={sortDir} onSort={onSort} align="right">
                    헬스
                  </SortableTh>
                  <th scope="col" className={cx("py-2 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className={cx("divide-y", DIVIDE)}>
                {rows.map((a) => (
                  <Row key={a.id} a={a} selected={a.id === selectedId} onSelect={onSelect} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}

function Row({ a, selected, onSelect }: { a: Account; selected: boolean; onSelect: (id: string | null) => void }) {
  const meta = REGION_META[a.region];
  return (
    <>
      <tr className={cx(HOVER_ROW, TRANSITION, selected && "bg-blue-50/70 dark:bg-blue-500/10")}>
        <td className="py-2 pl-3 text-left">
          <button
            type="button"
            onClick={() => onSelect(selected ? null : a.id)}
            aria-expanded={selected}
            className={cx("group flex min-w-0 max-w-full items-center gap-1.5 rounded text-left", FOCUS_RING)}
          >
            {selected ? (
              <ChevronDown size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
            ) : (
              <ChevronRight size={14} aria-hidden="true" className={cx("shrink-0", TEXT_CAPTION)} />
            )}
            <span className="min-w-0">
              <span className={cx("block truncate text-sm font-medium group-hover:underline", TEXT_PRIMARY)}>{a.name}</span>
              <span className={cx("block truncate text-[11px]", TEXT_CAPTION)}>{a.contactName}</span>
            </span>
          </button>
        </td>
        <td className="py-2 pl-3 text-left">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs">
            <span aria-hidden="true" className={cx("h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
            <span className={TEXT_SECONDARY}>{meta.label}</span>
          </span>
        </td>
        <td className={cx("py-2 pr-3 text-right text-sm font-semibold whitespace-nowrap", NUM, TEXT_PRIMARY)}>{formatUsd(a.mrr)}</td>
        <td className="py-2 pr-3 text-right">
          <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap text-sm", NUM, TEXT_SECONDARY)}>
            {a.health}
            <span className="hidden w-10 sm:inline-block">
              <ProgressBar value={a.health} tone={a.health < 50 ? "down" : a.health >= 66 ? "up" : "flat"} />
            </span>
          </span>
        </td>
        <td className="py-2 pr-3 text-left">
          <StatusBadge status={a.status} />
        </td>
      </tr>
      {selected ? (
        <tr className="bg-zinc-50 dark:bg-white/[0.03]">
          <td colSpan={5} className="px-3 pb-4 pt-1">
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-200 bg-white p-3.5 dark:border-white/10 dark:bg-zinc-900 sm:grid-cols-[auto_1fr_auto]">
              <div className="flex items-center gap-2.5">
                <Image
                  src={unsplashAvatar(a.avatarId, 64)}
                  alt={`${a.contactName} 프로필 사진`}
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className={cx("truncate text-sm font-medium", TEXT_PRIMARY)}>{a.contactName}</p>
                  <p className={cx("truncate text-[11px]", TEXT_CAPTION)}>{a.contactTitle}</p>
                </div>
              </div>
              <div className="min-w-0">
                <p className={cx("text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>최근 8주 헬스 추이</p>
                <div className="mt-1 h-10 w-full max-w-[200px]">
                  <Sparkline values={a.trend} stroke={meta.stroke} fill={meta.fill} />
                </div>
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
                <p className={cx("text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>담당 CSM · 다음 액션</p>
                <p className={cx("text-sm", TEXT_SECONDARY)}>
                  {a.csm} · {a.nextAction}
                </p>
                <p className={cx("text-[11px]", TEXT_CAPTION)}>최근 활동 {a.lastActivity}</p>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}
