"use client";

import Image from "next/image";
import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Brain,
  Target,
  ShieldCheck,
  Zap,
  Search,
  Sparkles,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

type Tone = "warn" | "danger" | "muted";

const TONE_CLASSES: Record<Tone, string> = {
  warn: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
  muted: "bg-stone-200 text-stone-600",
};

const MANUAL_LISTINGS: { title: string; price: string; tag: string; tone: Tone }[] = [
  { title: "빈티지 데님 자켓 (오버핏)", price: "68,000원", tag: "상태 불명", tone: "warn" },
  { title: "리바이스 데님 자켓 급처합니다", price: "95,000원", tag: "가격 이상", tone: "danger" },
  { title: "커버낫 데님 자켓 새제품", price: "42,000원", tag: "판매자 미확인", tone: "warn" },
  { title: "데님자켓팝니다급함", price: "가격문의", tag: "설명 없음", tone: "warn" },
  { title: "빈티지 워시드 데님자켓", price: "78,000원", tag: "3일째 끌올", tone: "muted" },
];

const FEATURES = [
  {
    n: "01",
    icon: Brain,
    lead: "취향 학습",
    title: "검색할수록, 나를 더 알아갑니다",
    desc: "찜하고 클릭하고 구매한 흔적을 RE:픽이 조용히 지켜봅니다. 필터를 처음부터 다시 맞출 필요가 없어요.",
    manual: [
      "매번 사이즈·브랜드·가격대 새로 입력",
      "어제 걸러낸 매물이 오늘 또 뜸",
      "내 취향은 오직 내 머릿속에만 있음",
    ],
    ai: [
      "찜 3개면 취향 학습 시작",
      "클릭 패턴으로 자동 필터링",
      "검색할수록 추천이 더 정확해짐",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      alt: "파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙",
    },
  },
  {
    n: "02",
    icon: Target,
    lead: "AI 매칭",
    title: "5,000개 중에서, 이미 골라놨어요",
    desc: "수만 개 매물을 새벽마다 훑어 상위 1%만 남깁니다. 스크롤 대신 선택만 하면 됩니다.",
    manual: [
      "키워드 하나로 뜨는 매물 수천 개",
      "정렬 기준은 최신순 아니면 가격순뿐",
      "스크롤 300번, 그래도 다 못 봄",
    ],
    ai: [
      "취향 일치 상위 1%만 자동 선별",
      "매칭률 순으로 자동 정렬",
      "스크롤 3번이면 끝",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      alt: "가죽 소재 크로스백과 액세서리를 가까이서 촬영한 사진",
    },
  },
  {
    n: "03",
    icon: ShieldCheck,
    lead: "신뢰 검증",
    title: "판매자 말고, 데이터를 믿으세요",
    desc: "상태·가격·판매자 이력을 교차 검증해 위험한 매물은 추천되기 전에 걸러냅니다.",
    manual: [
      "상태 설명은 판매자 말이 전부",
      "프로필 사진 하나로 신뢰도 판단",
      "직거래 리스크는 오롯이 내 몫",
    ],
    ai: [
      "사진·설명 교차 검증으로 상태 등급 산출",
      "판매 이력·응답률로 신뢰 스코어링",
      "위험 매물은 추천 전에 미리 제외",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=900&q=80",
      alt: "빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습",
    },
  },
  {
    n: "04",
    icon: Zap,
    lead: "실시간 알림",
    title: "새로고침 대신, 알림이 옵니다",
    desc: "가격이 내려가거나 딱 맞는 매물이 올라오는 순간, 남들보다 먼저 알려드립니다.",
    manual: [
      "하루 10번 넘게 습관적으로 새로고침",
      "눈여겨보던 매물, 알아챘을 땐 이미 판매완료",
      "늦게 안 정보는 정보가 아님",
    ],
    ai: [
      "가격 하락 즉시 알림 발송",
      "새 매칭 뜨는 순간 푸시 알림",
      "남들보다 먼저 보고, 먼저 잡음",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
      alt: "다양한 색상의 의류가 걸려 있는 옷걸이 랙",
    },
  },
];

