import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "repick — 그때 그 감성, 다시 리픽!",
};

const TICKER_TEXT =
  "★ NEW ARRIVAL ★ AI가 찾아주는 오늘의 득템 ★ 이번주 접속자 128,402명 ★ 지금 가입하면 웰컴 포인트 ★ 다시 유행하는 건 옷만이 아니다 ★";

const ITEMS = [
  { emoji: "👖", name: "빈티지 와이드 데님", price: "38,000", tag: "HOT", hue: "from-fuchsia-400 via-pink-300 to-cyan-300" },
  { emoji: "📼", name: "Y2K 카고 스커트", price: "24,000", tag: "NEW", hue: "from-cyan-300 via-sky-300 to-violet-400" },
  { emoji: "👟", name: "메탈릭 청키 스니커즈", price: "52,000", tag: "BEST", hue: "from-yellow-300 via-lime-300 to-emerald-300" },
  { emoji: "🕶️", name: "홀로그램 선글라스", price: "15,000", tag: "HOT", hue: "from-purple-400 via-fuchsia-300 to-pink-300" },
  { emoji: "📻", name: "레트로 CD 플레이어", price: "29,000", tag: "NEW", hue: "from-orange-300 via-amber-300 to-yellow-300" },
  { emoji: "💿", name: "크롬 미니백", price: "41,000", tag: "BEST", hue: "from-sky-300 via-cyan-200 to-teal-300" },
];

const GUESTBOOK = [
  { user: "핑크몬스터99", msg: "진짜 2001년으로 돌아간 줄..ㅋㅋㅋ AI 추천템 다 내 스타일임 ㄷㄷ", stamp: "2026.07.05" },
  { user: "샛별공주", msg: "엄마 옷장 정리하다 판 게 이 사이트에서 또 팔림 신기 ✧٩(ˊωˋ*)و✧", stamp: "2026.07.03" },
  { user: "체리보이", msg: "중고인데 중고 같지 않아요 배송도 반짝반짝 빠름!!", stamp: "2026.07.01" },
];

