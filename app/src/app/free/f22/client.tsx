"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Fingerprint,
  Mail,
  MapPin,
  Pause,
  Play,
  Quote,
  ScrollText,
  Search,
  Send,
  Stamp,
  User,
} from "lucide-react";
import "./f22.css";

/* ------------------------------------------------------------------------
 * prefers-reduced-motion — matchMedia를 useSyncExternalStore로 직접 구독한다.
 * framer-motion의 useReducedMotion()이 이 환경에서 OS 설정을 못 잡는 경우가
 * 있어, 초기값은 항상 "허용"으로 시작하고 reduce=true가 확인되는 즉시
 * 정적 최종 상태로 전환한다 (opacity:0 잔류 버그 원천 차단).
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
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* 진입 리빌 — reduce가 확인되면 framer-motion을 아예 거치지 않고 최종
 * 상태 그대로 렌더한다. transform/opacity만 사용(레이아웃 트리거 없음). */
function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
}) {
  const reduced = usePrefersReducedMotion();
  if (reduced) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* 사건 파일 섹션 목록 — 스크롤 스파이 내비게이션용 */
const SECTIONS = [
  { id: "prologue", label: "01 사건개요" },
  { id: "evidence", label: "02 증거물" },
  { id: "suspects", label: "03 용의자" },
  { id: "verdict", label: "04 판결" },
  { id: "join", label: "05 임관신청" },
] as const;

function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    for (const section of SECTIONS) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

/* 증거물 사이를 잇는 붉은 실 — 순수 장식(aria-hidden), stroke-dashoffset만
 * 애니메이션한다. reduce 시 즉시 완성된 선으로 렌더. */
function RedString() {
  const reduced = usePrefersReducedMotion();
  return (
    <svg
      className="f22-string pointer-events-none absolute inset-0 -z-10 hidden h-full w-full md:block"
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M 12 8 L 38 30 L 62 6 L 88 32"
        fill="none"
        stroke="var(--blood)"
        strokeWidth="0.35"
        strokeLinecap="round"
        initial={reduced ? undefined : { pathLength: 0, opacity: 0.9 }}
        whileInView={reduced ? undefined : { pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

/* 속보 티커 — 무한 반복 애니메이션이라 M04 규정상 정지 컨트롤 필수 */
function Ticker() {
  const [paused, setPaused] = useState(false);
  const text =
    "속보 — 원산지 정보 전면 삭제 확인 · 이번 달 사건 정답률 34% · 재수사 신청 폭주 중 · 커핑 노트 위조 의혹 없음 확인 ";
  return (
    <div
      className="f22-ticker flex items-center gap-3 border-y border-[color:var(--line)] bg-[color:var(--ink-2)] py-2"
      data-paused={paused ? "true" : "false"}
    >
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="ml-4 flex min-h-11 shrink-0 items-center gap-1.5 rounded border border-[color:var(--line)] px-3 text-[11px] uppercase tracking-wide text-[color:var(--paper-dim)] transition-colors hover:border-[color:var(--blood-light)] hover:text-[color:var(--paper)]"
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        {paused ? "재생" : "정지"}
      </button>
      <div className="f22-ticker-viewport flex-1">
        <div className="f22-ticker-track f22-type text-xs tracking-wide text-[color:var(--paper-dim)]">
          <span className="px-4">{text}</span>
          <span className="px-4" aria-hidden="true">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}

/* 봉인된 증거 카드 — 네이티브 details/summary라 키보드·스크린리더 기본 지원 */
function EvidenceCard({
  exhibit,
  title,
  redacted,
  reveal,
}: {
  exhibit: string;
  title: string;
  redacted: string;
  reveal: string;
}) {
  return (
    <details className="f22-evidence f22-torn-top relative rounded-sm bg-[color:var(--paper)] p-5 text-[color:var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.45)]">
      <div className="f22-pin absolute left-1/2 -translate-x-1/2" aria-hidden="true" />
      <summary className="f22-type flex flex-col gap-1 pt-1 text-sm">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[color:var(--blood-dark)]">
          {exhibit}
        </span>
        <span className="f22-display text-xl tracking-wide">{title}</span>
        <span className="mt-1 inline-block w-fit rounded-sm bg-[color:var(--ink)] px-2 py-1 text-[13px] text-[color:var(--paper)]">
          {redacted}
        </span>
      </summary>
      <div className="f22-reveal">
        <div className="f22-reveal-inner">
          <p className="f22-type pt-3 text-[13.5px] leading-relaxed text-[color:var(--ink-2)]">
            {reveal}
          </p>
        </div>
      </div>
    </details>
  );
}

const EVIDENCE = [
  {
    exhibit: "EXHIBIT A",
    title: "로스팅 프로필",
    redacted: "▓▓▓▓▓▓▓▓▓▓▓▓",
    reveal:
      "다크도, 라이트도 아니다. 산미가 완전히 죽기 직전에 원두를 꺼낸다. 담당 로스터는 이 지점을 '경계선'이라 부른다.",
  },
  {
    exhibit: "EXHIBIT B",
    title: "커핑 노트",
    redacted: "향미 프로필 봉인됨",
    reveal:
      "베리류 산미, 다크초콜릿의 여운, 홍차를 닮은 바디감. 세 단서 중 둘은 진짜고 하나는 함정이다.",
  },
  {
    exhibit: "EXHIBIT C",
    title: "재배 고도",
    redacted: "해발 ▓,▓▓▓m 추정",
    reveal:
      "해발 1,850m 이상. 이 고도의 밤낮 일교차가 콩의 밀도를 바꾸고, 그 밀도가 오늘 당신이 느낀 또렷한 산미를 만든다.",
  },
  {
    exhibit: "EXHIBIT D",
    title: "포장 마감 시각",
    redacted: "발송 ▓일 전 로스팅",
    reveal:
      "로스팅 후 정확히 5일. 그 이상도 이하도 용납하지 않는다 — 원두가 가장 순순히 말을 듣는 유일한 시점.",
  },
];

const SUSPECTS = [
  {
    no: "07-A",
    name: "에티오피아 예가체프",
    charge: "자스민 향으로 미각 현혹, 베르가못 산미 과다 소지",
    swatch: "#e9b64f",
  },
  {
    no: "07-B",
    name: "콜롬비아 우일라",
    charge: "카라멜 단맛 은닉, 균형감 위장 혐의",
    swatch: "#c9773a",
  },
  {
    no: "07-C",
    name: "케냐 AA",
    charge: "블랙커런트 산미 흉기 사용, 와인 같은 바디 과시",
    swatch: "#9b2c3b",
  },
  {
    no: "07-D",
    name: "과테말라 안티구아",
    charge: "초콜릿 노트로 침묵 유도, 스모키 향 잔류",
    swatch: "#6b4a35",
  },
  {
    no: "07-E",
    name: "인도네시아 만델링",
    charge: "묵직한 바디로 도주, 흙내음 알리바이 불충분",
    swatch: "#4a4034",
  },
];

const VERDICTS = [
  {
    name: "김OO · 자칭 아마추어 큐레이터",
    quote:
      "3주 내내 매일 다른 답을 냈다. 4주 차에 정확히 맞혔다. 유죄 — 아니, 유능함을 인정한다.",
    stamp: "SOLVED",
  },
  {
    name: "박OO · 야근하는 회사원",
    quote: "정답은 못 맞혔지만 커피는 매번 옳았다. 이의 없음.",
    stamp: "CASE CLOSED",
  },
  {
    name: "이OO · 작은 카페 사장",
    quote:
      "손님들에게 몰래 시켰다가 전부 들켰다. 이 원두, 자백을 유도하는 재주가 있다.",
    stamp: "RE-OPENED",
  },
];

const TIERS = [
  {
    name: "수습요원",
    en: "TRAINEE",
    price: "19,800",
    unit: "원 / 월",
    features: ["매달 미제사건 원두 1종 · 1봉", "커핑 노트 카드 동봉", "다음 달 정답 공개 알림"],
    featured: false,
  },
  {
    name: "정식 수사관",
    en: "DETECTIVE",
    price: "34,900",
    unit: "원 / 월",
    features: [
      "서로 다른 사건 원두 2종 동시 수사",
      "시즌 한정 사건 파일 우선 배송",
      "커뮤니티 정답률 랭킹 등록",
    ],
    featured: true,
  },
  {
    name: "수석 수사관",
    en: "CHIEF INSPECTOR",
    price: "64,000",
    unit: "원 / 월",
    features: [
      "희귀 마이크로랏 사건 전담",
      "로스터 육필 노트 카드 동봉",
      "연 1회 미해결 원두 재수사 키트",
    ],
    featured: false,
  },
];

export default function F22Landing({
  bebasClass,
  eliteClass,
  gothicClass,
}: {
  bebasClass: string;
  eliteClass: string;
  gothicClass: string;
}) {
  const active = useActiveSection();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);
  const formId = useId();

  return (
    <div className={`f22 ${bebasClass} ${eliteClass} ${gothicClass} min-h-screen`}>
      <a
        href="#main"
        className="f22-type absolute left-2 top-2 z-50 -translate-y-20 rounded bg-[color:var(--blood)] px-4 py-2 text-sm text-[color:var(--paper)] transition-transform focus:translate-y-0"
      >
        본문으로 건너뛰기
      </a>

      {/* -------------------------------------------------- HEADER -------- */}
      <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[color:var(--ink)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#hero" className="f22-display flex items-center gap-2 text-xl tracking-wide sm:text-2xl">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[color:var(--blood)] text-[color:var(--blood-light)]"
              aria-hidden="true"
            >
              <Search className="h-4 w-4" />
            </span>
            DOSSIER<span className="text-[color:var(--blood-light)]">.</span>
          </a>
          <a
            href="#join"
            className="f22-type rounded-sm border border-[color:var(--blood)] bg-[color:var(--blood)] px-3 py-2 text-xs uppercase tracking-wide text-[color:var(--paper)] transition-colors hover:bg-[color:var(--blood-dark)] sm:px-4 sm:text-sm"
          >
            임관 신청
          </a>
        </div>
        <nav aria-label="사건 파일 목차" className="border-t border-[color:var(--line)]">
          <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 py-1.5 sm:px-6">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  aria-current={active === s.id ? "location" : undefined}
                  className={`f22-type inline-flex min-h-11 items-center rounded-t-sm border-t-2 px-3 text-[11px] uppercase tracking-wide transition-colors sm:text-xs ${
                    active === s.id
                      ? "border-[color:var(--blood-light)] bg-[color:var(--ink-2)] text-[color:var(--paper)]"
                      : "border-transparent text-[color:var(--paper-dim)] hover:text-[color:var(--paper)]"
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main">
        {/* ------------------------------------------------ HERO -------- */}
        <div id="hero" ref={heroRef} className="relative flex min-h-[92vh] items-end overflow-hidden">
          <motion.div className="absolute inset-0 -z-10" style={{ y: heroY, opacity: heroOpacity }}>
            <Image
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1920&auto=format&fit=crop"
              alt="어두운 조명 아래 클로즈업된 로스팅 커피 원두 더미"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--ink)] via-[color:var(--ink)]/60 to-[color:var(--ink)]/20" />
          </motion.div>

          <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24">
            <Reveal>
              <span className="f22-stamp f22-type inline-flex text-xs text-[color:var(--blood-light)] sm:text-sm">
                <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
                CASE No. 07 · 미해결
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="f22-display mt-5 max-w-4xl text-[13vw] leading-[0.92] text-[color:var(--paper)] sm:text-7xl md:text-8xl">
                THE ORIGIN
                <br />
                IS MISSING.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--paper-dim)] sm:text-lg">
                매달 도착하는 로스팅 원두, 산지 정보는 전부 삭제됐다. 남은 건 향과 산미와
                바디감뿐. 당신의 혀로 이 사건을 종결하라 — <strong className="text-[color:var(--paper)]">DOSSIER.</strong>
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#join"
                  className="f22-type inline-flex items-center gap-2 rounded-sm bg-[color:var(--blood)] px-6 py-3.5 text-sm uppercase tracking-wide text-[color:var(--paper)] transition-colors hover:bg-[color:var(--blood-dark)]"
                >
                  수사 시작 — 구독 신청
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href="#prologue"
                  className="f22-type inline-flex items-center gap-2 text-sm uppercase tracking-wide text-[color:var(--paper-dim)] transition-colors hover:text-[color:var(--paper)]"
                >
                  사건 파일 열람
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <Ticker />

        {/* --------------------------------------------- PROLOGUE ------- */}
        <section id="prologue" className="f22-section bg-[color:var(--ink)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f22-type text-xs uppercase tracking-[0.2em] text-[color:var(--blood-light)]">
                01 · 사건 개요
              </p>
              <h2 className="f22-display mt-3 text-4xl text-[color:var(--paper)] sm:text-5xl">
                수사 기록 열람
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <Reveal className="f22-type space-y-4 rounded-sm border border-[color:var(--line)] bg-[color:var(--ink-2)] p-6 text-sm text-[color:var(--paper-dim)]">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                  <dt className="text-[color:var(--paper-dim)]/70">사건번호</dt>
                  <dd className="text-[color:var(--paper)]">No. 07-2607</dd>
                  <dt className="text-[color:var(--paper-dim)]/70">발생 장소</dt>
                  <dd className="text-[color:var(--paper)]">정체불명의 고지대 (비공개)</dd>
                  <dt className="text-[color:var(--paper-dim)]/70">피해자</dt>
                  <dd className="text-[color:var(--paper)]">각성이 필요한 당신의 아침</dd>
                  <dt className="text-[color:var(--paper-dim)]/70">용의자</dt>
                  <dd className="text-[color:var(--paper)]">미상의 원두 (매달 교체)</dd>
                  <dt className="text-[color:var(--paper-dim)]/70">담당 수사관</dt>
                  <dd className="text-[color:var(--paper)]">당신 (구독자)</dd>
                </dl>
              </Reveal>
              <Reveal delay={0.1} className="flex flex-col justify-center gap-5">
                <p className="text-lg leading-relaxed text-[color:var(--paper-dim)] sm:text-xl">
                  매달, 원산지·농장·고도가 전부 지워진 원두 한 봉지가 도착한다. 라벨엔
                  사건번호만 찍혀 있다. 남은 단서는 오직 커핑 노트와 향과 맛뿐 —
                  <span className="text-[color:var(--paper)]"> 나머지는 당신이 추리해야 한다.</span>
                </p>
                <p className="text-sm leading-relaxed text-[color:var(--paper-dim)]/80">
                  정답은 다음 달 첫 배송과 함께 공개된다. 커뮤니티 정답률은 평균 34% —
                  이 사건, 생각보다 만만치 않다.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* --------------------------------------------- EVIDENCE -------- */}
        <section id="evidence" className="f22-section relative bg-[color:var(--ink-2)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f22-type text-xs uppercase tracking-[0.2em] text-[color:var(--blood-light)]">
                02 · 증거물
              </p>
              <h2 className="f22-display mt-3 text-4xl text-[color:var(--paper)] sm:text-5xl">
                수사 보드
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                각 증거는 봉인되어 있다. 클릭(또는 Enter)으로 열람하라 — 모든 단서를
                모으면 정체가 드러난다.
              </p>
            </Reveal>

            <div className="relative mt-12 grid gap-x-8 gap-y-14 pt-6 sm:grid-cols-2">
              <RedString />
              {EVIDENCE.map((ev, i) => (
                <Reveal key={ev.exhibit} delay={i * 0.06}>
                  <EvidenceCard {...ev} />
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-14 grid gap-6 sm:grid-cols-[1.3fr_1fr] sm:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[color:var(--line)]">
                <Image
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1400&auto=format&fit=crop"
                  alt="커핑 스푼과 원두가 놓인 수사 테이블, 위에서 내려다본 모습"
                  fill
                  sizes="(min-width: 640px) 55vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
                <span className="f22-type absolute bottom-3 left-3 rounded-sm bg-[color:var(--ink)]/85 px-2.5 py-1 text-[11px] uppercase tracking-wide text-[color:var(--blood-light)]">
                  Exhibit E · 현장 사진
                </span>
              </div>
              <div className="f22-type space-y-3 text-sm text-[color:var(--paper-dim)]">
                <p>
                  현장에는 스푼 여섯 개, 뜨거운 물, 그리고 침묵뿐이었다. 세 번째
                  테이스팅에서 산미가 확 트였다 — 이건 우연이 아니다.
                </p>
                <p className="text-[color:var(--paper)]/90">
                  참고인 진술: &ldquo;홍차 같기도, 와인 같기도 했다. 결론은 못 내렸다.&rdquo;
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --------------------------------------------- SUSPECTS -------- */}
        <section id="suspects" className="f22-section bg-[color:var(--ink)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f22-type text-xs uppercase tracking-[0.2em] text-[color:var(--blood-light)]">
                03 · 용의자 라인업
              </p>
              <h2 className="f22-display mt-3 text-4xl text-[color:var(--paper)] sm:text-5xl">
                원산지 다섯 용의자
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                이번 달 진범은 하나다. 나머지 넷은 무고하다 — 아마도.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {SUSPECTS.map((s) => (
                <Reveal key={s.no} className="h-full">
                  <li className="f22-ruler-bg relative flex h-full flex-col gap-3 overflow-hidden rounded-sm border border-[color:var(--line)] bg-[color:var(--ink-3)] p-4">
                    <div className="flex items-center justify-between">
                      <span className="f22-type text-[11px] text-[color:var(--paper-dim)]">
                        No. {s.no}
                      </span>
                      <Fingerprint className="h-4 w-4 text-[color:var(--paper-dim)]/60" aria-hidden="true" />
                    </div>
                    <span
                      className="h-2.5 w-10 rounded-full"
                      style={{ backgroundColor: s.swatch }}
                      aria-hidden="true"
                    />
                    <h3 className="f22-display text-xl leading-tight text-[color:var(--paper)]">
                      {s.name}
                    </h3>
                    <p className="f22-type flex items-start gap-1.5 text-[12.5px] leading-snug text-[color:var(--paper-dim)]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--blood-light)]" aria-hidden="true" />
                      <span>
                        <span className="text-[color:var(--blood-light)]">혐의 · </span>
                        {s.charge}
                      </span>
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------- VERDICT --------- */}
        <section id="verdict" className="f22-section bg-[color:var(--ink-2)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f22-type text-xs uppercase tracking-[0.2em] text-[color:var(--blood-light)]">
                04 · 판결
              </p>
              <h2 className="f22-display mt-3 text-4xl text-[color:var(--paper)] sm:text-5xl">
                종결된 사건들
              </h2>
            </Reveal>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {VERDICTS.map((v, i) => (
                <Reveal key={v.name} delay={i * 0.08} className="h-full">
                  <li className="f22-torn-top relative flex h-full flex-col gap-4 rounded-sm bg-[color:var(--paper)] p-6 text-[color:var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.4)]">
                    <Quote className="h-6 w-6 text-[color:var(--blood-dark)]/70" aria-hidden="true" />
                    <p className="f22-type flex-1 text-[15px] leading-relaxed">{v.quote}</p>
                    <div className="flex items-center justify-between border-t border-[color:var(--ink)]/10 pt-3">
                      <span className="text-xs text-[color:var(--ink)]/70">{v.name}</span>
                      <span className="f22-stamp f22-type text-[10px] text-[color:var(--blood-dark)]">
                        <Stamp className="h-3 w-3" aria-hidden="true" />
                        {v.stamp}
                      </span>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* --------------------------------------------- JOIN ------------ */}
        <section id="join" className="f22-section bg-[color:var(--ink)] py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="f22-type text-xs uppercase tracking-[0.2em] text-[color:var(--blood-light)]">
                05 · 임관 신청
              </p>
              <h2 className="f22-display mt-3 text-4xl text-[color:var(--paper)] sm:text-5xl">
                수사국에 합류하라
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-[color:var(--paper-dim)]">
                매달 새 사건이 도착한다. 계급을 고르고, 오늘부터 요원이 된다.
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-6 lg:grid-cols-3">
              {TIERS.map((t) => (
                <Reveal key={t.en} className="h-full">
                  <li
                    className={`relative flex h-full flex-col gap-5 rounded-sm border p-6 ${
                      t.featured
                        ? "border-[color:var(--blood)] bg-[color:var(--ink-3)]"
                        : "border-[color:var(--line)] bg-[color:var(--ink-2)]"
                    }`}
                  >
                    {t.featured && (
                      <span className="f22-type absolute -top-3 left-6 rounded-sm bg-[color:var(--blood)] px-2.5 py-1 text-[10px] uppercase tracking-wide text-[color:var(--paper)]">
                        가장 많은 요원이 선택
                      </span>
                    )}
                    <div>
                      <p className="f22-type text-[11px] uppercase tracking-[0.15em] text-[color:var(--paper-dim)]">
                        {t.en}
                      </p>
                      <h3 className="f22-display mt-1 text-2xl text-[color:var(--paper)]">{t.name}</h3>
                    </div>
                    <p className="text-[color:var(--paper)]">
                      <span className="f22-display text-3xl">{t.price}</span>
                      <span className="ml-1 text-sm text-[color:var(--paper-dim)]">{t.unit}</span>
                    </p>
                    <ul className="flex-1 space-y-2.5">
                      {t.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-[color:var(--paper-dim)]">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--blood-light)]" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#intake"
                      className={`f22-type inline-flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm uppercase tracking-wide transition-colors ${
                        t.featured
                          ? "bg-[color:var(--blood)] text-[color:var(--paper)] hover:bg-[color:var(--blood-dark)]"
                          : "border border-[color:var(--line)] text-[color:var(--paper)] hover:border-[color:var(--blood-light)]"
                      }`}
                    >
                      임관 신청
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                </Reveal>
              ))}
            </ul>

            {/* ------------------------------------------- INTAKE FORM --- */}
            <Reveal delay={0.1} id="intake" className="mt-16 scroll-mt-24">
              <IntakeForm formId={formId} />
            </Reveal>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------- FOOTER -------- */}
      <footer className="border-t border-[color:var(--line)] bg-[color:var(--ink-2)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <p className="f22-display text-xl text-[color:var(--paper)]">
                DOSSIER<span className="text-[color:var(--blood-light)]">.</span>
              </p>
              <p className="f22-type mt-2 max-w-xs text-xs leading-relaxed text-[color:var(--paper-dim)]">
                미제사건 원두 수사국. 매달 하나의 사건, 하나의 정답.
              </p>
            </div>
            <nav aria-label="바닥글" className="flex flex-wrap gap-x-8 gap-y-3">
              <ul className="f22-type flex flex-col gap-2 text-xs text-[color:var(--paper-dim)]">
                <li>
                  <a href="#evidence" className="transition-colors hover:text-[color:var(--paper)]">
                    증거물
                  </a>
                </li>
                <li>
                  <a href="#suspects" className="transition-colors hover:text-[color:var(--paper)]">
                    용의자
                  </a>
                </li>
                <li>
                  <a href="#join" className="transition-colors hover:text-[color:var(--paper)]">
                    임관 신청
                  </a>
                </li>
              </ul>
              <ul className="f22-type flex flex-col gap-2 text-xs text-[color:var(--paper-dim)]">
                <li>
                  <a href="#" className="transition-colors hover:text-[color:var(--paper)]">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-[color:var(--paper)]">
                    Threads
                  </a>
                </li>
              </ul>
            </nav>
            <span className="f22-stamp f22-type h-fit text-[10px] text-[#8fae7a]">
              STATUS: ACTIVE
            </span>
          </div>
          <p className="f22-type mt-8 border-t border-[color:var(--line)] pt-6 text-[11px] text-[color:var(--paper-dim)]/70">
            © 2026 DOSSIER COFFEE INVESTIGATION BUREAU. 모든 사건은 허구이며 실존 인물·카페와
            무관합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
function IntakeForm({ formId }: { formId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const consentId = `${formId}-consent`;
  const statusId = `${formId}-status`;

  return (
    <div className="rounded-sm border border-[color:var(--line)] bg-[color:var(--ink-2)] p-6 sm:p-8">
      <h3 className="f22-display text-2xl text-[color:var(--paper)]">사건 파일에 등록하기</h3>
      <p className="f22-type mt-2 text-sm text-[color:var(--paper-dim)]">
        코드네임과 이메일을 남기면, 새 사건이 열릴 때마다 가장 먼저 통지한다.
      </p>
      <form
        className="mt-6 grid gap-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor={nameId} className="f22-type text-xs uppercase tracking-wide text-[color:var(--paper-dim)]">
            코드네임 (이름)
          </label>
          <div className="flex items-center gap-2 rounded-sm border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2.5 focus-within:border-[color:var(--blood-light)]">
            <User className="h-4 w-4 shrink-0 text-[color:var(--paper-dim)]" aria-hidden="true" />
            <input
              id={nameId}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="예: 요원 K"
              className="w-full bg-transparent text-sm text-[color:var(--paper)] outline-none placeholder:text-[color:var(--paper-dim)]/50"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={emailId} className="f22-type text-xs uppercase tracking-wide text-[color:var(--paper-dim)]">
            이메일
          </label>
          <div className="flex items-center gap-2 rounded-sm border border-[color:var(--line)] bg-[color:var(--ink)] px-3 py-2.5 focus-within:border-[color:var(--blood-light)]">
            <Mail className="h-4 w-4 shrink-0 text-[color:var(--paper-dim)]" aria-hidden="true" />
            <input
              id={emailId}
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="agent@example.com"
              className="w-full bg-transparent text-sm text-[color:var(--paper)] outline-none placeholder:text-[color:var(--paper-dim)]/50"
            />
          </div>
        </div>
        <div className="flex items-start gap-2.5 sm:col-span-2">
          <input
            id={consentId}
            name="consent"
            type="checkbox"
            required
            className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-[color:var(--blood)]"
          />
          <label htmlFor={consentId} className="f22-type text-xs leading-relaxed text-[color:var(--paper-dim)]">
            새 사건 알림 수신에 동의합니다. 언제든 수신을 거부할 수 있습니다.
          </label>
        </div>
        <div className="sm:col-span-2">
          <button
            type="submit"
            className="f22-type inline-flex items-center justify-center gap-2 rounded-sm bg-[color:var(--blood)] px-6 py-3 text-sm uppercase tracking-wide text-[color:var(--paper)] transition-colors hover:bg-[color:var(--blood-dark)]"
          >
            제보 접수
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <p id={statusId} role="status" aria-live="polite" className="f22-type text-xs text-[#8fae7a] sm:col-span-2">
          {submitted ? "접수 완료 — 다음 사건이 열리면 가장 먼저 연락한다." : ""}
        </p>
      </form>
    </div>
  );
}
