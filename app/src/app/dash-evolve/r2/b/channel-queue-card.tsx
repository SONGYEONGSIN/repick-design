"use client";

import { useMemo } from "react";
import { Inbox } from "lucide-react";
import { Badge, Card, CardHeader, ChannelBadge, PriorityBadge, SortButton } from "./ui";
import { CHANNELS, CHANNEL_META, PRIORITY_META, QUEUE_TICKETS } from "./data";
import { formatNumber, formatWaitMinutes } from "./format";
import { useSortable } from "./use-sortable";
import type { Channel, ChannelFilter } from "./types";

const PANEL_ID = "channel-queue-panel";
const TITLE_ID = "channel-queue-title";

export function ChannelQueueCard({
  channel,
  expanded,
  onToggle,
}: {
  channel: ChannelFilter;
  expanded: boolean;
  onToggle: () => void;
}) {
  const byChannel = useMemo(() => {
    const counts: Record<Channel, number> = { email: 0, chat: 0, phone: 0, social: 0 };
    for (const t of QUEUE_TICKETS) counts[t.channel] += 1;
    return counts;
  }, []);
  const total = QUEUE_TICKETS.length;

  const filteredRows = useMemo(
    () => (channel === "all" ? QUEUE_TICKETS : QUEUE_TICKETS.filter((t) => t.channel === channel)),
    [channel]
  );

  const { sorted, sortKey, direction, toggle } = useSortable<
    (typeof filteredRows)[number],
    "subject" | "channel" | "wait" | "priority"
  >(
    filteredRows,
    {
      subject: (r) => r.subject,
      channel: (r) => CHANNEL_META[r.channel].label,
      wait: (r) => r.waitMinutes,
      priority: (r) => PRIORITY_META[r.priority].rank,
    },
    { key: "wait", direction: "desc" }
  );

  return (
    <Card as="section" id="channel-queue-card" aria-labelledby={TITLE_ID} className="flex flex-col">
      <CardHeader
        icon={<Inbox className="h-4 w-4" aria-hidden="true" />}
        title="채널별 대기열"
        titleId={TITLE_ID}
        badge={
          <Badge className="border-white/10 bg-white/5 text-zinc-300">
            {formatNumber(filteredRows.length)}건 대기
          </Badge>
        }
        expandable
        expanded={expanded}
        onToggle={onToggle}
        panelId={PANEL_ID}
      />

      <div className="space-y-3 px-4 py-4 sm:px-5">
        {CHANNELS.map((c) => {
          const meta = CHANNEL_META[c];
          const count = byChannel[c];
          const pct = total === 0 ? 0 : Math.round((count / total) * 100);
          const dimmed = channel !== "all" && channel !== c;
          return (
            <div key={c} className={dimmed ? "opacity-40" : ""}>
              <div className="mb-1 flex items-center justify-between text-[13px]">
                <ChannelBadge channel={c} />
                <span className="tabular-nums text-zinc-400">
                  <span className="font-semibold text-zinc-100">{formatNumber(count)}</span>건 · {pct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full ${meta.dotClass}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {expanded && (
        <div id={PANEL_ID} className="border-t border-white/10 px-4 pb-4 sm:px-5">
          <div className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-white/10 lg:max-h-none lg:overflow-visible">
            <div className="min-w-[560px] overflow-x-auto lg:min-w-0 lg:overflow-visible">
              <table className="w-full table-fixed border-collapse text-left text-[13px]">
                <caption className="sr-only">
                  현재 대기 중인 티켓 목록, 정렬 가능한 열: 제목, 채널, 대기 시간, 우선순위
                </caption>
                <colgroup>
                  <col className="w-[38%]" />
                  <col className="w-[16%]" />
                  <col className="w-[22%]" />
                  <col className="w-[24%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-white/10">
                    <th scope="col" className="px-3 py-2" aria-sort={sortKey === "subject" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton active={sortKey === "subject"} direction={direction} onClick={() => toggle("subject")}>
                        제목
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2" aria-sort={sortKey === "channel" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton active={sortKey === "channel"} direction={direction} onClick={() => toggle("channel")}>
                        채널
                      </SortButton>
                    </th>
                    <th scope="col" className="px-3 py-2 text-right" aria-sort={sortKey === "wait" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                      <SortButton align="right" active={sortKey === "wait"} direction={direction} onClick={() => toggle("wait")}>
                        대기
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
                        <span className="block truncate text-[11px] text-zinc-500">
                          {t.id} · {t.requester}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <ChannelBadge channel={t.channel} />
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap text-zinc-300 tabular-nums">
                        {formatWaitMinutes(t.waitMinutes)}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <PriorityBadge priority={t.priority} />
                      </td>
                    </tr>
                  ))}
                  {sorted.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-zinc-500">
                        선택한 채널에 대기 중인 티켓이 없습니다.
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
