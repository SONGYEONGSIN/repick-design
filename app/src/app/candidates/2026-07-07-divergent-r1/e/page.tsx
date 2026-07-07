export default function Landing() {
  const accent = "#a10f2b";

  return (
    <div className="min-h-screen bg-white text-black font-serif selection:bg-[#a10f2b] selection:text-white">
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 28s linear infinite;
        }
      `}</style>

      {/* ===== MASTHEAD ===== */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-black">
        <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 font-sans text-[10px] sm:text-xs uppercase tracking-[0.28em]">
          <span className="hidden sm:inline">Vol. LX — No. 07</span>
          <span className="font-serif text-lg sm:text-xl tracking-[0.3em] font-bold">
            REPICK
          </span>
          <span style={{ color: accent }}>AI 큐레이티드 리세일</span>
        </div>
        {/* ticker */}
        <div className="overflow-hidden border-t border-black/10 bg-black">
          <div className="ticker-track flex whitespace-nowrap py-1.5 font-sans text-[10px] uppercase tracking-[0.35em] text-white">
            {Array.from({ length: 2 }).map((_, i) => (
              <span key={i} className="flex shrink-0">
                <span className="mx-4">EXCLUSIVE</span>
                <span className="mx-4" style={{ color: accent }}>
                  ◆
                </span>
                <span className="mx-4">AI 큐레이션</span>
                <span className="mx-4" style={{ color: accent }}>
                  ◆
                </span>
                <span className="mx-4">에디터 검수 완료</span>
                <span className="mx-4" style={{ color: accent }}>
                  ◆
                </span>
                <span className="mx-4">프리미엄 리세일</span>
                <span className="mx-4" style={{ color: accent }}>
                  ◆
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main>
        {/* ===== HERO / COVER ===== */}
        <section className="border-b border-black">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.2fr_1fr] gap-10 lg:gap-6 px-5 sm:px-8 lg:px-12 py-14 lg:py-20 items-center">
            {/* left cover lines */}
            <div className="order-2 lg:order-1 flex flex-col gap-8 text-center lg:text-left">
              <div>
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: accent }}
                >
                  Feature
                </p>
                <p className="italic text-base sm:text-lg leading-snug mt-1">
                  AI는 어떻게 90초 만에 당신의 다음 아이템을 찾는가
                </p>
              </div>
              <div>
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: accent }}
                >
                  Report
                </p>
                <p className="italic text-base sm:text-lg leading-snug mt-1">
                  리세일 시장, 이제는 럭셔리가 되다
                </p>
              </div>
            </div>

            {/* center headline */}
            <div className="order-1 lg:order-2 text-center">
              <h1 className="leading-[0.82] tracking-tight font-bold">
                <span className="block text-[clamp(4.2rem,17vw,11rem)]">
                  RE
                </span>
                <span
                  className="block text-[clamp(4.2rem,17vw,11rem)]"
                  style={{ color: accent }}
                >
                  PICK
                </span>
              </h1>
              <p className="italic text-lg sm:text-2xl mt-6">
                계절이 바뀌어도, 취향은 재고되지 않는다.
              </p>
              <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.2em] text-black/60 mt-4 max-w-md mx-auto leading-relaxed">
                AI가 초 단위로 골라내는, 다시 태어난 프리미엄 리세일 컬렉션
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#start"
                  className="font-sans text-xs uppercase tracking-[0.25em] px-8 py-4 bg-black text-white hover:bg-[#a10f2b] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b]"
                >
                  Shop the Edit →
                </a>
                <a
                  href="#how"
                  className="font-sans text-xs uppercase tracking-[0.25em] px-8 py-4 border border-black hover:border-[#a10f2b] hover:text-[#a10f2b] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b]"
                >
                  진행 방식 보기
                </a>
              </div>

              <div className="mt-10 border-t border-black/20 pt-4 font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/50 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <span>Issue No. 07</span>
                <span>2026 Summer Edition</span>
                <span>Price — 무료</span>
              </div>
            </div>

            {/* right cover lines */}
            <div className="order-3 flex flex-col gap-8 text-center lg:text-right">
              <div>
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: accent }}
                >
                  Guide
                </p>
                <p className="italic text-base sm:text-lg leading-snug mt-1">
                  손해 없이 되파는 법, 완벽 정리
                </p>
              </div>
              <div>
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.3em] font-semibold"
                  style={{ color: accent }}
                >
                  Inside
                </p>
                <p className="italic text-base sm:text-lg leading-snug mt-1">
                  에디터가 검수한 12,000개의 컬렉션
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== THE EDIT ===== */}
        <section className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-black">
          <div className="flex items-end justify-between border-b border-black pb-4 mb-10">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              THE EDIT
            </h2>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/50">
              2026 이번 시즌 큐레이션
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {[
              {
                no: "01",
                page: "P. 12",
                cat: "아우터",
                title: "클래식 리버스드",
                grad: "from-neutral-900 via-black to-[#3a0712]",
              },
              {
                no: "02",
                page: "P. 24",
                cat: "백 & 슈즈",
                title: "실버 미니멀",
                grad: "from-neutral-800 via-neutral-950 to-black",
              },
              {
                no: "03",
                page: "P. 31",
                cat: "셋업",
                title: "쿼이엇 럭셔리",
                grad: "from-[#3a0712] via-black to-neutral-900",
              },
              {
                no: "04",
                page: "P. 45",
                cat: "스트리트",
                title: "크로스오버",
                grad: "from-black via-neutral-900 to-neutral-700",
              },
            ].map((item) => (
              <article key={item.no} className="group">
                <div
                  className={`relative aspect-[3/4] bg-gradient-to-br ${item.grad} overflow-hidden`}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 8px)",
                  }}
                >
                  <span
                    className="absolute top-3 left-3 font-sans text-[10px] uppercase tracking-[0.2em] text-white/70"
                  >
                    {item.page}
                  </span>
                  <span className="absolute bottom-3 right-4 font-serif text-white/20 text-6xl font-bold leading-none">
                    {item.no}
                  </span>
                  <span
                    className="absolute inset-x-0 bottom-0 h-1"
                    style={{ backgroundColor: accent }}
                  />
                </div>
                <p
                  className="font-sans text-[10px] uppercase tracking-[0.25em] mt-4"
                  style={{ color: accent }}
                >
                  {item.cat}
                </p>
                <h3 className="italic text-xl mt-1">{item.title}</h3>
              </article>
            ))}
          </div>
        </section>

        {/* ===== PULL QUOTE ===== */}
        <section className="px-5 sm:px-8 lg:px-12 py-20 lg:py-28 border-b border-black text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-black/40 mb-8">
            Editor&apos;s Note
          </p>
          <blockquote className="italic text-[clamp(1.6rem,5vw,3.2rem)] leading-tight max-w-4xl mx-auto">
            &ldquo;소유가 아니라,
            <span style={{ color: accent }}> 취향의 순환</span>이다.&rdquo;
          </blockquote>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-black/40 mt-8">
            — REPICK Editorial
          </p>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section
          id="how"
          className="px-5 sm:px-8 lg:px-12 py-16 lg:py-24 border-b border-black"
        >
          <div className="flex items-end justify-between border-b border-black pb-4 mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              HOW IT WORKS
            </h2>
            <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-black/50">
              3단계로 완성되는 리세일
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                roman: "I",
                title: "등록",
                desc: "사진 한 장이면 충분합니다. 옷장 속 아이템을 올려주세요.",
              },
              {
                roman: "II",
                title: "큐레이션",
                desc: "AI가 상태·트렌드·적정가를 분석해 가치를 매깁니다.",
              },
              {
                roman: "III",
                title: "매칭",
                desc: "어울리는 컬렉터에게 즉시 연결되어 거래가 시작됩니다.",
              },
            ].map((step) => (
              <div key={step.roman} className="text-center md:text-left">
                <p
                  className="text-6xl sm:text-7xl font-bold leading-none"
                  style={{ color: accent }}
                >
                  {step.roman}
                </p>
                <h3 className="text-xl font-bold mt-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="font-sans text-sm text-black/60 mt-2 leading-relaxed max-w-xs mx-auto md:mx-0">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== BY THE NUMBERS ===== */}
        <section className="bg-black text-white px-5 sm:px-8 lg:px-12 py-16 lg:py-20 border-b border-black">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/40 text-center mb-10">
            By the Numbers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-6 max-w-4xl mx-auto text-center">
            {[
              { num: "12,000+", label: "큐레이션 완료 아이템" },
              { num: "90 SEC", label: "평균 매칭 시간" },
              { num: "4.9 ★", label: "사용자 평점" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: accent }}>
                  {s.num}
                </p>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/60 mt-3">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CTA / JOIN THE LIST ===== */}
        <section
          id="start"
          className="px-5 sm:px-8 lg:px-12 py-20 lg:py-28 text-center border-b border-black"
        >
          <h2 className="text-[clamp(2.4rem,8vw,5.5rem)] font-bold tracking-tight leading-[0.9]">
            JOIN THE LIST
          </h2>
          <p className="italic text-lg sm:text-xl mt-6">
            다음 컬렉션을 가장 먼저 만나보세요.
          </p>
          <div className="mt-10 flex justify-center">
            <a
              href="#"
              className="font-sans text-xs uppercase tracking-[0.25em] px-10 py-4 text-white transition-colors duration-300 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              style={{ backgroundColor: accent }}
            >
              지금 시작하기 →
            </a>
          </div>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-black/40 mt-6">
            매주 목요일, 엄선된 리세일 컬렉션이 도착합니다
          </p>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-sans text-xs uppercase tracking-[0.2em] text-black/60 border-b border-black/10 pb-10">
          <div>
            <p className="text-black font-semibold mb-3">REPICK</p>
            <p className="normal-case tracking-normal text-black/50">
              AI 큐레이티드 리세일 매거진
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black font-semibold mb-1">Edit</span>
            <a href="#" className="hover:text-[#a10f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b] w-fit">
              이번 시즌
            </a>
            <a href="#" className="hover:text-[#a10f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b] w-fit">
              아카이브
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black font-semibold mb-1">About</span>
            <a href="#" className="hover:text-[#a10f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b] w-fit">
              에디토리얼 팀
            </a>
            <a href="#" className="hover:text-[#a10f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b] w-fit">
              채용
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-black font-semibold mb-1">Contact</span>
            <a href="#" className="hover:text-[#a10f2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a10f2b] w-fit">
              문의하기
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 font-sans text-[10px] uppercase tracking-[0.25em] text-black/40">
          <span>© 2026 REPICK. All Rights Reserved.</span>
          <span>Seoul — Since 2026</span>
        </div>
      </footer>
    </div>
  );
}
