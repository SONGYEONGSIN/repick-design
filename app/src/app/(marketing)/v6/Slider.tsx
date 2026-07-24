"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ChevronsLeftRight, Sparkles, BadgeCheck } from "lucide-react";
import {
  AFTER_IMG,
  BEFORE_IMG,
  BEFORE_GAPS,
  clamp,
  cx,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const KEY_STEP = 4;
const PAGE_STEP = 10;

/**
 * 히어로 비포/애프터 리빌 슬라이더.
 * - pointer/touch 드래그 + 클릭 위치 이동 (setPointerCapture)
 * - 키보드 조작 (role="slider", Arrow/Home/End/PageUp/Down, aria-valuenow)
 * - framer-motion useSpring 물리로 핸들·클립 부드럽게, motion-reduce 시 즉시
 * - scrollY 값을 받아 이미지 밴드 미세 parallax (부모가 주입)
 */
export default function Slider({ parallax }: { parallax: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const figRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  // aria/readout 용 상태 (초기 50 → 하이드레이션 안정)
  const [pct, setPct] = useState(50);
  const [touched, setTouched] = useState(false);

  // 시각 표현용 스프링 (상태와 분리 — 오버슈트해도 aria 값은 정확)
  const target = useMotionValue(50);
  const smooth = useSpring(
    target,
    reduced
      ? { stiffness: 2000, damping: 90, mass: 0.2 }
      : { stiffness: 280, damping: 32, mass: 0.6 },
  );
  const clipPath = useTransform(
    smooth,
    (v) => `inset(0 0 0 ${clamp(v).toFixed(2)}%)`,
  );
  const handleLeft = useTransform(smooth, (v) => `${clamp(v).toFixed(2)}%`);

  function set(v: number) {
    const c = clamp(v);
    setPct(c);
    target.set(c);
    if (!touched) setTouched(true);
  }

  function fromClientX(clientX: number) {
    const el = figRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    set(((clientX - r.left) / r.width) * 100);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        e.preventDefault();
        set(pct - KEY_STEP);
        break;
      case "ArrowRight":
      case "ArrowUp":
        e.preventDefault();
        set(pct + KEY_STEP);
        break;
      case "PageDown":
        e.preventDefault();
        set(pct - PAGE_STEP);
        break;
      case "PageUp":
        e.preventDefault();
        set(pct + PAGE_STEP);
        break;
      case "Home":
        e.preventDefault();
        set(0);
        break;
      case "End":
        e.preventDefault();
        set(100);
        break;
      default:
        break;
    }
  }

  const rounded = Math.round(pct);

  return (
    <motion.figure
      style={{ y: parallax }}
      className="relative m-0 select-none"
    >
      <div
        ref={figRef}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          fromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          fromClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {
            /* pointer already released */
          }
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0F] sm:aspect-[4/3] lg:aspect-[5/6]"
      >
        {/* BEFORE — 일반 중고거래 (무채·저조도, 정보 결핍) */}
        <div className="absolute inset-0">
          <Image
            src={BEFORE_IMG.src}
            alt={BEFORE_IMG.alt}
            fill
            priority
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover brightness-[0.62] grayscale-[0.55] contrast-[0.95]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[#0B0B0F]/45"
          />
          <span
            className={cx(
              CAPTION,
              "absolute left-4 top-4 rounded-full border border-white/15 bg-[#0B0B0F]/80 px-3 py-1 text-white/70 backdrop-blur",
            )}
          >
            일반 중고거래
          </span>
          <ul className="absolute bottom-4 left-4 hidden flex-col gap-1.5 sm:flex">
            {BEFORE_GAPS.map((g) => (
              <li
                key={g}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-[#0B0B0F]/70 px-2.5 py-1 text-[0.75rem] font-normal text-white/60 backdrop-blur"
              >
                <span
                  aria-hidden
                  className="h-1 w-1 rounded-full bg-white/40"
                />
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* AFTER — repick AI 매칭 (풀컬러 + 큐레이션 오버레이) */}
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <Image
            src={AFTER_IMG.src}
            alt={AFTER_IMG.alt}
            fill
            sizes="(min-width: 1024px) 620px, 100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/80 via-[#0B0B0F]/5 to-transparent"
          />
          <span
            className={cx(
              CAPTION,
              "absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#6E56CF] px-3 py-1 text-white",
            )}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            repick AI 매칭
          </span>

          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/75 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                <span className={NUM}>AI 매칭 96%</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0B0B0F]/75 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                S급 · 새 상품급
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6E56CF]/40 bg-[#6E56CF]/15 px-2.5 py-1 text-[0.75rem] font-semibold text-white backdrop-blur">
                <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                검증 셀러
              </span>
            </div>
            <div className="flex items-baseline gap-2 rounded-xl border border-white/10 bg-[#0B0B0F]/75 px-3 py-2 backdrop-blur">
              <span className={cx("text-lg font-extrabold text-white", NUM)}>
                78,000원
              </span>
              <span className={cx("text-[0.8125rem] font-normal text-white/40 line-through", NUM)}>
                148,000원
              </span>
              <span className={cx("ml-auto rounded-md bg-[#6E56CF] px-2 py-0.5 text-[0.8125rem] font-semibold text-white", NUM)}>
                -47%
              </span>
            </div>
          </div>
        </motion.div>

        {/* HANDLE */}
        <motion.div
          style={{ left: handleLeft }}
          className="pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2"
        >
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/70"
          />
          <button
            type="button"
            role="slider"
            aria-label="비포/애프터 비교 슬라이더"
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={rounded}
            aria-valuetext={`AI 큐레이션 ${100 - rounded}% 노출`}
            onKeyDown={onKeyDown}
            className={cx(
              "pointer-events-auto absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-[#0B0B0F]/90 text-white shadow-[0_2px_12px_rgba(0,0,0,0.45)] backdrop-blur transition-colors duration-150 hover:border-[#6E56CF] active:cursor-grabbing",
              FOCUS,
            )}
          >
            <ChevronsLeftRight className="h-5 w-5 text-[#6E56CF]" strokeWidth={2.25} aria-hidden />
          </button>
        </motion.div>

        {/* 드래그 힌트 — 상호작용 전에만 */}
        <div
          aria-hidden
          className={cx(
            "pointer-events-none absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-[#0B0B0F]/80 px-3 py-1 text-[0.72rem] font-semibold text-white backdrop-blur transition-opacity duration-300",
            touched ? "opacity-0" : "opacity-100",
          )}
        >
          좌우로 밀어서 비교
        </div>
      </div>
    </motion.figure>
  );
}
