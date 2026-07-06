export default function Landing() {
  const plusMark = (opts?: { accent?: boolean; size?: number }) => {
    const size = opts?.size ?? 10;
    const color = opts?.accent ? "bg-[#6E56CF]" : "bg-white/40";
    return (
      <span
        aria-hidden="true"
        className="relative inline-block shrink-0"
        style={{ width: size, height: size }}
      >
        <span className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 ${color}`} />
        <span className={`absolute top-1/2 left-0 h-px w-full -translate-y-1/2 ${color}`} />
      </span>
    );
  };

  const corner = (pos: "tl" | "tr" | "bl" | "br", accent?: boolean) => {
    const size = 16;
    const posClass = {
      tl: "top-0 left-0 border-t border-l",
      tr: "top-0 right-0 border-t border-r",
      bl: "bottom-0 left-0 border-b border-l",
      br: "bottom-0 right-0 border-b border-r",
    }[pos];
    return (
      <span
        key={pos}
        aria-hidden="true"
        className={`absolute ${posClass} ${accent ? "border-[#6E56CF]" : "border-white/30"}`}
        style={{ width: size, height: size }}
      />
    );
  };

  const values = [
    {
      n: "01",
      t: "취향 학습",
      d: "찜, 조회, 구매 이력을 모아 당신만의 취향 그래프를 그립니다.",
    },
    {
      n: "02",
      t: "AI 재매칭",
      d: "버려질 뻔한 중고 매물 중 지금 취향에 맞는 것만 다시 골라냅니다.",
    },
    {
      n: "03",
      t: "신뢰 검증",
      d: "상태, 가격, 판매자 이력을 함께 확인해 안심하고 선택하게 합니다.",
    },
  ];

  const stats = [
    { v: "12,400+", l: "누적 리픽 완료" },
    { v: "92%", l: "재매칭 성공률" },
    { v: "4.8 / 5", l: "평균 평점" },
    { v: "32%", l: "평균 절감 비용" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-white antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0F]/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5 lg:px-10">
          <a href="#" className="flex items-center gap-3">
            {plusMark({ accent: true })}
            <span className="text-sm font-bold tracking-[-0.01em]">repick</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#A1A1AA] md:flex">
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
            className="border border-white/20 px-4 py-2 text-xs font-medium tracking-[0.02em] text-white transition-colors hover:border-white/40"
          >
            무료로 시작
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-[1200px] px-6 pt-24 pb-28 lg:px-10 lg:pt-32 lg:pb-36">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_300px] lg:items-start">
            <div>
              <p className="mb-8 flex items-center gap-3 text-xs font-medium tracking-[0.24em] text-[#A1A1AA] uppercase">
                {plusMark()}
                AI 리커머스 큐레이션
              </p>
              <h1 className="max-w-[15ch] text-[clamp(2.75rem,7.2vw,7rem)] leading-[0.96] font-bold tracking-[-0.03em]">
                버려질 뻔한 것들,
                <br />
                <span className="text-[#6E56CF]">다시</span> 고르다
              </h1>
              <p className="mt-10 max-w-[44ch] text-lg leading-[1.6] font-light text-[#A1A1AA] lg:text-xl">
                AI가 당신의 취향을 학습해, 수많은 중고 상품 중 지금 당신에게 맞는 것만 다시
                골라드립니다.
              </p>
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <a
                  href="#cta"
                  className="bg-[#6E56CF] px-7 py-3.5 text-sm font-medium tracking-[-0.005em] text-white transition-opacity hover:opacity-90"
                >
                  무료로 시작하기
                </a>
                <a
                  href="#value"
                  className="text-sm font-medium tracking-[-0.005em] text-[#A1A1AA] transition-colors hover:text-white"
                >
                  작동 원리 보기 →
                </a>
              </div>
            </div>

            <div className="relative border border-white/15 p-8">
              {corner("tl", true)}
              {corner("br", true)}
              <p className="text-xs font-medium tracking-[0.2em] text-[#A1A1AA] uppercase">
                재매칭 성공률
              </p>
              <p className="mt-6 text-[clamp(2.5rem,5vw,3.5rem)] leading-none font-bold tracking-[-0.02em]">
                92%
              </p>
              <p className="mt-4 text-sm leading-[1.6] font-light text-[#A1A1AA]">
                AI가 취향에 맞춰 다시 연결한 매물의 비율입니다.
              </p>
            </div>
          </div>
        </section>

        {/* Value 3-split */}
        <section id="value" className="border-t border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 lg:py-32">
            <h2 className="max-w-[20ch] text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.05] font-bold tracking-[-0.02em]">
              세 가지 방식으로 다시 고릅니다
            </h2>
            <div className="mt-16 grid grid-cols-1 divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {values.map((item) => (
                <div
                  key={item.n}
                  className="py-8 first:pt-0 md:px-10 md:py-0 md:first:pl-0 md:last:pr-0"
                >
                  <span className="block text-sm font-medium tracking-[-0.01em] text-white/30">
                    {item.n}
                  </span>
                  <h3 className="mt-5 text-lg font-bold tracking-[-0.01em] text-white">
                    {item.t}
                  </h3>
                  <p className="mt-3 text-sm leading-[1.6] font-light text-[#A1A1AA]">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social proof */}
        <section id="proof" className="border-t border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 lg:py-32">
            <blockquote className="max-w-[26ch] text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] font-bold tracking-[-0.02em]">
              &ldquo;버릴 생각만 하던 물건을 <span className="text-[#6E56CF]">다시</span> 찾아준
              첫 서비스.&rdquo;
            </blockquote>
            <p className="mt-6 text-sm font-light tracking-[-0.005em] text-[#A1A1AA]">
              김OO · repick 베타 사용자
            </p>

            <div className="relative mt-24 grid grid-cols-2 gap-x-10 gap-y-14 sm:grid-cols-4">
              <div
                aria-hidden="true"
                className="absolute -top-8 right-0 left-0 hidden h-px bg-white/10 sm:block"
              />
              {stats.map((s) => (
                <div key={s.l} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute -top-8 left-0 hidden h-2 w-2 -translate-y-1/2 rounded-full border border-white/40 bg-[#0B0B0F] sm:block"
                  />
                  <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em]">
                    {s.v}
                  </p>
                  <p className="mt-2 text-xs font-medium tracking-[0.12em] text-[#A1A1AA] uppercase">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="cta" className="border-t border-white/10">
          <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 lg:py-32">
            <div className="relative border border-white/15 px-8 py-16 text-center lg:px-16 lg:py-24">
              {corner("tl")}
              {corner("tr")}
              {corner("bl")}
              {corner("br", true)}
              <h2 className="mx-auto max-w-[18ch] text-[clamp(2.25rem,5.6vw,5rem)] leading-[0.98] font-bold tracking-[-0.03em]">
                지금, 당신을 위해
                <br />
                <span className="text-[#6E56CF]">다시 고를</span> 시간
              </h2>
              <a
                href="#"
                className="mt-12 inline-block bg-[#6E56CF] px-9 py-4 text-sm font-medium tracking-[-0.005em] text-white transition-opacity hover:opacity-90"
              >
                무료로 시작하기
              </a>
              <p className="mt-6 text-xs font-light tracking-[-0.005em] text-[#A1A1AA]">
                신용카드 없이 바로 시작 · 언제든 해지 가능
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-10 text-xs font-light text-[#A1A1AA] lg:flex-row lg:px-10">
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
