"use client";

import { Fragment, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ShieldCheck, Sparkles } from "lucide-react";
import {
  RAIL_ITEMS,
  GENERIC_COUNT,
  discountPct,
  cx,
  comma,
  CAPTION,
  NUM,
  FOCUS,
  type RailItem,
} from "./data";

const N = RAIL_ITEMS.length;

// 옷걸이 훅 — 순수 SVG, 사진/스큐어모피즘 없이 기하학적 형태만 사용
function HangerIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 14"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 1.2c-1.25 0-2.25.98-2.25 2.2 0 .78.43 1.47 1.08 1.87L3.6 9.4C2.6 9.9 2 10.9 2 12v.4c0 .44.36.8.8.8h18.4c.44 0 .8-.36.8-.8V12c0-1.1-.6-2.1-1.6-2.6l-7.23-4.13c.65-.4 1.08-1.09 1.08-1.87 0-1.22-1-2.2-2.25-2.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RailDivider() {
  return (
    <div
      aria-hidden="true"
      className="relative mr-8 flex w-20 shrink-0 flex-col items-center gap-2 pt-11 text-center sm:mr-10 sm:w-24"
    >
      <Sparkles className="h-4 w-4 text-[#a894f7]" />
      <span className="text-[0.6rem] font-semibold uppercase leading-[1.3] tracking-[0.2em] text-[#a894f7]">
        AI가
        <br />
        다시 고르는 중
      </span>
      <ArrowRight className="h-3.5 w-3.5 text-[#a894f7]" />
    </div>
  );
}

function GenericCard({ item }: { item: Extract<RailItem, { kind: "generic" }> }) {
  return (
    <div className="w-24 rounded-lg border border-white/10 bg-white/[0.03] p-1.5 sm:w-28">
      <div className="relative h-28 w-full overflow-hidden rounded-md sm:h-32">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="128px"
          className="object-cover opacity-70 grayscale"
        />
      </div>
      <p className="mt-1.5 truncate text-[0.62rem] font-normal leading-tight text-[#A1A1AA]">
        {item.title}
      </p>
      <p className="truncate text-[0.58rem] font-normal leading-tight text-[#A1A1AA]">
        {item.meta}
      </p>
    </div>
  );
}

function CuratedCard({ item }: { item: Extract<RailItem, { kind: "curated" }> }) {
  const pct = discountPct(item.retail, item.repick);
  return (
    <div className="w-52 rounded-xl border border-white/10 bg-[#0B0B0F] sm:w-60">
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl sm:h-44">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(min-width: 640px) 240px, 208px"
          className="object-cover"
        />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.62rem] font-semibold text-white backdrop-blur">
          {item.grade}급 · {item.gradeLabel}
        </span>
        <span className={cx(NUM, "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/45 px-2 py-0.5 text-[0.62rem] font-semibold text-white backdrop-blur")}>
          매칭 {item.match}%
        </span>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <div>
          <p className={cx(CAPTION, "text-[0.6rem] text-[#A1A1AA]")}>{item.brand}</p>
          <h2 className="mt-0.5 truncate text-[0.82rem] font-semibold leading-snug text-white">
            {item.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className={cx(NUM, "text-[0.7rem] font-semibold text-[#A1A1AA] line-through")}>
            {comma(item.retail)}원
          </span>
          <span className={cx(NUM, "text-[0.92rem] font-extrabold text-white")}>
            {comma(item.repick)}원
          </span>
          <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-1.5 py-0.5 text-[0.62rem] font-semibold text-white")}>
            -{pct}%
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-white">
          <BadgeCheck className="h-3 w-3 text-[#6E56CF]" aria-hidden />
          {item.seller}
        </span>
      </div>
    </div>
  );
}

