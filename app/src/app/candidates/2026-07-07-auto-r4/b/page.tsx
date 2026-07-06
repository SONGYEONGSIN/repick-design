const values = [
  {
    index: "01",
    title: "AI 큐레이션",
    desc: "수천 개 중고 상품 중 당신의 취향과 예산에 맞는 것만 골라냅니다.",
  },
  {
    index: "02",
    title: "검증된 컨디션",
    desc: "AI가 사진과 설명을 교차 검증해 상태 불일치를 사전에 걸러냅니다.",
  },
  {
    index: "03",
    title: "빠른 재판매",
    desc: "다시 팔 때도 AI가 적정가를 제안해 거래 속도를 높입니다.",
  },
];

const stats = [
  { value: "1,200+", label: "파트너 셀러" },
  { value: "32만", label: "누적 큐레이션" },
  { value: "4.9", label: "평균 만족도" },
  { value: "12초", label: "평균 추천 속도" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] font-sans text-white antialiased">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between border-x border-white/10 px-6 md:px-10">
          <span className="text-sm font-medium tracking-tight">repick</span>
          <nav className="hidden items-center gap-8 text-sm text-[#A1A1AA] md:flex">
            <span>제품</span>
            <span>가격</span>
            <span>회사</span>
          </nav>
          <a
            href="#start"
            className="border border-white/20 px-4 py-2 text-xs font-medium tracking-wide transition-colors hover:border-white/40"
          >
            로그인
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="border-b border-white/10">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 border-x border-white/10 md:grid-cols-12">
            <div className="px-6 py-24 md:col-span-8 md:px-10 md:py-32">
              <div className="mb-8 flex items-center gap-3">
                <span className="h-1.5 w-1.5 bg-[#6E56CF]" />
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#A1A1AA]">
                  01 — AI Curation
                </span>
              </div>
              <h1 className="max-w-3xl text-[clamp(2.5rem,7vw,5.25rem)] font-bold leading-[0.98] tracking-tight">
                버려질 뻔한 것들,
                <br />
                다시 고르다
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-[#A1A1AA] md:text-lg">
                AI가 당신 취향으로 중고를 큐레이션합니다. 검색이 아니라 발견에
                가깝게.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <a
                  href="#start"
                  className="bg-[#6E56CF] px-6 py-3 text-sm font-medium tracking-wide transition-colors hover:bg-[#5d47b5]"
                >
                  무료로 시작하기
                </a>
                <a
                  href="#values"
                  className="border-b border-white/30 pb-0.5 text-sm font-medium transition-colors hover:border-white"
                >
                  더 알아보기 →
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-10 border-t border-white/10 px-6 py-16 md:col-span-4 md:border-l md:border-t-0 md:px-10 md:py-32">
              <div>
                <p className="text-4xl font-bold tracking-tight">10,000+</p>
                <p className="mt-2 text-sm text-[#A1A1AA]">재순환된 아이템</p>
              </div>
              <div>
                <p className="text-4xl font-bold tracking-tight">98%</p>
                <p className="mt-2 text-sm text-[#A1A1AA]">취향 매칭 정확도</p>
              </div>
            </div>
          </div>
        </section>

        {/* Value 3-split */}
        <section id="values" className="border-b border-white/10">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 border-x border-white/10 md:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={v.index}
                className={`px-6 py-16 md:px-10 md:py-20 ${
                  i === 0 ? "" : "border-t border-white/10 md:border-l md:border-t-0"
                }`}
              >
                <span className="text-xs tracking-[0.2em] text-[#A1A1AA]">
                  {v.index}
                </span>
                <h3 className="mt-6 text-xl font-medium tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-[1200px] border-x border-white/10 px-6 py-16 md:px-10 md:py-20">
            <p className="mb-10 text-xs uppercase tracking-[0.2em] text-[#A1A1AA]">
              02 — 신뢰 지표
            </p>
            <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-0 md:px-8 ${
                    i === 0 ? "" : "border-white/10 md:border-l"
                  }`}
                >
                  <p className="text-3xl font-bold tracking-tight md:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-2 text-sm text-[#A1A1AA]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-b border-white/10">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-10 border-x border-white/10 px-6 py-24 md:flex-row md:items-end md:justify-between md:px-10 md:py-32">
            <h2 className="max-w-xl text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.03] tracking-tight">
              지금, 당신의 취향을
              <br />
              다시 고를 시간
            </h2>
            <a
              href="#start"
              className="shrink-0 bg-[#6E56CF] px-8 py-4 text-sm font-medium tracking-wide transition-colors hover:bg-[#5d47b5]"
            >
              무료로 시작하기
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between border-x border-white/10 px-6 py-8 text-xs text-[#A1A1AA] md:px-10">
          <span>© 2026 repick</span>
          <span>03 — repick</span>
        </div>
      </footer>
    </div>
  );
}
