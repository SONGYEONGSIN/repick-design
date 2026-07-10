"use client";

import Image from "next/image";
import { Fraunces, Gowun_Batang } from "next/font/google";
import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  Droplets,
  Leaf,
  Mic,
  Network,
  Pause,
  Play,
  Sprout,
  Users2,
  Waves,
  Wind,
  type LucideIcon,
} from "lucide-react";
import styles from "./f7.module.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
});

const gowunBatang = Gowun_Batang({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-gowun",
});

/* ────────────────────────────────────────────────────────────────
   접근성: prefers-reduced-motion을 useSyncExternalStore로 직접 구독한다.
   framer-motion의 useReducedMotion()이 OS 설정을 못 잡는 환경 대비 —
   reduced일 때는 initial 상태를 최종 상태와 동일하게 만들어
   콘텐츠가 opacity:0로 영구히 숨는 사고를 원천 차단한다.
   ──────────────────────────────────────────────────────────────── */
function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
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

function riseIn(reduced: boolean, delay = 0) {
  return {
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: reduced ? { duration: 0 } : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

function drawPath(reduced: boolean, delay = 0) {
  return {
    initial: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0.5 },
    whileInView: { pathLength: 1, opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: reduced ? { duration: 0 } : { duration: 1.8, delay, ease: "easeInOut" as const },
  };
}

type Step = {
  icon: LucideIcon;
  name: string;
  en: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    icon: Mic,
    name: "심다",
    en: "Plant",
    desc: "하루 세 개, 30초 이하의 목소리로 지금 떠오른 생각을 심습니다. 글자는 없습니다.",
  },
  {
    icon: Waves,
    name: "공명하다",
    en: "Resonate",
    desc: "좋아요도 팔로워도 없습니다. 목소리의 결이 닮은 사람에게만 조용히 가닿습니다.",
  },
  {
    icon: Network,
    name: "퍼지다",
    en: "Spread",
    desc: "답장이 가지처럼 뻗어 하나의 균사체 지도가 됩니다. 지도는 멈추지 않고 자랍니다.",
  },
];

type Voice = { quote: string; handle: string };

const VOICES: Voice[] = [
  { quote: "새벽 세 시, 아무한테도 못할 말을 심었는데 아침에 낯선 목소리가 뿌리를 내려줬다.", handle: "이끼정원사" },
  { quote: "팔로워 숫자가 없으니까 오히려 더 솔직해졌다.", handle: "느린발화자" },
  { quote: "90일 뒤에 사라진다는 걸 알아서, 더 진심으로 말하게 된다.", handle: "퇴비주의자" },
  { quote: "말하기보다 듣기가 더 많아지는 신기한 정원.", handle: "뿌리귀" },
  { quote: "알고리즘이 아니라 균사체. 그 한 문장에 설득당했다.", handle: "포자수집가" },
];

type Feature = { icon: LucideIcon; title: string; desc: string };

const FEATURES: Feature[] = [
  { icon: Sprout, title: "하루 3포자 제한", desc: "더 많이 말할수록 좋다는 착각을 걷어냈습니다. 속도 제한이 곧 배려입니다." },
  { icon: Leaf, title: "90일 후 자연 퇴비화", desc: "오래된 뿌리는 스스로 흙으로 돌아갑니다. 완벽한 기록보다 완만한 망각을." },
  { icon: Users2, title: "숫자 없는 프로필", desc: "팔로워도 좋아요 수도 보이지 않습니다. 보이는 건 오직 뿌리의 모양뿐." },
  { icon: Wind, title: "침묵도 응답입니다", desc: "답장을 강요하지 않습니다. 듣기만 해도 관계는 자랍니다." },
  { icon: Droplets, title: "텍스트 없는 발화", desc: "글이 아닌 숨소리, 떨림, 쉼표까지 그대로 심습니다." },
  { icon: Network, title: "새벽에 더 잘 자랍니다", desc: "정원은 사용자가 적을 때 오히려 무성해지도록 설계됐습니다." },
];

const NAV_LINKS = [
  { href: "#philosophy", label: "철학" },
  { href: "#grows", label: "자라는 법" },
  { href: "#garden", label: "정원" },
  { href: "#join", label: "참여하기" },
];

function WaveformToggle({ reduced }: { reduced: boolean }) {
  const [playing, setPlaying] = useState(false);
  const bars = [14, 26, 18, 32, 20, 12];
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => setPlaying((v) => !v)}
        aria-pressed={playing}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[var(--ink)] bg-[var(--paper-card)] text-[var(--ink)] transition-colors hover:bg-[var(--spore)] focus-visible:outline-none"
      >
        {playing ? (
          <Pause className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{playing ? "정원 소리 멈추기" : "정원 소리 듣기"}</span>
      </button>
      <div
        className="flex h-10 items-end gap-1.5"
        role="img"
        aria-label={playing ? "정원의 소리가 재생되고 있음을 나타내는 파형" : "정지된 소리 파형"}
      >
        {bars.map((h, i) => (
          <span
            key={i}
            data-playing={playing && !reduced ? "true" : "false"}
            className={`${styles.waveBar} block w-1.5 rounded-full bg-[var(--moss)]`}
            style={{ height: `${h}px`, transform: playing ? undefined : "scaleY(0.4)" }}
          />
        ))}
      </div>
      <p className="text-xs leading-relaxed text-[var(--ink-soft)]">
        정원에 지금 심어지고 있는
        <br />
        목소리의 결
      </p>
    </div>
  );
}

function RootSprig({ reduced, delay = 0 }: { reduced: boolean; delay?: number }) {
  return (
    <svg
      viewBox="0 0 220 220"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <motion.path
        d="M110 214C104 178 132 160 122 128C112 96 138 82 128 50C120 24 138 12 132 4"
        stroke="var(--moss)"
        strokeWidth="3"
        strokeLinecap="round"
        {...drawPath(reduced, delay)}
      />
      <motion.path
        d="M122 128C140 118 150 96 172 92"
        stroke="var(--fern)"
        strokeWidth="2.5"
        strokeLinecap="round"
        {...drawPath(reduced, delay + 0.3)}
      />
      <motion.path
        d="M128 50C110 46 96 30 76 30"
        stroke="var(--fern)"
        strokeWidth="2.5"
        strokeLinecap="round"
        {...drawPath(reduced, delay + 0.5)}
      />
      <motion.circle
        cx="132"
        cy="4"
        r="6"
        fill="var(--spore)"
        initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={reduced ? { duration: 0 } : { duration: 0.5, delay: delay + 1.7 }}
      />
    </svg>
  );
}

export default function F7Client() {
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBlobY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 90]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, -40]);

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  }

  return (
    <div className={`${styles.page} ${fraunces.variable} ${gowunBatang.variable}`}>
      <div className={styles.grain} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--ink)] focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--paper)]"
      >
        본문으로 건너뛰기
      </a>

      {/* ─────────────────────────── Header ─────────────────────────── */}
      <header className="relative z-20 border-b border-[var(--line)]/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <a
            href="#top"
            className="flex items-baseline gap-2"
            aria-label="SPORE 홈으로 이동"
          >
            <span
              className={`${fraunces.className} text-2xl italic tracking-tight text-[var(--ink)]`}
            >
              SPORE
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-[var(--ink-soft)] sm:inline">
              voice garden
            </span>
          </a>

          <nav aria-label="주 메뉴" className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#join"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-[var(--ink)] px-5 py-2.5 text-sm font-semibold text-[var(--paper)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--moss)]"
          >
            베타 신청
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* ─────────────────────────── Hero ─────────────────────────── */}
        <section
          id="top"
          ref={heroRef}
          aria-labelledby="hero-heading"
          className="relative overflow-hidden px-6 pb-24 pt-16 sm:pt-24"
        >
          <motion.div
            style={{ y: heroBlobY }}
            aria-hidden="true"
            className={`${styles.blob} pointer-events-none absolute -right-24 top-10 h-[420px] w-[420px] bg-[var(--spore)]/40 blur-2xl sm:-right-10`}
          />
          <div
            aria-hidden="true"
            className={`${styles.blob2} pointer-events-none absolute -left-32 bottom-0 h-[320px] w-[320px] bg-[var(--fern)]/25 blur-xl`}
          />

          <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <motion.div style={{ y: heroTextY }}>
              <motion.p
                {...riseIn(reduced)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--paper-card)] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--moss)]"
              >
                <Sprout className="h-3.5 w-3.5" aria-hidden="true" />
                Audio Social · 균사체 네트워크
              </motion.p>

              <motion.h1
                {...riseIn(reduced, 0.1)}
                id="hero-heading"
                className={`${gowunBatang.className} relative mt-6 text-[2.75rem] leading-[1.15] text-[var(--ink)] sm:text-6xl`}
              >
                말은,{" "}
                <span className={styles.rootUnderline}>뿌리내린다</span>
              </motion.h1>

              <motion.p
                {...riseIn(reduced, 0.2)}
                className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft)] sm:text-lg"
              >
                30초의 목소리를 심으면, 같은 온도를 가진 사람에게로 조용히 번져갑니다. 스포어는
                알고리즘이 아니라 균사체로 사람을 잇는 소리의 정원입니다.
              </motion.p>

              <motion.div
                {...riseIn(reduced, 0.3)}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <a
                  href="#join"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--spore)] px-7 py-3.5 text-sm font-bold text-[var(--ink)] shadow-[0_8px_24px_-8px_rgba(28,33,22,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  첫 포자 심기
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#garden"
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[var(--ink)]/30 px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--paper-card)]"
                >
                  정원 둘러보기
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.dl
                {...riseIn(reduced, 0.4)}
                className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-[var(--line)] pt-6"
              >
                {[
                  { value: "12,412", label: "심어진 목소리" },
                  { value: "38개국", label: "뿌리내린 지역" },
                  { value: "4h 12m", label: "평균 발아 시간" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className={`${fraunces.className} text-2xl text-[var(--moss)] sm:text-3xl`}>
                      {stat.value}
                    </dd>
                    <dd className="mt-1 text-xs leading-snug text-[var(--ink-soft)]">{stat.label}</dd>
                  </div>
                ))}
              </motion.dl>
            </motion.div>

            <motion.div
              {...riseIn(reduced, 0.25)}
              className="relative mx-auto flex w-full max-w-sm flex-col gap-6 rounded-[2.5rem] border border-[var(--line)] bg-[var(--paper-card)]/90 p-7 shadow-[0_30px_60px_-30px_rgba(28,33,22,0.35)] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-20 w-20 shrink-0">
                  <RootSprig reduced={reduced} delay={0.3} />
                </div>
                <p className="text-sm leading-relaxed text-[var(--ink-soft)]">
                  스크롤할 때마다 균사체는 실제로{" "}
                  <span className="font-semibold text-[var(--ink)]">한 마디씩 더 자랍니다.</span>
                </p>
              </div>
              <div className="h-px w-full bg-[var(--line)]" />
              <WaveformToggle reduced={reduced} />
            </motion.div>
          </div>
        </section>

        {/* ─────────────────────────── Philosophy ─────────────────────────── */}
        <section
          id="philosophy"
          aria-labelledby="philosophy-heading"
          className="relative border-t border-[var(--line)]/60 bg-[var(--paper-deep)] px-6 py-24 sm:py-32"
        >
          <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <motion.div
              {...riseIn(reduced)}
              className={`${styles.leafMask} relative mx-auto h-[380px] w-[380px] max-w-full overflow-hidden bg-[var(--moss-deep)]`}
            >
              <Image
                src="https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?auto=format&fit=crop&w=900&q=80"
                alt="빛을 받아 반짝이는 초록 고사리 잎 클로즈업"
                fill
                sizes="(min-width: 1024px) 380px, 80vw"
                className="object-cover"
              />
            </motion.div>

            <div>
              <motion.p
                {...riseIn(reduced)}
                className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--clay)]"
              >
                Philosophy
              </motion.p>
              <motion.h2
                {...riseIn(reduced, 0.1)}
                id="philosophy-heading"
                className={`${gowunBatang.className} mt-4 text-3xl leading-snug text-[var(--ink)] sm:text-4xl`}
              >
                알고리즘 대신,
                <br />
                뿌리를 믿습니다.
              </motion.h2>
              <motion.p
                {...riseIn(reduced, 0.2)}
                className="mt-6 max-w-xl text-base leading-relaxed text-[var(--ink-soft)]"
              >
                피드는 빠르게 부풀고 빠르게 잊힙니다. 스포어는 그 반대를 택했습니다. 목소리 하나는
                포자처럼 흩어져, 조건이 맞는 자리에서만 천천히 균사를 뻗습니다. 노출을 사고팔지
                않고, 순위를 매기지 않습니다. 자라는 속도를 사람이 아니라 정원이 정합니다.
              </motion.p>
              <motion.blockquote
                {...riseIn(reduced, 0.3)}
                className="mt-8 border-l-4 border-[var(--spore-deep)] pl-5"
              >
                <p className={`${fraunces.className} text-xl italic leading-snug text-[var(--moss)]`}>
                  &ldquo;Not viral. Rooted.&rdquo;
                </p>
              </motion.blockquote>
            </div>
          </div>
        </section>

        {/* ─────────────────────────── How it grows ─────────────────────────── */}
        <section
          id="grows"
          aria-labelledby="grows-heading"
          className="relative overflow-hidden px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--clay)]"
            >
              How It Grows
            </motion.p>
            <motion.h2
              {...riseIn(reduced, 0.1)}
              id="grows-heading"
              className={`${gowunBatang.className} mt-4 max-w-2xl text-3xl leading-snug text-[var(--ink)] sm:text-4xl`}
            >
              심다 → 공명하다 → 퍼지다
            </motion.h2>

            <div className="relative mt-16 grid gap-10 sm:grid-cols-3">
              <svg
                viewBox="0 0 800 40"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-8 hidden h-10 w-full sm:block"
              >
                <motion.path
                  d="M60 20C220 -10 260 50 400 20C540 -10 580 50 740 20"
                  stroke="var(--fern)"
                  strokeWidth="2"
                  strokeDasharray="1 10"
                  strokeLinecap="round"
                  fill="none"
                  {...drawPath(reduced, 0.2)}
                />
              </svg>

              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.name}
                    {...riseIn(reduced, i * 0.15)}
                    className={`${i % 2 === 0 ? styles.blob : styles.blob2} relative flex flex-col gap-4 border border-[var(--line)] bg-[var(--paper-card)] p-8`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--moss)] text-[var(--paper)]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="flex items-baseline gap-2 text-lg font-bold text-[var(--ink)]">
                      {step.name}
                      <span className={`${fraunces.className} text-sm italic text-[var(--ink-soft)]`}>
                        {step.en}
                      </span>
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── Garden (voices) ─────────────────────────── */}
        <section
          id="garden"
          aria-labelledby="garden-heading"
          className="relative border-t border-[var(--line)]/60 bg-[var(--moss-deep)] px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <motion.p
                  {...riseIn(reduced)}
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--spore)]"
                >
                  The Garden
                </motion.p>
                <motion.h2
                  {...riseIn(reduced, 0.1)}
                  id="garden-heading"
                  className={`${gowunBatang.className} mt-4 max-w-xl text-3xl leading-snug text-[var(--paper)] sm:text-4xl`}
                >
                  정원에서 자란 목소리 조각들
                </motion.h2>
              </div>
              <motion.div
                {...riseIn(reduced, 0.2)}
                className={`${styles.dropMask} hidden h-40 w-36 shrink-0 overflow-hidden bg-[var(--fern)] lg:block`}
              >
                <Image
                  src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80"
                  alt="이슬이 맺힌 초록 잎 표면 클로즈업"
                  fill
                  sizes="144px"
                  className="object-cover"
                />
              </motion.div>
            </div>

            <ul className="mt-14 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {VOICES.map((v, i) => (
                <motion.li
                  key={v.handle}
                  {...riseIn(reduced, (i % 3) * 0.12)}
                  style={{ transform: i % 2 === 0 ? "rotate(-0.6deg)" : "rotate(0.6deg)" }}
                  className={`${i % 3 === 1 ? styles.blob3 : styles.blob} border border-[var(--fern)]/40 bg-[var(--paper)]/95 p-6 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}
                >
                  <Waves className="h-5 w-5 text-[var(--fern)]" aria-hidden="true" />
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink)]">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--ink-soft)]">
                    @{v.handle}
                  </p>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* ─────────────────────────── Features ─────────────────────────── */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="relative px-6 py-24 sm:py-32"
        >
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--clay)]"
            >
              Deliberately Slow
            </motion.p>
            <motion.h2
              {...riseIn(reduced, 0.1)}
              id="features-heading"
              className={`${gowunBatang.className} mt-4 max-w-2xl text-3xl leading-snug text-[var(--ink)] sm:text-4xl`}
            >
              성장 지표를 걷어낸 자리에 남긴 것들
            </motion.h2>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    {...riseIn(reduced, (i % 3) * 0.1)}
                    className={`flex flex-col gap-3 rounded-3xl border border-[var(--line)] bg-[var(--paper-card)] p-7 ${i === 1 ? "sm:translate-y-6" : ""}`}
                  >
                    <Icon className="h-6 w-6 text-[var(--moss)]" aria-hidden="true" />
                    <h3 className="text-base font-bold text-[var(--ink)]">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────── Final CTA ─────────────────────────── */}
        <section
          id="join"
          aria-labelledby="join-heading"
          className="relative isolate overflow-hidden px-6 py-28 sm:py-36"
        >
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=80"
            alt="안개 낀 숲 사이로 비쳐드는 아침 햇살"
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--moss-deep)] via-[var(--moss-deep)]/85 to-[var(--moss-deep)]/40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.p
              {...riseIn(reduced)}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--spore)]"
            >
              Join The Garden
            </motion.p>
            <motion.h2
              {...riseIn(reduced, 0.1)}
              id="join-heading"
              className={`${fraunces.className} mt-5 text-4xl italic leading-tight text-[var(--paper)] sm:text-5xl`}
            >
              SPORE
            </motion.h2>
            <motion.p
              {...riseIn(reduced, 0.2)}
              className={`${gowunBatang.className} mt-4 text-xl leading-relaxed text-[var(--paper)] sm:text-2xl`}
            >
              당신의 목소리가 뿌리내릴 자리, 아직 비어 있습니다.
            </motion.p>

            <motion.form
              {...riseIn(reduced, 0.3)}
              onSubmit={handleSubmit}
              noValidate
              className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1 text-left">
                <label htmlFor="join-email" className="sr-only">
                  이메일 주소
                </label>
                <input
                  id="join-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[52px] w-full rounded-full border border-[var(--paper)]/40 bg-[var(--paper)]/10 px-5 text-sm text-[var(--paper)] placeholder:text-[var(--paper)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--spore)]"
                  aria-describedby="join-status"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-[52px] shrink-0 items-center justify-center gap-1.5 rounded-full bg-[var(--spore)] px-7 text-sm font-bold text-[var(--moss-deep)] transition-transform hover:-translate-y-0.5"
              >
                베타 명단에 심기
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </motion.form>
            <p id="join-status" role="status" className="mt-4 min-h-[1.25rem] text-sm text-[var(--spore)]">
              {submitted ? "심었습니다. 뿌리내리면 이메일로 알려드릴게요." : ""}
            </p>
          </div>
        </section>
      </main>

      {/* ─────────────────────────── Footer ─────────────────────────── */}
      <footer className="relative border-t border-[var(--line)]/60 bg-[var(--paper-deep)] px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className={`${fraunces.className} text-xl italic text-[var(--ink)]`}>SPORE</span>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--ink-soft)]">
              느리게 자라는 소리의 정원. 모든 뿌리는 결국 흙으로 돌아갑니다.
            </p>
          </div>
          <nav aria-label="바닥글 메뉴" className="flex flex-wrap gap-x-6 gap-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-[44px] items-center text-sm text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-xs text-[var(--ink-soft)]">
          © 2026 SPORE Garden Lab. 모든 뿌리는 흙으로 돌아갑니다.
        </p>
      </footer>
    </div>
  );
}
