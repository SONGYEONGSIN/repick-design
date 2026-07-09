"use client";

import { useEffect, useState, type ComponentType, type CSSProperties } from "react";
import Image from "next/image";
import { Gaegu } from "next/font/google";
import { motion, useReducedMotion } from "framer-motion";
import {
  Mic,
  ArrowRight,
  Sparkles,
  Scissors,
  Quote,
  Check,
  Menu,
  X,
} from "lucide-react";
import styles from "./page.module.css";

const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const handFont = "font-[family-name:var(--font-hand)]";

/** 목소리가 실로 짜이기 전, 파형의 떨림을 나타내는 정적 데이터(하이드레이션 안전을 위해 고정값 사용) */
const WAVE_HEIGHTS = [
  32, 54, 28, 68, 45, 80, 38, 92, 50, 63, 35, 72, 48, 85, 40, 58, 30, 75, 52,
  88, 42, 65, 36, 78, 46, 60, 33, 70,
];

const NAV_ITEMS = [
  { href: "#process", label: "짓는 과정" },
  { href: "#gallery", label: "결 보관함" },
  { href: "#atelier", label: "공방" },
  { href: "#pricing", label: "시작하기" },
];

type StepIcon = ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;

const STEPS: { num: string; title: string; desc: string; icon: StepIcon }[] = [
  {
    num: "하나",
    title: "목소리를 담다",
    desc: "마이크를 누르고 자장가, 고백, 안부, 무엇이든 들려주세요. 30초면 충분해요.",
    icon: Mic,
  },
  {
    num: "둘",
    title: "결을 읽다",
    desc: "AI가 파형의 쉼과 떨림, 높낮이를 하나하나 읽어 고유한 무늬로 옮깁니다.",
    icon: Sparkles,
  },
  {
    num: "셋",
    title: "실로 짓다",
    desc: "디지털 무늬로 간직하거나, 공방 장인의 손끝에서 실제 실로 짜여 도착합니다.",
    icon: Scissors,
  },
];

type Swatch = {
  title: string;
  desc: string;
  duration: string;
  a: string;
  b: string;
  c?: string;
  angle?: string;
  variant: "stripe" | "herringbone" | "plaid";
};

const SWATCHES: Swatch[] = [
  {
    title: "자장가, 낮은 음",
    desc: "느린 숨과 낮은 파형이 짙은 남색 물결로 남았습니다.",
    duration: "0:52",
    a: "#2E3A4E",
    b: "#8FA3B8",
    angle: "120deg",
    variant: "stripe",
  },
  {
    title: "고백, 떨리는 숨",
    desc: "말끝이 떨릴 때마다 무늬의 폭이 좁아졌습니다.",
    duration: "1:14",
    a: "#BB4D28",
    b: "#F0B89A",
    angle: "60deg",
    variant: "stripe",
  },
  {
    title: "웃음, 튀는 리듬",
    desc: "짧고 잦은 웃음소리가 촘촘한 지그재그로 남았습니다.",
    duration: "0:23",
    a: "#D6A431",
    b: "#F6EEE1",
    variant: "herringbone",
  },
  {
    title: "안부, 잔잔한 쉼표",
    desc: "긴 침묵 사이사이 다정한 안부가 성긴 결로 남았습니다.",
    duration: "1:47",
    a: "#7C8363",
    b: "#C9CBB0",
    angle: "100deg",
    variant: "stripe",
  },
  {
    title: "축하, 겹치는 목소리",
    desc: "여럿이 함께 외친 순간, 색이 교차하는 격자무늬가 되었습니다.",
    duration: "0:39",
    a: "#BB4D28",
    b: "#2E3A4E",
    c: "#D6A431",
    variant: "plaid",
  },
  {
    title: "편지, 촘촘한 결",
    desc: "끊기지 않고 이어진 말이 가장 촘촘한 결을 남겼습니다.",
    duration: "3:02",
    a: "#5C4433",
    b: "#C9A876",
    angle: "90deg",
    variant: "stripe",
  },
];

