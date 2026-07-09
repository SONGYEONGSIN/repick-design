"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  CircleDot,
  Cpu,
  Moon,
  Sparkles,
  Waves,
} from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
});

/* ------------------------------------------------------------------ */
/* 데이터 — LUCID OS 브랜드 콘텐츠                                       */
/* ------------------------------------------------------------------ */

const DREAM_APPS = [
  "피아노 에튀드 No.2",
  "유창한 스페인어 회화",
  "자유낙하 공포 극복",
  "무중력 드로잉",
  "완벽한 오프사이드 타이밍",
  "타인의 언어로 꾸는 꿈",
  "즉흥 재즈 솔로",
  "색채 잔상 없는 색감",
];

const PROCESS_STEPS = [
  {
    time: "23:14",
    command: "$ install --skill=piano_etude_no2 --target=REM",
    description: "잠들기 전, 오늘 밤 설치할 스킬을 고릅니다.",
    icon: Moon,
  },
  {
    time: "02:47",
    command: "$ compiling... [REM_CYCLE 3/5]",
    description: "무의식이 실행되는 동안 신경 회로가 재배선됩니다.",
    icon: Cpu,
  },
  {
    time: "07:02",
    command: "$ build success — 1 skill deployed",
    description: "눈을 뜨면, 어제는 없던 손끝의 기억이 있습니다.",
    icon: Sparkles,
  },
] as const;

const DEVICE_SPECS = [
  { key: "무게", value: "11g" },
  { key: "배터리", value: "11박" },
  { key: "방수", value: "IPX7" },
  { key: "연결", value: "BLE 5.4 · Neural Mode" },
  { key: "착용 위치", value: "관자놀이 좌우 1점" },
] as const;

const STATS = [
  { value: "8.2h", label: "평균 컴파일(수면) 시간", accent: "cyan" },
  { value: "3.4x", label: "일반 수면 대비 REM 밀도", accent: "violet" },
  { value: "0.4ms", label: "인터럽트 없는 신경 지연", accent: "amber" },
  { value: "12,904", label: "대기 중인 파일럿 수", accent: "cyan" },
] as const;

const DREAM_LOGS = [
  {
    user: "@root_사용자_0219",
    time: "AM 6:58",
    text: "지난밤 스페인어 회화 앱을 설치했는데, 깨자마자 바리스타한테 스페인어로 말을 걸어버렸다. 문법은 아직 개판이지만.",
  },
  {
    user: "@lucid_pilot_88",
    time: "AM 5:12",
    text: "자유낙하 공포 극복 3일차. 오늘 처음으로 번지점프 예약을 했다.",
  },
  {
    user: "@node_zero_beta",
    time: "AM 7:41",
    text: "무중력 드로잉... 깨어나서 스케치북을 봤는데 이게 정말 내가 그린 게 맞나 싶다.",
  },
  {
    user: "@dream_committer",
    time: "AM 4:33",
    text: "피아노 에튀드 설치 2회차. 오른손 새끼손가락이 이제 무슨 뜻인지 안다.",
  },
] as const;

const NAV_LINKS = [
  { href: "#how", label: "원리" },
  { href: "#device", label: "NODE-0" },
  { href: "#logs", label: "드림 로그" },
] as const;

/* ------------------------------------------------------------------ */

