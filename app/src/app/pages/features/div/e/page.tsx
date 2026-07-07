type Accent = "pink" | "blue";
type VisualVariant = "learn" | "match" | "trust" | "alert";

type Feature = {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  accent: Accent;
  visual: VisualVariant;
};

const features: Feature[] = [
  {
    id: "learn",
    number: "01",
    eyebrow: "PLATE 01 · 취향 학습",
    title: "찜과 클릭, 잉크처럼 쌓입니다",
    desc: "좋아요 누른 매물, 오래 들여다본 사진, 실제로 구매한 물건까지 — 당신의 모든 행동이 한 장 한 장 겹쳐 쌓이며 취향의 판형을 만들어요.",
    bullets: ["찜 목록 자동 분석", "클릭·체류 패턴 추적", "구매 이력 기반 취향 갱신"],
    accent: "pink",
    visual: "learn",
  },
  {
    id: "match",
    number: "02",
    eyebrow: "PLATE 02 · AI 매칭",
    title: "수만 장 중 딱 한 장을 골라냅니다",
    desc: "매일 쏟아지는 매물 더미에서 AI가 당신의 판형과 겹쳐지는 단 하나를 찾아 인쇄해 보내드려요. 색이 맞아야 겹쳐 찍히듯, 취향이 맞아야 매칭돼요.",
    bullets: ["수만 건 실시간 매물 스캔", "취향 판형과 자동 대조", "상위 매칭만 선별 노출"],
    accent: "blue",
    visual: "match",
  },
  {
    id: "trust",
    number: "03",
    eyebrow: "PLATE 03 · 신뢰 검증",
    title: "믿을 수 있는 물건에만 도장을 찍습니다",
    desc: "상태, 가격, 판매자 이력까지 3중으로 확인한 매물에만 신뢰의 도장을 찍어요. 도장 없는 매물은 애초에 당신 앞에 나타나지 않아요.",
    bullets: ["상태 사진·설명 교차 검증", "시세 대비 가격 적정성 분석", "판매자 거래 이력 조회"],
    accent: "pink",
    visual: "trust",
  },
  {
    id: "alert",
    number: "04",
    eyebrow: "PLATE 04 · 실시간 알림",
    title: "가격이 움직이면, 곧바로 인쇄됩니다",
    desc: "찜한 물건 가격이 내려가는 순간, 취향에 맞는 새 매물이 올라오는 순간 — 잉크가 마르기도 전에 알려드려요.",
    bullets: ["가격 하락 즉시 알림", "신규 매칭 실시간 푸시", "관심 매물 변동 추적"],
    accent: "blue",
    visual: "alert",
  },
];

