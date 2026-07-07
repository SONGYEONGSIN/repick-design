const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0d78c] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f16] rounded-[2px]";

function zigzagPath(steps: number, amp: number) {
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = i % 2 === 0 ? 0 : amp;
    pts.push(`${x}% ${y}%`);
  }
  pts.push("100% 100%", "0% 100%");
  return `polygon(${pts.join(", ")})`;
}
const ZIGZAG = zigzagPath(28, 100);

function CornerFan({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posClass = {
    tl: "left-2 top-2",
    tr: "right-2 top-2",
    bl: "left-2 bottom-2",
    br: "right-2 bottom-2",
  }[position];
  const origin = {
    tl: "0% 0%",
    tr: "100% 0%",
    bl: "0% 100%",
    br: "100% 100%",
  }[position];
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 h-10 w-10 sm:h-14 sm:w-14 ${posClass}`}
      style={{
        background: `repeating-conic-gradient(from 0deg at ${origin}, var(--gold) 0deg 3deg, transparent 3deg 12deg)`,
        opacity: 0.75,
      }}
    />
  );
}

function FanCards() {
  const cards = [
    { icon: "♥", rot: -16, tint: "var(--emerald-2)" },
    { icon: "◈", rot: 0, tint: "var(--emerald)" },
    { icon: "✦", rot: 16, tint: "var(--emerald-2)" },
  ];
  return (
    <div aria-hidden="true" className="relative mx-auto h-24 w-32">
      {cards.map((c) => (
        <span
          key={c.icon}
          className="absolute left-1/2 top-0 flex h-24 w-16 items-start justify-center rounded-sm border border-[var(--gold)]/60 pt-3 text-lg text-[var(--gold)] shadow-[0_6px_14px_rgba(0,0,0,0.45)]"
          style={{
            background: c.tint,
            transform: `translateX(-50%) rotate(${c.rot}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          {c.icon}
        </span>
      ))}
    </div>
  );
}

function ConvergeGem() {
  return (
    <div aria-hidden="true" className="relative mx-auto flex h-24 w-40 items-center justify-center">
      <div className="absolute left-0 flex h-16 flex-col justify-between">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]/50" />
        ))}
      </div>
      <div className="absolute left-8 right-9 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-[var(--gold)]/10 via-[var(--gold)]/60 to-[var(--gold)]" />
      <span className="absolute right-0 h-8 w-8 rotate-45 border border-[var(--gold)] bg-[var(--gold-light)] shadow-[0_0_18px_rgba(201,162,39,0.75)]" />
    </div>
  );
}

function SealMedallion() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-24 w-24">
      <span
        className="absolute -bottom-4 left-1/2 h-7 w-4 -translate-x-[calc(50%+9px)] bg-[var(--gold)]/70"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)" }}
      />
      <span
        className="absolute -bottom-4 left-1/2 h-7 w-4 translate-x-[calc(-50%+9px)] bg-[var(--gold)]/70"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%)" }}
      />
      <span className="absolute inset-0 rounded-full border-[3px] border-double border-[var(--gold)] bg-[var(--emerald)]" />
      <span className="absolute inset-3 rounded-full border border-[var(--gold)]/60" />
      <span className="absolute inset-0 flex items-center justify-center text-[10px] tracking-[0.25em] text-[var(--gold)]">
        검증
      </span>
    </div>
  );
}

function PulseRings() {
  return (
    <div aria-hidden="true" className="relative mx-auto flex h-24 w-24 items-center justify-center">
      <span className="pulse-ring absolute h-24 w-24 rounded-full border border-[var(--gold)]/30" />
      <span
        className="pulse-ring absolute h-16 w-16 rounded-full border border-[var(--gold)]/50"
        style={{ animationDelay: "0.7s" }}
      />
      <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--gold)] text-sm text-[var(--emerald)]">
        ▲
      </span>
    </div>
  );
}

function Visual({ kind }: { kind: "fan" | "gem" | "seal" | "pulse" }) {
  if (kind === "fan") return <FanCards />;
  if (kind === "gem") return <ConvergeGem />;
  if (kind === "seal") return <SealMedallion />;
  return <PulseRings />;
}

