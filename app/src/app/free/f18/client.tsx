"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Flame, Lock, Clock } from "lucide-react";

/* ------------------------------------------------------------------ */
/* prefers-reduced-motion — 직접 구독, 초기값은 항상 "애니메이션 허용"으로 시작하고
   reduce=true로 확인되는 즉시 정적 렌더로 전환한다. 이 경로는 opacity:0으로
   영구히 멈추는 경우가 구조적으로 없다 (아래 Reveal 참고). */
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

/* 진입 리빌 — reduce가 확인되면 framer-motion을 아예 거치지 않고
   최종 상태 그대로 렌더한다 (opacity 잔류 버그 원천 차단). */
function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

const sectionPad = "px-6 md:px-12 lg:px-24";

type RitualStepData = {
  numeral: string;
  title: string;
  lead: string;
  desc: string;
  imgSrc: string;
  imgAlt: string;
};

const RITUAL_STEPS: RitualStepData[] = [
  {
    numeral: "I",
    title: "문장",
    lead: "단 하나의 문장을 짓습니다",
    desc: "유언일 수도, 고백일 수도, 다짐일 수도 있습니다. 다시 고쳐 쓸 수 없기에, 남기고 싶은 단 한 문장만을 고릅니다.",
    imgSrc:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "울창한 숲의 나무 사이로 햇살이 쏟아지는 고요한 풍경",
  },
  {
    numeral: "II",
    title: "새김",
    lead: "정으로, 한 자씩 손으로 새깁니다",
    desc: "마지막 남은 석공이 화강암 위에 글자를 새깁니다. 기계로 깎지 않습니다. 오탈자는 없습니다 — 다시 쓸 수 없기 때문입니다.",
    imgSrc:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "안개 속에 홀로 솟은 거대한 산봉우리",
  },
  {
    numeral: "III",
    title: "봉인",
    lead: "지하 깊은 곳에 안치됩니다",
    desc: "완성된 화강암판은 지하 봉인고 가장 깊은 곳, 항온 항습이 유지되는 화강암 동굴에 놓입니다. 정해진 해가 오기 전에는, 누구도 열 수 없습니다.",
    imgSrc:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop",
    imgAlt: "겹겹이 이어진 안개 낀 산 능선",
  },
];

type Tier = {
  numeral: string;
  years: string;
  name: string;
  hanja: string;
  who: string;
  desc: string;
};

const TIERS: Tier[] = [
  {
    numeral: "I",
    years: "100",
    name: "백년각",
    hanja: "百年閣",
    who: "다음 세대에게",
    desc: "손주가 태어난 자리에서 다시 열립니다. 가장 가까운 미래를 위한 새김.",
  },
  {
    numeral: "II",
    years: "300",
    name: "삼백년각",
    hanja: "三百年閣",
    who: "가문에게",
    desc: "당신의 이름을 아무도 기억하지 못할 때, 새김만이 남아 그날을 증언합니다.",
  },
  {
    numeral: "III",
    years: "1000",
    name: "천년각",
    hanja: "千年閣",
    who: "인류에게",
    desc: "국가도 언어도 바뀔 시간. 오직 화강암과 새김만이 그때까지 남습니다.",
  },
];

const QUOTES: { text: string; year: string }[] = [
  { text: "미안하다는 말을, 이렇게밖에는 못 하겠다.", year: "2126년 개봉 예정" },
  {
    text: "이 산 아래, 내가 사랑했다는 사실만은 새겨두고 싶었다.",
    year: "2326년 개봉 예정",
  },
  { text: "우리가 무엇을 두려워했는지, 여기 새겨 놓는다.", year: "3026년 개봉 예정" },
];

const VAULT_STATS: { value: string; label: string }[] = [
  { value: "340M", label: "지하 심도" },
  { value: "40CM", label: "화강암 두께" },
  { value: "8°C", label: "항온 유지" },
  { value: "0", label: "디지털 사본" },
];

/* ------------------------------------------------------------------ */

