export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-10">
          <span className="text-sm font-semibold tracking-[-0.01em]">repick</span>
          <nav className="hidden items-center gap-8 text-sm font-normal text-[#A1A1AA] md:flex">
            <a href="#value" className="transition-colors hover:text-white">
              가치
            </a>
            <a href="#proof" className="transition-colors hover:text-white">
              신뢰
            </a>
            <a href="#cta" className="transition-colors hover:text-white">
              시작하기
            </a>
          </nav>
          <a
            href="#cta"
            className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold tracking-[0.02em] text-white transition-colors hover:border-white/30"
          >
            무료로 시작
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-[1200px] px-6 pt-24 pb-28 lg:px-10 lg:pt-36 lg:pb-40">
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.24em] text-[#A1A1AA]">
          {"{ AI 리커머스 큐레이션 }"}
        </p>
        <h1 className="max-w-[16ch] text-[clamp(2.75rem,7.5vw,7.5rem)] font-extrabold leading-[0.94] tracking-[-0.04em]">
          버려질 뻔한 것들,
          <br />
          <span className="text-[#6E56CF]">다시</span>, 고르다.
        </h1>
        <p className="mt-10 max-w-[46ch] text-lg font-normal leading-[1.6] text-[#A1A1AA] lg:text-xl">
          AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시 골라드립니다.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-5">
          <a
            href="#cta"
            className="rounded-full bg-[#6E56CF] px-7 py-3.5 text-sm font-semibold tracking-[-0.005em] text-white transition-opacity hover:opacity-90"
          >
            무료로 시작하기
          </a>
          <a
            href="#value"
            className="text-sm font-semibold tracking-[-0.005em] text-[#A1A1AA] transition-colors hover:text-white"
          >
            어떻게 작동하나요 →
          </a>
        </div>
      </section>

      {/* Value 3-split */}
      <section id="value" className="border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 lg:py-32">
          <h2 className="max-w-[20ch] text-[clamp(1.75rem,3.2vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
            세 가지 방식으로 다시 고릅니다
          </h2>
          <div className="mt-16 grid grid-cols-1 gap-14 md:grid-cols-3 md:gap-10">
            {[
              {
                n: "01",
                t: "취향 학습",
                d: "찜, 클릭, 구매 이력을 분석해 당신만의 취향 그래프를 만듭니다.",
              },
              {
                n: "02",
                t: "AI 큐레이션",
                d: "수만 개 매물 중 조건과 취향에 맞는 상품만 골라 보여줍니다.",
              },
              {
                n: "03",
                t: "신뢰 검증",
                d: "상태, 가격, 판매자 신뢰도를 함께 점검해 안심하고 고를 수 있게 합니다.",
              },
            ].map((item) => (
              <div key={item.n} className="border-t border-white/10 pt-6">
                <span
                  aria-hidden="true"
                  className="block text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] text-white/20"
                >
                  {item.n}
                </span>
                <h3 className="mt-6 text-base font-semibold tracking-[-0.01em] text-white">
                  {item.t}
                </h3>
                <p className="mt-3 text-sm font-normal leading-[1.6] text-[#A1A1AA]">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="proof" className="border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 lg:py-32">
          <blockquote className="max-w-[28ch] text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
            "버릴 생각만 하던 물건을 <span className="text-[#6E56CF]">다시</span> 찾아준 첫
            서비스."
          </blockquote>
          <p className="mt-6 text-sm font-normal tracking-[-0.005em] text-[#A1A1AA]">
            김OO · repick 베타 사용자
          </p>

          <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-12 sm:grid-cols-4">
            {[
              { v: "12,400+", l: "누적 리픽 완료" },
              { v: "98%", l: "취향 일치 만족도" },
              { v: "4.8/5", l: "평균 평점" },
              { v: "32%", l: "평균 절감 비용" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-extrabold tracking-[-0.02em]">
                  {s.v}
                </p>
                <p className="mt-2 text-xs font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 py-28 text-center lg:px-10 lg:py-40">
          <h2 className="mx-auto max-w-[18ch] text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold leading-[0.98] tracking-[-0.03em]">
            지금, 당신을 위해
            <br />
            <span className="text-[#6E56CF]">다시 고를</span> 시간
          </h2>
          <a
            href="#"
            className="mt-12 inline-block rounded-full bg-[#6E56CF] px-9 py-4 text-sm font-semibold tracking-[-0.005em] text-white transition-opacity hover:opacity-90"
          >
            무료로 시작하기
          </a>
          <p className="mt-6 text-xs font-normal tracking-[-0.005em] text-[#A1A1AA]">
            신용카드 없이 바로 시작 · 언제든 해지 가능
          </p>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-normal text-[#A1A1AA] lg:flex-row lg:px-10">
          <span>© 2026 repick. All rights reserved.</span>
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
