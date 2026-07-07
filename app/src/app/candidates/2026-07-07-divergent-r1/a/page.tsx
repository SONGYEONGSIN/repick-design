export default function Landing() {
  const ticker = Array(4)
    .fill(
      "★ 못생겨도 착해 ★ AI가 다시 골라줌 ★ 중고인데 새것 같음 ★ 반품 0원 ★ 24시간 재고 스캔 ★ 진짜 싸게 ★",
    )
    .join(" ");

  const stats = [
    { n: "94%", l: "AI 매칭 정확도", bg: "bg-[#FFEA00]" },
    { n: "12만+", l: "이번 달 리픽 유저", bg: "bg-[#00C2FF]" },
    { n: "3분", l: "평균 픽 완료 시간", bg: "bg-[#ADFF2F]" },
    { n: "0원", l: "반품 수수료", bg: "bg-[#FF6B00]" },
  ];

  const features = [
    {
      icon: "⚡",
      tag: "HOT",
      title: "3초 AI 스캔",
      desc: "사진 한 장이면 상태·시세·진짜 가치를 AI가 바로 계산한다. 눈속임 없음.",
      bg: "bg-white",
    },
    {
      icon: "🧷",
      tag: "NEW",
      title: "다시 고른다",
      desc: "남이 버린 물건 말고, 당신 취향에 맞게 AI가 재구성해서 보여준다.",
      bg: "bg-[#FF2FBD]",
    },
    {
      icon: "🛠️",
      tag: "REAL",
      title: "가품 필터링",
      desc: "이상한 거 걸러내는 건 기본. 진짜만 통과시킨다. 96% 필터링률.",
      bg: "bg-[#ADFF2F]",
    },
  ];

  const products = [
    { name: "빈티지 데님 자켓", price: "38,000", orig: "89,000", off: "-57%", tone: "bg-[#FFEA00]", rot: "rotate-[-2deg]" },
    { name: "레트로 필름 카메라", price: "72,000", orig: "150,000", off: "-52%", tone: "bg-[#00C2FF]", rot: "rotate-[1.5deg]" },
    { name: "무선 이어폰 (풀박스)", price: "45,000", orig: "119,000", off: "-62%", tone: "bg-[#FF6B00]", rot: "rotate-[-1deg]" },
    { name: "북유럽 원목 스툴", price: "29,000", orig: "68,000", off: "-57%", tone: "bg-[#ADFF2F]", rot: "rotate-[2deg]" },
  ];

  const notes = [
    { q: "“사진만 올렸는데 시세를 바로 알려줌. 이거 반칙 아님?”", who: "@junho_thrift", rot: "rotate-[-3deg]", bg: "bg-[#FFEA00]" },
    { q: "“가품 하나 걸러줘서 8만원 굳었다. 리픽 없인 못 삼.”", who: "@mina.pick", rot: "rotate-[2deg]", bg: "bg-[#FF2FBD] text-white" },
    { q: "“취향 저격 알고리즘 실화? 매일 들어와서 구경함.”", who: "@studio_kkk", rot: "rotate-[-1.5deg]", bg: "bg-[#00C2FF]" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-black selection:text-[#FFEA00]">
      <style>{`
        @keyframes rp-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .rp-marquee-track {
          animation: rp-marquee 18s linear infinite;
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-[#FFEA00]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a
            href="#top"
            className="inline-block rotate-[-3deg] border-4 border-black bg-black px-3 py-1 text-xl font-black uppercase tracking-tight text-[#FFEA00] shadow-[4px_4px_0_0_#000] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FF2FBD]"
          >
            RE:PICK
          </a>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 text-sm font-black uppercase md:flex">
            <a href="#features" className="hover:underline decoration-4 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">왜 리픽</a>
            <a href="#products" className="hover:underline decoration-4 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">오늘의 픽</a>
            <a href="#reviews" className="hover:underline decoration-4 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">후기</a>
          </nav>
          <a
            href="#cta"
            className="border-4 border-black bg-[#FF2FBD] px-4 py-2 text-sm font-black uppercase text-white shadow-[4px_4px_0_0_#000] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            지금 픽하기
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative overflow-hidden border-b-4 border-black bg-[#FF2FBD] px-4 py-16 md:py-28">
          <div
            aria-hidden="true"
            className="absolute -right-6 top-10 hidden rotate-[8deg] border-4 border-black bg-[#ADFF2F] px-4 py-2 text-xs font-black uppercase shadow-[6px_6px_0_0_#000] sm:block"
          >
            ★ AI 큐레이션
          </div>
          <div
            aria-hidden="true"
            className="absolute -left-4 bottom-8 hidden rotate-[-10deg] border-4 border-black bg-[#00C2FF] px-4 py-2 text-xs font-black uppercase shadow-[6px_6px_0_0_#000] sm:block"
          >
            중고 맞아?! 😱
          </div>

          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto mb-6 inline-block rotate-[-2deg] border-4 border-black bg-white px-4 py-1 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000]">
              중고 재판매 · AI 큐레이션
            </p>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-white [text-shadow:4px_4px_0_#000] sm:text-6xl md:text-8xl">
              고른다,
              <br />
              다시.
              <br />
              <span className="inline-block rotate-[-1deg] bg-black px-4 py-1 text-[#FFEA00] [text-shadow:none]">
                AI가.
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-xl border-4 border-black bg-white px-4 py-3 text-sm font-bold uppercase text-black shadow-[4px_4px_0_0_#000] sm:text-base">
              남이 쓰던 물건, AI가 다시 골라서 진짜만 보여준다. 눈속임 없음. 가품 없음. 후회 없음.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#cta"
                className="border-4 border-black bg-[#FFEA00] px-8 py-4 text-lg font-black uppercase text-black shadow-[8px_8px_0_0_#000] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#000] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                지금 리픽 받기 →
              </a>
              <a
                href="#features"
                className="border-4 border-black bg-black px-8 py-4 text-lg font-black uppercase text-white shadow-[8px_8px_0_0_#00C2FF] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#00C2FF] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA00]"
              >
                어떻게 되냐면
              </a>
            </div>
          </div>
        </section>

        {/* MARQUEE TICKER */}
        <div className="overflow-hidden border-b-4 border-black bg-black py-3" aria-hidden="true">
          <div className="rp-marquee-track flex w-max whitespace-nowrap text-lg font-black uppercase text-[#FFEA00]">
            <span className="pr-8">{ticker}</span>
            <span className="pr-8">{ticker}</span>
          </div>
        </div>

        {/* STATS */}
        <section aria-label="리픽 숫자" className="border-b-4 border-black bg-white px-4 py-14 md:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-5 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.l}
                className={`${s.bg} ${i % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]"} border-4 border-black px-4 py-6 text-center shadow-[6px_6px_0_0_#000]`}
              >
                <div className="text-3xl font-black md:text-4xl">{s.n}</div>
                <div className="mt-1 text-xs font-black uppercase tracking-wide md:text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="border-b-4 border-black bg-[#111] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="mb-3 inline-block rotate-[-2deg] border-4 border-black bg-[#ADFF2F] px-4 py-1 text-xs font-black uppercase shadow-[4px_4px_0_0_#000]">
              왜 REPICK
            </p>
            <h2 className="mb-12 text-3xl font-black uppercase text-white sm:text-4xl md:text-5xl">
              대충 고르지 않는다
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`relative ${f.bg} ${i % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]"} border-4 border-black p-6 shadow-[8px_8px_0_0_#000] transition-transform hover:rotate-0`}
                >
                  <span className="absolute -right-3 -top-3 rotate-[10deg] border-4 border-black bg-black px-2 py-1 text-[10px] font-black uppercase text-[#FFEA00] shadow-[3px_3px_0_0_#000]">
                    {f.tag}
                  </span>
                  <div className="mb-4 text-4xl" aria-hidden="true">{f.icon}</div>
                  <h3 className="mb-2 text-xl font-black uppercase">{f.title}</h3>
                  <p className="text-sm font-bold leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section id="products" className="border-b-4 border-black bg-[#ADFF2F] px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-2 text-3xl font-black uppercase sm:text-4xl md:text-5xl">오늘의 픽 🔥</h2>
            <p className="mb-12 text-sm font-black uppercase">AI가 방금 재구성한 진짜 물건들</p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <div key={p.name} className={`${p.rot} border-4 border-black bg-white shadow-[6px_6px_0_0_#000] transition-transform hover:rotate-0`}>
                  <div
                    className={`relative flex h-36 items-center justify-center border-b-4 border-black ${p.tone} bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.12)_0,rgba(0,0,0,0.12)_10px,transparent_10px,transparent_20px)]`}
                  >
                    <span className="text-4xl" aria-hidden="true">🧥</span>
                    <span className="absolute -right-2 -top-2 rotate-[8deg] border-4 border-black bg-[#FF2FBD] px-2 py-1 text-xs font-black text-white shadow-[3px_3px_0_0_#000]">
                      {p.off}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 text-sm font-black uppercase leading-tight">{p.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-black">{p.price}원</span>
                      <span className="text-xs font-bold text-black/50 line-through">{p.orig}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="reviews" className="border-b-4 border-black bg-white px-4 py-20 md:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-12 text-3xl font-black uppercase sm:text-4xl md:text-5xl">진짜 유저들 반응</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {notes.map((n) => (
                <blockquote
                  key={n.who}
                  className={`${n.rot} ${n.bg} border-4 border-black p-6 shadow-[6px_6px_0_0_#000]`}
                >
                  <p className="text-sm font-bold leading-relaxed">{n.q}</p>
                  <footer className="mt-4 text-xs font-black uppercase">{n.who}</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="border-b-4 border-black bg-black px-4 py-24 md:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mx-auto mb-6 inline-block rotate-[-2deg] border-4 border-black bg-[#FF6B00] px-4 py-1 text-xs font-black uppercase text-white shadow-[4px_4px_0_0_#fff]">
              지금 시작
            </p>
            <h2 className="mb-8 text-4xl font-black uppercase leading-tight text-white sm:text-5xl md:text-6xl">
              지금 안 픽하면
              <br />
              <span className="bg-[#FFEA00] px-3 text-black">후회함</span>
            </h2>
            <a
              href="#top"
              className="inline-block border-4 border-white bg-[#FFEA00] px-10 py-5 text-xl font-black uppercase text-black shadow-[8px_8px_0_0_#fff] transition-transform hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_0_#fff] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#FF2FBD]"
            >
              무료로 리픽 시작하기
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#FFEA00] px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <span className="rotate-[-2deg] border-4 border-black bg-black px-3 py-1 text-lg font-black uppercase text-[#FFEA00] shadow-[3px_3px_0_0_#000]">
            RE:PICK
          </span>
          <nav aria-label="푸터 메뉴" className="flex flex-wrap justify-center gap-5 text-xs font-black uppercase">
            <a href="#top" className="hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">이용약관</a>
            <a href="#top" className="hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">개인정보처리방침</a>
            <a href="#top" className="hover:underline focus-visible:outline focus-visible:outline-4 focus-visible:outline-black">문의하기</a>
          </nav>
          <p className="text-xs font-bold uppercase">© 2026 RE:PICK. NO FAKES ALLOWED.</p>
        </div>
      </footer>
    </div>
  );
}
