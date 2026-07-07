type SpecRow = [string, string];

type Feature = {
  icon: string;
  tag?: string;
  color: string;
  title: string;
  tagline: string;
  desc: string;
  specs: SpecRow[];
};

const features: Feature[] = [
  {
    icon: "☞",
    color: "#9900cc",
    title: "취향 학습 엔진",
    tagline: "당신의 클릭 하나하나를 기억합니다",
    desc: "찜하고, 클릭하고, 구매한 모든 흔적을 AI가 학습해요. 쓰면 쓸수록 나보다 나를 더 잘 아는 추천이 됩니다.",
    specs: [
      ["학습 데이터", "찜 · 클릭 · 구매 이력"],
      ["갱신 주기", "실시간 반영"],
      ["정확도", "사용 30일차부터 급상승"],
    ],
  },
  {
    icon: "★",
    tag: "NEW",
    color: "#ff33cc",
    title: "AI 매칭 시스템",
    tagline: "수만 개 매물 중 당신 취향만",
    desc: "매일 쏟아지는 수만 건의 중고 매물을 AI가 밤새 훑어서, 당신 취향에 맞는 것만 골라 드립니다.",
    specs: [
      ["분석 매물 수", "일 평균 40,000+ 건"],
      ["매칭 기준", "취향 · 가격 · 상태"],
      ["처리 시간", "실시간 ~ 수 분"],
    ],
  },
  {
    icon: "✔",
    color: "#008080",
    title: "신뢰 검증 시스템",
    tagline: "가짜 매물, 허위 상태는 걸러냅니다",
    desc: "상태 설명, 가격 적정성, 판매자 이력을 AI가 교차 검증해서 믿을 수 있는 매물만 보여드려요.",
    specs: [
      ["검증 항목", "상태 · 가격 · 판매자 이력"],
      ["이상 매물", "자동 필터링"],
      ["표시 방식", "신뢰도 배지 부여"],
    ],
  },
  {
    icon: "🔔",
    color: "#ff9900",
    title: "실시간 알림",
    tagline: "가격 떨어지는 순간 바로 알려드림",
    desc: "찜한 상품 가격이 내려가거나 취향 저격 매물이 새로 올라오면, 그 즉시 알려드립니다.",
    specs: [
      ["알림 종류", "가격 하락 · 신규 매칭"],
      ["알림 속도", "등록 즉시"],
      ["채널", "앱 푸시"],
    ],
  },
];

const navItems = ["홈", "기능소개", "요금제", "문의하기", "방명록✍"];

const badges: { lines: [string, string] }[] = [
  { lines: ["👁 BEST VIEWED", "800×600"] },
  { lines: ["🌐 넷스케이프 내비게이터", "4.0 최적화"] },
  { lines: ["📞 56K 모뎀 지원", "로딩 3초 이내"] },
  { lines: ["♿ WCAG 준수", "(진짜임)"] },
];

const rainbow = ["#ff2d55", "#ff9500", "#ffcc00", "#34c759", "#00c7be", "#0a84ff", "#af52de"];

function RainbowText({ text }: { text: string }) {
  return (
    <span aria-label={text}>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={i} aria-hidden="true">
            {" "}
          </span>
        ) : (
          <span key={i} aria-hidden="true" style={{ color: rainbow[i % rainbow.length] }}>
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

function Sparkle({
  delay = "0s",
  className = "",
}: {
  delay?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`gc-twinkle-el inline-block ${className}`}
      style={{ animationDelay: delay }}
    >
      ✦
    </span>
  );
}

function Bevel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-t-2 border-l-2 border-white/90 border-b-2 border-r-2 border-black/70 bg-[#c0c0c0] ${className}`}
    >
      {children}
    </div>
  );
}

