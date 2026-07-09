"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
  Heart,
  Quote,
  Menu,
  X,
  Check,
  ChevronDown,
} from "lucide-react";

const MotionLink = motion.create(Link);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-100 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#product", label: "AI 매칭" },
  { href: "#how", label: "작동 방식" },
  { href: "#showcase", label: "쇼케이스" },
  { href: "#proof", label: "후기" },
  { href: "#faq", label: "FAQ" },
];

const TRUST_LOGOS = ["요즘IT", "아웃스탠딩", "커리어리", "월간 디자인", "리멤버"];

const STEPS = [
  {
    icon: Sparkles,
    title: "취향을 학습해요",
    desc: "저장한 상품, 찜한 스타일, 구매 이력을 바탕으로 AI가 당신만의 취향 프로필을 만듭니다.",
  },
  {
    icon: SlidersHorizontal,
    title: "수만 개 중 골라내요",
    desc: "사이즈, 상태, 예산, 브랜드까지 고려해 지금 살 만한 상품만 정확히 추려냅니다.",
  },
  {
    icon: ShieldCheck,
    title: "안심하고 받아보세요",
    desc: "전문 검수와 실측 사진으로 확인된 상품만 매칭해서 보여드려요.",
  },
];

const PRODUCTS = [
  {
    title: "빈티지 울 코트",
    brand: "Aureum Vintage",
    price: "89,000원",
    original: "148,000원",
    discount: 40,
    match: 96,
    condition: "S",
    reason: "찜한 스타일과 일치",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80",
    alt: "옷걸이에 가지런히 걸린 코트들",
  },
  {
    title: "레더 크로스백",
    brand: "Atelier Noir",
    price: "62,000원",
    original: "120,000원",
    discount: 48,
    match: 91,
    condition: "A",
    reason: "예산 범위 안",
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
  },
  {
    title: "클래식 스니커즈",
    brand: "Runway Archive",
    price: "54,000원",
    original: "98,000원",
    discount: 45,
    match: 88,
    condition: "A",
    reason: "사이즈 데이터 일치",
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "화이트 톤의 클래식 스니커즈 한 켤레",
  },
  {
    title: "실크 블라우스",
    brand: "Maison Blanche",
    price: "47,000원",
    original: "89,000원",
    discount: 47,
    match: 93,
    condition: "S",
    reason: "인기 급상승 중",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    alt: "실크 블라우스를 입은 인물의 패션 컷",
  },
];

const STATS = [
  { label: "누적 재판매", value: "128,000+" },
  { label: "평균 매칭 정확도", value: "94%" },
  { label: "사용자 만족도", value: "4.9 / 5" },
];

const TESTIMONIALS = [
  {
    quote: "찜만 누적 300개였는데, RE:픽을 쓰고 나서는 진짜 살 것만 보여요.",
    name: "김도윤",
    role: "프리랜서 디자이너",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "상태 등급 표기가 정확해서 반품 걱정 없이 구매해요.",
    name: "이서현",
    role: "마케터",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "빈티지 찾는 시간이 반의 반으로 줄었어요.",
    name: "박지민",
    role: "사진작가",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
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
      "전문 검수팀이 실측 사이즈와 하자 여부를 직접 확인한 뒤, 등급과 실측 사진을 함께 제공합니다. 실물을 보지 않아도 상태를 가늠할 수 있어요.",
  },
  {
    question: "취향 학습은 어떻게 이뤄지나요?",
    answer:
      "찜, 스킵, 구매 이력을 실시간으로 반영해 취향 프로필을 계속 업데이트합니다. 쓸수록 추천이 정확해져요.",
  },
  {
    question: "반품이나 환불도 가능한가요?",
    answer:
      "상품 설명과 실물 상태가 다르면 반품 및 환불을 지원합니다. 자세한 절차는 마이페이지 고객센터에서 바로 안내받을 수 있어요.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "제품",
    links: [
      { label: "AI 매칭", href: "#product" },
      { label: "작동 방식", href: "#how" },
      { label: "쇼케이스", href: "#showcase" },
      { label: "앱 다운로드", href: "#" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "채용", href: "#" },
      { label: "뉴스룸", href: "#" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "고객센터", href: "#" },
      { label: "FAQ", href: "#faq" },
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#" },
    ],
  },
];

