"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Gauge,
  Minus,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  CATEGORIES,
  BUDGET_STEPS,
  EASE,
  VIEWPORT,
  cx,
  comma,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "./data";

const CTA_PRIMARY =
  "inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] sm:w-auto " +
  FOCUS;

const SEGMENT_BTN =
  "group flex flex-1 flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors duration-150 " +
  FOCUS;

const clampIndex = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/**
 * 결과 숫자 하나의 count-up 애니메이션.
 * - useMotionValue(target) → useSpring(target)로 값 변경 시 자동 스프링 보간(선언적, RAF 직접 없음).
 * - enabled=false(뷰포트 진입 전)이면 0에 머무르고, 진입 즉시 실제 값으로 카운트업.
 * - motion-reduce: 스프링을 매우 뻣뻣하게 만들어 사실상 즉시 수렴.
 */
function useCountUp(value: number, enabled: boolean, reduced: boolean) {
  const target = useMotionValue(enabled ? value : 0);
  const smooth = useSpring(
    target,
    reduced
      ? { stiffness: 1800, damping: 90, mass: 0.25 }
      : { stiffness: 95, damping: 22, mass: 1 },
  );
  const [display, setDisplay] = useState(enabled ? value : 0);

  useEffect(() => {
    target.set(enabled ? value : 0);
  }, [value, enabled, target]);

  useEffect(() => {
    const unsubscribe = smooth.on("change", (v) => setDisplay(v));
    return unsubscribe;
  }, [smooth]);

  return display;
}

