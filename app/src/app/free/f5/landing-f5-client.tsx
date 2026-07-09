"use client";

import Image from "next/image";
import { Fraunces } from "next/font/google";
import { useId, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Mic,
  Waves,
  FlaskConical,
  PackageCheck,
  Quote,
  ArrowRight,
  ArrowUp,
  Pause,
  Play,
  Scissors,
  Check,
} from "lucide-react";
import styles from "./f5.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const PROCESS_STEPS = [
  {
    no: "01",
    title: "RECORD — 목소리를 녹음하다",
    icon: Mic,
    body: "조용한 곳에서 15초, 정해진 한 문장을 읽습니다. 진동수·공명·숨의 리듬을 채집해요.",
  },
  {
    no: "02",
    title: "TRANSLATE — 음향을 향의 언어로 옮기다",
    icon: Waves,
    body: "고음의 배음은 시트러스와 알데하이드로, 낮고 걸걸한 숨결은 우디와 앰버로 번역됩니다.",
  },
  {
    no: "03",
    title: "BLEND — 조향사가 처방을 검수하다",
    icon: FlaskConical,
    body: "알고리즘이 제안한 노트 조합을 하우스 조향사가 다시 읽고, 손으로 다시 조정합니다.",
  },
  {
    no: "04",
    title: "ARRIVE — 음성 지문 보틀로 도착하다",
    icon: PackageCheck,
    body: "이름 대신 목소리의 파형이 새겨진 30ml 보틀이, 접수 후 4주 안에 도착합니다.",
  },
] as const;

const SCENT_NOTES = [
  "AMBERGRIS",
  "PETRICHOR",
  "SMOKED FIG",
  "COLD IRON",
  "WET INK",
  "TOBACCO FLOWER",
  "SALT ASH",
  "BURNT ORANGE PEEL",
] as const;

const LETTERS = [
  {
    quote:
      "내 목소리가 이런 냄새였다니. 처음 뿌린 날, 남편이 “이거 원래 네 향 아니었어?” 하고 물었다.",
    byline: "J. — 강남",
  },
  {
    quote:
      "형용사 없는 설명서가 오히려 정직하게 느껴졌다. 데이터로 만든 향인데, 이상하게 제일 나답다.",
    byline: "S. — 성수",
  },
  {
    quote:
      "선물로 받았는데, 상대방의 목소리를 병에 담아 건네받는 기분이 이런 거구나 싶었다.",
    byline: "M. — 한남",
  },
] as const;

const EDITION_INCLUDES = [
  "음성 분석 1회 — 15초 녹음 → 향 프로파일 리포트",
  "오리지널 조향 30ml 보틀 1병 — 음성 지문 각인",
  "분기 리필 20ml × 4 (연간 구독 시)",
  "하우스 조향사 1:1 노트 조정 1회",
] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
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
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

