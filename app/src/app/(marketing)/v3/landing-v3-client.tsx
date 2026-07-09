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
import {
  ArrowRight,
  ArrowDown,
  ChevronDown,
  Heart,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";

const MotionLink = motion.create(Link);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const serif = "font-[family-name:var(--font-display)] italic";

const VIEWPORT = { once: true, margin: "-80px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#prologue", label: "이야기" },
  { href: "#chapter-04", label: "이번 호의 선택" },
  { href: "#chapter-05", label: "문장들" },
  { href: "#notes", label: "일러두기" },
];

const TOC_ITEMS = [
  { n: "00", id: "prologue", title: "프롤로그", sub: "무한 스크롤의 끝에서" },
  { n: "01", id: "chapter-01", title: "취향을 읽다", sub: "AI가 취향을 학습하는 방식" },
  { n: "02", id: "chapter-02", title: "다시, 고르다", sub: "세 번의 걸음, 하나의 선택" },
  { n: "03", id: "chapter-03", title: "믿음을 짓다", sub: "검수와 투명한 가격" },
  { n: "04", id: "chapter-04", title: "이번 호의 선택", sub: "이번 주 다시 고른 네 가지" },
  { n: "05", id: "chapter-05", title: "다른 이의 문장들", sub: "우리가 아니라, 쓰는 사람들의 말" },
];

const STEPS = [
  {
    n: "01",
    title: "취향 프로필",
    desc: "찜, 스킵, 구매 이력을 모아 지금 당신만의 취향 문장을 씁니다.",
  },
  {
    n: "02",
    title: "조건 필터링",
    desc: "사이즈, 예산, 상태 등급까지 고려해 살 수 없는 것부터 걷어냅니다.",
  },
  {
    n: "03",
    title: "최종 선별",
    desc: "남은 것 중 가장 확신이 큰 몇 개만 오늘의 선택으로 남깁니다.",
  },
];

const PRODUCTS = [
  {
    fig: "05",
    title: "빈티지 울 코트",
    brand: "Aureum Vintage",
    price: "89,000원",
    original: "148,000원",
    discount: 40,
    match: 96,
    grade: "S",
    tags: ["사이즈 55 매치", "선호 실루엣"],
    tall: true,
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
    alt: "옷걸이에 가지런히 걸린 코트들",
  },
  {
    fig: "06",
    title: "레더 크로스백",
    brand: "Atelier Noir",
    price: "62,000원",
    original: "120,000원",
    discount: 48,
    match: 91,
    grade: "A",
    tags: ["예산 이내", "미니멀 스타일"],
    tall: false,
    image:
      "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=800&q=80",
    alt: "바닥에 놓인 가죽 소재 크로스백과 액세서리",
  },
  {
    fig: "07",
    title: "클래식 스니커즈",
    brand: "Runway Archive",
    price: "54,000원",
    original: "98,000원",
    discount: 45,
    match: 88,
    grade: "A",
    tags: ["사이즈 270 매치", "화이트 톤 선호"],
    tall: false,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80",
    alt: "화이트 톤의 클래식 스니커즈 한 켤레",
  },
  {
    fig: "08",
    title: "실크 블라우스",
    brand: "Maison Blanche",
    price: "47,000원",
    original: "89,000원",
    discount: 47,
    match: 93,
    grade: "S",
    tags: ["소재 선호", "예산 이내"],
    tall: true,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1000&q=80",
    alt: "실크 블라우스를 입은 인물의 패션 컷",
  },
];

