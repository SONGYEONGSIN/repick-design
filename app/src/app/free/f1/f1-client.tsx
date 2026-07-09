"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import {
  Feather,
  LockKeyhole,
  Wind,
  Gauge,
  Thermometer,
  Clock,
  Flame,
  MoonStar,
  SendHorizontal,
  Mail,
} from "lucide-react";

import "./f1.css";

const NAV_LINKS = [
  { href: "#process", label: "어떻게 하나요" },
  { href: "#telemetry", label: "발사 기록" },
  { href: "#packages", label: "요금" },
];

const PROCESS_STEPS = [
  {
    n: "01",
    icon: Feather,
    title: "쓰다",
    body: "손으로 눌러쓴 편지, 혹은 앱에 남긴 마지막 문장. 맞춤법도, 눈물 자국도 그대로 둡니다.",
  },
  {
    n: "02",
    icon: LockKeyhole,
    title: "봉인하다",
    body: "생분해 캡슐에 편지를 넣고 무게를 잽니다. 발사 좌표와 시각이 그 자리에서 기록됩니다.",
  },
  {
    n: "03",
    icon: Wind,
    title: "놓아주다",
    body: "관측용 풍선에 실어 성층권까지. 다시는 손에 닿지 않는 곳으로 편지를 보냅니다.",
  },
];

const TELEMETRY_STATS = [
  { icon: Gauge, label: "고도", value: "32,187 m" },
  { icon: Thermometer, label: "기온", value: "-56.3 ℃" },
  { icon: Clock, label: "비행 시간", value: "02:14:07" },
  { icon: Flame, label: "잔해", value: "0 g · 전량 산화" },
];

const PACKAGES = [
  {
    name: "낱장",
    price: "68,000원",
    desc: "편지 한 통을 하늘로.",
    items: ["캡슐 1개", "발사 영상 1편", "좌표 인증서"],
  },
  {
    name: "다발",
    price: "178,000원",
    desc: "가족, 혹은 오래된 친구와 함께.",
    items: ["캡슐 3개", "발사 생중계 링크", "동행 초대장 3매"],
    featured: true,
  },
  {
    name: "매년의 의식",
    price: "문의",
    desc: "해마다 같은 날, 같은 하늘로.",
    items: ["연 1회 정기 발사", "전용 좌표 고정", "기념 영상 편집"],
  },
];

const EMBERS = [
  { left: "6%", size: 3, duration: 14, delay: 0 },
  { left: "16%", size: 2, duration: 18, delay: 2.4 },
  { left: "27%", size: 4, duration: 12, delay: 1.1 },
  { left: "38%", size: 2, duration: 20, delay: 4.2 },
  { left: "49%", size: 3, duration: 15, delay: 0.6 },
  { left: "61%", size: 2, duration: 17, delay: 3.1 },
  { left: "72%", size: 4, duration: 13, delay: 2 },
  { left: "83%", size: 2, duration: 19, delay: 5 },
  { left: "91%", size: 3, duration: 16, delay: 1.6 },
];