const acts = [
  {
    id: "act-1",
    roman: "I",
    glyph: "♥",
    tag: "취향 학습",
    headline: "당신의 손끝이 대본이 됩니다",
    desc: "찜한 순간, 스친 클릭, 완결된 구매 — 모든 몸짓을 기록해 무대 뒤에서 취향의 각본을 씁니다.",
    toc: "찜·클릭·구매를 읽다",
    visual: "fan" as const,
  },
  {
    id: "act-2",
    roman: "II",
    glyph: "◈",
    tag: "AI 매칭",
    headline: "수만 개의 막(幕) 중, 단 하나의 스포트라이트",
    desc: "매일 쏟아지는 수만 건의 매물 가운데, 알고리즘이 당신만을 위한 한 벌을 조명 아래로 불러옵니다.",
    toc: "수만 매물 중 단 하나",
    visual: "gem" as const,
  },
  {
    id: "act-3",
    roman: "III",
    glyph: "✦",
    tag: "신뢰 검증",
    headline: "무대에 오르기 전, 검증이라는 리허설",
    desc: "상태·가격·판매자 이력을 삼중으로 심사해, 커튼이 오르기 전 흠결 없는 프로덕션만 통과시킵니다.",
    toc: "상태·가격·판매자 심사",
    visual: "seal" as const,
  },
  {
    id: "act-4",
    roman: "IV",
    glyph: "🔔",
    tag: "실시간 알림",
    headline: "커튼콜은 예고 없이 옵니다",
    desc: "가격이 떨어지는 순간, 새 매칭이 열리는 순간 — 막이 오르기 직전, 가장 먼저 벨을 울려드립니다.",
    toc: "가격 하락·신규 매칭 벨",
    visual: "pulse" as const,
  },
];

