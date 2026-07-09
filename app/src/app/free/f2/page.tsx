"use client";

import { useId, useState, type FormEvent } from "react";
import Image from "next/image";
import { Anton, Black_Han_Sans, Space_Mono } from "next/font/google";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowUp,
  AtSign,
  Check,
  MessageCircle,
  Mail,
  Sparkles,
  Zap,
} from "lucide-react";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const blackHan = Black_Han_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-blackhan",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-riotmono",
  display: "swap",
});

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "#manifesto", label: "매니페스토" },
  { href: "#lookbook", label: "룩북" },
  { href: "#customize", label: "커스터마이즈" },
  { href: "#drop", label: "드랍" },
];

const MARQUEE_ITEMS = [
  "규칙 없음",
  "무한 조합",
  "오늘만 존재하는 컬러",
  "NO RULES, ONLY PIGMENT",
  "재판매 불가",
];

const STATS = [
  { value: "87", unit: "색", label: "베이스 안료" },
  { value: "0", unit: "개", label: "고정 룰" },
  { value: "3", unit: "분", label: "완성까지" },
  { value: "∞", unit: "", label: "조합 가능 수" },
];

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
  rotate: string;
};

const GALLERY: GalleryItem[] = [
  {
    id: "look-01",
    src: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=900&q=75",
    alt: "다양한 색상의 아이섀도 팔레트를 붓으로 여는 손",
    caption: "팔레트, 그러나 지도는 없음",
    tag: "LOOK 01",
    rotate: "-rotate-3",
  },
  {
    id: "look-02",
    src: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=900&q=75",
    alt: "분홍색 배경 위에 놓인 노란 바나나 한 개",
    caption: "평범함에 대한 반박",
    tag: "LOOK 02",
    rotate: "rotate-2",
  },
  {
    id: "look-03",
    src: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=900&q=75",
    alt: "파란 배경 위에 놓인 화려한 플로럴 패턴의 하이힐과 슬리퍼",
    caption: "발끝까지 폭동",
    tag: "LOOK 03",
    rotate: "rotate-3",
  },
  {
    id: "look-04",
    src: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=900&q=75",
    alt: "검은 배경 위에 흩뿌려진 빨간색 SALE 태그 여러 장",
    caption: "예측 불가능한 드랍 신호",
    tag: "LOOK 04",
    rotate: "-rotate-2",
  },
];

type Swatch = {
  id: "pink" | "yellow" | "cobalt" | "violet";
  ko: string;
  en: string;
  desc: string;
};

// Tailwind's static scanner needs the full class string to appear literally
// in source, so background color is resolved through this lookup map rather
// than a runtime-built template string.
const SWATCH_BG_CLASS: Record<Swatch["id"], string> = {
  pink: "bg-[var(--riot-pink)]",
  yellow: "bg-[var(--riot-yellow)]",
  cobalt: "bg-[var(--riot-cobalt)]",
  violet: "bg-[var(--riot-violet)]",
};

const SWATCHES: Swatch[] = [
  {
    id: "pink",
    ko: "라이엇 핑크",
    en: "RIOT PINK",
    desc: "경고문처럼 튀는 형광 핑크. 첫 배치 완판 컬러.",
  },
  {
    id: "yellow",
    ko: "볼트 옐로우",
    en: "VOLT YELLOW",
    desc: "정면에서 봐도 눈을 피할 수 없는 전압 옐로우.",
  },
  {
    id: "cobalt",
    ko: "코발트 크래시",
    en: "COBALT CRASH",
    desc: "차갑고 단단한 파랑. 무드를 깨는 용도.",
  },
  {
    id: "violet",
    ko: "울트라 바이올렛",
    en: "ULTRA VIOLET",
    desc: "밤과 새벽 사이, 규정 불가능한 보라.",
  },
];

