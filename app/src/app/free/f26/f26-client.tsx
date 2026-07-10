"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Gowun_Batang } from "next/font/google";
import { ArrowDown, Check, Mail } from "lucide-react";

const gowunBatang = Gowun_Batang({
  variable: "--font-zen-serif",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

/* ────────────────────────────────────────────────────────────
   prefers-reduced-motion — matchMedia를 useSyncExternalStore로 직접
   구독한다. useEffect 기반 감지는 이 환경에서 OS 설정을 놓치는 경우가
   있어, 진입 애니메이션의 초기 opacity:0 이 영구히 남는 버그가 생긴다.
   ──────────────────────────────────────────────────────────── */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
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

/* ── 색 팔레트 (본문 참조용 주석 — 실제 값은 Tailwind arbitrary value로 사용) ──
   paper #F5F1E8 / paper-deep #EDE7D9 / ink #1C1A16
   ink-soft #4A4638 (8.4:1) / ink-light #6B6558 (5.1:1)
   accent #B6533C (그래픽 전용, 3:1+) / accent-deep #8C3E2C (본문 텍스트용, 6.6:1)
   mist #B9B29C (다크 배경 보조 텍스트, 8.2:1) / accent-light #C97A5E (다크 배경 텍스트, 5.3:1)
*/

const FOCUS_LIGHT =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C3E2C] focus-visible:rounded-sm";
const FOCUS_DARK =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C97A5E] focus-visible:rounded-sm";

/* ────────────────────────────────────────────────────────────
   Reveal — 스크롤 진입 시 천천히 떠오르는 문단. reduced-motion이면
   즉시 최종 상태(투명도 1)로 렌더해 콘텐츠가 숨는 사고를 막는다.
   ──────────────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const reducedMotion = usePrefersReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;

  if (reducedMotion) {
    return as === "li" ? (
      <li className={className}>{children}</li>
    ) : (
      <div className={className}>{children}</div>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────
   BreathingOrb — 4.4초 주기로 팽창·수축하는 장식용 동심원.
   장식적 모션이므로 aria-hidden, reduced-motion이면 정적으로 고정.
   ──────────────────────────────────────────────────────────── */