const ATELIER = [
  {
    src: "https://images.unsplash.com/photo-1600166898405-da9535204843",
    alt: "가장자리에 흰 술이 달린 손으로 짠 러그가 돌돌 말린 채 놓여 있다",
    region: "안동 공방",
    note: "전통 문양을 되살린 러그 직조",
    rotate: "-rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1615529182904-14819c35db37",
    alt: "라탄 펜던트 조명 두 개와 황토빛 러그가 놓인 아늑한 작업 공간",
    region: "제주 공방",
    note: "자연광 아래에서 실을 고르는 시간",
    rotate: "rotate-1",
  },
  {
    src: "https://images.unsplash.com/photo-1556760544-74068565f05c",
    alt: "촛불 옆에서 손끝으로 천연 염색 오일을 조심스럽게 떨어뜨리는 모습",
    region: "양평 공방",
    note: "식물로 실을 물들이는 전통 염색",
    rotate: "-rotate-1",
  },
  {
    src: "https://images.unsplash.com/photo-1616627561950-9f746e330187",
    alt: "테라코타빛 쿠션과 갈색 줄무늬 리넨 침구의 결 클로즈업",
    region: "결 디테일",
    note: "완성된 무늬의 질감",
    rotate: "rotate-2",
  },
  {
    src: "https://images.unsplash.com/photo-1512909006721-3d6018887383",
    alt: "붉은 줄무늬 끈으로 묶은 선물 상자를 두 손으로 내미는 모습",
    region: "배송 준비",
    note: "완성된 결을 정성껏 포장하는 순간",
    rotate: "-rotate-1",
  },
];

const VOICES = [
  {
    quote:
      "결혼식 축가를 녹음해서 부모님께 태피스트리로 보내드렸어요. 액자보다 오래, 매일 눈에 담아주세요.",
    name: "지은",
    meta: "32세 · 태피스트리",
  },
  {
    quote:
      "돌아가시기 전 할머니의 마지막 목소리를 손수건에 담았습니다. 매일 만지는 게 위로가 됩니다.",
    name: "태오",
    meta: "27세 · 손수건",
  },
  {
    quote:
      "아이가 처음 “엄마”라고 부른 순간을 실로 지었어요. 사진보다 이상하게 더 뭉클해요.",
    name: "서윤",
    meta: "35세 · 디지털 결",
  },
];

const TIERS = [
  {
    name: "디지털 결",
    unit: "첫 결 1개",
    price: "무료",
    desc: "앱 안에서 무늬를 간직하고, 링크로 나누어 보세요.",
    features: ["고해상도 무늬 이미지 저장", "전용 링크로 공유", "원본 음성 30일 보관"],
    cta: "무료로 지어보기",
    highlight: false,
  },
  {
    name: "손 안의 결",
    unit: "손수건 23×23cm",
    price: "68,000원",
    desc: "장인의 손끝에서 실제 실로 짜여 도착하는 손수건.",
    features: ["천연 염색 실 사용", "실크 태그에 문구 각인", "제작 5~7일, 전국 배송"],
    cta: "손수건으로 짓기",
    highlight: true,
  },
  {
    name: "벽에 거는 결",
    unit: "태피스트리 40×60cm",
    price: "148,000원",
    desc: "오래도록 걸어둘 수 있는 대형 태피스트리.",
    features: ["원목 행어 포함", "장인 서명 라벨", "제작 10~14일, 전국 배송"],
    cta: "태피스트리로 짓기",
    highlight: false,
  },
];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rust-dark)]";

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M4 14c0-5 4-9 9-9s9 4 9 9-4 9-9 9"
        stroke="var(--rust)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M24 14c0 5-4 9-9 9s-9-4-9-9 4-9 9-9"
        stroke="var(--indigo)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function swatchStyle(s: Swatch): CSSProperties {
  return {
    "--a": s.a,
    "--b": s.b,
    ...(s.c ? { "--c": s.c } : {}),
    ...(s.angle ? { "--angle": s.angle } : {}),
  } as CSSProperties;
}

function swatchClass(variant: Swatch["variant"]) {
  if (variant === "herringbone") return styles.swatchHerringbone;
  if (variant === "plaid") return styles.swatchPlaid;
  return styles.swatch;
}

