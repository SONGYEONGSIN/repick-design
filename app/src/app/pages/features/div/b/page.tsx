import type { CSSProperties } from "react";

type IconType = "radar" | "grid" | "stamp" | "bolt";

const FEATURES: {
  n: string;
  tag: string;
  title: string;
  desc: string;
  icon: IconType;
}[] = [
  {
    n: "01",
    tag: "OBSERVE — 관찰",
    title: "당신을 관찰한다",
    desc: "찜한 것, 클릭한 것, 결국 산 것. 사소한 행동 하나하나를 모아 진짜 취향의 지도를 그립니다.",
    icon: "radar",
  },
  {
    n: "02",
    tag: "SELECT — 선별",
    title: "수만 개 중 하나를 고른다",
    desc: "매일 쏟아지는 매물 속에서 AI가 당신에게 맞는 물건만 골라 앞으로 내밉니다.",
    icon: "grid",
  },
  {
    n: "03",
    tag: "VERIFY — 검증",
    title: "가짜와 거짓을 걸러낸다",
    desc: "상태, 가격, 판매자 이력까지 3중으로 대조해 믿을 수 있는 매물만 통과시킵니다.",
    icon: "stamp",
  },
  {
    n: "04",
    tag: "ALERT — 타격",
    title: "기회를 놓치지 않는다",
    desc: "가격이 떨어지거나 새 매물이 뜨는 순간, 0.1초의 망설임 없이 알립니다.",
    icon: "bolt",
  },
];

function MiniVisual({ type }: { type: IconType }) {
  if (type === "radar") {
    return (
      <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36" aria-hidden>
        <div className="absolute inset-0 rounded-full border-2 border-[var(--rp-cream)]/25" />
        <div className="absolute inset-[18%] rounded-full border-2 border-[var(--rp-cream)]/45" />
        <div className="absolute inset-[38%] rounded-full border-2 border-[var(--rp-cream)]/80" />
        <div className="absolute top-1/2 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-[var(--rp-red)]" />
        <div className="absolute top-1/2 left-1/2 h-full w-[2px] origin-top -translate-x-1/2 -rotate-45 bg-[var(--rp-red)]/70" />
      </div>
    );
  }
  if (type === "grid") {
    return (
      <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36" aria-hidden>
        <div className="grid h-full w-full grid-cols-3 gap-1.5 sm:gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className={
                i === 4
                  ? "rounded-[2px] bg-[var(--rp-red)]"
                  : "rounded-[2px] border border-[var(--rp-cream)]/30"
              }
            />
          ))}
        </div>
        <div className="absolute -right-3 top-1/2 h-[2px] w-10 -translate-y-1/2 rotate-45 bg-[var(--rp-cream)] sm:w-14" />
      </div>
    );
  }
  if (type === "stamp") {
    return (
      <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36" aria-hidden>
        <div className="absolute inset-0 [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)] border-4 border-[var(--rp-cream)]/70" />
        <div className="absolute left-1/2 top-1/2 h-4 w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-[18deg] bg-[var(--rp-red)]" />
        <div className="absolute left-[30%] top-[54%] h-[3px] w-6 rotate-45 bg-[var(--rp-cream)]" />
        <div className="absolute left-[38%] top-[46%] h-[3px] w-10 -rotate-45 bg-[var(--rp-cream)]" />
      </div>
    );
  }
  return (
    <div className="relative h-28 w-28 shrink-0 sm:h-36 sm:w-36" aria-hidden>
      <div className="absolute inset-0 h-full w-full [clip-path:polygon(50%_0%,20%_55%,45%_55%,35%_100%,80%_45%,55%_45%)] bg-[var(--rp-red)]" />
      <div className="absolute right-1 top-3 h-[2px] w-8 rotate-[20deg] bg-[var(--rp-cream)]/60 sm:w-10" />
      <div className="absolute right-0 top-9 h-[2px] w-6 rotate-[20deg] bg-[var(--rp-cream)]/40 sm:w-8" />
      <div className="absolute right-2 bottom-4 h-[2px] w-7 -rotate-[15deg] bg-[var(--rp-cream)]/40 sm:w-9" />
    </div>
  );
}

const rootStyle = {
  "--rp-red": "#c81d25",
  "--rp-black": "#14110f",
  "--rp-cream": "#f2ead8",
} as CSSProperties;

