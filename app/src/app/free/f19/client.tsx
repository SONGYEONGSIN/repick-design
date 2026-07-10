"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Binary,
  Radio,
  Terminal,
  Waves,
  Zap,
} from "lucide-react";
import "./f19.css";

/* -------------------------------------------------------------------------
 * Reduced-motion detection
 * Uses matchMedia + useSyncExternalStore directly (not framer-motion's own
 * useReducedMotion, which can fail to read the OS setting in some
 * environments). Server snapshot defaults to `false` so the very first
 * client read is a real, synchronous value — no flash, no permanently
 * stuck opacity:0. Below, scroll-reveals never animate opacity at all
 * (only translateY), so content is readable even if this hook were wrong.
 * ---------------------------------------------------------------------- */
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}
function useReducedMotionSafe() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function riseIn(reduced: boolean, delay = 0) {
  return {
    initial: { y: reduced ? 0 : 20 },
    whileInView: { y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] as const },
  };
}

/* -------------------------------------------------------------------------
 * ScrambleLine — cycles glyph noise before settling on the real text.
 * The accessible name is always the clean final string, rendered in a
 * permanent sr-only node; the animated glyphs are aria-hidden. Screen
 * readers never see the scramble mid-flight.
 * ---------------------------------------------------------------------- */
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ㅁㅇㅅㅋㄴ$%&";

function ScrambleLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotionSafe();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    // `display` already initializes to the final `text` (see useState above),
    // so when motion is reduced we simply skip the scramble — no setState
    // needed here, avoiding a synchronous cascading render in the effect.
    if (reduced) return;
    let frame = 0;
    const totalFrames = 14;
    let rafId = 0;
    const tick = () => {
      frame += 1;
      const revealCount = Math.floor((frame / totalFrames) * text.length);
      setDisplay(
        text
          .split("")
          .map((ch, i) => (ch === " " || i < revealCount ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      if (frame < totalFrames) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    const timeoutId = window.setTimeout(tick, delay);
    return () => {
      window.clearTimeout(timeoutId);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [text, reduced, delay]);

  return <span className="block">{display}</span>;
}

function GlitchHeading({
  lines,
  delayStep = 260,
  className = "",
}: {
  lines: string[];
  delayStep?: number;
  className?: string;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          <ScrambleLine key={line} text={line} delay={i * delayStep} />
        ))}
      </span>
    </span>
  );
}

/* -------------------------------------------------------------------------
 * ArtifactImage — RGB-split hover frame around a next/image.
 * ---------------------------------------------------------------------- */
function ArtifactImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`f19-artifact f19-brackets ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      <span aria-hidden="true" className="f19-artifact-layer f19-artifact-layer--cyan" style={{ backgroundImage: `url(${src})` }} />
      <span aria-hidden="true" className="f19-artifact-layer f19-artifact-layer--magenta" style={{ backgroundImage: `url(${src})` }} />
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Content data
 * ---------------------------------------------------------------------- */
const NAV_LINKS = [
  { href: "#manifesto", label: "선언문" },
  { href: "#process", label: "프로세스" },
  { href: "#archive", label: "아카이브" },
  { href: "#log", label: "사용자 로그" },
  { href: "#access", label: "시작하기" },
];

const MARQUEE_PHRASES = [
  "완벽 거부",
  "DATA CORRUPTED",
  "노이즈는 사양이다",
  "ARTIFACT PRESERVED",
  "SIGNAL LOST",
  "결함이 진짜다",
  "ERROR IS A FEATURE",
  "무손실은 거짓말이다",
];

const MANIFESTO_ITEMS = [
  { n: "01", title: "무손실은 방부제다", desc: "아무것도 안 담는다. 아무것도 겪지 않는다." },
  { n: "02", title: "노이즈는 지문이다", desc: "두 개의 부식은 절대 같지 않다." },
  { n: "03", title: "결함은 증거다", desc: "이 파일이, 이 순간이 존재했다는 증거." },
];

const PROCESS_STEPS = [
  {
    code: "STEP_01",
    title: "UPLOAD · 업로드",
    desc: "원본 파일을 가져온다. 이 순간까지는 아직 완벽하다.",
    Icon: Terminal,
  },
  {
    code: "STEP_02",
    title: "CORRUPT · 부식",
    desc: "노이즈 밀도, 스캔라인 강도, 채널 붕괴량을 조절해 의도적으로 망가뜨린다.",
    Icon: Zap,
  },
  {
    code: "STEP_03",
    title: "EXPORT · 방출",
    desc: "다시는 원래대로 되돌릴 수 없는 파일을 손에 쥔다.",
    Icon: ArrowUpRight,
  },
];

const GALLERY = [
  {
    id: "1487058792275-0ad4aaf24ca7",
    alt: "어두운 방에서 코드 에디터 화면을 띄운 노트북",
    meta: "LOSS 38% · CH_SHIFT +2PX",
    aspect: "aspect-[3/4]",
  },
  {
    id: "1518770660439-4636190af475",
    alt: "초록빛 회로 기판을 클로즈업한 사진",
    meta: "LOSS 71% · SCANLINE ON",
    aspect: "aspect-square",
  },
  {
    id: "1462331940025-496dfbfc7564",
    alt: "은하수가 가득한 밤하늘",
    meta: "LOSS 12% · GRAIN HIGH",
    aspect: "aspect-[4/5]",
  },
  {
    id: "1531482615713-2afd69097998",
    alt: "네온 조명 아래 서 있는 남성의 인물 사진",
    meta: "LOSS 54% · HUE_DRIFT -6°",
    aspect: "aspect-[4/3]",
  },
  {
    id: "1483721310020-03333e577078",
    alt: "공연장에서 조명이 번지는 관중의 모습",
    meta: "LOSS 82% · CH_SHIFT +5PX",
    aspect: "aspect-square",
  },
  {
    id: "1526374965328-7f61d4dc18c5",
    alt: "초록색 코드가 흐르는 모니터 화면 클로즈업",
    meta: "LOSS 63% · SCANLINE ON",
    aspect: "aspect-[3/4]",
  },
];

const TESTIMONIALS = [
  {
    ts: "14:02:11",
    quote: "친구들이 다 이 사진 어디 필름으로 찍었냐고 물어봄.",
    cite: "@haeun_studio",
  },
  {
    ts: "03:47:59",
    quote: "룩북 전체를 여기서 부식시켰다. 브랜드 톤이 완전히 달라졌다.",
    cite: "VOID CLOTHING",
  },
  {
    ts: "21:15:32",
    quote: "노이즈가 이렇게 아름다울 수 있다는 걸 처음 알았다.",
    cite: "@noise.archive",
  },
  {
    ts: "09:58:03",
    quote: "매번 다른 방식으로 망가진다. 그게 핵심이다.",
    cite: "익명 사용자",
  },
];

const TIERS = [
  {
    code: "LOW_DECAY",
    title: "가벼운 부식",
    desc: "은은한 그레인과 스캔라인. 완벽함의 흔적만 지운다.",
    features: ["그레인 필름 노이즈", "스캔라인 10%", "채널 붕괴 없음"],
    Icon: Waves,
  },
  {
    code: "MID_DECAY",
    title: "중간 부식",
    desc: "채널이 어긋나고 압축 아티팩트가 선명해진다.",
    features: ["RGB 채널 붕괴", "스캔라인 40%", "압축 손실 시뮬레이션"],
    Icon: Zap,
  },
  {
    code: "FULL_COLLAPSE",
    title: "완전 붕괴",
    desc: "완전한 데이터모싱. 원본을 알아볼 수 없을 각오를 할 것.",
    features: ["프레임 데이터모싱", "신호 완전 손실", "복원 불가"],
    Icon: AlertTriangle,
  },
];

/* -------------------------------------------------------------------------
 * Landing
 * ---------------------------------------------------------------------- */
export default function F19Landing({ fontClass }: { fontClass: string }) {
  const reduced = useReducedMotionSafe();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "queued">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email) return;
    setStatus("queued");
    setEmail("");
  }

  const unsplashUrl = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

  return (
    <div className={`f19-page ${fontClass} font-[family-name:var(--font-glitch-display)]`}>
      <a href="#main" className="f19-skip-link">
        본문으로 건너뛰기
      </a>
      <div aria-hidden="true" className="f19-vignette" />
      <div aria-hidden="true" className="f19-scanlines" />
      <div aria-hidden="true" className="f19-noise" />

      {/* ------------------------------------------------------------- Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--f19-line)] bg-[var(--f19-bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#main" className="font-[family-name:var(--font-glitch-mono)] text-lg font-bold tracking-widest">
            <span className="f19-glitch-heading">BITROT</span>
          </a>
          <nav aria-label="주요 섹션" className="hidden md:block">
            <ul className="flex items-center gap-7 font-[family-name:var(--font-glitch-mono)] text-xs uppercase tracking-[0.15em] text-[var(--f19-fg-muted)]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-[var(--f19-cyan)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="#access"
            className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--f19-cyan)] px-4 py-2 font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.1em] text-[var(--f19-cyan)] transition-colors hover:bg-[var(--f19-cyan)] hover:text-[#07070a]"
          >
            부식 시작
            <ArrowRight aria-hidden="true" size={14} />
          </a>
        </div>
      </header>

      <main id="main">
        {/* ----------------------------------------------------------- Hero */}
        <section className="f19-grid-bg relative overflow-hidden px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="inline-flex items-center gap-2 border border-[var(--f19-yellow)] px-3 py-1 font-[family-name:var(--font-glitch-mono)] text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--f19-yellow)]">
                <AlertTriangle aria-hidden="true" size={13} />
                ERR_0x00F19 · 신호 손실 감지
              </p>

              <h1 className="f19-glitch-heading mt-6 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
                <GlitchHeading lines={["완벽한 사진은", "아무도 기억하지 못한다"]} />
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--f19-fg-muted)] md:text-lg">
                BITROT는 완벽한 디지털 파일을 의도적으로 부수는 데이터 부식 스튜디오입니다. 노이즈, 스캔라인,
                채널 붕괴 — 결함이 다시 진짜를 만듭니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#access"
                  className="inline-flex min-h-[44px] items-center gap-2 bg-[var(--f19-cyan)] px-6 py-3 font-[family-name:var(--font-glitch-mono)] text-sm font-bold uppercase tracking-[0.08em] text-[#07070a] transition-colors hover:bg-white"
                >
                  지금 부식시키기
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
                <a
                  href="#archive"
                  className="inline-flex min-h-[44px] items-center gap-2 border border-[var(--f19-fg-muted)] px-6 py-3 font-[family-name:var(--font-glitch-mono)] text-sm font-bold uppercase tracking-[0.08em] text-[var(--f19-fg)] transition-colors hover:border-[var(--f19-magenta)] hover:text-[var(--f19-magenta)]"
                >
                  부식 샘플 보기
                </a>
              </div>

              <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-[var(--f19-line)] pt-6 font-[family-name:var(--font-glitch-mono)] text-xs uppercase tracking-[0.08em] text-[var(--f19-fg-muted)]">
                <div>
                  <dt className="sr-only">누적 부식 파일 수</dt>
                  <dd>
                    <span className="text-[var(--f19-cyan)]">12,406</span> FILES CORRUPTED
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">손상률</dt>
                  <dd>
                    <span className="text-[var(--f19-magenta)]">100%</span> LOSS RATE
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">무손실 저장 건수</dt>
                  <dd>
                    무손실 저장 <span className="text-[var(--f19-fg)]">0건</span>
                  </dd>
                </div>
              </dl>
            </div>

            <motion.div {...riseIn(reduced, 0.1)} className="relative mx-auto aspect-[4/5] w-full max-w-md">
              <ArtifactImage
                src={unsplashUrl("1544005313-94ddf0286df2")}
                alt="따뜻한 스튜디오 조명 아래 카메라를 응시하는 여성의 인물 사진"
                sizes="(min-width: 1024px) 420px, 90vw"
                priority
                className="h-full w-full"
              />
              <p className="f19-terminal absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--f19-cyan)]">
                SUBJECT_01.RAW → CORRUPT.PENDING
              </p>
            </motion.div>
          </div>
        </section>

        {/* --------------------------------------------------------- Marquee */}
        <div className="f19-marquee border-y border-[var(--f19-line)] bg-[var(--f19-bg-raised)] py-4" aria-hidden="true">
          <div className="f19-marquee-track font-[family-name:var(--font-glitch-mono)] text-sm uppercase tracking-[0.15em] text-[var(--f19-fg-muted)]">
            {[0, 1].map((rep) => (
              <span key={rep} className="flex shrink-0 items-center gap-10">
                {MARQUEE_PHRASES.map((phrase, i) => (
                  <span key={`${rep}-${i}`} className="flex items-center gap-10">
                    <span>{phrase}</span>
                    <span className="text-[var(--f19-magenta)]">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- Manifesto */}
        <section id="manifesto" className="f19-grid-bg px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-yellow)]"
            >
              MANIFESTO // 선언문
            </motion.p>
            <motion.h2 {...riseIn(reduced, 0.05)} className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              완벽은, 방부제다
            </motion.h2>
            <motion.p
              {...riseIn(reduced, 0.1)}
              className="mt-8 max-w-3xl text-xl font-medium leading-relaxed text-[var(--f19-fg)] md:text-2xl"
            >
              우리는 무손실을 믿지 않는다. 완벽한 파일은 아무 일도 겪지 않은 파일이다. 픽셀이 깨지고, 프레임이
              밀리고, 색이 어긋나는 순간—그 데이터는 비로소 무언가를 <span className="text-[var(--f19-cyan)]">겪은</span>{" "}
              것이 된다.
            </motion.p>

            <div className="mt-14 grid gap-8 border-t border-[var(--f19-line)] pt-10 sm:grid-cols-3">
              {MANIFESTO_ITEMS.map((item, i) => (
                <motion.div key={item.n} {...riseIn(reduced, 0.1 + i * 0.08)}>
                  <p className="font-[family-name:var(--font-glitch-mono)] text-sm text-[var(--f19-magenta)]">{item.n}</p>
                  <h3 className="mt-2 text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--f19-fg-muted)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- Process */}
        <section id="process" className="border-t border-[var(--f19-line)] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-yellow)]"
            >
              PROCESS_LOG // 부식의 3단계
            </motion.p>
            <motion.h2 {...riseIn(reduced, 0.05)} className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              어떻게 망가뜨리는가
            </motion.h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {PROCESS_STEPS.map((step, i) => (
                <motion.article
                  key={step.code}
                  {...riseIn(reduced, 0.1 + i * 0.08)}
                  className="f19-terminal f19-brackets p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--f19-fg-muted)]">
                      {step.code}
                    </span>
                    <step.Icon aria-hidden="true" size={18} className="text-[var(--f19-cyan)]" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--f19-fg-muted)]">{step.desc}</p>
                </motion.article>
              ))}
            </div>

            {/* Before / after comparison */}
            <div className="mt-16 border-t border-[var(--f19-line)] pt-12">
              <motion.h3
                {...riseIn(reduced)}
                className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-magenta)]"
              >
                BEFORE_AFTER // 부식 전후 비교
              </motion.h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <motion.figure {...riseIn(reduced, 0.05)} className="f19-brackets relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={unsplashUrl("1522075469751-3a6694fb2f61")}
                    alt="야외에서 자연스럽게 웃고 있는 여성의 원본 인물 사진"
                    fill
                    sizes="(min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-[var(--f19-bg)]/80 px-4 py-2 font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--f19-fg-muted)]">
                    ORIGINAL.RAW · 손상 없음
                  </figcaption>
                </motion.figure>
                <motion.figure {...riseIn(reduced, 0.1)} className="f19-brackets relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={unsplashUrl("1522075469751-3a6694fb2f61")}
                    alt="동일한 인물 사진에 색상 채널 어긋남과 스캔라인 노이즈를 의도적으로 적용해 손상시킨 결과"
                    fill
                    sizes="(min-width: 640px) 45vw, 90vw"
                    className="f19-corrupted-media object-cover"
                  />
                  <div aria-hidden="true" className="f19-scanlines absolute inset-0 opacity-60" />
                  <figcaption className="absolute bottom-0 left-0 right-0 bg-[var(--f19-bg)]/80 px-4 py-2 font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.1em] text-[var(--f19-cyan)]">
                    BITROT_OUTPUT.CRPT · LOSS 58%
                  </figcaption>
                </motion.figure>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- Archive */}
        <section id="archive" className="f19-grid-bg border-t border-[var(--f19-line)] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-yellow)]"
            >
              ARTIFACT_ARCHIVE // 부식된 결과물
            </motion.p>
            <motion.h2 {...riseIn(reduced, 0.05)} className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              아카이브에서 신호를 확인하라
            </motion.h2>
            <motion.p {...riseIn(reduced, 0.1)} className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--f19-fg-muted)] md:text-base">
              마우스를 올리면 채널이 어긋난다. 모든 파일은 서로 다른 방식으로 망가졌다.
            </motion.p>

            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
              {GALLERY.map((item, i) => (
                <motion.figure key={item.id} {...riseIn(reduced, 0.05 + (i % 3) * 0.06)} className={`relative ${item.aspect}`}>
                  <ArtifactImage
                    src={unsplashUrl(item.id)}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 90vw"
                    className="h-full w-full"
                  />
                  <figcaption className="absolute bottom-0 left-0 right-0 z-10 bg-[var(--f19-bg)]/80 px-3 py-2 font-[family-name:var(--font-glitch-mono)] text-[10px] uppercase tracking-[0.08em] text-[var(--f19-fg-muted)]">
                    {item.meta}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- User log */}
        <section id="log" className="border-t border-[var(--f19-line)] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-yellow)]"
            >
              USER_LOG // 실사용 기록
            </motion.p>
            <motion.h2 {...riseIn(reduced, 0.05)} className="mt-4 text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              부식을 겪은 사람들
            </motion.h2>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              {TESTIMONIALS.map((t, i) => (
                <motion.blockquote
                  key={t.cite}
                  {...riseIn(reduced, 0.05 + i * 0.06)}
                  className="f19-terminal p-6 font-[family-name:var(--font-glitch-mono)]"
                >
                  <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--f19-cyan)]">
                    <Terminal aria-hidden="true" size={12} className="mr-1.5 inline" />
                    [{t.ts}] EXPORT_OK
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--f19-fg)]">“{t.quote}”</p>
                  <footer className="mt-3 text-[11px] uppercase tracking-[0.08em] text-[var(--f19-fg-muted)]">— {t.cite}</footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ Access */}
        <section id="access" className="f19-grid-bg border-t border-[var(--f19-line)] px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-6xl">
            <motion.p
              {...riseIn(reduced)}
              className="font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.25em] text-[var(--f19-yellow)]"
            >
              ACCESS // 시작하기
            </motion.p>
            <motion.h2 {...riseIn(reduced, 0.05)} className="mt-4 max-w-2xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              당신의 완벽함을, 오늘 부숴드립니다
            </motion.h2>
            <motion.p {...riseIn(reduced, 0.1)} className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--f19-fg-muted)] md:text-base">
              세 가지 부식 강도 중 하나를 고르세요. 되돌릴 수 없다는 점이 유일한 공통점입니다.
            </motion.p>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {TIERS.map((tier, i) => (
                <motion.article key={tier.code} {...riseIn(reduced, 0.05 + i * 0.08)} className="f19-terminal f19-brackets flex flex-col p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--f19-magenta)]">
                      {tier.code}
                    </span>
                    <tier.Icon aria-hidden="true" size={18} className="text-[var(--f19-cyan)]" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">{tier.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--f19-fg-muted)]">{tier.desc}</p>
                  <ul className="mt-5 flex-1 space-y-2 font-[family-name:var(--font-glitch-mono)] text-xs uppercase tracking-[0.05em] text-[var(--f19-fg-muted)]">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <span aria-hidden="true" className="text-[var(--f19-cyan)]">
                          ▸
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#waitlist-form"
                    className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 border border-[var(--f19-fg-muted)] px-4 py-2 font-[family-name:var(--font-glitch-mono)] text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:border-[var(--f19-cyan)] hover:text-[var(--f19-cyan)]"
                  >
                    이 강도로 시작
                    <ArrowRight aria-hidden="true" size={14} />
                  </a>
                </motion.article>
              ))}
            </div>

            <motion.div {...riseIn(reduced, 0.1)} id="waitlist-form" className="f19-terminal mt-14 max-w-xl scroll-mt-24 p-7">
              <p className="flex items-center gap-2 font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.15em] text-[var(--f19-yellow)]">
                <Radio aria-hidden="true" size={14} />
                얼리 액세스 신호 등록
              </p>
              <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <label htmlFor="f19-email" className="sr-only">
                    이메일 주소
                  </label>
                  <input
                    id="f19-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full min-h-[44px] border border-[var(--f19-line)] bg-[var(--f19-bg)] px-4 py-3 font-[family-name:var(--font-glitch-mono)] text-sm text-[var(--f19-fg)] placeholder:text-[var(--f19-fg-muted)] focus-visible:border-[var(--f19-cyan)]"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 bg-[var(--f19-cyan)] px-6 py-3 font-[family-name:var(--font-glitch-mono)] text-sm font-bold uppercase tracking-[0.08em] text-[#07070a] transition-colors hover:bg-white"
                >
                  신호 등록
                  <Binary aria-hidden="true" size={16} />
                </button>
              </form>
              <p aria-live="polite" className="mt-3 min-h-[1.25rem] font-[family-name:var(--font-glitch-mono)] text-xs uppercase tracking-[0.08em] text-[var(--f19-cyan)]">
                {status === "queued" ? "SIGNAL_QUEUED · 목록에 추가되었습니다" : ""}
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ------------------------------------------------------------ Footer */}
      <footer className="border-t border-[var(--f19-line)] px-5 py-12 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-[family-name:var(--font-glitch-mono)] text-lg font-bold tracking-widest">
              <span className="f19-glitch-heading">BITROT</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-[var(--f19-fg-muted)]">완벽을 거부하는 데이터 부식 스튜디오.</p>
          </div>
          <nav aria-label="바닥글 섹션">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-glitch-mono)] text-xs uppercase tracking-[0.1em] text-[var(--f19-fg-muted)]">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-[var(--f19-cyan)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-[var(--f19-line)] pt-6 font-[family-name:var(--font-glitch-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--f19-fg-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>BUILD 0x19F3A2 · COMPILED WITH INTENTIONAL ERRORS</p>
          <p>© 2026 BITROT LAB. ALL SIGNALS DEGRADED.</p>
        </div>
      </footer>
    </div>
  );
}
