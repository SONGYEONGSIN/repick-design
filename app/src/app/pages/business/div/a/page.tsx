import type { CSSProperties } from 'react';

const bpVars = {
  '--bg': 'oklch(24% 0.045 250)',
  '--accent': 'oklch(80% 0.14 195)',
  '--dim': 'oklch(72% 0.035 250)',
} as CSSProperties;

const steps = [
  {
    id: 'A',
    title: '입고 재고 등록',
    desc: '셀러 대시보드에서 재고 정보 일괄 업로드',
    metric: 'AVG 0.5 DAY',
  },
  {
    id: 'B',
    title: 'AI 분석 · 프라이싱',
    desc: '시세·상태·수요 데이터로 최적가 산출',
    metric: 'AVG 1.2 DAY',
  },
  {
    id: 'C',
    title: '채널 매칭',
    desc: '판매 확률이 가장 높은 채널에 자동 노출',
    metric: 'AVG 0.4 DAY',
  },
  {
    id: 'D',
    title: '판매 완료 · 정산',
    desc: '거래 성사 즉시 정산 데이터 생성',
    metric: 'AVG 0.3 DAY',
  },
];

const stats = [
  { code: 'RES-01', value: '-42%', label: '평균 재고 보유 기간 단축' },
  { code: 'RES-02', value: '94.2%', label: 'AI 매칭 정확도 (판매 성사율 기준)' },
  { code: 'RES-03', value: '×2.3', label: '기존 채널 대비 판매 전환율' },
  { code: 'RES-04', value: '87%', label: '입고 대비 판매 완료 재고 회수율' },
];

const tools = [
  {
    part: 'TL-01',
    title: '셀러 대시보드',
    desc: '재고·매칭·정산 현황을 한 화면에서 실시간으로 추적합니다.',
    glyph: 'grid' as const,
  },
  {
    part: 'TL-02',
    title: 'AI 프라이싱 엔진',
    desc: '실거래 시세 데이터를 기반으로 최적 판매가를 자동 산출합니다.',
    glyph: 'chart' as const,
  },
  {
    part: 'TL-03',
    title: '매칭 API',
    desc: '외부 판매 채널에 재고를 자동 연동해 노출을 확장합니다.',
    glyph: 'node' as const,
  },
  {
    part: 'TL-04',
    title: '정산 자동화',
    desc: '거래 성사 즉시 정산 데이터를 생성해 회계 처리를 단축합니다.',
    glyph: 'doc' as const,
  },
];

const clients = [
  'CIRCLE MARKET',
  '루프스토어',
  '리씨클컴퍼니',
  '빈티지웍스',
  '그린클로짓',
  '셀렉트인벤토리',
];

function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-[var(--accent)]" />
      <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-[var(--accent)]" />
      <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-[var(--accent)]" />
      <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-[var(--accent)]" />
    </>
  );
}

function DimLine({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[var(--dim)]">
      <span className="h-2 w-px bg-[var(--dim)]" />
      <span className="h-px flex-1 bg-white/15" />
      {label && <span className="shrink-0 px-1 whitespace-nowrap">{label}</span>}
      <span className="h-px flex-1 bg-white/15" />
      <span className="h-2 w-px bg-[var(--dim)]" />
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  tag,
}: {
  eyebrow: string;
  title: string;
  tag: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.25em] text-[var(--dim)]">
        <span className="text-[var(--accent)]">{eyebrow}</span>
        <span>{tag}</span>
      </div>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
    </div>
  );
}

