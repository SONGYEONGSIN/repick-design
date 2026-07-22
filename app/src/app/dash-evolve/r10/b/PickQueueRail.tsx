"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  formatSla,
  formatUnits,
  PICKER_MAP,
  STATUS_META,
  TASK_ZONE_MAP,
  unsplashAvatar,
  ZONE_MAP,
  type TaskStatus,
} from "./data";
import { BORDER, DIVIDE, NUM, TEXT_CAPTION, TEXT_PRIMARY, TEXT_SECONDARY, cx } from "./tokens";
import { Card, CardHeader, Listbox, SortTrigger, StatusBadge } from "./ui";

type SortKey = "sla" | "picker" | "status";
type StatusFilter = "all" | TaskStatus;

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: "sla", label: "SLA" },
  { id: "picker", label: "피커" },
  { id: "status", label: "상태" },
];

const FILTER_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "late", label: "지연" },
  { id: "at_risk", label: "임박" },
  { id: "picking", label: "피킹중" },
  { id: "queued", label: "대기" },
];

export default function PickQueueRail({ selectedZoneId }: { selectedZoneId: string }) {
  const [sortKey, setSortKey] = useState<SortKey>("sla");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const zone = ZONE_MAP[selectedZoneId];
  const zoneTasks = TASK_ZONE_MAP[selectedZoneId] ?? [];

  const rows = useMemo(() => {
    const tasks = TASK_ZONE_MAP[selectedZoneId] ?? [];
    const filtered = statusFilter === "all" ? tasks : tasks.filter((t) => t.status === statusFilter);
    const list = [...filtered];
    list.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "sla") cmp = a.slaMinutes - b.slaMinutes;
      else if (sortKey === "picker") cmp = PICKER_MAP[a.pickerId].name.localeCompare(PICKER_MAP[b.pickerId].name);
      else cmp = STATUS_META[a.status].severity - STATUS_META[b.status].severity;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [selectedZoneId, statusFilter, sortKey, sortDir]);

  return (
    <Card padded={false} className="flex h-full min-h-0 flex-col">
      <div className={cx("border-b p-3.5 sm:p-4", BORDER)}>
        <CardHeader
          title="피킹 큐"
          titleId="pick-queue-heading"
          description={`${zone.name} · 활성 작업 ${zoneTasks.length}건`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SortTrigger ariaLabel="피킹 큐 정렬 기준" options={SORT_OPTIONS} value={sortKey} dir={sortDir} onChange={setSortKey} onToggleDir={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} />
          <Listbox ariaLabel="상태 필터" triggerLabel="상태" options={FILTER_OPTIONS} value={statusFilter} onChange={setStatusFilter} />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
        <table className="w-full table-fixed border-collapse text-sm" aria-labelledby="pick-queue-heading">
          <caption className="sr-only">
            {zone.name} 피킹 큐. 품목, SKU, 수량, 담당 피커, SLA 남은 시간, 상태를 정렬 및 필터할 수 있습니다.
          </caption>
          <colgroup>
            <col style={{ width: "52%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "24%" }} />
          </colgroup>
          <thead>
            <tr className={cx("border-b", BORDER)}>
              <th scope="col" className={cx("py-2 pl-3 text-left text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                작업
              </th>
              <th scope="col" className={cx("py-2 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                SLA
              </th>
              <th scope="col" className={cx("py-2 pr-3 text-right text-[11px] font-semibold uppercase tracking-wide", TEXT_CAPTION)}>
                상태
              </th>
            </tr>
          </thead>
          <tbody className={cx("divide-y", DIVIDE)}>
            {rows.map((t) => {
              const picker = PICKER_MAP[t.pickerId];
              const status = STATUS_META[t.status];
              return (
                <tr key={t.id}>
                  <td className="py-2.5 pl-3 text-left align-top">
                    <p className={cx("line-clamp-2 text-sm font-medium leading-snug", TEXT_PRIMARY)}>{t.itemName}</p>
                    <p className={cx("mt-0.5 whitespace-nowrap text-[11px]", NUM, TEXT_CAPTION)}>
                      {t.sku} · {formatUnits(t.qty)}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Image
                        src={unsplashAvatar(picker.avatarId, 40)}
                        alt={`${picker.name} 프로필 사진`}
                        width={16}
                        height={16}
                        className="h-4 w-4 shrink-0 rounded-full object-cover"
                      />
                      <span className={cx("truncate text-[11px]", TEXT_SECONDARY)}>{picker.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right align-top">
                    <span className={cx("whitespace-nowrap text-xs font-semibold", NUM, t.slaMinutes < 0 ? "text-rose-700 dark:text-rose-300" : t.slaMinutes <= 15 ? "text-amber-700 dark:text-amber-300" : TEXT_PRIMARY)}>
                      {formatSla(t.slaMinutes)}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right align-top">
                    <StatusBadge meta={status} />
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className={cx("px-3 py-8 text-center text-sm", TEXT_CAPTION)}>
                  조건에 맞는 피킹 작업이 없습니다.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
