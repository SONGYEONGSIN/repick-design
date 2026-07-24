"use client";

import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpDown, BadgeCheck, Heart, ListFilter, Search } from "lucide-react";
import {
  QUERIES,
  LISTINGS,
  discountPct,
  EASE,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

type SortMode = "match" | "discount";

const CHIP_BTN =
  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2.5 text-left transition-colors duration-150 " +
  FOCUS;

const SORT_BTN =
  "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[0.72rem] font-semibold transition-colors duration-150 sm:flex-none sm:px-4 " +
  FOCUS;

const ROW_GRID =
  "lg:grid-cols-[1.7fr_1.3fr_0.6fr_0.9fr_1.05fr_1.2fr_48px] lg:items-center lg:gap-4";

const CTA_PRIMARY =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] sm:w-auto " +
  FOCUS;

export default function IndexPanel() {
  const reduced = useReducedMotion();
  const [queryIdx, setQueryIdx] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("match");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const query = QUERIES[queryIdx];
  const panelId = `index-panel-${query.id}`;

  const rows = useMemo(() => {
    const base = query.results.map((r) => ({ ...r, listing: LISTINGS[r.listingId] }));
    if (sortMode === "match") return base;
    return [...base].sort(
      (a, b) => discountPct(b.listing) - discountPct(a.listing) || b.match - a.match,
    );
  }, [query, sortMode]);

  const toggleSave = (id: string) => {
    setSavedIds((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onChipKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % QUERIES.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (idx - 1 + QUERIES.length) % QUERIES.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = QUERIES.length - 1;
    else return;
    e.preventDefault();
    setQueryIdx(next);
    chipRefs.current[next]?.focus();
  };

  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.35, ease: EASE };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.04]"
      >
        01
      </span>

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <p className={cx(EYEBROW, "flex items-center gap-2 text-[#a894f7]")}>
          <ListFilter className="h-3.5 w-3.5" aria-hidden />
          Fig. 01 — 라이브 매칭 인덱스
        </p>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>조건 선택 시 재계산</span>
      </div>

      {/* 검색 조건 칩 — 자연어 검색 의도를 미리 정의한 5개 결정론적 프리셋 */}
      <div
        role="tablist"
        aria-label="자연어 검색 조건 선택"
        className="relative mt-5 flex flex-wrap gap-2"
      >
        {QUERIES.map((q, i) => {
          const selected = i === queryIdx;
          return (
            <button
              key={q.id}
              ref={(el) => {
                chipRefs.current[i] = el;
              }}
              role="tab"
              id={`chip-${q.id}`}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setQueryIdx(i)}
              onKeyDown={(e) => onChipKeyDown(e, i)}
              className={cx(
                CHIP_BTN,
                selected
                  ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                  : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white",
              )}
            >
              <Search
                className={cx("h-3.5 w-3.5 shrink-0", selected ? "text-[#6E56CF]" : "text-current")}
                aria-hidden
              />
              <span className="break-keep text-[0.76rem] font-semibold">{q.label}</span>
            </button>
          );
        })}
      </div>

      {/* 결과 개수 + 조건 요약 — aria-live로 스크린리더에 재계산 결과를 안내 */}
      <p aria-live="polite" className="mt-4 break-keep text-[0.78rem] font-normal leading-[1.5] text-[#A1A1AA]">
        <span className="font-semibold text-white">{rows.length}개 매물</span>이 “{query.label}”
        조건에 매칭되었습니다 · {query.summary}
      </p>

      {/* 정렬 기준 토글 — 같은 결과를 다른 축으로 재정렬(조작=가치체감) */}
      <div
        role="group"
        aria-label="정렬 기준"
        className="mt-4 flex gap-1.5 rounded-xl border border-white/10 bg-black/20 p-1.5"
      >
        <button
          type="button"
          aria-pressed={sortMode === "match"}
          onClick={() => setSortMode("match")}
          className={cx(
            SORT_BTN,
            sortMode === "match" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white",
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
          매칭 정확도순
        </button>
        <button
          type="button"
          aria-pressed={sortMode === "discount"}
          onClick={() => setSortMode("discount")}
          className={cx(
            SORT_BTN,
            sortMode === "discount" ? "bg-[#6E56CF] text-white" : "text-[#A1A1AA] hover:text-white",
          )}
        >
          <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
          할인율 높은순
        </button>
      </div>

      {/* 데스크톱 전용 열 캡션 — 모바일에서는 각 행 내부 캡션이 대체 */}
      <div className={cx("mt-6 hidden gap-4 border-b border-white/10 pb-3 lg:grid", ROW_GRID)}>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>매물</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>매칭 근거</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>AI 매칭</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>컨디션</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>인증 판매자</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>가격</span>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>관심</span>
      </div>

      <div id={panelId} role="tabpanel" aria-labelledby={`chip-${query.id}`} tabIndex={-1}>
        <ul role="list" aria-label="매칭된 매물 목록" className="mt-3 flex list-none flex-col gap-3 lg:mt-0 lg:gap-0">
          <AnimatePresence initial={false} mode="popLayout">
            {rows.map((r) => {
              const saved = savedIds.has(r.listing.id);
              const discount = discountPct(r.listing);
              return (
                <motion.li
                  key={r.listing.id}
                  layout
                  initial={reduced ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={transition}
                  className={cx(
                    "grid grid-cols-2 gap-x-3 gap-y-3 rounded-xl border border-white/10 bg-[#0B0B0F] p-4 sm:p-5 lg:rounded-none lg:border-x-0 lg:border-t-0 lg:bg-transparent lg:py-4",
                    ROW_GRID,
                  )}
                >
                  {/* 매물 */}
                  <div className="col-span-2 flex min-w-0 items-center gap-3 lg:col-span-1">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={r.listing.image.src}
                        alt={r.listing.image.alt}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className={cx(CAPTION, "text-[#A1A1AA]")}>{r.listing.brand}</p>
                      <p className="mt-0.5 truncate text-[0.85rem] font-semibold text-white">
                        {r.listing.title}
                      </p>
                    </div>
                  </div>

                  {/* 매칭 근거 */}
                  <div className="col-span-2 min-w-0 lg:col-span-1">
                    <span className={cx(CAPTION, "mb-1.5 block text-[#A1A1AA] lg:hidden")}>
                      매칭 근거
                    </span>
                    <ul role="list" className="flex list-none flex-wrap gap-1.5">
                      {r.reasonTags.map((t) => (
                        <li
                          key={t}
                          className="rounded-md border border-[#6E56CF]/40 bg-[#6E56CF]/10 px-2 py-0.5 text-[0.68rem] font-semibold text-white"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI 매칭% */}
                  <div className="min-w-0">
                    <span className={cx(CAPTION, "mb-1.5 block text-[#A1A1AA] lg:hidden")}>
                      AI 매칭
                    </span>
                    <motion.span
                      key={`${query.id}-${r.listing.id}-match`}
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={transition}
                      className={cx(NUM, "text-base font-extrabold text-white")}
                    >
                      {r.match}%
                    </motion.span>
                  </div>

                  {/* 컨디션 등급 */}
                  <div className="min-w-0">
                    <span className={cx(CAPTION, "mb-1.5 block text-[#A1A1AA] lg:hidden")}>
                      컨디션
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[0.68rem] font-semibold text-white">
                      {r.listing.grade}급 · {r.listing.gradeLabel}
                    </span>
                  </div>

                  {/* 인증 판매자 */}
                  <div className="col-span-2 min-w-0 lg:col-span-1">
                    <span className={cx(CAPTION, "mb-1.5 block text-[#A1A1AA] lg:hidden")}>
                      인증 판매자
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                      <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                      {r.listing.seller}
                    </span>
                    <span className="mt-0.5 block text-[0.68rem] font-normal text-[#A1A1AA]">
                      {r.listing.sellerMeta}
                    </span>
                  </div>

                  {/* before/after 할인율 */}
                  <div className="col-span-2 min-w-0 lg:col-span-1">
                    <span className={cx(CAPTION, "mb-1.5 block text-[#A1A1AA] lg:hidden")}>
                      가격
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                      <span className={cx(NUM, "text-xs font-semibold text-[#A1A1AA] line-through")}>
                        {comma(r.listing.retail)}원
                      </span>
                      <span className={cx(NUM, "text-sm font-extrabold text-white")}>
                        {comma(r.listing.repick)}원
                      </span>
                      <span
                        className={cx(
                          NUM,
                          "rounded-md bg-[#6E56CF] px-1.5 py-0.5 text-[0.66rem] font-semibold text-white",
                        )}
                      >
                        -{discount}%
                      </span>
                    </div>
                  </div>

                  {/* 관심 저장 토글 */}
                  <div className="flex items-center justify-between gap-2 lg:justify-center">
                    <span className={cx(CAPTION, "text-[#A1A1AA] lg:hidden")}>관심</span>
                    <button
                      type="button"
                      aria-pressed={saved}
                      aria-label={`${r.listing.title} 관심 매물로 저장${saved ? "됨" : ""}`}
                      onClick={() => toggleSave(r.listing.id)}
                      className={cx(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-150",
                        saved
                          ? "border-[#6E56CF] bg-[#6E56CF]/20 text-white"
                          : "border-white/15 text-[#A1A1AA] hover:text-white",
                        FOCUS,
                      )}
                    >
                      <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} aria-hidden />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-normal text-[#A1A1AA]">
          {savedIds.size > 0
            ? `${savedIds.size}개 관심 매물 저장됨`
            : "마음에 드는 매물을 관심으로 저장해보세요"}
        </span>
        <a href="#cta" className={CTA_PRIMARY}>
          이 조건으로 매칭 시작하기
          <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </a>
      </div>
    </div>
  );
}
