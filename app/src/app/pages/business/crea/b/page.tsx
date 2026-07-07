const GRAIN_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

const BG = "oklch(13% 0.014 250)";
const BG_ALT = "oklch(16% 0.016 250)";
const BG_INSET = "oklch(10% 0.012 250)";
const FG = "oklch(96% 0.01 90)";
const MUTED = "oklch(70% 0.02 90)";
const DIM = "oklch(80% 0.015 90)";
const ACCENT = "oklch(76% 0.16 155)"; // repick 순환/그린
const ACCENT2 = "oklch(80% 0.13 75)"; // 필름/타임코드 앰버

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(76%_0.16_155)] focus-visible:rounded-sm";

type Stat = { label: string; value: string };
type Chapter = {
  id: string;
  time: string;
  eyebrow: string;
  title: string;
  body: string[];
  stats?: Stat[];
  quote?: { text: string; name: string };
  tone?: "alt";
};

const chapters: Chapter[] = [
  {
    id: "ch1",
    time: "02:14",
    eyebrow: "CHAPTER 1 · 문제",
    title: "옷장이 아니라 창고가 되어버린 매장",
    body: [
      "2019년, 정미경 대표는 서울 망원동 12평짜리 편집숍 ‘미경상회’를 열었다. 안목으로 고른 옷들이 입소문을 타며 첫 3년은 순항했다.",
      "문제는 2023년 겨울부터였다. 사입 물량이 늘수록 안 팔리는 재고가 매대 뒤편에 쌓였다. 창고를 하나 더 얻었지만, 그마저도 두 달 만에 가득 찼다.",
      "“옷장이 아니라 창고를 운영하는 기분이었어요.” 정 대표는 그 시절을 그렇게 기억한다.",
    ],
    stats: [
      { label: "평균 재고 보유일", value: "45일" },
      { label: "반품률", value: "40%" },
      { label: "월 재고 회전", value: "0.9회" },
    ],
  },
  {
    id: "ch2",
    time: "05:47",
    eyebrow: "CHAPTER 2 · 전환점",
    title: "“밑져야 본전이라고 생각했어요”",
    body: [
      "2024년 3월, 같은 상가 건물의 동료 셀러가 repick Business를 먼저 도입했다는 이야기를 들었다. 반신반의했지만 데모를 요청했다.",
      "담당 매니저는 미경상회의 최근 6개월 재고 데이터를 함께 들여다봤다. 안 팔리는 이유가 ‘상품’이 아니라 ‘보여주는 방식’에 있다는 진단이 나왔다.",
    ],
    quote: {
      text: "밑져야 본전이라고 생각했어요. 근데 첫 주부터 숫자가 달라지더라고요.",
      name: "정미경 · 미경상회 대표",
    },
    tone: "alt",
  },
  {
    id: "ch3",
    time: "08:03",
    eyebrow: "CHAPTER 3 · 도입 3주차",
    title: "AI가 재고와 손님을 먼저 연결하기 시작했다",
    body: [
      "repick 앱을 쓰는 수십만 명의 찜·클릭·구매 데이터를 학습한 AI 매칭 엔진이, 미경상회의 재고 하나하나를 ‘살 확률이 가장 높은 사용자’에게 먼저 보여주기 시작했다.",
      "따로 사진을 다시 찍거나 설명을 바꾸지 않았다. 같은 옷, 같은 가격인데 노출되는 사람이 달라졌을 뿐이었다.",
    ],
    stats: [
      { label: "AI 매칭 판매 비중", value: "0% → 41%" },
      { label: "신규 방문자 구매 전환", value: "×2.6" },
      { label: "문의→판매 소요", value: "−58%" },
    ],
  },
  {
    id: "ch4",
    time: "10:51",
    eyebrow: "CHAPTER 4 · 도입 2개월차",
    title: "3주 넘게 안 팔린 재고가 스스로 움직이기 시작했다",
    body: [
      "입고 후 3주가 지나도 안 팔린 재고는 AI가 자동으로 가격을 재산정하고, 팝업 스토어와 제휴 매장 채널로 노출을 넓혔다. 정 대표가 직접 손댈 일이 사라졌다.",
      "창고에 쌓아두던 재고가 매주 조금씩 빠져나갔다. 두 번째 창고 계약을 갱신하지 않기로 했다.",
    ],
    stats: [
      { label: "평균 재고 보유일", value: "45일 → 18일" },
      { label: "창고 비용", value: "−32%" },
      { label: "반품률", value: "40% → 17%" },
    ],
    tone: "alt",
  },
  {
    id: "ch5",
    time: "14:20",
    eyebrow: "CHAPTER 5 · 도입 6개월차",
    title: "숫자가 한 화면 안으로 들어왔다",
    body: [
      "매장 직원 세 명이 같은 셀러 대시보드에 로그인해 실시간으로 재고와 매출을 확인했다. 자체 운영하던 인스타그램 스토어도 API로 재고를 동기화했다.",
      "이제 정 대표는 아침마다 재고를 세는 대신, 대시보드에서 어제 무엇이 팔렸는지부터 확인한다.",
    ],
    stats: [
      { label: "월매출", value: "+320%" },
      { label: "재고 회전율", value: "×3.1" },
      { label: "팀 업무시간", value: "−6시간/주" },
    ],
  },
];

