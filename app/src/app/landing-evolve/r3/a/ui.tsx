"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import DiscoveryFeed from "./components/DiscoveryFeed";
import { STATS, VALUES, PROOF, EASE, VIEWPORT, cx, EYEBROW, FOCUS } from "./data";

const CTA_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#7d67d6] " +
  FOCUS;

const NAV_LINK =
  "rounded text-sm font-normal text-[#A1A1AA] transition-colors duration-150 hover:text-white " +
  FOCUS;

export default function LandingClient() {
  const reduced = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.08, delayChildren: 0.04 },
    },
  };
  const item: Variants = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  };

  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* nav */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0F]/80 backdrop-blur-md">
        <nav className="mx-auto flex w-full max-w-[1120px] items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className={cx("rounded text-base font-extrabold tracking-[-0.02em] text-white", FOCUS)}>
            RE:픽
          </a>
          <div className="hidden items-center gap-7 sm:flex">
            <a href="#feed" className={NAV_LINK}>
              라이브 피드
            </a>
            <a href="#how" className={NAV_LINK}>
              작동 방식
            </a>
          </div>
          <a href="#cta" className={CTA_PRIMARY}>
            매칭 시작
          </a>
        </nav>
      </header>

      {/* hero copy — 좌측정렬 비대칭, 첫 폴드 상단 */}
      <section id="top" className="mx-auto w-full max-w-[1120px] px-5 pb-8 pt-12 sm:px-8 sm:pt-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <motion.p
            variants={item}
            className={cx(EYEBROW, "inline-flex items-center gap-2 text-[#a894f7]")}
          >
            <Radio className="h-3.5 w-3.5" aria-hidden />
            Live Discovery
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 font-extrabold leading-[0.98] tracking-[-0.02em] text-white break-keep text-[clamp(2.3rem,8vw,3.1rem)] lg:text-[clamp(3rem,4.8vw,4.2rem)]"
          >
            취향이 스크롤할수록
            <br />
            <span className="text-[#6E56CF]">피드가 다시</span> 골라줍니다
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA] sm:text-lg"
          >
            아래는 지금 이 순간 당신의 취향으로 매칭된 실시간 피드입니다. 무드를
            골라 필터링하고, 카드를 눌러 AI가 왜 이 매물을 골랐는지 직접
            확인해 보세요.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#feed" className={CTA_PRIMARY}>
              내 피드 둘러보기
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </a>
            <span className="text-xs font-normal text-[#A1A1AA]">
              1분 취향 프로필 · 카드 등록 불필요
            </span>
          </motion.div>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-8 border-t border-white/10 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-xl font-extrabold tabular-nums tracking-[0.12em] text-white">
                  {s.value}
                </div>
                <div className="mt-1 text-xs font-normal text-[#A1A1AA]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 라이브 디스커버리 피드 — 히어로의 일부처럼 첫 폴드에 걸쳐 노출되는 매서너리 */}
      <DiscoveryFeed />

      {/* value — 3 split with ghost numbers */}
      <section id="how" className="border-t border-white/10 bg-white/[0.015]">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className={cx(EYEBROW, "mb-12 block text-[#a894f7]")}
          >
            Fig. 02 — 작동 방식
          </motion.p>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.index}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : i * 0.1 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-6 right-0 select-none text-7xl font-extrabold leading-none tracking-[-0.02em] text-white/[0.05]"
                >
                  {v.index}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-white">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* social proof — stat band + pull quote */}
      <section className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-24 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid grid-cols-1 gap-8 border-b border-white/10 pb-16 sm:grid-cols-3"
          >
            {PROOF.map((s) => (
              <div key={s.label}>
                <div className="text-4xl font-extrabold tabular-nums tracking-[-0.02em] text-white sm:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm font-normal text-[#A1A1AA]">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.figure
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.05 }}
            className="mt-16 max-w-3xl"
          >
            <span aria-hidden className="text-6xl font-extrabold leading-none text-[#6E56CF]">
              {"“"}
            </span>
            <blockquote className="mt-2 text-2xl font-semibold leading-[1.4] tracking-[-0.02em] text-white sm:text-[1.75rem]">
              필터 하나 눌렀을 뿐인데 제 취향 무드로만 피드가 다시 짜여요.
              스크롤이 아니라 큐레이션을 받는 느낌이었습니다.
            </blockquote>
            <figcaption className="mt-6 text-sm font-normal text-[#A1A1AA]">
              <span className="font-semibold text-white">한도영</span> · 콘텐츠 마케터
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* final CTA */}
      <section id="cta" className="border-t border-white/10">
        <div className="mx-auto w-full max-w-[1120px] px-5 py-28 sm:px-8">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl"
          >
            <h2 className="font-extrabold leading-[1.02] tracking-[-0.02em] text-white break-keep text-[clamp(2.1rem,6.4vw,3.6rem)]">
              당신의 피드는,
              <br />
              지금부터 다시 짜입니다
            </h2>
            <p className="mt-6 max-w-lg text-base font-normal leading-[1.6] text-[#A1A1AA]">
              취향 프로필을 만드는 데 1분이면 충분합니다. 그다음부터는 AI가
              실시간으로 골라 정돈한 매물만 피드에 남습니다.
            </p>
            <div className="mt-9">
              <a href="#top" className={cx(CTA_PRIMARY, "px-7 py-3.5 text-base")}>
                무료로 매칭 받기
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span className="text-base font-extrabold tracking-[-0.02em] text-white">RE:픽</span>
          <span className="text-xs font-normal text-[#A1A1AA]">
            AI가 다시 고르는 중고 · 2026 RE:PICK
          </span>
        </div>
      </footer>
    </main>
  );
}