// Bento tile base styles — every card on the page lives on this shared grammar.
const tileBase =
  "group relative flex flex-col overflow-hidden rounded-[28px] border shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300";
const tileLight = `${tileBase} border-stone-200/70 bg-white hover:shadow-lg hover:shadow-stone-900/5`;
const tileDark = `${tileBase} border-stone-800 bg-stone-900 text-stone-50 hover:shadow-lg hover:shadow-stone-900/20`;
const tileAccent = `${tileBase} border-orange-700 bg-orange-700 text-white hover:shadow-lg hover:shadow-orange-900/20`;

function handleSpotlight(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

function Spotlight({ tone = "light" }: { tone?: "light" | "dark" }) {
  const glow =
    tone === "dark"
      ? "rgba(255,255,255,0.10)"
      : "rgba(194,65,12,0.12)";
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(480px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 70%)`,
      }}
    />
  );
}

export default function LandingV2Client() {
  const prefersReducedMotion = useReducedMotion();
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Mobile navigation drawer
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

  // Entrance stagger (hero, above the fold)
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.05,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 22, scale: prefersReducedMotion ? 1 : 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE },
    },
  };

  // Scroll reveal (generic)
  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: EASE },
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

  const hoverLift = prefersReducedMotion ? undefined : { y: -6 };
  const hoverLiftSmall = prefersReducedMotion ? undefined : { y: -3 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };
  const springTransition = { type: "spring" as const, stiffness: 300, damping: 24 };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-100/85 backdrop-blur">
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
                className={`rounded-md text-sm font-semibold text-stone-600 transition-colors hover:text-stone-900 ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition motion-safe:hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0 active:bg-stone-950 md:inline-flex ${focusRing}`}
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
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-200 md:hidden ${focusRing}`}
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
              transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-stone-900">메뉴</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="메뉴 닫기"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 ${focusRing}`}
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
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
              >
                무료로 시작
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content" className="bg-stone-100">
        {/* Hero — the bento grid begins immediately */}
        <section aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-6 pt-10 pb-6 lg:px-8 lg:pt-14">
          <motion.p
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-stone-600 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
            AI 취향 매칭 리커머스
          </motion.p>

          <motion.div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[240px] lg:[grid-auto-flow:dense]"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            {/* Headline tile */}
            <motion.div
              variants={heroItem}
              onPointerMove={handleSpotlight}
              className={`${tileDark} justify-center px-8 py-10 sm:col-span-2 lg:col-span-2 lg:row-span-2`}
            >
              <Spotlight tone="dark" />
              <h1
                id="hero-heading"
                className="relative text-balance text-[clamp(2.1rem,4.4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-stone-50"
              >
                당신의 취향을,
                <br />
                AI가{" "}
                <em className="not-italic font-bold text-orange-400">다시</em>{" "}
                골라드립니다
              </h1>
              <p className="relative mt-5 max-w-md text-balance text-base leading-relaxed tracking-[-0.01em] text-stone-300">
                수만 개 매물 속에서 스타일, 사이즈, 예산을 학습한 AI가 지금
                당신에게 맞는 것만 선별합니다.
              </p>
              <div className="relative mt-7 flex flex-wrap items-center gap-3">
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  무료로 시작
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <a
                  href="#product"
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-600 px-6 py-3 text-sm font-semibold text-stone-100 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  AI 매칭 보기
                </a>
              </div>
            </motion.div>

            {/* Big hero image tile */}
            <motion.div
              variants={heroItem}
              onPointerMove={handleSpotlight}
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-stone-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-lg hover:shadow-stone-900/10 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
                alt="니트 코트를 입은 모델이 카메라를 정면으로 바라보는 패션 인물 사진"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                preload
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
              />
              <Spotlight />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="relative mt-auto flex items-center gap-3 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-orange-700">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-tight text-white">
                  <span className="block font-bold tabular-nums">AI 매칭 96%</span>
                  <span className="text-stone-200">당신의 취향과 일치해요</span>
                </span>
              </div>
            </motion.div>

            {/* Small tiles row */}
            <motion.div variants={heroItem} className={`${tileLight} items-start justify-center gap-2 px-5 py-6`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-semibold leading-snug text-stone-900">
                전문 검수 통과 상품만
              </p>
            </motion.div>

            <motion.div variants={heroItem} className={`${tileLight} items-start justify-center px-5 py-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-600">누적 재판매</p>
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-[-0.02em] text-stone-900">128,000+</p>
            </motion.div>

            <motion.div variants={heroItem} className={`${tileAccent} items-start justify-center px-5 py-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-100">매칭 정확도</p>
              <p className="mt-2 text-2xl font-bold tabular-nums tracking-[-0.02em] text-white">94%</p>
            </motion.div>

            <motion.div
              variants={heroItem}
              className="group relative aspect-[4/3] overflow-hidden rounded-[28px] border border-stone-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-lg lg:aspect-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                alt="다양한 색상의 의류가 걸려 있는 옷걸이 랙"
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Trust logos strip — one wide tile */}
        <section aria-labelledby="trust-heading" className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <motion.div
            className="rounded-[28px] border border-stone-200/70 bg-white px-6 py-8 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <h2
              id="trust-heading"
              className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-stone-600"
            >
              이런 곳에서 RE:픽을 주목했습니다
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {TRUST_LOGOS.map((name) => (
                <li key={name} className="text-lg font-bold text-stone-600">
                  {name}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* How it works — three equal tiles */}
        <section id="how" aria-labelledby="how-heading" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">작동 방식</p>
            <h2 className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900">
              세 단계면 충분합니다
            </h2>
          </motion.div>

          <motion.ol
            className="mt-8 grid gap-4 sm:grid-cols-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                whileHover={hoverLiftSmall}
                transition={springTransition}
                className={`${tileLight} px-7 py-8`}
              >
                <span aria-hidden="true" className="block text-sm font-bold tabular-nums text-stone-300">
                  0{index + 1}
                </span>
                <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-stone-50 transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-stone-600">{step.desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* AI 매칭 근거 — flagship irregular bento grid */}
        <section id="product" aria-labelledby="product-heading" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">AI 매칭</p>
            <h2
              id="product-heading"
              className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
            >
              AI가 왜 이 상품을 골랐는지, 전부 보여드려요
            </h2>
            <p className="mt-3 max-w-xl text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
              매칭 근거, 컨디션 등급, 검수 인증, 할인율까지 — 한눈에 확인하고 확신 있게 고르세요.
            </p>
          </motion.div>

          <motion.div
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[200px] lg:[grid-auto-flow:dense]"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {/* Big product tile */}
            <motion.div
              variants={fadeUp}
              onPointerMove={handleSpotlight}
              className="group relative aspect-[4/5] overflow-hidden rounded-[28px] border border-stone-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-lg hover:shadow-stone-900/10 sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:aspect-auto"
            >
              <Image
                src={PRODUCTS[0].image}
                alt={PRODUCTS[0].alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
              />
              <Spotlight />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/10 to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold tabular-nums text-stone-900 shadow-sm backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                매칭 {PRODUCTS[0].match}%
              </span>
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {PRODUCTS[0].condition}등급
              </span>
              <div className="relative mt-auto p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-300">{PRODUCTS[0].brand}</p>
                <h3 className="mt-1 text-lg font-bold">{PRODUCTS[0].title}</h3>
                <div className="mt-2 flex flex-wrap items-baseline gap-2 tabular-nums">
                  <span className="text-lg font-bold">{PRODUCTS[0].price}</span>
                  <span className="text-sm text-stone-300 line-through">{PRODUCTS[0].original}</span>
                  <span className="text-sm font-bold text-orange-400">-{PRODUCTS[0].discount}%</span>
                </div>
              </div>
            </motion.div>

            {/* AI reason tile */}
            <motion.div
              variants={fadeUp}
              className={`${tileLight} justify-center gap-2 px-6 py-6 sm:col-span-2 lg:col-span-2`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-3 text-base font-bold text-stone-900">AI가 왜 골랐나</h3>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">
                &ldquo;{PRODUCTS[0].reason}&rdquo; — 찜한 스타일과 사이즈 데이터를 실시간으로 대조했어요.
              </p>
            </motion.div>

            {/* Verified tile */}
            <motion.div variants={fadeUp} className={`${tileLight} justify-center gap-1 px-6 py-6`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-900 text-stone-50">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-bold text-stone-900">전문 검수 통과</p>
              <p className="mt-1 text-xs text-stone-600">판매자 인증 완료</p>
            </motion.div>

            {/* Discount stat tile */}
            <motion.div variants={fadeUp} className={`${tileAccent} justify-center px-6 py-6`}>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-100">평균 할인율</p>
              <p className="mt-2 text-3xl font-bold tabular-nums tracking-[-0.02em] text-white">-45%</p>
            </motion.div>

            {/* Secondary mini image tile */}
            <motion.div
              variants={fadeUp}
              className="group relative aspect-square overflow-hidden rounded-[28px] border border-stone-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-lg lg:aspect-auto"
            >
              <Image
                src={PRODUCTS[2].image}
                alt={PRODUCTS[2].alt}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-bold tabular-nums text-stone-900 shadow-sm backdrop-blur">
                매칭 {PRODUCTS[2].match}%
              </span>
            </motion.div>

            {/* Tagline tile */}
            <motion.div
              variants={fadeUp}
              className={`${tileDark} justify-center px-6 py-6 sm:col-span-2 lg:col-span-2`}
            >
              <Quote className="h-5 w-5 text-orange-400" aria-hidden="true" />
              <p className="mt-3 text-balance text-lg font-bold leading-snug tracking-[-0.01em] text-stone-50">
                스크롤은 줄고, 확신은 늘어요.
              </p>
            </motion.div>

            {/* Mini CTA tile */}
            <MotionLink
              href="/dashboard"
              variants={fadeUp}
              whileHover={hoverLift}
              transition={springTransition}
              className={`${tileAccent} group/cta justify-center px-6 py-6 ${focusRingOnDark}`}
            >
              <span className="text-sm font-bold leading-snug text-white">
                지금 다시
                <br />
                골라보기
              </span>
              <ArrowRight
                className="mt-4 h-5 w-5 text-white transition-transform motion-safe:group-hover/cta:translate-x-1"
                aria-hidden="true"
              />
            </MotionLink>
          </motion.div>
        </section>

        {/* Showcase */}
        <section id="showcase" aria-labelledby="showcase-heading" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">쇼케이스</p>
            <h2
              id="showcase-heading"
              className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
            >
              지금, 당신을 위해 다시 골랐어요
            </h2>
          </motion.div>

          <motion.ul
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {PRODUCTS.map((product) => {
              const isLiked = !!likedProducts[product.title];
              return (
                <motion.li
                  key={product.title}
                  variants={fadeUp}
                  whileHover={hoverLift}
                  transition={springTransition}
                  className={`${tileLight}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-[28px]">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold tabular-nums text-stone-900 shadow-sm backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
                      {product.match}%
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-900/80 px-2.5 py-1 text-xs font-bold text-white backdrop-blur">
                      {product.condition}등급
                    </span>
                    <motion.button
                      type="button"
                      aria-label={`${product.title} ${isLiked ? "찜 목록에서 빼기" : "찜하기"}`}
                      aria-pressed={isLiked}
                      onClick={() => toggleLike(product.title)}
                      whileTap={tapButton}
                      className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition motion-safe:hover:scale-110 hover:text-orange-700 ${focusRing} ${isLiked ? "text-orange-700" : "text-stone-700"}`}
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
                    </motion.button>
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-600">{product.brand}</p>
                    <h3 className="mt-1 text-base font-bold text-stone-900">{product.title}</h3>
                    <p className="mt-1 text-xs text-stone-600">AI 매칭 근거: {product.reason}</p>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2 tabular-nums">
                      <span className="text-lg font-bold text-stone-900">{product.price}</span>
                      <span className="text-sm text-stone-600 line-through">{product.original}</span>
                      <span className="text-sm font-bold text-orange-700">-{product.discount}%</span>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-4"
          >
            <MotionLink
              href="/dashboard"
              whileHover={hoverLift}
              transition={springTransition}
              className={`${tileDark} group/wide flex-row items-center justify-between px-8 py-8 ${focusRingOnDark}`}
            >
              <span className="text-lg font-bold leading-snug text-stone-50">
                취향을 등록하고 전체 매칭 결과 보기
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-50 text-stone-900 transition-transform motion-safe:group-hover/wide:translate-x-1">
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </MotionLink>
          </motion.div>
        </section>

        {/* Proof — stats + testimonials */}
        <section id="proof" aria-labelledby="proof-heading" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">후기</p>
            <h2
              id="proof-heading"
              className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
            >
              안목 있는 사람들이 먼저 씁니다
            </h2>
          </motion.div>

          <motion.dl
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STATS.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className={`${tileLight} justify-center px-6 py-8`}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-600">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-bold tabular-nums tracking-[-0.02em] text-stone-900">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.ul
            className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {TESTIMONIALS.map((t) => (
              <motion.li
                key={t.name}
                variants={fadeUp}
                whileHover={hoverLiftSmall}
                transition={springTransition}
                className={`${tileLight} px-7 py-7`}
              >
                <Quote className="h-6 w-6 text-orange-700" aria-hidden="true" />
                <blockquote className="mt-4 text-lg font-semibold leading-snug tracking-[-0.01em] text-stone-800">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figure className="mt-6 flex items-center gap-3">
                  <Image
                    src={t.avatar}
                    alt={`${t.name}의 프로필 사진`}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <figcaption>
                    <span className="block text-sm font-bold text-stone-900">{t.name}</span>
                    <span className="block text-sm text-stone-600">{t.role}</span>
                  </figcaption>
                </figure>
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-heading" className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">FAQ</p>
            <h2
              id="faq-heading"
              className="mt-3 max-w-xl text-balance text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
            >
              궁금한 점, 먼저 답해드릴게요
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="mt-8 divide-y divide-stone-200 overflow-hidden rounded-[28px] border border-stone-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            {FAQS.map((item) => (
              <details key={item.question} className="group px-6 py-5 sm:px-8">
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-bold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                >
                  {item.question}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-stone-500 transition-transform duration-300 motion-safe:group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-base leading-relaxed text-stone-600">{item.answer}</p>
              </details>
            ))}
          </motion.div>
        </section>

        {/* Final CTA — bookend tile echoing the hero */}
        <section aria-labelledby="cta-heading" className="mx-auto max-w-7xl px-6 pb-20 pt-4 lg:px-8">
          <motion.div
            onPointerMove={handleSpotlight}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            className="group relative isolate overflow-hidden rounded-[28px]"
          >
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80"
                alt="빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/75" />
              <Spotlight tone="dark" />
            </div>
            <div className="relative mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
              <h2
                id="cta-heading"
                className="text-balance text-[clamp(1.9rem,3.6vw,2.75rem)] font-bold leading-[1.12] tracking-[-0.02em] text-stone-50"
              >
                지금 취향을 등록하고
                <br />
                AI가 <em className="not-italic font-bold text-orange-400">다시</em> 고른 첫 매물을 받아보세요
              </h2>
              <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
                가입은 1분이면 충분해요. 언제든 해지할 수 있어요.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <a
                  href="#product"
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  AI 매칭 다시 보기
                </a>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-stone-50">
                <span className="rounded-md bg-orange-700 px-2 py-0.5 text-lg font-semibold text-white font-[family-name:var(--font-geist-mono)]">
                  RE:
                </span>
                픽
              </p>
              <p className="mt-3 max-w-xs text-sm text-stone-400">
                AI가 취향을 학습해 당신에게 맞는 중고만 다시 골라주는 리커머스.
              </p>
              <ul className="mt-6 flex gap-4 text-sm">
                <li>
                  <a
                    href="https://instagram.com/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://threads.net/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    Threads
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/repick"
                    className={`rounded-md text-stone-400 transition-colors hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    X
                  </a>
                </li>
              </ul>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-bold text-stone-50">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
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
            ))}
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-stone-800 pt-8 text-sm text-stone-400 sm:flex-row">
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