function ToolGlyph({ kind }: { kind: 'grid' | 'chart' | 'node' | 'doc' }) {
  const common = {
    viewBox: '0 0 24 24',
    className: 'h-7 w-7 shrink-0 text-[var(--accent)]',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true,
  } as const;

  if (kind === 'grid') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="8" height="8" />
        <rect x="13" y="3" width="8" height="8" />
        <rect x="3" y="13" width="8" height="8" />
        <rect x="13" y="13" width="8" height="8" />
      </svg>
    );
  }
  if (kind === 'chart') {
    return (
      <svg {...common}>
        <polyline points="3,17 9,10 13,14 21,4" />
        <polyline points="15,4 21,4 21,10" />
      </svg>
    );
  }
  if (kind === 'node') {
    return (
      <svg {...common}>
        <circle cx="5" cy="5" r="2.5" />
        <circle cx="19" cy="5" r="2.5" />
        <circle cx="12" cy="19" r="2.5" />
        <line x1="7" y1="6" x2="17" y2="6" />
        <line x1="6" y1="7" x2="11" y2="17" />
        <line x1="18" y1="7" x2="13" y2="17" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M6 2h9l3 3v17H6z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
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
      <label htmlFor={name} className="mb-2 block font-mono text-xs tracking-widest text-[var(--dim)]">
        {label}
        {required && <span className="text-[var(--accent)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-[var(--dim)]/70 focus:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div
      style={bpVars}
      className="relative min-h-screen bg-[var(--bg)] font-sans text-white selection:bg-[var(--accent)] selection:text-[oklch(15%_0.04_250)]"
    >
      <style>{`
        @keyframes bp-scan { 0% { transform: translateY(-120%); } 100% { transform: translateY(220%); } }
        @keyframes bp-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      `}</style>

      {/* blueprint grid background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          backgroundColor: 'var(--bg)',
          backgroundImage:
            'linear-gradient(oklch(94% 0.02 250 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(94% 0.02 250 / 0.05) 1px, transparent 1px), linear-gradient(oklch(94% 0.02 250 / 0.12) 1px, transparent 1px), linear-gradient(90deg, oklch(94% 0.02 250 / 0.12) 1px, transparent 1px)',
          backgroundSize: '20px 20px, 20px 20px, 100px 100px, 100px 100px',
          backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
        }}
      />

      {/* margin annotations (decorative, large viewports only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[10px] tracking-[0.4em] text-[var(--dim)]/60 lg:block"
      >
        SCALE 1:1 — REPICK BUSINESS — CONFIDENTIAL — DWG RP-B2B-001
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 rotate-90 whitespace-nowrap font-mono text-[10px] tracking-[0.4em] text-[var(--dim)]/60 lg:block"
      >
        REV. A · 2026-07 — MATCHING ENGINE SCHEMATIC
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-[var(--accent)] focus:bg-[var(--bg)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:tracking-widest focus:text-[var(--accent)]"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-40 border-b border-white/15 bg-[var(--bg)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center border border-[var(--accent)] font-mono text-[10px] font-bold text-[var(--accent)]">
              R
            </span>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-white">
              REPICK <span className="text-[var(--dim)]">/ BUSINESS</span>
            </span>
          </div>
          <nav aria-label="주요 메뉴" className="hidden items-center gap-6 font-mono text-xs tracking-widest text-[var(--dim)] md:flex">
            <a
              href="#roi"
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              01. 도입효과
            </a>
            <a
              href="#tools"
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              02. 도구
            </a>
            <a
              href="#clients"
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              03. 레퍼런스
            </a>
            <a
              href="#demo"
              className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
            >
              04. 문의
            </a>
          </nav>
          <a
            href="#demo"
            className="border border-[var(--accent)] px-3 py-1.5 font-mono text-xs font-bold tracking-widest text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[oklch(15%_0.04_250)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            데모 요청 →
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/15 px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] tracking-[0.25em] text-[var(--dim)]">
              <span>DWG NO. RP-B2B-001</span>
              <span>SCALE NTS</span>
              <span>REV. A · 2026</span>
              <span className="text-[var(--accent)]">
                STATUS: LIVE<span className="animate-[bp-blink_1s_step-start_infinite]">_</span>
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-4 font-mono text-xs font-bold tracking-[0.3em] text-[var(--accent)]">
                  REPICK FOR BUSINESS
                </p>
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  재고 순환을,
                  <br />
                  설계도처럼 정밀하게.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--dim)] sm:text-lg">
                  AI 매칭 엔진이 셀러의 재고를 가장 높은 확률로 팔리는 채널과 가격에 연결합니다.
                  도면 위에 치수를 재듯, 정확한 숫자로 판매를 설계하세요.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#demo"
                    className="border border-[var(--accent)] bg-[var(--accent)] px-5 py-3 font-mono text-sm font-bold tracking-widest text-[oklch(15%_0.04_250)] hover:bg-transparent hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    데모 요청하기 →
                  </a>
                  <a
                    href="#roi"
                    className="border border-white/25 px-5 py-3 font-mono text-sm font-bold tracking-widest text-white hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    도입 효과 보기
                  </a>
                </div>
              </div>

              <div className="relative border border-white/25 p-5 sm:p-6">
                <CornerMarks />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent animate-[bp-scan_7s_linear_infinite]" />
                </div>
                <p className="mb-5 font-mono text-[10px] tracking-[0.25em] text-[var(--dim)]">
                  FIG. 1 — 매칭 판매 프로세스
                </p>
                <div className="flex flex-col">
                  {steps.map((step, i) => (
                    <div key={step.id}>
                      <div className="flex items-center gap-4">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-[var(--accent)] font-mono text-xs font-bold text-[var(--accent)]">
                          {step.id}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-mono text-sm font-bold tracking-wide text-white">{step.title}</p>
                          <p className="text-xs text-[var(--dim)]">{step.desc}</p>
                        </div>
                        <span className="hidden shrink-0 font-mono text-[10px] text-[var(--dim)] sm:block">
                          {step.metric}
                        </span>
                      </div>
                      {i < steps.length - 1 && (
                        <div className="ml-[18px] flex h-6 items-center">
                          <span className="h-full w-px bg-white/20" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI / SPEC SHEET */}
        <section id="roi" className="relative border-b border-white/15 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="MEASURED RESULTS" title="숫자로 증명하는 재고 회전" tag="SPEC-SHEET / 02" />
            <div className="mt-10 grid gap-px overflow-hidden border border-white/25 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.code} className="relative bg-[var(--bg)] p-6">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">{s.code}</p>
                  <p className="mt-3 font-mono text-4xl font-black text-[var(--accent)]">{s.value}</p>
                  <p className="mt-2 text-sm text-[var(--dim)]">{s.label}</p>
                  <div className="mt-4">
                    <DimLine />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TOOLS */}
        <section id="tools" className="relative border-b border-white/15 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionHeading eyebrow="TOOLING" title="판매를 자동화하는 부품들" tag="ASSEMBLY / 03" />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {tools.map((t) => (
                <div key={t.part} className="relative border border-white/25 p-6">
                  <CornerMarks />
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--dim)]">PART NO. {t.part}</p>
                    <ToolGlyph kind={t.glyph} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight text-white">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--dim)]">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTS */}
        <section id="clients" className="relative border-b border-white/15 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <DimLine label="REFERENCE · 도입 기업 (일부)" />
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 font-mono text-sm tracking-[0.15em] text-[var(--dim)] sm:justify-between">
              {clients.map((c, i) => (
                <span key={c} className={i === clients.length - 1 ? 'hidden sm:inline' : undefined}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* DEMO FORM */}
        <section id="demo" className="relative px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="relative border border-white/25 p-6 sm:p-10">
              <CornerMarks />
              <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent)]">
                REQUEST FORM — DEMO ACCESS
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">도입 상담 신청</h2>
              <p className="mt-3 text-sm text-[var(--dim)]">
                영업일 기준 1일 이내, 담당 엔지니어가 회신드립니다.
              </p>

              <form className="mt-8 grid gap-5" action="#" method="post">
                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField label="회사명" name="company" placeholder="주식회사 리픽" required />
                  <FormField label="담당자명" name="name" placeholder="홍길동" required />
                </div>
                <FormField label="이메일" name="email" type="email" placeholder="you@company.com" required />
                <div>
                  <label htmlFor="message" className="mb-2 block font-mono text-xs tracking-widest text-[var(--dim)]">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="현재 취급 재고 규모, 판매 채널, 궁금하신 점을 남겨주세요."
                    className="w-full resize-none border border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder:text-[var(--dim)]/70 focus:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 font-mono text-sm font-bold tracking-widest text-[oklch(15%_0.04_250)] hover:bg-transparent hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  요청 제출 →
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/15 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 font-mono text-[10px] tracking-[0.2em] text-[var(--dim)] sm:flex-row sm:items-center sm:justify-between">
          <span>REPICK BUSINESS © 2026</span>
          <span>DWG NO. RP-B2B-001 · REV. A · ALL SPECIFICATIONS SUBJECT TO CHANGE</span>
        </div>
      </footer>
    </div>
  );
}