function EmberField() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {EMBERS.map((e, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-[var(--yeoun-ember)]"
          style={{ left: e.left, width: e.size, height: e.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-110vh", opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            duration: e.duration,
            delay: e.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function F1Client() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="yeoun-theme min-h-screen font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[var(--yeoun-gold)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#0b0908]"
        >
          본문으로 건너뛰기
        </a>

        {/* ---------- Header ---------- */}
        <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--yeoun-hairline)] bg-[var(--yeoun-bg)]/80 backdrop-blur-md">
          <nav
            aria-label="주 메뉴"
            className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
          >
            <a
              href="#main"
              className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
            >
              <MoonStar
                className="h-5 w-5 text-[var(--yeoun-gold)]"
                aria-hidden="true"
              />
              <span className="font-display text-xl italic tracking-wide">
                여운
              </span>
              <span className="hidden font-mono text-[10px] tracking-[0.3em] text-[var(--yeoun-muted)] sm:inline">
                YEOUN
              </span>
            </a>

            <ul className="hidden items-center gap-8 sm:flex">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-[var(--yeoun-muted)] transition-colors hover:text-[var(--yeoun-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#packages"
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--yeoun-gold)] px-5 text-sm font-semibold text-[#0b0908] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
            >
              편지 봉인하기
            </a>
          </nav>
        </header>

        <main id="main">
          {/* ---------- Hero ---------- */}
          <section className="relative flex min-h-screen items-end overflow-hidden pb-20 pt-32 sm:items-center sm:pb-0">
            <Image
              src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80"
              alt="고요한 산 능선 위로 은하수가 펼쳐진 밤하늘"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[var(--yeoun-bg)] via-[var(--yeoun-bg)]/70 to-[var(--yeoun-bg)]/20"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[var(--yeoun-bg)]/60 via-transparent to-transparent"
            />
            <EmberField />

            <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
              <FadeIn>
                <p className="mb-5 font-mono text-xs tracking-[0.35em] text-[var(--yeoun-gold)]">
                  YEOUN · STRATOSPHERE LETTER LAUNCH
                </p>
                <h1 className="max-w-3xl font-display text-4xl italic leading-[1.15] sm:text-6xl">
                  당신이 끝내 부치지 못한 문장,
                  <br />
                  우리가 하늘 끝까지 부칩니다.
                </h1>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--yeoun-muted)] sm:text-lg">
                  여운은 못다한 편지를 손글씨 그대로 캡슐에 봉인해 기상 관측
                  풍선에 실어 성층권 32km까지 올려보내는 편지 발사 의식입니다.
                  편지는 그곳에서, 결국 빛이 됩니다.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#packages"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--yeoun-gold)] px-7 text-sm font-semibold text-[#0b0908] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
                  >
                    <SendHorizontal className="h-4 w-4" aria-hidden="true" />
                    편지 봉인하기
                  </a>
                  <a
                    href="#telemetry"
                    className="inline-flex min-h-12 items-center rounded-full border border-[var(--yeoun-hairline)] px-7 text-sm text-[var(--yeoun-fg)] transition-colors hover:border-[var(--yeoun-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
                  >
                    발사 기록 보기
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ---------- Process ---------- */}
          <section
            id="process"
            aria-labelledby="process-heading"
            className="relative border-t border-[var(--yeoun-hairline)] px-5 py-24 sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <FadeIn>
                <p className="font-mono text-xs tracking-[0.35em] text-[var(--yeoun-gold)]">
                  RITUAL
                </p>
                <h2
                  id="process-heading"
                  className="mt-4 max-w-lg font-display text-3xl italic sm:text-4xl"
                >
                  세 문장짜리 의식
                </h2>
              </FadeIn>

              <ol className="mt-14 grid gap-10 sm:grid-cols-3">
                {PROCESS_STEPS.map((step, i) => (
                  <FadeIn key={step.n} delay={i * 0.12}>
                    <li className="h-full rounded-2xl border border-[var(--yeoun-hairline)] bg-[var(--yeoun-bg-raised)] p-7">
                      <span className="font-mono text-xs text-[var(--yeoun-muted)]">
                        {step.n}
                      </span>
                      <step.icon
                        className="mt-4 h-7 w-7 text-[var(--yeoun-gold)]"
                        aria-hidden="true"
                      />
                      <h3 className="mt-5 font-display text-2xl italic">
                        {step.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--yeoun-muted)]">
                        {step.body}
                      </p>
                    </li>
                  </FadeIn>
                ))}
              </ol>
            </div>
          </section>

          {/* ---------- Telemetry ---------- */}
          <section
            id="telemetry"
            aria-labelledby="telemetry-heading"
            className="relative border-t border-[var(--yeoun-hairline)] px-5 py-24 sm:px-8"
          >
            <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
              <FadeIn>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--yeoun-hairline)] sm:aspect-[4/3]">
                  <Image
                    src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1600&q=80"
                    alt="새벽 하늘로 떠오르는 여러 개의 열기구"
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </FadeIn>

              <FadeIn delay={0.15}>
                <p className="font-mono text-xs tracking-[0.35em] text-[var(--yeoun-gold)]">
                  LIVE TELEMETRY
                </p>
                <h2
                  id="telemetry-heading"
                  className="mt-4 font-display text-3xl italic sm:text-4xl"
                >
                  고도 32,187m, 그곳의 기록
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--yeoun-muted)]">
                  발사된 모든 캡슐은 실시간으로 추적됩니다. 편지가 실제로
                  가장 먼 곳까지 다녀왔다는 증거를, 숫자로 남겨드립니다.
                </p>

                <dl className="mt-8 grid grid-cols-2 gap-4">
                  {TELEMETRY_STATS.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-[var(--yeoun-hairline)] bg-[var(--yeoun-bg-card)] p-4"
                    >
                      <dt className="flex items-center gap-2 text-xs text-[var(--yeoun-muted)]">
                        <stat.icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {stat.label}
                      </dt>
                      <dd className="mt-2 font-mono text-lg text-[var(--yeoun-fg)]">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </FadeIn>
            </div>
          </section>

          {/* ---------- Quote ---------- */}
          <section
            aria-labelledby="quote-heading"
            className="relative overflow-hidden border-t border-[var(--yeoun-hairline)] px-5 py-28 sm:px-8"
          >
            <Image
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2400&q=80"
              alt="겹겹이 안개 낀 산맥의 실루엣"
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[var(--yeoun-bg)]/70"
            />
            <h2 id="quote-heading" className="sr-only">
              이용자의 이야기
            </h2>
            <FadeIn className="relative mx-auto max-w-2xl text-center">
              <blockquote className="font-display text-2xl italic leading-relaxed sm:text-3xl">
                “나는 아버지에게 하지 못한 말을 캡슐에 넣었다. 발사 영상을
                보는 순간, 이상하게도 그 말은 이미 전해진 것 같았다.”
              </blockquote>
              <p className="mt-6 font-mono text-xs tracking-[0.2em] text-[var(--yeoun-muted)]">
                — 이용자 후기, 익명
              </p>
            </FadeIn>
          </section>

          {/* ---------- Packages ---------- */}
          <section
            id="packages"
            aria-labelledby="packages-heading"
            className="relative border-t border-[var(--yeoun-hairline)] px-5 py-24 sm:px-8"
          >
            <div className="mx-auto max-w-6xl">
              <FadeIn>
                <p className="font-mono text-xs tracking-[0.35em] text-[var(--yeoun-gold)]">
                  CHOOSE A RITUAL
                </p>
                <h2
                  id="packages-heading"
                  className="mt-4 max-w-lg font-display text-3xl italic sm:text-4xl"
                >
                  값이 아니라, 의식을 고릅니다
                </h2>
              </FadeIn>

              <ul className="mt-14 grid gap-6 lg:grid-cols-3">
                {PACKAGES.map((pkg, i) => (
                  <FadeIn key={pkg.name} delay={i * 0.1} className="h-full">
                    <li
                      className={`flex h-full flex-col rounded-2xl border p-8 ${
                        pkg.featured
                          ? "border-[var(--yeoun-gold)] bg-[var(--yeoun-bg-card)]"
                          : "border-[var(--yeoun-hairline)] bg-[var(--yeoun-bg-raised)]"
                      }`}
                    >
                      {pkg.featured && (
                        <span className="mb-4 inline-block w-fit rounded-full bg-[var(--yeoun-gold)] px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-[#0b0908]">
                          가장 많이 선택
                        </span>
                      )}
                      <h3 className="font-display text-2xl italic">
                        {pkg.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--yeoun-muted)]">
                        {pkg.desc}
                      </p>
                      <p className="mt-6 font-mono text-2xl text-[var(--yeoun-fg)]">
                        {pkg.price}
                      </p>
                      <ul className="mt-6 flex-1 space-y-2 text-sm text-[var(--yeoun-muted)]">
                        {pkg.items.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--yeoun-gold)]"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)] ${
                          pkg.featured
                            ? "bg-[var(--yeoun-gold)] text-[#0b0908] focus-visible:ring-[var(--yeoun-fg)]"
                            : "border border-[var(--yeoun-hairline)] text-[var(--yeoun-fg)] hover:border-[var(--yeoun-gold)] focus-visible:ring-[var(--yeoun-gold)]"
                        }`}
                      >
                        이 의식 선택하기
                      </a>
                    </li>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </section>

          {/* ---------- Contact / Newsletter ---------- */}
          <section
            id="contact"
            aria-labelledby="contact-heading"
            className="relative border-t border-[var(--yeoun-hairline)] px-5 py-24 sm:px-8"
          >
            <FadeIn className="mx-auto max-w-xl text-center">
              <Mail
                className="mx-auto h-8 w-8 text-[var(--yeoun-gold)]"
                aria-hidden="true"
              />
              <h2
                id="contact-heading"
                className="mt-5 font-display text-3xl italic sm:text-4xl"
              >
                다음 발사를 알려드릴게요
              </h2>
              <p className="mt-3 text-sm text-[var(--yeoun-muted)]">
                다음 발사 일정과 좌표를 이메일로 가장 먼저 보내드립니다.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                noValidate
              >
                <div className="flex-1 text-left">
                  <label htmlFor="email" className="sr-only">
                    이메일 주소
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-required="true"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일 주소"
                    className="min-h-12 w-full rounded-full border border-[var(--yeoun-hairline)] bg-[var(--yeoun-bg-card)] px-5 text-sm text-[var(--yeoun-fg)] outline-none placeholder:text-[var(--yeoun-muted)] focus-visible:ring-2 focus-visible:ring-[var(--yeoun-gold)]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--yeoun-gold)] px-6 text-sm font-semibold text-[#0b0908] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-fg)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--yeoun-bg)]"
                >
                  알림 받기
                </button>
              </form>
              <p
                role="status"
                aria-live="polite"
                className="mt-3 min-h-5 text-sm text-[var(--yeoun-gold)]"
              >
                {submitted &&
                  "등록되었습니다. 다음 발사 좌표가 정해지면 가장 먼저 전해드릴게요."}
              </p>
            </FadeIn>
          </section>
        </main>

        {/* ---------- Footer ---------- */}
        <footer className="border-t border-[var(--yeoun-hairline)] px-5 py-12 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2">
              <MoonStar
                className="h-4 w-4 text-[var(--yeoun-gold)]"
                aria-hidden="true"
              />
              <span className="font-display text-lg italic">여운</span>
            </div>
            <nav aria-label="바닥글 메뉴">
              <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--yeoun-muted)]">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="transition-colors hover:text-[var(--yeoun-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--yeoun-gold)]"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="text-xs text-[var(--yeoun-muted)]">
              © 2026 여운. 모든 의식은 다시 열리지 않습니다.
            </p>
          </div>
        </footer>
      </div>
    </MotionConfig>
  );
}
