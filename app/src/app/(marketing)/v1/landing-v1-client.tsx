"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#story", label: "스토리" },
  { href: "#showcase", label: "쇼케이스" },
  { href: "#trust", label: "후기" },
  { href: "#faq", label: "FAQ" },
];

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
    verified: true,
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
    verified: true,
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
    verified: true,
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
    verified: true,
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
      { label: "스토리", href: "#story" },
      { label: "쇼케이스", href: "#showcase" },
      { label: "후기", href: "#trust" },
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

export default function LandingV1Client() {
  const prefersReducedMotion = useReducedMotion();
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Floating nav: solidify on scroll
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 60);
  });

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

  // Hero cinematic scroll-link
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageScale = useTransform(heroProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.22]);
  const heroOverlayOpacity = useTransform(heroProgress, [0, 1], [0.55, 0.94]);
  const heroTextY = useTransform(heroProgress, [0, 1], [0, prefersReducedMotion ? 0 : -90]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const heroCueOpacity = useTransform(heroProgress, [0, 0.15], [1, 0]);

  // Product gallery scroll progress
  const [galleryProgress, setGalleryProgress] = useState(0);
  const handleGalleryScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const el = event.currentTarget;
    const max = el.scrollWidth - el.clientWidth;
    setGalleryProgress(max > 0 ? el.scrollLeft / max : 0);
  };

  // Hero entrance
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.15,
      },
    },
  };
  const heroItem: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.8, ease: EASE },
    },
  };

  // Scroll reveal (generic)
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

  // Microinteractions (guarded for reduced motion)
  const hoverLiftCard = prefersReducedMotion ? undefined : { y: -6 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 backdrop-blur-xl transition-colors duration-300 sm:px-6 ${
            scrolled
              ? "border-white/15 bg-stone-950/85 shadow-lg shadow-black/20"
              : "border-white/10 bg-stone-950/35"
          }`}
        >
          <a
            href="#main-content"
            aria-label="RE:픽 홈"
            className={`inline-flex items-center gap-1.5 rounded-md text-xl font-bold tracking-tight text-stone-50 ${focusRingOnDark}`}
          >
            <span className="rounded-md bg-orange-700 px-2 py-0.5 text-base font-semibold text-white font-[family-name:var(--font-geist-mono)]">
              RE:
            </span>
            픽
          </a>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-md text-sm font-semibold text-stone-200 transition-colors hover:text-white ${focusRingOnDark}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-50 px-5 py-2.5 text-sm font-bold text-stone-900 shadow-sm transition motion-safe:hover:-translate-y-0.5 hover:bg-white active:translate-y-0 md:inline-flex ${focusRingOnDark}`}
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
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-100 transition-colors hover:bg-white/10 md:hidden ${focusRingOnDark}`}
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
              className="fixed inset-0 z-40 bg-stone-950/60 md:hidden"
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
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col gap-8 border-l border-stone-800 bg-stone-950 px-6 py-6 shadow-2xl md:hidden"
              initial={{ x: prefersReducedMotion ? 0 : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : "100%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-stone-50">메뉴</span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="메뉴 닫기"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-200 transition-colors hover:bg-white/10 ${focusRingOnDark}`}
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
                    className={`rounded-md px-2 py-3 text-base font-semibold text-stone-200 transition-colors hover:bg-white/10 hover:text-stone-50 ${focusRingOnDark}`}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <Link
                href="/dashboard"
                onClick={() => setMobileNavOpen(false)}
                className={`mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-stone-50 px-5 py-3 text-sm font-bold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
              >
                무료로 시작
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content">
        {/* Hero — full-bleed cinematic cover */}
        <section
          ref={heroRef}
          aria-labelledby="hero-heading"
          className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-stone-950"
        >
          <motion.div
            className="absolute inset-0"
            style={prefersReducedMotion ? undefined : { scale: heroImageScale }}
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
              alt="니트 코트를 입은 모델이 카메라를 정면으로 바라보는 패션 인물 사진"
              fill
              preload
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/10"
            style={prefersReducedMotion ? undefined : { opacity: heroOverlayOpacity }}
          />

          <motion.div
            className="relative flex h-full flex-col justify-end gap-6 px-6 pb-20 sm:px-10 sm:pb-28 lg:px-16"
            style={prefersReducedMotion ? undefined : { y: heroTextY, opacity: heroTextOpacity }}
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={heroItem}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-stone-100 backdrop-blur"
            >
              <Sparkles className="h-4 w-4 text-orange-300" aria-hidden="true" />
              AI 취향 매칭 리커머스
            </motion.p>
            <motion.h1
              variants={heroItem}
              id="hero-heading"
              className="max-w-4xl text-balance text-[clamp(2.75rem,9vw,7rem)] font-bold leading-[0.95] tracking-[-0.02em] text-stone-50"
            >
              당신의 취향을,
              <br />
              AI가 <em className="text-orange-300 not-italic">다시</em> 골라드립니다
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="max-w-xl text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-200 sm:text-xl"
            >
              수만 개 매물 속에서 스타일, 사이즈, 예산을 학습한 AI가 지금 당신에게
              맞는 것만 선별합니다.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <MotionLink
                href="/dashboard"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-bold text-stone-900 shadow-lg shadow-black/20 transition-colors hover:bg-white ${focusRingOnDark}`}
              >
                무료로 시작하기
                <ArrowRight
                  className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MotionLink>
              <motion.a
                href="#story"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-white/30 px-7 py-3 text-sm font-bold text-stone-50 transition-colors hover:bg-white/10 ${focusRingOnDark}`}
              >
                이야기 둘러보기
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-stone-300 sm:bottom-8"
            style={prefersReducedMotion ? undefined : { opacity: heroCueOpacity }}
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </section>

        {/* Content sheet — slides visually over the hero on scroll */}
        <div className="relative z-10 -mt-10 rounded-t-[2rem] bg-stone-50 shadow-[0_-24px_60px_-20px_rgba(0,0,0,0.4)] sm:-mt-16 sm:rounded-t-[2.5rem] lg:-mt-24 lg:rounded-t-[3rem]">
          {/* Story / manifesto */}
          <section id="story" aria-labelledby="story-heading" className="border-b border-stone-200">
            <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
              <motion.div
                className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div className="lg:col-span-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
                    스토리
                  </p>
                  <h2
                    id="story-heading"
                    className="mt-4 text-balance text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.02em] text-stone-900"
                  >
                    무한 스크롤은,
                    <br />
                    이제 그만둡니다
                  </h2>
                </div>
                <div className="lg:col-span-7 lg:pt-2">
                  <p className="text-balance text-xl leading-relaxed tracking-[-0.01em] text-stone-600">
                    매일 수만 개의 매물이 쏟아집니다. RE:픽의 AI는 지금까지 쌓인{" "}
                    <span className="font-bold tabular-nums text-stone-900">128,000+</span>건의
                    재판매 데이터를 학습해,{" "}
                    <span className="font-bold tabular-nums text-stone-900">94%</span> 정확도로
                    지금 당신이 사야 할 것만 골라냅니다.
                  </p>
                  <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                    스타일, 사이즈, 예산, 그리고 컨디션까지. 스쳐 지나가는 수천 장의
                    사진 대신, 확신 있는 몇 장만 남습니다.
                  </p>
                </div>
              </motion.div>

              <motion.ol
                className="mt-20 divide-y divide-stone-200 border-y border-stone-200"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {STEPS.map((step, index) => (
                  <motion.li
                    key={step.title}
                    variants={fadeUp}
                    className="group grid grid-cols-1 items-start gap-4 py-10 sm:grid-cols-12 sm:gap-8"
                  >
                    <span
                      aria-hidden="true"
                      className="block text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none tabular-nums text-stone-200 transition-colors duration-300 group-hover:text-orange-100 sm:col-span-2"
                    >
                      0{index + 1}
                    </span>
                    <div className="sm:col-span-3">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-stone-900 text-stone-50">
                        <step.icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-4 text-xl font-bold text-stone-900">{step.title}</h3>
                    </div>
                    <p className="text-base leading-relaxed text-stone-600 sm:col-span-7 sm:pt-2">
                      {step.desc}
                    </p>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </section>

          {/* Full-bleed band 01 — AI learning */}
          <section aria-labelledby="band1-heading" className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-950 sm:h-[80vh]">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: EASE }}
            >
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
                alt="다양한 색상의 의류가 걸려 있는 옷걸이 랙"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16">
              <motion.div className="max-w-2xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <p className="font-[family-name:var(--font-display)] text-xl italic text-stone-300">
                  Fig. 01
                </p>
                <h2
                  id="band1-heading"
                  className="mt-2 text-balance text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-50"
                >
                  AI가 취향을 학습하는 방법
                </h2>
                <p className="mt-4 max-w-lg text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
                  좋아요, 스킵, 구매 데이터를 실시간으로 반영해 취향 프로필을 계속
                  정교하게 다듬습니다. 쓸수록 정확해져요.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Showcase — horizontal snap gallery */}
          <section id="showcase" aria-labelledby="showcase-heading" className="border-b border-stone-200 bg-stone-100/60">
            <div className="mx-auto max-w-7xl py-24 lg:px-8">
              <motion.div
                className="mx-auto max-w-2xl px-6 text-center lg:px-0"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">쇼케이스</p>
                <h2
                  id="showcase-heading"
                  className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
                >
                  지금, 당신을 위해 다시 골랐어요
                </h2>
                <p className="mt-4 text-lg leading-relaxed tracking-[-0.01em] text-stone-600">
                  가로로 넘겨보며 이번 주 AI가 매칭한 상품을 확인하세요.
                </p>
              </motion.div>

              <motion.ul
                aria-label="이번 주 AI 추천 상품, 가로 스크롤 목록"
                onScroll={handleGalleryScroll}
                className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 lg:px-8"
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
                      whileHover={hoverLiftCard}
                      transition={{ type: "spring", stiffness: 300, damping: 24 }}
                      className="group w-[78vw] shrink-0 snap-start overflow-hidden rounded-3xl border border-stone-200 bg-white sm:w-[320px]"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.alt}
                          fill
                          sizes="(min-width: 640px) 320px, 78vw"
                          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                        />
                        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-stone-950/80 px-2.5 py-1 text-xs font-semibold tabular-nums text-stone-50 backdrop-blur">
                          <Sparkles className="h-3.5 w-3.5 text-orange-300" aria-hidden="true" />
                          AI 매칭 {product.match}%
                        </span>
                        <motion.button
                          type="button"
                          aria-label={`${product.title} ${isLiked ? "찜 목록에서 빼기" : "찜하기"}`}
                          aria-pressed={isLiked}
                          onClick={() => toggleLike(product.title)}
                          whileTap={tapButton}
                          className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition motion-safe:hover:scale-110 hover:text-orange-700 ${focusRing} ${isLiked ? "text-orange-700" : "text-stone-700"}`}
                        >
                          <Heart className="h-4 w-4" aria-hidden="true" fill={isLiked ? "currentColor" : "none"} />
                        </motion.button>
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">{product.brand}</p>
                        <h3 className="mt-1 text-base font-bold text-stone-900">{product.title}</h3>
                        <div className="mt-3 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                            <ShieldCheck className="h-3 w-3 text-orange-700" aria-hidden="true" />
                            컨디션 {product.condition}
                          </span>
                          {product.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-stone-200 px-2 py-0.5 text-xs font-semibold text-stone-700">
                              <Check className="h-3 w-3 text-orange-700" aria-hidden="true" />
                              인증 판매자
                            </span>
                          )}
                        </div>
                        <p className="mt-2 flex items-center gap-1 text-xs text-stone-500">
                          <Sparkles className="h-3 w-3 shrink-0 text-orange-700" aria-hidden="true" />
                          {product.reason}
                        </p>
                        <div className="mt-3 flex flex-wrap items-baseline gap-2 tabular-nums">
                          <span className="text-lg font-bold text-stone-900">{product.price}</span>
                          <span className="text-sm text-stone-500 line-through">{product.original}</span>
                          <span className="text-sm font-semibold text-orange-700">-{product.discount}%</span>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <div className="mx-6 mt-2 h-1 overflow-hidden rounded-full bg-stone-200 lg:mx-8" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-orange-700 transition-[width] duration-150 ease-out"
                  style={{ width: `${galleryProgress * 100}%` }}
                />
              </div>
            </div>
          </section>

          {/* Full-bleed band 02 — trust & condition */}
          <section aria-labelledby="band2-heading" className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-stone-950 sm:h-[80vh]">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: EASE }}
            >
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80"
                alt="가죽 소재 크로스백과 액세서리를 가까이서 촬영한 사진"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/25 to-transparent" aria-hidden="true" />
            <div className="relative flex h-full flex-col justify-end px-6 pb-14 sm:px-10 sm:pb-20 lg:px-16">
              <motion.div className="max-w-2xl" variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <p className="font-[family-name:var(--font-display)] text-xl italic text-stone-300">
                  Fig. 02
                </p>
                <h2
                  id="band2-heading"
                  className="mt-2 text-balance text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-50"
                >
                  검증된 상태, 투명한 가격
                </h2>
                <p className="mt-4 max-w-lg text-balance text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
                  전문 검수팀이 확인한 상태 등급과 시세 기반 가격으로, 실물을
                  직접 보지 않아도 안심하고 구매할 수 있어요.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Full-bleed quote band */}
          <section aria-label="고객 후기 하이라이트" className="relative flex h-[70vh] min-h-[460px] w-full items-center overflow-hidden bg-stone-950 sm:h-[85vh]">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: EASE }}
            >
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
                alt="파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-stone-950/70" aria-hidden="true" />
            <motion.div
              className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <Quote className="h-10 w-10 text-orange-300" aria-hidden="true" />
              <blockquote className="mt-6 text-balance text-[clamp(1.5rem,3.5vw,2.5rem)] font-semibold leading-snug tracking-[-0.01em] text-stone-50">
                &ldquo;{TESTIMONIALS[0].quote}&rdquo;
              </blockquote>
              <figure className="mt-6 flex items-center gap-3">
                <Image
                  src={TESTIMONIALS[0].avatar}
                  alt={`${TESTIMONIALS[0].name}의 프로필 사진`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <figcaption className="text-left">
                  <span className="block text-sm font-bold text-stone-50">{TESTIMONIALS[0].name}</span>
                  <span className="block text-sm text-stone-300">{TESTIMONIALS[0].role}</span>
                </figcaption>
              </figure>
            </motion.div>
          </section>

          {/* Trust — stats + remaining testimonials */}
          <section id="trust" aria-labelledby="trust-heading" className="border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
              <motion.div
                className="text-center"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">후기</p>
                <h2
                  id="trust-heading"
                  className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
                >
                  안목 있는 사람들이 먼저 씁니다
                </h2>
              </motion.div>

              <motion.dl
                className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 border-y border-stone-200 py-10 text-center sm:grid-cols-3"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {STATS.map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp}>
                    <dt className="text-sm text-stone-500">{stat.label}</dt>
                    <dd className="mt-2 text-3xl font-bold tabular-nums tracking-[-0.02em] text-stone-900">
                      {stat.value}
                    </dd>
                  </motion.div>
                ))}
              </motion.dl>

              <motion.ul
                className="mt-16 divide-y divide-stone-200"
                variants={staggerContainer(0.12)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {TESTIMONIALS.slice(1).map((t) => (
                  <motion.li
                    key={t.name}
                    variants={fadeUp}
                    className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-6"
                  >
                    <Image
                      src={t.avatar}
                      alt={`${t.name}의 프로필 사진`}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover"
                    />
                    <blockquote className="flex-1 text-lg leading-relaxed tracking-[-0.01em] text-stone-800">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                    <figcaption className="shrink-0 text-sm text-stone-500 sm:text-right">
                      <span className="block font-bold text-stone-900">{t.name}</span>
                      {t.role}
                    </figcaption>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </section>

          {/* FAQ — hairline list */}
          <section id="faq" aria-labelledby="faq-heading">
            <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">FAQ</p>
                <h2
                  id="faq-heading"
                  className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-bold leading-[1.1] tracking-[-0.02em] text-stone-900"
                >
                  궁금한 점, 먼저 답해드릴게요
                </h2>
              </motion.div>

              <motion.div
                className="mt-14 divide-y divide-stone-200 border-t border-stone-200"
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {FAQS.map((item) => (
                  <motion.div key={item.question} variants={fadeUp}>
                    <details className="group py-6">
                      <summary
                        className={`flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-left text-base font-bold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                      >
                        {item.question}
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 motion-safe:group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="mt-3 text-base leading-relaxed text-stone-600">{item.answer}</p>
                    </details>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </div>

        {/* Final CTA — cinematic bookend */}
        <section
          aria-labelledby="cta-heading"
          className="relative isolate overflow-hidden rounded-t-[2rem] bg-stone-950 sm:rounded-t-[2.5rem] lg:rounded-t-[3rem]"
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={VIEWPORT}
            transition={{ duration: prefersReducedMotion ? 0 : 1.2, ease: EASE }}
          >
            <Image
              src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1800&q=80"
              alt="빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-stone-950/78" aria-hidden="true" />
          <motion.div
            className="relative mx-auto max-w-2xl px-6 py-28 text-center sm:py-36"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <h2
              id="cta-heading"
              className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-stone-50"
            >
              지금 취향을 등록하고
              <br />
              AI가 <em className="text-orange-300 not-italic">다시</em> 고른 첫 매물을 받아보세요
            </h2>
            <p className="mt-5 text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
              가입은 1분이면 충분해요. 언제든 해지할 수 있어요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MotionLink
                href="/dashboard"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-bold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
              >
                무료로 시작하기
                <ArrowRight
                  className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </MotionLink>
              <motion.a
                href="#showcase"
                whileHover={hoverButton}
                whileTap={tapButton}
                className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-bold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
              >
                쇼케이스 다시 보기
              </motion.a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-stone-900 bg-stone-950 text-stone-300">
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
