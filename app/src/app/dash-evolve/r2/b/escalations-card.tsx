"use client";

import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";
import { Badge, Card, CardHeader, ChannelBadge, PriorityBadge, SortButton } from "./ui";
import { ESCALATION_TICKETS, PRIORITY_META, getAgent } from "./data";
import { formatNumber, formatWaitMinutes } from "./format";
import { useSortable } from "./use-sortable";
import type { ChannelFilter } from "./types";

const PANEL_ID = "escalations-panel";
const TITLE_ID = "escalations-title";

export function EscalationsCard({
  channel,
  expanded,
  onToggle,
}: {
  channel: ChannelFilter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const filtered = useMemo(
    () => (channel === "all" ? ESCALATION_TICKETS : ESCALATION_TICKETS.filter((t) => t.channel === channel)),
    [channel]
  );

  const { sorted, sortKey, direction, toggle } = useSortable<
    (typeof filtered)[number],
    "subject" | "age" | "priority"
  >(
    filtered,
    {
      subject: (r) => r.subject,
      age: (r) => r.ageMinutes,
      priority: (r) => PRIORITY_META[r.priority].rank,
    },
    { key: "priority", direction: "desc" }
  );

  const preview = filtered.slice(0, 3);

  return (
    <Card as="section" id="escalations-card" aria-labelledby={TITLE_ID} className="flex flex-col">
      <CardHeader
        icon={<TriangleAlert className="h-4 w-4" aria-hidden="true" />}
        title="긴급 대응 필요"
        titleId={TITLE_ID}
        badge={
          <Badge className="border-rose-400/30 bg-rose-500/10 text-rose-300">{formatNumber(filtered.length)}건</Badge>
        }
        expandable
        expanded={expanded}
        onToggle={onToggle}
        panelId={PANEL_ID}
      />

      <div className="space-y-3 px-4 py-4 sm:px-5">
        {preview.map((t) => (
          <div key={t.id} className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-2.5">
            <span className="mt-0.5 shrink-0">
              <PriorityBadge priority={t.priority} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-zinc-100">{t.subject}</p>
              <p className="truncate text-[11px] text-zinc-500">{t.reason}</p>
            </div>
            <span className="shrink-0 text-[11px] whitespace-nowrap text-zinc-500 tabular-nums">
              {formatWaitMinutes(t.ageMinutes)}
            </span>
          </div>
        ))}
        {filtered.length === 0 && <p className="text-[13px] text-zinc-500">선택한 채널에 에스컬레이션이 없습니다.</p>}
      </div>

      {expanded && (
        <div id={PANEL_ID} className="border-t border-white/10 px-4 pb-4 sm:px-5">
          <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-white/10 lg:max-h-none lg:overflow-visible">
            <div className="min-w-[560px] overflow-x-auto lg:min-w-0 lg:overflow-visible">
              <table className="w-full table-fixed border-collapse text-left text-[13px]">
                <caption className="sr-only">에스컬레이션 전체 목록, 정렬 가능한 열: 제목, 경과, 우선순위</caption>
                <colgroup>
                  <col className="w-[40%]" />
                  <col className="w-[16%]" />
                  <col className="w-[22%]" />
                  <col className="w-[22%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="px-3 py-2" aria-sort={sortKey === "subject" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton active={sortKey === "subject"} direction={direction} onClick={() => toggle("subject")}>
                        제목 · 사유
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2">
                      담당
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" aria-sort={sortKey === "age" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton align="right" active={sortKey === "age"} direction={direction} onClick={() => toggle("age")}>
                        경과
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" aria-sort={sortKey === "priority" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton align="right" active={sortKey === "priority"} direction={direction} onClick={() => toggle("priority")}>
                        우선순위
                      </SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((t) => (
                    <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                      <td className="px-3 py-2.5">
                        <span className="block truncate font-medium text-zinc-100">{t.subject}</span>
                        <span className="block truncate text-[11px] text-zinc-500">{t.reason}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <ChannelBadge channel={t.channel} compact />
                          <span className="truncate text-zinc-400">{getAgent(t.assigneeId).name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap text-zinc-300 tabular-nums">
                        {formatWaitMinutes(t.ageMinutes)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <PriorityBadge priority={t.priority} />
                      </td>
                    </tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-zinc-500">
                        선택한 채널에 에스컬레이션이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
