"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { JetBrains_Mono } from "next/font/google";
import { Bold, Italic, Underline, ArrowDown, Check } from "lucide-react";
import styles from "./f6.module.css";

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/* ---------------------------------------------------------
 * prefers-reduced-motion — matchMedia 구독을 useSyncExternalStore로
 * 직접 처리한다. framer-motion 내장 useReducedMotion()이 이 환경에서
 * OS 설정을 못 잡아 초기 opacity:0가 영구히 남는 버그를 피하기 위해,
 * reduced일 때는 애니메이션 자체를 아예 설정하지 않는다(최종 상태 즉시 렌더).
 * --------------------------------------------------------- */
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
function useReducedMotionSafe() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotionSafe();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35, ease: "linear", delay }}
    >
      {children}
    </motion.div>
  );
}

function TagLabel({ children }: { children: ReactNode }) {
  return (
    <span aria-hidden="true" className={`${styles.tagLabel} ${mono.className}`}>
      {children}
    </span>
  );
}

/* ---------------------------------------------------------
 * 데이터
 * --------------------------------------------------------- */
const GRAVEYARD: { name: string; cause: string }[] = [
  { name: "블룸노트", cause: "사인: 정렬 폴더 12개 만들다 지침" },
  { name: "시엘로", cause: "사인: 스티커 고르다 하루 다 씀" },
  { name: "포근노트", cause: "사인: 위젯 예쁘게 배치하다 포기" },
  { name: "리추얼웍스", cause: "사인: 온보딩만 20분" },
  { name: "마인드페이퍼", cause: "사인: 폰트 고르다 삭제" },
  { name: "오늘의기록", cause: "사인: 알림 3일 무시 후 삭제" },
];

const FEATURES: { n: string; title: string; body: string }[] = [
  { n: "01", title: "자동저장, 그게 다", body: "저장 버튼 없음. 창을 닫으면 이미 저장돼 있다." },
  { n: "02", title: "검색은 Ctrl+F처럼", body: "폴더도 태그도 없다. 찾고 싶은 단어를 그냥 친다." },
  { n: "03", title: "내보내기는 .txt뿐", body: "다른 포맷 없음. 평문 그대로 들고 나간다." },
];

const DIFFS: { handle: string; role: string; before: string; after: string; days: string }[] = [
  {
    handle: "@haeun_writes",
    role: "프리랜서 에디터",
    before: "정리하다 지쳐서 앱을 세 번 지웠다.",
    after: "못생긴 채로 63일째 매일 쓰는 중.",
    days: "63일째",
  },
  {
    handle: "@kimdev_null",
    role: "백엔드 개발자",
    before: "노션 템플릿 만드는 데 하루를 썼다.",
    after: "템플릿이 없어서 이제 진짜로 쓴다.",
    days: "41일째",
  },
  {
    handle: "@j_journal",
    role: "대학원생",
    before: "예쁜 다이어리 앱 다섯 개를 갈아탔다.",
    after: "여섯 번째는 못생겼고, 처음으로 안 갈아탔다.",
    days: "104일째",
  },
];