const LETTERS = [
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

const STATS = [
  { label: "누적 재판매", value: "128,000+" },
  { label: "평균 매칭 정확도", value: "94%" },
  { label: "사용자 만족도", value: "4.9 / 5" },
];

const FAQS = [
  {
    q: "RE:픽은 다른 중고 플랫폼과 뭐가 다른가요?",
    a: "직접 검색하지 않아도 됩니다. AI가 취향, 사이즈, 예산을 학습해 지금 살 만한 상품만 추려서 보여드려요.",
  },
  {
    q: "가격은 어떻게 책정되나요?",
    a: "시세 데이터와 실측 상태 등급을 기반으로 산정합니다. 원가와 할인율을 매물마다 투명하게 표기해요.",
  },
  {
    q: "상품 상태는 어떻게 확인할 수 있나요?",
    a: "전문 검수팀이 실측 사이즈와 하자 여부를 직접 확인한 뒤, 등급과 실측 사진을 함께 제공합니다.",
  },
  {
    q: "반품이나 환불도 가능한가요?",
    a: "상품 설명과 실물 상태가 다르면 반품 및 환불을 지원합니다. 마이페이지 고객센터에서 안내받을 수 있어요.",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "제품",
    links: [
      { label: "이번 호의 선택", href: "#chapter-04" },
      { label: "작동 방식", href: "#chapter-02" },
      { label: "일러두기", href: "#notes" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "#" },
      { label: "블로그", href: "#" },
      { label: "채용", href: "#" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "고객센터", href: "#" },
      { label: "이용약관", href: "#" },
      { label: "개인정보처리방침", href: "#" },
    ],
  },
];

function DropCap({ children }: { children: string }) {
  return (
    <p className="text-pretty text-lg leading-[1.9] tracking-[-0.01em] text-stone-700 first-letter:float-left first-letter:mr-3 first-letter:pt-1 first-letter:font-bold first-letter:leading-[0.8] first-letter:text-stone-900 first-letter:text-7xl sm:first-letter:text-8xl">
      {children}
    </p>
  );
}

function ChapterEyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className={`${serif} pointer-events-none absolute -top-10 left-0 select-none text-[6rem] leading-none text-stone-200 sm:-top-14 sm:text-[9rem]`}
      >
        {n}
      </span>
      <p className={`relative text-xs font-semibold uppercase tracking-[0.28em] text-orange-700`}>
        <span className={`${serif} not-italic`}>{`CHAPTER ${n}`}</span>{" "}
        <span className="text-stone-400">/</span> {label}
      </p>
    </div>
  );
}

