"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { DECK, cx, comma, withDiscount, EYEBROW, CAPTION, NUM, FOCUS } from "./data";

const N = DECK.length;
const THRESHOLD = 90;
const FLY_DISTANCE = 560;
const FLY_MS = 260;

const wrap = (i: number) => ((i % N) + N) % N;

export default function SwipeDeck() {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const x = useMotionValue(0);
  const springX = useSpring(
    x,
    reduced
      ? { stiffness: 1200, damping: 90, mass: 0.4 }
      : { stiffness: 320, damping: 28, mass: 0.5 },
  );
  const rotate = useTransform(springX, [-260, 260], [-9, 9]);

  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);

  // 새 카드가 최상단에 오를 때 드래그 오프셋·상세 확장 상태를 초기화한다.
  // (effect가 아니라 인덱스를 바꾸는 지점에서 직접 호출 — 캐스케이딩 렌더 방지)
  function resetTopCard() {
    x.set(0);
    setExpanded(false);
  }

  function commitSwipe(dir: 1 | -1) {
    if (isAnimating) return;
    setIsAnimating(true);
    x.set(dir === 1 ? -FLY_DISTANCE : FLY_DISTANCE);
    window.setTimeout(() => {
      setCurrentIndex((i) => wrap(i + dir));
      resetTopCard();
      setIsAnimating(false);
    }, FLY_MS);
  }

  function jumpTo(i: number) {
    if (isAnimating || i === currentIndex) return;
    setCurrentIndex(i);
    resetTopCard();
  }

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (isAnimating) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    draggingRef.current = true;
  }

  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
    x.set(e.clientX - startXRef.current);
  }

  function endDrag(e: ReactPointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || e.pointerId !== pointerIdRef.current) return;
    draggingRef.current = false;
    pointerIdRef.current = null;
    const delta = x.get();
    if (Math.abs(delta) > THRESHOLD) {
      commitSwipe(delta < 0 ? 1 : -1);
    } else {
      x.set(0);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      commitSwipe(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      commitSwipe(-1);
    }
  }

  const current = DECK[currentIndex];

  return (
    <div className="w-full">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="AI 매칭 매물 카드 스택 — 드래그 또는 화살표로 다음 매물 확인"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={cx(
          "relative mx-auto h-[440px] w-full max-w-[380px] sm:h-[480px]",
          FOCUS,
          "rounded-2xl",
        )}
      >
        {/* 스크린리더용 실시간 상태 안내 (시각적으로 숨김) */}
        <p aria-live="polite" className="sr-only">
          {currentIndex + 1}번째 매물 · {current.brand} {current.title}
        </p>

        {DECK.map((listing, i) => {
          const slot = wrap(i - currentIndex);
          const isTop = slot === 0;
          const visible = slot <= 2;
          const scale = 1 - slot * 0.045;
          const y = slot * 16;
          const opacity = slot === 0 ? 1 : slot === 1 ? 0.9 : slot === 2 ? 0.75 : 0;
          const pct = withDiscount(listing);
          const Icon = listing.icon;

          return (
            <motion.div
              key={listing.id}
              aria-hidden={!isTop}
              animate={{ y, scale, opacity }}
              transition={{ duration: reduced ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{
                zIndex: N - slot,
                x: isTop ? springX : 0,
                rotate: isTop ? rotate : 0,
              }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? endDrag : undefined}
              onPointerCancel={isTop ? endDrag : undefined}
              className={cx(
                "absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]",
                isTop ? "cursor-grab touch-none select-none active:cursor-grabbing" : "pointer-events-none",
                !visible && "pointer-events-none",
              )}
            >
              {/* image + always-on proof badges */}
              <div className="relative h-[52%] w-full shrink-0 overflow-hidden">
                <Image
                  src={listing.image.src}
                  alt={listing.image.alt}
                  fill
                  sizes="(min-width: 640px) 380px, 90vw"
                  className="object-cover"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent" />

                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                  {listing.grade}급 · {listing.gradeLabel}
                </span>
                <span className={cx(NUM, "absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 text-[0.72rem] font-semibold text-white backdrop-blur")}>
                  AI 매칭 {listing.match}%
                </span>
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#a894f7]" aria-hidden />
                  {listing.verifiedSeller}
                </span>
              </div>

              {/* face content */}
              <div className="flex min-h-0 flex-1 flex-col gap-2.5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className={cx(CAPTION, "flex items-center gap-1.5 text-[#A1A1AA]")}>
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    {listing.category} · {listing.size}
                  </p>
                </div>
                <h2 className="text-[1.05rem] font-semibold leading-snug tracking-[-0.02em] text-white">
                  {listing.title}
                </h2>
                <p className="text-[0.78rem] font-normal text-[#A1A1AA]">{listing.brand}</p>

                {/* before/after 할인율 — 항상 노출 */}
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className={cx(NUM, "text-sm font-semibold text-[#A1A1AA] line-through")}>
                    {comma(listing.retail)}원
                  </span>
                  <span className={cx(NUM, "text-lg font-extrabold text-white")}>
                    {comma(listing.repick)}원
                  </span>
                  <span className={cx(NUM, "rounded-md bg-[#6E56CF] px-2 py-0.5 text-[0.72rem] font-semibold text-white")}>
                    -{pct}%
                  </span>
                </div>

                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] font-normal text-[#A1A1AA]">
                  <Check className="h-3 w-3 shrink-0 text-[#6E56CF]" strokeWidth={2.5} aria-hidden />
                  {listing.topReason}
                </span>

                {isTop && (
                  <div className="mt-auto pt-1">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls="deck-reasons"
                      onClick={() => setExpanded((v) => !v)}
                      className={cx(
                        "flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 px-3 py-2 text-left text-[0.75rem] font-semibold text-white transition-colors duration-150 hover:border-white/25",
                        FOCUS,
                      )}
                    >
                      매칭 근거 상세 보기
                      <ChevronDown
                        className={cx("h-4 w-4 shrink-0 transition-transform duration-200", expanded && "rotate-180")}
                        aria-hidden
                      />
                    </button>
                    <div
                      id="deck-reasons"
                      className={cx(
                        "grid transition-all duration-300 ease-out",
                        expanded ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <ul className="flex flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                          {listing.reasons.map((r) => (
                            <li key={r} className="flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]">
                              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]" aria-hidden />
                              {r}
                            </li>
                          ))}
                          <li className="pt-1 text-[0.7rem] font-normal text-[#A1A1AA]">
                            {listing.sellerMeta}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* controls: arrow buttons + progress dots */}
      <div className="mt-6 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="이전 매물 보기"
          disabled={isAnimating}
          onClick={() => commitSwipe(-1)}
          className={cx(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-40",
            FOCUS,
          )}
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </button>

        <div role="group" aria-label="매물 카드 바로가기" className="flex items-center gap-1">
          {DECK.map((l, i) => (
            <button
              key={l.id}
              type="button"
              aria-label={`${i + 1}번째 매물로 이동 — ${l.title}`}
              aria-current={i === currentIndex ? "true" : undefined}
              disabled={isAnimating}
              onClick={() => jumpTo(i)}
              className={cx(
                "group grid h-6 w-6 shrink-0 place-items-center rounded-full",
                FOCUS,
              )}
            >
              <span
                aria-hidden
                className={cx(
                  "h-2 rounded-full transition-all duration-200",
                  i === currentIndex
                    ? "w-6 bg-[#6E56CF]"
                    : "w-2 bg-white/20 group-hover:bg-white/35",
                )}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="다음 매물 보기"
          disabled={isAnimating}
          onClick={() => commitSwipe(1)}
          className={cx(
            "grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-40",
            FOCUS,
          )}
        >
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <p className={cx(EYEBROW, "mt-5 text-center text-[#a894f7]")}>
        {currentIndex + 1} / {N} · 드래그하거나 화살표로 다음 큐레이션 확인
      </p>
    </div>
  );
}
