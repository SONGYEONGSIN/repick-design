"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Sparkles,
  Fingerprint,
  Waves,
  Droplet,
  Zap,
  Feather,
  ArrowRight,
  ChevronDown,
  Mail,
} from "lucide-react";
import styles from "./f10.module.css";

/* ── reduced-motion: OS 설정을 매체 쿼리로 직접 구독 (framer의 useReducedMotion 우회) ── */
function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getReducedMotionServerSnapshot() {
  return false;
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

/* ── 스크롤 진입 시 나타나는 래퍼. reduced-motion이면 초기 상태부터 완전히 보임 ── */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const TRIGGER_WORDS = [
  "사각사각 · 종이",
  "탁, 탁, 탁 · 타건",
  "속삭임 · 위스퍼",
  "빗소리 · 창문",
  "얼음 부딪힘 · 유리잔",
  "모닥불 · 장작",
  "머리 빗기 · 브러시",
  "파도 · 자갈",
  "붓질 · 캔버스",
  "종이 넘김 · 책",
];

const STEPS = [
  {
    n: "01",
    icon: Mic,
    title: "청취",
    desc: "좋아하는 소리를 녹음하거나, 결 라이브러리에 쌓인 1,200여 개 트리거 중 하나를 고릅니다.",
  },
  {
    n: "02",
    icon: Sparkles,
    title: "변환",
    desc: "온디바이스 AI가 파형의 주파수·리듬·질감을 분석해 촉감 패턴과 색 그레인으로 실시간 번역합니다.",
  },
  {
    n: "03",
    icon: Fingerprint,
    title: "감각",
    desc: "손목 밴드가 진동으로 소리의 결을 재생하고, 화면은 그 순간의 색과 질감을 그려냅니다.",
  },
];

const TEXTURES: Array<{
  label: string;
  meta: string;
  span: string;
  bg: string;
}> = [
  {
    label: "사각사각",
    meta: "82Hz · 강도 4",
    span: "sm:col-span-2 sm:row-span-2",
    bg: "bg-[radial-gradient(circle_at_30%_20%,#ff8a5c,transparent_65%),radial-gradient(circle_at_80%_80%,#7a3d1f,transparent_60%)]",
  },
  {
    label: "빗소리",
    meta: "210Hz · 강도 6",
    span: "sm:col-span-1 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_60%_30%,#7cf6c8,transparent_60%),radial-gradient(circle_at_20%_80%,#1f4f43,transparent_65%)]",
  },
  {
    label: "속삭임",
    meta: "45Hz · 강도 3",
    span: "sm:col-span-1 sm:row-span-2",
    bg: "bg-[radial-gradient(circle_at_40%_60%,#b18cff,transparent_60%),radial-gradient(circle_at_80%_20%,#3a2a5c,transparent_65%)]",
  },
  {
    label: "얼음 부딪힘",
    meta: "640Hz · 강도 8",
    span: "sm:col-span-1 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_50%_40%,#9fe8ff,transparent_60%),radial-gradient(circle_at_10%_90%,#0f3a4a,transparent_65%)]",
  },
  {
    label: "모닥불",
    meta: "120Hz · 강도 5",
    span: "sm:col-span-1 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_50%_50%,#ff6b4a,transparent_60%),radial-gradient(circle_at_90%_10%,#521f14,transparent_65%)]",
  },
  {
    label: "키보드 타건",
    meta: "310Hz · 강도 7",
    span: "sm:col-span-2 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_25%_70%,#ffd36e,transparent_60%),radial-gradient(circle_at_75%_30%,#5c4415,transparent_65%)]",
  },
  {
    label: "파도",
    meta: "55Hz · 강도 4",
    span: "sm:col-span-1 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_35%_35%,#6ec8ff,transparent_60%),radial-gradient(circle_at_85%_85%,#123a55,transparent_65%)]",
  },
  {
    label: "붓질",
    meta: "95Hz · 강도 2",
    span: "sm:col-span-1 sm:row-span-1",
    bg: "bg-[radial-gradient(circle_at_55%_45%,#ff9ecf,transparent_60%),radial-gradient(circle_at_15%_15%,#521f3a,transparent_65%)]",
  },
];

const FEATURES = [
  { icon: Droplet, text: "생활 방수 IPX7 — 세안 중에도 착용할 수 있습니다." },
  { icon: Zap, text: "8일 배터리 — 매일 충전을 잊어도 되는 감각." },
  { icon: Waves, text: "저지연 블루투스 5.4 — 소리와 촉감의 오차 0.03초." },
  { icon: Feather, text: "18g 초경량 — 하루 종일 존재를 잊게 되는 무게." },
];

const TESTIMONIALS = [
  {
    quote: "빗소리를 듣는데 손목이 먼저 젖는 기분이었어요.",
    name: "서연",
    role: "베타 테스터 #0142",
    rotate: "-rotate-2",
  },
  {
    quote: "속삭임 트리거를 켜니 목덜미가 아니라 눈이 먼저 반응했어요.",
    name: "도윤",
    role: "사운드 디자이너",
    rotate: "rotate-1",
  },
  {
    quote: "이건 이어폰이 아니라 새로운 감각기관이다.",
    name: "하은",
    role: "ASMR 크리에이터",
    rotate: "-rotate-1",
  },
];

function HeroCursorGlow() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      className="absolute inset-0 hidden overflow-hidden sm:block"
      aria-hidden="true"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onPointerLeave={() => setPos(null)}
    >
      {pos ? (
        <div
          className="pointer-events-none absolute h-40 w-40 rounded-full bg-[#f5ede4] opacity-[0.08] blur-2xl transition-transform duration-300 ease-out"
          style={{ transform: `translate(${pos.x - 80}px, ${pos.y - 80}px)` }}
        />
      ) : null}
    </div>
  );
}

