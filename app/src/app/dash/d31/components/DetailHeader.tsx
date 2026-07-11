import { List, Play } from "lucide-react";
import type { Period, Workflow } from "../lib/data";
import PeriodToggle from "./PeriodToggle";
import StatusBadge from "./StatusBadge";

interface DetailHeaderProps {
  workflow: Workflow;
  period: Period;
  onPeriodChange: (period: Period) => void;
  onOpenList: () => void;
  listCount: number;
}

/** 디테일 뷰 헤더 — 선택된 워크플로 신원 + 기간 토글 + 주요 액션. 모바일에서는 목록 열기 버튼 포함. */
export default function DetailHeader({ workflow, period, onPeriodChange, onOpenList, listCount }: DetailHeaderProps) {
  return (
    <div className="border-b border-white/10 bg-zinc-950/60 px-4 py-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenList}
        className="mb-3 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 text-xs font-medium text-zinc-400 hover:border-white/20 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 lg:hidden"
      >
        <List className="size-3.5" aria-hidden="true" />
        워크플로 목록 ({listCount})
      </button>

      {/*
        정보 블록 → 컨트롤 블록 세로 스택이 기본값이다. lg(1024px)에서는 사이드바+목록 레일이 함께 보여
        디테일 폭이 가장 좁아지므로, 좌우 배치는 그 폭 압박이 끝나는 xl(1280px)부터만 적용한다
        (sm에서 조기 전환하면 lg 구간에서 제목이 다시 잘림 — 화면 스크린샷 검수에서 확인된 실결함).
      */}
      <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-start xl:justify-between xl:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={workflow.lastStatus} />
            <span className="text-xs text-zinc-500">{workflow.category}</span>
            <span aria-hidden="true" className="text-zinc-700">
              ·
            </span>
            <span className="font-mono text-xs tabular-nums text-zinc-500">{workflow.id}</span>
          </div>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-balance text-zinc-50 sm:text-2xl xl:truncate">
            {workflow.name}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <PeriodToggle value={period} onChange={onPeriodChange} />
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-indigo-500 px-3.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
          >
            <Play className="size-3.5" aria-hidden="true" />
            지금 실행
          </button>
        </div>
      </div>
    </div>
  );
}
