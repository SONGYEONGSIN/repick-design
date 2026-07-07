import type { CSSProperties } from 'react';

const lxVars = {
  '--bg': 'oklch(9% 0.012 55)',
  '--panel': 'oklch(13% 0.016 55)',
  '--gold': 'oklch(80% 0.12 85)',
  '--gold-soft': 'oklch(80% 0.12 85 / 0.55)',
  '--gold-dim': 'oklch(55% 0.055 85)',
  '--hairline': 'oklch(80% 0.12 85 / 0.22)',
  '--ink': 'oklch(96% 0.008 60)',
  '--ink-dim': 'oklch(68% 0.02 60)',
} as CSSProperties;

const stats = [
  { value: '41%', label: '평균 재고 회전일수 단축', suffix: '↓' },
  { value: '96%', label: 'AI 매칭 성사율', suffix: '' },
  { value: '+18%', label: '평균 판매가 상승폭', suffix: '' },
  { value: '128억', label: '누적 거래 처리액 (원)', suffix: '' },
];

const solutions = [
  {
    num: 'I',
    title: '프라이빗 딜러 대시보드',
    desc: '재고·매칭·정산 현황을 단일 화면에서 실시간으로 조망합니다. 필요한 숫자만, 필요한 순간에.',
  },
  {
    num: 'II',
    title: 'AI 프라이싱 어드바이저',
    desc: '실거래 시세와 수요 흐름을 학습해 가장 유리한 판매가를 매 순간 제안합니다.',
  },
  {
    num: 'III',
    title: '선별 매칭 네트워크',
    desc: '검증된 구매 채널에만 재고를 선별 노출해 성사 확률과 브랜드 가치를 함께 지킵니다.',
  },
  {
    num: 'IV',
    title: '전담 어카운트 매니저',
    desc: '온보딩부터 정산까지, 파트너십의 모든 여정에 담당자가 밀착합니다.',
  },
];

const partners = [
  '루프스토어',
  '리씨클컴퍼니',
  '빈티지웍스',
  '그린클로짓',
  '셀렉트인벤토리',
  'CIRCLE MARKET',
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[var(--gold)]">
      {children}
    </p>
  );
}

function GoldRule({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`h-px w-full bg-[var(--hairline)] ${className}`} />;
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
      <label
        htmlFor={name}
        className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-dim)]"
      >
        {label}
        {required && <span className="text-[var(--gold)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-none border-0 border-b border-white/15 bg-transparent px-0 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-dim)]/60 focus:border-[var(--gold)] focus:outline-none focus-visible:ring-0"
      />
    </div>
  );
}