export default function WardrobeRail() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dragRef = useRef<{ startX: number; startScroll: number; pointerId: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const active = RAIL_ITEMS[activeIndex];

  function getNearestIndex(): number {
    const track = trackRef.current;
    if (!track) return activeIndex;
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    let bestIdx = activeIndex;
    let bestDist = Infinity;
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const c = r.left + r.width / 2;
      const d = Math.abs(c - centerX);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    return bestIdx;
  }

  function centerItem(i: number, smooth: boolean) {
    const track = trackRef.current;
    const item = itemRefs.current[i];
    if (!track || !item) return;
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta = itemRect.left + itemRect.width / 2 - (trackRect.left + trackRect.width / 2);
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.min(maxScroll, Math.max(0, track.scrollLeft + delta));
    track.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
  }

  function selectIndex(i: number) {
    const clamped = Math.max(0, Math.min(N - 1, i));
    setActiveIndex(clamped);
    centerItem(clamped, !reduced);
  }

  function onScroll() {
    if (dragRef.current) return;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const idx = getNearestIndex();
      setActiveIndex((cur) => (cur === idx ? cur : idx));
    });
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectIndex(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectIndex(activeIndex - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      selectIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      selectIndex(N - 1);
    }
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const track = trackRef.current;
    if (!track) return;
    track.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startScroll: track.scrollLeft, pointerId: e.pointerId };
    setIsDragging(true);
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track || drag.pointerId !== e.pointerId) return;
    track.scrollLeft = drag.startScroll - (e.clientX - drag.startX);
  }

  function onPointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    selectIndex(getNearestIndex());
  }

  return (
    <div className="w-full min-w-0">
      <div
        ref={trackRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="옷장 레일 — 일반 매물 구간에서 AI 큐레이션 캡슐 구간까지, 드래그하거나 화살표 키로 이동"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onScroll={onScroll}
        style={{ overscrollBehaviorX: "contain", touchAction: "pan-y" }}
        className={cx(
          "relative w-full min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] py-9 pl-4 pr-6 select-none sm:pl-6 sm:pr-10",
          isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory",
          FOCUS,
        )}
      >
        {/* 스크린리더용 실시간 상태 안내 */}
        <p aria-live="polite" className="sr-only">
          {activeIndex + 1} / {N} ·{" "}
          {active.kind === "generic"
            ? `일반 매물 · ${active.title}`
            : `AI 큐레이션 매물 · ${active.brand} ${active.title} · 매칭 ${active.match}%`}
        </p>

        <div className="relative flex w-max items-start">
          {/* 옷장 레일 봉 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-white/15 via-white/25 to-[#6E56CF]/60"
          />
          <span aria-hidden="true" className="pointer-events-none absolute -left-0.5 top-5 h-2 w-2 -translate-y-1/2 rounded-full bg-white/25" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-0.5 top-5 h-2 w-2 -translate-y-1/2 rounded-full bg-[#6E56CF]/70" />

          {RAIL_ITEMS.map((item, i) => {
            const isActive = i === activeIndex;
            return (
              <Fragment key={item.id}>
                {i === GENERIC_COUNT && <RailDivider />}
                <div
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={cx(
                    "shrink-0 snap-center transition-transform duration-200",
                    i === N - 1 ? "mr-0" : item.kind === "generic" ? "mr-3 sm:mr-4" : "mr-6 sm:mr-8",
                    isActive ? "scale-100" : "scale-[0.97]",
                  )}
                >
                  <div className="flex h-8 items-end justify-center pb-1">
                    <HangerIcon
                      className={cx(
                        "h-4 w-6",
                        item.kind === "curated" ? "text-[#a894f7]" : "text-white/25",
                      )}
                    />
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => selectIndex(i)}
                    aria-label={
                      item.kind === "generic"
                        ? `${i + 1}번째 · 일반 매물 · ${item.title}`
                        : `${i + 1}번째 · AI 큐레이션 · ${item.brand} ${item.title} · 매칭 ${item.match}%`
                    }
                    className={cx(
                      "block rounded-xl text-left transition-transform duration-200",
                      isActive && "ring-1 ring-[#6E56CF]/60",
                    )}
                    style={
                      item.kind === "generic"
                        ? { transform: i % 2 === 0 ? "rotate(-1.2deg)" : "rotate(1deg)" }
                        : undefined
                    }
                  >
                    {item.kind === "generic" ? (
                      <GenericCard item={item} />
                    ) : (
                      <CuratedCard item={item} />
                    )}
                  </button>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {/* 이동 컨트롤: 화살표 + 구간별 점 지도 (클릭 시 즉시 이동) */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          aria-label="이전 매물로 이동"
          onClick={() => selectIndex(activeIndex - 1)}
          disabled={activeIndex === 0}
          className={cx(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-30",
            FOCUS,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </button>

        {/* sm 이상: 구간별 점 지도(클릭 시 즉시 이동), 24px 히트 영역 */}
        <div
          role="group"
          aria-label="매물 바로가기 — 무채색 점은 일반 매물, 보라색 점은 AI 큐레이션 매물"
          className="hidden flex-1 items-center justify-center gap-1 overflow-hidden sm:flex"
        >
          {RAIL_ITEMS.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${i + 1}번째 · ${item.kind === "generic" ? "일반 매물" : `AI 큐레이션 · ${item.title}`}로 이동`}
              aria-current={i === activeIndex ? "true" : undefined}
              onClick={() => selectIndex(i)}
              className={cx("group grid h-6 w-6 shrink-0 place-items-center rounded-full", FOCUS)}
            >
              <span
                aria-hidden="true"
                className={cx(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeIndex
                    ? item.kind === "generic"
                      ? "w-5 bg-white/60"
                      : "w-5 bg-[#6E56CF]"
                    : item.kind === "generic"
                      ? "w-1.5 bg-white/20 group-hover:bg-white/35"
                      : "w-1.5 bg-[#a894f7]/35 group-hover:bg-[#a894f7]/60",
                )}
              />
            </button>
          ))}
        </div>

        {/* 모바일: 점 10개 대신 진행률 바 — 위치 정보는 상단 aria-live로 이미 안내됨 */}
        <div aria-hidden="true" className="flex flex-1 flex-col items-center gap-1.5 sm:hidden">
          <div className="h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[#6E56CF] transition-all duration-200"
              style={{ width: `${((activeIndex + 1) / N) * 100}%` }}
            />
          </div>
          <span className={cx(NUM, "text-[0.68rem] font-semibold text-[#A1A1AA]")}>
            {activeIndex + 1} / {N}
          </span>
        </div>

        <button
          type="button"
          aria-label="다음 매물로 이동"
          onClick={() => selectIndex(activeIndex + 1)}
          disabled={activeIndex === N - 1}
          className={cx(
            "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-30",
            FOCUS,
          )}
        >
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {/* 지금 보는 행거 — 활성 인덱스와 동기화되는 상시노출 증명 패널 */}
      <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
        {active.kind === "generic" ? (
          <div>
            <p className={cx(CAPTION, "text-[#A1A1AA]")}>지금 보는 행거 · 일반 매물</p>
            <h2 className="mt-1.5 text-base font-semibold text-white">{active.title}</h2>
            <p className="mt-1 text-sm font-normal leading-[1.6] text-[#A1A1AA]">
              {active.meta} — 검수 이력과 근거 태그가 없어 컨디션과 적정가를 가늠하기 어렵습니다.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-[#a894f7]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              오른쪽으로 이동하면 AI가 재검수한 캡슐이 시작됩니다
            </p>
          </div>
        ) : (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={cx(CAPTION, "text-[#A1A1AA]")}>지금 보는 행거 · AI 큐레이션</p>
                <h2 className="mt-1.5 text-base font-semibold text-white">
                  {active.brand} · {active.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.72rem] font-semibold text-white">
                <span className={NUM}>매칭 {active.match}%</span>
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/15 px-2.5 py-1 text-[0.72rem] font-semibold text-white">
                {active.grade}급 · {active.gradeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                {active.seller}
              </span>
              <span className="text-[0.74rem] font-normal text-[#A1A1AA]">{active.sellerMeta}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className={cx(NUM, "text-sm font-semibold text-[#A1A1AA] line-through")}>
                {comma(active.retail)}원
              </span>
              <span className={cx(NUM, "text-lg font-extrabold text-white")}>
                {comma(active.repick)}원
              </span>
              <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-2 py-0.5 text-xs font-semibold text-white")}>
                -{discountPct(active.retail, active.repick)}%
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {active.tags.map((t) => (
                <li key={t} className="flex items-center gap-1.5 text-[0.78rem] font-normal text-[#A1A1AA]">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                  {t}
                </li>
              ))}
              <li className="flex items-center gap-1.5 text-[0.78rem] font-normal text-[#A1A1AA]">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                9개 항목 실측 검수 완료
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
