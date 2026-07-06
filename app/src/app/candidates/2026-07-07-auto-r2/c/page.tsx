const values = [
  {
    index: "01",
    title: "정확한 취향 매칭",
    desc: "AI가 학습한 당신의 스타일로 조건에 맞는 상품만 골라 보여줍니다.",
  },
  {
    index: "02",
    title: "검증된 상태 확인",
    desc: "판매자 인증과 상태 리포트를 함께 제공해 안심하고 구매할 수 있어요.",
  },
  {
    index: "03",
    title: "지속가능한 소비",
    desc: "다시 골라 쓰는 습관이 쌓여 자원 낭비를 줄이는 선택이 됩니다.",
  },
];

const stats = [
  { value: "12,000+", label: "재판매 성사" },
  { value: "98%", label: "만족도" },
  { value: "4.9", label: "평균 평점" },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] font-sans text-white selection:bg-[#6E56CF] selection:text-white">
      {/* Hero */}
      <section className="mx-auto flex min-h-[92vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-10 text-xs font-normal uppercase tracking-[0.3em] text-[#A1A1AA]">
          AI 리커머스
        </span>
        <h1 className="text-4xl leading-[1.2] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="font-light text-[#A1A1AA]">버려질 뻔한 것들,</span>
          <br />
          <span className="font-bold text-white">다시 고르다</span>
        </h1>
        <p className="mt-10 max-w-xl text-base leading-[1.9] text-[#A1A1AA] sm:text-lg">
          AI가 당신 취향으로 중고를 큐레이션합니다.
        </p>
        <a
          href="#start"
          className="mt-16 inline-flex items-center rounded-full bg-[#6E56CF] px-8 py-4 text-sm font-normal text-white transition-colors hover:bg-[#7d64e0]"
        >
          무료로 시작하기
        </a>
      </section>

      <div className="mx-auto h-px max-w-5xl bg-white/5" />

      {/* 가치 3분할 */}
      <section className="mx-auto max-w-5xl px-6 py-32 md:py-48">
        <div className="grid grid-cols-1 gap-y-20 md:grid-cols-3 md:gap-x-16 md:gap-y-0">
          {values.map((v) => (
            <div key={v.index}>
              <span className="text-sm font-light tracking-widest text-[#A1A1AA]">
                {v.index}
              </span>
              <h2 className="mt-6 text-xl font-bold leading-snug text-white">
                {v.title}
              </h2>
              <p className="mt-5 text-sm leading-[1.9] text-[#A1A1AA]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 소셜프루프 */}
      <section className="border-y border-white/5 bg-[#131318]">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 px-6 py-28 sm:grid-cols-3 sm:divide-x sm:divide-white/10 md:py-36">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:px-8">
              <p className="text-5xl font-bold tracking-tight tabular-nums text-white">
                {s.value}
              </p>
              <p className="mt-5 text-xs font-light uppercase tracking-[0.2em] text-[#A1A1AA]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 마무리 CTA */}
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-40 text-center md:py-56">
        <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          지금,
          <br className="sm:hidden" /> 다시 고를 시간
        </h2>
        <p className="mt-8 text-base leading-[1.9] text-[#A1A1AA]">
          지금 가입하면 첫 매칭을 무료로 받아볼 수 있어요.
        </p>
        <a
          href="#start"
          className="mt-12 inline-flex items-center rounded-full bg-[#6E56CF] px-10 py-4 text-sm font-normal text-white transition-colors hover:bg-[#7d64e0]"
        >
          무료로 시작하기
        </a>
      </section>

      <footer className="border-t border-white/5 px-6 py-12 text-center text-xs font-light text-[#A1A1AA]">
        © 2026 repick
      </footer>
    </main>
  );
}