export default function Landing() {
  return (
    <div className="riso-page relative min-h-screen overflow-x-hidden bg-[var(--paper)] text-[var(--ink)]">
      <style>{`
        .riso-page {
          --paper: oklch(96% 0.02 85);
          --paper-card: oklch(93% 0.025 83);
          --paper-tape: oklch(88% 0.025 80);
          --ink: oklch(18% 0.02 270);
          --ink-soft: oklch(40% 0.03 270);
          --pink: oklch(74% 0.22 355);
          --pink-deep: oklch(50% 0.24 355);
          --blue: oklch(58% 0.14 245);
          --blue-deep: oklch(38% 0.13 245);
          --on-solid: oklch(99% 0.005 90);
        }

        .riso-grain {
          position: fixed;
          inset: 0;
          z-index: 40;
          pointer-events: none;
          opacity: 0.05;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 220px 220px;
        }

        .riso-misprint {
          text-shadow: 3px 3px 0 var(--pink), -3px -3px 0 var(--blue);
        }
        .riso-misprint-sm {
          text-shadow: 2px 2px 0 var(--pink), -2px -2px 0 var(--blue);
        }

        .riso-focus:focus-visible {
          outline: 3px solid var(--ink);
          outline-offset: 2px;
          border-radius: 2px;
        }

        .riso-btn {
          border: 2px solid var(--ink);
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        .riso-btn-solid {
          background: var(--pink-deep);
          color: var(--on-solid);
          box-shadow: 4px 4px 0 0 var(--blue-deep);
        }
        .riso-btn-solid:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 0 var(--blue-deep); }
        .riso-btn-solid:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0 0 var(--blue-deep); }

        .riso-btn-outline {
          background: var(--paper);
          color: var(--ink);
          box-shadow: 4px 4px 0 0 var(--pink-deep);
        }
        .riso-btn-outline:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 0 var(--pink-deep); }
        .riso-btn-outline:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0 0 var(--pink-deep); }

        .riso-frame {
          border: 2px solid var(--ink);
          background: var(--paper-card);
        }
        .riso-frame-pink { box-shadow: 8px 8px 0 0 var(--pink); }
        .riso-frame-blue { box-shadow: 8px 8px 0 0 var(--blue); }

        .riso-tape {
          background: repeating-linear-gradient(
            45deg,
            oklch(90% 0.02 85 / 0.9),
            oklch(90% 0.02 85 / 0.9) 4px,
            oklch(82% 0.02 82 / 0.65) 4px,
            oklch(82% 0.02 82 / 0.65) 8px
          );
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.18);
        }

        .halftone-pink {
          background-image: radial-gradient(var(--pink) 1.3px, transparent 1.5px);
          background-size: 8px 8px;
          opacity: 0.4;
          mix-blend-mode: multiply;
        }
        .halftone-blue {
          background-image: radial-gradient(var(--blue) 1.3px, transparent 1.5px);
          background-size: 8px 8px;
          opacity: 0.4;
          mix-blend-mode: multiply;
        }

        .riso-hero-halo {
          background: radial-gradient(circle, var(--pink) 0%, transparent 62%);
          mix-blend-mode: multiply;
          opacity: 0.55;
        }
        .riso-hero-halo-blue {
          background: radial-gradient(circle, var(--blue) 0%, transparent 62%);
          mix-blend-mode: multiply;
          opacity: 0.5;
        }

        .riso-stamp-ring {
          border: 3px dashed var(--ink);
        }

        .riso-pulse-ring {
          animation: riso-pulse 2.6s ease-out infinite;
        }
        .riso-pulse-ring-delay {
          animation: riso-pulse 2.6s ease-out infinite;
          animation-delay: 0.9s;
        }
        @keyframes riso-pulse {
          0% { transform: scale(0.75); opacity: 0.65; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .riso-pulse-ring, .riso-pulse-ring-delay { animation: none; opacity: 0.35; }
        }

        details.riso-faq summary::-webkit-details-marker { display: none; }
      `}</style>

      <div aria-hidden="true" className="riso-grain" />

      <div className="relative">
        {/* header */}
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <span className="riso-misprint-sm font-mono text-lg font-black tracking-tight">
            repick
          </span>
          <a
            href="#cta"
            className="riso-btn riso-btn-outline riso-focus px-4 py-2 text-xs font-bold sm:text-sm"
          >
            무료로 시작하기
          </a>
        </header>

        <main>
          {/* hero */}
          <section className="relative mx-auto max-w-3xl px-4 pb-14 pt-8 text-center sm:px-6 lg:px-8">
            <div
              aria-hidden="true"
              className="riso-hero-halo pointer-events-none absolute left-1/2 top-4 h-72 w-72 -translate-x-1/2 rounded-full sm:h-96 sm:w-96"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-2 top-2 font-mono text-lg text-[var(--ink-soft)] opacity-60 sm:left-6"
            >
              ✛
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-2 top-2 font-mono text-lg text-[var(--ink-soft)] opacity-60 sm:right-6"
            >
              ✛
            </span>

            <span className="riso-btn riso-btn-outline inline-block -rotate-2 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest sm:text-xs">
              REPICK ZINE · ISSUE NO.04 · FEATURES
            </span>

            <h1 className="riso-misprint relative mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              당신이 찜한 순간,
              <br />
              우리는 겹쳐 찍습니다
            </h1>

            <p className="relative mt-5 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
              클릭 한 번, 찜 하나가 당신만의 잉크가 됩니다. AI가 그 위에 매칭을
              겹쳐 찍고, 신뢰의 도장을 찍고, 알림을 인쇄해 보내드려요.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#cta"
                className="riso-btn riso-btn-solid riso-focus px-6 py-3 text-sm font-bold"
              >
                무료로 시작하기 →
              </a>
              <a
                href="#features"
                className="riso-btn riso-btn-outline riso-focus px-6 py-3 text-sm font-bold"
              >
                네 가지 기능 보기
              </a>
            </div>
          </section>

          {/* torn / cut divider */}
          <div
            aria-hidden="true"
            className="mx-auto flex max-w-4xl items-center gap-3 px-4 pb-10 font-mono text-[11px] text-[var(--ink-soft)] sm:px-6"
          >
            <span className="h-0 flex-1 border-t border-dashed border-[var(--ink)] opacity-30" />
            <span>✂ 여기서부터 한 장씩 오려보세요</span>
            <span className="h-0 flex-1 border-t border-dashed border-[var(--ink)] opacity-30" />
          </div>

          {/* features */}
          <section id="features" className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
            <h2 className="mb-14 text-center text-2xl font-black tracking-tight sm:text-3xl">
              네 장으로 겹쳐 찍는 핵심 기능
            </h2>

            <div className="flex flex-col gap-20 sm:gap-24">
              {features.map((feature, i) => (
                <article
                  key={feature.id}
                  className={`flex flex-col gap-8 md:items-center md:gap-14 ${
                    i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  {/* visual */}
                  <div className="relative mx-auto w-full max-w-xs shrink-0 md:mx-0 md:w-1/2 md:max-w-sm">
                    <span
                      aria-hidden="true"
                      className="riso-tape absolute -top-3 left-8 z-10 h-6 w-14 -rotate-6"
                    />
                    <span
                      aria-hidden="true"
                      className="riso-tape absolute -bottom-3 right-8 z-10 h-6 w-14 rotate-3"
                    />
                    <div
                      className={`riso-frame riso-frame-${feature.accent} relative aspect-square overflow-hidden`}
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute inset-0 ${
                          feature.accent === "pink" ? "halftone-blue" : "halftone-pink"
                        }`}
                      />
                      <div className="relative flex h-full items-center justify-center p-6">
                        <FeatureVisual variant={feature.visual} accent={feature.accent} />
                      </div>
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex flex-col gap-4 md:w-1/2">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="riso-misprint-sm font-mono text-3xl font-black leading-none sm:text-4xl"
                      >
                        {feature.number}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--ink-soft)] sm:text-xs">
                        {feature.eyebrow}
                      </span>
                    </div>

                    <h3 className="text-xl font-black leading-snug tracking-tight sm:text-2xl">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                      {feature.desc}
                    </p>

                    <ul className="mt-1 flex flex-col gap-2.5">
                      {feature.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm">
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[var(--ink)] text-[10px] font-black ${
                              feature.accent === "pink" ? "bg-[var(--pink)]" : "bg-[var(--blue)]"
                            }`}
                          >
                            ✓
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* final CTA */}
          <section id="cta" className="mx-auto max-w-4xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="riso-frame riso-frame-blue relative overflow-hidden p-10 text-center sm:p-14">
              <div aria-hidden="true" className="halftone-pink absolute inset-0" />
              <div className="relative flex flex-col items-center gap-5">
                <span aria-hidden="true" className="text-4xl">
                  🖨️
                </span>
                <h2 className="riso-misprint-sm text-2xl font-black tracking-tight sm:text-3xl">
                  지금, 취향을 첫 장으로 인쇄해보세요
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
                  가입은 30초, 카드 등록은 필요 없어요. 찜 하나만 눌러도 인쇄는
                  시작됩니다.
                </p>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#signup"
                    className="riso-btn riso-btn-solid riso-focus px-8 py-3.5 text-sm font-bold"
                  >
                    무료로 시작하기 →
                  </a>
                  <a
                    href="#pricing"
                    className="riso-btn riso-btn-outline riso-focus px-8 py-3.5 text-sm font-bold"
                  >
                    요금제 보기
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t-2 border-dashed border-[var(--ink)]/25 px-4 py-8 text-center font-mono text-[11px] text-[var(--ink-soft)] sm:px-6 lg:px-8">
          REPICK ZINE · ISSUE NO.04 · FEATURES · © 2026 repick — 리소그래프
          감성으로, 디지털로 인쇄함
        </footer>
      </div>
    </div>
  );
}

function FeatureVisual({ variant, accent }: { variant: VisualVariant; accent: Accent }) {
  const other: Accent = accent === "pink" ? "blue" : "pink";

  if (variant === "learn") {
    const hearts = [true, false, true, true, false, true, false, false, true];
    return (
      <div aria-hidden="true" className="grid grid-cols-3 gap-3 sm:gap-4">
        {hearts.map((filled, i) => (
          <span
            key={i}
            className="flex h-8 w-8 items-center justify-center text-xl sm:h-10 sm:w-10 sm:text-2xl"
            style={{
              opacity: filled ? 1 : 0.28,
              transform: `rotate(${(i % 3) * 6 - 6}deg)`,
              color: filled ? `var(--${accent}-deep)` : "var(--ink-soft)",
            }}
          >
            {filled ? "♥" : "♡"}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "match") {
    const cells = Array.from({ length: 16 });
    const matchIndex = 9;
    return (
      <div aria-hidden="true" className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {cells.map((_, i) =>
          i === matchIndex ? (
            <span
              key={i}
              className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-black sm:h-7 sm:w-7"
              style={{
                background: `var(--${accent}-deep)`,
                color: "var(--on-solid)",
                boxShadow: `0 0 0 3px var(--${other})`,
              }}
            >
              ◉
            </span>
          ) : (
            <span
              key={i}
              className="flex h-6 w-6 items-center justify-center text-[10px] opacity-35 sm:h-7 sm:w-7"
              style={{ color: "var(--ink-soft)" }}
            >
              ▪
            </span>
          )
        )}
      </div>
    );
  }

  if (variant === "trust") {
    return (
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        <div
          aria-hidden="true"
          className="riso-stamp-ring absolute inset-0 rounded-full opacity-70"
          style={{ borderColor: `var(--${other})`, transform: "translate(-4px,-3px) rotate(-6deg)" }}
        />
        <div
          className="riso-stamp-ring relative flex h-full w-full -rotate-3 flex-col items-center justify-center gap-1 rounded-full"
          style={{ borderColor: "var(--ink)" }}
        >
          <span className="text-3xl font-black sm:text-4xl" style={{ color: `var(--${accent}-deep)` }} aria-hidden="true">
            ✓
          </span>
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--ink-soft)] sm:text-[10px]">
            3중 검증필
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
      <span
        aria-hidden="true"
        className="riso-pulse-ring absolute h-20 w-20 rounded-full border-2 sm:h-24 sm:w-24"
        style={{ borderColor: `var(--${accent})` }}
      />
      <span
        aria-hidden="true"
        className="riso-pulse-ring-delay absolute h-20 w-20 rounded-full border-2 sm:h-24 sm:w-24"
        style={{ borderColor: `var(--${other})` }}
      />
      <span
        className="relative flex h-16 w-16 items-center justify-center rounded-full text-2xl sm:h-20 sm:w-20 sm:text-3xl"
        style={{ background: "var(--paper)", border: "2px solid var(--ink)" }}
        aria-hidden="true"
      >
        🔔
      </span>
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-[var(--on-solid)] sm:right-6 sm:top-6"
        style={{ background: "var(--pink-deep)" }}
      >
        !
      </span>
    </div>
  );
}