export default function Landing() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`${spaceGrotesk.variable} relative min-h-screen overflow-x-clip bg-black font-sans text-neutral-50 selection:bg-cyan-300/30 selection:text-cyan-100`}
    >
      <SiteHeader />
      <main>
        <HeroSection reducedMotion={!!reducedMotion} />
        <DreamAppsMarquee reducedMotion={!!reducedMotion} />
        <ProcessSection reducedMotion={!!reducedMotion} />
        <DeviceSection reducedMotion={!!reducedMotion} />
        <StatsSection reducedMotion={!!reducedMotion} />
        <LogsSection reducedMotion={!!reducedMotion} />
        <AccessSection />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className={`${spaceGrotesk.className} flex h-11 items-center gap-1.5 rounded-md text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
        >
          LUCID
          <span className="text-cyan-300">//OS</span>
        </a>

        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md text-sm text-neutral-300 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#access"
          className="inline-flex h-11 items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-300/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          얼리 액세스
        </a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function HeroSection({ reducedMotion }: { reducedMotion: boolean }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const blobX = useSpring(rawX, { stiffness: 40, damping: 20, mass: 0.6 });
  const blobY = useSpring(rawY, { stiffness: 40, damping: 20, mass: 0.6 });

  const handlePointerMove = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      const relX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relY = (event.clientY - bounds.top) / bounds.height - 0.5;
      rawX.set(relX * 60);
      rawY.set(relY * 60);
    },
    [reducedMotion, rawX, rawY]
  );

  return (
    <section
      id="top"
      onMouseMove={handlePointerMove}
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* 배경: 은하 사진 + 그라디언트 오버레이 (장식용) */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=60"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        <motion.div
          style={{ x: blobX, y: blobY }}
          className="absolute left-1/3 top-1/4 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_65%)] blur-3xl"
        />
        <motion.div
          style={{ x: blobY, y: blobX }}
          className="absolute right-1/4 top-1/2 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.16),transparent_65%)] blur-3xl"
        />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0px,rgba(255,255,255,0.035)_1px,transparent_1px,transparent_3px)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 font-mono text-xs text-neutral-300">
            <CircleDot
              aria-hidden="true"
              className="h-3 w-3 text-cyan-300 motion-safe:animate-pulse motion-reduce:animate-none"
            />
            SYSTEM STATUS: DREAM_COMPILER v0.9 · REM-ONLY
          </div>

          <h1
            id="hero-heading"
            className="text-4xl font-medium leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl"
          >
            잠은 다운타임이 아니다.
            <br />
            <span className="font-display italic text-cyan-300">런타임</span>
            이다.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            LUCID OS는 REM 수면을 프로그래밍 가능한 런타임으로 바꾸는 신경
            컴파일러입니다. 잠들기 전 스킬을 설치하면, 눈뜰 때 몸이
            기억합니다.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#access"
              className={`${spaceGrotesk.className} inline-flex h-12 items-center gap-2 rounded-full bg-cyan-300 px-6 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
            >
              $ request --access
              <span
                aria-hidden="true"
                className="inline-block h-4 w-[2px] bg-black motion-safe:animate-blink motion-reduce:animate-none"
              />
            </a>
            <a
              href="#how"
              className="inline-flex h-12 items-center gap-1 rounded-full border border-white/15 px-6 text-sm text-neutral-200 transition-colors hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              원리 보기
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 rotate-90" />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        :global(.animate-blink) {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dream apps marquee                                                  */
/* ------------------------------------------------------------------ */

function DreamAppsMarquee({ reducedMotion }: { reducedMotion: boolean }) {
  const loop = useMemo(() => [...DREAM_APPS, ...DREAM_APPS], []);

  return (
    <section aria-label="설치 가능한 드림 앱" className="relative border-y border-white/10 bg-white/[0.02] py-6">
      <p className="sr-only">
        설치 가능한 드림 앱 목록: {DREAM_APPS.join(", ")}
      </p>
      <div className="overflow-hidden" aria-hidden="true">
        <div
          className={`flex w-max gap-3 ${
            reducedMotion ? "" : "animate-marquee"
          }`}
        >
          {loop.map((app, index) => (
            <span
              key={`${app}-${index}`}
              className="inline-flex h-9 items-center rounded-full border border-white/10 bg-white/5 px-4 font-mono text-xs text-neutral-300 whitespace-nowrap"
            >
              {app}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        :global(.animate-marquee) {
          animation: marquee 32s linear infinite;
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process ("원리")                                                    */
/* ------------------------------------------------------------------ */

function ProcessSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="how" aria-labelledby="how-heading" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionKicker icon={Waves}>원리</SectionKicker>
        <h2
          id="how-heading"
          className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl"
        >
          3번의 REM 사이클, 하나의{" "}
          <span className="font-display italic text-cyan-300">배포</span>
        </h2>

        <ol className="mt-16 space-y-12 border-l border-white/10 pl-8 sm:pl-10">
          {PROCESS_STEPS.map((step, index) => (
            <motion.li
              key={step.command}
              initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="absolute -left-[3.1rem] top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black sm:-left-[3.6rem]"
              >
                <step.icon className="h-4 w-4 text-cyan-300" />
              </span>
              <div className="font-mono text-xs text-neutral-500">
                {step.time} KST
              </div>
              <div className={`${spaceGrotesk.className} mt-1 font-mono text-sm text-cyan-200 sm:text-base`}>
                {step.command}
              </div>
              <p className="mt-2 text-base text-neutral-300 sm:text-lg">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Device ("NODE-0")                                                   */
/* ------------------------------------------------------------------ */

function DeviceSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="device"
      aria-labelledby="device-heading"
      className="relative border-t border-white/10 py-28 sm:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <SectionKicker icon={Cpu}>하드웨어</SectionKicker>
          <h2
            id="device-heading"
            className="mt-4 text-3xl font-medium tracking-tight sm:text-4xl"
          >
            NODE-0, 관자놀이에 얹는{" "}
            <span className="font-display italic text-violet-300">
              유일한
            </span>{" "}
            하드웨어
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-400 sm:text-lg">
            부드러운 실리콘 밴드가 관자놀이 위 미세 신경 신호와 안구 운동을
            읽어 REM 상태를 실시간으로 추적합니다. 별도의 헤드셋도, 케이블도
            없습니다.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/10 pt-8 sm:grid-cols-3">
            {DEVICE_SPECS.map((spec) => (
              <div key={spec.key}>
                <dt className="font-mono text-xs text-neutral-500">
                  {spec.key}
                </dt>
                <dd
                  className={`${spaceGrotesk.className} mt-1 text-sm font-medium text-neutral-100`}
                >
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
          whileInView={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle,rgba(167,139,250,0.25),transparent_70%)] blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/5 backdrop-blur-sm">
            <Image
              src="https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=1200&q=60"
              alt="보랏빛 성운처럼 소용돌이치는 추상 이미지 — NODE-0가 기록한 REM 상태의 시각화"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover mix-blend-luminosity opacity-80"
            />
          </div>

          <motion.span
            animate={
              reducedMotion ? undefined : { y: [0, -10, 0] }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
            className="absolute -left-4 top-8 inline-flex h-9 items-center rounded-full border border-white/15 bg-black/80 px-3 font-mono text-xs text-cyan-200 shadow-lg backdrop-blur"
          >
            SIGNAL: STRONG
          </motion.span>
          <motion.span
            animate={
              reducedMotion ? undefined : { y: [0, 10, 0] }
            }
            transition={
              reducedMotion
                ? undefined
                : { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
            }
            className="absolute -right-4 bottom-10 inline-flex h-9 items-center rounded-full border border-white/15 bg-black/80 px-3 font-mono text-xs text-violet-200 shadow-lg backdrop-blur"
          >
            REM: ACTIVE
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats (bento)                                                       */
/* ------------------------------------------------------------------ */

const STAT_TEXT_CLASS: Record<string, string> = {
  cyan: "text-cyan-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
};

function StatsSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      aria-labelledby="stats-heading"
      className="relative border-t border-white/10 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="stats-heading" className="sr-only">
          라이브 지표
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div
                className={`${spaceGrotesk.className} text-4xl font-bold tracking-tight ${STAT_TEXT_CLASS[stat.accent]}`}
              >
                {stat.value}
              </div>
              <div className="mt-2 text-sm text-neutral-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Dream logs                                                          */
/* ------------------------------------------------------------------ */

function LogsSection({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section
      id="logs"
      aria-labelledby="logs-heading"
      className="relative border-t border-white/10 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionKicker icon={Sparkles}>커뮤니티</SectionKicker>
        <h2
          id="logs-heading"
          className="mt-4 max-w-xl text-3xl font-medium tracking-tight sm:text-4xl"
        >
          파일럿들의 드림 로그
        </h2>

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {DREAM_LOGS.map((log, index) => (
            <motion.li
              key={log.user}
              initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
              whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="rounded-xl border-l-2 border-cyan-300/40 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between font-mono text-xs text-neutral-500">
                <span>{log.user}</span>
                <span>{log.time}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-200 sm:text-base">
                {log.text}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Access CTA                                                          */
/* ------------------------------------------------------------------ */

function AccessSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputId = useRef(`email-${Math.random().toString(36).slice(2, 9)}`);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      id="access"
      aria-labelledby="access-heading"
      className="relative border-t border-white/10 py-28 sm:py-36"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.08),transparent_60%)]" />
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2
          id="access-heading"
          className="text-3xl font-medium tracking-tight sm:text-5xl"
        >
          오늘 밤, 무의식에{" "}
          <span className="font-display italic text-cyan-300">
            첫 커밋
          </span>
          을 남기세요.
        </h2>
        <p className="mt-6 font-mono text-sm text-neutral-400">
          현재 대기열 12,904명 · 다음 컴파일은 오늘 자정
        </p>

        {submitted ? (
          <p
            role="status"
            aria-live="polite"
            className="mx-auto mt-10 inline-flex h-12 items-center rounded-full border border-cyan-300/40 bg-cyan-300/10 px-6 text-sm font-medium text-cyan-200"
          >
            대기열에 등록되었습니다. 컴파일러가 곧 연락합니다.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            noValidate
          >
            <label htmlFor={inputId.current} className="sr-only">
              이메일 주소
            </label>
            <input
              id={inputId.current}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@dreamer.com"
              aria-describedby="access-helper"
              className="h-12 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-sm text-neutral-100 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            />
            <button
              type="submit"
              className={`${spaceGrotesk.className} inline-flex h-12 items-center justify-center rounded-full bg-cyan-300 px-6 text-sm font-bold text-black transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
            >
              $ request --access
            </button>
          </form>
        )}
        <p id="access-helper" className="mt-4 text-xs text-neutral-600">
          NODE-0 파일럿 프로그램은 실험 단계이며, 선정된 파일럿에게만 순차
          발송됩니다.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
        <div>
          <div className={`${spaceGrotesk.className} text-sm font-bold tracking-tight`}>
            LUCID<span className="text-cyan-300">//OS</span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-600">
            © 2026 LUCID OS · REM COMPILER
          </p>
        </div>
        <nav aria-label="푸터 메뉴" className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md text-xs text-neutral-500 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:pilot@lucid.os"
            className="rounded-md text-xs text-neutral-500 transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            문의
          </a>
        </nav>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionKicker({
  icon: Icon,
  children,
}: {
  icon: typeof Waves;
  children: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-300">
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}
