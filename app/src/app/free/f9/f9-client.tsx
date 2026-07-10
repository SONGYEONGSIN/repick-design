"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, animate as motionAnimate } from "framer-motion";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import {
  ArrowUpRight,
  Beaker,
  Crosshair,
  Gauge,
  Mail,
  PackageCheck,
  Radar,
  Thermometer,
} from "lucide-react";
import "./f9.css";

const mono = JetBrains_Mono({
  variable: "--f9-font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const display = Fraunces({
  variable: "--f9-font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

/* ------------------------------------------------------------------ */
/* Reliable prefers-reduced-motion subscription (matchMedia + useSyncExternalStore) */
/* ------------------------------------------------------------------ */

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
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
    getReducedMotionServerSnapshot,
  );
}

/* ------------------------------------------------------------------ */
/* Chart geometry — pre-computed volatility decay curves */
/* ------------------------------------------------------------------ */

const TOP_POINTS =
  "60.0,260.0 73.3,155.2 86.7,50.5 100.0,73.8 113.3,105.3 126.7,131.4 140.0,153.2 153.3,171.2 166.7,186.2 180.0,198.7 193.3,209.1 206.7,217.7 220.0,224.8 233.3,230.8 246.7,235.7 260.0,239.8 273.3,243.2 286.7,246.1 300.0,248.4 313.3,250.4 326.7,252.0 340.0,253.4 353.3,254.5 366.7,255.4 380.0,256.2 393.3,256.8 406.7,257.4 420.0,257.8 433.3,258.2 446.7,258.5 460.0,258.7 473.3,259.0 486.7,259.1 500.0,259.3 513.3,259.4 526.7,259.5 540.0,259.6 553.3,259.7 566.7,259.7 580.0,259.8 593.3,259.8 606.7,259.8 620.0,259.9 633.3,259.9 646.7,259.9 660.0,259.9 673.3,259.9 686.7,259.9 700.0,260.0";

const HEART_POINTS =
  "60.0,260.0 73.3,241.7 86.7,223.3 100.0,205.0 113.3,186.7 126.7,168.3 140.0,150.0 153.3,131.7 166.7,113.3 180.0,95.0 193.3,76.7 206.7,58.3 220.0,40.0 233.3,53.4 246.7,65.9 260.0,77.7 273.3,88.8 286.7,99.1 300.0,108.8 313.3,118.0 326.7,126.5 340.0,134.5 353.3,142.0 366.7,149.1 380.0,155.7 393.3,161.9 406.7,167.7 420.0,173.2 433.3,178.3 446.7,183.1 460.0,187.6 473.3,191.8 486.7,195.8 500.0,199.5 513.3,203.0 526.7,206.2 540.0,209.3 553.3,212.2 566.7,214.9 580.0,217.4 593.3,219.8 606.7,222.0 620.0,224.1 633.3,226.0 646.7,227.9 660.0,229.6 673.3,231.2 686.7,232.7 700.0,234.1";

const BASE_POINTS =
  "60.0,260.0 73.3,251.3 86.7,242.5 100.0,233.8 113.3,225.1 126.7,216.3 140.0,207.6 153.3,198.9 166.7,190.2 180.0,181.4 193.3,172.7 206.7,164.0 220.0,155.2 233.3,146.5 246.7,137.8 260.0,129.0 273.3,120.3 286.7,111.6 300.0,102.9 313.3,94.1 326.7,85.4 340.0,76.7 353.3,67.9 366.7,59.2 380.0,50.5 393.3,41.7 406.7,43.0 420.0,46.6 433.3,50.2 446.7,53.8 460.0,57.2 473.3,60.6 486.7,63.9 500.0,67.2 513.3,70.4 526.7,73.6 540.0,76.7 553.3,79.7 566.7,82.7 580.0,85.6 593.3,88.5 606.7,91.3 620.0,94.1 633.3,96.8 646.7,99.5 660.0,102.1 673.3,104.7 686.7,107.2 700.0,109.7";

const HOUR_TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

/* ------------------------------------------------------------------ */
/* Data feed for the ticker marquee */
/* ------------------------------------------------------------------ */

