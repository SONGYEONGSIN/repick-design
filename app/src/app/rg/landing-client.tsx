"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  motion,
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
} from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 focus-visible:ring-orange-700";
const focusRingOnDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 focus-visible:ring-orange-400";

const VIEWPORT = { once: true, margin: "-100px" } as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#how-it-works", label: "작동 방식" },
  { href: "#features", label: "기능" },
  { href: "#showcase", label: "쇼케이스" },
  { href: "#testimonials", label: "후기" },
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
    quote:
      "찜만 누적 300개였는데, repick을 쓰고 나서는 진짜 살 것만 보여요.",
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

const FOOTER_COLUMNS = [
  {
    title: "제품",
    links: [
      { label: "기능", href: "#features" },
      { label: "요금제", href: "/pricing" },
      { label: "쇼케이스", href: "#showcase" },
      { label: "앱 다운로드", href: "/app" },
    ],
  },
  {
    title: "회사",
    links: [
      { label: "소개", href: "/about" },
      { label: "블로그", href: "/blog" },
      { label: "채용", href: "/careers" },
      { label: "뉴스룸", href: "/press" },
    ],
  },
  {
    title: "지원",
    links: [
      { label: "고객센터", href: "/support" },
      { label: "FAQ", href: "/faq" },
      { label: "이용약관", href: "/terms" },
      { label: "개인정보처리방침", href: "/privacy" },
    ],
  },
];