export default function LandingF10Client({ fontVariable }: { fontVariable: string }) {
  const reduced = usePrefersReducedMotion();
  const marqueeItems = [...TRIGGER_WORDS, ...TRIGGER_WORDS];
  const [emailValue, setEmailValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (submitted) statusRef.current?.focus();
  }, [submitted]);

  return (
    <div className={`${fontVariable} bg-[#0b0806] text-[#f5ede4]`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[#f5ede4] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[#0b0806] focus:outline-none"
      >
        본문으로 건너뛰기
      </a>

      {/* film-grain overlay */}
      <div
        className={`${styles.grain} pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-overlay`}
        aria-hidden="true"
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#f5ede4]/10 bg-[#0b0806]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
          <a
            href="#top"
            className="flex items-baseline gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]"
          >
            <span className="text-2xl font-[family-name:var(--font-song)]">
              결
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.35em] text-[#f5ede4]/50 sm:inline">
              Gyeol
            </span>
          </a>
          <nav aria-label="주 메뉴" className="hidden items-center gap-8 md:flex">
            {[
              ["#how", "작동원리"],
              ["#gallery", "질감 갤러리"],
              ["#device", "디바이스"],
              ["#waitlist", "얼리 액세스"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#f5ede4]/70 transition-colors hover:text-[#f5ede4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]"
              >
                {label}
              </a>
            ))}
          </nav>
          <a
            href="#waitlist"
            className="inline-flex min-h-11 items-center rounded-full bg-[#ff8a5c] px-5 text-sm font-semibold text-[#1a0f08] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5ede4] active:scale-95"
          >
            얼리 액세스
          </a>
        </div>
      </header>

      <main id="main">
        {/* ── HERO ── */}
        <section
          id="top"
          className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-24 pb-20 sm:px-8"
        >
          <div className={`${styles.blob} ${styles.blobOne}`} aria-hidden="true" />
          <div className={`${styles.blob} ${styles.blobTwo}`} aria-hidden="true" />
          <div className={`${styles.blob} ${styles.blobThree}`} aria-hidden="true" />
          <HeroCursorGlow />

          <div className="relative z-10 mx-auto w-full max-w-5xl">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 font-mono text-[11px] uppercase tracking-[0.4em] text-[#7cf6c8]"
            >
              Synesthetic Audio Wearable — Early Access 2026
            </motion.p>

            <motion.h1
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[15vw] leading-[0.95] font-normal sm:text-7xl md:text-8xl lg:text-[7.5rem] font-[family-name:var(--font-song)]"
            >
              소리에는
              <br />
              <em className="not-italic text-[#ff8a5c]">결</em>이 있다
            </motion.h1>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 max-w-xl text-base leading-relaxed text-[#f5ede4]/75 sm:text-lg"
            >
              결은 속삭임, 빗소리, 종이 넘기는 소리를 촉감과 색으로 번역하는 공감각
              웨어러블입니다. 듣는 것을 넘어, 만지고 보는 감각으로.
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <a
                href="#waitlist"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ff8a5c] px-7 py-3 text-sm font-semibold text-[#1a0f08] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5ede4] active:scale-95"
              >
                얼리 액세스 신청
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#how"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#f5ede4]/25 px-7 py-3 text-sm font-semibold text-[#f5ede4] transition-colors hover:border-[#f5ede4]/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]"
              >
                3단계 작동 원리 보기
              </a>
            </motion.div>
          </div>

          <a
            href="#manifesto"
            className={`${styles.scrollCue} absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-[#f5ede4]/50 hover:text-[#f5ede4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]`}
            aria-label="다음 섹션으로 스크롤"
          >
            <ChevronDown className="h-6 w-6" aria-hidden="true" />
          </a>
        </section>

        {/* ── MARQUEE ── */}
        <div className="border-y border-[#f5ede4]/10 bg-[#120c08] py-4">
          <div className={styles.marqueeViewport}>
            <ul className={`${styles.marqueeTrack} m-0 list-none p-0`}>
              {marqueeItems.map((word, i) => (
                <li
                  key={`${word}-${i}`}
                  aria-hidden={i >= TRIGGER_WORDS.length ? "true" : undefined}
                  className="mx-4 shrink-0 font-mono text-sm uppercase tracking-[0.15em] text-[#f5ede4]/60 sm:text-base"
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── MANIFESTO ── */}
        <section id="manifesto" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
          <h2 className="sr-only">브랜드 선언</h2>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <blockquote
                className="text-3xl leading-snug text-[#f5ede4] sm:text-4xl font-[family-name:var(--font-song)]"
              >
                “우리는 소리를 들었다고 말하지만,
                <br />
                사실은 느낀 것이다.”
                <footer className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-[#f5ede4]/55 not-italic">
                  결 디자인 노트, 2026
                </footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.1} className="flex flex-col justify-between gap-10">
              <p className="text-base leading-relaxed text-[#f5ede4]/75 sm:text-lg">
                결은 청각이 촉각·시각과 분리되어 있다는 전제를 의심하는 데서
                출발했습니다. ASMR을 듣는 순간 우리 피부는 이미 반응하고 있습니다.
                결은 그 반응을 밴드의 진동과 화면의 빛으로 증폭시켜, 소리가 몸
                전체의 경험이 되도록 만듭니다.
              </p>
              <dl className="grid grid-cols-3 gap-4 border-t border-[#f5ede4]/10 pt-6">
                {[
                  ["0.03초", "변환 지연"],
                  ["12,400+", "대기 중인 테스터"],
                  ["3가지 감각", "동시 자극"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd
                      className="text-xl text-[#7cf6c8] sm:text-2xl font-[family-name:var(--font-song)]"
                    >
                      {value}
                    </dd>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#f5ede4]/60">
                      {label}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how" className="border-t border-[#f5ede4]/10 bg-[#120c08] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2
                className="text-4xl sm:text-5xl font-[family-name:var(--font-song)]"
              >
                3단계로 완성되는 공감각
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
                <Reveal key={n} delay={i * 0.1}>
                  <div className="h-full rounded-3xl border border-[#f5ede4]/10 bg-[#0b0806] p-8">
                    <span className="font-mono text-xs text-[#ff8a5c]">{n}</span>
                    <Icon className="mt-6 h-7 w-7 text-[#7cf6c8]" aria-hidden="true" />
                    <h3 className="mt-6 text-2xl font-[family-name:var(--font-song)]">
                      {title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#f5ede4]/65">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEXTURE GALLERY ── */}
        <section id="gallery" className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2
                className="text-4xl sm:text-5xl font-[family-name:var(--font-song)]"
              >
                질감 갤러리
              </h2>
              <p className="mt-4 max-w-xl text-base text-[#f5ede4]/65">
                모든 소리는 고유한 결을 가집니다. 실제 사용자들이 변환한 여덟 가지
                질감입니다.
              </p>
            </Reveal>

            <div className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-4 sm:grid-cols-4">
              {TEXTURES.map((t, i) => (
                <Reveal key={t.label} delay={(i % 4) * 0.06} className={t.span}>
                  <div
                    className={`group relative h-full overflow-hidden rounded-2xl border border-[#f5ede4]/10 bg-[#120c08] transition-transform duration-300 hover:scale-[1.02] ${t.bg}`}
                  >
                    <div className="absolute inset-0 bg-[#0b0806]/20 transition-opacity group-hover:opacity-0" />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#0b0806] via-[#0b0806]/70 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-lg font-semibold text-[#f5ede4]">{t.label}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#f5ede4]/80">
                        {t.meta}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── DEVICE ── */}
        <section id="device" className="border-t border-[#f5ede4]/10 bg-[#120c08] px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">
            <Reveal>
              <div className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96">
                <div
                  className={`${styles.deviceRing} absolute inset-0 rounded-full border border-dashed border-[#ff8a5c]/40`}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-8 rounded-full border border-[#7cf6c8]/30"
                  aria-hidden="true"
                />
                <div className="flex items-end gap-1.5" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                    <span
                      key={bar}
                      className={`${styles.wavebar} block h-14 w-2 rounded-full bg-[#f5ede4]`}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2
                className="text-4xl sm:text-5xl font-[family-name:var(--font-song)]"
              >
                결 밴드
              </h2>
              <p className="mt-4 text-base text-[#f5ede4]/65">
                피부에 닿는 순간부터 시작되는 촉각 언어.
              </p>
              <ul className="mt-8 flex flex-col gap-5">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-4">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#ff8a5c]" aria-hidden="true" />
                    <span className="text-sm leading-relaxed text-[#f5ede4]/80 sm:text-base">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="testimonials" className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2
                className="text-4xl sm:text-5xl font-[family-name:var(--font-song)]"
              >
                베타 테스터의 속삭임
              </h2>
            </Reveal>
            <ul className="mt-14 grid gap-6 sm:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.1}>
                  <li
                    className={`${t.rotate} h-full rounded-3xl border border-[#f5ede4]/10 bg-[#120c08] p-7 transition-transform hover:rotate-0`}
                  >
                    <p className="text-lg leading-relaxed text-[#f5ede4]">“{t.quote}”</p>
                    <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#f5ede4]/60">
                      {t.name} · {t.role}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── WAITLIST CTA ── */}
        <section
          id="waitlist"
          className="relative overflow-hidden border-t border-[#f5ede4]/10 px-5 py-24 sm:px-8 sm:py-32"
        >
          <div className={styles.blobFooter} aria-hidden="true" />
          <div className="relative mx-auto max-w-3xl text-center">
            <Reveal>
              <h2
                className="text-4xl sm:text-6xl font-[family-name:var(--font-song)]"
              >
                다음 감각을 예약하세요
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base text-[#f5ede4]/70">
                얼리 액세스는 2026년 가을, 선착순 3,000명에게 먼저 열립니다.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              {submitted ? (
                <p
                  ref={statusRef}
                  tabIndex={-1}
                  role="status"
                  className="mt-10 rounded-full border border-[#7cf6c8]/40 bg-[#7cf6c8]/10 px-6 py-4 text-sm text-[#7cf6c8] outline-none"
                >
                  등록되었습니다. 결이 준비되면 가장 먼저 알려드릴게요.
                </p>
              ) : (
                <form
                  className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label htmlFor="waitlist-email" className="sr-only">
                    이메일 주소
                  </label>
                  <div className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-[#f5ede4]/25 bg-[#120c08] px-5">
                    <Mail className="h-4 w-4 shrink-0 text-[#f5ede4]/45" aria-hidden="true" />
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      placeholder="you@example.com"
                      className="min-h-11 w-full bg-transparent text-sm text-[#f5ede4] placeholder:text-[#f5ede4]/55 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#ff8a5c] px-6 text-sm font-semibold text-[#1a0f08] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5ede4] active:scale-95"
                  >
                    대기 리스트 등록
                  </button>
                </form>
              )}
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5ede4]/55">
                스팸 없이, 결이 준비됐을 때 딱 한 번 알려드립니다.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#f5ede4]/10 px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-3xl font-[family-name:var(--font-song)]">
              결
            </span>
            <p className="mt-3 max-w-xs text-sm text-[#f5ede4]/50">
              모든 소리에는 결이 있다. GYEOL은 청각을 촉각과 시각으로 번역하는
              공감각 웨어러블 브랜드입니다.
            </p>
          </div>
          <nav aria-label="소셜 링크" className="flex gap-6 font-mono text-xs uppercase tracking-[0.2em] text-[#f5ede4]/50">
            <a href="#top" className="hover:text-[#f5ede4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]">
              Instagram
            </a>
            <a href="#top" className="hover:text-[#f5ede4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]">
              Threads
            </a>
            <a href="#waitlist" className="hover:text-[#f5ede4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8a5c]">
              Newsletter
            </a>
          </nav>
        </div>
        <p className="mx-auto mt-10 max-w-6xl border-t border-[#f5ede4]/10 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5ede4]/55">
          © 2026 GYEOL. All senses reserved.
        </p>
      </footer>
    </div>
  );
}