function FeatureCard({ f, index }: { f: Feature; index: number }) {
  return (
    <div className="relative border-4 border-black bg-[#fffdf0] shadow-[6px_6px_0_0_#000]">
      {f.tag && (
        <span className="gc-blink-text absolute -right-3 -top-3 z-10 rotate-6 border-2 border-black bg-[#ffee00] px-2 py-0.5 text-xs font-bold text-black">
          ★{f.tag}★
        </span>
      )}
      <div
        className="flex items-center gap-2 border-b-4 border-black px-4 py-2"
        style={{ background: f.color }}
      >
        <span aria-hidden="true" className="text-xl">
          {f.icon}
        </span>
        <h3
          className="text-base font-bold uppercase tracking-wide text-white sm:text-lg"
          style={{ textShadow: "1px 1px 0 #000" }}
        >
          {String(index + 1).padStart(2, "0")}. {f.title}
        </h3>
      </div>
      <div className="p-4">
        <p className="text-sm font-bold text-[#cc0066]">&quot;{f.tagline}&quot;</p>
        <p className="mt-2 text-sm leading-relaxed text-black/80">{f.desc}</p>
        <div className="mt-4 border-2 border-black/60">
          {f.specs.map(([k, v], i) => (
            <div
              key={k}
              className={`grid grid-cols-[auto_1fr] gap-2 border-b border-black/30 px-2 py-1 text-xs last:border-b-0 ${
                i % 2 === 0 ? "bg-black/5" : "bg-white"
              }`}
            >
              <span className="font-bold text-black/60">▸ {k}</span>
              <span className="text-black/80">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-serif text-black">
      <style>{`
        @keyframes gc-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes gc-blink { 50% { opacity: 0; } }
        @keyframes gc-twinkle { 0%, 100% { opacity: 1; } 50% { opacity: .3; } }
        .gc-marquee-track { animation: gc-marquee 18s linear infinite; }
        .gc-blink-text { animation: gc-blink 1s step-start infinite; }
        .gc-twinkle-el { animation: gc-twinkle 1.6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .gc-marquee-track, .gc-blink-text, .gc-twinkle-el { animation: none !important; }
        }
      `}</style>

      {/* caution-tape marquee */}
      <div
        className="overflow-hidden border-b-4 border-black py-1"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,#ffe600 0 20px,#111 20px 40px)",
        }}
        aria-hidden="true"
      >
        <div className="gc-marquee-track flex w-max whitespace-nowrap">
          <span className="mx-4 bg-black px-2 py-0.5 text-sm font-bold text-[#ffe600]">
            🚧 UNDER CONSTRUCTION 🚧 &mdash; 이 페이지는 열심히 만드는 중입니다 &mdash; RE:PICK 기능소개 홈페이지에 오신 것을 환영합니다 &mdash; 🚧 UNDER CONSTRUCTION 🚧
          </span>
          <span className="mx-4 bg-black px-2 py-0.5 text-sm font-bold text-[#ffe600]">
            🚧 UNDER CONSTRUCTION 🚧 &mdash; 이 페이지는 열심히 만드는 중입니다 &mdash; RE:PICK 기능소개 홈페이지에 오신 것을 환영합니다 &mdash; 🚧 UNDER CONSTRUCTION 🚧
          </span>
        </div>
      </div>

      {/* HEADER / BANNER */}
      <header
        id="top"
        className="relative overflow-hidden border-b-4 border-black px-4 py-10 text-center sm:py-14"
        style={{
          backgroundColor: "#330066",
          backgroundImage:
            "radial-gradient(circle,#ffee00 1px,transparent 1.5px), radial-gradient(circle,#00ffff 1px,transparent 1.5px)",
          backgroundSize: "24px 24px, 24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      >
        <Sparkle className="absolute left-6 top-6 text-2xl text-[#ffee00]" />
        <Sparkle delay="0.4s" className="absolute right-8 top-10 text-xl text-[#00ffff]" />
        <Sparkle delay="0.8s" className="absolute bottom-6 left-1/4 text-lg text-[#ff33cc]" />
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ffee00]">
          ☆彡 welcome to my homepage 彡☆
        </p>
        <h1
          className="mt-3 text-4xl font-black leading-tight sm:text-6xl"
          style={{ fontFamily: "'Comic Sans MS','Chalkboard SE',cursive" }}
        >
          <RainbowText text="RE:PICK 기능소개" />
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-bold text-white sm:text-base">
          AI가 당신 대신{" "}
          <span className="gc-blink-text text-[#ffee00]">수만 개</span>의 중고 매물을 뒤져서 딱 맞는 것만 골라드려요
        </p>
        <div
          className="mx-auto mt-6 h-3 max-w-xl"
          style={{
            backgroundImage:
              "linear-gradient(90deg,#ff0000,#ff9900,#ffee00,#33cc33,#0066ff,#9900cc,#ff0099)",
          }}
          aria-hidden="true"
        />
      </header>

      {/* NAV */}
      <nav aria-label="주요 메뉴" className="border-b-4 border-black bg-[#008080] px-3 py-3">
        <Bevel className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-2 px-3 py-2">
          {navItems.map((item) => (
            <a
              key={item}
              href="#top"
              className="border-2 border-black bg-white px-3 py-1 text-xs font-bold text-blue-800 underline decoration-blue-800 hover:bg-[#ffee00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff00cc] sm:text-sm"
            >
              {item}
            </a>
          ))}
        </Bevel>
      </nav>

      {/* BADGES */}
      <div className="flex flex-wrap items-center justify-center gap-3 border-b-4 border-black bg-[#c0c0c0] px-3 py-3">
        {badges.map((b) => (
          <Bevel key={b.lines.join("-")} className="px-2 py-1 text-center leading-tight">
            <span className="block text-[10px] font-bold text-black sm:text-xs">{b.lines[0]}</span>
            <span className="block text-[10px] text-black/70 sm:text-xs">{b.lines[1]}</span>
          </Bevel>
        ))}
      </div>

      <main>
        {/* FEATURES */}
        <section
          aria-labelledby="features-heading"
          className="border-b-4 border-black px-4 py-10 sm:px-8 sm:py-14"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg,#fff0f5 0 16px,#ffe6f2 16px 32px)",
          }}
        >
          <div className="mx-auto max-w-5xl text-center">
            <h2
              id="features-heading"
              className="text-2xl font-black uppercase text-[#cc0066] sm:text-3xl"
              style={{ fontFamily: "'Comic Sans MS','Chalkboard SE',cursive" }}
            >
              <Sparkle className="mr-2 text-[#ffcc00]" />
              핵심 기능 4가지
              <Sparkle delay="0.5s" className="ml-2 text-[#ffcc00]" />
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-black/70">
              클릭 몇 번이면 끝. 나머지는 AI가 다 합니다. 스크롤 내려서 하나씩 구경해보세요.
            </p>
          </div>
          <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
            {features.map((f, i) => (
              <FeatureCard key={f.title} f={f} index={i} />
            ))}
          </div>
        </section>

        {/* VISITOR COUNTER + WEBRING */}
        <section
          aria-labelledby="counter-heading"
          className="border-b-4 border-black bg-black px-4 py-12 text-center sm:px-8"
        >
          <h2 id="counter-heading" className="text-lg font-bold uppercase tracking-widest text-[#00ff66]">
            방문자 카운터
          </h2>
          <div className="mx-auto mt-4 inline-flex gap-1 border-4 border-[#00ff66] bg-black px-4 py-3">
            {"007342".split("").map((d, i) => (
              <span
                key={i}
                className="font-mono text-3xl font-bold text-[#00ff66] sm:text-4xl"
                style={{ textShadow: "0 0 6px #00ff66" }}
              >
                {d}
              </span>
            ))}
          </div>
          <p className="mt-3 text-xs text-white/60">
            당신은 저희 홈페이지의 <span className="text-[#00ff66]">7,342번째</span> 방문자입니다. 감사합니다!
          </p>

          <div className="mx-auto mt-10 max-w-md border-2 border-white/20 p-4">
            <p className="text-xs text-white/70">
              이 사이트는{" "}
              <a
                href="#top"
                className="text-[#00ccff] underline hover:text-[#ffee00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ccff]"
              >
                AI 리커머스 웹링
              </a>
              의 정회원입니다
            </p>
            <nav aria-label="웹링 이동" className="mt-2 flex justify-center gap-3 text-xs">
              <a
                href="#top"
                className="text-[#00ccff] underline hover:text-[#ffee00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ccff]"
              >
                ◀ 이전
              </a>
              <span aria-hidden="true" className="text-white/30">
                |
              </span>
              <a
                href="#top"
                className="text-[#00ccff] underline hover:text-[#ffee00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ccff]"
              >
                랜덤 ⚄
              </a>
              <span aria-hidden="true" className="text-white/30">
                |
              </span>
              <a
                href="#top"
                className="text-[#00ccff] underline hover:text-[#ffee00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00ccff]"
              >
                다음 ▶
              </a>
            </nav>
          </div>
        </section>

        {/* CTA */}
        <section
          aria-labelledby="cta-heading"
          className="relative overflow-hidden px-4 py-16 text-center sm:px-8"
          style={{
            backgroundColor: "#ff33cc",
            backgroundImage:
              "repeating-linear-gradient(45deg,rgba(255,255,255,.15) 0 10px,transparent 10px 20px)",
          }}
        >
          <Sparkle className="absolute left-8 top-8 text-2xl text-white" />
          <Sparkle delay="0.6s" className="absolute bottom-10 right-10 text-2xl text-white" />
          <h2
            id="cta-heading"
            className="text-2xl font-black text-white sm:text-4xl"
            style={{ fontFamily: "'Comic Sans MS','Chalkboard SE',cursive", textShadow: "2px 2px 0 #000" }}
          >
            지금 가입하면 <span className="gc-blink-text">공짜★</span>예요!!
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm font-bold text-white/90 sm:text-base">
            카드 등록 NO. 회원가입 30초. 오늘부터 AI가 알아서 찾아줍니다.
          </p>
          <a
            href="#top"
            className="mt-8 inline-block border-4 border-black bg-[#ffee00] px-8 py-4 text-lg font-black uppercase text-black shadow-[6px_6px_0_0_#000] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            ▶ 지금 시작하기 ◀
          </a>
          <p className="mt-6 text-xs text-white/80">※ 이 버튼은 진짜로 작동합니다 (신뢰검증 시스템 통과함)</p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t-4 border-black bg-[#c0c0c0] px-4 py-6 text-center text-[11px] text-black/70 sm:px-8">
        <p>© 1999&ndash;2026 RE:PICK HOMEPAGE. ALL RIGHTS RESERVED.</p>
        <p className="mt-1">
          이 페이지는 800×600 해상도, Internet Explorer 4.0 / Netscape Navigator 4.0에 최적화되어 있습니다.
        </p>
        <p className="mt-1">
          문의:{" "}
          <a
            href="mailto:webmaster@repick.example"
            className="text-blue-800 underline hover:text-[#cc0066] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cc0066]"
          >
            webmaster@repick.example
          </a>{" "}
          · 마지막 업데이트 2026.07.07 · Made with ♥ in Notepad
        </p>
      </footer>
    </div>
  );
}
