type IconProps = { className?: string };

function IconHome({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v9a1 1 0 0 0 1 1H9v-6h6v6h2.5a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

function IconSparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3z" />
    </svg>
  );
}

function IconHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20s-7-4.35-9.5-8.8C.8 7.9 2.4 4.8 5.7 4.8c1.8 0 3.3 1 4.3 2.6 1-1.6 2.5-2.6 4.3-2.6 3.3 0 4.9 3.1 3.2 6.4C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function IconGear({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M4 7h10M17 7h3M4 17h3M9 17h11" />
      <circle cx="14" cy="7" r="2" />
      <circle cx="7" cy="17" r="2" />
    </svg>
  );
}

function IconBell({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

function IconTag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 4h7l9 9-7 7-9-9V4Z" />
      <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconShield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5 19 6v5.5c0 4.6-3 7.4-7 9-4-1.6-7-4.4-7-9V6l7-2.5Z" />
      <path d="M9 12.2l2 2 4-4.2" />
    </svg>
  );
}

type NavItem = {
  key: string;
  label: string;
  Icon: (props: IconProps) => React.JSX.Element;
  active?: boolean;
};

const navItems: NavItem[] = [
  { key: "home", label: "홈", Icon: IconHome, active: true },
  { key: "reco", label: "추천", Icon: IconSparkle },
  { key: "wish", label: "찜", Icon: IconHeart },
  { key: "settings", label: "설정", Icon: IconGear },
];

type Reco = {
  emoji: string;
  name: string;
  condition: string;
  match: number;
  price: string;
  verified: boolean;
};

const recos: Reco[] = [
  { emoji: "\u{1F45F}", name: "나이키 에어포스 1 07", condition: "상태 최상", match: 96, price: "68,000원", verified: true },
  { emoji: "\u{1F45C}", name: "샤넬 클래식 미니백", condition: "상태 상", match: 91, price: "1,290,000원", verified: true },
  { emoji: "\u{1F4F7}", name: "캐논 EOS R6 바디", condition: "상태 상", match: 88, price: "1,050,000원", verified: false },
  { emoji: "\u{1F4F1}", name: "아이폰 14 프로 128GB", condition: "상태 최상", match: 85, price: "780,000원", verified: true },
];

type Activity = { emoji: string; text: string; time: string };

const activities: Activity[] = [
  { emoji: "\u{1F4C9}", text: "가격 하락 알림 · 나이키 에어포스 1, 5% 인하", time: "2분 전" },
  { emoji: "✨", text: "취향에 맞는 새 매칭 3건을 찾았어요", time: "1시간 전" },
  { emoji: "⏰", text: "품절 임박 · 샤넬 클래식 미니백", time: "3시간 전" },
  { emoji: "\u{1F4DD}", text: "후기 등록 완료 · 캐논 EOS R6", time: "어제" },
];

function gaugeBackground(pct: number, color: string) {
  return `radial-gradient(closest-side, #e5e9f0 64%, transparent 65% 100%), conic-gradient(${color} ${pct}%, #ccd3e0 0deg)`;
}