export default function Calculator() {
  const reduced = useReducedMotion();
  const [catIdx, setCatIdx] = useState(0);
  const [tierIdx, setTierIdx] = useState(1);
  const [started, setStarted] = useState(!!reduced);

  // 안전장치: whileInView 트리거가 어떤 이유로든 못 잡아도 짧은 지연 내 최종 상태로 수렴.
  useEffect(() => {
    if (started) return;
    const id = setTimeout(() => setStarted(true), 320);
    return () => clearTimeout(id);
  }, [started]);

  const category = CATEGORIES[catIdx];
  const tier = category.tiers[tierIdx];

  const retail = tier.retail;
  const repick = tier.repick;
  const savings = retail - repick;
  const pct = Math.round((savings / retail) * 100);

  const retailDisplay = useCountUp(retail, started, !!reduced);
  const repickDisplay = useCountUp(repick, started, !!reduced);
  const savingsDisplay = useCountUp(savings, started, !!reduced);
  const pctDisplay = useCountUp(pct, started, !!reduced);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setStarted(true)}
      viewport={VIEWPORT}
      transition={{ duration: 0.7, ease: EASE }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <p className={cx(EYEBROW, "flex items-center gap-2 text-[#a894f7]")}>
          <Gauge className="h-3.5 w-3.5" aria-hidden />
          절약 계산기
        </p>
        <span className={cx(CAPTION, "text-[#A1A1AA]")}>실시간 대조</span>
      </div>

      {/* 카테고리 세그먼트 — radiogroup이 아닌 버튼 그룹 */}
      <div
        role="group"
        aria-label="상품 카테고리 선택"
        className="mt-5 flex gap-2"
      >
        {CATEGORIES.map((c, i) => {
          const selected = i === catIdx;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setCatIdx(i)}
              className={cx(
                SEGMENT_BTN,
                selected
                  ? "border-[#6E56CF]/60 bg-[#6E56CF]/10 text-white"
                  : "border-white/10 bg-transparent text-[#A1A1AA] hover:border-white/25 hover:text-white",
              )}
            >
              <Icon
                className={cx(
                  "h-4 w-4",
                  selected ? "text-[#6E56CF]" : "text-current",
                )}
                aria-hidden
              />
              <span className="text-[0.75rem] font-semibold">{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* 예산 스텝퍼 + 슬라이더 (프리셋 배열 인덱스, 드래그 리빌 아님) */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <label
            htmlFor="budget-range"
            className={cx(CAPTION, "text-[#A1A1AA]")}
          >
            예산 구간
          </label>
          <span className={cx(NUM, "text-sm font-semibold text-white")}>
            {BUDGET_STEPS[tierIdx]}
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            aria-label="예산 구간 낮추기"
            disabled={tierIdx === 0}
            onClick={() =>
              setTierIdx((v) => clampIndex(v - 1, 0, BUDGET_STEPS.length - 1))
            }
            className={cx(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-30",
              FOCUS,
            )}
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <input
            id="budget-range"
            type="range"
            min={0}
            max={BUDGET_STEPS.length - 1}
            step={1}
            value={tierIdx}
            onChange={(e) => setTierIdx(Number(e.target.value))}
            aria-valuetext={BUDGET_STEPS[tierIdx]}
            className={cx(
              "h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6E56CF]",
              FOCUS,
            )}
          />
          <button
            type="button"
            aria-label="예산 구간 높이기"
            disabled={tierIdx === BUDGET_STEPS.length - 1}
            onClick={() =>
              setTierIdx((v) => clampIndex(v + 1, 0, BUDGET_STEPS.length - 1))
            }
            className={cx(
              "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 text-white transition-colors duration-150 hover:border-white/30 disabled:pointer-events-none disabled:opacity-30",
              FOCUS,
            )}
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* 실시간 대조 숫자 — count-up */}
      <div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
        <div>
          <p className={cx(CAPTION, "text-[#A1A1AA]")}>매장 신품가</p>
          <p
            className={cx(
              NUM,
              "mt-1.5 text-xl font-semibold text-white/40 line-through sm:text-2xl",
            )}
          >
            {comma(retailDisplay)}원
          </p>
        </div>
        <div>
          <p className={cx(CAPTION, "text-[#a894f7]")}>repick AI 매칭가</p>
          <p
            className={cx(
              NUM,
              "mt-1.5 text-xl font-extrabold text-white sm:text-2xl",
            )}
          >
            {comma(repickDisplay)}원
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/10 px-5 py-5">
        <p className={cx(CAPTION, "text-[#a894f7]")}>지금 이 조건의 절약액</p>
        <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className={cx(
              NUM,
              "text-[clamp(2rem,7vw,2.75rem)] font-extrabold leading-none text-white",
            )}
          >
            {comma(savingsDisplay)}원
          </span>
          <span
            className={cx(
              NUM,
              "rounded-md bg-[#6E56CF] px-2.5 py-1 text-sm font-semibold text-white",
            )}
          >
            -{Math.round(pctDisplay)}%
          </span>
        </div>
      </div>

      {/* AI 매칭 근거 카드 — 예산/카테고리 조합에 따라 프리셋 제품으로 교체 */}
      <motion.figure
        key={`${category.id}-${tierIdx}`}
        initial={reduced ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="m-0 mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#0B0B0F]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[128px_1fr]">
          <div className="relative h-32 w-full overflow-hidden sm:h-auto">
            <Image
              src={category.image.src}
              alt={category.image.alt}
              fill
              sizes="(min-width: 640px) 128px, 100vw"
              className="object-cover"
            />
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-[#6E56CF]/50 bg-[#6E56CF]/25 px-2 py-0.5 text-[0.68rem] font-semibold text-white backdrop-blur">
              {tier.grade}급
            </span>
          </div>
          <figcaption className="flex flex-col gap-2.5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className={cx(CAPTION, "text-[#A1A1AA]")}>{tier.brand}</p>
                <h2 className="mt-0.5 text-[0.95rem] font-semibold leading-snug text-white">
                  {tier.title}
                </h2>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.75rem] font-semibold text-white">
                <span className={NUM}>AI 매칭 {tier.match}%</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white">
                <BadgeCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
                {tier.seller}
              </span>
              <span className="text-[0.72rem] font-normal text-[#A1A1AA]">
                {tier.sellerMeta} · {tier.gradeLabel}
              </span>
            </div>

            <ul className="flex flex-col gap-1">
              {tier.reasons.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-1.5 text-[0.75rem] font-normal text-[#A1A1AA]"
                >
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-[#6E56CF]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {r}
                </li>
              ))}
            </ul>

            <p className="mt-auto inline-flex items-center gap-1.5 text-[0.7rem] font-normal text-[#A1A1AA]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#6E56CF]" aria-hidden />
              전문 검수팀 실측 완료 · 하자 리포트 제공
            </p>
          </figcaption>
        </div>
      </motion.figure>

      <a href="#cta" className={cx(CTA_PRIMARY, "mt-6")}>
        이 조건으로 {comma(savings)}원 절약하고 매칭받기
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
      </a>
    </motion.div>
  );
}
