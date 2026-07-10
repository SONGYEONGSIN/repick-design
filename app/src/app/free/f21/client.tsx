"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Flame,
  Mail,
  Pause,
  Play,
  Send,
  Timer,
  TrendingUp,
  Trophy,
  User,
  Users,
  Zap,
} from "lucide-react";
import "./f21.css";

/* ------------------------------------------------------------------------
 * prefers-reduced-motion — matchMedia를 useSyncExternalStore로 직접 구독한다.
 * framer-motion의 useReducedMotion()이 이 환경에서 OS 설정을 못 잡는 경우가
 * 있어, 초기값은 항상 "허용"으로 시작하고 reduce=true가 확인되는 즉시
 * 정적 최종 상태로 전환한다 (opacity:0 잔류 버그 원천 차단).
 * ---------------------------------------------------------------------- */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* 진입 리빌 — reduce가 확인되면 framer-motion을 거치지 않고 최종 상태
 * 그대로 렌더한다. transform/opacity만 사용(레이아웃 트리거 없음). */
function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* 섹션 목록 — 스크롤 스파이 내비게이션용 */
const SECTIONS = [
  { id: "hero", label: "HOME" },
  { id: "proof", label: "PROOF" },
  { id: "tech", label: "TECH" },
  { id: "philosophy", label: "WHY" },
  { id: "leaderboard", label: "RANK" },
  { id: "join", label: "PREORDER" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

/* 파워 속보 티커 — 무한 반복 애니메이션이라 정지 컨트롤 필수(M04) */
function Ticker() {
  const [paused, setPaused] = useState(false);
  const text =
    "PEAK POWER 1,204W · REACTION 0.18s · VERTICAL JUMP 78cm · 10M FLYING START 1.02s · 지원 종목 37개 · 베타 대기 12,000명 ";
  return (
    <div
      className="f21-ticker-wrap"
      data-paused={paused ? "true" : "false"}
    >
      <div className="f21-ticker-inner flex items-center gap-3 py-2.5">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="f21-caps ml-3 flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm border-2 border-[color:var(--void)] bg-[color:var(--void)] px-3 text-[11px] text-[color:var(--volt)] transition-colors hover:bg-[color:var(--void-2)] sm:ml-6"
        >
          {paused ? (
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {paused ? "재생" : "정지"}
        </button>
        <div className="f21-ticker-viewport flex-1">
          <div className="f21-ticker-track">
            <span className="f21-caps px-4 text-xs font-semibold text-[color:var(--void)] sm:text-sm">
              {text}
            </span>
            <span
              className="f21-caps px-4 text-xs font-semibold text-[color:var(--void)] sm:text-sm"
              aria-hidden="true"
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 실시간 카운트업 숫자 — IntersectionObserver로 1회만 트리거, reduce 시
 * 애니메이션 없이 최종값 즉시 표시. 텍스트 콘텐츠만 갱신(레이아웃 트리거 없음) */
function StatValue({
  target,
  decimals = 0,
  suffix = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const [progressValue, setProgressValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const duration = 1400;
            const start = performance.now();
            const step = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setProgressValue(target * eased);
              if (progress < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [target, reduced]);

  const value = reduced ? target : progressValue;
  const formatted = new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}

/* 랭킹 파워 바 — transform: scaleX만 사용(레이아웃 트리거 없는 애니메이션) */
function PowerBar({ pct }: { pct: number }) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return (
      <div className="f21-bar" aria-hidden="true">
        <div
          className="f21-bar-fill"
          style={{ transform: `scaleX(${pct / 100})`, transformOrigin: "left" }}
        />
      </div>
    );
  }
  return (
    <div className="f21-bar" aria-hidden="true">
      <motion.div
        className="f21-bar-fill"
        style={{ transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: pct / 100 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

const STATS = [
  { icon: Zap, target: 1204, decimals: 0, suffix: "W", label: "역대 최고 순간 파워" },
  { icon: Timer, target: 0.18, decimals: 2, suffix: "s", label: "평균 반응속도 단축" },
  { icon: Users, target: 12000, decimals: 0, suffix: "+", label: "베타 대기 인원" },
  { icon: Activity, target: 37, decimals: 0, suffix: "", label: "지원 종목 수" },
] as const;

const FEATURES = [
  {
    icon: Zap,
    title: "0.01초 파워 센싱",
    desc: "6축 IMU와 자체 알고리즘으로 스프린트·점프·컷의 매 순간 파워를 와트 단위로 측정합니다.",
  },
  {
    icon: Timer,
    title: "반응속도 트래킹",
    desc: "출발 신호부터 첫 동작까지, 밀리초 단위로 당신의 반응을 기록하고 비교합니다.",
  },
  {
    icon: Activity,
    title: "즉각 진동 피드백",
    desc: "목표 파워에 도달하는 순간, 손목에 진동 패턴으로 즉시 알려주는 리얼타임 코칭.",
  },
  {
    icon: TrendingUp,
    title: "성장 곡선 분석",
    desc: "세션마다 쌓인 데이터로 당신의 폭발력이 어떻게 달라지는지 그래프로 보여줍니다.",
  },
] as const;

const LEADERBOARD = [
  { rank: 1, name: "김도현", event: "100M 스타트", score: 1204, pct: 100 },
  { rank: 2, name: "오세라", event: "수직 점프", score: 1132, pct: 94 },
  { rank: 3, name: "박준영", event: "박스 점프", score: 1078, pct: 89 },
  { rank: 4, name: "이하늘", event: "방향 전환", score: 998, pct: 83 },
  { rank: 5, name: "정민재", event: "허들 스텝", score: 951, pct: 79 },
] as const;

const RANK_COLOR: Record<number, string> = {
  1: "var(--volt)",
  2: "var(--paper)",
  3: "var(--crimson)",
};

const MOSAIC = [
  {
    id: "photo-1571019613454-1cb2f99b2d8b",
    alt: "육상 트랙에서 스프린트 출발 자세를 취하는 선수의 다리 클로즈업",
    caption: "스프린트 스타트",
    rotate: "-rotate-3",
  },
  {
    id: "photo-1546519638-68e109498ffc",
    alt: "노을을 배경으로 농구 골대를 향해 덩크하는 선수의 실루엣",
    caption: "수직 점프",
    rotate: "rotate-2",
  },
  {
    id: "photo-1552674605-db6ffd4facb5",
    alt: "초크 가루가 묻은 손으로 바벨을 움켜쥔 역도 선수의 클로즈업",
    caption: "바벨 리프트",
    rotate: "-rotate-2",
  },
] as const;

export default function SurgeLanding({
  antonClass,
  doHyeonClass,
  oswaldClass,
}: {
  antonClass: string;
  doHyeonClass: string;
  oswaldClass: string;
}) {
  const active = useActiveSection();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const formId = useId();

  return (
    <div className={`f21 ${antonClass} ${doHyeonClass} ${oswaldClass} min-h-screen`}>
      <a
        href="#main"
        className="f21-caps absolute left-2 top-2 z-50 -translate-y-20 rounded-sm bg-[color:var(--volt)] px-4 py-2 text-sm font-semibold text-[color:var(--void)] transition-transform focus:translate-y-0"
      >
        본문으로 건너뛰기
      </a>

      {/* -------------------------------------------------- HEADER -------- */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--void)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#hero" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-[color:var(--volt)] text-[color:var(--void)]"
              aria-hidden="true"
            >
              <Zap className="h-5 w-5" fill="currentColor" />
            </span>
            <span className="f21-shout text-2xl leading-none text-[color:var(--paper)] sm:text-3xl">
              SURGE
            </span>
          </a>
          <a
            href="#join"
            className="f21-btn-slant f21-caps inline-flex min-h-11 items-center bg-[color:var(--crimson)] px-4 text-xs font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--crimson-dark)] sm:px-5 sm:text-sm"
          >
            프리오더
          </a>
        </div>
        <nav aria-label="주요 섹션" className="border-t border-[color:var(--line)]">
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-1.5 sm:px-6">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "location" : undefined}
                  className={`f21-caps inline-flex min-h-11 items-center border-b-2 px-3 text-[11px] font-semibold transition-colors sm:text-xs ${
                    active === s.id
                      ? "border-[color:var(--volt)] text-[color:var(--paper)]"
                      : "border-transparent text-[color:var(--paper-dim)] hover:text-[color:var(--paper)]"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        {/* ------------------------------------------------ HERO -------- */}
        <div
          id="hero"
          ref={heroRef}
          className="f21-section relative flex min-h-[92vh] items-end overflow-hidden"
        >
          <motion.div
            className="f21-hero-media absolute inset-0 -z-10"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <Image
              src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1920&auto=format&fit=crop"
              alt="육상 트랙에서 전력 질주하는 스프린터의 역동적인 모습"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--void)] via-[color:var(--void)]/55 to-[color:var(--void)]/10" />
          </motion.div>

          <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24">
            <Reveal>
              <span className="f21-caps inline-flex items-center gap-2 rounded-sm border-2 border-[color:var(--volt)] px-3 py-1.5 text-xs font-semibold text-[color:var(--volt)] sm:text-sm">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                EXPLOSIVE POWER TRACKER
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="f21-display mt-5 max-w-3xl text-[15vw] font-bold leading-[0.95] text-[color:var(--paper)] sm:text-7xl md:text-8xl">
                터지는 순간,
                <br />
                <span className="text-[color:var(--volt)]">증명이 된다</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--paper-dim)] sm:text-lg">
                SURGE 밴드는 스프린트, 점프, 방향전환의 찰나를 와트·반응속도·
                가속도로 기록하는 손목형 파워 트래커입니다. 몸이 만든 폭발의
                순간을, 데이터로 남기세요.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#join"
                  className="f21-btn-slant f21-caps inline-flex min-h-12 items-center gap-2 bg-[color:var(--volt)] px-7 text-sm font-semibold text-[color:var(--void)] transition-colors hover:bg-[color:var(--volt-dim)]"
                >
                  프리오더 시작
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#proof"
                  className="f21-caps inline-flex min-h-12 items-center gap-2 border-2 border-[color:var(--line)] px-6 text-sm font-semibold text-[color:var(--paper)] transition-colors hover:border-[color:var(--volt)]"
                >
                  실측 데이터 보기
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="f21-caps mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[color:var(--paper-dim)] sm:text-xs">
                <Flame className="h-3.5 w-3.5 text-[color:var(--crimson)]" aria-hidden="true" />
                베타 대기 12,000명 · 방수 IP68 · 배터리 5일 · 무게 32g
              </p>
            </Reveal>
          </div>
        </div>

        <Ticker />

        {/* --------------------------------------------- PROOF ----------- */}
        <section id="proof" className="f21-section bg-[color:var(--void)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f21-caps text-xs font-semibold text-[color:var(--volt)]">
                PROOF · 실측 데이터
              </p>
              <h2 className="f21-display mt-3 text-4xl font-bold text-[color:var(--paper)] sm:text-5xl">
                숫자가, 말보다 빠르다
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                베타 테스터 1,842명이 90일간 남긴 실제 측정 데이터입니다.
              </p>
            </Reveal>

            <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STATS.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.06} className="h-full">
                  <div className="f21-card-cut flex h-full flex-col gap-4 border border-[color:var(--line)] bg-[color:var(--void-2)] p-6">
                    <stat.icon className="h-6 w-6 text-[color:var(--volt)]" aria-hidden="true" />
                    <dd className="f21-shout text-4xl text-[color:var(--paper)] sm:text-5xl">
                      <StatValue target={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
                    </dd>
                    <dt className="f21-caps text-xs font-medium text-[color:var(--paper-dim)]">
                      {stat.label}
                    </dt>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>

        {/* --------------------------------------------- TECH ------------ */}
        <section id="tech" className="f21-section bg-[color:var(--void-2)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f21-caps text-xs font-semibold text-[color:var(--volt)]">
                TECHNOLOGY
              </p>
              <h2 className="f21-display mt-3 text-4xl font-bold text-[color:var(--paper)] sm:text-5xl">
                손목 위의 스포츠 과학
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                무게 32g, 방수 등급 IP68, 배터리 5일. 작지만 트랙과 코트에서
                쓰던 파워 측정 기술이 그대로 들어있습니다.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <Reveal className="f21-card-cut relative aspect-[4/5] overflow-hidden border border-[color:var(--line)] sm:aspect-[16/10] lg:aspect-[4/5]">
                <Image
                  src="https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1200&auto=format&fit=crop"
                  alt="손목에 착용한 스마트 트레이닝 밴드를 클로즈업한 모습"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--void)]/70 via-transparent to-transparent" />
              </Reveal>
              <ul className="grid gap-6 sm:grid-cols-2">
                {FEATURES.map((f, i) => (
                  <Reveal key={f.title} delay={i * 0.06}>
                    <li className="flex flex-col gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-sm bg-[color:var(--void-3)] text-[color:var(--volt)]"
                        aria-hidden="true"
                      >
                        <f.icon className="h-5 w-5" />
                      </span>
                      <h3 className="f21-display text-lg font-bold text-[color:var(--paper)]">
                        {f.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[color:var(--paper-dim)]">
                        {f.desc}
                      </p>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- PHILOSOPHY ------ */}
        <section
          id="philosophy"
          className="f21-section f21-stripes relative overflow-hidden bg-[color:var(--void)] py-20 sm:py-28"
        >
          <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f21-caps text-xs font-semibold text-[color:var(--volt)]">
                WHY SURGE
              </p>
              <h2 className="f21-display mt-3 max-w-2xl text-4xl font-bold text-[color:var(--paper)] sm:text-5xl">
                최고의 순간은, 예고하지 않는다
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--paper-dim)] sm:text-lg">
                스타트 총성이 울리기 0.3초 전, 림에 손이 닿기 직전, 바벨이
                흔들리기 시작하는 그 찰나 — 진짜 실력은 거기 있습니다. SURGE는
                그 찰나를 놓치지 않습니다.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {MOSAIC.map((m, i) => (
                <Reveal key={m.id} delay={i * 0.08} y={32}>
                  <figure
                    className={`f21-card-cut ${m.rotate} overflow-hidden border border-[color:var(--line)] bg-[color:var(--void-2)]`}
                  >
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={`https://images.unsplash.com/${m.id}?q=80&w=900&auto=format&fit=crop`}
                        alt={m.alt}
                        fill
                        sizes="(min-width: 640px) 30vw, 90vw"
                        className="object-cover"
                      />
                    </div>
                    <figcaption className="f21-caps px-4 py-3 text-xs font-semibold text-[color:var(--paper-dim)]">
                      {m.caption}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- LEADERBOARD ----- */}
        <section id="leaderboard" className="f21-section bg-[color:var(--void-2)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f21-caps text-xs font-semibold text-[color:var(--volt)]">
                LEADERBOARD
              </p>
              <h2 className="f21-display mt-3 text-4xl font-bold text-[color:var(--paper)] sm:text-5xl">
                지금, 전국이 겨루는 중
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                이번 주 파워 랭킹 TOP 5 — 매주 월요일 초기화됩니다.
              </p>
            </Reveal>

            <ol className="mt-10 flex flex-col gap-4">
              {LEADERBOARD.map((row, i) => (
                <Reveal key={row.rank} delay={i * 0.05}>
                  <li className="flex items-center gap-4 border border-[color:var(--line)] bg-[color:var(--void-3)] p-4 sm:gap-6 sm:p-5">
                    <span
                      className="f21-rank-badge f21-shout flex h-11 w-11 shrink-0 items-center justify-center text-lg text-[color:var(--void)] sm:h-12 sm:w-12 sm:text-xl"
                      style={{ backgroundColor: RANK_COLOR[row.rank] ?? "var(--paper-dim)" }}
                      aria-hidden="true"
                    >
                      {row.rank <= 3 ? <Trophy className="h-5 w-5" /> : row.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <p className="f21-display truncate text-lg font-bold text-[color:var(--paper)]">
                          {row.rank}위 · {row.name}
                          <span className="ml-2 text-sm font-normal text-[color:var(--paper-dim)]">
                            {row.event}
                          </span>
                        </p>
                        <p className="f21-shout shrink-0 text-xl text-[color:var(--volt)] sm:text-2xl">
                          {new Intl.NumberFormat("ko-KR").format(row.score)}W
                        </p>
                      </div>
                      <div className="mt-2.5">
                        <PowerBar pct={row.pct} />
                      </div>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.15}>
              <p className="mt-6 text-sm text-[color:var(--paper-dim)]">
                전체 지역 랭킹과 종목별 순위는 앱 정식 출시 후 공개됩니다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------- JOIN ------------ */}
        <section id="join" className="f21-section bg-[color:var(--void)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f21-caps text-xs font-semibold text-[color:var(--crimson)]">
                PREORDER
              </p>
              <h2 className="f21-display mt-3 text-4xl font-bold text-[color:var(--paper)] sm:text-5xl">
                얼리버드 20%, 선착순 3,000명
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                9월 첫 출고 예정입니다. 지금 웨이트리스트에 등록하면 정가
                대비 20% 할인된 가격으로 가장 먼저 받아봅니다.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <WaitlistForm formId={formId} />
            </Reveal>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------- FOOTER -------- */}
      <footer className="border-t border-[color:var(--line)] bg-[color:var(--void-2)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="f21-shout text-2xl text-[color:var(--paper)]">SURGE</p>
              <p className="mt-2 max-w-xs text-xs leading-relaxed text-[color:var(--paper-dim)]">
                터지는 순간을 증명하다. 익스플로시브 파워 트래커, SURGE.
              </p>
            </div>
            <nav aria-label="바닥글" className="flex flex-wrap gap-x-8 gap-y-3">
              <ul className="f21-caps flex flex-col gap-2 text-xs font-medium text-[color:var(--paper-dim)]">
                <li>
                  <a href="#tech" className="transition-colors hover:text-[color:var(--paper)]">
                    제품
                  </a>
                </li>
                <li>
                  <a href="#leaderboard" className="transition-colors hover:text-[color:var(--paper)]">
                    랭킹
                  </a>
                </li>
                <li>
                  <a href="#join" className="transition-colors hover:text-[color:var(--paper)]">
                    프리오더
                  </a>
                </li>
              </ul>
              <ul className="f21-caps flex flex-col gap-2 text-xs font-medium text-[color:var(--paper-dim)]">
                <li>
                  <a href="#" className="transition-colors hover:text-[color:var(--paper)]">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[color:var(--paper)]">
                    Threads
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-8 border-t border-[color:var(--line)] pt-6 text-[11px] text-[color:var(--paper-dim)]/70">
            © 2026 SURGE LABS. 본 페이지의 제품·수치·후기는 컨셉 시연을 위해
            창작된 가상의 것이며 실존하지 않습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
function WaitlistForm({ formId }: { formId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const consentId = `${formId}-consent`;
  const statusId = `${formId}-status`;

  return (
    <div className="border border-[color:var(--line)] bg-[color:var(--void-2)] p-6 sm:p-8">
      <h3 className="f21-display text-2xl font-bold text-[color:var(--paper)]">
        웨이트리스트 등록
      </h3>
      <p className="mt-2 text-sm text-[color:var(--paper-dim)]">
        이름과 이메일만 남기면 출고 소식과 얼리버드 링크를 가장 먼저
        보내드립니다.
      </p>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="f21-caps text-xs font-medium text-[color:var(--paper-dim)]">
            이름
          </label>
          <div className="flex items-center gap-2 border border-[color:var(--line)] bg-[color:var(--void)] px-3 py-2.5 focus-within:border-[color:var(--volt)]">
            <User className="h-4 w-4 shrink-0 text-[color:var(--paper-dim)]" aria-hidden="true" />
            <input
              id={nameId}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="예: 김도현"
              className="w-full bg-transparent text-sm text-[color:var(--paper)] outline-none placeholder:text-[color:var(--paper-dim)]/50"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="f21-caps text-xs font-medium text-[color:var(--paper-dim)]">
            이메일
          </label>
          <div className="flex items-center gap-2 border border-[color:var(--line)] bg-[color:var(--void)] px-3 py-2.5 focus-within:border-[color:var(--volt)]">
            <Mail className="h-4 w-4 shrink-0 text-[color:var(--paper-dim)]" aria-hidden="true" />
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="runner@example.com"
              className="w-full bg-transparent text-sm text-[color:var(--paper)] outline-none placeholder:text-[color:var(--paper-dim)]/50"
            />
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[color:var(--volt)]"
          />
          <label htmlFor={consentId} className="text-xs leading-relaxed text-[color:var(--paper-dim)]">
            출고 및 프리오더 알림 수신에 동의합니다. 언제든 수신을 거부할 수
            있습니다.
          </label>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="f21-btn-slant f21-caps inline-flex min-h-12 items-center justify-center gap-2 bg-[color:var(--crimson)] px-7 text-sm font-semibold text-[color:var(--paper)] transition-colors hover:bg-[color:var(--crimson-dark)]"
          >
            웨이트리스트 등록
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p
          id={statusId}
          role="status"
          aria-live="polite"
          className="f21-caps text-xs font-medium text-[color:var(--volt)] sm:col-span-2"
        >
          {submitted ? "등록 완료 — 출고 소식을 가장 먼저 전해드립니다." : ""}
        </p>
      </form>
    </div>
  );
}
