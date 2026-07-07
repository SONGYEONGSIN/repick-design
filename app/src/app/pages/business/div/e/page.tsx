import type { CSSProperties } from 'react';

const scVars = {
  '--bg': 'oklch(97% 0.012 75)',
  '--bg-band': 'oklch(93.5% 0.018 130)',
  '--card': 'oklch(99% 0.006 75)',
  '--ink': 'oklch(26% 0.015 75)',
  '--ink-dim': 'oklch(50% 0.02 75)',
  '--ink-faint': 'oklch(64% 0.016 75)',
  '--line': 'oklch(87% 0.014 75)',
  '--sage': 'oklch(56% 0.05 150)',
  '--sage-soft': 'oklch(90% 0.025 150)',
  '--terracotta': 'oklch(64% 0.09 42)',
} as CSSProperties;

const steps = [
  {
    n: '01',
    title: '재고 등록',
    desc: '있는 그대로의 재고 정보를 등록합니다. 사진 몇 장이면 충분합니다.',
  },
  {
    n: '02',
    title: 'AI 분석',
    desc: '시세와 수요를 살펴 적정 가격을 조용히 제안합니다.',
  },
  {
    n: '03',
    title: '매칭',
    desc: '팔릴 확률이 가장 높은 자리에 자연스럽게 연결합니다.',
  },
  {
    n: '04',
    title: '정산',
    desc: '거래가 끝나면, 별도 요청 없이 바로 정산됩니다.',
  },
];

const stats = [
  { n: '01', value: '−42%', label: '평균 재고 보유 기간' },
  { n: '02', value: '94%', label: 'AI 매칭 정확도' },
  { n: '03', value: '2.3배', label: '기존 채널 대비 판매 전환율' },
  { n: '04', value: '87%', label: '판매 완료 재고 회수율' },
];

const tools = [
  {
    n: '01',
    title: '셀러 대시보드',
    desc: '재고와 매칭 현황을 한눈에, 조용히 확인합니다.',
    icon: 'grid' as const,
  },
  {
    n: '02',
    title: 'AI 프라이싱',
    desc: '실거래 데이터로 적정가를 제안합니다. 과장 없이.',
    icon: 'tag' as const,
  },
  {
    n: '03',
    title: '매칭 API',
    desc: '여러 채널에 재고를 자연스럽게 연결합니다.',
    icon: 'link' as const,
  },
  {
    n: '04',
    title: '정산 자동화',
    desc: '거래 성사 즉시, 요청 없이 정산됩니다.',
    icon: 'check' as const,
  },
];

const clients = ['CIRCLE MARKET', '루프스토어', '리씨클컴퍼니', '빈티지웍스', '그린클로짓', '셀렉트인벤토리'];

function GrainOverlay() {
  return (
    <>
      <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <filter id="sc-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" />
        </filter>
      </svg>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ filter: 'url(#sc-grain)', mixBlendMode: 'multiply' }}
      />
    </>
  );
}

function Rings() {
  return (
    <div aria-hidden="true" className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
      <span className="absolute h-full w-full rounded-full border border-[var(--line)]" />
      <span className="absolute h-[72%] w-[72%] rounded-full border border-[var(--sage)]/40 [animation:sc-breathe_7s_ease-in-out_infinite]" />
      <span className="absolute h-[44%] w-[44%] rounded-full border border-[var(--sage)]/70" />
      <span className="h-3 w-3 rounded-full bg-[var(--terracotta)]" />
    </div>
  );
}

function Eyebrow({ children, tone = 'sage' }: { children: string; tone?: 'sage' | 'ink' }) {
  return (
    <p
      className="text-xs font-medium tracking-[0.32em]"
      style={{ color: tone === 'sage' ? 'var(--sage)' : 'var(--ink-faint)' }}
    >
      {children}
    </p>
  );
}