export default function Landing() {
  return (
    <main
      id="top"
      style={rootStyle}
      className="relative min-h-screen overflow-x-hidden bg-[var(--rp-cream)] font-sans text-[var(--rp-black)] selection:bg-[var(--rp-red)] selection:text-[var(--rp-cream)]"
    >
      {/* paper texture */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05] [background-image:repeating-linear-gradient(135deg,var(--rp-black)_0px,var(--rp-black)_1px,transparent_1px,transparent_14px)]"
      />

      {/* header */}
      <header className="relative z-10 border-b-4 border-[var(--rp-black)] bg-[var(--rp-cream)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <span className="font-mono text-sm font-bold tracking-[0.3em] uppercase">
            RE·PICK
          </span>
          <span className="hidden font-mono text-xs font-bold tracking-[0.2em] text-[var(--rp-red)] uppercase sm:inline">
            기능 선언문 № 04
          </span>
          <a
            href="#cta"
            className="border-2 border-[var(--rp-black)] px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-colors hover:bg-[var(--rp-black)] hover:text-[var(--rp-cream)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rp-red)]"
          >
            시작하기
          </a>
        </div>
      </header>

      {/* hero */}
      <section className="relative z-10 overflow-hidden px-5 pt-16 pb-24 sm:px-8 sm:pt-24 sm:pb-32">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 -right-24 h-[140%] w-[70%] -rotate-[10deg] bg-[var(--rp-red)] sm:-right-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 right-[8%] h-40 w-40 rotate-45 border-8 border-[var(--rp-black)] sm:h-56 sm:w-56"
        />

        <div className="relative mx-auto max-w-6xl">
          <p className="mb-4 inline-block -rotate-2 border-2 border-[var(--rp-black)] bg-[var(--rp-black)] px-3 py-1 font-mono text-xs font-bold tracking-[0.25em] text-[var(--rp-cream)] uppercase">
            THE FUNCTIONS OF REPICK
          </p>
          <h1 className="max-w-3xl -rotate-1 text-5xl leading-[0.95] font-black tracking-tight uppercase sm:text-7xl">
            기능이 <span className="text-[var(--rp-red)]">곧</span> 무기다
          </h1>
          <p className="mt-6 max-w-md rotate-1 border-l-4 border-[var(--rp-black)] pl-4 text-base leading-relaxed font-medium sm:text-lg">
            관찰하고, 골라내고, 검증하고, 알린다 — 리픽의 4가지 기능이 당신
            대신 중고 시장과 싸운다.
          </p>
        </div>
      </section>

      {/* declaration strip */}
      <div className="relative z-10 -mb-4 flex justify-center">
        <span className="rotate-1 border-2 border-[var(--rp-black)] bg-[var(--rp-red)] px-4 py-1.5 font-mono text-xs font-bold tracking-[0.2em] text-[var(--rp-cream)] uppercase shadow-[4px_4px_0_var(--rp-black)]">
          선언문 발췌 — 4개 조항
        </span>
      </div>

      {/* features */}
      <section
        className="relative z-10 border-t-4 border-b-4 border-[var(--rp-black)] bg-[var(--rp-black)] px-5 pt-16 pb-16 text-[var(--rp-cream)] sm:px-8 sm:pt-24 sm:pb-24"
        aria-labelledby="features-heading"
      >
        <h2 id="features-heading" className="sr-only">
          리픽의 핵심 기능 4가지
        </h2>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:repeating-linear-gradient(-135deg,var(--rp-cream)_0px,var(--rp-cream)_1px,transparent_1px,transparent_18px)]"
        />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-16 sm:gap-24">
          {FEATURES.map((f, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={f.n}
                className="relative overflow-hidden"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -top-10 select-none text-[6rem] leading-none font-black text-[var(--rp-red)]/20 sm:text-[10rem] ${
                    reversed ? "-rotate-3 -right-4 sm:right-0" : "rotate-3 -left-4 sm:left-0"
                  }`}
                >
                  {f.n}
                </span>

                <div
                  className={`relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-12 ${
                    reversed ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  <MiniVisual type={f.icon} />

                  <div
                    className={`min-w-0 flex-1 ${
                      reversed ? "sm:text-right" : "sm:text-left"
                    }`}
                  >
                    <p className="mb-2 inline-block -rotate-1 border border-[var(--rp-cream)]/50 px-2 py-0.5 font-mono text-[0.65rem] font-bold tracking-[0.2em] text-[var(--rp-cream)]/80 uppercase sm:text-xs">
                      {f.tag}
                    </p>
                    <h3 className="rotate-0 text-3xl leading-tight font-black tracking-tight uppercase sm:text-5xl">
                      {f.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--rp-cream)]/85 sm:ml-0 sm:text-base">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="relative z-10 overflow-hidden bg-[var(--rp-cream)] px-5 py-20 text-center sm:px-8 sm:py-28"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 left-1/2 h-64 w-[140%] -translate-x-1/2 -rotate-3 bg-[var(--rp-red)]"
        />
        <div className="relative mx-auto max-w-3xl">
          <p className="mb-4 -rotate-1 font-mono text-xs font-bold tracking-[0.3em] text-[var(--rp-red)] uppercase">
            FINAL ARTICLE
          </p>
          <p className="rotate-1 text-4xl leading-[1.05] font-black tracking-tight uppercase sm:text-6xl">
            지금, 리픽하라
          </p>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed font-medium sm:text-base">
            네 가지 기능이 이미 준비되어 있다. 당신의 다음 중고 거래를
            무기처럼 정확하게 만든다.
          </p>
          <a
            href="#top"
            className="mt-9 inline-block -rotate-1 border-4 border-[var(--rp-black)] bg-[var(--rp-black)] px-8 py-4 text-sm font-bold tracking-[0.15em] text-[var(--rp-cream)] uppercase shadow-[6px_6px_0_var(--rp-red)] transition-transform hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--rp-red)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--rp-red)]"
          >
            무료로 시작하기 →
          </a>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 border-t-4 border-[var(--rp-black)] bg-[var(--rp-black)] px-5 py-6 text-center text-[var(--rp-cream)] sm:px-8">
        <p className="font-mono text-[0.65rem] font-bold tracking-[0.25em] uppercase opacity-70 sm:text-xs">
          REPICK — 기능 선언문 · 2026
        </p>
      </footer>
    </main>
  );
}
