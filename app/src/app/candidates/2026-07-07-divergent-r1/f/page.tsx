export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0118] text-[#f5eaff] [font-family:ui-sans-serif,system-ui,-apple-system,sans-serif]">
      <style>{`
        @keyframes gridScroll {
          from { background-position: 0 0, 0 0; }
          to { background-position: 0 -120px, 0 -120px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.72; }
        }
        @keyframes hueSpin {
          from { filter: hue-rotate(0deg); }
          to { filter: hue-rotate(360deg); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes scanline {
          from { transform: translateY(-100%); }
          to { transform: translateY(100%); }
        }
        .vw-grid {
          background-image:
            repeating-linear-gradient(to right, rgba(0,255,240,0.55) 0px, rgba(0,255,240,0.55) 2px, transparent 2px, transparent 60px),
            repeating-linear-gradient(to bottom, rgba(255,43,214,0.55) 0px, rgba(255,43,214,0.55) 2px, transparent 2px, transparent 60px);
          animation: gridScroll 3.5s linear infinite;
        }
        .vw-neon-text {
          text-shadow:
            0 0 6px rgba(255,255,255,0.85),
            0 0 16px rgba(255,43,214,0.9),
            0 0 32px rgba(123,47,247,0.8),
            0 0 64px rgba(0,255,240,0.5);
        }
        .vw-neon-text-sm {
          text-shadow:
            0 0 4px rgba(255,255,255,0.7),
            0 0 10px rgba(0,255,240,0.8),
            0 0 22px rgba(123,47,247,0.6);
        }
        .vw-card {
          position: relative;
          background: linear-gradient(160deg, rgba(255,43,214,0.12), rgba(0,255,240,0.08) 40%, rgba(123,47,247,0.14));
          border: 1px solid rgba(0,255,240,0.35);
          box-shadow:
            0 0 1px rgba(255,255,255,0.4) inset,
            0 0 24px rgba(255,43,214,0.25),
            0 0 60px rgba(123,47,247,0.15);
        }
        .vw-card::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(120deg, #ff2bd6, #00fff0, #7b2ff7, #ff2bd6);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.9;
          animation: hueSpin 6s linear infinite;
          pointer-events: none;
        }
        .vw-sun {
          background: repeating-linear-gradient(
            to bottom,
            #ffe066 0px, #ffe066 6px,
            #ff9a3c 6px, #ff9a3c 12px,
            #ff5da2 12px, #ff5da2 18px,
            #d63bff 18px, #d63bff 24px,
            #7b2ff7 24px, #7b2ff7 30px
          );
          box-shadow: 0 0 80px 20px rgba(255,93,162,0.55), 0 0 160px 60px rgba(123,47,247,0.35);
        }
        .vw-scanlines::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.035) 0px,
            rgba(255,255,255,0.035) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
        }
        .vw-btn-primary {
          background: linear-gradient(90deg, #ff2bd6, #7b2ff7, #00fff0);
          box-shadow: 0 0 20px rgba(255,43,214,0.6), 0 0 40px rgba(0,255,240,0.35);
        }
        .vw-btn-primary:hover {
          box-shadow: 0 0 32px rgba(255,43,214,0.85), 0 0 64px rgba(0,255,240,0.55);
        }
        .vw-float {
          animation: floatY 5s ease-in-out infinite;
        }
        .vw-pulse {
          animation: pulseGlow 2.4s ease-in-out infinite;
        }
        :focus-visible {
          outline: 2px solid #00fff0;
          outline-offset: 3px;
        }
      `}</style>

      {/* background wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(123,47,247,0.35), transparent 60%), radial-gradient(900px 500px at 100% 20%, rgba(0,255,240,0.18), transparent 55%), radial-gradient(900px 500px at 0% 30%, rgba(255,43,214,0.18), transparent 55%), linear-gradient(180deg, #0a0118, #150726 40%, #0a0118)",
        }}
      />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <span className="text-lg font-black tracking-[0.15em] vw-neon-text-sm">
          RE<span className="text-[#00fff0]">PICK</span>
        </span>
        <nav className="hidden items-center gap-8 text-xs font-semibold tracking-[0.2em] text-[#e6d9ff]/80 sm:flex">
          <a href="#scan" className="rounded-sm transition hover:text-[#00fff0]">
            스캔
          </a>
          <a href="#report" className="rounded-sm transition hover:text-[#ff2bd6]">
            리포트
          </a>
          <a href="#market" className="rounded-sm transition hover:text-[#00fff0]">
            마켓
          </a>
        </nav>
        <a
          href="#start"
          className="rounded-full border border-[#00fff0]/60 px-4 py-2 text-xs font-bold tracking-widest text-[#00fff0] transition hover:bg-[#00fff0]/10"
        >
          시작하기
        </a>
      </header>

      {/* HERO */}
      <section
        id="scan"
        className="vw-scanlines relative isolate flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-6 pb-0 pt-10 text-center sm:px-8"
      >
        {/* sun */}
        <div
          aria-hidden
          className="vw-sun vw-float pointer-events-none absolute left-1/2 top-[14%] h-56 w-56 -translate-x-1/2 rounded-full sm:h-72 sm:w-72"
          style={{ clipPath: "inset(0 0 8% 0 round 999px)" }}
        />

        <p className="vw-pulse relative z-10 mb-6 text-[11px] font-bold tracking-[0.35em] text-[#00fff0] vw-neon-text-sm">
          ◢◤ FROM THE FUTURE MARKETPLACE ◢◤
        </p>

        <h1 className="vw-neon-text relative z-10 max-w-4xl text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-6xl">
          미래에서 도착한
          <br />
          중고 포털, <span className="text-[#ff2bd6]">REPICK</span>
        </h1>

        <p className="relative z-10 mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[#e6d9ff]/85 sm:text-base">
          AI 스캐너가 낡은 물건을 3초 만에 재감정합니다.
          <br className="hidden sm:block" />
          리셀 가치가 네온처럼 빛나는 순간을 지금 확인하세요.
        </p>

        <div className="relative z-10 mt-9 flex flex-col gap-4 sm:flex-row">
          <a
            href="#start"
            className="vw-btn-primary rounded-full px-8 py-3.5 text-sm font-bold tracking-wide text-[#0a0118] transition"
          >
            지금 스캔하기 →
          </a>
          <a
            href="#market"
            className="rounded-full border border-[#7b2ff7]/60 bg-white/5 px-8 py-3.5 text-sm font-bold tracking-wide text-[#f5eaff] backdrop-blur-sm transition hover:border-[#00fff0]/70 hover:text-[#00fff0]"
          >
            쇼케이스 보기
          </a>
        </div>

        {/* perspective grid floor */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 95%)",
          }}
        >
          <div
            className="vw-grid absolute inset-x-[-50%] bottom-0 h-[140%]"
            style={{
              transform: "perspective(280px) rotateX(62deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to top, rgba(255,43,214,0.55), transparent)",
            }}
          />
        </div>
      </section>

      {/* FEATURES */}
      <section id="report" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <h2 className="vw-neon-text-sm mb-3 text-center text-2xl font-black tracking-tight text-white sm:text-3xl">
          홀로그램처럼 선명한 재감정
        </h2>
        <p className="mx-auto mb-14 max-w-md text-center text-sm text-[#e6d9ff]/70">
          세 개의 네온 모듈이 당신의 물건을 새 시세로 다시 씌웁니다.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: "◈",
              title: "AI 비전 스캐너",
              desc: "사진 한 장이면 충분합니다. 상태·모델·연식을 즉시 판독해 시세를 뽑아냅니다.",
              glow: "#00fff0",
            },
            {
              icon: "▲",
              title: "홀로그램 가격 리포트",
              desc: "실시간 거래 그래프와 3중 검증 데이터로 최적가를 네온 라인처럼 보여줍니다.",
              glow: "#ff2bd6",
            },
            {
              icon: "◎",
              title: "네온 마켓 매칭",
              desc: "가장 잘 팔릴 채널로 자동 라우팅. 42개 마켓을 동시에 스캔합니다.",
              glow: "#7b2ff7",
            },
          ].map((f) => (
            <div key={f.title} className="vw-card rounded-2xl p-7">
              <div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-full text-xl font-black"
                style={{
                  color: f.glow,
                  textShadow: `0 0 12px ${f.glow}`,
                  border: `1px solid ${f.glow}66`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-bold text-white">{f.title}</h3>
              <p className="text-sm leading-relaxed text-[#e6d9ff]/75">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS TICKER */}
      <section
        aria-label="실시간 지표"
        className="relative z-10 border-y border-[#7b2ff7]/30 bg-[#12042a]/60 py-10"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 text-center sm:grid-cols-4 sm:px-8">
          {[
            { n: "128건/초", l: "실시간 AI 스캔" },
            { n: "+34%", l: "평균 재감정 상승률" },
            { n: "42개", l: "연동 마켓 채널" },
            { n: "0.3초", l: "홀로그램 리포트 생성" },
          ].map((s) => (
            <div key={s.l}>
              <p className="vw-neon-text-sm text-xl font-black text-[#00fff0] sm:text-2xl">{s.n}</p>
              <p className="mt-1 text-[11px] tracking-wide text-[#e6d9ff]/65">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SHOWCASE */}
      <section id="market" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:px-8">
        <h2 className="vw-neon-text-sm mb-3 text-center text-2xl font-black tracking-tight text-white sm:text-3xl">
          다시 태어난 물건들
        </h2>
        <p className="mx-auto mb-14 max-w-md text-center text-sm text-[#e6d9ff]/70">
          REPICK이 재감정한 아이템이 마켓 곳곳에서 네온처럼 팔려나갑니다.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { emoji: "📷", name: "빈티지 필름카메라", price: "₩312,000", tag: "+41%" },
            { emoji: "🎹", name: "레트로 신스사이저", price: "₩890,000", tag: "+27%" },
            { emoji: "👜", name: "디자이너 백", price: "₩540,000", tag: "+52%" },
          ].map((p) => (
            <div key={p.name} className="vw-card overflow-hidden rounded-2xl">
              <div
                className="flex h-40 items-center justify-center text-5xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,43,214,0.25), rgba(123,47,247,0.25), rgba(0,255,240,0.2))",
                }}
              >
                <span aria-hidden>{p.emoji}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{p.name}</h3>
                  <span className="rounded-full border border-[#00fff0]/50 px-2 py-0.5 text-[10px] font-bold text-[#00fff0]">
                    {p.tag}
                  </span>
                </div>
                <p className="mt-2 text-lg font-black text-[#ff2bd6] vw-neon-text-sm">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="start" className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center sm:px-8">
        <h2 className="vw-neon-text mb-5 text-3xl font-black leading-tight text-white sm:text-4xl">
          당신의 물건,
          <br />
          아직 끝나지 않았습니다
        </h2>
        <p className="mb-8 text-sm text-[#e6d9ff]/80 sm:text-base">
          지금 스캔하고 네온빛 가격표를 받아보세요.
        </p>
        <a
          href="#scan"
          className="vw-btn-primary inline-block rounded-full px-10 py-4 text-sm font-bold tracking-wide text-[#0a0118] transition"
        >
          REPICK 시작하기 →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#7b2ff7]/30 px-6 py-10 text-center sm:px-8">
        <p className="text-xs tracking-[0.3em] text-[#e6d9ff]/50">
          RE<span className="text-[#00fff0]">PICK</span> © 2086 · 미래형 리커머스 포털
        </p>
      </footer>
    </div>
  );
}
