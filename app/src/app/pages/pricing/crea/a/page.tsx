"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Building2,
  Check,
  Minus,
  Receipt,
  Sparkles,
  TrendingDown,
  Zap,
  type LucideIcon,
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: "-100px" } as const;

const MISSED_RATE = 0.12; // 실시간 알림 없이 평균적으로 놓치는 특가 비율
const RECOVER_RATE = 0.8; // Pro 알림·가격추적으로 회수 가능한 비율
const PRO_PRICE = 9900;

const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
];

function won(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}₩${Math.abs(Math.round(amount)).toLocaleString("ko-KR")}`;
}

function FeatureValue({ value }: { value: string }) {
  if (value === "✓") {
    return (
      <>
        <Check className="h-4 w-4 text-orange-700" aria-hidden="true" />
        <span className="sr-only">포함</span>
      </>
    );
  }
  if (value === "—") {
    return (
      <>
        <Minus className="h-4 w-4 text-stone-300" aria-hidden="true" />
        <span className="sr-only">미포함</span>
      </>
    );
  }
  return <>{value}</>;
}

type Tier = {
  name: string;
  price: string;
  unit?: string;
  badge?: string;
  desc: string;
  features: string[];
  cta: string;
  href: string;
  icon: LucideIcon;
  highlighted?: boolean;
};

type FeatureRow = {
  label: string;
  free: string;
  pro: string;
  business: string;
};

const featureRows: FeatureRow[] = [
  { label: "AI 큐레이션", free: "✓", pro: "✓", business: "✓" },
  { label: "추천 주기", free: "주간", pro: "실시간", business: "실시간" },
  { label: "매칭 알림", free: "—", pro: "무제한", business: "무제한" },
  { label: "가격 하락 추적", free: "—", pro: "✓", business: "✓" },
  { label: "팀 시트", free: "—", pro: "—", business: "✓" },
  { label: "셀러 대시보드", free: "—", pro: "—", business: "✓" },
  { label: "API 접근", free: "—", pro: "—", business: "✓" },
];

const faqs = [
  {
    q: "Pro는 언제든 해지할 수 있나요?",
    a: "네. 별도 약정 없이 언제든 해지할 수 있고, 해지하면 다음 결제일부터 요금이 청구되지 않아요.",
  },
  {
    q: "위 계산기의 절약액은 어떻게 계산되나요?",
    a: `최근 이용 데이터를 기준으로, 실시간 알림이 없을 때 평균적으로 놓치는 특가 비율(약 ${Math.round(
      MISSED_RATE * 100,
    )}%)과 Pro의 알림·가격 추적으로 회수 가능한 비율(약 ${Math.round(
      RECOVER_RATE * 100,
    )}%)을 곱해 추정해요. 실제 절약액은 카테고리와 쇼핑 패턴에 따라 달라질 수 있어요.`,
  },
  {
    q: "Business 플랜은 어떻게 시작하나요?",
    a: "아래 문의하기 버튼으로 팀 규모와 필요한 기능을 알려주시면, 담당 매니저가 24시간 내로 맞춤 견적을 안내해드려요.",
  },
];

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();
  const [shops, setShops] = useState(5);
  const [avgSpend, setAvgSpend] = useState(50000);

  const totalSpend = shops * avgSpend;
  const missed = totalSpend * MISSED_RATE;
  const recovered = missed * RECOVER_RATE;
  const netSaving = recovered - PRO_PRICE;
  const recommendPro = netSaving > 0;

  const tiers: Tier[] = [
    {
      name: "Free",
      price: "₩0",
      unit: "/월",
      desc: "지금 바로 시작하는 기본 큐레이션",
      features: ["기본 AI 큐레이션", "주간 추천 리스트", "찜 목록 저장"],
      cta: "무료로 시작하기",
      href: "/signup?plan=free",
      icon: Sparkles,
      highlighted: !recommendPro,
    },
    {
      name: "Pro",
      price: won(PRO_PRICE),
      unit: "/월",
      badge: "가장 인기",
      desc: "놓치는 특가 없이, 매달 이득 보는 플랜",
      features: [
        "무제한 AI 매칭",
        "실시간 가격 알림",
        "가격 하락 추적",
        "우선 매칭 큐",
      ],
      cta: "Pro 시작하기",
      href: "/signup?plan=pro",
      icon: Zap,
      highlighted: recommendPro,
    },
    {
      name: "Business",
      price: "문의",
      desc: "재고 순환과 판매를 위한 팀용 플랜",
      features: ["팀 시트", "셀러 대시보드", "API 연동", "전담 매니저"],
      cta: "영업팀에 문의하기",
      href: "mailto:business@repick.co.kr",
      icon: Building2,
    },
  ];

  // 진입 모션 (히어로)
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE },
    },
  };
  const bannerVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.97 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.8, ease: EASE, delay: prefersReducedMotion ? 0 : 0.2 },
    },
  };
  const badgeVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 14, scale: prefersReducedMotion ? 1 : 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: EASE, delay: prefersReducedMotion ? 0 : 0.6 },
    },
  };
  const thumbVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE, delay: prefersReducedMotion ? 0 : 0.5 },
    },
  };

  // 스크롤 리빌 (공용)
  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 26 },
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

  // 호버 마이크로인터랙션 (reduced-motion 가드)
  const hoverLiftCard = prefersReducedMotion ? undefined : { y: -6 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <a
        href="#calculator"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      {/* 헤더 */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a
            href="#calculator"
            aria-label="RE:픽 홈"
            className={`inline-flex items-center gap-1.5 rounded-md text-2xl font-bold tracking-tight text-stone-900 ${focusRing}`}
          >
            <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </a>
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-8 text-sm text-stone-600 sm:flex"
          >
            <a href="#calculator" className={`rounded-md outline-none hover:text-stone-900 ${focusRing}`}>
              계산기
            </a>
            <span className="font-medium text-stone-900" aria-current="page">
              요금제
            </span>
            <a href="#faq" className={`rounded-md outline-none hover:text-stone-900 ${focusRing}`}>
              FAQ
            </a>
          </nav>
          <a
            href="/signup?plan=free"
            className={`inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 active:bg-stone-950 ${focusRing}`}
          >
            무료로 시작
          </a>
        </div>
      </header>

      {/* 히어로 + 계산기 */}
      <section id="calculator" className="scroll-mt-16 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="max-w-2xl"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={heroItem}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-orange-700"
            >
              RE:픽 요금제
            </motion.p>
            <motion.h1
              variants={heroItem}
              className="mt-3 text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-sans leading-[1.08] tracking-[-0.01em] text-stone-900"
            >
              얼마를 아낄 수 있을지, 먼저 계산해보세요
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-4 max-w-xl text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-600"
            >
              매달 중고 쇼핑 습관을 입력하면, Pro가 진짜 이득인지 영수증으로
              바로 보여드려요. 구독료보다 덜 아끼면 저희가 먼저
              말씀드립니다.
            </motion.p>
          </motion.div>

          {/* 히어로 배너 이미지 */}
          <motion.div
            variants={bannerVariant}
            initial="hidden"
            animate="show"
            className="relative mt-10 aspect-[16/7] w-full overflow-hidden rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-900/10 sm:aspect-[21/8]"
          >
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
              alt="파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙"
              fill
              sizes="(min-width: 1024px) 1152px, 100vw"
              preload
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />

            <motion.div
              variants={badgeVariant}
              initial="hidden"
              animate="show"
              className="absolute bottom-4 left-4 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                <TrendingDown className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold tabular-nums text-stone-900">
                  평균 절약 ₩84,000/월
                </span>
                <span className="text-stone-500">Pro 사용자 기준</span>
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            variants={thumbVariant}
            initial="hidden"
            animate="show"
            className="relative -mt-14 mb-10 ml-auto hidden h-52 w-40 overflow-hidden rounded-2xl border-4 border-stone-50 shadow-xl sm:block sm:mr-8"
          >
            <Image
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80"
              alt="실크 블라우스를 입은 인물의 패션 컷"
              width={160}
              height={208}
              className="h-full w-full object-cover"
            />
          </motion.div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
            {/* 입력 컨트롤 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
            >
              <h2 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <Receipt className="h-5 w-5 text-orange-700" aria-hidden="true" />
                나의 중고 쇼핑 습관
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                슬라이더를 움직이면 오른쪽 영수증이 바로 계산돼요.
              </p>

              <div className="mt-8 space-y-9">
                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="shops" className="text-sm font-medium text-stone-700">
                      한 달 중고 구매 횟수
                    </label>
                    <span className="font-mono text-sm tabular-nums text-orange-700">
                      {shops}회
                    </span>
                  </div>
                  <input
                    id="shops"
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={shops}
                    onChange={(e) => setShops(Number(e.target.value))}
                    className={`mt-3 w-full accent-orange-700 outline-none ${focusRing}`}
                    aria-describedby="shops-hint"
                  />
                  <p id="shops-hint" className="mt-1 text-xs text-stone-500">
                    1회 ~ 20회
                  </p>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <label htmlFor="avg-spend" className="text-sm font-medium text-stone-700">
                      건당 평균 지출
                    </label>
                    <span className="font-mono text-sm tabular-nums text-orange-700">
                      {won(avgSpend)}
                    </span>
                  </div>
                  <input
                    id="avg-spend"
                    type="range"
                    min={10000}
                    max={300000}
                    step={5000}
                    value={avgSpend}
                    onChange={(e) => setAvgSpend(Number(e.target.value))}
                    className={`mt-3 w-full accent-orange-700 outline-none ${focusRing}`}
                    aria-describedby="spend-hint"
                  />
                  <p id="spend-hint" className="mt-1 text-xs text-stone-500">
                    ₩10,000 ~ ₩300,000
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 영수증 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="sr-only">예상 절약 영수증</h2>
              <div className="flex items-center justify-between border-b border-dashed border-stone-300 pb-3">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs tracking-widest text-stone-500">
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                  RECEIPT · RE:픽
                </span>
                <span className="font-mono text-xs text-stone-500">이번 달 예상</span>
              </div>

              <dl className="mt-4 space-y-3 font-mono text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-600">예상 중고 지출 총액</dt>
                  <dd className="tabular-nums text-stone-900">{won(totalSpend)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-rose-600">
                  <dt>알림 없이 놓치는 금액</dt>
                  <dd className="tabular-nums">{won(-missed)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-orange-700">
                  <dt>Pro 알림으로 회수 가능</dt>
                  <dd className="tabular-nums">{won(recovered)}</dd>
                </div>
                <div className="flex justify-between gap-4 text-stone-500">
                  <dt>Pro 구독료</dt>
                  <dd className="tabular-nums">{won(-PRO_PRICE)}</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between border-t-2 border-stone-900 pt-4">
                <span className="text-sm font-semibold text-stone-900">
                  이번 달 예상 순절약액
                </span>
                <motion.span
                  key={netSaving}
                  initial={prefersReducedMotion ? false : { scale: 0.92, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: EASE }}
                  aria-live="polite"
                  className={`font-mono text-2xl font-bold tabular-nums ${
                    recommendPro ? "text-orange-600" : "text-stone-500"
                  }`}
                >
                  {won(netSaving)}
                </motion.span>
              </div>

              <p className="mt-3 text-sm text-stone-500" aria-live="polite">
                {recommendPro
                  ? `Pro가 이득이에요. 구독료를 내고도 매달 ${won(
                      netSaving,
                    )}만큼 더 아낄 수 있어요.`
                  : "지금 습관이라면 Free로도 충분해요. 쇼핑이 늘어나면 다시 계산해보세요."}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 플랜 카드 */}
      <section className="border-t border-stone-200 bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <div
              aria-hidden="true"
              className="mb-4 flex items-center gap-2"
            >
              <span className="flex -space-x-3">
                {TRUST_AVATARS.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                    style={{ zIndex: TRUST_AVATARS.length - i }}
                  />
                ))}
              </span>
              <span className="text-sm font-medium text-stone-600">
                127,000+ 명이 RE:픽과 함께 아끼고 있어요
              </span>
            </div>
            <h2 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-sans font-bold leading-[1.15] tracking-[-0.01em] text-stone-900">
              플랜 선택
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              위 계산기 결과에 맞춰{" "}
              <span
                className={
                  recommendPro
                    ? "font-semibold text-orange-700"
                    : "font-semibold text-stone-700"
                }
              >
                {recommendPro ? "Pro" : "Free"}
              </span>{" "}
              플랜을 표시해 드렸어요.
            </p>
          </motion.div>

          <motion.ul
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {tiers.map((tier) => (
              <motion.li
                key={tier.name}
                variants={fadeUp}
                whileHover={hoverLiftCard}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className={`relative flex flex-col rounded-2xl border p-6 transition-colors duration-300 sm:p-8 ${
                  tier.highlighted
                    ? "border-orange-600 ring-2 ring-orange-600"
                    : "border-stone-200"
                }`}
              >
                {tier.badge && (
                  <span className="absolute -top-3 left-6 rounded-full bg-orange-700 px-3 py-1 text-xs font-semibold text-white">
                    {tier.badge}
                  </span>
                )}
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                  <tier.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{tier.name}</h3>
                <p className="mt-1 text-sm text-stone-500">{tier.desc}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold tabular-nums text-stone-900">
                    {tier.price}
                  </span>
                  {tier.unit && <span className="text-sm text-stone-500">{tier.unit}</span>}
                </div>

                {tier.name === "Pro" && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      recommendPro ? "text-orange-700" : "text-stone-500"
                    }`}
                  >
                    {recommendPro
                      ? `이번 달 예상 절약액 ${won(netSaving)}`
                      : "구매 습관이 늘면 절약액도 커져요"}
                  </p>
                )}

                <ul className="mt-6 flex-1 space-y-2 text-sm text-stone-600">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <motion.a
                  href={tier.href}
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${focusRing} ${
                    tier.highlighted
                      ? "bg-orange-700 text-white hover:bg-orange-800"
                      : "border border-stone-400 text-stone-700 hover:bg-stone-50 active:bg-stone-100"
                  }`}
                >
                  {tier.cta}
                </motion.a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* 기능 비교 표 */}
      <section className="border-t border-stone-200 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-sans font-bold leading-[1.15] tracking-[-0.01em] text-stone-900"
          >
            플랜별 기능 비교
          </motion.h2>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-6 overflow-x-auto rounded-2xl border border-stone-200"
          >
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-stone-50 text-left text-stone-500">
                  <th scope="col" className="px-4 py-3 font-medium">
                    기능
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Free
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Pro
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Business
                  </th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 1 ? "bg-stone-50/60" : undefined}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-stone-800">
                      {row.label}
                    </th>
                    <td className="px-4 py-3 text-stone-600">
                      <FeatureValue value={row.free} />
                    </td>
                    <td className="px-4 py-3 font-medium text-orange-700">
                      <FeatureValue value={row.pro} />
                    </td>
                    <td className="px-4 py-3 text-stone-600">
                      <FeatureValue value={row.business} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="scroll-mt-16 border-t border-stone-200 bg-white px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
      >
        <div className="mx-auto max-w-3xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-sans font-bold leading-[1.15] tracking-[-0.01em] text-stone-900"
          >
            자주 묻는 질문
          </motion.h2>
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-6 divide-y divide-stone-100 rounded-2xl border border-stone-200"
          >
            {faqs.map((item) => (
              <motion.details key={item.q} variants={fadeUp} className="group p-5 sm:p-6">
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-sm font-medium text-stone-900 outline-none transition-colors hover:text-orange-700 ${focusRing}`}
                >
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="text-stone-500 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.a}</p>
              </motion.details>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="mx-4 my-14 sm:mx-6 sm:my-20 lg:mx-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] text-center"
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
              alt="다양한 색상의 의류가 걸려 있는 옷걸이 랙"
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-stone-900/75" />
          </div>
          <div className="relative mx-auto max-w-2xl px-6 py-16 sm:py-20">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-orange-300">
              <Bell className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-balance text-[clamp(1.75rem,3.5vw,2.5rem)] font-sans leading-[1.15] tracking-[-0.01em] text-stone-50">
              지금 Free로 시작하고, 필요할 때 Pro로 전환하세요
            </h2>
            <p className="mt-3 text-sm text-stone-300 sm:text-base">
              카드 등록 없이 바로 시작할 수 있어요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.a
                href="/signup?plan=free"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-orange-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 ${focusRingOnDark}`}
              >
                무료로 시작하기
                <ArrowRight
                  className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </motion.a>
              <motion.a
                href="mailto:business@repick.co.kr"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
              >
                영업팀에 문의하기
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <p className="inline-flex items-center gap-1.5 text-xl font-bold tracking-tight text-stone-50">
                <span className="rounded-md bg-orange-700 px-2 py-0.5 text-base font-semibold text-white font-[family-name:var(--font-geist-mono)]">
                  RE:
                </span>
                픽
              </p>
              <p className="text-sm text-stone-400">
                AI가 취향을 학습해 당신에게 맞는 중고만 다시 골라주는 리커머스.
              </p>
            </div>
            <ul className="flex gap-6 text-sm">
              <li>
                <a href="/terms" className={`rounded-md hover:text-stone-50 ${focusRingOnDark}`}>
                  이용약관
                </a>
              </li>
              <li>
                <a href="/privacy" className={`rounded-md hover:text-stone-50 ${focusRingOnDark}`}>
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 border-t border-stone-800 pt-6 text-center text-sm text-stone-500 sm:text-left">
            © 2026 RE:픽. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
