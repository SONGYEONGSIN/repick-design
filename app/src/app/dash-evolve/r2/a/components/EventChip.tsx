"use client";

import type { Post } from "../lib/data";
import { formatCompact } from "../lib/format";
import { CHANNEL_META, STATUS_META } from "./ui";

interface EventChipProps {
  post: Post;
  onSelect: (id: string) => void;
  /** 그리드 하단부 셀에서는 툴팁을 위로 띄운다(뷰포트 밖 넘침 방지). */
  tooltipAbove?: boolean;
  /** week 뷰는 시간이 행으로 이미 표현되므로 칩에는 생략. */
  showTime?: boolean;
  dense?: boolean;
}

export default function EventChip({ post, onSelect, tooltipAbove = false, showTime = true, dense = false }: EventChipProps) {
  const channel = CHANNEL_META[post.channel];
  const status = STATUS_META[post.status];
  const a11yLabel = `${post.timeLabel} ${channel.label} · ${post.title} · ${status.label}. 상세 보기`;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onSelect(post.id)}
        aria-label={a11yLabel}
        className={`flex w-full min-w-0 items-center gap-1 rounded-md border-l-2 bg-zinc-50 px-1.5 py-1 text-left transition-colors motion-reduce:transition-none hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 ${channel.accent} ${dense ? "text-[11px]" : "text-[11.5px]"}`}
      >
        <span className={`size-1.5 shrink-0 rounded-full ${channel.dot}`} aria-hidden="true" />
        {showTime && <span className="shrink-0 tabular-nums text-zinc-400">{post.timeLabel}</span>}
        <span className="min-w-0 flex-1 truncate text-zinc-700">{post.title}</span>
      </button>

      <div
        aria-hidden="true"
        className={`pointer-events-none invisible absolute z-20 w-64 rounded-lg border border-zinc-200 bg-white p-3 text-xs opacity-0 shadow-lg transition-opacity duration-150 motion-reduce:transition-none group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
          tooltipAbove ? "bottom-full left-0 mb-1.5" : "top-full left-0 mt-1.5"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${channel.chip}`}>
            <channel.Icon className="size-2.5" aria-hidden="true" />
            {channel.label}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${status.badge}`}>
            <status.Icon className="size-2.5" aria-hidden="true" />
            {status.label}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] font-medium text-zinc-900">{post.title}</p>
        <p className="mt-1 tabular-nums text-zinc-500">{post.date} · {post.timeLabel}</p>
        <p className="mt-1.5 line-clamp-2 text-zinc-500">{post.caption}</p>
        {post.reach !== null && (
          <p className="mt-1.5 font-medium tabular-nums text-zinc-700">도달 {formatCompact(post.reach)}회 · 참여율 {post.engagementRate}%</p>
        )}
      </div>
    </div>
  );
}
