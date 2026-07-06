const values = [
  {
    n: "01",
    title: "당신이 놓친 것을 AI가 짚어냅니다",
    desc: "찜, 조회, 구매 이력을 읽어 취향의 결을 학습하고 매일 새로 고른 목록을 조용히 건넵니다.",
  },
  {
    n: "02",
    title: "상태부터 진위까지, 사람이 다시 확인합니다",
    desc: "AI가 좁힌 후보를 검수팀이 직접 만져보고 사진을 남깁니다. 설명과 실물의 간극을 없앱니다.",
  },
  {
    n: "03",
    title: "같은 물건은 없습니다, 지금 이 순간의 컬렉션",
    desc: "재고가 아니라 사연이 있는 하나뿐인 물건들. 놓치면 다시 만날 수 없습니다.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#0B0B0F] text-white">
      <header className="px-6 pt-12 md:px-16 md:pt-16 lg:px-24 lg:pt-20">
        <span className="text-xs font-semibold tracking-[0.3em] text-[#A1A1AA] uppercase">
          repick
        </span>
      </header>

      <section className="px-6 pt-24 pb-32 md:px-16 md:pt-32 md:pb-48 lg:px-24 lg:pt-40 lg:pb-64">
        <div className="mx-auto max-w-5xl">
          <h1 className="max-w-4xl text-[clamp(2.75rem,7vw,6.75rem)] font-light leading-[0.98] tracking-[-0.03em] text-white">
            버려질 뻔한 것들,
            <br />
            <span className="text-[#A1A1AA]">다시</span> 고르다
          </h1>
          <p className="mt-10 max-w-md text-base font-normal leading-relaxed text-[#A1A1AA] md:text-lg">
            AI가 당신 취향으로 중고를 큐레이션합니다.
          </p>
          <div className="mt-14">
            <a
              href="#start"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:border-[#6E56CF] hover:text-[#6E56CF]"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </section>

      <section
        aria-label="repick이 다시 고르는 방법"
        className="border-t border-white/10 px-6 py-32 md:px-16 md:py-40 lg:px-24 lg:py-48"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-3 md:gap-12 lg:gap-24">
          {values.map((v) => (
            <div key={v.n} className="border-t border-white/10 pt-8">
              <span className="text-sm font-semibold text-[#6E56CF]">{v.n}</span>
              <h2 className="mt-6 text-xl font-light leading-snug text-white md:text-2xl">
                {v.title}
              </h2>
              <p className="mt-4 text-sm font-normal leading-relaxed text-[#A1A1AA]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-32 text-center md:px-16 md:py-40 lg:py-48">
        <div className="mx-auto max-w-3xl">
          <p className="text-[clamp(2rem,5vw,3.5rem)] font-light leading-tight tracking-[-0.02em] text-white">
            12,000명
            <span className="text-[#A1A1AA]">이 이미 다시 골랐습니다</span>
          </p>
          <p className="mx-auto mt-8 max-w-md text-sm font-normal leading-relaxed text-[#A1A1AA]">
            &ldquo;찾던 물건을 이렇게 빨리 만날 줄 몰랐어요.&rdquo; — repick 이용자
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-32 text-center md:px-16 md:py-48 lg:py-64">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[clamp(2rem,5vw,3.75rem)] font-light leading-tight tracking-[-0.02em] text-white">
            당신의 다음 물건은,
            <br />
            <span className="text-[#A1A1AA]">이미 준비돼 있어요</span>
          </h2>
          <div className="mt-12 flex justify-center">
            <a
              id="start"
              href="#"
              className="inline-flex items-center rounded-full border border-white/20 px-8 py-4 text-sm font-semibold tracking-wide text-white transition-colors duration-200 hover:border-[#6E56CF] hover:text-[#6E56CF]"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-12 md:px-16 lg:px-24">
        <p className="text-xs font-normal text-[#A1A1AA]">© 2026 repick. All rights reserved.</p>
      </footer>
    </main>
  );
}
