"use client";

/**
 * ⌘K palette. It is a *control surface*, not a fourth widget: every entry writes one of the four
 * console states (metric, segment, row order, baseline) and then gets out of the way.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Command, CornerDownRight, Search, X } from "lucide-react";
import { METRICS, SEGMENTS, type MatrixRow, type MetricId, type SegmentFilter } from "./cohort-data";
import { FOCUS_RING, LABEL } from "./ui";

type Action = {
  id: string;
  group: string;
  label: string;
  hint: string;
  active: boolean;
  run: () => void;
};

export default function CommandPalette({
  open,
  onClose,
  rows,
  metric,
  onMetric,
  segment,
  onSegment,
  order,
  onOrder,
  baselineId,
  onPin,
}: {
  open: boolean;
  onClose: () => void;
  rows: MatrixRow[];
  metric: MetricId;
  onMetric: (next: MetricId) => void;
  segment: SegmentFilter;
  onSegment: (next: SegmentFilter) => void;
  order: "oldest" | "newest";
  onOrder: (next: "oldest" | "newest") => void;
  baselineId: string | null;
  onPin: (id: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  const [trackedQuery, setTrackedQuery] = useState(query);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const actions = useMemo<Action[]>(() => {
    const list: Action[] = [];

    METRICS.forEach((item) => {
      list.push({
        id: `metric-${item.id}`,
        group: "지표",
        label: `${item.label}로 전환`,
        hint: item.question,
        active: metric === item.id,
        run: () => onMetric(item.id),
      });
    });

    list.push({
      id: "segment-all",
      group: "세그먼트",
      label: "전체 세그먼트",
      hint: "네 요금제를 합산해서 본다",
      active: segment === "all",
      run: () => onSegment("all"),
    });
    SEGMENTS.forEach((item) => {
      list.push({
        id: `segment-${item.id}`,
        group: "세그먼트",
        label: `${item.label}만 보기`,
        hint: item.blurb,
        active: segment === item.id,
        run: () => onSegment(item.id),
      });
    });

    list.push({
      id: "baseline-clear",
      group: "기준 코호트",
      label: "기준 해제 — 절대 잔존율로 복귀",
      hint: "격자를 순차 램프로 되돌린다",
      active: baselineId === null,
      run: () => onPin(null),
    });
    rows.forEach((row) => {
      list.push({
        id: `baseline-${row.id}`,
        group: "기준 코호트",
        label: `${row.short} 코호트를 기준으로 고정`,
        hint: `${row.long} · 관측 ${row.observed}개월`,
        active: baselineId === row.id,
        run: () => onPin(row.id),
      });
    });

    list.push({
      id: "order-oldest",
      group: "정렬",
      label: "오래된 코호트를 위로",
      hint: "삼각형이 왼쪽 위로 열린다",
      active: order === "oldest",
      run: () => onOrder("oldest"),
    });
    list.push({
      id: "order-newest",
      group: "정렬",
      label: "최신 코호트를 위로",
      hint: "삼각형이 왼쪽 아래로 열린다",
      active: order === "newest",
      run: () => onOrder("newest"),
    });

    return list;
  }, [rows, metric, onMetric, segment, onSegment, order, onOrder, baselineId, onPin]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return actions;
    return actions.filter(
      (action) =>
        action.label.toLowerCase().includes(needle) ||
        action.hint.toLowerCase().includes(needle) ||
        action.group.toLowerCase().includes(needle),
    );
  }, [actions, query]);

  // Adjust state during render (not inside an effect) when `open` or `query` change — resetting
  // the active index this way avoids the setState-in-effect cascade. Resetting `query` itself on
  // open is folded in here too; it converges within an extra render pass since `setQuery` doesn't
  // change the `query` binding already captured by this render.
  {
    const openChanged = open !== wasOpen;
    const queryChanged = query !== trackedQuery;
    if (openChanged || queryChanged) {
      if (openChanged) setWasOpen(open);
      if (queryChanged) setTrackedQuery(query);
      setActiveIndex(0);
      if (openChanged && open) setQuery("");
    }
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const safeIndex = results.length === 0 ? -1 : Math.min(activeIndex, results.length - 1);
  const activeAction = safeIndex >= 0 ? results[safeIndex] : null;

  const groups: { name: string; items: { action: Action; index: number }[] }[] = [];
  results.forEach((action, index) => {
    const bucket = groups.find((group) => group.name === action.group);
    if (bucket) bucket.items.push({ action, index });
    else groups.push({ name: action.group, items: [{ action, index }] });
  });

  const commit = (action: Action) => {
    action.run();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pb-6 pt-[10vh]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/35"
        tabIndex={-1}
      >
        <span className="sr-only">명령 팔레트 닫기</span>
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cmdk-title"
        className="relative flex max-h-[76vh] w-full max-w-xl flex-col overflow-hidden rounded-[12px] border border-zinc-200 bg-white shadow-[0_24px_64px_-24px_rgba(24,24,27,0.45)] animate-[rise_.16s_ease-out] motion-reduce:animate-none"
      >
        <p id="cmdk-title" className="sr-only">
          명령 팔레트 — 지표, 세그먼트, 기준 코호트, 정렬을 바꿉니다
        </p>

        <div className="flex items-center gap-2 border-b border-zinc-200 px-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-zinc-600" />
          <label htmlFor="cmdk-input" className="sr-only">
            명령 검색
          </label>
          <input
            ref={inputRef}
            id="cmdk-input"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-autocomplete="list"
            aria-activedescendant={activeAction ? `cmdk-opt-${activeAction.id}` : undefined}
            autoComplete="off"
            value={query}
            placeholder="코호트, 세그먼트, 지표 검색"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((prev) => (results.length === 0 ? 0 : (prev + 1) % results.length));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((prev) =>
                  results.length === 0 ? 0 : (prev - 1 + results.length) % results.length,
                );
              }
              if (event.key === "Enter" && activeAction) {
                event.preventDefault();
                commit(activeAction);
              }
            }}
            className={`h-12 min-w-0 flex-1 bg-transparent text-[14px] text-zinc-900 placeholder:text-zinc-500 ${FOCUS_RING}`}
          />
          <button
            type="button"
            onClick={onClose}
            className={`relative flex size-8 items-center justify-center rounded-[6px] text-zinc-600 hover:bg-zinc-100 ${FOCUS_RING}`}
          >
            <X aria-hidden="true" className="size-4" />
            <span className="sr-only">닫기</span>
          </button>
        </div>

        {groups.length === 0 ? (
          <p className="px-3 py-6 text-center text-[13px] text-zinc-600">
            검색어에 해당하는 명령이 없습니다.
          </p>
        ) : null}

        <div id="cmdk-list" role="listbox" aria-label="명령 결과" className="min-h-0 flex-1 overflow-y-auto p-1.5">
          {groups.map((group) => (
              <div key={group.name} role="group" aria-label={group.name} className="pb-1">
                <p aria-hidden="true" className={`${LABEL} px-2.5 pb-1 pt-2`}>
                  {group.name}
                </p>
                {group.items.map(({ action, index }) => {
                  const highlighted = index === safeIndex;
                  return (
                    <div
                      key={action.id}
                      id={`cmdk-opt-${action.id}`}
                      role="option"
                      aria-selected={highlighted}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => commit(action)}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2 ${
                        highlighted ? "bg-orange-50" : ""
                      }`}
                    >
                      <CornerDownRight
                        aria-hidden="true"
                        className={`size-4 shrink-0 ${highlighted ? "text-orange-700" : "text-zinc-500"}`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-zinc-900">
                          {action.label}
                        </span>
                        <span className="block truncate text-[12px] text-zinc-600">{action.hint}</span>
                      </span>
                      {action.active ? (
                        <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-orange-800">
                          <Check aria-hidden="true" className="size-3.5" />
                          적용됨
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
          ))}
        </div>

        <p className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-600">
          <Command aria-hidden="true" className="size-3" />
          <span>위아래 방향키로 이동 · Enter 실행 · Esc 닫기</span>
          <span className="ml-auto tabular-nums">{results.length}개 명령</span>
        </p>
      </div>
    </div>
  );
}