function ToolIcon({ kind }: { kind: 'grid' | 'tag' | 'link' | 'check' }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'h-6 w-6 shrink-0 text-[var(--sage)]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (kind === 'grid') {
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="3.2" />
        <circle cx="17" cy="7" r="3.2" />
        <circle cx="7" cy="17" r="3.2" />
        <circle cx="17" cy="17" r="3.2" />
      </svg>
    );
  }
  if (kind === 'tag') {
    return (
      <svg {...common}>
        <path d="M12 4h6a2 2 0 0 1 2 2v6l-9 9-8-8z" />
        <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === 'link') {
    return (
      <svg {...common}>
        <path d="M9 15l6-6" />
        <path d="M10 6l1-1a4 4 0 0 1 6 6l-1 1" />
        <path d="M14 18l-1 1a4 4 0 0 1-6-6l1-1" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

function FormField({
  label,
  name,
  type = 'text',
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
      <label htmlFor={name} className="mb-2 block text-sm text-[var(--ink-dim)]">
        {label}
        {required && <span style={{ color: 'var(--terracotta)' }}> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage)]"
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div
      style={scVars}
      className="relative min-h-screen bg-[var(--bg)] font-sans text-[var(--ink)] selection:bg-[var(--sage-soft)] selection:text-[var(--ink)]"
    >
      <style>{`
        @keyframes sc-breathe { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.06); opacity: 1; } }
      `}</style>

      <GrainOverlay />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-md focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--bg)]"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-medium tracking-tight text-[var(--ink)]">repick</span>
            <span className="text-sm font-light tracking-wide text-[var(--ink-faint)]">/ business</span>
          </div>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-10 text-sm text-[var(--ink-dim)] md:flex">
            <a
              href="#roi"
              className="hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]"
            >
              도입 효과
            </a>
            <a
              href="#tools"
              className="hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]"
            >
              도구
            </a>
            <a
              href="#clients"
              className="hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]"
            >
              파트너
            </a>
            <a
              href="#demo"
              className="hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]"
            >
              문의
            </a>
          </nav>
          <a
            href="#demo"
            className="rounded-full border border-[var(--ink)] px-5 py-2 text-sm text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sage)]"
          >
            데모 요청
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="px-6 pb-24 pt-20 sm:pt-28 lg:px-10">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <Eyebrow>REPICK FOR BUSINESS</Eyebrow>
              <h1 className="mt-6 text-4xl font-light leading-[1.15] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">
                쌓인 재고를,
                <br />
                다시 흐르게 합니다.
              </h1>
              <p className="mt-8 max-w-md text-base leading-loose text-[var(--ink-dim)]">
                AI가 셀러의 재고를 가장 알맞은 자리로 자연스럽게 옮깁니다.
                불필요한 채널도, 과장된 숫자도 없이 — 있는 그대로, 정직하게.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#demo"
                  className="rounded-full bg-[var(--ink)] px-7 py-3.5 text-sm text-[var(--bg)] hover:bg-[var(--sage)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sage)]"
                >
                  데모 요청하기
                </a>
                <a
                  href="#roi"
                  className="text-sm text-[var(--ink-dim)] underline decoration-[var(--line)] underline-offset-4 hover:text-[var(--ink)] hover:decoration-[var(--sage)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--sage)]"
                >
                  도입 효과 보기
                </a>
              </div>
            </div>

            <div>
              <Rings />
              <p className="mt-8 text-center text-sm text-[var(--ink-faint)]">재고가 순환하는 방식</p>
              <div className="mt-6 flex flex-col">
                {steps.map((step, i) => (
                  <div key={step.n}>
                    <div className="flex items-start gap-4 py-4">
                      <span className="pt-0.5 text-xs text-[var(--ink-faint)]">{step.n}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)]">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-[var(--ink-dim)]">{step.desc}</p>
                      </div>
                    </div>
                    {i < steps.length - 1 && <div className="h-px w-full bg-[var(--line)]" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section id="roi" className="border-t border-[var(--line)] px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <Eyebrow>MEASURED</Eyebrow>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-[var(--ink)] sm:text-4xl">숫자로 보는 변화</h2>

            <div className="mt-14 grid grid-cols-2 divide-x divide-y divide-[var(--line)] border border-[var(--line)] lg:grid-cols-4 lg:divide-y-0">
              {stats.map((s) => (
                <div key={s.n} className="p-8">
                  <p className="text-xs text-[var(--ink-faint)]">{s.n}</p>
                  <p className="mt-4 text-4xl font-light tracking-tight text-[var(--sage)] tabular-nums sm:text-5xl">
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOOLS */}
        <section id="tools" className="border-t border-[var(--line)] px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <Eyebrow>TOOLS</Eyebrow>
            <h2 className="mt-4 text-3xl font-light tracking-tight text-[var(--ink)] sm:text-4xl">
              셀러를 위한 도구
            </h2>

            <div className="mt-14 flex flex-col">
              {tools.map((t, i) => (
                <div key={t.n}>
                  <div className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:gap-8">
                    <span className="text-sm text-[var(--ink-faint)] sm:w-8">{t.n}</span>
                    <ToolIcon kind={t.icon} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-medium text-[var(--ink)]">{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--ink-dim)]">{t.desc}</p>
                    </div>
                  </div>
                  {i < tools.length - 1 && <div className="h-px w-full bg-[var(--line)]" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTS */}
        <section id="clients" className="border-y border-[var(--line)] bg-[var(--bg-band)] px-6 py-16 lg:px-10">
          <div className="mx-auto max-w-6xl text-center">
            <Eyebrow tone="ink">함께하는 파트너</Eyebrow>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5 text-sm tracking-[0.1em] text-[var(--ink-dim)]">
              {clients.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO FORM */}
        <section id="demo" className="px-6 py-24 lg:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-3xl border border-[var(--line)] bg-[var(--card)] p-8 sm:p-12">
              <Eyebrow>INQUIRY</Eyebrow>
              <h2 className="mt-4 text-3xl font-light tracking-tight text-[var(--ink)] sm:text-4xl">
                도입을 원하시나요
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
                영업일 기준 1일 이내, 담당자가 직접 연락드립니다.
              </p>

              <form className="mt-10 grid gap-6" action="#" method="post">
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField label="회사명" name="company" placeholder="주식회사 리픽" required />
                  <FormField label="담당자명" name="name" placeholder="홍길동" required />
                </div>
                <FormField label="이메일" name="email" type="email" placeholder="you@company.com" required />
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm text-[var(--ink-dim)]">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="현재 취급 재고 규모, 판매 채널, 궁금하신 점을 남겨주세요."
                    className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:border-[var(--sage)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage)]"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 rounded-full bg-[var(--ink)] px-7 py-3.5 text-sm text-[var(--bg)] hover:bg-[var(--sage)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sage)]"
                >
                  요청 제출하기
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-6 py-10 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-xs text-[var(--ink-faint)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 repick business</span>
          <span>조용히, 그러나 꾸준히 순환합니다.</span>
        </div>
      </footer>
    </div>
  );
}