export default function LandingV3Client() {
  const prefersReducedMotion = useReducedMotion();
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

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

  const fadeUp: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 26 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: EASE },
    },
  };
  const fadeIn: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0 },
    show: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.9, ease: EASE },
    },
  };
  const revealImage: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 1.06 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 1.1, ease: EASE },
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
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
        delayChildren: prefersReducedMotion ? 0 : 0.2,
      },
    },
  };

  const hoverLiftSmall = prefersReducedMotion ? undefined : { y: -3 };
  const hoverButton = prefersReducedMotion ? undefined : { y: -2, scale: 1.02 };
  const tapButton = prefersReducedMotion ? undefined : { scale: 0.97 };

  return (
    <>
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stone-50 ${focusRingOnDark}`}
      >
        본문으로 건너뛰기
      </a>

      {/* Masthead */}
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/90 backdrop-blur">
        <div className="hidden items-center justify-between border-b border-stone-200/70 px-6 py-1.5 text-[11px] text-stone-500 lg:flex lg:px-8">
          <span className={`${serif} not-italic tracking-[0.08em]`}>
            RE:PICK EDITORIAL <span className="text-stone-300">·</span> VOL. 01{" "}
            <span className="text-stone-300">·</span> 2026. 07
          </span>
          <span className="tracking-[0.08em]">중고를 다시, 고른다는 것에 대한 이야기</span>
        </div>
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
                className={`rounded-md text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 ${focusRing}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 md:inline-flex ${focusRing}`}
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
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 md:hidden ${focusRing}`}
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
                    className={`rounded-md px-2 py-3 text-base font-medium text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900 ${focusRing}`}
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

      <main id="main-content" className="bg-stone-50">
        {/* Cover / Hero */}
        <section aria-labelledby="hero-heading" className="relative isolate overflow-hidden bg-stone-950">
          <motion.div
            className="absolute inset-0"
            variants={revealImage}
            initial="hidden"
            animate="show"
          >
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80"
              alt="니트 코트를 입은 모델이 카메라를 정면으로 바라보는 패션 인물 사진"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/20" />
          </motion.div>

          <motion.div
            className="relative mx-auto flex min-h-[86vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-40 sm:min-h-[92vh] lg:px-8"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeUp}
              className={`${serif} not-italic text-sm tracking-[0.24em] text-orange-300`}
            >
              RE:PICK EDITORIAL <span className="text-stone-400">—</span> VOL. 01{" "}
              <span className="text-stone-400">—</span> 2026
            </motion.p>
            <motion.h1
              variants={fadeUp}
              id="hero-heading"
              className="mt-6 max-w-4xl text-balance text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[1.04] tracking-[-0.02em] text-stone-50"
            >
              다시, 고른다는 것
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed tracking-[-0.01em] text-stone-300"
            >
              닫았다 열기를 반복하던 화면 앞에서, 우리는 한 문장을 다시 썼다.
              고르는 일은, 원래 이렇게 조용해야 했다.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-sm tracking-[-0.01em] text-stone-400"
            >
              글 · RE:픽 에디토리얼 팀
            </motion.p>

            <motion.div variants={fadeUp} className="mt-14">
              <a
                href="#prologue"
                className={`group inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-500/60 bg-stone-950/40 px-5 py-2.5 text-sm font-medium text-stone-200 backdrop-blur transition-colors hover:border-stone-300 hover:text-stone-50 ${focusRingOnDark}`}
              >
                이야기 읽기
                <motion.span
                  aria-hidden="true"
                  className="inline-flex"
                  animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: prefersReducedMotion ? 0 : 3, ease: "easeInOut" }}
                >
                  <ArrowDown className="h-4 w-4" />
                </motion.span>
              </a>
            </motion.div>
          </motion.div>
        </section>

        <article aria-label="다시, 고른다는 것 — RE:픽 에디토리얼 에세이">
          {/* Table of contents */}
          <section aria-labelledby="toc-heading" className="border-b border-stone-200">
            <div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
                  <span className={`${serif} not-italic`}>CONTENTS</span> · 목차
                </p>
                <h2 id="toc-heading" className="mt-3 text-balance text-2xl font-semibold tracking-[-0.01em] text-stone-900 sm:text-3xl">
                  6분 분량의 이야기, 여섯 개의 장으로 나눴습니다.
                </h2>
              </motion.div>

              <motion.ol
                className="mt-12"
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {TOC_ITEMS.map((item) => (
                  <motion.li key={item.id} variants={fadeUp}>
                    <a
                      href={`#${item.id}`}
                      className={`group flex items-baseline gap-5 rounded-md border-b border-dashed border-stone-300 py-4 transition-colors hover:border-orange-300 sm:gap-8 ${focusRing}`}
                    >
                      <span className={`${serif} shrink-0 text-2xl tabular-nums text-stone-300 transition-colors group-hover:text-orange-700 sm:text-3xl`}>
                        {item.n}
                      </span>
                      <span className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between">
                        <span className="text-lg font-semibold text-stone-900 transition-colors group-hover:text-orange-700">
                          {item.title}
                        </span>
                        <span className="text-sm text-stone-500">{item.sub}</span>
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0 text-stone-300 transition-transform motion-safe:group-hover:translate-x-1"
                      />
                    </a>
                  </motion.li>
                ))}
              </motion.ol>
            </div>
          </section>

          {/* Prologue */}
          <section id="prologue" aria-labelledby="prologue-heading" className="scroll-mt-24 border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <ChapterEyebrow n="00" label="프롤로그" />
                <h2 id="prologue-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                  무한 스크롤의 끝에서
                </h2>
              </motion.div>

              <motion.div
                className="mt-8 space-y-6"
                variants={staggerContainer(0.12)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <motion.div variants={fadeUp}>
                  <DropCap>
                    우리는 매일 같은 행동을 반복한다. 찜하고, 스킵하고, 또
                    찜한다. 수천 개의 매물이 스쳐 지나가지만 손에 남는 것은
                    거의 없다. 중고를 산다는 것은 원래 발굴의 즐거움이어야
                    했는데, 어느 순간부터는 피로가 되어버렸다.
                  </DropCap>
                </motion.div>
                <motion.p
                  variants={fadeUp}
                  className="text-lg leading-[1.9] tracking-[-0.01em] text-stone-700"
                >
                  RE:픽은 그 피로에서 시작됐다. 검색을 줄이고, 확신을 늘리는
                  일. 그것이 우리가 다시 정의한 &lsquo;고른다&rsquo;는 동사다.
                </motion.p>
              </motion.div>
            </div>
          </section>

          {/* Chapter 01 */}
          <section id="chapter-01" aria-labelledby="chapter-01-heading" className="scroll-mt-24 border-b border-stone-200">
            <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-6">
                  <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                    <ChapterEyebrow n="01" label="취향을 읽다" />
                    <h2 id="chapter-01-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                      취향을 읽다
                    </h2>
                  </motion.div>

                  <motion.div
                    className="mt-8 space-y-6"
                    variants={staggerContainer(0.12)}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT}
                  >
                    <motion.div variants={fadeUp}>
                      <DropCap>
                        옷장을 열어보면 안다. 우리는 생각보다 일관된 사람이다.
                        좋아하는 실루엣, 피하는 색, 반복해서 손이 가는 브랜드.
                        AI는 이 패턴을 먼저 읽는다. 찜한 사진 한 장, 스킵한
                        손짓 하나까지 모두 취향의 문장이 된다.
                      </DropCap>
                    </motion.div>
                    <motion.p variants={fadeUp} className="text-lg leading-[1.9] tracking-[-0.01em] text-stone-700">
                      학습은 멈추지 않는다. 오늘 산 셔츠 하나가 내일의 추천을
                      바꾸고, 계절이 지나면 취향도 다시 쓰인다. RE:픽은 그
                      변화를 놓치지 않는다.
                    </motion.p>

                    <motion.aside
                      variants={fadeUp}
                      aria-label="평균 매칭 정확도"
                      className="!mt-10 rounded-2xl border border-orange-200 bg-orange-50/60 p-6"
                    >
                      <p className={`${serif} text-4xl tabular-nums text-orange-800`}>94%</p>
                      <p className="mt-1 text-sm text-stone-600">
                        평균 매칭 정확도 — 지난 12개월, 사용자 3만 명의 선택
                        데이터를 기반으로 측정했습니다.
                      </p>
                    </motion.aside>
                  </motion.div>
                </div>

                <motion.figure
                  className="lg:col-span-6"
                  variants={revealImage}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                    <Image
                      src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1000&q=80"
                      alt="옷걸이에 걸린 다양한 색상의 의류가 줄지어 있는 모습"
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-stone-500">
                    <span className={`${serif} not-italic text-stone-400`}>Fig. 01</span> — 취향은
                    데이터가 되기 전, 먼저 옷장에 있다.
                  </figcaption>
                </motion.figure>
              </div>
            </div>
          </section>

          {/* Pull quote */}
          <section aria-label="사용자 인용" className="border-b border-stone-800 bg-stone-950 py-28">
            <motion.div
              className="mx-auto max-w-4xl px-6 text-center lg:px-8"
              variants={fadeIn}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <span aria-hidden="true" className={`${serif} block text-7xl leading-none text-orange-400/70 sm:text-8xl`}>
                &ldquo;
              </span>
              <p className="mt-2 text-balance text-[clamp(1.5rem,3.6vw,2.5rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-stone-50">
                검색이 아니라, 발견이었으면 했다.
              </p>
              <p className="mt-6 text-sm tracking-[0.08em] text-stone-400">
                — RE:픽을 쓰는 사람들의 말에서
              </p>
            </motion.div>
          </section>

          {/* Chapter 02 */}
          <section id="chapter-02" aria-labelledby="chapter-02-heading" className="scroll-mt-24 border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-4xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <ChapterEyebrow n="02" label="다시, 고르다" />
                <h2 id="chapter-02-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                  다시, 고르다
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-[1.9] tracking-[-0.01em] text-stone-700">
                  AI가 읽은 취향은 세 번의 걸음을 거쳐 하나의 상품이 된다.
                </p>
              </motion.div>

              <motion.ol
                className="mt-14 grid gap-10 border-y border-stone-200 py-10 sm:grid-cols-3 sm:divide-x sm:divide-stone-200"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {STEPS.map((step) => (
                  <motion.li key={step.n} variants={fadeUp} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
                    <span className={`${serif} text-4xl tabular-nums text-stone-300`}>{step.n}</span>
                    <h3 className="mt-3 text-lg font-semibold text-stone-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">{step.desc}</p>
                  </motion.li>
                ))}
              </motion.ol>

              <div className="mt-16 grid gap-6 sm:grid-cols-2">
                <motion.figure variants={revealImage} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-stone-200">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                      alt="파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙"
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-stone-500">
                    <span className={`${serif} not-italic text-stone-400`}>Fig. 02</span> — 조건에
                    맞지 않는 것부터 걷어낸다.
                  </figcaption>
                </motion.figure>
                <motion.figure variants={revealImage} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-stone-200">
                    <Image
                      src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80"
                      alt="다양한 색상의 의류가 걸려 있는 옷걸이 랙"
                      fill
                      sizes="(min-width: 640px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-stone-500">
                    <span className={`${serif} not-italic text-stone-400`}>Fig. 03</span> — 남은
                    것 중 가장 확신이 큰 것만 남긴다.
                  </figcaption>
                </motion.figure>
              </div>
            </div>
          </section>

          {/* Chapter 03 */}
          <section id="chapter-03" aria-labelledby="chapter-03-heading" className="scroll-mt-24 border-b border-stone-200">
            <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
              <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
                <motion.figure
                  className="order-2 lg:order-1 lg:col-span-6"
                  variants={revealImage}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                    <Image
                      src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
                      alt="가죽 소재 크로스백과 액세서리를 가까이서 촬영한 사진"
                      fill
                      sizes="(min-width: 1024px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-stone-500">
                    <span className={`${serif} not-italic text-stone-400`}>Fig. 04</span> — 받아보기
                    전에 이미 알고 있는 것.
                  </figcaption>
                </motion.figure>

                <div className="order-1 lg:order-2 lg:col-span-6">
                  <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                    <ChapterEyebrow n="03" label="믿음을 짓다" />
                    <h2 id="chapter-03-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                      믿음을 짓다
                    </h2>
                  </motion.div>

                  <motion.div
                    className="mt-8 space-y-6"
                    variants={staggerContainer(0.12)}
                    initial="hidden"
                    whileInView="show"
                    viewport={VIEWPORT}
                  >
                    <motion.div variants={fadeUp}>
                      <DropCap>
                        좋은 추천도 상태가 다르면 소용없다. 전문 검수팀은
                        실측 사이즈와 하자 여부를 하나하나 확인하고, 그
                        결과를 사진과 등급으로 남긴다.
                      </DropCap>
                    </motion.div>
                    <motion.p variants={fadeUp} className="text-lg leading-[1.9] tracking-[-0.01em] text-stone-700">
                      받아보기 전에 이미 알고 있는 것. 그것이 우리가 만든
                      신뢰의 형태다.
                    </motion.p>

                    <motion.aside
                      variants={fadeUp}
                      aria-label="검수 항목 수"
                      className="!mt-10 rounded-2xl border border-stone-200 bg-stone-100/70 p-6"
                    >
                      <p className={`${serif} text-4xl tabular-nums text-stone-900`}>48</p>
                      <p className="mt-1 text-sm text-stone-600">
                        모든 매물이 거치는 검수 항목 수. 실측, 하자, 세탁
                        상태까지 확인합니다.
                      </p>
                    </motion.aside>
                  </motion.div>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 04 — Products */}
          <section id="chapter-04" aria-labelledby="chapter-04-heading" className="scroll-mt-24 border-b border-stone-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <ChapterEyebrow n="04" label="이번 호의 선택" />
                <h2 id="chapter-04-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                  이번 호의 선택
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed tracking-[-0.01em] text-stone-700">
                  이번 주 AI가 당신을 위해 다시 고른 네 가지입니다.
                </p>
              </motion.div>

              <div className="mt-16 space-y-10">
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                  <ProductFigure product={PRODUCTS[0]} className="lg:col-span-7" liked={!!likedProducts[PRODUCTS[0].title]} onToggleLike={toggleLike} hover={hoverLiftSmall} tap={tapButton} variants={fadeUp} />
                  <ProductFigure product={PRODUCTS[1]} className="lg:col-span-5" liked={!!likedProducts[PRODUCTS[1].title]} onToggleLike={toggleLike} hover={hoverLiftSmall} tap={tapButton} variants={fadeUp} />
                </div>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
                  <ProductFigure product={PRODUCTS[2]} className="lg:col-span-5" liked={!!likedProducts[PRODUCTS[2].title]} onToggleLike={toggleLike} hover={hoverLiftSmall} tap={tapButton} variants={fadeUp} />
                  <ProductFigure product={PRODUCTS[3]} className="lg:col-span-7" liked={!!likedProducts[PRODUCTS[3].title]} onToggleLike={toggleLike} hover={hoverLiftSmall} tap={tapButton} variants={fadeUp} />
                </div>
              </div>
            </div>
          </section>

          {/* Chapter 05 — Letters */}
          <section id="chapter-05" aria-labelledby="chapter-05-heading" className="scroll-mt-24 border-b border-stone-200">
            <div className="mx-auto max-w-5xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <ChapterEyebrow n="05" label="다른 이의 문장들" />
                <h2 id="chapter-05-heading" className="mt-4 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                  다른 이의 문장들
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed tracking-[-0.01em] text-stone-700">
                  우리가 아니라, 쓰는 사람들이 남긴 문장.
                </p>
              </motion.div>

              <motion.ul
                className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {LETTERS.map((letter) => (
                  <motion.li
                    key={letter.name}
                    variants={fadeUp}
                    whileHover={hoverLiftSmall}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="flex flex-col rounded-3xl border border-stone-200 bg-white p-8"
                  >
                    <span aria-hidden="true" className={`${serif} text-5xl leading-none text-orange-300`}>
                      &ldquo;
                    </span>
                    <blockquote className="mt-3 flex-1 text-lg leading-snug tracking-[-0.01em] text-stone-800">
                      {letter.quote}
                    </blockquote>
                    <figure className="mt-6 flex items-center gap-3">
                      <Image
                        src={letter.avatar}
                        alt={`${letter.name}의 프로필 사진`}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <figcaption>
                        <span className="block text-sm font-semibold text-stone-900">{letter.name}</span>
                        <span className="block text-sm text-stone-500">{letter.role}</span>
                      </figcaption>
                    </figure>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.dl
                className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-10 border-t border-stone-200 pt-14 text-center sm:grid-cols-3"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {STATS.map((stat) => (
                  <motion.div key={stat.label} variants={fadeUp}>
                    <dt className="text-sm text-stone-500">{stat.label}</dt>
                    <dd className={`${serif} mt-2 text-4xl tabular-nums text-stone-900`}>{stat.value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </section>

          {/* Notes / FAQ */}
          <section id="notes" aria-labelledby="notes-heading" className="scroll-mt-24 bg-white">
            <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT}>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-700">
                  <span className={`${serif} not-italic`}>NOTES</span> · 일러두기
                </p>
                <h2 id="notes-heading" className="mt-3 text-balance text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-900">
                  궁금한 점, 먼저 답해드릴게요
                </h2>
              </motion.div>

              <motion.div
                className="mt-14 divide-y divide-stone-200 border-y border-stone-200"
                variants={staggerContainer(0.06)}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                {FAQS.map((item, index) => (
                  <motion.div key={item.q} variants={fadeUp}>
                    <details className="group py-6">
                      <summary
                        className={`flex cursor-pointer list-none items-baseline gap-4 rounded-md text-left text-base font-semibold text-stone-900 marker:hidden [&::-webkit-details-marker]:hidden ${focusRing}`}
                      >
                        <span className={`${serif} shrink-0 text-lg tabular-nums text-stone-300`}>
                          0{index + 1}
                        </span>
                        <span className="flex-1">{item.q}</span>
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-300 motion-safe:group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="mt-3 pl-9 text-base leading-relaxed text-stone-600">{item.a}</p>
                    </details>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Closing / Epilogue */}
          <section id="closing" aria-labelledby="closing-heading" className="relative isolate overflow-hidden bg-stone-950">
            <motion.div className="absolute inset-0" variants={revealImage} initial="hidden" whileInView="show" viewport={VIEWPORT}>
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1800&q=80"
                alt="빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-950/78" />
            </motion.div>

            <motion.div
              className="relative mx-auto max-w-2xl px-6 py-28 text-center sm:py-36 lg:px-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
                <span className={`${serif} not-italic`}>EPILOGUE</span> · 마지막 장
              </p>
              <h2 id="closing-heading" className="mt-4 text-balance text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.01em] text-stone-50">
                다음 이야기를 시작할 시간
              </h2>
              <p className="mt-5 text-lg leading-relaxed tracking-[-0.01em] text-stone-300">
                가입은 1분, 취향을 기록하는 순간부터 이야기는 달라집니다.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <MotionLink
                  href="/dashboard"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </MotionLink>
                <motion.a
                  href="#toc-heading"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  목차로 돌아가기
                </motion.a>
              </div>
            </motion.div>
          </section>
        </article>
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
              <p className={`${serif} not-italic mt-6 text-xs tracking-[0.14em] text-stone-500`}>
                VOL. 01 <span className="text-stone-700">—</span> 2026. 07
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-semibold text-stone-50">{column.title}</h3>
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

type Product = (typeof PRODUCTS)[number];

function ProductFigure({
  product,
  className = "",
  liked,
  onToggleLike,
  hover,
  tap,
  variants,
}: {
  product: Product;
  className?: string;
  liked: boolean;
  onToggleLike: (title: string) => void;
  hover?: { y: number };
  tap?: { scale: number };
  variants: Variants;
}) {
  return (
    <motion.figure
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      whileHover={hover}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group relative ${className}`}
    >
      <div className={`relative w-full overflow-hidden rounded-3xl border border-stone-200 ${product.tall ? "aspect-[4/5]" : "aspect-[16/11]"}`}>
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
        />
        <span className={`${serif} not-italic absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-xs text-stone-500 backdrop-blur`}>
          Fig. {product.fig}
        </span>
        <motion.button
          type="button"
          aria-label={`${product.title} ${liked ? "찜 목록에서 빼기" : "찜하기"}`}
          aria-pressed={liked}
          onClick={() => onToggleLike(product.title)}
          whileTap={tap}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-colors hover:text-orange-700 ${focusRing} ${liked ? "text-orange-700" : "text-stone-700"}`}
        >
          <Heart className="h-4 w-4" aria-hidden="true" fill={liked ? "currentColor" : "none"} />
        </motion.button>
      </div>
      <figcaption className="mt-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">{product.brand}</p>
        <h3 className="mt-1 text-lg font-semibold text-stone-900">{product.title}</h3>
        <div className="mt-2 flex flex-wrap items-baseline gap-2 tabular-nums">
          <span className="text-lg font-semibold text-stone-900">{product.price}</span>
          <span className="text-sm text-stone-500 line-through">{product.original}</span>
          <span className={`${serif} not-italic text-sm text-orange-700`}>-{product.discount}%</span>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-500">
          <span className="inline-flex items-center gap-1 font-semibold text-stone-700">
            <ShieldCheck className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
            인증 판매자
          </span>
          <span>컨디션 {product.grade}등급</span>
          <span>AI 매칭 {product.match}%</span>
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
              {tag}
            </span>
          ))}
        </div>
      </figcaption>
    </motion.figure>
  );
}