export default function Landing() {
  const prefersReducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    const target = 1842;
    const duration = prefersReducedMotion ? 0 : 1600;
    const start = performance.now();
    function tick(now: number) {
      const p = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const formattedCount = new Intl.NumberFormat("ko-KR").format(count);

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className={`${gaegu.variable} ${styles.page} min-h-screen`}>
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:text-white ${focusRing}`}
      >
        본문으로 건너뛰기
      </a>
      <div className={styles.grain} aria-hidden="true" />

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--paper)]/92 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a
            href="#main"
            className={`flex items-center gap-2 rounded-md ${focusRing}`}
          >
            <LogoMark />
            <span className="font-display text-2xl tracking-tight">타래</span>
          </a>

          <nav aria-label="주요 메뉴" className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm text-[var(--ink-soft)]">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`rounded-sm transition-colors hover:text-[var(--rust-dark)] ${focusRing}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href="#pricing"
            className={`hidden min-h-11 items-center gap-2 rounded-full bg-[var(--rust)] px-5 text-sm font-medium text-white transition-colors hover:bg-[var(--rust-dark)] md:inline-flex ${focusRing}`}
          >
            <Mic size={16} aria-hidden="true" />
            목소리 남기기
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-11 w-11 items-center justify-center rounded-md text-[var(--ink)] md:hidden ${focusRing}`}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? "메뉴 닫기" : "메뉴 열기"}</span>
          </button>
        </div>

        <nav
          id="mobile-menu"
          aria-label="모바일 메뉴"
          hidden={!menuOpen}
          className="border-t border-[var(--line)] bg-[var(--paper)] px-5 pb-6 md:hidden"
        >
          <ul className="flex flex-col gap-1 pt-4 text-base">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex min-h-11 items-center rounded-md px-2 text-[var(--ink)] ${focusRing}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#pricing"
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--rust)] px-5 text-sm font-medium text-white ${focusRing}`}
              >
                <Mic size={16} aria-hidden="true" />
                목소리 남기기
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="relative z-[1]">
        {/* HERO */}
        <section id="hero" className="px-5 pt-14 pb-20 sm:px-8 sm:pt-20 sm:pb-28">
          <div className="mx-auto max-w-6xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/50 px-3 py-1 text-xs tracking-[0.2em] text-[var(--ink-soft)]">
              <span aria-hidden="true">●</span> VOICE WEAVING STUDIO
            </p>
            <h1 className="font-display text-[2.6rem] leading-[1.15] sm:text-6xl lg:text-7xl">
              당신의 목소리는
              <br />
              어떤 <span className="text-[var(--rust)]">결</span>을 가졌을까요
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
              타래는 목소리에 담긴 떨림과 쉼, 높낮이를 실의 무늬로 옮겨 짓는
              스튜디오입니다. 30초의 자장가도, 3분의 고백도 — 녹음 한 번이면
              만질 수 있는 것이 됩니다.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href="#pricing"
                className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--rust)] px-6 text-sm font-medium text-white transition-colors hover:bg-[var(--rust-dark)] ${focusRing}`}
              >
                <Mic size={18} aria-hidden="true" />
                목소리 남기기
              </a>
              <a
                href="#gallery"
                className={`inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-medium text-[var(--rust-dark)] underline underline-offset-4 ${focusRing}`}
              >
                짜여진 이야기 둘러보기
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>

            <p className="mt-10 text-sm text-[var(--ink-soft)]">
              <span className="sr-only">
                지금까지 1,842개의 목소리가 실이 되었습니다.
              </span>
              <span aria-hidden="true">
                <span className="font-display text-lg text-[var(--ink)]">
                  {formattedCount}
                </span>
                개의 목소리가 이미 실이 되었습니다.
              </span>
            </p>

            {/* 목소리 -> 실 변환을 보여주는 히어로 비주얼 */}
            <div className="mt-14 grid items-center gap-6 rounded-2xl border border-[var(--line)] bg-white/40 p-6 sm:grid-cols-[1fr_auto_1fr] sm:p-8">
              <div>
                <p className="mb-3 text-xs tracking-[0.15em] text-[var(--ink-soft)]">
                  들려주다
                </p>
                <div
                  className="flex h-20 items-end gap-[3px]"
                  role="img"
                  aria-label="한 사람이 남긴 목소리의 파형 시각화"
                >
                  {WAVE_HEIGHTS.map((h, i) => (
                    <span
                      key={i}
                      className={`${styles.waveBar} ${
                        !prefersReducedMotion ? styles.waveBarAnimated : ""
                      } block w-[3px] rounded-full bg-[var(--indigo)]`}
                      style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden h-6 w-16 items-center sm:flex" aria-hidden="true">
                <svg width="64" height="8" viewBox="0 0 64 8" className="w-full">
                  <motion.line
                    x1="2"
                    y1="4"
                    x2="62"
                    y2="4"
                    stroke="var(--ink-soft)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={styles.threadPath}
                    animate={
                      prefersReducedMotion ? undefined : { strokeDashoffset: [0, -13] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : { duration: 1, repeat: Infinity, ease: "linear" }
                    }
                  />
                </svg>
              </div>

              <div>
                <p className="mb-3 text-xs tracking-[0.15em] text-[var(--ink-soft)] sm:text-right">
                  짓다
                </p>
                <div
                  className={`${swatchClass("stripe")} h-20 w-full rounded-lg shadow-inner`}
                  style={swatchStyle({
                    title: "",
                    desc: "",
                    duration: "",
                    a: "#BB4D28",
                    b: "#F0B89A",
                    angle: "65deg",
                    variant: "stripe",
                  })}
                  role="img"
                  aria-label="목소리가 변환되어 완성된 테라코타빛 실 무늬 미리보기"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className={`${styles.cork} px-5 py-20 sm:px-8 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-[var(--rust-dark)]">HOW IT WORKS</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              세 번의 손길로 완성됩니다
            </h2>

            <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-3">
              {STEPS.map((step) => (
                <motion.div
                  key={step.num}
                  {...revealProps}
                  className="relative rounded-md border border-[var(--line)] bg-[var(--paper)] p-6 pt-8 shadow-sm"
                >
                  <span className={styles.pin} aria-hidden="true" />
                  <p className={`${handFont} text-3xl text-[var(--rust-dark)]`}>{step.num}</p>
                  <step.icon size={22} className="mt-3 text-[var(--indigo)]" aria-hidden={true} />
                  <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-[var(--rust-dark)]">TEXTURE LIBRARY</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              결 보관함
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">
              같은 말이라도 목소리마다 결이 다릅니다. 지금까지 지어진 무늬 중
              여섯 점을 골라봤습니다.
            </p>

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SWATCHES.map((s) => (
                <li key={s.title}>
                  <motion.article
                    {...revealProps}
                    className="group overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper-deep)]/40 shadow-sm transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1"
                  >
                    <div
                      className={`${swatchClass(s.variant)} h-32 w-full`}
                      style={swatchStyle(s)}
                      role="img"
                      aria-label={`${s.title} 무늬 — ${s.desc}`}
                    />
                    <div
                      className={styles.fringe}
                      style={{ "--fringe-color": s.a } as CSSProperties}
                      aria-hidden="true"
                    />
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl">{s.title}</h3>
                        <span className="rounded-full bg-[var(--paper)] px-2 py-0.5 text-xs text-[var(--ink-soft)]">
                          {s.duration}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">
                        {s.desc}
                      </p>
                    </div>
                  </motion.article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ATELIER */}
        <section
          id="atelier"
          className="bg-[var(--paper-deep)]/50 px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-[var(--rust-dark)]">ATELIER NETWORK</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              실이 태어나는 곳, 세 개의 공방
            </h2>
            <p className="mt-4 max-w-2xl text-[var(--ink-soft)]">
              세 지역의 공방이 타래와 함께 실을 짓습니다. 안동에서는 전통
              문양을, 제주에서는 자연광 아래의 색을, 양평에서는 식물로 물들인
              실을 보탭니다.
            </p>

            <ul className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {ATELIER.map((item) => (
                <li key={item.src} className={`relative ${item.rotate}`}>
                  <span className={styles.tape} aria-hidden="true" />
                  <div className="relative aspect-[4/5] overflow-hidden rounded-sm border-4 border-white shadow-md">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <p className={`${handFont} mt-3 text-center text-lg text-[var(--rust-dark)]`}>
                    {item.region}
                  </p>
                  <p className="text-center text-xs text-[var(--ink-soft)]">{item.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* VOICES */}
        <section id="voices" className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-[var(--rust-dark)]">받은 이들의 결</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              말은 흩어져도, 결은 남습니다
            </h2>

            <ul className="mt-12 grid gap-6 sm:grid-cols-3">
              {VOICES.map((v) => (
                <li key={v.name} className="h-full">
                  <blockquote className="flex h-full flex-col rounded-lg border border-[var(--line)] bg-white/60 p-6 shadow-sm">
                    <Quote size={20} className="text-[var(--rust)]" aria-hidden="true" />
                    <p className="mt-3 grow text-[15px] leading-relaxed text-[var(--ink)]">
                      “{v.quote}”
                    </p>
                    <footer className="mt-4 text-sm text-[var(--ink-soft)]">
                      <cite className="not-italic font-medium text-[var(--ink)]">
                        {v.name}
                      </cite>{" "}
                      · {v.meta}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className={`${styles.cork} px-5 py-20 sm:px-8 sm:py-28`}>
          <div className="mx-auto max-w-6xl">
            <p className="text-xs tracking-[0.2em] text-[var(--rust-dark)]">지금, 시작하기</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              어떤 결로 만나고 싶으신가요
            </h2>

            <ul className="mt-12 grid gap-6 lg:grid-cols-3">
              {TIERS.map((t) => (
                <li key={t.name} className="h-full">
                  <div
                    className={`relative flex h-full flex-col rounded-xl border p-7 shadow-sm ${
                      t.highlight
                        ? "border-[var(--rust)] bg-white"
                        : "border-[var(--line)] bg-[var(--paper)]"
                    }`}
                  >
                    {t.highlight && (
                      <span className="absolute -top-3 left-7 rounded-full bg-[var(--rust)] px-3 py-1 text-xs font-medium text-white">
                        가장 많이 선택해요
                      </span>
                    )}
                    <h3 className="font-display text-2xl">{t.name}</h3>
                    <p className="mt-1 text-sm text-[var(--ink-soft)]">{t.unit}</p>
                    <p className="mt-4 font-display text-3xl">{t.price}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">
                      {t.desc}
                    </p>
                    <ul className="mt-5 space-y-2 text-sm">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check
                            size={16}
                            className="mt-0.5 shrink-0 text-[var(--rust-dark)]"
                            aria-hidden="true"
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#hero"
                      className={`mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition-colors ${
                        t.highlight
                          ? "bg-[var(--rust)] text-white hover:bg-[var(--rust-dark)]"
                          : "border border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--paper-deep)]"
                      } ${focusRing}`}
                    >
                      {t.cta}
                      <ArrowRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="cta" className="px-5 py-24 text-center sm:px-8 sm:py-32">
          <div className="mx-auto max-w-2xl">
            <span
              className={`${styles.seal} mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full font-display text-xl text-white`}
              aria-hidden="true"
            >
              타
            </span>
            <h2 className="font-display text-3xl leading-snug sm:text-4xl">
              지금 이 순간도,
              <br />
              언젠가는 실이 될 이야기입니다
            </h2>
            <a
              href="#pricing"
              className={`mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--rust)] px-8 text-sm font-medium text-white transition-colors hover:bg-[var(--rust-dark)] ${focusRing}`}
            >
              <Mic size={18} aria-hidden="true" />
              목소리 남기기
            </a>
            <p className="mt-4 text-sm text-[var(--ink-soft)]">
              첫 결은 무료로 지어드립니다.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <LogoMark />
                <span className="font-display text-xl">타래</span>
              </div>
              <p className="mt-3 max-w-xs text-sm text-[var(--ink-soft)]">
                타래는 잊혀지는 순간을 만질 수 있는 것으로 바꾸는 목소리 방직
                스튜디오입니다.
              </p>
            </div>

            <nav aria-label="바로가기">
              <h3 className="text-xs tracking-[0.15em] text-[var(--ink-soft)]">바로가기</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`rounded-sm hover:text-[var(--rust-dark)] ${focusRing}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="정책">
              <h3 className="text-xs tracking-[0.15em] text-[var(--ink-soft)]">정책</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#" className={`rounded-sm hover:text-[var(--rust-dark)] ${focusRing}`}>
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className={`rounded-sm hover:text-[var(--rust-dark)] ${focusRing}`}>
                    이용약관
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="소셜">
              <h3 className="text-xs tracking-[0.15em] text-[var(--ink-soft)]">소셜</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#" className={`rounded-sm hover:text-[var(--rust-dark)] ${focusRing}`}>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className={`rounded-sm hover:text-[var(--rust-dark)] ${focusRing}`}>
                    YouTube
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className={`${styles.stitch} mt-12`} aria-hidden="true" />

          <p className="mt-6 text-xs text-[var(--ink-soft)]">
            타래 스튜디오 | 대표 김결 | 서울시 성동구 성수이로 12길 8 | 사업자등록번호
            214-00-00000
          </p>
          <p className="mt-1 text-xs text-[var(--ink-soft)]">
            © 2026 Tarae Studio. 모든 결을 소중히 간직합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
