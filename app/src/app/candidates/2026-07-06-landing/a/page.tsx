export default function Page() {
  return (
    <div className="min-h-screen bg-white text-[#14141A] antialiased">
      <header className="border-b border-[#ECECEF]">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-6 md:px-8">
          <span className="text-lg font-semibold tracking-[-0.02em]">repick</span>
          <nav className="flex items-center gap-6">
            <a
              href="#"
              className="hidden text-sm text-[#6B6B76] transition-colors hover:text-[#14141A] sm:inline"
            >
              로그인
            </a>
            <a
              href="#cta"
              className="rounded-full bg-[#14141A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#6E56CF]"
            >
              시작하기
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(110,86,207,0.10),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-[1120px] px-6 py-28 text-center md:px-8 md:py-40">
            <p className="mb-8 text-sm font-medium tracking-[0.02em] text-[#6E56CF]">
              AI 리커머스 큐레이션
            </p>
            <h1 className="mx-auto max-w-3xl text-balance text-5xl font-bold leading-[1.08] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              버려질 뻔한 것들,
              <br />
              다시 고르다
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-[#6B6B76] md:text-xl">
              AI가 당신의 취향을 배우고, 어울리는 중고 물건만 골라 보여드립니다.
            </p>
            <div className="mt-12">
              <a
                href="#cta"
                className="inline-flex items-center rounded-full bg-[#6E56CF] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[#5c46b3]"
              >
                무료로 시작하기
              </a>
            </div>
          </div>
        </section>

        {/* 가치 3분할 */}
        <section className="border-t border-[#ECECEF]">
          <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-8 md:py-32">
            <h2 className="mb-16 text-center text-sm font-medium tracking-[0.02em] text-[#6B6B76] md:mb-20">
              무엇이 다른가요
            </h2>
            <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-12">
              {[
                {
                  n: "01",
                  title: "큐레이션",
                  desc: "조회와 구매 이력을 학습해, 당신만을 위한 셀렉션을 매일 새로 짭니다.",
                },
                {
                  n: "02",
                  title: "신뢰",
                  desc: "판매자 인증과 상태 등급을 거친 상품만 큐레이션에 포함됩니다.",
                },
                {
                  n: "03",
                  title: "합리적인 가격",
                  desc: "정가 대비 최대 70%, 시세 분석에 기반한 투명한 가격만 보여드립니다.",
                },
              ].map((item, i) => (
                <div
                  key={item.n}
                  className={`${
                    i > 0 ? "border-t border-[#ECECEF] pt-10 md:border-t-0 md:border-l md:pt-0 md:pl-12" : ""
                  }`}
                >
                  <span className="text-sm font-medium tracking-[0.05em] text-[#A8A8B3]">
                    {item.n}
                  </span>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#6B6B76]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 소셜프루프 */}
        <section className="border-t border-[#ECECEF] bg-[#FAFAFA]">
          <div className="mx-auto max-w-[1120px] px-6 py-24 md:px-8 md:py-32">
            <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-6">
              {[
                { value: "12,400+", label: "재판매 완료" },
                { value: "4.9 / 5", label: "평균 만족도" },
                { value: "68%", label: "평균 절약률" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-4xl font-bold tracking-[-0.02em] md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-3 text-sm text-[#6B6B76]">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
              <p className="text-balance text-2xl font-medium italic leading-snug tracking-[-0.01em] text-[#14141A] md:text-3xl">
                &ldquo;필요한 것만 골라주니까, 검색할 필요가 없어졌어요.&rdquo;
              </p>
              <p className="mt-6 text-sm text-[#6B6B76]">정서연 · repick 사용자</p>
            </div>
          </div>
        </section>

        {/* 마무리 CTA */}
        <section id="cta" className="border-t border-[#ECECEF]">
          <div className="mx-auto max-w-[1120px] px-6 py-28 text-center md:px-8 md:py-36">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-[-0.02em] sm:text-4xl md:text-5xl">
              지금, 당신을 위한
              <br />첫 셀렉션을 받아보세요
            </h2>
            <p className="mx-auto mt-6 max-w-md text-balance text-[#6B6B76]">
              가입은 30초, 결제 정보는 필요 없습니다.
            </p>
            <div className="mt-10">
              <a
                href="#"
                className="inline-flex items-center rounded-full bg-[#6E56CF] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[#5c46b3]"
              >
                무료로 시작하기
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ECECEF]">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-[#6B6B76] sm:flex-row md:px-8">
          <span>© 2026 repick. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-[#14141A]">
              자주 묻는 질문
            </a>
            <a href="#" className="transition-colors hover:text-[#14141A]">
              문의
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
