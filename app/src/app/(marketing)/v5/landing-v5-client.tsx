"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, Check, ChevronDown, Menu, Minus, X } from "lucide-react";

const MotionLink = motion.create(Link);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-80px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#how-it-works", label: "작동 방식" },
  { href: "#comparison", label: "비교" },
  { href: "#spotlight", label: "셀렉션" },
  { href: "#proof", label: "후기" },
  { href: "#faq", label: "FAQ" },
];

const STATS = [
  { value: "128,000+", label: "누적 재판매" },
  { value: "94%", label: "평균 매칭 정확도" },
  { value: "4.9 / 5", label: "사용자 만족도" },
];

const STEPS = [
  {
    title: "취향을 학습해요",
    desc: "저장한 상품, 찜한 스타일, 구매 이력을 바탕으로 AI가 당신만의 취향 프로필을 만듭니다.",
  },
  {
    title: "수만 개 중 골라내요",
    desc: "사이즈, 상태, 예산, 브랜드까지 고려해 지금 살 만한 상품만 정확히 추려냅니다.",
  },
  {
    title: "안심하고 받아보세요",
    desc: "전문 검수와 실측 사진으로 확인된 상품만 매칭해서 보여드려요.",
  },
];

const COMPARISON_ROWS = [
  {
    label: "검색 시간",
    direct: "여러 앱을 오가며 수십 개씩 직접 뒤져야 해요",
    repick: "AI가 취향에 맞는 상품만 먼저 추려드려요",
  },
  {
    label: "상태 확인",
    direct: "사진만 보고 판단, 실물은 받아봐야 알아요",
    repick: "전문 검수팀의 실측 사진과 등급을 먼저 확인해요",
  },
  {
    label: "가격 신뢰",
    direct: "판매자마다 부르는 값이 제각각이에요",
    repick: "시세 데이터를 기반으로 투명하게 책정돼요",
  },
  {
    label: "사이즈 매칭",
    direct: "실측 없이 사이즈만 보고 추측해요",
    repick: "내 사이즈 데이터와 자동으로 비교해드려요",
  },
];

const SPEC_ROWS = [
  { label: "AI 매칭", value: "96%" },
  { label: "컨디션 등급", value: "A" },
  { label: "판매자 인증", value: "완료" },
];

const QUOTES = [
  {
    quote: "찜만 누적 300개였는데, RE:픽을 쓰고 나서는 진짜 살 것만 보여요.",
    name: "김도윤",
    role: "프리랜서 디자이너",
  },
  {
    quote: "상태 등급 표기가 정확해서 반품 걱정 없이 구매해요.",
    name: "이서현",
    role: "마케터",
  },
  {
    quote: "빈티지 찾는 시간이 반의 반으로 줄었어요.",
    name: "박지민",
    role: "사진작가",
  },
];

const FAQS = [
  {
    question: "RE:픽은 다른 중고 플랫폼과 뭐가 다른가요?",
    answer:
      "직접 검색하지 않아도 됩니다. AI가 취향, 사이즈, 예산을 학습해 지금 살 만한 상품만 추려서 보여드려요. 스크롤은 줄고, 살 확률은 올라갑니다.",
  },
  {
    question: "가격은 어떻게 책정되나요?",
    answer:
      "시세 데이터와 실측 상태 등급을 기반으로 산정합니다. 원가와 할인율을 매물마다 투명하게 함께 표기해요.",
  },
  {
    question: "상품 상태는 어떻게 확인할 수 있나요?",
    answer:
      "전문 검수팀이 실측 사이즈와 하자 여부를 직접 확인한 뒤, 등급과 실측 사진을 함께 제공합니다.",
  },
  {
    question: "취향 학습은 어떻게 이뤄지나요?",
    answer:
      "찜, 스킵, 구매 이력을 실시간으로 반영해 취향 프로필을 계속 업데이트합니다. 쓸수록 추천이 정확해져요.",
  },
];

const FOOTER_LINKS = [
  { label: "작동 방식", href: "#how-it-works" },
  { label: "셀렉션", href: "#spotlight" },
  { label: "FAQ", href: "#faq" },
  { label: "고객센터", href: "#" },
];