export default function Landing() {
  return (
    <div
      className="deco-stage relative min-h-screen overflow-x-clip pb-10"
      style={{ fontFamily: "Georgia, 'Times New Roman', 'Palatino Linotype', serif" }}
    >
      <style>{`
        .deco-stage {
          --gold: #c9a227;
          --gold-light: #f0d78c;
          --gold-deep: #8a6d1a;
          --emerald: #0a1f16;
          --emerald-2: #123b2b;
          --cream: #f4ead0;
          color: var(--cream);
          background:
            radial-gradient(ellipse 900px 520px at 50% -8%, rgba(240,215,140,0.18), transparent 60%),
            repeating-linear-gradient(45deg, rgba(201,162,39,0.05) 0px, rgba(201,162,39,0.05) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(-45deg, rgba(201,162,39,0.05) 0px, rgba(201,162,39,0.05) 1px, transparent 1px, transparent 28px),
            linear-gradient(180deg, #050d09 0%, #0a1f16 42%, #0d2b1f 100%);
        }
        .gold-text {
          background: linear-gradient(180deg, #f7e6ad 0%, #c9a227 55%, #8a6d1a 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .deco-frame {
          position: relative;
          border: 1px solid var(--gold);
          outline: 1px solid rgba(201,162,39,0.55);
          outline-offset: 7px;
          background: linear-gradient(180deg, rgba(18,59,43,0.55), rgba(5,13,9,0.75));
          box-shadow: 0 16px 36px rgba(0,0,0,0.5);
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.7); opacity: 0.85; }
          100% { transform: scale(1.25); opacity: 0; }
        }
        .pulse-ring { animation: pulse-ring 2.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pulse-ring { animation: none; opacity: 0.35; }
        }
      `}</style>

      {/* HEADER */}
      <header className="relative z-30 px-4 pt-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="deco-frame px-4 py-2">
            <span className="text-sm font-bold tracking-[0.35em] text-[var(--gold-light)]">REPICK</span>
          </div>
          <nav aria-label="주 메뉴" className="flex flex-wrap gap-5 text-xs tracking-[0.2em] sm:text-sm">
            {[
              { href: "#program", label: "PROGRAMME" },
              { href: "#acts", label: "막(ACTS)" },
              { href: "#cta", label: "입장하기" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`border-b border-dotted border-[var(--gold)]/50 pb-0.5 text-[var(--cream)]/85 hover:border-solid hover:text-[var(--gold-light)] ${focusRing}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center sm:px-8 sm:pt-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-70 sm:h-[560px] sm:w-[560px]"
            style={{
              background:
                "repeating-conic-gradient(from 0deg, var(--gold) 0deg 2.2deg, transparent 2.2deg 12deg)",
              maskImage: "radial-gradient(circle, black 52%, transparent 76%)",
              WebkitMaskImage: "radial-gradient(circle, black 52%, transparent 76%)",
            }}
          />
          <div className="relative mx-auto max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-3 text-[11px] tracking-[0.5em] text-[var(--gold)] sm:text-xs">
              <span className="h-px w-8 bg-[var(--gold)]" aria-hidden="true" />
              REPICK PRESENTS
              <span className="h-px w-8 bg-[var(--gold)]" aria-hidden="true" />
            </p>
            <h1 className="gold-text text-4xl font-bold leading-[1.15] sm:text-6xl">취향이 오르는 무대</h1>
            <p className="mt-6 text-sm leading-relaxed tracking-wide text-[var(--cream)]/85 sm:text-base">
              AI가 각본을 쓰고, 신뢰가 리허설을 하고, 알림이 커튼콜을 알리는
              <br className="hidden sm:block" />
              네 개의 막으로 완성되는 중고 큐레이션
            </p>
            <div
              className="mx-auto mt-10 h-3 w-40"
              style={{ clipPath: ZIGZAG, background: "var(--gold)" }}
              aria-hidden="true"
            />
          </div>
        </section>

        {/* PROGRAMME (목차) */}
        <section id="program" aria-labelledby="program-heading" className="relative px-4 pb-16 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <h2
              id="program-heading"
              className="text-center text-xs tracking-[0.4em] text-[var(--gold)] sm:text-sm"
            >
              오늘의 상연 프로그램
            </h2>
            <div className="deco-frame mt-8 px-6 py-6 sm:px-10 sm:py-8">
              <ul className="divide-y divide-[var(--gold)]/20">
                {acts.map((act) => (
                  <li key={act.id}>
                    <a
                      href={`#${act.id}`}
                      className={`group flex items-baseline gap-3 py-3 ${focusRing}`}
                    >
                      <span className="shrink-0 text-xs tracking-[0.3em] text-[var(--gold)]">
                        ACT {act.roman}
                      </span>
                      <span
                        className="mb-1 flex-1 border-b border-dotted border-[var(--gold)]/40"
                        aria-hidden="true"
                      />
                      <span className="shrink-0 text-xs text-[var(--cream)]/70 group-hover:text-[var(--gold-light)] sm:text-sm">
                        {act.toc}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ACTS */}
        <section id="acts" aria-labelledby="acts-heading" className="relative px-4 pb-20 sm:px-8">
          <h2 id="acts-heading" className="sr-only">
            repick 네 개의 막
          </h2>
          <ol className="mx-auto flex max-w-3xl flex-col gap-14 sm:gap-20">
            {acts.map((act) => (
              <li key={act.id} id={act.id} className="scroll-mt-24">
                <div className="deco-frame px-6 py-10 sm:px-14 sm:py-14">
                  <CornerFan position="tl" />
                  <CornerFan position="tr" />
                  <CornerFan position="bl" />
                  <CornerFan position="br" />

                  <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-12">
                    <div className="mx-auto flex flex-col items-center gap-5">
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "repeating-conic-gradient(from 0deg, var(--gold) 0deg 3deg, transparent 3deg 14deg)",
                          }}
                        />
                        <span className="absolute inset-3 flex items-center justify-center rounded-full bg-[var(--emerald)] text-3xl">
                          {act.glyph}
                        </span>
                      </div>
                      <Visual kind={act.visual} />
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-[11px] tracking-[0.45em] text-[var(--gold)] sm:text-xs">
                        ACT {act.roman} — {act.tag}
                      </p>
                      <h3 className="mt-3 text-2xl font-bold leading-snug text-[var(--cream)] sm:text-3xl">
                        {act.headline}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-[var(--cream)]/80 sm:text-base">
                        {act.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* CTA */}
        <section id="cta" aria-labelledby="cta-heading" className="relative px-4 pb-24 sm:px-8">
          <div className="mx-auto max-w-xl text-center">
            <div
              className="mx-auto mb-8 h-3 w-40"
              style={{ clipPath: ZIGZAG, background: "var(--gold)" }}
              aria-hidden="true"
            />
            <div className="deco-frame relative px-6 py-12 sm:px-12">
              <CornerFan position="tl" />
              <CornerFan position="tr" />
              <CornerFan position="bl" />
              <CornerFan position="br" />
              <h2 id="cta-heading" className="gold-text text-2xl font-bold sm:text-3xl">
                지금, 객석에 착석하세요
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--cream)]/85 sm:text-base">
                막은 이미 올랐습니다. 네 개의 액트가 당신을 기다립니다.
              </p>
              <a
                href="#"
                className={`mt-8 inline-flex items-center gap-3 border border-[var(--gold)] bg-[var(--gold)] px-8 py-3 text-sm font-bold tracking-[0.15em] text-[var(--emerald)] transition-colors hover:bg-[var(--gold-light)] ${focusRing}`}
              >
                무료로 입장하기 <span aria-hidden="true">◆</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative px-4 pb-10 text-center sm:px-8">
        <div
          className="mx-auto mb-4 h-px w-24 bg-[var(--gold)]/50"
          aria-hidden="true"
        />
        <p className="text-[11px] tracking-[0.3em] text-[var(--cream)]/60">
          © 2026 REPICK — ALL ACTS RESERVED
        </p>
      </footer>
    </div>
  );
}
