export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FFF9F2] text-[#5C4A3A] antialiased">
      <style>{`
        @keyframes blobMorph {
          0%, 100% { border-radius: 62% 38% 55% 45% / 55% 45% 55% 45%; }
          33% { border-radius: 45% 55% 40% 60% / 60% 40% 60% 40%; }
          66% { border-radius: 55% 45% 65% 35% / 40% 60% 40% 60%; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(14px) rotate(-4deg); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .blob-morph { animation: blobMorph 12s ease-in-out infinite; }
        .float-slow { animation: floatSlow 7s ease-in-out infinite; }
        .float-slow2 { animation: floatSlow2 8s ease-in-out infinite; }
        .wiggle-hover:hover { animation: wiggle 0.6s ease-in-out; }
      `}</style>

      {/* ===== decorative background blobs ===== */}
      <div
        aria-hidden
        className="blob-morph float-slow pointer-events-none absolute -left-32 -top-24 h-[420px] w-[420px] bg-gradient-to-br from-[#FFE0D6] to-[#FFC9B8] opacity-70 blur-0"
      />
      <div
        aria-hidden
        className="blob-morph float-slow2 pointer-events-none absolute -right-40 top-10 h-[480px] w-[480px] bg-gradient-to-br from-[#D4F5E9] to-[#AEEBD3] opacity-70"
        style={{ animationDelay: "-3s" }}
      />
      <div
        aria-hidden
        className="blob-morph float-slow pointer-events-none absolute -bottom-40 left-1/4 h-[380px] w-[380px] bg-gradient-to-br from-[#FFF3C4] to-[#FFE79E] opacity-60"
        style={{ animationDelay: "-6s" }}
      />

      {/* ===== header ===== */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <a
          href="#top"
          className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9B7A]/40"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[45%_55%_60%_40%/55%_45%_55%_45%] bg-[#FF9B7A] text-lg shadow-[0_8px_20px_-6px_rgba(255,155,122,0.7)]">
            🍑
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#4A3A2C]">
            repick
          </span>
        </a>
        <nav aria-label="주요 메뉴" className="hidden items-center gap-8 text-sm font-semibold text-[#8A7562] sm:flex">
          <a href="#why" className="rounded-full px-2 py-1 hover:text-[#FF9B7A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9B7A]/40">
            왜 repick
          </a>
          <a href="#how" className="rounded-full px-2 py-1 hover:text-[#FF9B7A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9B7A]/40">
            어떻게 써요
          </a>
          <a href="#voices" className="rounded-full px-2 py-1 hover:text-[#FF9B7A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9B7A]/40">
            사람들 이야기
          </a>
        </nav>
        <a
          href="#cta"
          className="rounded-full bg-[#4A3A2C] px-5 py-2.5 text-sm font-bold text-[#FFF9F2] shadow-[0_10px_24px_-8px_rgba(74,58,44,0.5)] transition-transform hover:-translate-y-0.5 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A3A2C]/30"
        >
          시작할래요 ✨
        </a>
      </header>

      {/* ===== hero ===== */}
      <main id="top">
        <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-10 text-center sm:px-10 sm:pt-16">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#D4F5E9] px-4 py-2 text-sm font-bold text-[#2F7A5E] shadow-[0_6px_16px_-6px_rgba(47,122,94,0.35)]">
            🌱 오늘도 물건에게 새 친구를 찾아주는 중
          </span>

          <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.15] tracking-tight text-[#4A3A2C] sm:text-6xl">
            안 쓰는 물건도,
            <br />
            <span className="relative inline-block px-2">
              <span className="relative z-10">다시 사랑받게</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-4 rounded-full bg-[#FFE79E] sm:h-6"
              />
            </span>
            <br />
            해줄게요 🐻
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#8A7562] sm:text-lg">
            repick은 옷장 속 잠자던 아이들을 콕콕 골라내는 AI 친구예요.
            사진 몇 장이면 가격도, 소개글도, 딱 맞는 새 주인도 뚝딱 찾아드려요.
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
            <a
              href="#cta"
              className="wiggle-hover rounded-full bg-[#FF9B7A] px-8 py-4 text-base font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(255,155,122,0.8)] transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF9B7A]/40"
            >
              무료로 골라보기 🍭
            </a>
            <a
              href="#how"
              className="rounded-full border-2 border-[#E8D9C8] bg-white/70 px-8 py-4 text-base font-bold text-[#4A3A2C] shadow-[0_10px_24px_-12px_rgba(74,58,44,0.25)] transition-transform hover:-translate-y-1 hover:border-[#FF9B7A] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4A3A2C]/20"
            >
              어떻게 하는지 볼래요
            </a>
          </div>

          {/* floaty stat blobs */}
          <div className="mt-16 grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="float-slow rounded-[50%_50%_45%_55%/60%_55%_45%_40%] bg-white/80 px-6 py-8 shadow-[0_16px_40px_-18px_rgba(74,58,44,0.35)]">
              <p className="text-3xl font-extrabold text-[#FF9B7A]">12만+</p>
              <p className="mt-1 text-sm font-semibold text-[#8A7562]">새 주인 찾은 물건들</p>
            </div>
            <div
              className="float-slow2 rounded-[45%_55%_60%_40%/45%_55%_45%_55%] bg-white/80 px-6 py-8 shadow-[0_16px_40px_-18px_rgba(74,58,44,0.35)]"
              style={{ animationDelay: "-2s" }}
            >
              <p className="text-3xl font-extrabold text-[#2F7A5E]">4.9★</p>
              <p className="mt-1 text-sm font-semibold text-[#8A7562]">평균 만족도</p>
            </div>
            <div
              className="float-slow rounded-[55%_45%_40%_60%/55%_40%_60%_45%] bg-white/80 px-6 py-8 shadow-[0_16px_40px_-18px_rgba(74,58,44,0.35)]"
              style={{ animationDelay: "-4s" }}
            >
              <p className="text-3xl font-extrabold text-[#E7A93C]">3분</p>
              <p className="mt-1 text-sm font-semibold text-[#8A7562]">평균 등록 시간</p>
            </div>
          </div>
        </section>

        {/* ===== why repick ===== */}
        <section id="why" className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
          <div className="mb-14 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#FF9B7A]">
              왜 repick일까요
            </p>
            <h2 className="text-3xl font-extrabold text-[#4A3A2C] sm:text-4xl">
              귀찮은 건 저희가, 마음은 손님이 🫶
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <article className="group rounded-[42%_58%_53%_47%/48%_44%_56%_52%] bg-[#FFE0D6] p-8 text-left shadow-[0_18px_36px_-16px_rgba(255,155,122,0.6)] transition-transform hover:-translate-y-2">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-inner">
                📸
              </span>
              <h3 className="mb-2 text-xl font-extrabold text-[#4A3A2C]">사진 한 장의 마법</h3>
              <p className="text-sm leading-relaxed text-[#6E5A47]">
                대충 찍어도 괜찮아요. AI가 브랜드, 상태, 시세까지 알아서 다 읽어드려요.
              </p>
            </article>

            <article className="group rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-[#D4F5E9] p-8 text-left shadow-[0_18px_36px_-16px_rgba(47,122,94,0.5)] transition-transform hover:-translate-y-2">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-inner">
                ✍️
              </span>
              <h3 className="mb-2 text-xl font-extrabold text-[#4A3A2C]">소개글도 뚝딱</h3>
              <p className="text-sm leading-relaxed text-[#6E5A47]">
                &ldquo;뭐라고 써야 팔릴까&rdquo; 고민 끝. 매력적인 문구를 저희가 대신 써드려요.
              </p>
            </article>

            <article className="group rounded-[48%_52%_58%_42%/58%_48%_52%_42%] bg-[#FFF3C4] p-8 text-left shadow-[0_18px_36px_-16px_rgba(231,169,60,0.5)] transition-transform hover:-translate-y-2">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-inner">
                💌
              </span>
              <h3 className="mb-2 text-xl font-extrabold text-[#4A3A2C]">딱 맞는 인연 매칭</h3>
              <p className="text-sm leading-relaxed text-[#6E5A47]">
                내 물건을 정말 원하는 사람에게, 딱 알맞은 가격으로 조용히 연결해드려요.
              </p>
            </article>
          </div>
        </section>

        {/* ===== how it works ===== */}
        <section id="how" className="relative z-10 bg-[#FFF3E4] py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#2F7A5E]">
                3단계면 충분해요
              </p>
              <h2 className="text-3xl font-extrabold text-[#4A3A2C] sm:text-4xl">
                복잡한 건 딱 질색이니까요
              </h2>
            </div>

            <ol className="grid grid-cols-1 gap-10 sm:grid-cols-3">
              <li className="flex flex-col items-center text-center">
                <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-[50%_50%_45%_55%/55%_45%_55%_45%] bg-[#FF9B7A] text-3xl font-extrabold text-white shadow-[0_14px_28px_-10px_rgba(255,155,122,0.7)]">
                  1
                </span>
                <h3 className="mb-2 text-lg font-bold text-[#4A3A2C]">사진 찍기 📷</h3>
                <p className="max-w-[220px] text-sm text-[#8A7562]">
                  안 쓰는 물건, 있는 그대로 찍어서 올려주세요.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-[45%_55%_55%_45%/50%_50%_50%_50%] bg-[#2F7A5E] text-3xl font-extrabold text-white shadow-[0_14px_28px_-10px_rgba(47,122,94,0.7)]">
                  2
                </span>
                <h3 className="mb-2 text-lg font-bold text-[#4A3A2C]">AI가 골라주기 🪄</h3>
                <p className="max-w-[220px] text-sm text-[#8A7562]">
                  가격, 카테고리, 소개글까지 순식간에 완성돼요.
                </p>
              </li>
              <li className="flex flex-col items-center text-center">
                <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-[55%_45%_50%_50%/45%_55%_45%_55%] bg-[#E7A93C] text-3xl font-extrabold text-white shadow-[0_14px_28px_-10px_rgba(231,169,60,0.7)]">
                  3
                </span>
                <h3 className="mb-2 text-lg font-bold text-[#4A3A2C]">새 주인 만나기 🎁</h3>
                <p className="max-w-[220px] text-sm text-[#8A7562]">
                  알림이 오면 확인만 하세요. 나머진 저희가 챙길게요.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ===== testimonial ===== */}
        <section id="voices" className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center sm:px-10 sm:py-28">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-[#FF9B7A]">
            사람들 이야기
          </p>
          <div className="relative mx-auto mt-8 max-w-2xl rounded-[38%_62%_45%_55%/55%_45%_58%_42%] bg-white px-8 py-10 shadow-[0_22px_50px_-20px_rgba(74,58,44,0.35)] sm:px-14 sm:py-14">
            <span aria-hidden className="absolute -top-6 left-10 text-6xl text-[#FFE0D6]">
              “
            </span>
            <p className="text-lg font-medium leading-relaxed text-[#4A3A2C] sm:text-xl">
              옷장 정리하다 몇 번 눌렀는데, 진짜 3분 만에 다 올라갔어요. 가격도
              제가 생각한 것보다 후하게 잡아줘서 놀랐어요. 이제 정리는 무조건 repick!
            </p>
            <p className="mt-6 text-sm font-bold text-[#8A7562]">— 은지, repick 21개월째 사용 중 🐰</p>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section id="cta" className="relative z-10 mx-auto max-w-6xl px-6 pb-24 sm:px-10">
          <div className="relative overflow-hidden rounded-[6%] bg-gradient-to-br from-[#FF9B7A] via-[#FFB199] to-[#FFD3A5] px-8 py-16 text-center shadow-[0_30px_60px_-24px_rgba(255,155,122,0.7)] sm:px-16 sm:py-20">
            <div
              aria-hidden
              className="blob-morph float-slow2 pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 bg-white/20"
            />
            <div
              aria-hidden
              className="blob-morph float-slow pointer-events-none absolute -right-10 -top-14 h-48 w-48 bg-white/20"
            />
            <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
              오늘, 옷장 속 친구 하나를
              <br className="hidden sm:block" /> 꺼내볼까요? 🧸
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/90">
              가입도, 등록도, 판매도 전부 무료예요. 부담 없이 살짝 구경만 해도 좋아요.
            </p>
            <a
              href="#top"
              className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-[#FF9B7A] shadow-[0_16px_32px_-12px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            >
              repick 시작하기 🌸
            </a>
          </div>
        </section>
      </main>

      {/* ===== footer ===== */}
      <footer className="relative z-10 border-t-2 border-dashed border-[#E8D9C8] bg-[#FFF3E4] px-6 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#8A7562] sm:flex-row">
          <p className="flex items-center gap-2 font-bold text-[#4A3A2C]">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF9B7A] text-sm">
              🍑
            </span>
            repick — 물건도 다시, 사람도 다시
          </p>
          <p>© 2026 repick. 모든 물건에게 두 번째 마음을.</p>
        </div>
      </footer>
    </div>
  );
}