const css = `
.rpkb-page { background:#e5e9f0; }
.rpkb-raised {
  border-radius:26px;
  background:#e5e9f0;
  box-shadow: 9px 9px 18px rgba(160,172,196,0.55), -9px -9px 18px rgba(255,255,255,0.9);
}
.rpkb-raised-sm {
  border-radius:18px;
  background:#e5e9f0;
  box-shadow: 6px 6px 12px rgba(160,172,196,0.5), -6px -6px 12px rgba(255,255,255,0.85);
}
.rpkb-inset {
  border-radius:20px;
  background:#e5e9f0;
  box-shadow: inset 5px 5px 10px rgba(160,172,196,0.55), inset -5px -5px 10px rgba(255,255,255,0.9);
}
.rpkb-inset-sm {
  border-radius:12px;
  background:#e5e9f0;
  box-shadow: inset 3px 3px 6px rgba(160,172,196,0.5), inset -3px -3px 6px rgba(255,255,255,0.85);
}
.rpkb-circle-inset {
  border-radius:9999px;
  background:#e5e9f0;
  box-shadow: inset 4px 4px 8px rgba(160,172,196,0.55), inset -4px -4px 8px rgba(255,255,255,0.9);
}
.rpkb-circle-raised {
  border-radius:9999px;
  background:#e5e9f0;
  box-shadow: 4px 4px 8px rgba(160,172,196,0.5), -4px -4px 8px rgba(255,255,255,0.85);
}
.rpkb-nav-link { transition: box-shadow .15s ease, color .15s ease; box-shadow:none; }
.rpkb-nav-link:hover { box-shadow: 4px 4px 9px rgba(160,172,196,0.4), -4px -4px 9px rgba(255,255,255,0.75); }
.rpkb-nav-link[aria-current="page"] {
  box-shadow: inset 4px 4px 9px rgba(160,172,196,0.55), inset -4px -4px 9px rgba(255,255,255,0.9);
  color:#4b3fe0;
}
.rpkb-nav-icon[aria-current="page"] {
  box-shadow: inset 3px 3px 7px rgba(160,172,196,0.55), inset -3px -3px 7px rgba(255,255,255,0.9);
  color:#4b3fe0;
}
.rpkb-heart-btn { transition: box-shadow .15s ease, color .15s ease; }
.rpkb-heart-btn:hover { box-shadow: 5px 5px 10px rgba(160,172,196,0.5), -5px -5px 10px rgba(255,255,255,0.85); }
.rpkb-heart-btn[data-active="true"] {
  box-shadow: inset 3px 3px 7px rgba(160,172,196,0.55), inset -3px -3px 7px rgba(255,255,255,0.9);
  color:#e0507a;
}
.rpkb-page a:focus-visible,
.rpkb-page button:focus-visible {
  outline: 2px solid #4b3fe0;
  outline-offset: 3px;
}
`;