const TESTIMONIALS = [
  {
    quote: "이걸 바르고 회사 못 감. 그게 포인트.",
    name: "@color_criminal",
    rotate: "-rotate-2",
  },
  {
    quote: "3분 만에 섞은 컬러가 브랜드 대표색보다 낫다.",
    name: "무명의 조색사",
    rotate: "rotate-1",
  },
  {
    quote: "환불 안 해줘도 됨. 이건 예술이었음.",
    name: "첫 드랍 생존자",
    rotate: "rotate-3",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "브랜드",
    links: ["소개", "매니페스토", "룩북"],
  },
  {
    title: "드랍",
    links: ["웨이틀리스트", "재입고 알림", "지난 드랍 아카이브"],
  },
  {
    title: "고객지원",
    links: ["자주 묻는 질문", "배송 안내", "문의하기"],
  },
];

/* ------------------------------------------------------------------ */
/* Shared style tokens                                                 */
/* ------------------------------------------------------------------ */

const focusDark =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--riot-yellow)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--riot-black)]";
const focusOnLight =
  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--riot-cobalt)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--riot-yellow)]";

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const reduceMotion = useReducedMotion();
  const [activeSwatch, setActiveSwatch] = useState<Swatch>(SWATCHES[0]);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const emailId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  const floatAnim = reduceMotion
    ? {}
    : {
        y: [0, -14, 0],
        rotate: [0, 6, 0],
      };

  return (
    <div
      className={`${anton.variable} ${blackHan.variable} ${spaceMono.variable} f2-scope bg-[var(--riot-black)]`}
    >
      <style>{`
        .f2-scope {
          --riot-black: #0b0b12;
          --riot-white: #f5f5f0;
          --riot-yellow: #ffe600;
          --riot-pink: #ff2e7d;
          --riot-cobalt: #2440ff;
          --riot-violet: #8b2fff;
          --riot-cream: #fff3d6;
          font-family: var(--font-sans);
        }
        .f2-scope .riot-display {
          font-family: var(--font-blackhan), var(--font-sans);
        }
        .f2-scope .riot-en {
          font-family: var(--font-anton), var(--font-sans);
        }
        .f2-scope .riot-mono {
          font-family: var(--font-riotmono), monospace;
        }
        .f2-marquee-track {
          animation: f2-marquee 24s linear infinite;
        }
        @keyframes f2-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .f2-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-[var(--riot-yellow)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--riot-black)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--riot-black)]"
      >
        본문으로 건너뛰기
      </a>

      {/* Marquee ticker */}
      <div
        aria-hidden="true"
        className="riot-mono overflow-hidden border-b-4 border-[var(--riot-yellow)] bg-[var(--riot-black)] py-2 text-[var(--riot-yellow)]"
      >
        <div className="f2-marquee-track flex w-max whitespace-nowrap text-xs font-bold tracking-widest sm:text-sm">
          {[0, 1].map((rep) => (
            <span key={rep} className="flex items-center">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={`${rep}-${i}`} className="mx-4 flex items-center gap-4">
                  <Zap className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-[var(--riot-yellow)] bg-[var(--riot-black)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a
            href="#main"
            className={`riot-en shrink-0 text-2xl tracking-tight text-[var(--riot-white)] sm:text-3xl ${focusDark} rounded`}
          >
            PIGMENT<span className="text-[var(--riot-pink)]">RIOT</span>
          </a>

          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`riot-mono min-h-11 rounded-md px-4 py-3 text-sm font-bold text-[var(--riot-white)] transition-colors hover:text-[var(--riot-yellow)] ${focusDark}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#drop"
            className={`riot-mono inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-[var(--riot-yellow)] px-5 py-3 text-xs font-bold text-[var(--riot-black)] transition-transform hover:-translate-y-0.5 sm:text-sm ${focusDark}`}
          >
            라이엇 합류
            <ArrowUpRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="relative overflow-hidden px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
          {/* decorative floating badges */}
          <motion.div
            aria-hidden="true"
            animate={floatAnim}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="riot-mono absolute top-24 right-4 hidden -rotate-6 rounded-full border-2 border-[var(--riot-cobalt)] bg-[var(--riot-black)] px-4 py-2 text-xs font-bold text-[var(--riot-white)] sm:block lg:right-16"
          >
            100% 무규칙 안료
          </motion.div>
          <motion.div
            aria-hidden="true"
            animate={floatAnim}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="riot-mono absolute bottom-10 left-4 hidden rotate-3 rounded-full border-2 border-[var(--riot-pink)] bg-[var(--riot-black)] px-4 py-2 text-xs font-bold text-[var(--riot-pink)] sm:block lg:left-20"
          >
            재고 예측 불가
          </motion.div>

          <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="riot-mono mb-5 inline-flex items-center gap-2 rounded-full border-2 border-[var(--riot-yellow)] px-4 py-1.5 text-xs font-bold text-[var(--riot-yellow)]"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                컬러 랩, 규칙 없음
              </motion.p>

              <motion.h1
                initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="riot-display text-[clamp(3rem,9vw,6.5rem)] leading-[0.88] tracking-tight"
              >
                <span className="block text-[var(--riot-yellow)]">색은</span>
                <span className="block text-[var(--riot-pink)]">타협하지</span>
                <span className="block text-[var(--riot-white)]">않는다</span>
              </motion.h1>

              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-7 max-w-xl text-base leading-relaxed text-[var(--riot-white)]/85 sm:text-lg"
              >
                피그먼트 라이엇은 87가지 하이 안료를 매번 다시 섞는 무규칙 컬러
                랩입니다. 정해진 팔레트는 없습니다. 3분 안에 당신만의 배치를
                조합하고, 그 컬러는 오늘 하루만 존재합니다.
              </motion.p>

              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#drop"
                  className={`riot-mono inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--riot-pink)] px-6 py-3.5 text-sm font-bold text-[var(--riot-black)] transition-transform hover:-translate-y-0.5 ${focusDark}`}
                >
                  라이엇에 합류하기
                  <ArrowUpRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </a>
                <a
                  href="#manifesto"
                  className={`riot-mono inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--riot-white)] px-6 py-3.5 text-sm font-bold text-[var(--riot-white)] transition-colors hover:bg-[var(--riot-white)] hover:text-[var(--riot-black)] ${focusDark}`}
                >
                  매니페스토 읽기
                </a>
              </motion.div>
            </div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md rounded-2xl border-4 border-[var(--riot-yellow)] p-2 sm:max-w-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1502691876148-a84978e59af8?w=1000&q=80"
                  alt="빨강, 파랑, 노랑, 초록 패널이 겹겹이 이어진 무지개색 통로 사진"
                  fill
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="riot-mono absolute -bottom-4 -left-4 rotate-[-6deg] rounded-full bg-[var(--riot-cobalt)] px-4 py-1.5 text-xs font-bold text-[var(--riot-white)] shadow-lg">
                NO TWO BATCH ALIKE
              </span>
            </motion.div>
          </div>
        </section>

        {/* MANIFESTO — yellow block */}
        <section
          id="manifesto"
          className="bg-[var(--riot-yellow)] px-5 py-16 text-[var(--riot-black)] sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-[1400px]">
            <p className="riot-mono mb-4 text-xs font-bold tracking-widest">
              MANIFESTO
            </p>
            <p className="riot-display max-w-4xl text-[clamp(1.8rem,4.2vw,3.2rem)] leading-[1.15]">
              우리는 무채색을 믿지 않는다. 하나의 팔레트, 하나의 룰, 하나의
              무드 — 지겹다. 피그먼트 라이엇은 배치마다 색을 다시 섞는다.
              같은 컬러는 두 번 존재하지 않는다. 당신이 곧 컬러다.
            </p>

            <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="riot-en text-[clamp(2.4rem,6vw,4rem)] leading-none">
                    {stat.value}
                    <span className="text-xl">{stat.unit}</span>
                  </p>
                  <p className="riot-mono mt-2 text-xs font-bold tracking-wide sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOOKBOOK — black collage */}
        <section id="lookbook" className="bg-[var(--riot-black)] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <h2 className="riot-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.95] text-[var(--riot-white)]">
                룩북: <span className="text-[var(--riot-pink)]">오늘의 사고</span>
              </h2>
              <p className="riot-mono max-w-xs text-sm text-[var(--riot-white)]/70">
                계획대로 나온 조합은 하나도 없습니다. 매 컷이 다른 배치의
                증거입니다.
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`group ${item.rotate} transition-transform duration-300 hover:rotate-0`}
                >
                  <div className="overflow-hidden rounded-xl border-2 border-[var(--riot-white)]/15">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="riot-mono absolute top-3 left-3 rounded-full bg-[var(--riot-black)]/85 px-3 py-1 text-[10px] font-bold text-[var(--riot-yellow)]">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                  <p className="riot-mono mt-3 text-sm font-bold text-[var(--riot-white)]">
                    {item.caption}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* CUSTOMIZE — cobalt block, interactive swatches */}
        <section
          id="customize"
          className="bg-[var(--riot-cobalt)] px-5 py-20 text-[var(--riot-white)] sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-[1400px]">
            <h2 className="riot-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[0.95]">
              네가 고른다,
              <br className="hidden sm:block" /> 우리는 안 말린다
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--riot-white)]/85 sm:text-lg">
              베이스 안료 4종을 골라 미리보기를 확인하세요. 실제 조합은
              드랍마다 87가지 이상으로 늘어납니다.
            </p>

            <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div
                role="group"
                aria-label="안료 색상 선택"
                className="grid grid-cols-2 gap-4"
              >
                {SWATCHES.map((sw) => {
                  const active = sw.id === activeSwatch.id;
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setActiveSwatch(sw)}
                      className={`riot-mono relative flex min-h-[88px] flex-col items-start justify-between rounded-xl border-2 p-4 text-left text-xs font-bold transition-all ${focusOnLight} ${
                        active
                          ? "border-[var(--riot-white)] bg-[var(--riot-black)]/25"
                          : "border-[var(--riot-white)]/30 hover:border-[var(--riot-white)]/70"
                      }`}
                    >
                      <span
                        className={`h-6 w-6 rounded-full border-2 border-[var(--riot-white)] ${SWATCH_BG_CLASS[sw.id]}`}
                        aria-hidden="true"
                      />
                      <span>{sw.ko}</span>
                      {active && (
                        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--riot-white)] text-[var(--riot-cobalt)]">
                          <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSwatch.id}
                  initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border-2 border-[var(--riot-white)]/30 bg-[var(--riot-black)]/20 p-8"
                >
                  <div
                    className={`mb-6 h-24 w-full rounded-xl ${SWATCH_BG_CLASS[activeSwatch.id]}`}
                    aria-hidden="true"
                  />
                  <p className="riot-mono text-xs tracking-widest text-[var(--riot-white)]/85">
                    {activeSwatch.en}
                  </p>
                  <p className="riot-display mt-1 text-3xl">{activeSwatch.ko}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--riot-white)]/85">
                    {activeSwatch.desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS — violet */}
        <section className="bg-[var(--riot-violet)] px-5 py-20 text-[var(--riot-white)] sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[1400px]">
            <h2 className="riot-display text-[clamp(2rem,5vw,3.4rem)] leading-[0.95]">
              생존자들의 목소리
            </h2>
            <ul className="mt-12 grid gap-8 sm:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <li
                  key={t.name}
                  className={`${t.rotate} rounded-2xl border-2 border-[var(--riot-white)]/30 bg-[var(--riot-black)]/20 p-6 transition-transform hover:rotate-0`}
                >
                  <p className="text-lg leading-snug">&ldquo;{t.quote}&rdquo;</p>
                  <p className="riot-mono mt-5 text-xs font-bold text-[var(--riot-white)]/85">
                    — {t.name}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DROP / CTA — image bg */}
        <section id="drop" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1600&q=70"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[var(--riot-black)]/80" />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="riot-display text-[clamp(2.2rem,6vw,4.2rem)] leading-[0.95] text-[var(--riot-white)]">
              다음 드랍은,
              <br />
              <span className="text-[var(--riot-yellow)]">아무도 모른다</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--riot-white)]/85 sm:text-lg">
              예고 없이 풀립니다. 이메일을 남기면 일반 공지보다 5분 먼저
              알려드립니다. 그 5분이 완판 여부를 가릅니다.
            </p>

            {submitted ? (
              <p
                role="status"
                className="riot-mono mt-9 inline-flex items-center gap-2 rounded-full border-2 border-[var(--riot-yellow)] px-6 py-3.5 text-sm font-bold text-[var(--riot-yellow)]"
              >
                <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                합류 완료. 드랍 5분 전에 연락드립니다.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
                noValidate
              >
                <label htmlFor={emailId} className="sr-only">
                  이메일 주소
                </label>
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`min-h-12 flex-1 rounded-full border-2 border-[var(--riot-white)]/40 bg-[var(--riot-black)]/60 px-5 text-sm text-[var(--riot-white)] placeholder:text-[var(--riot-white)]/50 ${focusDark}`}
                />
                <button
                  type="submit"
                  className={`riot-mono inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--riot-yellow)] px-6 text-sm font-bold text-[var(--riot-black)] transition-transform hover:-translate-y-0.5 ${focusDark}`}
                >
                  먼저 알림받기
                  <ArrowUpRight className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t-4 border-[var(--riot-yellow)] bg-[var(--riot-black)] px-5 py-14 text-[var(--riot-white)] sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <p className="riot-en text-2xl">
                PIGMENT<span className="text-[var(--riot-pink)]">RIOT</span>
              </p>
              <p className="mt-3 max-w-xs text-sm text-[var(--riot-white)]/70">
                규칙 없는 안료 연구소. 서울에서 매달 다른 색을 만듭니다.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  aria-label="피그먼트 라이엇 소셜 채널"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--riot-white)]/30 transition-colors hover:border-[var(--riot-yellow)] hover:text-[var(--riot-yellow)] ${focusDark}`}
                >
                  <AtSign className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="https://community.pigmentriot.co"
                  aria-label="피그먼트 라이엇 커뮤니티"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--riot-white)]/30 transition-colors hover:border-[var(--riot-yellow)] hover:text-[var(--riot-yellow)] ${focusDark}`}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href="mailto:hello@pigmentriot.co"
                  aria-label="피그먼트 라이엇에 이메일 보내기"
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--riot-white)]/30 transition-colors hover:border-[var(--riot-yellow)] hover:text-[var(--riot-yellow)] ${focusDark}`}
                >
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="riot-mono text-xs font-bold tracking-widest text-[var(--riot-yellow)]">
                  {col.title.toUpperCase()}
                </p>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#main"
                        className={`inline-block min-h-11 py-1.5 text-sm text-[var(--riot-white)]/80 transition-colors hover:text-[var(--riot-white)] ${focusDark} rounded`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-[var(--riot-white)]/15 pt-8 sm:flex-row">
            <p className="riot-mono text-xs text-[var(--riot-white)]/60">
              © 2026 PIGMENT RIOT LAB. 색은 타협하지 않는다.
            </p>
            <a
              href="#main"
              className={`riot-mono inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-[var(--riot-white)]/30 px-4 py-2.5 text-xs font-bold transition-colors hover:border-[var(--riot-yellow)] hover:text-[var(--riot-yellow)] ${focusDark}`}
            >
              맨 위로
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