const FEED = [
  "BERGAMOT · 12.4 VOL/H",
  "BLACK PEPPER · 9.8 VOL/H",
  "CEDARWOOD · 2.1 VOL/H",
  "AMBROXAN · 0.4 VOL/H",
  "TONKA BEAN · 0.3 VOL/H",
  "FIG LEAF · 6.7 VOL/H",
  "VETIVER · 1.1 VOL/H",
  "OZONE ACCORD · 15.2 VOL/H",
  "WHITE MUSK · 0.6 VOL/H",
  "GALBANUM · 8.3 VOL/H",
];

/* ------------------------------------------------------------------ */
/* Products */
/* ------------------------------------------------------------------ */

type Product = {
  code: string;
  name: string;
  top: string;
  heart: string;
  base: string;
  longevity: string;
  radius: string;
  concentration: string;
  price: string;
};

const PRODUCTS: Product[] = [
  {
    code: "No.07",
    name: "CINDER",
    top: "블랙페퍼, 베르가못",
    heart: "시더우드, 인센스",
    base: "앰버, 통카빈",
    longevity: "9.5h",
    radius: "0.8m",
    concentration: "22%",
    price: "₩168,000",
  },
  {
    code: "No.12",
    name: "GLACIAL",
    top: "오존 어코드, 민트",
    heart: "미네랄, 바이올렛리프",
    base: "화이트머스크, 앰브록산",
    longevity: "7.0h",
    radius: "0.6m",
    concentration: "18%",
    price: "₩152,000",
  },
  {
    code: "No.03",
    name: "VERDANT",
    top: "갈바넘, 무화과잎",
    heart: "베티버, 클라리세이지",
    base: "오크모스, 시더",
    longevity: "8.2h",
    radius: "0.7m",
    concentration: "20%",
    price: "₩160,000",
  },
  {
    code: "No.19",
    name: "EMBER",
    top: "핑크페퍼, 만다린",
    heart: "인센스, 레더",
    base: "통카빈, 샌달우드",
    longevity: "10.1h",
    radius: "0.9m",
    concentration: "24%",
    price: "₩176,000",
  },
];

/* ------------------------------------------------------------------ */
/* Small building blocks */
/* ------------------------------------------------------------------ */

function CoordLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--f9-fg-dim)] uppercase">
      {children}
    </span>
  );
}

function CountReadout({
  target,
  decimals = 0,
  suffix = "",
  label,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotionSafe();
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = motionAnimate(0, target, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setAnimatedValue(v),
    });
    return () => controls.stop();
  }, [inView, reduced, target]);

  const value = reduced ? target : inView ? animatedValue : 0;

  return (
    <div ref={ref} className="flex flex-col gap-1">
      <span className="f9-mono font-mono text-3xl font-medium text-[var(--f9-accent)] sm:text-4xl">
        {value.toFixed(decimals)}
        {suffix}
      </span>
      <CoordLabel>{label}</CoordLabel>
    </div>
  );
}