function BreathingOrb({ reducedMotion }: { reducedMotion: boolean }) {
  const rings = [
    { r: 150, opacity: 0.16, delay: 0 },
    { r: 108, opacity: 0.24, delay: 0.5 },
    { r: 66, opacity: 0.34, delay: 1 },
  ];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 400"
      className="h-full w-full"
    >
      {rings.map((ring) => (
        <motion.circle
          key={ring.r}
          cx={200}
          cy={200}
          r={ring.r}
          fill="none"
          stroke="#1C1A16"
          strokeWidth={1}
          style={{ transformOrigin: "50% 50%", transformBox: "fill-box" }}
          animate={
            reducedMotion
              ? undefined
              : {
                  scale: [1, 1.1, 1],
                  opacity: [ring.opacity, ring.opacity + 0.16, ring.opacity],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4.4,
                  delay: ring.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          initial={false}
          {...(reducedMotion ? { opacity: ring.opacity } : {})}
        />
      ))}
      <circle cx={200} cy={200} r={2.5} fill="#B6533C" />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   LongPressButton — 3초간 눌러야(또는 Space/Enter를 3초간 눌러야)
   완성되는 제출 버튼. 서두르면 작동하지 않는다. 폼 필드에서 Enter를
   치면 즉시 제출되는 대안 경로도 함께 제공해 누구도 배제하지 않는다.
   ──────────────────────────────────────────────────────────── */
const HOLD_DURATION = 3000;

function LongPressButton({
  onComplete,
  done,
  helpId,
}: {
  onComplete: () => void;
  done: boolean;
  helpId: string;
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const holdingRef = useRef(false);
  const tickFnRef = useRef<(ts: number) => void>(() => {});

  const tick = useCallback(
    (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(1, elapsed / HOLD_DURATION);
      setProgress(p);
      if (p >= 1) {
        holdingRef.current = false;
        setStatus("완료되었습니다.");
        onComplete();
        return;
      }
      rafRef.current = requestAnimationFrame(tickFnRef.current);
    },
    [onComplete],
  );

  useEffect(() => {
    tickFnRef.current = tick;
  }, [tick]);

  const start = useCallback(() => {
    if (done || holdingRef.current) return;
    holdingRef.current = true;
    startRef.current = null;
    setStatus("누르는 중입니다. 3초간 유지해주세요.");
    rafRef.current = requestAnimationFrame(tickFnRef.current);
  }, [done]);

  const release = useCallback(() => {
    if (done) return;
    if (!holdingRef.current) return;
    holdingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    startRef.current = null;
    setProgress(0);
    setStatus("놓았습니다. 다시 처음부터 눌러주세요.");
  }, [done]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    start();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) {
      e.preventDefault();
      start();
    }
  };
  const handleKeyUp = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") release();
  };

  const circumference = 2 * Math.PI * 46;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        disabled={done}
        aria-describedby={helpId}
        aria-pressed={done}
        onPointerDown={handlePointerDown}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        className={`group relative flex h-28 w-28 items-center justify-center rounded-full border border-[#B9B29C]/50 bg-[#22201B] text-[#F5F1E8] transition-colors duration-500 disabled:cursor-default ${FOCUS_DARK}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full -rotate-90"
        >
          <circle
            cx={50}
            cy={50}
            r={46}
            fill="none"
            stroke="#3A362E"
            strokeWidth={1.5}
          />
          <circle
            cx={50}
            cy={50}
            r={46}
            fill="none"
            stroke={done ? "#C97A5E" : "#B6533C"}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={done ? 0 : dashOffset}
          />
        </svg>
        <span className="relative text-sm tracking-wide">
          {done ? <Check aria-hidden="true" className="h-6 w-6" /> : "누르기"}
        </span>
      </button>
      <p id={helpId} className="max-w-[16rem] text-center text-xs leading-relaxed text-[#B9B29C]">
        {done
          ? "여백에 도착했습니다."
          : "3초간 눌러 마음을 정하세요. 서두르면 처음으로 돌아갑니다."}
      </p>
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Waitlist — 이메일 폼. 롱프레스 버튼이 주 경로, 입력창에서 Enter를
   치면 즉시 제출되는 경로도 함께 제공한다(대안 경로 = 접근성 대비).
   ──────────────────────────────────────────────────────────── */
function Waitlist() {
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const complete = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }
    setDone(true);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    complete();
  };

  useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col items-center gap-10">
      <div className="w-full">
        <label htmlFor="yeobaek-email" className="mb-3 flex items-center gap-2 text-sm tracking-[0.2em] text-[#B9B29C]">
          <Mail aria-hidden="true" className="h-4 w-4" />
          이메일
        </label>
        <input
          ref={inputRef}
          id="yeobaek-email"
          name="email"
          type="email"
          required
          aria-required="true"
          aria-describedby="email-hint"
          autoComplete="email"
          disabled={done}
          placeholder="you@example.com"
          className={`w-full border-b border-[#4A4638] bg-transparent px-1 py-3 text-lg text-[#F5F1E8] placeholder:text-[#4A4638] disabled:opacity-50 ${FOCUS_DARK}`}
        />
        <p id="email-hint" className="mt-3 text-xs leading-relaxed text-[#6B6558]">
          아래 버튼을 3초간 눌러 완료하거나, 이 입력창에서 Enter를 눌러 바로 제출할 수 있습니다.
        </p>
      </div>

      <LongPressButton onComplete={complete} done={done} helpId="longpress-help" />

      {done && (
        <p
          ref={successRef}
          tabIndex={-1}
          className="text-center text-base text-[#F5F1E8] outline-none"
        >
          여백에 도착했습니다. 곧 첫 번째 침묵을 전해드릴게요.
        </p>
      )}
    </form>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Landing
   ──────────────────────────────────────────────────────────── */
export default function F26Landing() {
  const reducedMotion = usePrefersReducedMotion();

  const scrollToId = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    target.focus({ preventScroll: true });
  };

  const manifestoLines = [
    "채우는 시대에, 우리는 비운다.",
    "빠름의 시대에, 우리는 늦는다.",
    "알림의 시대에, 우리는 침묵한다.",
    "그리고 그 여백 속에서, 비로소 당신을 만난다.",
  ];

  const features = [
    {
      num: "一",
      title: "무음의 시작",
      body: "알림 없이, 소리 없이. 진동조차 최소화된 25분의 침묵 타이머가 화면 뒤에서 조용히 흐릅니다.",
      offset: "md:translate-y-0",
    },
    {
      num: "二",
      title: "기록하지 않는 기록",
      body: "연속일수도, 그래프도 없습니다. 남는 것은 단 하나 — “오늘, 앉았는가” 뿐입니다.",
      offset: "md:translate-y-12",
    },
    {
      num: "三",
      title: "손끝의 의식",
      body: "실제 향이 타는 속도로 시간을 느끼는, 화면 밖의 타이머. 다 타면, 끝입니다.",
      offset: "md:-translate-y-6",
    },
  ];

  return (
    <div className={`${gowunBatang.variable} bg-[#F5F1E8] text-[#1C1A16]`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#1C1A16] focus:px-4 focus:py-3 focus:text-sm focus:text-[#F5F1E8]"
      >
        본문으로 건너뛰기
      </a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#1C1A16]/[0.08] bg-[#F5F1E8]/85 backdrop-blur">
        <nav
          aria-label="주요"
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10"
        >
          <a
            href="#main"
            onClick={scrollToId("main")}
            className={`flex items-center gap-2 text-sm tracking-[0.3em] ${FOCUS_LIGHT}`}
          >
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full border border-[#1C1A16]" />
            여백
          </a>
          <a
            href="#waitlist"
            onClick={scrollToId("waitlist")}
            className={`min-h-11 rounded-full border border-[#1C1A16] px-5 py-2.5 text-sm tracking-wide transition-colors duration-500 hover:bg-[#1C1A16] hover:text-[#F5F1E8] ${FOCUS_LIGHT}`}
          >
            시작하기
          </a>
        </nav>
      </header>

      <main id="main">
        {/* ── HERO ───────────────────────────────────────────── */}
        <section
          aria-label="여백 소개"
          className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2">
            <BreathingOrb reducedMotion={reducedMotion} />
          </div>

          <div className="relative z-10 flex max-w-3xl flex-col items-center">
            <p className="mb-8 text-xs tracking-[0.4em] text-[#8C3E2C]">
              YEOBAEK · 침묵을 위한 여백
            </p>
            <h1
              style={{ fontFamily: "var(--font-zen-serif)" }}
              className="text-[13vw] leading-[1.25] tracking-tight text-[#1C1A16] sm:text-6xl md:text-7xl"
            >
              숨을 쉬는 것 말고는,
              <br />
              아무것도 하지 마세요.
            </h1>
            <p className="mt-10 max-w-md text-base leading-relaxed text-[#4A4638] md:text-lg">
              여백은 앱이 아니라 도구입니다. 향 하나가 다 탈 때까지, 딱 그만큼만 아무것도 하지 않는 연습.
            </p>
            <a
              href="#philosophy"
              onClick={scrollToId("philosophy")}
              className={`mt-14 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm tracking-wide text-[#4A4638] transition-colors duration-500 hover:text-[#1C1A16] ${FOCUS_LIGHT}`}
            >
              천천히 내려가기
              <ArrowDown aria-hidden="true" className="h-4 w-4" />
            </a>
          </div>
        </section>

        {/* ── MANIFESTO ──────────────────────────────────────── */}
        <section
          id="philosophy"
          tabIndex={-1}
          aria-labelledby="philosophy-heading"
          className="bg-[#EDE7D9] px-6 py-32 md:py-48"
        >
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <p className="mb-6 text-xs tracking-[0.4em] text-[#8C3E2C]">선언 · MANIFESTO</p>
              <h2 id="philosophy-heading" className="sr-only">
                여백의 선언
              </h2>
            </Reveal>
            <div className="flex flex-col gap-8">
              {manifestoLines.map((line, i) => (
                <Reveal key={line} delay={i * 0.15}>
                  <p
                    style={{ fontFamily: "var(--font-zen-serif)" }}
                    className={`text-2xl leading-relaxed md:text-3xl ${
                      i === manifestoLines.length - 1 ? "text-[#8C3E2C]" : "text-[#1C1A16]"
                    }`}
                  >
                    {line}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ───────────────────────────────────────── */}
        <section
          id="features"
          tabIndex={-1}
          aria-labelledby="features-heading"
          className="px-6 py-32 md:py-48"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="mb-20 text-center">
              <p className="mb-4 text-xs tracking-[0.4em] text-[#8C3E2C]">세 가지 여백</p>
              <h2
                id="features-heading"
                style={{ fontFamily: "var(--font-zen-serif)" }}
                className="text-3xl md:text-4xl"
              >
                채우지 않아서, 완전합니다
              </h2>
            </Reveal>

            <ul className="grid gap-16 md:grid-cols-3 md:gap-8">
              {features.map((f, i) => (
                <Reveal key={f.title} as="li" delay={i * 0.12} className={`text-left ${f.offset}`}>
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: "var(--font-zen-serif)" }}
                    className="mb-6 block text-5xl text-[#B6533C]"
                  >
                    {f.num}
                  </span>
                  <h3 className="mb-4 text-xl text-[#1C1A16]">{f.title}</h3>
                  <p className="leading-relaxed text-[#4A4638]">{f.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ── RITUAL TIMELINE ────────────────────────────────── */}
        <section
          id="ritual"
          tabIndex={-1}
          aria-labelledby="ritual-heading"
          className="bg-[#EDE7D9] px-6 py-32 md:py-48"
        >
          <div className="mx-auto max-w-4xl">
            <Reveal className="mb-20 text-center">
              <p className="mb-4 text-xs tracking-[0.4em] text-[#8C3E2C]">하루의 리듬</p>
              <h2
                id="ritual-heading"
                style={{ fontFamily: "var(--font-zen-serif)" }}
                className="text-3xl md:text-4xl"
              >
                세 번의 여백
              </h2>
            </Reveal>

            <ol className="flex flex-col gap-24">
              <li>
                <Reveal className="grid items-center gap-8 md:grid-cols-2">
                  <div>
                    <p className="mb-3 text-sm tracking-[0.3em] text-[#8C3E2C]">05:40 · 아침</p>
                    <p
                      style={{ fontFamily: "var(--font-zen-serif)" }}
                      className="mb-4 text-2xl leading-relaxed"
                    >
                      눈뜨고, 향 하나를 켭니다.
                    </p>
                    <p className="leading-relaxed text-[#4A4638]">
                      아무 메시지도 확인하지 않은 채로. 그날 첫 여백은 언제나 침묵으로 시작됩니다.
                    </p>
                  </div>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1000&q=80"
                      alt="안개 낀 숲 사이로 난 좁은 길, 아무도 서두르지 않는 아침 풍경"
                      fill
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-cover grayscale-[55%] sepia-[18%] contrast-[1.05]"
                    />
                  </div>
                </Reveal>
              </li>

              <li>
                <Reveal className="grid items-center gap-8 md:grid-cols-2">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm md:order-2">
                    <Image
                      src="https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1000&q=80"
                      alt="나뭇가지 사이로 비스듬히 내려앉는 오후의 햇빛"
                      fill
                      sizes="(min-width: 768px) 40vw, 90vw"
                      className="object-cover grayscale-[55%] sepia-[18%] contrast-[1.05]"
                    />
                  </div>
                  <div className="md:order-1">
                    <p className="mb-3 text-sm tracking-[0.3em] text-[#8C3E2C]">13:00 · 낮</p>
                    <p
                      style={{ fontFamily: "var(--font-zen-serif)" }}
                      className="mb-4 text-2xl leading-relaxed"
                    >
                      가장 바쁜 시각에, 가장 짧게 멈춥니다.
                    </p>
                    <p className="leading-relaxed text-[#4A4638]">
                      단 5분. 회의와 회의 사이, 여백이 끼어듭니다. 아무 결정도 내리지 않아도 됩니다.
                    </p>
                  </div>
                </Reveal>
              </li>

              <li>
                <Reveal className="rounded-sm bg-[#1C1A16] px-8 py-16 text-center md:px-16">
                  <p className="mb-3 text-sm tracking-[0.3em] text-[#C97A5E]">22:10 · 밤</p>
                  <p
                    style={{ fontFamily: "var(--font-zen-serif)" }}
                    className="mx-auto mb-4 max-w-xl text-2xl leading-relaxed text-[#F5F1E8]"
                  >
                    사진도, 소리도 없습니다. 밤의 여백은 아무것도 남기지 않습니다.
                  </p>
                  <p className="mx-auto max-w-md leading-relaxed text-[#B9B29C]">
                    화면을 끄고, 향이 다 타는 것을 바라봅니다. 그것이 하루의 마지막 기록입니다.
                  </p>
                </Reveal>
              </li>
            </ol>
          </div>
        </section>

        {/* ── OBJECT ─────────────────────────────────────────── */}
        <section
          id="object"
          tabIndex={-1}
          aria-labelledby="object-heading"
          className="px-6 py-32 md:py-48"
        >
          <div className="mx-auto grid max-w-5xl items-center gap-16 md:grid-cols-2">
            <Reveal className="order-2 md:order-1">
              <p className="mb-4 text-xs tracking-[0.4em] text-[#8C3E2C]">물성 · OBJECT</p>
              <h2
                id="object-heading"
                style={{ fontFamily: "var(--font-zen-serif)" }}
                className="mb-6 text-3xl md:text-4xl"
              >
                여백 세트
              </h2>
              <p className="mb-8 leading-relaxed text-[#4A4638]">
                화면만으로는 부족해서, 실물을 함께 보냅니다. 매달 한 번, 손끝으로 만지는 여백이 도착합니다.
              </p>
              <ul className="flex flex-col gap-3 text-[#1C1A16] marker:text-[#8C3E2C]">
                <li className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-[#B6533C]">·</span>
                  25분을 태우는 무향 인센스 30개
                </li>
                <li className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-[#B6533C]">·</span>
                  숫자 없는 모래시계
                </li>
                <li className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-[#B6533C]">·</span>
                  단 한 줄만 쓸 수 있는 손바닥 카드
                </li>
                <li className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-[#B6533C]">·</span>
                  줄도 칸도 없는 무지 노트
                </li>
              </ul>
            </Reveal>

            <Reveal className="order-1 flex items-center justify-center md:order-2">
              <IncenseIllustration reducedMotion={reducedMotion} />
            </Reveal>
          </div>
        </section>

        {/* ── TESTIMONIAL ────────────────────────────────────── */}
        <section
          aria-labelledby="voice-heading"
          className="bg-[#EDE7D9] px-6 py-32 text-center md:py-40"
        >
          <h2 id="voice-heading" className="sr-only">
            사용자의 목소리
          </h2>
          <Reveal className="mx-auto max-w-2xl">
            <blockquote>
              <p
                className="text-2xl italic leading-relaxed text-[#1C1A16] md:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                &ldquo;이 도구는 아무것도 하지 않는 법을 가르쳐줬다.
                <br />
                그게 내가 여태 배운 것 중 가장 어려운 일이었다.&rdquo;
              </p>
              <cite className="mt-8 block text-sm not-italic tracking-[0.2em] text-[#6B6558]">
                익명의 사용자 · 사용 108일째
              </cite>
            </blockquote>
          </Reveal>
        </section>

        {/* ── WAITLIST ───────────────────────────────────────── */}
        <section
          id="waitlist"
          tabIndex={-1}
          aria-labelledby="waitlist-heading"
          className="bg-[#1C1A16] px-6 py-32 text-center md:py-48"
        >
          <Reveal className="mx-auto mb-16 max-w-xl">
            <p className="mb-4 text-xs tracking-[0.4em] text-[#C97A5E]">시작하기</p>
            <h2
              id="waitlist-heading"
              style={{ fontFamily: "var(--font-zen-serif)" }}
              className="mb-6 text-3xl text-[#F5F1E8] md:text-4xl"
            >
              여백에 이름을 남기세요
            </h2>
            <p className="leading-relaxed text-[#B9B29C]">
              서두르지 않아도 됩니다. 준비가 되면, 그때 눌러주세요.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <Waitlist />
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#1C1A16]/[0.08] bg-[#EDE7D9] px-6 py-16 text-center">
        <p className="mb-3 text-sm tracking-[0.3em] text-[#1C1A16]">여백 · YEOBAEK</p>
        <p className="mb-6 text-xs leading-relaxed text-[#6B6558]">
          아무것도 하지 않기 위한, 가장 정교한 도구
        </p>
        <a
          href="mailto:hello@yeobaek.kr"
          className={`text-xs text-[#6B6558] underline decoration-[#6B6558]/40 underline-offset-4 hover:text-[#1C1A16] ${FOCUS_LIGHT}`}
        >
          hello@yeobaek.kr
        </a>
        <p className="mt-8 text-xs text-[#6B6558]">&copy; 2026 YEOBAEK.</p>
      </footer>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   IncenseIllustration — 실물이 없는(발명된) 제품이므로 재고 사진 대신
   직접 그린 SVG로 대체한다. 향이 타는 잔불만 은은히 맥동한다.
   ──────────────────────────────────────────────────────────── */
function IncenseIllustration({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 320"
      className="h-auto w-full max-w-xs"
    >
      <line x1="120" y1="40" x2="120" y2="260" stroke="#4A4638" strokeWidth={1.5} />
      <ellipse cx="120" cy="270" rx="46" ry="10" fill="none" stroke="#8C3E2C" strokeWidth={1.5} />
      <ellipse cx="120" cy="270" rx="4" ry="1.6" fill="#B6533C" />

      <motion.circle
        cx="120"
        cy="40"
        r="3.5"
        fill="#B6533C"
        animate={reducedMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={
          reducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
        }
        {...(reducedMotion ? { opacity: 0.85 } : {})}
      />

      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d="M120 34 C 110 4, 132 -10, 120 -34"
          stroke="#B9B29C"
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
          transform="translate(0,34)"
          style={{ opacity: 0 }}
          animate={
            reducedMotion
              ? undefined
              : {
                  opacity: [0, 0.5, 0],
                  y: [0, -30],
                }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  duration: 4,
                  delay: i * 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}
    </svg>
  );
}
