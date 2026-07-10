"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import type { CSSProperties, FormEvent } from "react";
import Image from "next/image";
import { Fraunces, Space_Mono } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Moon,
  Orbit,
  Rocket,
  Sun,
  Telescope,
} from "lucide-react";

/**
 * PARALLAX — 존재감은 광년으로 잰다.
 * 가상의 향수 브랜드. 향의 강도(농도)를 전통적 EDT/EDP 표기 대신
 * 실제 천문학적 거리(달, 태양, 보이저 1호, 안드로메다)로 치환한 컨셉.
 */

const display = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-f23-display",
  display: "swap",
});

const dataMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-f23-mono",
  display: "swap",
});

const BRAND_STYLE = {
  "--void": "#050507",
  "--void-2": "#0c0c15",
  "--ivory": "#f3efe6",
  "--ivory-muted": "rgba(243,239,230,0.64)",
  "--ivory-faint": "rgba(243,239,230,0.4)",
  "--gold": "#c9a876",
  "--gold-soft": "#e7d2a2",
  "--gold-glow": "rgba(201,168,118,0.16)",
  "--line": "rgba(243,239,230,0.12)",
  "--nebula": "#6b5bb8",
} as CSSProperties;

/* ---------------------------------------------------------------------- */
/* prefers-reduced-motion — matchMedia를 useSyncExternalStore로 직접 구독.  */
/* framer-motion 내장 useReducedMotion이 OS 설정을 못 잡는 환경 대응.       */
/* ---------------------------------------------------------------------- */

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
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* 정적 별자리 — 인덱스 기반 결정론적 좌표(Math.random 금지, 하이드레이션 안전) */
/* ---------------------------------------------------------------------- */

function generateStars(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const x = (i * 53.7) % 100;
    const y = (i * 31.3 + ((i * i) % 17) * 2.1) % 100;
    const r = 0.5 + (i % 4) * 0.35;
    const o = 0.25 + ((i * 7) % 10) * 0.06;
    return { x, y, r, o };
  });
}
const STARS = generateStars(110);

function Starfield({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="none"
    >
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill="var(--ivory)"
          fillOpacity={s.o}
        />
      ))}
    </svg>
  );
}

