import type { SVGProps } from "react";

type IconComponent = (props: SVGProps<SVGSVGElement>) => React.JSX.Element;

function IconHome({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function IconSpark({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M6.5 6.5 9 9M15 15l2.5 2.5M17.5 6.5 15 9M9 15l-2.5 2.5" />
    </svg>
  );
}

function IconHeart({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 20s-7-4.35-9.5-8.5C.8 8 2.5 4.5 6 4.5c2 0 3.5 1.2 4 2.5.5-1.3 2-2.5 4-2.5 3.5 0 5.2 3.5 3.5 7C19 15.65 12 20 12 20z" />
    </svg>
  );
}

function IconGear({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </svg>
  );
}

function IconBell({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconSearch({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function IconCamera({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7l1.4-2.5h5.2L16 7" />
      <circle cx="12" cy="13.5" r="3.3" />
    </svg>
  );
}

function IconHeadphones({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.2" y="14" width="4.8" height="6.5" rx="1.8" />
      <rect x="17" y="14" width="4.8" height="6.5" rx="1.8" />
    </svg>
  );
}

function IconDesk({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 6.5h18" />
      <path d="M5 6.5V19M19 6.5V19M9 6.5v5M15 6.5v5" />
    </svg>
  );
}

function IconBag({ className }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="8" width="14" height="12" rx="2" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      <path d="M9 12v2M15 12v2" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-400 to-violet-600 font-mono text-[11px] font-bold text-white">
      r
    </span>
  );
}

type NavItem = {
  label: string;
  icon: IconComponent;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "홈", icon: IconHome, active: true },
  { label: "추천", icon: IconSpark },
  { label: "찜", icon: IconHeart },
  { label: "설정", icon: IconGear },
];

type Stat = {
  label: string;
  value?: string;
  unit?: string;
  delta: string;
  tone: "indigo" | "emerald";
  bars?: number[];
  ring?: number;
};

const stats: Stat[] = [
  {
    label: "오늘의 추천",
    value: "12",
    unit: "건",
    delta: "▲ 4",
    tone: "indigo",
    bars: [35, 50, 42, 68, 55, 88, 74],
  },
  {
    label: "찜한 상품",
    value: "34",
    unit: "개",
    delta: "▲ 2",
    tone: "indigo",
    bars: [58, 52, 64, 48, 70, 66, 80],
  },
  {
    label: "누적 절약액",
    value: "284,000",
    unit: "원",
    delta: "▲ 38,000",
    tone: "emerald",
    bars: [22, 34, 30, 54, 46, 64, 72],
  },
  {
    label: "AI 매칭률",
    delta: "▲ 3%p",
    tone: "indigo",
    ring: 92,
  },
];

type Reco = {
  name: string;
  match: number;
  price: string;
  condition: string;
  time: string;
  location: string;
  icon: IconComponent;
  tint: string;
};

const recommendations: Reco[] = [
  {
    name: "캐논 AE-1 필름카메라",
    match: 98,
    price: "185,000",
    condition: "최상",
    time: "3일 전",
    location: "마포구",
    icon: IconCamera,
    tint: "from-indigo-500/25 to-zinc-900 text-indigo-300",
  },
  {
    name: "소니 WH-1000XM4 헤드폰",
    match: 95,
    price: "142,000",
    condition: "상",
    time: "5시간 전",
    location: "성동구",
    icon: IconHeadphones,
    tint: "from-violet-500/25 to-zinc-900 text-violet-300",
  },
  {
    name: "원목 좌식 책상",
    match: 91,
    price: "68,000",
    condition: "상",
    time: "1일 전",
    location: "은평구",
    icon: IconDesk,
    tint: "from-teal-500/25 to-zinc-900 text-teal-300",
  },
  {
    name: "빈티지 캔버스 백팩",
    match: 88,
    price: "45,000",
    condition: "중상",
    time: "2일 전",
    location: "강남구",
    icon: IconBag,
    tint: "from-amber-500/25 to-zinc-900 text-amber-300",
  },
];

type Feed = { text: string; time: string; tone: "indigo" | "emerald" | "amber" };

const notifications: Feed[] = [
  { text: "AI가 새 매칭 3건을 찾았어요", time: "3분 전", tone: "indigo" },
  { text: "찜한 상품 가격이 ₩15,000 내렸어요", time: "42분 전", tone: "emerald" },
  { text: "판매자가 메시지를 보냈어요", time: "2시간 전", tone: "amber" },
];

const activities: Feed[] = [
  { text: "캐논 AE-1을 찜 목록에 추가했어요", time: "오늘 09:12", tone: "indigo" },
  { text: "헤드폰 매물 3건을 확인했어요", time: "어제 21:04", tone: "indigo" },
  { text: "책상 매물 가격을 비교했어요", time: "어제 14:30", tone: "indigo" },
];

const dotTone: Record<Feed["tone"], string> = {
  indigo: "bg-indigo-400",
  emerald: "bg-emerald-400",
  amber: "bg-amber-400",
};

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside aria-label="주 사이드바" className="hidden border-r border-white/5 px-4 py-6 lg:flex lg:flex-col lg:justify-between">
        <div>
          <div className="flex items-center gap-2 px-2">
            <LogoMark />
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100">repick</span>
          </div>
          <nav aria-label="주 메뉴" className="mt-8 flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  item.active
                    ? "bg-white/10 text-zinc-50"
                    : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                }`}
              >
                <item.icon
                  className={`h-4 w-4 ${item.active ? "text-indigo-300" : "text-zinc-500 group-hover:text-zinc-300"}`}
                />
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-medium text-zinc-300">Pro 플랜</p>
          <p className="mt-0.5 text-[11px] text-zinc-400">실시간 알림 · 무제한 매칭</p>
          <div aria-hidden="true" className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-2/3 rounded-full bg-indigo-400" />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/85 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-4">
            <div className="flex items-center gap-2 lg:hidden">
              <LogoMark />
              <span className="font-mono text-sm font-semibold tracking-tight">repick</span>
            </div>
            <p className="hidden text-xs font-medium text-zinc-400 lg:block">대시보드 / 홈</p>
            <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
              <button
                type="button"
                className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 sm:flex"
              >
                <IconSearch className="h-3.5 w-3.5" />
                <span>검색</span>
                <kbd className="ml-4 rounded border border-white/10 bg-white/5 px-1 font-mono text-[10px] text-zinc-400">
                  ⌘K
                </kbd>
              </button>
              <button
                type="button"
                aria-label="알림 (읽지 않은 알림 있음)"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-zinc-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <IconBell className="h-4 w-4" />
                <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-400" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 font-mono text-xs font-semibold text-white">
                민
              </div>
            </div>
          </div>
          <nav aria-label="주 메뉴 (모바일)" className="-mx-1 flex gap-1 overflow-x-auto pb-3 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                aria-current={item.active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  item.active
                    ? "border-indigo-400/40 bg-indigo-500/10 text-indigo-300"
                    : "border-white/10 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
            안녕하세요, 민준님
          </h1>
          <p className="mt-1 text-sm text-zinc-400">7월 7일 · 오늘도 취향에 맞는 물건을 찾아드릴게요</p>

          <section aria-label="요약 통계" className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    {stat.label}
                  </span>
                  <span
                    className={`shrink-0 font-mono text-[11px] ${
                      stat.tone === "emerald" ? "text-emerald-400" : "text-indigo-300"
                    }`}
                  >
                    {stat.delta}
                  </span>
                </div>

                {stat.ring !== undefined ? (
                  <div className="mt-3 flex items-center gap-3">
                    <div
                      role="img"
                      aria-label={`AI 매칭률 ${stat.ring}%, 지난주 대비 상승`}
                      className="relative h-12 w-12 shrink-0 rounded-full"
                      style={{
                        background: `conic-gradient(#818cf8 ${stat.ring * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                      }}
                    >
                      <div aria-hidden="true" className="absolute inset-[3px] rounded-full bg-zinc-950" />
                      <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold text-zinc-100">
                        {stat.ring}%
                      </div>
                    </div>
                    <p className="text-xs leading-snug text-zinc-400">
                      지난주 대비
                      <br />
                      매칭 정확도 상승
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-zinc-50 sm:text-3xl">
                      {stat.value}
                      {stat.unit && (
                        <span className="ml-1 font-sans text-xs font-normal text-zinc-400">{stat.unit}</span>
                      )}
                    </p>
                    <div
                      role="img"
                      aria-label={`최근 7일 ${stat.label} 추이, ${stat.delta}`}
                      className="mt-3 flex h-6 items-end gap-0.5"
                    >
                      {stat.bars?.map((h, i) => (
                        <div
                          key={i}
                          aria-hidden="true"
                          className={`w-full rounded-sm ${
                            stat.tone === "emerald" ? "bg-emerald-400/50" : "bg-indigo-400/50"
                          }`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </section>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="reco-heading" className="min-w-0">
              <div className="flex items-center justify-between">
                <h2 id="reco-heading" className="text-base font-semibold text-zinc-100">
                  오늘의 AI 추천
                </h2>
                <a
                  href="#"
                  className="rounded text-xs font-medium text-indigo-300 transition-colors hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  전체보기 →
                </a>
              </div>
              <p className="mt-1 text-xs text-zinc-400">취향 학습 기반으로 오늘 새로 찾은 상품이에요</p>

              <div className="mt-4 flex flex-col gap-3">
                {recommendations.map((item) => (
                  <article
                    key={item.name}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors hover:border-white/20 sm:gap-4 sm:p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.tint}`}
                    >
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="truncate text-sm font-medium text-zinc-100">{item.name}</h3>
                        <span className="shrink-0 rounded-full bg-indigo-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-indigo-300">
                          {item.match}% 매칭
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-zinc-400">
                        상태 {item.condition} · {item.time} · {item.location}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm font-semibold text-zinc-50 sm:text-base">
                        ₩{item.price}
                      </p>
                      <button
                        type="button"
                        aria-label={`${item.name} 찜하기`}
                        className="mt-1.5 inline-flex min-h-8 items-center gap-1 rounded-md px-2 py-1.5 text-xs text-zinc-400 transition-colors hover:text-rose-400 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                      >
                        <IconHeart className="h-3.5 w-3.5" />
                        찜
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside aria-label="최근 활동 및 알림" className="flex flex-col gap-6">
              <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">알림</h2>
                <ul className="mt-3 space-y-3">
                  {notifications.map((n) => (
                    <li key={n.text} className="flex gap-2.5">
                      <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotTone[n.tone]}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-300">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{n.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h2 className="text-sm font-semibold text-zinc-200">최근 활동</h2>
                <ul className="mt-3 space-y-3">
                  {activities.map((a) => (
                    <li key={a.text} className="flex gap-2.5">
                      <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotTone[a.tone]}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-300">{a.text}</p>
                        <p className="mt-0.5 text-[11px] text-zinc-400">{a.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
