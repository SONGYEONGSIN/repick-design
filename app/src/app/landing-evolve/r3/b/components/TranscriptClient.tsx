"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Bot, Quote } from "lucide-react";
import ScrollProgress from "./ScrollProgress";
import ThinkingIndicator from "./ThinkingIndicator";
import ProductCard from "./ProductCard";
import {
  cx,
  CONVERSATION,
  VALUES,
  STATS,
  TESTIMONIALS,
  EASE,
  VIEWPORT,
  AI_REPLY_DELAY,
  EYEBROW,
  CAPTION,
  NUM,
  FOCUS,
} from "../data";

const CARD = "rounded-2xl border border-white/10 bg-white/[0.02]";

export default function TranscriptClient() {
  const reduced = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: reduced ? 1 : 0, y: reduced ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.6, ease: EASE } },
  };
  const heroStagger: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduced ? 0 : 0.09, delayChildren: reduced ? 0 : 0.04 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white [color-scheme:dark]">
      <ScrollProgress />

      <a
        href="#main-content"
        className={cx(
          "sr-only rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0B0B0F] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
          FOCUS,
        )}
      >
        본문으로 건너뛰기
      </a>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
          <a
            href="#hero"
            aria-label="RE:픽 홈"
            className={cx(
              "inline-flex items-center gap-1 rounded-md text-xl font-extrabold tracking-tight text-white",
              FOCUS,
            )}
          >
            <span className="rounded bg-[#6E56CF] px-1.5 py-0.5 text-base font-semibold text-white">
              RE:
            </span>
            픽
          </a>
          <Link
            href="/dashboard"
            className={cx(
              "inline-flex min-h-10 items-center rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-white/[0.08]",
              FOCUS,
            )}
          >
            무료로 시작
          </Link>
        </div>
      </header>

      <main id="main-content">
        {/* HERO */}
        <section
          id="hero"
          className="relative overflow-hidden border-b border-white/10 px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-28"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 hidden select-none text-[24vw] font-extrabold leading-none tracking-[-0.05em] text-white/[0.035] sm:block"
          >
            01
          </span>
          <div className="relative mx-auto w-full max-w-[1120px]">
            <motion.div
              variants={heroStagger}
              initial="hidden"
              animate="show"
              className="max-w-2xl"
            >
              <motion.div variants={fadeUp} className="flex items-center gap-3">
                <span className={cx(EYEBROW, "text-[#6E56CF]")}>AI 큐레이터와의 대화</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                <span className={cx(EYEBROW, "text-[#A1A1AA]")}>LIVE TRANSCRIPT</span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="mt-6 text-[clamp(2.3rem,7.4vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance text-white"
              >
                취향을 한마디 던지면
                <br />
                AI가 <span className="text-[#6E56CF]">되물으며</span> 골라옵니다
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-base leading-[1.75] text-[#A1A1AA] sm:text-lg"
              >
                수많은 중고 매물 속에서 지금 당신에게 필요한 단 하나를 찾을 때까지 — AI
                큐레이터가 실시간으로 되묻고, 근거를 대며, 다시 골라줍니다.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-9 flex flex-col items-start gap-5">
                <Link
                  href="/dashboard"
                  className={cx(
                    "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#6E56CF] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d67d6]",
                    FOCUS,
                  )}
                >
                  무료로 취향 등록하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <a
                  href="#conversation"
                  className={cx(
                    "inline-flex items-center gap-2 rounded-md text-[0.8125rem] text-[#A1A1AA] transition-colors hover:text-white",
                    FOCUS,
                  )}
                >
                  <span aria-hidden="true" className="h-px w-6 bg-white/25" />
                  실제 대화 지켜보기
                </a>
              </motion.div>
            </motion.div>

            {/* 대화 미리보기 스니펫 */}
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.3 }}
              className={cx(CARD, "mt-14 max-w-xl px-5 py-5 sm:px-6 sm:py-6")}
            >
              <p className={cx(CAPTION, "text-white/35")}>Fig. 01 — 대화 로그 일부</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/80">
                &ldquo;{CONVERSATION[0].user}&rdquo;
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-white">
                {CONVERSATION[0].aiIntro}
              </p>
            </motion.div>
          </div>
        </section>

        {/* CONVERSATION — 핵심 인터랙션: 스크롤 연동 트랜스크립트 리빌 */}
        <section id="conversation" className="scroll-mt-24 border-b border-white/10 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <span className={cx(EYEBROW, "text-[#6E56CF]")}>02</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                <span className={cx(EYEBROW, "text-[#A1A1AA]")}>실제 대화 전문</span>
              </div>
              <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-white">
                아래로 내리면, 대화가 이어집니다
              </h2>
              <p className="mt-4 max-w-md text-[0.9375rem] leading-[1.7] text-[#A1A1AA]">
                가려낸 답이 아니라, 되묻고 검증하는 과정 그대로예요. 매칭 근거·컨디션
                등급·인증 배지·할인율까지 대화 속에서 확인하세요.
              </p>
            </motion.div>

            <ol className="mt-14 flex max-w-[760px] flex-col gap-14">
              {CONVERSATION.map((turn) => (
                <motion.li
                  key={turn.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEWPORT}
                  className="flex flex-col gap-4"
                >
                  {/* user message */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.9375rem] leading-relaxed text-white/90">
                      {turn.user}
                    </div>
                  </div>

                  {/* AI message */}
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#6E56CF]/40 bg-[#6E56CF]/15 text-[#6E56CF]"
                    >
                      <Bot className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-[0.8125rem] font-semibold text-white">
                          AI 큐레이터
                        </span>
                        <ThinkingIndicator steps={turn.thinking} />
                      </div>

                      <motion.div
                        initial={reduced ? false : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={VIEWPORT}
                        transition={{
                          duration: 0.5,
                          ease: EASE,
                          delay: reduced ? 0 : AI_REPLY_DELAY,
                        }}
                        className="mt-2 flex flex-col items-start gap-3"
                      >
                        <p className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#6E56CF]/25 bg-[#6E56CF]/[0.07] px-4 py-3 text-[0.9375rem] leading-relaxed text-white">
                          {turn.aiIntro}
                        </p>

                        {turn.product ? <ProductCard product={turn.product} /> : null}

                        {turn.aiClose ? (
                          <p className="max-w-[85%] text-[0.875rem] leading-relaxed text-[#A1A1AA]">
                            {turn.aiClose}
                          </p>
                        ) : null}

                        {turn.cta ? (
                          <Link
                            href={turn.cta.href}
                            className={cx(
                              "group mt-1 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#6E56CF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7d67d6]",
                              FOCUS,
                            )}
                          >
                            {turn.cta.label}
                            <ArrowRight
                              className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : null}
                      </motion.div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* VALUES — 가치 3분할 */}
        <section className="border-b border-white/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <span className={cx(EYEBROW, "text-[#6E56CF]")}>03</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                <span className={cx(EYEBROW, "text-[#A1A1AA]")}>대화가 지키는 것</span>
              </div>
              <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-white">
                매 대화마다, 세 가지를 지킵니다
              </h2>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
            >
              {VALUES.map((v) => {
                const Icon = v.icon;
                return (
                  <div key={v.index} className="bg-[#0B0B0F] p-7 sm:p-8">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/12 text-[#6E56CF]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className={cx(EYEBROW, NUM, "text-white/30")}>{v.index}</span>
                    </div>
                    <p className="mt-6 text-[1.1875rem] font-semibold tracking-[-0.01em] text-white">
                      {v.title}
                    </p>
                    <p className="mt-3 text-[0.875rem] leading-relaxed text-[#A1A1AA]">{v.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-b border-white/10 py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <span className={cx(EYEBROW, "text-[#6E56CF]")}>04</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                <span className={cx(EYEBROW, "text-[#A1A1AA]")}>대화를 마친 사람들</span>
              </div>
              <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-white">
                안목 있는 사람들이 먼저 대화합니다
              </h2>
            </motion.div>

            <motion.dl
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
            >
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#0B0B0F] px-6 py-8 text-center">
                  <dt className="text-[0.8125rem] text-[#A1A1AA]">{s.label}</dt>
                  <dd
                    className={cx(
                      "mt-2 text-[clamp(1.6rem,4vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white",
                      NUM,
                    )}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </motion.dl>

            <motion.ul
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-8 grid gap-4 lg:grid-cols-3"
            >
              {TESTIMONIALS.map((t) => (
                <li key={t.name} className={cx(CARD, "flex flex-col p-6")}>
                  <Quote className="h-6 w-6 text-[#6E56CF]" aria-hidden="true" />
                  <blockquote className="mt-4 text-[0.9375rem] leading-relaxed text-white">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-sm font-semibold text-white">
                      {t.initials}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-[0.8125rem] font-semibold text-white">{t.name}</span>
                      <span className="text-[0.75rem] text-[#A1A1AA]">{t.role}</span>
                    </span>
                  </figcaption>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="relative overflow-hidden rounded-3xl border border-[#6E56CF]/30 bg-[#6E56CF]/[0.08] px-6 py-16 text-center sm:px-12 sm:py-24"
            >
              <div className="flex items-center justify-center gap-3">
                <span className={cx(EYEBROW, "text-[#6E56CF]")}>05</span>
                <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                <span className={cx(EYEBROW, "text-[#A1A1AA]")}>대화 시작</span>
              </div>
              <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-white">
                이제, 당신의 취향을
                <br />
                직접 <span className="text-[#6E56CF]">말해보세요</span>
              </h2>
              <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed text-[#A1A1AA] sm:text-base">
                취향을 등록하면 AI 큐레이터가 오늘 밤부터 되묻고, 근거를 대며, 다시
                골라드립니다. 가입은 1분, 해지는 언제든지.
              </p>
              <div className="mt-9 flex justify-center">
                <Link
                  href="/dashboard"
                  className={cx(
                    "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#6E56CF] px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d67d6]",
                    FOCUS,
                  )}
                >
                  무료로 취향 등록하기
                  <ArrowRight
                    className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
          <a
            href="#hero"
            className={cx(
              "inline-flex items-center gap-1 rounded-md text-lg font-extrabold tracking-tight text-white",
              FOCUS,
            )}
          >
            <span className="rounded bg-[#6E56CF] px-1.5 py-0.5 text-base font-semibold text-white">
              RE:
            </span>
            픽
          </a>
          <p className="text-[0.8125rem] text-[#A1A1AA]">
            AI와 대화하며 취향을 다시 골라주는 리커머스.
          </p>
          <ul className="flex gap-5 text-[0.8125rem] text-[#A1A1AA]">
            <li>
              <a href="#" className={cx("rounded-md transition-colors hover:text-white", FOCUS)}>
                이용약관
              </a>
            </li>
            <li>
              <a href="#" className={cx("rounded-md transition-colors hover:text-white", FOCUS)}>
                개인정보처리방침
              </a>
            </li>
          </ul>
        </div>
        <p className="mx-auto mt-8 w-full max-w-[1120px] px-5 text-[0.75rem] text-white/30 sm:px-8">
          (C) 2026 RE:픽. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