function NebulaGlow() {
  const reduced = usePrefersReducedMotion();
  return (
    <>
      <motion.div
        aria-hidden="true"
        className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,var(--gold)_0%,transparent_70%)] opacity-20 blur-3xl"
        animate={reduced ? undefined : { opacity: [0.14, 0.26, 0.14] }}
        transition={
          reduced ? undefined : { duration: 11, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        aria-hidden="true"
        className="absolute top-1/3 -right-48 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,var(--nebula)_0%,transparent_70%)] opacity-20 blur-3xl"
        animate={reduced ? undefined : { opacity: [0.1, 0.22, 0.1] }}
        transition={
          reduced
            ? undefined
            : { duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }
        }
      />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* 데이터                                                                  */
/* ---------------------------------------------------------------------- */

type Coordinate = {
  code: string;
  name: string;
  distance: string;
  unit: string;
  note: string;
  desc: string;
  notes: string;
  Icon: typeof Moon;
  image?: { src: string; alt: string };
};

const COORDINATES: Coordinate[] = [
  {
    code: "No. 01",
    name: "LUNA",
    distance: "384,400",
    unit: "km",
    note: "지구 – 달",
    desc: "피부 위에 남는 가장 가까운 속삭임. 가장 옅고, 가장 빨리 흩어진다.",
    notes: "화이트 머스크 · 아이리스 · 시트러스 페탈",
    Icon: Moon,
    image: {
      src: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1600&auto=format&fit=crop",
      alt: "짙은 밤하늘을 가득 채운 별빛과 은하수",
    },
  },
  {
    code: "No. 02",
    name: "HELIOS",
    distance: "149,600,000",
    unit: "km · 1 AU",
    note: "지구 – 태양",
    desc: "살결의 온기를 닮은 거리. 낮 동안 은은히 곁에 머문다.",
    notes: "앰버 · 샌달우드 · 통카빈",
    Icon: Sun,
  },
  {
    code: "No. 03",
    name: "VOYAGER",
    distance: "약 250억",
    unit: "km",
    note: "탐사선 보이저 1호",
    desc: "인류가 만든 것 중 가장 멀리 간 여행자가 있는 곳. 하루가 지나도 남는다.",
    notes: "스모키 인센스 · 블랙 레더 · 베티버",
    Icon: Rocket,
  },
  {
    code: "No. 04",
    name: "ANDROMEDA",
    distance: "2,500,000",
    unit: "광년",
    note: "우리 은하 – 안드로메다 은하",
    desc: "가장 가까운 이웃 은하까지의 거리. 사라지지 않는, 유일하게 짙은 잔향.",
    notes: "다크 우드 · 앰버그리스 · 통카빈 압솔루",
    Icon: Orbit,
    image: {
      src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1600&auto=format&fit=crop",
      alt: "보랏빛과 푸른빛이 소용돌이치는 은하와 성운",
    },
  },
];

const SCALE_MARKS = [
  { label: "LUNA", value: "38만 km", size: "h-2 w-2" },
  { label: "HELIOS", value: "1.5억 km", size: "h-3 w-3" },
  { label: "VOYAGER", value: "250억 km", size: "h-4 w-4" },
  { label: "ANDROMEDA", value: "250만 광년", size: "h-6 w-6" },
];

const COORDINATES_SOURCED = [
  { place: "N 37.5°, 서울", ingredient: "화이트 머스크 증류" },
  { place: "N 43.7°, 프랑스 그라스", ingredient: "5월의 재스민" },
  { place: "S 33.9°, 마다가스카르", ingredient: "야생 베티버 뿌리" },
  { place: "N 26.2°, 오만 도파르", ingredient: "야생 유향(인센스)" },
];

/* ---------------------------------------------------------------------- */
/* 메인 컴포넌트                                                           */
/* ---------------------------------------------------------------------- */

export default function Landing() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!email) return;
      setSubmitted(true);
    },
    [email],
  );

  return (
    <div
      style={BRAND_STYLE}
      className={`${display.variable} ${dataMono.variable} relative min-h-screen w-full bg-[var(--void)] text-[var(--ivory)] [color-scheme:dark] selection:bg-[var(--gold)] selection:text-[var(--void)]`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[var(--gold)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--void)] focus:outline-none"
      >
        본문으로 건너뛰기
      </a>

      {/* ---------------- 헤더 ---------------- */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--void)]/80 backdrop-blur-md">
        <nav
          aria-label="주요 메뉴"
          className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10"
        >
          <a
            href="#hero"
            className="flex min-h-11 items-center gap-2 rounded-full text-lg tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
          >
            <Orbit aria-hidden="true" className="h-5 w-5 text-[var(--gold)]" />
            <span className="font-[family-name:var(--font-f23-display)] italic">
              Parallax
            </span>
          </a>
          <ul className="hidden items-center gap-8 sm:flex">
            <li>
              <a
                href="#collection"
                className="flex min-h-11 items-center text-sm tracking-wide text-[var(--ivory-muted)] transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                컬렉션
              </a>
            </li>
            <li>
              <a
                href="#philosophy"
                className="flex min-h-11 items-center text-sm tracking-wide text-[var(--ivory-muted)] transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                필로소피
              </a>
            </li>
          </ul>
          <a
            href="#waitlist"
            className="flex min-h-11 items-center rounded-full border border-[var(--gold)] px-5 text-sm font-medium tracking-wide text-[var(--gold)] transition-colors hover:bg-[var(--gold)] hover:text-[var(--void)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
          >
            대기열 등록
          </a>
        </nav>
      </header>

      <main id="main">
        {/* ---------------- 히어로 ---------------- */}
        <section
          id="hero"
          className="relative flex min-h-screen scroll-mt-24 flex-col justify-end overflow-hidden px-6 pb-20 md:px-10"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?q=80&w=2400&auto=format&fit=crop"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,0.98),rgba(5,5,7,0.72)_38%,rgba(5,5,7,0.55)_65%,rgba(5,5,7,0.35))]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,5,7,0.85),transparent_30%)]" />
            <Starfield className="opacity-40" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl">
            <p className="font-[family-name:var(--font-f23-mono)] text-xs tracking-[0.35em] text-[var(--gold-soft)] uppercase">
              Parallax Parfums — No. 001–004
            </p>
            <h1 className="mt-6 font-[family-name:var(--font-f23-display)] text-[clamp(3.2rem,13vw,9.5rem)] leading-[0.92] font-light italic">
              Parallax
            </h1>
            <p className="mt-8 max-w-xl font-[family-name:var(--font-f23-display)] text-2xl leading-snug text-[var(--ivory)] md:text-3xl">
              존재감은, 광년으로 잰다.
            </p>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--ivory-muted)]">
              지구에서 달까지 38만 킬로미터. 태양까지 1억 5천만 킬로미터. 안드로메다
              은하까지 250만 광년. 우리는 그 거리를 향으로 옮겨 담았다.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#collection"
                className="flex min-h-11 items-center gap-2 rounded-full bg-[var(--gold)] px-6 text-sm font-semibold tracking-wide text-[var(--void)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                컬렉션 보기
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
              <a
                href="#waitlist"
                className="flex min-h-11 items-center rounded-full border border-[var(--line)] px-6 text-sm font-medium tracking-wide text-[var(--ivory)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                웨이팅 리스트
              </a>
            </div>
          </div>

          <motion.div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={reducedMotion ? undefined : { y: [0, 10, 0] }}
            transition={
              reducedMotion
                ? undefined
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <ChevronDown className="h-6 w-6 text-[var(--ivory-faint)]" />
          </motion.div>
        </section>

        {/* ---------------- 선언 ---------------- */}
        <section
          aria-labelledby="manifesto-heading"
          className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--void)] px-6 py-28 md:px-10 md:py-40"
        >
          <NebulaGlow />
          <div className="relative mx-auto max-w-4xl">
            <Reveal>
              <h2
                id="manifesto-heading"
                className="font-[family-name:var(--font-f23-mono)] text-xs tracking-[0.35em] text-[var(--gold-soft)] uppercase"
              >
                시차 (視差), Parallax
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <blockquote className="mt-8 font-[family-name:var(--font-f23-display)] text-3xl leading-[1.35] font-light text-[var(--ivory)] italic md:text-5xl">
                &ldquo;향수는 오랫동안 거리를 재는 방식이었다 — 얼마나 가까이 다가와야
                느껴지는가, 얼마나 멀리서도 남는가. 우리는 그 물음에 천문학으로
                답했다.&rdquo;
              </blockquote>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--ivory-muted)]">
                시차는 관측 지점이 달라지면 별의 위치가 달라 보이는 현상이다. 당신이
                서 있는 자리에 따라, 향은 다르게 도착한다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- 거리=농도 스케일 ---------------- */}
        <section
          aria-labelledby="scale-heading"
          className="relative border-t border-[var(--line)] bg-[var(--void-2)] px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <h2
                id="scale-heading"
                className="font-[family-name:var(--font-f23-display)] text-3xl font-light md:text-4xl"
              >
                거리가 곧 농도다
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--ivory-muted)]">
                가까운 향은 옅고 조용하게, 먼 향은 짙고 오래 남는다. 네 개의 좌표,
                네 개의 향.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="mt-20">
              <div className="relative flex items-end justify-between gap-4">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(to_right,rgba(201,168,118,0.08),rgba(201,168,118,0.8))]"
                />
                {SCALE_MARKS.map((mark) => (
                  <div
                    key={mark.label}
                    className="relative flex flex-col items-center gap-4"
                  >
                    <span className="font-[family-name:var(--font-f23-mono)] text-[10px] tracking-widest text-[var(--ivory-faint)] uppercase md:text-xs">
                      {mark.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`${mark.size} rounded-full bg-[var(--gold)] shadow-[0_0_16px_var(--gold-glow)]`}
                    />
                    <span className="font-[family-name:var(--font-f23-mono)] text-xs text-[var(--gold-soft)] md:text-sm">
                      {mark.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-16 text-xs text-[var(--ivory-faint)]">
                * 위 시각화는 인지적 이해를 돕기 위한 비선형(로그) 스케일입니다.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------------- 컬렉션 ---------------- */}
        <section
          id="collection"
          aria-labelledby="collection-heading"
          className="scroll-mt-24 border-t border-[var(--line)] bg-[var(--void)] px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <h2
                id="collection-heading"
                className="font-[family-name:var(--font-f23-display)] text-3xl font-light md:text-4xl"
              >
                The Collection — 4 Coordinates
              </h2>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
              {COORDINATES.map((c, i) => (
                <Reveal key={c.name} delay={i * 0.08}>
                  <article className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden bg-[var(--void-2)] p-8 md:p-12">
                    {c.image ? (
                      <div className="absolute inset-0" aria-hidden="true">
                        <Image
                          src={c.image.src}
                          alt={c.image.alt}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          loading="lazy"
                          className="object-cover opacity-45 transition-opacity duration-700 group-hover:opacity-60"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,0.96),rgba(5,5,7,0.55)_55%,rgba(5,5,7,0.35))]" />
                      </div>
                    ) : (
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,168,118,0.14),transparent_60%)]"
                      />
                    )}

                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-f23-mono)] text-xs tracking-widest text-[var(--gold-soft)] uppercase">
                          {c.code} · {c.note}
                        </span>
                        <c.Icon
                          aria-hidden="true"
                          className="h-5 w-5 text-[var(--gold)]"
                        />
                      </div>
                      <h3 className="mt-4 font-[family-name:var(--font-f23-display)] text-4xl font-light italic md:text-5xl">
                        {c.name}
                      </h3>
                      <p className="mt-3 font-[family-name:var(--font-f23-mono)] text-2xl text-[var(--ivory)] md:text-3xl">
                        {c.distance}
                        <span className="ml-2 text-sm text-[var(--ivory-faint)]">
                          {c.unit}
                        </span>
                      </p>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--ivory-muted)]">
                        {c.desc}
                      </p>
                      <p className="mt-4 text-xs tracking-wide text-[var(--ivory-faint)]">
                        {c.notes}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- 필로소피 ---------------- */}
        <section
          id="philosophy"
          aria-labelledby="philosophy-heading"
          className="scroll-mt-24 border-t border-[var(--line)] bg-[var(--void-2)] px-6 py-24 md:px-10 md:py-32"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
            <Reveal>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[var(--line)]">
                <Image
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
                  alt="우주에서 바라본 지구, 대기의 푸른 곡선과 어둠"
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,7,0.5),transparent_50%)]" />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2
                  id="philosophy-heading"
                  className="font-[family-name:var(--font-f23-display)] text-3xl font-light md:text-4xl"
                >
                  궤도 위의 조향
                </h2>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--ivory-muted)]">
                  모든 향은 궤도를 그린다. 탑노트는 근일점, 라스트노트는 원일점.
                  우리는 그 궤도의 이심률을 조정하는 사람들이다.
                </p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="mt-10 space-y-4 border-t border-[var(--line)] pt-8">
                  {COORDINATES_SOURCED.map((s) => (
                    <div
                      key={s.place}
                      className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
                    >
                      <dt className="font-[family-name:var(--font-f23-mono)] w-full shrink-0 text-xs tracking-widest text-[var(--gold-soft)] uppercase sm:w-48">
                        {s.place}
                      </dt>
                      <dd className="text-sm text-[var(--ivory-muted)]">
                        {s.ingredient}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------- 웨이팅리스트 ---------------- */}
        <section
          id="waitlist"
          aria-labelledby="waitlist-heading"
          className="relative scroll-mt-24 overflow-hidden border-t border-[var(--line)] bg-[var(--void)] px-6 py-28 md:px-10 md:py-40"
        >
          <Starfield className="opacity-25" />
          <div className="relative mx-auto max-w-2xl text-center">
            <Reveal>
              <Telescope
                aria-hidden="true"
                className="mx-auto h-8 w-8 text-[var(--gold)]"
              />
              <h2
                id="waitlist-heading"
                className="mt-6 font-[family-name:var(--font-f23-display)] text-4xl font-light italic md:text-5xl"
              >
                궤도에 합류하기
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--ivory-muted)]">
                발사 대기열에 등록하면, 컬렉션이 지구 궤도에 진입하는 순간 가장 먼저
                신호를 받는다.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-10 flex max-w-md flex-col gap-4 sm:flex-row sm:items-start"
                noValidate={false}
              >
                <div className="flex-1 text-left">
                  <label
                    htmlFor="waitlist-email"
                    className="mb-2 block text-xs tracking-widest text-[var(--ivory-faint)] uppercase"
                  >
                    이메일 주소
                  </label>
                  <input
                    id="waitlist-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-describedby="waitlist-status"
                    placeholder="you@parallax.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-11 w-full rounded-full border border-[var(--line)] bg-[var(--void-2)] px-5 py-3 text-sm text-[var(--ivory)] placeholder:text-[var(--ivory-faint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
                  />
                </div>
                <button
                  type="submit"
                  className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--gold)] px-6 py-3 text-sm font-semibold tracking-wide text-[var(--void)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)] sm:mt-6"
                >
                  등록
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </form>
              <p
                id="waitlist-status"
                role="status"
                aria-live="polite"
                className="mt-4 text-sm text-[var(--gold-soft)]"
              >
                {submitted
                  ? "궤도 진입 완료 — 발사 신호가 도착하면 가장 먼저 알려드립니다."
                  : ""}
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------- 푸터 ---------------- */}
      <footer className="border-t border-[var(--line)] bg-[var(--void)] px-6 py-14 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-[family-name:var(--font-f23-display)] text-xl italic">
              Parallax
            </p>
            <p className="mt-2 text-xs text-[var(--ivory-faint)]">
              © 2026 Parallax Parfums. Seoul — Grasse.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-[var(--ivory-muted)]">
            <li>
              <a
                href="#collection"
                className="flex min-h-11 items-center transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                컬렉션
              </a>
            </li>
            <li>
              <a
                href="#philosophy"
                className="flex min-h-11 items-center transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                필로소피
              </a>
            </li>
            <li>
              <a
                href="mailto:orbit@parallax.parfums"
                className="flex min-h-11 items-center transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                Newsletter
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-11 items-center transition-colors hover:text-[var(--gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--void)]"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