const toc: { href: string; time: string; label: string }[] = [
  { href: "#ch1", time: "02:14", label: "문제 — 옷장이 아니라 창고가 된 매장" },
  { href: "#ch2", time: "05:47", label: "전환점 — 밑져야 본전이라는 마음" },
  { href: "#ch3", time: "08:03", label: "3주차 — AI가 손님을 먼저 찾아준다" },
  { href: "#ch4", time: "10:51", label: "2개월차 — 재고가 스스로 순환한다" },
  { href: "#ch5", time: "14:20", label: "6개월차 — 숫자가 한 화면에 모인다" },
  { href: "#now", time: "17:05", label: "지금 — 정미경 대표의 말" },
  { href: "#series", time: "19:40", label: "시리즈 — 다른 셀러들의 기록" },
  { href: "#cta", time: "22:00", label: "당신의 에피소드" },
];

const sellers: { name: string; kind: string; stat: string }[] = [
  { name: "브누아 컬렉티브", kind: "편집숍 · 홍대", stat: "AI 매칭 판매 58%" },
  { name: "서울런드리 빈티지", kind: "빈티지 리테일 · 성수", stat: "재고 회전 ×2.4" },
  { name: "옛날가게", kind: "중고 가전 · 온라인", stat: "반품률 −35%p" },
  { name: "챕터투 셀렉트", kind: "편집숍 · 을지로", stat: "월매출 +210%" },
  { name: "무브먼트 서울", kind: "스니커 리셀 · 온라인", stat: "창고 비용 −40%" },
];

const summary: Stat[] = [
  { label: "재고 회전율 (월 기준)", value: "0.9회 → 3.1회" },
  { label: "반품률", value: "40% → 17%" },
  { label: "평균 재고 보유일", value: "45일 → 18일" },
  { label: "월매출 (도입 전 대비)", value: "+320%" },
];