export default function Landing() {
  return (
    <div className="rpkb-page min-h-screen w-full font-sans text-[#2f3b52] antialiased">
      <style>{css}</style>

      <div className="mx-auto flex w-full max-w-[1280px] flex-col p-4 md:p-8">
        {/* mobile top nav */}
        <nav aria-label="주 메뉴" className="rpkb-raised mb-6 flex items-center justify-between gap-2 p-2 md:hidden">
          <span className="rpkb-circle-raised flex h-9 w-9 shrink-0 items-center justify-center text-sm font-black text-[#4b3fe0]" aria-hidden="true">
            R
          </span>
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href="#"
                  aria-current={item.active ? "page" : undefined}
                  aria-label={item.label}
                  className="rpkb-nav-icon rpkb-circle-raised flex h-10 w-10 items-center justify-center text-[#5b6577]"
                >
                  <item.Icon className="h-5 w-5" />
                </a>
              </li>
            ))}
          </ul>
          <button type="button" aria-label="알림" className="rpkb-circle-raised relative flex h-9 w-9 shrink-0 items-center justify-center text-[#5b6577]">
            <IconBell className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#e0507a]" aria-hidden="true" />
          </button>
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* desktop sidebar */}
          <aside className="rpkb-raised hidden shrink-0 flex-col gap-6 p-5 md:sticky md:top-8 md:flex md:w-60 md:self-start">
            <div className="rpkb-inset-sm flex items-center gap-3 px-3 py-3">
              <span className="rpkb-circle-raised flex h-9 w-9 items-center justify-center text-sm font-black text-[#4b3fe0]" aria-hidden="true">
                R
              </span>
              <span className="text-base font-bold tracking-tight">repick</span>
            </div>

            <nav aria-label="주 메뉴" className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href="#"
                  aria-current={item.active ? "page" : undefined}
                  className="rpkb-nav-link flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#5b6577]"
                >
                  <item.Icon className="h-5 w-5" />
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="rpkb-inset-sm mt-auto flex items-center gap-3 px-3 py-3">
              <span className="rpkb-circle-inset flex h-9 w-9 items-center justify-center text-base" aria-hidden="true">
                {"\u{1F642}"}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold">지은님</span>
                <span className="text-xs text-[#6b7688]">Pro 플랜</span>
              </div>
            </div>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col gap-6">
            {/* header */}
            <header className="rpkb-raised flex items-center justify-between gap-4 p-5 md:p-6">
              <div>
                <h1 className="text-xl font-bold text-[#232c3d] md:text-2xl">안녕하세요, 지은님 {"\u{1F44B}"}</h1>
                <p className="mt-1 text-sm text-[#6b7688]">오늘도 딱 맞는 매물을 찾아드릴게요 · 7월 7일 화요일</p>
              </div>
              <button type="button" aria-label="알림 확인" className="rpkb-circle-raised relative hidden h-11 w-11 shrink-0 items-center justify-center text-[#5b6577] md:flex">
                <IconBell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#e0507a]" aria-hidden="true" />
              </button>
            </header>

            {/* stat cards */}
            <section aria-label="오늘의 요약" className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rpkb-raised flex flex-col gap-4 p-5">
                <span className="rpkb-circle-inset flex h-11 w-11 items-center justify-center text-[#4b3fe0]" aria-hidden="true">
                  <IconSparkle className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#232c3d] md:text-3xl">12건</p>
                  <p className="mt-1 text-xs text-[#6b7688]">오늘의 추천 · 어제보다 +3</p>
                </div>
              </div>

              <div className="rpkb-raised flex flex-col gap-4 p-5">
                <span className="rpkb-circle-inset flex h-11 w-11 items-center justify-center text-[#e0507a]" aria-hidden="true">
                  <IconHeart className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#232c3d] md:text-3xl">8개</p>
                  <p className="mt-1 text-xs text-[#6b7688]">찜한 상품 · 관심 매물</p>
                </div>
              </div>

              <div className="rpkb-raised flex flex-col gap-4 p-5">
                <span className="rpkb-circle-inset flex h-11 w-11 items-center justify-center text-[#1f7a52]" aria-hidden="true">
                  <IconTag className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#232c3d] md:text-3xl">₩342,000</p>
                  <p className="mt-1 text-xs text-[#6b7688]">이번 달 절약액 · +12%</p>
                </div>
              </div>

              <div className="rpkb-raised flex flex-col gap-4 p-5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[#4b3fe0]"
                  style={{ backgroundImage: gaugeBackground(94, "#6c63ff") }}
                  aria-hidden="true"
                >
                  94%
                </span>
                <div>
                  <p className="text-2xl font-bold text-[#232c3d] md:text-3xl">94%</p>
                  <p className="mt-1 text-xs text-[#6b7688]">AI 매칭률 · 취향 학습 정확도</p>
                </div>
              </div>
            </section>

            {/* recommendations + activity */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <section aria-labelledby="rpkb-reco-heading" className="rpkb-raised flex flex-col gap-5 p-5 md:col-span-2 md:p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 id="rpkb-reco-heading" className="text-lg font-bold text-[#232c3d]">
                    오늘의 AI 추천
                  </h2>
                  <span className="rpkb-inset-sm px-3 py-1 text-xs font-semibold text-[#4b3fe0]">취향 학습 기반</span>
                </div>

                <ul className="flex flex-col gap-4">
                  {recos.map((item) => (
                    <li key={item.name} className="rpkb-raised-sm flex items-center gap-4 p-4">
                      <span className="rpkb-circle-inset flex h-14 w-14 shrink-0 items-center justify-center text-2xl" aria-hidden="true">
                        {item.emoji}
                      </span>

                      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate font-semibold text-[#232c3d]">{item.name}</span>
                          <span className="rpkb-inset-sm px-2 py-0.5 text-[11px] font-semibold text-[#6b7688]">{item.condition}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rpkb-inset-sm px-2 py-0.5 text-[11px] font-bold text-[#4b3fe0]">매칭 {item.match}%</span>
                          {item.verified && (
                            <span className="rpkb-inset-sm flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[#1f7a52]">
                              <IconShield className="h-3 w-3" />
                              검증완료
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="text-base font-bold text-[#232c3d] md:text-lg">{item.price}</span>
                        <button
                          type="button"
                          aria-label={`${item.name} 찜하기`}
                          aria-pressed={item.verified}
                          data-active={item.verified ? "true" : "false"}
                          className="rpkb-heart-btn rpkb-circle-raised flex h-9 w-9 items-center justify-center text-[#5b6577]"
                        >
                          <IconHeart className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <aside aria-labelledby="rpkb-activity-heading" className="rpkb-raised flex flex-col gap-4 p-5 md:p-6">
                <h2 id="rpkb-activity-heading" className="text-lg font-bold text-[#232c3d]">
                  최근 활동
                </h2>
                <ul className="flex flex-col gap-3">
                  {activities.map((a) => (
                    <li key={a.text} className="rpkb-inset-sm flex items-start gap-3 p-3">
                      <span className="rpkb-circle-inset flex h-8 w-8 shrink-0 items-center justify-center text-sm" aria-hidden="true">
                        {a.emoji}
                      </span>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <p className="text-sm leading-snug text-[#2f3b52]">{a.text}</p>
                        <span className="text-xs text-[#6b7688]">{a.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
