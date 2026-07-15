"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { Avatar, Badge, Card, CardHeader, ChannelBadge, ProgressBar, SortButton, StatusBadge } from "./ui";
import { AGENTS } from "./data";
import { formatNumber } from "./format";
import { useSortable } from "./use-sortable";
import type { ChannelFilter } from "./types";

const PANEL_ID = "agent-workload-panel";
const TITLE_ID = "agent-workload-title";

export function AgentWorkloadCard({
  channel,
  expanded,
  onToggle,
}: {
  channel: ChannelFilter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const filteredAgents = useMemo(
    () => (channel === "all" ? AGENTS : AGENTS.filter((a) => a.primaryChannel === channel)),
    [channel]
  );
  const activeCount = filteredAgents.filter((a) => a.status !== "offline").length;

  const { sorted, sortKey, direction, toggle } = useSortable<
    (typeof filteredAgents)[number],
    "name" | "team" | "load" | "csat"
  >(
    filteredAgents,
    {
      name: (a) => a.name,
      team: (a) => a.team,
      load: (a) => a.activeTickets / a.capacity,
      csat: (a) => a.csat,
    },
    { key: "load", direction: "desc" }
  );

  const preview = sorted.slice(0, 4);

  return (
    <Card as="section" id="agent-workload-card" aria-labelledby={TITLE_ID} className="flex flex-col">
      <CardHeader
        icon={<Users className="h-4 w-4" aria-hidden="true" />}
        title="에이전트 워크로드"
        titleId={TITLE_ID}
        badge={<Badge className="border-white/10 bg-white/5 text-zinc-300">{formatNumber(activeCount)}명 근무중</Badge>}
        expandable
        expanded={expanded}
        onToggle={onToggle}
        panelId={PANEL_ID}
      />

      <div className="space-y-3.5 px-4 py-4 sm:px-5">
        {preview.map((a) => {
          const loadPct = Math.round((a.activeTickets / a.capacity) * 100);
          return (
            <div key={a.id} className="flex items-center gap-3">
              <Avatar name={a.name} size={28} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium text-zinc-100">{a.name}</span>
                  <span className="shrink-0 text-[12px] whitespace-nowrap text-zinc-400 tabular-nums">
                    {a.activeTickets}/{a.capacity}
                  </span>
                </div>
                <ProgressBar
                  className="mt-1.5"
                  value={loadPct}
                  label={`${a.name} 업무 부하 ${loadPct}%`}
                  barClassName={loadPct >= 90 ? "bg-rose-400" : loadPct >= 70 ? "bg-amber-400" : "bg-emerald-400"}
                />
              </div>
              <StatusBadge status={a.status} />
            </div>
          );
        })}
        {filteredAgents.length === 0 && <p className="text-[13px] text-zinc-500">해당 채널 전담 에이전트가 없습니다.</p>}
      </div>

      {expanded && (
        <div id={PANEL_ID} className="border-t border-white/10 px-4 pb-4 sm:px-5">
          <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-white/10 lg:max-h-none lg:overflow-visible">
            <div className="min-w-[560px] overflow-x-auto lg:min-w-0 lg:overflow-visible">
              <table className="w-full table-fixed border-collapse text-left text-[13px]">
                <caption className="sr-only">전체 에이전트 로스터, 정렬 가능한 열: 담당자, 팀, 업무 부하, CSAT</caption>
                <colgroup>
                  <col className="w-[26%]" />
                  <col className="w-[16%]" />
                  <col className="w-[13%]" />
                  <col className="w-[15%]" />
                  <col className="w-[13%]" />
                  <col className="w-[17%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="px-3 py-2" aria-sort={sortKey === "name" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton active={sortKey === "name"} direction={direction} onClick={() => toggle("name")}>
                        담당자
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2" aria-sort={sortKey === "team" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton active={sortKey === "team"} direction={direction} onClick={() => toggle("team")}>
                        팀
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2">
                      채널
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" aria-sort={sortKey === "load" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton align="right" active={sortKey === "load"} direction={direction} onClick={() => toggle("load")}>
                        부하
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" aria-sort={sortKey === "csat" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton align="right" active={sortKey === "csat"} direction={direction} onClick={() => toggle("csat")}>
                        CSAT
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2">
                      상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((a) => (
                    <tr key={a.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <Avatar name={a.name} size={22} />
                          <span className="truncate font-medium text-zinc-100">{a.name}</span>
                        </div>
                      </td>
                      <td className="truncate px-3 py-2.5 text-zinc-300">{a.team}</td>
                      <td className="px-3 py-2.5">
                        <ChannelBadge channel={a.primaryChannel} compact />
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap text-zinc-300 tabular-nums">
                        {a.activeTickets}/{a.capacity}
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap text-zinc-300 tabular-nums">{a.csat.toFixed(1)}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-zinc-500">
                        해당 채널 전담 에이전트가 없습니다.
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
