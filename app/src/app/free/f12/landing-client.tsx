"use client";

import { useState, useSyncExternalStore } from "react";
import type { ReactNode, FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Black_Han_Sans, Gaegu, Special_Elite } from "next/font/google";
import {
  Send,
  Package,
  Scissors,
  Sticker,
  Mail,
  Camera,
  Videotape,
  Paperclip,
  ChevronDown,
} from "lucide-react";

const blackHan = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-deokji-display",
  display: "swap",
});

const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-deokji-hand",
  display: "swap",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-deokji-type",
  display: "swap",
});

/* ────────────────────────────────────────────────────────────
 * reduced-motion: matchMedia를 useSyncExternalStore로 직접 구독한다.
 * (framer-motion의 useReducedMotion()이 OS 설정을 못 잡는 환경 대비)
 * ──────────────────────────────────────────────────────────── */
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

/* 진입 애니메이션: reduced-motion이면 framer-motion을 아예 쓰지 않고
 * 그냥 <div>를 렌더링해서 opacity:0 고착 버그 가능성을 원천 차단한다. */
function Reveal({
  children,
  className,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-[var(--paper)]";
const FOCUS_RING_DARK =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--paper)] focus-visible:ring-offset-[var(--ink)]";

const ROTATIONS = [
  "rotate-[-3deg]",
  "rotate-[2deg]",
  "rotate-[-1.5deg]",
  "rotate-[3.5deg]",
  "rotate-[-2.5deg]",
] as const;