export default function Landing() {
  return (
    <div
      style={lxVars}
      className="relative min-h-screen bg-[var(--bg)] font-sans text-[var(--ink)] selection:bg-[var(--gold)] selection:text-[var(--bg)]"
    >
      {/* soft radial glow, purely decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 50% -10%, oklch(80% 0.12 85 / 0.10), transparent 60%), radial-gradient(ellipse 50% 35% at 100% 100%, oklch(80% 0.12 85 / 0.06), transparent 60%)',
        }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:border focus:border-[var(--gold)] focus:bg-[var(--bg)] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:uppercase focus:tracking-[0.3em] focus:text-[var(--gold)]"
      >
        본문 바로가기
      </a>

      <header className="sticky top-0 z-40 border-b border-[var(--hairline)] bg-[var(--bg)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold tracking-wide text-[var(--ink)]">
              Repick
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[var(--gold-dim)]">
              Business
            </span>
          </div>
          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-8 text-[11px] uppercase tracking-[0.25em] text-[var(--ink-dim)] md:flex"
          >
            <a
              href="#roi"
              className="hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
            >
              도입 효과
            </a>
            <a
              href="#solution"
              className="hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
            >
              솔루션
            </a>
            <a
              href="#clients"
              className="hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
            >
              파트너사
            </a>
            <a
              href="#consult"
              className="hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]"
            >
              상담 문의
            </a>
          </nav>
          <a
            href="#consult"
            className="border border-[var(--gold)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          >
            상담 예약
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="border-b border-[var(--hairline)] px-6 pb-24 pt-20 sm:pb-28 sm:pt-28 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow>Repick for Business — Private Enterprise Program</Eyebrow>
            <h1 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">
              잠든 재고를,
              <br />
              <span className="text-[var(--gold)]">자산</span>으로 되돌리는 방법
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[var(--ink-dim)] sm:text-lg">
              AI가 수만 건의 거래 데이터를 분석해 가장 높은 확률로 팔리는 채널과 가격을
              설계합니다. 리픽 비즈니스는 셀러와 기업의 재고 회전을 프리미엄 파트너십으로
              지원합니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#consult"
                className="bg-[var(--gold)] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--bg)] hover:bg-transparent hover:text-[var(--gold)] hover:outline hover:outline-1 hover:outline-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                상담 예약하기
              </a>
              <a
                href="#roi"
                className="border border-[var(--gold-dim)] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                도입 효과 보기
              </a>
            </div>
          </div>
        </section>

        {/* ROI */}
        <section id="roi" className="border-b border-[var(--hairline)] px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <Eyebrow>Measured Performance</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
                숫자가 증명하는 파트너십의 가치
              </h2>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-y-12 sm:grid-cols-4 sm:gap-y-0">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-4 text-center ${
                    i > 0 ? 'sm:border-l sm:border-[var(--hairline)]' : ''
                  }`}
                >
                  <p className="font-serif text-4xl font-semibold text-[var(--gold)] sm:text-5xl">
                    {s.value}
                    <span className="ml-0.5 text-2xl">{s.suffix}</span>
                  </p>
                  <p className="mx-auto mt-3 max-w-[10rem] text-sm leading-snug text-[var(--ink-dim)]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTIONS */}
        <section id="solution" className="border-b border-[var(--hairline)] px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Eyebrow>Tailored Solutions</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
                셀러를 위한 프리미엄 솔루션
              </h2>
            </div>

            <div className="mt-16">
              <GoldRule />
              {solutions.map((s) => (
                <div key={s.num} className="grid grid-cols-[3rem_1fr] gap-6 py-8 sm:grid-cols-[4rem_1fr]">
                  <span className="font-serif text-2xl italic text-[var(--gold)]">{s.num}</span>
                  <div>
                    <h3 className="font-serif text-xl font-semibold text-[var(--ink)]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--ink-dim)]">{s.desc}</p>
                  </div>
                  <div className="col-span-2">
                    <GoldRule />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLIENTS */}
        <section id="clients" className="border-b border-[var(--hairline)] px-6 py-16 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <Eyebrow>Trusted By</Eyebrow>
            <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-4 font-serif text-base tracking-wide text-[var(--ink-dim)] sm:text-lg">
              {partners.map((p, i) => (
                <span key={p} className="flex items-center gap-3">
                  {p}
                  {i < partners.length - 1 && (
                    <span aria-hidden="true" className="text-[var(--gold-dim)]">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CONSULT FORM */}
        <section id="consult" className="px-6 py-20 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-xl">
            <div className="border border-[var(--hairline)] bg-[var(--panel)] p-8 sm:p-12">
              <Eyebrow>Private Consultation</Eyebrow>
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
                상담 신청
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ink-dim)]">
                영업일 기준 1일 이내, 전담 어카운트 매니저가 직접 회신드립니다.
              </p>

              <form className="mt-10 grid gap-7" action="#" method="post">
                <div className="grid gap-7 sm:grid-cols-2">
                  <FormField label="회사명" name="company" placeholder="주식회사 리픽" required />
                  <FormField label="담당자명" name="name" placeholder="홍길동" required />
                </div>
                <FormField label="이메일" name="email" type="email" placeholder="you@company.com" required />
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--ink-dim)]"
                  >
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="현재 취급 재고 규모, 판매 채널, 궁금하신 점을 남겨주세요."
                    className="w-full resize-none rounded-none border-0 border-b border-white/15 bg-transparent px-0 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-dim)]/60 focus:border-[var(--gold)] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 bg-[var(--gold)] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--bg)] hover:bg-transparent hover:text-[var(--gold)] hover:outline hover:outline-1 hover:outline-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                >
                  상담 신청하기
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--hairline)] px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center text-[11px] uppercase tracking-[0.25em] text-[var(--ink-dim)] sm:flex-row sm:justify-between">
          <span>Repick Business © 2026</span>
          <span>Private Enterprise Program — By Invitation &amp; Application</span>
        </div>
      </footer>
    </div>
  );
}