function RevealBlock({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Live coordinate clock — mounts client-only to avoid hydration drift */
/* ------------------------------------------------------------------ */

function subscribeClock(callback: () => void) {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
}

function getClockSnapshot() {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(new Date());
}

function getClockServerSnapshot() {
  return "--:--:--";
}

function LiveClock() {
  const time = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);

  return (
    <span className="f9-mono font-mono text-xs text-[var(--f9-fg-muted)]" aria-hidden="true">
      SEOUL {time} KST
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Volatility chart */
/* ------------------------------------------------------------------ */

function VolatilityChart() {
  const reduced = useReducedMotionSafe();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  const lines: { points: string; color: string; label: string }[] = [
    { points: TOP_POINTS, color: "var(--f9-accent)", label: "TOP NOTE" },
    { points: HEART_POINTS, color: "var(--f9-accent-2)", label: "HEART NOTE" },
    { points: BASE_POINTS, color: "var(--f9-accent-3)", label: "BASE NOTE" },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        ref={ref}
        viewBox="0 0 760 300"
        role="img"
        aria-label="향의 휘발 곡선: 톱노트는 30분 내 최고조 후 4시간 내 소멸, 하트노트는 2시간 전후 정점 후 완만히 감소, 베이스노트는 4시간대에 정점을 찍고 8시간 이후에도 잔향이 남는다."
        className="h-auto min-w-[560px] w-full"
      >
        {/* grid */}
        {HOUR_TICKS.map((h) => {
          const x = 60 + (h / 8) * 640;
          return (
            <line
              key={h}
              x1={x}
              y1={40}
              x2={x}
              y2={260}
              stroke="var(--f9-line)"
              strokeWidth={1}
            />
          );
        })}
        {[0, 25, 50, 75, 100].map((p) => {
          const y = 260 - (p / 100) * 220;
          return (
            <line
              key={p}
              x1={60}
              y1={y}
              x2={700}
              y2={y}
              stroke="var(--f9-line)"
              strokeWidth={1}
            />
          );
        })}

        {/* axes */}
        <line x1={60} y1={260} x2={700} y2={260} stroke="var(--f9-line-strong)" strokeWidth={1.5} />
        <line x1={60} y1={40} x2={60} y2={260} stroke="var(--f9-line-strong)" strokeWidth={1.5} />

        {HOUR_TICKS.map((h) => {
          const x = 60 + (h / 8) * 640;
          return (
            <text
              key={h}
              x={x}
              y={278}
              textAnchor="middle"
              className="fill-[var(--f9-fg-dim)]"
              fontSize={11}
              fontFamily="var(--f9-font-mono)"
            >
              {h}h
            </text>
          );
        })}

        {lines.map((line, i) => (
          <motion.polyline
            key={line.label}
            points={line.points}
            fill="none"
            stroke={line.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            animate={
              reduced
                ? undefined
                : inView
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.4, delay: i * 0.25, ease: "easeInOut" }}
          />
        ))}
      </svg>

      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2" aria-hidden="true">
        {lines.map((line) => (
          <li key={line.label} className="flex items-center gap-2">
            <span
              className="h-[3px] w-5 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            <span className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-muted)]">
              {line.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Landing */
/* ------------------------------------------------------------------ */

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div
      className={`f9-scope ${mono.variable} ${display.variable} min-h-screen w-full font-[family-name:var(--f9-font-mono)]`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[var(--f9-accent)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-[var(--f9-bg)]"
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------------------------------------------------- HEADER */}
      <header className="sticky top-0 z-40 border-b border-[var(--f9-line)] bg-[var(--f9-bg)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
          <span className="font-mono text-sm font-bold tracking-[0.25em] text-[var(--f9-fg)]">
            VOLATILE
          </span>
          <nav aria-label="주 메뉴" className="hidden items-center gap-6 md:flex">
            <a
              href="#measurement"
              className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-muted)] transition-colors hover:text-[var(--f9-fg)]"
            >
              계측 데이터
            </a>
            <a
              href="#collection"
              className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-muted)] transition-colors hover:text-[var(--f9-fg)]"
            >
              컬렉션
            </a>
            <a
              href="#protocol"
              className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-muted)] transition-colors hover:text-[var(--f9-fg)]"
            >
              프로토콜
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <LiveClock />
            <a
              href="#subscribe"
              className="hidden h-11 items-center rounded-sm border border-[var(--f9-line-strong)] px-4 font-mono text-xs tracking-[0.1em] text-[var(--f9-fg)] transition-colors hover:border-[var(--f9-accent)] hover:text-[var(--f9-accent)] sm:inline-flex"
            >
              구독하기
            </a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* -------------------------------------------------------- HERO */}
        <section
          className="f9-grid f9-grid-fade relative overflow-hidden border-b border-[var(--f9-line)] px-5 pb-20 pt-16 sm:px-8 sm:pt-24"
          aria-labelledby="hero-heading"
        >
          {/* radar rings, purely decorative */}
          <div
            className="pointer-events-none absolute right-[-120px] top-[-80px] hidden h-[420px] w-[420px] items-center justify-center lg:flex"
            aria-hidden="true"
          >
            <span className="absolute h-full w-full rounded-full border border-[var(--f9-accent-soft)] f9-radar-ring" />
            <span
              className="absolute h-full w-full rounded-full border border-[var(--f9-accent-soft)] f9-radar-ring"
              data-delay="1"
            />
            <span
              className="absolute h-full w-full rounded-full border border-[var(--f9-accent-soft)] f9-radar-ring"
              data-delay="2"
            />
            <Radar className="h-10 w-10 text-[var(--f9-fg-dim)]" strokeWidth={1} />
          </div>

          <div className="relative mx-auto max-w-[1400px]">
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <Crosshair className="h-4 w-4 text-[var(--f9-accent)]" aria-hidden="true" />
              <CoordLabel>LAT 37.5652°N · LON 126.9910°E — LAB 04</CoordLabel>
            </div>

            <h1
              id="hero-heading"
              className="max-w-4xl font-[family-name:var(--f9-font-display)] text-[13vw] font-light italic leading-[0.95] tracking-tight text-[var(--f9-fg)] sm:text-6xl md:text-7xl lg:text-8xl"
            >
              제작하지 않습니다.
              <br />
              <span className="not-italic text-[var(--f9-accent)]">측정합니다.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--f9-fg-muted)] sm:text-lg">
              VOLATILE은 향수를 감성이 아니라 데이터로 만듭니다. 3,412개의 후각
              샘플로 원료의 휘발 속도를 계측하고, 그 곡선이 교차하는 좌표
              위에서만 향을 조합합니다.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href="#collection"
                className="inline-flex h-12 items-center gap-2 rounded-sm bg-[var(--f9-accent)] px-6 font-mono text-sm font-bold tracking-[0.05em] text-[var(--f9-bg)] transition-transform hover:-translate-y-0.5"
              >
                컬렉션 보기
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#measurement"
                className="inline-flex h-12 items-center rounded-sm border border-[var(--f9-line-strong)] px-6 font-mono text-sm tracking-[0.05em] text-[var(--f9-fg)] transition-colors hover:border-[var(--f9-accent)] hover:text-[var(--f9-accent)]"
              >
                측정 데이터 보기
              </a>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--f9-line)] pt-8 sm:grid-cols-4">
              <div>
                <dt className="sr-only">누적 후각 데이터 포인트</dt>
                <dd>
                  <CountReadout target={3412} label="DATA POINTS" />
                </dd>
              </div>
              <div>
                <dt className="sr-only">평균 휘발 지수</dt>
                <dd>
                  <CountReadout target={87.3} decimals={1} suffix="%" label="휘발 지수 AVG" />
                </dd>
              </div>
              <div>
                <dt className="sr-only">활성 배치 수</dt>
                <dd>
                  <CountReadout target={19} label="ACTIVE BATCHES" />
                </dd>
              </div>
              <div>
                <dt className="sr-only">평균 지속 시간</dt>
                <dd>
                  <CountReadout target={8.7} decimals={1} suffix="h" label="AVG LONGEVITY" />
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* -------------------------------------------------------- TICKER */}
        <section aria-label="원료 휘발 속도 실시간 데이터 피드" className="border-b border-[var(--f9-line)] bg-[var(--f9-bg-raised)]">
          <p className="sr-only">
            현재 계측 중인 원료: {FEED.join(", ")}
          </p>
          <div className="f9-marquee-row overflow-hidden py-3" aria-hidden="true">
            <div className="f9-marquee-track flex w-max gap-10 whitespace-nowrap">
              {[...FEED, ...FEED].map((item, i) => (
                <span
                  key={i}
                  className="font-mono text-xs tracking-[0.12em] text-[var(--f9-fg-dim)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- MEASUREMENT */}
        <section
          id="measurement"
          className="scroll-mt-20 border-b border-[var(--f9-line)] px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby="measurement-heading"
        >
          <div className="mx-auto max-w-[1400px]">
            <RevealBlock className="max-w-2xl">
              <CoordLabel>FIG. 01 — VOLATILITY CURVE</CoordLabel>
              <h2
                id="measurement-heading"
                className="mt-3 font-[family-name:var(--f9-font-display)] text-4xl font-light italic text-[var(--f9-fg)] sm:text-5xl"
              >
                향은 순서대로 사라집니다
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--f9-fg-muted)]">
                톱노트는 30분 안에 정점을 찍고 4시간 내 완전히 휘발합니다.
                하트노트는 2시간대에 정점을 찍은 뒤 천천히 잦아듭니다. 베이스노트는
                4시간대에 정점을 찍고 8시간이 지나도 피부 위에 남습니다. 이
                세 곡선이 만나는 지점이 VOLATILE이 향을 설계하는 좌표입니다.
              </p>
            </RevealBlock>

            <RevealBlock delay={0.15} className="mt-12 rounded-sm border border-[var(--f9-line)] bg-[var(--f9-bg-raised)] p-4 sm:p-8">
              <VolatilityChart />
            </RevealBlock>
          </div>
        </section>

        {/* -------------------------------------------------------- COLLECTION */}
        <section
          id="collection"
          className="scroll-mt-20 border-b border-[var(--f9-line)] px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby="collection-heading"
        >
          <div className="mx-auto max-w-[1400px]">
            <RevealBlock className="max-w-2xl">
              <CoordLabel>CATALOG — 4 INSTRUMENTS ACTIVE</CoordLabel>
              <h2
                id="collection-heading"
                className="mt-3 font-[family-name:var(--f9-font-display)] text-4xl font-light italic text-[var(--f9-fg)] sm:text-5xl"
              >
                컬렉션
              </h2>
            </RevealBlock>

            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {PRODUCTS.map((p, i) => (
                <li key={p.code}>
                  <RevealBlock delay={i * 0.08}>
                    <article className="group flex h-full flex-col justify-between rounded-sm border border-[var(--f9-line)] bg-[var(--f9-bg-raised)] p-6 transition-colors hover:border-[var(--f9-accent)]/50 sm:p-7">
                      <div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-mono text-xs tracking-[0.15em] text-[var(--f9-fg-dim)]">
                            {p.code}
                          </span>
                          <span className="font-mono text-xs text-[var(--f9-fg-dim)]">
                            {p.concentration} EDP
                          </span>
                        </div>
                        <h3 className="mt-2 font-[family-name:var(--f9-font-display)] text-3xl italic text-[var(--f9-fg)]">
                          {p.name}
                        </h3>

                        <dl className="mt-6 space-y-2.5 border-t border-[var(--f9-line)] pt-5">
                          <div className="flex justify-between gap-4 text-sm">
                            <dt className="text-[var(--f9-fg-dim)]">TOP</dt>
                            <dd className="text-right text-[var(--f9-fg-muted)]">{p.top}</dd>
                          </div>
                          <div className="flex justify-between gap-4 text-sm">
                            <dt className="text-[var(--f9-fg-dim)]">HEART</dt>
                            <dd className="text-right text-[var(--f9-fg-muted)]">{p.heart}</dd>
                          </div>
                          <div className="flex justify-between gap-4 text-sm">
                            <dt className="text-[var(--f9-fg-dim)]">BASE</dt>
                            <dd className="text-right text-[var(--f9-fg-muted)]">{p.base}</dd>
                          </div>
                        </dl>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] tracking-[0.08em] text-[var(--f9-fg-dim)]">
                          <span>지속 {p.longevity}</span>
                          <span>확산반경 {p.radius}</span>
                        </div>
                      </div>

                      <div className="mt-7 flex items-center justify-between border-t border-[var(--f9-line)] pt-5">
                        <span className="f9-mono font-mono text-lg font-medium text-[var(--f9-fg)]">
                          {p.price}
                        </span>
                        <button
                          type="button"
                          className="inline-flex h-11 items-center gap-1.5 rounded-sm border border-[var(--f9-line-strong)] px-4 font-mono text-xs tracking-[0.05em] text-[var(--f9-fg)] transition-colors hover:border-[var(--f9-accent)] hover:text-[var(--f9-accent)]"
                        >
                          측정 결과 담기
                        </button>
                      </div>
                    </article>
                  </RevealBlock>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- PROTOCOL */}
        <section
          id="protocol"
          className="scroll-mt-20 border-b border-[var(--f9-line)] px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby="protocol-heading"
        >
          <div className="mx-auto max-w-[1400px]">
            <RevealBlock className="max-w-2xl">
              <CoordLabel>PROCESS — LAB PROTOCOL V.2.6</CoordLabel>
              <h2
                id="protocol-heading"
                className="mt-3 font-[family-name:var(--f9-font-display)] text-4xl font-light italic text-[var(--f9-fg)] sm:text-5xl"
              >
                계측 프로토콜
              </h2>
            </RevealBlock>

            <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[var(--f9-line)] bg-[var(--f9-line)] sm:grid-cols-4">
              {[
                {
                  icon: Beaker,
                  step: "01",
                  title: "EXTRACT",
                  desc: "원료에서 향 분자를 추출하고 개별 휘발 속도를 기록합니다.",
                },
                {
                  icon: Gauge,
                  step: "02",
                  title: "CALIBRATE",
                  desc: "8시간 구간의 강도 곡선을 측정해 좌표계에 배치합니다.",
                },
                {
                  icon: Thermometer,
                  step: "03",
                  title: "DISTILL",
                  desc: "곡선이 교차하는 지점을 기준으로 배합 비율을 조정합니다.",
                },
                {
                  icon: PackageCheck,
                  step: "04",
                  title: "SEAL",
                  desc: "배치 번호를 부여하고 계측 데이터와 함께 봉인합니다.",
                },
              ].map(({ icon: Icon, step, title, desc }, i) => (
                <RevealBlock key={step} delay={i * 0.08} className="bg-[var(--f9-bg)] p-6 sm:p-7">
                  <Icon className="h-5 w-5 text-[var(--f9-accent)]" aria-hidden="true" strokeWidth={1.5} />
                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-mono text-xs text-[var(--f9-fg-dim)]">{step}</span>
                    <h3 className="font-mono text-sm font-bold tracking-[0.1em] text-[var(--f9-fg)]">
                      {title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--f9-fg-muted)]">{desc}</p>
                </RevealBlock>
              ))}
            </ol>
          </div>
        </section>

        {/* -------------------------------------------------------- FIELD NOTES */}
        <section
          className="scroll-mt-20 border-b border-[var(--f9-line)] px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby="notes-heading"
        >
          <div className="mx-auto max-w-[1400px]">
            <RevealBlock className="max-w-2xl">
              <CoordLabel>FIELD NOTES — OBSERVER LOG</CoordLabel>
              <h2
                id="notes-heading"
                className="mt-3 font-[family-name:var(--f9-font-display)] text-4xl font-light italic text-[var(--f9-fg)] sm:text-5xl"
              >
                관측 기록
              </h2>
            </RevealBlock>

            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                {
                  id: "OBS-014",
                  cond: "23°C · 습도 48%",
                  quote: "톱노트가 사라지는 속도를 그래프로 먼저 보여준 건 여기가 처음이었다. 향이 아니라 데이터를 사는 기분.",
                },
                {
                  id: "OBS-027",
                  cond: "19°C · 습도 61%",
                  quote: "베이스노트 잔향이 정말 8시간 넘게 유지됐다. 스펙시트에 적힌 숫자가 그대로 재현된다.",
                },
                {
                  id: "OBS-041",
                  cond: "26°C · 습도 55%",
                  quote: "배치 번호로 재구매하는 향수는 처음이다. 매번 같은 곡선이라는 확신이 있다.",
                },
              ].map((note, i) => (
                <li key={note.id}>
                  <RevealBlock delay={i * 0.08}>
                    <figure className="h-full rounded-sm border border-[var(--f9-line)] p-6">
                      <Crosshair
                        className="h-4 w-4 text-[var(--f9-accent)]"
                        aria-hidden="true"
                      />
                      <blockquote className="mt-4 text-sm leading-relaxed text-[var(--f9-fg)]">
                        “{note.quote}”
                      </blockquote>
                      <figcaption className="mt-5 flex items-center justify-between border-t border-[var(--f9-line)] pt-4 font-mono text-[11px] tracking-[0.08em] text-[var(--f9-fg-dim)]">
                        <span>{note.id}</span>
                        <span>{note.cond}</span>
                      </figcaption>
                    </figure>
                  </RevealBlock>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- SUBSCRIBE */}
        <section
          id="subscribe"
          className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28"
          aria-labelledby="subscribe-heading"
        >
          <div className="mx-auto max-w-[1400px]">
            <div className="rounded-sm border border-[var(--f9-line)] bg-[var(--f9-bg-raised)] p-8 sm:p-14">
              <RevealBlock className="max-w-xl">
                <CoordLabel>SIGNAL — DATA FEED SUBSCRIPTION</CoordLabel>
                <h2
                  id="subscribe-heading"
                  className="mt-3 font-[family-name:var(--f9-font-display)] text-3xl font-light italic text-[var(--f9-fg)] sm:text-4xl"
                >
                  새 계측 데이터를 먼저 받아보세요
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--f9-fg-muted)]">
                  신규 배치의 휘발 곡선과 한정 컬렉션 발매 소식을 이메일로
                  보내드립니다. 광고성 정보는 보내지 않습니다.
                </p>

                {submitted ? (
                  <p
                    role="status"
                    className="mt-8 flex items-center gap-2 font-mono text-sm text-[var(--f9-accent)]"
                  >
                    <PackageCheck className="h-4 w-4" aria-hidden="true" />
                    구독 완료 — {email} 로 확인 신호를 전송했습니다.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="mt-8 max-w-md">
                    <label htmlFor="f9-email" className="mb-2 block font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-dim)]">
                      이메일 주소
                    </label>
                    <div className="flex items-stretch gap-2 border border-[var(--f9-line-strong)] bg-[var(--f9-bg)] pl-4">
                      <span className="flex items-center font-mono text-sm text-[var(--f9-fg-dim)]" aria-hidden="true">
                        {">"}
                      </span>
                      <input
                        id="f9-email"
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="name@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 flex-1 bg-transparent font-mono text-sm text-[var(--f9-fg)] outline-none placeholder:text-[var(--f9-fg-dim)]"
                      />
                      <span className="flex items-center pr-2 text-[var(--f9-accent)] f9-caret" aria-hidden="true">
                        _
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[var(--f9-accent)] px-6 font-mono text-sm font-bold tracking-[0.05em] text-[var(--f9-bg)] transition-transform hover:-translate-y-0.5 sm:w-auto"
                    >
                      <Mail className="h-4 w-4" aria-hidden="true" />
                      구독 신호 전송
                    </button>
                  </form>
                )}
              </RevealBlock>
            </div>
          </div>
        </section>
      </main>

      {/* ---------------------------------------------------------- FOOTER */}
      <footer className="border-t border-[var(--f9-line)] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="font-mono text-sm font-bold tracking-[0.2em] text-[var(--f9-fg)]">
                VOLATILE
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[var(--f9-fg-dim)]">
                정밀 계측 조향 연구소
                <br />
                서울시 성동구 LAB 04
              </p>
            </div>
            <nav aria-label="제품">
              <p className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-dim)]">INSTRUMENT</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#collection" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    컬렉션
                  </a>
                </li>
                <li>
                  <a href="#measurement" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    계측 데이터
                  </a>
                </li>
              </ul>
            </nav>
            <nav aria-label="연구소">
              <p className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-dim)]">LAB</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#protocol" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    프로토콜
                  </a>
                </li>
                <li>
                  <a href="#subscribe" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    구독
                  </a>
                </li>
              </ul>
            </nav>
            <nav aria-label="법적 고지">
              <p className="font-mono text-xs tracking-[0.1em] text-[var(--f9-fg-dim)]">LEGAL</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-[var(--f9-fg-muted)] hover:text-[var(--f9-fg)]">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <p className="mt-12 border-t border-[var(--f9-line)] pt-6 font-mono text-[11px] tracking-[0.08em] text-[var(--f9-fg-dim)]">
            © 2026 VOLATILE MEASUREMENT CO. — BATCH SYSTEM V.2.6
          </p>
        </div>
      </footer>
    </div>
  );
}