function SparkleField() {
  const sparkles = [
    { top: "6%", left: "8%", size: "text-2xl", delay: "0s", char: "✦" },
    { top: "14%", left: "88%", size: "text-lg", delay: "0.4s", char: "✧" },
    { top: "70%", left: "4%", size: "text-xl", delay: "0.8s", char: "★" },
    { top: "82%", left: "92%", size: "text-2xl", delay: "1.2s", char: "✦" },
    { top: "40%", left: "50%", size: "text-sm", delay: "0.2s", char: "✧" },
    { top: "20%", left: "45%", size: "text-lg", delay: "1s", char: "★" },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s, i) => (
        <span
          key={i}
          className={`absolute ${s.size} text-white [animation:y2k-twinkle_2.4s_ease-in-out_infinite]`}
          style={{ top: s.top, left: s.left, animationDelay: s.delay, textShadow: "0 0 8px #fff, 0 0 16px #f0f" }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0a0a1f] font-[system-ui,-apple-system,'Segoe_UI',sans-serif] text-white">
      <style>{`
        @keyframes y2k-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes y2k-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.2) rotate(20deg); }
        }
        @keyframes y2k-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes y2k-shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .y2k-chrome-text {
          background: linear-gradient(180deg, #ffffff 0%, #cfd8e3 20%, #8fa1b3 45%, #ffffff 55%, #b6c6d6 75%, #ffffff 100%);
          background-size: 100% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: y2k-shine 5s linear infinite;
          text-shadow: 0 2px 0 rgba(0,0,0,0.25);
        }
        .y2k-bevel-btn {
          box-shadow:
            inset 0 2px 1px rgba(255,255,255,0.85),
            inset 0 -3px 4px rgba(0,0,0,0.35),
            0 4px 0 rgba(0,0,0,0.3),
            0 6px 10px rgba(0,0,0,0.35);
        }
        .y2k-bevel-btn:active {
          box-shadow:
            inset 0 2px 4px rgba(0,0,0,0.4),
            0 1px 0 rgba(0,0,0,0.3);
          transform: translateY(3px);
        }
        .y2k-card-shine {
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -6px 12px rgba(0,0,0,0.15),
            0 6px 18px rgba(0,0,0,0.45);
        }
        .y2k-crt-border {
          border-image: repeating-linear-gradient(45deg, #ff5fd0, #ff5fd0 6px, #5fe0ff 6px, #5fe0ff 12px) 6;
        }
      `}</style>

      {/* 최상단 마퀴 티커 */}
      <div
        className="relative z-20 overflow-hidden border-b-4 border-fuchsia-400 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-cyan-500 py-1.5"
        aria-hidden="true"
      >
        <div className="flex w-max whitespace-nowrap text-xs font-bold tracking-wide text-white [animation:y2k-marquee_18s_linear_infinite]">
          <span className="pr-8">{TICKER_TEXT}</span>
          <span className="pr-8">{TICKER_TEXT}</span>
        </div>
      </div>

      {/* 레트로 툴바 네비게이션 */}
      <header className="relative z-20 border-b-2 border-cyan-400/40 bg-[#0a0a1f]/90 px-4 py-3 backdrop-blur-sm sm:px-8">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <span
            className="text-xl font-black tracking-tight y2k-chrome-text"
            style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
          >
            re:pick <span className="text-fuchsia-400">◇</span>
          </span>
          <ul className="flex flex-wrap items-center gap-2 text-xs font-bold sm:text-sm">
            {["둘러보기", "인기템", "이벤트"].map((label) => (
              <li key={label}>
                <a
                  href="#items"
                  className="y2k-bevel-btn rounded-md bg-gradient-to-b from-slate-100 to-slate-400 px-3 py-1.5 text-slate-900 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a1f]"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#cta"
                className="y2k-bevel-btn rounded-md bg-gradient-to-b from-fuchsia-300 via-pink-400 to-fuchsia-600 px-3 py-1.5 text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a1f]"
              >
                로그인 ✦
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* 히어로 */}
        <section className="relative overflow-hidden px-4 py-16 sm:px-8 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 20% 20%, rgba(255,95,208,0.35), transparent 45%), radial-gradient(circle at 80% 30%, rgba(95,224,255,0.35), transparent 45%), radial-gradient(circle at 50% 90%, rgba(180,120,255,0.3), transparent 50%)",
            }}
          />
          <SparkleField />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <span className="y2k-bevel-btn rounded-full bg-gradient-to-b from-yellow-200 to-yellow-400 px-4 py-1 text-[11px] font-black uppercase tracking-widest text-yellow-900">
              ⚡ Best Viewed at 1024×768 ⚡
            </span>
            <h1
              className="y2k-chrome-text text-6xl font-black leading-[0.95] tracking-tight sm:text-8xl"
              style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
            >
              RE:PICK
            </h1>
            <p className="max-w-xl text-base font-semibold text-cyan-100 sm:text-lg">
              그때 그 감성, 다시 리픽 ✧ AI가 네 취향을 스캔해서
              <br className="hidden sm:block" />
              전국의 숨은 중고템을 반짝반짝 골라줌 🛸
            </p>

            <div id="cta" className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#items"
                className="y2k-bevel-btn rounded-xl bg-gradient-to-b from-cyan-200 via-cyan-400 to-blue-600 px-8 py-3 text-lg font-black text-white transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a1f]"
              >
                지금 득템하러 가기 →
              </a>
              <a
                href="#guestbook"
                className="y2k-bevel-btn rounded-xl bg-gradient-to-b from-pink-100 via-fuchsia-300 to-purple-600 px-8 py-3 text-lg font-black text-white transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a1f]"
              >
                방명록 구경 ✎
              </a>
            </div>

            {/* 히트 카운터 */}
            <div className="mt-8 flex items-center gap-3 rounded-lg border-2 border-cyan-300/50 bg-black/60 px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Visitors</span>
              <div className="flex gap-0.5 font-mono text-lg font-black tracking-widest text-lime-400">
                {"128402".split("").map((digit, i) => (
                  <span key={i} className="rounded-sm bg-[#0f2410] px-1.5 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]">
                    {digit}
                  </span>
                ))}
              </div>
              <span className="text-lime-300 [animation:y2k-blink_1s_step-start_infinite]">_</span>
            </div>
          </div>
        </section>

        {/* 홀로그램 스탯 바 */}
        <section
          aria-label="이번주 리픽 현황"
          className="relative border-y-2 border-white/10 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-cyan-500 px-4 py-6 sm:px-8"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 text-center sm:grid-cols-3">
            {[
              { label: "오늘 리픽된 아이템", value: "3,204개" },
              { label: "AI 매칭 정확도", value: "94.7%" },
              { label: "평균 절약 금액", value: "62,000원" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg bg-black/25 px-4 py-4 y2k-card-shine">
                <p
                  className="text-3xl font-black text-white"
                  style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-bold text-cyan-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 아이템 그리드 */}
        <section id="items" className="relative px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <h2
                className="y2k-chrome-text inline-block text-3xl font-black sm:text-4xl"
                style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
              >
                ✦ 이번주 인기 리픽 아이템 ✦
              </h2>
              <p className="mt-2 text-sm font-semibold text-cyan-200">클릭 한 번이면 반짝이는 득템 완료</p>
            </div>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ITEMS.map((item) => (
                <li key={item.name}>
                  <div className={`rounded-2xl bg-gradient-to-br ${item.hue} p-[3px]`}>
                    <div className="y2k-card-shine flex h-full flex-col items-center gap-3 rounded-[14px] bg-[#0c0c26] px-5 py-6 text-center">
                      <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-b from-white/20 to-white/5 text-4xl">
                        {item.emoji}
                      </span>
                      <span
                        className={`rounded-full bg-gradient-to-r ${item.hue} px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-900`}
                      >
                        {item.tag}
                      </span>
                      <h3 className="text-base font-bold text-white">{item.name}</h3>
                      <p className="font-mono text-xl font-black text-lime-300">{item.price}원</p>
                      <a
                        href="#cta"
                        className="y2k-bevel-btn mt-1 w-full rounded-lg bg-gradient-to-b from-slate-100 to-slate-400 px-4 py-2 text-sm font-black text-slate-900 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300"
                      >
                        찜하기 ♥
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 방명록 */}
        <section id="guestbook" className="relative px-4 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <h2
              className="y2k-chrome-text mb-2 text-center text-3xl font-black"
              style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
            >
              ☆ GUEST BOOK ☆
            </h2>
            <p className="mb-8 text-center text-sm font-semibold text-cyan-200">
              리픽러들이 남기고 간 반짝이는 한마디
            </p>

            <div className="space-y-4">
              {GUESTBOOK.map((entry) => (
                <article
                  key={entry.user}
                  className="rounded-lg border-2 border-dashed border-cyan-300/50 bg-black/50 p-4 font-mono text-sm text-cyan-50 y2k-card-shine"
                >
                  <header className="mb-1 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-fuchsia-300">✧ {entry.user}</span>
                    <span className="text-[11px] text-cyan-400">{entry.stamp}</span>
                  </header>
                  <p className="leading-relaxed text-slate-100">{entry.msg}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 최종 CTA */}
        <section className="relative overflow-hidden px-4 py-16 text-center sm:px-8 sm:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, #ff5fd0 0%, #7f5fff 35%, #5fe0ff 70%, #ff5fd0 100%)",
              backgroundSize: "300% 300%",
              animation: "y2k-shine 8s ease infinite",
            }}
          />
          <SparkleField />
          <div className="relative mx-auto max-w-2xl">
            <h2
              className="text-3xl font-black text-white drop-shadow-[0_3px_0_rgba(0,0,0,0.35)] sm:text-5xl"
              style={{ fontFamily: "Impact, 'Arial Black', system-ui, sans-serif" }}
            >
              지금 접속해서
              <br />
              내 취향 리픽 받기 ✦
            </h2>
            <a
              href="#cta"
              className="y2k-bevel-btn mt-8 inline-block rounded-xl bg-gradient-to-b from-white via-slate-100 to-slate-300 px-10 py-4 text-lg font-black text-fuchsia-700 transition-transform hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-black/40"
            >
              무료로 시작하기 →
            </a>
          </div>
        </section>
      </main>

      {/* 풋터 웹링 */}
      <footer className="relative border-t-2 border-cyan-300/30 bg-black/60 px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["◈ Netscape 호환", "◈ 1024×768 최적화", "◈ 33.6k 모뎀 지원"].map((badge) => (
              <span
                key={badge}
                className="rounded border border-cyan-400/40 bg-gradient-to-b from-slate-800 to-slate-900 px-3 py-1 text-[10px] font-bold text-cyan-200"
              >
                {badge}
              </span>
            ))}
          </div>
          <p className="text-xs font-semibold text-fuchsia-200">
            © 2026 re:pick — 다시 유행하는 건, 스타일만이 아니야
            <span className="ml-1 text-cyan-300 [animation:y2k-blink_1s_step-start_infinite]">▍</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