function StatGrid({ stats, cols = 3 }: { stats: Stat[]; cols?: 2 | 3 | 4 }) {
  const colClass =
    cols === 4
      ? "sm:grid-cols-4"
      : cols === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-3";
  return (
    <dl
      className={`mt-8 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/5 ${colClass}`}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ backgroundColor: BG_INSET }} className="p-4 sm:p-5">
          <dt className="font-mono text-[10px] tracking-[0.15em]" style={{ color: MUTED }}>
            {s.label}
          </dt>
          <dd className="mt-2 font-mono text-lg font-bold sm:text-xl" style={{ color: ACCENT }}>
            {s.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ChapterSection({ id, time, eyebrow, title, body, stats, quote, tone }: Chapter) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="doc-reveal relative scroll-mt-20 border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10"
      style={{ backgroundColor: tone === "alt" ? BG_ALT : BG }}
    >
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[200px_1fr] lg:gap-14">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="font-mono text-xs tracking-[0.25em]" style={{ color: ACCENT2 }}>
            {time}
          </p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.2em]" style={{ color: MUTED }}>
            {eyebrow}
          </p>
        </div>
        <div>
          <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight sm:text-3xl" style={{ color: FG }}>
            {title}
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed sm:text-base" style={{ color: DIM }}>
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {quote && (
            <blockquote
              className="mt-8 border-l-2 pl-5"
              style={{ borderColor: ACCENT2 }}
            >
              <p className="text-lg leading-relaxed sm:text-xl" style={{ color: FG }}>
                “{quote.text}”
              </p>
              <cite className="mt-3 block font-mono text-xs not-italic tracking-widest" style={{ color: MUTED }}>
                — {quote.name}
              </cite>
            </blockquote>
          )}
          {stats && <StatGrid stats={stats} />}
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block font-mono text-xs tracking-widest" style={{ color: MUTED }}>
        {label}
        {required && (
          <span style={{ color: ACCENT }}> *</span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[oklch(76%_0.16_155)] ${focusRing}`}
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="relative min-h-screen font-sans" style={{ backgroundColor: BG, color: FG }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes doc-rise-in {
          from { opacity: .45; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .doc-reveal {
          animation: doc-rise-in .7s cubic-bezier(.2,.7,.2,1) both;
          animation-timeline: view();
          animation-range: entry 0% cover 25%;
        }
        @keyframes doc-scrub { from { width: 0%; } to { width: 100%; } }
        .doc-scrub-fill {
          animation: doc-scrub 1.4s linear both;
          animation-timeline: scroll(root);
        }
        @keyframes doc-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: .15; } }
        .doc-blink { animation: doc-blink 1.4s step-start infinite; }
        @keyframes doc-grain-shift {
          0% { transform: translate(0,0); }
          100% { transform: translate(-37px,-29px); }
        }
        .doc-grain { animation: doc-grain-shift 9s steps(6) infinite; }
      `}</style>

      {/* 필름 그레인 + 비네트 (장식, 오프라인 인라인 SVG) */}
      <div
        aria-hidden="true"
        className="doc-grain pointer-events-none fixed inset-0 z-0"
        style={{ backgroundImage: `url("${GRAIN_SVG}")`, opacity: 0.045, mixBlendMode: "overlay" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 45%, oklch(0% 0 0 / 0.5) 100%)",
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest"
        style={{ borderColor: ACCENT, backgroundColor: BG, color: ACCENT }}
      >
        본문 바로가기
      </a>

      {/* 헤더 */}
      <header
        className="sticky top-0 z-40 border-b border-white/10 backdrop-blur"
        style={{ backgroundColor: `color-mix(in oklch, ${BG} 88%, transparent)` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span
              className="flex h-7 w-7 items-center justify-center border font-mono text-[11px] font-bold"
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              R
            </span>
            <span className="hidden font-mono text-xs tracking-[0.2em] sm:inline" style={{ color: MUTED }}>
              REPICK <span style={{ color: FG }}>／ BUSINESS</span>
            </span>
            <span
              className="ml-1 rounded-sm border px-2 py-0.5 font-mono text-[10px] tracking-widest"
              style={{ borderColor: "oklch(100% 0 0 / 15%)", color: ACCENT2 }}
            >
              EP.01 · 미경상회
            </span>
          </div>
          <nav aria-label="에피소드 목차" className="hidden items-center gap-5 font-mono text-[11px] tracking-widest md:flex" style={{ color: MUTED }}>
            <a href="#ch1" className={`hover:text-white ${focusRing}`}>
              문제
            </a>
            <a href="#ch3" className={`hover:text-white ${focusRing}`}>
              매칭
            </a>
            <a href="#now" className={`hover:text-white ${focusRing}`}>
              결과
            </a>
            <a href="#series" className={`hover:text-white ${focusRing}`}>
              사례
            </a>
          </nav>
          <a
            href="#cta"
            className={`border px-3 py-1.5 font-mono text-xs font-bold tracking-widest hover:bg-[oklch(76%_0.16_155)] hover:text-[oklch(13%_0.014_250)] ${focusRing}`}
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            데모 요청 →
          </a>
        </div>
      </header>

      <main id="main" className="relative z-10">
        {/* 콜드 오픈 / 히어로 */}
        <section id="cold-open" className="relative border-b border-white/10 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.25em]" style={{ color: MUTED }}>
              <span className="doc-blink inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "oklch(63% 0.22 25)" }} />
              <span>REC</span>
              <span className="mx-1" style={{ color: "oklch(100% 0 0 / 20%)" }}>
                ·
              </span>
              <span>REPICK BUSINESS 다큐멘터리 시리즈</span>
              <span className="mx-1" style={{ color: "oklch(100% 0 0 / 20%)" }}>
                ·
              </span>
              <span style={{ color: ACCENT2 }}>EPISODE 01</span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-5xl">
              재고가 쌓이던 그 여름,
              <br />
              미경상회는 문을 닫기 직전이었다.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg" style={{ color: DIM }}>
              서울 망원동, 12평 남짓한 빈티지 편집숍. 정미경 대표는 6개월 동안 팔리지 않는
              옷 사이에서 매일 재고를 세고 있었다. 지금 그는 같은 매장에서 재고를 3배 더
              빠르게 순환시킨다. 이건 그 6개월의 기록이다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#ch1"
                className={`border px-5 py-3 font-mono text-sm font-bold tracking-widest hover:bg-transparent ${focusRing}`}
                style={{ borderColor: ACCENT, backgroundColor: ACCENT, color: BG }}
              >
                ▶ 기록 재생하기
              </a>
              <a
                href="#cta"
                className={`border px-5 py-3 font-mono text-sm font-bold tracking-widest hover:text-white ${focusRing}`}
                style={{ borderColor: "oklch(100% 0 0 / 20%)", color: DIM }}
              >
                데모 요청하기
              </a>
            </div>

            <p className="mt-5 max-w-xl text-xs leading-relaxed" style={{ color: "oklch(55% 0.015 90)" }}>
              이 다큐멘터리는 repick Business 파트너사의 실제 데이터를 재구성한 사례입니다.
            </p>

            {/* 챕터 목차 */}
            <nav aria-label="전체 에피소드 목차" className="mt-12 border-t border-white/10 pt-8">
              <p className="mb-4 font-mono text-[10px] tracking-[0.25em]" style={{ color: MUTED }}>
                전체 목차
              </p>
              <ol className="grid gap-px overflow-hidden border border-white/10 bg-white/5 sm:grid-cols-2">
                {toc.map((item) => (
                  <li key={item.href} style={{ backgroundColor: BG }}>
                    <a
                      href={item.href}
                      className={`flex items-baseline gap-3 px-4 py-3 text-sm hover:bg-white/5 ${focusRing}`}
                    >
                      <span className="shrink-0 font-mono text-xs" style={{ color: ACCENT2 }}>
                        {item.time}
                      </span>
                      <span style={{ color: DIM }}>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </section>

        {/* 챕터 1~5 */}
        {chapters.map((ch) => (
          <ChapterSection key={ch.id} {...ch} />
        ))}

        {/* 지금 — 결과 요약 */}
        <section id="now" aria-labelledby="now-title" className="doc-reveal relative scroll-mt-20 border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10" style={{ backgroundColor: BG_ALT }}>
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-xs tracking-[0.25em]" style={{ color: ACCENT2 }}>
                17:05 · CHAPTER 6 · 지금
              </p>
              <span
                aria-hidden="true"
                className="inline-block -rotate-6 border-2 px-3 py-1 font-mono text-[10px] font-bold tracking-widest"
                style={{ borderColor: ACCENT2, color: ACCENT2 }}
              >
                CASE FILE — CLOSED
              </span>
            </div>
            <h2 id="now-title" className="mt-3 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              “이제는 재고를 세지 않아요. 대시보드가 저 대신 세니까요.”
            </h2>
            <p className="mt-4 font-mono text-xs tracking-widest" style={{ color: MUTED }}>
              — 정미경 · 미경상회 대표
            </p>

            <p className="mt-8 max-w-2xl text-[15px] leading-relaxed sm:text-base" style={{ color: DIM }}>
              도입 6개월, 미경상회는 같은 매장 면적과 같은 인원으로 세 배 넘는 재고를 순환시킨다.
              창고 계약은 하나로 줄었고, 정 대표는 매일 아침 재고 대신 매출 그래프를 확인한다.
            </p>

            <p className="mt-10 font-mono text-[10px] tracking-[0.25em]" style={{ color: MUTED }}>
              기록 요약 · AS-IS → TO-BE
            </p>
            <StatGrid stats={summary} cols={4} />
          </div>
        </section>

        {/* 시리즈 — 다른 셀러들 */}
        <section id="series" aria-labelledby="series-title" className="doc-reveal relative scroll-mt-20 border-b border-white/10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-5xl">
            <p className="font-mono text-xs tracking-[0.25em]" style={{ color: ACCENT2 }}>
              19:40 · CHAPTER 7 · 시리즈
            </p>
            <h2 id="series-title" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              이 시리즈의 다른 기록들
            </h2>
            <p className="mt-3 max-w-xl text-sm" style={{ color: MUTED }}>
              미경상회만의 이야기가 아닙니다. repick Business와 함께 재고를 다시 순환시킨
              셀러들의 기록입니다.
            </p>

            <ul className="mt-10 grid gap-px overflow-hidden border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
              {sellers.map((s) => (
                <li key={s.name} style={{ backgroundColor: BG_INSET }} className="p-6">
                  <p className="text-lg font-black uppercase tracking-tight" style={{ color: FG }}>
                    {s.name}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: MUTED }}>
                    {s.kind}
                  </p>
                  <p className="mt-4 font-mono text-sm font-bold" style={{ color: ACCENT }}>
                    {s.stat}
                  </p>
                </li>
              ))}
              <li style={{ backgroundColor: BG_INSET }} className="flex flex-col justify-center p-6">
                <p className="font-mono text-xs tracking-widest" style={{ color: MUTED }}>
                  다음 에피소드
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: DIM }}>
                  당신의 매장 이야기가 다음 화가 될 수 있습니다.
                </p>
                <a href="#cta" className={`mt-3 inline-block font-mono text-xs font-bold tracking-widest hover:underline ${focusRing}`} style={{ color: ACCENT2 }}>
                  기록 시작하기 →
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA — 데모 요청 */}
        <section id="cta" aria-labelledby="cta-title" className="doc-reveal relative scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24 lg:px-8" style={{ backgroundColor: BG_ALT }}>
          <div className="mx-auto max-w-2xl">
            <div className="relative border border-white/15 p-6 sm:p-10" style={{ backgroundColor: BG }}>
              <p className="font-mono text-[10px] tracking-[0.25em]" style={{ color: ACCENT2 }}>
                22:00 · 마지막 챕터
              </p>
              <h2 id="cta-title" className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                당신의 에피소드를 시작하세요
              </h2>
              <p className="mt-3 text-sm" style={{ color: MUTED }}>
                담당자명, 매장 규모, 현재 겪고 있는 재고 문제를 남겨주시면 영업일 기준 1일
                이내 연락드립니다.
              </p>

              <form className="mt-8 grid gap-5" action="#" method="post">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="회사명 / 매장명" name="company" placeholder="미경상회" required />
                  <FormField label="담당자명" name="name" placeholder="정미경" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="이메일" name="email" type="email" placeholder="you@shop.com" required />
                  <FormField label="연락처" name="phone" type="tel" placeholder="010-0000-0000" />
                </div>
                <div>
                  <label htmlFor="scale" className="mb-2 block font-mono text-xs tracking-widest" style={{ color: MUTED }}>
                    월 평균 재고 규모
                  </label>
                  <select
                    id="scale"
                    name="scale"
                    defaultValue=""
                    className={`w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-[oklch(76%_0.16_155)] ${focusRing}`}
                    style={{ color: FG }}
                  >
                    <option value="" disabled className="bg-[oklch(13%_0.014_250)]">
                      선택해주세요
                    </option>
                    <option value="s" className="bg-[oklch(13%_0.014_250)]">
                      100개 미만
                    </option>
                    <option value="m" className="bg-[oklch(13%_0.014_250)]">
                      100 ~ 500개
                    </option>
                    <option value="l" className="bg-[oklch(13%_0.014_250)]">
                      500개 이상
                    </option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-xs tracking-widest" style={{ color: MUTED }}>
                    지금 겪고 있는 재고 문제
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="예: 안 팔리는 재고가 계속 쌓여서 창고 비용이 부담돼요."
                    className={`w-full resize-none border border-white/15 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[oklch(76%_0.16_155)] ${focusRing}`}
                  />
                </div>
                <button
                  type="submit"
                  className={`mt-2 border px-6 py-3 font-mono text-sm font-bold tracking-widest hover:bg-transparent ${focusRing}`}
                  style={{ borderColor: ACCENT, backgroundColor: ACCENT, color: BG }}
                >
                  기록 제출하기 →
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 font-mono text-[10px] tracking-[0.2em] sm:flex-row sm:items-center sm:justify-between" style={{ color: MUTED }}>
          <span>REPICK BUSINESS © 2026 · CASE FILE SERIES</span>
          <span>본 다큐멘터리는 파트너사 데이터를 재구성한 사례입니다</span>
        </div>
      </footer>

      {/* 하단 스크러버 (재생 진행률 연출) */}
      <div aria-hidden="true" className="fixed inset-x-0 bottom-0 z-50 h-[3px] bg-white/10">
        <div className="doc-scrub-fill h-full" style={{ backgroundColor: ACCENT }} />
      </div>
    </div>
  );
}
