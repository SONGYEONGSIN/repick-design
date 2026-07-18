"use client";

import { useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  Check,
  MapPin,
  Quote,
  ArrowRight,
} from "lucide-react";
import ProgressRail from "./ProgressRail";
import ProductMatchCard from "./ProductMatchCard";
import { cx, EASE, NUM, EYEBROW, CAPTION, FOCUS } from "../lib/tokens";
import {
  CHAPTERS,
  PROMISES,
  MATCH_SCORES,
  INSPECTION_ITEMS,
  GRADE_SCALE,
  DELIVERY_STEPS,
  STATS,
  TESTIMONIALS,
  FEATURED_PRODUCT,
  type ChapterId,
} from "../lib/data";

const SECTION = "scroll-mt-32 border-t border-white/10 py-20 sm:py-28 xl:scroll-mt-24";
const CARD = "rounded-2xl border border-white/10 bg-white/[0.02]";
const REVEAL = { once: true, margin: "-80px" } as const;
const NODE_VIEWPORT = { margin: "-45%" } as const;

const PROMISE_ICON = { sparkles: Sparkles, shield: ShieldCheck, truck: Truck } as const;

function ChapterHead({ no, kicker, title }: { no: string; kicker: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3">
        <span className={cx(EYEBROW, NUM, "text-[#6E56CF]")}>{no}</span>
        <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
        <span className={cx(EYEBROW, "text-[#A1A1AA]")}>{kicker}</span>
      </div>
      <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-white">
        {title}
      </h2>
    </div>
  );
}