export default function F18Landing({
  monumentClass,
}: {
  monumentClass: string;
}) {
  const [reserved, setReserved] = useState(false);

  return (
    <div
      className={`f18 ${monumentClass} min-h-dvh bg-[var(--sg-black)] text-[var(--sg-stone)]`}
    >
      <style>{`
        .f18 {
          --sg-black: #0a0908;
          --sg-black-2: #131210;
          --sg-stone: #ece6d8;
          --sg-stone-dim: #a39c8c;
          --sg-ember: #c99a52;
          --sg-ember-deep: #6f4620;
          --sg-line: rgba(236, 230, 216, 0.14);
          font-family: var(--font-monument), "Pretendard Variable", serif;
        }
        .f18-numeral {
          font-family: var(--font-display);
          font-style: italic;
        }
        @media (prefers-reduced-motion: no-preference) {
          .f18-ember-pulse {
            animation: f18-flicker 2.6s ease-in-out infinite;
          }
          .f18-bounce {
            animation: f18-bounce 2.2s ease-in-out infinite;
          }
        }
        @keyframes f18-flicker {
          0%, 100% { opacity: 1; }
          45% { opacity: 0.55; }
          55% { opacity: 0.85; }
        }
        @keyframes f18-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>

      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-[var(--sg-ember)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-[var(--sg-black)] focus-visible:font-semibold"
      >
        본문으로 건너뛰기
      </a>

      <header className="fixed top-0 left-0 z-40 p-6 md:p-8">
        <span className="f18-numeral text-lg tracking-[0.3em] text-[var(--sg-stone)]">
          SAEGIM
        </span>
      </header>

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <section
          aria-labelledby="f18-hero-title"
          className={`relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-32 pb-24 text-center ${sectionPad}`}
        >
          <p className="mb-8 text-xs tracking-[0.45em] text-[var(--sg-stone-dim)] md:text-sm">
            화강암 봉헌 의식 · 다음 개봉 서기 2426년
          </p>

          <div className="relative flex items-center justify-center gap-6 md:gap-12">
            <span
              aria-hidden="true"
              className="hidden h-[38vh] w-px shrink-0 bg-gradient-to-b from-transparent via-[var(--sg-line)] to-transparent md:block"
            />
            <h1
              id="f18-hero-title"
              className="text-[clamp(5.5rem,24vw,15rem)] font-normal leading-[0.86] tracking-tight text-[var(--sg-stone)]"
            >
              <span className="block">새</span>
              <span className="block">김</span>
            </h1>
            <span
              aria-hidden="true"
              className="hidden h-[38vh] w-px shrink-0 bg-gradient-to-b from-transparent via-[var(--sg-line)] to-transparent md:block"
            />
          </div>

          <p className="f18-numeral mt-8 text-sm tracking-[0.5em] text-[var(--sg-ember)] md:text-base">
            SAEGIM
          </p>

          <p className="mt-10 max-w-md text-balance text-base leading-relaxed text-[var(--sg-stone-dim)] md:text-lg">
            말은 사라집니다. 새김은 남습니다.
            <br />
            당신의 한 문장을 화강암에 새겨, 천 년의 시간 속에 봉인합니다.
          </p>

          <div className="mt-16 flex flex-col items-center gap-3 text-[var(--sg-stone-dim)]">
            <span className="text-[0.65rem] tracking-[0.5em]">SCROLL</span>
            <ArrowDown
              aria-hidden="true"
              className="f18-bounce h-4 w-4 motion-reduce:animate-none"
            />
          </div>
        </section>

        {/* ---------------- MANIFESTO ---------------- */}
        <section
          aria-labelledby="f18-manifesto-title"
          className={`border-t border-[var(--sg-line)] py-32 md:py-48 ${sectionPad}`}
        >
          <h2 id="f18-manifesto-title" className="sr-only">
            선언
          </h2>
          <Reveal className="mx-auto max-w-4xl">
            <p className="text-[clamp(1.9rem,5.5vw,4rem)] leading-[1.25] tracking-tight">
              우리는 기록하지 않습니다.
              <br />
              <span className="text-[var(--sg-ember)]">새깁니다.</span>
            </p>
            <p className="mt-12 text-[clamp(1.9rem,5.5vw,4rem)] leading-[1.25] tracking-tight text-[var(--sg-stone-dim)]">
              클라우드는 사라지고, 종이는 삭습니다.
              <br />
              <span className="text-[var(--sg-stone)]">화강암은, 만 년을 견딥니다.</span>
            </p>
          </Reveal>
        </section>

        {/* ---------------- RITUAL STEPS ---------------- */}
        <section
          aria-labelledby="f18-ritual-title"
          className="border-t border-[var(--sg-line)]"
        >
          <Reveal className={`pt-24 pb-8 ${sectionPad}`}>
            <h2
              id="f18-ritual-title"
              className="f18-numeral text-sm tracking-[0.4em] text-[var(--sg-ember)]"
            >
              THE RITE
            </h2>
            <p className="mt-3 text-2xl text-[var(--sg-stone)] md:text-3xl">
              의식의 절차
            </p>
          </Reveal>

          {RITUAL_STEPS.map((step, i) => (
            <article
              key={step.numeral}
              className={`grid grid-cols-1 items-center gap-10 border-t border-[var(--sg-line)] py-16 md:grid-cols-2 md:gap-0 md:py-0 ${sectionPad}`}
            >
              <div
                className={`relative order-2 aspect-[4/5] w-full overflow-hidden md:order-none md:aspect-auto md:h-[70vh] ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={step.imgSrc}
                  alt={step.imgAlt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale-[15%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[var(--sg-black)]/50 via-transparent to-transparent"
                />
              </div>

              <Reveal
                delay={0.1}
                className={`order-1 md:order-none md:px-16 ${
                  i % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <span className="f18-numeral block text-[clamp(4rem,10vw,7rem)] leading-none text-[var(--sg-ember-deep)]">
                  {step.numeral}
                </span>
                <h3 className="mt-4 text-3xl text-[var(--sg-stone)] md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-lg text-[var(--sg-ember)]">{step.lead}</p>
                <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--sg-stone-dim)]">
                  {step.desc}
                </p>
              </Reveal>
            </article>
          ))}
        </section>

        {/* ---------------- VAULT STATS ---------------- */}
        <section
          aria-labelledby="f18-vault-title"
          className="relative border-t border-[var(--sg-line)] py-32 md:py-48"
        >
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2000&auto=format&fit=crop"
              alt=""
              fill
              sizes="100vw"
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-[var(--sg-black)]/70" />
          </div>

          <div className={`relative ${sectionPad}`}>
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2
                id="f18-vault-title"
                className="f18-numeral text-sm tracking-[0.4em] text-[var(--sg-ember)]"
              >
                THE VAULT
              </h2>
              <p className="mt-3 text-2xl text-[var(--sg-stone)] md:text-3xl">
                봉인고, 산의 뿌리 아래
              </p>
              <p className="mt-6 text-base leading-relaxed text-[var(--sg-stone-dim)]">
                새겨진 화강암판은 복제되지 않습니다. 사진도, 스캔본도 남기지
                않습니다. 오직 하나의 원본만이, 산의 뿌리 아래에서 시간을
                기다립니다.
              </p>
            </Reveal>

            <Reveal
              delay={0.15}
              className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-12 text-center md:grid-cols-4"
            >
              {VAULT_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="f18-numeral text-[clamp(2rem,5vw,3.2rem)] text-[var(--sg-stone)]">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs tracking-[0.25em] text-[var(--sg-stone-dim)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ---------------- TIERS ---------------- */}
        <section
          aria-labelledby="f18-tiers-title"
          className={`border-t border-[var(--sg-line)] py-24 md:py-32 ${sectionPad}`}
        >
          <Reveal className="mb-16 text-center">
            <h2
              id="f18-tiers-title"
              className="f18-numeral text-sm tracking-[0.4em] text-[var(--sg-ember)]"
            >
              GRADES
            </h2>
            <p className="mt-3 text-2xl text-[var(--sg-stone)] md:text-3xl">
              새김의 격
            </p>
          </Reveal>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px overflow-hidden border border-[var(--sg-line)] bg-[var(--sg-line)] md:grid-cols-3">
            {TIERS.map((tier, i) => (
              <Reveal key={tier.numeral} delay={i * 0.1}>
                <div className="flex h-full flex-col bg-[var(--sg-black)] p-8 md:p-10">
                  <span className="f18-numeral text-3xl text-[var(--sg-ember-deep)]">
                    {tier.numeral}
                  </span>
                  <p className="f18-numeral mt-6 text-[clamp(3rem,7vw,4.5rem)] leading-none text-[var(--sg-stone)]">
                    {tier.years}
                  </p>
                  <p className="mb-6 text-xs tracking-[0.3em] text-[var(--sg-stone-dim)]">
                    년
                  </p>
                  <h3 className="text-xl text-[var(--sg-stone)]">
                    {tier.name}
                    <span className="ml-2 text-sm text-[var(--sg-stone-dim)]">
                      {tier.hanja}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-[var(--sg-ember)]">{tier.who}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--sg-stone-dim)]">
                    {tier.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------------- QUOTES ---------------- */}
        <section
          aria-labelledby="f18-quotes-title"
          className={`border-t border-[var(--sg-line)] py-24 md:py-32 ${sectionPad}`}
        >
          <Reveal className="mb-16 text-center">
            <h2
              id="f18-quotes-title"
              className="f18-numeral text-sm tracking-[0.4em] text-[var(--sg-ember)]"
            >
              INSCRIBED
            </h2>
            <p className="mt-3 text-2xl text-[var(--sg-stone)] md:text-3xl">
              새겨진 문장들
            </p>
          </Reveal>

          <ul className="mx-auto flex max-w-3xl flex-col gap-16">
            {QUOTES.map((q, i) => (
              <li key={q.text}>
                <Reveal delay={i * 0.08}>
                  <blockquote>
                    <p className="text-[clamp(1.4rem,3.5vw,2.2rem)] leading-snug text-[var(--sg-stone)]">
                      &ldquo;{q.text}&rdquo;
                    </p>
                    <footer className="mt-4 text-xs tracking-[0.25em] text-[var(--sg-stone-dim)]">
                      — {q.year}
                    </footer>
                  </blockquote>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section
          aria-labelledby="f18-cta-title"
          className={`border-t border-[var(--sg-line)] py-32 text-center md:py-48 ${sectionPad}`}
        >
          <Reveal className="mx-auto max-w-xl">
            <Flame
              aria-hidden="true"
              className="f18-ember-pulse mx-auto mb-8 h-8 w-8 text-[var(--sg-ember)]"
            />
            <h2
              id="f18-cta-title"
              className="text-[clamp(2.2rem,6vw,4rem)] leading-tight text-[var(--sg-stone)]"
            >
              지금, 새기시겠습니까
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--sg-stone-dim)]">
              천 년 뒤에도 지워지지 않을 단 한 문장. 봉헌 의식은 예약제로만
              진행됩니다.
            </p>

            <button
              type="button"
              onClick={() => setReserved(true)}
              disabled={reserved}
              className="mt-12 inline-flex min-h-[3rem] items-center gap-3 rounded-full border border-[var(--sg-ember)] px-8 py-3 text-sm tracking-[0.2em] text-[var(--sg-ember)] transition-colors duration-200 hover:bg-[var(--sg-ember)] hover:text-[var(--sg-black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sg-black)] disabled:cursor-default disabled:opacity-60 disabled:hover:bg-transparent disabled:hover:text-[var(--sg-ember)]"
            >
              <Lock aria-hidden="true" className="h-4 w-4" />
              {reserved ? "예약이 접수되었습니다" : "봉헌 의식 예약하기"}
            </button>

            <p
              aria-live="polite"
              className="mt-6 min-h-[1.5rem] text-sm text-[var(--sg-stone-dim)]"
            >
              {reserved &&
                "석공이 사흘 안에 연락드립니다. 문장은 그날 이후 다시 고칠 수 없습니다."}
            </p>
          </Reveal>
        </section>
      </main>

      <footer
        className={`border-t border-[var(--sg-line)] py-12 text-center ${sectionPad}`}
      >
        <p className="f18-numeral text-lg tracking-[0.3em] text-[var(--sg-stone)]">
          SAEGIM
        </p>
        <nav aria-label="바닥글" className="mt-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs tracking-[0.15em] text-[var(--sg-stone-dim)]">
            <li>
              <a
                href="#f18-ritual-title"
                className="rounded transition-colors hover:text-[var(--sg-ember)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sg-black)]"
              >
                의식의 절차
              </a>
            </li>
            <li>
              <a
                href="#f18-tiers-title"
                className="rounded transition-colors hover:text-[var(--sg-ember)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sg-black)]"
              >
                새김의 격
              </a>
            </li>
            <li>
              <a
                href="#f18-quotes-title"
                className="rounded transition-colors hover:text-[var(--sg-ember)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sg-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--sg-black)]"
              >
                새겨진 문장
              </a>
            </li>
          </ul>
        </nav>
        <p className="mt-8 flex items-center justify-center gap-2 text-[0.65rem] tracking-[0.2em] text-[var(--sg-stone-dim)]">
          <Clock aria-hidden="true" className="h-3 w-3" />
          <span className="f18-numeral">MMXXVI</span>
          <span aria-hidden="true">·</span>
          <span>모든 새김은 되돌릴 수 없습니다</span>
        </p>
      </footer>
    </div>
  );
}