function SplitCompare({ prefersReducedMotion }: { prefersReducedMotion: boolean | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, ratio)));
  }, []);

  const handlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      setIsDragging(true);
      containerRef.current?.setPointerCapture(e.pointerId);
      updateFromClientX(e.clientX);
    },
    [updateFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    },
    [updateFromClientX],
  );

  const stopDragging = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setIsDragging(false);
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      setPos((p) => Math.max(0, p - 5));
      e.preventDefault();
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      setPos((p) => Math.min(100, p + 5));
      e.preventDefault();
    } else if (e.key === "Home") {
      setPos(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPos(100);
      e.preventDefault();
    }
  }, []);

  return (
    <div>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        className="relative h-[460px] w-full touch-none overflow-hidden rounded-[1.75rem] border border-stone-200 bg-stone-100 shadow-xl shadow-stone-900/10 select-none sm:h-[520px] md:h-[560px]"
      >
        {/* base layer: RE:픽 AI (always full width) */}
        <div className="absolute inset-0 flex flex-col gap-3 bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-50 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> RE:픽 AI 추천
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
                매칭 94%
              </span>
              <span className="font-mono text-xs tabular-nums text-stone-500">3초 전</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-emerald-100 sm:h-20 sm:w-20">
                <Image
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=200&q=80"
                  alt="옷걸이에 가지런히 걸린 데님 재킷"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-stone-900 sm:text-lg">
                  빈티지 워시드 데님 재킷 A급
                </p>
                <p className="mt-1 text-lg font-bold tabular-nums text-stone-900">72,000원</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                <Check className="h-3 w-3" aria-hidden="true" /> 상태 검증완료
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                <Check className="h-3 w-3" aria-hidden="true" /> 인증 판매자
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">
                <Check className="h-3 w-3" aria-hidden="true" /> 거래 32회
              </span>
            </div>
          </div>
          <div className="hidden rounded-2xl border border-emerald-100 bg-white/60 p-4 text-sm text-stone-500 sm:block">
            다음 추천은 새 매물이 올라오면 바로 알려드려요
          </div>
          <div className="mt-auto flex flex-col gap-1 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono tabular-nums">3초 매칭 · 매칭률 94%</span>
            <span>판매자 인증 완료</span>
          </div>
        </div>

        {/* clipped layer: manual search */}
        <div
          className={`absolute inset-0 z-10 flex flex-col gap-2 bg-stone-50 p-4 sm:p-6 ${
            isDragging ? "" : "transition-[clip-path] duration-150 ease-out motion-reduce:transition-none"
          }`}
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
            <Search className="h-4 w-4" aria-hidden="true" /> 직접 검색 중… &quot;빈티지 데님 재킷&quot;
          </div>
          <div className="flex-1 space-y-1.5 overflow-hidden">
            {MANUAL_LISTINGS.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-stone-700">{item.title}</p>
                  <p className="tabular-nums text-stone-500">{item.price}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 font-medium whitespace-nowrap ${TONE_CLASSES[item.tone]}`}
                >
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex flex-col gap-1 rounded-xl bg-stone-800 px-4 py-3 text-sm font-medium text-white sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono tabular-nums">3시간 12분 경과 · 47개 확인</span>
            <span>마음에 드는 것 0개</span>
          </div>
        </div>

        {/* divider + handle */}
        <div
          className={`pointer-events-none absolute inset-y-0 z-20 w-px bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.12)] ${
            isDragging ? "" : "transition-[left] duration-150 ease-out motion-reduce:transition-none"
          }`}
          style={{ left: `${pos}%` }}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="직접 검색과 RE:픽 AI 비교 슬라이더"
            aria-orientation="horizontal"
            aria-valuenow={Math.round(pos)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext={`직접 검색 ${Math.round(pos)}%, RE:픽 AI ${Math.round(100 - pos)}%`}
            onKeyDown={handleKeyDown}
            className={`pointer-events-auto absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border bg-white text-stone-600 shadow-md transition-[transform,box-shadow,border-color] duration-150 ease-out hover:border-emerald-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 motion-reduce:transition-none ${
              isDragging ? "scale-110 border-emerald-400 shadow-lg" : "border-stone-200"
            }`}
          >
            <span aria-hidden="true" className="flex items-center gap-0.5 text-xs">
              ◀▶
            </span>
          </div>
        </div>

        <span className="pointer-events-none absolute top-3 left-3 z-30 rounded-full bg-stone-900/80 px-3 py-1 text-xs font-medium text-white">
          직접 검색
        </span>
        <span className="pointer-events-none absolute top-3 right-3 z-30 rounded-full bg-emerald-700/90 px-3 py-1 text-xs font-medium text-white">
          RE:픽 AI
        </span>

        {/* floating accent card — decorative, hidden from AT (info duplicated in visible copy) */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16, scale: prefersReducedMotion ? 1 : 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: EASE, delay: prefersReducedMotion ? 0 : 0.9 }}
          className="pointer-events-none absolute -bottom-5 -right-4 z-30 hidden h-24 w-24 overflow-hidden rounded-2xl border-4 border-stone-50 shadow-xl sm:block"
        >
          <Image
            src="https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=300&q=80"
            alt=""
            fill
            sizes="96px"
            className="object-cover"
          />
        </motion.div>
      </div>
      <p className="mt-4 text-center text-sm text-stone-500">
        ← 드래그하거나 화살표 키로 비교해보세요 →
      </p>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="px-3 py-4 sm:px-4">
      <p className="font-mono text-base font-bold tabular-nums text-stone-900 sm:text-lg">{value}</p>
      <p className="mt-1 text-xs text-stone-500">{label}</p>
    </div>
  );
}

function MiniCompare({ manual, ai }: { manual: string[]; ai: string[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-amber-700 uppercase">
          직접 검색
        </p>
        <ul className="space-y-2 text-sm text-stone-700">
          {manual.map((line) => (
            <li key={line} className="flex gap-2">
              <X aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <p className="mb-3 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          RE:픽 AI
        </p>
        <ul className="space-y-2 text-sm text-stone-700">
          {ai.map((line) => (
            <li key={line} className="flex gap-2">
              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();

  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: EASE },
    },
  };
  const compareVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 28, scale: prefersReducedMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.8, ease: EASE, delay: prefersReducedMotion ? 0 : 0.3 },
    },
  };
  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE },
    },
  };
  const staggerContainer = (stagger = 0.1): Variants => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  });

  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-900">
      <a
        href="#main-content"
        className={`sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-stone-900 focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-white ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-stone-900">
            <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </span>
          <nav aria-label="주요" className="hidden items-center gap-6 text-sm text-stone-500 sm:flex">
            <span aria-current="page" className="font-semibold text-stone-900">
              기능
            </span>
            <span>요금제</span>
            <span>대시보드</span>
          </nav>
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 active:bg-stone-800 ${focusRing}`}
          >
            무료로 시작하기
          </button>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6 sm:pt-20 sm:pb-24">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={heroItem} className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
              Features
            </motion.p>
            <motion.h1
              variants={heroItem}
              id="hero-heading"
              className="mt-3 text-balance text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.08] tracking-[-0.01em] text-stone-900"
            >
              왼쪽은 3시간, 오른쪽은 3초
            </motion.h1>
            <motion.p variants={heroItem} className="mt-5 text-balance text-base leading-relaxed tracking-[-0.01em] text-stone-600 sm:text-lg">
              같은 빈티지 데님 재킷을 찾는 두 가지 방법. 슬라이더를 움직여서 &quot;직접 검색&quot;과
              &quot;RE:픽 AI&quot;의 차이를 직접 확인해보세요.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative mx-auto mt-12 max-w-4xl"
            variants={compareVariant}
            initial="hidden"
            animate="show"
          >
            <SplitCompare prefersReducedMotion={prefersReducedMotion} />
            <motion.div
              className="mx-auto mt-6 grid max-w-3xl grid-cols-3 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white text-center"
              variants={staggerContainer(0.08)}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <StatCell value="3시간→3초" label="평균 매칭 시간" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <StatCell value="47개→1개" label="직접 확인해야 할 매물" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <StatCell value="0%→94%" label="마음에 드는 매물 발견율" />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature sections */}
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          const imageFirst = i % 2 === 1;
          return (
            <section
              key={f.n}
              aria-labelledby={`feature-${f.n}-heading`}
              className={i % 2 === 1 ? "border-t border-stone-200 bg-white" : "border-t border-stone-200 bg-stone-50"}
            >
              <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
                <motion.div
                  className="mx-auto max-w-2xl text-center"
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                >
                  <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-orange-700">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {f.n} · {f.lead}
                  </p>
                  <h2
                    id={`feature-${f.n}-heading`}
                    className="mt-3 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] tracking-[-0.01em] text-stone-900"
                  >
                    {f.title}
                  </h2>
                  <p className="mt-3 text-balance text-base leading-relaxed tracking-[-0.01em] text-stone-600">{f.desc}</p>
                </motion.div>

                <motion.div
                  className="mx-auto mt-12 grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10"
                  variants={staggerContainer(0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                >
                  {imageFirst ? (
                    <>
                      <motion.div variants={fadeUp} className="lg:order-1">
                        <FeatureImage {...f.image} />
                      </motion.div>
                      <motion.div variants={fadeUp} className="lg:order-2 lg:col-span-1">
                        <MiniCompare manual={f.manual} ai={f.ai} />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={fadeUp} className="lg:order-1">
                        <MiniCompare manual={f.manual} ai={f.ai} />
                      </motion.div>
                      <motion.div variants={fadeUp} className="lg:order-2">
                        <FeatureImage {...f.image} />
                      </motion.div>
                    </>
                  )}
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* Final CTA */}
        <section aria-labelledby="cta-heading" className="mx-4 my-16 sm:mx-6 lg:mx-8">
          <div className="relative isolate overflow-hidden rounded-[2rem]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80"
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/80" />
            </div>
            <motion.div
              className="relative mx-auto max-w-2xl px-6 py-20 text-center sm:py-28"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <h2
                id="cta-heading"
                className="text-balance text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.15] tracking-[-0.01em] text-stone-50"
              >
                슬라이더는 이미 오른쪽을 가리키고 있어요
              </h2>
              <p className="mt-4 text-balance text-base leading-relaxed tracking-[-0.01em] text-stone-300 sm:text-lg">
                직접 뒤지는 3시간 대신, RE:픽 AI가 골라준 3초를 선택하세요.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <motion.button
                  type="button"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-emerald-400 active:bg-emerald-600 sm:w-auto ${focusRingOnDark}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 w-full items-center justify-center rounded-full border border-stone-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 sm:w-auto ${focusRingOnDark}`}
                >
                  요금제 보기
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-stone-500 sm:flex-row sm:px-6">
          <span className="inline-flex items-center gap-1.5 text-base font-bold tracking-tight text-stone-900">
            <span className="rounded-md bg-orange-700 px-1.5 py-0.5 text-xs font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </span>
          <span>© 2026 RE:픽</span>
          <span>AI가 고른 중고, 사람이 확인한 신뢰</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5 lg:aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 288px, 100vw"
        className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
      />
    </div>
  );
}
