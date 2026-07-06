export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* Masthead */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-10">
          <span className="text-sm font-semibold tracking-[0.06em]">REPICK</span>
          <span className="hidden text-xs font-normal uppercase tracking-[0.2em] text-[#A1A1AA] sm:block">
            Vol. 01 — 다시 고르는 계절
          </span>
          <a
            href="#cta"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-[0.02em] text-white transition-colors hover:border-white/30"
          >
            무료로 시작
          </a>
        </div>
      </header>

      {/* Hero — 표지 + 목차 구조 */}
      <section id="hero" className="border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-6 pt-20 pb-24 lg:px-10 lg:pt-28 lg:pb-32">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
            {/* 표지 헤드라인 */}
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
                표지 — 다시, 고르다는 것
              </p>
              <h1 className="mt-6 max-w-[16ch] font-serif text-[clamp(2.75rem,6.5vw,5.75rem)] font-normal leading-[1.04] tracking-[-0.01em]">
                버려질 뻔한 것들, <em className="text-[#6E56CF] not-italic">다시</em> 고르다
              </h1>
              <p className="mt-8 max-w-[42ch] text-base font-normal leading-[1.7] text-[#A1A1AA]">
                AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시
                골라드립니다.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a
                  href="#cta"
                  className="rounded-full bg-[#6E56CF] px-7 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  무료로 시작하기
                </a>
                <a
                  href="#value"
                  className="text-sm font-semibold text-[#A1A1AA] transition-colors hover:text-white"
                >
                  목차 훑어보기 ↓
                </a>
              </div>
            </div>

            {/* 목차 패널 (Index) */}
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
                이 호에서
              </p>
              <div className="mt-6 flex flex-col">
                {[
                  {
                    n: "01",
                    label: "방식",
                    title: "세 가지 방식으로 다시 고르는 법",
                    href: "#value",
                  },
                  {
                    n: "02",
                    label: "신뢰",
                    title: "먼저 다시 고른 사람들의 이야기",
                    href: "#proof",
                  },
                  {
                    n: "03",
                    label: "시작",
                    title: "지금, 당신을 위해 다시 고를 시간",
                    href: "#cta",
                  },
                ].map((item) => (
                  <a
                    key={item.n}
                    href={item.href}
                    className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-white/10 py-5 first:border-t-0"
                  >
                    <span className="text-xs font-bold tabular-nums text-[#A1A1AA]">
                      {item.n}
                    </span>
                    <span className="font-serif text-lg font-normal leading-snug text-white transition-colors group-hover:text-[#6E56CF]">
                      {item.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden flex-1 self-end border-b border-dotted border-white/20 sm:block"
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 가치 3분할 — Entries */}
      <section id="value" className="border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24 lg:px-10 lg:py-32">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
            <h2 className="max-w-[24ch] font-serif text-[clamp(1.75rem,3.2vw,2.75rem)] font-normal leading-[1.1] tracking-[-0.01em]">
              01 — 세 가지 방식으로 다시 고릅니다
            </h2>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A1A1AA]">
              Entries
            </span>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-3 lg:gap-14">
            {[
              {
                n: "A",
                title: "취향 학습",
                body: "찜, 클릭, 구매 이력을 분석해 당신만의 취향 그래프를 만듭니다.",
              },
              {
                n: "B",
                title: "AI 큐레이션",
                body: "수만 개 매물 중 조건과 취향에 맞는 상품만 골라 보여줍니다.",
              },
              {
                n: "C",
                title: "신뢰 검증",
                body: "상태, 가격, 판매자 신뢰도를 함께 점검합니다.",
              },
            ].map((item) => (
              <div key={item.n} className="relative pl-8">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 text-xs font-bold text-white/25"
                >
                  {item.n}
                </span>
                <h3 className="font-serif text-xl font-normal tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-3 max-w-[30ch] text-sm font-normal leading-[1.7] text-[#A1A1AA]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 소셜프루프 — Pull-quote spread */}
      <section id="proof" className="border-b border-white/10">
        <div className="mx-auto max-w-[900px] px-6 py-24 text-center lg:px-10 lg:py-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
            02 — 신뢰
          </p>

          <div className="mt-10 border-t border-white/10 pt-10">
            <blockquote className="font-serif text-[clamp(1.75rem,3.6vw,3rem)] font-normal italic leading-[1.3] tracking-[-0.01em]">
              “버릴 생각만 하던 물건을{" "}
              <span className="text-[#6E56CF] not-italic">다시</span> 찾아준 첫 서비스.”
            </blockquote>
            <p className="mt-6 text-sm font-normal text-[#A1A1AA]">김OO · repick 베타 사용자</p>
          </div>

          <div className="mt-16 flex flex-wrap items-start justify-center gap-x-12 gap-y-8 border-t border-white/10 pt-10">
            {[
              { v: "12,400+", l: "누적 리픽 완료" },
              { v: "98%", l: "취향 일치 만족도" },
              { v: "4.8/5", l: "평균 평점" },
              { v: "32%", l: "평균 절감 비용" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold tracking-[-0.01em]">{s.v}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A1A1AA]">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 마무리 CTA — Colophon */}
      <section id="cta" className="border-b border-white/10">
        <div className="mx-auto max-w-[1280px] px-6 py-28 text-center lg:px-10 lg:py-36">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#A1A1AA]">
            03 — 시작
          </p>
          <h2 className="mx-auto mt-6 max-w-[18ch] font-serif text-[clamp(2.25rem,5.5vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.01em]">
            지금, 당신을 위해 <span className="text-[#6E56CF]">다시 고를</span> 시간
          </h2>
          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href="#"
              className="rounded-full bg-[#6E56CF] px-9 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              무료로 시작하기
            </a>
            <p className="text-xs font-normal text-[#A1A1AA]">
              신용카드 없이 바로 시작 · 언제든 해지 가능
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-normal text-[#A1A1AA] lg:flex-row lg:px-10">
          <span>© 2026 REPICK — Vol. 01</span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              이용약관
            </a>
            <a href="#" className="transition-colors hover:text-white">
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
