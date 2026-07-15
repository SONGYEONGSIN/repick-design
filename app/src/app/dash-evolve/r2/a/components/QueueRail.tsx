"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { CHANNELS, TODAY_ISO, WEEKLY_REACH_LABELS, type ChannelId, type Post } from "../lib/data";
import { formatCompact, formatDateShort, formatNumber } from "../lib/format";
import PerformanceChart from "./PerformanceChart";
import { Avatar, Card, CHANNEL_META, DeltaChip, ProgressBar, Sparkline, StatusBadge } from "./ui";

type SortDir = "asc" | "desc";

interface QueueRailProps {
  activeChannels: ChannelId[];
  posts: Post[];
  onSelectEvent: (id: string) => void;
}

export default function QueueRail({ activeChannels, posts, onSelectEvent }: QueueRailProps) {
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const activeChannelInfos = useMemo(() => CHANNELS.filter((c) => activeChannels.includes(c.id)), [activeChannels]);

  const aggregateSeries = useMemo(() => {
    if (activeChannelInfos.length === 0) return WEEKLY_REACH_LABELS.map(() => 0);
    return WEEKLY_REACH_LABELS.map((_, i) => activeChannelInfos.reduce((sum, c) => sum + c.weeklyReach[i], 0));
  }, [activeChannelInfos]);

  const totalReach = aggregateSeries.reduce((a, b) => a + b, 0);
  const avgDelta =
    activeChannelInfos.length === 0 ? 0 : activeChannelInfos.reduce((sum, c) => sum + c.deltaPct, 0) / activeChannelInfos.length;

  const queueItems = useMemo(() => {
    const dir = sortDir === "asc" ? 1 : -1;
    return posts
      .filter((p) => (p.status === "scheduled" || p.status === "needs_review") && p.date >= TODAY_ISO)
      .sort((a, b) => {
        const av = `${a.date}T${String(a.hour).padStart(2, "0")}${String(a.minute).padStart(2, "0")}`;
        const bv = `${b.date}T${String(b.hour).padStart(2, "0")}${String(b.minute).padStart(2, "0")}`;
        return av < bv ? -1 * dir : av > bv ? 1 * dir : 0;
      });
  }, [posts, sortDir]);

  const monthlyGoal = 60;
  const monthlyPublished = posts.filter((p) => p.date.startsWith("2026-07") && p.status !== "draft").length;
  const goalPct = Math.min(100, (monthlyPublished / monthlyGoal) * 100);

  return (
    <div className="flex w-full flex-col gap-4 lg:h-full lg:w-[300px] lg:shrink-0 lg:overflow-y-auto">
      <Card className="shrink-0 p-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-zinc-900">채널 성과</h2>
          <span className="text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">최근 7일</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-semibold tabular-nums text-zinc-900">{formatCompact(totalReach)}</p>
          <span className="text-xs text-zinc-500">회 도달</span>
          <span className="ml-auto">
            <DeltaChip value={avgDelta} />
          </span>
        </div>

        <div className="mt-3">
          <PerformanceChart series={aggregateSeries} labels={WEEKLY_REACH_LABELS} seriesLabel="선택된 채널 합산 도달" />
        </div>

        {activeChannelInfos.length === 0 ? (
          <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-4 text-center text-xs text-zinc-500">
            선택된 채널이 없습니다. 상단 채널 필터에서 하나 이상 선택하세요.
          </p>
        ) : (
          <ul className="mt-3 space-y-2.5 border-t border-zinc-100 pt-3">
            {activeChannelInfos.map((c) => {
              const meta = CHANNEL_META[c.id];
              return (
                <li key={c.id} className="flex items-center gap-2.5">
                  <span className={`flex size-6 shrink-0 items-center justify-center rounded-md ${meta.chip}`} aria-hidden="true">
                    <meta.Icon className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-800">{meta.label}</p>
                    <p className="truncate text-[11px] tabular-nums text-zinc-500">팔로워 {formatNumber(c.followers)}</p>
                  </div>
                  <Sparkline values={c.weeklyReach} label={`${meta.label} 도달 추이`} width={56} height={20} className={`${meta.text} shrink-0`} />
                  <DeltaChip value={c.deltaPct} />
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card className="shrink-0 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold text-zinc-700">7월 발행 목표</h3>
          <span className="text-xs font-medium tabular-nums text-zinc-600">
            {monthlyPublished} / {monthlyGoal}건
          </span>
        </div>
        <div className="mt-2">
          <ProgressBar value={goalPct} label="7월 발행 목표 진행률" />
        </div>
      </Card>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between gap-2 border-b border-zinc-100 px-4 py-3.5">
          <div className="flex items-center gap-1.5">
            <Inbox className="size-3.5 text-zinc-400" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-zinc-900">발행 대기 큐</h2>
          </div>
          <span className="text-xs tabular-nums text-zinc-500">{formatNumber(queueItems.length)}건</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] table-fixed border-collapse text-sm lg:min-w-0">
            <caption className="sr-only">
              발행 대기 큐 — 예약됨·검토 대기 게시물, 예정일시 기준 정렬 가능, 채널 필터가 적용된 목록입니다.
            </caption>
            <colgroup>
              <col className="w-[62%]" />
              <col className="w-[12%]" />
              <col className="w-[26%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-zinc-200 text-left">
                <th scope="col" className="px-3 py-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  콘텐츠
                </th>
                <th scope="col" className="px-1 py-2 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
                  담당
                </th>
                <th scope="col" aria-sort={sortDir === "asc" ? "ascending" : "descending"} className="px-2 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                    className="inline-flex min-h-[28px] items-center gap-1 rounded-md px-1 text-[11px] font-semibold tracking-wider text-zinc-400 uppercase transition-colors motion-reduce:transition-none hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    예정
                    {sortDir === "asc" ? <ArrowUp className="size-3" aria-hidden="true" /> : <ArrowDown className="size-3" aria-hidden="true" />}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {queueItems.map((post) => {
                const meta = CHANNEL_META[post.channel];
                return (
                  <tr key={post.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-3 py-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectEvent(post.id)}
                        className="block w-full min-w-0 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        <span className="block truncate text-[13px] font-medium text-zinc-800">{post.title}</span>
                        <span className="mt-1 flex items-center gap-1.5">
                          <meta.Icon className={`size-3 shrink-0 ${meta.text}`} aria-hidden="true" />
                          <span className="truncate text-[11px] text-zinc-500">{meta.label}</span>
                          <StatusBadge status={post.status} />
                        </span>
                      </button>
                    </td>
                    <td className="px-1 py-2.5">
                      <Avatar name={post.author} className="size-6" />
                    </td>
                    <td className="px-2 py-2.5 text-right">
                      <span className="block text-xs font-medium tabular-nums whitespace-nowrap text-zinc-700">
                        {formatDateShort(post.date)}
                      </span>
                      <span className="block text-[11px] tabular-nums whitespace-nowrap text-zinc-400">{post.timeLabel}</span>
                    </td>
                  </tr>
                );
              })}
              {queueItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-zinc-500">
                    조건에 맞는 대기 중인 게시물이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
