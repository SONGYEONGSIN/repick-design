export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased selection:bg-[#6E56CF] selection:text-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b-4 border-white bg-[#0B0B0F]">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-5 lg:px-10">
          <span className="flex items-center gap-2 text-lg font-black tracking-[-0.02em]">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 bg-[#6E56CF]" />
            repick
          </span>
          <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#A1A1AA] md:flex">
            <a
              href="#value"
              className="rounded-none transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              방식
            </a>
            <a
              href="#proof"
              className="rounded-none transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              신뢰
            </a>
            <a
              href="#cta"
              className="rounded-none transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              시작하기
            </a>
          </nav>
          <a
            href="#cta"
            className="rounded-none border-2 border-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-[#0B0B0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
          >
            무료로 시작
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section id="hero" className="border-b-4 border-white">
          <div className="mx-auto max-w-[1320px] border-y-2 border-white/20 px-6 py-20 lg:px-10 lg:py-28">
            <div className="grid grid-cols-12 gap-x-0 gap-y-14 lg:divide-x-2 lg:divide-white/15">
              <div className="col-span-12 flex items-center gap-2 pr-0 lg:col-span-3 lg:pr-8">
                <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#6E56CF]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A1A1AA]">
                  AI 리커머스 큐레이션
                </p>
              </div>

              <div className="col-span-12 lg:col-span-9 lg:pl-8">
                <h1 className="max-w-[16ch] text-[clamp(2.75rem,9vw,8.5rem)] font-black leading-[0.88] tracking-[-0.04em]">
                  버려질 뻔한 것들,
                  <br />
                  다시, <span className="text-[#6E56CF]">고르다</span>.
                </h1>

                <p className="mt-8 max-w-[42ch] text-base font-normal leading-[1.6] text-[#A1A1AA] lg:text-lg">
                  AI가 당신의 취향을 학습해 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시
                  골라드립니다.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <a
                    href="#cta"
                    className="rounded-none border-2 border-white bg-white px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.08em] text-[#0B0B0F] transition-colors hover:bg-transparent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
                  >
                    무료로 시작하기
                  </a>
                  <a
                    href="#value"
                    className="rounded-none text-sm font-semibold uppercase tracking-[0.08em] text-[#A1A1AA] underline decoration-2 underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
                  >
                    색인 보기 →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value 3-split — inverted stark block */}
        <section id="value" className="border-b-4 border-white bg-white text-[#0B0B0F]">
          <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#6E56CF]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B0B0F]/60">
                세 가지 방식
              </p>
            </div>
            <h2 className="mt-6 max-w-[18ch] text-[clamp(1.9rem,4.2vw,3.5rem)] font-black leading-[1.02] tracking-[-0.02em]">
              세 가지 방식으로 다시 고릅니다
            </h2>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 lg:divide-x-2 lg:divide-[#0B0B0F]/20">
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
                  d: "상태, 가격, 판매자 신뢰도를 함께 점검합니다.",
                },
              ].map((item, i) => (
                <div
                  key={item.n}
                  className={`border-t-4 border-[#0B0B0F] pt-8 ${i > 0 ? "lg:border-t-4 lg:pl-8" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className="block text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-none tracking-[-0.03em] text-[#0B0B0F]/10"
                  >
                    {item.n}
                  </span>
                  <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">{item.t}</h3>
                  <p className="mt-3 max-w-[30ch] text-sm font-normal leading-[1.6] text-[#0B0B0F]/60">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="border-b-4 border-white">
          <div className="mx-auto max-w-[1320px] px-6 py-24 lg:px-10 lg:py-32">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#6E56CF]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#A1A1AA]">
                신뢰
              </p>
            </div>

            <div className="mt-10 grid grid-cols-12 gap-x-0 gap-y-14">
              <div className="col-span-12 lg:col-span-7 lg:pr-10">
                <span
                  aria-hidden="true"
                  className="block text-[clamp(2.5rem,5vw,4rem)] font-black leading-none text-white/15"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 max-w-[28ch] text-[clamp(1.5rem,2.8vw,2.25rem)] font-black leading-[1.15] tracking-[-0.02em]">
                  버릴 생각만 하던 물건을 <span className="text-[#6E56CF]">다시</span> 찾아준 첫
                  서비스.
                </blockquote>
                <p className="mt-6 text-sm font-normal text-[#A1A1AA]">
                  김OO · repick 베타 사용자
                </p>
              </div>

              <div className="col-span-12 lg:col-span-5">
                <div className="grid grid-cols-2 border-2 border-white/20 lg:grid-cols-2">
                  {[
                    { v: "12,400+", l: "누적 리픽 완료" },
                    { v: "98%", l: "취향 일치 만족도" },
                    { v: "4.8/5", l: "평균 평점" },
                    { v: "32%", l: "평균 절감 비용" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="border-b-2 border-r-2 border-white/20 px-6 py-7 [&:nth-child(2n)]:border-r-0 [&:nth-child(n+3)]:border-b-0"
                    >
                      <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] font-black tracking-[-0.02em]">
                        {s.v}
                      </p>
                      <p className="mt-2 text-[11px] font-normal uppercase tracking-[0.12em] text-[#A1A1AA]">
                        {s.l}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA — inverted stark block */}
        <section id="cta" className="border-b-4 border-white bg-white text-[#0B0B0F]">
          <div className="mx-auto max-w-[1320px] px-6 py-28 lg:px-10 lg:py-36">
            <div className="grid grid-cols-12 items-end gap-x-0 gap-y-10">
              <div className="col-span-12 flex items-center gap-2 lg:col-span-3">
                <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-[#6E56CF]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0B0B0F]/60">
                  지금 시작
                </p>
              </div>

              <div className="col-span-12 lg:col-span-9">
                <h2 className="max-w-[18ch] text-[clamp(2.25rem,6.5vw,5.5rem)] font-black leading-[0.96] tracking-[-0.03em] lg:ml-auto lg:text-right">
                  지금, 당신을 위해
                  <br />
                  다시 <span className="text-[#6E56CF]">고를</span> 시간
                </h2>
                <div className="mt-10 flex flex-col items-start gap-4 lg:items-end">
                  <a
                    href="#"
                    className="rounded-none border-2 border-[#0B0B0F] bg-[#0B0B0F] px-9 py-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-white hover:text-[#0B0B0F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    무료로 시작하기
                  </a>
                  <p className="text-xs font-normal text-[#0B0B0F]/60">
                    신용카드 없이 바로 시작 · 언제든 해지 가능
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="mx-auto flex max-w-[1320px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-normal text-[#A1A1AA] lg:flex-row lg:px-10">
          <span>© 2026 repick</span>
          <div className="flex gap-6">
            <a
              href="#"
              className="rounded-none transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              이용약관
            </a>
            <a
              href="#"
              className="rounded-none transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0F]"
            >
              개인정보처리방침
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
