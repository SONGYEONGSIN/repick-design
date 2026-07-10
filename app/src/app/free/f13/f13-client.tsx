"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { Bebas_Neue, Courier_Prime } from "next/font/google";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Play,
  ArrowUpRight,
  WifiOff,
  MapPinOff,
  PhoneOff,
  Timer,
  Circle,
  ChevronDown,
} from "lucide-react";
import styles from "./f13.module.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

/* Bebas Neue / Courier Prime only cover Latin glyphs — reserve them for
   pure-English chrome (wordmark, slugs, timecodes). Korean strings fall back
   to Pretendard (global font-sans) at a heavy weight so headings never mix
   two font files with mismatched baselines/metrics. */
const FONT_DISPLAY = "font-[family-name:var(--font-bebas)]";
const FONT_DISPLAY_KO = "font-sans font-black";
const FONT_SCRIPT = "font-[family-name:var(--font-courier)]";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

/* ---------- reduced-motion: subscribe to matchMedia directly (avoids
   framer-motion's useReducedMotion() missing the OS setting in some
   environments) so we never leave content stuck at opacity:0. ---------- */
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
function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

function formatRuntime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={
        reduced
          ? { duration: 0 }
          : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}

function SceneSlate({
  no,
  of,
  kicker,
  title,
}: {
  no: string;
  of: string;
  kicker: string;
  title: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="flex flex-wrap items-baseline gap-x-2 text-xs md:text-sm">
        <span className={`${FONT_SCRIPT} uppercase tracking-[0.3em] text-amber-400/90`}>
          SCENE {no} / {of}
        </span>
        <span className="font-sans font-semibold tracking-wide text-amber-400/90">
          — {kicker}
        </span>
      </p>
      <h2
        className={`${FONT_DISPLAY_KO} text-[#f5f1e8] text-4xl sm:text-5xl md:text-7xl tracking-tight mt-3 leading-[1.05] text-balance`}
      >
        {title}
      </h2>
    </div>
  );
}

const briefingSteps = [
  {
    direction: "INT. YOUR ROOM — NIGHT",
    body: "앱에 실종 신청서를 남깁니다. AI가 당신의 캘린더, 예약 게시물, 자동응답 메시지까지 정리해 흔적을 지웁니다.",
  },
  {
    direction: "CUT TO: UNKNOWN NUMBER",
    body: "담당 프로듀서가 배정되어 목적지와 동선을 설계합니다. 가족에게는 출발 사실만 알립니다. 어디로 가는지는 아무도 모릅니다.",
  },
  {
    direction: "MONTAGE — PACKING HANDS",
    body: "지정된 시간, 지정된 장소로 이동합니다. 이후의 대본은 오직 당신만 압니다.",
  },
];

const offGridFeatures = [
  {
    icon: WifiOff,
    title: "휴대폰 압수",
    desc: "원할 경우 입국(입산) 즉시 보관. 통신은 완전히 끊깁니다.",
  },
  {
    icon: MapPinOff,
    title: "좌표 비공개 숙소",
    desc: "지도 앱에 등록되지 않은 장소. 검색해도 나오지 않습니다.",
  },
  {
    icon: PhoneOff,
    title: "연락 두절",
    desc: "긴급 연락망을 제외한 모든 채널이 꺼집니다.",
  },
  {
    icon: Timer,
    title: "긴급 컷",
    desc: "24시간 대기 프로듀서가 즉시 개입할 수 있는 유일한 통로.",
  },
];

const testimonials = [
  {
    name: "김하늘",
    batch: "실종 21기",
    quote:
      "휴대폰을 반납하는 순간, 3년 만에 처음으로 아무 알림도 울리지 않았다.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
    alt: "김하늘의 인터뷰 스틸컷, 어두운 배경 앞에서 정면을 응시하는 여성의 모습",
  },
  {
    name: "오정훈",
    batch: "실종 14기",
    quote: "가족에게 편지를 썼다. 문자 말고, 진짜 편지를.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    alt: "오정훈의 인터뷰 스틸컷, 옅은 미소를 띤 남성의 얼굴 클로즈업",
  },
  {
    name: "백서연",
    batch: "실종 09기",
    quote: "돌아왔을 때 제일 먼저 든 생각은 '더 있을걸'이었다.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    alt: "백서연의 인터뷰 스틸컷, 카메라를 응시하는 여성의 얼굴 클로즈업",
  },
];