export default function JourneyClient() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState<ChapterId>("intro");

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const railProgress = prefersReduced ? scrollYProgress : smooth;

  const activeIndex = Math.max(0, CHAPTERS.findIndex((c) => c.id === activeId));
  const activeChapter = CHAPTERS[activeIndex];

  const jump = (id: ChapterId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  const fadeUp: Variants = {
    hidden: { opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.6, ease: EASE } },
  };
  const heroStagger: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.1,
        delayChildren: prefersReduced ? 0 : 0.05,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white [color-scheme:dark]">
      <a
        href="#main-content"
        className={cx(
          "sr-only rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0B0B0F] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50",
          FOCUS,
        )}
      >
        본문으로 건너뛰기
      </a>

      {/* Header + 모바일 진행바 */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
          <div className="flex h-16 items-center justify-between">
            <a
              href="#intro"
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

          <div className="pb-3 xl:hidden">
            <div className="flex items-center gap-2.5">
              <span className={cx(EYEBROW, NUM, "text-[#6E56CF]")}>{activeChapter.no}</span>
              <span className="text-[0.8125rem] font-semibold text-white">{activeChapter.label}</span>
              <span className={cx("ml-auto text-[0.75rem] text-white/40", NUM)}>
                {activeIndex + 1} / {CHAPTERS.length}
              </span>
            </div>
            <div className="mt-2 h-px w-full bg-white/10">
              <motion.div
                style={{ scaleX: railProgress, transformOrigin: "left" }}
                className="h-px w-full origin-left bg-[#6E56CF]"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8">
        <div className="xl:grid xl:grid-cols-[176px_minmax(0,1fr)] xl:gap-12">
          {/* 세로 진행률 레일 (xl+) */}
          <aside className="hidden xl:block">
            <div className="sticky top-0 flex h-screen items-center">
              <ProgressRail
                chapters={CHAPTERS}
                activeId={activeId}
                progress={railProgress}
                onJump={jump}
              />
            </div>
          </aside>

          <div className="min-w-0">
            <main id="main-content">
              {/* 00 — Hero */}
              <motion.section
                id="intro"
                onViewportEnter={() => setActiveId("intro")}
                viewport={NODE_VIEWPORT}
                className="relative scroll-mt-32 overflow-hidden pt-14 pb-20 sm:pt-20 sm:pb-28 xl:scroll-mt-24"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-4 top-6 hidden select-none text-[26vw] font-extrabold leading-none tracking-[-0.05em] text-white/[0.035] sm:block"
                >
                  RE:
                </span>
                <motion.div
                  variants={heroStagger}
                  initial="hidden"
                  animate="show"
                  className="relative max-w-3xl"
                >
                  <motion.div variants={fadeUp} className="flex items-center gap-3">
                    <span className={cx(EYEBROW, "text-[#6E56CF]")}>THE JOURNEY</span>
                    <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                    <span className={cx(EYEBROW, NUM, "text-[#A1A1AA]")}>00 / 05</span>
                  </motion.div>
                  <motion.h1
                    variants={fadeUp}
                    className="mt-6 text-[clamp(2.4rem,8vw,5rem)] font-extrabold leading-[1.03] tracking-[-0.03em] text-balance text-white"
                  >
                    다시 고른 하나가
                    <br />
                    <span className="text-[#6E56CF]">문 앞</span>에 닿기까지
                  </motion.h1>
                  <motion.p
                    variants={fadeUp}
                    className="mt-6 max-w-xl text-base leading-[1.75] text-[#A1A1AA] sm:text-lg"
                  >
                    AI 매칭부터 전문 검수, 안심 배송까지 — RE:픽은 중고 거래의 모든 단계를
                    대신 지킵니다. 아래로 내려가며 그 여정을 순서대로 따라가 보세요.
                  </motion.p>
                  <motion.div variants={fadeUp} className="mt-9 flex flex-col items-start gap-5">
                    <Link
                      href="/dashboard"
                      className={cx(
                        "group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#6E56CF] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#7d67d6]",
                        FOCUS,
                      )}
                    >
                      취향 등록하고 시작하기
                      <ArrowRight
                        className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => jump("match")}
                      className={cx(
                        "inline-flex items-center gap-2 rounded-md text-[0.8125rem] text-[#A1A1AA] transition-colors hover:text-white",
                        FOCUS,
                      )}
                    >
                      <span aria-hidden="true" className="h-px w-6 bg-white/25" />
                      다음 · 01 AI 매칭부터 시작합니다
                    </button>
                  </motion.div>
                </motion.div>
              </motion.section>

              {/* 가치 3분할 — 약속 */}
              <section
                id="promise"
                className="scroll-mt-32 border-t border-white/10 py-20 sm:py-24 xl:scroll-mt-24"
              >
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="max-w-2xl"
                >
                  <div className="flex items-center gap-3">
                    <span className={cx(EYEBROW, "text-[#6E56CF]")}>PROMISE</span>
                    <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                    <span className={cx(EYEBROW, "text-[#A1A1AA]")}>세 가지 약속</span>
                  </div>
                  <h2 className="mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance text-white">
                    여정 내내, 세 가지를 지킵니다
                  </h2>
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
                >
                  {PROMISES.map((p) => {
                    const Icon = PROMISE_ICON[p.icon];
                    return (
                      <div key={p.label} className="bg-[#0B0B0F] p-7 sm:p-8">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#6E56CF]/30 bg-[#6E56CF]/12 text-[#6E56CF]">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <p
                          className={cx(
                            "mt-6 text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold tracking-[-0.02em] text-white",
                            NUM,
                          )}
                        >
                          {p.stat}
                        </p>
                        <p className="mt-1 text-[0.9375rem] font-semibold text-white">{p.label}</p>
                        <p className="mt-3 text-[0.875rem] leading-relaxed text-[#A1A1AA]">{p.desc}</p>
                      </div>
                    );
                  })}
                </motion.div>
              </section>

              {/* 01 — AI 매칭 (제품 프리뷰) */}
              <motion.section
                id="match"
                onViewportEnter={() => setActiveId("match")}
                viewport={NODE_VIEWPORT}
                className={SECTION}
              >
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={REVEAL}>
                  <ChapterHead no="01" kicker="AI 매칭" title="AI가 고른 이유를, 숫자로 보여드립니다" />
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-14"
                >
                  <div>
                    <p className="max-w-md text-[0.9375rem] leading-[1.75] text-[#A1A1AA] sm:text-base">
                      좋아요·스킵·구매 이력으로 만든 취향 벡터를 매물 데이터와 대조합니다.
                      추천에는 늘 근거가 따라붙습니다 — 왜 이 상품인지, 숫자로 확인하세요.
                    </p>
                    <div className="mt-8 flex items-end gap-4">
                      <span
                        className={cx(
                          "text-[clamp(3rem,7vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white",
                          NUM,
                        )}
                      >
                        {FEATURED_PRODUCT.match}
                        <span className="text-[#6E56CF]">%</span>
                      </span>
                      <span className="mb-1.5 text-[0.8125rem] leading-snug text-[#A1A1AA]">
                        종합 매칭 점수
                        <br />
                        이번 매물 기준
                      </span>
                    </div>
                    <ul className="mt-6 max-w-md space-y-4">
                      {MATCH_SCORES.map((s, i) => (
                        <li key={s.label}>
                          <div className="flex items-baseline justify-between text-[0.8125rem]">
                            <span className="text-[#A1A1AA]">{s.label}</span>
                            <span className={cx("font-semibold text-white", NUM)}>{s.value}</span>
                          </div>
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ scaleX: prefersReduced ? 1 : 0 }}
                              whileInView={{ scaleX: 1 }}
                              viewport={{ once: true, amount: 0.6 }}
                              transition={{
                                duration: prefersReduced ? 0 : 0.9,
                                ease: EASE,
                                delay: prefersReduced ? 0 : i * 0.08,
                              }}
                              style={{ width: `${s.value}%`, transformOrigin: "left" }}
                              className="h-full rounded-full bg-[#6E56CF]"
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                    <p className={cx(CAPTION, "mt-6 text-white/35")}>Fig. 01 — 매칭 스코어 근거</p>
                  </div>
                  <div>
                    <ProductMatchCard />
                    <p className={cx(CAPTION, "mt-3 text-white/35")}>Fig. 01b — AI가 선별한 이번 주 매물</p>
                  </div>
                </motion.div>
              </motion.section>

              {/* 02 — 전문 검수 */}
              <motion.section
                id="inspect"
                onViewportEnter={() => setActiveId("inspect")}
                viewport={NODE_VIEWPORT}
                className={SECTION}
              >
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={REVEAL}>
                  <ChapterHead no="02" kicker="전문 검수" title="사람이 직접 확인한 상태만, 매칭합니다" />
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-14"
                >
                  <div>
                    <p className="max-w-md text-[0.9375rem] leading-[1.75] text-[#A1A1AA] sm:text-base">
                      사진만으로는 알 수 없는 것들이 있습니다. 전문 검수팀이 실측하고, 하자를
                      확인하고, 정품 여부를 판정한 뒤에야 매칭 목록에 오릅니다.
                    </p>
                    <div className="mt-8">
                      <p className={cx(CAPTION, "text-[#A1A1AA]")}>컨디션 등급</p>
                      <ul className="mt-3 grid grid-cols-4 gap-2">
                        {GRADE_SCALE.map((g) => {
                          const on = g.grade === FEATURED_PRODUCT.grade;
                          return (
                            <li
                              key={g.grade}
                              className={cx(
                                "rounded-xl border p-3 text-center",
                                on
                                  ? "border-[#6E56CF]/50 bg-[#6E56CF]/12"
                                  : "border-white/10 bg-white/[0.02]",
                              )}
                            >
                              <span
                                className={cx(
                                  "block text-lg font-extrabold",
                                  on ? "text-[#6E56CF]" : "text-white/40",
                                )}
                              >
                                {g.grade}
                              </span>
                              <span className="mt-1 block text-[0.625rem] text-[#A1A1AA]">{g.desc}</span>
                            </li>
                          );
                        })}
                      </ul>
                      <p className="mt-3 text-[0.8125rem] text-[#A1A1AA]">
                        이번 매물은 <span className="font-semibold text-white">A급 · 사용감 적음</span>으로
                        확인됐습니다.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className={cx(CARD, "p-6 sm:p-7")}>
                      <div className="flex items-center justify-between">
                        <span className={cx(EYEBROW, "text-[#A1A1AA]")}>검수 리포트</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#6E56CF]/40 bg-[#6E56CF]/12 px-2.5 py-1 text-[0.75rem] font-semibold text-[#6E56CF]">
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          검수 통과
                        </span>
                      </div>
                      <ul className="mt-5 space-y-3">
                        {INSPECTION_ITEMS.map((it) => (
                          <li key={it} className="flex items-center gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6E56CF]">
                              <Check className="h-3 w-3 text-white" aria-hidden="true" />
                            </span>
                            <span className="text-[0.875rem] text-white/90">{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className={cx(CAPTION, "mt-3 text-white/35")}>Fig. 02 — 12단계 중 핵심 6개 항목</p>
                  </div>
                </motion.div>
              </motion.section>

              {/* 03 — 안심 배송 */}
              <motion.section
                id="deliver"
                onViewportEnter={() => setActiveId("deliver")}
                viewport={NODE_VIEWPORT}
                className={SECTION}
              >
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={REVEAL}>
                  <ChapterHead no="03" kicker="안심 배송" title="포장부터 도착까지, 실시간으로 추적합니다" />
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-center lg:gap-14"
                >
                  <div>
                    <p className="max-w-md text-[0.9375rem] leading-[1.75] text-[#A1A1AA] sm:text-base">
                      결제가 끝이 아닙니다. 안전 포장과 배송 상태를 단계별로 기록해, 지금 내
                      물건이 어디쯤인지 언제나 확인할 수 있습니다.
                    </p>
                    <p className="mt-6 max-w-md text-[0.9375rem] leading-[1.75] text-[#A1A1AA] sm:text-base">
                      여정의 마지막 단계, 도착까지 남은 것은 단 하나입니다.
                    </p>
                  </div>
                  <div>
                    <div className={cx(CARD, "p-6 sm:p-7")}>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-white">
                          <MapPin className="h-4 w-4 text-[#6E56CF]" aria-hidden="true" />
                          실시간 배송 추적
                        </span>
                        <span className={cx("text-[0.75rem] text-white/40", NUM)}>#RP-240716</span>
                      </div>
                      <ol className="relative mt-6">
                        <div
                          aria-hidden="true"
                          className="absolute left-[9px] top-2 bottom-6 w-px bg-white/10"
                        />
                        {DELIVERY_STEPS.map((s) => (
                          <li key={s.step} className="relative flex items-start gap-4">
                            <span
                              className={cx(
                                "relative z-10 mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
                                s.state === "todo"
                                  ? "border-white/25 bg-[#0B0B0F]"
                                  : "border-[#6E56CF] bg-[#6E56CF]",
                                s.state === "active" && "ring-4 ring-[#6E56CF]/25",
                              )}
                            >
                              {s.state === "done" ? (
                                <Check className="h-3 w-3 text-white" aria-hidden="true" />
                              ) : null}
                              {s.state === "active" ? (
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                              ) : null}
                            </span>
                            <div className="pb-6">
                              <p
                                className={cx(
                                  "text-[0.875rem]",
                                  s.state === "todo" ? "text-[#A1A1AA]" : "font-semibold text-white",
                                )}
                              >
                                {s.step}
                                {s.state === "active" ? (
                                  <span className="ml-2 text-[0.6875rem] font-semibold text-[#6E56CF]">
                                    진행 중
                                  </span>
                                ) : null}
                              </p>
                              <p className={cx("mt-0.5 text-[0.75rem] text-white/40", NUM)}>{s.time}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p className={cx(CAPTION, "mt-3 text-white/35")}>Fig. 03 — 도착까지 남은 단계 1</p>
                  </div>
                </motion.div>
              </motion.section>

              {/* 04 — 소셜프루프 */}
              <motion.section
                id="proof"
                onViewportEnter={() => setActiveId("proof")}
                viewport={NODE_VIEWPORT}
                className={SECTION}
              >
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={REVEAL}>
                  <ChapterHead no="04" kicker="사용자 후기" title="안목 있는 사람들이 먼저 씁니다" />
                </motion.div>
                <motion.dl
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3"
                >
                  {STATS.map((s) => (
                    <div key={s.label} className="bg-[#0B0B0F] px-6 py-8 text-center">
                      <dt className="text-[0.8125rem] text-[#A1A1AA]">{s.label}</dt>
                      <dd
                        className={cx(
                          "mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold tracking-[-0.02em] text-white",
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
                  viewport={REVEAL}
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
              </motion.section>

              {/* 05 — 마무리 CTA */}
              <motion.section
                id="start"
                onViewportEnter={() => setActiveId("start")}
                viewport={NODE_VIEWPORT}
                className="scroll-mt-32 border-t border-white/10 py-20 sm:py-28 xl:scroll-mt-24"
              >
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={REVEAL}
                  className="relative overflow-hidden rounded-3xl border border-[#6E56CF]/30 bg-[#6E56CF]/[0.08] px-6 py-16 text-center sm:px-12 sm:py-24"
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className={cx(EYEBROW, NUM, "text-[#6E56CF]")}>05</span>
                    <span aria-hidden="true" className="h-px w-8 bg-[#6E56CF]/40" />
                    <span className={cx(EYEBROW, "text-[#A1A1AA]")}>도착 · 시작</span>
                  </div>
                  <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-balance text-white">
                    여정의 끝은,
                    <br />
                    새로운 <span className="text-[#6E56CF]">시작</span>입니다
                  </h2>
                  <p className="mx-auto mt-5 max-w-md text-[0.9375rem] leading-relaxed text-[#A1A1AA] sm:text-base">
                    취향을 등록하면 오늘 밤, AI가 다시 고른 첫 매물이 도착합니다. 가입은 1분,
                    해지는 언제든지.
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
              </motion.section>
            </main>

            <footer className="border-t border-white/10 py-10">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <a
                  href="#intro"
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
                  AI가 취향을 학습해 다시 골라주는 리커머스.
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
              <p className="mt-8 text-[0.75rem] text-white/30">(C) 2026 RE:픽. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