export default function LandingClient() {
  const prefersReducedMotion = useReducedMotion();
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedProducts((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 48]);

  // Hero entrance
  const heroContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
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
  const heroImageVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.97 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.9, ease: EASE, delay: prefersReducedMotion ? 0 : 0.3 },
    },
  };
  const badgeVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16, scale: prefersReducedMotion ? 1 : 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: prefersReducedMotion ? 0 : 0.6, ease: EASE, delay: prefersReducedMotion ? 0 : 0.75 },
    },
  };
  const secondaryImageVariant: Variants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.7, ease: EASE, delay: prefersReducedMotion ? 0 : 0.55 },
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

      <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-50/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="#main-content"
            className={`rounded-md text-2xl font-semibold tracking-tight text-stone-900 font-[family-name:var(--font-display)] ${focusRing}`}
          >
            repick
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
          <a
            href="/signup"
            className={`hidden min-h-11 items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 shadow-sm transition motion-safe:hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0 active:bg-stone-950 sm:inline-flex ${focusRing}`}
          >
            무료로 시작
          </a>
        </div>
      </header>

      <main id="main-content" className="bg-stone-50">
        {/* Hero */}
        <section aria-labelledby="hero-heading" className="border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-28 sm:pt-24 sm:pb-36 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              variants={heroContainer}
              initial="hidden"
              animate="show"
            >
              <motion.p
                variants={heroItem}
                className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-sm font-medium text-stone-600 shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-orange-700" aria-hidden="true" />
                AI 취향 매칭 리커머스
              </motion.p>
              <motion.h1
                variants={heroItem}
                id="hero-heading"
                className="mt-6 text-balance text-[clamp(2.5rem,6vw,4.5rem)] font-[family-name:var(--font-display)] leading-[1.05] tracking-tight text-stone-900"
              >
                당신의 취향을,
                <br className="hidden sm:block" />
                AI가 <em className="text-orange-700">다시</em> 골라드립니다
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="mx-auto mt-6 max-w-xl text-balance text-lg text-stone-600"
              >
                수만 개의 중고 매물 속에서 스타일, 사이즈, 예산까지 학습한 AI가
                지금 당신에게 꼭 맞는 상품만 골라 보여드립니다.
              </motion.p>
              <motion.div
                variants={heroItem}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <motion.a
                  href="/signup"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-900 px-7 py-3 text-sm font-semibold text-stone-50 shadow-sm transition-colors hover:bg-stone-800 ${focusRing}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.a>
                <motion.a
                  href="#showcase"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-7 py-3 text-sm font-semibold text-stone-900 transition-colors hover:bg-stone-100 ${focusRing}`}
                >
                  쇼케이스 둘러보기
                </motion.a>
              </motion.div>
            </motion.div>

            <div ref={heroRef} className="relative mx-auto mt-20 max-w-5xl">
              <motion.div
                variants={heroImageVariant}
                initial="hidden"
                animate="show"
                style={prefersReducedMotion ? undefined : { y: parallaxY }}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-stone-200 shadow-2xl shadow-stone-900/10 sm:aspect-[16/9]"
              >
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
                  alt="니트 코트를 입은 모델이 카메라를 정면으로 바라보는 패션 인물 사진"
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  preload
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                variants={badgeVariant}
                initial="hidden"
                animate="show"
                className="absolute -top-6 right-6 hidden items-center gap-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-tight">
                  <span className="block font-semibold text-stone-900">AI 매칭 96%</span>
                  <span className="text-stone-500">당신의 취향과 일치해요</span>
                </span>
              </motion.div>

              <motion.div
                variants={secondaryImageVariant}
                initial="hidden"
                animate="show"
                className="absolute -bottom-10 -left-6 hidden h-64 w-52 overflow-hidden rounded-2xl border-4 border-stone-50 shadow-xl sm:block"
              >
                <Image
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80"
                  alt="다양한 색상의 의류가 걸려 있는 옷걸이 랙"
                  width={208}
                  height={256}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust logos */}
        <section aria-labelledby="trust-heading" className="border-b border-stone-200 bg-white">
          <motion.div
            className="mx-auto max-w-7xl px-6 py-10 lg:px-8"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <h2
              id="trust-heading"
              className="text-center text-xs font-semibold uppercase tracking-widest text-stone-600"
            >
              이런 곳에서 repick을 주목했습니다
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {TRUST_LOGOS.map((name) => (
                <li
                  key={name}
                  className="text-lg font-semibold tracking-tight text-stone-500 font-[family-name:var(--font-display)]"
                >
                  {name}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how-it-works" aria-labelledby="how-heading" className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">작동 방식</p>
            <h2
              id="how-heading"
              className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-display)] tracking-tight text-stone-900"
            >
              세 단계면 충분합니다
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              복잡한 검색과 필터링은 AI에게 맡기고, 마음에 드는 것만 골라 받으세요.
            </p>
          </motion.div>

          <motion.ol
            className="mt-16 grid gap-8 sm:grid-cols-3"
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {STEPS.map((step, index) => (
              <motion.li
                key={step.title}
                variants={fadeUp}
                whileHover={hoverLiftSmall}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="group rounded-3xl border border-stone-200 bg-white p-8"
              >
                <span
                  aria-hidden="true"
                  className="block text-sm font-semibold text-stone-300 font-[family-name:var(--font-display)]"
                >
                  0{index + 1}
                </span>
                <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-stone-50 transition-transform duration-300 motion-safe:group-hover:scale-110">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-stone-600">{step.desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </section>

        {/* Features */}
        <section id="features" aria-labelledby="features-heading" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="max-w-2xl"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">기능</p>
              <h2
                id="features-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-display)] tracking-tight text-stone-900"
              >
                레퍼런스처럼 정교하게, 한 사람을 위해
              </h2>
            </motion.div>

            <div className="mt-16 space-y-24">
              {/* Feature 1: text left, image right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    취향을 읽는 AI
                  </h3>
                  <p className="mt-4 text-lg text-stone-600">
                    좋아요, 스킵, 구매 데이터를 실시간으로 학습해 취향 프로필을
                    계속 정교하게 다듬습니다. 볼수록 더 정확해져요.
                  </p>
                  <a
                    href="#how-it-works"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    취향 분석 살펴보기
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                  <Image
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80"
                    alt="옷걸이에 걸린 다양한 색상의 의류가 줄지어 있는 모습"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
              </motion.div>

              {/* Feature 2: image left, text right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5 lg:order-1">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80"
                    alt="파스텔 톤 빈티지 의류가 걸려 있는 옷걸이 랙"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
                <div className="lg:order-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    불필요한 탐색은 걷어내요
                  </h3>
                  <p className="mt-4 text-lg text-stone-600">
                    수만 개 매물 중 조건에 맞지 않는 상품은 자동으로 걸러내고,
                    진짜 필요한 것만 큐레이션해서 보여드립니다.
                  </p>
                  <a
                    href="#showcase"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    필터링 기준 보기
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </motion.div>

              {/* Feature 3: text left, image right */}
              <motion.div
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={VIEWPORT}
              >
                <div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                    검증된 상태, 투명한 가격
                  </h3>
                  <p className="mt-4 text-lg text-stone-600">
                    전문 검수팀이 확인한 상태 등급과 시세 데이터 기반 가격으로,
                    실물을 보지 않고도 안심하고 구매할 수 있어요.
                  </p>
                  <a
                    href="#testimonials"
                    className={`group mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-stone-900 underline-offset-4 hover:underline ${focusRing}`}
                  >
                    검수 기준 확인하기
                    <ArrowRight
                      className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
                <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-stone-200 shadow-lg shadow-stone-900/5">
                  <Image
                    src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
                    alt="가죽 소재 크로스백과 액세서리를 가까이서 촬영한 사진"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section id="showcase" aria-labelledby="showcase-heading" className="border-t border-stone-200 bg-stone-100/70">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">쇼케이스</p>
              <h2
                id="showcase-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-display)] tracking-tight text-stone-900"
              >
                지금, 당신을 위해 다시 골랐어요
              </h2>
              <p className="mt-4 text-lg text-stone-600">이번 주 AI가 매칭한 추천 상품이에요.</p>
            </motion.div>

            <motion.ul
              className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
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
                  className="group overflow-hidden rounded-3xl border border-stone-200 bg-white"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-stone-900 shadow-sm backdrop-blur">
                      <Sparkles className="h-3.5 w-3.5 text-orange-700" aria-hidden="true" />
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
                    <p className="text-xs font-medium uppercase tracking-wide text-stone-600">{product.brand}</p>
                    <h3 className="mt-1 text-base font-semibold text-stone-900">{product.title}</h3>
                    <div className="mt-3 flex flex-wrap items-baseline gap-2">
                      <span className="text-lg font-semibold text-stone-900">{product.price}</span>
                      <span className="text-sm text-stone-500 line-through">{product.original}</span>
                      <span className="text-sm font-semibold text-orange-700">-{product.discount}%</span>
                    </div>
                  </div>
                </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" aria-labelledby="testimonials-heading" className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">후기</p>
              <h2
                id="testimonials-heading"
                className="mt-3 text-balance text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-display)] tracking-tight text-stone-900"
              >
                안목 있는 사람들이 먼저 씁니다
              </h2>
            </motion.div>

            <motion.dl
              className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 border-y border-stone-200 py-10 text-center sm:grid-cols-3"
              variants={staggerContainer(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              {STATS.map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}>
                  <dt className="text-sm text-stone-500">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold text-stone-900 font-[family-name:var(--font-display)]">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.ul
              className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3"
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
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  className="rounded-3xl border border-stone-200 bg-stone-50 p-8"
                >
                  <Quote className="h-6 w-6 text-orange-700" aria-hidden="true" />
                  <blockquote className="mt-4 text-lg text-stone-800">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figure className="mt-6 flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={`${t.name}의 프로필 사진`}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <figcaption>
                      <span className="block text-sm font-semibold text-stone-900">{t.name}</span>
                      <span className="block text-sm text-stone-500">{t.role}</span>
                    </figcaption>
                  </figure>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" aria-labelledby="cta-heading" className="mx-6 my-24 lg:mx-8">
          <div className="relative isolate overflow-hidden rounded-[2.5rem]">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1600&q=80"
                alt="빈티지 의류 매장 내부, 옷걸이 랙이 늘어선 모습"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/75" />
            </div>
            <motion.div
              className="relative mx-auto max-w-2xl px-6 py-24 text-center sm:py-32"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
            >
              <h2
                id="cta-heading"
                className="text-balance text-[clamp(2rem,4vw,3rem)] font-[family-name:var(--font-display)] tracking-tight text-stone-50"
              >
                지금 취향을 등록하고
                <br />
                AI가 <em className="text-orange-300">다시</em> 고른 첫 매물을 받아보세요
              </h2>
              <p className="mt-4 text-lg text-stone-300">가입은 1분이면 충분해요. 언제든 해지할 수 있어요.</p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <motion.a
                  href="/signup"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-stone-50 px-7 py-3 text-sm font-semibold text-stone-900 shadow-sm transition-colors hover:bg-white ${focusRingOnDark}`}
                >
                  무료로 시작하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </motion.a>
                <motion.a
                  href="#features"
                  whileHover={hoverButton}
                  whileTap={tapButton}
                  className={`inline-flex min-h-11 items-center justify-center rounded-full border border-stone-500 px-7 py-3 text-sm font-semibold text-stone-50 transition-colors hover:bg-stone-800 ${focusRingOnDark}`}
                >
                  기능 다시 보기
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl font-semibold text-stone-50 font-[family-name:var(--font-display)]">repick</p>
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
            <p>© 2026 repick Inc. All rights reserved.</p>
            <ul className="flex gap-6">
              <li>
                <a href="/terms" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
                  이용약관
                </a>
              </li>
              <li>
                <a href="/privacy" className={`rounded-md hover:text-stone-300 ${focusRingOnDark}`}>
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
