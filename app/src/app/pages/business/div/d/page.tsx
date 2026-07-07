const HERO_BADGES = [
  { text: "재고 회전율 +42%", pos: "-top-6 -left-4 sm:-left-10 rotate-[-7deg]", delay: "0s" },
  { text: "AI 매칭 정확도 91%", pos: "top-1/3 -right-6 sm:-right-14 rotate-[6deg]", delay: "1.2s" },
  { text: "재고소진 2.3배 ↑", pos: "-bottom-8 left-4 sm:left-10 rotate-[4deg]", delay: "2.1s" },
];

const CHART_BARS = [38, 55, 46, 68, 60, 82, 74, 95];

const LOGOS = ["VINTAGE HAUS", "리클로젯", "세컨드무브", "오르카마켓", "루프스토어", "서클스토어"];

const STATS = [
  { icon: "📈", value: "+42%", label: "재고 회전율" },
  { icon: "⏱️", value: "-58%", label: "평균 판매 기간" },
  { icon: "🎯", value: "91%", label: "AI 매칭 정확도" },
  { icon: "⭐", value: "4.8", label: "셀러 만족도 (5점 만점)" },
];

const TOOLS = [
  {
    icon: "📊",
    title: "스마트 재고 대시보드",
    desc: "실시간 재고 현황과 판매 흐름을 한 화면에서 파악하세요. 어떤 상품이 빠르게 나가는지, 어떤 재고가 마르고 있는지 즉시 확인합니다.",
    gradient: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: "🤖",
    title: "AI 자동 매칭 엔진",
    desc: "수요 예측 모델이 구매 의사가 높은 사용자에게 상품을 자동 노출합니다. 추가 광고비 없이도 전환율이 올라갑니다.",
    gradient: "from-blue-500 to-violet-500",
  },
  {
    icon: "💎",
    title: "다이나믹 가격 최적화",
    desc: "시장 데이터와 재고 회전 속도를 분석해 최적 판매가를 실시간으로 제안합니다.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: "🔗",
    title: "원클릭 API 연동",
    desc: "기존 ERP·쇼핑몰 시스템과 매끄럽게 연동됩니다. 개발 리소스 없이도 하루 만에 시작할 수 있어요.",
    gradient: "from-sky-500 to-blue-500",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <style>{`
        @keyframes blob-float-a { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(40px,-50px) scale(1.1); } 66% { transform: translate(-30px,30px) scale(0.94); } }
        @keyframes blob-float-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,35px) scale(1.08); } }
        @keyframes blob-float-c { 0%,100% { transform: translate(0,0) scale(1); } 40% { transform: translate(25px,40px) scale(0.9); } 80% { transform: translate(-20px,-25px) scale(1.06); } }
        @keyframes chip-float { 0%,100% { transform: translateY(0) rotate(var(--rot,0deg)); } 50% { transform: translateY(-14px) rotate(var(--rot,0deg)); } }
        @keyframes mockup-tilt { 0%,100% { transform: perspective(1200px) rotateX(6deg) rotateY(-9deg) translateY(0); } 50% { transform: perspective(1200px) rotateX(4deg) rotateY(-6deg) translateY(-14px); } }
        @keyframes marquee-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .badge-float { animation: chip-float 6s ease-in-out infinite; }
        .marquee-track { animation: marquee-x 26s linear infinite; }
      `}</style>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-pink-500 text-sm font-black text-white shadow-md shadow-violet-300/50">
              r
            </span>
            <span className="text-lg font-black tracking-tight text-slate-900">
              repick <span className="text-violet-600">Business</span>
            </span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#tools">
              기능
            </a>
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#stats">
              도입 효과
            </a>
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#story">
              고객 사례
            </a>
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#demo">
              문의
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-full bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-300/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-400/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
          >
            데모 신청
          </a>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div
              className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 opacity-50 blur-3xl"
              style={{ animation: "blob-float-a 11s ease-in-out infinite" }}
            />
            <div
              className="absolute top-10 -right-20 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-pink-400 to-rose-300 opacity-45 blur-3xl"
              style={{ animation: "blob-float-b 13s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400 to-sky-300 opacity-40 blur-3xl"
              style={{ animation: "blob-float-c 15s ease-in-out infinite" }}
            />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24 lg:pb-32">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-1.5 text-xs font-bold tracking-wide text-violet-700 shadow-sm">
                ✨ repick for Business
              </span>
              <h1 className="mt-6 text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl">
                잠든 재고를{" "}
                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 bg-clip-text text-transparent">
                  깨우는
                </span>{" "}
                가장 똑똑한 방법
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                AI가 실시간으로 구매 의사가 높은 사용자를 찾아 재고를 매칭합니다. 재고 순환 속도를 높이고,
                광고비 없이 판매 전환율을 끌어올리세요.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#demo"
                  className="rounded-full bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-400/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                >
                  무료 데모 신청
                </a>
                <a
                  href="#story"
                  className="rounded-full border-2 border-violet-200 bg-white/70 px-8 py-4 text-base font-bold text-violet-700 backdrop-blur transition-all duration-300 hover:border-violet-400 hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                >
                  도입 사례 보기
                </a>
              </div>
            </div>

            {/* HERO 3D MOCKUP */}
            <div className="relative mx-auto w-full max-w-sm lg:mx-0">
              <div
                className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-violet-300/50 backdrop-blur-xl"
                style={{ animation: "mockup-tilt 9s ease-in-out infinite" }}
              >
                <div className="mb-5 flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-semibold text-slate-400">
                    repick · 셀러 대시보드
                  </span>
                </div>
                <div className="mb-4 flex items-end gap-2 h-32">
                  {CHART_BARS.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-violet-500 via-blue-500 to-pink-400"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-violet-50 p-3">
                    <p className="text-xs font-semibold text-violet-500">오늘 매칭</p>
                    <p className="text-xl font-black text-violet-700">+128건</p>
                  </div>
                  <div className="rounded-2xl bg-pink-50 p-3">
                    <p className="text-xs font-semibold text-pink-500">회전율</p>
                    <p className="text-xl font-black text-pink-600">+42%</p>
                  </div>
                </div>
              </div>

              {HERO_BADGES.map((b) => (
                <div
                  key={b.text}
                  className={`badge-float absolute ${b.pos} hidden rounded-full border border-violet-100 bg-white px-4 py-2 text-xs font-bold whitespace-nowrap text-slate-700 shadow-lg shadow-violet-200/60 sm:block`}
                  style={{ animationDelay: b.delay }}
                >
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOGO STRIP */}
        <section className="border-y border-violet-100 bg-violet-50/40 py-10">
          <p className="mb-6 text-center text-sm font-semibold text-slate-500">
            이미 다양한 셀러가 repick과 함께 성장하고 있습니다
          </p>
          <div
            className="overflow-hidden"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="marquee-track flex w-max items-center gap-16">
              {[...LOGOS, ...LOGOS].map((logo, i) => (
                <span
                  key={`${logo}-${i}`}
                  className="bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text text-xl font-black tracking-widest text-transparent uppercase"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* STATS / ROI */}
        <section id="stats" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              숫자로{" "}
              <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                증명합니다
              </span>
            </h2>
            <p className="mt-4 text-slate-600">
              repick을 도입한 셀러들이 실제로 확인한 평균 개선 지표입니다.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-3xl border border-violet-100 bg-white/80 p-7 text-center shadow-lg shadow-violet-100/60 backdrop-blur transition-transform duration-300 hover:-translate-y-1"
              >
                <p className="text-3xl">{s.icon}</p>
                <p className="mt-3 bg-gradient-to-br from-violet-600 to-pink-500 bg-clip-text text-4xl font-black text-transparent">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TOOLS */}
        <section id="tools" className="relative overflow-hidden py-24">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/60 via-white to-pink-50/40" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                판매를 가속하는{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  셀러 도구
                </span>
              </h2>
              <p className="mt-4 text-slate-600">
                재고 관리부터 가격 최적화까지, 판매에 필요한 모든 것을 하나의 대시보드에서.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {TOOLS.map((t) => (
                <div
                  key={t.title}
                  className="rounded-[2rem] border border-white bg-gradient-to-br from-white to-violet-50/60 p-8 shadow-xl shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-200/60"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${t.gradient} text-2xl shadow-lg shadow-violet-300/40`}
                  >
                    {t.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{t.title}</h3>
                  <p className="mt-2 leading-relaxed text-slate-600">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section id="story" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-blue-600 to-pink-500 p-10 text-white shadow-2xl shadow-violet-400/40 md:p-16">
            <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <p className="relative text-2xl leading-snug font-bold md:text-3xl">
              &ldquo;repick 도입 후 3개월 만에 장기 재고가 절반으로 줄었습니다. 사람이 하던 매칭을
              AI가 대신하니, 팀은 더 중요한 일에 집중할 수 있게 됐어요.&rdquo;
            </p>
            <div className="relative mt-8 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-black">
                하
              </span>
              <div>
                <p className="text-sm font-bold">김하늘 대표</p>
                <p className="text-xs font-semibold text-white/80">세컨드무브</p>
              </div>
            </div>
          </div>
        </section>

        {/* DEMO REQUEST */}
        <section id="demo" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                지금 바로{" "}
                <span className="bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 bg-clip-text text-transparent">
                  데모를 요청
                </span>
                하세요
              </h2>
              <p className="mt-4 max-w-md text-slate-600">
                영업일 기준 1일 이내에 담당 매니저가 연락드립니다. 팀 규모와 상관없이 무료로
                체험해보실 수 있어요.
              </p>
              <ul className="mt-8 flex flex-col gap-3 text-sm font-semibold text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="text-violet-500">✓</span> 카드 등록 없이 무료 체험
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-500">✓</span> 기존 시스템과 원클릭 연동
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-violet-500">✓</span> 전담 매니저 1:1 온보딩
                </li>
              </ul>
            </div>

            <form className="rounded-[2rem] border border-violet-100 bg-white p-8 shadow-2xl shadow-violet-200/50">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-sm font-semibold text-slate-700">
                    회사명
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="예: 세컨드무브"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    담당자 이메일
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="team-size" className="text-sm font-semibold text-slate-700">
                    팀 규모
                  </label>
                  <select
                    id="team-size"
                    name="team-size"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:outline-none"
                    defaultValue="1-10"
                  >
                    <option value="1-10">1~10명</option>
                    <option value="11-50">11~50명</option>
                    <option value="51-200">51~200명</option>
                    <option value="200+">200명 이상</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="현재 재고 규모나 궁금하신 점을 알려주세요"
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus-visible:ring-4 focus-visible:ring-violet-200 focus-visible:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-gradient-to-r from-violet-600 via-blue-600 to-pink-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-violet-400/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-400/50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200"
                >
                  데모 요청 보내기
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-violet-100 bg-violet-50/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 via-blue-600 to-pink-500 text-xs font-black text-white">
              r
            </span>
            <span className="text-sm font-black text-slate-700">repick Business</span>
          </div>
          <nav className="flex gap-6 text-sm font-semibold text-slate-500">
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#">
              개인정보처리방침
            </a>
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#">
              이용약관
            </a>
            <a className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 hover:text-violet-700" href="#demo">
              문의하기
            </a>
          </nav>
        </div>
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          © 2026 repick. 잠든 재고를 깨우는 가장 똑똑한 방법.
        </p>
      </footer>
    </div>
  );
}