export default function LandingV5Client() {
  const prefersReducedMotion = useReducedMotion();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (mobileNavOpen) {
      closeButtonRef.current?.focus();
    } else {
      menuButtonRef.current?.focus();
    }
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  // Entrance / reveal variants — deliberately small deltas ("미세" motion)
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: EASE },
    },
  };
  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5, ease: EASE },
    },
  };
  const imageReveal: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 1.04 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.9, ease: EASE },
    },
  };
  const staggerContainer = (stagger = 0.08): Variants => ({
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.04,
      },
    },
  });

  const hoverButton = prefersReducedMotion ? undefined : { y: -1 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.98 };
  const hoverRowShift = prefersReducedMotion ? undefined : { x: 4 };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#main-content"
            aria-label="RE:픽 홈"
            className={`inline-flex items-center gap-1.5 rounded-md text-2xl font-bold tracking-tight text-stone-900 ${focusRing}`}
          >
            <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </a>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`group relative rounded-md py-1 text-sm font-semibold tracking-[-0.01em] text-stone-600 transition-colors hover:text-stone-900 ${focusRing}`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-orange-700 transition-transform duration-300 ease-out motion-safe:group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-md border border-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-900 hover:text-stone-50 md:inline-flex ${focusRing}`}
            >
              무료로 시작
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileNavOpen ? "메뉴 닫기" : "메뉴 열기"}
              onClick={() => setMobileNavOpen((prev) => !prev)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-stone-700 transition-colors hover:bg-stone-100 md:hidden ${focusRing}`}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              key="mobile-nav-overlay"
              type="button"
              aria-label="메뉴 닫기"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-40 bg-stone-900/50 md:hidden"
              initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            />
            <motion.div
              key="mobile-nav-drawer"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="주요 메뉴"
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 border-l border-stone-200 bg-stone-50 px-6 py-6 shadow-2xl md:hidden"
              initial={{ x: prefersReducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : "100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-stone-900">메뉴</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="메뉴 닫기"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-stone-700 transition-colors hover:bg-stone-100 ${focusRing}`}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="모바일 주요 메뉴" className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`rounded-md px-2 py-3 text-base font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 ${focusRing}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-md bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRing}`}
              >
                무료로 시작
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content" className="bg-stone-50">
        {/* Hero — typography only, no image */}
        <section aria-labelledby="hero-heading" className="border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-6 pt-20 pb-20 sm:pt-28 sm:pb-28 lg:px-8">
            <motion.div
              className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:gap-x-8"
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              <div className="lg:col-span-9">
                <motion.p
                  variants={heroItem}
                  className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700"
                >
                  AI Recommerce
                </motion.p>
                <motion.h1
                  variants={heroItem}
                  id="hero-heading"
                  className="mt-6 text-balance font-sans text-[clamp(2.75rem,7vw,6rem)] font-bold leading-[1.04] tracking-[-0.02em] text-stone-950"
                >
                  많이 보여주지 않습니다.
                  <br />
                  <span className="text-orange-700">정확히</span> 보여줍니다.
                </motion.h1>
                <motion.p
                  variants={heroItem}
                  className="mt-8 max-w-xl text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-600"
                >
                  수만 개의 매물 대신, 지금 당신에게 맞는 몇 개만. AI가 취향과
                  사이즈, 예산을 학습해 선별합니다.
                </motion.p>
              </div>

              <motion.div
                variants={heroItem}
                className="flex flex-col justify-end gap-4 lg:col-span-3 lg:items-end"
              >
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-col">
                  <MotionLink
                    href="/dashboard"
                    whileHover={hoverButton}
                    whileTap={tapButton}
                    className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRing}`}
                  >
                    무료로 시작하기
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </MotionLink>
                  <a
                    href="#how-it-works"
                    className={`inline-flex min-h-11 items-center justify-center rounded-md border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-white ${focusRing}`}
                  >
                    작동 방식 보기
                  </a>
                </div>
              </motion.div>
            </motion.div>

            <motion.dl
              className="mt-20 grid grid-cols-1 divide-y divide-stone-200 border-y border-stone-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp} className="py-6 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-sans text-3xl font-bold tabular-nums tracking-[-0.02em] text-stone-950 sm:text-4xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>
          </div>
        </section>

        {/* Fig 01 — single editorial image band */}
        <figure className="border-b border-stone-200">
          <motion.div
            className="relative aspect-[16/7] w-full overflow-hidden sm:aspect-[21/8]"
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <Image
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=2000&q=80"
              alt="옷걸이에 걸린 다양한 색상의 의류가 줄지어 있는 모습"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <figcaption className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Fig 01 — 지금 AI가 선별 중인 셀렉션
            </span>
          </figcaption>
        </figure>

        {/* How it works — numbered typographic index */}
        <section
          id="how-it-works"
          aria-labelledby="how-heading"
          className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        >
          <motion.div
            className="max-w-2xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
              How it works
            </p>
            <h2
              id="how-heading"
              className="mt-3 text-balance font-sans text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-950"
            >
              세 단계, 그 이상은 없습니다
            </h2>
          </motion.div>

          <motion.ol
            className="mt-14 border-t border-stone-200"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                whileHover={hoverRowShift}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="group grid grid-cols-12 items-start gap-x-6 gap-y-3 border-b border-stone-200 py-10"
              >
                <span
                  aria-hidden="true"
                  className="col-span-4 font-sans text-5xl font-bold tabular-nums text-stone-200 transition-colors duration-300 group-hover:text-orange-700/25 sm:col-span-2 sm:text-6xl"
                >
                  0{index + 1}
                </span>
                <h3 className="col-span-8 text-xl font-semibold tracking-[-0.01em] text-stone-950 sm:col-span-4">
                  {step.title}
                </h3>
                <p className="col-span-12 text-stone-600 leading-relaxed sm:col-span-6">
                  {step.desc}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* Comparison */}
        <section
          id="comparison"
          aria-labelledby="comparison-heading"
          className="border-t border-stone-200 bg-white"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
                직접 사기 vs RE:픽
              </p>
              <h2
                id="comparison-heading"
                className="mt-3 text-balance font-sans text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-950"
              >
                같은 중고, 다른 경험
              </h2>
            </motion.div>

            <motion.div
              className="mt-14 overflow-x-auto"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <table className="w-full min-w-[640px] border-collapse text-left">
                <caption className="sr-only">중고 직접 구매와 RE:픽 이용 비교</caption>
                <thead>
                  <tr className="border-b border-stone-200">
                    <th scope="col" className="w-1/4 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      비교 항목
                    </th>
                    <th scope="col" className="py-4 pr-8 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      직접 사기
                    </th>
                    <th
                      scope="col"
                      className="border-l-2 border-orange-700 py-4 pl-6 text-xs font-semibold uppercase tracking-[0.16em] text-orange-700"
                    >
                      RE:픽으로 사기
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.label}>
                      <th scope="row" className="py-6 pr-4 align-top text-sm font-semibold text-stone-950">
                        {row.label}
                      </th>
                      <td className="py-6 pr-8 align-top text-sm text-stone-600">
                        <span className="flex items-start gap-2">
                          <Minus className="mt-0.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />
                          {row.direct}
                        </span>
                      </td>
                      <td className="border-l-2 border-orange-700/20 py-6 pl-6 align-top text-sm text-stone-800">
                        <span className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-700" aria-hidden="true" />
                          {row.repick}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>

        {/* Spotlight — single signature product, image + spec sheet */}
        <section
          id="spotlight"
          aria-labelledby="spotlight-heading"
          className="border-t border-stone-200"
        >
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
                Signature Pick
              </p>
              <h2
                id="spotlight-heading"
                className="mt-3 text-balance font-sans text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-950"
              >
                AI가 이렇게 골랐어요
              </h2>
            </motion.div>

            <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-x-12">
              <motion.figure
                className="lg:col-span-6"
                variants={imageReveal}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
                  <Image
                    src="https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=80"
                    alt="화이트 톤의 클래식 스니커즈 한 켤레"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                  Fig 02 — 클래식 스니커즈, Runway Archive
                </figcaption>
              </motion.figure>

              <motion.div
                className="flex flex-col justify-center lg:col-span-5 lg:col-start-8"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <h3 className="text-2xl font-semibold tracking-[-0.01em] text-stone-950">
                  클래식 스니커즈
                </h3>
                <p className="mt-1 text-sm text-stone-500">Runway Archive</p>

                <div className="mt-6 flex items-baseline gap-3 tabular-nums">
                  <span className="font-sans text-3xl font-bold tracking-[-0.02em] text-stone-950">
                    54,000원
                  </span>
                  <span className="text-base text-stone-400 line-through">98,000원</span>
                  <span className="text-base font-semibold text-orange-700">-45%</span>
                </div>

                <dl className="mt-8 divide-y divide-stone-200 border-y border-stone-200">
                  {SPEC_ROWS.map((spec) => (
                    <div key={spec.label} className="flex items-center justify-between py-3">
                      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-semibold tabular-nums text-stone-950">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group mt-8 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-md bg-stone-950 px-6 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRing}`}
                >
                  지금 확인하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Proof — pull quote + short quotes, no avatar imagery */}
        <section id="proof" aria-labelledby="proof-heading" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <h2 id="proof-heading" className="sr-only">
              고객 후기
            </h2>
            <motion.blockquote
              className="max-w-3xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-balance font-sans text-3xl font-semibold leading-[1.2] tracking-[-0.01em] text-stone-950 sm:text-4xl lg:text-5xl">
                &ldquo;찜만 누적 300개였는데, RE:픽을 쓰고 나서는 진짜 살 것만 보여요.&rdquo;
              </p>
              <footer className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-stone-500">
                김도윤 · 프리랜서 디자이너
              </footer>
            </motion.blockquote>

            <motion.ul
              className="mt-16 border-t border-stone-200"
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {QUOTES.slice(1).map((t) => (
                <motion.li
                  key={t.name}
                  variants={fadeUp}
                  className="grid grid-cols-1 gap-2 border-b border-stone-200 py-8 sm:grid-cols-12 sm:items-center sm:gap-6"
                >
                  <p className="text-lg leading-relaxed tracking-[-0.01em] text-stone-800 sm:col-span-9">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500 sm:col-span-3 sm:text-right">
                    {t.name} · {t.role}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="border-t border-stone-200">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">FAQ</p>
              <h2
                id="faq-heading"
                className="mt-3 text-balance font-sans text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-950"
              >
                궁금한 점, 먼저 답해드릴게요
              </h2>
            </motion.div>

            <motion.div
              className="mt-14 divide-y divide-stone-200 border-y border-stone-200"
              variants={staggerContainer(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {FAQS.map((item) => (
                <motion.div key={item.question} variants={fadeUp}>
                  <details className="group py-2">
                    <summary
                      className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-md py-3 text-left text-base font-semibold tracking-[-0.01em] text-stone-950 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                    >
                      {item.question}
                      <ChevronDown
                        className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 motion-safe:group-open:rotate-180"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="pb-5 text-base leading-relaxed text-stone-600">{item.answer}</p>
                  </details>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA — dark, typography-only contrast band */}
        <section aria-labelledby="cta-heading" className="border-t border-stone-200 bg-stone-950">
          <motion.div
            className="mx-auto max-w-7xl px-6 py-24 text-center sm:py-32 lg:px-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
              Start now
            </p>
            <h2
              id="cta-heading"
              className="mx-auto mt-4 max-w-3xl text-balance font-sans text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-50"
            >
              지금, 당신의 안목을 등록하세요
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed tracking-[-0.01em] text-stone-400">
              가입은 1분이면 충분해요. 언제든 해지할 수 있어요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MotionLink
                href="/dashboard"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-white ${focusRingOnDark}`}
              >
                무료로 시작하기
                <ArrowRight
                  className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MotionLink>
              <a
                href="#how-it-works"
                className={`inline-flex min-h-11 items-center justify-center rounded-md border border-stone-600 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-900 ${focusRingOnDark}`}
              >
                작동 방식 다시 보기
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-stone-800 bg-stone-950 text-stone-400">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-stone-50">
                <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
                  RE:
                </span>
                픽
              </p>
              <p className="mt-3 max-w-xs text-sm text-stone-400">
                AI가 취향을 학습해 당신에게 맞는 중고만 다시 골라주는 리커머스.
              </p>
            </div>

            <nav aria-label="바로가기">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                바로가기
              </h3>
              <ul className="mt-4 space-y-3">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`rounded-md text-sm text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-sm text-stone-400 sm:flex-row">
            <p>© 2026 RE:픽. All rights reserved.</p>
            <ul className="flex gap-6">
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}