/* ── 찢어진 종이 경계선 (SVG, 텍스처용 데코레이션) ─────────────── */
function TornDivider({
  fill,
  flip = false,
  className = "",
}: {
  fill: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      className={`block h-8 w-full md:h-10 ${flip ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M0,0 L38,17 L76,5 L114,21 L152,3 L190,15 L228,7 L266,19 L304,1 L342,17 L380,5 L418,21 L456,3 L494,15 L532,7 L570,19 L608,1 L646,17 L684,5 L722,21 L760,3 L798,15 L836,7 L874,19 L912,1 L950,17 L988,5 L1026,21 L1064,3 L1102,15 L1140,7 L1178,19 L1200,6 L1200,40 L0,40 Z"
        fill={fill}
      />
    </svg>
  );
}

/* ── 이메일 웨이팅리스트 폼 ───────────────────────────────────── */
function WaitlistForm({
  formId,
  ctaLabel,
  dark = false,
}: {
  formId: string;
  ctaLabel: string;
  dark?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmittedEmail(email.trim());
  }

  const inputId = `${formId}-email`;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label
            htmlFor={inputId}
            className={`${gaegu.className} mb-1 inline-block -rotate-1 text-lg ${
              dark ? "text-[var(--paper)]" : "text-[var(--ink)]"
            }`}
          >
            너의 이메일 ✎
          </label>
          <input
            id={inputId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`min-h-11 w-full rounded-sm border-2 px-4 py-2 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              dark
                ? "border-[var(--paper)]/70 bg-transparent text-[var(--paper)] placeholder:text-[var(--paper)]/40 focus-visible:ring-[var(--paper)] focus-visible:ring-offset-[var(--ink)]"
                : "border-[var(--ink)]/70 bg-[var(--paper)] text-[var(--ink)] placeholder:text-[var(--ink)]/40 focus-visible:ring-[var(--ink)] focus-visible:ring-offset-[var(--paper)]"
            }`}
          />
        </div>
        <button
          type="submit"
          className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-sm px-5 py-2 text-base font-bold transition-colors bg-[var(--red)] text-[var(--paper)] hover:bg-[var(--red-dark)] ${
            dark ? FOCUS_RING_DARK : FOCUS_RING
          }`}
        >
          {ctaLabel}
          <Send aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-2 min-h-6 text-sm ${dark ? "text-[var(--paper)]/80" : "text-[var(--ink-soft)]"}`}
      >
        {submittedEmail
          ? `줄 서기 완료! ${submittedEmail} 로 다음 호 소식을 보내드릴게요.`
          : ""}
      </p>
    </form>
  );
}

type Polaroid = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  position: string;
  priority?: boolean;
};

const heroPolaroids: Polaroid[] = [
  {
    id: "typewriter",
    src: "https://images.unsplash.com/photo-1517842645767-c639042777db",
    alt: "타자기 자판을 가까이서 찍은 사진",
    caption: "05:12 AM",
    position: "absolute left-0 top-0 w-[56%] z-20 rotate-[-7deg]",
    priority: true,
  },
  {
    id: "desk",
    src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    alt: "커피와 안경이 놓인 작업 책상 사진",
    caption: "작업 중",
    position: "absolute right-0 top-[6%] w-[50%] z-30 rotate-[5deg]",
  },
  {
    id: "overhead",
    src: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc",
    alt: "노트북과 필기구가 놓인 책상을 위에서 내려다본 사진",
    caption: "월요일",
    position: "absolute bottom-[8%] left-[4%] w-[48%] z-10 rotate-[4deg]",
  },
  {
    id: "friends",
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    alt: "함께 웃고 있는 친구들 사진",
    caption: "우편함 공유중",
    position: "absolute bottom-0 right-[1%] w-[52%] z-40 rotate-[-3deg]",
  },
];

type Step = {
  id: string;
  title: string;
  body: string;
  icon: typeof Package;
};

const steps: Step[] = [
  {
    id: "arrive",
    title: "재료가 도착한다",
    body: "매달 1일, 필름 인화·마스킹테이프·손글씨 스티커가 든 크래프트 봉투가 집으로 옵니다.",
    icon: Package,
  },
  {
    id: "collect",
    title: "오늘의 조각을 모은다",
    body: "영수증, 티켓, 낙서, 사진. 앱 카메라로 스캔하면 배경이 자동으로 잘려나갑니다.",
    icon: Scissors,
  },
  {
    id: "paste",
    title: "손 가는 대로 붙인다",
    body: "정렬 없음, 그리드 없음. 손끝이 시키는 대로 기울여 붙이는 자유 캔버스.",
    icon: Sticker,
  },
  {
    id: "send",
    title: "우편함으로만 보낸다",
    body: "전체공개 피드는 없습니다. 정한 사람에게만, 우편처럼 도착합니다.",
    icon: Mail,
  },
];

type KitItem = {
  id: string;
  title: string;
  body: string;
  icon: typeof Camera;
};

const kitItems: KitItem[] = [
  {
    id: "film",
    title: "필름 인화 8장",
    body: "그 주에 찍은 사진 중 8장을 실제로 인화해 보내드려요.",
    icon: Camera,
  },
  {
    id: "tape",
    title: "마스킹테이프 3롤",
    body: "색과 질감이 다른 테이프 3롤, 매달 다르게 구성됩니다.",
    icon: Videotape,
  },
  {
    id: "sticker",
    title: "손글씨 스티커 시트",
    body: "감정 단어, 낙서, 도장 스티커가 한 장 가득.",
    icon: Sticker,
  },
  {
    id: "tracing",
    title: "트레이싱지 5장",
    body: "반투명 종이로 다음 장을 예고편처럼 겹쳐 붙여보세요.",
    icon: Paperclip,
  },
  {
    id: "envelope",
    title: "크래프트 봉투",
    body: "이 모든 걸 담아 우표까지 붙여서, 진짜 우편처럼.",
    icon: Mail,
  },
];

type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  src: string;
  alt: string;
};

const testimonials: Testimonial[] = [
  {
    id: "soirim",
    name: "정소림",
    role: "일러스트레이터",
    quote:
      "매일 인스타에 올릴 사진을 고르다 지쳤어요. 덕지는 고를 필요가 없어서 좋아요. 못생기게 나와도 그냥 붙이면 되니까.",
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    alt: "웃고 있는 사용자 정소림 님의 얼굴 사진",
  },
  {
    id: "doyoung",
    name: "한도영",
    role: "대학원생",
    quote:
      "여자친구랑 서로의 우편함만 봐요. 좋아요 수 대신 답장이 와요. 그게 훨씬 오래 남더라고요.",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    alt: "웃고 있는 사용자 한도영 님의 얼굴 사진",
  },
];

const NAV_LINKS = [
  { href: "#kit", label: "이달의 재료" },
  { href: "#how", label: "어떻게" },
  { href: "#mailbox", label: "우편함" },
  { href: "#join", label: "가입" },
];

export default function LandingClient() {
  return (
    <div
      style={
        {
          "--paper": "#f7f1e1",
          "--paper-2": "#efe6cd",
          "--kraft": "#d9c9a3",
          "--ink": "#201c16",
          "--ink-soft": "#4a4335",
          "--red": "#c22a1d",
          "--red-dark": "#9c2117",
          "--yellow": "#f4c430",
          "--blue": "#2c5f8a",
          "--pink": "#d6497a",
        } as React.CSSProperties
      }
      className={`${blackHan.variable} ${gaegu.variable} ${specialElite.variable} relative isolate min-h-screen overflow-x-clip bg-[var(--paper)] text-[var(--ink)]`}
    >
      <a
        href="#main-content"
        className={`sr-only absolute left-2 top-2 z-[100] rounded-sm bg-[var(--ink)] px-4 py-2 text-sm font-bold text-[var(--paper)] focus:not-sr-only ${FOCUS_RING_DARK}`}
      >
        본문 바로가기
      </a>

      {/* ── 헤더 / 마스트헤드 ─────────────────────────────────── */}
      <header
        id="top"
        className="sticky top-0 z-50 border-b-2 border-[var(--ink)]/15 bg-[var(--paper)]/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a
            href="#top"
            aria-label="덕지 홈으로 이동"
            className={`inline-flex min-h-11 items-center rounded-sm px-1 ${FOCUS_RING}`}
          >
            <span className={`${blackHan.className} text-2xl tracking-tight`}>
              덕지
            </span>
            <span
              className={`${specialElite.className} ml-2 hidden text-[10px] uppercase tracking-[0.2em] text-[var(--ink-soft)] sm:inline`}
            >
              paste club
            </span>
          </a>

          <nav aria-label="주요" className="min-w-0 flex-1 overflow-x-auto">
            <ul className="flex items-center justify-end gap-1 whitespace-nowrap text-sm font-bold">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`inline-flex min-h-11 items-center rounded-sm px-3 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#join"
                  className={`ml-1 inline-flex min-h-11 items-center rounded-sm bg-[var(--ink)] px-4 text-[var(--paper)] transition-colors hover:bg-[var(--ink)]/85 ${FOCUS_RING}`}
                >
                  줄서기
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content">
        {/* ── 히어로 ───────────────────────────────────────── */}
        <section aria-label="히어로" className="relative overflow-hidden">
          <div className="dot-texture pointer-events-none absolute inset-0 text-[var(--ink)] opacity-[0.05]" aria-hidden="true" />
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-28">
            <div className="relative z-10">
              <span
                className={`${specialElite.className} inline-flex -rotate-2 items-center gap-2 rounded-full border-2 border-dashed border-[var(--ink)]/60 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]`}
              >
                Issue No.01 · 정기구독 종이+앱
              </span>

              <h1
                className={`${blackHan.className} mt-6 text-6xl leading-[0.95] text-[var(--ink)] sm:text-7xl md:text-8xl`}
              >
                덕지
              </h1>
              <p
                className={`${gaegu.className} mt-3 rotate-[-1deg] text-3xl text-[var(--red)] sm:text-4xl`}
              >
                오리고 붙이면, 오늘이 된다
              </p>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--ink-soft)]">
                결 좋은 사진 한 장보다{" "}
                <mark className="rounded-sm bg-[var(--yellow)] px-1 text-[var(--ink)]">
                  엉망으로 붙인 하루
                </mark>{" "}
                한 장이 더 오래 남습니다. 덕지는 진짜 테이프와 스티커, 필름
                인화를 매달 우편함으로 보내고, 앱으로 오늘의 조각을 모아
                나만의 콜라주 다이어리를 완성하게 합니다.
              </p>

              <div className="mt-8">
                <WaitlistForm formId="hero" ctaLabel="선입선붙 줄서기" />
                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                  * 매달 1일, 딱 500명에게만 재료가 도착합니다.
                </p>
              </div>
            </div>

            <Reveal
              y={0}
              delay={0.1}
              className="relative mx-auto aspect-[4/5] w-full max-w-sm lg:max-w-md"
            >
              <div aria-hidden="true" className="tape absolute -top-2 left-[12%] z-40 h-6 w-20 -rotate-6" />
              <div
                aria-hidden="true"
                className="absolute -right-3 top-1/3 z-40 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--ink)] bg-[var(--paper)] text-center"
              >
                <span className={`${specialElite.className} text-[9px] leading-tight text-[var(--ink-soft)]`}>
                  since
                  <br />
                  2026
                </span>
              </div>
              {heroPolaroids.map((photo) => (
                <figure key={photo.id} className={`${photo.position} rounded-sm bg-[var(--paper)] p-2 pb-6 shadow-[0_14px_28px_-10px_rgba(32,28,22,0.4)]`}>
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--kraft)]">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 45vw"
                      className="object-cover contrast-[1.05] saturate-[0.85]"
                      priority={photo.priority}
                    />
                  </div>
                  <figcaption
                    className={`${gaegu.className} mt-1 text-center text-base text-[var(--ink-soft)]`}
                  >
                    {photo.caption}
                  </figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
          <a
            href="#problem"
            className={`mx-auto mb-6 hidden min-h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ink)]/30 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] sm:flex ${FOCUS_RING}`}
            aria-label="다음 섹션으로 스크롤"
          >
            <ChevronDown aria-hidden="true" className="h-5 w-5" />
          </a>
        </section>

        {/* ── 마퀴 티커 ────────────────────────────────────── */}
        <div className="overflow-hidden border-y-2 border-[var(--ink)] bg-[var(--ink)] py-3" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((loop) => (
              <div key={loop} className="flex shrink-0 items-center gap-8 pr-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <span
                    key={index}
                    className={`${blackHan.className} text-xl tracking-wide text-[var(--paper)] sm:text-2xl`}
                  >
                    오려서 · 붙여서 · 망쳐서 · 완성해서
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── 문제 제기 ────────────────────────────────────── */}
        <section
          id="problem"
          aria-labelledby="problem-heading"
          className="bg-[var(--paper-2)]"
        >
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
            <Reveal>
              <p
                className={`${specialElite.className} text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]`}
              >
                우리가 마주한 문제
              </p>
              <h2
                id="problem-heading"
                className="mt-4 text-3xl font-bold leading-snug text-[var(--ink)] sm:text-4xl"
              >
                &ldquo;피드는 완벽한데,
                <br />
                어제 뭘 했는지 하나도 기억나지 않는다.&rdquo;
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--ink-soft)]">
                정갈하게 고른 사진 아홉 장. 그 뒤에는 지워진 하루들이 있습니다.
                우리는 잘 나온 사진 대신, 못생기게라도{" "}
                <span className="font-bold text-[var(--red)]">진짜로 붙인 하루</span>
                를 택하기로 했습니다.
              </p>
            </Reveal>
          </div>
        </section>

        <TornDivider fill="var(--paper)" />

        {/* ── 어떻게 작동하나 ───────────────────────────────── */}
        <section id="how" aria-labelledby="how-heading" className="bg-[var(--paper)]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 id="how-heading" className={`${blackHan.className} text-4xl sm:text-5xl`}>
                어떻게 작동하나
              </h2>
              <p className="mt-4 text-lg text-[var(--ink-soft)]">
                네 단계. 그 사이에 규칙은 없습니다.
              </p>
            </Reveal>

            <ol className="mt-14 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.id}>
                    <Reveal delay={index * 0.08} className="h-full">
                      <div
                        className={`h-full rounded-sm border-2 border-[var(--ink)]/15 bg-[var(--paper-2)] p-6 shadow-[0_10px_20px_-12px_rgba(32,28,22,0.3)] ${ROTATIONS[index % ROTATIONS.length]}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[var(--ink)]/50 text-sm font-bold"
                          >
                            {index + 1}
                          </span>
                          <Icon aria-hidden="true" className="h-6 w-6 text-[var(--red)]" />
                        </div>
                        <h3 className="mt-4 text-xl font-bold text-[var(--ink)]">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-base leading-relaxed text-[var(--ink-soft)]">
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

        {/* ── 이달의 재료 ──────────────────────────────────── */}
        <section id="kit" aria-labelledby="kit-heading" className="relative bg-[var(--kraft)]">
          <div className="dot-texture pointer-events-none absolute inset-0 text-[var(--ink)] opacity-[0.06]" aria-hidden="true" />
          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span
                className={`${specialElite.className} inline-block rotate-1 rounded-full border-2 border-dashed border-[var(--ink)]/50 px-4 py-1 text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]`}
              >
                이달의 재료 · 7월호
              </span>
              <h2 id="kit-heading" className={`${blackHan.className} mt-5 text-4xl sm:text-5xl`}>
                우편함으로 오는 것들
              </h2>
            </Reveal>

            <ul className="mt-14 grid list-none gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {kitItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Reveal delay={index * 0.06} className="h-full">
                      <div
                        className={`flex h-full flex-col items-start gap-3 rounded-sm border-2 border-[var(--ink)] bg-[var(--paper)] p-5 shadow-[0_10px_20px_-12px_rgba(32,28,22,0.35)] ${ROTATIONS[(index + 2) % ROTATIONS.length]}`}
                      >
                        <Icon aria-hidden="true" className="h-7 w-7 text-[var(--blue)]" />
                        <h3 className="text-lg font-bold text-[var(--ink)]">
                          {item.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                          {item.body}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <TornDivider fill="var(--ink)" />

        {/* ── 우편함 (다크) ────────────────────────────────── */}
        <section
          id="mailbox"
          aria-labelledby="mailbox-heading"
          className="bg-[var(--ink)] text-[var(--paper)]"
        >
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 id="mailbox-heading" className={`${blackHan.className} text-4xl sm:text-5xl`}>
                우편함, 그러니까 진짜 친한 사람들
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-[var(--paper)]/75">
                덕지엔 &apos;전체공개&apos;가 없습니다. 우편함을 나눌 사람을 직접
                고르고, 딱 그 사람들에게만 오늘의 콜라주가 도착합니다.
              </p>
            </Reveal>

            <ul className="mt-14 grid list-none gap-8 md:grid-cols-2">
              {testimonials.map((person, index) => (
                <li key={person.id}>
                  <Reveal delay={index * 0.1} className="h-full">
                    <blockquote
                      className={`flex h-full flex-col gap-5 rounded-sm border-2 border-[var(--paper)]/25 bg-[var(--paper)]/5 p-7 ${ROTATIONS[index % ROTATIONS.length]}`}
                    >
                      <p className={`${gaegu.className} text-2xl leading-snug text-[var(--paper)]`}>
                        &ldquo;{person.quote}&rdquo;
                      </p>
                      <footer className="mt-auto flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-[var(--paper)]/40">
                          <Image
                            src={person.src}
                            alt={person.alt}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <p className="font-bold text-[var(--paper)]">{person.name}</p>
                          <p className="text-[var(--paper)]/60">{person.role}</p>
                        </div>
                      </footer>
                    </blockquote>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TornDivider fill="var(--paper-2)" flip />

        {/* ── 가입 / 가격 ──────────────────────────────────── */}
        <section id="join" aria-labelledby="join-heading" className="bg-[var(--paper-2)]">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 id="join-heading" className={`${blackHan.className} text-4xl sm:text-5xl`}>
                이번 달, 줄을 서보세요
              </h2>
              <p className="mt-4 text-lg text-[var(--ink-soft)]">
                카드 등록 없이, 이메일만으로 줄을 설 수 있어요.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-12">
              <div className="relative mx-auto max-w-xl rounded-sm border-2 border-[var(--ink)] bg-[var(--paper)] p-8 shadow-[0_16px_32px_-14px_rgba(32,28,22,0.4)] sm:p-10">
                <span
                  aria-hidden="true"
                  className="absolute -right-4 -top-4 flex h-20 w-20 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-[var(--red)] bg-[var(--paper)] text-center"
                >
                  <span className={`${specialElite.className} text-[10px] leading-tight text-[var(--red)]`}>
                    approved
                    <br />
                    by 덕지
                  </span>
                </span>

                <p className={`${specialElite.className} text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]`}>
                  덕지 멤버십
                </p>
                <p className="mt-2 flex items-baseline gap-1">
                  <span className={`${blackHan.className} text-5xl`}>19,000원</span>
                  <span className="text-base text-[var(--ink-soft)]">/ 월</span>
                </p>

                <ul className="mt-6 space-y-3 text-base text-[var(--ink-soft)]">
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-[var(--red)]">✂</span>
                    매달 재료 키트 배송 (필름·테이프·스티커)
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-[var(--red)]">✂</span>
                    무제한 콜라주 캔버스 저장
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-[var(--red)]">✂</span>
                    우편함 최대 12명과 공유
                  </li>
                  <li className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-[var(--red)]">✂</span>
                    지난 호 전체 아카이브 열람
                  </li>
                </ul>

                <div className="mt-8 border-t-2 border-dashed border-[var(--ink)]/30 pt-8">
                  <WaitlistForm formId="join" ctaLabel="선입선붙 명단에 이름 올리기" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ── 푸터 ─────────────────────────────────────────── */}
      <footer className="border-t-2 border-[var(--ink)] bg-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <span className={`${blackHan.className} text-3xl`}>덕지</span>
              <p
                className={`${gaegu.className} mt-4 max-w-md rotate-[-0.5deg] text-xl leading-relaxed text-[var(--ink-soft)]`}
              >
                &ldquo;이 페이지는 완벽하지 않습니다. 일부러요.&rdquo;
                <br />— 덕지 편집팀 드림
              </p>
            </div>

            <nav aria-label="푸터">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm font-bold text-[var(--ink-soft)]">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={`inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:hello@deokji.paste"
                    className={`inline-flex min-h-11 items-center rounded-sm transition-colors hover:text-[var(--ink)] ${FOCUS_RING}`}
                  >
                    이메일
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <p className={`${specialElite.className} mt-10 text-xs uppercase tracking-[0.15em] text-[var(--ink-soft)]/70`}>
            © 2026 DEOKJI PASTE CLUB. Since Issue No.01.
          </p>
        </div>
      </footer>

      <style jsx>{`
        .dot-texture {
          background-image: radial-gradient(currentColor 1px, transparent 1.4px);
          background-size: 15px 15px;
        }
        .tape {
          background-color: var(--yellow);
          opacity: 0.9;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.4) 0 4px,
            rgba(255, 255, 255, 0.12) 4px 8px
          );
          box-shadow: 0 2px 6px rgba(32, 28, 22, 0.25);
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: deokji-marquee 26s linear infinite;
        }
        .marquee-track:hover,
        .marquee-track:focus-within {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
        @keyframes deokji-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