export default function LandingF6Client() {
  return (
    <div className={`${styles.page} ${mono.variable}`}>
      <a href="#main" className={styles.skipLink}>
        본문으로 건너뛰기
      </a>

      {/* ================= HEADER ================= */}
      <header id="top" className="sticky top-0 z-40 border-b-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <a href="#top" className="flex min-h-11 items-center gap-2 no-underline">
            <TagLabel>&lt;header&gt;</TagLabel>
            <span className="text-2xl font-black tracking-tight text-[var(--nl-ink)]">날것</span>
            <span className={`${mono.className} text-[10px] text-[var(--nl-muted)]`}>RAW.v0.1</span>
          </a>
          <nav aria-label="주요 메뉴" className="flex items-center gap-4 overflow-x-auto text-sm font-bold sm:gap-6">
            <a href="#problem" className="inline-flex min-h-11 items-center whitespace-nowrap no-underline hover:underline">
              문제
            </a>
            <a href="#feature" className="inline-flex min-h-11 items-center whitespace-nowrap no-underline hover:underline">
              기능
            </a>
            <a href="#diff" className="inline-flex min-h-11 items-center whitespace-nowrap no-underline hover:underline">
              후기
            </a>
            <a href="#pricing" className="inline-flex min-h-11 items-center whitespace-nowrap no-underline hover:underline">
              가격
            </a>
          </nav>
          <a href="#cta" className={`${styles.btnPrimary} ${styles.hardShadowSm} text-sm`}>
            시작하기
          </a>
        </div>
      </header>

      <main id="main">
        {/* ================= HERO ================= */}
        <section id="hero" aria-labelledby="hero-heading" className={`${styles.gridBg} border-b-[3px] border-[var(--nl-ink)]`}>
          <div className="mx-auto max-w-6xl px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-24">
            <TagLabel>&lt;section id=&quot;hero&quot;&gt;</TagLabel>
            <p className={`${mono.className} mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--nl-muted)]`}>
              메모 앱 · 정리 기능 없음 · 영원히 미완성
            </p>
            <h1 id="hero-heading" className={`${styles.heroTitle} mt-4 font-black text-[var(--nl-ink)]`}>
              정리하지 마라.
              <br />
              날것으로 써라.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--nl-muted)] sm:text-xl">
              예쁘게 정리하려다 이번 주도 다이어리를 폈다 덮었다면, 그건 당신 잘못이 아니라 앱 잘못이다.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#pricing" className={`${styles.btnPrimary} ${styles.hardShadow}`}>
                지금 날것으로 시작하기
              </a>
              <a href="#feature" className={`${styles.btnGhost}`}>
                왜 못생겼는지 보기
                <ArrowDown aria-hidden="true" size={18} />
              </a>
            </div>
            <ul aria-label="이 페이지의 스펙" className={`${mono.className} mt-12 flex flex-wrap gap-x-8 gap-y-2 text-xs text-[var(--nl-muted)]`}>
              <li>PAGE WEIGHT ≈ 41KB</li>
              <li>ANIMATION 0.35s LINEAR</li>
              <li>ROUNDED CORNERS 0px</li>
              <li>정렬 기능 0개</li>
            </ul>
          </div>
        </section>

        {/* ================= HAZARD MARQUEE ================= */}
        <div className={styles.marqueeWrap} role="presentation" aria-hidden="true">
          <div className={`${styles.marqueeTrack} ${mono.className} py-2 text-xs font-bold text-[var(--nl-ink)]`}>
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
                {Array.from({ length: 6 }).map((__, j) => (
                  <span key={j} className="bg-[var(--nl-paper)] px-3 py-1">
                    ⚠ 이 사이트는 예쁘지 않습니다 · 의도했습니다 ⚠
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ================= PROBLEM ================= */}
        <section id="problem" aria-labelledby="problem-heading" className="border-b-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper-2)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;problem&quot;&gt;</TagLabel>
            <Reveal className="mt-4">
              <h2 id="problem-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                아름다운 메모앱들의 무덤
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--nl-muted)] sm:text-lg">
                우리는 3개월마다 새 메모앱으로 갈아탄다. 이유는 항상 같다 — 예뻐서 쓰기 시작했고, 예쁘게
                정리해야 할 것 같아서 결국 안 썼다. 아래는 그렇게 조용히 삭제된 앱들의 묘지다.
              </p>
            </Reveal>

            <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {GRAVEYARD.map((g, i) => (
                <li key={g.name}>
                  <Reveal delay={i * 0.04}>
                    <article
                      className={`${styles.tombstone} ${styles.hardShadowSm} h-full rounded-2xl border border-black/10 bg-white p-6 shadow-md`}
                    >
                      <h3 className="text-lg font-bold text-[var(--nl-ink)]">{g.name}</h3>
                      <p className={`${mono.className} mt-2 text-xs text-[var(--nl-danger)]`}>{g.cause}</p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= FEATURE / MOCKUP ================= */}
        <section id="feature" aria-labelledby="feature-heading" className="border-b-[3px] border-[var(--nl-ink)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;feature&quot;&gt;</TagLabel>
            <Reveal className="mt-4">
              <h2 id="feature-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                이게 전부다.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--nl-muted)] sm:text-lg">
                정렬 없음. 태그 없음. 폴더 없음. 그냥 커서 하나.
              </p>
            </Reveal>

            <Reveal delay={0.05} className="mt-10">
              <div className={`${styles.hardShadowLg} border-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper-2)]`}>
                <div className={`${mono.className} flex items-center justify-between border-b-[3px] border-[var(--nl-ink)] px-4 py-2 text-xs`}>
                  <span>메모_제목없음.txt — 날것</span>
                  <span aria-hidden="true">● ● ●</span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3 border-b border-dashed border-black/20 pb-4">
                    {[Bold, Italic, Underline].map((Icon, i) => (
                      <span key={i} className="relative inline-flex h-9 w-9 items-center justify-center border border-black/20 text-black/30">
                        <Icon aria-hidden="true" size={16} />
                        <span aria-hidden="true" className="absolute inset-0 flex items-center">
                          <span className="h-px w-full rotate-[20deg] bg-[var(--nl-danger)]" />
                        </span>
                      </span>
                    ))}
                    <span className={`${mono.className} text-xs text-[var(--nl-muted)]`}>서식 도구 없음</span>
                  </div>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--nl-ink)] sm:text-lg">
                    오늘 회의에서 나온 얘기 정리해야 하는데 사실 정리 안 해도 됨 그냥 적어두면 나중에 검색으로
                    찾으면 됨 굳이 폴더 안 만들어도
                    <span aria-hidden="true" className={styles.blinkCursor} />
                    <span className="sr-only">입력 커서 깜빡임</span>
                  </p>
                </div>
              </div>
            </Reveal>

            <ol className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {FEATURES.map((f, i) => (
                <li key={f.n}>
                  <Reveal delay={i * 0.05}>
                    <span className={`${mono.className} text-sm font-bold text-[var(--nl-danger)]`}>{f.n}</span>
                    <h3 className="mt-2 text-xl font-bold text-[var(--nl-ink)]">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--nl-muted)]">{f.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ================= DIFF TESTIMONIALS ================= */}
        <section id="diff" aria-labelledby="diff-heading" className="border-b-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper-2)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;diff&quot;&gt;</TagLabel>
            <Reveal className="mt-4">
              <h2 id="diff-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                <span className={mono.className}>diff --before --after</span>
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--nl-muted)] sm:text-lg">
                진짜 사용자 후기. 꾸미지 않았다.
              </p>
            </Reveal>

            <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {DIFFS.map((d, i) => (
                <li key={d.handle}>
                  <Reveal delay={i * 0.05}>
                    <article className={`${styles.hardShadowSm} h-full border-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper)] p-5`}>
                      <p className={`${mono.className} ${styles.diffMinus} px-3 py-2 text-sm leading-relaxed`}>
                        <span className="sr-only">이전: </span>
                        <span aria-hidden="true">- </span>
                        {d.before}
                      </p>
                      <p className={`${mono.className} ${styles.diffPlus} mt-2 px-3 py-2 text-sm leading-relaxed`}>
                        <span className="sr-only">이후: </span>
                        <span aria-hidden="true">+ </span>
                        {d.after}
                      </p>
                      <footer className="mt-4 flex items-center justify-between border-t border-dashed border-black/20 pt-3">
                        <p className="text-sm">
                          <span className="font-bold text-[var(--nl-ink)]">{d.handle}</span>
                          <span className="block text-xs text-[var(--nl-muted)]">{d.role}</span>
                        </p>
                        <span className={`${mono.className} text-xs text-[var(--nl-muted)]`}>{d.days}</span>
                      </footer>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ================= ANALOG COMPARISON ================= */}
        <section id="analog" aria-labelledby="analog-heading" className="border-b-[3px] border-[var(--nl-ink)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;analog&quot;&gt;</TagLabel>
            <Reveal className="mt-4">
              <h2 id="analog-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                우리가 베낀 건, 사실 이거다.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--nl-muted)] sm:text-lg">
                정리 기능이 붙기 전, 종이는 그냥 받아 적는 도구였다. 날것은 그 상태로 돌아간다 — 디지털일 뿐.
              </p>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Reveal>
                <figure className="m-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-[3px] border-[var(--nl-ink)]">
                    <Image
                      src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop"
                      alt="낡은 회색 타자기 클로즈업, 자판 위에 손끝이 닿기 직전"
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                  <figcaption className={`${mono.className} ${styles.hardShadowSm} mt-3 border-[3px] border-[var(--nl-ink)] bg-[var(--nl-warn)] px-3 py-2 text-xs`}>
                    <span aria-hidden="true">ALT ▸</span> 낡은 타자기, 손끝이 자판에 닿기 직전
                  </figcaption>
                </figure>
              </Reveal>
              <Reveal delay={0.05}>
                <figure className="m-0">
                  <div className="relative aspect-[4/3] w-full overflow-hidden border-[3px] border-[var(--nl-ink)]">
                    <Image
                      src="https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=80&auto=format&fit=crop"
                      alt="그리드 노트에 손글씨로 채워진 페이지와 펜 한 자루"
                      fill
                      loading="lazy"
                      sizes="(min-width: 640px) 45vw, 90vw"
                      className="object-cover grayscale contrast-125"
                    />
                  </div>
                  <figcaption className={`${mono.className} ${styles.hardShadowSm} mt-3 border-[3px] border-[var(--nl-ink)] bg-[var(--nl-warn)] px-3 py-2 text-xs`}>
                    <span aria-hidden="true">ALT ▸</span> 그리드 노트와 손글씨, 펜 한 자루
                  </figcaption>
                </figure>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" aria-labelledby="pricing-heading" className="border-b-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper-2)]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;pricing&quot;&gt;</TagLabel>
            <Reveal className="mt-4">
              <h2 id="pricing-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                가격도 안 꾸몄다.
              </h2>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Reveal>
                <article className={`${styles.hardShadow} flex h-full flex-col border-[3px] border-[var(--nl-ink)] bg-[var(--nl-paper)] p-7`}>
                  <h3 className="text-xl font-black text-[var(--nl-ink)]">FREE</h3>
                  <p className={`${mono.className} mt-2 text-3xl font-bold`}>₩0 · 평생</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--nl-muted)]">
                    계정 없음. 서버 없음. 브라우저 로컬 저장. 지웠다 다시 설치하면 다 날아간다. 그게 규칙이다.
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {["무제한 메모", "자동저장", ".txt 내보내기"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check aria-hidden="true" size={16} className="shrink-0 text-[var(--nl-go)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#cta" className={`${styles.btnGhost} mt-6 w-full`}>
                    그냥 쓰기 시작
                  </a>
                </article>
              </Reveal>
              <Reveal delay={0.05}>
                <article className={`${styles.hardShadow} flex h-full flex-col border-[3px] border-[var(--nl-ink)] bg-[var(--nl-warn)] p-7`}>
                  <h3 className="text-xl font-black text-[var(--nl-ink)]">SYNC</h3>
                  <p className={`${mono.className} mt-2 text-3xl font-bold`}>₩2,900 · 월</p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--nl-ink)]/80">
                    브라우저를 지워도 안 날아간다. 기기 두 개 이상 쓰면 필요하다. 그 외엔 무료판과 똑같이
                    못생겼다.
                  </p>
                  <ul className="mt-5 flex-1 space-y-2 text-sm">
                    {["FREE의 전부", "기기 간 동기화", "삭제 후 30일 복구"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check aria-hidden="true" size={16} className="shrink-0 text-[var(--nl-ink)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="#cta" className={`${styles.btnDark} mt-6 w-full`}>
                    동기화 켜기
                  </a>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section id="cta" aria-labelledby="cta-heading" className="border-b-[3px] border-[var(--nl-ink)] bg-[var(--nl-warn)]">
          <div className="mx-auto max-w-6xl px-5 py-16 text-center sm:px-8 sm:py-24">
            <TagLabel>&lt;section id=&quot;cta&quot;&gt;</TagLabel>
            <Reveal className="mt-4 flex flex-col items-center">
              <h2 id="cta-heading" className={`${styles.sectionTitle} font-black text-[var(--nl-ink)]`}>
                더 미룰 이유가 없다.
              </h2>
              <a
                href="mailto:hello@nalgeot.raw?subject=날것%20써볼래요"
                className={`${styles.btnDark} ${styles.hardShadowLg} mt-8 text-lg`}
              >
                지금 날것으로 시작하기
              </a>
              <ul className={`${mono.className} mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[var(--nl-ink)]/70`}>
                <li>설치 없음</li>
                <li>카드 필요 없음</li>
                <li>가입 10초</li>
              </ul>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[var(--nl-ink)] text-[var(--nl-paper)]">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <p className={`${mono.className} text-xs text-[var(--nl-paper)]/50`} aria-hidden="true">
            {"<!-- 여기까지 스크롤했다면, 이미 날것이다 -->"}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-4">
            <p className="text-sm">날것 Inc. 2026 · 정리되어 있지 않음</p>
            <nav aria-label="푸터 메뉴" className="flex gap-5 text-sm font-bold">
              <a href="#feature" className="no-underline hover:underline">
                기능
              </a>
              <a href="#pricing" className="no-underline hover:underline">
                가격
              </a>
              <a href="mailto:hello@nalgeot.raw" className="no-underline hover:underline">
                이메일
              </a>
            </nav>
          </div>
          <p aria-hidden="true" className={`${mono.className} mt-6 text-[10px] text-[var(--nl-paper)]/40`}>
            {"</html>"}
          </p>
        </div>
      </footer>
    </div>
  );
}