export default function LandingF5Client() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [marqueePaused, setMarqueePaused] = useState(false);

  const noteLoop = useMemo(() => [...SCENT_NOTES, ...SCENT_NOTES], []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <div className={`${styles.page} ${fraunces.variable} relative overflow-x-clip`}>
      <div className={styles.paperTexture} aria-hidden="true" />

      <a
        href="#main"
        className={`${styles.focusRing} fixed left-3 top-3 z-50 rounded-full bg-[var(--ink)] px-5 py-3 text-sm font-semibold text-[var(--paper)] opacity-0 pointer-events-none transition-opacity focus-visible:pointer-events-auto focus-visible:opacity-100`}
      >
        본문으로 건너뛰기
      </a>

      {/* ───────────── HEADER / MASTHEAD ───────────── */}
      <header className="relative z-10 border-b border-[var(--ink)]/15 px-5 pb-4 pt-6 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            VOL. Ⅰ — No. 001
          </p>
          <p
            className={`${fraunces.className} text-2xl italic tracking-tight text-[var(--ink)] sm:text-3xl`}
          >
            TIMBRE
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">
            PARFUM ÉDITION · 2026
          </p>
        </div>

        <nav
          aria-label="차례"
          className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-x-6 gap-y-2 border-t border-[var(--ink)]/10 pt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]"
        >
          <a className={`${styles.focusRing} rounded-sm py-1 hover:text-[var(--red)]`} href="#process">
            01 작동 원리
          </a>
          <a className={`${styles.focusRing} rounded-sm py-1 hover:text-[var(--red)]`} href="#feature">
            02 우리의 신념
          </a>
          <a className={`${styles.focusRing} rounded-sm py-1 hover:text-[var(--red)]`} href="#notes">
            03 향의 노트
          </a>
          <a className={`${styles.focusRing} rounded-sm py-1 hover:text-[var(--red)]`} href="#letters">
            04 독자 편지
          </a>
          <a className={`${styles.focusRing} rounded-sm py-1 text-[var(--red)]`} href="#edition">
            05 프라이빗 에디션
          </a>
        </nav>
      </header>

      <main id="main" className="relative z-10">
        {/* ───────────── HERO ───────────── */}
        <section aria-labelledby="hero-heading" className="relative px-5 py-14 sm:px-10 sm:py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-12 gap-y-10">
            <div
              aria-hidden="true"
              className={`${styles.folio} col-span-1 hidden select-none justify-self-center font-mono text-xs text-[var(--ink-faint)] sm:flex`}
            >
              No. 001 — TIMBRE
            </div>

            <div className="col-span-12 sm:col-span-6">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--red)]">
                  Issue No. 001 — 커버 스토리
                </p>
                <p className={`${styles.redline} mt-5 text-base sm:text-lg`}>
                  당신만을 위한 향수를 만들어드립니다
                </p>
                <h1
                  id="hero-heading"
                  className={`${fraunces.className} mt-1 text-5xl italic leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl`}
                >
                  목소리에는,
                  <br />
                  향이 있다.
                </h1>
                <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg">
                  15초, 숨을 골라 한 문장을 말해보세요. TIMBRE는 목소리의 진동수와
                  숨결의 온도를 채집해, 세상에 없던 향 하나로 옮겨 적습니다. 이름
                  대신 음성 지문이 새겨진 30ml, 단 한 병.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#edition"
                    className={`${styles.focusRing} inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--ink)] px-7 py-3 text-sm font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--red)]`}
                  >
                    내 목소리 예약하기
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                  <a
                    href="#process"
                    className={`${styles.focusRing} inline-flex min-h-[44px] items-center border-b border-[var(--ink)]/40 px-1 py-3 text-sm font-semibold text-[var(--ink)] hover:border-[var(--red)] hover:text-[var(--red)]`}
                  >
                    작동 원리 읽기 ↓
                  </a>
                </div>

                <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                  발행 — TIMBRE ATELIER, SEOUL &nbsp;·&nbsp; 표지 향 — WET INK No. 4
                </p>
              </Reveal>
            </div>

            <div className="col-span-12 sm:col-span-5 sm:col-start-8">
              <Reveal delay={0.15} className="relative">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-[var(--paper-deep)] shadow-[0_30px_60px_-25px_rgba(23,19,15,0.45)]">
                  <Image
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1000&q=80"
                    alt="목걸이 체인을 손끝으로 매만지며 카메라를 정면으로 응시하는 인물의 초상. 따뜻한 붉은 갈색 벽을 배경으로 목과 쇄골 주변에 시선이 머문다."
                    fill
                    priority
                    sizes="(min-width: 640px) 40vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  Fig. 0 — 표지, 음성 지문 채집 직전
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── PROCESS / TOC ───────────── */}
        <section
          id="process"
          aria-labelledby="process-heading"
          className="scroll-mt-24 border-y border-[var(--ink)]/15 bg-[var(--paper-deep)]/50 px-5 py-16 sm:px-10 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--red)]">
                차례 — Contents
              </p>
              <h2
                id="process-heading"
                className={`${fraunces.className} mt-2 max-w-2xl text-3xl italic leading-tight text-[var(--ink)] sm:text-4xl`}
              >
                네 페이지를 넘기면, 향이 됩니다
              </h2>
            </Reveal>

            <ol className="mt-10 divide-y divide-[var(--ink)]/12 border-t border-[var(--ink)]/15">
              {PROCESS_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.no}>
                    <Reveal delay={i * 0.06}>
                      <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-baseline sm:gap-6">
                        <span className="font-mono text-sm text-[var(--red)] sm:w-10">
                          {step.no}
                        </span>
                        <h3
                          className={`${fraunces.className} flex items-center gap-2.5 text-xl italic text-[var(--ink)] sm:w-[22rem] sm:shrink-0`}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-[var(--gold)]" aria-hidden="true" />
                          {step.title}
                        </h3>
                        <span className={styles.dotLeader} aria-hidden="true" />
                        <p className="max-w-xl text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                          {step.body}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ───────────── EDITORIAL SPREAD ───────────── */}
        <section id="feature" aria-labelledby="feature-heading" className="scroll-mt-24 px-5 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto grid max-w-6xl grid-cols-12 gap-x-8 gap-y-10">
            <div className="col-span-12 sm:col-span-7">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--red)]">
                  피처 — Feature
                </p>
                <h2
                  id="feature-heading"
                  className={`${fraunces.className} mt-2 text-3xl italic leading-tight text-[var(--ink)] sm:text-4xl`}
                >
                  우리는 형용사를 믿지 않는다
                </h2>
                <p
                  className={`${styles.dropCap} mt-6 max-w-xl text-base leading-[1.9] text-[var(--ink-soft)] sm:text-lg`}
                >
                  &lsquo;우아한&rsquo;, &lsquo;신비로운&rsquo;, &lsquo;매혹적인&rsquo; — 향수
                  업계가 백 년 넘게 반복해온 말들. TIMBRE는 이 형용사들을 지운다.
                  대신 스펙트로그램과 초당 진동수, 포먼트를 읽는다. 좋은 향은
                  취향이 아니라 데이터라고, 우리는 감히 믿는다.
                </p>

                <blockquote
                  className={`${styles.pullQuote} ${fraunces.className} mt-10 max-w-sm border-l-2 border-[var(--red)] pl-6 text-2xl italic leading-snug text-[var(--ink)] sm:text-3xl`}
                >
                  <Quote className="mb-2 h-6 w-6 text-[var(--red)]" aria-hidden="true" />
                  형용사 대신, 파형을.
                  <footer className="mt-4 font-mono text-xs not-italic uppercase tracking-[0.16em] text-[var(--ink-faint)]">
                    <cite>— TIMBRE 수석 조향사</cite>
                  </footer>
                </blockquote>
              </Reveal>
            </div>

            <div className="col-span-12 sm:col-span-5">
              <Reveal delay={0.15}>
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[var(--paper-deep)]">
                  <Image
                    src="https://images.unsplash.com/photo-1595351298020-038700609878?auto=format&fit=crop&w=900&q=80"
                    alt="작업대 위에 놓인 도자기 작업 도구와 안료 용기들, 회전하는 물레를 위에서 내려다본 모습. 조향사의 손끝 조정 과정을 은유한다."
                    fill
                    sizes="(min-width: 640px) 35vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--ink-faint)]">
                  Fig. 1 — 아틀리에 작업대, 서울 성수
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── SCENT NOTES MARQUEE ───────────── */}
        <section
          id="notes"
          aria-labelledby="notes-heading"
          className="scroll-mt-24 bg-[var(--ink)] px-5 py-14 text-[var(--paper)] sm:px-10"
        >
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
            <h2 id="notes-heading" className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--paper)]/70">
              TIMBRE가 다루는 향의 노트
            </h2>
            <button
              type="button"
              onClick={() => setMarqueePaused((p) => !p)}
              aria-pressed={marqueePaused}
              className={`${styles.focusRing} inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--paper)]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--paper)] hover:border-[var(--paper)]`}
            >
              {marqueePaused ? (
                <>
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  재생
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  정지
                </>
              )}
            </button>
          </div>

          <div className={`${styles.marqueeViewport} mt-8`}>
            <div
              className={`${styles.marqueeTrack} ${marqueePaused ? styles.paused : ""}`}
              aria-hidden="true"
            >
              {noteLoop.map((note, i) => (
                <span
                  key={`${note}-${i}`}
                  className={`${fraunces.className} flex items-center whitespace-nowrap px-6 text-3xl italic text-[var(--paper)]/90 sm:text-5xl`}
                >
                  {note}
                  <span className="ml-6 h-2 w-2 rounded-full bg-[var(--red)]" />
                </span>
              ))}
            </div>
            <p className="sr-only">
              AMBERGRIS, PETRICHOR, SMOKED FIG, COLD IRON, WET INK, TOBACCO FLOWER,
              SALT ASH, BURNT ORANGE PEEL
            </p>
          </div>
        </section>

        {/* ───────────── LETTERS TO THE EDITOR ───────────── */}
        <section id="letters" aria-labelledby="letters-heading" className="scroll-mt-24 px-5 py-16 sm:px-10 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[var(--red)]">
                독자 편지 — Letters
              </p>
              <h2
                id="letters-heading"
                className={`${fraunces.className} mt-2 text-3xl italic leading-tight text-[var(--ink)] sm:text-4xl`}
              >
                받은 편지함에서
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {LETTERS.map((letter, i) => (
                <Reveal key={letter.byline} delay={i * 0.08}>
                  <blockquote className="flex h-full flex-col justify-between border border-[var(--ink)]/15 bg-[var(--paper)] p-6">
                    <p className="text-[15px] leading-relaxed text-[var(--ink-soft)]">
                      &ldquo;{letter.quote}&rdquo;
                    </p>
                    <footer className="mt-6 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--ink-faint)]">
                      <Check className="h-3.5 w-3.5 text-[var(--red)]" aria-hidden="true" />
                      <cite>{letter.byline}</cite>
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────── PRIVATE EDITION / WAITLIST ───────────── */}
        <section
          id="edition"
          aria-labelledby="edition-heading"
          className="scroll-mt-24 border-t border-[var(--ink)]/15 px-5 py-16 sm:px-10 sm:py-24"
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.28em] text-[var(--red)]">
                <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
                구독 광고 — Classified
              </div>

              <div className={`${styles.cutLine} mt-3 border border-[var(--ink)]/15 bg-[var(--paper-deep)]/40 p-7 sm:p-10`}>
                <h2
                  id="edition-heading"
                  className={`${fraunces.className} text-3xl italic text-[var(--ink)] sm:text-4xl`}
                >
                  프라이빗 에디션
                </h2>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className={`${fraunces.className} text-4xl italic text-[var(--ink)]`}>
                    ₩168,000
                  </span>
                  <span className="text-sm text-[var(--ink-faint)]">/ 최초 조향 + 연간 리필</span>
                </p>

                <ul className="mt-6 space-y-2.5">
                  {EDITION_INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink-soft)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>

                <form onSubmit={handleSubmit} className="mt-8 border-t border-[var(--ink)]/15 pt-7" noValidate>
                  <label
                    htmlFor={emailId}
                    className="block font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--ink-soft)]"
                  >
                    이메일 주소
                  </label>
                  <div className="mt-2.5 flex flex-col gap-3 sm:flex-row">
                    <input
                      id={emailId}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={`${styles.focusRing} min-h-[44px] flex-1 rounded-sm border border-[var(--ink)]/25 bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)]`}
                    />
                    <button
                      type="submit"
                      className={`${styles.focusRing} inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-sm bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-[var(--paper)] transition-colors hover:bg-[var(--red)]`}
                    >
                      대기 명단 등록
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-[var(--ink-faint)]">
                    대기 명단 등록 시 첫 조향 15% 할인 코드가 발송됩니다.
                  </p>
                  <p aria-live="polite" className="mt-3 text-sm font-semibold text-[var(--red)]">
                    {submitted
                      ? "등록되었습니다 — 곧 음성 녹음 안내를 보내드릴게요."
                      : ""}
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ───────────── FOOTER / COLOPHON ───────────── */}
      <footer className="relative z-10 border-t border-[var(--ink)]/15 bg-[var(--paper-deep)]/50 px-5 py-12 sm:px-10">
        <h2 className="sr-only">콜로폰 — 발행 정보</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className={`${fraunces.className} text-xl italic text-[var(--ink)]`}>TIMBRE</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--ink-soft)]">
              목소리를 향으로 옮기는 서울의 조향 아틀리에.
            </p>
          </div>
          <div className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink-soft)]">
            <p>발행 — TIMBRE ATELIER</p>
            <p className="mt-1.5">위치 — 서울, 성수</p>
            <p className="mt-1.5">인쇄 — 이 페이지는 데이터로 조향되었습니다</p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-[var(--ink-soft)] sm:items-end">
            <a href="#" className={`${styles.focusRing} rounded-sm hover:text-[var(--red)]`}>
              이용약관
            </a>
            <a href="#" className={`${styles.focusRing} rounded-sm hover:text-[var(--red)]`}>
              개인정보처리방침
            </a>
            <a
              href="#hero-heading"
              className={`${styles.focusRing} mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-sm font-mono text-xs uppercase tracking-[0.14em] hover:text-[var(--red)]`}
            >
              맨 위로
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl font-mono text-[11px] text-[var(--ink-faint)]">
          © 2026 TIMBRE ATELIER. 이 랜딩 페이지에 등장하는 제품·브랜드는 가상의
          컨셉입니다.
        </p>
      </footer>
    </div>
  );
}