const castingTiers = [
  {
    role: "EXTRA",
    ko: "단역",
    price: "₩890,000",
    tagline: "짧게, 가볍게 사라진다. 대사는 없다.",
    features: [
      "국내 좌표 비공개 숙소 1인실 · 3박 4일",
      "셀프 이동 (교통 미포함)",
      "생존 신호 1일 1회",
    ],
    featured: false,
  },
  {
    role: "SUPPORTING",
    ko: "조연",
    price: "₩3,200,000",
    tagline: "이야기 중심에 서진 않지만, 분명한 서사가 생긴다.",
    features: [
      "국내외 좌표 비공개 숙소 · 7박",
      "왕복 이동 전담 프로듀서 동행",
      "긴급 컷 24시간 대기",
      "디지털 흔적 자동 정리",
    ],
    featured: true,
  },
  {
    role: "LEAD",
    ko: "주연",
    price: "문의",
    tagline: "이 실종의 각본은, 당신이 직접 고른다.",
    features: [
      "해외 미공개 목적지 · 14박",
      "전담 프로듀서 상시 대기",
      "가족 대상 사전 브리핑 서비스",
      "각본 커스터마이징 무제한",
    ],
    featured: false,
  },
];

const credits: Array<[string, string]> = [
  ["DIRECTED BY", "당신"],
  ["PRODUCED BY", "VANISH FILMS"],
  ["STARRING", "당신"],
  ["LOCATION", "비공개"],
  ["FILM STOCK", "기억, 35mm"],
  ["RUNNING TIME", "14 DAYS"],
  ["SOUND", "침묵"],
  ["CASTING", "VANISH 프로듀싱팀"],
];

export default function F13Client() {
  const reduced = useReducedMotionSafe();
  const briefingRef = useRef<HTMLElement>(null);
  const [runtime, setRuntime] = useState(0);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setRuntime((v) => v + 1), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const scrollToBriefing = () => {
    briefingRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div
      className={`${bebas.variable} ${courier.variable} bg-black text-[#f5f1e8]`}
      style={{ colorScheme: "dark" }}
    >
      <a
        href="#main"
        className={`sr-only focus:not-sr-only focus:fixed focus:top-24 focus:left-4 focus:z-[60] focus:rounded focus:bg-amber-400 focus:px-4 focus:py-2 focus:text-black focus:font-semibold ${FOCUS_RING}`}
      >
        본문으로 건너뛰기
      </a>

      <div aria-hidden="true" className={styles.grain} />

      {/* fixed cinematic chrome: letterbox strip + nav + scrubber */}
      <header className="fixed inset-x-0 top-0 z-40">
        <div
          aria-hidden="true"
          className={`h-7 flex items-center justify-between bg-black px-3 md:px-6 text-[10px] ${FONT_SCRIPT} tracking-[0.2em] text-white/70`}
        >
          <span className="flex items-center gap-1.5">
            <Circle
              aria-hidden="true"
              size={7}
              className={`fill-red-500 text-red-500 ${styles.recDot}`}
            />
            REC
          </span>
          <span>{formatRuntime(runtime)}</span>
        </div>
        <nav
          aria-label="주 메뉴"
          className="h-14 flex items-center justify-between bg-black/85 backdrop-blur-md border-b border-white/10 px-4 md:px-8"
        >
          <span className={`${FONT_DISPLAY} text-2xl tracking-wide text-[#f5f1e8]`}>
            VANISH<span className="text-amber-400">.</span>
          </span>
          <a
            href="#reserve"
            className={`inline-flex min-h-[44px] items-center rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 transition-colors hover:border-amber-400 hover:text-amber-400 ${FOCUS_RING}`}
          >
            예약 문의
          </a>
        </nav>
        <div aria-hidden="true" className="h-[2px] bg-white/10">
          <motion.div
            style={{ scaleX: progressScaleX }}
            className="h-full origin-left bg-amber-400"
          />
        </div>
      </header>

      <main id="main" className="pt-[86px] pb-7">
        {/* SCENE 00 — COLD OPEN */}
        <section
          aria-label="콜드 오픈"
          className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0"
            initial={reduced ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={
              reduced ? { duration: 0 } : { duration: 1.8, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop"
              alt="안개 낀 숲 사이로 새벽빛이 비스듬히 비치는 산길"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black" />
          </motion.div>

          <div className="relative z-10 flex flex-col items-center">
            <Reveal>
              <p
                className={`${FONT_SCRIPT} mb-4 text-xs uppercase tracking-[0.35em] text-amber-400 md:text-sm`}
              >
                FADE IN:
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className={`${FONT_DISPLAY} text-[19vw] leading-[0.85] tracking-tight text-[#f5f1e8] sm:text-8xl md:text-9xl`}
              >
                VANISH<span className="text-amber-400">.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-xl text-balance text-lg text-white/85 md:text-xl">
                당신이 사라진 자리, 아무도 눈치채지 못하게 각본을 씁니다.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-3 text-xs font-medium tracking-wide text-white/70 md:text-sm">
                장르 리얼리티 · 러닝타임 14일 · 등급 전체 비공개
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={scrollToBriefing}
                  className={`group inline-flex min-h-[44px] items-center justify-center gap-3 rounded-full bg-amber-400 px-6 py-3.5 font-semibold text-black transition-colors hover:bg-amber-300 ${FOCUS_RING}`}
                >
                  <Play aria-hidden="true" size={18} className="fill-black" />
                  예고편 보기
                </button>
                <a
                  href="#reserve"
                  className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-white transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                >
                  예약 문의
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              </div>
            </Reveal>
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={
              reduced ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ChevronDown size={22} className="text-white/60" />
          </motion.div>
        </section>

        {/* SCENE 01 — BRIEFING */}
        <section
          ref={briefingRef}
          id="briefing"
          aria-labelledby="scene01-title"
          className="relative scroll-mt-24 bg-[#0a0908] px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div id="scene01-title">
                <SceneSlate no="01" of="06" kicker="브리핑" title="당신의 실종을, 기획합니다." />
              </div>
            </Reveal>
            <ol className="mt-4 grid gap-6 md:grid-cols-3">
              {briefingSteps.map((step, i) => (
                <Reveal key={step.direction} delay={i * 0.12}>
                  <li className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p
                      className={`${FONT_SCRIPT} mb-3 text-[11px] uppercase tracking-[0.25em] text-amber-400`}
                    >
                      {step.direction}
                    </p>
                    <p className="leading-relaxed text-white/85">{step.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* SCENE 02 — TRANSIT */}
        <section
          aria-labelledby="scene02-title"
          className="relative flex min-h-[85vh] items-center overflow-hidden px-6 py-24 md:px-12"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1920&auto=format&fit=crop"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/85" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl">
            <Reveal>
              <div id="scene02-title">
                <SceneSlate no="02" of="06" kicker="이동" title="목적지는, 탑승 직전에." />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <p aria-label="목적지 비공개" className="mt-2">
                <span
                  aria-hidden="true"
                  className={`${FONT_SCRIPT} ${styles.redacted} inline-block px-3 py-1.5 text-2xl tracking-widest md:text-4xl`}
                >
                  ██████████
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-lg leading-relaxed text-white/80">
                공항일 수도, 시외버스 터미널일 수도 있습니다. 좌표는 탑승 30분 전
                문자 한 통으로 전달됩니다. 돌아오는 티켓은 없습니다 — 대신, 돌아오는
                신호는 있습니다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* SCENE 03 — OFF-GRID */}
        <section
          aria-labelledby="scene03-title"
          className="relative bg-[#0a0908] px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div id="scene03-title">
                <SceneSlate no="03" of="06" kicker="잠적" title="세상이, 당신을 못 찾는 14일." />
              </div>
            </Reveal>

            <ul className="mt-4 grid gap-5 sm:grid-cols-2">
              {offGridFeatures.map((f, i) => (
                <Reveal key={f.title} delay={i * 0.1}>
                  <li className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-400/40 text-amber-400">
                      <f.icon aria-hidden="true" size={20} />
                    </span>
                    <span>
                      <p className={`${FONT_DISPLAY_KO} text-xl tracking-tight text-[#f5f1e8]`}>
                        {f.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-white/75">{f.desc}</p>
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/10]">
                  <Image
                    src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=1200&auto=format&fit=crop"
                    alt="안개에 잠긴 산맥을 위에서 내려다본 모습"
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[16/10]">
                  <Image
                    src="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=1200&auto=format&fit=crop"
                    alt="숲 속에 홀로 서 있는 통나무 오두막"
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <p className="mt-8 rounded-xl border border-amber-400/30 bg-amber-400/5 p-5 text-xs leading-relaxed text-white/80 md:text-sm">
                <span
                  className={`${FONT_SCRIPT} mr-2 uppercase tracking-[0.2em] text-amber-400`}
                >
                  * SAFETY PROTOCOL
                </span>
                매일 정오, 위치 공유 없이 &apos;생존 신호&apos; 1회. 24시간
                무응답 시 프로듀서가 즉시 개입합니다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* SCENE 04 — WITNESS TESTIMONIALS */}
        <section
          aria-labelledby="scene04-title"
          className="relative bg-black px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div id="scene04-title">
                <SceneSlate no="04" of="06" kicker="목격자 진술" title="실종 14일 차, 그들은 이렇게 말했다." />
              </div>
            </Reveal>
            <ul className="mt-4 grid gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.12}>
                  <li>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                      <Image
                        src={t.image}
                        alt={t.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 border-t border-amber-400/50 bg-black/70 px-4 py-3 backdrop-blur-sm">
                        <p className="text-sm font-semibold text-[#f5f1e8]">{t.name}</p>
                        <p className="text-[11px] font-medium tracking-wide text-amber-400">
                          {t.batch}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 border-l-2 border-amber-400/60 pl-4 leading-relaxed text-white/85">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* SCENE 05 — CASTING (PRICING) */}
        <section
          aria-labelledby="scene05-title"
          className="relative bg-[#0a0908] px-6 py-24 md:px-12 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <div id="scene05-title">
                <SceneSlate no="05" of="06" kicker="캐스팅" title="당신의 배역을, 고르세요." />
              </div>
            </Reveal>
            <ul className="mt-4 grid gap-6 md:grid-cols-3">
              {castingTiers.map((tier, i) => (
                <Reveal key={tier.role} delay={i * 0.1}>
                  <li
                    className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                      tier.featured
                        ? "border-amber-400 bg-amber-400/[0.06] md:-translate-y-3"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                  >
                    {tier.featured && (
                      <span className="absolute -top-3 left-7 rounded-full bg-amber-400 px-3 py-1 text-[11px] font-bold tracking-wide text-black">
                        인기 배역
                      </span>
                    )}
                    <p className="flex items-baseline gap-2 text-xs text-amber-400">
                      <span className={`${FONT_SCRIPT} uppercase tracking-[0.25em]`}>
                        {tier.role}
                      </span>
                      <span className="font-sans font-medium tracking-wide">
                        · {tier.ko}
                      </span>
                    </p>
                    <p className={`${FONT_DISPLAY_KO} mt-3 text-4xl text-[#f5f1e8]`}>
                      {tier.price}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">{tier.tagline}</p>
                    <ul className="mt-6 flex-1 space-y-3">
                      {tier.features.map((f) => (
                        <li key={f} className="flex gap-2 text-sm text-white/75">
                          <span aria-hidden="true" className="text-amber-400">
                            —
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#reserve"
                      className={`mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${FOCUS_RING} ${
                        tier.featured
                          ? "bg-amber-400 text-black hover:bg-amber-300"
                          : "border border-white/25 text-white hover:border-amber-400 hover:text-amber-400"
                      }`}
                    >
                      캐스팅 신청
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* SCENE 06 — END CREDITS / RESERVE */}
        <section
          id="reserve"
          aria-labelledby="credits-title"
          className="relative scroll-mt-24 overflow-hidden bg-black px-6 py-28 text-center md:px-12 md:py-36"
        >
          <div className="mx-auto max-w-2xl">
            <Reveal>
              <p className="flex flex-wrap items-baseline justify-center gap-x-2 text-xs">
                <span className={`${FONT_SCRIPT} uppercase tracking-[0.3em] text-amber-400`}>
                  SCENE 06 / 06
                </span>
                <span className="font-sans font-semibold tracking-wide text-amber-400">
                  — 엔딩 크레딧
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                id="credits-title"
                className={`${FONT_DISPLAY_KO} mt-4 text-4xl tracking-tight text-[#f5f1e8] sm:text-5xl md:text-7xl`}
              >
                각본은, 지금부터 시작됩니다.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mx-auto mt-5 max-w-lg text-white/80">
                촬영 일정은 한 달에 여덟 팀으로 제한됩니다. 다음 크랭크인은 대기
                명단 순서대로 안내드립니다.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <a
                href="mailto:casting@vanish.film?subject=VANISH%20%EC%BA%90%EC%8A%A4%ED%8C%85%20%EB%AC%B8%EC%9D%98"
                className={`mt-10 inline-flex min-h-[44px] items-center justify-center gap-3 rounded-full bg-amber-400 px-8 py-3.5 font-semibold text-black transition-colors hover:bg-amber-300 ${FOCUS_RING}`}
              >
                <Play aria-hidden="true" size={18} className="fill-black" />
                캐스팅 문의 보내기
              </a>
            </Reveal>

            <div className={`mt-20 h-64 overflow-hidden md:h-80 ${styles.creditsMask}`}>
              <div className={styles.creditsTrack}>
                {[0, 1].map((copy) => (
                  <ul
                    key={copy}
                    aria-hidden={copy === 1 ? "true" : undefined}
                    className="space-y-0"
                  >
                    {credits.map(([role, value]) => (
                      <li
                        key={`${copy}-${role}`}
                        className="flex items-center justify-between gap-6 border-b border-white/5 py-3 text-left"
                      >
                        <span
                          className={`${FONT_SCRIPT} text-[11px] uppercase tracking-[0.25em] text-white/50`}
                        >
                          {role}
                        </span>
                        <span className={`${FONT_DISPLAY_KO} text-xl text-[#f5f1e8]`}>
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 bg-black px-6 py-10 text-center md:px-12">
        <p className={`${FONT_DISPLAY} text-2xl tracking-wide text-[#f5f1e8]`}>
          VANISH<span className="text-amber-400">.</span>
        </p>
        <p className="mx-auto mt-3 max-w-md text-xs font-medium leading-relaxed tracking-wide text-white/70">
          VANISH FILMS · 실제 실종 신고와 무관 · 참가자 안전을 위해 24시간
          프로듀서가 대기합니다
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium tracking-wide text-white/60">
          <li>저널</li>
          <li>인스타그램</li>
          <li className={FONT_SCRIPT}>casting@vanish.film</li>
        </ul>
      </footer>

      <div
        aria-hidden="true"
        className={`fixed inset-x-0 bottom-0 z-40 flex h-7 items-center justify-center bg-black text-[10px] ${FONT_SCRIPT} tracking-[0.25em] text-white/50`}
      >
        VANISH — ORIGINAL FILM — 2.35:1
      </div>
    </div>
  );
}
